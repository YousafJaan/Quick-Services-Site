# Design Specification: Quick Academy Engine Completion (Resolved & Approved)

**Status**: APPROVED (Post-Goldfish Design Review)  
**Target Subsystem**: `quick-services-site/academy`  
**Review Pass**: 2026-11-02 (Addressed all Goldfish Critic feedback)

---

## 1. System Context & Purpose
Quick Academy is a zero-build client-side learning platform hosted on Cloudflare Pages. This specification defines the exact contracts, algorithms, mobile UX rules, and runtime test harness required to complete the 12-modality quiz engine, 30-renderer visual engine, and verifiable certificate issuance.

---

## 2. Technical Contracts & JSON Schemas

### 2.1 Quiz Question Modalities (`js/quiz/index.js`)

1. **`match`** (Concept-to-Definition Pairing):
   - **Schema**: `{ type: "match", prompt: string, pairs: [{ key: string, value: string }] }`
   - **Interaction**: Student selects an unselected item from the Left column (Key) and then selects its counterpart from the Right column (Value).
   - **Mobile (360px)**: Columns stack or use a two-step selector (Tap Key $\rightarrow$ Key activates with accent border $\rightarrow$ Tap matching definition $\rightarrow$ Pair locks with color indicator). Min height 48px per target.
   - **Scoring**: Full credit (1 point) when all pairs are matched correctly with $\le 1$ mistake.

2. **`categorise`** (Bucket Classification):
   - **Schema**: `{ type: "categorise", prompt: string, categories: [{ id: string, label: string }], items: [{ text: string, categoryId: string }] }`
   - **Interaction**: Uncategorized items appear as interactive chips. Clicking an item and clicking a category bucket assigns it.
   - **Mobile (360px)**: Category buckets stack vertically as full-width drop areas with clear touch targets.
   - **Scoring**: Full credit (1 point) if all items are assigned to their correct category.

3. **`hotspot`** (Interactive Diagram Tapping):
   - **Schema**: `{ type: "hotspot", prompt: string, svgContent: string, targets: [{ id: string, x: number, y: number, r: number, isCorrect: boolean, feedback: string }] }`
   - **Interaction**: Scaled SVG with clickable circular or polygonal hotspot nodes.
   - **Mobile (360px)**: Responsive `viewBox="0 0 400 300"`. Hotspots maintain minimum touch area radius ($\ge 24\text{px}$) with an accessible numbered radio fallback list below the diagram for screen reader / precise tap accessibility.

4. **`shortAnswer`** (Rubric-Guided Self-Check):
   - **Schema**: `{ type: "shortAnswer", prompt: string, modelAnswer: string, keyPoints: string[] }`
   - **Interaction**: User types response into textarea. Clicking "Submit & Reveal Rubric" displays the model answer and key points checklist. User clicks "Complete" if they addressed the core points.
   - **Scoring**: Binary threshold: student self-assesses against the model criteria; completing self-assessment awards 1 point (ensures `this.score` remains within `this.questions.length`).

5. **`scenario`** (Branching Case Study):
   - **Schema**: `{ type: "scenario", prompt: string, scenarioText: string, options: [{ text: string, outcome: string, isCorrect: boolean }] }`
   - **Interaction**: Narrative card presenting an empirical dilemma. Selecting an option displays immediate diagnostic feedback on consequences and methodological reasoning.
   - **Scoring**: 1 point if the best methodological path is selected.

6. **`calculation`** (Numeric Formulation):
   - **Schema**: `{ type: "calculation", prompt: string, formulaHint?: string, expected: number, tolerance: number, toleranceType: "relative" | "absolute", unit?: string }`
   - **Interaction**: Input with `type="number"`, `inputmode="decimal"`, `step="any"`.
   - **Evaluation**:
     - If `toleranceType === "relative"`: $|user - expected| \le |expected \times tolerance|$.
     - If `toleranceType === "absolute"`: $|user - expected| \le tolerance$.
   - **Scoring**: 1 point if user entry falls within tolerance bounds.

---

### 2.2 Visual Component Renderers (`js/visuals/index.js`)

1. **`venn`**:
   - **Schema**: `{ kind: "venn", title?: string, sets: [{ label: string, color?: string }], intersection: { label: string } }`
   - **Renderer**: Pure SVG with responsive `viewBox="0 0 400 240"`, two overlapping circles with opacity, centered text labels.
