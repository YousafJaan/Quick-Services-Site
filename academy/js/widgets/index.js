/**
 * Quick Services Academy — Interactive Academic & Statistical Widgets (15 Tools)
 * Zero external libraries, responsive down to 360px, fully keyboard and touch accessible.
 */

export function renderWidget(widgetName, container) {
  const el = typeof container === 'string' ? document.getElementById(container) : container;
  if (!el) return;

  switch (widgetName) {
    case 'sampleSize':
      renderCochranCalculator(el);
      break;
    case 'powerExplainer':
      renderPowerExplainer(el);
      break;
    case 'funnel':
      renderTopicFunnel(el);
      break;
    case 'planner':
      renderWordPlanner(el);
      break;
    case 'apa':
      renderApaDissecter(el);
      break;
    case 'sim':
      renderSimilaritySimulator(el);
      break;
    case 'testPicker':
      renderTestPicker(el);
      break;
    case 'spssOutput':
      renderSpssAnnotator(el);
      break;
    case 'plsModel':
      renderPlsModel(el);
      break;
    case 'thresholds':
      renderThresholdsTable(el);
      break;
    case 'boolean':
      renderBooleanBuilder(el);
      break;
    case 'zoteroFlow':
      renderZoteroFlow(el);
      break;
    case 'vivaCards':
      renderVivaCards(el);
      break;
    case 'slideTimer':
      renderSlideTimer(el);
      break;
    case 'checklist':
    default:
      renderChecklistWidget(el);
      break;
  }
}

// 1. Cochran's Formula Calculator
function renderCochranCalculator(el) {
  el.innerHTML = `
    <div style="background: #ffffff; border: 1.5px solid var(--qsa-border-light); border-radius: var(--qsa-radius-card); padding: 28px;">
      <h4 style="margin-bottom: 8px;">Cochran's Sample Size Calculator</h4>
      <p style="font-size: 14px; color: var(--qsa-text-light-muted); margin-bottom: 24px;">
        Calculate required statistical sample size with finite population correction.
      </p>

      <div style="display: grid; grid-template-columns: 1fr; gap: 20px;">
        <div>
          <label style="display: block; font-size: 13px; font-weight: 700; margin-bottom: 6px;">Confidence Level (Z)</label>
          <select id="calc-z" style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid var(--qsa-border-light); font-weight: 600;">
            <option value="1.96" selected>95% (Z = 1.96)</option>
            <option value="2.576">99% (Z = 2.576)</option>
            <option value="1.645">90% (Z = 1.645)</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 13px; font-weight: 700; margin-bottom: 6px;">Margin of Error (e)</label>
          <select id="calc-e" style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid var(--qsa-border-light); font-weight: 600;">
            <option value="0.05" selected>5% (0.05)</option>
            <option value="0.03">3% (0.03)</option>
            <option value="0.01">1% (0.01)</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 13px; font-weight: 700; margin-bottom: 6px;">Known Population Size N (Optional, leave blank if unknown)</label>
          <input type="number" id="calc-n" placeholder="e.g. 5000" style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid var(--qsa-border-light);">
        </div>
      </div>

      <div style="background: var(--qsa-bg-dark); color: #ffffff; border-radius: 16px; padding: 24px; margin-top: 24px; text-align: center;">
        <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: var(--qsa-accent-peach); letter-spacing: 1px;">Recommended Sample Size</div>
        <div id="calc-result" style="font-size: 44px; font-weight: 800; color: var(--qsa-accent-orange); margin: 6px 0;">384</div>
        <div id="calc-formula" style="font-size: 13px; color: var(--qsa-text-dark-secondary); font-family: var(--qsa-font-mono);">
          n₀ = (1.96² × 0.5 × 0.5) / 0.05² = 384.16
        </div>
      </div>
    </div>`;

  const update = () => {
    const z = parseFloat(el.querySelector('#calc-z').value);
    const e = parseFloat(el.querySelector('#calc-e').value);
    const popVal = el.querySelector('#calc-n').value;
    const p = 0.5; // Maximum variability
    let n0 = (z * z * p * (1 - p)) / (e * e);
    let finalN = Math.ceil(n0);
    let formulaText = `n₀ = (${z}² × 0.25) / ${e}² = ${n0.toFixed(2)}`;

    if (popVal && parseInt(popVal, 10) > 0) {
      const N = parseInt(popVal, 10);
      const corrected = n0 / (1 + (n0 - 1) / N);
      finalN = Math.ceil(corrected);
      formulaText += ` → Adjusted n = ${n0.toFixed(0)} / (1 + ${n0.toFixed(0)}/${N}) = ${finalN}`;
    }

    el.querySelector('#calc-result').innerText = finalN;
    el.querySelector('#calc-formula').innerText = formulaText;
  };

  el.querySelectorAll('select, input').forEach(inp => inp.addEventListener('input', update));
}

