# Quick Services Academy — Cloudflare Pages Deployment Guide

This guide details how to deploy Quick Services Academy to **Cloudflare Pages** with zero build configuration.

---

## 1. Prerequisites
- A free [Cloudflare Account](https://dash.cloudflare.com/).
- A Git repository (GitHub or GitLab) containing the `quick-services-academy` codebase, or direct upload via the Wrangler CLI.

---

## 2. Deploying via Cloudflare Dashboard (Recommended)

1. **Log in** to your Cloudflare Dashboard and select **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. **Select your repository**: Select `quick-services-academy`.
3. **Configure Build Settings**:
   - **Framework preset**: `None`
   - **Build command**: *(Leave completely blank)*
   - **Build output directory**: `/` (or root `.`)
4. **Environment Variables**: *(None required)*
5. **Click Save and Deploy**.
6. Cloudflare will provision the site within 15 to 30 seconds and provide an instant `.pages.dev` domain (e.g. `quick-services-academy.pages.dev`).

---

## 3. Custom Domain Setup (e.g., `academy.quick-services.pk`)

1. In the Cloudflare Pages project, click **Custom domains** > **Set up a custom domain**.
2. Enter your desired subdomain (e.g. `academy.quick-services-site.pages.dev` or `academy.yourdomain.com`).
3. If DNS is managed on Cloudflare, DNS records are configured automatically with an automatic SSL certificate.

---

## 4. Deploying via Wrangler CLI (Direct Upload)

If you prefer terminal deployment without connecting to Git:
```bash
# 1. Install wrangler globally or run via npx
npx wrangler pages deploy C:\quick-services-academy --project-name=quick-services-academy
```

---

## 5. Caching & Headers (`_headers` file)

To ensure smooth client-side routing and optimal asset caching:
Create a `_headers` file in the root directory:
```
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/data/*
  Cache-Control: public, max-age=3600, stale-while-revalidate=86400

/assets/*
  Cache-Control: public, max-age=604800
```
