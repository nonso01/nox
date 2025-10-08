/// MY CUSTOM RUST SERVER: NOX_SERVER
/// Process will be documented as needed.
use std::{
    collections::{HashMap, HashSet},
    env, fmt, fs,
    io::{prelude::*, BufReader},
    net::{TcpListener, TcpStream},
    path::{Path, PathBuf},
    sync::{mpsc, Arc, Mutex},
    thread,
    time::Duration,
};

use regex::Regex;

use nox::nox_server::{
    contains_potential_xss, cyan, generate_email_html, get_mime_type, green, html_escape,
    is_safe_path, parse_form_data, parse_multipart_data, red, sanitize_email_content,
    sanitize_path, send_email, send_html_email, yellow, HttpResponse, RateLimiter,
    FIELD_CONSTRAINTS, MAX_CONTENT_LENGTH, MAX_FORM_DATA_LENGTH, OPTIONAL_CHECKBOX,
};

// 1 hour = 60 min
const WINDOW_LIMIT_MINS: u64 = 60;

// Connection and Rate Limiting Configurations
#[derive(Clone)]
#[allow(dead_code)]
struct SecurityConfig {
    max_content_length: usize,
    max_connections: usize,
    connection_timeout: Duration,
    max_requests_per_hour: usize,
    enable_rate_limiting: bool,
}

impl SecurityConfig {
    fn new() -> Self {
        SecurityConfig {
            max_content_length: MAX_CONTENT_LENGTH, // 50KB instead of 10KB
            max_connections: 100,
            connection_timeout: Duration::from_secs(30),
            max_requests_per_hour: 100, // 100 requests per hour per IP
            enable_rate_limiting: true,
        }
    }
}

// Add after SecurityConfig implementation, before ServerError
enum Route {
    Static,
    ContactForm,
    ApiStatus,
    ApiHealth,
    NotFound,
}

fn match_route(method: &str, path: &str) -> Route {
    match (method, path) {
        ("POST", "/contact") | ("POST", "/api/contact") => Route::ContactForm,
        ("GET", "/api/status") => Route::ApiStatus,
        ("GET", "/api/health") => Route::ApiHealth,
        ("GET", path) if path.starts_with("/api/") => Route::NotFound,
        ("GET", "/") => Route::Static, // revert to _ in case of err
        _ => Route::NotFound,
    }
}

// Custom error types for better error handling
#[derive(Debug)]
pub enum ServerError {
    IoError(std::io::Error),
    ParseError(String),
    ValidationError(String),
    EmailError(Box<dyn std::error::Error>),
    ThreadPoolError(String),
    NetworkError(String),
}

impl fmt::Display for ServerError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ServerError::IoError(e) => write!(f, "IO error: {}", e),
            ServerError::ParseError(msg) => write!(f, "Parse error: {}", msg),
            ServerError::ValidationError(msg) => write!(f, "Validation error: {}", msg),
            ServerError::EmailError(e) => write!(f, "Email error: {}", e),
            ServerError::ThreadPoolError(msg) => write!(f, "Thread pool error: {}", msg),
            ServerError::NetworkError(msg) => write!(f, "Network error: {}", msg),
        }
    }
}

impl std::error::Error for ServerError {}

impl From<std::io::Error> for ServerError {
    fn from(error: std::io::Error) -> Self {
        ServerError::IoError(error)
    }
}

impl From<Box<dyn std::error::Error>> for ServerError {
    fn from(error: Box<dyn std::error::Error>) -> Self {
        ServerError::EmailError(error)
    }
}

// Result type alias for convenience
type ServerResult<T> = Result<T, ServerError>;

// CORS Configuration
#[derive(Clone)]
struct CorsConfig {
    allow_origins: Vec<String>,
    allow_all_origins: bool,
    allow_methods: Vec<String>,
    allow_headers: Vec<String>,
    max_age: u32,
}

impl CorsConfig {
    fn new() -> Self {
        // Check environment for CORS mode
        let cors_mode = env::var("CORS_MODE").unwrap_or_else(|_| "same-origin".to_string());

        match cors_mode.as_str() {
            "cross-origin" => Self::cross_origin_config(),
            "same-origin" => Self::same_origin_config(),
            _ => Self::same_origin_config(),
        }
    }

    // Configuration for cross-origin requests (different domains/hosts)
    fn cross_origin_config() -> Self {
        CorsConfig {
            allow_origins: vec![
                "http://localhost:5173".to_string(),      // React dev server
                "https://nox-dev.vercel.app".to_string(), // Production frontend
            ],
            allow_all_origins: false, // Set to true for development only
            allow_methods: vec![
                "GET".to_string(),
                "POST".to_string(),
                "OPTIONS".to_string(), // Keep OPTIONS for preflight requests
            ],
            allow_headers: vec![
                "Content-Type".to_string(),
                "Authorization".to_string(),
                "X-Requested-With".to_string(),
                "Accept".to_string(),
                "Origin".to_string(),
            ],
            max_age: 86400, // 24 hours
        }
    }

