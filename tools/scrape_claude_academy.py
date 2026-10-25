import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        page = await b.new_page(viewport={"width": 1440, "height": 900})
        try:
            print("Navigating to https://academy.claude.com/...")
            await page.goto("https://academy.claude.com/", wait_until="networkidle", timeout=20000)
            title = await page.title()
            print("Title:", title)
            
            # Extract header and sections
            data = await page.evaluate('''() => {
                const header = document.querySelector('header')?.innerText || '';
                const navLinks = Array.from(document.querySelectorAll('header a, nav a')).map(a => a.innerText.trim()).filter(Boolean);
                const hero = {
                    h1: document.querySelector('h1')?.innerText || '',
                    sub: document.querySelector('h1 + p, .hero p')?.innerText || ''
                };
                const sections = Array.from(document.querySelectorAll('section, main > div')).map(s => {
                    const h2 = s.querySelector('h2')?.innerText || '';
                    const h3s = Array.from(s.querySelectorAll('h3')).map(h => h.innerText.trim());
                    return { h2, h3s, textPreview: s.innerText.slice(0, 150) };
                }).filter(s => s.h2 || s.h3s.length);
                return { header, navLinks, hero, sections };
            }''')
            print("Header nav links:", data["navLinks"])
            print("Hero:", data["hero"])
            print("\nSections:")
            for s in data["sections"]:
                print(f"  H2: {s['h2']}")
                print(f"  H3s: {s['h3s']}")
            
            shot_path = r"C:\Users\Huzaifa Mahi\.gemini\antigravity\brain\63a27969-4728-4390-9bf9-667df514cc28\claude_academy_real_homepage.png"
            await page.screenshot(path=shot_path, full_page=True)
            print(f"Full page screenshot saved to {shot_path}")
        except Exception as e:
            print("Error scraping academy.claude.com:", e)
        finally:
            await b.close()

if __name__ == "__main__":
    asyncio.run(main())
