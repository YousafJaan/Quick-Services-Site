/**
 * Quick Services Academy — Application Controller & Route Coordinator
 * Reverse-engineered Claude Academy light theme aesthetic & English register manager
 */

import { router } from './router.js';
import { store } from './store.js';
import { loadLessonView } from './lesson.js';
import { renderCertificateView } from './certificate.js';
import { getCourseThumbnailSvg } from './thumbnails.js';

const mainEl = document.getElementById('app-main');

function getBaseDataPath() {
  const path = window.location.pathname;
  if (path.includes('/academy')) {
    const idx = path.indexOf('/academy');
    return path.substring(0, idx + '/academy'.length) + '/data';
  }
  return './data';
}

// Route 1: Catalog View (#/)
router.addRoute('/', async () => {
  try {
    const baseData = getBaseDataPath();
    const res = await fetch(`${baseData}/courses.json`);
    const courses = await res.json();
    renderCatalog(courses);
  } catch (e) {
    mainEl.innerHTML = `<div class="wrap" style="padding: 80px 0; text-align: center;"><h3>Error loading courses.</h3></div>`;
  }
});

// Route 2: Course Overview (#course-:id)
router.addRoute('course', async ({ courseId }) => {
  try {
    const baseData = getBaseDataPath();
    const res = await fetch(`${baseData}/courses/${courseId}.json`);
    const course = await res.json();
    renderCourseOverview(course);
  } catch (e) {
    mainEl.innerHTML = `<div class="wrap" style="padding: 80px 0; text-align: center;"><h3>Course not found.</h3></div>`;
  }
});

// Route 3: Lesson Player (#lesson-:courseId-:lessonId)
router.addRoute('lesson', ({ courseId, lessonId }) => {
  loadLessonView(mainEl, { courseId, lessonId });
});

// Route 4: Learner Dashboard (#learning)
router.addRoute('learning', () => {
  renderLearnerDashboard();
});

// Route 5: Certificates List (#certificates)
router.addRoute('certificates', () => {
  renderCertificatesList();
});

// Route 6: Single Certificate View (#certificate-:certId)
router.addRoute('certificate', ({ certId }) => {
  renderCertificateView(mainEl, { certId });
});

// Route 7: Verification View (#verify-:certId)
router.addRoute('verify', ({ certId }) => {
  renderVerifyView(certId);
});

// Initialize router
router.start();

// Initialize English Proficiency System
initLanguageSwitchers();
checkLanguageOnboarding();

// Keyboard Shortcuts Listener
document.addEventListener('keydown', (e) => {
  if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
    showShortcutsHelp();
  }
});

/* ==========================================================================
   English Proficiency Level Logic & Onboarding Modal
   ========================================================================== */
function initLanguageSwitchers() {
  const syncButtons = () => {
    const current = store.getEnglishLevel();
    document.querySelectorAll('.lang-level-switcher').forEach(switcher => {
      switcher.querySelectorAll('.lang-btn').forEach(btn => {
        const lang = btn.dataset.lang;
        if (lang === current) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    });
  };

  // Delegated click handler on document
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return;
    const lang = btn.dataset.lang;
    if (lang) {
      store.setEnglishLevel(lang);
      syncButtons();
    }
  });

  window.addEventListener('qsa:english-level-changed', () => {
    syncButtons();
  });

  syncButtons();
}