    // Configuration for same-origin requests (same domain/host)
    fn same_origin_config() -> Self {
        CorsConfig {
            allow_origins: vec![], // Same origin doesn't need explicit origins
            allow_all_origins: false,
            allow_methods: vec![
                "GET".to_string(),
                "POST".to_string(),
                "OPTIONS".to_string(), // Keep OPTIONS for preflight requests
            ],
            allow_headers: vec!["Content-Type".to_string(), "Accept".to_string()],
            max_age: 3600, // 1 hour
        }
    }

    // Check if a method is allowed
    fn is_method_allowed(&self, method: &str) -> bool {
        self.allow_methods.contains(&method.to_uppercase())
    }

    fn is_origin_allowed(&self, origin: &str) -> bool {
        if self.allow_all_origins {
            return true;
        }

        if self.allow_origins.is_empty() {
            return true; // Same-origin mode
        }

        self.allow_origins.contains(&origin.to_string())
    }
}
#[allow(dead_code)]
// ThreadPool to include rate limiter and security config
struct ThreadPool {
    workers: Vec<Worker>,
    sender: Option<mpsc::Sender<TcpStream>>,
    cors_config: CorsConfig,
    rate_limiter: Arc<RateLimiter>,
    security_config: SecurityConfig,
}

struct Worker {
    id: usize,
    thread: Option<thread::JoinHandle<()>>,
}

impl ThreadPool {
    fn new(
        size: usize,
        cors_config: CorsConfig,
        security_config: SecurityConfig,
    ) -> ServerResult<ThreadPool> {
        if size == 0 {
            return Err(ServerError::ThreadPoolError(
                "Thread pool size cannot be zero".to_string(),
            ));
        }

        let (sender, receiver) = mpsc::channel();
        let receiver = Arc::new(Mutex::new(receiver));
        let mut workers = Vec::with_capacity(size);

        //  Rate limiter
        let rate_limiter = Arc::new(RateLimiter::new(
            security_config.max_requests_per_hour,
            WINDOW_LIMIT_MINS, // 1 hour window
        ));

        for id in 0..size {
            match Worker::new(
                id,
                Arc::clone(&receiver),
                cors_config.clone(),
                Arc::clone(&rate_limiter),
                security_config.clone(),
            ) {
                Ok(worker) => workers.push(worker),
                Err(e) => {
                    return Err(ServerError::ThreadPoolError(format!(
                        "Failed to create worker {}: {}",
                        id, e
                    )));
                }
            }
        }

        Ok(ThreadPool {
            workers,
            sender: Some(sender),
            cors_config,
            rate_limiter,
            security_config,
        })
    }

    fn execute(&self, stream: TcpStream) -> ServerResult<()> {
        // Set socket timeout
        if let Err(e) = stream.set_read_timeout(Some(self.security_config.connection_timeout)) {
            eprintln!("Warning: Could not set socket timeout: {}", e);
        }

        if let Some(sender) = &self.sender {
            sender
                .send(stream)
                .map_err(|e| ServerError::ThreadPoolError(format!("Failed to send task: {}", e)))?;
        }
        Ok(())
    }
}

impl Drop for ThreadPool {
    fn drop(&mut self) {
        drop(self.sender.take());

        for worker in &mut self.workers {
            println!("Shutting down worker {}", worker.id);

            if let Some(thread) = worker.thread.take() {
                thread.join().unwrap_or_else(|_| {
                    eprintln!("Worker {} failed to join", worker.id);
                });
            }
        }
    }
}

impl Worker {
    fn new(
        id: usize,
        receiver: Arc<Mutex<mpsc::Receiver<TcpStream>>>,
        cors_config: CorsConfig,
        rate_limiter: Arc<RateLimiter>,
        security_config: SecurityConfig,
    ) -> ServerResult<Worker> {
        let thread = thread::spawn(move || loop {
            let stream = {
                let receiver_guard = receiver.lock().unwrap();
                receiver_guard.recv()
            };

            match stream {
                Ok(stream) => {
                    if let Err(e) = handle_connection_safe(
                        stream,
                        &cors_config,
                        &*rate_limiter,
                        &security_config,
                    ) {
                        eprintln!("Worker {} encountered error: {}", id, e);
                    }
                }
                Err(_) => {
                    println!("Worker {} shutting down", id);
                    break;
                }
            }
        });

        Ok(Worker {
            id,
            thread: Some(thread),
        })
    }
}

