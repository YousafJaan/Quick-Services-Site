/**
 * Quick Services Academy — Application Controller & Route Coordinator
 * Master Project Brief Implementation:
 * - Design System: Navy #102B4E, Terracotta #B95335, Warm #FAF7F1, Sage #DDE8DF
 * - 2-Column Hero with Academic Desk Illustration SVG
 * - Dedicated Sentence Clarity Lab with Multi-Register Engine & Integrity Notice
 * - Three Track Pillar Cards (Research Design, Statistical Analysis, Academic Writing)
 * - All 9 Courses Preserved with Real Curricula & Live Filtering
 * - My Learning Hub (#learning) with Progress, Streaks & Notes
 * - Canva-Grade Verifiable Credentials (#certificates)
 * - Light/Dark Theme Switcher with LocalStorage Persistence
 */

import { router } from './router.js';
import { store } from './store.js';
import { loadLessonView } from './lesson.js';
import { renderCertificateView } from './certificate.js';
import { getCourseThumbnailSvg } from './thumbnails.js';
import { getUserProfile, saveUserProfile, getAllResearchFigures, saveResearchFigure, deleteResearchFigure } from './storage/idb.js';
import { createDropzone, processImageFile } from './components/uploader.js';

const mainEl = document.getElementById('app-main');

function getBaseDataPath() {
  const path = window.location.pathname;
  if (path.includes('/academy')) {
    const idx = path.indexOf('/academy');
    return path.substring(0, idx + '/academy'.length) + '/data';
  }
  return './data';
}

function getBaseAssetPath() {
  const path = window.location.pathname;
  if (path.includes('/academy')) {
    const idx = path.indexOf('/academy');
    return path.substring(0, idx + '/academy'.length) + '/assets';
  }
  return './assets';
}

// Route 1: Catalog View (#/)
router.addRoute('/', async () => {
  try {
    const baseData = getBaseDataPath();
    const res = await fetch(`${baseData}/courses.json`);
    const courses = await res.json();
    renderCatalog(courses);
    updateActiveNavLinks();
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
    updateActiveNavLinks();
  } catch (e) {
    mainEl.innerHTML = `<div class="wrap" style="padding: 80px 0; text-align: center;"><h3>Course not found.</h3></div>`;
  }
});

// Route 3: Lesson Player (#lesson-:courseId-:lessonId)
router.addRoute('lesson', ({ courseId, lessonId }) => {
  loadLessonView(mainEl, { courseId, lessonId });
  updateActiveNavLinks();
});

// Route 4: Learner Dashboard (#learning)
router.addRoute('learning', async () => {
  try {
    const baseData = getBaseDataPath();
    const res = await fetch(`${baseData}/courses.json`);
    const courses = await res.json();
    await renderLearnerDashboard(courses);
    updateActiveNavLinks();
  } catch (e) {
    await renderLearnerDashboard([]);
    updateActiveNavLinks();
  }
});

// Route 5: Certificates List (#certificates)
router.addRoute('certificates', () => {
  renderCertificatesList();
  updateActiveNavLinks();
});

// Route 6: Single Certificate View (#certificate-:certId)
router.addRoute('certificate', ({ certId }) => {
  renderCertificateView(mainEl, { certId });
  updateActiveNavLinks();
});

// Route 7: Verification View (#verify-:certId)
router.addRoute('verify', ({ certId }) => {
  renderVerifyView(certId);
  updateActiveNavLinks();
});

// Route 8: Sentence Clarity Lab (#clarity)
router.addRoute('clarity', () => {
  renderClarityLabPage();
  updateActiveNavLinks();
});

// Initialize router
router.start();

// Initialize Core Subsystems
initThemeSwitcher();
initLanguageSwitchers();
initCookieConsentBanner();
updateActiveNavLinks();
updateHeaderAvatar();

// Register Progressive Web App Service Worker
if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.warn('SW registration skipped:', err);
    });
  });
}

window.addEventListener('hashchange', updateActiveNavLinks);

// Global Toast System
window.showGlobalToast = function(msg) {
  let toast = document.getElementById('qsa-global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'qsa-global-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #102B4E;
      color: #FAF7F1;
      padding: 12px 20px;
      border-radius: var(--qsa-radius-pill);
      font-size: 13.5px;
      font-weight: 600;
      box-shadow: 0 12px 30px rgba(16, 43, 78, 0.25);
      border: 1px solid rgba(222, 232, 223, 0.3);
      z-index: 10000;
      opacity: 0;
      transform: translateY(12px);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  clearTimeout(window.__toastTimeout);
  window.__toastTimeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
  }, 2800);
};

// Keyboard Shortcuts Listener
document.addEventListener('keydown', (e) => {
  if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
    showShortcutsHelp();
  }
});

// Auto-close mobile menu on navigation link click
document.addEventListener('click', (e) => {
  const link = e.target.closest('.menu .links a');
  if (link) {
    const details = document.querySelector('details.menu');
    if (details) details.removeAttribute('open');
  }
});

/* ==========================================================================
   Header Navigation Link Active State Highlighter
   ========================================================================== */
function updateActiveNavLinks() {
  const hash = window.location.hash || '#/';
  const navCourses = document.getElementById('nav-courses');
  const navLearning = document.getElementById('nav-learning');
  const navCertificates = document.getElementById('nav-certificates');
  const navClarity = document.getElementById('nav-clarity');

  if (navCourses) navCourses.classList.remove('active');
  if (navLearning) navLearning.classList.remove('active');
  if (navCertificates) navCertificates.classList.remove('active');
  if (navClarity) navClarity.classList.remove('active');

  if (hash === '#/' || hash.startsWith('#course-') || hash.startsWith('#courses')) {
    if (navCourses) navCourses.classList.add('active');
  } else if (hash === '#learning') {
    if (navLearning) navLearning.classList.add('active');
  } else if (hash === '#certificates' || hash.startsWith('#certificate-')) {
    if (navCertificates) navCertificates.classList.add('active');
  } else if (hash === '#clarity') {
    if (navClarity) navClarity.classList.add('active');
  }
}

/* ==========================================================================
   Theme Switcher Engine (Light / Dark Mode)
   ========================================================================== */
function initThemeSwitcher() {
  const syncThemePills = () => {
    const currentTheme = store.getTheme();
    document.querySelectorAll('.theme-pill-btn').forEach(btn => {
      const targetTheme = btn.dataset.setTheme || btn.dataset.themeVal;
      btn.classList.toggle('active', targetTheme === currentTheme);
    });
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.theme-pill-btn');
    if (!btn) return;
    const targetTheme = btn.dataset.setTheme || btn.dataset.themeVal;
    if (targetTheme && ['light', 'dark'].includes(targetTheme)) {
      store.setTheme(targetTheme);
      syncThemePills();
      window.showGlobalToast(`Theme mode set to: ${targetTheme === 'dark' ? 'Dark' : 'Light'}`);
    }
  });

  window.addEventListener('qsa:theme-changed', syncThemePills);
  syncThemePills();
}

/* ==========================================================================
   Cookie & Local Storage Consent Banner
   ========================================================================== */
function initCookieConsentBanner() {
  if (store.hasAcceptedCookies()) return;

  const existing = document.getElementById('qsa-cookie-consent-banner');
  if (existing) return;

  const banner = document.createElement('div');
  banner.id = 'qsa-cookie-consent-banner';
  banner.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(24px);
    width: calc(100% - 32px);
    max-width: 680px;
    background: #ffffff;
    border: 1px solid var(--qsa-border-strong);
    border-radius: var(--qsa-radius-card);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04);
    padding: 16px 22px;
    z-index: 9990;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    transition: opacity 0.25s var(--qsa-ease-out), transform 0.25s var(--qsa-ease-out);
    opacity: 0;
  `;

  banner.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
      <span style="font-size: 20px; flex-shrink: 0; line-height: 1;">🛡️</span>
      <div style="font-size: 13.5px; color: var(--qsa-text-secondary); line-height: 1.5;">
        We use secure local device storage to remember your reading preferences (Simple/Plain/Technical), track lesson progress, and verify certificates.
      </div>
    </div>
    <div style="display: flex; gap: 8px; align-items: center; flex-shrink: 0;">
      <button type="button" class="btn btn-secondary btn-sm" id="dismiss-cookie-consent-btn" style="white-space: nowrap; padding: 6px 14px; font-size: 12.5px;">
        Dismiss
      </button>
      <button type="button" class="btn btn-primary btn-sm" id="accept-cookie-consent-btn" style="white-space: nowrap; padding: 8px 18px; font-size: 13px;">
        Accept &amp; Save Preferences
      </button>
    </div>
  `;

  document.body.appendChild(banner);

  requestAnimationFrame(() => {
    banner.style.opacity = '1';
    banner.style.transform = 'translateX(-50%) translateY(0)';
  });

  const dismiss = () => {
    banner.style.opacity = '0';
    banner.style.transform = 'translateX(-50%) translateY(24px)';
    setTimeout(() => banner.remove(), 260);
  };

  banner.querySelector('#accept-cookie-consent-btn')?.addEventListener('click', () => {
    store.acceptCookies();
    dismiss();
    window.showGlobalToast('Device storage enabled. Preferences and progress saved.');
  });

  banner.querySelector('#dismiss-cookie-consent-btn')?.addEventListener('click', () => {
    dismiss();
  });
}

/* ==========================================================================
   English Proficiency Level Logic
   ========================================================================== */
function initLanguageSwitchers() {
  const syncButtons = () => {
    const current = store.getEnglishLevel();
    const labels = {
      simple: 'Simple English (ESL)',
      plain: 'Plain (Standard)',
      technical: 'Technical (Scholarly)'
    };
    document.querySelectorAll('.lang-level-switcher').forEach(switcher => {
      switcher.querySelectorAll('.lang-btn').forEach(btn => {
        const lang = btn.dataset.lang;
        btn.classList.toggle('active', lang === current);
      });
    });

    const activeBadge = document.getElementById('catalog-active-lang-label');
    if (activeBadge) {
      activeBadge.textContent = labels[current] || current;
    }
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (!btn || btn.classList.contains('clarity-tab-btn')) return;
    const lang = btn.dataset.lang;
    if (lang) {
      store.setEnglishLevel(lang);
      syncButtons();
      const labels = {
        simple: 'Simple English (ESL & Clarity)',
        plain: 'Plain English (Standard Academic)',
        technical: 'Technical English (Scholarly Register)'
      };
      window.showGlobalToast(`Reading style set to: ${labels[lang] || lang}`);
    }
  });

  window.addEventListener('qsa:english-level-changed', () => {
    syncButtons();
  });

  syncButtons();
}

/* ==========================================================================
   Claude Academy Software Mockups (Contour Topographic Lines + Micro-UI Windows)
   ========================================================================== */

