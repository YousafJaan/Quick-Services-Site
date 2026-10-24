/**
 * Quick Services Academy — State & Persistence Engine
 * Versioned LocalStorage Store (qsa-progress-v2) with non-blocking fallback
 */

const STORAGE_KEY = 'qsa-progress-v2';

const DEFAULT_STATE = {
  version: 2,
  englishLevel: 'plain', // 'simple' | 'plain' | 'technical'
  hasChosenEnglishLevel: false,
  completedLessons: {}, // { courseId: [lessonId] }
  activeLesson: null,   // { courseId, lessonId, depth: 'standard', scrollPos: 0 }
  quizAttempts: {},     // { `${courseId}_${lessonId}`: { bestScore, attempts, lastDate, mistakes: [] } }
  selfChecks: {},       // { `${courseId}_${lessonId}_${pId}`: { confidenceBefore, confidenceAfter, score, total } }
  notes: [],            // [ { id, courseId, lessonId, sentenceId, text, color, timestamp } ]
  bookmarks: [],        // [ { courseId, lessonId, title, timestamp } ]
  studyTime: { totalSeconds: 0, byCourse: {} },
  badges: [],           // [ { id, title, icon, earnedAt } ]
  streak: { current: 1, lastStudyDate: new Date().toISOString().split('T')[0] },
  settings: {
    selfCheckPrompt: 'gentle', // 'off' | 'gentle' | 'on'
    reducedMotion: false
  }
};

class Store {
  constructor() {
    this.memoryState = null;
    this.storageAvailable = this._checkStorage();
    this.state = this._loadState();
    this._initStudyTimer();
  }

  _checkStorage() {
    try {
      const test = '__qsa_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('LocalStorage unavailable or blocked. Falling back to in-memory store.');
      return false;
    }
  }

