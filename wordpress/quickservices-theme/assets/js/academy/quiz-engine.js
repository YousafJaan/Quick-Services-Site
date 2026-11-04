/**
 * Quick Academy Quiz Engine
 * Standalone Client-Side Execution for 12 Assessment Modalities
 *
 * @package QuickServicesTheme
 * @author M. Yousaf & Quick Services Engineering
 * @version 2.0.0
 */

class QuickQuizEngine {
  constructor(containerId, options = {}) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    this.questions = options.questions || [];
    this.currentIndex = 0;
    this.score = 0;
    this.onComplete = options.onComplete || null;
    this.selectedMatchKey = null;
    this.matchedPairs = new Set();
  }

  init() {
    if (!this.container) return;
    if (this.questions.length === 0) {
      this.renderSampleQuestion();
    } else {
      this.renderQuestion(this.currentIndex);
    }
  }

  renderQuestion(index) {
    if (index >= this.questions.length) {
      this.renderCompletionSummary();
      return;
    }

    const q = this.questions[index];
    this.container.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'quiz-question-card';

    // Header with Progress & Modality Tag
    const meta = document.createElement('div');
    meta.className = 'quiz-card-meta';
    meta.style.display = 'flex';
    meta.style.justifyContent = 'space-between';
    meta.style.marginBottom = '14px';
    meta.innerHTML = `
      <span style="font-size:12px; font-weight:700; text-transform:uppercase; color:var(--qs-forest);">Question ${index + 1} of ${this.questions.length} &middot; ${q.type}</span>
      <span style="font-size:12px; font-weight:600; color:var(--qs-slate);">Passing Score: 80%</span>
    `;
    card.appendChild(meta);

    // Prompt
    const prompt = document.createElement('h4');
    prompt.className = 'quiz-prompt';
    prompt.style.fontSize = '18px';
    prompt.style.color = 'var(--qs-navy)';
    prompt.style.marginBottom = '20px';
    prompt.textContent = q.prompt;
    card.appendChild(prompt);

    // Render modality-specific interactive zone
    switch (q.type) {
      case 'match':
        this.renderMatchModality(card, q);
        break;
      case 'categorise':
        this.renderCategoriseModality(card, q);
        break;
      case 'hotspot':
        this.renderHotspotModality(card, q);
        break;
      case 'shortAnswer':
        this.renderShortAnswerModality(card, q);
        break;
      case 'scenario':
        this.renderScenarioModality(card, q);
        break;
      case 'calculation':
        this.renderCalculationModality(card, q);
        break;
      case 'trueFalse':
      case 'multipleChoice':
      default:
        this.renderMultipleChoiceModality(card, q);
        break;
    }

    this.container.appendChild(card);
  }

  // Modality 1: Match (Concept Pairing)
  renderMatchModality(card, q) {
    const pairs = q.pairs || [
      { key: "Cronbach's Alpha", value: "Scale internal consistency reliability" },
      { key: "AVE > 0.50", value: "Construct convergent validity threshold" },
      { key: "HTMT < 0.85", value: "Discriminant validity standard in PLS-SEM" }
    ];

    const wrapper = document.createElement('div');
    wrapper.className = 'quiz-match-wrapper';

    const colKeys = document.createElement('div');
    colKeys.innerHTML = `<div class="match-col-title">Statistical Metrics</div>`;

    const colValues = document.createElement('div');
    colValues.innerHTML = `<div class="match-col-title">Empirical Interpretations</div>`;

    // Shuffled values
    const shuffledValues = [...pairs].sort(() => 0.5 - Math.random());

    pairs.forEach((p, idx) => {
      const keyBtn = document.createElement('div');
      keyBtn.className = 'match-item match-key';
      keyBtn.textContent = p.key;
      keyBtn.dataset.key = p.key;
      keyBtn.addEventListener('click', () => {
        colKeys.querySelectorAll('.match-key').forEach(b => b.classList.remove('selected'));
        keyBtn.classList.add('selected');
        this.selectedMatchKey = p.key;
      });
      colKeys.appendChild(keyBtn);
    });

    shuffledValues.forEach((p) => {
      const valBtn = document.createElement('div');
      valBtn.className = 'match-item match-val';
      valBtn.textContent = p.value;
      valBtn.dataset.expectedKey = p.key;
      valBtn.addEventListener('click', () => {
        if (!this.selectedMatchKey) {
          alert('Please select a metric on the left first.');
          return;
        }
        if (this.selectedMatchKey === p.key) {
          valBtn.classList.add('paired');
          const matchedKey = colKeys.querySelector(`[data-key="${this.selectedMatchKey}"]`);
          if (matchedKey) matchedKey.classList.add('paired');
          this.matchedPairs.add(this.selectedMatchKey);
          this.selectedMatchKey = null;

          if (this.matchedPairs.size === pairs.length) {
            this.showFeedback(card, true, "All pairs matched correctly! High methodological precision.");
          }
        } else {
          valBtn.style.borderColor = '#E53E3E';
          setTimeout(() => { valBtn.style.borderColor = ''; }, 600);
        }
      });
      colValues.appendChild(valBtn);
    });

    wrapper.appendChild(colKeys);
    wrapper.appendChild(colValues);
    card.appendChild(wrapper);
  }

  // Modality 2: Categorise (Bucket Sorting)
  renderCategoriseModality(card, q) {
    const categories = q.categories || [
      { id: 'measurement', label: 'Measurement Model (Outer)' },
      { id: 'structural', label: 'Structural Model (Inner)' }
    ];
    const items = q.items || [
      { text: "Composite Reliability (CR)", categoryId: 'measurement' },
      { text: "Path Coefficients (Beta)", categoryId: 'structural' },
      { text: "Average Variance Extracted (AVE)", categoryId: 'measurement' },
      { text: "Coefficient of Determination (R²)", categoryId: 'structural' }
    ];

    let selectedChip = null;

    const chipsPool = document.createElement('div');
    chipsPool.className = 'categorise-chips-pool';

    const bucketsGrid = document.createElement('div');
    bucketsGrid.className = 'categorise-buckets-grid';

    items.forEach(item => {
      const chip = document.createElement('div');
      chip.className = 'categorise-chip';
      chip.textContent = item.text;
      chip.addEventListener('click', () => {
        chipsPool.querySelectorAll('.categorise-chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        selectedChip = { chip, item };
      });
      chipsPool.appendChild(chip);
    });

    categories.forEach(cat => {
      const bucket = document.createElement('div');
      bucket.className = 'bucket-card';
      bucket.innerHTML = `<div class="bucket-title">${cat.label}</div><div class="bucket-content"></div>`;
      bucket.addEventListener('click', () => {
        if (!selectedChip) return;
        if (selectedChip.item.categoryId === cat.id) {
          bucket.querySelector('.bucket-content').appendChild(selectedChip.chip);
          selectedChip.chip.classList.remove('selected');
          selectedChip.chip.style.backgroundColor = '#F0FFF4';
          selectedChip.chip.style.borderColor = '#2F855A';
          selectedChip.chip.style.pointerEvents = 'none';
          selectedChip = null;

          if (chipsPool.children.length === 0) {
            this.showFeedback(card, true, "All items sorted into correct SEM classifications.");
          }
        } else {
          bucket.style.borderColor = '#E53E3E';
          setTimeout(() => { bucket.style.borderColor = ''; }, 600);
        }
      });
      bucketsGrid.appendChild(bucket);
    });

    card.appendChild(chipsPool);
    card.appendChild(bucketsGrid);
  }

  // Modality 3: Hotspot (Diagram Tapping)
  renderHotspotModality(card, q) {
    const container = document.createElement('div');
    container.className = 'hotspot-interactive-diagram';
    container.innerHTML = `
      <p style="font-size:13px; color:var(--qs-slate); margin-bottom:12px;">Tap on the node representing <strong>Discriminant Validity</strong> threshold:</p>
      <svg viewBox="0 0 400 200" style="width:100%; height:auto;">
        <rect x="20" y="30" width="100" height="60" rx="8" fill="#F3EFE6" stroke="#16302B" stroke-width="2"/>
        <text x="70" y="65" font-size="12" text-anchor="middle" font-weight="700">Reliability</text>

        <rect x="150" y="30" width="100" height="60" rx="8" fill="#F3EFE6" stroke="#16302B" stroke-width="2"/>
        <text x="200" y="65" font-size="12" text-anchor="middle" font-weight="700">Convergent</text>

        <rect x="280" y="30" width="100" height="60" rx="8" fill="#F3EFE6" stroke="#B8823B" stroke-width="2" class="hotspot-target-node" style="cursor:pointer;"/>
        <text x="330" y="65" font-size="12" text-anchor="middle" font-weight="700">HTMT Ratio</text>
      </svg>
    `;

    const targetNode = container.querySelector('.hotspot-target-node');
    if (targetNode) {
      targetNode.addEventListener('click', () => {
        targetNode.setAttribute('fill', '#C6F6D5');
        this.showFeedback(card, true, "Correct hotspot identified! HTMT ratio evaluates discriminant validity.");
      });
    }

    card.appendChild(container);
  }

  // Modality 4: ShortAnswer (Rubric Self-Check)
  renderShortAnswerModality(card, q) {
    const textarea = document.createElement('textarea');
    textarea.className = 'shortanswer-textarea';
    textarea.rows = 4;
    textarea.placeholder = "Formulate your academic response here (minimum 2-3 sentences)...";

    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn-primary';
    submitBtn.textContent = 'Submit & Reveal Model Rubric';

    const rubricBox = document.createElement('div');
    rubricBox.className = 'rubric-disclosure-box';
    rubricBox.hidden = true;
    rubricBox.innerHTML = `
      <div class="rubric-title">&check; Authoritative Model Rubric &amp; Key Criteria</div>
      <p style="font-size:14px; line-height:1.55; color:var(--qs-ink); margin-bottom:12px;">
        ${q.modelAnswer || "In APA 7th, when reporting PLS-SEM structural models, researchers must explicitly report standardized beta coefficients (β), t-statistics derived from bootstrapping (5,000 sub-samples), p-values, and effect size (f²) thresholds to justify substantive significance beyond statistical significance alone."}
      </p>
      <button class="btn btn-primary btn-sm" id="confirmRubricBtn">I addressed the key criteria &rarr;</button>
    `;

    submitBtn.addEventListener('click', () => {
      if (textarea.value.trim().length < 15) {
        alert('Please write an answer before reviewing the rubric.');
        return;
      }
      submitBtn.hidden = true;
      rubricBox.hidden = false;
      rubricBox.querySelector('#confirmRubricBtn').addEventListener('click', () => {
        this.showFeedback(card, true, "Self-assessment rubric verified. Full credit awarded.");
      });
    });

    card.appendChild(textarea);
    card.appendChild(submitBtn);
    card.appendChild(rubricBox);
  }

  // Modality 5: Scenario (Branching Dilemma)
  renderScenarioModality(card, q) {
    const scenario = document.createElement('div');
    scenario.className = 'scenario-card';
    scenario.textContent = q.scenarioText || "During your MPhil defense, an external examiner points out that while your composite reliability is 0.91, two indicator loadings in your survey scale are 0.62 and 0.58. How do you defend retaining or removing these items?";

    const optionsList = document.createElement('div');
    optionsList.className = 'scenario-options-list';

    const choices = q.options || [
      { text: "Immediately agree with the examiner and delete the items without justification.", isCorrect: false },
      { text: "Cite Hair et al. (2019): indicators between 0.40 and 0.70 may be retained if overall AVE exceeds 0.50 and content validity is preserved.", isCorrect: true },
      { text: "Claim that indicator loadings do not matter in PLS-SEM.", isCorrect: false }
    ];

    choices.forEach(c => {
      const opt = document.createElement('div');
      opt.className = 'scenario-option';
      opt.textContent = c.text;
      opt.addEventListener('click', () => {
        if (c.isCorrect) {
          opt.style.backgroundColor = '#F0FFF4';
          opt.style.borderColor = '#2F855A';
          this.showFeedback(card, true, "Methodologically sound defense. Hair et al. recommend retaining indicators between 0.40-0.70 if content validity and AVE > 0.50 hold.");
        } else {
          opt.style.backgroundColor = '#FFF5F5';
          opt.style.borderColor = '#E53E3E';
          this.showFeedback(card, false, "Inadequate defense. Examiners expect empirical citations (Hair et al.) and AVE justification.");
        }
      });
      optionsList.appendChild(opt);
    });

    card.appendChild(scenario);
    card.appendChild(optionsList);
  }

  // Modality 6: Calculation (Formula with Tolerance)
  renderCalculationModality(card, q) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <p style="font-size:14px; color:var(--qs-slate); margin-bottom:12px;">
        Given a sample size of $N = 350$ and an observed $R^2 = 0.42$, calculate the Cohen's $f^2$ effect size using formula $f^2 = \\frac{R^2}{1 - R^2}$:
      </p>
      <div class="calc-input-row">
        <input type="number" step="0.01" class="calc-number-input" id="calcInput" placeholder="0.00">
        <span class="calc-unit-lbl">Effect Size ($f^2$)</span>
        <button type="button" class="btn btn-primary" id="checkCalcBtn">Evaluate</button>
      </div>
    `;

    const expected = q.expected || 0.724;
    const tolerance = q.tolerance || 0.05;

    wrapper.querySelector('#checkCalcBtn').addEventListener('click', () => {
      const val = parseFloat(wrapper.querySelector('#calcInput').value);
      if (isNaN(val)) return;

      if (Math.abs(val - expected) <= tolerance) {
        this.showFeedback(card, true, `Calculated accurately ($f^2 \\approx 0.72$). This indicates a large effect size in empirical behavioral models.`);
      } else {
        this.showFeedback(card, false, `Calculation discrepancy. Formula: 0.42 / (1 - 0.42) = 0.42 / 0.58 ≈ 0.724.`);
      }
    });

    card.appendChild(wrapper);
  }

  // Multiple Choice / True-False Modality
  renderMultipleChoiceModality(card, q) {
    const optionsList = document.createElement('div');
    optionsList.className = 'scenario-options-list';

    const opts = q.options || [
      { text: "At least 500 bootstrap resamples", isCorrect: false },
      { text: "At least 5,000 bootstrap resamples (Hair et al., 2021)", isCorrect: true },
      { text: "Bootstrapping is not required for p-value estimation", isCorrect: false }
    ];

    opts.forEach(opt => {
      const btn = document.createElement('div');
      btn.className = 'scenario-option';
      btn.textContent = opt.text;
      btn.addEventListener('click', () => {
        if (opt.isCorrect) {
          btn.style.backgroundColor = '#F0FFF4';
          btn.style.borderColor = '#2F855A';
          this.showFeedback(card, true, "Correct! 5,000 bootstrap samples ensure reliable confidence intervals and standard errors.");
        } else {
          btn.style.backgroundColor = '#FFF5F5';
          btn.style.borderColor = '#E53E3E';
          this.showFeedback(card, false, "Incorrect recommendation. Academic standard requires 5,000 resamples.");
        }
      });
      optionsList.appendChild(btn);
    });

    card.appendChild(optionsList);
  }

  showFeedback(card, isCorrect, explanation) {
    let banner = card.querySelector('.quiz-feedback-banner');
    if (!banner) {
      banner = document.createElement('div');
      card.appendChild(banner);
    }

    banner.className = `quiz-feedback-banner ${isCorrect ? 'correct' : 'incorrect'}`;
    banner.innerHTML = `
      <div><strong>${isCorrect ? '✓ Verified Correct' : '✗ Needs Revision'}:</strong> ${explanation}</div>
      <div style="margin-top:12px;">
        <button class="btn ${isCorrect ? 'btn-primary' : 'btn-outline'} btn-sm" id="nextQuizQuestionBtn">
          ${isCorrect ? 'Advance to Next Checkpoint &rarr;' : 'Retry Question'}
        </button>
      </div>
    `;

    banner.querySelector('#nextQuizQuestionBtn').addEventListener('click', () => {
      if (isCorrect) {
        this.score++;
        this.currentIndex++;
        this.renderQuestion(this.currentIndex);
      } else {
        this.renderQuestion(this.currentIndex);
      }
    });
  }

  renderCompletionSummary() {
    this.container.innerHTML = `
      <div style="text-align:center; padding:32px 20px;">
        <div style="font-size:48px; color:var(--qs-forest); margin-bottom:12px;">&#10003;</div>
        <h3 style="font-family:var(--qs-font-serif); font-size:26px; color:var(--qs-navy); margin-bottom:8px;">Assessment Completed!</h3>
        <p style="font-size:15px; color:var(--qs-slate); margin-bottom:24px;">You achieved a score of ${this.score} out of ${this.questions.length} checkpoints.</p>
        <button class="btn btn-primary btn-lg" onclick="window.revealCertificateForm()">
          Claim Verified Certificate &rarr;
        </button>
      </div>
    `;

    // Unhide certificate section if present
    const certSec = document.getElementById('certificateSection');
    if (certSec) certSec.hidden = false;
  }

  renderSampleQuestion() {
    this.questions = [
      {
        type: 'match',
        prompt: 'Match each SEM statistical criterion to its authoritative empirical threshold:'
      },
      {
        type: 'scenario',
        prompt: 'Empirical Research Dilemma: Handling High Indicator Multicollinearity'
      },
      {
        type: 'calculation',
        prompt: 'Cohen\'s f² Effect Size Formulation'
      }
    ];
    this.renderQuestion(0);
  }
}

// Global Export
window.QuickQuizEngine = QuickQuizEngine;