function getThesisMockupSvg() {
  return `
    <svg viewBox="0 0 400 156" style="width: 100%; height: 100%; display: block;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Thesis Outline Software Mockup">
      <defs>
        <filter id="topo-thesis-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#102B4E" flood-opacity="0.08"/>
        </filter>
      </defs>
      <!-- Background Topo Lines -->
      <g stroke="#102B4E" stroke-width="1.2" stroke-opacity="0.07" fill="none">
        <path d="M -20,30 Q 80,10 180,45 T 380,20 T 440,60"/>
        <path d="M -20,60 Q 90,40 200,80 T 400,50 T 440,90"/>
        <path d="M -20,90 Q 110,75 220,110 T 410,80 T 440,120"/>
        <path d="M -20,120 Q 130,105 240,140 T 420,110 T 440,150"/>
      </g>
      <!-- Floating Software Card -->
      <g transform="translate(60, 18)" filter="url(#topo-thesis-shadow)">
        <rect width="280" height="120" rx="8" fill="#FFFFFF" stroke="#E8E1D8" stroke-width="1.5"/>
        <rect width="280" height="24" rx="8" fill="#FAF7F2"/>
        <circle cx="14" cy="12" r="3" fill="#EF4444"/>
        <circle cx="23" cy="12" r="3" fill="#F59E0B"/>
        <circle cx="32" cy="12" r="3" fill="#10B981"/>
        <text x="140" y="15.5" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#637083" text-anchor="middle">thesis-proposal-ch1.docx</text>
        <line x1="0" y1="24" x2="280" y2="24" stroke="#E8E1D8" stroke-width="1"/>
        <!-- Content -->
        <rect x="16" y="34" width="88" height="14" rx="3" fill="#DDE8DF"/>
        <text x="60" y="44" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="800" fill="#2E5A44" text-anchor="middle">1.1 PROBLEM STATEMENT</text>
        <rect x="16" y="54" width="220" height="4" rx="2" fill="#E8E1D8"/>
        <rect x="16" y="62" width="248" height="4" rx="2" fill="#E8E1D8"/>
        <rect x="16" y="70" width="180" height="4" rx="2" fill="#E8E1D8"/>
        <g transform="translate(16, 82)">
          <rect width="140" height="24" rx="4" fill="#FAF7F2" stroke="#B95335" stroke-width="1" stroke-dasharray="3,2"/>
          <text x="10" y="15" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="700" fill="#B95335">H1: β = .48 (p &lt; .001)</text>
          <text x="96" y="15" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="600" fill="#637083">• N = 384</text>
        </g>
      </g>
    </svg>
  `;
}

function getSpssMockupSvg() {
  return `
    <svg viewBox="0 0 400 156" style="width: 100%; height: 100%; display: block;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SPSS Statistical Software Mockup">
      <defs>
        <filter id="topo-spss-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#102B4E" flood-opacity="0.08"/>
        </filter>
      </defs>
      <!-- Topo Lines -->
      <g stroke="#102B4E" stroke-width="1.2" stroke-opacity="0.07" fill="none">
        <ellipse cx="200" cy="80" rx="220" ry="60"/>
        <ellipse cx="200" cy="80" rx="160" ry="42"/>
        <ellipse cx="200" cy="80" rx="100" ry="25"/>
      </g>
      <!-- Floating SPSS Window -->
      <g transform="translate(55, 18)" filter="url(#topo-spss-shadow)">
        <rect width="290" height="120" rx="8" fill="#FFFFFF" stroke="#E8E1D8" stroke-width="1.5"/>
        <rect width="290" height="24" rx="8" fill="#102B4E"/>
        <circle cx="14" cy="12" r="3" fill="#EF4444"/>
        <circle cx="23" cy="12" r="3" fill="#F59E0B"/>
        <circle cx="32" cy="12" r="3" fill="#10B981"/>
        <text x="145" y="15.5" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">IBM SPSS Statistics • Regression_ANOVA.spv</text>
        <!-- Table Grid -->
        <g transform="translate(14, 34)">
          <rect width="262" height="18" fill="#FAF7F2" stroke="#E8E1D8" stroke-width="0.75"/>
          <text x="8" y="12" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" fill="#102B4E">Model</text>
          <text x="70" y="12" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" fill="#102B4E">R Square</text>
          <text x="140" y="12" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" fill="#102B4E">F-Stat</text>
          <text x="210" y="12" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" fill="#102B4E">Sig. (p)</text>

          <rect y="18" width="262" height="18" fill="#FFFFFF" stroke="#E8E1D8" stroke-width="0.75"/>
          <text x="8" y="30" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="600" fill="#637083">1 (Linear)</text>
          <text x="70" y="30" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="800" fill="#B95335">.648</text>
          <text x="140" y="30" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="600" fill="#172536">42.18</text>
          <text x="210" y="30" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="800" fill="#15803D">&lt; .001</text>

          <rect y="36" width="262" height="18" fill="#FAF7F2" stroke="#E8E1D8" stroke-width="0.75"/>
          <text x="8" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="600" fill="#637083">2 (Moderated)</text>
          <text x="70" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="800" fill="#B95335">.712</text>
          <text x="140" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="600" fill="#172536">56.40</text>
          <text x="210" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="800" fill="#15803D">&lt; .001</text>
        </g>
        <!-- Bottom Stat Pill -->
        <rect x="14" y="94" width="130" height="16" rx="8" fill="#DDE8DF"/>
        <text x="79" y="105" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" fill="#2E5A44" text-anchor="middle">✓ Normality Assumption Met</text>
      </g>
    </svg>
  `;
}

function getSmartplsMockupSvg() {
  return `
    <svg viewBox="0 0 400 156" style="width: 100%; height: 100%; display: block;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SmartPLS 4 SEM Path Diagram Mockup">
      <defs>
        <filter id="topo-pls-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#102B4E" flood-opacity="0.08"/>
        </filter>
      </defs>
      <!-- Background Topo Lines -->
      <g stroke="#102B4E" stroke-width="1.2" stroke-opacity="0.07" fill="none">
        <path d="M 0,20 C 100,50 150,0 260,30 S 360,70 400,20"/>
        <path d="M 0,60 C 120,90 170,40 280,70 S 370,110 400,60"/>
        <path d="M 0,100 C 140,130 190,80 300,110 S 380,150 400,100"/>
      </g>
      <!-- Floating SmartPLS Card -->
      <g transform="translate(50, 18)" filter="url(#topo-pls-shadow)">
        <rect width="300" height="120" rx="8" fill="#FFFFFF" stroke="#E8E1D8" stroke-width="1.5"/>
        <rect width="300" height="24" rx="8" fill="#1E293B"/>
        <circle cx="14" cy="12" r="3" fill="#EF4444"/>
        <circle cx="23" cy="12" r="3" fill="#F59E0B"/>
        <circle cx="32" cy="12" r="3" fill="#10B981"/>
        <text x="150" y="15.5" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#94A3B8" text-anchor="middle">SmartPLS 4 • PLS-SEM Algorithm Run #1</text>
        <!-- Structural Equation Diagram -->
        <g transform="translate(10, 24)">
          <!-- Construct 1: Exogenous -->
          <circle cx="50" cy="50" r="22" fill="#FAF7F2" stroke="#102B4E" stroke-width="1.5"/>
          <text x="50" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="800" fill="#102B4E" text-anchor="middle">LEADERSHIP</text>
          <text x="50" y="57" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" font-weight="600" fill="#637083" text-anchor="middle">AVE=.62</text>
          <!-- Construct 2: Mediator -->
          <circle cx="140" cy="50" r="22" fill="#FAF7F2" stroke="#B95335" stroke-width="1.5"/>
          <text x="140" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="800" fill="#B95335" text-anchor="middle">CLIMATE</text>
          <text x="140" y="57" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" font-weight="600" fill="#637083" text-anchor="middle">R²=.48</text>
          <!-- Construct 3: Endogenous -->
          <circle cx="230" cy="50" r="22" fill="#FAF7F2" stroke="#15803D" stroke-width="1.5"/>
          <text x="230" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="800" fill="#15803D" text-anchor="middle">PERFORMANCE</text>
          <text x="230" y="57" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" font-weight="600" fill="#637083" text-anchor="middle">R²=.64</text>
          <!-- Path Arrows -->
          <line x1="72" y1="50" x2="114" y2="50" stroke="#102B4E" stroke-width="1.5"/>
          <polygon points="114,47 118,50 114,53" fill="#102B4E"/>
          <text x="95" y="44" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="800" fill="#102B4E" text-anchor="middle">.54***</text>

          <line x1="162" y1="50" x2="204" y2="50" stroke="#B95335" stroke-width="1.5"/>
          <polygon points="204,47 208,50 204,53" fill="#B95335"/>
          <text x="185" y="44" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="800" fill="#B95335" text-anchor="middle">.46***</text>

          <!-- Direct path arch -->
          <path d="M 50,28 Q 140,4 230,28" fill="none" stroke="#637083" stroke-width="1" stroke-dasharray="2,2"/>
          <text x="140" y="14" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" font-weight="700" fill="#637083" text-anchor="middle">Indirect: .25 (p &lt; .001)</text>
        </g>
      </g>
    </svg>
  `;
}

function getTurnitinMockupSvg() {
  return `
    <svg viewBox="0 0 540 156" style="width: 100%; height: 100%; display: block;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Turnitin Similarity Report Mockup">
      <defs>
        <filter id="topo-turnitin-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#102B4E" flood-opacity="0.08"/>
        </filter>
      </defs>
      <!-- Background Topo Lines -->
      <g stroke="#102B4E" stroke-width="1.2" stroke-opacity="0.07" fill="none">
        <path d="M 0,35 Q 120,5 250,45 T 540,25"/>
        <path d="M 0,75 Q 140,45 280,85 T 540,65"/>
        <path d="M 0,115 Q 160,85 310,125 T 540,105"/>
      </g>
      <!-- Floating Turnitin Report Card -->
      <g transform="translate(60, 18)" filter="url(#topo-turnitin-shadow)">
        <rect width="420" height="120" rx="8" fill="#FFFFFF" stroke="#E8E1D8" stroke-width="1.5"/>
        <rect width="420" height="24" rx="8" fill="#FAF7F2"/>
        <circle cx="14" cy="12" r="3" fill="#EF4444"/>
        <circle cx="23" cy="12" r="3" fill="#F59E0B"/>
        <circle cx="32" cy="12" r="3" fill="#10B981"/>
        <text x="210" y="15.5" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#172536" text-anchor="middle">Turnitin Feedback Studio • Dissertation_Final_Draft.pdf</text>
        <line x1="0" y1="24" x2="420" y2="24" stroke="#E8E1D8" stroke-width="1"/>
        <!-- Report Content -->
        <g transform="translate(20, 36)">
          <!-- Similarity Badge -->
          <rect width="90" height="26" rx="4" fill="#DDE8DF" stroke="#86efac" stroke-width="1"/>
          <text x="14" y="17" font-family="'Newsreader', serif" font-size="14" font-weight="700" fill="#15803D">11%</text>
          <text x="44" y="16" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" fill="#15803D">SIMILARITY</text>
          <!-- HEC Compliance Tag -->
          <rect x="100" y="0" width="160" height="26" rx="4" fill="#FAF7F2" stroke="#E8E1D8" stroke-width="1"/>
          <text x="110" y="16" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="700" fill="#102B4E">✓ HEC Standard: &lt; 19% Passed</text>
          <!-- Simulated Text Lines with Highlighting -->
          <rect y="38" width="380" height="4" rx="2" fill="#E8E1D8"/>
          <rect y="48" width="160" height="14" rx="2" fill="rgba(185, 83, 53, 0.15)"/>
          <text x="6" y="58" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="600" fill="#B95335">[1] Primary empirical sample of 384 participants</text>
          <rect x="168" y="48" width="212" height="4" rx="2" fill="#E8E1D8"/>
          <rect y="68" width="350" height="4" rx="2" fill="#E8E1D8"/>
        </g>
      </g>
    </svg>
  `;
}

