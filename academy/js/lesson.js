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
    <div class="wrap-narrow">
      <div class="reader-canvas">
        <!-- Reader Top Navigation Bar -->
        <div class="reader-top-bar">
          <a href="#course-${course.id}" class="reader-back-btn">
            <span style="font-size: 15px;">←</span> <span>${course.title}</span>
          </a>
          <div class="reader-meta-group">
            <button type="button" class="syllabus-pill-btn" id="open-syllabus-drawer-btn" title="Open course curriculum syllabus">
              <span>📑 Syllabus</span>
              <span class="syllabus-count">${currentIndex + 1} / ${allLessons.length}</span>
            </button>
            <span class="tag tag-clay">${(lesson.type || 'read').toUpperCase()}</span>
            <span class="lesson-time-pill">${lesson.minutes || 10} min</span>
          </div>
        </div>

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

        <!-- Lesson Navigation Footer Card -->
        <footer class="reader-nav-footer">
          <div class="reader-nav-prev">
            ${prevLesson ? `
              <a href="#lesson-${course.id}-${prevLesson.id}" class="reader-nav-btn reader-nav-prev-btn" title="Previous: ${prevLesson.title}">
                <span class="nav-dir">← Previous</span>
                <span class="nav-title">${prevLesson.title}</span>
              </a>` : '<div></div>'}
          </div>
          <div class="reader-nav-complete" style="text-align: center;">
            <button class="btn btn-primary btn-sm" id="mark-complete-btn">
              ${store.isLessonComplete(course.id, lesson.id) ? '✓ Completed' : 'Mark as Complete'}
            </button>
          </div>
          <div class="reader-nav-next">
            ${nextLesson ? `
              <a href="#lesson-${course.id}-${nextLesson.id}" class="reader-nav-btn reader-nav-next-btn" title="Next: ${nextLesson.title}">
                <span class="nav-dir">Next Lesson →</span>
                <span class="nav-title">${nextLesson.title}</span>
              </a>` : `
              <a href="#course-${course.id}" class="reader-nav-btn reader-nav-next-btn" title="Return to Course Overview">
                <span class="nav-dir">Complete Track 🏆</span>
                <span class="nav-title">Course Overview</span>
              </a>`}
          </div>
        </footer>
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
      articleBody.innerHTML = renderLessonBody(lesson, activeDepth, newLang);
      setupParagraphRails(course.id, lesson);
      setupInlineVisualListeners(lesson);
      setupInteractiveWidgets(lesson);
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
    });
  }
}

function getSentenceText(s, level) {
  if (level === 'simple' && s.simple) return s.simple;
  if (level === 'technical' && s.technical) return s.technical;
  if (level === 'plain' && s.plain) return s.plain;
  return s.text || s.plain || s.simple || s.technical || '';
}

function renderLessonBody(lesson, depth = 'standard', lang = 'plain') {
  const c = lesson.content || lesson.c || {};

  if (lesson.type === 'video') {
    return `
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

      <h4 style="margin: 28px 0 12px; font-family: var(--qsa-font-serif); font-size: 20px;">Spoken Transcript</h4>
      ${(c.transcript || c.p || []).map(p => `<p style="font-size: 16px; line-height: 1.7; color: var(--qsa-text-secondary);">${p}</p>`).join('')}

      <div style="background: var(--qsa-bg-subtle); border-left: 3.5px solid var(--qsa-accent-clay); padding: 20px; border-radius: 12px; margin-top: 32px;">
        <h4 style="font-size: 16px; margin-bottom: 8px; color: var(--qsa-text-primary);">Key Takeaways</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 14.5px; color: var(--qsa-text-secondary);">
          ${(c.key || []).map(k => `<li style="margin-bottom: 6px;">${k}</li>`).join('')}
        </ul>
      </div>`;
  }

  if (lesson.type === 'visual') {
    return `
      <div style="margin-bottom: 24px;">
        <p style="font-size: 16.5px; line-height: 1.6; color: var(--qsa-text-primary);">${c.intro || ''}</p>
      </div>
      <div id="interactive-widget-mount"></div>
      <div style="background: var(--qsa-bg-subtle); border-left: 3.5px solid var(--qsa-accent-clay); padding: 20px; border-radius: 12px; margin-top: 32px;">
        <h4 style="font-size: 16px; margin-bottom: 8px; color: var(--qsa-text-primary);">Key Takeaways</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 14.5px; color: var(--qsa-text-secondary);">
          ${(c.key || []).map(k => `<li style="margin-bottom: 6px;">${k}</li>`).join('')}
        </ul>
      </div>`;
  }

  if (lesson.type === 'quiz') {
    return `<div id="interactive-quiz-mount"></div>`;
  }

  // Reading Lesson: Quick Mode
  if (depth === 'quick') {
    return `
      <div style="background: var(--qsa-status-warning-bg); border: 1.5px solid var(--qsa-status-warning-border); border-radius: 16px; padding: 24px; margin-bottom: 28px;">
        <span class="tag tag-clay" style="margin-bottom: 10px;">Quick Summary</span>
        <p style="font-size: 17.5px; line-height: 1.7; color: var(--qsa-text-primary); font-weight: 500;">
          ${c.quick || ''}
        </p>
      </div>
      <div style="background: var(--qsa-bg-subtle); border-left: 3.5px solid var(--qsa-accent-clay); padding: 20px; border-radius: 12px;">
        <h4 style="font-size: 16px; margin-bottom: 8px; color: var(--qsa-text-primary);">Core Takeaways</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 14.5px; color: var(--qsa-text-secondary);">
          ${(c.key || []).map(k => `<li style="margin-bottom: 6px;">${k}</li>`).join('')}
        </ul>
      </div>`;
  }

  let html = '';
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
          <strong>💡 Plain English Explanation:</strong>
          <p style="margin: 6px 0 0; color: var(--qsa-text-secondary);">${b.explain || ''}</p>
        </div>

        <!-- Self-Check Micro-Quiz Mount -->
        <div class="self-check-container" id="self-check-${b.id}" style="display: none;"></div>
      </div>`;
  });

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
      <div style="background: var(--qsa-status-danger-bg); border-left: 3.5px solid var(--qsa-status-danger); border-radius: 12px; padding: 20px; margin: 32px 0;">
        <h4 style="color: var(--qsa-status-danger); font-size: 16px; margin-bottom: 10px;">⚠️ Common Student Mistakes</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: var(--qsa-text-secondary);">
          ${c.mistakes.map(m => `<li style="margin-bottom: 6px;">${m}</li>`).join('')}
        </ul>
      </div>`;
  }

  if (Array.isArray(c.key) && c.key.length > 0) {
    html += `
      <div style="background: var(--qsa-bg-subtle); border-left: 3.5px solid var(--qsa-accent-clay); padding: 20px; border-radius: 12px; margin-top: 32px;">
        <h4 style="font-size: 16px; margin-bottom: 8px; color: var(--qsa-text-primary);">Key Takeaways</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 14.5px; color: var(--qsa-text-secondary);">
          ${c.key.map(k => `<li style="margin-bottom: 6px;">${k}</li>`).join('')}
        </ul>
      </div>`;
  }

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
          showGlobalToast(`Reading register set to ${l.toUpperCase()}`);
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