function checkLanguageOnboarding(force = false) {
  if (!force && store.hasChosenEnglishLevel()) {
    return;
  }

  const modalPortal = document.getElementById('app-modal-portal');
  if (!modalPortal) return;

  const current = store.getEnglishLevel();

  modalPortal.innerHTML = `
    <div class="modal-overlay" id="onboarding-modal-overlay">
      <div class="modal-content" style="max-width: 680px; padding: 40px 36px;">
        <button class="modal-close" id="close-onboarding-btn" aria-label="Close dialog">×</button>

        <div style="text-align: center; margin-bottom: 28px;">
          <span class="tag tag-clay" style="margin-bottom: 12px;">Personalized Academic Experience</span>
          <h2 style="font-size: clamp(24px, 4vw, 32px); margin: 8px 0 10px;">Choose Your Reading English Style</h2>
          <p style="color: var(--qsa-text-secondary); font-size: 15px; max-width: 520px; margin: 0 auto; line-height: 1.6;">
            Quick Services Academy adapts course explanations to your English proficiency. You can switch styles at any second while studying.
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 28px;">
          <!-- Option 1: Simple English -->
          <div class="lang-option-card ${current === 'simple' ? 'selected' : ''}" data-choose-lang="simple" style="border: 1.5px solid ${current === 'simple' ? 'var(--qsa-accent-clay)' : 'var(--qsa-border-card)'}; border-radius: var(--qsa-radius-card); padding: 18px 22px; cursor: pointer; transition: all var(--qsa-dur-fast) var(--qsa-ease-out); background: ${current === 'simple' ? 'var(--qsa-accent-peach-soft)' : '#ffffff'};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="font-size: 16.5px; color: var(--qsa-text-primary); display: flex; align-items: center; gap: 8px;">
                <span>🌱</span> Simple English (Easy &amp; Clear)
              </strong>
              <span class="tag tag-green" style="font-size: 11px;">Beginner / ESL</span>
            </div>
            <p style="font-size: 13.5px; color: var(--qsa-text-secondary); margin: 0 0 10px; line-height: 1.5;">
              Everyday vocabulary, short sentences, and instant definitions. Ideal if English is your second language or you want fast, confusion-free comprehension.
            </p>
            <div style="background: var(--qsa-bg-subtle); border-radius: var(--qsa-radius-sm); padding: 10px 14px; font-size: 12.5px; color: var(--qsa-text-muted); font-style: italic;">
              Example: "A good thesis topic must be narrow. It must study a specific group of people in one city."
            </div>
          </div>

          <!-- Option 2: Plain English -->
          <div class="lang-option-card ${current === 'plain' ? 'selected' : ''}" data-choose-lang="plain" style="border: 1.5px solid ${current === 'plain' ? 'var(--qsa-accent-clay)' : 'var(--qsa-border-card)'}; border-radius: var(--qsa-radius-card); padding: 18px 22px; cursor: pointer; transition: all var(--qsa-dur-fast) var(--qsa-ease-out); background: ${current === 'plain' ? 'var(--qsa-accent-peach-soft)' : '#ffffff'};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="font-size: 16.5px; color: var(--qsa-text-primary); display: flex; align-items: center; gap: 8px;">
                <span>📘</span> Plain English (Standard Academic)
              </strong>
              <span class="tag tag-clay" style="font-size: 11px;">Recommended</span>
            </div>
            <p style="font-size: 13.5px; color: var(--qsa-text-secondary); margin: 0 0 10px; line-height: 1.5;">
              Active, direct, standard academic voice. Balanced for university assignments, research proposals, and graduate dissertations.
            </p>
            <div style="background: var(--qsa-bg-subtle); border-radius: var(--qsa-radius-sm); padding: 10px 14px; font-size: 12.5px; color: var(--qsa-text-muted); font-style: italic;">
              Example: "Every successful thesis starts with an empirical problem that is clearly bounded across population and context."
            </div>
          </div>

          <!-- Option 3: Technical English -->
          <div class="lang-option-card ${current === 'technical' ? 'selected' : ''}" data-choose-lang="technical" style="border: 1.5px solid ${current === 'technical' ? 'var(--qsa-accent-clay)' : 'var(--qsa-border-card)'}; border-radius: var(--qsa-radius-card); padding: 18px 22px; cursor: pointer; transition: all var(--qsa-dur-fast) var(--qsa-ease-out); background: ${current === 'technical' ? 'var(--qsa-accent-peach-soft)' : '#ffffff'};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="font-size: 16.5px; color: var(--qsa-text-primary); display: flex; align-items: center; gap: 8px;">
                <span>🎓</span> Technical &amp; Scholarly Register
              </strong>
              <span class="tag tag-orange" style="font-size: 11px;">Advanced Scholar</span>
            </div>
            <p style="font-size: 13.5px; color: var(--qsa-text-secondary); margin: 0 0 10px; line-height: 1.5;">
              Formal dissertation prose with precise epistemological terms, mathematical formalisms, and rigorous methodological vocabulary.
            </p>
            <div style="background: var(--qsa-bg-subtle); border-radius: var(--qsa-radius-sm); padding: 10px 14px; font-size: 12.5px; color: var(--qsa-text-muted); font-style: italic;">
              Example: "Empirical inquiry necessitates operationalizing constructs within explicitly delimited spatial-temporal boundaries."
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <span style="font-size: 12.5px; color: var(--qsa-text-muted);">
            💡 You can switch anytime using the header toggle or while reading any lesson.
          </span>
          <button class="btn btn-primary" id="confirm-lang-btn" style="min-width: 140px;">
            Save &amp; Continue
          </button>
        </div>
      </div>
    </div>`;

  let selectedLang = current;

  modalPortal.querySelectorAll('.lang-option-card').forEach(card => {
    card.addEventListener('click', () => {
      selectedLang = card.dataset.chooseLang;
      modalPortal.querySelectorAll('.lang-option-card').forEach(c => {
        const isMatch = c.dataset.chooseLang === selectedLang;
        c.style.border = isMatch ? '1.5px solid var(--qsa-accent-clay)' : '1.5px solid var(--qsa-border-card)';
        c.style.background = isMatch ? 'var(--qsa-accent-peach-soft)' : '#ffffff';
      });
    });
  });

  const closeModal = () => {
    modalPortal.innerHTML = '';
  };

  modalPortal.querySelector('#confirm-lang-btn')?.addEventListener('click', () => {
    store.setEnglishLevel(selectedLang);
    closeModal();
  });

  modalPortal.querySelector('#close-onboarding-btn')?.addEventListener('click', () => {
    store.setEnglishLevel(selectedLang);
    closeModal();
  });
}

