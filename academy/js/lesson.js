/**
 * Quick Services Academy — Interactive Lesson Player Engine
 * Supports Quick/Standard/Deep layers, Simple/Plain/Technical English variations,
 * INLINE visuals directly in the reading flow (no separate popup windows),
 * paragraph margin rails, sliding syllabus drawer, zero-404 curriculum synthesis,
 * confidence-rated self-checks, and WhatsApp assistant.
 */

import { store } from './store.js';
import { renderVisual, renderFallback } from './visuals/index.js';
import { QuizEngine } from './quiz/index.js';
import { renderWidget } from './widgets/index.js';
import { router } from './router.js';
import { synthesizeLesson } from './curriculum-synthesizer.js';
import { saveLessonNote, getLessonNotes, deleteLessonNote } from './storage/idb.js';
import { processImageFile } from './components/uploader.js';
import { openLightboxModal } from './app.js';

let activeDepth = 'standard';

export function showGlobalToast(message) {
  let toastEl = document.getElementById('qsa-global-toast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'qsa-global-toast';
    toastEl.style.cssText = 'position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(20px); background: #1c1917; color: #ffffff; padding: 10px 22px; border-radius: 999px; font-size: 13.5px; font-weight: 600; box-shadow: 0 4px 16px rgba(0,0,0,0.18); z-index: 9999; opacity: 0; pointer-events: none; transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1); display: flex; align-items: center; gap: 8px;';
    document.body.appendChild(toastEl);
  }
  toastEl.innerHTML = `<span style="color: #4ade80;">✓</span> <span>${message}</span>`;
  toastEl.style.opacity = '1';
  toastEl.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(window.__qsaToastTimer);
  window.__qsaToastTimer = setTimeout(() => {
    toastEl.style.opacity = '0';
    toastEl.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2200);
}
if (typeof window !== 'undefined') {
  window.showGlobalToast = showGlobalToast;
}

function getBaseDataPath() {
  const path = window.location.pathname;
  if (path.includes('/academy')) {
    const idx = path.indexOf('/academy');
    return path.substring(0, idx + '/academy'.length) + '/data';
  }
  return './data';
}

export async function loadLessonView(container, { courseId, lessonId }) {
  container.innerHTML = `
    <div class="wrap" style="padding-top: 60px; padding-bottom: 80px; text-align: center;">
      <div style="font-size: 22px; font-family: var(--qsa-font-serif); color: var(--qsa-accent-clay); margin-bottom: 12px;">Loading lesson...</div>
      <p style="color: var(--qsa-text-muted);">Fetching lesson curriculum, multi-register text, and semantic visuals.</p>
    </div>`;

  const baseData = getBaseDataPath();

  try {
    let course = null;
    let lesson = null;

    // 1. Fetch course manifest
    const courseRes = await fetch(`${baseData}/courses/${courseId}.json`);
    if (!courseRes.ok) {
      throw new Error(`Course manifest "${courseId}" not found.`);
    }
    course = await courseRes.json();

    // 2. Attempt to fetch specific authored lesson JSON
    try {
      const lessonRes = await fetch(`${baseData}/lessons/${courseId}/${lessonId}.json`);
      if (lessonRes.ok) {
        lesson = await lessonRes.json();
      }
    } catch (e) {
      // Dynamic fallback takes over
    }

    // 3. Fallback: Synthesize rich lesson content if not pre-authored on disk
    if (!lesson) {
      lesson = synthesizeLesson(course, lessonId);
    }

    renderLessonPlayer(container, course, lesson);
  } catch (err) {
    container.innerHTML = `
      <div class="wrap" style="padding-top: 60px; padding-bottom: 80px; text-align: center;">
        <h3 style="color: var(--qsa-status-danger);">Unable to load lesson</h3>
        <p style="color: var(--qsa-text-muted); margin-bottom: 24px;">${err.message}</p>
        <button class="btn btn-primary btn-sm" onclick="location.hash='#course-${courseId}'">Return to Course Overview</button>
      </div>`;
  }
}

function renderLessonPlayer(container, course, lesson) {
  lesson.course = course.id;
  store.setActiveLesson(course.id, lesson.id);
  activeDepth = 'standard';

  let allLessons = [];
  course.modules.forEach(m => {
    (m.lessons || []).forEach(l => allLessons.push(l));
  });

  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const currentLang = store.getEnglishLevel();
  const currentModule = course.modules.find(m => (m.lessons || []).some(l => l.id === lesson.id));

  container.innerHTML = `
    <div class="wrap" style="padding: 32px 20px 80px;">
      <!-- Breadcrumb Bar -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 24px;">
        <a href="#course-${course.id}" class="claude-breadcrumb-tag" style="text-decoration: none; margin-bottom: 0;">
          <span style="font-size: 15px;">←</span> <span>Academy / ${course.title}</span>
        </a>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button type="button" class="syllabus-pill-btn" id="open-syllabus-drawer-btn" title="Open course curriculum syllabus">
            <span>📑 Syllabus</span>
            <span class="syllabus-count">${currentIndex + 1} / ${allLessons.length}</span>
          </button>
          <span class="tag tag-clay">${(lesson.type || 'read').toUpperCase()}</span>
          <span class="lesson-time-pill">${lesson.minutes || 10} min</span>
        </div>
      </div>

      <!-- Two-Column Claude Academy Layout -->
      <div class="claude-lesson-layout">
        
        <!-- Left Main Column: Lesson Reading & Interactive Content -->
        <main class="claude-lesson-main">
          <div class="reader-canvas">
            
            <!-- Crisp Edge Header Card -->
            <header class="reader-header-card">
              <div class="reader-module-eyebrow">
                ${currentModule ? currentModule.title : 'Curriculum'}
              </div>
              <h1 class="reader-lesson-title">
                ${lesson.title}
              </h1>

              <!-- Controls: Reading English Style & Depth -->
              <div class="reader-controls-card">
                <!-- English Style Switcher -->
                <div class="reader-control-item">
                  <span class="control-label">English Style</span>
                  <div class="lang-level-switcher" id="reader-lang-switcher" title="Choose English explanation style">
                    <button type="button" class="lang-btn ${currentLang === 'simple' ? 'active' : ''}" data-lang="simple" title="Simple English for easy comprehension">Simple</button>
                    <button type="button" class="lang-btn ${currentLang === 'plain' ? 'active' : ''}" data-lang="plain" title="Plain academic English">Plain</button>
                    <button type="button" class="lang-btn ${currentLang === 'technical' ? 'active' : ''}" data-lang="technical" title="Advanced technical dissertation register">Tech</button>
                  </div>
                </div>

                <!-- Depth Controls (For Read Lessons) -->
                ${lesson.type === 'read' ? `
                  <div class="reader-control-item">
                    <span class="control-label">Depth</span>
                    <div class="depth-control">
                      <button class="depth-btn" data-depth="quick">Quick</button>
                      <button class="depth-btn active" data-depth="standard">Standard</button>
                      <button class="depth-btn" data-depth="deep">Deep</button>
                    </div>
                  </div>` : ''}
              </div>
            </header>

            <!-- Main Lesson Content Article Card -->
            <article class="reader-article-card" id="lesson-article-body">
              ${renderLessonBody(lesson, activeDepth, currentLang)}
            </article>

            <!-- Claude Academy Feedback Widget ("Was this helpful?") -->
            <div class="claude-helpful-widget" id="claude-helpful-widget">
              <div class="claude-helpful-title">Was this lesson helpful?</div>
              <div class="claude-helpful-actions">
                <button type="button" class="claude-helpful-btn" data-helpful="yes">
                  <span>👍</span> <span>Yes, clear &amp; practical</span>
                </button>
                <button type="button" class="claude-helpful-btn" data-helpful="no">
                  <span>👎</span> <span>Needs more explanation</span>
                </button>
              </div>
            </div>

            <!-- Interactive Lesson Notes & Figure Attachments -->
            <div class="claude-notes-panel" id="lesson-notes-panel">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
                <div>
                  <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--qsa-terracotta); letter-spacing: 0.6px;">
                    Empirical Workspace
                  </div>
                  <h3 style="margin: 2px 0 0; font-size: 18px; font-family: var(--qsa-font-serif); color: var(--qsa-primary-navy);">
                    My Lesson Notes &amp; Attached Work
                  </h3>
                </div>
                <span style="font-size: 12px; color: var(--qsa-text-muted);">Saved in offline storage</span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 10px;">
                <textarea id="lesson-note-text" class="claude-search-input" rows="2" placeholder="Record your methodology reflection or thesis notes for this lesson..." style="border-radius: 8px; resize: vertical;"></textarea>
                
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <input type="file" id="lesson-note-file-input" accept="image/png,image/jpeg,image/webp" style="display: none;">
                    <button type="button" class="btn btn-secondary btn-sm" id="lesson-note-attach-btn" style="font-size: 12px; padding: 5px 12px;">
                      <span>📎</span> <span id="lesson-note-attach-label">Attach Screenshot</span>
                    </button>
                    <span id="lesson-note-attached-indicator" style="display: none; font-size: 12px; color: var(--qsa-status-success); font-weight: 600;">✓ Attached</span>
                  </div>
                  <button type="button" class="claude-btn-dark btn-sm" id="lesson-note-save-btn">
                    Save Note
                  </button>
                </div>
              </div>

              <div class="claude-notes-list" id="lesson-notes-list-mount">
                <!-- Populated dynamically from IndexedDB -->
              </div>
            </div>

            <!-- Complete Action Banner -->
            <div style="background: var(--qsa-bg-card); border: 1px solid var(--qsa-border); border-radius: var(--qsa-radius-card); padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; box-shadow: var(--qsa-shadow-card); margin-top: 24px;">
              <div>
                <strong style="color: var(--qsa-primary-navy); font-size: 14.5px;">Finished this lesson?</strong>
                <p style="margin: 2px 0 0; font-size: 13px; color: var(--qsa-text-secondary);">Save progress towards your verifiable course credential.</p>
              </div>
              <button class="btn btn-primary btn-sm" id="mark-complete-btn">
                ${store.isLessonComplete(course.id, lesson.id) ? '✓ Completed' : 'Mark as Complete'}
              </button>
            </div>

            <!-- Claude Academy Split Previous / Next Navigation Cards -->
            <div class="claude-split-nav-cards">
              ${prevLesson ? `
                <a href="#lesson-${course.id}-${prevLesson.id}" class="claude-nav-card" title="Previous: ${prevLesson.title}">
                  <span class="claude-nav-card-dir">← Previous Lesson</span>
                  <h4 class="claude-nav-card-title">${prevLesson.title}</h4>
                </a>` : `
                <a href="#course-${course.id}" class="claude-nav-card" title="Course Overview">
                  <span class="claude-nav-card-dir">← Course Overview</span>
                  <h4 class="claude-nav-card-title">${course.title}</h4>
                </a>`}

              ${nextLesson ? `
                <a href="#lesson-${course.id}-${nextLesson.id}" class="claude-nav-card" style="text-align: right;" title="Next: ${nextLesson.title}">
                  <span class="claude-nav-card-dir">Next Lesson →</span>
                  <h4 class="claude-nav-card-title">${nextLesson.title}</h4>
                </a>` : `
                <a href="#course-${course.id}" class="claude-nav-card" style="text-align: right;" title="Course Completed">
                  <span class="claude-nav-card-dir">Track Completed 🏆</span>
                  <h4 class="claude-nav-card-title">View Certificate &amp; Review</h4>
                </a>`}
            </div>

          </div>
        </main>

        <!-- Right Column: Sticky Syllabus Sidebar (Claude Academy Style) -->
        <aside class="claude-sticky-syllabus" aria-label="Course Curriculum">
          <div class="claude-syllabus-head">
            <div class="claude-syllabus-dropdown-label">Lesson ${currentIndex + 1} of ${allLessons.length}</div>
            <div class="claude-syllabus-progress-count">${Math.round(((currentIndex + 1) / allLessons.length) * 100)}%</div>
          </div>
          
          <div style="font-weight: 700; font-size: 14.5px; color: var(--qsa-primary-navy); margin-bottom: 16px; font-family: var(--qsa-font-serif);">
            ${course.title}
          </div>

          <div class="claude-syllabus-scroll">
            ${course.modules.map((mod, modIdx) => `
              <div class="claude-syllabus-module-block">
                <div class="claude-syllabus-module-title">Module ${modIdx + 1}: ${mod.title}</div>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  ${(mod.lessons || []).map(l => {
                    const isDone = store.isLessonComplete(course.id, l.id);
                    const isCurrent = l.id === lesson.id;
                    return `
                      <a href="#lesson-${course.id}-${l.id}" class="claude-syllabus-link ${isCurrent ? 'active' : ''}">
                        <span style="font-size: 13px; color: ${isDone ? 'var(--qsa-status-success)' : isCurrent ? 'var(--qsa-terracotta)' : 'var(--qsa-text-muted)'}; font-weight: 800;">
                          ${isDone ? '✓' : isCurrent ? '●' : '○'}
                        </span>
                        <span style="flex: 1;">${l.title}</span>
                      </a>`;
                  }).join('')}
                </div>
              </div>`).join('')}
          </div>

          <!-- Claude Academy "On this page" In-Page TOC -->
          <div class="claude-toc-block">
            <div class="claude-toc-heading">On this page</div>
            <a href="#section-core-content" class="claude-toc-link">1. Core Lesson Analysis</a>
            <a href="#section-takeaways" class="claude-toc-link">2. Scholarly Takeaways</a>
            <a href="#section-ai-prompt" class="claude-toc-link">3. Research AI Prompt</a>
            <a href="#section-knowledge-check" class="claude-toc-link">4. Knowledge Check Quiz</a>
          </div>
        </aside>

      </div>
    </div>

    <!-- Slide-Over Syllabus Drawer -->
    <div class="syllabus-drawer-overlay" id="syllabus-drawer-overlay" style="display: none;">
      <div class="syllabus-drawer-backdrop" id="syllabus-drawer-backdrop"></div>
      <aside class="syllabus-drawer-panel" role="dialog" aria-modal="true" aria-label="Course Syllabus">
        <div class="syllabus-drawer-header">
          <div>
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--qsa-accent-clay); letter-spacing: 0.5px;">${course.title}</div>
            <h3 style="font-size: 18px; margin: 4px 0 0; color: var(--qsa-text-primary);">Course Syllabus</h3>
          </div>
          <button type="button" class="drawer-close-btn" id="close-syllabus-drawer-btn" aria-label="Close syllabus drawer">✕</button>
        </div>
        <div class="syllabus-drawer-content">
          ${course.modules.map((mod, modIdx) => `
            <div class="syllabus-drawer-module">
              <div class="syllabus-module-heading">Module ${modIdx + 1}: ${mod.title}</div>
              <div class="syllabus-module-lessons">
                ${(mod.lessons || []).map(l => {
                  const isDone = store.isLessonComplete(course.id, l.id);
                  const isCurrent = l.id === lesson.id;
                  return `
                    <a href="#lesson-${course.id}-${l.id}" class="syllabus-lesson-item ${isCurrent ? 'active' : ''}">
                      <span class="syllabus-status-dot ${isDone ? 'done' : ''}">${isDone ? '✓' : ''}</span>
                      <span class="syllabus-lesson-title">${l.title}</span>
                      <span class="syllabus-lesson-time">${l.minutes || 10}m</span>
                    </a>`;
                }).join('')}
              </div>
            </div>`).join('')}
        </div>
      </aside>
    </div>

    <!-- Floating Selection Toolbar Portal -->
    <div id="selection-toolbar-portal"></div>`;

  setupDepthControl(lesson);
  setupSentenceToolbar(lesson);
  setupInlineVisualListeners(lesson);
  setupParagraphRails(course.id, lesson);
  setupInteractiveWidgets(lesson);

  // Setup syllabus drawer
  const drawerOverlay = container.querySelector('#syllabus-drawer-overlay');
  const openDrawerBtn = container.querySelector('#open-syllabus-drawer-btn');
  const closeDrawerBtn = container.querySelector('#close-syllabus-drawer-btn');
  const backdrop = container.querySelector('#syllabus-drawer-backdrop');

  const openDrawer = () => {
    if (drawerOverlay) drawerOverlay.style.display = 'flex';
  };
  const closeDrawer = () => {
    if (drawerOverlay) drawerOverlay.style.display = 'none';
  };

  openDrawerBtn?.addEventListener('click', openDrawer);
  closeDrawerBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  drawerOverlay?.querySelectorAll('.syllabus-lesson-item').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  const readerLangSwitcher = container.querySelector('#reader-lang-switcher');
  if (readerLangSwitcher) {
    readerLangSwitcher.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const l = btn.dataset.lang;
        if (l) {
          store.setEnglishLevel(l);
          showGlobalToast(`Reading register set to ${l.toUpperCase()}`);
        }
      });
    });
  }

  // Live listener for English style changes
  const handleLangChange = () => {
    const newLang = store.getEnglishLevel();
    const articleBody = document.getElementById('lesson-article-body');
    if (articleBody) {
      // Check if any drawer was open before re-rendering
      let openBlockId = null;
      let openTab = 'visual';
      let activeSentenceId = null;

      articleBody.querySelectorAll('.inline-visual-drawer').forEach(d => {
        if (d.style.display === 'block') {
          openBlockId = d.id.replace('inline-drawer-', '');
          openTab = d.querySelector('.inline-tab-btn.active')?.dataset.tab || 'visual';
        }
      });

      const activeSpan = articleBody.querySelector('.p-sentence.active-sentence');
      activeSentenceId = activeSpan?.dataset.sId;

      articleBody.innerHTML = renderLessonBody(lesson, activeDepth, newLang);
      setupParagraphRails(course.id, lesson);
      setupInlineVisualListeners(lesson);
      setupInteractiveWidgets(lesson);
      setupClaudePromptListeners(articleBody);
      setupClaudeKnowledgeCheckListeners(articleBody, course.id, lesson.id);

      // Restore previously open drawer with updated register content
      if (openBlockId) {
        const restoredDrawer = document.getElementById(`inline-drawer-${openBlockId}`);
        const restoredBody = document.getElementById(`inline-body-${openBlockId}`);
        if (restoredDrawer && restoredBody) {
          const targetBlock = (lesson.content?.blocks || []).find(b => b.id === openBlockId);
          let targetSentence = null;
          if (activeSentenceId && targetBlock?.sentences) {
            targetSentence = targetBlock.sentences.find(s => s.id === activeSentenceId);
          }
          if (!targetSentence && targetBlock?.sentences?.length) {
            targetSentence = targetBlock.sentences[0];
          }
          if (activeSentenceId) {
            const span = document.querySelector(`.p-sentence[data-s-id="${activeSentenceId}"]`);
            if (span) span.classList.add('active-sentence');
          }
          renderInlineDrawerContent(restoredDrawer, restoredBody, targetSentence, targetBlock, openTab);
          restoredDrawer.style.display = 'block';
        }
      }
    }
    const switcher = document.getElementById('reader-lang-switcher');
    if (switcher) {
      switcher.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === newLang);
      });
    }
  };

  if (window.__qsaLessonLangHandler) {
    window.removeEventListener('qsa:english-level-changed', window.__qsaLessonLangHandler);
  }
  window.__qsaLessonLangHandler = handleLangChange;
  window.addEventListener('qsa:english-level-changed', window.__qsaLessonLangHandler);

  const completeBtn = container.querySelector('#mark-complete-btn');
  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      store.markLessonComplete(course.id, lesson.id);
      completeBtn.innerText = '✓ Completed';
      completeBtn.classList.remove('btn-primary');
      completeBtn.classList.add('btn-secondary');
      showGlobalToast('Lesson marked complete!');
    });
  }

  // Claude Academy "Was this helpful?" feedback handler
  const helpfulWidget = container.querySelector('#claude-helpful-widget');
  if (helpfulWidget) {
    helpfulWidget.querySelectorAll('.claude-helpful-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-helpful');
        helpfulWidget.innerHTML = `
          <div style="color: var(--qsa-status-success); font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 6px 0;">
            <span style="font-size: 18px;">✓</span> <span>Thank you for your feedback! Your evaluation helps refine this academic curriculum.</span>
          </div>`;
        try {
          localStorage.setItem(`qsa_helpful_${course.id}_${lesson.id}`, val);
        } catch (e) {}
      });
    });
  }

  // Setup Claude Academy Reverse-Engineered Features
  setupClaudePromptListeners(container);
  setupClaudeKnowledgeCheckListeners(container, course.id, lesson.id);
  setupLessonNotes(container, course.id, lesson.id);

  // Setup Smooth Scrolling for "On this page" TOC
  container.querySelectorAll('.claude-toc-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = container.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/* ==========================================================================
   Claude Academy Extended Reverse-Engineered Features
   ========================================================================== */

function getLessonPromptTemplate(courseId, lessonTitle) {
  switch (courseId) {
    case 'thesis101':
      return {
        label: 'Academic AI Prompt: Topic Narrowing & Scoping',
        prompt: `Act as a senior doctoral research supervisor adhering to HEC Pakistan postgraduate standards.

Context: I am working on my postgraduate thesis topic regarding [Insert Broad Area, e.g., Employee Retention in Fintech].
Task: Apply the FINER framework (Feasible, Interesting, Novel, Ethical, Relevant) to narrow this domain into three defensible, empirical problem statements.
Constraints:
1. Formulate 1 independent variable, 1 dependent variable, and 1 mediating mechanism.
2. Avoid vague nominalizations ("overall impact", "various factors").
3. Ensure the scope is bounded to a measurable empirical population.

Output Format: Present as a structured Markdown table followed by 3 research questions.`,
        expected: `Expected Output Structure:
• Bounded Variable Matrix: Explicit Independent Variable, Mediator, Dependent Variable.
• Empirical Problem Formulation: Grounded in recent literature (2022–2026).
• 3 Formulated Research Questions: Ready for proposal defense.`
      };

    case 'cite101':
      return {
        label: 'Academic AI Prompt: APA 7th Citation Audit',
        prompt: `Act as a scholarly journal peer reviewer for an SSCI-indexed journal.

Task: Audit the following in-text academic citations and reference list entries against APA 7th edition specifications:
[Insert Citation Snippet]

Checklist:
1. Verify parenthetical vs. narrative citation mechanics for 3+ authors (use of "et al." from first mention).
2. Ensure DOI formatting adheres to "https://doi.org/10.xxxx/...".
3. Check italicization of book titles and journal volume numbers.
4. Flag any missing publication years, retrieved dates, or incorrect ampersand usage.`,
        expected: `Expected Output Structure:
• Diagnostic of Citation Errors: Flagged et al. usage, misplaced punctuation.
• Corrected In-Text Citations: Both narrative and parenthetical models.
• Formatted Reference Entry: Standardized HTTPS DOI resolver.`
      };

    case 'integrity101':
      return {
        label: 'Academic AI Prompt: Turnitin Similarity Diagnosis',
        prompt: `Act as a university academic integrity officer.

Context: I have received a similarity report with a 24% similarity index on my literature review chapter.
Task: Analyze the following flagged passage:
"[Insert Flagged Paragraph]"

Instructions:
1. Identify whether the overlap is due to verbatim strings, generic discipline phrasing, or uncredited conceptual borrowing.
2. Rewrite the passage using active agent-action syntax and contextual bounding without altering empirical meaning.
3. Integrate proper attribution to the original author ([Author, Year]).`,
        expected: `Expected Output Structure:
• Overlap Diagnosis: Clustered passive phrasing vs. substantive conceptual match.
• Restructured scholarly passage: Zero verbatim plagiarism while preserving empirical meaning.
• Attributed citation link.`
      };

    case 'sample-size':
      return {
        label: 'Academic AI Prompt: G*Power Protocol & Justification',
        prompt: `Act as an empirical quantitative statistician.

Context: I am planning a multiple linear regression with 5 continuous predictors for a postgraduate study.
Task: Calculate the minimum required sample size using G*Power 3.1 parameters:
- Effect size f²: 0.15 (medium)
- Alpha error probability (α): 0.05
- Statistical power (1 - β): 0.80 (HEC benchmark)
- Number of predictors: 5

Output:
1. Provide the exact required sample size N.
2. Write a defensible 3-sentence methodological justification paragraph citing Faul et al. (2009) and Cohen (1988) for my thesis Chapter 3.`,
        expected: `Expected Output Structure:
• Calculated Sample Size: N = 92 (plus 15% attrition buffer = 108).
• Methodological Defense Paragraph: Citing Faul et al. (2009) & Cohen (1988).`
      };

    case 'spss101':
      return {
        label: 'Academic AI Prompt: SPSS Syntax & Assumption Testing',
        prompt: `Act as an SPSS statistical data consultant.

Task: Provide the complete SPSS syntax to screen a survey dataset (N = 250) prior to conducting an independent samples t-test and multiple regression.
Assumptions to verify:
1. Normality: Skewness and Kurtosis within [-1.5, +1.5] and Shapiro-Wilk test.
2. Homogeneity of Variance: Levene's Test.
3. Multicollinearity: Variance Inflation Factor (VIF < 5.0) and Tolerance (> 0.20).
4. Outliers: Mahalanobis distance at p < .001.`,
        expected: `Expected Output Structure:
• Production SPSS Syntax: EXAMINE, REGRESSION /COLLIN, and RESIDUALS commands.
• Interpretation Thresholds: Specific cutoff values for dissertation defense.`
      };

    case 'smartpls':
      return {
        label: 'Academic AI Prompt: SmartPLS 4 PLS-SEM Reporting Protocol',
        prompt: `Act as a PLS-SEM expert following Hair, Hult, Ringle, and Sarstedt (2022).

Task: Provide the step-by-step reporting protocol for evaluating a reflective measurement model and structural model in SmartPLS 4:
1. Indicator reliability: Outer loadings cutoff (λ ≥ 0.708).
2. Internal consistency: Composite Reliability (CR) and Cronbach's Alpha (0.70 - 0.90).
3. Convergent validity: Average Variance Extracted (AVE ≥ 0.50).
4. Discriminant validity: HTMT ratio (< 0.85).
5. Structural model: R², f² effect sizes, and 5,000 bootstrap subsamples for path significance (p < .05).`,
        expected: `Expected Output Structure:
• Stage 1 Measurement Assessment Table.
• Stage 2 HTMT Discriminant Validity Matrix.
• Stage 3 Structural Hypothesis Testing Results (β, t, p, CI).`
      };

    default:
      return {
        label: 'Academic AI Prompt: Scholarly Synthesis & Defense Prep',
        prompt: `Act as an academic dissertation examiner.

Context: I am defending my research methodology for "${lessonTitle}".
Task: Ask me three rigorous defense questions that examine:
1. The epistemological justification of my research design.
2. Potential threats to internal and external validity.
3. Practical implications of the empirical findings.

Provide evaluation criteria for what constitutes a high-distinction response.`,
        expected: `Expected Output Structure:
• 3 High-Stakes Examiner Questions targeting validity, sampling, and bias.
• Marking Rubric: Distinction vs. Revision criteria.`
      };
  }
}

function getLessonKnowledgeCheck(courseId, lessonTitle) {
  switch (courseId) {
    case 'thesis101':
      return {
        question: 'Under HEC Pakistan dissertation guidelines and the FINER framework, what primary characteristic separates a defensible research problem from a generic topic?',
        options: [
          'It includes a broad descriptive survey of general industry perceptions without bounded variables.',
          'It articulates an empirical knowledge gap with clearly defined independent and dependent variables in a bounded population.',
          'It is at least 40 words long and avoids active verbs to sound more academic.'
        ],
        correctIndex: 1,
        explanation: 'A defensible academic problem statement must identify an explicit empirical knowledge gap with operationalized variables in a bounded, accessible population rather than making broad, unmeasurable claims.'
      };

    case 'cite101':
      return {
        question: 'In APA 7th edition, when citing a peer-reviewed source with three or more authors in-text, how should the citation be formatted on first mention?',
        options: [
          'List all author surnames on first mention, then use "et al." in subsequent citations.',
          'Always use the first author\'s surname followed by "et al." and the year, even on the very first citation.',
          'List all authors followed by the journal title and retrieval URL in parentheses.'
        ],
        correctIndex: 1,
        explanation: 'APA 7th simplified in-text citations: for any work with three or more authors, you cite only the first author followed by "et al." and the year from the very first mention (e.g., Hair et al., 2021).'
      };

    case 'integrity101':
      return {
        question: 'When analyzing a Turnitin similarity report, what constitutes legitimate academic attribution rather than plagiarism?',
        options: [
          'Paraphrasing an author\'s unique theoretical model without citation if less than 5 words match.',
          'Directly quoting text inside quotation marks with page numbers, or synthesizing findings with proper parenthetical citation.',
          'Changing every third word with synonyms using automated paraphrasing software.'
        ],
        correctIndex: 1,
        explanation: 'Legitimate scholarship requires accurate attribution: direct quotes must be enclosed in quotation marks with exact page numbers, and paraphrased concepts must acknowledge the intellectual source via citation regardless of low word-overlap percentages.'
      };

    case 'sample-size':
      return {
        question: 'In G*Power power analysis for postgraduate dissertations, what is the standard recommended statistical power (1 - β) to guard against Type II errors?',
        options: [
          '0.50 (50% probability)',
          '0.80 (80% probability)',
          '0.999 (99.9% probability)'
        ],
        correctIndex: 1,
        explanation: 'Cohen (1988) and HEC guidelines establish statistical power of 0.80 (80%) as the international scientific standard, meaning there is an 80% probability of detecting a real effect if one exists.'
      };

    case 'smartpls':
      return {
        question: 'In PLS-SEM evaluation (Hair et al., 2022), what is the threshold for establishing discriminant validity using the HTMT ratio?',
        options: [
          'HTMT value must be greater than 1.00.',
          'HTMT value must be strictly below 0.85 (conservative) or 0.90 (liberal).',
          'HTMT value is irrelevant if R-squared is greater than 0.50.'
        ],
        correctIndex: 1,
        explanation: 'The Heterotrait-Monotrait (HTMT) ratio must be below 0.85 (or 0.90 for conceptually similar constructs) to prove that the two latent constructs are empirically distinct from each other.'
      };

    default:
      return {
        question: `What is the most critical scholarly requirement when applying the concepts from "${lessonTitle}" to an empirical dissertation?`,
        options: [
          'Ensuring all analytical decisions and operational definitions are supported by peer-reviewed methodological literature.',
          'Minimizing methodological description so the supervisor can read the thesis faster.',
          'Relying solely on informal internet blog posts without academic citations.'
        ],
        correctIndex: 0,
        explanation: 'Graduate-level research rigor requires that every choice of variable, sample size formula, analytical test, and citation standard is anchored in peer-reviewed methodological authority.'
      };
  }
}

function renderClaudePromptCard(courseId, lessonTitle) {
  const p = getLessonPromptTemplate(courseId, lessonTitle);
  return `
    <div class="claude-prompt-card" id="section-ai-prompt">
      <div class="claude-prompt-header">
        <div class="claude-prompt-label">
          <span>🤖</span> <span>${p.label}</span>
        </div>
        <button type="button" class="claude-prompt-copy-btn" id="claude-copy-prompt-btn" title="Copy prompt template to clipboard">
          <span>📋</span> <span>Copy Prompt</span>
        </button>
      </div>
      <div class="claude-prompt-content" id="claude-prompt-text">${p.prompt}</div>
      <div class="claude-prompt-output-preview">
        <div style="font-size: 11.5px; font-weight: 800; text-transform: uppercase; color: var(--qsa-text-muted); margin-bottom: 6px;">
          Expected Scholarly AI Output:
        </div>
        <div style="font-family: var(--qsa-font-sans); line-height: 1.5; white-space: pre-wrap;">${p.expected}</div>
      </div>
    </div>`;
}

function renderClaudeKnowledgeCheck(courseId, lessonTitle) {
  const q = getLessonKnowledgeCheck(courseId, lessonTitle);
  return `
    <div class="claude-kc-card" id="section-knowledge-check">
      <div class="claude-kc-eyebrow">
        <span>📝</span> <span>Knowledge Check • Interactive Assessment</span>
      </div>
      <h3 class="claude-kc-title">Check Your Understanding</h3>
      <div class="claude-kc-question-text">${q.question}</div>
      <div class="claude-kc-options-list" id="claude-kc-options" data-correct="${q.correctIndex}">
        ${q.options.map((opt, idx) => `
          <div class="claude-kc-option" data-idx="${idx}">
            <div class="claude-kc-radio"></div>
            <div style="flex: 1;">${opt}</div>
          </div>
        `).join('')}
      </div>
      <button type="button" class="claude-btn-dark btn-sm" id="claude-kc-submit-btn" disabled style="opacity: 0.5; cursor: not-allowed;">
        Check Answer
      </button>
      <div class="claude-kc-feedback" id="claude-kc-feedback" data-explanation="${escapeQuotes(q.explanation)}"></div>
    </div>`;
}

function setupClaudePromptListeners(container) {
  const copyBtn = container.querySelector('#claude-copy-prompt-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const promptText = container.querySelector('#claude-prompt-text')?.innerText || '';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(promptText).then(() => {
          copyBtn.innerHTML = `<span>✓</span> <span>Copied!</span>`;
          showGlobalToast('Research AI prompt copied to clipboard!');
          setTimeout(() => {
            copyBtn.innerHTML = `<span>📋</span> <span>Copy Prompt</span>`;
          }, 2200);
        });
      }
    });
  }
}

