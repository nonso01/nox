# Project Documentation
>
> working branch will be `v0.10`

## Server Side `RUST`

A production-ready, security-focused HTTP server built in Rust for handling web requests, form submissions, and email notifications.

### Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Security Features](#security-features)
- [Getting Started](#getting-started)
- [Request Flow](#request-flow)
- [Core Components](#core-components)
- [Configuration](#configuration)
- [API Routes](#api-routes)
- [Security Implementation Details](#security-implementation-details)
- [Deployment](#deployment)

---

### Overview

NOX Server is a custom HTTP server implementation that prioritizes security, performance, and reliability. Built entirely in Rust without heavyweight web frameworks, it demonstrates low-level network programming with enterprise-grade security practices.

**Key Features:**
-  Multi-threaded request handling with custom thread pool
-  Comprehensive input validation and sanitization
-  Rate limiting per IP address
-  CORS support (same-origin and cross-origin modes)
-  XSS and injection attack prevention
-  Email notification system with HTML support
-  Static file serving with MIME type detection
-  Graceful error handling and recovery

**Tech Stack:**
- **Language**: `Rust`
- **Key Dependencies**: 
  - `regex` - Pattern matching with ReDoS protection
  - `lettre` - Email sending via SMTP

---

### Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     TCP Listener                         │
│                    (Port 8080/Custom)                    │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│                   Thread Pool (4 Workers)                │
│  ┌──────────────────────────────────────────────────┐    │
│  │  Rate Limiter Check (100 req/hour per IP)        │    │
│  └──────────────────────────────────────────────────┘    │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Connection Handler (Per Request)            │
│  1. Parse request line                                   │
│  2. Parse headers (with security limits)                 │
│  3. Validate content length                              │
│  4. Check CORS origin                                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    Route Matching                        │
│  ┌──────────┬──────────┬──────────┬──────────────────┐  │
│  │  Static  │ Contact  │   API    │    Not Found     │  │
│  │  Files   │   Form   │ Endpoints│                  │  │
│  └──────────┴──────────┴──────────┴──────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Request Handlers                         │
│  • Form validation & sanitization                        │
│  • Email generation & sending                            │
│  • Static file serving                                   │
│  • JSON API responses                                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  HTTP Response                           │
│  • CORS headers                                          │
│  • Security headers (X-Content-Type-Options, etc.)       │
│  • Proper status codes                                   │
└─────────────────────────────────────────────────────────┘
```

---

### Security Features

#### 1. **Rate Limiting**
- **Per-IP tracking**: 100 requests per hour per unique IP address
- **Sliding window**: 60-minute rolling window that cleans expired entries
- **Early rejection**: Rate limit checks happen before request processing
- **Thread-safe**: Uses `Arc<Mutex>` for concurrent access

```rust
// Rate limiter configuration
const WINDOW_LIMIT_MINS: u64 = 60;  // 1 hour window
max_requests_per_hour: 100          // Limit per IP
```

#### 2. **Input Validation & Sanitization**

**Request Line Protection:**
- Maximum request line size: 8KB (`MAX_REQUEST_LINE_SIZE`)
- Maximum header line size: 8KB (`MAX_HEADER_LINE_SIZE`)
- Maximum header count: 50 headers
- Empty request rejection

**Content Length Limits:**
- Maximum content length: 50KB (`MAX_CONTENT_LENGTH`)
- Maximum form data: 10KB (`MAX_FORM_DATA_LENGTH`)
- Early validation before memory allocation

**Form Field Validation:**
```
// Field constraints enforced
- name: max 40 chars, required
- email: max 80 chars, required, validated with regex
- message: max 2000 chars, required
- checkboxes: only "on" value allowed if present
```

#### 3. **XSS Prevention**
- **HTML escaping**: All user inputs are escaped before rendering
- **Pattern detection**: Scans for 25+ malicious patterns including:
  - Script tags (`<script`, `</script>`)
  - Event handlers (`onclick=`, `onerror=`, etc.)
  - Protocol handlers (`javascript:`, `data:`, etc.)
  - Encoding attempts (`&#`, `\u`, `\x`)

```rust
// Detected patterns include
"<script", "javascript:", "onload=", "onerror=", 
"<iframe", "data:text/html", "&#", "\\u", 
//etc.
```

#### 4. **Email Injection Prevention**
- Strips carriage returns (`\r`), newlines (`\n`), and null bytes (`\0`)
- Validates email format with ReDoS-resistant regex
- Enforces RFC 5321 limits:
  - Local part: max 64 characters
  - Domain part: max 253 characters
  - Total email: max 254 characters

#### 5. **Path Traversal Protection**
- **Path sanitization**: Removes `..`, `.`, and leading slashes
- **Canonical path validation**: Ensures file access stays within `/dist` directory
- **URL decoding**: Prevents encoded path traversal attempts

#### 6. **CORS Security**
- **Two modes**: `same-origin` (default) and `cross-origin`
- **Origin validation**: Only allowed origins receive CORS headers
- **Preflight handling**: Proper OPTIONS request validation
- **Credentials support**: Enables secure cookie/auth handling

#### 7. **ReDoS Protection**
- Uses simplified email regex to avoid catastrophic backtracking
- Pattern: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
- Additional length checks before regex evaluation

---

### Getting Started

#### Prerequisites
- Rust 1.70+ (`rustc --version`)
- Cargo (comes with Rust)

#### Installation

1. **Clone the repository**
```sh
git clone https://github.com/nonso01/nox.git
cd nox/server
```

2. **Set up environment variables**
Create a `.env` file in the project root:
```sh
# Server Configuration
HOST=127.0.0.1
PORT=8080
CORS_MODE=same-origin  # or "cross-origin"

# Email Configuration (for contact form)
# you might consider using quotes
MY_EMAIL=your-email@gmail.com
MY_PASSWORD=your-app-password
SMTP_SERVER=smtp.gmail.com
SMTP_FROM=your-email@gmail.com
```

3. **Build, and Run the project**
```sh
# grant permission first
./server-manager start
```

4. **Preview logs**
```sh
./server-magager logs
```

The server will start on `http://127.0.0.1:8080` by default.

---

### Request Flow

#### 1. Connection Acceptance
```rust
// Main loop accepts incoming TCP connections
for stream in listener.incoming() {
    match stream {
        Ok(stream) => pool.execute(stream),  
        // Send to thread pool
        Err(e) => eprintln!("Connection failed: {}", e),
    }
}
```

#### 2. Worker Thread Processing
Each worker thread:
1. **Receives TCP stream** from channel
2. **Sets socket timeout** (30 seconds)
3. **Checks rate limit** for client IP
4. **Reads request line** with size validation
5. **Parses headers** securely
6. **Validates method** against CORS config

#### 3. Route Matching
```rust
enum Route {
    Static,        // GET / or static files
    ContactForm,   // POST /contact or /api/contact
    ApiStatus,     // GET /api/status
    ApiHealth,     // GET /api/health
    NotFound,      // Everything else
}
```

#### 4. Request Handling

**POST /contact Flow:**
```
1. Validate content length (< 50KB)
2. Read request body
3. Parse form data (URL-encoded or multipart)
4. Validate all fields against constraints
5. Check for XSS/injection attempts
6. Sanitize email addresses
7. Send confirmation email (HTML + plaintext)
8. Return success/error HTML response
```

**GET /api/status Flow:**
```
1. Generate timestamp
2. Build JSON response: {"status":"healthy","version":"1.0.0","timestamp":...}
3. Add CORS headers if origin allowed
4. Return 200 OK
```

**GET / (Static Files) Flow:**
```
1. Sanitize requested path
2. Check path traversal protection
3. Resolve to index.html if directory
4. Read file content
5. Determine MIME type
6. Return file with proper Content-Type
```

---

### Core Components

#### SecurityConfig
Defines global security constraints for the server.

```rust
struct SecurityConfig {
    max_content_length: usize,      // 50KB - prevents memory exhaustion
    max_connections: usize,         // 100 - max concurrent connections
    connection_timeout: Duration,   // 30s - prevents slowloris attacks
    max_requests_per_hour: usize,   // 100 - rate limit threshold
    enable_rate_limiting: bool,     // true - toggle rate limiting
}
```

**Usage:**
```rust
let security_config = SecurityConfig::new();  // Uses default values
```

#### CorsConfig
Manages Cross-Origin Resource Sharing settings.

```rust
struct CorsConfig {
    allow_origins: Vec<String>,      // Whitelist of allowed origins
    allow_all_origins: bool,         // Allow * (dev only)
    allow_methods: Vec<String>,      // Allowed HTTP methods
    allow_headers: Vec<String>,      // Allowed request headers
    max_age: u32,                    // Preflight cache duration (seconds)
}
```

**Modes:**

**Same-Origin Mode** (production default):
```rust
allow_origins: vec![],               // No explicit origins needed
allow_methods: ["GET", "POST", "OPTIONS"]
max_age: 3600                        // 1 hour cache
```

**Cross-Origin Mode** (for separate frontends):
```rust
allow_origins: vec![
    "http://localhost:5173",         // React dev server
    "https://nox-dev.vercel.app"     // Production frontend
]
allow_methods: ["GET", "POST", "OPTIONS"]
allow_headers: ["Content-Type", "Authorization", ...]
max_age: 86400                       // 24 hour cache
```

#### ThreadPool
Custom implementation for concurrent request handling.

```rust
struct ThreadPool {
    workers: Vec<Worker>,                    // Worker threads
    sender: Option<mpsc::Sender<TcpStream>>, // Channel sender
    cors_config: CorsConfig,                 // CORS configuration
    rate_limiter: Arc<RateLimiter>,          // Shared rate limiter
    security_config: SecurityConfig,         // Security settings
}
```

**Design:**
- **Fixed size**: 4 worker threads by default
- **Shared channel**: Workers receive tasks via `mpsc::channel`
- **Shared state**: Rate limiter wrapped in `Arc<Mutex>` for thread safety
- **Graceful shutdown**: `Drop` implementation ensures clean worker termination

**Execution Flow:**
```rust
pool.execute(stream)  // Main thread
    ↓
sender.send(stream)   // Send to channel
    ↓
receiver.recv()       // Worker receives
    ↓
handle_connection()   // Process request
```

#### RateLimiter
Tracks request counts per client IP with sliding window.

```rust
pub struct RateLimiter {
    requests: Arc<Mutex<HashMap<String, Vec<Instant>>>>,
    max_requests: usize,        // 100 requests
    window_duration: Duration,  // 60 minutes
}
```

**Algorithm:**
1. Lock the shared HashMap
2. Get current timestamp
3. Remove expired entries (older than window)
4. Check if count < max_requests
5. If allowed, add new timestamp
6. Return true/false

**Example:**
```rust
if rate_limiter.is_allowed(&client_ip) {
    // Process request
} else {
    // Return 429 Too Many Requests
}
```

#### ServerError
Custom error type for comprehensive error handling.

```rust
pub enum ServerError {
    IoError(std::io::Error),           // Network/file errors
    ParseError(String),                // Malformed requests
    ValidationError(String),           // Invalid input data
    EmailError(Box<dyn Error>),        // SMTP failures
    ThreadPoolError(String),           // Worker failures
    NetworkError(String),              // Connection issues
}
```

**Benefits:**
- **Type safety**: Compiler ensures all errors are handled
- **Context**: Each variant carries specific error information
- **Propagation**: Uses `?` operator for clean error bubbling
- **Display**: Implements `fmt::Display` for user-friendly messages

---

#### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `HOST` | Server bind address | `127.0.0.1` | No |
| `PORT` | Server port | `8080` | No |
| `CORS_MODE` | CORS mode (`same-origin` or `cross-origin`) | `same-origin` | No |
| `MY_EMAIL` | SMTP username | - | Yes (for email) |
| `MY_PASSWORD` | SMTP password/app password | - | Yes (for email) |
| `SMTP_SERVER` | SMTP server address | `smtp.gmail.com` | No |
| `SMTP_FROM` | From email address | `MY_EMAIL` value | No |

#### CORS Configuration

**To enable cross-origin requests:**
```sh
export CORS_MODE=cross-origin
```

**Edit allowed origins in `main.rs`:**
```rust
fn cross_origin_config() -> Self {
    CorsConfig {
        allow_origins: vec![
            "http://localhost:5173".to_string(),
            "https://your-frontend.com".to_string(),
        ],
        // ...
    }
}
```

#### Security Tuning

**Adjust rate limits:**
```rust
const WINDOW_LIMIT_MINS: u64 = 60;  // Change window duration
max_requests_per_hour: 100,         // Change request limit
```

**Adjust content limits:**
```rust
const MAX_CONTENT_LENGTH: usize = 50 * 1024;    // 50KB
const MAX_FORM_DATA_LENGTH: usize = 10 * 1024;  // 10KB
const MAX_REQUEST_LINE_SIZE: usize = 8192;      // 8KB
```

---

### API Routes

#### Static File Routes

##### `GET /`
Serves `index.html` from the `../dist` directory.

**Response:**
- Status: `200 OK`
- Content-Type: `text/html`
- Body: HTML file content

**Fallback:**
If `../dist` doesn't exist, serves `hello.html` from `src/` directory.

##### `GET /<path>`
Serves static files with automatic MIME type detection.

**Supported types:**
- HTML, CSS, JavaScript
- Images: PNG, JPG, GIF, SVG, ICO
- Fonts: WOFF, WOFF2, TTF, EOT
- 3D Models: GLB, GLTF
- Media: MP4, WEBM, MP3, WAV
- Documents: PDF, ZIP, TXT

**Security:**
- Path traversal protection enabled
- Files must be within `../dist` directory
- Returns 403 Forbidden for unsafe paths
- Returns 404 Not Found for missing files

---

#### Contact Form Route

##### `POST /contact` 
Handles form submissions with email notifications.

**Request Format:**
```
Content-Type: application/x-www-form-urlencoded
or
Content-Type: multipart/form-data
```

**Required Fields:**
```json
{
  "name": "string (max 40 chars)",
  "email": "string (max 80 chars, valid email)",
  "message": "string (max 2000 chars)"
}
```

**Optional Fields:**
```js
{
  "frontend": "on",        // Checkbox
  "webDevelopment": "on",  // Checkbox
  "blender": "on"          // Checkbox
}
```

**Validation Rules:**
- All required fields must be present
- Email must match regex pattern
- No XSS patterns allowed
- No control characters (except \n, \r, \t)
- Total form data < 10KB
- Maximum 2 suspicious patterns in message

**Success Response:**
```
Status: 200 OK
Content-Type: text/html

[HTML page with success message]
```

**Error Response:**
```
Status: 200 OK
Content-Type: text/html

[HTML page with error details]
```

**Email Behavior:**
- Sends HTML + plain text confirmation email
- Uses SMTP credentials from environment
- Falls back to plain text if HTML fails
- Logs email success/failure

**Example with cURL:**
```sh
curl -X POST http://localhost:8080/contact \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=John%20Doe&email=john@example.com&message=Hello%20World"
```

---

#### API Routes

##### `GET /api/status`
Health check endpoint with version information.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": 1697385600
}
```

- Status: `200 OK`
- Content-Type: `application/json`
- CORS: Allowed origins receive proper headers

##### `GET /api/health`
Simple health check endpoint.

**Response:**
```
Status: 200 OK
Content-Type: text/plain

OK
```

---

#### Error Routes

##### `404 Not Found`
Returned for:
- Non-existent API endpoints (paths starting with `/api/`)
- Invalid routes
- Missing static files

**Response:**
```
Status: 404 Not Found
Content-Type: text/html

<h1>404 Not Found</h1>
```

##### `405 Method Not Allowed`
Returned when HTTP method is not in CORS allowed methods.

**Response:**
```
Status: 405 Method Not Allowed
```

##### `429 Too Many Requests`
Returned when rate limit is exceeded.

**Response:**
```
Status: 429 Too Many Requests

Rate limit exceeded. Please try again later.
```

---

### Security Implementation Details

#### Form Validation Process

**Step 1: Field Presence Check**
```rust
// Verify no unexpected fields
let allowed_fields: HashSet<&str> = FIELD_CONSTRAINTS.iter()
    .map(|c| c.name)
    .collect();

let unexpected_fields: Vec<&String> = form_data.keys()
    .filter(|k| !allowed_fields.contains(k.as_str()))
    .collect();
```

**Step 2: Character Validation**
```rust
// Check for null bytes and control characters
if value.contains('\0') || value.chars().any(|c| 
    c.is_control() && c != '\n' && c != '\r' && c != '\t'
) {
    // Reject field
}
```

**Step 3: Length Validation**
```rust
if value.len() > constraint.max_length {
    errors.push(format!("{} too long", constraint.name));
}
```

**Step 4: Email Validation**
```rust
// ReDoS-resistant regex
let email_regex = Regex::new(
    r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
)?;

if !email_regex.is_match(value) {
    errors.push("Invalid email format");
}

// Additional RFC 5321 checks
let parts: Vec<&str> = value.split('@').collect();
if parts[0].len() > 64 {  // Local part limit
    errors.push("Email local part too long");
}
```

**Step 5: Spam Pattern Detection**
```rust
let suspicious_patterns = [
    "http://", "https://", "www.", ".com", ".org", 
    "<script", "<iframe", "javascript:", "data:"
];

let count = suspicious_patterns.iter()
    .filter(|p| value_lower.contains(*p))
    .count();

if count > 2 {
    errors.push("Message contains suspicious content");
}
```

**Step 6: XSS Scan**
```rust
for (field_name, value) in form_data {
    if contains_potential_xss(value) {
        errors.push(format!("Field '{}' contains malicious content", field_name));
    }
}
```

#### Header Parsing Security

**Limits Enforced:**
```rust
const MAX_HEADER_LINE_SIZE: usize = 8192;  // 8KB per header
const MAX_HEADERS: usize = 50;             // Max header count
const MAX_ORIGIN_LENGTH: usize = 200;      // Max origin header length
```

**Parsing Logic:**
```rust
fn parse_headers_secure(
    buf_reader: &mut BufReader<&mut TcpStream>,
    security_config: &SecurityConfig,
) -> ServerResult<(usize, Option<String>)> {
    let mut header_count = 0;
    
    loop {
        line.clear();
        buf_reader.read_line(&mut line)?;
        
        if line.trim().is_empty() { break; }  // End of headers
        
        header_count += 1;
        if header_count > MAX_HEADERS {
            return Err(ParseError("Too many headers"));
        }
        
        if line.len() > MAX_HEADER_LINE_SIZE {
            return Err(ParseError("Header line too long"));
        }
        
        // Parse Content-Length and Origin headers
        // Validate content length against max_content_length
    }
}
```

### CORS Security Model

**Origin Validation:**
```rust
fn is_origin_allowed(&self, origin: &str) -> bool {
    if self.allow_all_origins {
        return true;  // Dev mode only!
    }
    
    if self.allow_origins.is_empty() {
        return true;  // Same-origin mode
    }
    
    self.allow_origins.contains(&origin.to_string())
}
```

**Header Generation:**
```rust
fn get_cors_origin_header(cors_config: &CorsConfig, origin: Option<&str>) -> String {
    match origin {
        Some(origin_value) => {
            if cors_config.is_origin_allowed(origin_value) {
                // Send CORS headers for allowed origins
                if cors_config.allow_all_origins {
                    "Access-Control-Allow-Origin: *".to_string()
                } else {
                    format!(
                        "Access-Control-Allow-Origin: {}\r\n\
                         Access-Control-Allow-Credentials: true",
                        origin_value
                    )
                }
            } else {
                // CRITICAL: No CORS headers for disallowed origins
                "".to_string()
            }
        }
        None => {
            // Same-origin request
            if cors_config.allow_all_origins {
                "Access-Control-Allow-Origin: *".to_string()
            } else {
                "".to_string()
            }
        }
    }
}
```

**Preflight Handling:**
```rust
fn handle_preflight_request(stream, cors_config, origin) {
    let origin_header = get_cors_origin_header(cors_config, origin);
    
    // Block unauthorized origins
    if origin_header.is_empty() && origin.is_some() {
        let response = "HTTP/1.1 403 Forbidden\r\n\r\n";
        stream.write_all(response.as_bytes())?;
        return Ok(());
    }
    
    // Send preflight response for allowed origins
    let response = format!(
        "HTTP/1.1 200 OK\r\n\
         {}\r\n\
         Access-Control-Allow-Methods: {}\r\n\
         Access-Control-Allow-Headers: {}\r\n\
         Access-Control-Max-Age: {}\r\n\r\n",
        origin_header,
        cors_config.allow_methods.join(", "),
        cors_config.allow_headers.join(", "),
        cors_config.max_age
    );
    
    stream.write_all(response.as_bytes())?;
}
```

#### Email Security

**Sanitization Function:**
```rust
pub fn sanitize_email_content(input: &str) -> String {
    input.chars()
        .filter(|c| !matches!(c, '\r' | '\n' | '\0'))
        .collect()
}
```

**Why This Matters:**
Prevents **email header injection** attacks where attackers inject additional headers:
```
To: victim@example.com\r\nBcc: attacker@evil.com
```

**Applied To:**
- Recipient email address
- User name (displayed in email body)
- User message content

**HTML Email Generation:**
```rust
pub fn generate_email_html(name: &str, message: &str) -> String {
    // name and message are already sanitized before calling
    format!(
        r#"<!DOCTYPE html>
        <html>
        <body>
            <p>Hello <span class="highlight">{}</span>,</p>
            <blockquote>{}</blockquote>
        </body>
        </html>"#,
        name, message
    )
}
```

---

### Deployment

#### Using the Server Manager Script

The `server-manager.sh` script provides process management for production deployment.

**Commands:**

**Start the server:**
```sh
./server-manager.sh start
```
- Loads environment variables from `.env`
- Builds release binary
- Starts server in background
- Creates PID file at `$PREFIX/tmp/nox.pid`
- Logs output to `$PREFIX/tmp/nox.log`

**Stop the server:**
```sh
./server-manager.sh stop
```
- Reads PID from file
- Sends kill signal to process
- Removes PID file

**Restart the server:**
```sh
./server-manager.sh restart
```
- Stops the server
- Waits 2 seconds
- Starts the server

**Check status:**
```sh
./server-manager.sh status
```
- Shows if server is running
- Displays PID if active
- Detects stale PID files

**View logs:**
```sh
./server-manager.sh logs
```
- Tails the log file in real-time
- Use Ctrl+C to exit

### Manual Deployment

> todo

### Production Checklist

- [ ] Set `CORS_MODE=same-origin` for same-domain deployment
- [ ] Use strong SMTP app password (not account password)
- [ ] Configure firewall to allow only port 80/443
- [ ] Run server as non-root user
- [ ] Set up reverse proxy (nginx/Apache) for HTTPS
- [ ] Enable log rotation for `nox.log`
- [ ] Monitor rate limiter performance
- [ ] Set up health check monitoring (`/api/health`)
- [ ] Configure automated backups
- [ ] Test form submission end-to-end

> todo