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

            action    = payload.get("action", "")
            item_id   = payload.get("id")
            supabase  = create_client(SUPABASE_URL, SUPABASE_KEY)

            if action == "toggle":
                achieved = payload.get("achieved", False)
                update_data = {"achieved": achieved}
                if achieved:
                    from datetime import datetime, timezone
                    update_data["achieved_at"] = datetime.now(timezone.utc).isoformat()
                else:
                    update_data["achieved_at"] = None
                supabase.table("bucket_list").update(update_data).eq("id", item_id).execute()
                self._json(200, {"success": True})

            elif action == "delete":
                supabase.table("bucket_list").delete().eq("id", item_id).execute()
                self._json(200, {"success": True})

            elif action == "edit":
                new_goal = payload.get("goal", "").strip()
                if not new_goal:
                    self._json(400, {"success": False, "error": "Goal required"})
                    return
                supabase.table("bucket_list").update({"goal": new_goal}).eq("id", item_id).execute()
                self._json(200, {"success": True})

            else:
                self._json(400, {"success": False, "error": "Unknown action"})

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