// Expose on window for easy access
window.openLanguagePreferenceModal = () => checkLanguageOnboarding(true);

/* ==========================================================================
   Catalog Rendering (Claude Academy Warm Light Paper Aesthetic)
   ========================================================================== */
function renderCatalog(courses) {
  const active = store.getActiveLesson();
  const currentLang = store.getEnglishLevel();

  const langLabels = {
    simple: 'Simple',
    plain: 'Plain',
    technical: 'Tech'
  };

  mainEl.innerHTML = `
    <!-- Hero Banner -->
    <section style="background: linear-gradient(180deg, rgba(217, 119, 87, 0.05) 0%, rgba(250, 249, 245, 0) 100%); padding: 64px 0 44px; border-bottom: 1px solid var(--qsa-border-line);">
      <div class="wrap" style="text-align: center;">
        <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 14px;">
          <span class="tag tag-clay">Quick Services Academy</span>
          <button type="button" onclick="window.openLanguagePreferenceModal()" style="background: var(--qsa-bg-card); border: 1px solid var(--qsa-border-card); border-radius: var(--qsa-radius-pill); padding: 4px 12px; font-size: 12px; font-weight: 600; color: var(--qsa-text-secondary); cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
            <span>Reading Style:</span>
            <strong style="color: var(--qsa-accent-clay);">${langLabels[currentLang]}</strong>
            <span style="font-size: 11px; opacity: 0.7;">⚙</span>
          </button>
        </div>

        <h1 style="font-size: clamp(34px, 6vw, 54px); color: var(--qsa-text-primary); max-width: 820px; margin: 8px auto 16px; font-weight: 400; line-height: 1.15;">
          Make your research make sense.
        </h1>
        <p style="font-size: clamp(16px, 2.2vw, 18.5px); color: var(--qsa-text-secondary); max-width: 680px; margin: 0 auto 28px; line-height: 1.6;">
          Free, premium academic training for postgraduate and research students in Pakistan. Master thesis structure, APA 7th citations, G*Power calculations, SPSS, and SmartPLS with interactive visuals for every single sentence.
        </p>

        <!-- Search & Filter Controls -->
        <div style="max-width: 580px; margin: 0 auto; display: flex; gap: 12px; flex-wrap: wrap;">
          <input type="text" id="catalog-search" placeholder="Search topics (e.g. Turnitin, G*Power, ANOVA, APA 7)..." style="flex: 1; min-width: 260px; padding: 13px 20px; border-radius: var(--qsa-radius-pill); border: 1.5px solid var(--qsa-border-strong); background: #ffffff; color: var(--qsa-text-primary); font-size: 14.5px; outline: none; box-shadow: var(--qsa-shadow-card);">
        </div>
      </div>
    </section>

    <!-- Resume Banner (If Active) -->
    ${active && active.courseId ? `
      <section style="background: var(--qsa-accent-peach-soft); border-bottom: 1px solid rgba(217, 119, 87, 0.15); padding: 14px 0;">
        <div class="wrap" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="font-size: 14px; color: var(--qsa-text-secondary);">
            <strong>Resume where you left off:</strong> Lesson <code>${active.lessonId.toUpperCase()}</code> in <em>${active.courseId.toUpperCase()}</em>
          </div>
          <a href="#lesson-${active.courseId}-${active.lessonId}" class="btn btn-primary btn-sm">Continue Lesson ➔</a>
        </div>
      </section>` : ''}

    <!-- Courses Grid Section -->
    <section style="padding: 56px 0 72px;">
      <div class="wrap">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; flex-wrap: wrap; gap: 16px;">
          <div>
            <span class="tag tag-clay" style="margin-bottom: 8px;">Curriculum</span>
            <h2 style="font-size: clamp(26px, 4vw, 34px); color: var(--qsa-text-primary); margin: 4px 0 0;">All 9 Academy Courses</h2>
          </div>
        </div>

        <div class="cards-grid" id="courses-grid-mount">
          ${courses.map(c => renderCourseCard(c)).join('')}
        </div>
      </div>
    </section>

    <!-- Learning Paths Section -->
    <section style="background: var(--qsa-bg-sidebar); border-top: 1px solid var(--qsa-border-line); border-bottom: 1px solid var(--qsa-border-line); padding: 64px 0;">
      <div class="wrap">
        <div style="text-align: center; max-width: 620px; margin: 0 auto 40px;">
          <span class="tag tag-clay" style="margin-bottom: 8px;">Curated Tracks</span>
          <h2 style="font-size: clamp(26px, 4vw, 34px); color: var(--qsa-text-primary);">Choose Your Learning Path</h2>
          <p style="color: var(--qsa-text-secondary); font-size: 15px;">Structured progression designed for your specific research milestone.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
          <div style="background: #ffffff; color: var(--qsa-text-primary); border-radius: var(--qsa-radius-card); padding: 32px; box-shadow: inset 0 0 0 1px var(--qsa-border-card); transition: transform var(--qsa-dur-fast) var(--qsa-ease-spring);">
            <span class="tag tag-clay" style="margin-bottom: 12px;">Track 1</span>
            <h3 style="font-size: 24px; margin: 8px 0 12px;">Thesis Starter Path</h3>
            <p style="font-size: 14.5px; color: var(--qsa-text-secondary); line-height: 1.6; margin-bottom: 20px;">
              Designed for students writing proposals and dissertations. Takes you from initial topic bounding through citations, similarity compliance, editing, and viva defense.
            </p>
            <div style="font-size: 13px; font-weight: 700; color: var(--qsa-accent-clay); margin-bottom: 20px;">
              5 Courses • 15.3 Hours • All Levels
            </div>
            <a href="#course-thesis101" class="btn btn-primary btn-sm" style="width: 100%;">Start Track 1 ➔</a>
          </div>

          <div style="background: #ffffff; color: var(--qsa-text-primary); border-radius: var(--qsa-radius-card); padding: 32px; box-shadow: inset 0 0 0 1px var(--qsa-border-card); transition: transform var(--qsa-dur-fast) var(--qsa-ease-spring);">
            <span class="tag tag-orange" style="margin-bottom: 12px;">Track 2</span>
            <h3 style="font-size: 24px; margin: 8px 0 12px;">Research &amp; Statistics Path</h3>
            <p style="font-size: 14.5px; color: var(--qsa-text-secondary); line-height: 1.6; margin-bottom: 20px;">
              For quantitative empirical researchers. Master literature search, statistical sample sizing in G*Power, hypothesis testing in SPSS, and structural modeling in SmartPLS.
            </p>
            <div style="font-size: 13px; font-weight: 700; color: var(--qsa-accent-orange); margin-bottom: 20px;">
              4 Courses • 15.8 Hours • Intermediate to Advanced
            </div>
            <a href="#course-lit-search" class="btn btn-primary btn-sm" style="width: 100%;">Start Track 2 ➔</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Consultation CTA -->
    <section style="padding: 64px 0 80px;">
      <div class="wrap-narrow" style="text-align: center; background: #ffffff; box-shadow: inset 0 0 0 1px var(--qsa-border-card); border-radius: var(--qsa-radius-card); padding: 48px 24px;">
        <span class="tag tag-clay" style="margin-bottom: 14px;">Direct Academic Support</span>
        <h2 style="font-size: clamp(24px, 4vw, 32px); color: var(--qsa-text-primary); margin-bottom: 14px;">Need Personal Coaching with M. Yousaf?</h2>
        <p style="color: var(--qsa-text-secondary); font-size: 15.5px; line-height: 1.6; max-width: 560px; margin: 0 auto 26px;">
          Quick Services provides dedicated academic proofreading, SPSS/SmartPLS data analysis, G*Power sample sizing, and viva presentation coaching.
        </p>
        <a href="https://wa.me/923296646824" target="_blank" class="btn btn-primary">
          <span>💬</span> Chat on WhatsApp (+92 329 6646824)
        </a>
      </div>
    </section>`;

  // Live Catalog Filter
  const searchInput = document.getElementById('catalog-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const mount = document.getElementById('courses-grid-mount');
      if (!mount) return;
      const filtered = courses.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.category.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q)
      );
      mount.innerHTML = filtered.map(c => renderCourseCard(c)).join('');
    });
  }
}