2. **`pyramid`**:
   - **Schema**: `{ kind: "pyramid", title?: string, levels: [{ label: string, description?: string, color?: string }] }`
   - **Renderer**: SVG stepped triangle/trapezoid stack from apex to foundation base.
3. **`numberLine`**:
   - **Schema**: `{ kind: "numberLine", title?: string, min: number, max: number, markers: [{ val: number, label: string, color?: string }] }`
   - **Renderer**: Horizontal SVG axis with tick marks, baseline, and colored milestone flags.
4. **`barchart`**:
   - **Schema**: `{ kind: "barchart", title?: string, bars: [{ label: string, value: number, max?: number, color?: string }] }`
   - **Renderer**: Accessible horizontal bar rows with label, bar fill, and percentage/count.
5. **`donut`**:
   - **Schema**: `{ kind: "donut", title?: string, percent: number, centerLabel?: string, caption?: string }`
   - **Renderer**: SVG circle with `stroke-dasharray` ring meter and centered percentage text.
6. **`mindmap`**:
   - **Schema**: `{ kind: "mindmap", title?: string, root: string, branches: [{ title: string, items: string[] }] }`
   - **Renderer**: Flexbox/grid card layout with central node connected to branch clusters.
7. **`iconCards`**:
   - **Schema**: `{ kind: "iconCards", title?: string, cards: [{ icon: string, title: string, text: string }] }`
   - **Renderer**: Responsive grid of cards (`minmax(220px, 1fr)`) with icons and copy.
8. **`keyTermCard`**:
   - **Schema**: `{ kind: "keyTermCard", term: string, phonetic?: string, definition: string, context?: string }`
   - **Renderer**: Distinctive card with terracotta border accent and pronunciation tag.
9. **`table`**:
   - **Schema**: `{ kind: "table", title?: string, headers: string[], rows: (string | number)[][] }`
   - **Renderer**: Striped table with horizontal scroll affordance wrapper.
10. **`anatomy`**:
    - **Schema**: `{ kind: "anatomy", title?: string, sample: string, parts: [{ label: string, text: string, color?: string }] }`
    - **Renderer**: Dissected text block with color-coded badges and callout indicators.
11. **`textFallback`**:
    - **Schema**: `{ kind: "textFallback", title?: string, content: string }`
    - **Renderer**: Clean typography block with quotation accent and soft background.

---

### 2.3 Deterministic Checksum & Certificate Generator (`js/certificate.js`)

- **Format**: `QSA-{COURSE_CODE}-{YEAR_MONTH}-{TIMESTAMP_HEX}-{CHECKSUM}`
- **Algorithm (FNV-1a 32-bit Hash)**:
  ```javascript
  export function computeFnv1a32(str) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = (hash * 0x01000193) >>> 0;
    }
    return hash.toString(16).toUpperCase().padStart(8, '0');
  }
  ```
- **Payload for Checksum**:
  To allow the standalone `#verify-` route to independently verify structural integrity without external database dependencies, the checksum verifies the integrity of the issued components:
  `${courseCode}:${yearMonth}:${timestampHex}:${salt}`
  Where `salt` is the platform constant `'QSA-VERIFIED-2026'`.
  On verification route `#verify-`:
  1. Parse `certId` into `QSA`, `courseCode`, `yearMonth`, `timestampHex`, `checksum`.
  2. Compute `computeFnv1a32(`${courseCode}:${yearMonth}:${timestampHex}:QSA-VERIFIED-2026`).substring(0, 4)`.
  3. If computed checksum matches the ID's checksum, the credential format, course code, and issue timestamp are cryptographically verified.

---

### 2.4 Automated Engine Test Harness (`tools/test-engines.mjs`)
Create a zero-dependency ES module test runner executed with `node tools/test-engines.mjs`:
- Imports `js/quiz/index.js`, `js/visuals/index.js`, and `js/certificate.js`.
- Renders synthetic fixtures for all 12 question types and verifies DOM output structure.
- Tests scoring evaluation across all 12 question modalities.
- Renders synthetic fixtures for all 30 visual kinds and verifies non-empty valid HTML/SVG markup.
- Tests certificate generation and checksum verification round-trip.
- Exits with code 0 on all tests passing, or code 1 with descriptive failure traces.
