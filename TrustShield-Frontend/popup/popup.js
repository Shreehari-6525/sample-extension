/**
 * TrustShield AI — Popup Controller
 * Handles popup interactions, tab switching, scanning, and recent history.
 */

'use strict';

/* ════════════════════════════════════════════════════════════
   POPUP STATE
════════════════════════════════════════════════════════════ */
const PopupState = {
  activeTab:    'url',    // 'url' | 'email'
  scanning:     false,
  lastReport:   null,
};

/* ════════════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  await ThemeManager.init();

  // Signed-out users only ever see the auth gate — never the scanner.
  const user = await AuthGuard.getUser();
  if (!user) {
    showAuthGate();
    return;
  }

  document.body.classList.remove('auth-checking');
  document.getElementById('popupAvatarText').textContent = AuthGuard.initialsOf(user);
  renderRecentScans();
  setupEventListeners();
  loadProtectionStatus();
});

/* ════════════════════════════════════════════════════════════
   AUTH GATE (signed-out state)
════════════════════════════════════════════════════════════ */
function showAuthGate() {
  document.querySelector('.popup-shell').classList.add('hidden');
  document.getElementById('authGate').classList.remove('hidden');
  document.body.classList.remove('auth-checking');

  document.getElementById('gateSignIn').addEventListener('click', () => openAuth('signin'));
  document.getElementById('gateRegister').addEventListener('click', () => openAuth('register'));
  // Google is a placeholder: send the user to the sign-in screen, which explains its status.
  document.getElementById('gateGoogle').addEventListener('click', () => openAuth('signin'));
  document.getElementById('gateTerms').addEventListener('click', e => { e.preventDefault(); openAuth('legal'); });
  document.getElementById('gatePrivacy').addEventListener('click', e => { e.preventDefault(); openAuth('legal'); });
}

function openAuth(view) {
  if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
    chrome.runtime.sendMessage({ action: 'openAuth', view });
  } else {
    window.open(view === 'legal' ? '../auth/legal.html' : '../auth/auth.html#' + view, '_blank');
  }
  window.close();
}

async function handlePopupSignOut() {
  await AuthGuard.signOut();
  window.location.reload();
}

/* ════════════════════════════════════════════════════════════
   EVENT LISTENERS
════════════════════════════════════════════════════════════ */
function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // URL input
  const urlInput = document.getElementById('urlInput');
  const urlClear = document.getElementById('urlClear');
  urlInput.addEventListener('input', () => {
    urlClear.style.display = urlInput.value ? 'flex' : 'none';
    hideError('urlError');
    hideQuickResult();
  });
  urlClear.addEventListener('click', () => {
    urlInput.value = '';
    urlClear.style.display = 'none';
    urlInput.focus();
    hideQuickResult();
  });

  // Email input
  document.getElementById('emailInput').addEventListener('input', () => {
    hideError('emailError');
    hideQuickResult();
  });
  document.getElementById('btnClearEmail').addEventListener('click', () => {
    document.getElementById('emailInput').value = '';
    hideQuickResult();
  });

  // Scan buttons
  document.getElementById('btnAnalyzeUrl').addEventListener('click', handleScanUrl);
  document.getElementById('btnAnalyzeEmail').addEventListener('click', handleScanEmail);
  document.getElementById('btnScanCurrentTab').addEventListener('click', handleScanCurrentTab);
  document.getElementById('btnViewFullReport').addEventListener('click', openFullReport);

  // Navigation
  document.getElementById('btnOpenDashboard').addEventListener('click', () =>
    openDashboard('overview')
  );
  document.getElementById('btnSettings').addEventListener('click', () =>
    openDashboard('settings')
  );
  document.getElementById('popupAvatar').addEventListener('click', () =>
    openDashboard('profile')
  );
  document.getElementById('btnViewHistory').addEventListener('click', () =>
    openDashboard('history')
  );
  document.getElementById('btnPopupSignOut').addEventListener('click', handlePopupSignOut);

  // Theme toggle
  document.getElementById('popupThemeToggle').addEventListener('click', () => {
    const next = ThemeManager.isDark() ? ThemeManager.THEMES.LIGHT : ThemeManager.THEMES.DARK;
    ThemeManager.setTheme(next);
  });

  // Keyboard: Enter to scan
  document.getElementById('urlInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleScanUrl();
  });
}