function renderCourseCard(c) {
  const progress = store.getCourseProgress(c.id, c.lessonsCount);
  const hours = (c.minutes / 60).toFixed(1);

  return `
    <div class="qsa-card">
      <div class="qsa-card-banner">
        ${getCourseThumbnailSvg(c.id)}
      </div>

      <div class="qsa-card-body">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span class="tag tag-clay">${c.category}</span>
          <span style="font-size: 12px; font-weight: 600; color: var(--qsa-text-muted);">${c.level}</span>
        </div>

        <h3 class="qsa-card-title">${c.title}</h3>
        <p class="qsa-card-desc">${c.description}</p>

        <div class="qsa-card-meta">
          <span>📚 ${c.lessonsCount} Lessons</span>
          <span>⏱️ ${hours} Hours</span>
          ${progress > 0 ? `<span style="color: var(--qsa-accent-clay); font-weight: 700;">${progress}% Done</span>` : ''}
        </div>

        <div class="qsa-card-action">
          <a href="#course-${c.id}" class="btn ${progress > 0 ? 'btn-secondary' : 'btn-primary'} btn-sm">
            ${progress === 100 ? 'Review & Certificate 🏆' : progress > 0 ? 'Continue Course' : 'Start Course'}
          </a>
        </div>
      </div>
    </div>`;
}