// Add these route handler functions before main()
fn handle_api_status(
    stream: &mut TcpStream,
    cors_config: &CorsConfig,
    origin: Option<&str>,
) -> ServerResult<()> {
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();

    let json_response = format!(
        r#"{{"status":"healthy","version":"1.0.0","timestamp":{:?}}}"#,
        timestamp
    );

    let origin_header = get_cors_origin_header(cors_config, origin);

    HttpResponse::ok()
        .json(&json_response)
        .send(stream, &origin_header)
        .map_err(|e| ServerError::IoError(e))
}

fn handle_api_health(
    stream: &mut TcpStream,
    cors_config: &CorsConfig,
    origin: Option<&str>,
) -> ServerResult<()> {
    let origin_header = get_cors_origin_header(cors_config, origin);

    HttpResponse::ok()
        .text("OK")
        .send(stream, &origin_header)
        .map_err(|e| ServerError::IoError(e))
}

fn main() -> ServerResult<()> {
    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let host = env::var("HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let addr = format!("{}:{}", host, port);

    // Initialize security configuration
    let security_config = SecurityConfig::new();
    let cors_config = CorsConfig::new();
    let cors_mode = env::var("CORS_MODE").unwrap_or_else(|_| "same-origin".to_string());

    let dist_exists = Path::new("../dist").exists();

    let listener = TcpListener::bind(&addr).map_err(|e| {
        eprintln!("Failed to bind to address {}: {}", addr, e);
        ServerError::IoError(e)
    })?;

    println!(
        "{}",
        green(&format!("🦀 Server running on http://{}", &addr), false)
    );

    println!(
        "{}",
        green(
            &format!(
                "🦍 Security enabled - Max content: {}KB, Timeout: {}s",
                security_config.max_content_length / 1024,
                security_config.connection_timeout.as_secs()
            ),
            false
        )
    );

    println!("{}", green(&format!("🐊 CORS Mode: {}", cors_mode), false));

    println!(
        "{}",
        cyan(
            &format!(
                "🦥 Rate limiting: {} requests/hour per IP",
                security_config.max_requests_per_hour
            ),
            true
        )
    );

    if dist_exists {
        println!("{}", green("✨ Serving static files from ../dist/", false));
    } else {
        println!(
            "{}",
            yellow("⚠️  Warning: ../dist/ folder not found!", false)
        );
        println!(
            "{}",
            yellow(
                "📜 Serving hello.html from current directory as fallback",
                false
            )
        );
    }

    //thread pool with security config
    let pool = ThreadPool::new(4, cors_config, security_config)?;

    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                if let Err(e) = pool.execute(stream) {
                    eprintln!("Failed to execute task: {}", e);
                }
            }
            Err(e) => {
                eprintln!("Connection failed: {}", e);
            }
        }
    }

    Ok(())
}

