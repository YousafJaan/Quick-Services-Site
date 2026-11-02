/**
 * Quick Services Academy — Interactive Academic & Statistical Widgets (15 Tools)
 * Zero external libraries, responsive down to 360px, fully keyboard and touch accessible.
 * Version 2.5.0 Advanced: Includes lifecycle teardown, polymorphic ingestion, and full two-way reactivity.
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
    <div style="background: #ffffff; border: 1.5px solid var(--qsa-border-light, #e2e8f0); border-radius: 16px; padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
      <h4 style="margin: 0 0 8px; font-size: 18px; font-family: var(--qsa-font-serif, Georgia, serif); color: #102B4E;">Cochran's Sample Size Calculator</h4>
      <p style="font-size: 13.5px; color: #64748b; margin: 0 0 24px;">
        Calculate required statistical sample size with finite population correction (Cochran, 1977).
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div>
          <label style="display: block; font-size: 12.5px; font-weight: 700; margin-bottom: 6px; color: #102B4E;">Confidence Level (Z)</label>
          <select id="calc-z" style="width: 100%; min-height: 44px; padding: 10px; border-radius: 8px; border: 1.5px solid #cbd5e1; font-weight: 600; font-size: 14px;">
            <option value="1.96" selected>95% Confidence (Z = 1.96)</option>
            <option value="2.576">99% Confidence (Z = 2.576)</option>
            <option value="1.645">90% Confidence (Z = 1.645)</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 12.5px; font-weight: 700; margin-bottom: 6px; color: #102B4E;">Margin of Error (e)</label>
          <select id="calc-e" style="width: 100%; min-height: 44px; padding: 10px; border-radius: 8px; border: 1.5px solid #cbd5e1; font-weight: 600; font-size: 14px;">
            <option value="0.05" selected>±5% Margin (0.05 Standard)</option>
            <option value="0.03">±3% Margin (0.03 Precision)</option>
            <option value="0.01">±1% Margin (0.01 Stringent)</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 12.5px; font-weight: 700; margin-bottom: 6px; color: #102B4E;">Known Population Size N (Optional)</label>
          <input type="number" id="calc-n" placeholder="Leave blank if infinite" style="width: 100%; min-height: 44px; padding: 10px; border-radius: 8px; border: 1.5px solid #cbd5e1; font-size: 14px; box-sizing: border-box;">
        </div>
      </div>

      <div style="background: #102B4E; color: #ffffff; border-radius: 14px; padding: 22px; margin-top: 24px; text-align: center;">
        <div style="font-size: 11.5px; font-weight: 800; text-transform: uppercase; color: #fbd38d; letter-spacing: 1px;">Recommended Sample Size</div>
        <div id="calc-result" style="font-size: 46px; font-weight: 800; color: #B95335; margin: 6px 0;">384</div>
        <div id="calc-formula" style="font-size: 13px; color: #cbd5e1; font-family: monospace;">
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
    <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 28px;">
      <h4 style="margin: 0 0 8px; font-size: 18px; font-family: Georgia, serif; color: #102B4E;">Statistical Power & Effect Size Visualizer</h4>
      <p style="font-size: 13.5px; color: #64748b; margin: 0 0 20px;">
        Notice how increasing effect size or sample size separates the null (H₀) and alternative (H₁) distributions, reducing Type II error (β).
      </p>

      <div style="margin: 20px 0;">
        <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; margin-bottom: 6px;">
          <span>Cohen's Effect Size (d):</span>
          <span id="power-d-val" style="color: #B95335;">0.50 (Medium)</span>
        </div>
        <input type="range" id="power-d" min="0.1" max="1.0" step="0.05" value="0.5" style="width: 100%; accent-color: #B95335; min-height: 44px;">
      </div>

      <div style="background: #102B4E; border-radius: 14px; padding: 20px; text-align: center;">
        <svg id="power-svg" viewBox="0 0 500 200" style="width: 100%; height: auto; max-height: 200px;">
          <!-- Bell curves rendered dynamically -->
        </svg>
      </div>
      <div style="margin-top: 16px; font-size: 13.5px; color: #334155; line-height: 1.6;">
        <strong>Statistical Power (1 - β):</strong> <span id="power-calc-pct" style="color: #B95335; font-weight: 800;">80%</span>.
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
          <stop offset="0%" stop-color="#B95335" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#B95335" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <line x1="20" y1="170" x2="480" y2="170" stroke="#334155" stroke-width="2"/>
      <path d="M 40 170 Q 160 20 280 170 Z" fill="url(#gradNull)" stroke="#94a3b8" stroke-width="2"/>
      <text x="160" y="80" fill="#94a3b8" font-size="12" font-weight="700" text-anchor="middle">H₀ (Null)</text>
      <path d="M ${40 + shift} 170 Q ${160 + shift} 20 ${280 + shift} 170 Z" fill="url(#gradAlt)" stroke="#B95335" stroke-width="2"/>
      <text x="${160 + shift}" y="80" fill="#B95335" font-size="12" font-weight="700" text-anchor="middle">H₁ (Alternative)</text>
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
    <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 28px;">
      <h4 style="margin: 0 0 8px; font-size: 18px; font-family: Georgia, serif; color: #102B4E;">The 4-Stage Topic Narrowing Funnel</h4>
      <p style="font-size: 13.5px; color: #64748b; margin: 0 0 20px;">
        Click each stage to transition from an unmanageable domain to a defensible thesis problem statement.
      </p>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button type="button" class="funnel-btn" data-stage="1" style="min-height: 44px; width: 100%; padding: 12px; border-radius: 999px; background: #f8fafc; border: 1.5px solid #cbd5e1; font-weight: 700; cursor: pointer; text-align: center;">Stage 1: Broad Thematic Domain (e.g. Social Media & Well-being)</button>
        <button type="button" class="funnel-btn" data-stage="2" style="min-height: 44px; width: 85%; margin: 0 auto; padding: 12px; border-radius: 999px; background: #f8fafc; border: 1.5px solid #cbd5e1; font-weight: 700; cursor: pointer; text-align: center;">Stage 2: Bounded Population (e.g. Postgraduate Students in Multan)</button>
        <button type="button" class="funnel-btn" data-stage="3" style="min-height: 44px; width: 70%; margin: 0 auto; padding: 12px; border-radius: 999px; background: #f8fafc; border: 1.5px solid #cbd5e1; font-weight: 700; cursor: pointer; text-align: center;">Stage 3: Defined Variables (e.g. FOMO & Sleep Quality)</button>
        <button type="button" class="funnel-btn active" data-stage="4" style="min-height: 44px; width: 55%; margin: 0 auto; padding: 12px; border-radius: 999px; background: #B95335; color: #ffffff; border: none; font-weight: 800; cursor: pointer; text-align: center;">Stage 4: Defensible Research Question</button>
      </div>

      <div id="funnel-desc" style="background: #FAF7F1; border: 1.5px solid #E8E1D8; border-radius: 12px; padding: 20px; margin-top: 24px; font-size: 14.5px; line-height: 1.6; color: #102B4E;">
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
        b.style.background = '#f8fafc';
        b.style.color = '#102B4E';
      });
      btn.style.background = '#B95335';
      btn.style.color = '#ffffff';
      el.querySelector('#funnel-desc').innerHTML = details[btn.dataset.stage];
    });
  });
}

// -------------------------------------------------------------
// 4. Word Planner
// -------------------------------------------------------------
function renderWordPlanner(el) {
  el.innerHTML = `
    <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 28px;">
      <h4 style="margin: 0 0 8px; font-size: 18px; font-family: Georgia, serif; color: #102B4E;">Thesis Word Budget & Chapter Planner</h4>
      <p style="font-size: 13.5px; color: #64748b; margin: 0 0 20px;">Enter your target dissertation word count to view proportional allocation across all 5 chapters.</p>
      <div style="margin: 16px 0 24px;">
        <label style="font-size: 12.5px; font-weight: 700; display: block; margin-bottom: 6px; color: #102B4E;">Target Word Count</label>
        <input type="number" id="planner-total" value="20000" step="1000" style="padding: 10px 14px; min-height: 44px; border-radius: 8px; border: 1.5px solid #cbd5e1; font-size: 16px; width: 100%; max-width: 240px; box-sizing: border-box;">
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
        <div style="background: #FAF7F1; border: 1px solid #E8E1D8; border-radius: 10px; padding: 14px 18px;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 14.5px; color: #102B4E;">
            <span>${ch.name}</span>
            <span style="color: #B95335;">${words.toLocaleString()} words (${ch.pct * 100}%)</span>
          </div>
          <div style="font-size: 12.5px; color: #64748b; margin-top: 4px;">${ch.role}</div>
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
    <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 28px;">
      <h4 style="margin: 0 0 8px; font-size: 18px; font-family: Georgia, serif; color: #102B4E;">Interactive APA 7th Reference Dissecter</h4>
      <p style="font-size: 13.5px; color: #64748b; margin: 0 0 20px;">
        Click each highlighted component to view its official APA 7th manual rule.
      </p>
      <div style="font-size: 17px; line-height: 2.2; background: #FAF7F1; padding: 22px; border-radius: 12px; font-family: Georgia, serif; border: 1px solid #E8E1D8;">
        <span class="apa-part" data-rule="author" style="cursor: pointer; background: #fed7aa; padding: 4px 8px; border-radius: 6px; font-weight: 600;">Khan, A. M., &amp; Yousaf, M.</span>
        <span class="apa-part" data-rule="year" style="cursor: pointer; background: #bbf7d0; padding: 4px 8px; border-radius: 6px; font-weight: 600;">(2025).</span>
        <span class="apa-part" data-rule="title" style="cursor: pointer; background: #bae6fd; padding: 4px 8px; border-radius: 6px;">Evaluating statistical power in postgraduate business dissertations.</span>
        <span class="apa-part" data-rule="source" style="cursor: pointer; background: #fbcfe8; padding: 4px 8px; border-radius: 6px;"><em>Journal of Higher Education Research</em>, 14(2), 112–128.</span>
        <span class="apa-part" data-rule="doi" style="cursor: pointer; background: #e2e8f0; padding: 4px 8px; border-radius: 6px; font-family: monospace; font-size: 14px;">https://doi.org/10.1016/j.jher.2025.02.004</span>
      </div>
      <div id="apa-explanation" style="margin-top: 20px; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 18px; font-size: 14px; line-height: 1.6; color: #102B4E;">
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
    <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 28px;">
      <h4 style="margin: 0 0 8px; font-size: 18px; font-family: Georgia, serif; color: #102B4E;">Turnitin Similarity Simulator &amp; HEC Policy Checker</h4>
      <p style="font-size: 13.5px; color: #64748b; margin: 0 0 20px;">
        Test how direct quotes, patchwriting, and exclusions impact your overall Turnitin index against HEC Pakistan criteria.
      </p>

      <div style="display: grid; gap: 16px; margin: 20px 0;">
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; margin-bottom: 4px;">
            <span>Direct Quoted Text:</span>
            <span id="sim-quotes-val">10%</span>
          </div>
          <input type="range" id="sim-quotes" min="0" max="30" step="1" value="10" style="width: 100%; accent-color: #B95335; min-height: 44px;">
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; margin-bottom: 4px;">
            <span>Patchwriting &amp; Inadequate Paraphrasing:</span>
            <span id="sim-patch-val">8%</span>
          </div>
          <input type="range" id="sim-patch" min="0" max="30" step="1" value="8" style="width: 100%; accent-color: #B95335; min-height: 44px;">
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 20px; padding: 12px 0;">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13.5px; cursor: pointer;">
            <input type="checkbox" id="sim-ex-bib" checked style="width: 18px; height: 18px;"> Exclude Bibliography (HEC Permitted)
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13.5px; cursor: pointer;">
            <input type="checkbox" id="sim-ex-quotes" checked style="width: 18px; height: 18px;"> Exclude Cited Quotes (HEC Permitted)
          </label>
        </div>
      </div>

      <div id="sim-banner" style="background: #102B4E; color: #ffffff; border-radius: 14px; padding: 24px; text-align: center;">
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

    // Mathematical formula per EGM Approved Design
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
    <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 28px;">
      <h4 style="margin: 0 0 8px; font-size: 18px; font-family: Georgia, serif; color: #102B4E;">Statistical Test Selector</h4>
      <p style="font-size: 13.5px; color: #64748b; margin: 0 0 20px;">Answer three questions to discover the exact statistical test required for your data.</p>
      <div style="display: flex; flex-direction: column; gap: 16px; margin: 20px 0;">
        <div>
          <label style="font-size: 12.5px; font-weight: 700; display: block; margin-bottom: 6px; color: #102B4E;">Research Goal</label>
          <select id="tp-goal" style="width: 100%; min-height: 44px; padding: 10px; border-radius: 8px; border: 1.5px solid #cbd5e1; font-size: 14px;">
            <option value="means">Comparing group means (e.g. Male vs Female GPA)</option>
            <option value="relation">Testing relationship between continuous variables</option>
            <option value="predict">Predicting an outcome variable from multiple factors</option>
          </select>
        </div>
        <div>
          <label style="font-size: 12.5px; font-weight: 700; display: block; margin-bottom: 6px; color: #102B4E;">Comparison Groups</label>
          <select id="tp-groups" style="width: 100%; min-height: 44px; padding: 10px; border-radius: 8px; border: 1.5px solid #cbd5e1; font-size: 14px;">
            <option value="2">2 Independent Groups</option>
            <option value="3">3 or more Groups</option>
          </select>
        </div>
      </div>
      <div id="tp-result" style="background: #FAF7F1; border-left: 4px solid #B95335; border-radius: 10px; padding: 18px; color: #102B4E; font-size: 14px;">
        <strong>Recommended Test:</strong> Independent Samples t-Test<br>
        <span style="font-size: 13px; color: #64748b;">Assumptions: Normal distribution (Shapiro-Wilk) and Homogeneity of variance (Levene's test).</span>
      </div>
    </div>`;

  const update = () => {
    const goal = el.querySelector('#tp-goal').value;
    const groups = el.querySelector('#tp-groups').value;
    const res = el.querySelector('#tp-result');

    if (goal === 'means') {
      if (groups === '2') {
        res.innerHTML = `<strong>Recommended Test:</strong> Independent Samples t-Test<br><span style="font-size: 13px; color: #64748b;">Assumptions: Normality (Shapiro-Wilk) and Homogeneity of Variance (Levene's Test).</span>`;
      } else {
        res.innerHTML = `<strong>Recommended Test:</strong> One-Way ANOVA with Post-Hoc Tests (Tukey/Bonferroni)<br><span style="font-size: 13px; color: #64748b;">Assumptions: Normality of residuals and equal variances across groups.</span>`;
      }
    } else if (goal === 'relation') {
      res.innerHTML = `<strong>Recommended Test:</strong> Pearson Bivariate Correlation (r)<br><span style="font-size: 13px; color: #64748b;">Assumptions: Linear relationship between interval/ratio variables without severe outliers.</span>`;
    } else {
      res.innerHTML = `<strong>Recommended Test:</strong> Multiple Linear Regression<br><span style="font-size: 13px; color: #64748b;">Assumptions: No multicollinearity (VIF < 5.0), homoscedasticity, and normal residuals.</span>`;
    }
  };

  el.querySelectorAll('select').forEach(s => s.addEventListener('change', update));
}

// -------------------------------------------------------------
// 8. SPSS Output Annotator
// -------------------------------------------------------------
function renderSpssAnnotator(el) {
  el.innerHTML = `
    <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 28px;">
      <h4 style="margin: 0 0 8px; font-size: 18px; font-family: Georgia, serif; color: #102B4E;">SPSS Output Table Annotator (Independent Samples t-Test)</h4>
      <p style="font-size: 13.5px; color: #64748b; margin: 0 0 20px;">Click on any statistical output cell to learn how to interpret it and write it in APA 7th style.</p>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-family: monospace; font-size: 13.5px;">
          <thead>
            <tr style="background: #102B4E; color: #ffffff;">
              <th style="padding: 12px; border: 1px solid #334155;">Variable</th>
              <th style="padding: 12px; border: 1px solid #334155;">Levene Sig.</th>
              <th style="padding: 12px; border: 1px solid #334155;">t</th>
              <th style="padding: 12px; border: 1px solid #334155;">df</th>
              <th style="padding: 12px; border: 1px solid #334155;">Sig. (2-tailed)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: 700;">Exam Score</td>
              <td class="spss-cell" data-val="levene" style="padding: 12px; border: 1px solid #e2e8f0; background: #fed7aa; cursor: pointer; text-align: center;">0.412</td>
              <td class="spss-cell" data-val="t" style="padding: 12px; border: 1px solid #e2e8f0; background: #bbf7d0; cursor: pointer; text-align: center;">3.482</td>
              <td class="spss-cell" data-val="df" style="padding: 12px; border: 1px solid #e2e8f0; background: #bae6fd; cursor: pointer; text-align: center;">148</td>
              <td class="spss-cell" data-val="sig" style="padding: 12px; border: 1px solid #e2e8f0; background: #fbcfe8; cursor: pointer; text-align: center;">0.001</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div id="spss-expl" style="margin-top: 16px; background: #FAF7F1; padding: 18px; border-radius: 10px; font-size: 14px; line-height: 1.6; color: #102B4E;">
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
    <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 28px;">
      <h4 style="margin: 0 0 8px; font-size: 18px; font-family: Georgia, serif; color: #102B4E;">SmartPLS 4 Path Model Explorer</h4>
      <p style="font-size: 13.5px; color: #64748b; margin: 0 0 20px;">Click structural model criteria to inspect Hair et al. (2022) evaluation standards.</p>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin: 20px 0;">
        <button type="button" class="pls-btn" data-info="loadings" style="min-height: 44px; padding: 10px 18px; border-radius: 10px; background: #ecfdf5; border: 1.5px solid #a7f3d0; font-weight: 700; cursor: pointer; color: #065f46;">Outer Loadings (λ ≥ 0.708)</button>
        <button type="button" class="pls-btn" data-info="ave" style="min-height: 44px; padding: 10px 18px; border-radius: 10px; background: #eff6ff; border: 1.5px solid #bfdbfe; font-weight: 700; cursor: pointer; color: #1e40af;">AVE (≥ 0.50)</button>
        <button type="button" class="pls-btn" data-info="htmt" style="min-height: 44px; padding: 10px 18px; border-radius: 10px; background: #fffbeb; border: 1.5px solid #fde68a; font-weight: 700; cursor: pointer; color: #92400e;">HTMT (< 0.85)</button>
        <button type="button" class="pls-btn" data-info="r2" style="min-height: 44px; padding: 10px 18px; border-radius: 10px; background: #fdf2f8; border: 1.5px solid #fbcfe8; font-weight: 700; cursor: pointer; color: #9d174d;">R-Squared (R²)</button>
      </div>
      <div id="pls-details" style="background: #FAF7F1; padding: 18px; border-radius: 12px; font-size: 14px; line-height: 1.6; color: #102B4E;">
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
      el.querySelector('#pls-details').innerHTML = info[btn.dataset.info];
    });
  });
}

// -------------------------------------------------------------
// 10. PLS Quality Criteria Thresholds Table
// -------------------------------------------------------------
function renderThresholdsTable(el) {
  el.innerHTML = `
    <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 28px;">
      <h4 style="margin: 0 0 8px; font-size: 18px; font-family: Georgia, serif; color: #102B4E;">PLS-SEM Quality Criteria Thresholds Table</h4>
      <div style="overflow-x: auto; margin-top: 16px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
          <thead>
            <tr style="background: #102B4E; color: #ffffff;">
              <th style="padding: 10px; text-align: left; border: 1px solid #334155;">Criterion</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #334155;">Standard Threshold</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #334155;">Primary Source</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">Cronbach's Alpha (α)</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0; color: #15803d; font-weight: 700;">≥ 0.70</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">Hair et al. (2022)</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">Composite Reliability (CR)</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0; color: #15803d; font-weight: 700;">0.70 – 0.95</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">Hair et al. (2022)</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">Average Variance Extracted (AVE)</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0; color: #15803d; font-weight: 700;">≥ 0.50</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">Fornell &amp; Larcker (1981)</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">HTMT Ratio</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0; color: #15803d; font-weight: 700;">&lt; 0.85 / &lt; 0.90</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">Henseler et al. (2015)</td>
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
    <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 28px;">
      <h4 style="margin: 0 0 8px; font-size: 18px; font-family: Georgia, serif; color: #102B4E;">Boolean Search String Builder</h4>
      <p style="font-size: 13.5px; color: #64748b; margin: 0 0 16px;">Combine primary keywords and synonyms to generate verified Scopus/Web of Science queries.</p>
      <div style="display: grid; gap: 12px; margin: 16px 0;">
        <input type="text" id="bb-k1" value="higher education" placeholder="Core Concept 1" style="padding: 10px; min-height: 44px; border-radius: 8px; border: 1.5px solid #cbd5e1; font-size: 14px;">
        <input type="text" id="bb-k2" value="artificial intelligence" placeholder="Core Concept 2" style="padding: 10px; min-height: 44px; border-radius: 8px; border: 1.5px solid #cbd5e1; font-size: 14px;">
        <input type="text" id="bb-k3" value="academic integrity" placeholder="Core Concept 3" style="padding: 10px; min-height: 44px; border-radius: 8px; border: 1.5px solid #cbd5e1; font-size: 14px;">
      </div>
      <div style="background: #102B4E; color: #fbd38d; font-family: monospace; padding: 18px; border-radius: 12px; font-size: 13.5px; line-height: 1.5;" id="bb-output">
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
    <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 28px;">
      <h4 style="margin: 0 0 8px; font-size: 18px; font-family: Georgia, serif; color: #102B4E;">Zotero Research Automation Flow</h4>
      <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 16px;">
        <div style="padding: 14px; background: #FAF7F1; border-radius: 10px; border: 1px solid #E8E1D8;"><strong>1. Capture:</strong> Click Zotero Connector in Chrome to save PDFs and clean bibliographic metadata with one click.</div>
        <div style="padding: 14px; background: #FAF7F1; border-radius: 10px; border: 1px solid #E8E1D8;"><strong>2. Organize:</strong> Add tags, group by thesis chapter collections, and highlight key empirical quotes.</div>
        <div style="padding: 14px; background: #FAF7F1; border-radius: 10px; border: 1px solid #E8E1D8;"><strong>3. Cite:</strong> Press Alt+Z in Microsoft Word to insert in-text parenthetical citations seamlessly.</div>
        <div style="padding: 14px; background: #FAF7F1; border-radius: 10px; border: 1px solid #E8E1D8;"><strong>4. Bibliography:</strong> Click 'Add Bibliography' for instant 100% formatted APA 7 reference list with hanging indent.</div>
      </div>
    </div>`;
}

// -------------------------------------------------------------
// 13. Viva Defense Flashcards (10 Real Pakistani Postgraduate Scenarios)
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
      <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 28px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h4 style="margin: 0; font-size: 18px; font-family: Georgia, serif; color: #102B4E;">Viva Voce Defense Simulator</h4>
          <span style="font-size: 13px; font-weight: 800; color: #B95335;">Card ${currentIndex + 1} of ${cards.length}</span>
        </div>

        <div id="viva-card-box" style="background: #FAF7F1; border: 1.5px solid #E8E1D8; border-radius: 14px; padding: 24px; min-height: 180px; cursor: pointer; transition: all 0.2s ease;">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #B95335; letter-spacing: 0.8px;">
            ${isFlipped ? 'Examiner Defense Strategy & Model Response' : 'Examiner Question'}
          </div>
          <div style="font-size: 17px; font-weight: 700; color: #102B4E; margin: 12px 0; line-height: 1.5;">
            ${isFlipped ? c.defense : `"${c.q}"`}
          </div>
          ${isFlipped ? `
            <div style="font-size: 13px; color: #64748b; margin-top: 12px; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
              <strong>🎯 Examiner Intent:</strong> ${c.intent}<br>
              <strong style="color: #dc2626;">⚠️ Fatal Trap to Avoid:</strong> ${c.trap}
            </div>` : `
            <div style="font-size: 12.5px; color: #64748b; margin-top: 16px;">
              👉 Click anywhere on this card to reveal the high-distinction defense script.
            </div>`}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; gap: 12px;">
          <button type="button" id="viva-prev-btn" style="min-height: 44px; padding: 8px 18px; border-radius: 8px; border: 1.5px solid #cbd5e1; background: #ffffff; font-weight: 700; cursor: pointer;" ${currentIndex === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
            ← Previous
          </button>
          <button type="button" id="viva-flip-btn" style="min-height: 44px; padding: 8px 22px; border-radius: 8px; border: none; background: #B95335; color: #ffffff; font-weight: 700; cursor: pointer;">
            ${isFlipped ? 'Hide Answer' : 'Reveal Defense Answer'}
          </button>
          <button type="button" id="viva-next-btn" style="min-height: 44px; padding: 8px 18px; border-radius: 8px; border: 1.5px solid #cbd5e1; background: #ffffff; font-weight: 700; cursor: pointer;" ${currentIndex === cards.length - 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
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
    <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 28px;">
      <h4 style="margin: 0 0 8px; font-size: 18px; font-family: Georgia, serif; color: #102B4E;">Viva Slide Budget &amp; Practice Pace Timer</h4>
      <p style="font-size: 13.5px; color: #64748b; margin: 0 0 20px;">
        For a standard 15-minute viva presentation, your deck should not exceed 12 slides (approx. 75 seconds per slide). Practice your pacing with this live rehearsal timer.
      </p>

      <div id="timer-box" style="background: #102B4E; color: #ffffff; border-radius: 16px; padding: 24px; text-align: center; margin: 20px 0; transition: background 0.3s ease;">
        <div style="font-size: 11.5px; font-weight: 800; text-transform: uppercase; color: #fbd38d; letter-spacing: 1px;">Current Slide Target Time</div>
        <div id="timer-display" style="font-size: 54px; font-weight: 800; color: #34d399; margin: 6px 0; font-family: monospace;">01:15</div>
        <div id="timer-pace-label" style="font-size: 13.5px; color: #cbd5e1;">🟢 On Pace • Clear and deliberate delivery</div>
      </div>

      <div style="display: flex; justify-content: center; gap: 14px; margin-bottom: 24px;">
        <button type="button" id="timer-toggle-btn" style="min-height: 44px; padding: 10px 24px; border-radius: 8px; border: none; background: #B95335; color: #ffffff; font-weight: 800; font-size: 14px; cursor: pointer;">
          Start Pacing Timer
        </button>
        <button type="button" id="timer-reset-btn" style="min-height: 44px; padding: 10px 20px; border-radius: 8px; border: 1.5px solid #cbd5e1; background: #ffffff; color: #102B4E; font-weight: 700; font-size: 14px; cursor: pointer;">
          Reset Slide
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
        <div style="background: #FAF7F1; padding: 12px; border-radius: 8px; text-align: center; border: 1px solid #E8E1D8; font-size: 13px;"><strong>Slide 1:</strong> Title (30s)</div>
        <div style="background: #FAF7F1; padding: 12px; border-radius: 8px; text-align: center; border: 1px solid #E8E1D8; font-size: 13px;"><strong>Slides 2-3:</strong> Problem &amp; Lit (3m)</div>
        <div style="background: #FAF7F1; padding: 12px; border-radius: 8px; text-align: center; border: 1px solid #E8E1D8; font-size: 13px;"><strong>Slides 4-6:</strong> Methodology (4m)</div>
        <div style="background: #FAF7F1; padding: 12px; border-radius: 8px; text-align: center; border: 1px solid #E8E1D8; font-size: 13px;"><strong>Slides 7-9:</strong> Results (4m)</div>
        <div style="background: #FAF7F1; padding: 12px; border-radius: 8px; text-align: center; border: 1px solid #E8E1D8; font-size: 13px;"><strong>Slides 10-12:</strong> Conclusion (3.5m)</div>
      </div>
    </div>`;

  const display = el.querySelector('#timer-display');
  const paceLabel = el.querySelector('#timer-pace-label');
  const toggleBtn = el.querySelector('#timer-toggle-btn');
  const resetBtn = el.querySelector('#timer-reset-btn');

  const updateDisplay = () => {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    display.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    if (secondsRemaining > 20) {
      display.style.color = '#34d399';
      paceLabel.innerText = '🟢 On Pace • Clear and deliberate delivery';
    } else if (secondsRemaining > 0) {
      display.style.color = '#fbbf24';
      paceLabel.innerText = '🟡 Wrap Up • Conclude this slide within 20 seconds';
    } else {
      display.style.color = '#f87171';
      paceLabel.innerText = '🔴 Over Time • Move to the next slide immediately';
    }
  };

  const tick = () => {
    if (secondsRemaining > 0) {
      secondsRemaining--;
      updateDisplay();
    } else {
      teardownWidget();
      timerActive = false;
      toggleBtn.innerText = 'Re-Start Timer';
    }
  };

  toggleBtn.addEventListener('click', () => {
    if (timerActive) {
      teardownWidget();
      timerActive = false;
      toggleBtn.innerText = 'Resume Timer';
    } else {
      teardownWidget();
      window.__qsaActiveTimer = setInterval(tick, 1000);
      timerActive = true;
      toggleBtn.innerText = 'Pause Timer';
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
    <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 28px;">
      <h4 style="margin: 0 0 8px; font-size: 18px; font-family: Georgia, serif; color: #102B4E;">Interactive Thesis Submission Audit Checklist</h4>
      <p style="font-size: 13.5px; color: #64748b; margin: 0 0 20px;">Complete this final compliance audit prior to binding and departmental submission.</p>
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <label style="display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #102B4E; cursor: pointer;">
          <input type="checkbox" style="width: 20px; height: 20px; margin-top: 2px;"> Every in-text citation matches an exact entry in the reference list.
        </label>
        <label style="display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #102B4E; cursor: pointer;">
          <input type="checkbox" style="width: 20px; height: 20px; margin-top: 2px;"> All tables and figures adhere to APA 7th border rules (no vertical lines).
        </label>
        <label style="display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #102B4E; cursor: pointer;">
          <input type="checkbox" style="width: 20px; height: 20px; margin-top: 2px;"> Overall Turnitin similarity index is under 19% with no single source exceeding 5%.
        </label>
        <label style="display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #102B4E; cursor: pointer;">
          <input type="checkbox" style="width: 20px; height: 20px; margin-top: 2px;"> Signed supervisor consent letter and ethics board clearance are attached in appendices.
        </label>
        <label style="display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #102B4E; cursor: pointer;">
          <input type="checkbox" style="width: 20px; height: 20px; margin-top: 2px;"> Front matter page numbers use Roman numerals (i, ii, iii) and Chapter 1 begins at Arabic page 1.
        </label>
      </div>
    </div>`;
}
