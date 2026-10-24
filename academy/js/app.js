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
    renderLearnerDashboard(courses);
    updateActiveNavLinks();
  } catch (e) {
    renderLearnerDashboard([]);
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

// Initialize router
router.start();

// Initialize Core Subsystems
initThemeSwitcher();
initLanguageSwitchers();
initCookieConsentBanner();
updateActiveNavLinks();

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

  if (navCourses) navCourses.classList.remove('active');
  if (navLearning) navLearning.classList.remove('active');
  if (navCertificates) navCertificates.classList.remove('active');

  if (hash === '#/' || hash.startsWith('#course-') || hash.startsWith('#courses')) {
    if (navCourses) navCourses.classList.add('active');
  } else if (hash === '#learning') {
    if (navLearning) navLearning.classList.add('active');
  } else if (hash === '#certificates' || hash.startsWith('#certificate-')) {
    if (navCertificates) navCertificates.classList.add('active');
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
   Academic Research Desk Visual SVG (Desktop Right Column Visual)
   ========================================================================== */
function getAcademicDeskSvg() {
  return `
    <svg viewBox="0 0 540 440" style="width: 100%; height: auto; display: block;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Academic Research Desk with books, laptop, notebook and coffee">
      <defs>
        <linearGradient id="desk-mat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FAF7F1" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#EFE8DE" stop-opacity="0.9"/>
        </linearGradient>
        <linearGradient id="book-terracotta" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#9C3F24"/>
          <stop offset="25%" stop-color="#B95335"/>
          <stop offset="85%" stop-color="#B95335"/>
          <stop offset="100%" stop-color="#802F19"/>
        </linearGradient>
        <linearGradient id="book-navy" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0A1C33"/>
          <stop offset="25%" stop-color="#102B4E"/>
          <stop offset="85%" stop-color="#102B4E"/>
          <stop offset="100%" stop-color="#081526"/>
        </linearGradient>
        <linearGradient id="book-sage" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#3F634E"/>
          <stop offset="25%" stop-color="#557F67"/>
          <stop offset="85%" stop-color="#557F67"/>
          <stop offset="100%" stop-color="#345240"/>
        </linearGradient>
        <linearGradient id="book-clay" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#A8572A"/>
          <stop offset="25%" stop-color="#D97736"/>
          <stop offset="85%" stop-color="#D97736"/>
          <stop offset="100%" stop-color="#8F461E"/>
        </linearGradient>
        <linearGradient id="laptop-screen-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#111B27"/>
          <stop offset="100%" stop-color="#1B293A"/>
        </linearGradient>
        <filter id="desk-shadow" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#102B4E" flood-opacity="0.08"/>
        </filter>
        <filter id="float-card-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#102B4E" flood-opacity="0.12"/>
        </filter>
      </defs>

      <!-- Background Desk Mat / Architectural Surface -->
      <rect x="15" y="15" width="510" height="410" rx="20" fill="url(#desk-mat-grad)" stroke="#E8E1D8" stroke-width="1.5" filter="url(#desk-shadow)"/>
      
      <!-- Subtle Architectural Grid Pattern -->
      <g stroke="#E8E1D8" stroke-width="0.75" stroke-dasharray="4,4" opacity="0.6">
        <line x1="40" y1="110" x2="500" y2="110"/>
        <line x1="40" y1="210" x2="500" y2="210"/>
        <line x1="40" y1="310" x2="500" y2="310"/>
        <line x1="160" y1="30" x2="160" y2="400"/>
        <line x1="360" y1="30" x2="360" y2="400"/>
      </g>

      <!-- LAPTOP (Upper Right & Center) -->
      <g transform="translate(210, 48)">
        <!-- Laptop Display Body -->
        <rect x="0" y="0" width="280" height="180" rx="8" fill="#1E293B" stroke="#0F172A" stroke-width="2"/>
        <!-- Laptop Screen Inner -->
        <rect x="10" y="10" width="260" height="160" rx="4" fill="url(#laptop-screen-grad)"/>
        
        <!-- Screen Header Bar -->
        <rect x="10" y="10" width="260" height="22" fill="#0D1520"/>
        <circle cx="22" cy="21" r="3" fill="#EF4444"/>
        <circle cx="32" cy="21" r="3" fill="#F59E0B"/>
        <circle cx="42" cy="21" r="3" fill="#10B981"/>
        <text x="140" y="24" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#94A3B8" text-anchor="middle" letter-spacing="0.5">Quick Academy • SmartPLS 4 Workspace</text>

        <!-- Screen Content: Structural Equation Model & Regression Chart -->
        <!-- Latent Constructs (Circles) -->
        <circle cx="65" cy="80" r="22" fill="#102B4E" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="65" y="78" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#BAE6FD" text-anchor="middle">INSTITUTIONAL</text>
        <text x="65" y="87" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#BAE6FD" text-anchor="middle">SUPPORT</text>

        <circle cx="140" cy="80" r="22" fill="#102B4E" stroke="#34D399" stroke-width="1.5"/>
        <text x="140" y="78" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#A7F3D0" text-anchor="middle">RESEARCH</text>
        <text x="140" y="87" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#A7F3D0" text-anchor="middle">EFFICACY</text>

        <circle cx="215" cy="80" r="22" fill="#102B4E" stroke="#FBBF24" stroke-width="1.5"/>
        <text x="215" y="78" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#FDE68A" text-anchor="middle">PUBLICATION</text>
        <text x="215" y="87" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#FDE68A" text-anchor="middle">OUTPUT</text>

        <!-- Structural Paths / Beta Arrows -->
        <line x1="87" y1="80" x2="116" y2="80" stroke="#38BDF8" stroke-width="1.75"/>
        <polygon points="116,77 122,80 116,83" fill="#38BDF8"/>
        <text x="102" y="74" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="800" fill="#38BDF8" text-anchor="middle">β=.48***</text>

        <line x1="162" y1="80" x2="191" y2="80" stroke="#34D399" stroke-width="1.75"/>
        <polygon points="191,77 197,80 191,83" fill="#34D399"/>
        <text x="177" y="74" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="800" fill="#34D399" text-anchor="middle">β=.56***</text>

        <!-- Indirect Mediation Arch -->
        <path d="M 65,58 Q 140,36 215,58" fill="none" stroke="#F87171" stroke-width="1.5" stroke-dasharray="3,3"/>
        <text x="140" y="44" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" font-weight="800" fill="#FCA5A5" text-anchor="middle">Indirect Effect β=.27 (p &lt; .001)</text>

        <!-- Bottom Metric Dashboard on Screen -->
        <rect x="20" y="120" width="70" height="38" rx="4" fill="#0F172A" stroke="#334155"/>
        <text x="26" y="132" font-family="'Plus Jakarta Sans', sans-serif" font-size="6" font-weight="700" fill="#64748B">R² VARIANCE</text>
        <text x="26" y="148" font-family="'Newsreader', serif" font-size="14" font-weight="600" fill="#38BDF8">0.684</text>

        <rect x="100" y="120" width="70" height="38" rx="4" fill="#0F172A" stroke="#334155"/>
        <text x="106" y="132" font-family="'Plus Jakarta Sans', sans-serif" font-size="6" font-weight="700" fill="#64748B">HTMT RATIO</text>
        <text x="106" y="148" font-family="'Newsreader', serif" font-size="14" font-weight="600" fill="#34D399">&lt; 0.85</text>

        <rect x="180" y="120" width="75" height="38" rx="4" fill="#0F172A" stroke="#334155"/>
        <text x="186" y="132" font-family="'Plus Jakarta Sans', sans-serif" font-size="6" font-weight="700" fill="#64748B">G*POWER N</text>
        <text x="186" y="148" font-family="'Newsreader', serif" font-size="14" font-weight="600" fill="#FBBF24">N = 384</text>

        <!-- Laptop Base / Keyboard Hinge -->
        <path d="M -24,180 L 304,180 L 284,204 L -4,204 Z" fill="#94A3B8" stroke="#64748B" stroke-width="1.5"/>
        <!-- Trackpad -->
        <rect x="110" y="184" width="60" height="15" rx="2" fill="#CBD5E1" stroke="#94A3B8" stroke-width="0.75"/>
      </g>

      <!-- STACK OF 4 ACADEMIC BOOKS (Left & Foreground) -->
      <g transform="translate(42, 175)">
        <!-- Book 1 (Bottom): Research Methods & Design (Terracotta #B95335) -->
        <g transform="translate(0, 150)">
          <path d="M 0,0 L 220,0 L 232,18 L 12,18 Z" fill="url(#book-terracotta)" stroke="#802F19" stroke-width="1.2"/>
          <rect x="0" y="18" width="224" height="34" rx="3" fill="url(#book-terracotta)" stroke="#802F19" stroke-width="1.2"/>
          <line x1="8" y1="23" x2="216" y2="23" stroke="#FDE68A" stroke-width="1" opacity="0.6"/>
          <line x1="8" y1="47" x2="216" y2="47" stroke="#FDE68A" stroke-width="1" opacity="0.6"/>
          <text x="112" y="38" font-family="'Cinzel', serif" font-size="9.5" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.2">RESEARCH METHODS &amp; DESIGN</text>
          <polygon points="224,18 244,18 244,48 224,52" fill="#FAF7F1" stroke="#E8E1D8" stroke-width="1"/>
          <line x1="228" y1="22" x2="228" y2="48" stroke="#E2D9CC" stroke-width="0.5"/>
          <line x1="234" y1="22" x2="234" y2="48" stroke="#E2D9CC" stroke-width="0.5"/>
          <line x1="240" y1="22" x2="240" y2="48" stroke="#E2D9CC" stroke-width="0.5"/>
        </g>

        <!-- Book 2: Statistical Inference & SPSS (Oxford Navy #102B4E) -->
        <g transform="translate(8, 108)">
          <path d="M 0,0 L 214,0 L 226,16 L 12,16 Z" fill="url(#book-navy)" stroke="#081526" stroke-width="1.2"/>
          <rect x="0" y="16" width="218" height="32" rx="3" fill="url(#book-navy)" stroke="#081526" stroke-width="1.2"/>
          <line x1="8" y1="20" x2="210" y2="20" stroke="#93C5FD" stroke-width="0.75" opacity="0.5"/>
          <line x1="8" y1="44" x2="210" y2="44" stroke="#93C5FD" stroke-width="0.75" opacity="0.5"/>
          <text x="109" y="35" font-family="'Cinzel', serif" font-size="9" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">STATISTICAL INFERENCE &amp; SPSS</text>
          <polygon points="218,16 236,16 236,44 218,48" fill="#FAF7F1" stroke="#E8E1D8" stroke-width="1"/>
        </g>

        <!-- Book 3: SmartPLS 4: SEM (Sage Green #557F67) -->
        <g transform="translate(18, 68)">
          <path d="M 0,0 L 204,0 L 214,15 L 10,15 Z" fill="url(#book-sage)" stroke="#345240" stroke-width="1.2"/>
          <rect x="0" y="15" width="208" height="30" rx="3" fill="url(#book-sage)" stroke="#345240" stroke-width="1.2"/>
          <text x="104" y="33" font-family="'Cinzel', serif" font-size="8.5" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.8">SmartPLS 4 : STRUCTURAL MODELING</text>
          <polygon points="208,15 224,15 224,42 208,45" fill="#FAF7F1" stroke="#E8E1D8" stroke-width="1"/>
        </g>

        <!-- Book 4 (Top): Academic Writing & APA 7th (Warm Clay #D97736) -->
        <g transform="translate(26, 30)">
          <path d="M 0,0 L 194,0 L 204,14 L 10,14 Z" fill="url(#book-clay)" stroke="#8F461E" stroke-width="1.2"/>
          <rect x="0" y="14" width="198" height="28" rx="3" fill="url(#book-clay)" stroke="#8F461E" stroke-width="1.2"/>
          <text x="99" y="31" font-family="'Cinzel', serif" font-size="8.5" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.8">ACADEMIC PROSE &amp; APA 7TH</text>
          <polygon points="198,14 212,14 212,39 198,42" fill="#FAF7F1" stroke="#E8E1D8" stroke-width="1"/>
          <!-- Silk Bookmark Ribbon draping down -->
          <path d="M 120,42 L 126,76 L 132,70 L 138,76 L 140,42 Z" fill="#B95335" stroke="#802F19" stroke-width="0.75"/>
        </g>
      </g>

      <!-- RESEARCHER COFFEE MUG (Bottom Center-Right) -->
      <g transform="translate(305, 305)">
        <ellipse cx="28" cy="62" rx="28" ry="7" fill="#102B4E" opacity="0.12"/>
        <path d="M 6,10 L 10,54 C 10,60 18,64 28,64 C 38,64 46,60 46,54 L 50,10 Z" fill="#FFFFFF" stroke="#E8E1D8" stroke-width="1.5"/>
        <ellipse cx="28" cy="10" rx="22" ry="6" fill="#FAF7F1" stroke="#E8E1D8" stroke-width="1.5"/>
        <ellipse cx="28" cy="12" rx="19" ry="4.5" fill="#582C12"/>
        <path d="M 47,18 C 60,18 62,44 45,46" fill="none" stroke="#E8E1D8" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M 47,18 C 60,18 62,44 45,46" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="21" y="26" width="14" height="18" rx="2" fill="#B95335"/>
        <text x="28" y="39" font-family="'Newsreader', serif" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Q</text>
        <path d="M 23,2 C 21,-6 27,-10 24,-18" fill="none" stroke="#B95335" stroke-width="1.2" stroke-linecap="round" opacity="0.35"/>
        <path d="M 33,0 C 35,-8 29,-14 33,-22" fill="none" stroke="#B95335" stroke-width="1.2" stroke-linecap="round" opacity="0.35"/>
      </g>

      <!-- OPEN NOTEBOOK & FOUNTAIN PEN (Bottom Right) -->
      <g transform="translate(375, 280)">
        <rect x="0" y="0" width="130" height="95" rx="6" fill="#FFFFFF" stroke="#E8E1D8" stroke-width="1.5" transform="rotate(-6 65 47)"/>
        <line x1="65" y1="2" x2="65" y2="92" stroke="#E8E1D8" stroke-width="1" stroke-dasharray="2,2" transform="rotate(-6 65 47)"/>
        <g stroke="#E8E1D8" stroke-width="0.75" transform="rotate(-6 65 47)">
          <line x1="12" y1="20" x2="55" y2="20"/>
          <line x1="12" y1="32" x2="55" y2="32"/>
          <line x1="12" y1="44" x2="50" y2="44"/>
          <line x1="12" y1="56" x2="55" y2="56"/>
          <line x1="75" y1="20" x2="118" y2="20"/>
          <line x1="75" y1="32" x2="118" y2="32"/>
          <line x1="75" y1="44" x2="115" y2="44"/>
        </g>
        <g transform="translate(50, 10) rotate(32)">
          <rect x="0" y="0" width="8" height="70" rx="3" fill="#102B4E"/>
          <rect x="0" y="45" width="8" height="6" fill="#FDE68A"/>
          <polygon points="1,70 7,70 4,82" fill="#FDE68A" stroke="#B45309" stroke-width="0.5"/>
          <line x1="4" y1="70" x2="4" y2="78" stroke="#102B4E" stroke-width="0.5"/>
        </g>
      </g>

      <!-- FLOATING ANNOTATION CARD (Matching Mockup) -->
      <g transform="translate(16, 26)" filter="url(#float-card-shadow)">
        <rect x="0" y="0" width="194" height="52" rx="10" fill="#FFFFFF" stroke="#E8E1D8" stroke-width="1.5"/>
        <circle cx="22" cy="26" r="12" fill="#DDE8DF"/>
        <text x="22" y="30.5" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="#2E5A44" text-anchor="middle">✓</text>
        <text x="42" y="21" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="800" fill="#B95335" letter-spacing="0.5">POSTGRADUATE EXCELLENCE</text>
        <text x="42" y="37" font-family="'Newsreader', serif" font-size="12" font-weight="600" fill="#102B4E">Better Research. Bigger Opportunities.</text>
      </g>
    </svg>
  `;
}

/* ==========================================================================
   Homepage & Catalog Rendering
   ========================================================================== */
function renderCatalog(courses) {
  const active = store.getActiveLesson();
  const currentLang = store.getEnglishLevel();

  mainEl.innerHTML = `
    <!-- Top Hero Section: Claude Academy Warm Blush Banner -->
    <section class="claude-hero-banner">
      <div class="wrap">
        <div class="claude-hero-grid">
          
          <!-- Left Column: Copy & Actions -->
          <div class="claude-hero-copy">
            <!-- Verified HEC Alignment Pill -->
            <div class="claude-breadcrumb-tag">
              <span class="dot"></span>
              <span>HEC Pakistan Aligned • Free Postgraduate Research LMS</span>
            </div>

            <!-- Master Headline in Editorial Serif -->
            <h1 class="claude-hero-title">
              Build stronger research. Write with <em>clarity.</em>
            </h1>

            <!-- Supporting Text -->
            <p class="claude-hero-desc">
              Practical academic training for postgraduate researchers. Strengthen your research design, academic writing, statistical analysis and reporting skills through guided lessons and interactive learning tools.
            </p>

            <!-- Claude Academy Metadata Pills Strip -->
            <div class="claude-meta-strip">
              <span class="claude-meta-pill">📖 9 Complete Tracks</span>
              <span class="claude-meta-pill">⏱️ 32 Accredited Hours</span>
              <span class="claude-meta-pill">📝 168 Modular Lessons</span>
              <span class="claude-meta-pill">🎓 Verifiable Credentials</span>
              <span class="claude-meta-pill">🔬 Sentence Clarity Lab</span>
            </div>

            <!-- Claude Academy Action Pills -->
            <div class="claude-hero-actions">
              <a href="#courses-section" class="claude-btn-dark">
                ➔ Explore Courses
              </a>
              <a href="#certificates" class="claude-btn-subtle">
                <span>📄</span> View Credentials
              </a>
              <a href="https://quick-services-site.pages.dev/guide.html" target="_blank" class="claude-btn-subtle">
                <span>📖</span> Open Field Guide
              </a>
            </div>
          </div>

          <!-- Right Column: Claude Academy Signature Decagonal Emblem -->
          <div class="claude-hero-badge-wrap">
            <div class="claude-badge-decagon">
              <img src="${getBaseAssetPath()}/images/hero-academy-emblem.svg" 
                   alt="Quick Academy Master Academic Emblem" 
                   class="claude-badge-img" 
                   width="260" 
                   height="260">
            </div>
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

    <!-- Core Feature: Dedicated Sentence Clarity Lab Card -->
    <section style="padding: 24px 0 56px;">
      <div class="wrap">
        <div class="clarity-lab-card" id="sentence-clarity-lab">
          
          <!-- Lab Card Header -->
          <div class="clarity-lab-header">
            <div>
              <div class="clarity-lab-badge">
                <span>🔬</span> <span>CORE LEARNING TOOL • SENTENCE CLARITY LAB</span>
              </div>
              <h2 style="font-size: clamp(22px, 3.2vw, 30px); margin: 6px 0 4px; font-weight: 500; font-family: var(--qsa-font-serif); color: var(--qsa-text-primary);">
                Academic Paraphraser &amp; Syntax Refiner
              </h2>
              <p style="font-size: 14px; color: var(--qsa-text-secondary); margin: 0;">
                See how passive, nominalized sentences transform into clear, bounded scholarly prose across registers.
              </p>
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

          <!-- Mandatory Integrity & Verification Disclaimer -->
          <div class="clarity-disclaimer">
            <span>⚠️</span>
            <span><strong>Academic Integrity Notice:</strong> Paraphrasing and syntax tools refine clarity but do not replace critical scholarly judgment or verify empirical findings. Users must independently verify evidence, definitions, and citations. Paraphrasing does not guarantee plagiarism exemption or bypass AI detection.</span>
          </div>

        </div>
      </div>
    </section>

    <!-- Three Track Pillar Cards Grid matching Mockup -->
    <section style="padding: 10px 0 48px;">
      <div class="wrap">
        <div style="text-align: center; max-width: 680px; margin: 0 auto 36px;">
          <span class="tag tag-clay" style="margin-bottom: 8px;">Academic Architecture</span>
          <h2 style="font-size: clamp(26px, 3.8vw, 34px); margin: 6px 0 8px; color: var(--qsa-text-primary);">
            Three Pillars of Postgraduate Research
          </h2>
          <p style="color: var(--qsa-text-secondary); font-size: 15px; margin: 0;">
            A sequential scholarly curriculum designed to take researchers from problem formulation to rigorous statistical defense.
          </p>
        </div>

        <div class="pillar-cards-grid">
          
          <!-- Pillar 1 -->
          <div class="pillar-card">
            <div class="pillar-icon-box">📐</div>
            <div class="pillar-track-num">TRACK 01 • METHODOLOGY</div>
            <h3 class="pillar-card-title">Research Design &amp; Scoping</h3>
            <p class="pillar-card-desc">
              From initial topic bounding to proposal defense, systematic PRISMA literature synthesis, and defending your research questions.
            </p>
            <div class="pillar-courses-list">
              Includes: <strong>Thesis Writing 101</strong> • <strong>Literature Search with Zotero</strong> • <strong>Viva Voce Defense</strong>
            </div>
            <button type="button" class="pillar-card-action filter-pillar-btn" data-pillar-filter="Research Design">
              <span>Explore Research Track (3)</span> ➔
            </button>
          </div>

          <!-- Pillar 2 -->
          <div class="pillar-card">
            <div class="pillar-icon-box">📊</div>
            <div class="pillar-track-num">TRACK 02 • EMPIRICAL RIGOR</div>
            <h3 class="pillar-card-title">Statistical Analysis &amp; Power</h3>
            <p class="pillar-card-desc">
              Empirical quantitative methods: G*Power statistical power calculation, SPSS data screening, hypothesis testing, and SmartPLS 4 SEM path models.
            </p>
            <div class="pillar-courses-list">
              Includes: <strong>Sample Size Determination</strong> • <strong>SPSS Quantitative Research</strong> • <strong>SmartPLS 4 SEM</strong>
            </div>
            <button type="button" class="pillar-card-action filter-pillar-btn" data-pillar-filter="Statistical Analysis">
              <span>Explore Statistics Track (3)</span> ➔
            </button>
          </div>

          <!-- Pillar 3 -->
          <div class="pillar-card">
            <div class="pillar-icon-box">✍️</div>
            <div class="pillar-track-num">TRACK 03 • SCHOLARLY COMMUNICATION</div>
            <h3 class="pillar-card-title">Academic Writing &amp; Integrity</h3>
            <p class="pillar-card-desc">
              International publication standards: APA 7th parenthetical mechanics, Turnitin similarity report interpretation, and structural editing.
            </p>
            <div class="pillar-courses-list">
              Includes: <strong>APA 7th Referencing</strong> • <strong>Turnitin &amp; Integrity</strong> • <strong>Proofreading &amp; Style</strong>
            </div>
            <button type="button" class="pillar-card-action filter-pillar-btn" data-pillar-filter="Academic Writing">
              <span>Explore Writing Track (3)</span> ➔
            </button>
          </div>

        </div>
      </div>
    </section>

    <!-- Main Course Catalogue Section with Live Filter Chips & Search -->
    <section id="courses-section" style="padding: 40px 0 72px; border-top: 1px solid var(--qsa-border);">
      <div class="wrap">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <span class="tag tag-clay" style="margin-bottom: 8px;">Curriculum</span>
            <h2 style="font-size: clamp(26px, 4vw, 34px); color: var(--qsa-text-primary); margin: 4px 0 0;">
              All 9 Academy Courses
            </h2>
          </div>
          
          <!-- Search Bar -->
          <div style="width: 100%; max-width: 360px;">
            <input type="text" id="catalog-search" placeholder="Search topics (e.g. Turnitin, G*Power, ANOVA, APA 7, SmartPLS)..." style="width: 100%; box-sizing: border-box; padding: 11px 18px; border-radius: var(--qsa-radius-pill); border: 1.5px solid var(--qsa-border-strong); background: #ffffff; color: var(--qsa-text-primary); font-size: 14px; outline: none; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);">
          </div>
        </div>

        <!-- Topic Filter Chips Strip -->
        <div class="hero-chips-wrap" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px; overflow-x: auto; padding-bottom: 4px;">
          <button type="button" class="hero-topic-chip active" data-topic="all">All Tracks (9)</button>
          <button type="button" class="hero-topic-chip" data-topic="Research Design">Research Design (3)</button>
          <button type="button" class="hero-topic-chip" data-topic="Statistical Analysis">Statistical Analysis (3)</button>
          <button type="button" class="hero-topic-chip" data-topic="Academic Writing">Academic Writing (3)</button>
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

  // Attach Clarity Lab Event Handlers
  initClarityLabListeners();

  // Attach Live Topic Chip Filtering
  const chips = document.querySelectorAll('.hero-topic-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const topic = chip.dataset.topic;
      filterCatalogCourses(courses, topic);
    });
  });

  // Attach Pillar Card Action Buttons (Direct Filter & Smooth Scroll)
  document.querySelectorAll('.filter-pillar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.pillarFilter;
      chips.forEach(c => {
        c.classList.toggle('active', c.dataset.topic === filter);
      });
      filterCatalogCourses(courses, filter);
      const targetEl = document.getElementById('courses-section');
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Live Catalog Search Filter
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
   Course Card Renderer
   ========================================================================== */
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

      <!-- Curriculum by Module Breakdown -->
      <div id="curriculum-breakdown">
        <h3 style="font-family: var(--qsa-font-serif); color: var(--qsa-primary-navy); margin-bottom: 22px; font-size: 26px; font-weight: 500;">
          Curriculum by Module
        </h3>
        <div style="display: flex; flex-direction: column; gap: 20px;">
          ${course.modules.map((m, idx) => `
            <div style="background: var(--qsa-bg-card); border: 1px solid var(--qsa-border); border-radius: var(--qsa-radius-card); padding: 26px 28px; box-shadow: var(--qsa-shadow-card);">
              <div style="font-size: 11.5px; font-weight: 800; text-transform: uppercase; color: var(--qsa-terracotta); letter-spacing: 0.6px; margin-bottom: 6px;">
                Module ${idx + 1}
              </div>
              <h4 style="font-size: 20px; margin: 0 0 6px; font-family: var(--qsa-font-serif); font-weight: 500; color: var(--qsa-primary-navy);">${m.title}</h4>
              <p style="font-size: 14px; color: var(--qsa-text-secondary); margin-bottom: 18px; line-height: 1.6;">${m.description}</p>
              <div style="display: flex; flex-direction: column; gap: 8px;">
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
            </div>`).join('')}
        </div>
      </div>

    </div>`;
}

/* ==========================================================================
   Learner Dashboard (#learning)
   ========================================================================== */
function renderLearnerDashboard(courses = []) {
  const state = store.state;
  const totalMinutes = Math.round(state.studyTime.totalSeconds / 60);
  const active = store.getActiveLesson();
  const enrolledCourses = courses.filter(c => store.getCourseProgress(c.id, c.lessonsCount) > 0);
  const completedCourses = courses.filter(c => store.getCourseProgress(c.id, c.lessonsCount) === 100);

  mainEl.innerHTML = `
    <div class="wrap" style="padding: 52px 20px 72px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; flex-wrap: wrap; gap: 16px;">
        <div>
          <span class="tag tag-clay" style="margin-bottom: 8px;">Learner Profile</span>
          <h1 style="color: var(--qsa-text-primary); font-size: clamp(30px, 5vw, 42px); margin: 4px 0 0; font-weight: 400;">
            My Learning Dashboard
          </h1>
        </div>
        ${store.isStudentNameLocked() ? `
          <div style="display: inline-flex; align-items: center; gap: 8px; background: #DDE8DF; color: #102B4E; padding: 8px 16px; border-radius: var(--qsa-radius-pill); font-size: 13px; font-weight: 700;">
            <span>🛡️</span> <span>Verified: ${store.getVerifiedStudentName()}</span>
          </div>` : ''}
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
          <div style="font-size: 34px; font-weight: 700; color: #15803d; font-family: var(--qsa-font-serif);">${state.notes.length}</div>
          <div style="font-size: 13px; color: var(--qsa-text-muted); font-weight: 500;">Saved Notes &amp; Highlights</div>
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
