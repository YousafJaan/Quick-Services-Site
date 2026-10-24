/**
 * Quick Services Academy — Interactive Lesson Player Engine
 * Supports Quick/Standard/Deep layers, Simple/Plain/Technical English variations,
 * sentence visuals, paragraph margin rails, floating selection toolbar,
 * side-by-side style comparison, confidence-rated self-checks, and WhatsApp assistant.
 */

import { store } from './store.js';
import { renderVisual, renderFallback } from './visuals/index.js';
import { QuizEngine } from './quiz/index.js';
import { renderWidget } from './widgets/index.js';
import { router } from './router.js';

let activeDepth = 'standard';

export async function loadLessonView(container, { courseId, lessonId }) {
  container.innerHTML = `
    <div class="wrap" style="padding-top: 60px; padding-bottom: 80px; text-align: center;">
      <div style="font-size: 22px; font-family: var(--qsa-font-serif); color: var(--qsa-accent-clay); margin-bottom: 12px;">Loading lesson...</div>
      <p style="color: var(--qsa-text-muted);">Fetching lesson curriculum, multi-register text, and semantic visuals.</p>
    </div>`;

  try {
    const [courseRes, lessonRes] = await Promise.all([
      fetch(`./data/courses/${courseId}.json`),
      fetch(`./data/lessons/${courseId}/${lessonId}.json`)
    ]);

    if (!courseRes.ok || !lessonRes.ok) {
      throw new Error('Lesson or course manifest not found.');
    }

    const course = await courseRes.json();
    const lesson = await lessonRes.json();

    renderLessonPlayer(container, course, lesson);
  } catch (err) {
    container.innerHTML = `
      <div class="wrap" style="padding-top: 60px; padding-bottom: 80px; text-align: center;">
        <h3 style="color: var(--qsa-status-danger);">Unable to load lesson</h3>
        <p style="color: var(--qsa-text-muted); margin-bottom: 24px;">${err.message}</p>
        <button class="btn btn-primary btn-sm" onclick="location.reload()">Retry</button>
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
            <span class="tag tag-clay">${lesson.type.toUpperCase()}</span>
            <span class="lesson-time-pill">${lesson.minutes} min</span>
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
                      <span class="syllabus-lesson-time">${l.minutes}m</span>
                    </a>`;
                }).join('')}
              </div>
            </div>`).join('')}
        </div>
      </aside>
    </div>

    <!-- Floating Selection Toolbar Portal -->
    <div id="selection-toolbar-portal"></div>

    <!-- Visual Modal Portal -->
    <div id="visual-modal-portal"></div>`;

  setupDepthControl(lesson);
  setupSentenceToolbar(lesson);
  setupSentenceClickListeners(lesson);
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

  // Close drawer if clicking any lesson inside it
  drawerOverlay?.querySelectorAll('.syllabus-lesson-item').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Live listener for English style changes
  const handleLangChange = () => {
    const newLang = store.getEnglishLevel();
    const articleBody = document.getElementById('lesson-article-body');
    if (articleBody) {
      articleBody.innerHTML = renderLessonBody(lesson, activeDepth, newLang);
      setupParagraphRails(course.id, lesson);
      setupSentenceClickListeners(lesson);
      setupInteractiveWidgets(lesson);
    }
    const switcher = document.getElementById('reader-lang-switcher');
    if (switcher) {
      switcher.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === newLang);
      });
    }
  };

  window.addEventListener('qsa:english-level-changed', handleLangChange);

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
        <span class="tag tag-clay" style="margin-bottom: 12px;">Video Lesson • ${c.len || '8 min'}</span>
        <h3 style="margin: 12px 0; font-size: 22px;">${lesson.title}</h3>
        <p style="color: var(--qsa-text-muted); max-width: 500px; margin: 0 auto 24px; font-size: 14px;">
          Production ID: <code>${c.vid || 'V-ACADEMY'}</code>. Video script is ready.
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

      <h4 style="margin: 28px 0 12px;">Spoken Transcript</h4>
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
        <p>
          ${(b.sentences || []).map(s => {
            const sentenceText = getSentenceText(s, lang);
            return `
              <span class="p-sentence" data-s-id="${s.id}" data-s-text="${escapeQuotes(sentenceText)}">${sentenceText}</span>
            `;
          }).join(' ')}
        </p>

        <!-- Paragraph Margin Tools -->
        <div class="paragraph-rail-actions">
          <button type="button" class="rail-btn rail-vis-btn" data-p-id="${b.id}" title="View visual model">📊 Visualise</button>
          <button type="button" class="rail-btn rail-explain-btn" data-explain="${escapeQuotes(b.explain || '')}" title="Simple breakdown">💡 Explain Simply</button>
          <button type="button" class="rail-btn rail-check-btn" data-p-id="${b.id}" title="Test understanding">🎯 Check Yourself</button>
          <button type="button" class="rail-btn rail-ask-btn" data-p-id="${b.id}" title="Ask M. Yousaf">💬 Ask on WhatsApp</button>
        </div>

        <!-- Hidden Explainer Card -->
        <div class="explain-card" id="explain-${b.id}" style="display: none; background: var(--qsa-status-info-bg); border-left: 3.5px solid var(--qsa-status-info); padding: 16px; border-radius: 10px; margin: 12px 0; font-size: 14px; color: var(--qsa-text-primary);">
          <strong>💡 Plain English Explanation:</strong>
          <p style="margin: 6px 0 0; color: var(--qsa-text-secondary);">${b.explain || ''}</p>
        </div>

        <!-- Embedded Paragraph Visual -->
        ${b.visual ? renderVisual(b.visual) : ''}

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
      setupSentenceClickListeners(lesson);
      setupInteractiveWidgets(lesson);
    });
  });
}