fn handle_connection_safe(
    stream: TcpStream,
    cors_config: &CorsConfig,
    rate_limiter: &RateLimiter,
    security_config: &SecurityConfig,
) -> ServerResult<()> {
    let mut stream = stream;

    // Get client IP for rate limiting
    let client_ip = stream
        .peer_addr()
        .map(|addr| addr.ip().to_string())
        .unwrap_or_else(|_| "unknown".to_string());

    // Check rate limiting FIRST
    if security_config.enable_rate_limiting && !rate_limiter.is_allowed(&client_ip) {
        println!(
            "{}",
            red(
                &format!("⛔️ Rate limit exceeded for IP: {}", client_ip),
                false
            )
        );
        send_error_response_with_cors(
            &mut stream,
            "429 Too Many Requests",
            "Rate limit exceeded. Please try again later.",
            cors_config,
            None,
        )?;
        return Ok(());
    }

    let mut buf_reader = BufReader::new(&mut stream);
    let mut request_line = String::new();

    // Add timeout for reading request line
    match buf_reader.read_line(&mut request_line) {
        Ok(0) => {
            return Err(ServerError::NetworkError(
                "Connection closed by client".to_string(),
            ))
        }
        Ok(_) => {}
        Err(e) => return Err(ServerError::IoError(e)),
    }

    if request_line.trim().is_empty() {
        return Err(ServerError::NetworkError("Empty request line".to_string()));
    }

    // Limit request line length to prevent DoS
    // Make it a constant
    if request_line.len() > 8192 {
        // 8KB max request line
        send_error_response_with_cors(
            &mut stream,
            "414 Request-URI Too Long",
            "Request line too long",
            cors_config,
            None,
        )?;
        return Ok(());
    }

    // Read headers with security limits
    let (content_length, origin) = parse_headers_secure(&mut buf_reader, security_config)?;

    let parts: Vec<&str> = request_line.split_whitespace().collect();
    if parts.len() < 2 {
        send_error_response_with_cors(
            &mut stream,
            "400 Bad Request",
            "Invalid request line",
            cors_config,
            None,
        )?;
        return Ok(());
    }

    let method = parts[0];
    let path = parts[1];

    println!(
        "📥 {} {} from {} (Content: {}KB)",
        method,
        path,
        client_ip,
        content_length / 1024
    );

    // Check if method is allowed
    if !cors_config.is_method_allowed(method) {
        println!("🚫 Method {} not allowed for {}", method, client_ip);
        send_error_response_with_cors(
            &mut stream,
            "405 Method Not Allowed",
            "Method not allowed",
            cors_config,
            origin.as_deref(),
        )?;
        return Ok(());
    }

    // Handle OPTIONS first (preflight)
    if method == "OPTIONS" {
        return handle_preflight_request(&mut stream, cors_config, origin.as_deref());
    }

    // Route matching
    let route = match_route(method, path);

    // Add your routes and make sure it's
    //  available in enum Route
    match route {
        Route::ContactForm => handle_post_request_secure(
            buf_reader,
            content_length,
            cors_config,
            origin.as_deref(),
            security_config,
            &client_ip,
        ),
        Route::ApiStatus => handle_api_status(&mut stream, cors_config, origin.as_deref()),
        Route::ApiHealth => handle_api_health(&mut stream, cors_config, origin.as_deref()),
        Route::Static => {
            serve_static_file_with_cors(&mut stream, path, cors_config, origin.as_deref())
        }
        Route::NotFound => {
            let origin_header = get_cors_origin_header(cors_config, origin.as_deref());
            HttpResponse::not_found()
                .send(&mut stream, &origin_header)
                .map_err(|e| ServerError::IoError(e))
        }
    }
}

// Secure header parsing with limits
fn parse_headers_secure(
    buf_reader: &mut BufReader<&mut TcpStream>,
    security_config: &SecurityConfig,
) -> ServerResult<(usize, Option<String>)> {
    let mut content_length = 0;
    let mut origin = None;
    let mut line = String::new();
    let mut header_count = 0;
    let max_headers = 50; // Limit number of headers

    loop {
        line.clear();
        buf_reader.read_line(&mut line)?;

        if line.trim().is_empty() {
            break;
        }

        header_count += 1;
        if header_count > max_headers {
            return Err(ServerError::ParseError("Too many headers".to_string()));
        }

        // Limit header line length
        if line.len() > 8192 {
            return Err(ServerError::ParseError("Header line too long".to_string()));
        }

        let line_lower = line.to_lowercase();
        if line_lower.starts_with("content-length:") {
            if let Some(length_str) = line.split(": ").nth(1) {
                content_length = length_str
                    .trim()
                    .parse()
                    .map_err(|_| ServerError::ParseError("Invalid content-length".to_string()))?;

                // CRITICAL: Check content length against security limits
                if content_length > security_config.max_content_length {
                    return Err(ServerError::ValidationError(format!(
                        "Content length {} exceeds maximum allowed {}",
                        content_length, security_config.max_content_length
                    )));
                }
            }
        } else if line_lower.starts_with("origin:") {
            if let Some(origin_str) = line.split(": ").nth(1) {
                let origin_trimmed = origin_str.trim();
                // Limit origin header length
                if origin_trimmed.len() > 200 {
                    return Err(ServerError::ParseError(
                        "Origin header too long".to_string(),
                    ));
                }
                origin = Some(origin_trimmed.to_string());
            }
        }
    }

    Ok((content_length, origin))
}

fn handle_preflight_request(
    stream: &mut TcpStream,
    cors_config: &CorsConfig,
    origin: Option<&str>,
) -> ServerResult<()> {
    let origin_header = get_cors_origin_header(cors_config, origin);

    // CRITICAL: Block unauthorized origins at preflight
    if origin_header.is_empty() && origin.is_some() {
        let response = "HTTP/1.1 403 Forbidden\r\nContent-Length: 0\r\n\r\n";
        stream.write_all(response.as_bytes())?;
        stream.flush()?;
        println!(
            "{}",
            red(
                &format!(
                    "⛔️ Blocked preflight from unauthorized origin: {:?}",
                    origin
                ),
                false
            )
        );
        return Ok(());
    }

    // Only send CORS details if origin is allowed
    let response = format!(
        "HTTP/1.1 200 OK\r\n{}\r\nAccess-Control-Allow-Methods: {}\r\nAccess-Control-Allow-Headers: {}\r\nAccess-Control-Max-Age: {}\r\nContent-Length: 0\r\n\r\n",
        origin_header,
        cors_config.allow_methods.join(", "),
        cors_config.allow_headers.join(", "),
        cors_config.max_age
    );

    stream.write_all(response.as_bytes())?;
    stream.flush()?;
    println!(" Sent preflight response for origin: {:?}", origin);
    Ok(())
}

