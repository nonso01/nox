// all useful fn, Structs, Enum, etc
// keep main.rs brief

pub mod nox_server {
    use std::{collections::HashMap, env, path::Path};

    use lettre::{
        transport::smtp::authentication::Credentials, // for emails
        Message,
        SmtpTransport,
        Transport,
    };

    pub struct FieldConstraint {
        pub name: &'static str,
        pub max_length: usize,
        pub required: bool,
        pub email: bool, // true for email field, enables regex validation
    }

    // constants
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

    /// Sends an email using lettre.
    ///
    /// # Arguments
    /// * `to` - Recipient email address
    /// * `subject` - Subject of the email
    /// * `body` - Text body of the email
    ///
    /// # Returns
    /// * `Result<(), Box<dyn std::error::Error>>` - Ok on success, Err on failure
    pub fn send_email(
        to: &str,
        subject: &str,
        body: &str,
    ) -> Result<(), Box<dyn std::error::Error>> {
        // Load credentials and SMTP server from environment variables for security
        let smtp_user = env::var("MY_EMAIL")?;
        let smtp_pass = env::var("MY_PASSWORD")?;
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

        mailer.send(&email)?;
        Ok(())
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
}