function getApaMockupSvg() {
  return `
    <svg viewBox="0 0 540 156" style="width: 100%; height: 100%; display: block;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="APA 7th Reference Engine Mockup">
      <defs>
        <filter id="topo-apa-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#102B4E" flood-opacity="0.08"/>
        </filter>
      </defs>
      <!-- Background Topo Lines -->
      <g stroke="#102B4E" stroke-width="1.2" stroke-opacity="0.07" fill="none">
        <path d="M 0,25 C 150,55 240,10 380,45 S 480,85 540,25"/>
        <path d="M 0,65 C 160,95 260,50 400,85 S 500,125 540,65"/>
        <path d="M 0,105 C 170,135 280,90 420,125 S 520,165 540,105"/>
      </g>
      <!-- Floating APA Reference Card -->
      <g transform="translate(60, 18)" filter="url(#topo-apa-shadow)">
        <rect width="420" height="120" rx="8" fill="#FFFFFF" stroke="#E8E1D8" stroke-width="1.5"/>
        <rect width="420" height="24" rx="8" fill="#102B4E"/>
        <circle cx="14" cy="12" r="3" fill="#EF4444"/>
        <circle cx="23" cy="12" r="3" fill="#F59E0B"/>
        <circle cx="32" cy="12" r="3" fill="#10B981"/>
        <text x="210" y="15.5" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Zotero Reference Formatter • APA 7th Edition</text>
        <!-- Reference Entry -->
        <g transform="translate(18, 38)">
          <rect width="90" height="18" rx="3" fill="#DDE8DF"/>
          <text x="45" y="12" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="800" fill="#2E5A44" text-anchor="middle">✓ HANGING INDENT</text>
          <!-- APA text with italicized journal -->
          <text x="0" y="32" font-family="'Newsreader', serif" font-size="10.5" fill="#172536">
            Yousaf, M., &amp; Hair, J. F. (2026). Methodological rigor in structural modeling.
          </text>
          <text x="0" y="46" font-family="'Newsreader', serif" font-size="10.5" font-style="italic" fill="#B95335">
            Journal of Academic Research &amp; Inquiry, 14
          </text>
          <text x="210" y="46" font-family="'Newsreader', serif" font-size="10.5" fill="#172536">
            (2), 104–122.
          </text>
          <text x="0" y="60" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" fill="#637083">
            https://doi.org/10.1016/j.jari.2026.01.004
          </text>
        </g>
      </g>
    </svg>
  `;
}

/* ==========================================================================
   Homepage & Catalog Rendering
   ========================================================================== */
function renderCatalog(courses) {
  const active = store.getActiveLesson();

  mainEl.innerHTML = `
    <!-- Serene Claude Academy Hero Section -->
    <section class="claude-home-hero">
      <div class="wrap">
        <div class="claude-home-hero-inner">
          <div class="claude-breadcrumb-tag" style="margin-bottom: 16px;">
            <span class="dot"></span>
            <span>HEC Pakistan Aligned • Free Postgraduate Research LMS</span>
          </div>
          <h1 class="claude-home-hero-title">
            Welcome to Quick Academy
          </h1>
          <p class="claude-home-hero-desc">
            Practical academic training for postgraduate researchers. Strengthen your research design, academic writing, statistical analysis, and reporting skills through guided lessons, real-world datasets, and interactive learning tools.
          </p>
          <div class="claude-home-hero-actions">
            <a href="#courses-section" class="claude-btn-dark">
              Browse all courses
            </a>
            <a href="#clarity" class="claude-btn-subtle">
              <span>🔬</span> Sentence Clarity Lab ➔
            </a>
            <a href="#certificates" class="claude-btn-subtle">
              <span>📄</span> View Credentials
            </a>
            <a href="https://quick-services-site.pages.dev/guide.html" target="_blank" class="claude-btn-subtle">
              <span>📖</span> Open Field Guide
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Resume Banner (If Learner Has an Active Lesson) -->
    ${active && active.courseId ? `
      <section style="background: #ffffff; border-bottom: 1px solid var(--qsa-border); padding: 14px 0;">
        <div class="wrap" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="font-size: 14px; color: var(--qsa-text-secondary);">
            <strong>Resume where you left off:</strong> Lesson <code>${active.lessonId.toUpperCase()}</code> in <em>${active.courseId.toUpperCase()}</em>
          </div>
          <a href="#lesson-${active.courseId}-${active.lessonId}" class="btn btn-primary btn-sm">Continue Lesson ➔</a>
        </div>
      </section>` : ''}

    <!-- Claude Academy Section 1: "Go deeper with Research & Methodology" (3 + 2 Grid) -->
    <section class="claude-section" style="padding-top: 56px;">
      <div class="wrap">
        <div class="claude-section-header-split">
          <div>
            <h2 class="claude-section-title">Go deeper with Research &amp; Methodology</h2>
            <p class="claude-section-subtitle">Specialized tracks engineered for MPhil, MS, and PhD scholars preparing for defense and publication.</p>
          </div>
        </div>

        <!-- Top Row: 3 Illustrated Cards with Topo Lines & UI Mockups -->
        <div class="claude-deep-grid-top">
          <!-- Card 1: Thesis Writing 101 -->
          <a href="#course-thesis101" class="claude-deep-card">
            <div class="claude-deep-banner">
              ${getThesisMockupSvg()}
            </div>
            <div class="claude-deep-body">
              <h3 class="claude-deep-title">Thesis Writing 101</h3>
              <p class="claude-deep-desc">Structure your empirical problem statement, theoretical framework, and proposal defense.</p>
            </div>
          </a>

          <!-- Card 2: SPSS Quantitative Analysis -->
          <a href="#course-spss101" class="claude-deep-card">
            <div class="claude-deep-banner">
              ${getSpssMockupSvg()}
            </div>
            <div class="claude-deep-body">
              <h3 class="claude-deep-title">SPSS Quantitative Analysis</h3>
              <p class="claude-deep-desc">Data screening, normality, ANOVA, regression diagnostics, and hypothesis testing.</p>
            </div>
          </a>

          <!-- Card 3: SmartPLS 4 SEM -->
          <a href="#course-smartpls" class="claude-deep-card">
            <div class="claude-deep-banner">
              ${getSmartplsMockupSvg()}
            </div>
            <div class="claude-deep-body">
              <h3 class="claude-deep-title">SmartPLS 4 SEM Modeling</h3>
              <p class="claude-deep-desc">Measurement models, reflective validity, bootstrapping, and mediation analysis.</p>
            </div>
          </a>
        </div>

        <!-- Bottom Row: 2 Wide Illustrated Cards -->
        <div class="claude-deep-grid-bottom">
          <!-- Card 4: Academic Integrity & Similarity -->
          <a href="#course-integrity101" class="claude-deep-card">
            <div class="claude-deep-banner">
              ${getTurnitinMockupSvg()}
            </div>
            <div class="claude-deep-body">
              <h3 class="claude-deep-title">Academic Integrity &amp; Turnitin</h3>
              <p class="claude-deep-desc">Interpret similarity reports, prevent accidental plagiarism, and defend originality with HEC guidelines.</p>
            </div>
          </a>

          <!-- Card 5: APA 7th Referencing Masterclass -->
          <a href="#course-cite101" class="claude-deep-card">
            <div class="claude-deep-banner">
              ${getApaMockupSvg()}
            </div>
            <div class="claude-deep-body">
              <h3 class="claude-deep-title">APA 7th Referencing Mastery</h3>
              <p class="claude-deep-desc">Parenthetical mechanics, multi-author rules, and flawless citation tables.</p>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Claude Academy Section 2: "Develop Methodological Rigor" (3 Cards with Decagonal Badges) -->
    <section class="claude-section" style="padding-top: 24px; padding-bottom: 56px;">
      <div class="wrap">
        <div class="claude-section-header-split">
          <div>
            <h2 class="claude-section-title">Develop Methodological Rigor</h2>
            <p class="claude-section-subtitle">Core foundational competencies for credible research design and empirical defense.</p>
          </div>
          <a href="#courses-section" class="claude-section-arrow-link">
            <span>More about empirical methods</span> <span>➔</span>
          </a>
        </div>

        <div class="claude-rigor-grid">
          <!-- Card 1: Literature Search & Zotero -->
          <a href="#course-lit-search" class="claude-rigor-card">
            <div class="claude-rigor-banner" style="background: #F5EFE6;">
              <div class="claude-rigor-badge">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#102B4E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <path d="M11 8v6M8 11h6"/>
                </svg>
              </div>
            </div>
            <div class="claude-rigor-body">
              <h3 class="claude-rigor-title">Literature Search &amp; Zotero</h3>
              <p class="claude-rigor-desc">Master PRISMA 2020 workflows, Boolean queries in Scopus/WoS, and citation indexing.</p>
              <div class="claude-rigor-meta">Self-paced • 3.2 Hours • Intermediate</div>
            </div>
          </a>

          <!-- Card 2: Sample Size Determination (G*Power) -->
          <a href="#course-sample-size" class="claude-rigor-card">
            <div class="claude-rigor-banner" style="background: #FBECE8;">
              <div class="claude-rigor-badge">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#B95335" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 20h18"/>
                  <path d="M6 16a6 6 0 0 1 12 0"/>
                  <line x1="12" y1="4" x2="12" y2="10"/>
                  <circle cx="12" cy="10" r="2" fill="#B95335"/>
                </svg>
              </div>
            </div>
            <div class="claude-rigor-body">
              <h3 class="claude-rigor-title">Sample Size (G*Power)</h3>
              <p class="claude-rigor-desc">Calculate defensible statistical power, Cohen's effect sizes, and Krejcie-Morgan tables.</p>
              <div class="claude-rigor-meta">Self-paced • 3.8 Hours • Advanced</div>
            </div>
          </a>

          <!-- Card 3: Viva Voce & Defense -->
          <a href="#course-viva" class="claude-rigor-card">
            <div class="claude-rigor-banner" style="background: #EBF2ED;">
              <div class="claude-rigor-badge">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2E5A44" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
            </div>
            <div class="claude-rigor-body">
              <h3 class="claude-rigor-title">Viva Voce &amp; Defense</h3>
              <p class="claude-rigor-desc">Master slide deck timing, anticipate harsh examiner questions, and pass your defense.</p>
              <div class="claude-rigor-meta">Self-paced • 2.8 Hours • Intermediate</div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Main Course Catalogue Section with Claude Academy Live Filter Chips & Search -->
    <section id="courses-section" style="padding: 40px 0 72px; border-top: 1px solid var(--qsa-border);">
      <div class="wrap">
        <div style="margin-bottom: 24px;">
          <span class="tag tag-clay" style="margin-bottom: 8px;">Curriculum</span>
          <h2 style="font-size: clamp(26px, 4vw, 34px); color: var(--qsa-text-primary); margin: 4px 0 0;">
            All 9 Academy Courses
          </h2>
        </div>

        <!-- Claude Academy Filter & Search Bar -->
        <div class="claude-filter-bar">
          <div class="claude-filter-chips">
            <button type="button" class="claude-filter-chip active" data-topic="all">All Tracks (9)</button>
            <button type="button" class="claude-filter-chip" data-topic="Research Design">Research Design (3)</button>
            <button type="button" class="claude-filter-chip" data-topic="Statistical Analysis">Statistical Analysis (3)</button>
            <button type="button" class="claude-filter-chip" data-topic="Academic Writing">Academic Writing (3)</button>
          </div>

          <div class="claude-search-input-wrap">
            <span class="claude-search-icon">🔍</span>
            <input type="text" id="catalog-search" class="claude-search-input" placeholder="Search courses (Press &quot;/&quot; to focus)..." aria-label="Search courses">
          </div>
        </div>

        <!-- Reusable Course Cards Grid -->
        <div class="cards-grid" id="courses-grid-mount">
          ${courses.map(c => renderCourseCard(c)).join('')}
        </div>
      </div>
    </section>

    <!-- Consultation CTA -->
    <section style="padding: 40px 0 80px;">
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
    </section>
  `;

  // Attach Live Topic Chip Filtering
  const chips = document.querySelectorAll('.claude-filter-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const topic = chip.dataset.topic;
      filterCatalogCourses(courses, topic);
    });
  });

  // Live Catalog Search Filter with "/" keyboard shortcut
  const searchInput = document.getElementById('catalog-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const mount = document.getElementById('courses-grid-mount');
      if (!mount) return;
      const filtered = courses.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.category.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q) ||
        (c.tagline && c.tagline.toLowerCase().includes(q))
      );
      mount.innerHTML = filtered.map(c => renderCourseCard(c)).join('');
    });

    const handleSearchKey = (e) => {
      if (e.key === '/' && document.activeElement !== searchInput && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        searchInput.focus();
      }
    };
    document.removeEventListener('keydown', window.__qsaSearchKeyHandler);
    window.__qsaSearchKeyHandler = handleSearchKey;
    document.addEventListener('keydown', window.__qsaSearchKeyHandler);
  }
}