function setupSentenceClickListeners(lesson) {
  document.querySelectorAll('.p-sentence').forEach(span => {
    span.style.cursor = 'pointer';
    span.title = 'Click to inspect visual diagram and compare English styles';
    span.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.p-sentence').forEach(s => s.classList.remove('active-sentence'));
      span.classList.add('active-sentence');

      const sId = span.dataset.sId;
      let targetSentence = null;
      for (const b of (lesson.content?.blocks || [])) {
        for (const s of (b.sentences || [])) {
          if (s.id === sId) {
            targetSentence = s;
            break;
          }
        }
        if (targetSentence) break;
      }

      if (targetSentence && targetSentence.visual) {
        showModal(renderVisual(targetSentence.visual));
      } else if (targetSentence) {
        showSentenceComparisonModal(targetSentence, span.innerText);
      }
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

    // Find sentence element
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
        <button type="button" class="toolbar-btn" id="tb-vis" title="View visual illustration">📊 Visualise</button>
        <button type="button" class="toolbar-btn" id="tb-compare" title="Compare Simple, Plain & Technical English">⚖️ Compare Styles</button>
        <button type="button" class="toolbar-btn" id="tb-note" title="Save highlight to dashboard">📝 Note</button>
        <button type="button" class="toolbar-btn" id="tb-ask" title="Ask on WhatsApp">💬 Ask</button>
      </div>`;

    portal.querySelector('#tb-vis')?.addEventListener('click', () => {
      if (targetSentence && targetSentence.visual) {
        showModal(renderVisual(targetSentence.visual));
      } else {
        showTextFallbackModal(sel.toString());
      }
    });

    portal.querySelector('#tb-compare')?.addEventListener('click', () => {
      showSentenceComparisonModal(targetSentence, sel.toString());
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
    });
  }
}

function showSentenceComparisonModal(sentenceObj, rawSelection) {
  const portal = document.getElementById('visual-modal-portal');
  if (!portal) return;

  const simple = sentenceObj?.simple || "Simplified wording: " + rawSelection;
  const plain = sentenceObj?.plain || sentenceObj?.text || rawSelection;
  const technical = sentenceObj?.technical || "Scholarly formal register: " + rawSelection;

  portal.innerHTML = `
    <div class="modal-overlay" id="compare-modal-overlay">
      <div class="modal-content" style="max-width: 650px;">
        <button class="modal-close" id="close-compare-btn">&times;</button>
        <span class="tag tag-clay" style="margin-bottom: 12px;">English Register Comparison</span>
        <h3 style="font-size: 22px; margin: 6px 0 16px;">How This Concept Is Expressed</h3>
        
        <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
          <!-- Simple -->
          <div style="background: var(--qsa-bg-subtle); border-left: 3.5px solid var(--qsa-status-success); border-radius: 8px; padding: 14px 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <strong style="font-size: 14px; color: var(--qsa-text-primary);">🌱 Simple English (Easy &amp; Clear)</strong>
              <button class="btn btn-secondary btn-sm" style="font-size: 11px; padding: 3px 8px;" onclick="store.setEnglishLevel('simple'); document.getElementById('compare-modal-overlay')?.remove();">Set as Default</button>
            </div>
            <p style="margin: 0; font-size: 14.5px; color: var(--qsa-text-secondary); line-height: 1.5;">${simple}</p>
          </div>

          <!-- Plain Academic -->
          <div style="background: var(--qsa-bg-subtle); border-left: 3.5px solid var(--qsa-accent-clay); border-radius: 8px; padding: 14px 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <strong style="font-size: 14px; color: var(--qsa-text-primary);">📘 Plain English (Standard Academic)</strong>
              <button class="btn btn-secondary btn-sm" style="font-size: 11px; padding: 3px 8px;" onclick="store.setEnglishLevel('plain'); document.getElementById('compare-modal-overlay')?.remove();">Set as Default</button>
            </div>
            <p style="margin: 0; font-size: 14.5px; color: var(--qsa-text-secondary); line-height: 1.5;">${plain}</p>
          </div>

          <!-- Technical -->
          <div style="background: var(--qsa-bg-subtle); border-left: 3.5px solid var(--qsa-accent-orange); border-radius: 8px; padding: 14px 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <strong style="font-size: 14px; color: var(--qsa-text-primary);">🎓 Technical / Dissertation Register</strong>
              <button class="btn btn-secondary btn-sm" style="font-size: 11px; padding: 3px 8px;" onclick="store.setEnglishLevel('technical'); document.getElementById('compare-modal-overlay')?.remove();">Set as Default</button>
            </div>
            <p style="margin: 0; font-size: 14.5px; color: var(--qsa-text-secondary); line-height: 1.5;">${technical}</p>
          </div>
        </div>

        <div style="text-align: right;">
          <button class="btn btn-primary btn-sm" id="done-compare-btn">Done</button>
        </div>
      </div>
    </div>`;

  portal.querySelector('#close-compare-btn')?.addEventListener('click', () => portal.innerHTML = '');
  portal.querySelector('#done-compare-btn')?.addEventListener('click', () => portal.innerHTML = '');
  portal.querySelector('#compare-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'compare-modal-overlay') portal.innerHTML = '';
  });
}

function setupParagraphRails(courseId, lesson) {
  document.querySelectorAll('.rail-vis-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.dataset.pId;
      const block = (lesson.content?.blocks || []).find(b => b.id === pId);
      if (block && block.visual) {
        showModal(renderVisual(block.visual));
      }
    });
  });

  document.querySelectorAll('.rail-explain-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.closest('.p-block')?.dataset.pId;
      const exp = document.getElementById(`explain-${pId}`);
      if (exp) {
        exp.style.display = exp.style.display === 'none' ? 'block' : 'none';
      }
    });
  });

  document.querySelectorAll('.rail-check-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.dataset.pId;
      const checkContainer = document.getElementById(`self-check-${pId}`);
      if (!checkContainer) return;

      if (checkContainer.style.display === 'block') {
        checkContainer.style.display = 'none';
        return;
      }

      checkContainer.style.display = 'block';
      const block = (lesson.content?.blocks || []).find(b => b.id === pId);
      if (block && block.check && block.check.questions) {
        new QuizEngine(checkContainer, {
          bank: block.check.questions,
          isSelfCheck: true,
          courseId,
          lessonId: lesson.id,
          onComplete: (res) => {
            store.recordSelfCheck(courseId, lesson.id, pId, 4, 5, res.score, 100);
          }
        });
      }
    });
  });

  document.querySelectorAll('.rail-ask-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.dataset.pId;
      const block = (lesson.content?.blocks || []).find(b => b.id === pId);
      const firstSentence = block?.sentences?.[0]?.text || lesson.title;
      const msg = encodeURIComponent(`Hi Quick Services, regarding paragraph in ${lesson.title}: "${firstSentence}"`);
      window.open(`https://wa.me/923296646824?text=${msg}`, '_blank');
    });
  });
}

