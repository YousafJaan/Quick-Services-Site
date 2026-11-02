/**
 * Quick Services Academy — Client Hash Router
 * Supports bare and prefixed tokens (#/, #course-id, #lesson-course-id, #learning, #certificates, #verify-id)
 * Version 2.5.0: Positional prefix parsing for hyphenated slugs + lifecycle unmount teardown.
 */

import { teardownWidget } from './widgets/index.js';

export const CANONICAL_COURSES = [
  'thesis101',
  'cite101',
  'integrity101',
  'edit101',
  'lit-search',
  'sample-size',
  'spss101',
  'smartpls',
  'viva'
].sort((a, b) => b.length - a.length); // Longest first to avoid prefix collisions

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', () => this._handleRoute());
    }
  }

  addRoute(pattern, handler) {
    this.routes[pattern] = handler;
  }

  navigate(hash) {
    if (typeof window !== 'undefined') {
      window.location.hash = hash.startsWith('#') ? hash : '#' + hash;
    }
  }

  _handleRoute() {
    // 0. Teardown running widget timers or audio/interval processes on route transition
    teardownWidget();

    const rawHash = typeof window !== 'undefined' ? (window.location.hash.slice(1) || '/') : '/';
    const cleanHash = rawHash.startsWith('/') && rawHash.length > 1 ? rawHash.slice(1) : rawHash;

    // 1. Lesson Route: #lesson-<course>-<id> (Positional prefix matching)
    if (cleanHash.startsWith('lesson-')) {
      const rest = cleanHash.slice(7); // strip 'lesson-'
      const matchedCourse = CANONICAL_COURSES.find(cid => rest === cid || rest.startsWith(cid + '-'));
      if (matchedCourse) {
        const lessonId = rest.slice(matchedCourse.length + 1);
        if (this.routes['lesson']) {
          this.routes['lesson']({ courseId: matchedCourse, lessonId });
          return;
        }
      }
      // Resilient fallback for custom or unlisted course slugs
      const lastHyphen = rest.lastIndexOf('-');
      if (lastHyphen > 0) {
        const courseId = rest.slice(0, lastHyphen);
        const lessonId = rest.slice(lastHyphen + 1);
        if (this.routes['lesson']) {
          this.routes['lesson']({ courseId, lessonId });
          return;
        }
      }
    }

    // 2. Course Route: #course-<id>
    if (cleanHash.startsWith('course-')) {
      const rest = cleanHash.slice(7);
      const matchedCourse = CANONICAL_COURSES.find(cid => rest === cid || rest.startsWith(cid)) || rest;
      if (this.routes['course']) {
        this.routes['course']({ courseId: matchedCourse });
        return;
      }
    }

    // 3. Certificate View Route: #certificate-<id>
    if (cleanHash.startsWith('certificate-')) {
      const certId = cleanHash.slice(12);
      if (this.routes['certificate']) {
        this.routes['certificate']({ certId });
        return;
      }
    }

    // 4. Verify Route: #verify-<id>
    if (cleanHash.startsWith('verify-')) {
      const certId = cleanHash.slice(7);
      if (this.routes['verify']) {
        this.routes['verify']({ certId });
        return;
      }
    }

    // 5. Named Static Routes
    if (this.routes[cleanHash]) {
      this.routes[cleanHash]();
      return;
    }

    // 6. Default to Catalog (#/)
    if (this.routes['/']) {
      this.routes['/']();
    }
  }

  start() {
    this._handleRoute();
  }

  resolve() {
    this._handleRoute();
  }
}

export const router = new Router();
