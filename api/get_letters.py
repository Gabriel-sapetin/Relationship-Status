import os
import json
from http.server import BaseHTTPRequestHandler
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
            data = supabase.table("letters").select("*").order("created_at", desc=False).execute()

            letters = []
            for row in data.data:
                letters.append({
                    "filename":  str(row.get("id", "")),
                    "title":     row.get("title", "Untitled"),
                    "date":      row.get("created_at", "")[:10],
                    "content":   row.get("content", ""),
                    "image_url": row.get("image_url", "") or ""
                })

            body = json.dumps(letters).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(body)

        except Exception as e:
            err = json.dumps({"error": str(e)}).encode()
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(err)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def log_message(self, format, *args):
        pass