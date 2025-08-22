#[allow(dead_code)]
use std::{
    fs,
    io::{prelude::*, BufReader},
    net::{TcpListener, TcpStream},
};

struct _NoxFormData {
    name: String,
    email: String,
    message: String,
    web_development: bool,
    frontend: bool,
    blender: bool,
}
// learn
fn main() {
    // println!("Rust Server");
    let listener = TcpListener::bind("127.0.0.1:7878").unwrap();

    for streams in listener.incoming() {
        let _stream = streams.unwrap();

        handle_connection(_stream);
        // println!("Connection established");
    }
}

fn handle_connection(mut stream: TcpStream) {
    let buf_reader = BufReader::new(&stream);
    let http_request: Vec<_> = buf_reader
        .lines()
        .map(|result| result.unwrap())
        .take_while(|line| !line.is_empty())
        .collect();

    let status_line = "HTTP/1.1 200 OK";
    let contents = fs::read_to_string("./src/hello.html")
        .unwrap_or(String::from("Hello the Html file could not loaded"));
    let length = contents.len();

    let response = format!("{status_line}\r\nContent-Length: {length}\r\n\r\n{contents}");

    stream.write_all(response.as_bytes()).unwrap();
    println!("Response: {http_request:#?}");
}
