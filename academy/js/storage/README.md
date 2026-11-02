# Offline Storage & IndexedDB Subsystem

## Overview
Provides offline-first structured persistence for heavy binary assets, decagonal user avatars, research figures (statistical plots, tables), and personal study notes using the browser's native IndexedDB API.

## Interface
- `openDB()`: [storage/idb.js:11] Opens or initializes the `QuickAcademyDB` (version 1) database with stores:
  - `user_profiles` (keyPath: `id`)
  - `research_figures` (keyPath: `id`, indices: `courseId`, `createdAt`)
  - `lesson_notes` (keyPath: `id`, indices: `lessonKey`, `createdAt`)
- `saveUserProfile(profile)`: [storage/idb.js:61] Persists avatar data URL and metadata under `active_user`.
- `getUserProfile()`: [storage/idb.js:79] Retrieves stored profile for the active learner.
- `saveResearchFigure(figure)`: [storage/idb.js:99] Stores uploaded or generated research figures.
- `getAllResearchFigures()`: [storage/idb.js:119] Returns all figures sorted chronologically.
- `saveLessonNote(note)`: [storage/idb.js:151] Stores student margin notes linked to lesson sentences.
- `getLessonNotes(lessonKey)`: [storage/idb.js:175] Fetches notes for a specific lesson.
- `deleteLessonNote(id)`: [storage/idb.js:192] Removes a note by ID.

## Invariants
- Database schema upgrades must increment `DB_VERSION` monotonically.
- All write operations operate within readwrite transactions.
- Graceful error catch: Environment without IndexedDB access falls back to console warnings without crashing.

## Side Effects
- Asynchronously opens and updates client IndexedDB storage.

## Verification
- Run: `node ../../tools/validate-content.mjs`

