# EGM Concepts Brief: Quick Services Academy Advanced Version

**Date**: 2026-11-02  
**Target Architecture**: Quick Services Academy LMS (Pure Client-Side Vanilla ES6)  
**Author**: Antigravity EGM Swarm  
**Status**: APPROVED FOR DESIGN DRAFT

---

## 1. Problem Statement & Motivation
Quick Services Academy provides free, HEC-Pakistan-aligned postgraduate research methodology training. To elevate it to the "Advanced Version", it must eliminate all integration friction, deliver immediate interactive utility across all 15 statistical widgets, provide lightning-fast keyboard-driven discovery, and offer an airtight offline-first student experience.

---

## 2. Core Themes & Pillars

### Pillar 1: Airtight Runtime Engineering & Bug Neutralization
- **Polymorphic Widget Dispatch**: `renderWidget` accepts either `(widgetName, container)` or `(container, widgetName)` seamlessly.
- **Universal Quiz Engine Ingestion**: `QuizEngine` seamlessly accepts `options.bank` or `options.questions` or direct array.
- **Deterministic Course Slug Resolution**: Exact course ID lookup (`thesis101`, `cite101`, `integrity101`, `edit101`, `lit-search`, `sample-size`, `spss101`, `smartpls`, `viva`) without substring truncation.
- **Robust Route Parsing**: Prefix matching for multi-hyphen routes ensuring zero routing failure across all 168 lesson URLs.

### Pillar 2: Omnipresent Academic Command Palette (`Ctrl+K` & `/`)
- Global floating search modal accessible anywhere via keyboard shortcut `Ctrl+K`, `Cmd+K`, or `/`.
- Real-time indexing across 9 courses, 40 modules, 168 lessons, and key methodology topics (e.g. "G*Power", "Cronbach", "HTMT", "Turnitin", "APA 7th").
- Rich result preview with badges, duration, course tags, and instant navigation.

### Pillar 3: Ultra-Interactive Statistical & Empirical Widgets
- **Viva Defense Flashcards**: Fully interactive next/previous deck flipping with model answers and examiner traps.
- **Interactive Slide Timer**: Live countdown simulation with pace warning indicators.
- **Dynamic Cochran & Power Calculators**: Two-way responsive slider and input binding with animated SVG bell curves.
- **APA 7 Dissecter & SPSS Annotator**: Click-to-explain with clipboard copy for thesis methodology chapters.

### Pillar 4: PWA Offline Sentinel & Identity Locking
- Live connection indicator (`🟢 Online • Synchronized` / `🟠 Offline • Local Storage Active`).
- Tamper-proof student identity verification with FNV-1a checksum validation.
- Export all personal lesson notes & highlights as formatted Markdown (.md) or printable PDF report.

---

## 3. Scope & Non-Goals
- **In-Scope**: Pure vanilla ES6, client-side offline storage, zero-build asset integrity, responsive down to 360px mobile viewports.
- **Out-of-Scope**: Adding npm dependencies, Webpack, Vite, or server-side database requirements.