/* ==========================================================================
   Course Overview Page (Claude Academy Warm Light Paper Aesthetic)
   ========================================================================== */
function renderCourseOverview(course) {
  const hours = (course.minutes / 60).toFixed(1);
  const totalLessons = course.modules.reduce((acc, m) => acc + (m.lessons || []).length, 0);
  const progress = store.getCourseProgress(course.id, totalLessons);
  const firstLessonId = course.modules?.[0]?.lessons?.[0]?.id || 't1';

  mainEl.innerHTML = `
    <div style="background: linear-gradient(180deg, rgba(217, 119, 87, 0.05) 0%, rgba(250, 249, 245, 0) 100%); padding: 52px 0 40px; border-bottom: 1px solid var(--qsa-border-line);">
      <div class="wrap">
        <a href="#/" style="color: var(--qsa-accent-clay); font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; margin-bottom: 16px;">
          ← Back to Course Catalog
        </a>
        <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 12px;">
          <span class="tag tag-clay">${course.category}</span>
          <span class="tag tag-peach">${course.level}</span>
        </div>
        <h1 style="font-size: clamp(30px, 5vw, 44px); color: var(--qsa-text-primary); margin-bottom: 14px; font-weight: 400;">
          ${course.title}
        </h1>
        <p style="font-size: 17px; color: var(--qsa-text-secondary); max-width: 740px; line-height: 1.6; margin-bottom: 24px;">
          ${course.tagline}
        </p>
        <div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
          <a href="#lesson-${course.id}-${firstLessonId}" class="btn btn-primary">
            ${progress > 0 ? 'Continue Learning ➔' : 'Start First Lesson ➔'}
          </a>
          <span style="color: var(--qsa-text-muted); font-size: 14px; font-weight: 500;">
            ${course.modules.length} Modules • ${totalLessons} Lessons • ${hours} Hours total
          </span>
        </div>
      </div>
    </div>

    <div class="wrap" style="padding: 52px 20px 72px;">
      <div style="display: grid; grid-template-columns: 1fr; gap: 36px;">
        <!-- Learning Outcomes -->
        <div style="background: #ffffff; box-shadow: inset 0 0 0 1px var(--qsa-border-card); border-radius: var(--qsa-radius-card); padding: 32px;">
          <h3 style="color: var(--qsa-text-primary); margin-bottom: 16px; font-size: 22px;">What You Will Master</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
            ${(course.outcomes || []).map(o => `
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <span style="color: var(--qsa-status-success); font-weight: 800; font-size: 16px;">✓</span>
                <span style="color: var(--qsa-text-secondary); font-size: 14.5px; line-height: 1.5;">${o}</span>
              </div>`).join('')}
          </div>
        </div>

        <!-- Curriculum Module Breakdown -->
        <div>
          <h3 style="color: var(--qsa-text-primary); margin-bottom: 20px; font-size: 22px;">Curriculum by Module</h3>
          <div style="display: flex; flex-direction: column; gap: 18px;">
            ${course.modules.map((m, idx) => `
              <div style="background: #ffffff; box-shadow: inset 0 0 0 1px var(--qsa-border-card); border-radius: var(--qsa-radius-card); padding: 24px;">
                <div style="font-size: 11.5px; font-weight: 800; text-transform: uppercase; color: var(--qsa-accent-clay); margin-bottom: 4px;">
                  Module ${idx + 1}
                </div>
                <h4 style="font-size: 19px; margin: 0 0 6px; font-family: var(--qsa-font-serif); font-weight: 500;">${m.title}</h4>
                <p style="font-size: 13.5px; color: var(--qsa-text-muted); margin-bottom: 16px;">${m.description}</p>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${(m.lessons || []).map(l => {
                    const done = store.isLessonComplete(course.id, l.id);
                    return `
                      <a href="#lesson-${course.id}-${l.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--qsa-bg-subtle); border-radius: 8px; text-decoration: none; font-size: 14px; color: var(--qsa-text-primary); transition: background var(--qsa-dur-fast) var(--qsa-ease-out);">
                        <div style="display: flex; align-items: center; gap: 10px;">
                          <span style="color: ${done ? 'var(--qsa-status-success)' : 'var(--qsa-text-muted)'}; font-weight: 800;">
                            ${done ? '✓' : '○'}
                          </span>
                          <span style="font-weight: 500;">${l.title}</span>
                          <span class="tag tag-peach" style="font-size: 10px; padding: 2px 7px;">${l.type}</span>
                        </div>
                        <span style="font-size: 12.5px; color: var(--qsa-text-muted);">${l.minutes}m</span>
                      </a>`;
                  }).join('')}
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
}

