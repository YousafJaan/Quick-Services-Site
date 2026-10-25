import asyncio
import os
import sys
from playwright.async_api import async_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

LIVE_URL = "https://quick-services-site.pages.dev/academy/"
ARTIFACT_DIR = r"C:\Users\Huzaifa Mahi\.gemini\antigravity\brain\63a27969-4728-4390-9bf9-667df514cc28"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        print(f"Connecting to Live Cloudflare Pages: {LIVE_URL}...")
        resp = await page.goto(LIVE_URL, wait_until="networkidle")
        print(f"HTTP Status: {resp.status if resp else 'N/A'}")
        await page.wait_for_timeout(1000)

        # 1. Verify old sections are GONE from live homepage
        old_clarity = await page.query_selector("#sentence-clarity-lab")
        old_pillars = await page.query_selector(".pillar-cards-grid")
        print(f"Old Clarity on live homepage: {bool(old_clarity)} (Expected False)")
        print(f"Old Pillars on live homepage: {bool(old_pillars)} (Expected False)")
        assert old_clarity is None, "Old clarity lab still found on live homepage!"
        assert old_pillars is None, "Old pillars grid still found on live homepage!"

        # 2. Verify Claude Academy sections on live homepage
        hero_title = await page.text_content(".claude-home-hero-title")
        print(f"Live Hero Title: {hero_title.strip() if hero_title else 'N/A'}")
        assert "Welcome to Quick Academy" in (hero_title or "")

        deep_cards = await page.query_selector_all(".claude-deep-card")
        print(f"Live 'Go deeper' cards count: {len(deep_cards)} (Expected 5)")
        assert len(deep_cards) == 5

        rigor_cards = await page.query_selector_all(".claude-rigor-card")
        print(f"Live 'Methodological Rigor' cards count: {len(rigor_cards)} (Expected 3)")
        assert len(rigor_cards) == 3

        catalog_cards = await page.query_selector_all(".qsa-card")
        print(f"Live Catalog courses count: {len(catalog_cards)} (Expected 9)")
        assert len(catalog_cards) == 9

        # Capture live homepage screenshot
        live_home_shot = os.path.join(ARTIFACT_DIR, "live_cloudflare_claude_clone_homepage.png")
        await page.screenshot(path=live_home_shot, full_page=True)
        print(f"Saved live homepage screenshot: {live_home_shot}")

        # 3. Test Live #clarity route
        print("Navigating to live #clarity...")
        await page.click("a[href='#clarity']")
        await page.wait_for_timeout(1000)

        live_clarity = await page.query_selector("#sentence-clarity-lab")
        print(f"Live #sentence-clarity-lab mounted: {bool(live_clarity)}")
        assert live_clarity is not None

        live_clarity_shot = os.path.join(ARTIFACT_DIR, "live_cloudflare_clarity_lab.png")
        await page.screenshot(path=live_clarity_shot, full_page=True)
        print(f"Saved live clarity screenshot: {live_clarity_shot}")

        # 4. Viewport Overflow Check on Live Site
        print("Checking responsiveness on live site across viewports...")
        viewports = [360, 390, 768, 1024, 1440]
        await page.goto(LIVE_URL, wait_until="networkidle")
        await page.wait_for_timeout(500)

        for w in viewports:
            await page.set_viewport_size({"width": w, "height": 800})
            await page.wait_for_timeout(300)
            overflow = await page.evaluate("() => document.documentElement.scrollWidth > document.documentElement.clientWidth")
            scroll_width = await page.evaluate("() => document.documentElement.scrollWidth")
            client_width = await page.evaluate("() => document.documentElement.clientWidth")
            print(f"  Live Viewport {w}px: scrollWidth={scroll_width}, clientWidth={client_width}, overflow={overflow}")
            assert not overflow, f"Live overflow at {w}px!"

        print("\nAll live production checks passed with 100% success!")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
