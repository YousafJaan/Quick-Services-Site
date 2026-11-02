# Visual Components Engine

## Overview
Provides a zero-raster, client-side rendering engine for 30 semantic visual components (data flows, matrices, comparisons, funnels, timelines, and SVG graphs) rendered directly into the reading flow.

## Interface
- `renderVisual(visual)`: [visuals/index.js:6] Main dispatcher returning accessible HTML/SVG strings based on `visual.kind`.
- `renderFallback(visual)`: [visuals/index.js:460] Graceful fallback renderer for missing or unhandled visual types.
- Supported visual kinds (30): `definition`, `compare`, `funnel`, `annotatedExample`, `hierarchy`, `checklist`, `scale`, `process`, `dosDonts`, `matrix2x2`, `quote`, `mistakeFix`, `cycle`, `flow`, `timeline`, `decisionTree`, `stack`, `beforeAfter`, `formula`, `venn`, `pyramid`, `numberLine`, `barchart`, `donut`, `mindmap`, `iconCards`, `keyTermCard`, `table`, `anatomy`, `textFallback`.

## Invariants
- Zero external image assets: Every visual must render via pure HTML or inline SVG with vector scalability.
- Contrast compliance: Color tokens must map to CSS custom properties (`var(--qsa-...)`) to respect light and dark themes.
- Escape safety: All user or JSON-supplied text strings must pass through `escapeHtml()` to prevent injection.
- Block scoping: All `switch` cases must be wrapped in block scopes `{ ... }` to avoid variable collision across cases.

## Side Effects
- None (pure functional string rendering without DOM mutation).

## Verification
- Run engine tests: `node ../../tools/test-engines.mjs`
- Run content validation: `node ../../tools/validate-content.mjs`
