# Quick Services — Academic Support & Research Consulting

A high-performance, mobile-first static website for **Quick Services** led by **M. Yousaf**. Provides academic editing, SPSS/SmartPLS statistics support, methodology coaching, literature search training, formatting/citations, and viva defense coaching.

The site includes the complete 27-page **Research Student's Field Guide** available 100% free with single-click PDF download (no code, no login, no paywall).

---

## 1. Project Overview & Positioning

- **Core Academic Positioning:** We teach, edit, and explain. The student remains the author. We never write assignments or theses for submission and never help evade plagiarism or AI-detection checks.
- **Direct Contact:** 
  - WhatsApp: [+92 329 6646824](https://wa.me/923296646824)
  - Email: [quickservices489@gmail.com](mailto:quickservices489@gmail.com)
- **Visual Design System:** Navy (`#0a0f1c`), Orange (`#ff6b2c`), Slate accents, with typography paired between **Bricolage Grotesque** and **Plus Jakarta Sans**.
- **Pricing:** Clear quote agreed before work begins (SPSS/SmartPLS support from PKR 8,000 / ~$45 USD).
- **Payment Methods:** JazzCash, EasyPaisa, SadaPay, NayaPay, bank transfer, Western Union.

---

## 2. File & Directory Structure

```text
/
├── index.html                           # Main marketing site with "My speciality, field by field"
├── guide.html                           # Complete 27-page Research Student's Field Guide
├── download.html                        # 301/client-side redirect to /guide.html (noindex)
├── 404.html                             # Custom branded 404 error page
├── robots.txt                           # Search crawler directives
├── sitemap.xml                          # XML Sitemap with index, guide, and PDF
├── favicon.svg                          # Orange "Q" on navy background icon
├── site.webmanifest                     # PWA web manifest
├── _headers                             # Security and CSP headers (Cloudflare Pages / Netlify)
├── _redirects                           # 301 redirects (/download.html -> /guide.html)
├── .gitignore                           # Git ignore rules
├── .github/
│   └── workflows/
│       └── deploy.yml                   # GitHub Pages automated deployment workflow
├── assets/
│   ├── Research-Student-Field-Guide.pdf # Complete 27-page publication PDF (0.6 MB)
│   ├── qr-whatsapp.png                  # WhatsApp QR code for PDF back cover
│   └── og-image.png                     # 1200x630 social share banner in brand colors
└── tools/
    ├── build_guide.py                   # Automated Chromium print-to-pdf pipeline
    └── guide_content.py                 # 27-page HTML layout & typography blueprint
```

---

## 3. How to Rebuild the PDF Guide

The publication PDF is generated automatically from `tools/guide_content.py` using Chromium/Chrome headless printing to ensure vector sharpness, embedded fonts, and clickable link annotations:

### Prerequisites:
```bash
pip install qrcode pillow pypdf
```
Ensure Google Chrome is installed.

### Build Command:
```bash
python tools/build_guide.py
```

This compiles `assets/Research-Student-Field-Guide.pdf`:
- Format: A4 Portrait
- Length: 27 Pages (Target: 24 to 32)
- Size: ~0.60 MB (Well under the 3 MB threshold)
- Embedded metadata: Title and Author "M. Yousaf, Quick Services"

---

## 4. Editing Text, Rates & Contact Details

1. **Contact Details:**
   - WhatsApp link: Update `https://wa.me/923296646824` across `index.html` and `guide.html`.
   - Email: Update `quickservices489@gmail.com` across all HTML files.
2. **Updating Pricing & Rates:**
   - Modify the `#rates` section in `index.html`.
3. **Canonical Domain Name:**
   - Change the domain (`https://quick-services-site.pages.dev/` or custom domain `quickservices.pk`) in `robots.txt`, `sitemap.xml`, and the canonical `<link rel="canonical">` in `index.html` and `guide.html`.

---

## 5. Deployment Instructions

### A. GitHub Pages
Deploys automatically on every push to `main` using the GitHub Actions workflow (`.github/workflows/deploy.yml`):
```bash
git add .
git commit -m "feat: complete free field guide update"
git push origin main
```
Live URL: `https://yousafjaan.github.io/Quick-Services-Site/`

### B. Cloudflare Pages
Connected directly to the same GitHub repository:
- Build command: *(empty)*
- Build output directory: `/`
- Environment: Static site
- Honours `_headers` and `_redirects` automatically.
Live URL: `https://quick-services-site.pages.dev/`
