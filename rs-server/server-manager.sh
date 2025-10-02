#!/usr/bin/env bash

SERVER_NAME="nox"
SERVER_DIR="$(dirname "$(realpath "$0")")"
PID_FILE="$PREFIX/tmp/$SERVER_NAME.pid"
LOG_FILE="$PREFIX/tmp/$SERVER_NAME.log"
BINARY_PATH="$SERVER_DIR/target/release/$SERVER_NAME"

start_server() {
    if [ -f "$PID_FILE" ]; then
        if kill -0 $(cat "$PID_FILE") 2>/dev/null; then
            echo "Server is already running (PID: $(cat "$PID_FILE"))"
            return 1
        else
            rm "$PID_FILE"
        fi
    fi

    echo "Starting server..."
    cd "$SERVER_DIR"
    
    cargo build --release
    
    if [ ! -f "$BINARY_PATH" ]; then
        echo "Build failed or binary not found at: $BINARY_PATH"
        return 1
    fi
    
    nohup "$BINARY_PATH" > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    
    echo "Server started with PID: $(cat "$PID_FILE")"
    echo "Logs: $LOG_FILE"
}

stop_server() {
    if [ ! -f "$PID_FILE" ]; then
        echo "Server is not running"
        return 1
    fi
    
    PID=$(cat "$PID_FILE")
    if kill -0 "$PID" 2>/dev/null; then
        echo "Stopping server (PID: $PID)..."
        kill "$PID"
        rm "$PID_FILE"
        echo "Server stopped"
    else
        echo "Server process not found, removing stale PID file"
        rm "$PID_FILE"
    fi
}

restart_server() {
    stop_server
    sleep 2
    start_server
}

status() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            echo "Server is running (PID: $PID)"
            cat "$LOG_FILE" # log file
        else
            echo "Server is not running (stale PID file)"
            rm "$PID_FILE"
        fi
    else
        echo "Server is not running"
    fi
}

logs() {
    if [ -f "$LOG_FILE" ]; then
        tail -f "$LOG_FILE"
    else
        echo "Log file not found"
    fi
}

case "$1" in
    start)   start_server ;;
    stop)    stop_server ;;
    restart) restart_server ;;
    status)  status ;;
    logs)    logs ;;
    *)       echo "Usage: $0 {start|stop|restart|status|logs}" ;;
esac