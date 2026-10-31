/**
 * TrustShield AI — Dashboard Controller & Router
 * Manages hash-based routing, sidebar navigation, themes, and shared UI states.
 */

'use strict';

/* ════════════════════════════════════════════════════════════
   PAGE ROUTER CONFIG
════════════════════════════════════════════════════════════ */
const ROUTES = {
  'overview':        { title: 'Overview',             loader: () => loadOverviewPage() },
  'universal-scan':  { title: 'Universal Scan',       loader: () => loadUniversalScanPage() },
  'url-scanner':     { title: 'URL Scanner',          loader: () => loadUrlScannerPage() },
  'email-sms':       { title: 'Email / SMS Scanner',  loader: () => loadEmailSmsPage() },
  'history':         { title: 'Scan History',         loader: () => loadScanHistoryPage() },
  'report':          { title: 'Threat Analysis Report', loader: () => loadThreatReportPage() },
  'analytics':       { title: 'Threat Analytics',     loader: () => loadAnalyticsPage() },
  'protection':      { title: 'Browser Protection',   loader: () => loadBrowserProtectionPage() },
  'settings':        { title: 'Settings',             loader: () => loadSettingsPage() },
  'profile':         { title: 'User Profile',         loader: () => loadProfilePage() }
};

/* ════════════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  await ThemeManager.init();

  // Protected area: nothing is rendered or routed until a session is confirmed.
  if (!(await AuthGuard.requireAuth())) return;
  document.body.classList.remove('auth-checking');
  AuthGuard.watchSession();

  setupSidebarNavigation();
  setupTopbarInteractions();
  setupThemeSwitcher();
  setupGlobalModal();
  updateProtectionStatusUI();
  updateUserProfileUI();

  // Listen for hash changes
  window.addEventListener('hashchange', handleRoute);

  // Initial route
  handleRoute();
});

/* ════════════════════════════════════════════════════════════
   ROUTING
════════════════════════════════════════════════════════════ */
async function handleRoute() {
  const hash = window.location.hash.replace('#', '').trim() || 'overview';
  const targetRoute = ROUTES[hash] ? hash : 'overview';
  const route = ROUTES[targetRoute];

  setActiveSidebarItem(targetRoute);
  setPageTitle(route.title);

  // Show page loading indicator
  const container = document.getElementById('pageContent');
  if (container) {
    container.innerHTML = `
      <div class="page-loading">
        <div class="scan-animation"><div class="scan-animation-inner"></div></div>
        <p class="text-secondary">Loading ${route.title}…</p>
      </div>
    `;
  }

  // Close mobile sidebar if open
  document.getElementById('sidebar')?.classList.remove('mobile-open');

  try {
    await route.loader();
  } catch (err) {
    console.error(`Error loading page [${targetRoute}]:`, err);
    if (container) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <div class="empty-state-title">Failed to load view</div>
          <div class="empty-state-msg">${err.message || 'An unexpected error occurred while rendering this page.'}</div>
          <button class="btn btn-secondary btn-sm mt-3" onclick="window.location.hash='#overview'">Return to Overview</button>
        </div>
      `;
    }
  }
}

function setPageTitle(title) {
  const titleEl = document.getElementById('topbarPageTitle');
  if (titleEl) titleEl.textContent = title;
  document.title = `TrustShield AI — ${title}`;
}

function setActiveSidebarItem(page) {
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    const isCurrent = item.dataset.page === page;
    item.classList.toggle('active', isCurrent);
  });
}

/* ════════════════════════════════════════════════════════════
   SIDEBAR & TOPBAR INTERACTIONS
════════════════════════════════════════════════════════════ */
function setupSidebarNavigation() {
  const sidebar = document.getElementById('sidebar');
  const collapseBtn = document.getElementById('sidebarCollapseBtn');
  const mobileToggle = document.getElementById('sidebarMobileToggle');
  const appLayout = document.getElementById('appLayout');

  collapseBtn?.addEventListener('click', () => {
    appLayout?.classList.toggle('sidebar-collapsed');
    const isCollapsed = appLayout?.classList.contains('sidebar-collapsed');
    Storage.set('sidebar_collapsed', isCollapsed);
  });

  mobileToggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('mobile-open');
  });

  // Restore collapsed state if stored
  Storage.get('sidebar_collapsed').then(collapsed => {
    if (collapsed) appLayout?.classList.add('sidebar-collapsed');
  });
}

function setupTopbarInteractions() {
  document.getElementById('topbarUser')?.addEventListener('click', () => {
    window.location.hash = '#profile';
  });
}

/* ════════════════════════════════════════════════════════════
   THEME SWITCHER
════════════════════════════════════════════════════════════ */
function setupThemeSwitcher() {
  const currentTheme = ThemeManager.getTheme();
  updateThemeSwitcherUI(currentTheme);

  document.querySelectorAll('[data-theme-btn]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const selected = btn.dataset.themeBtn;
      await ThemeManager.setTheme(selected);
      updateThemeSwitcherUI(selected);
    });
  });
}

function updateThemeSwitcherUI(theme) {
  document.querySelectorAll('[data-theme-btn]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.themeBtn === theme);
  });
}

/* ════════════════════════════════════════════════════════════
   STATUS & USER SYNC
════════════════════════════════════════════════════════════ */
async function updateProtectionStatusUI() {
  const status = await ApiService.getProtectionStatus();
  const pill = document.getElementById('sidebarProtPill');
  if (!pill) return;

  if (status.enabled) {
    pill.className = 'protection-pill active';
    pill.innerHTML = `<span class="dot dot-success dot-pulse"></span><span class="sidebar-nav-text">Protected</span>`;
  } else {
    pill.className = 'protection-pill inactive';
    pill.innerHTML = `<span class="dot dot-danger"></span><span class="sidebar-nav-text">Disabled</span>`;
  }
}

async function updateUserProfileUI() {
  const authState = await Storage.Auth.get();
  const user = authState?.user || MockData.users.citizen;

  const roleText = user.role === 'secops' ? 'SecOps Admin' : 'Citizen User';
  const nameEl = document.querySelector('.topbar-user-name');
  const roleEl = document.querySelector('.topbar-user-role');
  const avatarEl = document.querySelector('.topbar-user .avatar');

  if (nameEl) nameEl.textContent = user.name || 'Alex Johnson';
  if (roleEl) roleEl.textContent = roleText;
  if (avatarEl) avatarEl.textContent = AuthGuard.initialsOf(user);
}

/* ════════════════════════════════════════════════════════════
   GLOBAL MODAL UTILITY
════════════════════════════════════════════════════════════ */
function setupGlobalModal() {
  const overlay = document.getElementById('modalOverlay');
  const cancel = document.getElementById('modalCancel');

  cancel?.addEventListener('click', () => {
    overlay?.classList.add('hidden');
  });

  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.add('hidden');
  });
}

function showConfirmDialog({ title, message, confirmText = 'Confirm', onConfirm }) {
  const overlay = document.getElementById('modalOverlay');
  const titleEl = document.getElementById('modalTitle');
  const bodyEl = document.getElementById('modalBody');
  const confirmBtn = document.getElementById('modalConfirm');

  if (!overlay || !titleEl || !bodyEl || !confirmBtn) return;

  titleEl.textContent = title;
  bodyEl.textContent = message;
  confirmBtn.textContent = confirmText;

  // Clear previous handlers
  const newConfirmBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

  newConfirmBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    if (typeof onConfirm === 'function') onConfirm();
  });

  overlay.classList.remove('hidden');
}

