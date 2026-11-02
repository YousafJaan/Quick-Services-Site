# Quick Services Academy Blueprint

## System Overview
Quick Services Academy is an offline-first, client-side educational platform engineered for students, researchers, and professionals. It delivers masterclasses in thesis writing, academic integrity (Turnitin defense), APA 7th referencing, SPSS/SmartPLS data analysis, and viva defense. The application is built to run with zero build pipelines, zero heavy frameworks, and 100% client-side persistence on Cloudflare Pages.

## Local Interface & Invariants
- `index.html`: Root Single Page Application (SPA) shell containing mount roots (`#app`, `#view-mount`, navigation bar, global modal mounts, and syllabus drawer).
- `sw.js`: Service Worker caching core HTML, CSS, JavaScript, and font assets for instant offline execution.
- `manifest.json`: Progressive Web App (PWA) configuration for standalone mobile and desktop installation.

## Subdirectories & System Boundaries
- [Core JavaScript Runtime](./js/README.md) - Hash routing, LocalStorage state store, reading engine, quiz engine, and canvas certificate issuer.
- [Validation Tools](./tools/README.md) - Static content and JSON schema validator (`validate-content.mjs`).
- [Documentation & Specifications](./docs/ARCHITECTURE.md) - System architecture, pedagogical curriculum map, design system tokens, and APA guidelines.
- `docs/designs`: EGM artifact directory housing concept briefs (`concepts_brief.md`) and specifications (`design_draft.md`).
- `css/`: Pure CSS styling modules (`tokens.css`, `base.css`, `components.css`, `visuals.css`, `quiz.css`).
- `data/`: Course catalog manifests, curriculum modules, and lesson JSON datasets.

## Global Invariants
- **Zero Build Requirement**: The production site must run directly from raw static files without any intermediate compilation, bundlers, or preprocessing.
- **Zero Framework Footprint**: Built with standard web platform APIs (HTML5, CSS Custom Properties, ES modules).
- **Graceful Offline Degradation**: All user actions, course progress, notes, and quiz submissions function without internet connectivity using `localStorage` and `IndexedDB`.
- **Zero 404 Routing**: Any unmapped course or lesson hash route synthesizes readable fallback content rather than breaking the application flow.

## Global Side Effects
- Browser storage persistence: Writes progress data to `localStorage['qsa-progress-v2']` and media to `IndexedDB['QuickAcademyDB']`.
- Service worker cache registration: Pre-caches shell assets during service worker install phase.

## System Verification
- Run automated engine test suite (30 visuals, 12 quiz modalities, certificate checksum):
  ```bash
  node tools/test-engines.mjs
  ```
- Run content validation:
  ```bash
  node tools/validate-content.mjs
  ```

