/// All essential functions, Constants, Structs, Enums
/// and libs

pub mod nox_server {
    use std::{
        collections::HashMap,
        env,
        path::Path,
        sync::{Arc, Mutex},
        time::{Duration, Instant},
    };

    use lettre::{
        message::{header::ContentType, MultiPart, SinglePart},
        transport::smtp::authentication::Credentials,
        Message, SmtpTransport, Transport,
    };

    pub struct RateLimiter {
        pub requests: Arc<Mutex<HashMap<String, Vec<Instant>>>>,
        pub max_requests: usize,
        pub window_duration: Duration,
    }

    impl RateLimiter {
        pub fn new(max_requests: usize, window_minutes: u64) -> Self {
            RateLimiter {
                requests: Arc::new(Mutex::new(HashMap::new())),
                max_requests,
                window_duration: Duration::from_secs(window_minutes * 60),
            }
        }

        pub fn is_allowed(&self, client_id: &str) -> bool {
            let mut requests = self.requests.lock().unwrap();
            let now = Instant::now();

            // Clean old entries
            let cutoff = now - self.window_duration;
            requests
                .entry(client_id.to_string())
                .or_insert_with(Vec::new)
                .retain(|&timestamp| timestamp > cutoff);

            let client_requests = requests.get_mut(client_id).unwrap();

            if client_requests.len() >= self.max_requests {
                false
            } else {
                client_requests.push(now);
                true
            }
        }
    }

  
// Http Responses so you can have routes efficiently
    pub struct HttpResponse {
        status: String,
        content_type: String,
        body: Vec<u8>,
        custom_headers: Vec<String>,
    }

    impl HttpResponse {
        pub fn new(status: &str) -> Self {
            Self {
                status: status.to_string(),
                content_type: "text/plain".to_string(),
                body: Vec::new(),
                custom_headers: Vec::new(),
            }
        }

        pub fn ok() -> Self {
            Self::new("200 OK")
        }

        pub fn not_found() -> Self {
            Self::new("404 Not Found").html("<h1>404 Not Found</h1>")
        }

        pub fn bad_request() -> Self {
            Self::new("400 Bad Request")
        }

        pub fn too_many_requests() -> Self {
            Self::new("429 Too Many Requests")
        }

        pub fn method_not_allowed() -> Self {
            Self::new("405 Method Not Allowed")
        }

        pub fn json(mut self, body: &str) -> Self {
            self.content_type = "application/json".to_string();
            self.body = body.as_bytes().to_vec();
            self
        }

        pub fn html(mut self, body: &str) -> Self {
            self.content_type = "text/html; charset=utf-8".to_string();
            self.body = body.as_bytes().to_vec();
            self
        }

        pub fn text(mut self, body: &str) -> Self {
            self.content_type = "text/plain".to_string();
            self.body = body.as_bytes().to_vec();
            self
        }

        pub fn with_header(mut self, header: String) -> Self {
            self.custom_headers.push(header);
            self
        }

        pub fn send(
            self,
            stream: &mut std::net::TcpStream,
            cors_origin_header: &str,
        ) -> Result<(), std::io::Error> {
            use std::io::Write;

            let cors_headers = if cors_origin_header.is_empty() {
                String::new()
            } else {
                format!("{}\r\n", cors_origin_header)
            };

            let custom_headers = if self.custom_headers.is_empty() {
                String::new()
            } else {
                format!("{}\r\n", self.custom_headers.join("\r\n"))
            };

            let response = format!(
                "HTTP/1.1 {}\r\nContent-Type: {}\r\nContent-Length: {}\r\n{}{}\r\n",
                self.status,
                self.content_type,
                self.body.len(),
                cors_headers,
                custom_headers
            );

            stream.write_all(response.as_bytes())?;
            stream.write_all(&self.body)?;
            stream.flush()?;
            Ok(())
        }
    }

    pub struct FieldConstraint {
        pub name: &'static str,
        pub max_length: usize,
        pub required: bool,
        pub email: bool, // true for email field, enables regex validation
    }

