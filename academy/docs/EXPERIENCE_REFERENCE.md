# Experience Reference Study: Anthropic Skilljar & Modern Interactive Learning

## 1. Executive Summary
This document records the interaction patterns, visual hierarchies, and structural affordances observed on the public catalog and course pages of **Anthropic Courses (Skilljar)** (`https://anthropic.skilljar.com`), supplemented by best practices from modern interactive learning platforms (e.g., Brilliant, Khan Academy, Duolingo, Stripe Documentation).

The goal is to translate these proven patterns into **Quick Services Academy**, ensuring the academy feels as professional, trustworthy, and engaging as leading global technical learning platforms, while retaining the unique visual identity and voice of Quick Services.

---

## 2. Catalog & Discovery Patterns

### 2.1 Course Card Architecture
On Anthropic Skilljar, course cards prioritize clarity, information hierarchy, and scannability:
1. **Course Hero Art**: Skilljar uses branded graphic banners for each course. For Quick Services Academy, we use **procedurally generated inline SVG cover art** built exclusively with our tokens (Brand Orange `#ff6b2c`, Warm Peach `#fdba74`, Deep Navy `#0a0f1c`), avoiding generic raster stock photography.
2. **Category & Level Metadata**: Explicit chips indicating domain (e.g. `Research Design`, `Methodology`, `Statistics`, `Academic Writing`) and audience level (`Undergraduate`, `MS / MPhil`, `PhD / Early Career`).
3. **Pacing & Scale**: Honest lesson count and calculated duration (e.g., `18 Lessons • 3.5 Hours`), preventing student surprise.
4. **Completion / Resume States**:
   - Not started: High-contrast pill button (`Start Course`).
   - In progress: Progress bar / ring showing percentage (`Continue • 45%`).
   - Completed: Verified badge with quick access to the Certificate (`Review • Certificate Earned 🏆`).
5. **Card Edges & Hover Physics**: Crisp `1.5px` border with `22px` border-radius. On hover, a subtle `transform: translateY(-4px)` lift with a layered shadow (`0 12px 24px -8px rgba(0,0,0,0.1)`), signaling interactivity without layout shift.

### 2.2 Catalog Filtering & Search
- **Instant Client-Side Filtering**: Filter by topic tags and difficulty tiers without page reloads.
- **Search Engine**: Title, description, and keyword indexing running locally in JavaScript.
- **"Continue Where You Left Off" Strip**: A dedicated hero banner pinned to the top of the catalog when active courses exist in `localStorage`.

---

## 3. Curriculum & Course Page Patterns

### 3.1 Course Overview Hero
- **Value Proposition**: 1-2 sentence core thesis ("Learn how to transform a vague topic into an empirically defensible thesis proposal").
- **Learning Outcomes**: 4–6 concrete outcome bullets written in behavioral verbs ("Calculate required statistical power using G*Power", "Identify and rectify self-plagiarism in Turnitin reports").
- **Course Prerequisites & Target Audience**: Plain statement of background required.

### 3.2 Modular Curriculum Layout
Anthropic organizes courses into clean modular groupings:
- Module container with title, short description, and cumulative module duration.
- Vertical lesson rows featuring:
  - Modality icon: `Read` (book/document), `Video` (play triangle), `Interactive Widget` (sliders/gears), `Quiz` (checkmark target).
  - Estimated time in honest minutes.
  - Completion status indicator (empty circle -> green checkmark).

---

## 4. Lesson Player & Reader Patterns

### 4.1 Collapsible Curriculum Outline
- Left-hand sticky sidebar on desktop (`280px` width) displaying the course tree, active lesson highlight, and completed checkboxes.
- On mobile (`< 768px`), the outline collapses into an accessible slide-over drawer triggered by an outline button in the header.

### 4.2 Depth Controls (Quick / Standard / Deep)
Traditional LMS platforms force all learners through a single monolithic text block. Quick Services Academy introduces a 3-tier depth toggle at the top of every reading lesson:
- **Quick**: 2-3 sentence core concept breakdown and key takeaways.
- **Standard**: Complete pedagogical lesson with clear explanations and worked examples.
- **Deep**: Technical derivations, statistical formulas, university policy edge cases, and supervisor navigation advice.

### 4.3 Margin Rail & Selection Floating Toolbar
- **Paragraph Margin Rail**: Desktop hover rail / mobile handle providing immediate paragraph-level tools:
  - *Visualise*: Render the pre-authored semantic SVG/HTML visual.
  - *Explain Simply*: Plain English restatement for ESL students.
  - *Check Yourself*: Optional formative micro-check.
  - *Highlight & Note*: Four highlight tints stored in `localStorage`.
  - *Ask via WhatsApp*: Pre-fills question with paragraph context.
- **Floating Selection Toolbar**: When text is highlighted, an accessible popover appears above the selection (or bottom sheet on mobile) offering instant sentence visualization and note-taking.

---

## 5. Assessment & Feedback Patterns

### 5.1 Formative Paragraph Self-Checks (Section 5.5)
- Never gates progression or certificate eligibility.
- Measures confidence (1 to 5 stars) before and after answering.
- Highlights discrepancies (e.g., high confidence + incorrect answer) to diagnose cognitive blind spots.
- Directly feeds the dashboard's spaced repetition flashcard deck.

### 5.2 Graded Module Quizzes & Final Checks (Section 5.6)
- **12 Diverse Question Types**: Single choice, multiple select, true/false with reason, fill-in-the-blank with typo tolerance, drag-to-order, pair matching, bucket categorization, diagram hotspot clicking, text error spotting, rubric-guided short answer, branching scenarios, and numerical calculations with tolerance.
- **Question Banks**: Modules pull random subsets from a 3x larger bank to ensure retries test understanding rather than memorization.
- **70% Passing Standard**: Passing unlocks the course certificate; non-passing prompts gentle remediation jumps without dead ends.

---

## 6. Certificate & Credential Flow

### 6.1 Completion State
- Automatically unlocked when all lessons are marked complete and the final comprehensive check achieves $\ge 70\%$.
- Includes student name editing, dynamic verification ID generation, hours of verified study recorded, and course syllabus summary.
- Multi-format delivery: High-resolution canvas PNG export, printer-optimized PDF stylesheet, and hash-based verification view.
