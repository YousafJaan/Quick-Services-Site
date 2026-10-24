# Quick Services Academy — Design System Specification

## 1. Design Principles
1. **Academic Clarity with Commercial Polish**: Clean lines, high-contrast typography, crisp edges, and structured layouts inspired by leading modern platforms.
2. **Deterministic & Lightweight**: 100% static HTML, CSS, and vanilla ES modules. Zero runtime UI dependencies or bloated CSS frameworks.
3. **Designed Meaning Over Decoration**: Every visual, chart, and diagram represents concrete structural or numerical meaning—never generic stock photos or decorative raster art.
4. **Resilient & Accessible**: Mobile-first architecture responsive from 360px upwards. WCAG AA minimum contrast ratio (4.5:1 for body text, 3:1 for large text and interactive components) across all themes.

---

## 2. Token Architecture & CSS Variables

```css
:root {
  /* Surface & Background Colors */
  --qsa-bg-dark: #0a0f1c;
  --qsa-bg-card-dark: #111827;
  --qsa-bg-elevated: rgba(255, 255, 255, 0.05);
  --qsa-bg-light: #ffffff;
  --qsa-bg-card-light: #ffffff;
  --qsa-bg-muted-light: #f8fafc;
  --qsa-bg-subtle-light: #f1f5f9;

  /* Text Colors */
  --qsa-text-dark-primary: #ffffff;
  --qsa-text-dark-secondary: #e2e8f0;
  --qsa-text-dark-muted: #94a3b8;
  --qsa-text-light-primary: #0a0f1c;
  --qsa-text-light-secondary: #334155;
  --qsa-text-light-muted: #475569;

  /* Brand Accents */
  --qsa-accent-orange: #ff6b2c;
  --qsa-accent-orange-hover: #ff7d45;
  --qsa-accent-orange-muted: rgba(255, 107, 44, 0.15);
  --qsa-accent-peach: #fdba74;
  --qsa-accent-peach-muted: rgba(253, 186, 116, 0.2);

  /* Borders & Rules */
  --qsa-border-dark: #1e293b;
  --qsa-border-dark-muted: #334155;
  --qsa-border-light: #e2e8f0;
  --qsa-border-subtle: #cbd5e1;
  --qsa-focus-ring: #fdba74;

  /* Status Colors */
  --qsa-status-success: #15803d;
  --qsa-status-success-bg: #ecfdf5;
  --qsa-status-success-border: #a7f3d0;
  --qsa-status-danger: #b91c1c;
  --qsa-status-danger-bg: #fef2f2;
  --qsa-status-danger-border: #fecaca;
  --qsa-status-warning: #b45309;
  --qsa-status-warning-bg: #fffbeb;
  --qsa-status-warning-border: #fde68a;

  /* Typography */
  --qsa-font-display: "Bricolage Grotesque", "Plus Jakarta Sans", system-ui, sans-serif;
  --qsa-font-body: "Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --qsa-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

  /* 8-Point Spacing Scale */
  --qsa-space-1: 4px;
  --qsa-space-2: 8px;
  --qsa-space-3: 12px;
  --qsa-space-4: 16px;
  --qsa-space-5: 20px;
  --qsa-space-6: 24px;
  --qsa-space-7: 28px;
  --qsa-space-8: 32px;
  --qsa-space-10: 40px;
  --qsa-space-12: 48px;
  --qsa-space-16: 64px;
  --qsa-space-18: 72px;
  --qsa-space-26: 104px;

  /* Radii */
  --qsa-radius-sm: 8px;
  --qsa-radius-md: 12px;
  --qsa-radius-lg: 18px;
  --qsa-radius-card: 22px;
  --qsa-radius-section: 24px;
  --qsa-radius-modal: 28px;
  --qsa-radius-pill: 999px;

  /* Shadows */
  --qsa-shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --qsa-shadow-lift: 0 12px 24px -8px rgba(0, 0, 0, 0.12);
  --qsa-shadow-dark: rgba(0, 0, 0, 0.5) 0px 20px 40px -15px;
  --qsa-shadow-glow: 0 0 25px rgba(255, 107, 44, 0.25);
}
```

