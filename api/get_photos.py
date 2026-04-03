import os
import json
from http.server import BaseHTTPRequestHandler
import cloudinary
import cloudinary.api

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            resources = cloudinary.api.resources(type="upload", max_results=100)
            photos = []
            for r in resources.get("resources", []):
                photos.append({
                    "filename": r["public_id"],
                    "url":      r["secure_url"],
                    "caption":  r.get("context", {}).get("custom", {}).get("caption", "")
                })
            body = json.dumps(photos).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(body)
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())