    // Constants
    pub const FIELD_CONSTRAINTS: &[FieldConstraint] = &[
        FieldConstraint {
            name: "name",
            max_length: 40,
            required: true,
            email: false,
        },
        FieldConstraint {
            name: "email",
            max_length: 80,
            required: true,
            email: true,
        },
        FieldConstraint {
            name: "message",
            max_length: 2000,
            required: true,
            email: false,
        },
        FieldConstraint {
            name: "frontend",
            max_length: 10,
            required: false,
            email: false,
        },
        FieldConstraint {
            name: "webDevelopment",
            max_length: 10,
            required: false,
            email: false,
        },
        FieldConstraint {
            name: "blender",
            max_length: 10,
            required: false,
            email: false,
        },
    ];

    pub const OPTIONAL_CHECKBOX: [&str; 3] = ["blender", "frontend", "webDevelopment"];

    pub const MAX_CONTENT_LENGTH: usize = 50 * 1024;

    pub const MAX_FORM_DATA_LENGTH: usize = 10 * 1024;

    // Sends an email using lettre.
    pub fn send_email(
        to: &str,
        subject: &str,
        body: &str,
    ) -> Result<(), Box<dyn std::error::Error>> {
        // Load credentials and SMTP server from environment variables for security
        let smtp_user = env::var("MY_EMAIL").map_err(|_| {
            eprintln!("Warning: MY_EMAIL env was not set");
            "MY_EMAIL environment variable not set"
        })?;

        let smtp_pass = env::var("MY_PASSWORD").map_err(|_| {
            eprintln!("Warning: MY_PASSWORD env was not set");
            "MY_PASSWORD environment variable not set"
        })?;

        let smtp_server = env::var("SMTP_SERVER").unwrap_or_else(|_| "smtp.gmail.com".to_string());

        let from_addr = env::var("SMTP_FROM").unwrap_or_else(|_| smtp_user.clone());

        let email = Message::builder()
            .from(from_addr.parse()?)
            .reply_to(from_addr.parse()?)
            .to(to.parse()?)
            .subject(subject)
            .body(body.to_string())?;

        let creds = Credentials::new(smtp_user, smtp_pass);

        let mailer = SmtpTransport::relay(&smtp_server)?
            .credentials(creds)
            .build();

        mailer.send(&email).map_err(|e| {
            eprintln!("Failed to send email to: {}", to);
            e
        })?;

        println!("Email sent successfully to: {}", to);
        Ok(())
    }

    //  function for HTML emails
    pub fn send_html_email(
        to: &str,
        subject: &str,
        html_body: &str,
        text_body: Option<&str>,
    ) -> Result<(), Box<dyn std::error::Error>> {
        // Load credentials and SMTP server from environment variables
        let smtp_user = env::var("MY_EMAIL").map_err(|_| {
            eprintln!("Warning: MY_EMAIL env was not set");
            "MY_EMAIL environment variable not set"
        })?;

        let smtp_pass = env::var("MY_PASSWORD").map_err(|_| {
            eprintln!("Warning: MY_PASSWORD env was not set");
            "MY_PASSWORD environment variable not set"
        })?;

        let smtp_server = env::var("SMTP_SERVER").unwrap_or_else(|_| "smtp.gmail.com".to_string());

        let from_addr = env::var("SMTP_FROM").unwrap_or_else(|_| smtp_user.clone());

        // Create email with HTML and optional plain text parts
        let email_builder = Message::builder()
            .from(from_addr.parse()?)
            .reply_to(from_addr.parse()?)
            .to(to.parse()?)
            .subject(subject);

        let email = if let Some(plain_text) = text_body {
            // Send both HTML and plain text versions
            email_builder.multipart(
                MultiPart::alternative()
                    .singlepart(
                        SinglePart::builder()
                            .header(ContentType::TEXT_PLAIN)
                            .body(plain_text.to_string()),
                    )
                    .singlepart(
                        SinglePart::builder()
                            .header(ContentType::TEXT_HTML)
                            .body(html_body.to_string()),
                    ),
            )?
        } else {
            // Send only HTML version
            email_builder.singlepart(
                SinglePart::builder()
                    .header(ContentType::TEXT_HTML)
                    .body(html_body.to_string()),
            )?
        };

        let creds = Credentials::new(smtp_user, smtp_pass);

        let mailer = SmtpTransport::relay(&smtp_server)?
            .credentials(creds)
            .build();

        mailer.send(&email).map_err(|e| {
            eprintln!("Failed to send HTML email to: {}", to);
            e
        })?;

        println!("HTML email sent successfully to: {}", to);
        Ok(())
    }