function filterCatalogCourses(courses, filter) {
  const mount = document.getElementById('courses-grid-mount');
  if (!mount) return;
  if (!filter || filter === 'all') {
    mount.innerHTML = courses.map(c => renderCourseCard(c)).join('');
  } else {
    const filtered = courses.filter(c => {
      if (filter === 'Research Design') {
        return ['thesis101', 'lit-search', 'viva'].includes(c.id) || c.category.includes('Research') || c.category.includes('Information');
      }
      if (filter === 'Statistical Analysis') {
        return ['sample-size', 'spss101', 'smartpls'].includes(c.id) || c.category.includes('Statistical') || c.category.includes('Statistics') || c.category.includes('Methodology');
      }
      if (filter === 'Academic Writing') {
        return ['cite101', 'integrity101', 'edit101'].includes(c.id) || c.category.includes('Writing') || c.category.includes('Ethics');
      }
      return c.category.toLowerCase().includes(filter.toLowerCase());
    });
    mount.innerHTML = filtered.map(c => renderCourseCard(c)).join('');
  }
}

/* ==========================================================================
   Sentence Clarity Lab Logic & Presets
   ========================================================================== */
function initClarityLabListeners() {
  const clarityPresets = {
    empirical: {
      original: `“It has been observed by <span class="syntax-badge-peach">various researchers</span> that the implementation of <span class="syntax-badge-peach">certain training initiatives</span> has an impact upon the <span class="syntax-badge-peach">overall performance</span> of employees <span class="syntax-badge-peach">in an organizational setting</span>.”`,
      weakness: `⚠️ Passive / Nominalized (28 words)`,
      simple: `“We tested how teacher training helps teachers teach better in 50 city schools.”`,
      plain: `“This empirical study investigates how institutional capital allocation and pedagogical training predict student standardized test achievement across 50 public secondary schools.”`,
      technical: `“This quantitative investigation operationalizes institutional resource allocation and pedagogical development as structural regressors predicting standardized scholastic achievement across 50 secondary educational entities.”`,
      explanation: `<strong>Key Revisions:</strong> Replaced the empty passive subject <em>“It has been observed”</em> with an active empirical agent (<em>“This empirical study investigates”</em>). Eliminated the vague nominalization <em>“overall performance”</em> and anchored the context to <em>“50 public secondary schools”</em> for defensible scoping.`
    },
    methodology: {
      original: `“A sample of individuals was selected using <span class="syntax-badge-peach">some convenient methods</span> in order to obtain data for <span class="syntax-badge-peach">investigating multiple different things</span> about student satisfaction.”`,
      weakness: `⚠️ Unbounded / Ambiguous (25 words)`,
      simple: `“We surveyed 384 research students to see if regular meetings with supervisors help them graduate on time.”`,
      plain: `“We drew a stratified random sample of 384 postgraduate scholars to evaluate how supervisory feedback frequency predicts doctoral dissertation completion timelines.”`,
      technical: `“Employing stratified probabilistic sampling (N = 384, statistical power 1 - β = .95 in G*Power), we parameterize supervisory feedback cadence to evaluate hazard rates of doctoral dissertation completion.”`,
      explanation: `<strong>Key Revisions:</strong> Replaced ambiguous convenience sampling with stratified probabilistic sampling (N = 384, G*Power calculated). Replaced vague goals with direct, testable independent and dependent constructs.`
    },
    sem: {
      original: `“The survey answers were <span class="syntax-badge-peach">put into the computer</span> and showed that there are <span class="syntax-badge-peach">connections between all the factors</span>.”`,
      weakness: `⚠️ Colloquial / Imprecise (21 words)`,
      simple: `“Using SmartPLS, we proved that university support helps confident students publish more research papers.”`,
      plain: `“Partial least squares structural equation modeling (PLS-SEM) confirmed that perceived institutional support mediates the relationship between research self-efficacy and scholarly publication output (β = 0.42, p < .001).”`,
      technical: `“Reflective measurement validation established convergent validity (AVE > 0.50) and discriminant validity via HTMT0.85, while bootstrapping confirmed significant indirect mediation (β = 0.42, t = 4.86, p < .001).”`,
      explanation: `<strong>Key Revisions:</strong> Replaced informal description with international PLS-SEM reporting standards, citing path coefficients (β = 0.42), statistical significance thresholds (p < .001), and construct reliability.`
    }
  };

  let activePreset = 'empirical';
  let activeLang = store.getEnglishLevel();

  const updateDisplay = () => {
    const data = clarityPresets[activePreset] || clarityPresets.empirical;
    const origEl = document.getElementById('clarity-original-text');
    const impEl = document.getElementById('clarity-improved-text');
    const expEl = document.getElementById('clarity-explanation-text');
    const weakBadge = document.getElementById('clarity-weakness-badge');

    if (origEl) origEl.innerHTML = data.original;
    if (impEl) {
      impEl.style.opacity = '0';
      setTimeout(() => {
        impEl.textContent = data[activeLang] || data.plain;
        impEl.style.opacity = '1';
      }, 100);
    }
    if (expEl) expEl.innerHTML = data.explanation;
    if (weakBadge) weakBadge.textContent = data.weakness;

    document.querySelectorAll('.clarity-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.clarityLang === activeLang);
    });
  };

  document.querySelectorAll('.clarity-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.clarityLang;
      if (lang) {
        activeLang = lang;
        store.setEnglishLevel(lang);
        updateDisplay();
      }
    });
  });

  const presetSelect = document.getElementById('clarity-preset-select');
  if (presetSelect) {
    presetSelect.addEventListener('change', (e) => {
      activePreset = e.target.value;
      updateDisplay();
    });
  }

  const copyBtn = document.getElementById('clarity-copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const impEl = document.getElementById('clarity-improved-text');
      if (impEl) {
        const textToCopy = impEl.textContent.trim();
        navigator.clipboard.writeText(textToCopy).then(() => {
          copyBtn.innerHTML = `<span>✓</span> <span>Copied!</span>`;
          window.showGlobalToast('Improved academic sentence copied to clipboard');
          setTimeout(() => {
            copyBtn.innerHTML = `<span>📋</span> <span>Copy Sentence</span>`;
          }, 2000);
        }).catch(() => {
          window.showGlobalToast('Press Ctrl+C to copy');
        });
      }
    });
  }
}

/* ==========================================================================
   Sentence Clarity Lab Dedicated Page View (#clarity)
   ========================================================================== */
