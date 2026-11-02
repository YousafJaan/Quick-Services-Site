/**
 * Quick Services Academy — Automated Engine & Modality Test Suite
 * Zero-dependency ES module test runner validating runtime behavior of:
 * - 30 Semantic Visual Component Renderers (visuals/index.js)
 * - 12 Interactive Quiz Question Modalities (quiz/index.js)
 * - Cryptographic Certificate Generation & Verification (certificate.js)
 */

import { renderVisual } from '../js/visuals/index.js';
import { QuizEngine } from '../js/quiz/index.js';
import { generateVerifiableCertId, verifyCertId } from '../js/certificate.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  ✕ FAIL: ${message}`);
    failed++;
  } else {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  }
}

console.log('🚀 Running Quick Academy Engine & Modality Test Suite...\n');

// ============================================================================
// 1. Visual Component Renderers (30 Kinds)
// ============================================================================
console.log('--- 1. Testing 30 Semantic Visual Renderers ---');

const ALL_VISUAL_KINDS = [
  'definition', 'compare', 'funnel', 'annotatedExample', 'hierarchy',
  'checklist', 'scale', 'process', 'dosDonts', 'matrix2x2',
  'quote', 'mistakeFix', 'cycle', 'flow', 'timeline',
  'decisionTree', 'stack', 'beforeAfter', 'formula', 'venn',
  'pyramid', 'numberLine', 'barchart', 'donut', 'mindmap',
  'iconCards', 'keyTermCard', 'table', 'anatomy', 'textFallback'
];

for (const kind of ALL_VISUAL_KINDS) {
  try {
    const html = renderVisual({
      kind,
      title: `Test ${kind}`,
      data: {
        term: 'Construct Validity',
        meaning: 'Degree to which an operational test measures theoretical construct.',
        sets: [{ label: 'Qualitative' }, { label: 'Quantitative' }],
        intersection: { label: 'Mixed Methods' },
        levels: [{ label: 'Foundations' }, { label: 'Application' }],
        min: 0,
        max: 100,
        markers: [{ val: 19, label: 'HEC Limit' }],
        bars: [{ label: 'SPSS', value: 85 }, { label: 'SmartPLS', value: 92 }],
        percent: 85,
        centerLabel: 'Retention Rate',
        root: 'Research Design',
        branches: [{ title: 'Empirical', items: ['Survey', 'Experiment'] }],
        cards: [{ icon: '📊', title: 'Data Analysis', text: 'Statistical tests' }],
        headers: ['Method', 'Power', 'Sample'],
        rows: [['Regression', '0.80', '92']],
        sample: 'Smith et al. (2020)',
        parts: [{ label: 'Author', text: 'Smith et al.' }],
        content: 'Unstructured academic observation.'
      }
    });

    assert(
      typeof html === 'string' && html.includes('visual-card') && html.includes(`data-visual-kind="${kind}"`),
      `Visual renderer for kind "${kind}" produces valid card container`
    );
  } catch (err) {
    assert(false, `Visual renderer for kind "${kind}" threw exception: ${err.message}`);
  }
}

// ============================================================================
// 2. Cryptographic Certificate Checksum Engine
// ============================================================================
console.log('\n--- 2. Testing Cryptographic Certificate Engine ---');

const certId = generateVerifiableCertId('THESIS');
assert(
  typeof certId === 'string' && certId.startsWith('QSA-THESIS-'),
  `generateVerifiableCertId generates valid QSA prefix: ${certId}`
);

const verification = verifyCertId(certId);
assert(
  verification.valid === true && verification.courseCode === 'THESIS',
  `verifyCertId successfully validates genuine certificate ID checksum`
);

const tamperedId = certId.slice(0, -1) + (certId.slice(-1) === 'A' ? 'B' : 'A');
const tamperedVerification = verifyCertId(tamperedId);
assert(
  tamperedVerification.valid === false && tamperedVerification.reason === 'Checksum mismatch',
  `verifyCertId rejects tampered certificate ID with checksum mismatch`
);

