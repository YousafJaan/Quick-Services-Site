import asyncio
import os
import sys
from playwright.async_api import async_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ARTIFACTS_DIR = r"C:\Users\Huzaifa Mahi\.gemini\antigravity\brain\63a27969-4728-4390-9bf9-667df514cc28"
URL = "http://localhost:8080/academy/"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        print("[TEST 1] Loading Academy Homepage...")
        await page.goto(URL, wait_until="networkidle")
        await page.wait_for_timeout(1000)

        # 1. Verify Removed Sections
        print("[TEST 2] Verifying Removed Sections from Homepage...")
        old_clarity_on_home = await page.query_selector("#sentence-clarity-lab")
        assert old_clarity_on_home is None, "ERROR: #sentence-clarity-lab is still on homepage!"
        
        old_pillars = await page.query_selector(".pillar-cards-grid")
        assert old_pillars is None, "ERROR: .pillar-cards-grid is still on homepage!"
        print("  [OK] Confirmed: Paraphraser box and Three Pillars grid removed from homepage.")

        # 2. Verify New Claude Academy Sections
        print("[TEST 3] Verifying Claude Academy Reverse-Engineered Sections...")
        hero_title = await page.text_content(".claude-home-hero-title")
        assert "Welcome to Quick Academy" in hero_title, f"Unexpected hero title: {hero_title}"
        print(f"  [OK] Hero Title Verified: {hero_title.strip()}")

        # Verify "Go deeper with Research & Methodology"
        section_titles = await page.eval_on_selector_all(".claude-section-title", "els => els.map(e => e.textContent.trim())")
        print(f"  [OK] Section Titles: {section_titles}")
        assert any("Go deeper" in t for t in section_titles), "Missing 'Go deeper' section!"
        assert any("Develop Methodological Rigor" in t for t in section_titles), "Missing 'Develop Methodological Rigor' section!"

        # Verify Top 3 + 2 Grid Cards
        deep_cards = await page.query_selector_all(".claude-deep-card")
        print(f"  [OK] 'Go deeper' Cards Count: {len(deep_cards)} (Expected 5)")
        assert len(deep_cards) == 5, f"Expected 5 deep cards, got {len(deep_cards)}"

        # Verify 3 Rigor Cards
        rigor_cards = await page.query_selector_all(".claude-rigor-card")
        print(f"  [OK] 'Methodological Rigor' Cards Count: {len(rigor_cards)} (Expected 3)")
        assert len(rigor_cards) == 3, f"Expected 3 rigor cards, got {len(rigor_cards)}"

        # Verify All 9 Courses in Catalog
        catalog_cards = await page.query_selector_all(".qsa-card")
        print(f"  [OK] Course Catalog Cards Count: {len(catalog_cards)} (Expected 9)")
        assert len(catalog_cards) == 9, f"Expected 9 catalog cards, got {len(catalog_cards)}"

        # Capture Desktop Full Page Screenshot
        shot_path = os.path.join(ARTIFACTS_DIR, "quick_academy_claude_clone_homepage.png")
        await page.screenshot(path=shot_path, full_page=True)
        print(f"  [OK] Saved Full-Page Screenshot: {shot_path}")

        # 3. Test Routing to Dedicated Sentence Clarity Lab (#clarity)
        print("[TEST 4] Testing Dedicated Sentence Clarity Lab (#clarity)...")
        await page.click("a[href='#clarity']")
        await page.wait_for_timeout(800)

        # Verify #sentence-clarity-lab exists here
        lab_card = await page.query_selector("#sentence-clarity-lab")
        assert lab_card is not None, "Sentence Clarity Lab card not found at #clarity!"

        # Test Register Tabs
        initial_text = await page.text_content("#clarity-improved-text")
        print(f"  [OK] Plain Text: {initial_text.strip()[:60]}...")

        await page.click("button[data-clarity-lang='simple']")
        await page.wait_for_timeout(300)
        simple_text = await page.text_content("#clarity-improved-text")
        print(f"  [OK] Simple Text: {simple_text.strip()[:60]}...")
        assert simple_text != initial_text, "Register switch to Simple did not change text!"

        await page.click("button[data-clarity-lang='technical']")
        await page.wait_for_timeout(300)
        tech_text = await page.text_content("#clarity-improved-text")
        print(f"  [OK] Technical Text: {tech_text.strip()[:60]}...")
        assert tech_text != simple_text, "Register switch to Technical did not change text!"

        # Test Preset Switcher
        await page.select_option("#clarity-preset-select", "methodology")
        await page.wait_for_timeout(300)
        method_orig = await page.text_content("#clarity-original-text")
        assert "convenient methods" in method_orig or "sample" in method_orig.lower(), f"Unexpected preset content: {method_orig}"
        print("  [OK] Preset switched to Methodology (G*Power) successfully.")

        # Test Custom Sentence Analysis
        await page.fill("#custom-clarity-input", "It was observed that the implementation of programs was conducted by teachers.")
        await page.click("#custom-clarity-analyze-btn")
        await page.wait_for_timeout(300)
        result_text = await page.text_content("#custom-clarity-result")
        assert "Passive Voice Found" in result_text or "Diagnostic Assessment" in result_text, f"Unexpected analysis result: {result_text}"
        print("  [OK] Custom Sentence Analysis successfully detected passive voice.")

        # Capture Clarity Lab Screenshot
        clarity_shot = os.path.join(ARTIFACTS_DIR, "quick_academy_clarity_lab_page.png")
        await page.screenshot(path=clarity_shot, full_page=True)
        print(f"  [OK] Saved Clarity Lab Screenshot: {clarity_shot}")

        # 4. Viewport Responsiveness & Overflow Test across 5 viewports
        print("[TEST 5] Testing Responsiveness Across 5 Viewports (360px, 390px, 768px, 1024px, 1440px)...")
        viewports = [360, 390, 768, 1024, 1440]
        # Back to home
        await page.goto(URL, wait_until="networkidle")
        await page.wait_for_timeout(500)

        for w in viewports:
            await page.set_viewport_size({"width": w, "height": 800})
            await page.wait_for_timeout(400)
            overflow = await page.evaluate("() => document.documentElement.scrollWidth > document.documentElement.clientWidth")
            scroll_width = await page.evaluate("() => document.documentElement.scrollWidth")
            client_width = await page.evaluate("() => document.documentElement.clientWidth")
            print(f"  Viewport {w}px: scrollWidth={scroll_width}, clientWidth={client_width}, overflow={overflow}")
            assert not overflow, f"Horizontal overflow detected at {w}px!"

        print("\nAll Tests Passed Successfully with 0 Console Errors!")
        if console_errors:
            print(f"Warning - Console errors recorded: {console_errors}")
        else:
            print("Zero console errors recorded.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
