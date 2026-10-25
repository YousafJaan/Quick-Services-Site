import asyncio
import os
import sys
import base64
from playwright.async_api import async_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ARTIFACT_DIR = r"C:\Users\Huzaifa Mahi\.gemini\antigravity\brain\63a27969-4728-4390-9bf9-667df514cc28"
TMP_IMG = os.path.join(ARTIFACT_DIR, "test_scholar_portrait.png")

from PIL import Image, ImageDraw

# Generate a high-quality genuine 200x200 PNG test image
img = Image.new("RGB", (200, 200), color="#102B4E")
draw = ImageDraw.Draw(img)
draw.ellipse([40, 40, 160, 160], fill="#B95335")
draw.rectangle([80, 80, 120, 120], fill="#DDE8DF")
img.save(TMP_IMG, "PNG")

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        console_errors = []
        page.on("console", lambda msg: print(f"  [BROWSER {msg.type.upper()}] {msg.text}"))
        page.on("pageerror", lambda err: print(f"  [PAGE ERROR] {err}"))

        # 1. Test PWA manifest in head
        print("Testing PWA Manifest & App Metadata...")
        await page.goto("http://127.0.0.1:8080/academy/", wait_until="networkidle")
        manifest_link = await page.query_selector("link[rel='manifest']")
        print(f"PWA Manifest link found: {bool(manifest_link)}")

        # 2. Test Scholar Profile & Avatar Upload in #learning
        print("Navigating to My Learning (#learning)...", flush=True)
        await page.goto("http://127.0.0.1:8080/academy/#learning", wait_until="networkidle")
        await page.wait_for_timeout(1000)

        avatar_btn = await page.query_selector("#dashboard-upload-avatar-btn")
        print(f"Upload avatar button found: {bool(avatar_btn)}", flush=True)
        if avatar_btn:
            await avatar_btn.click()
            await page.wait_for_timeout(500)
            modal = await page.query_selector("#avatar-modal-overlay.active")
            print(f"Avatar upload modal active: {bool(modal)}", flush=True)

            # Set test image input
            file_input = await page.query_selector("#avatar-uploader-input")
            if file_input:
                await file_input.set_input_files(TMP_IMG)
                try:
                    await page.wait_for_selector("#avatar-preview-area", state="visible", timeout=5000)
                    print("Avatar preview area became visible!", flush=True)
                except Exception as e:
                    print(f"Warning waiting for avatar-preview-area: {e}", flush=True)

                preview = await page.query_selector("#avatar-preview-area")
                preview_display = await preview.evaluate("el => el.style.display")
                print(f"Avatar preview display after compression: {preview_display}", flush=True)

                save_btn = await page.wait_for_selector("#save-avatar-btn", state="visible", timeout=5000)
                await save_btn.click()
                await page.wait_for_timeout(1000)

        # Verify avatar updated on dashboard & header
        profile_avatar_src = await page.evaluate("() => document.getElementById('profile-avatar-display')?.src")
        header_avatar_src = await page.evaluate("() => document.querySelector('.header-mini-avatar')?.src")
        print(f"Profile avatar source updated: {bool(profile_avatar_src and 'data:image' in profile_avatar_src)}")
        print(f"Header mini avatar source updated: {bool(header_avatar_src and 'data:image' in header_avatar_src)}")

        # 3. Test Research Figure & Table Upload in #learning
        print("Testing Research Figure upload...", flush=True)
        fig_btn = await page.query_selector("#dashboard-upload-figure-btn")
        if fig_btn:
            await fig_btn.click()
            await page.wait_for_timeout(500)
            fig_modal = await page.query_selector("#fig-modal-overlay.active")
            print(f"Figure upload modal active: {bool(fig_modal)}", flush=True)

            fig_file_input = await page.query_selector("#fig-uploader-input")
            if fig_file_input:
                await fig_file_input.set_input_files(TMP_IMG)
                try:
                    await page.wait_for_selector("#fig-details-area", state="visible", timeout=5000)
                    print("Figure details area became visible!", flush=True)
                except Exception as e:
                    print(f"Figure details wait warning: {e}", flush=True)

                title_input = await page.query_selector("#fig-title-input")
                caption_input = await page.query_selector("#fig-caption-input")
                await title_input.fill("Table 4.1 Multiple Linear Regression Coefficients (SPSS 29)")
                await caption_input.fill("Model summary: R2 = 0.428, F(5, 244) = 36.52, p < .001. All VIF < 2.5.")

                save_fig_btn = await page.wait_for_selector("#save-fig-btn", state="visible", timeout=5000)
                await save_fig_btn.click()
                await page.wait_for_timeout(1000)

        # Verify figure card appears in the gallery
        figure_cards = await page.query_selector_all(".claude-figure-card")
        print(f"Research figure cards in gallery: {len(figure_cards)}", flush=True)

        # Screenshot Dashboard with Profile Avatar & Figures Vault
        dash_screenshot = os.path.join(ARTIFACT_DIR, "webapp_dashboard_profile_figures.png")
        await page.screenshot(path=dash_screenshot, full_page=False)
        print(f"Dashboard screenshot saved: {dash_screenshot}", flush=True)

        # 4. Test Lesson Notes with Screenshot Attachment (#lesson-thesis101-t1)
        print("Navigating to Lesson Player (#lesson-thesis101-t1)...", flush=True)
        await page.goto("http://127.0.0.1:8080/academy/#lesson-thesis101-t1", wait_until="networkidle")
        await page.wait_for_timeout(1500)

        notes_panel = await page.query_selector("#lesson-notes-panel")
        print(f"Lesson notes panel found: {bool(notes_panel)}", flush=True)

        if notes_panel:
            await notes_panel.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)

            note_input = await page.query_selector("#lesson-note-text")
            await note_input.fill("Key doctoral defense requirement: Ensure problem statement explicitly operationalizes IV, Mediator, and DV under FINER criteria.")

            note_file_input = await page.query_selector("#lesson-note-file-input")
            if note_file_input:
                await note_file_input.set_input_files(TMP_IMG)
                await page.wait_for_timeout(800)

            save_note_btn = await page.query_selector("#lesson-note-save-btn")
            await save_note_btn.click()
            await page.wait_for_timeout(1000)

            saved_notes = await page.query_selector_all(".claude-note-item")
            print(f"Saved notes count: {len(saved_notes)}", flush=True)

            # Screenshot lesson notes with attachment
            notes_screenshot = os.path.join(ARTIFACT_DIR, "webapp_lesson_notes_attached.png")
            await page.screenshot(path=notes_screenshot, full_page=False)
            print(f"Lesson notes screenshot saved: {notes_screenshot}", flush=True)

        # 5. Test Certificate View with Verified Scholar Photo Seal
        print("Navigating to Certificate View (#certificate-thesis101)...", flush=True)
        await page.goto("http://127.0.0.1:8080/academy/#certificate-thesis101", wait_until="networkidle")
        await page.wait_for_timeout(1200)

        # Check if verified scholar photo rendered on certificate
        cert_photo = await page.query_selector("#certificate-stage img[alt='Verified Scholar']")
        print(f"Verified scholar photo rendered on certificate: {bool(cert_photo)}", flush=True)

        cert_screenshot = os.path.join(ARTIFACT_DIR, "webapp_certificate_with_photo.png")
        await page.screenshot(path=cert_screenshot, full_page=False)
        print(f"Certificate screenshot saved: {cert_screenshot}", flush=True)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