/* ════════════════════════════════════════════════════════════
   TAB SWITCHING
════════════════════════════════════════════════════════════ */
function switchTab(tab) {
  PopupState.activeTab = tab;

  document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
    const isActive = btn.dataset.tab === tab;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);
  });

  document.getElementById('panel-url').classList.toggle('hidden', tab !== 'url');
  document.getElementById('panel-email').classList.toggle('hidden', tab !== 'email');
  hideQuickResult();
  document.getElementById('scanningState').classList.add('hidden');
}

/* ════════════════════════════════════════════════════════════
   SCAN: URL
════════════════════════════════════════════════════════════ */
async function handleScanUrl() {
  const input = document.getElementById('urlInput');
  const url = input.value.trim();

  if (!url) { showError('urlError', '⚠ Please enter a URL to scan.'); return; }
  if (!Utils.isValidUrl(url)) { showError('urlError', '⚠ Please enter a valid URL (e.g. google.com).'); return; }

  await performScan('url', url);
}

/* ════════════════════════════════════════════════════════════
   SCAN: CURRENT TAB
════════════════════════════════════════════════════════════ */
async function handleScanCurrentTab() {
  const btn = document.getElementById('btnScanCurrentTab');
  btn.disabled = true;

  try {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.url) {
        document.getElementById('urlInput').value = tab.url;
        document.getElementById('urlClear').style.display = 'flex';
        await performScan('url', tab.url);
      }
    } else {
      // Dev fallback
      await performScan('url', 'https://example-demo-page.com');
    }
  } finally {
    btn.disabled = false;
  }
}

/* ════════════════════════════════════════════════════════════
   SCAN: EMAIL / SMS
════════════════════════════════════════════════════════════ */
async function handleScanEmail() {
  const text = document.getElementById('emailInput').value.trim();
  if (!text) { showError('emailError', '⚠ Please enter a message to analyze.'); return; }
  if (text.length < 10) { showError('emailError', '⚠ Message is too short to analyze.'); return; }
  await performScan('email', text);
}

/* ════════════════════════════════════════════════════════════
   CORE SCAN FLOW
════════════════════════════════════════════════════════════ */
async function performScan(type, input) {
  if (PopupState.scanning) return;
  PopupState.scanning = true;

  setScanning(true, type);

  try {
    let report;
    if (type === 'url') {
      report = await ApiService.scanUrl(input);
    } else {
      report = await ApiService.scanEmailSms(input);
    }

    PopupState.lastReport = report;
    await Storage.ScanHistory.add(report);
    renderQuickResult(report);
    renderRecentScans();

  } catch (err) {
    Utils.showToast('Scan failed. Please try again.', 'error');
  } finally {
    PopupState.scanning = false;
    setScanning(false);
  }
}

/* ════════════════════════════════════════════════════════════
   SCANNING UI STATE
════════════════════════════════════════════════════════════ */
function setScanning(active, type = 'url') {
  const scanState  = document.getElementById('scanningState');
  const quickResult = document.getElementById('quickResult');
  const panels     = ['panel-url', 'panel-email'];

  if (active) {
    panels.forEach(id => document.getElementById(id).classList.add('hidden'));
    quickResult.classList.add('hidden');
    scanState.classList.remove('hidden');
    document.getElementById('scanningText').textContent =
      type === 'url' ? 'Analyzing URL threat indicators…' : 'Analyzing message for phishing patterns…';
  } else {
    document.getElementById(PopupState.activeTab === 'url' ? 'panel-url' : 'panel-email').classList.remove('hidden');
    scanState.classList.add('hidden');
  }
}

