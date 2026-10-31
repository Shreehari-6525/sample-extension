/**
 * TrustShield AI — Auth Guard
 * ─────────────────────────────────────────────────────────────
 * Single place that decides whether a session exists and sends
 * unauthenticated visitors to the authentication screen.
 *
 * PROTOTYPE NOTE: the "session" is a local demo object written by
 * auth.js into chrome.storage.local. It is NOT a verified login.
 *
 * BACKEND INTEGRATION (Spring Boot + JWT + Google OAuth):
 *   Replace isAuthenticated() with a check of the stored JWT
 *   (expiry, or GET /api/v1/auth/me). Every page already routes
 *   through this guard, so nothing else needs to change.
 * ─────────────────────────────────────────────────────────────
 */

'use strict';

const AuthGuard = (() => {

  const AUTH_PAGE      = 'auth/auth.html';
  const DASHBOARD_PAGE = 'dashboard/dashboard.html';

  /* A session counts only if it has both a user and a token. */
  function _isValid(state) {
    return !!(state && state.user && state.token);
  }

  async function isAuthenticated() {
    return _isValid(await Storage.Auth.get());
  }

  async function getUser() {
    const state = await Storage.Auth.get();
    return _isValid(state) ? state.user : null;
  }

  /** Build an absolute extension URL (works from any page folder). */
  function _url(path, hash) {
    const full = (typeof chrome !== 'undefined' && chrome.runtime?.getURL)
      ? chrome.runtime.getURL(path)
      : new URL('../' + path, window.location.href).href;
    return hash ? `${full}#${hash}` : full;
  }

  function authUrl(hash = 'signin')       { return _url(AUTH_PAGE, hash); }
  function dashboardUrl(hash = 'overview'){ return _url(DASHBOARD_PAGE, hash); }

  /**
   * Call first on every protected page.
   * Resolves true if signed in; otherwise redirects and resolves false.
   */
  async function requireAuth() {
    if (await isAuthenticated()) return true;
    window.location.replace(authUrl('signin'));
    return false;
  }

  /** If the session disappears (e.g. signed out in another tab), leave the protected page. */
  function watchSession() {
    if (typeof chrome === 'undefined' || !chrome.storage?.onChanged) return;
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local' || !changes[Storage.KEYS.AUTH_STATE]) return;
      if (!_isValid(changes[Storage.KEYS.AUTH_STATE].newValue)) {
        window.location.replace(authUrl('signin'));
      }
    });
  }

  async function signOut() {
    await Storage.Auth.clear();
  }

  function initialsOf(user) {
    if (!user) return '?';
    if (user.initials) return user.initials;
    const source = (user.name || user.email || '?').trim();
    const parts = source.split(/\s+/).filter(Boolean);
    const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : source.slice(0, 2);
    return letters.toUpperCase();
  }

  return { isAuthenticated, getUser, requireAuth, watchSession, signOut, authUrl, dashboardUrl, initialsOf };

})();
