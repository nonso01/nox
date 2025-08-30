use std::{
    collections::HashMap,
    env, fs,
    io::{prelude::*, BufReader},
    net::{TcpListener, TcpStream},
    path::{Path, PathBuf},
    sync::{mpsc, Arc, Mutex},
    thread,
};

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
                "http://localhost:5173".to_string(), // React dev server
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
struct ThreadPool {
    workers: Vec<Worker>,
    sender: mpsc::Sender<TcpStream>,
    cors_config: CorsConfig,
}

#[allow(dead_code)]
struct Worker {
    id: usize,
    thread: thread::JoinHandle<()>,
}

impl ThreadPool {
    fn new(size: usize, cors_config: CorsConfig) -> ThreadPool {
        let (sender, receiver) = mpsc::channel();
        let receiver = Arc::new(Mutex::new(receiver));
        let mut workers = Vec::with_capacity(size);

        for id in 0..size {
            workers.push(Worker::new(id, Arc::clone(&receiver), cors_config.clone()));
        }

        ThreadPool {
            workers,
            sender,
            cors_config,
        }
    }

    fn execute(&self, stream: TcpStream) {
        self.sender.send(stream).unwrap();
    }
}

impl Worker {
    fn new(
        id: usize,
        receiver: Arc<Mutex<mpsc::Receiver<TcpStream>>>,
        cors_config: CorsConfig,
    ) -> Worker {
        let thread = thread::spawn(move || loop {
            let stream = receiver.lock().unwrap().recv();
            match stream {
                Ok(stream) => {
                    handle_connection(stream, &cors_config);
                }
                Err(_) => break,
            }
        });
        Worker { id, thread }
    }
}

fn main() {
    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let addr = format!("127.0.0.1:{}", port);

    // Initialize CORS configuration
    let cors_config = CorsConfig::new();
    let cors_mode = env::var("CORS_MODE").unwrap_or_else(|_| "same-origin".to_string());

    // Check if dist folder exists
    let dist_exists = Path::new("../dist").exists();

    let listener = TcpListener::bind(&addr).unwrap();
    println!("Server running on http://{}", &addr);
    println!("CORS Mode: {}", cors_mode);
    println!("Allowed HTTP methods: GET, POST, OPTIONS");

    if dist_exists {
        println!("Serving static files from ../dist/");
    } else {
        println!("Warning: ../dist/ folder not found!");
        println!("Serving hello.html from current directory as fallback");
    }

    let pool = ThreadPool::new(4, cors_config); // Increased to 4 workers

    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                pool.execute(stream);
            }
            Err(e) => eprintln!("Connection failed: {}", e),
        }
    }
}

fn handle_connection(mut stream: TcpStream, cors_config: &CorsConfig) {
    let mut buf_reader = BufReader::new(&mut stream);
    let mut request_line = String::new();

    if buf_reader.read_line(&mut request_line).is_err() {
        return;
    }

    // Read headers
    let mut content_length = 0;
    let mut origin = None;
    let mut line = String::new();

    loop {
        line.clear();
        if buf_reader.read_line(&mut line).is_err() {
            break;
        }

        if line.trim().is_empty() {
            break;
        }

        let line_lower = line.to_lowercase();
        if line_lower.starts_with("content-length:") {
            if let Some(length_str) = line.split(": ").nth(1) {
                content_length = length_str.trim().parse().unwrap_or(0);
            }
        } else if line_lower.starts_with("origin:") {
            if let Some(origin_str) = line.split(": ").nth(1) {
                origin = Some(origin_str.trim().to_string());
            }
        }
    }

    let parts: Vec<&str> = request_line.split_whitespace().collect();
    if parts.len() < 2 {
        return;
    }

    let method = parts[0];
    let path = parts[1];

    println!("Received: {} {} (Origin: {:?})", method, path, origin);

    // Check if method is allowed
    if !cors_config.is_method_allowed(method) {
        println!("Method {} not allowed", method);
        send_error_response_with_cors(
            &mut stream,
            "405 Method Not Allowed",
            "Method not allowed",
            cors_config,
            origin.as_deref(),
        );
        return;
    }

    match method {
        "OPTIONS" => handle_preflight_request(&mut stream, cors_config, origin.as_deref()),
        "POST" => handle_post_request_with_cors(
            buf_reader,
            content_length,
            cors_config,
            origin.as_deref(),
        ),
        "GET" => serve_static_file_with_cors(&mut stream, path, cors_config, origin.as_deref()),
        _ => send_error_response_with_cors(
            &mut stream,
            "405 Method Not Allowed",
            "Method not allowed",
            cors_config,
            origin.as_deref(),
        ),
    }
}

