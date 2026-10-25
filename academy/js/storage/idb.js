/**
 * Quick Academy IndexedDB Storage Module
 * Provides offline-first persistence for user avatars, research figures, and lesson notes.
 */

const DB_NAME = 'QuickAcademyDB';
const DB_VERSION = 1;

let dbPromise = null;

export function openDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;

      // 1. User Profile (Avatars & Info)
      if (!db.objectStoreNames.contains('user_profiles')) {
        db.createObjectStore('user_profiles', { keyPath: 'id' });
      }

      // 2. Research Figures (Statistical Plots, Screenshots, APA Tables)
      if (!db.objectStoreNames.contains('research_figures')) {
        const figureStore = db.createObjectStore('research_figures', { keyPath: 'id' });
        figureStore.createIndex('courseId', 'courseId', { unique: false });
        figureStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // 3. Lesson Notes & Attachments
      if (!db.objectStoreNames.contains('lesson_notes')) {
        const noteStore = db.createObjectStore('lesson_notes', { keyPath: 'id' });
        noteStore.createIndex('lessonKey', 'lessonKey', { unique: false }); // courseId:lessonId
        noteStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = (e) => {
      resolve(e.target.result);
    };

    request.onerror = (e) => {
      reject(e.target.error);
    };
  });

  return dbPromise;
}

// -------------------------------------------------------------
// User Profile (Avatar) Helpers
// -------------------------------------------------------------

export async function saveUserProfile(profile) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('user_profiles', 'readwrite');
      const store = tx.objectStore('user_profiles');
      profile.id = 'active_user';
      profile.updatedAt = new Date().toISOString();
      const req = store.put(profile);
      req.onsuccess = () => resolve(profile);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IDB saveUserProfile error:', err);
    return null;
  }
}

export async function getUserProfile() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('user_profiles', 'readonly');
      const store = tx.objectStore('user_profiles');
      const req = store.get('active_user');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IDB getUserProfile error:', err);
    return null;
  }
}

// -------------------------------------------------------------
// Research Figures Helpers
// -------------------------------------------------------------

export async function saveResearchFigure(figure) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('research_figures', 'readwrite');
      const store = tx.objectStore('research_figures');
      if (!figure.id) {
        figure.id = 'fig_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      }
      figure.createdAt = figure.createdAt || new Date().toISOString();
      const req = store.put(figure);
      req.onsuccess = () => resolve(figure);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IDB saveResearchFigure error:', err);
    return null;
  }
}

export async function getAllResearchFigures() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('research_figures', 'readonly');
      const store = tx.objectStore('research_figures');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IDB getAllResearchFigures error:', err);
    return [];
  }
}

export async function deleteResearchFigure(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('research_figures', 'readwrite');
      const store = tx.objectStore('research_figures');
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IDB deleteResearchFigure error:', err);
    return false;
  }
}

// -------------------------------------------------------------
// Lesson Notes & Attachments Helpers
// -------------------------------------------------------------

export async function saveLessonNote(note) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('lesson_notes', 'readwrite');
      const store = tx.objectStore('lesson_notes');
      if (!note.id) {
        note.id = 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      }
      note.lessonKey = `${note.courseId}:${note.lessonId}`;
      note.createdAt = note.createdAt || new Date().toISOString();
      const req = store.put(note);
      req.onsuccess = () => resolve(note);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IDB saveLessonNote error:', err);
    return null;
  }
}

export async function getLessonNotes(courseId, lessonId) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('lesson_notes', 'readonly');
      const store = tx.objectStore('lesson_notes');
      const index = store.index('lessonKey');
      const req = index.getAll(`${courseId}:${lessonId}`);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IDB getLessonNotes error:', err);
    return [];
  }
}

export async function deleteLessonNote(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('lesson_notes', 'readwrite');
      const store = tx.objectStore('lesson_notes');
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IDB deleteLessonNote error:', err);
    return false;
  }
}
