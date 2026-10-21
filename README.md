# Quick Services — Academic Support & Research Consulting

A high-performance, mobile-first static website for **Quick Services** run by **M. Yousaf**. Provides academic editing, SPSS/SmartPLS statistics support, methodology coaching, literature search training, formatting/citations, and viva defense coaching.

---

## 1. Project Overview & Positioning

- **Core Academic Positioning:** We teach and coach. The student remains the author. We never write assignments or theses for submission and never help evade plagiarism or AI-detection checks.
- **Direct Contact:** 
  - WhatsApp: [+92 329 6646824](https://wa.me/923296646824)
  - Email: [quickservices489@gmail.com](mailto:quickservices489@gmail.com)
- **Visual Design System:** Navy (`#0a0f1c`), Orange (`#ff6b2c`), Slate accents, with typography paired between **Bricolage Grotesque** and **Plus Jakarta Sans**.

---

## 2. File & Directory Structure

```text
/
├── index.html                   # Main marketing & services site
├── guide.html                   # Free 7-chapter research field guide with locked teasers
├── download.html                # Code-protected download portal (client-side AES-GCM decryption)
├── 404.html                     # Custom branded 404 error page
├── robots.txt                   # Search crawler directives (download page disallowed)
├── sitemap.xml                  # XML Sitemap for search engines (download page excluded)
├── favicon.svg                  # Simple orange "Q" on navy background
├── site.webmanifest             # PWA web manifest
├── _headers                     # Cloudflare Pages / Netlify security & CSP headers
├── .gitignore                   # Excludes sensitive PDFs, access codes, and generator tools
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Pages automated deployment workflow
├── assets/
│   ├── Research-Field-Guide-FREE.pdf  # Public free edition PDF (10 pages)
│   └── og-image.png                   # 1200x630 social share banner in brand colors
└── tools/                       # LOCAL ONLY (excluded from deployment via .gitignore)
    ├── make_portal.py           # Python tool to encrypt PDF and generate access codes
    └── portal_template.html     # HTML template for generating download portal pages
```

---

## 3. How to Edit Text & Links

1. **Changing Contact Details:**
   - WhatsApp link: Update `https://wa.me/923296646824` across `index.html`, `guide.html`, and `download.html`.
   - Email: Update `quickservices489@gmail.com` across all HTML files.
2. **Updating Pricing & Rates:**
   - Modify the `#rates` section in `index.html` (e.g. Statistical analysis support from `PKR 8,000+`).
3. **Updating the Domain Name:**
   - Change the placeholder URL (`https://quick-services-site.pages.dev/`) in `robots.txt`, `sitemap.xml`, and the canonical `<link rel="canonical">` in `index.html` and `guide.html`.

---

## 4. How to Generate New Access Codes with `tools/make_portal.py`

The full guide is encrypted inside `download.html` using client-side **AES-256-GCM** with **PBKDF2-HMAC-SHA256** key derivation (200,000 iterations). Visitors enter their 16-character access code in the browser to decrypt and save the PDF without requiring any server backend.

### Prerequisites:
```bash
pip install cryptography
```

### Generating Codes:
From the root directory or inside `tools/`:

```bash
# Generate 10 new random codes and build download-portal.html
python tools/make_portal.py "path/to/Research-Field-Guide-FULL.pdf"

# Generate 25 new random codes with a custom filename:
python tools/make_portal.py "path/to/Research-Field-Guide-FULL.pdf" --new 25 --filename "Research-Student-Field-Guide.pdf" --out download.html

# Reuse an existing list of codes:
python tools/make_portal.py "path/to/Research-Field-Guide-FULL.pdf" --codes access-codes.txt --out download.html
```

### Important Privacy & Security Note:
> **Important:** Client-side encrypted pages embed key-wrapping material into the HTML. Once a visitor receives an access code and accesses `download.html`, **the access code cannot be revoked** for that version of the file. To revoke access or invalidate old codes, you must generate a fresh `download.html` using `make_portal.py` with newly generated codes and push the updated page to production.
>
> **Security Rule:** Never commit `Research-Field-Guide-FULL.pdf`, `access-codes.txt`, or real codes to GitHub or public repositories. These are strictly excluded in `.gitignore`.

---

## 5. Deployment Instructions

### A. GitHub Pages
1. Initialize repository and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete mobile-first static site for Quick Services"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/quick-services-site.git
   git push -u origin main
   ```
2. In GitHub repository settings:
   - Navigate to **Settings** &rarr; **Pages**.
   - Under **Build and deployment** &rarr; **Source**, select **GitHub Actions**.
   - The workflow `.github/workflows/deploy.yml` will automatically build and publish the site.
   - Check **Enforce HTTPS**.

### B. Cloudflare Pages
1. Sign in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Compute (Workers & Pages)** &rarr; **Create application** &rarr; **Pages** &rarr; **Connect to Git**.
3. Select your `quick-services-site` repository.
4. Set up the build settings:
   - **Framework preset:** `None`
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/` (or `.`)
5. Click **Save and Deploy**. Cloudflare Pages will automatically deploy the site to a free `*.pages.dev` subdomain and apply all custom security headers from `/_headers`.

### C. Adding a Custom Domain in Cloudflare Pages
1. In Cloudflare Pages, go to your project &rarr; **Custom domains** &rarr; **Set up a custom domain**.
2. Enter your apex domain (e.g. `quickservices.pk` or `quickservices.com`) or subdomain.
3. Configure your DNS provider:
   - **For apex domain:** Add a `CNAME` or `ALIAS/ANAME` record pointing to `<project-name>.pages.dev`.
   - **For `www` subdomain:** Add a `CNAME` record with name `www` pointing to `<project-name>.pages.dev`.
4. Cloudflare automatically issues and renews free SSL/TLS certificates.

---

## 6. Security Headers (`_headers`)

The site includes production-grade security headers applied via `/_headers`:
- **Content-Security-Policy (CSP):** Restricts script, font, and object sources while allowing required inline styling, Google Fonts, and `blob:` URLs for client-side PDF decryption and in-browser preview.
- **X-Content-Type-Options:** `nosniff`
- **Referrer-Policy:** `strict-origin-when-cross-origin`
- **Permissions-Policy:** Disables camera, microphone, geolocation, and browsing-topics.
- **X-Robots-Tag:** `noindex, nofollow, noarchive` explicitly applied to `/download.html` and `/download`.
