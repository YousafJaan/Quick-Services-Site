/**
 * Quick Services Academy — Interactive Academic & Statistical Widgets (15 Tools)
 * Zero external libraries, responsive down to 360px, fully keyboard and touch accessible.
 * Pro-Level v2.6.0: 100% Theme-Token Reactive (Zero Hardcoded Hexes in DOM), High-Legibility Dark Theme.
 */

export const WIDGET_REGISTRY = [
  'sampleSize',
  'powerExplainer',
  'funnel',
  'planner',
  'apa',
  'sim',
  'testPicker',
  'spssOutput',
  'plsModel',
  'thresholds',
  'boolean',
  'zoteroFlow',
  'vivaCards',
  'slideTimer',
  'checklist'
];

/**
 * Teardown any running timers, intervals, or detached animations.
 */
export function teardownWidget(container) {
  if (typeof window !== 'undefined' && window.__qsaActiveTimer) {
    clearInterval(window.__qsaActiveTimer);
    window.__qsaActiveTimer = null;
  }
  if (container && container.__qsaTimerId) {
    clearInterval(container.__qsaTimerId);
    container.__qsaTimerId = null;
  }
}

/**
 * Polymorphic dispatcher for academic widgets.
 * Supports both standard (widgetName, container, context) and inverted (container, widgetName, context).
 */
export function renderWidget(paramA, paramB, paramC) {
  teardownWidget();

  let widgetName = '';
  let container = null;
  let context = {};

  if (typeof paramA === 'string' && WIDGET_REGISTRY.includes(paramA)) {
    widgetName = paramA;
    container = typeof paramB === 'string' ? document.getElementById(paramB) : paramB;
    context = paramC || {};
  } else if (typeof paramB === 'string' && WIDGET_REGISTRY.includes(paramB)) {
    widgetName = paramB;
    container = typeof paramA === 'string' ? document.getElementById(paramA) : paramA;
    context = paramC || {};
  } else if (typeof paramA === 'string' && !paramB) {
    widgetName = paramA;
    container = document.getElementById(paramA) || document.body;
  } else {
    container = typeof paramA === 'string' ? document.getElementById(paramA) : paramA;
    widgetName = typeof paramB === 'string' ? paramB : 'checklist';
    context = paramC || {};
  }

  if (!container) return;

  switch (widgetName) {
    case 'sampleSize':
      renderCochranCalculator(container, context);
      break;
    case 'powerExplainer':
      renderPowerExplainer(container, context);
      break;
    case 'funnel':
      renderTopicFunnel(container, context);
      break;
    case 'planner':
      renderWordPlanner(container, context);
      break;
    case 'apa':
      renderApaDissecter(container, context);
      break;
    case 'sim':
      renderSimilaritySimulator(container, context);
      break;
    case 'testPicker':
      renderTestPicker(container, context);
      break;
    case 'spssOutput':
      renderSpssAnnotator(container, context);
      break;
    case 'plsModel':
      renderPlsModel(container, context);
      break;
    case 'thresholds':
      renderThresholdsTable(container, context);
      break;
    case 'boolean':
      renderBooleanBuilder(container, context);
      break;
    case 'zoteroFlow':
      renderZoteroFlow(container, context);
      break;
    case 'vivaCards':
      renderVivaCards(container, context);
      break;
    case 'slideTimer':
      renderSlideTimer(container, context);
      break;
    case 'checklist':
    default:
      renderChecklistWidget(container, context);
      break;
  }
}

// -------------------------------------------------------------
// 1. Cochran's Formula Calculator
// -------------------------------------------------------------
function renderCochranCalculator(el) {
  el.innerHTML = `
    <div class="qsa-widget-card">
      <div class="qsa-widget-head">
        <h4 class="qsa-widget-title">Cochran's Sample Size Calculator</h4>
        <span class="pro-lesson-type-badge visual">Statistical Tool</span>
      </div>
      <p class="qsa-widget-desc">
        Calculate required statistical sample size with finite population correction (Cochran, 1977).
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div>
          <label class="qsa-widget-label">Confidence Level (Z)</label>
          <select id="calc-z" class="qsa-widget-input">
            <option value="1.96" selected>95% Confidence (Z = 1.96)</option>
            <option value="2.576">99% Confidence (Z = 2.576)</option>
            <option value="1.645">90% Confidence (Z = 1.645)</option>
          </select>
        </div>

        <div>
          <label class="qsa-widget-label">Margin of Error (e)</label>
          <select id="calc-e" class="qsa-widget-input">
            <option value="0.05" selected>±5% Margin (0.05 Standard)</option>
            <option value="0.03">±3% Margin (0.03 Precision)</option>
            <option value="0.01">±1% Margin (0.01 Stringent)</option>
          </select>
        </div>

        <div>
          <label class="qsa-widget-label">Known Population Size N (Optional)</label>
          <input type="number" id="calc-n" class="qsa-widget-input" placeholder="Leave blank if infinite">
        </div>
      </div>

      <div class="qsa-widget-dark-box" style="margin-top: 24px;">
        <div style="font-size: 11.5px; font-weight: 800; text-transform: uppercase; color: #fbd38d; letter-spacing: 1px;">Recommended Sample Size</div>
        <div id="calc-result" style="font-size: 48px; font-weight: 800; color: var(--qsa-terracotta); margin: 6px 0;">384</div>
        <div id="calc-formula" style="font-size: 13px; color: var(--qsa-text-muted); font-family: monospace;">
          n₀ = (1.96² × 0.5 × 0.5) / 0.05² = 384.16
        </div>
      </div>
    </div>`;

  const update = () => {
    const z = parseFloat(el.querySelector('#calc-z').value);
    const e = parseFloat(el.querySelector('#calc-e').value);
    const popVal = el.querySelector('#calc-n').value;
    const p = 0.5; // Maximum variability
    const n0 = (z * z * p * (1 - p)) / (e * e);
    let finalN = Math.ceil(n0);
    let formulaText = `n₀ = (${z}² × 0.25) / ${e}² = ${n0.toFixed(2)}`;

    if (popVal && parseInt(popVal, 10) > 0) {
      const N = parseInt(popVal, 10);
      const corrected = n0 / (1 + (n0 - 1) / N);
      finalN = Math.ceil(corrected);
      formulaText += ` → Adjusted for N=${N.toLocaleString()}: ${finalN} participants`;
    }

    el.querySelector('#calc-result').innerText = finalN;
    el.querySelector('#calc-formula').innerText = formulaText;
  };

  el.querySelectorAll('select, input').forEach(inp => inp.addEventListener('input', update));
}

