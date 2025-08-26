#[allow(dead_code)]
use std::{
    fs,
    io::{prelude::*, BufReader},
    net::{TcpListener, TcpStream},
    collections::HashMap,
};

fn main() {
    let listener = TcpListener::bind("127.0.0.1:7878").unwrap();
    println!("Server running on http://127.0.0.1:7878");

    for stream in listener.incoming() {
        let stream = stream.unwrap();
        handle_connection(stream);
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
    
    println!("Received: {} {} (Content-Length: {})", method, path, content_length);
    
    match method {
        "POST" => handle_post_request(buf_reader, content_length),
        "GET" => serve_static_file(&mut stream),
        _ => send_response(&mut stream, "405 Method Not Allowed", "Method not allowed"),
    }
}

fn handle_post_request(mut buf_reader: BufReader<&mut TcpStream>, content_length: usize) {
    if content_length == 0 {
        println!("No content to read");
        send_json_response_via_reader(&mut buf_reader, r#"{"status": "error", "message": "No data received"}"#);
        return;
    }
    
    // Read the POST body
    let mut body = vec![0; content_length];
    if let Err(e) = buf_reader.read_exact(&mut body) {
        println!("Error reading body: {}", e);
        send_json_response_via_reader(&mut buf_reader, r#"{"status": "error", "message": "Error reading data"}"#);
        return;
    }
    
    let body_str = String::from_utf8_lossy(&body);
    
    println!("POST data received (length: {}): {}", content_length, body_str);
    
    // Check if it's multipart form data
    if body_str.contains("Content-Disposition: form-data") {
        println!("Detected multipart form data");
        let form_data = parse_multipart_data(&body_str);
        
        // Process your form data here
        for (key, value) in &form_data {
            println!("Field '{}': '{}'", key, value);
        }
        
        send_json_response_via_reader(&mut buf_reader, r#"{"status": "success", "message": "Form submitted successfully"}"#);
    } else {
        // Try URL-encoded format
        let form_data = parse_form_data(&body_str);
        
        for (key, value) in &form_data {
            println!("Field '{}': '{}'", key, value);
        }
        
        if form_data.is_empty() {
            send_json_response_via_reader(&mut buf_reader, r#"{"status": "error", "message": "Could not parse form data"}"#);
        } else {
            send_json_response_via_reader(&mut buf_reader, r#"{"status": "success", "message": "Form submitted successfully"}"#);
        }
    }
}

fn serve_static_file(stream: &mut TcpStream) {
    // Keep your existing behavior for GET requests
    let contents = fs::read_to_string("./src/hello.html")
        .unwrap_or(String::from("Hello the Html file could not be loaded"));
    
    send_response(stream, "200 OK", &contents);
}

fn send_response(stream: &mut TcpStream, status: &str, content: &str) {
    let response = format!(
        "HTTP/1.1 {}\r\nContent-Type: text/html\r\nContent-Length: {}\r\n\r\n{}",
        status,
        content.len(),
        content
    );
    stream.write_all(response.as_bytes()).unwrap();
}

fn _send_json_response(stream: &mut TcpStream, json_content: &str) {
    let response = format!(
        "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: {}\r\n\r\n{}",
        json_content.len(),
        json_content
    );
    stream.write_all(response.as_bytes()).unwrap();
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