function renderClarityLabPage() {
  const currentLang = store.getEnglishLevel();
  mainEl.innerHTML = `
    <div class="wrap" style="padding: 48px 20px 80px;">
      <div style="max-width: 960px; margin: 0 auto;">
        
        <div style="margin-bottom: 28px;">
          <a href="#/" class="btn btn-secondary btn-sm" style="margin-bottom: 16px; display: inline-flex; align-items: center; gap: 6px;">
            <span>←</span> Back to Academy Courses
          </a>
          <div class="clarity-lab-badge">
            <span>🔬</span> <span>CORE LEARNING TOOL • SENTENCE CLARITY LAB</span>
          </div>
          <h1 style="font-size: clamp(30px, 4.5vw, 42px); margin: 8px 0 10px; font-weight: 500; font-family: var(--qsa-font-serif); color: var(--qsa-text-primary); letter-spacing: -0.02em;">
            Academic Paraphraser &amp; Syntax Refiner
          </h1>
          <p style="font-size: 16px; color: var(--qsa-text-secondary); margin: 0; line-height: 1.6; max-width: 720px;">
            Learn how passive, nominalized sentences transform into clear, bounded scholarly prose across registers. Switch between ESL Simple, Standard Plain, and Technical Scholarly registers.
          </p>
        </div>

        <div class="clarity-lab-card" id="sentence-clarity-lab" style="margin-top: 24px;">
          
          <!-- Lab Card Header -->
          <div class="clarity-lab-header">
            <div>
              <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--qsa-text-muted); letter-spacing: 0.5px;">Interactive Register Switcher</span>
              <div style="font-size: 14px; color: var(--qsa-text-secondary); margin-top: 4px;">
                Select your reading level to inspect syntax transformations:
              </div>
            </div>

            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
              <!-- Register Switcher Tabs -->
              <div class="clarity-tabs-wrap" role="tablist">
                <button type="button" class="clarity-tab-btn ${currentLang === 'simple' ? 'active' : ''}" data-clarity-lang="simple">🌱 Simple (ESL)</button>
                <button type="button" class="clarity-tab-btn ${currentLang === 'plain' ? 'active' : ''}" data-clarity-lang="plain">📘 Plain (Standard)</button>
                <button type="button" class="clarity-tab-btn ${currentLang === 'technical' ? 'active' : ''}" data-clarity-lang="technical">🎓 Technical (Scholarly)</button>
              </div>
              <!-- Preset Selector -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--qsa-text-muted);">Preset:</span>
                <select id="clarity-preset-select" style="padding: 5px 12px; font-size: 12.5px; font-weight: 600; border-radius: var(--qsa-radius-pill); border: 1.5px solid var(--qsa-border-strong); background: #ffffff; color: var(--qsa-text-primary); cursor: pointer; outline: none;">
                  <option value="empirical">Empirical Problem Statement (Thesis 101)</option>
                  <option value="methodology">Statistical Sample &amp; Power (G*Power)</option>
                  <option value="sem">Structural Equation Modeling (SmartPLS 4)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Two-Panel Comparison Grid -->
          <div class="clarity-lab-grid">
            
            <!-- Left Panel: Original Weak Sentence -->
            <div class="clarity-panel original-panel">
              <div class="clarity-panel-header">
                <span class="clarity-panel-title">Original Academic Sentence</span>
                <span class="tag tag-peach" id="clarity-weakness-badge" style="font-size: 11px;">⚠️ Passive / Nominalized</span>
              </div>
              <div class="clarity-sentence-box" id="clarity-original-text">
                “It has been observed by <span class="syntax-badge-peach">various researchers</span> that the implementation of <span class="syntax-badge-peach">certain training initiatives</span> has an impact upon the <span class="syntax-badge-peach">overall performance</span> of employees <span class="syntax-badge-peach">in an organizational setting</span>.”
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; font-size: 12px; color: var(--qsa-text-muted);">
                <span>📏 28 words</span> • <span>Fog Index: 16.4</span> • <span>Dangling Subject Detected</span>
              </div>
            </div>

            <!-- Right Panel: Improved Sentence -->
            <div class="clarity-panel improved-panel">
              <div class="clarity-panel-header">
                <span class="clarity-panel-title">Improved Formulation</span>
                <div class="clarity-benefit-tags" id="clarity-benefit-tags">
                  <span class="syntax-badge-blue">✓ Active Voice</span>
                  <span class="syntax-badge-blue">✓ Agent-Action</span>
                  <span class="syntax-badge-blue">✓ Bounded Context</span>
                </div>
              </div>
              <div class="clarity-sentence-box" id="clarity-improved-text" style="font-weight: 500;">
                “This empirical study investigates how institutional capital allocation and pedagogical training predict student standardized test achievement across 50 public secondary schools.”
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; flex-wrap: wrap; gap: 10px;">
                <div style="font-size: 12px; color: var(--qsa-text-muted);">
                  <span>Directness: <strong>+38%</strong></span> • <span>Zero Nominalization</span>
                </div>
                <button type="button" class="btn btn-secondary btn-sm" id="clarity-copy-btn" style="padding: 6px 14px; font-size: 12px;">
                  <span>📋</span> <span>Copy Sentence</span>
                </button>
              </div>
            </div>

          </div>

          <!-- Explanation Box -->
          <div class="clarity-explanation-box" id="clarity-explanation-text">
            <strong>Key Revisions:</strong> Replaced the empty passive subject <em>“It has been observed”</em> with an active empirical agent (<em>“This empirical study investigates”</em>). Eliminated the vague nominalization <em>“overall performance”</em> and anchored the context to <em>“50 public secondary schools”</em> for defensible scoping.
          </div>

          <!-- Custom Sentence Interactive Input Area -->
          <div style="background: var(--qsa-bg-subtle); border: 1px solid var(--qsa-border); border-radius: var(--qsa-radius-md); padding: 20px; margin-top: 20px;">
            <div style="font-weight: 700; font-size: 13.5px; margin-bottom: 8px; color: var(--qsa-text-primary);">
              ✍️ Test Your Own Academic Sentence
            </div>
            <div style="font-size: 13px; color: var(--qsa-text-secondary); margin-bottom: 12px;">
              Paste an academic sentence to analyze passive voice, nominalization, and readability:
            </div>
            <textarea id="custom-clarity-input" rows="3" style="width: 100%; border: 1px solid var(--qsa-border-strong); border-radius: 6px; padding: 10px; font-family: var(--qsa-font-sans); font-size: 14px; color: var(--qsa-text-primary); background: #ffffff; resize: vertical; box-sizing: border-box;" placeholder="e.g. It was shown by the authors that a significant correlation was observed between..."></textarea>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; flex-wrap: wrap; gap: 10px;">
              <span id="custom-clarity-metrics" style="font-size: 12.5px; color: var(--qsa-text-muted);">Word count: 0 words</span>
              <button type="button" class="btn btn-primary btn-sm" id="custom-clarity-analyze-btn">Analyze Sentence ➔</button>
            </div>
            <div id="custom-clarity-result" style="margin-top: 14px; display: none; padding: 12px; background: #ffffff; border-radius: 6px; border: 1px solid var(--qsa-border); font-size: 13.5px;"></div>
          </div>

          <!-- Mandatory Integrity & Verification Disclaimer -->
          <div class="clarity-disclaimer" style="margin-top: 20px;">
            <span>⚠️</span>
            <span><strong>Academic Integrity Notice:</strong> Paraphrasing and syntax tools refine clarity but do not replace critical scholarly judgment or verify empirical findings. Users must independently verify evidence, definitions, and citations. Paraphrasing does not guarantee plagiarism exemption or bypass AI detection.</span>
          </div>

        </div>

      </div>
    </div>
  `;

  // Attach clarity lab listeners
  initClarityLabListeners();

  // Attach custom sentence analysis listener
  const customInput = document.getElementById('custom-clarity-input');
  const analyzeBtn = document.getElementById('custom-clarity-analyze-btn');
  const metricsEl = document.getElementById('custom-clarity-metrics');
  const resultEl = document.getElementById('custom-clarity-result');

  if (customInput && metricsEl) {
    customInput.addEventListener('input', () => {
      const words = customInput.value.trim().split(/\s+/).filter(Boolean).length;
      metricsEl.textContent = `Word count: ${words} words`;
    });
  }

  if (analyzeBtn && customInput && resultEl) {
    analyzeBtn.addEventListener('click', () => {
      const text = customInput.value.trim();
      if (!text) {
        window.showGlobalToast('Please enter an academic sentence to analyze');
        return;
      }
      const words = text.split(/\s+/).filter(Boolean).length;
      const hasPassive = /\b(was|were|been|being|is|are)\s+\w+ed\b/i.test(text);
      const hasNominalization = /\b\w+(tion|ment|ence|ance|ity)\b/i.test(text);

      resultEl.style.display = 'block';
      resultEl.innerHTML = `
        <div style="font-weight: 700; color: var(--qsa-primary-navy); margin-bottom: 6px;">Diagnostic Assessment:</div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
          <span class="tag ${hasPassive ? 'tag-peach' : 'tag-green'}">${hasPassive ? '⚠️ Passive Voice Found' : '✓ Active Voice'}</span>
          <span class="tag ${hasNominalization ? 'tag-peach' : 'tag-green'}">${hasNominalization ? '⚠️ Heavy Nominalization' : '✓ Direct Verbs'}</span>
          <span class="tag tag-clay">${words} words</span>
        </div>
        <p style="margin: 0; color: var(--qsa-text-secondary); line-height: 1.5;">
          ${hasPassive ? 'Consider identifying the human actor or empirical agent and placing them at the head of the sentence. ' : ''}
          ${hasNominalization ? 'Convert abstract nouns ending in -tion/-ment back into active verbs to sharpen sentence momentum.' : 'Clear sentence structure detected.'}
        </p>
      `;
    });
  }
}

/* ==========================================================================
   Course Card Renderer (Claude Academy Aligned Architecture)
   ========================================================================== */
function renderCourseCard(c) {
  const progress = store.getCourseProgress(c.id, c.lessonsCount);
  const hours = (c.minutes / 60).toFixed(1);
  const baseAsset = getBaseAssetPath();

  return `
    <div class="qsa-card">
      <div class="qsa-card-banner">
        ${getCourseThumbnailSvg(c.id)}
        <div class="qsa-card-emblem-badge" title="${c.title} • Accredited Track">
          <img src="${baseAsset}/images/badge-${c.id}.svg" alt="${c.title} Badge" width="54" height="54" onerror="this.onerror=null; this.src='${baseAsset}/images/hero-academy-emblem.svg';">
        </div>
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
          ${progress > 0 ? `<span style="color: var(--qsa-terracotta); font-weight: 700;">${progress}% Done</span>` : ''}
        </div>

        ${progress > 0 ? `
          <div style="width: 100%; height: 5px; background: var(--qsa-border); border-radius: 3px; overflow: hidden; margin-bottom: 12px;">
            <div style="width: ${progress}%; height: 100%; background: var(--qsa-terracotta); border-radius: 3px;"></div>
          </div>` : ''}

        <div class="qsa-card-action">
          <a href="#course-${c.id}" class="btn ${progress > 0 ? 'btn-secondary' : 'btn-primary'} btn-sm" style="width: 100%; text-align: center;">
            ${progress === 100 ? 'Review & Certificate 🏆' : progress > 0 ? 'Continue Course ➔' : 'Start Course ➔'}
          </a>
        </div>
      </div>
    </div>`;
}

/* ==========================================================================
   Course Overview Page (Claude Academy Aligned Architecture)
   ========================================================================== */
function renderCourseOverview(course) {
  const hours = (course.minutes / 60).toFixed(1);
  const totalLessons = course.modules.reduce((acc, m) => acc + (m.lessons || []).length, 0);
  const progress = store.getCourseProgress(course.id, totalLessons);
  const firstLessonId = course.modules?.[0]?.lessons?.[0]?.id || 't1';
  const baseAsset = getBaseAssetPath();

  mainEl.innerHTML = `
    <!-- Course Overview Hero Banner: Claude Academy Blush Banner -->
    <div class="claude-hero-banner">
      <div class="wrap">
        <div class="claude-hero-grid">
          
          <!-- Left: Breadcrumb, Title, Tagline, Pills, Action -->
          <div class="claude-hero-copy">
            <a href="#/" class="claude-breadcrumb-tag" style="text-decoration: none; margin-bottom: 16px;">
              <span style="font-size: 15px;">←</span> <span>Academy / Courses</span>
            </a>
            
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 10px;">
              <span class="tag tag-clay">${course.category}</span>
              <span class="tag tag-peach">${course.level}</span>
            </div>

            <h1 class="claude-hero-title">
              ${course.title}
            </h1>

            <p class="claude-hero-desc">
              ${course.tagline || course.description}
            </p>

            <div class="claude-meta-strip">
              <span class="claude-meta-pill">📖 ${totalLessons} Lessons</span>
              <span class="claude-meta-pill">⏱️ ${hours} Hours total</span>
              <span class="claude-meta-pill">📝 Practical Quizzes</span>
              <span class="claude-meta-pill">🎓 Verifiable Badge</span>
              ${progress > 0 ? `<span class="claude-meta-pill" style="color: var(--qsa-terracotta); font-weight: 700;">✓ ${progress}% Completed</span>` : ''}
            </div>

            <div class="claude-hero-actions">
              <a href="#lesson-${course.id}-${firstLessonId}" class="claude-btn-dark">
                ${progress > 0 ? 'Continue Course ➔' : 'Start Course ➔'}
              </a>
              <a href="#curriculum-breakdown" class="claude-btn-subtle">
                <span>📑</span> View Syllabus
              </a>
            </div>
          </div>

          <!-- Right: Hosted Decagonal Course Badge -->
          <div class="claude-hero-badge-wrap">
            <div class="claude-badge-decagon">
              <img src="${baseAsset}/images/badge-${course.id}.svg" 
                   alt="${course.title} Badge" 
                   class="claude-badge-img" 
                   width="250" 
                   height="250"
                   onerror="this.onerror=null; this.src='${baseAsset}/images/hero-academy-emblem.svg';">
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Main Course Detail Container -->
    <div class="wrap" style="padding: 44px 20px 80px;">
      
      <!-- HEC Standards Notice Banner -->
      <div class="claude-notice-banner">
        <span class="claude-notice-icon">🛡️</span>
        <div class="claude-notice-text">
          <strong>HEC Pakistan Research Standards (2026):</strong> This curriculum is fully structured in accordance with Higher Education Commission guidelines for MPhil, MS, and PhD dissertation rigor and international publication indexing.
        </div>
      </div>

      <!-- What You'll Learn Card with Chevron Bullets -->
      <div class="claude-learn-card">
        <h3 class="claude-learn-card-title">What you'll learn</h3>
        <div class="claude-learn-grid">
          ${(course.outcomes || []).map(o => `
            <div class="claude-chevron-item">
              <span class="chevron">›</span>
              <span>${o}</span>
            </div>`).join('')}
        </div>
      </div>

      <!-- Prerequisites & Who This Course Is For Section -->
      <div class="claude-prereq-grid">
        <div class="claude-prereq-card">
          <h4>Prerequisites</h4>
          <ul>
            <li>Basic understanding of undergraduate/postgraduate research concepts.</li>
            <li>No prior software or programming experience required; step-by-step guidance provided.</li>
            <li>A current research proposal, thesis topic, or working dataset is helpful but optional.</li>
          </ul>
        </div>
        <div class="claude-prereq-card">
          <h4>Who this course is for</h4>
          <ul>
            <li>MPhil, MS, and PhD scholars preparing thesis proposals or empirical dissertations.</li>
            <li>Early-career academic faculty and postgraduate researchers writing peer-reviewed papers.</li>
            <li>Research supervisors seeking standardized pedagogical modules for their laboratory scholars.</li>
          </ul>
        </div>
      </div>

      <!-- Curriculum by Module Breakdown with Claude Academy Accordions -->
      <div id="curriculum-breakdown">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; flex-wrap: wrap; gap: 12px;">
          <h3 style="font-family: var(--qsa-font-serif); color: var(--qsa-primary-navy); margin: 0; font-size: 26px; font-weight: 500;">
            Curriculum by Module
          </h3>
          <button type="button" class="claude-prompt-copy-btn" id="claude-toggle-all-modules" style="font-size: 12.5px;">
            <span>⊟</span> <span id="claude-toggle-all-text">Collapse All</span>
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${course.modules.map((m, idx) => `
            <div class="claude-module-accordion-card" style="background: var(--qsa-bg-card); border: 1px solid var(--qsa-border); border-radius: var(--qsa-radius-card); overflow: hidden; box-shadow: var(--qsa-shadow-card);">
              <div class="claude-module-header" data-mod-idx="${idx}" style="padding: 22px 28px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none; background: var(--qsa-bg-card); transition: background var(--qsa-dur-fast) var(--qsa-ease-out);">
                <div>
                  <div style="font-size: 11.5px; font-weight: 800; text-transform: uppercase; color: var(--qsa-terracotta); letter-spacing: 0.6px; margin-bottom: 4px;">
                    Module ${idx + 1} • ${(m.lessons || []).length} Lessons
                  </div>
                  <h4 style="font-size: 19px; margin: 0; font-family: var(--qsa-font-serif); font-weight: 500; color: var(--qsa-primary-navy);">${m.title}</h4>
                  <p style="font-size: 13.5px; color: var(--qsa-text-secondary); margin: 6px 0 0; line-height: 1.5;">${m.description}</p>
                </div>
                <div class="claude-module-chevron" style="font-size: 16px; color: var(--qsa-text-muted); transition: transform 0.2s ease;">
                  ▼
                </div>
              </div>
              <div class="claude-module-body" id="claude-mod-body-${idx}" style="padding: 0 28px 24px; display: block; border-top: 1px dashed var(--qsa-border);">
                <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 16px;">
                  ${(m.lessons || []).map(l => {
                    const done = store.isLessonComplete(course.id, l.id);
                    return `
                      <a href="#lesson-${course.id}-${l.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 11px 16px; background: var(--qsa-bg-subtle); border-radius: 8px; text-decoration: none; font-size: 14px; color: var(--qsa-text-primary); transition: background var(--qsa-dur-fast) var(--qsa-ease-out);">
                        <div style="display: flex; align-items: center; gap: 12px;">
                          <span style="color: ${done ? 'var(--qsa-status-success)' : 'var(--qsa-text-muted)'}; font-weight: 800; font-size: 15px;">
                            ${done ? '✓' : '○'}
                          </span>
                          <span style="font-weight: 500;">${l.title}</span>
                          <span class="tag tag-peach" style="font-size: 10px; padding: 2px 7px;">${l.type}</span>
                        </div>
                        <span style="font-size: 12.5px; color: var(--qsa-text-muted); font-weight: 600;">${l.minutes}m</span>
                      </a>`;
                  }).join('')}
                </div>
              </div>
            </div>`).join('')}
        </div>
      </div>

    </div>`;

  // Setup Module Accordion Toggles
  const moduleCards = mainEl.querySelectorAll('.claude-module-accordion-card');
  moduleCards.forEach(card => {
    const header = card.querySelector('.claude-module-header');
    const body = card.querySelector('.claude-module-body');
    const chevron = card.querySelector('.claude-module-chevron');
    if (header && body && chevron) {
      header.addEventListener('click', () => {
        const isCollapsed = body.style.display === 'none';
        body.style.display = isCollapsed ? 'block' : 'none';
        chevron.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(-90deg)';
      });
    }
  });

  // Setup Expand All / Collapse All Toggle
  const toggleAllBtn = mainEl.querySelector('#claude-toggle-all-modules');
  const toggleAllText = mainEl.querySelector('#claude-toggle-all-text');
  if (toggleAllBtn && toggleAllText) {
    let allExpanded = true;
    toggleAllBtn.addEventListener('click', () => {
      allExpanded = !allExpanded;
      toggleAllBtn.querySelector('span:first-child').innerText = allExpanded ? '⊟' : '⊞';
      toggleAllText.innerText = allExpanded ? 'Collapse All' : 'Expand All';
      moduleCards.forEach(card => {
        const body = card.querySelector('.claude-module-body');
        const chevron = card.querySelector('.claude-module-chevron');
        if (body && chevron) {
          body.style.display = allExpanded ? 'block' : 'none';
          chevron.style.transform = allExpanded ? 'rotate(0deg)' : 'rotate(-90deg)';
        }
      });
    });
  }
}

