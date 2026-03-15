import sys
import os
from http.server import HTTPServer, BaseHTTPRequestHandler

class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Read index.html from disk on EVERY request
        # This means edits to index.html show up on browser refresh — no restart needed!
        html_path = os.path.join(os.path.dirname(__file__), "index.html")

        try:
            with open(html_path, "r", encoding="utf-8") as f:
                html = f.read()
            self.send_response(200)
            self.send_header("Content-type", "text/html")
        except FileNotFoundError:
            html = "<h1>Error: index.html not found</h1>"
            self.send_response(404)
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
    print(f"   Edit index.html and refresh — changes appear instantly!")
    print(f"   Press Ctrl+C to stop\n")
    sys.stdout.flush()  # Force output immediately (Docker buffers stdout by default)
    server.serve_forever()
