import os, re, glob
from html.parser import HTMLParser

repo = r"C:\Users\Huzaifa Mahi\quick-services-site"

print("--- CHECKING FOR UNWANTED STRINGS ---")
forbidden = [r"\[ADD:", r"access[- ]?code", r"make_portal", r"access-codes"]
found = False
for ext in ["*.html", "*.py", "*.txt", "*.md", "*.json", "*.xml", "*.webmanifest", "_headers", "_redirects"]:
    for f in glob.glob(os.path.join(repo, "**", ext), recursive=True):
        if ".git" in f or "artifacts" in f or "transcript" in f or "verify_site.py" in f:
            continue
        try:
            with open(f, "r", encoding="utf-8", errors="ignore") as fp:
                content = fp.read()
                for pat in forbidden:
                    matches = re.findall(pat, content, re.IGNORECASE)
                    if matches:
                        print(f"Match {pat} in {f}: {len(matches)} times")
                        found = True
        except Exception as e:
            pass

if not found:
    print("Zero forbidden tokens found across repository!")

print("\n--- VALIDATING ANCHORS AND LINKS ---")
class LinkValidator(HTMLParser):
    def __init__(self, filename):
        super().__init__()
        self.filename = filename
        self.ids = set()
        self.hrefs = []
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if "id" in d:
            self.ids.add(d["id"])
        if "href" in d:
            self.hrefs.append(d["href"])

for html_file in ["index.html", "guide.html", "404.html", "download.html"]:
    path = os.path.join(repo, html_file)
    with open(path, "r", encoding="utf-8") as f:
        parser = LinkValidator(html_file)
        parser.feed(f.read())
    
    # check internal anchor hrefs
    broken_anchors = []
    for href in parser.hrefs:
        if href.startswith("#") and len(href) > 1:
            anchor_id = href[1:]
            if anchor_id not in parser.ids:
                broken_anchors.append(href)
    print(f"{html_file}: {len(parser.ids)} IDs found, {len(parser.hrefs)} links checked. Broken internal anchors: {broken_anchors}")

# Also check target files exist for all relative links
print("\n--- CHECKING RELATIVE FILE LINKS ---")
for html_file in ["index.html", "guide.html"]:
    path = os.path.join(repo, html_file)
    with open(path, "r", encoding="utf-8") as f:
        parser = LinkValidator(html_file)
        parser.feed(f.read())
    missing_files = []
    for href in parser.hrefs:
        if href.startswith("http") or href.startswith("mailto:") or href.startswith("tel:") or href.startswith("#") or href.startswith("javascript:"):
            continue
        # clean query / hash
        clean_href = href.split("?")[0].split("#")[0]
        if not clean_href:
            continue
        if clean_href.startswith("/"):
            target_path = os.path.join(repo, clean_href.lstrip("/"))
        else:
            target_path = os.path.join(repo, clean_href)
        if not os.path.exists(target_path):
            missing_files.append((href, target_path))
    print(f"{html_file} missing relative link targets: {missing_files}")