    // Helper function to generate HTML email template
    pub fn generate_email_html(name: &str, message: &str) -> String {
        format!(
            r#"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Submission Received</title>
    <style>
        body {{
            font-family: system-ui, sans-serif, 'Ariel';
            line-height: 1.4;
            color: #222;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }}
        .container {{
            width: max(350px, 70%);
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            border: 2px solid #2222221c;
        }}
        .header {{
            text-align: center;
            color: #2c3e50;
            border-bottom: 2px solid #2222221c;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }}
        .content {{
            font-size: 15px;
            margin-bottom: 30px;
        }}
        .highlight {{
            color: #34db69;
            font-weight: bold;
        }}
        .footer {{
            text-align: center;
            text-wrap: balance;
            color: #7f8c8d;
            border-top: 1px solid #ecf0f1;
            padding-top: 20px;
            margin-top: 30px;
            font-size: 12px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤩 Thank You for Your Submission!</h1>
        </div>
        
        <div class="content">
            <p>Hello <span class="highlight">{}</span>,</p>
            
            <p>Thank you for reaching out! I have received your message and will respond to your queries shortly 🫡.</p>
            
            <p><strong>Your message:</strong></p>
            <blockquote style="padding: 10px; border-left: 2px solid currentColor; margin: 10px 0; font-style: italic; font-size: 12px;">
                {}
            </blockquote>
            
            <p>I appreciate you taking the time to contact me, and I'll get back to you as soon as possible ⚡️⚡️⚡️.</p>
            
            <p>Best regards,<br>
            <strong>Nonso Martin</strong></p>
        </div>
        
        <div class="footer">
            <p>This is an automated response to confirm we received your form submission.</p>
            <p>If you didn't initiate this message please ignore.</p>
        </div>
    </div>
</body>
</html>
    "#,
            name, message
        )
    }

    // HTML escaping function to prevent XSS
    pub fn html_escape(input: &str) -> String {
        input
            .replace('&', "&amp;")
            .replace('<', "&lt;")
            .replace('>', "&gt;")
            .replace('"', "&quot;")
            .replace('\'', "&#x27;")
            .replace('/', "&#x2F;")
    }

    // Helper functions.
    pub fn sanitize_path(path: &str) -> String {
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

    pub fn is_safe_path(path: &Path) -> bool {
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

    pub fn get_mime_type(path: &Path) -> &'static str {
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

    pub fn parse_multipart_data(body: &str) -> HashMap<String, String> {
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

    pub fn parse_form_data(body: &str) -> HashMap<String, String> {
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

    pub fn url_decode(s: &str) -> String {
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

    // Sanitize email content to prevent header injection
    pub fn sanitize_email_content(input: &str) -> String {
        input
            .chars()
            .filter(|c| !matches!(c, '\r' | '\n' | '\0'))
            .collect()
    }

    // Helper function to detect potential XSS attempts
    pub fn contains_potential_xss(input: &str) -> bool {
        let input_lower = input.to_lowercase();
        let xss_patterns = [
            "<script",
            "</script",
            "javascript:",
            "vbscript:",
            "onload=",
            "onerror=",
            "onclick=",
            "onmouseover=",
            "onfocus=",
            "onblur=",
            "onchange=",
            "onsubmit=",
            "<iframe",
            "<object",
            "<embed",
            "<applet",
            "<meta",
            "<link",
            "data:text/html",
            "data:application",
            "&#",
            "&#x",
            "\\u",
            "\\x",
            "expression(",
            "url(",
            "@import",
            "behavior:",
            "-moz-binding:",
        ];

        xss_patterns
            .iter()
            .any(|pattern| input_lower.contains(pattern))
    }
}
