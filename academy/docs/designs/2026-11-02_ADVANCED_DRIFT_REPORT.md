# EGM Codebase Drift & Bug Audit Report: Quick Services Academy Advanced Version

**Audit Date**: 2026-11-02  
**Scope**: `c:\Users\Huzaifa Mahi\quick-services-site\academy` & root site  
**Auditor**: EGM Codebase Auditor & Architect  
**Status**: COMPLETE (Bugs Isolated)

---

## 1. Executive Summary
Following the deployment of the initial EGM component contracts, an exhaustive line-by-line inspection of the runtime integration points, event pipelines, and routing architecture revealed **four critical runtime integration bugs** and **three architectural opportunities** required to deliver the "Advanced Version" of the platform:
1. **Critical Inverted Parameter Bug**: `lesson.js` passes `(mount, widgetType)` to `renderWidget`, whereas `widgets/index.js` defines `(widgetName, container)`. This broke all 15 interactive visual widgets in visual lessons.
2. **Critical Question Property Mismatch**: `lesson.js` instantiates `QuizEngine` with `{ questions: ... }`, but `quiz/index.js` accesses `options.bank`. This caused quiz lessons to initialize with an empty question list.
3. **Hyphenated Course ID Truncation**: In `lesson.js` line 925, `window.location.hash.split('-')[1]` truncates `lit-search` and `sample-size` into `lit` and `sample`, corrupting the course context and defaulting prompt templates.
4. **Brittle Hash Route Parsing**: `router.js` used `lastIndexOf('-')` to separate course and lesson tokens, which is ambiguous if either course or lesson identifiers contain hyphens.
5. **Lack of Global Quick-Search (`Ctrl+K`)**: Students had to manually browse cards without an instant global lookup across all 168 lesson topics and curriculum notes.
6. **Widget Parameter Interactivity**: Several widgets in `widgets/index.js` had static preview text rather than full two-way binding with dynamic formula calculations.

---

## 2. Granular Bug Matrix

| # | File & Line | Observed Code | Expected / Contract Code | Severity | Impact |
|---|---|---|---|---|---|
| **BUG-01** | `academy/js/lesson.js:1475` | `renderWidget(mount, widgetType, lesson)` | `renderWidget(widgetType, mount)` or polymorphic `(a, b)` | **Critical** | All interactive widget lessons fail or fallback to checklist |
| **BUG-02** | `academy/js/lesson.js:1483` | `new QuizEngine(quizMount, { questions: ... })` | `options.bank` or `options.bank || options.questions` | **Critical** | Standalone quiz lessons render 0 questions |
| **BUG-03** | `academy/js/lesson.js:925` | `window.location.hash.split('-')[1]` | Regex/lookup mapping full course code (`lit-search`, `sample-size`) | **High** | AI prompt and takeaway cards lose course context |
| **BUG-04** | `academy/js/router.js:28` | `rest.lastIndexOf('-')` | Match against registered course codes | **Medium** | Route failure if lessonId contains a hyphen |
| **BUG-05** | `academy/js/widgets/index.js` | Static calculations on 일부 widgets | Reactive formulas with interactive parameter sliders and outputs | **Medium** | Diminished pedagogical depth in statistical tools |

---

## 3. Drift Analysis vs. Component Contracts

### 3.1 `academy/js/widgets/README.md`
- **Contract**: "Export `renderWidget(widgetName, container)` supporting all 15 academic widgets."
- **Drift**: Function signature strictly expected string first, but caller passed DOM element first. No polymorphism existed.

### 3.2 `academy/js/quiz/README.md`
- **Contract**: "Accept flexible question banks for both micro-checks and standalone summative quizzes."
- **Drift**: Code solely read `options.bank`, breaking callers passing `options.questions`.

### 3.3 `academy/js/README.md`
- **Contract**: "Zero-404 navigation across all 9 courses and 168 curriculum units."
- **Drift**: Route parsing split on single hyphens, risking navigation breakage on composite course slugs.

---

## 4. Remediation Mandate
All five identified issues must be rectified in the Advanced Version specification, verified via automated tests, reviewed by an EGM Goldfish subagent, and deployed.

