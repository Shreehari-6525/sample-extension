/**
 * TrustShield AI — Universal Scan Page
 * Two-tab scanning workspace: URL Scanner + Email/SMS Scanner
 */

'use strict';

async function loadUniversalScanPage() {
  const content = document.getElementById('pageContent');
  if (!content) return;

  if (typeof setPageTitle === 'function') setPageTitle('Universal Scan');

  content.innerHTML = `
    <div class="page-container">

      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Universal Scan Console</h1>
          <p class="page-desc">Analyze URLs and messages for threats in one place</p>
        </div>
        <div class="demo-notice">⚗ Demo Mode — Simulated Threat Analysis</div>
      </div>

      <!-- Scanner Type Tabs -->
      <div class="tabs" id="universalTabs" role="tablist" style="max-width:400px">
        <button class="tab-btn active" data-tab="url" role="tab" aria-selected="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          URL / Website Scanner
        </button>
        <button class="tab-btn" data-tab="email" role="tab" aria-selected="false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          Email / SMS Scanner
        </button>
      </div>

      <!-- URL Scanner Panel -->
      <div class="universal-panel" id="upanel-url">
        <div class="card card-lg universal-card">
          <div class="card-header">
            <div>
              <div class="card-title">URL / Website Threat Scanner</div>
              <div class="card-subtitle">Detect phishing, domain spoofing, malicious redirects, and fake portals</div>
            </div>
            <span class="badge badge-url">URL Analysis</span>
          </div>

          <div class="input-group" style="margin-bottom:var(--space-4)">
            <label class="input-label" for="uScanUrlInput">Enter URL or Website Address</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </span>
              <input type="url" class="input" id="uScanUrlInput" style="padding-left:40px;padding-right:40px"
                placeholder="https://example.com or paste any URL..."
                autocomplete="off" spellcheck="false" aria-label="URL to scan"/>
              <button class="input-icon-right" id="uScanUrlClear" aria-label="Clear" style="display:none">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <span class="input-error hidden" id="uScanUrlError" role="alert"></span>
          </div>

          <!-- Demo suggestions -->
          <div class="universal-suggestions">
            <span class="text-muted text-xs">Try these demo URLs:</span>
            <div class="suggestion-chips">
              <button class="suggestion-chip danger" data-url="paypal-secure-verify.xyz">paypal-secure-verify.xyz</button>
              <button class="suggestion-chip danger" data-url="login.micros0ft-portal.net">login.micros0ft-portal.net</button>
              <button class="suggestion-chip danger" data-url="secure-banking.hdfc-alerts.co.in">hdfc-alerts.co.in</button>
              <button class="suggestion-chip success" data-url="https://google.com">google.com ✓</button>
              <button class="suggestion-chip success" data-url="https://github.com">github.com ✓</button>
            </div>
          </div>

          <div class="universal-actions">
            <button class="btn btn-ghost" id="uScanCurrentTab">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              Scan Current Tab
            </button>
            <button class="btn btn-ghost" id="uScanUrlClearBtn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Clear
            </button>
            <button class="btn btn-primary" id="uScanAnalyzeUrl">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Analyze URL
            </button>
          </div>
        </div>

        <!-- URL Scan Result -->
        <div class="hidden" id="uScanUrlLoading">
          <div class="page-loading">
            <div class="scan-animation"><div class="scan-animation-inner"></div></div>
            <p class="text-secondary">Analyzing URL threat indicators…</p>
            <p class="text-muted text-sm">Checking domain reputation, SSL, redirects, and phishing patterns</p>
          </div>
        </div>
        <div class="hidden" id="uScanUrlResult"></div>
      </div>

      <!-- Email/SMS Scanner Panel -->
      <div class="universal-panel hidden" id="upanel-email">
        <div class="card card-lg universal-card">
          <div class="card-header">
            <div>
              <div class="card-title">Email / SMS Phishing Scanner</div>
              <div class="card-subtitle">Detect phishing attempts, credential theft, OTP fraud, and social engineering</div>
            </div>
            <span class="badge badge-email">Message Analysis</span>
          </div>

          <div class="input-group" style="margin-bottom:var(--space-4)">
            <label class="input-label" for="uScanEmailInput">Paste Email or SMS Message</label>
            <textarea class="textarea" id="uScanEmailInput" rows="7"
              placeholder="Paste the full email or SMS message text here...&#10;&#10;Example: 'URGENT: Your account has been suspended. Click here to verify: http://bank-verify.xyz'"
              aria-label="Message text to analyze" style="min-height:160px"></textarea>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px">
              <span class="input-error hidden" id="uScanEmailError" role="alert"></span>
              <span class="text-muted text-xs" id="uEmailCharCount">0 characters</span>
            </div>
          </div>

          <!-- Demo message loaders -->
          <div class="universal-suggestions">
            <span class="text-muted text-xs">Load demo phishing message:</span>
            <div class="suggestion-chips">
              <button class="suggestion-chip danger" data-msg="urgent-account">Account Locked Phishing</button>
              <button class="suggestion-chip danger" data-msg="otp-theft">OTP Theft SMS</button>
              <button class="suggestion-chip danger" data-msg="ceo-fraud">CEO Fraud BEC</button>
              <button class="suggestion-chip success" data-msg="legitimate">Legitimate Message</button>
            </div>
          </div>

          <div class="universal-actions">
            <button class="btn btn-ghost" id="uScanEmailClear">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Clear
            </button>
            <button class="btn btn-primary" id="uScanAnalyzeEmail">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Analyze Message
            </button>
          </div>
        </div>

        <!-- Email Scan Result -->
        <div class="hidden" id="uScanEmailLoading">
          <div class="page-loading">
            <div class="scan-animation"><div class="scan-animation-inner"></div></div>
            <p class="text-secondary">Analyzing message for phishing patterns…</p>
            <p class="text-muted text-sm">Checking urgency signals, manipulation tactics, and credential theft indicators</p>
          </div>
        </div>
        <div class="hidden" id="uScanEmailResult"></div>
      </div>

    </div><!-- /page-container -->

    <style>
    .universal-card { margin-bottom: var(--space-6); }
    .universal-panel { display: flex; flex-direction: column; }
    .universal-suggestions { margin-bottom: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2); }
    .suggestion-chips { display: flex; flex-wrap: wrap; gap: var(--space-2); }
    .suggestion-chip {
      padding: 5px 12px; font-size: var(--text-xs); font-weight: var(--font-semibold);
      border-radius: var(--radius-full); cursor: pointer; border: 1px solid;
      transition: var(--transition-fast); background: transparent;
      font-family: var(--font-mono); letter-spacing: 0;
    }
    .suggestion-chip.danger { color: var(--danger); border-color: rgba(255,71,87,0.3); }
    .suggestion-chip.danger:hover { background: var(--danger-bg); }
    .suggestion-chip.success { color: var(--success); border-color: rgba(0,214,143,0.3); }
    .suggestion-chip.success:hover { background: var(--success-bg); }
    .universal-actions { display: flex; gap: var(--space-3); align-items: center; flex-wrap: wrap; }
    </style>
  `;

  setupUniversalScanListeners();
}