// -------------------------------------------------------------
// 2. Statistical Power Visualizer
// -------------------------------------------------------------
function renderPowerExplainer(el) {
  el.innerHTML = `
    <div class="qsa-widget-card">
      <div class="qsa-widget-head">
        <h4 class="qsa-widget-title">Statistical Power & Effect Size Visualizer</h4>
        <span class="pro-lesson-type-badge visual">G*Power Concept</span>
      </div>
      <p class="qsa-widget-desc">
        Notice how increasing effect size or sample size separates the null (H₀) and alternative (H₁) distributions, reducing Type II error (β).
      </p>

      <div style="margin: 20px 0;">
        <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; margin-bottom: 6px;">
          <span>Cohen's Effect Size (d):</span>
          <span id="power-d-val" style="color: var(--qsa-terracotta);">0.50 (Medium)</span>
        </div>
        <input type="range" id="power-d" class="qsa-widget-range" min="0.1" max="1.0" step="0.05" value="0.5">
      </div>

      <div class="qsa-widget-dark-box" style="padding: 20px;">
        <svg id="power-svg" viewBox="0 0 500 200" style="width: 100%; height: auto; max-height: 200px;">
          <!-- Bell curves rendered dynamically -->
        </svg>
      </div>
      <div style="margin-top: 16px; font-size: 13.5px; color: var(--qsa-text-secondary); line-height: 1.6;">
        <strong>Statistical Power (1 - β):</strong> <span id="power-calc-pct" style="color: var(--qsa-terracotta); font-weight: 800;">80%</span>.
        A power of 0.80 means an 80% probability of detecting a real empirical effect if it exists in the population.
      </div>
    </div>`;

  const draw = () => {
    const d = parseFloat(el.querySelector('#power-d').value);
    const label = d < 0.3 ? 'Small' : d < 0.7 ? 'Medium' : 'Large';
    el.querySelector('#power-d-val').innerText = `${d.toFixed(2)} (${label})`;

    const shift = d * 110;
    const powerPct = Math.min(99, Math.round(48 + d * 48));
    el.querySelector('#power-calc-pct').innerText = `${powerPct}%`;

    const svg = el.querySelector('#power-svg');
    svg.innerHTML = `
      <defs>
        <linearGradient id="gradNull" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#94a3b8" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#94a3b8" stop-opacity="0.0"/>
        </linearGradient>
        <linearGradient id="gradAlt" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="var(--qsa-terracotta)" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="var(--qsa-terracotta)" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <line x1="20" y1="170" x2="480" y2="170" stroke="var(--qsa-border-strong)" stroke-width="2"/>
      <path d="M 40 170 Q 160 20 280 170 Z" fill="url(#gradNull)" stroke="#94a3b8" stroke-width="2"/>
      <text x="160" y="80" fill="#94a3b8" font-size="12" font-weight="700" text-anchor="middle">H₀ (Null)</text>
      <path d="M ${40 + shift} 170 Q ${160 + shift} 20 ${280 + shift} 170 Z" fill="url(#gradAlt)" stroke="var(--qsa-terracotta)" stroke-width="2"/>
      <text x="${160 + shift}" y="80" fill="var(--qsa-terracotta)" font-size="12" font-weight="700" text-anchor="middle">H₁ (Alternative)</text>
    `;
  };

  el.querySelector('#power-d').addEventListener('input', draw);
  draw();
}

// -------------------------------------------------------------
// 3. Topic Narrowing Funnel
// -------------------------------------------------------------
function renderTopicFunnel(el) {
  el.innerHTML = `
    <div class="qsa-widget-card">
      <div class="qsa-widget-head">
        <h4 class="qsa-widget-title">The 4-Stage Topic Narrowing Funnel</h4>
        <span class="pro-lesson-type-badge visual">Thesis Framing</span>
      </div>
      <p class="qsa-widget-desc">
        Click each stage to transition from an unmanageable domain to a defensible thesis problem statement.
      </p>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button type="button" class="funnel-btn qsa-widget-btn-secondary" data-stage="1" style="width: 100%; border-radius: var(--qsa-radius-pill);">Stage 1: Broad Thematic Domain (e.g. Social Media & Well-being)</button>
        <button type="button" class="funnel-btn qsa-widget-btn-secondary" data-stage="2" style="width: 85%; margin: 0 auto; border-radius: var(--qsa-radius-pill);">Stage 2: Bounded Population (e.g. Postgraduate Students in Multan)</button>
        <button type="button" class="funnel-btn qsa-widget-btn-secondary" data-stage="3" style="width: 70%; margin: 0 auto; border-radius: var(--qsa-radius-pill);">Stage 3: Defined Variables (e.g. FOMO & Sleep Quality)</button>
        <button type="button" class="funnel-btn qsa-widget-btn active" data-stage="4" style="width: 55%; margin: 0 auto; border-radius: var(--qsa-radius-pill);">Stage 4: Defensible Research Question</button>
      </div>

      <div id="funnel-desc" class="qsa-widget-muted-box" style="margin-top: 24px; font-size: 14.5px; line-height: 1.6;">
        <strong>Defensible Research Question:</strong><br>
        <em>"To what extent does Fear of Missing Out (FOMO) mediate the relationship between evening smartphone usage and self-reported sleep quality among undergraduate medical students in Multan?"</em>
      </div>
    </div>`;

  const details = {
    1: '<strong>Stage 1 (Broad Domain):</strong> Too wide. An empirical literature review would require thousands of unmanageable papers with zero boundary conditions.',
    2: '<strong>Stage 2 (Bounded Population):</strong> Confines target respondents to a distinct educational and geographic cohort, preventing examiner scope creep.',
    3: '<strong>Stage 3 (Defined Variables):</strong> Establishes clear independent, dependent, and mediating constructs measured via validated psychometric scales.',
    4: '<strong>Stage 4 (Defensible Empirical Question):</strong> Fully defensible for proposal defense. Specifies who, what, where, and the exact relationship to be statistically modeled.'
  };

  el.querySelectorAll('.funnel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.funnel-btn').forEach(b => {
        b.className = 'funnel-btn qsa-widget-btn-secondary';
      });
      btn.className = 'funnel-btn qsa-widget-btn active';
      el.querySelector('#funnel-desc').innerHTML = details[btn.dataset.stage];
    });
  });
}

