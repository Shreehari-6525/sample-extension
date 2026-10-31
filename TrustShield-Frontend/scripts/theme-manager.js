/**
 * TrustShield AI — Theme Manager
 * Manages Dark / Light / System theme switching.
 */

'use strict';

const ThemeManager = (() => {

  const THEMES = { DARK: 'dark', LIGHT: 'light', SYSTEM: 'system' };
  let _currentTheme = THEMES.DARK;

  function _applyTheme(theme) {
    const root = document.documentElement;
    if (theme === THEMES.SYSTEM) {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
    _currentTheme = theme;
    _updateThemeButtons(theme);
  }

  function _updateThemeButtons(theme) {
    document.querySelectorAll('[data-theme-btn]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.themeBtn === theme);
    });
  }

  async function init() {
    const saved = await Storage.Theme.get() || THEMES.DARK;
    _applyTheme(saved);

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (_currentTheme === THEMES.SYSTEM) _applyTheme(THEMES.SYSTEM);
    });
  }

  async function setTheme(theme) {
    if (!Object.values(THEMES).includes(theme)) return;
    await Storage.Theme.set(theme);
    _applyTheme(theme);
  }

  function getTheme() { return _currentTheme; }

  function isDark() {
    if (_currentTheme === THEMES.DARK) return true;
    if (_currentTheme === THEMES.LIGHT) return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  return { init, setTheme, getTheme, isDark, THEMES };

})();