const DEMO_MESSAGES = {
  'urgent-account': `Subject: URGENT: Your account has been locked

Dear Customer,

Your PayPal account has been temporarily locked due to suspicious activity. You must verify your account within 24 hours or your account will be permanently deleted.

Click here to restore your account: http://paypal-secure-verify.xyz/restore

If you do not verify within 24 hours, your account and all funds will be permanently suspended.

PayPal Security Team`,

  'otp-theft': `Your OTP for SBI NetBanking transaction of Rs. 45,000 is 847291. Valid for 10 minutes. DO NOT share this OTP with anyone. SBI never asks for OTP over call. If not you, call 1800-11-2211 immediately.

URGENT: Forward this OTP to 9876543210 to verify your SBI account registration.`,

  'ceo-fraud': `From: Robert Mitchell <rmitchell.ceo@trustcorp-finance.co>
To: john.smith@company.com
Subject: Urgent - Wire Transfer Required

Hi John,

I'm in an important meeting and can't talk. I need you to urgently process a wire transfer of $8,500 to our new vendor account. This is time sensitive — please complete before 3PM today.

Account: Chase Bank
Routing: 021000021
Account: 4829103847
Beneficiary: Global Supplies LLC

Let me know when done. Do not discuss with anyone else — NDA matters.

Best,
Robert Mitchell
CEO, TrustCorp Finance`,

  'legitimate': `From: noreply@amazon.com
To: you@example.com
Subject: Your Amazon order has shipped

Hello Alex Johnson,

Your order #404-1234567-8901234 has been shipped and is on its way.

Order: Sony WH-1000XM5 Headphones
Tracking: 1Z999AA10123456784
Estimated delivery: November 2, 2026

Track your package at amazon.com/orders

Thank you for shopping with Amazon.`
};