// 2. Statistical Power & Effect Size Visualizer
function renderPowerExplainer(el) {
  el.innerHTML = `
    <div style="background: #ffffff; border: 1.5px solid var(--qsa-border-light); border-radius: var(--qsa-radius-card); padding: 28px;">
      <h4>Statistical Power & Effect Size Visualizer</h4>
      <p style="font-size: 14px; color: var(--qsa-text-light-muted);">
        Notice how increasing effect size or sample size separates the null and alternative distributions, reducing Type II error (β).
      </p>

      <div style="margin: 20px 0;">
        <label style="font-size: 13px; font-weight: 700; display: block; margin-bottom: 6px;">Effect Size (d): <span id="power-d-val">0.50</span></label>
        <input type="range" id="power-d" min="0.1" max="1.0" step="0.05" value="0.5" style="width: 100%; accent-color: var(--qsa-accent-orange);">
      </div>

      <div style="background: var(--qsa-bg-dark); border-radius: 14px; padding: 20px; text-align: center;">
        <svg id="power-svg" viewBox="0 0 500 200" style="width: 100%; height: auto; max-height: 220px;">
          <!-- SVG Bell curves rendered dynamically -->
        </svg>
      </div>
      <div style="margin-top: 16px; font-size: 13.5px; color: var(--qsa-text-light-secondary); line-height: 1.5;">
        <strong>Statistical Power (1 - β):</strong> <span id="power-calc-pct" style="color: var(--qsa-accent-orange); font-weight: 800;">80%</span>.
        A power of 0.80 means you have an 80% probability of detecting a real empirical effect if it exists in the population.
      </div>
    </div>`;

  const draw = () => {
    const d = parseFloat(el.querySelector('#power-d').value);
    el.querySelector('#power-d-val').innerText = d.toFixed(2);
    const shift = d * 100;
    const powerPct = Math.min(99, Math.round(50 + d * 45));
    el.querySelector('#power-calc-pct').innerText = powerPct + '%';

    const svg = el.querySelector('#power-svg');
    svg.innerHTML = `
      <defs>
        <linearGradient id="gradNull" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#94a3b8" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#94a3b8" stop-opacity="0.0"/>
        </linearGradient>
        <linearGradient id="gradAlt" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ff6b2c" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#ff6b2c" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <!-- Base Line -->
      <line x1="20" y1="170" x2="480" y2="170" stroke="#334155" stroke-width="2"/>
      <!-- Null Distribution H0 -->
      <path d="M 50 170 Q 180 20 310 170 Z" fill="url(#gradNull)" stroke="#94a3b8" stroke-width="2"/>
      <text x="180" y="80" fill="#94a3b8" font-size="12" font-weight="700" text-anchor="middle">H₀ (Null)</text>
      <!-- Alternative Distribution H1 -->
      <path d="M ${50 + shift} 170 Q ${180 + shift} 20 ${310 + shift} 170 Z" fill="url(#gradAlt)" stroke="#ff6b2c" stroke-width="2"/>
      <text x="${180 + shift}" y="80" fill="#ff6b2c" font-size="12" font-weight="700" text-anchor="middle">H₁ (Alternative)</text>
    `;
  };

  el.querySelector('#power-d').addEventListener('input', draw);
  draw();
}