fn get_cors_origin_header(cors_config: &CorsConfig, origin: Option<&str>) -> String {
    match origin {
        Some(origin_value) => {
            if cors_config.is_origin_allowed(origin_value) {
                if cors_config.allow_all_origins {
                    "Access-Control-Allow-Origin: *".to_string()
                } else {
                    format!(
                        "Access-Control-Allow-Origin: {}\r\nAccess-Control-Allow-Credentials: true",
                        origin_value
                    )
                }
            } else {
                // Don't send CORS headers for disallowed origins
                "".to_string()
            }
        }
        None => {
            // Same-origin request or no origin header
            if cors_config.allow_all_origins {
                "Access-Control-Allow-Origin: *".to_string()
            } else {
                "".to_string()
            }
        }
    }
}

fn serve_static_file_with_cors(
    stream: &mut TcpStream,
    path: &str,
    cors_config: &CorsConfig,
    origin: Option<&str>,
) -> ServerResult<()> {
    // Check if dist folder exists
    let dist_exists = Path::new("../dist").exists();

    if !dist_exists {
        // Serve hello.html from current directory as fallback
        serve_hello_file(stream, cors_config, origin)?;
        return Ok(());
    }

    let safe_path = sanitize_path(path);
    let file_path = PathBuf::from("../dist").join(&safe_path);

    if !is_safe_path(&file_path) {
        send_error_response_with_cors(
            stream,
            "403 Forbidden",
            "Access denied",
            cors_config,
            origin,
        )?;
        return Ok(());
    }

    let final_path = if safe_path.is_empty() || safe_path == "/" {
        PathBuf::from("../dist/index.html")
    } else {
        file_path
    };

    match fs::read(&final_path) {
        Ok(content) => {
            let mime_type = get_mime_type(&final_path);
            send_file_response_with_cors(stream, &content, mime_type, cors_config, origin)?;
        }
        Err(_) => {
            send_error_response_with_cors(
                stream,
                "404 Not Found",
                "File not found",
                cors_config,
                origin,
            )?;
        }
    }
    Ok(())
}