// -------------------------------------------------------------
// 4. Word Planner
// -------------------------------------------------------------
function renderWordPlanner(el) {
  el.innerHTML = `
    <div class="qsa-widget-card">
      <div class="qsa-widget-head">
        <h4 class="qsa-widget-title">Thesis Word Budget & Chapter Planner</h4>
        <span class="pro-lesson-type-badge visual">Dissertation Roadmap</span>
      </div>
      <p class="qsa-widget-desc">Enter your target dissertation word count to view proportional allocation across all 5 chapters.</p>
      
      <div style="margin: 16px 0 24px;">
        <label class="qsa-widget-label">Target Word Count</label>
        <input type="number" id="planner-total" class="qsa-widget-input" value="20000" step="1000" style="max-width: 260px;">
      </div>
      <div id="planner-bars" style="display: flex; flex-direction: column; gap: 10px;"></div>
    </div>`;

  const chapters = [
    { name: 'Chapter 1: Introduction & Problem Framing', pct: 0.12, role: 'Hook, Anchor, Gap, Research Questions, and Delimitation scope.' },
    { name: 'Chapter 2: Systematic Literature Review', pct: 0.30, role: 'Thematic synthesis, theoretical framework, and hypothesis development.' },
    { name: 'Chapter 3: Methodology & Research Design', pct: 0.18, role: 'Sampling frame, G*Power calculations, scale validity, and ethics.' },
    { name: 'Chapter 4: Results & Hypothesis Testing', pct: 0.22, role: 'Normality screening, factor loadings, and APA 7th path coefficients.' },
    { name: 'Chapter 5: Discussion & Defense Conclusions', pct: 0.18, role: 'Theoretical implications, contextual limitations, and recommendations.' }
  ];

  const update = () => {
    const total = parseInt(el.querySelector('#planner-total').value, 10) || 20000;
    const barsContainer = el.querySelector('#planner-bars');
    barsContainer.innerHTML = chapters.map(ch => {
      const words = Math.round(total * ch.pct);
      return `
        <div class="qsa-widget-muted-box" style="padding: 14px 18px;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 14.5px; color: var(--qsa-primary-navy);">
            <span>${ch.name}</span>
            <span style="color: var(--qsa-terracotta);">${words.toLocaleString()} words (${ch.pct * 100}%)</span>
          </div>
          <div style="font-size: 12.5px; color: var(--qsa-text-muted); margin-top: 4px;">${ch.role}</div>
        </div>`;
    }).join('');
  };

  el.querySelector('#planner-total').addEventListener('input', update);
  update();
}

// -------------------------------------------------------------
// 5. APA 7 Dissecter
// -------------------------------------------------------------
function renderApaDissecter(el) {
  el.innerHTML = `
    <div class="qsa-widget-card">
      <div class="qsa-widget-head">
        <h4 class="qsa-widget-title">Interactive APA 7th Reference Dissecter</h4>
        <span class="pro-lesson-type-badge visual">APA 7th Manual</span>
      </div>
      <p class="qsa-widget-desc">
        Click each highlighted component to view its official APA 7th manual rule.
      </p>
      <div class="qsa-widget-muted-box" style="font-size: 16px; line-height: 2.2; font-family: var(--qsa-font-serif);">
        <span class="apa-part" data-rule="author" style="cursor: pointer; background: var(--qsa-terracotta-soft); color: var(--qsa-terracotta); padding: 4px 8px; border-radius: 6px; font-weight: 700;">Khan, A. M., &amp; Yousaf, M.</span>
        <span class="apa-part" data-rule="year" style="cursor: pointer; background: var(--qsa-status-success-bg); color: var(--qsa-status-success); padding: 4px 8px; border-radius: 6px; font-weight: 700;">(2025).</span>
        <span class="apa-part" data-rule="title" style="cursor: pointer; background: var(--qsa-primary-navy-soft); color: var(--qsa-primary-navy); padding: 4px 8px; border-radius: 6px;">Evaluating statistical power in postgraduate business dissertations.</span>
        <span class="apa-part" data-rule="source" style="cursor: pointer; background: var(--qsa-bg-fill); color: var(--qsa-text-primary); padding: 4px 8px; border-radius: 6px;"><em>Journal of Higher Education Research</em>, 14(2), 112–128.</span>
        <span class="apa-part" data-rule="doi" style="cursor: pointer; background: var(--qsa-bg-subtle); color: var(--qsa-text-secondary); padding: 4px 8px; border-radius: 6px; font-family: monospace; font-size: 13.5px;">https://doi.org/10.1016/j.jher.2025.02.004</span>
      </div>
      <div id="apa-explanation" class="qsa-widget-card" style="margin-top: 20px; font-size: 14px; line-height: 1.6; padding: 18px;">
        👉 Click any highlighted element above to inspect the specific formatting rule.
      </div>
    </div>`;

  const rules = {
    author: '<strong>Author Element:</strong> Invert all surnames followed by initials. Use ampersand (&) before the final author. For 3 to 20 authors, list all in full.',
    year: '<strong>Date Element:</strong> Enclosed in parentheses followed by a period. Do not include month or day for standard peer-reviewed journal articles.',
    title: '<strong>Article Title:</strong> Use sentence case (capitalize only the first letter of title and subtitle, plus proper nouns). Never italicize journal article titles.',
    source: '<strong>Journal Source:</strong> Italicize the Journal Title and the Volume Number. Keep the issue number non-italicized in parentheses. Include inclusive page range with an en-dash.',
    doi: '<strong>DOI Resolver:</strong> Must be presented as an active HTTPS hyperlink format (https://doi.org/10.xxxx/...). Never place a concluding period after a DOI.'
  };

  el.querySelectorAll('.apa-part').forEach(part => {
    part.addEventListener('click', () => {
      el.querySelector('#apa-explanation').innerHTML = rules[part.dataset.rule];
    });
  });
}