fn handle_preflight_request(
    stream: &mut TcpStream,
    cors_config: &CorsConfig,
    origin: Option<&str>,
) {
    let origin_header = get_cors_origin_header(cors_config, origin);

    let response = format!(
        "HTTP/1.1 200 OK\r\n{}\r\nAccess-Control-Allow-Methods: {}\r\nAccess-Control-Allow-Headers: {}\r\nAccess-Control-Max-Age: {}\r\nContent-Length: 0\r\n\r\n",
        origin_header,
        cors_config.allow_methods.join(", "),
        cors_config.allow_headers.join(", "),
        cors_config.max_age
    );

    let _ = stream.write_all(response.as_bytes());
    let _ = stream.flush();
    println!("Sent preflight response for origin: {:?}", origin);
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
) {
    // Check if dist folder exists
    let dist_exists = Path::new("../dist").exists();

    if !dist_exists {
        // Serve hello.html from current directory as fallback
        serve_hello_file(stream, cors_config, origin);
        return;
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
        );
        return;
    }

    let final_path = if safe_path.is_empty() || safe_path == "/" {
        PathBuf::from("../dist/index.html")
    } else {
        file_path
    };

    match fs::read(&final_path) {
        Ok(content) => {
            let mime_type = get_mime_type(&final_path);
            let _ = send_file_response_with_cors(stream, &content, mime_type, cors_config, origin);
        }
        Err(_) => {
            send_error_response_with_cors(
                stream,
                "404 Not Found",
                "File not found",
                cors_config,
                origin,
            );
        }
    }
}

fn serve_hello_file(stream: &mut TcpStream, cors_config: &CorsConfig, origin: Option<&str>) {
    let hello_path = PathBuf::from("./src/hello.html");

    match fs::read(&hello_path) {
        Ok(content) => {
            println!("Serving hello.html from current directory");
            let _ =
                send_file_response_with_cors(stream, &content, "text/html", cors_config, origin);
        }
        Err(_) => {
            println!("Warning: hello.html not found in current directory");
            // Create a basic HTML response if hello.html is also missing
            let fallback_html = r#"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server Running</title>
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
            let _ = send_file_response_with_cors(
                stream,
                fallback_html.as_bytes(),
                "text/html",
                cors_config,
                origin,
            );
        }
    }
}