function setupUniversalScanListeners() {
  // Tab switching
  document.querySelectorAll('#universalTabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('#universalTabs .tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === tab);
        b.setAttribute('aria-selected', b.dataset.tab === tab);
      });
      document.getElementById('upanel-url').classList.toggle('hidden', tab !== 'url');
      document.getElementById('upanel-email').classList.toggle('hidden', tab !== 'email');
    });
  });

  // URL input
  const urlInput = document.getElementById('uScanUrlInput');
  const urlClear = document.getElementById('uScanUrlClear');
  urlInput?.addEventListener('input', () => {
    urlClear.style.display = urlInput.value ? 'flex' : 'none';
  });
  urlClear?.addEventListener('click', () => { urlInput.value = ''; urlClear.style.display = 'none'; });
  document.getElementById('uScanUrlClearBtn')?.addEventListener('click', () => { urlInput.value = ''; urlClear.style.display = 'none'; });

  // URL suggestion chips
  document.querySelectorAll('.suggestion-chip[data-url]').forEach(chip => {
    chip.addEventListener('click', () => {
      urlInput.value = chip.dataset.url;
      urlClear.style.display = 'flex';
    });
  });

  // Email input
  const emailInput = document.getElementById('uScanEmailInput');
  emailInput?.addEventListener('input', () => {
    const count = document.getElementById('uEmailCharCount');
    if (count) count.textContent = emailInput.value.length + ' characters';
  });
  document.getElementById('uScanEmailClear')?.addEventListener('click', () => { emailInput.value = ''; document.getElementById('uEmailCharCount').textContent = '0 characters'; });

  // Demo message chips
  document.querySelectorAll('.suggestion-chip[data-msg]').forEach(chip => {
    chip.addEventListener('click', () => {
      emailInput.value = DEMO_MESSAGES[chip.dataset.msg] || '';
      document.getElementById('uEmailCharCount').textContent = emailInput.value.length + ' characters';
    });
  });

  // Scan buttons
  document.getElementById('uScanAnalyzeUrl')?.addEventListener('click', () => universalScanUrl());
  document.getElementById('uScanCurrentTab')?.addEventListener('click', universalScanCurrentTab);
  document.getElementById('uScanAnalyzeEmail')?.addEventListener('click', () => universalScanEmail());
  urlInput?.addEventListener('keydown', e => { if (e.key === 'Enter') universalScanUrl(); });
}