function setupClaudeKnowledgeCheckListeners(container, courseId, lessonId) {
  const optionsWrap = container.querySelector('#claude-kc-options');
  const submitBtn = container.querySelector('#claude-kc-submit-btn');
  const feedbackEl = container.querySelector('#claude-kc-feedback');
  if (!optionsWrap || !submitBtn || !feedbackEl) return;

  let selectedIdx = null;
  const correctIdx = parseInt(optionsWrap.dataset.correct, 10);
  const explanation = feedbackEl.dataset.explanation || '';

  optionsWrap.querySelectorAll('.claude-kc-option').forEach(opt => {
    opt.addEventListener('click', () => {
      optionsWrap.querySelectorAll('.claude-kc-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedIdx = parseInt(opt.dataset.idx, 10);
      submitBtn.removeAttribute('disabled');
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'pointer';
    });
  });

  submitBtn.addEventListener('click', () => {
    if (selectedIdx === null) return;
    const isCorrect = selectedIdx === correctIdx;
    feedbackEl.className = `claude-kc-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedbackEl.innerHTML = `
      <div style="font-weight: 700; margin-bottom: 4px;">
        ${isCorrect ? '✓ Correct! Excellent scholarly analysis.' : '✕ Incorrect. Review the methodological reasoning below:'}
      </div>
      <div>${explanation}</div>`;
    submitBtn.innerText = 'Answer Checked';
    submitBtn.setAttribute('disabled', 'true');
    submitBtn.style.opacity = '0.6';
    submitBtn.style.cursor = 'default';
  });
}

async function setupLessonNotes(container, courseId, lessonId) {
  const mount = container.querySelector('#lesson-notes-list-mount');
  const input = container.querySelector('#lesson-note-text');
  const fileInput = container.querySelector('#lesson-note-file-input');
  const attachBtn = container.querySelector('#lesson-note-attach-btn');
  const attachLabel = container.querySelector('#lesson-note-attach-label');
  const attachedIndicator = container.querySelector('#lesson-note-attached-indicator');
  const saveBtn = container.querySelector('#lesson-note-save-btn');

  if (!mount || !input || !saveBtn) return;

  let attachedImageData = null;

  const renderNotesList = async () => {
    const notes = await getLessonNotes(courseId, lessonId);
    if (!notes.length) {
      mount.innerHTML = `
        <div style="font-size: 13px; color: var(--qsa-text-muted); font-style: italic; padding: 6px 0;">
          No personal notes or screenshots attached to this lesson yet.
        </div>`;
      return;
    }

    mount.innerHTML = notes.map(n => `
      <div class="claude-note-item" data-note-id="${n.id}">
        ${n.dataUrl ? `
          <img src="${n.dataUrl}" alt="Attached screenshot" class="claude-note-thumb" data-full-img="${n.dataUrl}">
        ` : ''}
        <div style="flex: 1;">
          <p style="margin: 0 0 4px; font-size: 14px; color: var(--qsa-text-primary); line-height: 1.5; white-space: pre-wrap;">${n.text}</p>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; color: var(--qsa-text-muted); margin-top: 6px;">
            <span>${new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ${new Date(n.createdAt).toLocaleDateString()}</span>
            <button type="button" class="btn btn-secondary btn-sm delete-note-btn" data-note-id="${n.id}" style="padding: 1px 6px; font-size: 11px; color: #dc2626;">Delete</button>
          </div>
        </div>
      </div>
    `).join('');

    mount.querySelectorAll('.delete-note-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.noteId;
        await deleteLessonNote(id);
        showGlobalToast('Note deleted');
        renderNotesList();
      });
    });

    mount.querySelectorAll('.claude-note-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const url = thumb.dataset.fullImg;
        if (url && openLightboxModal) {
          openLightboxModal(url, 'Attached Lesson Screenshot');
        }
      });
    });
  };

  await renderNotesList();

  attachBtn?.addEventListener('click', () => {
    fileInput?.click();
  });

  fileInput?.addEventListener('change', async (e) => {
    const files = e.target.files;
    if (files && files.length) {
      try {
        attachLabel.innerText = 'Compressing...';
        const res = await processImageFile(files[0], { maxWidth: 900, maxHeight: 900 });
        attachedImageData = res.dataUrl;
        attachLabel.innerText = 'Image Attached';
        attachedIndicator.style.display = 'inline';
        showGlobalToast('Screenshot ready to attach');
      } catch (err) {
        attachLabel.innerText = 'Attach Screenshot';
        attachedIndicator.style.display = 'none';
        showGlobalToast(err.message);
      }
    }
  });

  saveBtn.addEventListener('click', async () => {
    const text = input.value.trim();
    if (!text && !attachedImageData) {
      showGlobalToast('Please enter note text or attach a screenshot');
      return;
    }

    saveBtn.innerText = 'Saving...';
    saveBtn.setAttribute('disabled', 'true');

    await saveLessonNote({
      courseId,
      lessonId,
      text: text || 'Attached research screenshot',
      dataUrl: attachedImageData
    });

    input.value = '';
    attachedImageData = null;
    if (fileInput) fileInput.value = '';
    if (attachLabel) attachLabel.innerText = 'Attach Screenshot';
    if (attachedIndicator) attachedIndicator.style.display = 'none';
    saveBtn.innerText = 'Save Note';
    saveBtn.removeAttribute('disabled');

    showGlobalToast('Scholarly note saved');
    await renderNotesList();
  });
}

function getSentenceText(s, level) {
  if (level === 'simple' && s.simple) return s.simple;
  if (level === 'technical' && s.technical) return s.technical;
  if (level === 'plain' && s.plain) return s.plain;
  return s.text || s.plain || s.simple || s.technical || '';
}

function renderLessonBody(lesson, depth = 'standard', lang = 'plain') {
  const c = lesson.content || lesson.c || {};
  const courseId = lesson.course || (typeof window !== 'undefined' && window.location.hash ? window.location.hash.split('-')[1] : 'thesis101') || 'thesis101';

  if (lesson.type === 'video') {
    let videoHtml = `
      <div style="background: #ffffff; box-shadow: inset 0 0 0 1px var(--qsa-border-card); border-radius: 16px; padding: 32px; text-align: center; color: var(--qsa-text-primary); margin-bottom: 24px;">
        <span class="tag tag-clay" style="margin-bottom: 12px;">Video Masterclass • ${c.len || '8 min'}</span>
        <h3 style="margin: 12px 0; font-size: 22px;">${lesson.title}</h3>
        <p style="color: var(--qsa-text-muted); max-width: 500px; margin: 0 auto 24px; font-size: 14px;">
          Session Reference: <code>${c.vid || 'V-ACADEMY'}</code>. Prepared for graduate researchers.
        </p>
        ${c.url ? `
          <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px;">
            <iframe src="${c.url}" style="position: absolute; top:0; left: 0; width: 100%; height: 100%; border:0;" allowfullscreen></iframe>
          </div>` : `
          <div style="background: var(--qsa-bg-subtle); border: 1.5px dashed var(--qsa-accent-clay); border-radius: 12px; padding: 32px;">
            <div style="font-size: 36px; margin-bottom: 8px;">🎬</div>
            <strong style="color: var(--qsa-accent-clay);">Video Recording in Production</strong>
            <p style="font-size: 13.5px; color: var(--qsa-text-secondary); margin-top: 6px;">
              Read the full spoken transcript and key learning points below.
            </p>
          </div>`}
      </div>

      <div id="section-core-content">
        <h4 style="margin: 28px 0 12px; font-family: var(--qsa-font-serif); font-size: 20px;">Spoken Transcript</h4>
        ${(c.transcript || c.p || []).map(p => `<p style="font-size: 16px; line-height: 1.7; color: var(--qsa-text-secondary);">${p}</p>`).join('')}
      </div>

      <div class="claude-callout claude-callout-tip" id="section-takeaways">
        <div class="claude-callout-icon">💡</div>
        <div class="claude-callout-content">
          <strong>Core Scholarly Takeaways:</strong>
          <ul style="margin: 6px 0 0; padding-left: 18px; font-size: 14px; line-height: 1.6;">
            ${(c.key || []).map(k => `<li>${k}</li>`).join('')}
          </ul>
        </div>
      </div>`;

    videoHtml += renderClaudePromptCard(courseId, lesson.title);
    videoHtml += renderClaudeKnowledgeCheck(courseId, lesson.title);
    return videoHtml;
  }

  if (lesson.type === 'visual') {
    let visHtml = `
      <div id="section-core-content" style="margin-bottom: 24px;">
        <p style="font-size: 16.5px; line-height: 1.6; color: var(--qsa-text-primary);">${c.intro || ''}</p>
      </div>
      <div id="interactive-widget-mount"></div>
      <div class="claude-callout claude-callout-tip" id="section-takeaways">
        <div class="claude-callout-icon">💡</div>
        <div class="claude-callout-content">
          <strong>Core Scholarly Takeaways:</strong>
          <ul style="margin: 6px 0 0; padding-left: 18px; font-size: 14px; line-height: 1.6;">
            ${(c.key || []).map(k => `<li>${k}</li>`).join('')}
          </ul>
        </div>
      </div>`;

    visHtml += renderClaudePromptCard(courseId, lesson.title);
    visHtml += renderClaudeKnowledgeCheck(courseId, lesson.title);
    return visHtml;
  }

  if (lesson.type === 'quiz') {
    return `<div id="interactive-quiz-mount"></div>`;
  }

  // Reading Lesson: Quick Mode
  if (depth === 'quick') {
    let quickHtml = `
      <div id="section-core-content" style="background: var(--qsa-terracotta-soft); border: 1.5px solid var(--qsa-hl-clay); border-radius: 16px; padding: 24px; margin-bottom: 28px;">
        <span class="tag tag-clay" style="margin-bottom: 10px;">Quick Executive Summary</span>
        <p style="font-size: 17.5px; line-height: 1.7; color: var(--qsa-text-primary); font-weight: 500;">
          ${c.quick || ''}
        </p>
      </div>
      <div class="claude-callout claude-callout-tip" id="section-takeaways">
        <div class="claude-callout-icon">💡</div>
        <div class="claude-callout-content">
          <strong>Core Scholarly Takeaways:</strong>
          <ul style="margin: 6px 0 0; padding-left: 18px; font-size: 14px; line-height: 1.6;">
            ${(c.key || []).map(k => `<li>${k}</li>`).join('')}
          </ul>
        </div>
      </div>`;

    quickHtml += renderClaudePromptCard(courseId, lesson.title);
    quickHtml += renderClaudeKnowledgeCheck(courseId, lesson.title);
    return quickHtml;
  }

  let html = '<div id="section-core-content">';
  const blocks = c.blocks || [];

  blocks.forEach(b => {
    html += `
      <div class="p-block" id="block-${b.id}" data-p-id="${b.id}">
        <p class="p-text">
          ${(b.sentences || []).map(s => {
            const sentenceText = getSentenceText(s, lang);
            return `
              <span class="p-sentence" data-s-id="${s.id}" data-b-id="${b.id}" data-s-text="${escapeQuotes(sentenceText)}">${sentenceText}</span>
            `;
          }).join(' ')}
        </p>

        <!-- Paragraph Margin Rail Tools -->
        <div class="paragraph-rail-actions">
          <button type="button" class="rail-btn rail-vis-btn" data-p-id="${b.id}" title="View visual model inline">📊 Visualise</button>
          <button type="button" class="rail-btn rail-explain-btn" data-p-id="${b.id}" data-explain="${escapeQuotes(b.explain || '')}" title="Simple breakdown">💡 Explain Simply</button>
          <button type="button" class="rail-btn rail-check-btn" data-p-id="${b.id}" title="Test understanding">🎯 Check Yourself</button>
          <button type="button" class="rail-btn rail-ask-btn" data-p-id="${b.id}" title="Ask M. Yousaf">💬 Ask on WhatsApp</button>
        </div>

        <!-- Inline Visual & Style Drawer (Rendered RIGHT HERE INLINE, NOT A SEPARATE WINDOW) -->
        <div class="inline-visual-drawer" id="inline-drawer-${b.id}" style="display: none;">
          <div class="inline-drawer-pointer"></div>
          <div class="inline-drawer-header">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="tag tag-clay" style="font-size: 11px;">INLINE VISUAL &amp; REGISTER ARCHITECTURE</span>
            </div>
            <div class="inline-drawer-tabs">
              <button type="button" class="inline-tab-btn active" data-tab="visual" data-b-id="${b.id}">📊 Visual Diagram</button>
              <button type="button" class="inline-tab-btn" data-tab="compare" data-b-id="${b.id}">⚖️ Style Comparison</button>
              <button type="button" class="inline-close-btn" data-b-id="${b.id}" title="Close visual drawer">&times;</button>
            </div>
          </div>
          <div class="inline-drawer-body" id="inline-body-${b.id}">
            <!-- Content populated dynamically -->
          </div>
        </div>

        <!-- Hidden Explainer Card -->
        <div class="explain-card" id="explain-${b.id}" style="display: none; background: var(--qsa-status-info-bg); border-left: 3.5px solid var(--qsa-status-info); padding: 16px; border-radius: 10px; margin: 12px 0; font-size: 14px; color: var(--qsa-text-primary);">
          <strong>💡 ${lang === 'technical' ? 'Technical Academic Formulation' : lang === 'simple' ? 'Simple English Breakdown' : 'Plain English Explanation'}:</strong>
          <p style="margin: 6px 0 0; color: var(--qsa-text-secondary);">${b.explain || ''}</p>
        </div>

        <!-- Self-Check Micro-Quiz Mount -->
        <div class="self-check-container" id="self-check-${b.id}" style="display: none;"></div>
      </div>`;
  });

  html += '</div>'; // End section-core-content

  if (depth === 'deep' && Array.isArray(c.deep)) {
    c.deep.forEach(d => {
      html += `
        <div style="background: #ffffff; box-shadow: inset 0 0 0 1px var(--qsa-border-card); border-left: 4px solid var(--qsa-accent-clay); border-radius: 16px; padding: 24px; margin: 32px 0;">
          <h4 style="color: var(--qsa-accent-clay-dark); margin-bottom: 12px; font-family: var(--qsa-font-serif); font-size: 20px;">${d.title}</h4>
          ${(d.blocks || []).map(db => `
            <p style="font-size: 15.5px; line-height: 1.7; color: var(--qsa-text-secondary);">
              ${(db.sentences || []).map(ds => {
                const sText = getSentenceText(ds, lang);
                return `<span>${sText}</span>`;
              }).join(' ')}
            </p>
            ${db.visual ? renderVisual(db.visual) : ''}
          `).join('')}
        </div>`;
    });
  }

  if (Array.isArray(c.mistakes) && c.mistakes.length > 0) {
    html += `
      <div class="claude-callout claude-callout-important">
        <div class="claude-callout-icon">⚠️</div>
        <div class="claude-callout-content">
          <strong>Methodological Traps &amp; Common Errors:</strong>
          <ul style="margin: 6px 0 0; padding-left: 18px; font-size: 14px; line-height: 1.6;">
            ${c.mistakes.map(m => `<li>${m}</li>`).join('')}
          </ul>
        </div>
      </div>`;
  }

  if (Array.isArray(c.key) && c.key.length > 0) {
    html += `
      <div class="claude-callout claude-callout-tip" id="section-takeaways">
        <div class="claude-callout-icon">💡</div>
        <div class="claude-callout-content">
          <strong>Core Scholarly Takeaways:</strong>
          <ul style="margin: 6px 0 0; padding-left: 18px; font-size: 14px; line-height: 1.6;">
            ${c.key.map(k => `<li>${k}</li>`).join('')}
          </ul>
        </div>
      </div>`;
  }

  html += renderClaudePromptCard(courseId, lesson.title);
  html += renderClaudeKnowledgeCheck(courseId, lesson.title);

  return html;
}

function setupDepthControl(lesson) {
  const btns = document.querySelectorAll('.depth-btn');
  const body = document.getElementById('lesson-article-body');
  if (!btns.length || !body) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeDepth = btn.dataset.depth;
      const currentLang = store.getEnglishLevel();
      body.innerHTML = renderLessonBody(lesson, activeDepth, currentLang);
      setupParagraphRails(lesson.course, lesson);
      setupInlineVisualListeners(lesson);
      setupInteractiveWidgets(lesson);
      setupClaudePromptListeners(body);
      setupClaudeKnowledgeCheckListeners(body, lesson.course || 'thesis101', lesson.id);
    });
  });
}

function setupInlineVisualListeners(lesson) {
  const currentLang = store.getEnglishLevel();

  // Sentence Clicks -> Expand Inline Drawer directly below paragraph
  document.querySelectorAll('.p-sentence').forEach(span => {
    span.style.cursor = 'pointer';
    span.title = 'Click to inspect visual diagram and compare English styles inline';

    span.addEventListener('click', (e) => {
      e.stopPropagation();
      const sId = span.dataset.sId;
      const bId = span.dataset.bId;
      const drawer = document.getElementById(`inline-drawer-${bId}`);
      const body = document.getElementById(`inline-body-${bId}`);

      if (!drawer || !body) return;

      // Find sentence object
      let targetSentence = null;
      let targetBlock = null;
      for (const b of (lesson.content?.blocks || [])) {
        if (b.id === bId) {
          targetBlock = b;
          for (const s of (b.sentences || [])) {
            if (s.id === sId) {
              targetSentence = s;
              break;
            }
          }
          break;
        }
      }

      const isAlreadyActive = span.classList.contains('active-sentence') && drawer.style.display === 'block';

      if (isAlreadyActive) {
        span.classList.remove('active-sentence');
        drawer.style.display = 'none';
        return;
      }

      // Mark active
      document.querySelectorAll('.p-sentence').forEach(s => s.classList.remove('active-sentence'));
      span.classList.add('active-sentence');

      // Populate inline drawer body
      renderInlineDrawerContent(drawer, body, targetSentence, targetBlock, 'visual');
      drawer.style.display = 'block';

      // Scroll smoothly to drawer if needed
      drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  // Wire inline drawer close and tab buttons
  document.querySelectorAll('.inline-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const bId = btn.dataset.bId;
      const drawer = document.getElementById(`inline-drawer-${bId}`);
      if (drawer) drawer.style.display = 'none';
      document.querySelectorAll(`.p-sentence[data-b-id="${bId}"]`).forEach(s => s.classList.remove('active-sentence'));
    });
  });

  document.querySelectorAll('.inline-tab-btn').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      const bId = tabBtn.dataset.bId;
      const tab = tabBtn.dataset.tab;
      const drawer = document.getElementById(`inline-drawer-${bId}`);
      const body = document.getElementById(`inline-body-${bId}`);
      if (!drawer || !body) return;

      drawer.querySelectorAll('.inline-tab-btn').forEach(tb => tb.classList.remove('active'));
      tabBtn.classList.add('active');

      const activeSpan = document.querySelector(`.p-sentence.active-sentence[data-b-id="${bId}"]`);
      const sId = activeSpan?.dataset.sId;
      let targetSentence = null;
      let targetBlock = null;

      for (const b of (lesson.content?.blocks || [])) {
        if (b.id === bId) {
          targetBlock = b;
          for (const s of (b.sentences || [])) {
            if (s.id === sId) {
              targetSentence = s;
              break;
            }
          }
          break;
        }
      }

      if (!targetSentence && targetBlock?.sentences?.length) {
        targetSentence = targetBlock.sentences[0];
      }

      renderInlineDrawerContent(drawer, body, targetSentence, targetBlock, tab);
    });
  });
}

function renderInlineDrawerContent(drawer, body, sentence, block, tab) {
  const currentLang = store.getEnglishLevel();
  if (tab === 'compare') {
    const sText = sentence?.plain || sentence?.text || 'Selected sentence concept';
    const simple = sentence?.simple || 'Simplified academic formulation.';
    const plain = sentence?.plain || sText;
    const tech = sentence?.technical || 'Advanced scholarly formulation.';

    body.innerHTML = `
      <div class="inline-style-comparison">
        <div class="inline-style-card style-card-simple ${currentLang === 'simple' ? 'active-card' : ''}" style="border: 1.5px solid ${currentLang === 'simple' ? 'var(--qsa-accent-clay)' : 'var(--qsa-border-card)'}; border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; background: ${currentLang === 'simple' ? 'var(--qsa-accent-clay-soft)' : '#ffffff'};">
          <div class="style-card-head" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: var(--qsa-status-success); font-size: 13.5px;">🌱 Simple English (Accessible)</strong>
            <button type="button" class="btn ${currentLang === 'simple' ? 'btn-primary' : 'btn-secondary'} btn-sm set-lang-btn" data-set-lang="simple" style="font-size: 11px; padding: 3px 10px;">
              ${currentLang === 'simple' ? '✓ Active Register' : 'Set as Default'}
            </button>
          </div>
          <p style="margin: 0; font-size: 14.5px; line-height: 1.6; color: var(--qsa-text-primary);">${simple}</p>
        </div>

        <div class="inline-style-card style-card-plain ${currentLang === 'plain' ? 'active-card' : ''}" style="border: 1.5px solid ${currentLang === 'plain' ? 'var(--qsa-accent-clay)' : 'var(--qsa-border-card)'}; border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; background: ${currentLang === 'plain' ? 'var(--qsa-accent-clay-soft)' : '#ffffff'};">
          <div class="style-card-head" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: var(--qsa-accent-clay); font-size: 13.5px;">📘 Plain English (Standard Academic)</strong>
            <button type="button" class="btn ${currentLang === 'plain' ? 'btn-primary' : 'btn-secondary'} btn-sm set-lang-btn" data-set-lang="plain" style="font-size: 11px; padding: 3px 10px;">
              ${currentLang === 'plain' ? '✓ Active Register' : 'Set as Default'}
            </button>
          </div>
          <p style="margin: 0; font-size: 14.5px; line-height: 1.6; color: var(--qsa-text-primary);">${plain}</p>
        </div>

        <div class="inline-style-card style-card-tech ${currentLang === 'technical' ? 'active-card' : ''}" style="border: 1.5px solid ${currentLang === 'technical' ? 'var(--qsa-accent-clay)' : 'var(--qsa-border-card)'}; border-radius: 10px; padding: 14px 16px; margin-bottom: 8px; background: ${currentLang === 'technical' ? 'var(--qsa-accent-clay-soft)' : '#ffffff'};">
          <div class="style-card-head" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: var(--qsa-accent-clay-dark); font-size: 13.5px;">🎓 Technical Register (Formal Dissertation)</strong>
            <button type="button" class="btn ${currentLang === 'technical' ? 'btn-primary' : 'btn-secondary'} btn-sm set-lang-btn" data-set-lang="technical" style="font-size: 11px; padding: 3px 10px;">
              ${currentLang === 'technical' ? '✓ Active Register' : 'Set as Default'}
            </button>
          </div>
          <p style="margin: 0; font-size: 14.5px; line-height: 1.6; color: var(--qsa-text-primary);">${tech}</p>
        </div>
      </div>`;

    body.querySelectorAll('.set-lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const l = btn.dataset.setLang;
        if (l) {
          store.setEnglishLevel(l);
          store.acceptCookies();
          showGlobalToast(`Reading register set to ${l.toUpperCase()} & saved to device`);
        }
      });
    });
    return;
  }

  // Visual tab
  const visualObj = sentence?.visual || block?.visual;
  if (visualObj) {
    body.innerHTML = renderVisual(visualObj);
  } else {
    body.innerHTML = `
      <div style="background: var(--qsa-bg-fill); border-radius: 10px; padding: 24px; text-align: center; border: 1px dashed var(--qsa-border-strong);">
        <div style="font-size: 28px; margin-bottom: 8px;">💡</div>
        <strong style="font-size: 15px; color: var(--qsa-accent-clay);">Conceptual Formulation</strong>
        <p style="font-size: 13.5px; color: var(--qsa-text-secondary); max-width: 480px; margin: 8px auto 0;">
          "${sentence ? (sentence.plain || sentence.text) : block?.explain || ''}"
        </p>
      </div>`;
  }
}

function setupParagraphRails(courseId, lesson) {
  document.querySelectorAll('.rail-vis-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.dataset.pId;
      const drawer = document.getElementById(`inline-drawer-${pId}`);
      const body = document.getElementById(`inline-body-${pId}`);
      if (!drawer || !body) return;

      const targetBlock = (lesson.content?.blocks || []).find(b => b.id === pId);
      if (drawer.style.display === 'block') {
        drawer.style.display = 'none';
      } else {
        renderInlineDrawerContent(drawer, body, null, targetBlock, 'visual');
        drawer.style.display = 'block';
        drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  document.querySelectorAll('.rail-explain-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.dataset.pId;
      const card = document.getElementById(`explain-${pId}`);
      if (card) {
        card.style.display = card.style.display === 'none' ? 'block' : 'none';
      }
    });
  });

  document.querySelectorAll('.rail-check-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.dataset.pId;
      const mount = document.getElementById(`self-check-${pId}`);
      if (!mount) return;

      if (mount.style.display === 'block') {
        mount.style.display = 'none';
        return;
      }

      mount.style.display = 'block';
      mount.innerHTML = `
        <div style="background: var(--qsa-bg-subtle); border: 1px solid var(--qsa-border-card); border-radius: 12px; padding: 20px; margin: 16px 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span class="tag tag-clay">Self-Check Micro Quiz</span>
            <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('self-check-${pId}').style.display='none'" style="padding: 2px 8px; font-size: 11px;">✕</button>
          </div>
          <p style="font-weight: 600; font-size: 14.5px; color: var(--qsa-text-primary); margin-bottom: 12px;">
            Can this academic principle be applied without stating operational assumptions?
          </p>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button type="button" class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start;" onclick="this.style.background='var(--qsa-status-danger-bg)'; this.style.borderColor='var(--qsa-status-danger)'; alert('Incorrect: Stating assumptions is mandatory in rigorous research.')">
              A) Yes, assumptions are implied by the theory
            </button>
            <button type="button" class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start;" onclick="this.style.background='var(--qsa-status-success-bg)'; this.style.borderColor='var(--qsa-status-success)'; alert('✓ Correct! Delimiting operational assumptions is essential for replicability and defense.')">
              B) No, assumptions must be explicitly stated to protect against examiner objections
            </button>
          </div>
        </div>`;
    });
  });

  document.querySelectorAll('.rail-ask-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.dataset.pId;
      const targetBlock = (lesson.content?.blocks || []).find(b => b.id === pId);
      const text = targetBlock?.explain || lesson.title;
      const msg = encodeURIComponent(`Hi Quick Services Academy, I am studying "${lesson.title}" and need help clarifying this concept: "${text}"`);
      window.open(`https://wa.me/923296646824?text=${msg}`, '_blank');
    });
  });
}