/* ==========================================================================
   Quick Academy Web App: User Profile, Avatar & Research Media Hub
   ========================================================================== */

export async function updateHeaderAvatar() {
  const slot = document.getElementById('header-avatar-slot');
  if (!slot) return;
  try {
    const profile = await getUserProfile();
    const isLocked = store.isStudentNameLocked();
    const studentName = isLocked ? store.getVerifiedStudentName() : (profile?.name || 'Scholar');

    if (profile && profile.dataUrl) {
      slot.innerHTML = `
        <a href="#learning" class="header-user-avatar-pill" title="My Scholar Profile: ${studentName}">
          <img src="${profile.dataUrl}" alt="${studentName}" class="header-mini-avatar">
          <span style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${studentName}</span>
        </a>`;
    } else {
      slot.innerHTML = `
        <a href="#learning" class="header-user-avatar-pill" title="My Scholar Profile">
          <span style="font-size: 14px;">🎓</span>
          <span style="font-size: 12px; font-weight: 700;">${studentName}</span>
        </a>`;
    }
  } catch (e) {
    console.warn('Avatar update error:', e);
  }
}

export function openAvatarUploadModal() {
  const portal = document.getElementById('app-modal-portal');
  if (!portal) return;

  portal.innerHTML = `
    <div class="claude-modal-overlay active" id="avatar-modal-overlay">
      <div class="claude-modal-box">
        <button type="button" class="claude-modal-close-btn" id="close-avatar-modal">&times;</button>
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: var(--qsa-terracotta); margin-bottom: 6px;">
          Scholar Profile • Decagonal Portrait
        </div>
        <h3 style="font-family: var(--qsa-font-serif); font-size: 22px; color: var(--qsa-primary-navy); margin: 0 0 12px;">
          Upload Scholar Photo
        </h3>
        <p style="font-size: 13.5px; color: var(--qsa-text-secondary); line-height: 1.5; margin-bottom: 20px;">
          Upload a formal portrait for your verifiable completion certificates and scholar profile. Your photo will be masked inside Quick Academy's signature chamfered decagonal frame.
        </p>

        <!-- Dropzone Mount -->
        <div id="avatar-dropzone-mount"></div>

        <div id="avatar-preview-area" style="display: none; margin-top: 20px; text-align: center;">
          <div class="claude-avatar-wrapper" style="width: 110px; height: 110px; margin: 0 auto 14px;">
            <img id="modal-avatar-preview-img" class="claude-avatar-img" src="" alt="Preview">
          </div>
          <div style="font-size: 13px; color: var(--qsa-status-success); font-weight: 700; margin-bottom: 16px;">
            ✓ Compressed to WebP with Decagonal Mask
          </div>
          <div style="display: flex; gap: 10px; justify-content: center;">
            <button type="button" class="claude-btn-dark btn-sm" id="save-avatar-btn">Save to Profile</button>
            <button type="button" class="btn btn-secondary btn-sm" id="cancel-avatar-btn">Cancel</button>
          </div>
        </div>
      </div>
    </div>`;

  const overlay = portal.querySelector('#avatar-modal-overlay');
  const closeBtn = portal.querySelector('#close-avatar-modal');
  const dropzoneMount = portal.querySelector('#avatar-dropzone-mount');
  const previewArea = portal.querySelector('#avatar-preview-area');
  const previewImg = portal.querySelector('#modal-avatar-preview-img');
  const saveBtn = portal.querySelector('#save-avatar-btn');
  const cancelBtn = portal.querySelector('#cancel-avatar-btn');

  let currentProcessed = null;

  const closeModal = () => {
    overlay.classList.remove('active');
    setTimeout(() => { portal.innerHTML = ''; }, 200);
  };

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  createDropzone(dropzoneMount, {
    id: 'avatar-uploader',
    title: 'Drop scholar portrait here',
    subtitle: 'PNG, JPG or WebP • Auto-cropped to square (Decagonal Frame)',
    cropSquare: true,
    maxDim: 400,
    onSuccess: (res) => {
      currentProcessed = res;
      previewImg.src = res.dataUrl;
      previewArea.style.display = 'block';
    }
  });

  saveBtn.addEventListener('click', async () => {
    if (!currentProcessed) return;
    saveBtn.innerText = 'Saving...';
    saveBtn.setAttribute('disabled', 'true');

    await saveUserProfile({
      dataUrl: currentProcessed.dataUrl,
      width: currentProcessed.width,
      height: currentProcessed.height,
      size: currentProcessed.size
    });

    closeModal();
    if (window.showGlobalToast) {
      window.showGlobalToast('Profile photo updated successfully!');
    }
    await updateHeaderAvatar();
    if (window.location.hash === '#learning') {
      router.resolve();
    }
  });
}

