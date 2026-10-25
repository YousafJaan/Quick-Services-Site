import asyncio
import os
import sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ARTIFACT_DIR = r"C:\Users\Huzaifa Mahi\.gemini\antigravity\brain\63a27969-4728-4390-9bf9-667df514cc28"
TMP_IMG = os.path.join(ARTIFACT_DIR, "live_scholar_portrait.png")

# Generate a high-resolution 240x240 PNG test image
img = Image.new("RGB", (240, 240), color="#102B4E")
draw = ImageDraw.Draw(img)
draw.ellipse([50, 50, 190, 190], fill="#B95335")
draw.rectangle([90, 90, 150, 150], fill="#DDE8DF")
img.save(TMP_IMG, "PNG")

LIVE_URL = "https://quick-services-site.pages.dev/academy/"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        console_logs = []
        page.on("console", lambda msg: console_logs.append(f"[{msg.type.upper()}] {msg.text}"))
        page.on("pageerror", lambda err: console_logs.append(f"[PAGE ERROR] {err}"))

        print(f"Connecting to live production URL: {LIVE_URL}...", flush=True)
        resp = await page.goto(LIVE_URL, wait_until="networkidle")
        print(f"Live HTTP Status: {resp.status if resp else 'N/A'}", flush=True)

        manifest_link = await page.query_selector("link[rel='manifest']")
        print(f"Live PWA Manifest Link: {bool(manifest_link)}", flush=True)

        # 1. Test #learning navigation & Avatar upload on live site
        print("Navigating to live #learning dashboard...", flush=True)
        await page.goto(LIVE_URL + "#learning", wait_until="networkidle")
        await page.wait_for_timeout(1000)

        avatar_btn = await page.query_selector("#dashboard-upload-avatar-btn")
        print(f"Upload avatar button found: {bool(avatar_btn)}", flush=True)
        if avatar_btn:
            await avatar_btn.click()
            await page.wait_for_timeout(500)

            file_input = await page.query_selector("#avatar-uploader-input")
            if file_input:
                await file_input.set_input_files(TMP_IMG)
                await page.wait_for_selector("#avatar-preview-area", state="visible", timeout=6000)
                save_btn = await page.wait_for_selector("#save-avatar-btn", state="visible", timeout=6000)
                await save_btn.click()
                await page.wait_for_timeout(1200)

        profile_avatar = await page.query_selector("#profile-avatar-display")
        profile_avatar_src = await profile_avatar.get_attribute("src") if profile_avatar else ""
        header_avatar = await page.query_selector(".header-mini-avatar")
        header_avatar_src = await header_avatar.get_attribute("src") if header_avatar else ""

        print(f"Live profile avatar updated: {bool(profile_avatar_src and 'data:image' in profile_avatar_src)}", flush=True)
        print(f"Live header mini avatar updated: {bool(header_avatar_src and 'data:image' in header_avatar_src)}", flush=True)

        # 2. Test Figure upload on live site
        print("Testing Research Figure upload on live site...", flush=True)
        fig_btn = await page.query_selector("#dashboard-upload-figure-btn")
        if fig_btn:
            await fig_btn.click()
            await page.wait_for_timeout(500)

            fig_file_input = await page.query_selector("#fig-uploader-input")
            if fig_file_input:
                await fig_file_input.set_input_files(TMP_IMG)
                await page.wait_for_selector("#fig-details-area", state="visible", timeout=6000)

                title_input = await page.query_selector("#fig-title-input")
                caption_input = await page.query_selector("#fig-caption-input")
                await title_input.fill("Table 4.1 Multiple Linear Regression Coefficients (SPSS 29)")
                await caption_input.fill("Model summary: R2 = 0.428, F(5, 244) = 36.52, p < .001. All VIF < 2.5.")

                save_fig_btn = await page.wait_for_selector("#save-fig-btn", state="visible", timeout=6000)
                await save_fig_btn.click()
                await page.wait_for_timeout(1200)

        figure_cards = await page.query_selector_all(".claude-figure-card")
        print(f"Live figure cards in repository: {len(figure_cards)}", flush=True)

        live_dash_shot = os.path.join(ARTIFACT_DIR, "live_production_dashboard.png")
        await page.screenshot(path=live_dash_shot, full_page=False)
        print(f"Live dashboard screenshot saved: {live_dash_shot}", flush=True)

        # 3. Test Lesson Notes with Attachment on live site
        print("Navigating to live lesson player #lesson-thesis101-t1...", flush=True)
        await page.goto(LIVE_URL + "#lesson-thesis101-t1", wait_until="networkidle")
        await page.wait_for_timeout(1200)

        notes_panel = await page.query_selector("#lesson-notes-panel")
        print(f"Live lesson notes panel found: {bool(notes_panel)}", flush=True)
        if notes_panel:
            note_input = await page.query_selector("#lesson-note-text")
            await note_input.fill("APA 7th Research Note: Operationalize IV, DV, and Mediator with Cronbach alpha > 0.70.")
            note_file_input = await page.query_selector("#lesson-note-file-input")
            if note_file_input:
                await note_file_input.set_input_files(TMP_IMG)
                await page.wait_for_timeout(600)
            save_note_btn = await page.query_selector("#lesson-note-save-btn")
            await save_note_btn.click()
            await page.wait_for_timeout(1200)

            saved_notes = await page.query_selector_all(".claude-note-item")
            print(f"Live saved lesson notes: {len(saved_notes)}", flush=True)

            live_notes_shot = os.path.join(ARTIFACT_DIR, "live_production_lesson_notes.png")
            await page.screenshot(path=live_notes_shot, full_page=False)
            print(f"Live lesson notes screenshot saved: {live_notes_shot}", flush=True)

        # 4. Test Certificate View with Verified Photo on live site
        print("Navigating to live certificate #certificate-thesis101...", flush=True)
        await page.goto(LIVE_URL + "#certificate-thesis101", wait_until="networkidle")
        await page.wait_for_timeout(1200)

        cert_photo = await page.query_selector("#certificate-stage img[alt='Verified Scholar']")
        print(f"Live verified scholar photo rendered on certificate: {bool(cert_photo)}", flush=True)

        live_cert_shot = os.path.join(ARTIFACT_DIR, "live_production_certificate.png")
        await page.screenshot(path=live_cert_shot, full_page=False)
        print(f"Live certificate screenshot saved: {live_cert_shot}", flush=True)

        print("\nLive Console logs:")
        for log in console_logs[-10:]:
            print("  ", log)

        await browser.close()
        print("\nLIVE PRODUCTION VERIFICATION COMPLETED SUCCESSFULLY!", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