/* ════════════════════════════════════════════════════════════
   QUICK RESULT RENDER
════════════════════════════════════════════════════════════ */
function renderQuickResult(report) {
  const container = document.getElementById('quickResult');
  const content   = document.getElementById('quickResultContent');
  const scoreColor = Utils.getRiskColor(report.riskScore);
  const verdictClass = Utils.getVerdictBadgeClass(report.verdict);
  const sevClass = Utils.getSeverityBadgeClass(report.severity);
  const target = Utils.truncate(
    report.type === 'url' ? Utils.extractDomain(report.target) : report.displayTarget || report.target,
    38
  );

  content.innerHTML = `
    <div class="popup-result-verdict-row">
      <span class="popup-result-score" style="color:${scoreColor}">${report.riskScore}<small style="font-size:12px;color:var(--text-muted)">/100</small></span>
      <div style="display:flex;gap:5px;align-items:center">
        <span class="badge ${sevClass}">${Utils.getSeverityLabel(report.severity)}</span>
        <span class="badge ${verdictClass}">${Utils.capitalize(report.verdict)}</span>
      </div>
    </div>
    <div class="popup-result-target">${Utils.sanitizeHtml(target)}</div>
    <div class="popup-result-summary">${Utils.sanitizeHtml(Utils.truncate(report.summary, 100))}</div>
    ${report._isDemo ? '<div class="demo-notice" style="margin-top:8px;font-size:10px">⚗ Demo data — not a real ML prediction</div>' : ''}
  `;

  container.classList.remove('hidden');
}

function hideQuickResult() {
  document.getElementById('quickResult').classList.add('hidden');
}

/* ════════════════════════════════════════════════════════════
   RECENT SCANS
════════════════════════════════════════════════════════════ */
async function renderRecentScans() {
  const list = document.getElementById('recentScansList');
  let history = (await Storage.ScanHistory.get()) || MockData.scanHistory.slice(0, 5);
  if (!history.length) history = MockData.scanHistory.slice(0, 5);
  const recent = history.slice(0, 5);

  if (!recent.length) {
    list.innerHTML = `<div class="empty-state" style="padding:16px"><p class="text-muted text-sm">No recent scans</p></div>`;
    return;
  }

  list.innerHTML = recent.map(item => {
    const scoreColor = Utils.getRiskColor(item.riskScore);
    const isUrl = item.type === 'url';
    const iconBg = isUrl ? 'var(--info-bg)' : 'rgba(180,120,255,0.12)';
    const iconColor = isUrl ? 'var(--info)' : '#B478FF';
    const icon = isUrl
      ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`
      : `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;
    const target = isUrl
      ? Utils.truncate(Utils.extractDomain(item.target), 28)
      : Utils.truncate(item.displayTarget || item.target, 28);

    return `
      <div class="popup-scan-item" data-scan-id="${item.id}" role="button" tabindex="0"
           aria-label="Scan result: ${target}, score ${item.riskScore}">
        <div class="popup-scan-type-icon" style="background:${iconBg};color:${iconColor}">${icon}</div>
        <div class="popup-scan-body">
          <div class="popup-scan-target">${Utils.sanitizeHtml(target)}</div>
          <div class="popup-scan-meta">${Utils.timeAgo(item.timestamp)}</div>
        </div>
        <span class="popup-scan-score" style="color:${scoreColor}">${item.riskScore}</span>
      </div>
    `;
  }).join('');

  // Click to open report
  list.querySelectorAll('.popup-scan-item').forEach(item => {
    item.addEventListener('click', () => openDashboard('report'));
    item.addEventListener('keydown', e => { if (e.key === 'Enter') openDashboard('report'); });
  });
}

/* ════════════════════════════════════════════════════════════
   PROTECTION STATUS
════════════════════════════════════════════════════════════ */
async function loadProtectionStatus() {
  const status = await ApiService.getProtectionStatus();
  const pill   = document.getElementById('popupProtectionPill');
  const meta   = document.getElementById('popupStatusMeta');

  if (status.enabled) {
    pill.className = 'protection-pill active';
    pill.innerHTML = '<span class="dot dot-success dot-pulse"></span><span>Protection Active</span>';
    meta.textContent = `${status.blockedToday} threat${status.blockedToday !== 1 ? 's' : ''} blocked today`;
  } else {
    pill.className = 'protection-pill inactive';
    pill.innerHTML = '<span class="dot dot-danger"></span><span>Protection Off</span>';
    meta.textContent = 'Enable browser protection';
  }
}

/* ════════════════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════════════════ */
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.remove('hidden'); }
}

function hideError(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

function openDashboard(hash) {
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.sendMessage({ action: 'openDashboard', hash });
  } else {
    window.open('../dashboard/dashboard.html#' + hash, '_blank');
  }
}

function openFullReport() {
  openDashboard('report');
}