async function universalScanUrl() {
  const input = document.getElementById('uScanUrlInput');
  const url = input?.value.trim();
  const errorEl = document.getElementById('uScanUrlError');

  if (!url) { showUniversalError('uScanUrlError', '⚠ Please enter a URL to analyze.'); return; }
  if (!Utils.isValidUrl(url)) { showUniversalError('uScanUrlError', '⚠ Please enter a valid URL.'); return; }
  errorEl?.classList.add('hidden');

  const loading = document.getElementById('uScanUrlLoading');
  const result  = document.getElementById('uScanUrlResult');
  loading?.classList.remove('hidden');
  result?.classList.add('hidden');

  try {
    const report = await ApiService.scanUrl(url);
    await Storage.ScanHistory.add(report);
    result.innerHTML = renderInlineReport(report);
    result.classList.remove('hidden');
    setupExpandables(result);
  } catch (e) {
    Utils.showToast('Scan failed. Please try again.', 'error');
  } finally {
    loading?.classList.add('hidden');
  }
}

async function universalScanCurrentTab() {
  let url = '';
  try {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      url = tab?.url || '';
    }
  } catch (e) {}
  if (!url) url = 'https://current-tab-demo.example.com';
  document.getElementById('uScanUrlInput').value = url;
  document.getElementById('uScanUrlClear').style.display = 'flex';
  await universalScanUrl();
}

async function universalScanEmail() {
  const text = document.getElementById('uScanEmailInput')?.value.trim();
  if (!text) { showUniversalError('uScanEmailError', '⚠ Please enter a message to analyze.'); return; }
  if (text.length < 10) { showUniversalError('uScanEmailError', '⚠ Message is too short.'); return; }
  document.getElementById('uScanEmailError')?.classList.add('hidden');

  const loading = document.getElementById('uScanEmailLoading');
  const result  = document.getElementById('uScanEmailResult');
  loading?.classList.remove('hidden');
  result?.classList.add('hidden');

  try {
    const report = await ApiService.scanEmailSms(text);
    await Storage.ScanHistory.add(report);
    result.innerHTML = renderInlineReport(report);
    result.classList.remove('hidden');
    setupExpandables(result);
  } catch (e) {
    Utils.showToast('Scan failed. Please try again.', 'error');
  } finally {
    loading?.classList.add('hidden');
  }
}

function showUniversalError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.remove('hidden'); }
}