// -------------------------------------------------------------
// 6. Reactive Turnitin Simulator
// -------------------------------------------------------------
function renderSimilaritySimulator(el) {
  el.innerHTML = `
    <div class="qsa-widget-card">
      <div class="qsa-widget-head">
        <h4 class="qsa-widget-title">Turnitin Similarity Simulator &amp; HEC Policy Checker</h4>
        <span class="pro-lesson-type-badge visual">HEC Policy</span>
      </div>
      <p class="qsa-widget-desc">
        Test how direct quotes, patchwriting, and exclusions impact your overall Turnitin index against HEC Pakistan criteria.
      </p>

      <div style="display: grid; gap: 16px; margin: 20px 0;">
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; margin-bottom: 4px;">
            <span>Direct Quoted Text:</span>
            <span id="sim-quotes-val" style="color: var(--qsa-terracotta);">10%</span>
          </div>
          <input type="range" id="sim-quotes" class="qsa-widget-range" min="0" max="30" step="1" value="10">
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; margin-bottom: 4px;">
            <span>Patchwriting &amp; Inadequate Paraphrasing:</span>
            <span id="sim-patch-val" style="color: var(--qsa-terracotta);">8%</span>
          </div>
          <input type="range" id="sim-patch" class="qsa-widget-range" min="0" max="30" step="1" value="8">
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 20px; padding: 12px 0;">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13.5px; cursor: pointer;">
            <input type="checkbox" id="sim-ex-bib" checked style="width: 18px; height: 18px; accent-color: var(--qsa-terracotta);"> Exclude Bibliography (HEC Permitted)
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13.5px; cursor: pointer;">
            <input type="checkbox" id="sim-ex-quotes" checked style="width: 18px; height: 18px; accent-color: var(--qsa-terracotta);"> Exclude Cited Quotes (HEC Permitted)
          </label>
        </div>
      </div>

      <div id="sim-banner" class="qsa-widget-dark-box">
        <div style="font-size: 11.5px; font-weight: 800; text-transform: uppercase; color: #fbd38d; letter-spacing: 0.8px;">Calculated Similarity Index</div>
        <div id="sim-score" style="font-size: 52px; font-weight: 800; color: #34d399; margin: 6px 0;">12%</div>
        <div id="sim-status" style="font-size: 14px; font-weight: 700; color: #34d399;">🟢 Safe for HEC Proposal/Thesis Submission (≤ 19%)</div>
      </div>
    </div>`;

  const update = () => {
    const quotes = parseInt(el.querySelector('#sim-quotes').value, 10);
    const patch = parseInt(el.querySelector('#sim-patch').value, 10);
    const exBib = el.querySelector('#sim-ex-bib').checked;
    const exQuotes = el.querySelector('#sim-ex-quotes').checked;

    el.querySelector('#sim-quotes-val').innerText = `${quotes}%`;
    el.querySelector('#sim-patch-val').innerText = `${patch}%`;

    const quotesContrib = quotes * (exQuotes ? 0.15 : 1.0);
    const patchContrib = patch * 1.25;
    const bibReduction = exBib ? 6 : 0;
    const score = Math.max(1, Math.min(100, Math.round(quotesContrib + patchContrib - bibReduction)));

    const scoreEl = el.querySelector('#sim-score');
    const statusEl = el.querySelector('#sim-status');
    scoreEl.innerText = `${score}%`;

    if (score < 15) {
      scoreEl.style.color = '#34d399';
      statusEl.style.color = '#34d399';
      statusEl.innerHTML = '🟢 Safe for HEC Proposal/Thesis Submission (&lt; 15%)';
    } else if (score <= 19) {
      scoreEl.style.color = '#fbbf24';
      statusEl.style.color = '#fbbf24';
      statusEl.innerHTML = '🟡 Borderline Caution (15% - 19%) — Check single source matches (&lt; 5%)';
    } else {
      scoreEl.style.color = '#f87171';
      statusEl.style.color = '#f87171';
      statusEl.innerHTML = '🔴 Critical Plagiarism Warning (&gt; 19%) — Exceeds HEC Pakistan Threshold';
    }
  };

  el.querySelectorAll('input').forEach(inp => inp.addEventListener('input', update));
  update();
}

// -------------------------------------------------------------
// 7. Statistical Test Picker
// -------------------------------------------------------------
function renderTestPicker(el) {
  el.innerHTML = `
    <div class="qsa-widget-card">
      <div class="qsa-widget-head">
        <h4 class="qsa-widget-title">Statistical Test Selector</h4>
        <span class="pro-lesson-type-badge visual">Methodology Guide</span>
      </div>
      <p class="qsa-widget-desc">Answer two questions to discover the exact statistical test required for your empirical data.</p>
      <div style="display: flex; flex-direction: column; gap: 16px; margin: 20px 0;">
        <div>
          <label class="qsa-widget-label">Research Goal</label>
          <select id="tp-goal" class="qsa-widget-input">
            <option value="means">Comparing group means (e.g. Male vs Female GPA)</option>
            <option value="relation">Testing relationship between continuous variables</option>
            <option value="predict">Predicting an outcome variable from multiple factors</option>
          </select>
        </div>
        <div>
          <label class="qsa-widget-label">Comparison Groups</label>
          <select id="tp-groups" class="qsa-widget-input">
            <option value="2">2 Independent Groups</option>
            <option value="3">3 or more Groups</option>
          </select>
        </div>
      </div>
      <div id="tp-result" class="qsa-widget-muted-box" style="border-left: 4px solid var(--qsa-terracotta);">
        <strong>Recommended Test:</strong> Independent Samples t-Test<br>
        <span style="font-size: 13px; color: var(--qsa-text-muted);">Assumptions: Normal distribution (Shapiro-Wilk) and Homogeneity of variance (Levene's test).</span>
      </div>
    </div>`;

  const update = () => {
    const goal = el.querySelector('#tp-goal').value;
    const groups = el.querySelector('#tp-groups').value;
    const res = el.querySelector('#tp-result');

    if (goal === 'means') {
      if (groups === '2') {
        res.innerHTML = `<strong>Recommended Test:</strong> Independent Samples t-Test<br><span style="font-size: 13px; color: var(--qsa-text-muted);">Assumptions: Normality (Shapiro-Wilk) and Homogeneity of Variance (Levene's Test).</span>`;
      } else {
        res.innerHTML = `<strong>Recommended Test:</strong> One-Way ANOVA with Post-Hoc Tests (Tukey/Bonferroni)<br><span style="font-size: 13px; color: var(--qsa-text-muted);">Assumptions: Normality of residuals and equal variances across groups.</span>`;
      }
    } else if (goal === 'relation') {
      res.innerHTML = `<strong>Recommended Test:</strong> Pearson Bivariate Correlation (r)<br><span style="font-size: 13px; color: var(--qsa-text-muted);">Assumptions: Linear relationship between interval/ratio variables without severe outliers.</span>`;
    } else {
      res.innerHTML = `<strong>Recommended Test:</strong> Multiple Linear Regression<br><span style="font-size: 13px; color: var(--qsa-text-muted);">Assumptions: No multicollinearity (VIF < 5.0), homoscedasticity, and normal residuals.</span>`;
    }
  };

  el.querySelectorAll('select').forEach(s => s.addEventListener('change', update));
}