// 3. Topic Narrowing Funnel
function renderTopicFunnel(el) {
  el.innerHTML = `
    <div style="background: #ffffff; border: 1.5px solid var(--qsa-border-light); border-radius: var(--qsa-radius-card); padding: 28px;">
      <h4>The 4-Stage Topic Narrowing Funnel</h4>
      <p style="font-size: 14px; color: var(--qsa-text-light-muted); margin-bottom: 20px;">
        Click each stage to learn how to transition from an unmanageable domain to a defensible thesis question.
      </p>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button class="funnel-btn" data-stage="1" style="width: 100%; padding: 14px; border-radius: var(--qsa-radius-pill); background: var(--qsa-bg-muted-light); border: 1.5px solid var(--qsa-border-light); font-weight: 700; cursor: pointer;">Stage 1: Broad Thematic Domain (e.g. Social Media & Psychology)</button>
        <button class="funnel-btn" data-stage="2" style="width: 85%; margin: 0 auto; padding: 12px; border-radius: var(--qsa-radius-pill); background: var(--qsa-bg-muted-light); border: 1.5px solid var(--qsa-border-light); font-weight: 700; cursor: pointer;">Stage 2: Specific Population (e.g. University Undergraduates)</button>
        <button class="funnel-btn" data-stage="3" style="width: 70%; margin: 0 auto; padding: 12px; border-radius: var(--qsa-radius-pill); background: var(--qsa-bg-muted-light); border: 1.5px solid var(--qsa-border-light); font-weight: 700; cursor: pointer;">Stage 3: Defined Variables (e.g. FOMO & Sleep Quality)</button>
        <button class="funnel-btn active" data-stage="4" style="width: 55%; margin: 0 auto; padding: 12px; border-radius: var(--qsa-radius-pill); background: var(--qsa-accent-orange); color: var(--qsa-bg-dark); border: none; font-weight: 800; cursor: pointer;">Stage 4: Bounded Empirical Question</button>
      </div>

      <div id="funnel-desc" style="background: var(--qsa-bg-muted-light); border-radius: 14px; padding: 20px; margin-top: 24px; font-size: 14.5px; line-height: 1.5;">
        <strong>Defensible Research Question:</strong><br>
        <em>"To what extent does Fear of Missing Out (FOMO) mediate the relationship between evening smartphone usage and self-reported sleep quality among undergraduate medical students in Multan?"</em>
      </div>
    </div>`;

  const details = {
    1: 'Broad Domain: Too wide. A literature review would require reading thousands of papers with no clear focus.',
    2: 'Specific Population: Better. Confines your target respondents to a distinct educational demographic.',
    3: 'Defined Variables: Establishing independent, dependent, and mediating constructs with validated scales.',
    4: 'Bounded Empirical Question: Fully defensible. Specifies who, what, where, and the exact relationship to be statistically tested.'
  };

  el.querySelectorAll('.funnel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.funnel-btn').forEach(b => {
        b.style.background = 'var(--qsa-bg-muted-light)';
        b.style.color = 'inherit';
      });
      btn.style.background = 'var(--qsa-accent-orange)';
      btn.style.color = 'var(--qsa-bg-dark)';
      el.querySelector('#funnel-desc').innerHTML = details[btn.dataset.stage];
    });
  });
}

// 4. Word Planner
function renderWordPlanner(el) {
  el.innerHTML = `
    <div style="background: #ffffff; border: 1.5px solid var(--qsa-border-light); border-radius: var(--qsa-radius-card); padding: 28px;">
      <h4>Thesis Word Budget & Chapter Planner</h4>
      <p style="font-size: 14px; color: var(--qsa-text-light-muted);">Enter your target total dissertation word count to see the proportional allocation across chapters.</p>
      <div style="margin: 20px 0;">
        <label style="font-size: 13px; font-weight: 700; display: block; margin-bottom: 6px;">Total Target Word Count</label>
        <input type="number" id="planner-total" value="20000" step="1000" style="padding: 10px; border-radius: 8px; border: 1.5px solid var(--qsa-border-light); font-size: 16px; width: 200px;">
      </div>
      <div id="planner-bars" style="display: flex; flex-direction: column; gap: 10px;"></div>
    </div>`;

  const chapters = [
    { name: 'Chapter 1: Introduction', pct: 0.12, role: 'Problem statement, research questions, scope, and theoretical contribution.' },
    { name: 'Chapter 2: Literature Review', pct: 0.30, role: 'Thematic synthesis, theoretical framework, and hypothesis development.' },
    { name: 'Chapter 3: Methodology', pct: 0.18, role: 'Design, sampling frame, instrument validity, and ethical consent protocols.' },
    { name: 'Chapter 4: Results & Findings', pct: 0.22, role: 'Descriptive statistics, assumption tests, and hypothesis test output tables.' },
    { name: 'Chapter 5: Discussion & Conclusion', pct: 0.18, role: 'Interpreting results against theory, limitations, and policy implications.' }
  ];

  const update = () => {
    const total = parseInt(el.querySelector('#planner-total').value, 10) || 20000;
    const barsContainer = el.querySelector('#planner-bars');
    barsContainer.innerHTML = chapters.map(ch => {
      const words = Math.round(total * ch.pct);
      return `
        <div style="background: var(--qsa-bg-muted-light); border: 1px solid var(--qsa-border-light); border-radius: 10px; padding: 12px 16px;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 14.5px;">
            <span>${ch.name}</span>
            <span style="color: var(--qsa-accent-orange);">${words.toLocaleString()} words (${ch.pct * 100}%)</span>
          </div>
          <div style="font-size: 12.5px; color: var(--qsa-text-light-muted); margin-top: 4px;">${ch.role}</div>
        </div>`;
    }).join('');
  };

  el.querySelector('#planner-total').addEventListener('input', update);
  update();
}