function setupSentenceToolbar(lesson) {
  const portal = document.getElementById('selection-toolbar-portal');
  if (!portal) return;

  document.addEventListener('mouseup', handleSelection);
  document.addEventListener('keyup', (e) => {
    if (e.key === 'v' || e.key === 'V') handleSelection();
  });

  function handleSelection() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      portal.innerHTML = '';
      return;
    }

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    let targetSentence = null;
    let targetBlock = null;

    for (const b of (lesson.content?.blocks || [])) {
      for (const s of (b.sentences || [])) {
        if (sel.toString().includes(s.text) || (s.simple && sel.toString().includes(s.simple)) || (s.technical && sel.toString().includes(s.technical))) {
          targetSentence = s;
          targetBlock = b;
          break;
        }
      }
      if (targetSentence) break;
    }

    portal.innerHTML = `
      <div class="selection-toolbar" style="top: ${window.scrollY + rect.top - 46}px; left: ${rect.left + rect.width / 2}px;">
        <button type="button" class="toolbar-btn" id="tb-vis" title="View visual illustration inline">📊 Visualise</button>
        <button type="button" class="toolbar-btn" id="tb-compare" title="Compare Simple, Plain & Technical English">⚖️ Compare</button>
        <button type="button" class="toolbar-btn" id="tb-note" title="Save highlight to dashboard">📝 Note</button>
        <button type="button" class="toolbar-btn" id="tb-ask" title="Ask on WhatsApp">💬 Ask</button>
      </div>`;

    portal.querySelector('#tb-vis')?.addEventListener('click', () => {
      portal.innerHTML = '';
      if (targetBlock) {
        const drawer = document.getElementById(`inline-drawer-${targetBlock.id}`);
        const body = document.getElementById(`inline-body-${targetBlock.id}`);
        if (drawer && body) {
          renderInlineDrawerContent(drawer, body, targetSentence, targetBlock, 'visual');
          drawer.style.display = 'block';
          drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });

    portal.querySelector('#tb-compare')?.addEventListener('click', () => {
      portal.innerHTML = '';
      if (targetBlock) {
        const drawer = document.getElementById(`inline-drawer-${targetBlock.id}`);
        const body = document.getElementById(`inline-body-${targetBlock.id}`);
        if (drawer && body) {
          renderInlineDrawerContent(drawer, body, targetSentence, targetBlock, 'compare');
          drawer.style.display = 'block';
          drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });

    portal.querySelector('#tb-note')?.addEventListener('click', () => {
      const text = sel.toString().trim();
      store.addNote(lesson.course, lesson.id, targetSentence ? targetSentence.id : 'sel', text);
      alert('✓ Note saved to your dashboard!');
      portal.innerHTML = '';
    });

    portal.querySelector('#tb-ask')?.addEventListener('click', () => {
      const text = sel.toString().trim();
      const msg = encodeURIComponent(`Hi Quick Services, I have a question about ${lesson.title}: "${text}"`);
      window.open(`https://wa.me/923296646824?text=${msg}`, '_blank');
      portal.innerHTML = '';
    });
  }
}

function setupInteractiveWidgets(lesson) {
  const mount = document.getElementById('interactive-widget-mount');
  if (mount && lesson.type === 'visual') {
    const widgetType = lesson.content?.widget || 'funnel';
    renderWidget(mount, widgetType, lesson);
  }

  const quizMount = document.getElementById('interactive-quiz-mount');
  if (quizMount && lesson.type === 'quiz') {
    new QuizEngine(quizMount, {
      courseId: lesson.course,
      lessonId: lesson.id,
      questions: lesson.content?.questions || []
    });
  }
}

function escapeQuotes(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;');
}