function setupInteractiveWidgets(lesson) {
  if (lesson.type === 'visual') {
    const mount = document.getElementById('interactive-widget-mount');
    if (mount) {
      renderWidget(lesson.content?.widget || 'checklist', mount);
    }
  }

  if (lesson.type === 'quiz') {
    const mount = document.getElementById('interactive-quiz-mount');
    if (mount) {
      new QuizEngine(mount, {
        bank: lesson.content?.bank || [],
        show: lesson.content?.show || 6,
        pass: lesson.content?.pass || 70,
        courseId: lesson.course,
        lessonId: lesson.id,
        onComplete: (res) => {
          store.recordQuizResult(lesson.course, lesson.id, res.score, res.passed, res.mistakes);
        }
      });
    }
  }
}

function showTextFallbackModal(text) {
  showModal(renderFallback(text));
}

function showModal(contentHtml) {
  const portal = document.getElementById('visual-modal-portal');
  if (!portal) return;

  portal.innerHTML = `
    <div class="modal-overlay" id="active-modal-overlay">
      <div class="modal-content">
        <button class="modal-close" id="modal-close-btn">&times;</button>
        ${contentHtml}
      </div>
    </div>`;

  portal.querySelector('#modal-close-btn').addEventListener('click', () => {
    portal.innerHTML = '';
  });
  portal.querySelector('#active-modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'active-modal-overlay') portal.innerHTML = '';
  });
}

function escapeQuotes(str) {
  if (!str) return '';
  return str.replace(/"/g, '&quot;');
}