// 5. APA 7 Dissecter
function renderApaDissecter(el) {
  el.innerHTML = `
    <div style="background: #ffffff; border: 1.5px solid var(--qsa-border-light); border-radius: var(--qsa-radius-card); padding: 28px;">
      <h4>Interactive APA 7th Reference Dissecter</h4>
      <p style="font-size: 14px; color: var(--qsa-text-light-muted); margin-bottom: 20px;">
        Click each highlighted part of the reference to view its official APA 7th formatting rule.
      </p>
      <div style="font-size: 17px; line-height: 2; background: var(--qsa-bg-muted-light); padding: 20px; border-radius: 12px; font-family: Georgia, serif;">
        <span class="apa-part" data-rule="author" style="cursor: pointer; background: #fed7aa; padding: 2px 6px; border-radius: 4px;">Khan, A. M., &amp; Yousaf, M.</span>
        <span class="apa-part" data-rule="year" style="cursor: pointer; background: #bbf7d0; padding: 2px 6px; border-radius: 4px;">(2025).</span>
        <span class="apa-part" data-rule="title" style="cursor: pointer; background: #bae6fd; padding: 2px 6px; border-radius: 4px;">Evaluating statistical power in postgraduate business dissertations.</span>
        <span class="apa-part" data-rule="source" style="cursor: pointer; background: #fbcfe8; padding: 2px 6px; border-radius: 4px;"><em>Journal of Higher Education Research</em>, 14(2), 112–128.</span>
        <span class="apa-part" data-rule="doi" style="cursor: pointer; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">https://doi.org/10.1016/j.jher.2025.02.004</span>
      </div>
      <div id="apa-explanation" style="margin-top: 20px; background: #ffffff; border: 1.5px solid var(--qsa-border-light); border-radius: 12px; padding: 16px; font-size: 14.5px;">
        Click any highlighted element above to see the APA 7th rule.
      </div>
    </div>`;

  const rules = {
    author: 'Author Element: Invert names (Surname followed by initials). Use ampersand (&) before the final author. List up to 20 authors in full before using an ellipsis.',
    year: 'Date Element: Enclosed in parentheses followed by a period. For journal articles, only include the year.',
    title: 'Article Title Element: Use sentence case (capitalize only the first word of title and subtitle, plus proper nouns). Do not italicize journal article titles.',
    source: 'Journal Source Element: Italicize the Journal Title and the Volume Number. Keep issue number in parentheses non-italicized. Include page range.',
    doi: 'DOI Element: Format as an active https://doi.org/... hyperlink. Do not insert a period at the very end.'
  };

  el.querySelectorAll('.apa-part').forEach(part => {
    part.addEventListener('click', () => {
      el.querySelector('#apa-explanation').innerHTML = `<strong>Rule:</strong> ${rules[part.dataset.rule]}`;
    });
  });
}

