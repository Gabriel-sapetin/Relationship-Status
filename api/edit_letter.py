import os
import json
from http.server import BaseHTTPRequestHandler
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            payload = json.loads(body.decode("utf-8"))

            letter_id   = payload.get("id", "").strip()
            new_title   = payload.get("title", "").strip()
            new_content = payload.get("content", "").strip()

            if not letter_id or not new_title or not new_content:
                self._json(400, {"success": False, "error": "Missing fields"})
                return

            supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
            supabase.table("letters").update({
                "title":   new_title,
                "content": new_content
            }).eq("id", letter_id).execute()

            self._json(200, {"success": True})

        except Exception as e:
            self._json(500, {"success": False, "error": str(e)})

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def _json(self, code, data):
        body = json.dumps(data).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        pass