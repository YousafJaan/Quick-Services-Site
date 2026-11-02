import sys
import os
import time
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

PORT = 8775
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
ARTIFACT_DIR = r"C:\Users\Huzaifa Mahi\.gemini\antigravity\brain\d511de33-215c-4c33-93b0-31494c23e917"

class ReusableHTTPServer(HTTPServer):
    allow_reuse_address = True

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

def run_server():
    os.chdir(ROOT_DIR)
    httpd = ReusableHTTPServer(('127.0.0.1', PORT), QuietHandler)
    httpd.serve_forever()

def main():
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    time.sleep(1)

    print(f"Server started on http://127.0.0.1:{PORT}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a fresh context with bypass service worker or incognito
        context = browser.new_context(viewport={'width': 1400, 'height': 900}, service_workers='block')
        page = context.new_page()

        # 1. Test Home Page (Light Mode)
        print("1. Loading Home Page...")
        page.goto(f"http://127.0.0.1:{PORT}/academy/#/")
        page.wait_for_selector(".claude-home-hero-title", timeout=10000)
        time.sleep(1.5)

        home_light_path = os.path.join(ARTIFACT_DIR, "verified_home_hero_light.png")
        page.screenshot(path=home_light_path)
        print(f"  Saved Light Home Hero: {home_light_path}")

        # 2. Test Home Page (Dark Mode)
        print("2. Switching to Dark Theme via click...")
        page.click("button[data-set-theme='dark']")
        time.sleep(1.5)

        home_dark_path = os.path.join(ARTIFACT_DIR, "verified_home_hero_dark.png")
        page.screenshot(path=home_dark_path)
        print(f"  Saved Dark Home Hero: {home_dark_path}")

        # 3. Test Certificate Hard-Lock View
        print("3. Testing Certificate Hard-Lock View (#certificate-thesis101)...")
        page.goto(f"http://127.0.0.1:{PORT}/academy/#certificate-thesis101")
        page.wait_for_selector(".eligibility-status-card", timeout=10000)
        time.sleep(1.5)

        # Ensure NO certificate-stage or identity-lock is present
        cert_stage_count = page.locator("#certificate-stage").count()
        identity_lock_count = page.locator("#lock-identity-btn").count()
        print(f"  Audit check: #certificate-stage count = {cert_stage_count} (Expected 0)")
        print(f"  Audit check: #lock-identity-btn count = {identity_lock_count} (Expected 0)")
        assert cert_stage_count == 0, "Security Failure: #certificate-stage rendered for unearned credential!"
        assert identity_lock_count == 0, "Security Failure: #lock-identity-btn rendered for unearned credential!"

        cert_dark_path = os.path.join(ARTIFACT_DIR, "verified_cert_hardlock_dark.png")
        page.screenshot(path=cert_dark_path)
        print(f"  Saved Locked Certificate View: {cert_dark_path}")

        # 4. Test Lesson Player (Video Lesson that crashed previously)
        print("4. Testing Lesson Player for Video Lesson thesis101_t3...")
        page.goto(f"http://127.0.0.1:{PORT}/academy/#lesson-thesis101-t3")
        page.wait_for_selector("#open-syllabus-drawer-btn", timeout=10000)
        time.sleep(1.5)

        # Check for crash message
        error_msg_count = page.locator("text=Unable to load lesson").count()
        print(f"  Audit check: 'Unable to load lesson' count = {error_msg_count} (Expected 0)")
        assert error_msg_count == 0, "Runtime Failure: Lesson failed to load!"

        lesson_dark_path = os.path.join(ARTIFACT_DIR, "verified_video_lesson_dark.png")
        page.screenshot(path=lesson_dark_path)
        print(f"  Saved Video Lesson View: {lesson_dark_path}")

        browser.close()

    print("\nALL VERIFICATIONS COMPLETED SUCCESSFULLY!")

if __name__ == '__main__':
    main()
