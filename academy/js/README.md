# Quick Academy JavaScript Core Runtime

## Overview
Modular ES6 client-side application engine driving routing, state persistence, reading flow, interactive quizzes, certificates, and offline storage.

## Interface
- `router`: [router.js:87] Client hash router dispatching routes for `#course-<id>`, `#lesson-<course>-<id>`, `#certificates`, `#learning`.
- `store`: [store.js:378] Central state store handling progress, bookmarks, badges, theme, and language depth preferences in `localStorage` (`qsa-progress-v2`).
- `loadLessonView(container, { courseId, lessonId })`: [lesson.js:51] Mounts reading view with inline visuals, self-checks, and syllabus drawer.
- `renderCertificateView(container, { certId, courseId })`: [certificate.js:16] Generates high-res 300 DPI canvas certificates with anti-counterfeiting guilloché borders.
- `synthesizeLesson(course, lessonId)`: [curriculum-synthesizer.js:8] Dynamically builds complete fallback lessons to prevent 404 errors.
- `getCourseThumbnailSvg(courseId)`: [thumbnails.js:7] Generates inline SVG banner graphics for catalog cards.

### Subdirectories & Component Contracts
- [Visuals Engine](./visuals/README.md): 30+ semantic inline SVG and HTML data visualizers.
- [Quiz Engine](./quiz/README.md): Formative paragraph checks and summative graded exams.
- [Widgets](./widgets/README.md): 15 interactive academic, statistical, and research tools.
- [Storage Subsystem](./storage/README.md): IndexedDB wrapper for avatars, notes, and research figures.
- [Components & Uploader](./components/README.md): Client-side image compression and file upload processing.

## Invariants
- Zero build tools: All scripts must execute natively as standard ES modules (`<script type="module">`).
- Safe state mutation: All state modifications must pass through `store` methods to ensure synchronous persistence to `localStorage`.
- No external CDN execution: Zero runtime dependencies outside Google Fonts.

## Side Effects
- Mutates `localStorage` (`qsa-progress-v2`) and `IndexedDB` (`QuickAcademyDB`).
- Listens to window `hashchange` events and updates document title and DOM shells.

## Verification
- Run engine tests: `node ../tools/test-engines.mjs`
- Run content validation: `node ../tools/validate-content.mjs`

