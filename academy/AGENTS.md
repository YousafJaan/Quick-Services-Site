# Quick Services Academy — AI Agent & EGM Specification

EGM artifact directory: docs/designs

## 1. Architectural Philosophy & Hard Invariants
Quick Services Academy is an offline-first, client-side educational platform hosted on Cloudflare Pages:
- **Zero Build Step**: Pure HTML5, modern CSS with Custom Properties, and modular vanilla JavaScript (ES modules). No Webpack, Vite, or Node compiler in production.
- **Zero Blocking Dependencies**: External web assets are restricted to Google Fonts with clean system font fallbacks. All diagrams and charts are authored as inline vector SVGs or CSS components.
- **Client Persistence**: 
  - `localStorage` using key `qsa-progress-v2` for user settings, lesson progress, quiz attempts, and bookmarking.
  - `IndexedDB` (`QuickAcademyDB` v1) for binary assets, decagonal user avatars, APA research figures, and lesson notes.
- **Zero 404 Routing**: All dynamic lesson parameters gracefully synthesize readable fallbacks via `curriculum-synthesizer.js` if static JSON is missing.

## 2. Elephant-Goldfish Model (EGM) Integration
When planning, modifying, or extending features for Quick Services Academy:

### Elephant (Authoring & Deep Context)
- Retain domain context of Quick Academy (academic writing, statistical tools, Turnitin similarity defense, APA citations, Cloudflare Pages hosting).
- Draft specifications iteratively into `docs/designs/design_draft.md`.
- Break complex UI/UX or data schema modifications into manageable phases.

### Goldfish (Zero-Context Reviewers)
Use the installed EGM review loop (`/egm-review docs/designs/design_draft.md`) to stress-test drafts against fresh perspectives:
- **`egm-design`**: Audits client-side state consistency, offline resiliency, and responsive limits down to 360px.
- **`egm-codebase-details`**: Enforces reuse of existing components (`visuals`, `widgets`, `uploader`, `idb`, `store`).
- **`egm-implementation-readiness`**: Verifies step-by-step zero-build instructions and avoids introducing unneeded bundlers or external CDNs.
- **`egm-style` & `egm-comprehension`**: Ensures educational clarity for students and ESL researchers.

## 3. Verification Commands
- Validate course manifests, modules, and quiz questions:
  `node tools/validate-content.mjs`
- Test static local server:
  `python -m http.server 8080` or `npx serve .`

