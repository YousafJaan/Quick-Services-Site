# Concepts Brief: Quick Academy Architectural Alignment & Engine Upgrades

**Target Subsystem**: `quick-services-site/academy`  
**Author**: EGM Elephant  
**Status**: Ready for Goldfish Review  

---

## 1. Problem Statement
The Quick Services Academy platform specification mandates:
1. 12 assessment modalities in `QuizEngine` (`quiz/index.js`).
2. 30 semantic HTML5/inline-SVG visual renderers in `visuals/index.js`.
3. Deterministic verifiable certificate IDs in `certificate.js`.
4. Comprehensive content linting in `tools/validate-content.mjs`.

However, the drift audit confirmed that 6 quiz modalities and 11 visual kinds are currently unhandled or routed to a generic fallback, and certificate IDs are generated via random substrings rather than verifiable checksums.

## 2. Proposed Architectural Changes

### 2.1 Complete 12 Quiz Question Modalities (`js/quiz/index.js`)
Implement the remaining 6 engines:
- `match`: Interactive concept-to-definition matching with pair selection and immediate feedback.
- `categorise`: Sorting items into distinct category cards.
- `hotspot`: Accessible clickable diagram zones with SVG coordinate validation.
- `shortAnswer`: Self-evaluation against academic model rubrics.
- `scenario`: Multi-step branching case studies.
- `calculation`: Numeric input validation with custom tolerance bands (e.g. $\pm 5\%$).

### 2.2 Complete 30 Visual Component Renderers (`js/visuals/index.js`)
Add pure SVG/HTML renderers for:
- `venn`: Overlapping circles with set intersections.
- `pyramid`: Layered pyramid with label bands.
- `numberLine`: Horizontal axis with colored milestone points.
- `barchart`: Accessible horizontal/vertical comparative bars.
- `donut`: Clean SVG stroke-dasharray percentage rings.
- `mindmap`: Node-and-branch conceptual map.
- `iconCards`: Grid of structured key-concept tiles.
- `keyTermCard`: Highlighted academic glossary cards.
- `table`: Clean striped academic data tables.
- `anatomy`: Component dissection with callout pointers.
- `textFallback`: Graceful typography card for legacy text.

### 2.3 Cryptographic Certificate Checksum Generator (`js/certificate.js`)
Implement deterministic `generateCertificateId(courseCode, studentName, score, issueDate)` producing:
`QSA-{COURSE_CODE}-{YEAR_MONTH}-{HEX_TIMESTAMP}-{CHECKSUM_HEX}`
Using a lightweight in-browser polynomial checksum algorithm (DJB2/CRC32).

### 2.4 Update Content Validator (`tools/validate-content.mjs`)
Extend permitted question types and visual kinds lists to cover all 12 questions and all 30 visuals.

## 3. Invariants & Constraints
- Zero Build Step: All additions must remain pure ES6 modules without bundling or transpilation.
- Zero External Dependencies: All visuals must be inline SVGs or semantic CSS.
- Responsive to 360px: Every new interactive control must adapt cleanly to small mobile viewports.

