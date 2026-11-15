"""Local preview server.

Serves the site at http://localhost:4173 and applies the same security
headers that vercel.json applies on the live site, so anything the
Content-Security-Policy would block in production is also blocked here.

Usage (from the project folder):
    python tools/serve.py
"""

import json
import re
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4173


def load_header_rules():
    config = json.loads((ROOT / "vercel.json").read_text(encoding="utf-8"))
    return [
        (re.compile("^" + rule["source"] + "$"), rule["headers"])
        for rule in config.get("headers", [])
    ]


class Handler(SimpleHTTPRequestHandler):
    rules = load_header_rules()

    def do_GET(self):
        # Same as "cleanUrls" in vercel.json: /about serves about.html
        path = self.path.split("?", 1)[0].rstrip("/")
        if path and "." not in path.rsplit("/", 1)[-1] and (ROOT / (path.lstrip("/") + ".html")).is_file():
            self.path = path + ".html"
        super().do_GET()

    def end_headers(self):
        path = self.path.split("?", 1)[0]
        for pattern, headers in self.rules:
            if pattern.match(path):
                for header in headers:
                    # HSTS and HTTPS upgrades only make sense on the real HTTPS site.
                    if header["key"] == "Strict-Transport-Security":
                        continue
                    value = header["value"].replace("; upgrade-insecure-requests", "")
                    self.send_header(header["key"], value)
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    handler = partial(Handler, directory=str(ROOT))
    with ThreadingHTTPServer(("127.0.0.1", PORT), handler) as server:
        print(f"Serving {ROOT} at http://localhost:{PORT}  (Ctrl+C to stop)")
        server.serve_forever()