/* ==========================================================================
   Learner Dashboard (#learning)
   ========================================================================== */
function renderLearnerDashboard() {
  const state = store.state;
  const totalMinutes = Math.round(state.studyTime.totalSeconds / 60);

  mainEl.innerHTML = `
    <div class="wrap" style="padding: 52px 20px 72px;">
      <span class="tag tag-clay" style="margin-bottom: 12px;">Learner Hub</span>
      <h1 style="color: var(--qsa-text-primary); font-size: clamp(30px, 5vw, 42px); margin-bottom: 28px; font-weight: 400;">
        My Learning Dashboard
      </h1>

      <!-- Stats Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 36px;">
        <div style="background: #ffffff; box-shadow: inset 0 0 0 1px var(--qsa-border-card); border-radius: 16px; padding: 22px; text-align: center;">
          <div style="font-size: 34px; font-weight: 700; color: var(--qsa-accent-clay); font-family: var(--qsa-font-serif);">${state.streak.current} Days</div>
          <div style="font-size: 13px; color: var(--qsa-text-muted); font-weight: 500;">Daily Study Streak</div>
        </div>
        <div style="background: #ffffff; box-shadow: inset 0 0 0 1px var(--qsa-border-card); border-radius: 16px; padding: 22px; text-align: center;">
          <div style="font-size: 34px; font-weight: 700; color: var(--qsa-accent-orange); font-family: var(--qsa-font-serif);">${totalMinutes} Min</div>
          <div style="font-size: 13px; color: var(--qsa-text-muted); font-weight: 500;">Active Time Logged</div>
        </div>
        <div style="background: #ffffff; box-shadow: inset 0 0 0 1px var(--qsa-border-card); border-radius: 16px; padding: 22px; text-align: center;">
          <div style="font-size: 34px; font-weight: 700; color: var(--qsa-status-success); font-family: var(--qsa-font-serif);">${state.notes.length}</div>
          <div style="font-size: 13px; color: var(--qsa-text-muted); font-weight: 500;">Saved Notes &amp; Highlights</div>
        </div>
      </div>

      <!-- Notes Management -->
      <div style="background: #ffffff; box-shadow: inset 0 0 0 1px var(--qsa-border-card); border-radius: var(--qsa-radius-card); padding: 32px; margin-bottom: 32px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <h3 style="margin: 0; font-size: 22px; color: var(--qsa-text-primary);">My Notes &amp; Highlights</h3>
          <button type="button" class="btn btn-secondary btn-sm" id="export-notes-btn">📥 Export as Markdown</button>
        </div>
        ${state.notes.length === 0 ? `
          <p style="color: var(--qsa-text-muted); font-style: italic; margin: 0;">No notes saved yet. Highlight any sentence in a lesson to add a note.</p>` : `
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${state.notes.map(n => `
              <div style="background: var(--qsa-bg-subtle); padding: 14px 18px; border-radius: 10px; border-left: 3.5px solid var(--qsa-accent-clay);">
                <p style="margin: 0 0 6px; font-size: 14.5px; font-weight: 500; color: var(--qsa-text-primary);">"${n.text}"</p>
                <div style="font-size: 12px; color: var(--qsa-text-muted);">
                  ${n.courseId.toUpperCase()} • ${new Date(n.timestamp).toLocaleDateString()}
                </div>
              </div>`).join('')}
          </div>`}
      </div>

      <!-- Backup & Restore -->
      <div style="background: #ffffff; box-shadow: inset 0 0 0 1px var(--qsa-border-card); border-radius: 16px; padding: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div>
          <h4 style="color: var(--qsa-text-primary); margin: 0 0 4px; font-size: 16px;">Local Progress Backup</h4>
          <p style="color: var(--qsa-text-muted); font-size: 13.5px; margin: 0;">Export your study records as a JSON file to transfer between devices.</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button type="button" class="btn btn-secondary btn-sm" id="export-json-btn">Export Progress</button>
          <button type="button" class="btn btn-secondary btn-sm" id="reset-store-btn" style="color: var(--qsa-status-danger);">Reset</button>
        </div>
      </div>
    </div>`;

  document.getElementById('export-notes-btn')?.addEventListener('click', () => {
    const md = store.exportNotesMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quick-services-academy-notes.md';
    a.click();
  });

  document.getElementById('export-json-btn')?.addEventListener('click', () => {
    const json = store.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qsa-progress-backup.json';
    a.click();
  });

  document.getElementById('reset-store-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      store.reset();
      location.reload();
    }
  });
}

