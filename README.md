# Quick Services — Academic Support & Research Consulting

A high-performance academic platform for **Quick Services** led by **M. Yousaf** (MS English, BZU). Provides academic editing, SPSS/SmartPLS statistics support, methodology coaching, literature search training, formatting/citations, and viva defense coaching.

The platform provides dual deployment environments:
1. **Static Mobile-First Web & PWA**: Hosted on Cloudflare Pages / GitHub Pages (`index.html`, `guide.html`, `academy/`).
2. **WordPress Full Site Editing (FSE) Block Theme**: Located under `wordpress/quickservices-theme/` featuring the **Oxford Academic Editorial** design system, native Gutenberg block patterns, and client-side interactive learning engines.

---

## 1. Project Overview & Positioning

- **Core Academic Positioning:** We teach, edit, and explain. The student remains the author. We never write assignments or theses for submission and never help evade plagiarism or AI-detection checks.
- **Direct Contact:** 
  - WhatsApp: [+92 329 6646824](https://wa.me/923296646824)
  - Email: [quickservices489@gmail.com](mailto:quickservices489@gmail.com)
- **Visual Design Systems:**
  - *WordPress Theme*: Oxford Academic Editorial with Oxford Navy (`#0C192E`), Hunter Forest (`#16302B`), Antique Bronze (`#B8823B`), Ivory Canvas (`#FAF8F5`), paired with **Fraunces** serif and **Plus Jakarta Sans**.
  - *Static Site*: Navy (`#0a0f1c`), Orange (`#ff6b2c`), Slate accents with **Bricolage Grotesque** and **Plus Jakarta Sans**.
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
├── favicon.svg                          # Brand icon
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
│   └── og-image.png                     # 1200x630 social share banner
├── academy/                             # Quick Academy client-side PWA learning engine
│   ├── index.html                       # Academy SPA shell
│   ├── js/                              # Quiz, visual, and certificate engines
│   └── docs/designs/                    # EGM concept briefs and specifications
├── wordpress/
│   └── quickservices-theme/             # Full Site Editing (FSE) block theme for WordPress
│       ├── style.css                    # Theme header metadata & baseline resets
│       ├── theme.json                   # Oxford Academic design tokens (palette, serif/sans fonts)
│       ├── functions.php                # CPTs (qs_course, qs_lesson), asset enqueues, REST API
│       ├── index.php                    # Universal fallback template
│       ├── templates/                   # FSE block templates (front-page, field-guide, academy, single)
│       ├── parts/                       # Reusable block parts (header, footer, trust-strip, modal)
│       ├── patterns/                    # Gutenberg block patterns (hero, specialties, rates, academy)
│       └── assets/                      # Editorial CSS, 12 quiz modalities, 30 SVG visuals, cert engine
└── tools/
    ├── build_guide.py                   # Automated Chromium print-to-pdf pipeline
    └── guide_content.py                 # 27-page HTML layout & typography blueprint
```

---

## 3. How to Deploy the WordPress Theme

1. Copy the directory `wordpress/quickservices-theme` into your WordPress installation under `wp-content/themes/quickservices-theme`.
2. In the WordPress Admin dashboard, navigate to **Appearance > Themes**.
3. Activate **Quick Services Oxford Academic**.
4. Open the **Site Editor** (Appearance > Editor) to visually edit block patterns and templates.
5. Custom Post Types (`qs_course`, `qs_lesson`) will appear automatically in the WordPress sidebar.

---

## 4. How to Rebuild the PDF Guide

The publication PDF is generated automatically from `tools/guide_content.py` using Chromium/Chrome headless printing:

```bash
pip install qrcode pillow pypdf
python tools/build_guide.py
```

This compiles `assets/Research-Student-Field-Guide.pdf`:
- Format: A4 Portrait
- Length: 27 Pages
- Size: ~0.60 MB

---

## 5. Deployment Instructions

### A. GitHub Pages
```bash
git add .
git commit -m "feat: complete wordpress theme and academy redesign"
git push origin main
```
Live URL: `https://yousafjaan.github.io/Quick-Services-Site/`

### B. Cloudflare Pages
Connected directly to the same GitHub repository:
- Build command: *(empty)*
- Build output directory: `/`
- Environment: Static site
Live URL: `https://quick-services-site.pages.dev/`
