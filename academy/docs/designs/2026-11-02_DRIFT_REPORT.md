# EGM Drift Report: Quick Services Academy

**Date**: 2026-11-02  
**Target Subsystem**: `quick-services-site/academy`  
**Inspected Specifications**: `docs/ARCHITECTURE.md`, `docs/SCHEMA.md`, `docs/CERTIFICATE_VERIFICATION.md`, `docs/QA_REPORT.md`  
**Inspected Source Files**: `js/quiz/index.js`, `js/visuals/index.js`, `js/certificate.js`, `tools/validate-content.mjs`

---

## 1. Discrepancies & Divergences Found

### A. Quiz Engine Modalities Drift
- **Specification (`docs/SCHEMA.md` §5 & `docs/ARCHITECTURE.md` §2)**: Specifies a unified quiz engine handling all **12 question modalities**: `single`, `multi`, `trueFalse`, `fillBlank`, `order`, `match`, `categorise`, `hotspot`, `spotError`, `shortAnswer`, `scenario`, and `calculation`.
- **Actual Code (`js/quiz/index.js`)**: Implemented only 6 modalities (`single`, `trueFalse`, `multi`, `fillBlank`, `order`, `spotError`). The remaining 6 modalities (`match`, `categorise`, `hotspot`, `shortAnswer`, `scenario`, `calculation`) are absent, causing quizzes containing them to render nothing or error.

### B. Visual Component Renderers Drift
- **Specification (`docs/SCHEMA.md` §4 & `docs/ARCHITECTURE.md` §2)**: Specifies **30 built-in semantic HTML/SVG renderers** (including `venn`, `pyramid`, `numberLine`, `barchart`, `donut`, `mindmap`, `iconCards`, `keyTermCard`, `table`, `anatomy`).
- **Actual Code (`js/visuals/index.js`)**: Contains only 19 explicit `switch` cases. Types like `venn`, `pyramid`, `numberLine`, `barchart`, `donut`, `mindmap`, `iconCards`, `keyTermCard`, `table`, and `anatomy` fall through to the unstyled `renderFallback()`.

### C. Certificate ID Cryptographic Checksum Drift
- **Specification (`docs/CERTIFICATE_VERIFICATION.md` §1.1)**: Specifies deterministic certificate ID structure: `QSA-{COURSE_CODE}-{YEAR_MONTH}-{TIMESTAMP_HEX}-{CHECKSUM}` incorporating a verifiable checksum of student name, score, and issue date.
- **Actual Code (`js/certificate.js:34`)**: Uses an ad-hoc random string format: `QSA-${course.code}-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}` without cryptographic checksum hashing.

### D. Content Linter Engine Validation Drift
- **Specification (`docs/SCHEMA.md`)**: The linter `tools/validate-content.mjs` should validate all 12 question modalities and all 30 visual types.
- **Actual Code (`tools/validate-content.mjs`)**: Only validates basic question formats (`single`, `trueFalse`, `multi`).

---

## 2. Action Plan & Architectural Remediation
1. **Extend `js/quiz/index.js`**: Implement the missing 6 question modalities (`match`, `categorise`, `hotspot`, `shortAnswer`, `scenario`, `calculation`) with zero external libraries and keyboard accessibility.
2. **Extend `js/visuals/index.js`**: Add accessible inline SVG renderers for `venn`, `pyramid`, `numberLine`, `barchart`, `donut`, `mindmap`, `iconCards`, `keyTermCard`, `table`, and `anatomy`.
3. **Upgrade `js/certificate.js`**: Implement deterministic hex timestamp and CRC32 / DJB2 checksum generation conforming to `CERTIFICATE_VERIFICATION.md`.
4. **Update `tools/validate-content.mjs`**: Expand validator rules to verify all 12 question modalities and all 30 visual kinds.

