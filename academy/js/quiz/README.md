# Unified Quiz Engine

## Overview
Manages formative paragraph self-checks, module assessments, and course certification exams across all 12 distinct question modalities with instant feedback and score persistence.

## Interface
- `QuizEngine`: [quiz/index.js:6] Class orchestrating question selection, UI rendering, response evaluation, score calculation, and completion callbacks.
  - `constructor(container, options)`: Accepts bank, pass mark threshold, isSelfCheck flag, and callbacks.
  - `render()`: Mounts question cards or triggers final result view.
  - `_renderQuestionInput(q)`: Dispatches interactive form controls for all 12 modalities.
  - `_evaluateAnswer(q)`: Evaluates user responses against correct keys, accepted strings, tolerance bands, or self-evaluations.
  - `renderResults()`: Displays score metrics, mistake reviews, and certificate unlock triggers.
- Supported modalities (12): `single`, `multi`, `trueFalse`, `fillBlank`, `order`, `spotError`, `match`, `categorise`, `hotspot`, `shortAnswer`, `scenario`, `calculation`.

## Invariants
- Deterministic self-checks: Formative paragraph self-checks evaluate immediately and do not shuffle order.
- Summative randomization: Graded exams shuffle question pools and sample up to `showCount`.
- Passing grade gate: Passing mark defaults to 70% before granting lesson or course certification credits.
- Score consistency: Every question evaluates to a binary pass (0 or 1 point) to ensure total score never exceeds `questions.length`.

## Side Effects
- Modifies host container DOM innerHTML.
- Records completion and attempts via `store.setQuizAttempt()` and `store.setSelfCheck()`.

## Verification
- Run engine tests: `node ../../tools/test-engines.mjs`
- Run content validation: `node ../../tools/validate-content.mjs`