---

## 3. Typography & Spacing Scale

### 3.1 Type Hierarchy
| Scale Name | Size | Line Height | Weight | Font Family | Usage |
|---|---|---|---|---|---|
| Display Hero | clamp(32px, 7.5vw, 60px) | 1.05 | 800 | Display | Course & landing hero titles |
| Section H2 | clamp(26px, 5vw, 40px) | 1.15 | 800 | Display | Section titles, modal titles |
| Card H3 | 22px | 1.25 | 700 | Display | Course card titles, module names |
| Subhead H4 | 18px | 1.35 | 700 | Display | Lesson headings, widget groups |
| Body Base | 16px | 1.55 | 400 / 500 | Body | Primary reading lesson text |
| Body Small | 14px | 1.5 | 500 / 600 | Body | Annotations, side rail notes |
| Caption / Label | 13.5px | 1.45 | 600 | Body | Footer text, form labels |
| Micro Tag | 11.5px | 1.2 | 800 | Body | Uppercase category & level chips |

### 3.2 Contrast Verification (WCAG AA)
- `#ffffff` on `#0a0f1c`: **18.7:1** (Passes AAA)
- `#ff6b2c` on `#0a0f1c`: **5.8:1** (Passes AA for large text & graphics)
- `#0a0f1c` on `#ff6b2c`: **5.8:1** (Passes AA)
- `#0a0f1c` on `#ffffff`: **18.7:1** (Passes AAA)
- `#475569` on `#ffffff`: **7.1:1** (Passes AAA)
- `#fdba74` on `#0a0f1c`: **9.4:1** (Passes AAA)

---

## 4. Core Component Library

### 4.1 Course Cards (`.qsa-card`)
- **Structure**: Inline SVG cover banner (16:9 ratio), category badge, title, 2-line description, stats footer (lesson count, minutes, level), action button or progress ring.
- **Edges**: `1.5px solid var(--qsa-border-light)`, `border-radius: var(--qsa-radius-card)`.
- **Hover Lift**: `transform: translateY(-4px)`, `box-shadow: var(--qsa-shadow-lift)`.
- **Focus**: `outline: var(--qsa-focus-ring) solid 3px; outline-offset: 3px;`.

### 4.2 Buttons & Pills
- **Primary Button**: Background `#ff6b2c`, color `#0a0f1c`, `font-weight: 700`, `border-radius: 999px`, `min-height: 48px`, padding `14px 26px`.
- **Secondary / Outline Button**: Border `1.5px solid #334155`, color `#ffffff`, background transparent.
- **Pill Filter Tab**: Active state background `#ff6b2c`, text `#0a0f1c`; inactive background transparent, border `#334155`.

### 4.3 Paragraph Margin Tools (`.qsa-rail`)
- Sits in the right margin on desktop (`margin-left: 16px`).
- Collapsed quiet state: discreet circular button group.
- Expands on hover/focus into action icons:
  - 👁️ Visualise
  - 💡 Explain Simply
  - 🎯 Check Yourself
  - 🖍️ Highlight
  - 📝 Add Note
  - 💬 Ask on WhatsApp
  - 🔖 Bookmark

### 4.4 Floating Selection Toolbar (`.qsa-toolbar`)
- Positioned dynamically above selected text bounding rect using `getRangeAt(0).getBoundingClientRect()`.
- Touch devices: floats at the bottom of the viewport to prevent finger occlusion.
- Keyboard accessible via `V` hotkey when text is highlighted.
- Closes cleanly on click outside, Escape, or deselection.

### 4.5 Visual Canvas Renderers (Section 5.4)
Container properties:
- `width: 100%`, max-width `720px`, margin `24px auto`.
- Responsive padding, background `var(--qsa-bg-muted-light)` or dark elevated surface.
- Border `1.5px solid var(--qsa-border-light)` or `var(--qsa-border-dark)`.
- Full text alternative and semantic SVG `<title>` and `<desc>` tags.
- Animated reveals driven by CSS transitions, disabled when `prefers-reduced-motion` is active.