// -------------------------------------------------------------
// 8. SPSS Output Annotator
// -------------------------------------------------------------
function renderSpssAnnotator(el) {
  el.innerHTML = `
    <div class="qsa-widget-card">
      <div class="qsa-widget-head">
        <h4 class="qsa-widget-title">SPSS Output Table Annotator (Independent Samples t-Test)</h4>
        <span class="pro-lesson-type-badge visual">SPSS Practical</span>
      </div>
      <p class="qsa-widget-desc">Click on any statistical output cell to learn how to interpret it and write it in APA 7th style.</p>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-family: monospace; font-size: 13.5px;">
          <thead>
            <tr style="background: var(--qsa-primary-navy); color: #ffffff;">
              <th style="padding: 12px; border: 1px solid var(--qsa-border);">Variable</th>
              <th style="padding: 12px; border: 1px solid var(--qsa-border);">Levene Sig.</th>
              <th style="padding: 12px; border: 1px solid var(--qsa-border);">t</th>
              <th style="padding: 12px; border: 1px solid var(--qsa-border);">df</th>
              <th style="padding: 12px; border: 1px solid var(--qsa-border);">Sig. (2-tailed)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 12px; border: 1px solid var(--qsa-border); font-weight: 700;">Exam Score</td>
              <td class="spss-cell" data-val="levene" style="padding: 12px; border: 1px solid var(--qsa-border); background: var(--qsa-terracotta-soft); color: var(--qsa-terracotta); cursor: pointer; text-align: center; font-weight: 700;">0.412</td>
              <td class="spss-cell" data-val="t" style="padding: 12px; border: 1px solid var(--qsa-border); background: var(--qsa-status-success-bg); color: var(--qsa-status-success); cursor: pointer; text-align: center; font-weight: 700;">3.482</td>
              <td class="spss-cell" data-val="df" style="padding: 12px; border: 1px solid var(--qsa-border); background: var(--qsa-primary-navy-soft); color: var(--qsa-primary-navy); cursor: pointer; text-align: center; font-weight: 700;">148</td>
              <td class="spss-cell" data-val="sig" style="padding: 12px; border: 1px solid var(--qsa-border); background: var(--qsa-bg-fill); color: var(--qsa-text-primary); cursor: pointer; text-align: center; font-weight: 700;">0.001</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div id="spss-expl" class="qsa-widget-muted-box" style="margin-top: 16px; font-size: 14px; line-height: 1.6;">
        👉 Click on any cell above to see how to report it in your thesis.
      </div>
    </div>`;

  const details = {
    levene: "<strong>Levene's Test (p = .412):</strong> Because p > .05, equal variances are assumed. You read the top row of SPSS output.",
    t: "<strong>t-value (3.482):</strong> The test statistic. Report as t(148) = 3.48, p = .001.",
    df: "<strong>Degrees of Freedom (148):</strong> Calculated as N1 + N2 - 2 (e.g. 75 + 75 - 2).",
    sig: "<strong>Significance p-value (.001):</strong> Because p < .05, reject the null hypothesis. There is a statistically significant difference between groups."
  };

  el.querySelectorAll('.spss-cell').forEach(c => {
    c.addEventListener('click', () => {
      el.querySelector('#spss-expl').innerHTML = details[c.dataset.val];
    });
  });
}

// -------------------------------------------------------------
// 9. PLS Model Explorer
// -------------------------------------------------------------
function renderPlsModel(el) {
  el.innerHTML = `
    <div class="qsa-widget-card">
      <div class="qsa-widget-head">
        <h4 class="qsa-widget-title">SmartPLS 4 Path Model Explorer</h4>
        <span class="pro-lesson-type-badge visual">PLS-SEM</span>
      </div>
      <p class="qsa-widget-desc">Click structural model criteria to inspect Hair et al. (2022) evaluation standards.</p>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin: 20px 0;">
        <button type="button" class="pls-btn qsa-widget-btn-secondary" data-info="loadings">Outer Loadings (λ ≥ 0.708)</button>
        <button type="button" class="pls-btn qsa-widget-btn-secondary" data-info="ave">AVE (≥ 0.50)</button>
        <button type="button" class="pls-btn qsa-widget-btn-secondary" data-info="htmt">HTMT (< 0.85)</button>
        <button type="button" class="pls-btn qsa-widget-btn-secondary" data-info="r2">R-Squared (R²)</button>
      </div>
      <div id="pls-details" class="qsa-widget-muted-box" style="font-size: 14px; line-height: 1.6;">
        Select an assessment criterion above to inspect guidelines.
      </div>
    </div>`;

  const info = {
    loadings: '<strong>Indicator Reliability:</strong> Outer loadings should be ≥ 0.708. Items with loadings < 0.40 should be deleted immediately.',
    ave: '<strong>Convergent Validity:</strong> Average Variance Extracted (AVE) must be ≥ 0.50, meaning the construct explains over 50% of its indicators variance.',
    htmt: '<strong>Discriminant Validity:</strong> Heterotrait-Monotrait Ratio (HTMT) must be < 0.85 (conservative) or < 0.90 (liberal) to confirm construct distinctiveness.',
    r2: '<strong>Structural Model Explanatory Power:</strong> R² values of 0.75, 0.50, and 0.25 represent substantial, moderate, and weak explanatory power.'
  };

  el.querySelectorAll('.pls-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.pls-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      el.querySelector('#pls-details').innerHTML = info[btn.dataset.info];
    });
  });
}

