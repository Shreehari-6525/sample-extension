/**
 * TrustShield AI — Chrome Storage Wrapper
 * Abstracts chrome.storage.local for UI preferences and local demo data.
 */

'use strict';

const Storage = (() => {

  const KEYS = {
    THEME:        'ts_theme',
    PROTECTION:   'ts_protection',
    USER_ROLE:    'ts_user_role',
    SCAN_HISTORY: 'ts_scan_history',
    SETTINGS:     'ts_settings',
    AUTH_STATE:   'ts_auth',
  };

  function _isExtension() {
    return typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
  }

  async function get(key) {
    if (_isExtension()) {
      return new Promise(resolve => {
        chrome.storage.local.get([key], result => resolve(result[key]));
      });
    }
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  }

  async function set(key, value) {
    if (_isExtension()) {
      return new Promise(resolve => {
        chrome.storage.local.set({ [key]: value }, resolve);
      });
    }
    localStorage.setItem(key, JSON.stringify(value));
  }

  async function remove(key) {
    if (_isExtension()) {
      return new Promise(resolve => chrome.storage.local.remove([key], resolve));
    }
    localStorage.removeItem(key);
  }

  async function clear() {
    if (_isExtension()) {
      return new Promise(resolve => chrome.storage.local.clear(resolve));
    }
    localStorage.clear();
  }

  /* ── Typed Helpers ─────────────────────────────────────────── */
  const Theme = {
    get: () => get(KEYS.THEME),
    set: (theme) => set(KEYS.THEME, theme), // 'dark' | 'light' | 'system'
  };

  const Protection = {
    get: () => get(KEYS.PROTECTION),
    set: (status) => set(KEYS.PROTECTION, status),
  };

  const UserRole = {
    get: () => get(KEYS.USER_ROLE),
    set: (role) => set(KEYS.USER_ROLE, role), // 'citizen' | 'secops'
  };

  const Auth = {
    get: () => get(KEYS.AUTH_STATE),
    set: (state) => set(KEYS.AUTH_STATE, state),
    clear: () => remove(KEYS.AUTH_STATE),
  };

  const Settings = {
    get: () => get(KEYS.SETTINGS),
    set: (settings) => set(KEYS.SETTINGS, settings),
  };

  const ScanHistory = {
    get: () => get(KEYS.SCAN_HISTORY),
    add: async (record) => {
      const history = (await get(KEYS.SCAN_HISTORY)) || [];
      history.unshift(record);
      if (history.length > 50) history.pop(); // Keep last 50 locally
      await set(KEYS.SCAN_HISTORY, history);
    },
    clear: () => remove(KEYS.SCAN_HISTORY),
  };

  return { get, set, remove, clear, KEYS, Theme, Protection, UserRole, Auth, Settings, ScanHistory };

})();

