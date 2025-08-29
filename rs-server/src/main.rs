use std::{
    collections::HashMap,
    env, // test .env
    fs,
    io::{prelude::*, BufReader},
    net::{TcpListener, TcpStream},
    path::{Path, PathBuf},

    // think about this thread_pool impl
    sync::{mpsc, Arc, Mutex}, // mpsc = multiple producer , single consumer
    thread,
};

// use nox::nox_server;

#[allow(dead_code)]
struct ThreadPool {
    workers: Vec<Worker>,
    sender: mpsc::Sender<TcpStream>,
}
#[allow(dead_code)]
struct Worker {
    id: usize,
    thread: thread::JoinHandle<()>,
}

impl ThreadPool {
    fn new(size: usize) -> ThreadPool {
        let (sender, receiver) = mpsc::channel();
        let receiver = Arc::new(Mutex::new(receiver));
        let mut workers = Vec::with_capacity(size);

        for id in 0..size {
            workers.push(Worker::new(id, Arc::clone(&receiver)));
        }

        ThreadPool { workers, sender }
    }

    fn execute(&self, stream: TcpStream) {
        self.sender.send(stream).unwrap();
    }
}

impl Worker {
    fn new(id: usize, receiver: Arc<Mutex<mpsc::Receiver<TcpStream>>>) -> Worker {
        let thread = thread::spawn(move || loop {
            let stream = receiver.lock().unwrap().recv();
            match stream {
                Ok(stream) => {
                    handle_connection(stream);
                }
                Err(_) => break, // Channel closed
            }
        });
        Worker { id, thread }
    }
}

fn main() {
    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let addr = format!("127.0.0.1:{}", port);
    // While hosting on a public space consider changing the port from
    // localhost:8080 or 127.0.0.1:8080 to 0.0.0.0:10000
    let listener = TcpListener::bind(&addr).unwrap();
    println!("Server running on http://{}", &addr);
    println!("Serving static files from ../dist/");

    let pool = ThreadPool::new(2); // let us work with this
    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                pool.execute(stream);
            }
            Err(e) => eprintln!("Connection failed: {}", e),
        }
    }
}

fn handle_connection(mut stream: TcpStream) {
    let mut buf_reader = BufReader::new(&mut stream);
    let mut request_line = String::new();

    // Read the request line
    if buf_reader.read_line(&mut request_line).is_err() {
        return;
    }

    // Read headers and find Content-Length
    let mut content_length = 0;
    let mut line = String::new();

    loop {
        line.clear();
        if buf_reader.read_line(&mut line).is_err() {
            break;
        }

        if line.trim().is_empty() {
            break; // End of headers
        }

        if line.to_lowercase().starts_with("content-length:") {
            if let Some(length_str) = line.split(": ").nth(1) {
                content_length = length_str.trim().parse().unwrap_or(0);
            }
        }
    }

    // Parse request method and path
    let parts: Vec<&str> = request_line.split_whitespace().collect();
    if parts.len() < 2 {
        return;
    }

    let method = parts[0];
    let path = parts[1];

    println!(
        "Received: {} {} (Content-Length: {})",
        method, path, content_length
    );

    match method {
        "POST" => handle_post_request(buf_reader, content_length),
        "GET" => serve_static_file(&mut stream, path),
        _ => send_error_response(&mut stream, "405 Method Not Allowed", "Method not allowed"),
    }
}

fn serve_static_file(stream: &mut TcpStream, path: &str) {
    // Security: Sanitize the path to prevent directory traversal
    let safe_path = sanitize_path(path);
    let file_path = PathBuf::from("../dist").join(&safe_path);

    println!("Trying to serve: {:?}", file_path);

    // Check if path exists and is within dist directory
    if !is_safe_path(&file_path) {
        send_error_response(stream, "403 Forbidden", "Access denied");
        return;
    }

    // If requesting root, serve index.html
    let final_path = if safe_path.is_empty() || safe_path == "/" {
        PathBuf::from("../dist/index.html")
    } else {
        file_path
    };

    // Try to read the file
    match fs::read(&final_path) {
        Ok(content) => {
            let mime_type = get_mime_type(&final_path);
            let _ = send_file_response(stream, &content, mime_type);
        }
        Err(_) => {
            send_error_response(stream, "404 Not Found", "File not found");
        }
    }
}