fn serve_hello_file(
    stream: &mut TcpStream,
    cors_config: &CorsConfig,
    origin: Option<&str>,
) -> ServerResult<()> {
    let hello_path = std::env::current_dir()
        .unwrap_or_default()
        .join("src")
        .join("hello.html");

    match fs::read(&hello_path) {
        Ok(content) => {
            println!(
                "{}",
                yellow("Serving hello.html from current directory", true)
            );
            send_file_response_with_cors(stream, &content, "text/html", cors_config, origin)?;
        }
        Err(_) => {
            println!(
                "{}",
                red(
                    "🔎 Warning: hello.html not found in current directory, resolve to fallback",
                    true
                )
            );
            // Create a basic HTML response if hello.html is also missing
            let fallback_html = r#"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nonso Martin | Server Running</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .status { color: #28a745; }
        .warning { color: #ffc107; background: #fff3cd; padding: 10px; border-radius: 4px; }
    </style>
</head>
<body>
    <h1 class="status">🦀 Rust Server is Running!</h1>
    <div class="warning">
        <strong>Note:</strong> Neither <code>../dist/</code> folder nor <code>hello.html</code> were found.
        <br>This is a fallback page to confirm the server is working.
    </div>
    <p>Server is ready to:</p>
    <ul>
        <li>Handle POST requests</li>
        <li>Serve static files (when available)</li>
        <li>Process form submissions</li>
    </ul>
</body>
</html>"#;
            send_file_response_with_cors(
                stream,
                fallback_html.as_bytes(),
                "text/html",
                cors_config,
                origin,
            )?;
        }
    }
    Ok(())
}

fn send_file_response_with_cors(
    stream: &mut TcpStream,
    content: &[u8],
    mime_type: &str,
    cors_config: &CorsConfig,
    origin: Option<&str>,
) -> ServerResult<()> {
    let origin_header = get_cors_origin_header(cors_config, origin);
    let cors_headers = if origin_header.is_empty() {
        "".to_string()
    } else {
        format!("{}\r\n", origin_header)
    };

    let response = format!(
        "HTTP/1.1 200 OK\r\nContent-Type: {}\r\nContent-Length: {}\r\n{}\r\n",
        mime_type,
        content.len(),
        cors_headers
    );

    stream.write_all(response.as_bytes())?;
    stream.write_all(content)?;
    stream.flush()?;
    Ok(())
}

// Improved form validation with ReDoS-resistant email regex
fn validate_form_data(form_data: &HashMap<String, String>) -> ServerResult<()> {
    let allowed_fields: HashSet<&str> = FIELD_CONSTRAINTS.iter().map(|c| c.name).collect();

    // Check for unexpected fields
    let unexpected_fields: Vec<&String> = form_data
        .keys()
        .filter(|k| !allowed_fields.contains(k.as_str()))
        .collect();

    if !unexpected_fields.is_empty() {
        return Err(ServerError::ValidationError(format!(
            "Unexpected fields found: {:?}",
            unexpected_fields
        )));
    }

    // Validate required fields and constraints
    let mut errors = Vec::new();

    // ReDoS-resistant email regex - avoids catastrophic backtracking
    let email_regex = Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
        .map_err(|e| ServerError::ParseError(format!("Invalid regex: {}", e)))?;

    for constraint in FIELD_CONSTRAINTS {
        match form_data.get(constraint.name) {
            Some(value) => {
                // Check for null bytes and control characters
                if value.contains('\0')
                    || value
                        .chars()
                        .any(|c| c.is_control() && c != '\n' && c != '\r' && c != '\t')
                {
                    errors.push(format!("{} contains invalid characters", constraint.name));
                    continue;
                }

                // Length validation
                if value.len() > constraint.max_length {
                    errors.push(format!(
                        "{} too long (max {} characters, got {})",
                        constraint.name,
                        constraint.max_length,
                        value.len()
                    ));
                }

                // Email specific validation
                if constraint.email {
                    // Additional length check for email before regex
                    if value.len() > 254 {
                        // RFC 5321 limit
                        errors.push("Email address too long".to_string());
                    } else if !email_regex.is_match(value) {
                        errors.push("Invalid email format".to_string());
                    }

                    // Additional email security checks
                    let local_domain: Vec<&str> = value.split('@').collect();
                    if local_domain.len() == 2 {
                        let local_part = local_domain[0];
                        let domain_part = local_domain[1];

                        if local_part.len() > 64 {
                            // RFC 5321 local part limit
                            errors.push("Email local part too long".to_string());
                        }
                        if domain_part.len() > 253 {
                            // Domain length limit
                            errors.push("Email domain too long".to_string());
                        }
                    }
                }

                // Content validation for message field
                if constraint.name == "message" {
                    // Check for suspicious patterns that might indicate spam
                    let suspicious_patterns = [
                        "http://",
                        "https://",
                        "www.",
                        ".com",
                        ".org",
                        ".net",
                        "<script",
                        "<iframe",
                        "javascript:",
                        "data:",
                    ];

                    let value_lower = value.to_lowercase();
                    let suspicious_count = suspicious_patterns
                        .iter()
                        .filter(|pattern| value_lower.contains(*pattern))
                        .count();

                    if suspicious_count > 2 {
                        errors.push("Message contains suspicious content".to_string());
                    }
                }
            }
            None => {
                if constraint.required {
                    errors.push(format!("Missing required field: {}", constraint.name));
                }
            }
        }
    }

    // Validate checkbox fields: only "on" is allowed if present
    for &cb_name in &OPTIONAL_CHECKBOX {
        if let Some(cb_value) = form_data.get(cb_name) {
            if cb_value != "on" {
                errors.push(format!("Invalid value for checkbox '{}'", cb_name));
            }
        }
    }

    // Additional security validations
    let total_content_size: usize = form_data.values().map(|v| v.len()).sum();
    if total_content_size > MAX_FORM_DATA_LENGTH {
        // 10KB total form data limit
        errors.push("Total form data too large".to_string());
    }

    // Check for potential XSS attempts in any field
    for (field_name, value) in form_data {
        if contains_potential_xss(value) {
            errors.push(format!(
                "Field '{}' contains potentially malicious content",
                field_name
            ));
        }
    }

    if !errors.is_empty() {
        return Err(ServerError::ValidationError(errors.join(", ")));
    }

    Ok(())
}

// Secure POST request handler with proper email logic
fn handle_post_request_secure(
    mut buf_reader: BufReader<&mut TcpStream>,
    content_length: usize,
    cors_config: &CorsConfig,
    origin: Option<&str>,
    security_config: &SecurityConfig,
    client_ip: &str,
) -> ServerResult<()> {
    if content_length == 0 {
        send_html_response_with_cors_secure(
            &mut buf_reader,
            "Error",
            "No data received",
            None,
            None,
            cors_config,
            origin,
        )?;
        return Ok(());
    }

    // Use security config limits
    if content_length > security_config.max_content_length {
        println!(
            "🚫 Payload too large from {}: {}KB",
            client_ip,
            content_length / 1024
        );
        send_html_response_with_cors_secure(
            &mut buf_reader,
            "Error",
            "Payload too large",
            None,
            None,
            cors_config,
            origin,
        )?;
        return Ok(());
    }

    // Validate content_length before allocating memory
    let mut body = vec![0; content_length];
    buf_reader.read_exact(&mut body).map_err(|e| {
        eprintln!("🚫 Failed to read POST body from {}: {}", client_ip, e);
        ServerError::IoError(e)
    })?;

    let body_str = String::from_utf8_lossy(&body);
    // println!("📨 POST data received from {} ({}B)", client_ip, body.len());
    println!(
        "{}",
        green(
            &format!("📨 POST data received from {} ({}B)", client_ip, body.len()),
            true
        )
    );

    let form_data = if body_str.contains("Content-Disposition: form-data") {
        parse_multipart_data(&body_str)
    } else {
        parse_form_data(&body_str)
    };

    // Validate form data BEFORE proceeding
    match validate_form_data(&form_data) {
        Ok(()) => {
            // println!("✅ Form validation passed for {}", client_ip);
            println!(
                "{}",
                green(
                    &format!("🟢 Form validation passed for {}", client_ip),
                    true
                )
            );

            // Log sanitized form data
            for (key, value) in &form_data {
                if key == "email" {
                    println!("📧 Field '{}': '***@***'", key);
                } else if key == "message" {
                    println!(
                        "📝 Field '{}': '{}' ({}chars)",
                        key,
                        &value.chars().take(50).collect::<String>(),
                        value.len()
                    );
                } else {
                    println!("📄 Field '{}': '{}'", key, value);
                }
            }

            let name = form_data.get("name").cloned();
            let email = form_data.get("email").cloned();

            // Send email ONLY after successful validation
            let email_sent = if let Some(email_addr) = &email {
                send_confirmation_email(&form_data, email_addr, client_ip)
            } else {
                false
            };

            // Send success response
            send_html_response_with_cors_secure(
                &mut buf_reader,
                "Success",
                if email_sent {
                    "Form submitted successfully and confirmation email sent!"
                } else {
                    "Form submitted successfully!"
                },
                name.as_deref(),
                email.as_deref(),
                cors_config,
                origin,
            )?;
        }
        Err(e) => {
            println!("🚫 Form validation failed for {}: {}", client_ip, e);
            send_html_response_with_cors_secure(
                &mut buf_reader,
                "Error",
                &e.to_string(),
                None,
                None,
                cors_config,
                origin,
            )?;
        }
    }

    Ok(())
}

// Helper function for sending confirmation email
fn send_confirmation_email(
    form_data: &HashMap<String, String>,
    email_addr: &str,
    client_ip: &str,
) -> bool {
    let user_name = form_data
        .get("name")
        .map(|s| s.as_str())
        .unwrap_or("Dear Friend");
    let user_message = form_data
        .get("message")
        .map(|s| s.as_str())
        .unwrap_or("Your form submission");

    let subject = "Thank you for contacting me!";

    // Sanitize email content
    let email_addr = sanitize_email_content(email_addr);
    let user_name = sanitize_email_content(user_name);
    let user_message = sanitize_email_content(user_message);

    // Generate HTML email
    let html_body = generate_email_html(&user_name, &user_message);

    // Fallback plain text version
    let plain_text_body = format!(
        "Hello {},\n\nThank you for your submission! I received your message and will attend to your queries shortly.\n\nYour message: {}\n\nBest regards,\nNonso Martin",
        user_name, user_message
    );

    // Try to send HTML email with plain text fallback
    match send_html_email(&email_addr, subject, &html_body, Some(&plain_text_body)) {
        Ok(()) => {
            println!(
                "✅ Email sent successfully to {} from {}",
                email_addr, client_ip
            );
            true
        }
        Err(e) => {
            eprintln!(
                "⚠️ Failed to send HTML email to {} from {}: {}",
                email_addr, client_ip, e
            );

            // Fallback to plain text
            match send_email(&email_addr, subject, &plain_text_body) {
                Ok(()) => {
                    println!(
                        "✅ Fallback plain text email sent to {} from {}",
                        email_addr, client_ip
                    );
                    true
                }
                Err(e2) => {
                    eprintln!(
                        "🚫 Failed to send any email to {} from {}: {}",
                        email_addr, client_ip, e2
                    );
                    false
                }
            }
        }
    }
}

// Updated HTML response function with security
fn send_html_response_with_cors_secure(
    buf_reader: &mut BufReader<&mut TcpStream>,
    status_type: &str,
    message: &str,
    name: Option<&str>,
    email: Option<&str>,
    cors_config: &CorsConfig,
    origin: Option<&str>,
) -> ServerResult<()> {
    let origin_header = get_cors_origin_header(cors_config, origin);
    let cors_headers = if origin_header.is_empty() {
        "".to_string()
    } else {
        format!("{}\r\n", origin_header)
    };

    // Use the secure HTML generation function
    let html_content = generate_response_html(status_type, message, name, email);

    let response = format!(
        "HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\nContent-Length: {}\r\nX-Content-Type-Options: nosniff\r\nX-Frame-Options: DENY\r\nX-XSS-Protection: 1; mode=block\r\n{}\r\n{}",
        html_content.len(),
        cors_headers,
        html_content
    );

    buf_reader.get_mut().write_all(response.as_bytes())?;
    buf_reader.get_mut().flush()?;
    Ok(())
}

// Fixed generate_response_html function with HTML escaping
fn generate_response_html(
    status_type: &str,
    message: &str,
    name: Option<&str>,
    email: Option<&str>,
) -> String {
    let (title, heading, content) = match status_type {
        "Success" => {
            // HTML escape user inputs
            let name_display = html_escape(name.unwrap_or("Your name"));
            let email_display = html_escape(email.unwrap_or("your email"));
            // let message_escaped = html_escape(message);

            let thank_you_message = format!(
                "Thank you <strong>{}</strong>! You will receive a message shortly to your designated email: <strong>{}</strong>",
                name_display, email_display
            );

            (
                "Form Submitted Successfully",
                "🥂 Success!",
                thank_you_message,
            )
        }
        "Error" => (
            "Form Submission Error",
            "🚫 Error",
            format!("Sorry, there was an issue: {}", html_escape(message)),
        ),
        _ => ("Form Response", "Response", html_escape(message)),
    };

    format!(
        r#"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Outfit:wght@100..900&display=swap"
      rel="stylesheet"
    />
    <title>{}</title>
    <style>
        * {{
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: "Outfit", system-ui, sans-serif;
            max-width: 100vw;
            background-color: #222;
            color: white;
            min-height: 100vh;
            overflow: hidden;
            display: grid;
            place-content: center;
        }}

        .container {{
            background-color: #101010;
            height: 300px;
            width: 500px;
            border-radius: 15px;
            padding: 2% 3%;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
        }}

        h1 {{
            color: #fff;
            text-align: center;
            font-size: 2.5em;
        }}

        .message {{
            border-left: 4px solid #34db69;
            padding:2%;
            height: 50%;
            border-radius: 5px;
            font-size: 1.2rem;
            line-height: 1.5;
        }}

        .back-link {{
            display: inline-block;
            width: 40%;
            height: 15%;
            display: grid;
            place-content: center;
            background-color: #222;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition-duration: 0.2s;
            border: 1px solid #474646ff;
        }}
        .back-link:hover {{
            background: #34db69ff;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px #34db695b;
        }}
        .error {{
            border-left-color: #fa4646ff;
        }}
        .success {{
            border-left-color: #51cf66;
        }}

        @media screen and (max-width: 510px) {{
            .container {{
                 width: 97dvw !important;
             }}
             .back-link {{
                 width: 60%;
             }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>{}</h1>
        <div class="message {}">
            {}
        </div>
        <a href="/" class="back-link">Back to Homepage</a>
    </div>
</body>
</html>"#,
        html_escape(title),
        heading,
        if status_type == "Success" {
            "success"
        } else {
            "error"
        },
        content
    )
}

fn send_error_response_with_cors(
    stream: &mut TcpStream,
    status: &str,
    message: &str,
    cors_config: &CorsConfig,
    origin: Option<&str>,
) -> ServerResult<()> {
    let origin_header = get_cors_origin_header(cors_config, origin);
    let cors_headers = if origin_header.is_empty() {
        "".to_string()
    } else {
        format!("{}\r\n", origin_header)
    };

    let html_content = format!(
        r#"<!DOCTYPE html><html><head><title>{}</title></head><body><h1>{}</h1><p>{}</p></body></html>"#,
        status, status, message
    );

    let response = format!(
        "HTTP/1.1 {}\r\nContent-Type: text/html\r\nContent-Length: {}\r\n{}\r\n{}",
        status,
        html_content.len(),
        cors_headers,
        html_content
    );

    stream.write_all(response.as_bytes())?;
    stream.flush()?;
    Ok(())
}