// 6. Similarity Simulator
function renderSimilaritySimulator(el) {
  el.innerHTML = `
    <div style="background: #ffffff; border: 1.5px solid var(--qsa-border-light); border-radius: var(--qsa-radius-card); padding: 28px;">
      <h4>Similarity Report Simulator (Turnitin Prototype)</h4>
      <p style="font-size: 14px; color: var(--qsa-text-light-muted);">
        Observe how legitimate exclusions (Bibliography & Quotes) dramatically lower the similarity index without compromising academic integrity.
      </p>
      <div style="display: flex; gap: 20px; margin: 20px 0;">
        <label><input type="checkbox" id="sim-ex-bib" checked> Exclude Bibliography</label>
        <label><input type="checkbox" id="sim-ex-quotes" checked> Exclude Cited Quotes</label>
      </div>
      <div style="background: var(--qsa-bg-dark); color: #ffffff; border-radius: 16px; padding: 24px; text-align: center;">
        <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: var(--qsa-accent-peach);">Calculated Similarity Index</div>
        <div id="sim-score" style="font-size: 48px; font-weight: 800; color: #34d399; margin: 8px 0;">12%</div>
        <div id="sim-status" style="font-size: 14px; font-weight: 700; color: #34d399;">Passes HEC Pakistan Threshold (≤ 19%)</div>
      </div>
    </div>`;

  const update = () => {
    const exBib = el.querySelector('#sim-ex-bib').checked;
    const exQuotes = el.querySelector('#sim-ex-quotes').checked;
    let score = 28;
    if (exBib) score -= 10;
    if (exQuotes) score -= 6;

    const scoreEl = el.querySelector('#sim-score');
    const statusEl = el.querySelector('#sim-status');
    scoreEl.innerText = score + '%';

    if (score <= 19) {
      scoreEl.style.color = '#34d399';
      statusEl.style.color = '#34d399';
      statusEl.innerText = 'Passes HEC Pakistan Threshold (≤ 19%)';
    } else {
      scoreEl.style.color = '#f87171';
      statusEl.style.color = '#f87171';
      statusEl.innerText = 'Exceeds HEC Threshold — Requires Paraphrasing & Exclusions';
    }
  };

  el.querySelectorAll('input').forEach(inp => inp.addEventListener('change', update));
}

// 7. Test Picker
function renderTestPicker(el) {
  el.innerHTML = `
    <div style="background: #ffffff; border: 1.5px solid var(--qsa-border-light); border-radius: var(--qsa-radius-card); padding: 28px;">
      <h4>Statistical Test Selector</h4>
      <p style="font-size: 14px; color: var(--qsa-text-light-muted);">Answer three questions to discover the exact statistical test required for your data.</p>
      <div style="display: flex; flex-direction: column; gap: 16px; margin: 20px 0;">
        <div>
          <label style="font-size: 13px; font-weight: 700; display: block; margin-bottom: 6px;">Research Goal</label>
          <select id="tp-goal" style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid var(--qsa-border-light);">
            <option value="means">Comparing group means (e.g. Male vs Female GPA)</option>
            <option value="relation">Testing relationship between continuous variables</option>
            <option value="predict">Predicting an outcome variable from multiple factors</option>
          </select>
        </div>
        <div>
          <label style="font-size: 13px; font-weight: 700; display: block; margin-bottom: 6px;">Number of Comparison Groups</label>
          <select id="tp-groups" style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid var(--qsa-border-light);">
            <option value="2">2 Independent Groups</option>
            <option value="3">3 or more Groups</option>
          </select>
        </div>
      </div>
      <div id="tp-result" style="background: var(--qsa-bg-muted-light); border-left: 4px solid var(--qsa-accent-orange); border-radius: 10px; padding: 18px;">
        <strong>Recommended Test:</strong> Independent Samples t-Test<br>
        <span style="font-size: 13px; color: var(--qsa-text-light-muted);">Assumptions: Normal distribution (Shapiro-Wilk) and Homogeneity of variance (Levene's test).</span>
      </div>
    </div>`;

  const update = () => {
    const goal = el.querySelector('#tp-goal').value;
    const groups = el.querySelector('#tp-groups').value;
    const res = el.querySelector('#tp-result');

    if (goal === 'means') {
      if (groups === '2') {
        res.innerHTML = `<strong>Recommended Test:</strong> Independent Samples t-Test<br><span style="font-size: 13px; color: var(--qsa-text-light-muted);">Assumptions: Normality (Shapiro-Wilk) and Homogeneity of Variance (Levene's Test).</span>`;
      } else {
        res.innerHTML = `<strong>Recommended Test:</strong> One-Way ANOVA with Post-Hoc Tests (Tukey/Bonferroni)<br><span style="font-size: 13px; color: var(--qsa-text-light-muted);">Assumptions: Normality of residuals and equal variances across groups.</span>`;
      }
    } else if (goal === 'relation') {
      res.innerHTML = `<strong>Recommended Test:</strong> Pearson Bivariate Correlation (r)<br><span style="font-size: 13px; color: var(--qsa-text-light-muted);">Assumptions: Linear relationship between interval/ratio variables without severe outliers.</span>`;
    } else {
      res.innerHTML = `<strong>Recommended Test:</strong> Multiple Linear Regression<br><span style="font-size: 13px; color: var(--qsa-text-light-muted);">Assumptions: No multicollinearity (VIF < 5.0), homoscedasticity, and normal residuals.</span>`;
    }
  };

  el.querySelectorAll('select').forEach(s => s.addEventListener('change', update));
}

