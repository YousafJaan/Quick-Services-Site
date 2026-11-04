/**
 * Quick Academy State Store
 * Offline-First LocalStorage & IndexedDB Synchronization
 *
 * @package QuickServicesTheme
 * @author M. Yousaf & Quick Services Engineering
 * @version 2.0.0
 */

class QuickStateStore {
  constructor() {
    this.storageKey = 'qsa-progress-v2';
    this.state = this.loadState();
  }

  loadState() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('LocalStorage unavailable, falling back to memory store.');
    }
    return {
      completedLessons: [],
      courseProgress: {},
      quizScores: {},
      certificates: []
    };
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to save to LocalStorage:', e);
    }
  }

  markLessonComplete(courseSlug, lessonSlug, score = 100) {
    if (!this.state.completedLessons.includes(lessonSlug)) {
      this.state.completedLessons.push(lessonSlug);
    }
    this.state.quizScores[lessonSlug] = score;

    // Recalculate course progress
    const currentCount = this.state.completedLessons.filter(l => l.startsWith(courseSlug)).length;
    this.state.courseProgress[courseSlug] = Math.min(100, Math.round((currentCount / 6) * 100));

    this.saveState();
    this.dispatchUpdateEvent();
  }

  getCourseProgress(courseSlug) {
    return this.state.courseProgress[courseSlug] || 0;
  }

  saveCertificate(certRecord) {
    this.state.certificates.push(certRecord);
    this.saveState();
  }

  dispatchUpdateEvent() {
    window.dispatchEvent(new CustomEvent('qsa-state-updated', { detail: this.state }));
  }
}

// Global Export & Auto-init
window.QuickStateStore = new QuickStateStore();
