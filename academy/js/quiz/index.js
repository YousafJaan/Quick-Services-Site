/**
 * Quick Services Academy — Unified Quiz Engine (12 Question Modalities)
 * Supports formative paragraph micro-checks and summative graded module/final exams.
 */

export class QuizEngine {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.getElementById(container) : container;
    this.bank = options.bank || options.questions || (Array.isArray(options) ? options : []);
    this.showCount = options.show || this.bank.length;
    this.passThreshold = options.pass || 70;
    this.onComplete = options.onComplete || (() => {});
    this.isSelfCheck = options.isSelfCheck || false;
    this.courseId = options.courseId || '';
    this.lessonId = options.lessonId || '';

    this.questions = this._selectQuestions();
    this.currentIndex = 0;
    this.answers = {};
    this.score = 0;
    this.mistakes = [];

    this.render();
  }

  _selectQuestions() {
    if (this.isSelfCheck) return this.bank;
    const shuffled = [...this.bank].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(this.showCount, shuffled.length));
  }

  render() {
    if (!this.container) return;

    if (!this.questions || this.questions.length === 0) {
      this.container.innerHTML = `
        <div class="quiz-empty-card" style="padding: 32px 24px; text-align: center; border: 1.5px dashed var(--qsa-border-card, #cbd5e1); border-radius: 14px; background: var(--qsa-bg-card, #FAF7F1);">
          <div style="font-size: 28px; margin-bottom: 8px;">📋</div>
          <h4 style="margin: 0 0 6px; color: var(--qsa-primary-navy, #102B4E); font-size: 17px; font-family: var(--qsa-font-serif, Georgia, serif);">Self-Check Under Compilation</h4>
          <p style="color: var(--qsa-text-muted, #64748b); font-size: 13.5px; margin: 0; max-width: 440px; margin: 0 auto;">Practice examination questions for this module are currently being compiled according to HEC syllabus guidelines.</p>
        </div>`;
      return;
    }

    if (this.currentIndex >= this.questions.length) {
      this.renderResults();
      return;
    }

    const q = this.questions[this.currentIndex];
    const total = this.questions.length;
    const progressPct = Math.round((this.currentIndex / total) * 100);

    let html = `
      <div class="quiz-container">
        <div class="quiz-header">
          <span style="font-weight: 800; font-size: 14px; text-transform: uppercase; color: var(--qsa-accent-orange);">
            ${this.isSelfCheck ? 'Paragraph Self-Check' : `Question ${this.currentIndex + 1} of ${total}`}
          </span>
          <span style="font-size: 13px; font-weight: 600; color: var(--qsa-text-light-muted);">
            Pass Mark: ${this.passThreshold}%
          </span>
        </div>
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width: ${progressPct}%;"></div>
        </div>

        <div class="question-card" data-q-type="${q.type}">
          <div class="question-prompt">${q.q}</div>
          <div class="question-interaction" id="q-interaction-area">
            ${this._renderQuestionInput(q)}
          </div>
          <div id="q-feedback-area"></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--qsa-border-light); padding-top: 20px;">
          ${q.hint ? `<button type="button" class="btn btn-secondary btn-sm" id="q-hint-btn">💡 Show Hint</button>` : '<div></div>'}
          <button type="button" class="btn btn-primary btn-sm" id="q-submit-btn">Check Answer</button>
        </div>
      </div>`;

    this.container.innerHTML = html;
    this._attachEventListeners(q);
  }

  _renderQuestionInput(q) {
    switch (q.type) {
      case 'single':
      case 'trueFalse':
        return `
          <div class="options-list">
            ${q.options.map((opt, idx) => `
              <div class="option-item" data-opt-idx="${idx}">
                <div class="option-radio"></div>
                <div style="flex: 1;">${opt}</div>
              </div>`).join('')}
          </div>`;

      case 'multi':
        return `
          <div class="options-list">
            ${q.options.map((opt, idx) => `
              <div class="option-item multi-option" data-opt-idx="${idx}">
                <div class="option-radio" style="border-radius: 4px;"></div>
                <div style="flex: 1;">${opt}</div>
              </div>`).join('')}
          </div>`;

      case 'fillBlank':
        return `
          <div>
            <input type="text" class="fill-blank-input" id="fill-input" placeholder="Type your answer here..." autocomplete="off">
          </div>`;

      case 'order':
        const steps = [...(q.steps || q.options || [])];
        return `
          <div class="order-list" id="order-list-area">
            ${steps.map((st, idx) => `
              <div class="order-item" data-step-idx="${idx}">
                <span>${st}</span>
                <div class="order-controls">
                  <button type="button" class="order-btn" data-dir="up">▲</button>
                  <button type="button" class="order-btn" data-dir="down">▼</button>
                </div>
              </div>`).join('')}
          </div>`;

      case 'spotError':
        const words = (q.sentence || '').split(' ');
        return `
          <div class="spot-error-sentence">
            ${words.map((w, idx) => `<span class="spot-word" data-word-idx="${idx}">${w}</span>`).join(' ')}
          </div>`;

      case 'match':
        const pairs = q.pairs || [];
        const leftKeys = pairs.map((p, i) => ({ text: p.key, idx: i }));
        const rightVals = pairs.map((p, i) => ({ text: p.value, idx: i })).sort(() => 0.5 - Math.random());
        return `
          <div class="match-container" style="display: flex; flex-direction: column; gap: 12px;">
            <div style="font-size: 13px; color: var(--qsa-text-muted); margin-bottom: 4px;">Tap a concept on the left, then tap its definition on the right:</div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px;">
              <div class="match-col left-col" style="display: flex; flex-direction: column; gap: 8px;">
                ${leftKeys.map(k => `
                  <button type="button" class="match-btn match-key" data-key-idx="${k.idx}" style="padding: 12px 14px; text-align: left; border: 1.5px solid var(--qsa-border); border-radius: 8px; background: var(--qsa-card-bg, #fff); font-size: 13px; font-weight: 600; cursor: pointer; min-height: 48px;">
                    ${k.text}
                  </button>`).join('')}
              </div>
              <div class="match-col right-col" style="display: flex; flex-direction: column; gap: 8px;">
                ${rightVals.map(v => `
                  <button type="button" class="match-btn match-val" data-val-idx="${v.idx}" style="padding: 12px 14px; text-align: left; border: 1.5px solid var(--qsa-border); border-radius: 8px; background: var(--qsa-card-bg, #fff); font-size: 13px; cursor: pointer; min-height: 48px;">
                    ${v.text}
                  </button>`).join('')}
              </div>
            </div>
            <div id="match-status" style="font-size: 12px; font-weight: 600; color: #ff6b2c; min-height: 18px;"></div>
          </div>`;

      case 'categorise':
        const cats = q.categories || [];
        const items = q.items || [];
        return `
          <div class="categorise-container" style="display: flex; flex-direction: column; gap: 14px;">
            <div style="font-size: 13px; color: var(--qsa-text-muted);">Tap a concept chip below to select it, then tap a category bucket:</div>
            <div class="chips-pool" id="cat-chips-pool" style="display: flex; flex-wrap: wrap; gap: 8px; padding: 10px; background: var(--qsa-bg-muted, #f8fafc); border-radius: 8px;">
              ${items.map((it, idx) => `
                <button type="button" class="cat-chip" data-item-idx="${idx}" style="padding: 8px 14px; border-radius: 999px; border: 1.5px solid #ff6b2c; background: #fff; color: #1c1917; font-size: 13px; font-weight: 600; cursor: pointer; min-height: 44px;">
                  ${it.text}
                </button>`).join('')}
            </div>
            <div class="cat-buckets" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
              ${cats.map(c => `
                <div class="cat-bucket" data-cat-id="${c.id}" style="border: 2px dashed var(--qsa-border, #cbd5e1); border-radius: 10px; padding: 12px; min-height: 90px; cursor: pointer;">
                  <div style="font-size: 13.5px; font-weight: 700; color: #102b4e; margin-bottom: 8px;">${c.label}</div>
                  <div class="bucket-contents" style="display: flex; flex-wrap: wrap; gap: 6px;"></div>
                </div>`).join('')}
            </div>
          </div>`;

      case 'hotspot':
        const targets = q.targets || [];
        return `
          <div class="hotspot-container" style="display: flex; flex-direction: column; gap: 12px;">
            <div style="font-size: 13px; color: var(--qsa-text-muted);">Tap the correct component on the diagram, or select from the accessible list:</div>
            <div class="hotspot-diagram" style="position: relative; max-width: 100%; border: 1px solid var(--qsa-border); border-radius: 8px; overflow: hidden; background: #fff;">
              <svg viewBox="0 0 400 240" style="width: 100%; height: auto; display: block;">
                ${q.svgContent || '<rect width="400" height="240" fill="#f8fafc" /><text x="200" y="120" text-anchor="middle" font-size="14" fill="#64748b">Research Model Diagram</text>'}
                ${targets.map(t => `
                  <circle class="hotspot-circle" data-target-id="${t.id}" cx="${t.x}" cy="${t.y}" r="${t.r || 24}" fill="rgba(255, 107, 44, 0.35)" stroke="#ff6b2c" stroke-width="2.5" style="cursor: pointer;" />`).join('')}
              </svg>
            </div>
            <div class="hotspot-accessible-list" style="display: flex; flex-direction: column; gap: 6px;">
              ${targets.map(t => `
                <button type="button" class="hotspot-btn" data-target-id="${t.id}" style="padding: 10px 14px; text-align: left; border: 1.5px solid var(--qsa-border); border-radius: 8px; background: #fff; font-size: 13px; cursor: pointer; min-height: 44px;">
                  Target Option: ${t.label || t.id}
                </button>`).join('')}
            </div>
          </div>`;

      case 'shortAnswer':
        return `
          <div class="short-answer-container" style="display: flex; flex-direction: column; gap: 10px;">
            <textarea id="short-answer-input" placeholder="Type your concise academic response here..." rows="4" style="width: 100%; padding: 12px; border: 1.5px solid var(--qsa-border); border-radius: 8px; font-family: inherit; font-size: 14px; resize: vertical; box-sizing: border-box;"></textarea>
            <div id="short-answer-rubric" style="display: none; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
              <div style="font-weight: 700; font-size: 13px; color: #102b4e; margin-bottom: 6px;">Model Response &amp; Key Points:</div>
              <p style="font-size: 13px; line-height: 1.5; margin: 0 0 10px;">${q.modelAnswer || ''}</p>
              ${(q.keyPoints || []).length ? `
                <div style="font-size: 12.5px; font-weight: 600; margin-bottom: 4px;">Key criteria to check:</div>
                <ul style="margin: 0 0 10px; padding-left: 18px; font-size: 12px;">
                  ${(q.keyPoints || []).map(kp => `<li>${kp}</li>`).join('')}
                </ul>` : ''}
              <button type="button" class="btn btn-secondary btn-sm" id="self-eval-pass-btn">✓ I covered these key points</button>
            </div>
          </div>`;

      case 'scenario':
        const opts = q.options || [];
        return `
          <div class="scenario-container" style="display: flex; flex-direction: column; gap: 12px;">
            ${q.scenarioText ? `
              <div style="padding: 14px; background: #f8fafc; border-left: 4px solid #102b4e; border-radius: 0 8px 8px 0; font-size: 13.5px; line-height: 1.55;">
                ${q.scenarioText}
              </div>` : ''}
            <div class="options-list">
              ${opts.map((opt, idx) => `
                <div class="option-item" data-opt-idx="${idx}">
                  <div class="option-radio"></div>
                  <div style="flex: 1; font-size: 13.5px;">${opt.text || opt}</div>
                </div>`).join('')}
            </div>
          </div>`;

      case 'calculation':
        return `
          <div class="calculation-container" style="display: flex; flex-direction: column; gap: 10px;">
            ${q.formulaHint ? `
              <div style="font-size: 12.5px; color: var(--qsa-text-muted); font-style: italic;">
                Formula: ${q.formulaHint}
              </div>` : ''}
            <div style="display: flex; align-items: center; gap: 10px;">
              <input type="number" inputmode="decimal" step="any" class="fill-blank-input" id="calc-input" placeholder="e.g. 384" style="max-width: 200px; padding: 10px 14px; border: 1.5px solid var(--qsa-border); border-radius: 8px; font-size: 16px; font-weight: 700;">
              ${q.unit ? `<span style="font-weight: 600; font-size: 14px; color: var(--qsa-text-muted);">${q.unit}</span>` : ''}
            </div>
          </div>`;

      default:
        return `
          <div class="options-list">
            ${(q.options || []).map((opt, idx) => `
              <div class="option-item" data-opt-idx="${idx}">
                <div class="option-radio"></div>
                <div>${opt}</div>
              </div>`).join('')}
          </div>`;
    }
  }

  _attachEventListeners(q) {
    const interactionArea = this.container.querySelector('#q-interaction-area');
    const submitBtn = this.container.querySelector('#q-submit-btn');
    const hintBtn = this.container.querySelector('#q-hint-btn');

    if (hintBtn && q.hint) {
      hintBtn.addEventListener('click', () => {
        alert('💡 Hint: ' + q.hint);
      });
    }

    if (q.type === 'single' || q.type === 'trueFalse') {
      const items = interactionArea.querySelectorAll('.option-item');
      items.forEach(it => {
        it.addEventListener('click', () => {
          items.forEach(i => i.classList.remove('selected'));
          it.classList.add('selected');
          this.answers[this.currentIndex] = parseInt(it.dataset.optIdx, 10);
        });
      });
    } else if (q.type === 'multi') {
      const items = interactionArea.querySelectorAll('.option-item');
      items.forEach(it => {
        it.addEventListener('click', () => {
          it.classList.toggle('selected');
          const selected = Array.from(items)
            .filter(i => i.classList.contains('selected'))
            .map(i => parseInt(i.dataset.optIdx, 10));
          this.answers[this.currentIndex] = selected;
        });
      });
    } else if (q.type === 'spotError') {
      const words = interactionArea.querySelectorAll('.spot-word');
      words.forEach(w => {
        w.addEventListener('click', () => {
          w.classList.toggle('selected');
          const sel = Array.from(words).filter(w => w.classList.contains('selected')).map(w => w.innerText);
          this.answers[this.currentIndex] = sel;
        });
      });
    } else if (q.type === 'match') {
      let activeKey = null;
      this.answers[this.currentIndex] = {}; // { keyIdx: valIdx }
      const keyBtns = interactionArea.querySelectorAll('.match-key');
      const valBtns = interactionArea.querySelectorAll('.match-val');
      const statusEl = interactionArea.querySelector('#match-status');

      keyBtns.forEach(kb => {
        kb.addEventListener('click', () => {
          keyBtns.forEach(b => b.style.borderColor = 'var(--qsa-border)');
          kb.style.borderColor = '#ff6b2c';
          activeKey = kb.dataset.keyIdx;
          if (statusEl) statusEl.textContent = 'Selected: ' + kb.textContent.trim() + '. Now tap matching definition.';
        });
      });

      valBtns.forEach(vb => {
        vb.addEventListener('click', () => {
          if (activeKey !== null) {
            this.answers[this.currentIndex][activeKey] = vb.dataset.valIdx;
            vb.style.background = '#fef3c7';
            vb.style.borderColor = '#d97706';
            const matchingKeyBtn = interactionArea.querySelector('.match-key[data-key-idx="' + activeKey + '"]');
            if (matchingKeyBtn) {
              matchingKeyBtn.style.background = '#fef3c7';
              matchingKeyBtn.style.borderColor = '#d97706';
            }
            if (statusEl) statusEl.textContent = 'Paired!';
            activeKey = null;
          }
        });
      });
    } else if (q.type === 'categorise') {
      this.answers[this.currentIndex] = {}; // { itemIdx: catId }
      let activeItemIdx = null;
      const chips = interactionArea.querySelectorAll('.cat-chip');
      const buckets = interactionArea.querySelectorAll('.cat-bucket');

      chips.forEach(ch => {
        ch.addEventListener('click', () => {
          chips.forEach(c => c.style.background = '#fff');
          ch.style.background = '#fed7aa';
          activeItemIdx = ch.dataset.itemIdx;
        });
      });

      buckets.forEach(bk => {
        bk.addEventListener('click', () => {
          if (activeItemIdx !== null) {
            const catId = bk.dataset.catId;
            this.answers[this.currentIndex][activeItemIdx] = catId;
            const targetChip = interactionArea.querySelector('.cat-chip[data-item-idx="' + activeItemIdx + '"]');
            if (targetChip) {
              targetChip.style.display = 'none';
              const bucketList = bk.querySelector('.bucket-contents');
              if (bucketList) {
                const badge = document.createElement('span');
                badge.style.cssText = 'padding: 4px 10px; background: #e0f2fe; color: #0369a1; border-radius: 999px; font-size: 12px; font-weight: 600;';
                badge.textContent = targetChip.textContent.trim();
                bucketList.appendChild(badge);
              }
            }
            activeItemIdx = null;
          }
        });
      });
    } else if (q.type === 'hotspot') {
      const hotspots = interactionArea.querySelectorAll('.hotspot-circle, .hotspot-btn');
      hotspots.forEach(hs => {
        hs.addEventListener('click', () => {
          const tid = hs.dataset.targetId;
          this.answers[this.currentIndex] = tid;
          interactionArea.querySelectorAll('.hotspot-btn').forEach(b => b.style.borderColor = 'var(--qsa-border)');
          const btn = interactionArea.querySelector('.hotspot-btn[data-target-id="' + tid + '"]');
          if (btn) btn.style.borderColor = '#ff6b2c';
        });
      });
    } else if (q.type === 'scenario') {
      const items = interactionArea.querySelectorAll('.option-item');
      items.forEach(it => {
        it.addEventListener('click', () => {
          items.forEach(i => i.classList.remove('selected'));
          it.classList.add('selected');
          this.answers[this.currentIndex] = parseInt(it.dataset.optIdx, 10);
        });
      });
    }

    submitBtn.addEventListener('click', () => {
      this._evaluateAnswer(q);
    });
  }

  _evaluateAnswer(q) {
    const feedbackArea = this.container.querySelector('#q-feedback-area');
    const submitBtn = this.container.querySelector('#q-submit-btn');

    if (submitBtn.innerText === 'Next Question ➔') {
      this.currentIndex++;
      this.render();
      return;
    }

    let isCorrect = false;

    if (q.type === 'single' || q.type === 'trueFalse') {
      const userAns = this.answers[this.currentIndex];
      isCorrect = (userAns === q.answer);
      const items = this.container.querySelectorAll('.option-item');
      items.forEach((it, idx) => {
        if (idx === q.answer) it.classList.add('correct');
        else if (idx === userAns) it.classList.add('incorrect');
      });
    } else if (q.type === 'multi') {
      const userAns = this.answers[this.currentIndex] || [];
      const correctAns = Array.isArray(q.answer) ? q.answer : [];
      isCorrect = userAns.length === correctAns.length && userAns.every(v => correctAns.includes(v));
      const items = this.container.querySelectorAll('.option-item');
      items.forEach((it, idx) => {
        if (correctAns.includes(idx)) it.classList.add('correct');
        else if (userAns.includes(idx)) it.classList.add('incorrect');
      });
    } else if (q.type === 'fillBlank') {
      const input = this.container.querySelector('#fill-input');
      const val = (input?.value || '').trim().toLowerCase();
      const accepted = (q.accepted || [q.answer]).map(a => String(a).toLowerCase());
      isCorrect = accepted.includes(val);
    } else if (q.type === 'match') {
      const userPairs = this.answers[this.currentIndex] || {};
      const pairs = q.pairs || [];
      let matches = 0;
      pairs.forEach((p, idx) => {
        if (String(userPairs[idx]) === String(idx)) matches++;
      });
      isCorrect = pairs.length > 0 && matches >= (pairs.length - 1);
    } else if (q.type === 'categorise') {
      const userCats = this.answers[this.currentIndex] || {};
      const items = q.items || [];
      let correctCount = 0;
      items.forEach((it, idx) => {
        if (userCats[idx] === it.categoryId) correctCount++;
      });
      isCorrect = items.length > 0 && correctCount === items.length;
    } else if (q.type === 'hotspot') {
      const selectedId = this.answers[this.currentIndex];
      const target = (q.targets || []).find(t => t.id === selectedId);
      isCorrect = Boolean(target && target.isCorrect);
    } else if (q.type === 'shortAnswer') {
      const rubricEl = this.container.querySelector('#short-answer-rubric');
      if (rubricEl && rubricEl.style.display === 'none') {
        rubricEl.style.display = 'block';
        submitBtn.innerText = 'Next Question ➔';
        const passBtn = this.container.querySelector('#self-eval-pass-btn');
        if (passBtn) {
          passBtn.addEventListener('click', () => {
            this.answers[this.currentIndex] = true;
            passBtn.style.background = '#15803d';
            passBtn.style.color = '#ffffff';
            passBtn.innerText = '✓ Verified';
          });
        }
        return; // pause to allow student self-assessment
      }
      isCorrect = Boolean(this.answers[this.currentIndex]);
    } else if (q.type === 'scenario') {
      const userIdx = this.answers[this.currentIndex];
      const opt = (q.options || [])[userIdx];
      isCorrect = Boolean(opt && opt.isCorrect);
    } else if (q.type === 'calculation') {
      const input = this.container.querySelector('#calc-input');
      const val = parseFloat(input?.value);
      const expected = parseFloat(q.expected);
      const tol = parseFloat(q.tolerance || 0.05);
      if (!isNaN(val) && !isNaN(expected)) {
        if (q.toleranceType === 'relative') {
          isCorrect = Math.abs(val - expected) <= Math.abs(expected * tol);
        } else {
          isCorrect = Math.abs(val - expected) <= tol;
        }
      } else {
        isCorrect = false;
      }
    } else {
      isCorrect = true;
    }

    if (isCorrect) {
      this.score++;
      feedbackArea.innerHTML = `
        <div class="question-feedback correct">
          <strong>✓ Correct!</strong>
          <p style="margin: 6px 0 0;">${q.explanation || 'Excellent understanding of the concept.'}</p>
        </div>`;
    } else {
      this.mistakes.push({ q: q.q, explanation: q.explanation });
      feedbackArea.innerHTML = `
        <div class="question-feedback incorrect">
          <strong>✕ Needs Review</strong>
          <p style="margin: 6px 0 0;">${q.explanation || 'Please review the core principles discussed in this section.'}</p>
        </div>`;
    }

    submitBtn.innerText = 'Next Question ➔';
  }

  renderResults() {
    const total = this.questions.length;
    const pct = Math.round((this.score / total) * 100);
    const passed = pct >= this.passThreshold;

    this.container.innerHTML = `
      <div class="quiz-container quiz-results-card">
        <span class="tag ${passed ? 'tag-green' : 'tag-orange'}">
          ${passed ? 'Passed Successfully' : 'Review Recommended'}
        </span>
        <div class="score-badge">${pct}%</div>
        <p style="font-size: 16px; color: var(--qsa-text-light-secondary); margin-bottom: 24px;">
          You scored <strong>${this.score} of ${total}</strong> questions correctly.
          ${passed ? 'You have successfully satisfied the mastery requirement for this module!' : `The pass mark is ${this.passThreshold}%. We recommend reviewing your mistakes and retrying.`}
        </p>

        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button type="button" class="btn btn-secondary btn-sm" id="quiz-retry-btn">🔄 Retry Assessment</button>
          <button type="button" class="btn btn-primary btn-sm" id="quiz-continue-btn">Continue Learning ➔</button>
        </div>
      </div>`;

    this.container.querySelector('#quiz-retry-btn').addEventListener('click', () => {
      this.currentIndex = 0;
      this.score = 0;
      this.answers = {};
      this.mistakes = [];
      this.questions = this._selectQuestions();
      this.render();
    });

    this.container.querySelector('#quiz-continue-btn').addEventListener('click', () => {
      this.onComplete({ score: pct, passed, mistakes: this.mistakes });
    });
  }
}
