# Quick Services — Agent Configuration

EGM artifact directory: academy/docs/designs

## Architecture & Subsystems
- **Marketing & Root Site**: Static HTML/CSS/JS located in repository root (`index.html`, `guide.html`, `tools/`).
- **Quick Academy Subsystem**: Comprehensive client-side academic learning platform under `academy/` (see `academy/AGENTS.md` and `academy/README.md`).
- **WordPress Theme Subsystem**: Full Site Editing (FSE) block theme located under `wordpress/quickservices-theme/` implementing Oxford Academic Editorial styling, native Gutenberg block patterns, and the 12-modality quiz and 30 SVG visual engines.

## EGM Workflow
Always adhere to the Elephant-Goldfish Model for new features and structural updates:
- Brainstorm: `/egm-brainstorm <topic>`
- Draft: `/egm-draft`
- Review: `/egm-review academy/docs/designs/design_draft.md`
- Resolve: `/egm-resolve academy/docs/designs/design_draft.md`
- Bootstrap: `/egm-bootstrap academy`
