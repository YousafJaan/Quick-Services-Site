# Client-Side Components & Asset Processing

## Overview
Provides client-side media manipulation, image compression (WebP / JPEG via HTML5 Canvas), decagonal profile framing, and dropzone management without server uploads.

## Interface
- `MAX_FILE_SIZE`: [components/uploader.js:7] 5MB size ceiling constant.
- `ALLOWED_TYPES`: [components/uploader.js:8] Permitted MIME types (`image/png`, `image/jpeg`, `image/webp`, `image/gif`).
- `processImageFile(file, options)`: [components/uploader.js:14] Compresses, scales, and optionally squares images using an offscreen canvas; returns `{ blob, dataUrl, width, height, size, originalName }`.

## Invariants
- Client-only execution: Zero bytes uploaded to external backends; all transformations occur in-memory.
- Size limit check: Immediately rejects assets exceeding 5MB with descriptive error.
- Aspect ratio preservation: Non-square images retain aspect ratios within configured bounding dimensions.

## Side Effects
- Allocates temporary DOM FileReader and Canvas memory.

## Verification
- Run: `node ../../tools/validate-content.mjs`

