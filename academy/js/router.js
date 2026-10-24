/**
 * Quick Services Academy — Client Hash Router
 * Supports bare and prefixed tokens (#/, #course-id, #lesson-course-id, #learning, #certificates, #verify-id)
 */

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    window.addEventListener('hashchange', () => this._handleRoute());
  }

  addRoute(pattern, handler) {
    this.routes[pattern] = handler;
  }

  navigate(hash) {
    window.location.hash = hash.startsWith('#') ? hash : '#' + hash;
  }

  _handleRoute() {
    const rawHash = window.location.hash.slice(1) || '/';
    const cleanHash = rawHash.startsWith('/') && rawHash.length > 1 ? rawHash.slice(1) : rawHash;

    // 1. Lesson Route: #lesson-<course>-<id>
    if (cleanHash.startsWith('lesson-')) {
      const rest = cleanHash.replace('lesson-', '');
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
      const courseId = cleanHash.replace('course-', '');
      if (this.routes['course']) {
        this.routes['course']({ courseId });
        return;
      }
    }

    // 3. Certificate View Route: #certificate-<id>
    if (cleanHash.startsWith('certificate-')) {
      const certId = cleanHash.replace('certificate-', '');
      if (this.routes['certificate']) {
        this.routes['certificate']({ certId });
        return;
      }
    }

    // 4. Verify Route: #verify-<id>
    if (cleanHash.startsWith('verify-')) {
      const certId = cleanHash.replace('verify-', '');
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
}

export const router = new Router();
