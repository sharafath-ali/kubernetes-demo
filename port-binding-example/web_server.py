import sys
from http.server import HTTPServer, BaseHTTPRequestHandler

class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Build the HTML response
        html = """
        <!DOCTYPE html>
        <html>
        <head><title>Python in Docker</title></head>
        <body style="font-family: Arial; text-align: center; padding: 50px; background: #f0f4f8;">
            <h1>🐳 Hello from Python inside Docker!</h1>
            <p>This server is running <strong>inside a Docker container</strong>.</p>
            <p>You are accessing it from your local machine via <strong>port binding</strong>.</p>
            <p style="color: gray;">Path: {}</p>
        </body>
        </html>
        """.format(self.path)

        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(html.encode())

    def log_message(self, format, *args):
        print(f"[REQUEST] {self.address_string()} - {format % args}")

if __name__ == "__main__":
    PORT = 8080
    server = HTTPServer(("0.0.0.0", PORT), SimpleHandler)
    print(f"✅ Server running on port {PORT}")
    print(f"   Open http://localhost:{PORT} in your browser")
    print(f"   Press Ctrl+C to stop\n")
    sys.stdout.flush()  # Force output immediately (Docker buffers stdout by default)
    server.serve_forever()
