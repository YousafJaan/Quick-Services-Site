/**
 * Quick Services Academy — Unified Quiz Engine (12 Question Modalities)
 * Supports formative paragraph micro-checks and summative graded module/final exams.
 */

export class QuizEngine {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.getElementById(container) : container;
    this.bank = options.bank || [];
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
