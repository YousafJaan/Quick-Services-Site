# Quick Academy Verification & Validation Tools

## Overview
Automated pedagogical content, schema linter, and runtime engine test suites for courses, modules, lessons, and interactive quiz banks.

## Interface
- `validate-content.mjs`: CLI linter verifying integrity of all JSON course manifests, lessons, sentence-level visuals, and question banks.
- `test-engines.mjs`: Automated runtime ES module test harness validating all 30 visual component renderers, 12 quiz modalities, and cryptographic certificate checksum hashing.

## Invariants
- Schema compliance: Enforces valid question types (`single`, `trueFalse`, `multi`, `fillBlank`, `order`, `spotError`, `match`, `categorise`, `hotspot`, `shortAnswer`, `scenario`, `calculation`).
- Pedagogy bounds: Ensures every reading lesson has matching self-checks and inline visuals.
- Zero error policy: Both test runners exit with status code 1 on any dangling reference, schema violation, or runtime failure.

## Side Effects
- Reads filesystem under `../data/`.

## Verification
- Run engine tests: `node test-engines.mjs`
- Run content linter: `node validate-content.mjs`