// ============================================================================
// 3. Quiz Question Modalities (12 Engines)
// ============================================================================
console.log('\n--- 3. Testing 12 Quiz Question Modalities ---');

function createMockElement(tag = 'div') {
  const el = {
    tagName: tag.toUpperCase(),
    innerHTML: '',
    children: [],
    style: {},
    dataset: {},
    classList: {
      classes: new Set(),
      add(c) { this.classes.add(c); },
      remove(c) { this.classes.delete(c); },
      toggle(c) { if (this.classes.has(c)) this.classes.delete(c); else this.classes.add(c); },
      contains(c) { return this.classes.has(c); }
    },
    querySelector(selector) {
      if (selector === '#calc-input') return { value: '384' };
      if (selector === '#fill-input') return { value: 'sample size' };
      if (selector === '#q-submit-btn') return { innerText: 'Submit', addEventListener() {} };
      if (selector === '#q-feedback-area') return { innerHTML: '' };
      return createMockElement();
    },
    querySelectorAll() {
      return [createMockElement('div'), createMockElement('div')];
    },
    addEventListener() {}
  };
  return el;
}

const ALL_QUESTION_TYPES = [
  { type: 'single', q: 'What is the standard alpha?', options: ['0.05', '0.10'], answer: 0 },
  { type: 'trueFalse', q: 'Turnitin limits match size.', options: ['True', 'False'], answer: 0 },
  { type: 'multi', q: 'Select non-parametric tests.', options: ['Mann-Whitney', 'Kruskal-Wallis', 't-test'], answer: [0, 1] },
  { type: 'fillBlank', q: 'What formula is used for finite populations?', answer: 'cochran', accepted: ['cochran', 'cochran formula'] },
  { type: 'order', q: 'Arrange thesis steps.', steps: ['Topic', 'Literature', 'Methodology'] },
  { type: 'spotError', q: 'Find error.', sentence: 'The data was analyzed with SPSS.' },
  { type: 'match', q: 'Match terms.', pairs: [{ key: 'p-value', value: 'Probability' }] },
  { type: 'categorise', q: 'Sort variables.', categories: [{ id: 'dep', label: 'Dependent' }], items: [{ text: 'Outcome', categoryId: 'dep' }] },
  { type: 'hotspot', q: 'Tap intercept.', targets: [{ id: 'b0', x: 50, y: 50, isCorrect: true }] },
  { type: 'shortAnswer', q: 'Explain HTMT ratio.', modelAnswer: 'Heterotrait-Monotrait ratio of correlations.' },
  { type: 'scenario', q: 'Sample size dilemma.', options: [{ text: 'Apply G*Power', isCorrect: true }] },
  { type: 'calculation', q: 'Calculate Cochran n0.', expected: 384.16, tolerance: 0.05, toleranceType: 'relative' }
];

for (const q of ALL_QUESTION_TYPES) {
  try {
    const mockContainer = createMockElement();
    const engine = new QuizEngine(mockContainer, { bank: [q] });
    assert(
      engine && engine.questions.length === 1,
      `QuizEngine successfully initializes and renders modality "${q.type}"`
    );
  } catch (err) {
    assert(false, `QuizEngine failed on modality "${q.type}": ${err.message}`);
  }
}

// Test calculation evaluation logic
try {
  const calcQ = { type: 'calculation', q: 'Calculate Cochran', expected: 384.16, tolerance: 0.05, toleranceType: 'relative' };
  const mockContainer = createMockElement();
  const engine = new QuizEngine(mockContainer, { bank: [calcQ] });
  engine._evaluateAnswer(calcQ);
  assert(engine.score === 1, 'Calculation evaluation correctly validates answer within relative tolerance');
} catch (err) {
  assert(false, `Calculation evaluation threw error: ${err.message}`);
}

// ============================================================================
// Final Summary
// ============================================================================
console.log(`\n==================================================`);
console.log(`Test Execution Complete: ${passed} passed, ${failed} failed`);
console.log(`==================================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('✅ ALL ENGINES & MODALITIES VERIFIED SUCCESSFULLY!');
  process.exit(0);
}
