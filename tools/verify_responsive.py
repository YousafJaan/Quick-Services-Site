import asyncio
import os
import sys
from playwright.async_api import async_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

viewports = [
    ("mobile-360", 360, 740),
    ("mobile-390", 390, 844),
    ("tablet-768", 768, 1024),
    ("laptop-1024", 1024, 768),
    ("desktop-1440", 1440, 900)
]

urls = [
    ("home", "http://127.0.0.1:8080/academy/"),
    ("course", "http://127.0.0.1:8080/academy/#course-thesis101"),
    ("lesson", "http://127.0.0.1:8080/academy/#lesson-thesis101-t1")
]

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        all_passed = True

        for vname, w, h in viewports:
            context = await browser.new_context(viewport={"width": w, "height": h})
            page = await context.new_page()

            for uname, url in urls:
                await page.goto(url, wait_until="networkidle")
                await page.wait_for_timeout(600)
                scroll_w = await page.evaluate("() => document.documentElement.scrollWidth")
                inner_w = await page.evaluate("() => window.innerWidth")
                overflow = scroll_w > inner_w
                status = "FAIL" if overflow else "PASS"
                if overflow:
                    all_passed = False
                print(f"[{status}] {vname} ({w}px) on {uname}: scrollWidth={scroll_w}, innerWidth={inner_w}")

            await context.close()

        await browser.close()
        print("\nResponsive Test Result:", "ALL PASSED (0 overflow)" if all_passed else "OVERFLOW DETECTED")

if __name__ == "__main__":
    asyncio.run(main())