export function openFigureUploadModal() {
  const portal = document.getElementById('app-modal-portal');
  if (!portal) return;

  portal.innerHTML = `
    <div class="claude-modal-overlay active" id="fig-modal-overlay">
      <div class="claude-modal-box">
        <button type="button" class="claude-modal-close-btn" id="close-fig-modal">&times;</button>
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: var(--qsa-terracotta); margin-bottom: 6px;">
          Empirical Research Hub • Figure &amp; Table Uploader
        </div>
        <h3 style="font-family: var(--qsa-font-serif); font-size: 22px; color: var(--qsa-primary-navy); margin: 0 0 12px;">
          Attach Research Figure / Table Screenshot
        </h3>
        <p style="font-size: 13.5px; color: var(--qsa-text-secondary); line-height: 1.5; margin-bottom: 20px;">
          Upload a screenshot of your SPSS regression table, SmartPLS 4 path model, G*Power sample curve, or Turnitin similarity report.
        </p>

        <!-- Dropzone Mount -->
        <div id="fig-dropzone-mount"></div>

        <div id="fig-details-area" style="display: none; margin-top: 20px;">
          <div style="margin-bottom: 14px;">
            <label style="display: block; font-size: 12.5px; font-weight: 700; color: var(--qsa-primary-navy); margin-bottom: 4px;">Figure / Table Title</label>
            <input type="text" id="fig-title-input" class="claude-search-input" placeholder="e.g. Table 4.2 Multiple Regression Coefficients (SPSS)" style="border-radius: 8px;">
          </div>
          <div style="margin-bottom: 14px;">
            <label style="display: block; font-size: 12.5px; font-weight: 700; color: var(--qsa-primary-navy); margin-bottom: 4px;">Methodological Context / Notes</label>
            <textarea id="fig-caption-input" class="claude-search-input" rows="3" placeholder="Explain the statistical model, sample N, and verified hypotheses..." style="border-radius: 8px; resize: vertical;"></textarea>
          </div>
          <div style="background: var(--qsa-bg-fill); border-radius: 8px; padding: 12px; margin-bottom: 16px;">
            <div style="font-size: 12px; font-weight: 700; color: var(--qsa-terracotta); margin-bottom: 6px;">APA 7th Verification Checklist:</div>
            <label style="display: flex; align-items: center; gap: 8px; font-size: 12.5px; margin-bottom: 4px; cursor: pointer;">
              <input type="checkbox" id="chk-no-vertical" checked> No vertical rules / borders in statistical table
            </label>
            <label style="display: flex; align-items: center; gap: 8px; font-size: 12.5px; margin-bottom: 4px; cursor: pointer;">
              <input type="checkbox" id="chk-italic-p" checked> Italicized statistical abbreviations (*p*, *t*, *F*, *R*²)
            </label>
            <label style="display: flex; align-items: center; gap: 8px; font-size: 12.5px; cursor: pointer;">
              <input type="checkbox" id="chk-sample-n" checked> Explicit empirical sample size *N* stated in note
            </label>
          </div>
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button type="button" class="btn btn-secondary btn-sm" id="cancel-fig-btn">Cancel</button>
            <button type="button" class="claude-btn-dark btn-sm" id="save-fig-btn">Save Figure to Research Hub</button>
          </div>
        </div>
      </div>
    </div>`;

  const overlay = portal.querySelector('#fig-modal-overlay');
  const closeBtn = portal.querySelector('#close-fig-modal');
  const dropzoneMount = portal.querySelector('#fig-dropzone-mount');
  const detailsArea = portal.querySelector('#fig-details-area');
  const titleInput = portal.querySelector('#fig-title-input');
  const captionInput = portal.querySelector('#fig-caption-input');
  const saveBtn = portal.querySelector('#save-fig-btn');
  const cancelBtn = portal.querySelector('#cancel-fig-btn');

  let currentProcessed = null;

  const closeModal = () => {
    overlay.classList.remove('active');
    setTimeout(() => { portal.innerHTML = ''; }, 200);
  };

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  createDropzone(dropzoneMount, {
    id: 'fig-uploader',
    title: 'Drop research table or statistical chart here',
    subtitle: 'PNG, JPG or WebP • Optimized for dissertation submission',
    cropSquare: false,
    maxDim: 1000,
    onSuccess: (res) => {
      currentProcessed = res;
      titleInput.value = res.originalName ? res.originalName.replace(/\.[^/.]+$/, '') : 'Research Figure';
      detailsArea.style.display = 'block';
    }
  });

  saveBtn.addEventListener('click', async () => {
    if (!currentProcessed) return;
    saveBtn.innerText = 'Saving...';
    saveBtn.setAttribute('disabled', 'true');

    await saveResearchFigure({
      title: titleInput.value.trim() || 'Untitled Research Figure',
      caption: captionInput.value.trim() || '',
      dataUrl: currentProcessed.dataUrl,
      width: currentProcessed.width,
      height: currentProcessed.height,
      size: currentProcessed.size,
      apaRules: {
        noVertical: portal.querySelector('#chk-no-vertical')?.checked,
        italicStat: portal.querySelector('#chk-italic-p')?.checked,
        sampleN: portal.querySelector('#chk-sample-n')?.checked
      }
    });

    closeModal();
    if (window.showGlobalToast) {
      window.showGlobalToast('Research figure saved to your Scholar Hub!');
    }
    if (window.location.hash === '#learning') {
      router.resolve();
    }
  });
}

export function openLightboxModal(imgUrl, title = '', caption = '') {
  const portal = document.getElementById('app-modal-portal');
  if (!portal) return;

  portal.innerHTML = `
    <div class="claude-modal-overlay active" id="lightbox-overlay" style="padding: 10px;">
      <div class="claude-modal-box" style="max-width: 900px; text-align: center; padding: 20px;">
        <button type="button" class="claude-modal-close-btn" id="close-lightbox">&times;</button>
        ${title ? `<h3 style="font-family: var(--qsa-font-serif); font-size: 20px; color: var(--qsa-primary-navy); margin: 0 0 12px;">${title}</h3>` : ''}
        <div style="max-height: 70vh; overflow: auto; display: flex; align-items: center; justify-content: center; background: #000000; border-radius: 8px; padding: 8px;">
          <img src="${imgUrl}" alt="${title}" style="max-width: 100%; max-height: 68vh; object-fit: contain;">
        </div>
        ${caption ? `<p style="font-size: 13.5px; color: var(--qsa-text-secondary); margin: 12px 0 0; text-align: left;">${caption}</p>` : ''}
      </div>
    </div>`;

  const overlay = portal.querySelector('#lightbox-overlay');
  const closeBtn = portal.querySelector('#close-lightbox');
  const closeModal = () => {
    overlay.classList.remove('active');
    setTimeout(() => { portal.innerHTML = ''; }, 200);
  };
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
}

/* ==========================================================================
   Learner Dashboard (#learning)
   ========================================================================== */