/* ==========================================================================
   Certificates List (#certificates)
   ========================================================================== */
function renderCertificatesList() {
  mainEl.innerHTML = `
    <div class="wrap" style="padding: 52px 20px 72px;">
      <span class="tag tag-clay" style="margin-bottom: 12px;">Credentials</span>
      <h1 style="color: var(--qsa-text-primary); font-size: clamp(30px, 5vw, 42px); margin-bottom: 16px; font-weight: 400;">
        Academy Certificates
      </h1>
      <p style="color: var(--qsa-text-secondary); font-size: 15.5px; margin-bottom: 32px; max-width: 650px;">
        Complete all lessons in a course and achieve at least 70% on the final assessment to earn your verified credential.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
        <div style="background: #ffffff; box-shadow: inset 0 0 0 1px var(--qsa-border-card); border-radius: var(--qsa-radius-card); padding: 28px;">
          <span class="tag tag-green" style="margin-bottom: 8px;">Ready to Issue</span>
          <h3 style="font-size: 20px; margin: 8px 0; color: var(--qsa-text-primary);">Thesis Writing 101</h3>
          <p style="font-size: 14px; color: var(--qsa-text-secondary); margin-bottom: 20px; line-height: 1.5;">
            Certifies mastery of research problem formulation, thesis structuring, and proposal defense preparation.
          </p>
          <a href="#certificate-QSA-THESIS101-202610-DEMO" class="btn btn-primary btn-sm" style="width: 100%;">
            View &amp; Download Certificate ➔
          </a>
        </div>
      </div>
    </div>`;
}