fn send_file_response_with_cors(
    stream: &mut TcpStream,
    content: &[u8],
    mime_type: &str,
    cors_config: &CorsConfig,
    origin: Option<&str>,
) -> std::io::Result<()> {
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

fn handle_post_request_with_cors(
    mut buf_reader: BufReader<&mut TcpStream>,
    content_length: usize,
    cors_config: &CorsConfig,
    origin: Option<&str>,
) {
    if content_length == 0 {
        send_html_response_with_cors(
            &mut buf_reader,
            "Error",
            "No data received",
            None,
            None,
            cors_config,
            origin,
        );
        return;
    }

    let mut body = vec![0; content_length];
    if let Err(e) = buf_reader.read_exact(&mut body) {
        println!("Error reading body: {}", e);
        send_html_response_with_cors(
            &mut buf_reader,
            "Error",
            "Error reading data",
            None,
            None,
            cors_config,
            origin,
        );
        return;
    }

    let body_str = String::from_utf8_lossy(&body);
    println!("POST data received from origin {:?}: {}", origin, body_str);

    let form_data = if body_str.contains("Content-Disposition: form-data") {
        parse_multipart_data(&body_str)
    } else {
        parse_form_data(&body_str)
    };

    for (key, value) in &form_data {
        println!("Field '{}': '{}'", key, value);
    }

    if form_data.is_empty() {
        send_html_response_with_cors(
            &mut buf_reader,
            "Error",
            "Could not parse form data",
            None,
            None,
            cors_config,
            origin,
        );
    } else {
        // Extract name and email from form data
        let name = form_data.get("name").cloned();
        let email = form_data.get("email").cloned();

        send_html_response_with_cors(
            &mut buf_reader,
            "Success",
            "Form submitted successfully",
            name.as_deref(),
            email.as_deref(),
            cors_config,
            origin,
        );
    }
}

fn send_html_response_with_cors(
    buf_reader: &mut BufReader<&mut TcpStream>,
    status_type: &str,
    message: &str,
    name: Option<&str>,
    email: Option<&str>,
    cors_config: &CorsConfig,
    origin: Option<&str>,
) {
    let origin_header = get_cors_origin_header(cors_config, origin);
    let cors_headers = if origin_header.is_empty() {
        "".to_string()
    } else {
        format!("{}\r\n", origin_header)
    };

    let html_content = generate_response_html(status_type, message, name, email);

    let response = format!(
        "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: {}\r\n{}\r\n{}",
        html_content.len(),
        cors_headers,
        html_content
    );
    let _ = buf_reader.get_mut().write_all(response.as_bytes());
}

fn generate_response_html(
    status_type: &str,
    message: &str,
    name: Option<&str>,
    email: Option<&str>,
) -> String {
    let (title, heading, content) = match status_type {
        "Success" => {
            let name_display = name.unwrap_or("Your name");
            let email_display = email.unwrap_or("your email");

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
            "❌ Error",
            format!("Sorry, there was an issue: {}", message),
        ),
        _ => ("Form Response", "Response", message.to_string()),
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
            border-left-color: #ff6b6b;
        }}
        .success {{
            border-left-color: #51cf66;
        }}

        @media screen and (max-width: 508px) {{
        .container {{
             width: 100vw !important;
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
        <a href="/" class="back-link">← Back to Homepage</a>
    </div>
</body>
</html>"#,
        title,
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
) {
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

    let _ = stream.write_all(response.as_bytes());
}

// Helper functions
fn sanitize_path(path: &str) -> String {
    let path = if path.starts_with('/') {
        &path[1..]
    } else {
        path
    };
    let decoded = url_decode(path);
    let parts: Vec<&str> = decoded
        .split('/')
        .filter(|part| !part.is_empty() && *part != "." && *part != "..")
        .collect();
    parts.join("/")
}

fn is_safe_path(path: &Path) -> bool {
    match path.canonicalize() {
        Ok(canonical) => {
            let dist_path = match std::env::current_dir() {
                Ok(current) => current.parent().unwrap_or(&current).join("dist"),
                Err(_) => return false,
            };
            match dist_path.canonicalize() {
                Ok(canonical_dist) => canonical.starts_with(canonical_dist),
                Err(_) => false,
            }
        }
        Err(_) => {
            if let Some(parent) = path.parent() {
                match parent.canonicalize() {
                    Ok(canonical_parent) => {
                        let dist_path = match std::env::current_dir() {
                            Ok(current) => current.parent().unwrap_or(&current).join("dist"),
                            Err(_) => return false,
                        };
                        match dist_path.canonicalize() {
                            Ok(canonical_dist) => canonical_parent.starts_with(canonical_dist),
                            Err(_) => false,
                        }
                    }
                    Err(_) => false,
                }
            } else {
                false
            }
        }
    }
}

fn get_mime_type(path: &Path) -> &'static str {
    match path.extension().and_then(|ext| ext.to_str()) {
        Some("html") | Some("htm") => "text/html",
        Some("css") => "text/css",
        Some("js") => "application/javascript",
        Some("json") => "application/json",
        Some("png") => "image/png",
        Some("jpg") | Some("jpeg") => "image/jpeg",
        Some("gif") => "image/gif",
        Some("svg") => "image/svg+xml",
        Some("ico") => "image/x-icon",
        Some("woff") => "font/woff",
        Some("woff2") => "font/woff2",
        Some("ttf") => "font/ttf",
        Some("eot") => "application/vnd.ms-fontobject",
        Some("glb") => "model/gltf-binary",
        Some("gltf") => "model/gltf+json",
        Some("mp4") => "video/mp4",
        Some("webm") => "video/webm",
        Some("mp3") => "audio/mpeg",
        Some("wav") => "audio/wav",
        Some("pdf") => "application/pdf",
        Some("zip") => "application/zip",
        Some("txt") => "text/plain",
        _ => "application/octet-stream",
    }
}

fn parse_multipart_data(body: &str) -> HashMap<String, String> {
    let mut form_data = HashMap::new();
    let parts: Vec<&str> = body.split("--").collect();

    for part in parts {
        if part.contains("Content-Disposition: form-data") {
            if let Some(name_start) = part.find("name=\"") {
                let name_start = name_start + 6;
                if let Some(name_end) = part[name_start..].find('"') {
                    let field_name = &part[name_start..name_start + name_end];
                    if let Some(value_start) = part.find("\r\n\r\n") {
                        let value_start = value_start + 4;
                        let field_value = part[value_start..].trim();
                        if !field_value.is_empty() {
                            form_data.insert(field_name.to_string(), field_value.to_string());
                        }
                    }
                }
            }
        }
    }
    form_data
}

fn parse_form_data(body: &str) -> HashMap<String, String> {
    let mut form_data = HashMap::new();
    for pair in body.split('&') {
        if let Some((key, value)) = pair.split_once('=') {
            let decoded_key = url_decode(key);
            let decoded_value = url_decode(value);
            form_data.insert(decoded_key, decoded_value);
        }
    }
    form_data
}

fn url_decode(s: &str) -> String {
    let mut result = String::new();
    let mut chars = s.chars().peekable();

    while let Some(ch) = chars.next() {
        match ch {
            '%' => {
                let hex_str: String = chars.by_ref().take(2).collect();
                if hex_str.len() == 2 {
                    if let Ok(byte) = u8::from_str_radix(&hex_str, 16) {
                        result.push(byte as char);
                    }
                }
            }
            '+' => result.push(' '),
            _ => result.push(ch),
        }
    }
    result
}