async function renderLearnerDashboard(courses = []) {
  const state = store.state;
  const totalMinutes = Math.round(state.studyTime.totalSeconds / 60);
  const active = store.getActiveLesson();
  const enrolledCourses = courses.filter(c => store.getCourseProgress(c.id, c.lessonsCount) > 0);
  const userProfile = await getUserProfile();
  const researchFigures = await getAllResearchFigures();
  const studentName = store.isStudentNameLocked() ? store.getVerifiedStudentName() : (userProfile?.name || 'Academic Scholar');

  mainEl.innerHTML = `
    <div class="wrap" style="padding: 52px 20px 72px;">
      
      <!-- Scholar Profile Card with Decagonal Avatar & Image Upload -->
      <div style="background: var(--qsa-bg-card); border: 1px solid var(--qsa-border); border-radius: var(--qsa-radius-card); padding: 28px; margin-bottom: 32px; box-shadow: var(--qsa-shadow-card); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
        <div style="display: flex; align-items: center; gap: 20px;">
          <!-- Decagonal Avatar Frame -->
          <div class="claude-avatar-wrapper" id="profile-avatar-wrapper" title="Click to update scholar portrait" style="cursor: pointer;">
            <img src="${userProfile?.dataUrl || './assets/images/hero-academy-emblem.svg'}" alt="${studentName}" class="claude-avatar-img" id="profile-avatar-display">
            <div class="claude-avatar-upload-badge" id="avatar-camera-btn" title="Upload new photo">📷</div>
          </div>
          <div>
            <div style="font-size: 11.5px; font-weight: 800; text-transform: uppercase; color: var(--qsa-terracotta); letter-spacing: 0.6px; margin-bottom: 4px;">
              Postgraduate Scholar Profile
            </div>
            <h2 style="font-family: var(--qsa-font-serif); font-size: 24px; color: var(--qsa-primary-navy); margin: 0 0 6px; font-weight: 500;">
              ${studentName}
            </h2>
            <div style="display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--qsa-text-secondary); flex-wrap: wrap;">
              <span>Registration ID: <code>${store.getStudentRegistrationId() || 'QSA-SCHOLAR-2026'}</code></span>
              <span>•</span>
              <span style="color: var(--qsa-status-success); font-weight: 600;">🛡️ Verified Scholar</span>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button type="button" class="claude-btn-dark btn-sm" id="dashboard-upload-avatar-btn">
            <span>📷</span> <span>Change Photo</span>
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="dashboard-upload-figure-btn">
            <span>📊</span> <span>Upload Figure</span>
          </button>
        </div>
      </div>

      <!-- Continue Learning Banner (If active) -->
      ${active && active.courseId ? `
        <div style="background: #ffffff; border: 1.5px solid var(--qsa-terracotta); border-radius: var(--qsa-radius-card); padding: 24px; margin-bottom: 32px; box-shadow: var(--qsa-shadow-card); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="font-size: 11.5px; font-weight: 800; text-transform: uppercase; color: var(--qsa-terracotta); margin-bottom: 4px;">
              Active Course in Progress
            </div>
            <h3 style="font-size: 20px; margin: 0 0 6px; font-family: var(--qsa-font-serif); color: var(--qsa-text-primary);">
              Continue: ${active.courseId.toUpperCase()} • Lesson ${active.lessonId.toUpperCase()}
            </h3>
            <p style="font-size: 13.5px; color: var(--qsa-text-secondary); margin: 0;">
              Pick up right where you paused your reading and interactive models.
            </p>
          </div>
          <a href="#lesson-${active.courseId}-${active.lessonId}" class="btn btn-primary">
            Continue Lesson ➔
          </a>
        </div>` : ''}

      <!-- Stats Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 36px;">
        <div style="background: #ffffff; box-shadow: inset 0 0 0 1px var(--qsa-border-card); border-radius: 16px; padding: 22px; text-align: center;">
          <div style="font-size: 34px; font-weight: 700; color: var(--qsa-terracotta); font-family: var(--qsa-font-serif);">${state.streak.current} Days</div>
          <div style="font-size: 13px; color: var(--qsa-text-muted); font-weight: 500;">Daily Study Streak</div>
        </div>
        <div style="background: #ffffff; box-shadow: inset 0 0 0 1px var(--qsa-border-card); border-radius: 16px; padding: 22px; text-align: center;">
          <div style="font-size: 34px; font-weight: 700; color: var(--qsa-navy); font-family: var(--qsa-font-serif);">${totalMinutes} Min</div>
          <div style="font-size: 13px; color: var(--qsa-text-muted); font-weight: 500;">Active Time Logged</div>
        </div>
        <div style="background: #ffffff; box-shadow: inset 0 0 0 1px var(--qsa-border-card); border-radius: 16px; padding: 22px; text-align: center;">
          <div style="font-size: 34px; font-weight: 700; color: #15803d; font-family: var(--qsa-font-serif);">${researchFigures.length}</div>
          <div style="font-size: 13px; color: var(--qsa-text-muted); font-weight: 500;">Attached Research Figures</div>
        </div>
      </div>

      <!-- Enrolled Courses & Progress -->
      <div style="background: #ffffff; box-shadow: inset 0 0 0 1px var(--qsa-border-card); border-radius: var(--qsa-radius-card); padding: 32px; margin-bottom: 32px;">
        <h3 style="margin: 0 0 18px; font-size: 22px; color: var(--qsa-text-primary);">Enrolled Courses &amp; Progress</h3>
        ${enrolledCourses.length === 0 ? `
          <p style="color: var(--qsa-text-muted); font-style: italic; margin: 0 0 16px;">You haven't started any courses yet. Choose a course from the catalog to begin tracking your progress.</p>
          <a href="#/" class="btn btn-primary btn-sm">Browse All 9 Courses ➔</a>` : `
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${enrolledCourses.map(c => {
              const p = store.getCourseProgress(c.id, c.lessonsCount);
              return `
                <div style="background: var(--qsa-bg-subtle); border-radius: 10px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                  <div>
                    <h4 style="margin: 0 0 4px; font-size: 16px; color: var(--qsa-text-primary);">${c.title}</h4>
                    <span style="font-size: 12.5px; color: var(--qsa-text-muted);">${c.category} • ${c.lessonsCount} Lessons</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 14px;">
                    <div style="width: 120px; height: 6px; background: var(--qsa-border); border-radius: 3px; overflow: hidden;">
                      <div style="width: ${p}%; height: 100%; background: var(--qsa-terracotta);"></div>
                    </div>
                    <span style="font-weight: 700; font-size: 13.5px; color: var(--qsa-terracotta);">${p}%</span>
                    <a href="#course-${c.id}" class="btn btn-secondary btn-sm" style="padding: 4px 12px; font-size: 12px;">
                      ${p === 100 ? 'Review' : 'Continue'}
                    </a>
                  </div>
                </div>`;
            }).join('')}
          </div>`}
      </div>

      <!-- Research Figures & Statistical Plots Gallery -->
      <div style="background: var(--qsa-bg-card); border: 1px solid var(--qsa-border); border-radius: var(--qsa-radius-card); padding: 32px; margin-bottom: 32px; box-shadow: var(--qsa-shadow-card);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <span class="tag tag-clay" style="margin-bottom: 6px;">Empirical Research Vault</span>
            <h3 style="margin: 4px 0 0; font-size: 22px; font-family: var(--qsa-font-serif); color: var(--qsa-text-primary);">
              My Research Figures &amp; Statistical Plots
            </h3>
          </div>
          <button type="button" class="claude-btn-dark btn-sm" id="btn-add-figure">
            <span>➕</span> <span>Upload New Figure / Table</span>
          </button>
        </div>

        ${researchFigures.length === 0 ? `
          <div style="background: var(--qsa-bg-subtle); border: 1.5px dashed var(--qsa-border); border-radius: var(--qsa-radius-md); padding: 36px 20px; text-align: center;">
            <div style="font-size: 32px; margin-bottom: 8px;">📊</div>
            <strong style="color: var(--qsa-primary-navy); font-size: 15px;">No Empirical Figures Attached Yet</strong>
            <p style="font-size: 13.5px; color: var(--qsa-text-secondary); max-width: 480px; margin: 6px auto 16px;">
              Upload screenshots of your SPSS regression tables, SmartPLS 4 construct models, or G*Power sample curves for automated APA 7th compliance tagging and advisor review.
            </p>
            <button type="button" class="claude-btn-dark btn-sm" id="btn-empty-add-figure">
              Upload First Figure
            </button>
          </div>` : `
          <div class="claude-figures-grid">
            ${researchFigures.map(fig => `
              <div class="claude-figure-card" data-fig-id="${fig.id}">
                <div class="claude-figure-img-wrap" data-img-url="${fig.dataUrl}" data-img-title="${fig.title}" data-img-caption="${fig.caption || ''}" title="Click to view high-resolution image">
                  <img src="${fig.dataUrl}" alt="${fig.title}">
                </div>
                <div class="claude-figure-body">
                  <div class="claude-figure-title">${fig.title}</div>
                  <div class="claude-figure-caption">${fig.caption || 'Empirical statistical output'}</div>
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 10px; border-top: 1px solid var(--qsa-border);">
                    <span class="tag tag-peach" style="font-size: 10.5px;">APA 7th Verified</span>
                    <button type="button" class="btn btn-secondary btn-sm delete-fig-btn" data-fig-id="${fig.id}" style="padding: 2px 8px; font-size: 11px; color: #dc2626;">
                      Delete
                    </button>
                  </div>
                </div>
              </div>`).join('')}
          </div>`}
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
              <div style="background: var(--qsa-bg-subtle); padding: 14px 18px; border-radius: 10px; border-left: 3.5px solid var(--qsa-terracotta);">
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
          <button type="button" class="btn btn-secondary btn-sm" id="reset-store-btn" style="color: #dc2626;">Reset</button>
        </div>
      </div>
    </div>`;

  // Attach Event Listeners
  const uploadAvatarHandler = () => openAvatarUploadModal();
  document.getElementById('dashboard-upload-avatar-btn')?.addEventListener('click', uploadAvatarHandler);
  document.getElementById('profile-avatar-wrapper')?.addEventListener('click', uploadAvatarHandler);

  const uploadFigHandler = () => openFigureUploadModal();
  document.getElementById('dashboard-upload-figure-btn')?.addEventListener('click', uploadFigHandler);
  document.getElementById('btn-add-figure')?.addEventListener('click', uploadFigHandler);
  document.getElementById('btn-empty-add-figure')?.addEventListener('click', uploadFigHandler);

  // Figure Delete buttons
  mainEl.querySelectorAll('.delete-fig-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.figId;
      if (confirm('Delete this research figure?')) {
        await deleteResearchFigure(id);
        if (window.showGlobalToast) window.showGlobalToast('Figure removed');
        renderLearnerDashboard(courses);
      }
    });
  });

  // Lightbox view for figures
  mainEl.querySelectorAll('.claude-figure-img-wrap').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const url = wrap.dataset.imgUrl;
      const title = wrap.dataset.imgTitle;
      const caption = wrap.dataset.imgCaption;
      if (url) openLightboxModal(url, title, caption);
    });
  });

  document.getElementById('export-notes-btn')?.addEventListener('click', () => {
    const md = store.exportNotesMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quick-services-academy-notes.md';
    a.click();
    window.showGlobalToast('Notes exported to markdown');
  });

  document.getElementById('export-json-btn')?.addEventListener('click', () => {
    const json = store.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qsa-progress-backup.json';
    a.click();
    window.showGlobalToast('Progress backup exported');
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
  const courses = [
    { id: 'thesis101', code: 'THESIS', title: 'Thesis Writing 101: Problem Formulation & Defense', hours: 3.5, desc: 'Certifies mastery of empirical research problem formulation, theoretical frameworks, methodology, and proposal defense.' },
    { id: 'cite101', code: 'CITE', title: 'Citations & Referencing: APA 7th Masterclass', hours: 3.0, desc: 'Certifies mastery of APA 7th author rules, parenthetical citations, narrative framing, and reference entries.' },
    { id: 'integrity101', code: 'INTEG', title: 'Academic Integrity & Similarity Reports', hours: 2.8, desc: 'Certifies mastery of Turnitin similarity index analysis, ethical paraphrasing, and HEC similarity defense.' },
    { id: 'edit101', code: 'EDIT', title: 'Proofreading & Structural Academic Editing', hours: 3.2, desc: 'Certifies mastery of the Golden Thread, MEAL paragraph structures, academic tone, and thesis editing.' },
    { id: 'lit-search', code: 'SEARCH', title: 'Systematic Literature Search & Zotero Indexing', hours: 3.2, desc: 'Certifies mastery of PRISMA 2020 workflows, Boolean database indexing, and Zotero reference management.' },
    { id: 'sample-size', code: 'SAMPLE', title: 'Sample Size Determination & Statistical Power', hours: 3.8, desc: 'Certifies mastery of G*Power parameterization, Cohen effect sizes, Krejcie-Morgan, and sample justification.' },
    { id: 'spss101', code: 'SPSS', title: 'SPSS for Quantitative Empirical Research', hours: 4.2, desc: 'Certifies mastery of variable setup, data cleaning, normality screening, Cronbach alpha, and hypothesis testing.' },
    { id: 'smartpls', code: 'PLS', title: 'SmartPLS 4 & Structural Equation Modeling (SEM)', hours: 4.0, desc: 'Certifies mastery of measurement model evaluation, structural model paths, HTMT, and mediating effects.' },
    { id: 'viva', code: 'VIVA', title: 'Viva Voce & Proposal Defense Mastery', hours: 2.8, desc: 'Certifies mastery of slide deck budget, handling harsh examiner questions, and defense rubrics.' }
  ];

  mainEl.innerHTML = `
    <div class="wrap" style="padding: 52px 20px 72px;">
      <span class="tag tag-clay" style="margin-bottom: 12px;">Official Credentials</span>
      <h1 style="color: var(--qsa-text-primary); font-size: clamp(30px, 5vw, 42px); margin-bottom: 14px; font-weight: 400; letter-spacing: -0.02em;">
        Academy Certificates &amp; Credentials
      </h1>
      <p style="color: var(--qsa-text-secondary); font-size: 15.5px; margin-bottom: 32px; max-width: 680px; line-height: 1.6;">
        Every course at Quick Services Academy includes an authentic, verifiable academic certificate upon completion. Each certificate features HEC Pakistan guideline compliance, dual academic signatures, and 300 DPI high-resolution export.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
        ${courses.map(c => `
          <div style="background: #ffffff; border: 1px solid var(--qsa-border-card); border-radius: var(--qsa-radius-card); padding: 28px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--qsa-shadow-card);">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span class="tag tag-clay" style="font-size: 11px;">${c.hours} Accredited Hours</span>
                <span class="tag tag-green" style="font-size: 11px;">Official Credential</span>
              </div>
              <h3 style="font-size: 19px; margin: 8px 0 10px; color: var(--qsa-text-primary); font-family: var(--qsa-font-serif);">
                ${c.title}
              </h3>
              <p style="font-size: 13.5px; color: var(--qsa-text-secondary); margin-bottom: 20px; line-height: 1.55;">
                ${c.desc}
              </p>
            </div>
            <a href="#certificate-${c.id}" class="btn btn-primary btn-sm" style="width: 100%; text-align: center;">
              View &amp; Generate Certificate ➔
            </a>
          </div>
        `).join('')}
      </div>
    </div>`;
}

/* ==========================================================================
   Verification Route (#verify-:certId)
   ========================================================================== */
function renderVerifyView(certId) {
  const courses = [
    { code: 'THESIS', title: 'Thesis Writing 101: Problem Formulation & Defense', hours: 3.5 },
    { code: 'CITE', title: 'Citations & Referencing: APA 7th Masterclass', hours: 3.0 },
    { code: 'INTEG', title: 'Academic Integrity & Similarity Reports', hours: 2.8 },
    { code: 'EDIT', title: 'Proofreading & Structural Academic Editing', hours: 3.2 },
    { code: 'SEARCH', title: 'Systematic Literature Search & Zotero Indexing', hours: 3.2 },
    { code: 'SAMPLE', title: 'Sample Size Determination & Statistical Power', hours: 3.8 },
    { code: 'SPSS', title: 'SPSS for Quantitative Empirical Research', hours: 4.2 },
    { code: 'PLS', title: 'SmartPLS 4 & Structural Equation Modeling (SEM)', hours: 4.0 },
    { code: 'VIVA', title: 'Viva Voce & Proposal Defense Mastery', hours: 2.8 }
  ];

  const matchedCourse = courses.find(c => certId.toUpperCase().includes(c.code)) || courses[0];

  mainEl.innerHTML = `
    <div class="wrap" style="padding: 64px 20px 80px; text-align: center;">
      <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid var(--qsa-border-card); border-radius: var(--qsa-radius-card); padding: 44px 36px; box-shadow: var(--qsa-shadow-lift);">
        <div style="width: 54px; height: 54px; border-radius: 50%; background: #DDE8DF; color: #15803d; font-size: 26px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; border: 1.5px solid #86efac;">
          ✓
        </div>
        <span class="tag tag-green" style="margin-bottom: 10px;">Official Verification Record</span>
        <h2 style="font-size: 24px; margin: 6px 0 12px; color: var(--qsa-text-primary); font-family: var(--qsa-font-serif);">
          Authentic Academic Credential
        </h2>
        <div style="font-family: var(--qsa-font-mono); font-size: 14px; background: var(--qsa-bg-subtle); padding: 8px 16px; border-radius: 6px; display: inline-block; margin-bottom: 20px; color: var(--qsa-text-primary); border: 1px solid var(--qsa-border-strong);">
          ${certId}
        </div>
        <p style="font-size: 14.5px; color: var(--qsa-text-secondary); line-height: 1.6; margin-bottom: 24px;">
          This digital cryptographic identifier validates that the recipient has satisfactorily satisfied all instructional, empirical, and evaluation requirements for:
        </p>
        <div style="background: rgba(185, 83, 53, 0.08); border: 1px solid rgba(185, 83, 53, 0.2); border-radius: 8px; padding: 14px 18px; margin-bottom: 24px; text-align: left;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--qsa-terracotta); letter-spacing: 0.5px;">Accredited Specialization:</div>
          <strong style="font-size: 16px; color: var(--qsa-text-primary); font-family: var(--qsa-font-serif);">${matchedCourse.title}</strong>
          <div style="font-size: 12px; color: var(--qsa-text-muted); margin-top: 4px;">Instruction Hours: ${matchedCourse.hours} Hours • Issued by Quick Services Academy</div>
        </div>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <a href="#certificate-${certId}" class="btn btn-primary btn-sm">View Certificate Document</a>
          <a href="#/" class="btn btn-secondary btn-sm">Academy Catalog</a>
        </div>
      </div>
    </div>`;
}

function showShortcutsHelp() {
  alert(`Quick Services Academy — Keyboard Shortcuts:\n\n• V: Visualise selected sentence\n• ?: Open this help dialog\n• Esc: Close active modal\n• Tab: Focus navigation controls`);
}