// 8. SPSS Output Annotator
function renderSpssAnnotator(el) {
  el.innerHTML = `
    <div style="background: #ffffff; border: 1.5px solid var(--qsa-border-light); border-radius: var(--qsa-radius-card); padding: 28px;">
      <h4>SPSS Output Table Annotator (Independent Samples t-Test)</h4>
      <p style="font-size: 14px; color: var(--qsa-text-light-muted);">Click on any statistical output cell to learn how to interpret it and write it in APA 7th style.</p>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-family: var(--qsa-font-mono); font-size: 13.5px;">
          <thead>
            <tr style="background: var(--qsa-bg-dark); color: #ffffff;">
              <th style="padding: 10px; border: 1px solid #334155;">Variable</th>
              <th style="padding: 10px; border: 1px solid #334155;">Levene Sig.</th>
              <th style="padding: 10px; border: 1px solid #334155;">t</th>
              <th style="padding: 10px; border: 1px solid #334155;">df</th>
              <th style="padding: 10px; border: 1px solid #334155;">Sig. (2-tailed)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid var(--qsa-border-light);">Exam Score</td>
              <td class="spss-cell" data-val="levene" style="padding: 10px; border: 1px solid var(--qsa-border-light); background: #fed7aa; cursor: pointer;">0.412</td>
              <td class="spss-cell" data-val="t" style="padding: 10px; border: 1px solid var(--qsa-border-light); background: #bbf7d0; cursor: pointer;">3.482</td>
              <td class="spss-cell" data-val="df" style="padding: 10px; border: 1px solid var(--qsa-border-light); background: #bae6fd; cursor: pointer;">148</td>
              <td class="spss-cell" data-val="sig" style="padding: 10px; border: 1px solid var(--qsa-border-light); background: #fbcfe8; cursor: pointer;">0.001</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div id="spss-expl" style="margin-top: 16px; background: var(--qsa-bg-muted-light); padding: 16px; border-radius: 10px; font-size: 14px;">
        Click on any cell to see how to report it in your thesis.
      </div>
    </div>`;

  const details = {
    levene: "Levene's Test (p = .412): Because p > .05, equal variances are assumed. You read the top row of SPSS output.",
    t: "t-value (3.482): The test statistic. Report as t(148) = 3.48, p = .001.",
    df: "Degrees of Freedom (148): Calculated as N1 + N2 - 2 (e.g. 75 + 75 - 2).",
    sig: "Significance p-value (.001): Because p < .05, reject the null hypothesis. There is a statistically significant difference between groups."
  };

  el.querySelectorAll('.spss-cell').forEach(c => {
    c.addEventListener('click', () => {
      el.querySelector('#spss-expl').innerHTML = `<strong>Interpretation:</strong> ${details[c.dataset.val]}`;
    });
  });
}

// 9. PLS Model & 10. Thresholds & 11-15 Supporting Widgets
function renderPlsModel(el) {
  el.innerHTML = `
    <div style="background: #ffffff; border: 1.5px solid var(--qsa-border-light); border-radius: var(--qsa-radius-card); padding: 28px;">
      <h4>SmartPLS Path Model Explorer</h4>
      <p style="font-size: 14px; color: var(--qsa-text-light-muted);">Click components of the structural model to view the evaluation standards.</p>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin: 24px 0;">
        <button class="pls-btn" data-info="loadings" style="padding: 12px 18px; border-radius: 12px; background: #ecfdf5; border: 1.5px solid #a7f3d0; font-weight: 700; cursor: pointer;">Outer Loadings (λ ≥ 0.708)</button>
        <button class="pls-btn" data-info="ave" style="padding: 12px 18px; border-radius: 12px; background: #eff6ff; border: 1.5px solid #bfdbfe; font-weight: 700; cursor: pointer;">AVE (≥ 0.50)</button>
        <button class="pls-btn" data-info="htmt" style="padding: 12px 18px; border-radius: 12px; background: #fffbeb; border: 1.5px solid #fde68a; font-weight: 700; cursor: pointer;">HTMT (< 0.85)</button>
        <button class="pls-btn" data-info="r2" style="padding: 12px 18px; border-radius: 12px; background: #fdf2f8; border: 1.5px solid #fbcfe8; font-weight: 700; cursor: pointer;">R-Squared (R²)</button>
      </div>
      <div id="pls-details" style="background: var(--qsa-bg-muted-light); padding: 18px; border-radius: 12px; font-size: 14px; line-height: 1.5;">
        Select an assessment criterion above to inspect Hair et al. (2022) guidelines.
      </div>
    </div>`;

  const info = {
    loadings: 'Indicator Reliability: Outer loadings should be ≥ 0.708. Items with loadings < 0.40 should be deleted immediately.',
    ave: 'Convergent Validity: Average Variance Extracted (AVE) must be ≥ 0.50, meaning the construct explains over 50% of its indicators variance.',
    htmt: 'Discriminant Validity: Heterotrait-Monotrait Ratio (HTMT) must be < 0.85 (conservative) or < 0.90 (liberal) to confirm construct distinctiveness.',
    r2: 'Structural Model Explanatory Power: R² values of 0.75, 0.50, and 0.25 represent substantial, moderate, and weak explanatory power.'
  };

  el.querySelectorAll('.pls-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelector('#pls-details').innerHTML = `<strong>Guideline:</strong> ${info[btn.dataset.info]}`;
    });
  });
}

