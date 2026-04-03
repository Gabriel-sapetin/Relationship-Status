import os
import json
import cgi
import io
from http.server import BaseHTTPRequestHandler
import cloudinary
import cloudinary.uploader
from supabase import create_client

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_type = self.headers.get("Content-Type", "")
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)

            environ = {
                "REQUEST_METHOD": "POST",
                "CONTENT_TYPE":   content_type,
                "CONTENT_LENGTH": str(len(body)),
                "wsgi.input":     io.BytesIO(body),
            }
            form = cgi.FieldStorage(fp=io.BytesIO(body), environ=environ)

            file_item  = form.getvalue("image")
            letter_id  = form.getvalue("letter_id")

            if not file_item or not letter_id:
                self._json(400, {"success": False, "error": "Missing image or letter_id"})
                return

            result = cloudinary.uploader.upload(
                io.BytesIO(file_item) if isinstance(file_item, bytes) else file_item,
                folder="letter_images"
            )
            image_url = result["secure_url"]

            supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
            supabase.table("letters").update({"image_url": image_url}).eq("id", letter_id).execute()

            self._json(200, {"success": True, "image_url": image_url})
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