  _loadState() {
    if (!this.storageAvailable) {
      this.memoryState = JSON.parse(JSON.stringify(DEFAULT_STATE));
      return this.memoryState;
    }
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return JSON.parse(JSON.stringify(DEFAULT_STATE));
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_STATE, ...parsed };
    } catch (e) {
      console.error('Failed to parse localStorage state:', e);
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  }

  save() {
    if (this.storageAvailable) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to write to localStorage:', e);
      }
    }
  }

  // Student Verified Identity (One-time locked credential for certificates)
  getVerifiedStudentName() {
    return this.state.verifiedStudentName || null;
  }

  getStudentRegistrationId() {
    return this.state.studentRegistrationId || null;
  }

  getVerifiedDate() {
    return this.state.verifiedStudentDate || null;
  }

  setVerifiedStudentName(name) {
    if (!name || typeof name !== 'string' || !name.trim()) return false;
    // Once locked, cannot be altered
    if (this.state.verifiedStudentName) return false;

    this.state.verifiedStudentName = name.trim();
    this.state.verifiedStudentDate = new Date().toISOString();
    this.state.studentRegistrationId = 'QSA-REG-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    this.save();
    try {
      window.dispatchEvent(new CustomEvent('qsa:student-identity-locked', { detail: { name: this.state.verifiedStudentName, regId: this.state.studentRegistrationId } }));
    } catch (e) {}
    return true;
  }

  isStudentNameLocked() {
    return Boolean(this.state.verifiedStudentName);
  }

  // English Proficiency Level ('simple' | 'plain' | 'technical')
  getEnglishLevel() {
    return this.state.englishLevel || 'plain';
  }

  setEnglishLevel(level) {
    if (['simple', 'plain', 'technical'].includes(level)) {
      this.state.englishLevel = level;
      this.state.hasChosenEnglishLevel = true;
      this.save();
      try {
        window.dispatchEvent(new CustomEvent('qsa:english-level-changed', { detail: { level } }));
      } catch (e) {}
    }
  }

  hasChosenEnglishLevel() {
    return Boolean(this.state.hasChosenEnglishLevel);
  }

  // Study Time Tracker (pauses when tab is blurred or hidden)
  _initStudyTimer() {
    this.isActive = !document.hidden;
    document.addEventListener('visibilitychange', () => {
      this.isActive = !document.hidden;
    });

    setInterval(() => {
      if (this.isActive) {
        this.state.studyTime.totalSeconds += 1;
        if (this.state.activeLesson && this.state.activeLesson.courseId) {
          const cid = this.state.activeLesson.courseId;
          this.state.studyTime.byCourse[cid] = (this.state.studyTime.byCourse[cid] || 0) + 1;
        }
        if (this.state.studyTime.totalSeconds % 30 === 0) {
          this.save();
        }
      }
    }, 1000);
  }

  // Lesson Completion
  markLessonComplete(courseId, lessonId) {
    if (!this.state.completedLessons[courseId]) {
      this.state.completedLessons[courseId] = [];
    }
    if (!this.state.completedLessons[courseId].includes(lessonId)) {
      this.state.completedLessons[courseId].push(lessonId);
      this._checkMilestoneBadges(courseId);
      this.save();
    }
  }

  isLessonComplete(courseId, lessonId) {
    return (this.state.completedLessons[courseId] || []).includes(lessonId);
  }

  getCourseProgress(courseId, totalLessonsCount) {
    const done = (this.state.completedLessons[courseId] || []).length;
    if (!totalLessonsCount || totalLessonsCount === 0) return 0;
    return Math.min(100, Math.round((done / totalLessonsCount) * 100));
  }

  // Active Lesson & Resume State
  setActiveLesson(courseId, lessonId, depth = 'standard', scrollPos = 0) {
    this.state.activeLesson = { courseId, lessonId, depth, scrollPos };
    this._updateDailyStreak();
    this.save();
  }

  getActiveLesson() {
    return this.state.activeLesson;
  }

  // Quiz Results & Retries
  recordQuizResult(courseId, lessonId, score, passed, mistakes = []) {
    const key = `${courseId}_${lessonId}`;
    const prev = this.state.quizAttempts[key] || { bestScore: 0, attempts: 0, mistakes: [] };
    this.state.quizAttempts[key] = {
      bestScore: Math.max(prev.bestScore, score),
      attempts: prev.attempts + 1,
      lastScore: score,
      passed,
      mistakes,
      lastDate: new Date().toISOString()
    };
    if (passed) {
      this.markLessonComplete(courseId, lessonId);
    }
    this.save();
  }

  // Self-Check Micro-Quiz Records
  recordSelfCheck(courseId, lessonId, pId, confidenceBefore, confidenceAfter, score, total) {
    const key = `${courseId}_${lessonId}_${pId}`;
    this.state.selfChecks[key] = {
      confidenceBefore,
      confidenceAfter,
      score,
      total,
      timestamp: Date.now()
    };
    this.save();
  }

  // Notes & Highlights
  addNote(courseId, lessonId, sentenceId, text, color = 'yellow') {
    const note = {
      id: 'note_' + Date.now(),
      courseId,
      lessonId,
      sentenceId,
      text,
      color,
      timestamp: new Date().toISOString()
    };
    this.state.notes.push(note);
    this.save();
    return note;
  }

  deleteNote(id) {
    this.state.notes = this.state.notes.filter(n => n.id !== id);
    this.save();
  }

  exportNotesMarkdown() {
    if (this.state.notes.length === 0) return '# Quick Services Academy — Notes\n\nNo notes saved yet.';
    let md = '# Quick Services Academy — Student Notes & Highlights\n\n';
    this.state.notes.forEach((n, i) => {
      md += `### ${i + 1}. [${n.courseId.toUpperCase()} • Lesson ${n.lessonId}]\n`;
      md += `> "${n.text}"\n\n`;
      md += `*Saved: ${new Date(n.timestamp).toLocaleDateString()}*\n\n---\n\n`;
    });
    return md;
  }

  // Streaks & Badges
  _updateDailyStreak() {
    const today = new Date().toISOString().split('T')[0];
    const last = this.state.streak.lastStudyDate;
    if (last !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (last === yesterday) {
        this.state.streak.current += 1;
      } else {
        this.state.streak.current = 1;
      }
      this.state.streak.lastStudyDate = today;
    }
  }

  _checkMilestoneBadges(courseId) {
    const totalDone = Object.values(this.state.completedLessons).reduce((a, b) => a + b.length, 0);
    if (totalDone === 1 && !this.hasBadge('first_step')) {
      this.state.badges.push({ id: 'first_step', title: 'First Step', icon: '🌱', earnedAt: new Date().toISOString() });
    }
    if (totalDone >= 10 && !this.hasBadge('scholar_10')) {
      this.state.badges.push({ id: 'scholar_10', title: 'Ten Lessons Completed', icon: '📚', earnedAt: new Date().toISOString() });
    }
  }

  hasBadge(id) {
    return this.state.badges.some(b => b.id === id);
  }

  // Export / Import
  exportJSON() {
    return JSON.stringify(this.state, null, 2);
  }

  importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.version && data.completedLessons) {
        this.state = { ...DEFAULT_STATE, ...data };
        this.save();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  reset() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.save();
  }
}

export const store = new Store();