fn sanitize_path(path: &str) -> String {
    // Remove leading slash and decode URL encoding
    let path = if path.starts_with('/') {
        &path[1..]
    } else {
        path
    };

    // Basic URL decoding and path sanitization
    let decoded = url_decode(path);

    // Remove any path traversal attempts
    let parts: Vec<&str> = decoded
        .split('/')
        .filter(|part| !part.is_empty() && *part != "." && *part != "..")
        .collect();

    parts.join("/")
}

fn is_safe_path(path: &Path) -> bool {
    // Ensure the path is within the dist directory
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
            // If canonicalize fails, check if it's because file doesn't exist
            // but parent directory is safe
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

fn send_file_response(
    stream: &mut TcpStream,
    content: &[u8],
    mime_type: &str,
) -> std::io::Result<()> {
    let response = format!(
        "HTTP/1.1 200 OK\r\nContent-Type: {}\r\nContent-Length: {}\r\nAccess-Control-Allow-Origin: *\r\n\r\n",
        mime_type, content.len()
    );

    stream.write_all(response.as_bytes())?;
    stream.write_all(content)?;
    stream.flush()?;
    Ok(())
}

fn send_error_response(stream: &mut TcpStream, status: &str, message: &str) {
    let html_content = format!(
        r#"<!DOCTYPE html>
<html>
<head><title>{}</title></head>
<body>
<h1>{}</h1>
<p>{}</p>
</body>
</html>"#,
        status, status, message
    );

    let response = format!(
        "HTTP/1.1 {}\r\nContent-Type: text/html\r\nContent-Length: {}\r\n\r\n{}",
        status,
        html_content.len(),
        html_content
    );

    stream.write_all(response.as_bytes()).unwrap();
}

fn handle_post_request(mut buf_reader: BufReader<&mut TcpStream>, content_length: usize) {
    if content_length == 0 {
        println!("No content to read");
        send_json_response_via_reader(
            &mut buf_reader,
            r#"{"status": "error", "message": "No data received"}"#,
        );
        return;
    }

    // Read the POST body
    let mut body = vec![0; content_length];
    if let Err(e) = buf_reader.read_exact(&mut body) {
        println!("Error reading body: {}", e);
        send_json_response_via_reader(
            &mut buf_reader,
            r#"{"status": "error", "message": "Error reading data"}"#,
        );
        return;
    }

    let body_str = String::from_utf8_lossy(&body);

    println!(
        "POST data received (length: {}): {}",
        content_length, body_str
    );

    // Check if it's multipart form data
    if body_str.contains("Content-Disposition: form-data") {
        println!("Detected multipart form data");
        let form_data = parse_multipart_data(&body_str);

        // Process your form data here
        for (key, value) in &form_data {
            println!("Field '{}': '{}'", key, value);
        }

        send_json_response_via_reader(
            &mut buf_reader,
            r#"{"status": "success", "message": "Form submitted successfully"}"#,
        );
    } else {
        // Try URL-encoded format
        let form_data = parse_form_data(&body_str);

        for (key, value) in &form_data {
            println!("Field '{}': '{}'", key, value);
        }

        if form_data.is_empty() {
            send_json_response_via_reader(
                &mut buf_reader,
                r#"{"status": "error", "message": "Could not parse form data"}"#,
            );
        } else {
            send_json_response_via_reader(
                &mut buf_reader,
                r#"{"status": "success", "message": "Form submitted successfully"}"#,
            );
        }
    }
}

fn send_json_response_via_reader(buf_reader: &mut BufReader<&mut TcpStream>, json_content: &str) {
    let response = format!(
        "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: {}\r\n\r\n{}",
        json_content.len(),
        json_content
    );
    buf_reader.get_mut().write_all(response.as_bytes()).unwrap();
}

fn parse_multipart_data(body: &str) -> HashMap<String, String> {
    let mut form_data = HashMap::new();

    // Split by boundary (look for lines starting with --)
    let parts: Vec<&str> = body.split("--").collect();

    for part in parts {
        if part.contains("Content-Disposition: form-data") {
            // Extract field name
            if let Some(name_start) = part.find("name=\"") {
                let name_start = name_start + 6; // Skip 'name="'
                if let Some(name_end) = part[name_start..].find('"') {
                    let field_name = &part[name_start..name_start + name_end];

                    // Extract field value (after the double newline)
                    if let Some(value_start) = part.find("\r\n\r\n") {
                        let value_start = value_start + 4; // Skip '\r\n\r\n'
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
