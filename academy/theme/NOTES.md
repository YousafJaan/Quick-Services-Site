# Quick Services Academy — Theme Extraction & Design Notes

## 1. Live Site Extraction Source
- **Live URL**: `https://quick-services-site.pages.dev/`
- **Extracted On**: October 24, 2026 via Chrome DevTools MCP script evaluation.
- **Brand Name**: Quick Services (Educational Arm: Quick Services Academy)
- **Tagline**: "Make your research make sense."
- **Founder / Academic Lead**: M. Yousaf (MS English, BZU)
- **Verified Contact**:
  - WhatsApp: `+92 329 6646824` (`https://wa.me/923296646824`)
  - Email: `quickservices489@gmail.com`
- **Payment Methods**: JazzCash, EasyPaisa, SadaPay, NayaPay, Bank Transfer, Western Union.
- **Free Flagship Resource**: 27-Page Research Student Field Guide (PDF).

---

## 2. Visual Identity & Design DNA

### 2.1 Logo Treatment
The logo mark consists of a rounded square container housing an uppercase letter "Q":
```html
<a href="#/" class="d logo-mark">
  <span class="q-icon">Q</span>
  Quick Services Academy
</a>
```
- **Icon Container**: 32px × 32px, `border-radius: 9px`, background `#ff6b2c` (Brand Orange), text color `#0a0f1c` (Deep Dark Navy), centered flex, font-size 18px bold.
- **Brand Text**: Font `Bricolage Grotesque`, weight 800, color `#ffffff`, letter-spacing `-0.035em`, font size 21px.

### 2.2 Color Architecture
- **Deep Navy Background**: `#0a0f1c` (`rgb(10, 15, 28)`) forms the global page canvas, header, and footer backdrop.
- **Card Surfaces**:
  - Light Card (`.spec-card`): `#ffffff` background with `1.5px solid #e2e8f0` border, `border-radius: 22px`.
  - Dark Card / Interactive Widget (`.calc-card`): `#0a0f1c` or `#111827`, border `1px solid #1e293b`, `border-radius: 28px`, shadow `0 20px 40px -15px rgba(0,0,0,0.5)`.
- **Primary Brand Accent**: `#ff6b2c` (`rgb(255, 107, 44)`) used for the "Q" badge, primary CTA buttons, stat highlights, and active states.
- **Secondary Accent (Warm Peach)**: `#fdba74` (`rgb(253, 186, 116)`) used for focus rings, sub-badges, and link highlights.
- **Borders & Rules**: Slate scale `#1e293b` (dark elements), `#334155` (dark borders), `#e2e8f0` (light cards).

### 2.3 Typography System
Imported directly from Google Fonts:
`family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap`
- **Headings & Display**: `Bricolage Grotesque`, `letter-spacing: -0.035em`, `font-weight: 800`.
- **Body & Paragraphs**: `Plus Jakarta Sans`, line-height `1.55`, font-size `16px`.
- **Tags & Badges**: Uppercase, font-size `11.5px`, `font-weight: 800`, `letter-spacing: 1.6px`, pill border.

### 2.4 Buttons & Interactive States
- **Pill Shape**: Fully rounded (`border-radius: 999px`), `min-height: 48px` (desktop), padding `14px 26px`, font-weight `700`.
- **Hover Micro-interaction**: `transform: translateY(-2px)` with `0.2s` transition.
- **Focus Rings**: Strict WCAG AA compliance with `outline: #fdba74 solid 3px; outline-offset: 3px;`.
- **Reduced Motion**: Under `prefers-reduced-motion: reduce`, all transforms and keyframe loops are cleanly disabled.

### 2.5 Header & Navigation
- Sticky header with `position: sticky; top: 0; z-index: 20;`
- Background: `rgba(10, 15, 28, 0.92)` with `backdrop-filter: blur(12px)`.
- Min height: `62px`.
- Bottom border: `1px solid #1e293b`.
- Mobile navigation: Native `<details class="menu">` with summary icon `☰`, opening full-width drawer.
- Desktop navigation: Horizontal link list with hover color shift.

### 2.6 Footer Architecture
- Background: `#0a0f1c` with border-top `1px solid #1e293b`.
- Typography: `#94a3b8` (Slate-400), font-size `13.5px`.
- Contains: Business attribution, founder qualification, links to Field Guide, PDF download, email, and WhatsApp.