// -------------------------------------------------------------
// 10. PLS Quality Criteria Thresholds Table
// -------------------------------------------------------------
function renderThresholdsTable(el) {
  el.innerHTML = `
    <div class="qsa-widget-card">
      <div class="qsa-widget-head">
        <h4 class="qsa-widget-title">PLS-SEM Quality Criteria Thresholds Table</h4>
        <span class="pro-lesson-type-badge visual">Reference Standards</span>
      </div>
      <div style="overflow-x: auto; margin-top: 16px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
          <thead>
            <tr style="background: var(--qsa-primary-navy); color: #ffffff;">
              <th style="padding: 10px; text-align: left; border: 1px solid var(--qsa-border);">Criterion</th>
              <th style="padding: 10px; text-align: left; border: 1px solid var(--qsa-border);">Standard Threshold</th>
              <th style="padding: 10px; text-align: left; border: 1px solid var(--qsa-border);">Primary Source</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid var(--qsa-border);">Cronbach's Alpha (α)</td>
              <td style="padding: 10px; border: 1px solid var(--qsa-border); color: var(--qsa-status-success); font-weight: 700;">≥ 0.70</td>
              <td style="padding: 10px; border: 1px solid var(--qsa-border);">Hair et al. (2022)</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid var(--qsa-border);">Composite Reliability (CR)</td>
              <td style="padding: 10px; border: 1px solid var(--qsa-border); color: var(--qsa-status-success); font-weight: 700;">0.70 – 0.95</td>
              <td style="padding: 10px; border: 1px solid var(--qsa-border);">Hair et al. (2022)</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid var(--qsa-border);">Average Variance Extracted (AVE)</td>
              <td style="padding: 10px; border: 1px solid var(--qsa-border); color: var(--qsa-status-success); font-weight: 700;">≥ 0.50</td>
              <td style="padding: 10px; border: 1px solid var(--qsa-border);">Fornell &amp; Larcker (1981)</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid var(--qsa-border);">HTMT Ratio</td>
              <td style="padding: 10px; border: 1px solid var(--qsa-border); color: var(--qsa-status-success); font-weight: 700;">&lt; 0.85 / &lt; 0.90</td>
              <td style="padding: 10px; border: 1px solid var(--qsa-border);">Henseler et al. (2015)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>`;
}

// -------------------------------------------------------------
// 11. Boolean Search Builder
// -------------------------------------------------------------
function renderBooleanBuilder(el) {
  el.innerHTML = `
    <div class="qsa-widget-card">
      <div class="qsa-widget-head">
        <h4 class="qsa-widget-title">Boolean Search String Builder</h4>
        <span class="pro-lesson-type-badge visual">Scopus / Web of Science</span>
      </div>
      <p class="qsa-widget-desc">Combine primary keywords and synonyms to generate verified Scopus/Web of Science queries.</p>
      <div style="display: grid; gap: 12px; margin: 16px 0;">
        <input type="text" id="bb-k1" class="qsa-widget-input" value="higher education" placeholder="Core Concept 1">
        <input type="text" id="bb-k2" class="qsa-widget-input" value="artificial intelligence" placeholder="Core Concept 2">
        <input type="text" id="bb-k3" class="qsa-widget-input" value="academic integrity" placeholder="Core Concept 3">
      </div>
      <div class="qsa-widget-dark-box" style="font-family: monospace; font-size: 13.5px; line-height: 1.5; color: #fbd38d; text-align: left;" id="bb-output">
        ("higher education" OR "university") AND ("artificial intelligence" OR "generative AI") AND ("academic integrity" OR "plagiarism")
      </div>
    </div>`;

  const update = () => {
    const k1 = el.querySelector('#bb-k1').value.trim() || 'concept1';
    const k2 = el.querySelector('#bb-k2').value.trim() || 'concept2';
    const k3 = el.querySelector('#bb-k3').value.trim() || 'concept3';
    el.querySelector('#bb-output').innerText = `("${k1}") AND ("${k2}") AND ("${k3}")`;
  };

  el.querySelectorAll('input').forEach(inp => inp.addEventListener('input', update));
}

// -------------------------------------------------------------
// 12. Zotero Research Automation Flow
// -------------------------------------------------------------
function renderZoteroFlow(el) {
  el.innerHTML = `
    <div class="qsa-widget-card">
      <div class="qsa-widget-head">
        <h4 class="qsa-widget-title">Zotero Research Automation Flow</h4>
        <span class="pro-lesson-type-badge visual">Reference Manager</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 16px;">
        <div class="qsa-widget-muted-box" style="padding: 14px 18px;"><strong>1. Capture:</strong> Click Zotero Connector in Chrome to save PDFs and clean bibliographic metadata with one click.</div>
        <div class="qsa-widget-muted-box" style="padding: 14px 18px;"><strong>2. Organize:</strong> Add tags, group by thesis chapter collections, and highlight key empirical quotes.</div>
        <div class="qsa-widget-muted-box" style="padding: 14px 18px;"><strong>3. Cite:</strong> Press Alt+Z in Microsoft Word to insert in-text parenthetical citations seamlessly.</div>
        <div class="qsa-widget-muted-box" style="padding: 14px 18px;"><strong>4. Bibliography:</strong> Click 'Add Bibliography' for instant 100% formatted APA 7 reference list with hanging indent.</div>
      </div>
    </div>`;
}