function renderInlineReport(report) {
  const scoreColor   = Utils.getRiskColor(report.riskScore);
  const verdictClass = Utils.getVerdictBadgeClass(report.verdict);
  const sevClass     = Utils.getSeverityBadgeClass(report.severity);
  const confidence   = report.confidence || 85;
  const target       = report.type === 'url'
    ? Utils.extractDomain(report.target)
    : Utils.truncate(report.displayTarget || report.target, 60);

  const indicatorsHtml = (report.indicators || []).length
    ? report.indicators.map(ind => `
        <div class="threat-indicator threat-indicator-${ind.type}">
          <div class="threat-indicator-icon">${ind.icon}</div>
          <div class="threat-indicator-body">
            <div class="threat-indicator-title">${Utils.sanitizeHtml(ind.title)}</div>
            <div class="threat-indicator-desc">${Utils.sanitizeHtml(ind.description)}</div>
          </div>
          <span class="badge badge-${ind.type}" style="flex-shrink:0">${Utils.capitalize(ind.type)}</span>
        </div>`).join('')
    : `<p class="text-secondary text-sm">No specific threat indicators recorded for this scan.</p>`;

  const recsHtml = (report.recommendations || []).map((r, i) =>
    `<div class="rec-item"><span class="rec-num">${i+1}</span><span>${Utils.sanitizeHtml(r)}</span></div>`
  ).join('');

  const techHtml = report.technical
    ? Object.entries(report.technical)
        .filter(([k]) => k !== '_isDemo')
        .map(([k, v]) => `<div class="tech-row"><span class="tech-key">${Utils.sanitizeHtml(k)}</span><span class="tech-val">${Utils.sanitizeHtml(String(v))}</span></div>`)
        .join('')
    : '<p class="text-muted text-xs">No technical details available.</p>';

  return `
    <div class="report-card card card-lg">
      <div class="report-header">
        <div class="report-score-block">
          <div class="report-score-value" style="color:${scoreColor}">${report.riskScore}</div>
          <div class="report-score-label">Risk Score</div>
        </div>
        <div class="report-meta">
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">
            <span class="badge badge-lg ${sevClass}">${Utils.getSeverityLabel(report.severity)}</span>
            <span class="badge badge-lg ${verdictClass}">${Utils.capitalize(report.verdict)}</span>
          </div>
          <div class="text-muted text-xs" style="margin-bottom:6px">
            ${report.type === 'url' ? '🔗' : '✉️'} ${Utils.sanitizeHtml(target)}
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span class="text-xs text-muted">Confidence: ${confidence}%</span>
            <div class="progress-bar" style="width:120px">
              <div class="progress-fill progress-fill-${Utils.getRiskClass(report.riskScore)}" style="width:${confidence}%"></div>
            </div>
          </div>
        </div>
        ${report._isDemo ? '<div class="demo-notice" style="align-self:flex-start">⚗ Demo</div>' : ''}
      </div>

      <p class="report-summary">${Utils.sanitizeHtml(report.summary)}</p>

      <div class="section-header" style="margin-top:var(--space-5)">
        <span class="section-title">⚠ Threat Indicators</span>
      </div>
      <div class="indicators-list">${indicatorsHtml}</div>

      ${recsHtml ? `
      <div class="section-header" style="margin-top:var(--space-5)">
        <span class="section-title">✅ Recommended Actions</span>
      </div>
      <div class="recs-list">${recsHtml}</div>` : ''}

      <div class="expandable" style="margin-top:var(--space-5)">
        <div class="expandable-header" onclick="this.parentElement.classList.toggle('open')">
          <span class="expandable-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Technical Details
          </span>
          <span class="expandable-arrow">▾</span>
        </div>
        <div class="expandable-body">
          <div class="tech-details">${techHtml}</div>
        </div>
      </div>

    </div>

    <style>
    .report-card { margin-top: var(--space-4); }
    .report-header { display: flex; align-items: flex-start; gap: var(--space-5); margin-bottom: var(--space-4); flex-wrap: wrap; }
    .report-score-block { text-align: center; flex-shrink: 0; }
    .report-score-value { font-size: 56px; font-weight: var(--font-bold); line-height: 1; }
    .report-score-label { font-size: var(--text-xs); color: var(--text-muted); text-transform: uppercase; letter-spacing: var(--tracking-wide); }
    .report-meta { flex: 1; }
    .report-summary { font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-loose); padding: var(--space-3) var(--space-4); background: var(--bg-input); border-radius: var(--radius-md); border-left: 3px solid var(--accent); }
    .indicators-list { display: flex; flex-direction: column; gap: var(--space-2); }
    .recs-list { display: flex; flex-direction: column; gap: var(--space-2); }
    .rec-item { display: flex; align-items: flex-start; gap: var(--space-3); padding: var(--space-2) 0; font-size: var(--text-sm); color: var(--text-secondary); }
    .rec-num { width: 22px; height: 22px; background: var(--success-bg); color: var(--success); border-radius: 50%; display:flex; align-items:center; justify-content:center; font-size: 11px; font-weight: var(--font-bold); flex-shrink: 0; }
    .tech-details { display: flex; flex-direction: column; gap: var(--space-2); }
    .tech-row { display: flex; gap: var(--space-3); font-size: var(--text-xs); }
    .tech-key { color: var(--text-muted); min-width: 160px; flex-shrink: 0; font-family: var(--font-mono); }
    .tech-val { color: var(--text-secondary); font-family: var(--font-mono); word-break: break-all; }
    </style>
  `;
}

function setupExpandables(container) {
  container?.querySelectorAll('.expandable-header').forEach(header => {
    header.addEventListener('click', () => header.parentElement.classList.toggle('open'));
  });
}

