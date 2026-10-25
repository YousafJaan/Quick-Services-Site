import asyncio
import os
import sys
from playwright.async_api import async_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ARTIFACT_DIR = r"C:\Users\Huzaifa Mahi\.gemini\antigravity\brain\63a27969-4728-4390-9bf9-667df514cc28"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type in ["error", "warning"] else None)
        page.on("pageerror", lambda err: console_errors.append(f"[pageerror] {err}"))

        # 1. Test Academy Home / Catalog
        print("Navigating to Academy Home...")
        await page.goto("http://127.0.0.1:8080/academy/", wait_until="networkidle")
        await page.wait_for_timeout(1000)

        # Check filter chips and search bar
        filter_bar = await page.query_selector(".claude-filter-bar")
        chips = await page.query_selector_all(".claude-filter-chip")
        search_input = await page.query_selector("#catalog-search")
        all_cards = await page.query_selector_all("#courses-grid-mount .qsa-card")
        print(f"Filter bar found: {bool(filter_bar)}, Chips count: {len(chips)}, Search input: {bool(search_input)}, Initial cards: {len(all_cards)}")

        # Click Statistical Analysis filter chip
        for chip in chips:
            text = await chip.inner_text()
            if "Statistical" in text:
                await chip.click()
                break
        await page.wait_for_timeout(600)
        cards_after_filter = await page.query_selector_all("#courses-grid-mount .qsa-card")
        print(f"Cards after 'Statistical' filter: {len(cards_after_filter)}")

        # Test search input hotkey '/'
        await page.keyboard.press("/")
        is_focused = await page.evaluate("() => document.activeElement === document.getElementById('catalog-search')")
        print(f"Search input focused by '/' hotkey: {is_focused}")

        # Type in search
        await search_input.fill("SmartPLS")
        await page.wait_for_timeout(400)
        cards_after_search = await page.query_selector_all("#courses-grid-mount .qsa-card")
        print(f"Cards after searching 'SmartPLS': {len(cards_after_search)}")

        # Clear search and reset filter to All
        await search_input.fill("")
        if chips:
            await chips[0].click()
            await page.wait_for_timeout(400)

        # 2. Test Course Overview (#course-thesis101)
        print("Navigating to Course Overview #course-thesis101...")
        await page.goto("http://127.0.0.1:8080/academy/#course-thesis101", wait_until="networkidle")
        await page.wait_for_timeout(1000)

        accordions = await page.query_selector_all(".claude-module-accordion-card")
        toggle_all = await page.query_selector("#claude-toggle-all-modules")
        print(f"Module accordions count: {len(accordions)}, Toggle all button: {bool(toggle_all)}")

        # Screenshot course overview
        overview_path = os.path.join(ARTIFACT_DIR, "claude_course_overview_verified.png")
        await page.screenshot(path=overview_path, full_page=False)
        print(f"Course overview screenshot saved: {overview_path}")

        # Test collapse all / expand all
        if toggle_all:
            await toggle_all.click()
            await page.wait_for_timeout(400)
            first_body = await page.query_selector("#claude-mod-body-0")
            display = await first_body.evaluate("el => el.style.display")
            print(f"Module 0 display after Collapse All: {display}")

            await toggle_all.click()
            await page.wait_for_timeout(400)
            display2 = await first_body.evaluate("el => el.style.display")
            print(f"Module 0 display after Expand All: {display2}")

        # 3. Test Lesson Player (#lesson-thesis101-t1)
        print("Navigating to Lesson Player #lesson-thesis101-t1...")
        await page.goto("http://127.0.0.1:8080/academy/#lesson-thesis101-t1", wait_until="networkidle")
        await page.wait_for_timeout(1500)

        toc = await page.query_selector(".claude-toc-block")
        prompt_card = await page.query_selector("#section-ai-prompt")
        kc_card = await page.query_selector("#section-knowledge-check")
        callouts = await page.query_selector_all(".claude-callout")
        print(f"In-Page TOC: {bool(toc)}, AI Prompt Card: {bool(prompt_card)}, Knowledge Check: {bool(kc_card)}, Callouts: {len(callouts)}")

        # Test Knowledge Check interaction
        kc_options = await page.query_selector_all(".claude-kc-option")
        print(f"KC options count: {len(kc_options)}")
        if len(kc_options) > 1:
            await kc_options[1].click() # Option 1 is correct for thesis101
            submit_btn = await page.query_selector("#claude-kc-submit-btn")
            await submit_btn.click()
            await page.wait_for_timeout(400)
            feedback = await page.query_selector("#claude-kc-feedback")
            fb_text = await feedback.inner_text()
            print(f"KC Feedback: {fb_text[:60]}...")

        # Test Prompt Card copy button
        copy_btn = await page.query_selector("#claude-copy-prompt-btn")
        if copy_btn:
            await copy_btn.click()
            await page.wait_for_timeout(400)
            btn_text = await copy_btn.inner_text()
            print(f"Copy button after click: {btn_text}")

        # Screenshot lesson player with TOC, AI Prompt, and Knowledge check
        lesson_path = os.path.join(ARTIFACT_DIR, "claude_lesson_player_verified.png")
        await page.screenshot(path=lesson_path, full_page=False)
        print(f"Lesson player screenshot saved: {lesson_path}")

        # Scroll to bottom to capture prompt & quiz
        if prompt_card:
            await prompt_card.scroll_into_view_if_needed()
            await page.wait_for_timeout(600)
            quiz_path = os.path.join(ARTIFACT_DIR, "claude_lesson_quiz_verified.png")
            await page.screenshot(path=quiz_path, full_page=False)
            print(f"Prompt & quiz screenshot saved: {quiz_path}")

        print("\nConsole errors/warnings captured:")
        for err in console_errors:
            print("  ", err)
        if not console_errors:
            print("  (Zero errors/warnings!)")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