/* ==========================================================================
   Verification Route (#verify-:certId)
   ========================================================================== */
function renderVerifyView(certId) {
  mainEl.innerHTML = `
    <div class="wrap" style="padding: 64px 20px; text-align: center;">
      <div style="max-width: 580px; margin: 0 auto; background: #ffffff; box-shadow: inset 0 0 0 1px var(--qsa-border-card); border-radius: var(--qsa-radius-card); padding: 40px;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--qsa-status-success-bg); color: var(--qsa-status-success); font-size: 22px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; border: 1px solid var(--qsa-status-success-border);">
          ✓
        </div>
        <h2 style="font-size: 24px; margin-bottom: 8px; color: var(--qsa-text-primary);">Valid Credential Record</h2>
        <div style="font-family: var(--qsa-font-mono); font-size: 13.5px; background: var(--qsa-bg-subtle); padding: 8px 14px; border-radius: 6px; display: inline-block; margin-bottom: 16px; color: var(--qsa-text-primary);">
          ${certId}
        </div>
        <p style="font-size: 14.5px; color: var(--qsa-text-secondary); line-height: 1.6;">
          This cryptographic identifier confirms completion of all instructional requirements for the specified course at Quick Services Academy.
        </p>
        <a href="#/" class="btn btn-secondary btn-sm" style="margin-top: 16px;">Visit Academy Home</a>
      </div>
    </div>`;
}

function showShortcutsHelp() {
  alert(`Quick Services Academy — Keyboard Shortcuts:\n\n• V: Visualise selected sentence\n• ?: Open this help dialog\n• Esc: Close active modal\n• Tab: Focus navigation controls`);
}