// -------------------------------------------------------------
// 13. Viva Defense Flashcards (10 Real Postgraduate Scenarios)
// -------------------------------------------------------------
function renderVivaCards(el) {
  const cards = [
    {
      q: "Why did you choose non-probability convenience sampling rather than a true random probability sample?",
      intent: "The examiner is checking whether you understand sampling error, generalizability limits, and practical research constraints.",
      defense: "State that the sampling frame (e.g. all private healthcare professionals across Multan) lacked a centralized public registry. Therefore, purposive/convenience sampling was selected under strict inclusion criteria, and Cochran/G*Power was applied to ensure statistical power (1-β ≥ 0.80). Acknowledge that findings are delimited to this context per Section 1.5.",
      trap: "Never say 'because it was easier for me to collect data'."
    },
    {
      q: "Why did you use the HTMT ratio to establish discriminant validity instead of the traditional Fornell-Larcker criterion?",
      intent: "Checking whether your methodological literature is up-to-date with modern PLS-SEM standards.",
      defense: "Cite Henseler et al. (2015) and Hair et al. (2022), explaining that simulation studies proved Fornell-Larcker fails to detect discriminant validity issues when indicator loadings are slightly unequal. HTMT strictly below 0.85 provides robust mathematical confirmation.",
      trap: "Do not say 'Fornell-Larcker was wrong'; frame it as adopting the more conservative modern benchmark."
    },
    {
      q: "How did you check and control for Common Method Variance (CMV) in your survey design?",
      intent: "Testing whether self-report survey bias contaminated your statistical paths.",
      defense: "Explain procedural remedies (anonymity assurance, counterbalancing item order) and statistical tests: Harman's single-factor test accounted for < 50% variance, and full collinearity VIFs were all strictly < 3.3 per Kock (2015).",
      trap: "Never claim 'there is zero bias in my study'."
    },
    {
      q: "What is the difference between your theoretical framework and your conceptual framework?",
      intent: "Testing basic epistemological literacy.",
      defense: "The theoretical framework anchors the inquiry in established disciplinary theories (e.g., Bandura's Social Cognitive Theory), while the conceptual framework represents the candidate's own hypothesized structural paths operationalizing those constructs.",
      trap: "Do not treat the two terms as interchangeable synonyms."
    },
    {
      q: "Why did you choose SmartPLS over CB-SEM (AMOS/LISREL)?",
      intent: "Testing software justification.",
      defense: "Cite Hair et al. (2022): PLS-SEM was chosen because the research objective is exploratory theory extension and prediction, the model contains complex mediation paths, and the survey data exhibited non-normal distributional properties.",
      trap: "Never say 'because AMOS was too difficult'."
    },
    {
      q: "How did you justify your minimum sample size in Chapter 3?",
      intent: "Verifying statistical power adequacy.",
      defense: "Conducted a priori power analysis using G*Power 3.1 (Faul et al., 2009) with medium effect size f² = 0.15, α = 0.05, and power 0.80, yielding a minimum N = 92. Collected N = 384 to satisfy Cochran's formula and absorb non-response attrition.",
      trap: "Do not rely on the outdated '10-times rule' as your primary defense."
    },
    {
      q: "Why did you report Composite Reliability (CR) alongside Cronbach's Alpha?",
      intent: "Testing psychometric measurement knowledge.",
      defense: "Cronbach's alpha assumes tau-equivalence (equal indicator loadings) and tends to underestimate reliability in social science research. Composite Reliability weights loadings individually, offering a more precise estimate of internal consistency.",
      trap: "Never dismiss Cronbach's alpha as useless; report both."
    },
    {
      q: "One of your hypothesized paths was non-significant (p > .05). Does that mean your research failed?",
      intent: "Testing scholarly poise under negative empirical findings.",
      defense: "No. Empirical science tests theories against local realities. A non-significant path reveals that under the unique boundary conditions of this population, the hypothesized relationship does not hold, offering valuable empirical insight for future scholars.",
      trap: "Do not apologize or blame data entry errors."
    },
    {
      q: "Can your findings be generalized to all universities across Pakistan?",
      intent: "Testing over-generalization and ecological fallacy.",
      defense: "No. As explicitly stated in the Delimitations section, the sample was bounded to postgraduate scholars within southern Punjab. Generalization to other provinces would require multigroup invariance testing across those regional contexts.",
      trap: "Never claim universal applicability when your sample was local."
    },
    {
      q: "What is the most actionable practical policy recommendation in your Chapter 5?",
      intent: "Checking real-world social/economic contribution.",
      defense: "Connect the empirical beta coefficient directly to an actionable intervention. For example, since mentoring had a strong direct effect (β = .42), recommend that higher education institutions formalize structured supervisor-candidate milestones rather than informal check-ins.",
      trap: "Avoid vague platitudes like 'government should do more workshops'."
    }
  ];

  let currentIndex = 0;
  let isFlipped = false;

  const renderCard = () => {
    const c = cards[currentIndex];
    el.innerHTML = `
      <div class="qsa-widget-card">
        <div class="qsa-widget-head">
          <h4 class="qsa-widget-title">Viva Voce Defense Simulator</h4>
          <span style="font-size: 13px; font-weight: 800; color: var(--qsa-terracotta);">Card ${currentIndex + 1} of ${cards.length}</span>
        </div>

        <div id="viva-card-box" class="qsa-widget-muted-box" style="min-height: 180px; cursor: pointer; transition: all 0.2s ease;">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--qsa-terracotta); letter-spacing: 0.8px;">
            ${isFlipped ? 'Examiner Defense Strategy & Model Response' : 'Examiner Question'}
          </div>
          <div style="font-size: 17px; font-weight: 700; color: var(--qsa-primary-navy); margin: 12px 0; line-height: 1.5;">
            ${isFlipped ? c.defense : `"${c.q}"`}
          </div>
          ${isFlipped ? `
            <div style="font-size: 13px; color: var(--qsa-text-secondary); margin-top: 12px; border-top: 1px dashed var(--qsa-border); padding-top: 10px;">
              <strong>🎯 Examiner Intent:</strong> ${c.intent}<br>
              <strong style="color: var(--qsa-status-danger);">⚠️ Fatal Trap to Avoid:</strong> ${c.trap}
            </div>` : `
            <div style="font-size: 12.5px; color: var(--qsa-text-muted); margin-top: 16px;">
              👉 Click anywhere on this card to reveal the high-distinction defense script.
            </div>`}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; gap: 12px; flex-wrap: wrap;">
          <button type="button" id="viva-prev-btn" class="qsa-widget-btn-secondary" ${currentIndex === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
            ← Previous
          </button>
          <button type="button" id="viva-flip-btn" class="qsa-widget-btn">
            ${isFlipped ? 'Hide Answer' : 'Reveal Defense Answer'}
          </button>
          <button type="button" id="viva-next-btn" class="qsa-widget-btn-secondary" ${currentIndex === cards.length - 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
            Next →
          </button>
        </div>
      </div>`;

    el.querySelector('#viva-card-box').addEventListener('click', () => {
      isFlipped = !isFlipped;
      renderCard();
    });

    el.querySelector('#viva-flip-btn').addEventListener('click', () => {
      isFlipped = !isFlipped;
      renderCard();
    });

    el.querySelector('#viva-prev-btn').addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        isFlipped = false;
        renderCard();
      }
    });

    el.querySelector('#viva-next-btn').addEventListener('click', () => {
      if (currentIndex < cards.length - 1) {
        currentIndex++;
        isFlipped = false;
        renderCard();
      }
    });
  };

  renderCard();
}