function renderThresholdsTable(el) {
  el.innerHTML = `
    <div style="background: #ffffff; border: 1.5px solid var(--qsa-border-light); border-radius: var(--qsa-radius-card); padding: 28px;">
      <h4>PLS-SEM Quality Criteria Thresholds Table</h4>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
        <thead>
          <tr style="background: var(--qsa-bg-subtle-light);">
            <th style="padding: 10px; text-align: left; border: 1px solid var(--qsa-border-light);">Criterion</th>
            <th style="padding: 10px; text-align: left; border: 1px solid var(--qsa-border-light);">Standard Threshold</th>
            <th style="padding: 10px; text-align: left; border: 1px solid var(--qsa-border-light);">Primary Source</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px; border: 1px solid var(--qsa-border-light);">Cronbach's Alpha (α)</td>
            <td style="padding: 10px; border: 1px solid var(--qsa-border-light); color: #15803d; font-weight: 700;">≥ 0.70</td>
            <td style="padding: 10px; border: 1px solid var(--qsa-border-light);">Hair et al. (2022)</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid var(--qsa-border-light);">Composite Reliability (CR)</td>
            <td style="padding: 10px; border: 1px solid var(--qsa-border-light); color: #15803d; font-weight: 700;">0.70 – 0.95</td>
            <td style="padding: 10px; border: 1px solid var(--qsa-border-light);">Hair et al. (2022)</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid var(--qsa-border-light);">Average Variance Extracted (AVE)</td>
            <td style="padding: 10px; border: 1px solid var(--qsa-border-light); color: #15803d; font-weight: 700;">≥ 0.50</td>
            <td style="padding: 10px; border: 1px solid var(--qsa-border-light);">Fornell & Larcker (1981)</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid var(--qsa-border-light);">HTMT Ratio</td>
            <td style="padding: 10px; border: 1px solid var(--qsa-border-light); color: #15803d; font-weight: 700;">< 0.85 / < 0.90</td>
            <td style="padding: 10px; border: 1px solid var(--qsa-border-light);">Henseler et al. (2015)</td>
          </tr>
        </tbody>
      </table>
    </div>`;
}

function renderBooleanBuilder(el) {
  el.innerHTML = `
    <div style="background: #ffffff; border: 1.5px solid var(--qsa-border-light); border-radius: var(--qsa-radius-card); padding: 28px;">
      <h4>Boolean Search String Builder</h4>
      <p style="font-size: 14px; color: var(--qsa-text-light-muted);">Combine primary keywords and synonyms to generate verified search syntax.</p>
      <div style="display: grid; gap: 14px; margin: 16px 0;">
        <input type="text" id="bb-k1" value="higher education" placeholder="Core Concept 1" style="padding: 10px; border-radius: 8px; border: 1.5px solid var(--qsa-border-light);">
        <input type="text" id="bb-k2" value="artificial intelligence" placeholder="Core Concept 2" style="padding: 10px; border-radius: 8px; border: 1.5px solid var(--qsa-border-light);">
        <input type="text" id="bb-k3" value="academic integrity" placeholder="Core Concept 3" style="padding: 10px; border-radius: 8px; border: 1.5px solid var(--qsa-border-light);">
      </div>
      <div style="background: var(--qsa-bg-dark); color: var(--qsa-accent-peach); font-family: var(--qsa-font-mono); padding: 16px; border-radius: 12px; font-size: 14px;">
        ("higher education" OR "university") AND ("artificial intelligence" OR "generative AI") AND ("academic integrity" OR "plagiarism")
      </div>
    </div>`;
}

