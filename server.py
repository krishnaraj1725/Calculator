"""
Simple local server to run the calculator.
Usage:
    python server.py
Then open http://localhost:8000 in your browser.
"""
import http.server
import socketserver
import webbrowser
import os

PORT = 8000

os.chdir(os.path.dirname(os.path.abspath(__file__)))

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    url = f"http://localhost:{PORT}"
    print(f"Serving calculator at {url}")
    webbrowser.open(url)
    httpd.serve_forever()