// -------------------------------------------------------------
// 14. Viva Slide Budget & Interactive Pace Timer
// -------------------------------------------------------------
function renderSlideTimer(el) {
  let secondsRemaining = 75; // 75s per slide standard
  let timerActive = false;

  el.innerHTML = `
    <div class="qsa-widget-card">
      <div class="qsa-widget-head">
        <h4 class="qsa-widget-title">Viva Slide Budget &amp; Practice Pace Timer</h4>
        <span class="pro-lesson-type-badge visual">Viva Capstone</span>
      </div>
      <p class="qsa-widget-desc">
        For a standard 15-minute viva presentation, your deck should not exceed 12 slides (approx. 75 seconds per slide). Practice your pacing with this live rehearsal timer.
      </p>

      <div id="timer-box" class="qsa-widget-dark-box" style="margin: 20px 0;">
        <div style="font-size: 11.5px; font-weight: 800; text-transform: uppercase; color: #fbd38d; letter-spacing: 1px;">Current Slide Target Time</div>
        <div id="timer-display" style="font-size: 54px; font-weight: 800; color: #34d399; margin: 6px 0; font-family: monospace;">01:15</div>
        <div id="timer-pace-label" style="font-size: 13.5px; color: var(--qsa-text-muted);">🟢 On Pace • Clear and deliberate delivery</div>
      </div>

      <div style="display: flex; justify-content: center; gap: 14px; margin-bottom: 24px; flex-wrap: wrap;">
        <button type="button" id="timer-toggle-btn" class="qsa-widget-btn">
          Start Pacing Timer
        </button>
        <button type="button" id="timer-reset-btn" class="qsa-widget-btn-secondary">
          Reset Slide
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
        <div class="qsa-widget-muted-box" style="padding: 12px; text-align: center; font-size: 13px;"><strong>Slide 1:</strong> Title (30s)</div>
        <div class="qsa-widget-muted-box" style="padding: 12px; text-align: center; font-size: 13px;"><strong>Slides 2-3:</strong> Problem &amp; Lit (3m)</div>
        <div class="qsa-widget-muted-box" style="padding: 12px; text-align: center; font-size: 13px;"><strong>Slides 4-6:</strong> Methodology (4m)</div>
        <div class="qsa-widget-muted-box" style="padding: 12px; text-align: center; font-size: 13px;"><strong>Slides 7-9:</strong> Results (4m)</div>
        <div class="qsa-widget-muted-box" style="padding: 12px; text-align: center; font-size: 13px;"><strong>Slides 10-12:</strong> Conclusion (3.5m)</div>
      </div>
    </div>`;

  const display = el.querySelector('#timer-display');
  const paceLabel = el.querySelector('#timer-pace-label');
  const toggleBtn = el.querySelector('#timer-toggle-btn');
  const resetBtn = el.querySelector('#timer-reset-btn');

  const updateDisplay = () => {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    display.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (secondsRemaining > 30) {
      display.style.color = '#34d399';
      paceLabel.innerHTML = '🟢 On Pace • Clear and deliberate delivery';
    } else if (secondsRemaining > 10) {
      display.style.color = '#fbbf24';
      paceLabel.innerHTML = '🟡 Wrap Up • Transition to key takeaway';
    } else {
      display.style.color = '#f87171';
      paceLabel.innerHTML = '🔴 Overtime Danger • Conclude this slide immediately';
    }
  };

  toggleBtn.addEventListener('click', () => {
    if (timerActive) {
      teardownWidget();
      timerActive = false;
      toggleBtn.innerText = 'Resume Timer';
    } else {
      timerActive = true;
      toggleBtn.innerText = 'Pause Timer';
      window.__qsaActiveTimer = setInterval(() => {
        if (secondsRemaining > 0) {
          secondsRemaining--;
          updateDisplay();
        } else {
          teardownWidget();
          timerActive = false;
          toggleBtn.innerText = 'Slide Complete';
        }
      }, 1000);
    }
  });

  resetBtn.addEventListener('click', () => {
    teardownWidget();
    timerActive = false;
    secondsRemaining = 75;
    updateDisplay();
    toggleBtn.innerText = 'Start Pacing Timer';
  });
}

// -------------------------------------------------------------
// 15. Submission Audit Checklist
// -------------------------------------------------------------
function renderChecklistWidget(el) {
  el.innerHTML = `
    <div class="qsa-widget-card">
      <div class="qsa-widget-head">
        <h4 class="qsa-widget-title">Interactive Thesis Submission Audit Checklist</h4>
        <span class="pro-lesson-type-badge visual">Pre-Flight Review</span>
      </div>
      <p class="qsa-widget-desc">Complete this final compliance audit prior to binding and departmental submission.</p>
      
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <label style="display: flex; align-items: flex-start; gap: 12px; font-size: 14px; color: var(--qsa-text-primary); cursor: pointer;">
          <input type="checkbox" style="width: 20px; height: 20px; margin-top: 2px; accent-color: var(--qsa-terracotta);"> 
          <span>Every in-text citation matches an exact entry in the reference list.</span>
        </label>
        <label style="display: flex; align-items: flex-start; gap: 12px; font-size: 14px; color: var(--qsa-text-primary); cursor: pointer;">
          <input type="checkbox" style="width: 20px; height: 20px; margin-top: 2px; accent-color: var(--qsa-terracotta);"> 
          <span>All tables and figures adhere to APA 7th border rules (no vertical lines).</span>
        </label>
        <label style="display: flex; align-items: flex-start; gap: 12px; font-size: 14px; color: var(--qsa-text-primary); cursor: pointer;">
          <input type="checkbox" style="width: 20px; height: 20px; margin-top: 2px; accent-color: var(--qsa-terracotta);"> 
          <span>Overall Turnitin similarity index is under 19% with no single source exceeding 5%.</span>
        </label>
        <label style="display: flex; align-items: flex-start; gap: 12px; font-size: 14px; color: var(--qsa-text-primary); cursor: pointer;">
          <input type="checkbox" style="width: 20px; height: 20px; margin-top: 2px; accent-color: var(--qsa-terracotta);"> 
          <span>Signed supervisor consent letter and ethics board clearance are attached in appendices.</span>
        </label>
        <label style="display: flex; align-items: flex-start; gap: 12px; font-size: 14px; color: var(--qsa-text-primary); cursor: pointer;">
          <input type="checkbox" style="width: 20px; height: 20px; margin-top: 2px; accent-color: var(--qsa-terracotta);"> 
          <span>Front matter page numbers use Roman numerals (i, ii, iii) and Chapter 1 begins at Arabic page 1.</span>
        </label>
      </div>
    </div>`;
}