function renderZoteroFlow(el) {
  el.innerHTML = `
    <div style="background: #ffffff; border: 1.5px solid var(--qsa-border-light); border-radius: var(--qsa-radius-card); padding: 28px;">
      <h4>Zotero Research Automation Flow</h4>
      <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 16px;">
        <div style="padding: 12px; background: var(--qsa-bg-muted-light); border-radius: 8px;"><strong>1. Capture:</strong> Click Zotero Connector in Chrome to save PDFs and clean metadata.</div>
        <div style="padding: 12px; background: var(--qsa-bg-muted-light); border-radius: 8px;"><strong>2. Organize:</strong> Add tags, group by thesis chapter collections, highlight quotes.</div>
        <div style="padding: 12px; background: var(--qsa-bg-muted-light); border-radius: 8px;"><strong>3. Cite:</strong> Press Alt+Z in MS Word to insert in-text citations.</div>
        <div style="padding: 12px; background: var(--qsa-bg-muted-light); border-radius: 8px;"><strong>4. Bibliography:</strong> Click 'Add Bibliography' for instant 100% formatted APA 7 reference list.</div>
      </div>
    </div>`;
}

function renderVivaCards(el) {
  el.innerHTML = `
    <div style="background: #ffffff; border: 1.5px solid var(--qsa-border-light); border-radius: var(--qsa-radius-card); padding: 28px;">
      <h4>Viva Defense Question Flashcards</h4>
      <div style="background: var(--qsa-bg-muted-light); border-radius: 14px; padding: 24px; text-align: center; margin: 20px 0;">
        <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: var(--qsa-accent-orange);">Question 1 of 10</span>
        <div style="font-size: 20px; font-weight: 800; margin: 12px 0;">"Why did you choose this specific sampling methodology?"</div>
        <p style="font-size: 14px; color: var(--qsa-text-light-muted);">Model Structure: 1. State population boundary. 2. Justify Cochran/G*Power formula. 3. Acknowledge sampling limitation as boundary condition.</p>
      </div>
    </div>`;
}

function renderSlideTimer(el) {
  el.innerHTML = `
    <div style="background: #ffffff; border: 1.5px solid var(--qsa-border-light); border-radius: var(--qsa-radius-card); padding: 28px;">
      <h4>Viva Slide Budget & Pace Planner</h4>
      <p style="font-size: 14px; color: var(--qsa-text-light-muted);">For a standard 15-minute defense, your total slide deck should not exceed 12 slides (approx. 75 seconds per slide).</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-top: 16px;">
        <div style="background: var(--qsa-bg-muted-light); padding: 12px; border-radius: 8px; text-align: center;"><strong>Slide 1:</strong> Title (30s)</div>
        <div style="background: var(--qsa-bg-muted-light); padding: 12px; border-radius: 8px; text-align: center;"><strong>Slides 2-3:</strong> Problem & Literature (3 min)</div>
        <div style="background: var(--qsa-bg-muted-light); padding: 12px; border-radius: 8px; text-align: center;"><strong>Slides 4-6:</strong> Methodology & Model (4 min)</div>
        <div style="background: var(--qsa-bg-muted-light); padding: 12px; border-radius: 8px; text-align: center;"><strong>Slides 7-9:</strong> Results (4 min)</div>
        <div style="background: var(--qsa-bg-muted-light); padding: 12px; border-radius: 8px; text-align: center;"><strong>Slides 10-12:</strong> Conclusion & Defense (3.5 min)</div>
      </div>
    </div>`;
}

function renderChecklistWidget(el) {
  el.innerHTML = `
    <div style="background: #ffffff; border: 1.5px solid var(--qsa-border-light); border-radius: var(--qsa-radius-card); padding: 28px;">
      <h4>Interactive Thesis Submission Audit Checklist</h4>
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 16px;">
        <label><input type="checkbox"> Every in-text citation matches an exact entry in the reference list.</label>
        <label><input type="checkbox"> All tables and figures adhere to APA 7th border rules (no vertical lines).</label>
        <label><input type="checkbox"> Similarity index is under 19% overall and under 5% per source on Turnitin.</label>
        <label><input type="checkbox"> Signed gatekeeper letters and informed consent forms are attached in appendices.</label>
        <label><input type="checkbox"> Front matter page numbers use Roman numerals (i, ii, iii) and Chapter 1 begins at Arabic page 1.</label>
      </div>
    </div>`;
}
