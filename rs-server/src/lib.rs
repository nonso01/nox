// all useful fn, Structs, Enum, etc
// keep main.rs brief

pub mod nox_server {
    use std::{collections::HashMap, path::Path};

    pub const REQUIRED_FIELDS: [&str; 3] = ["name", "email", "message"];

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
