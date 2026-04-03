import os
import json
from http.server import BaseHTTPRequestHandler
from supabase import create_client

# This MUST match your Vercel Environment Variables exactly
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") # This matches your screenshot!

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode('utf-8')
            payload = json.loads(body)

            title = payload.get("title", "").strip()
            content = payload.get("content", "").strip()

            if not title or not content:
                self._json(400, {"success": False, "error": "Title and content are required"})
                return

            # Check if variables were actually loaded
            if not SUPABASE_URL or not SUPABASE_KEY:
                self._json(500, {"success": False, "error": "Server keys missing in Vercel"})
                return

            supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
            
            # Perform the insert
            supabase.table("letters").insert({
                "title": title,
                "content": content
            }).execute()

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