/**
 * TrustShield AI — Dedicated URL / Website Scanner Page
 */

'use strict';

async function loadUrlScannerPage() {
  const content = document.getElementById('pageContent');
  if (!content) return;

  content.innerHTML = `
    <div class="page-container">

      <div class="page-header">
        <div>
          <h1 class="page-title">URL / Website Threat Scanner</h1>
          <p class="page-desc">Comprehensive structural analysis for phishing, typosquatting, domain spoofing, and malicious redirects</p>
        </div>
        <div class="demo-notice">⚗ Prototype Analysis Engine</div>
      </div>

      <!-- Main Input Card -->
      <div class="card card-lg">
        <div class="card-header">
          <div>
            <div class="card-title">Inspect Target Web Address</div>
            <div class="card-subtitle">Submit any URL to evaluate heuristic safety indicators and domain integrity</div>
          </div>
          <span class="badge badge-url">URL Analysis</span>
        </div>

        <div class="input-group" style="margin-bottom:var(--space-4);">
          <label class="input-label" for="urlScanInput">Target URL</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            </span>
            <input type="url" class="input" id="urlScanInput" placeholder="https://example-banking-login.com or type domain name..." autocomplete="off" spellcheck="false" style="padding-left:42px;padding-right:42px;" />
            <button class="input-icon-right" id="urlScanClearBtn" style="display:none;" title="Clear input">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <span class="input-error hidden" id="urlScanError" role="alert"></span>
        </div>

        <!-- Demo Presets -->
        <div style="margin-bottom:var(--space-5);">
          <div class="text-xs text-muted mb-2 font-semibold">POPULAR DEMO TARGETS:</div>
          <div style="display:flex;gap:var(--space-2);flex-wrap:wrap;">
            <button class="filter-chip" data-test-url="paypal-secure-verify.xyz" style="color:var(--danger);border-color:rgba(255,71,87,0.3)">paypal-secure-verify.xyz (Phishing)</button>
            <button class="filter-chip" data-test-url="login.micros0ft-portal.net" style="color:var(--danger);border-color:rgba(255,71,87,0.3)">login.micros0ft-portal.net (Typosquatting)</button>
            <button class="filter-chip" data-test-url="secure-banking.hdfc-alerts.co.in" style="color:var(--danger);border-color:rgba(255,71,87,0.3)">secure-banking.hdfc-alerts.co.in (Fake Bank)</button>
            <button class="filter-chip" data-test-url="https://www.google.com" style="color:var(--success);border-color:rgba(0,214,143,0.3)">google.com (Legitimate)</button>
            <button class="filter-chip" data-test-url="https://github.com/microsoft/vscode" style="color:var(--success);border-color:rgba(0,214,143,0.3)">github.com (Verified)</button>
          </div>
        </div>

        <div style="display:flex;gap:var(--space-3);align-items:center;flex-wrap:wrap;">
          <button class="btn btn-primary" id="btnRunUrlScan">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21"/></svg>
            Analyze URL Threat
          </button>
          <button class="btn btn-secondary" id="btnScanCurrentBrowserTab">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            Scan Active Tab
          </button>
          <button class="btn btn-ghost" id="btnClearUrlField">Clear</button>
        </div>
      </div>

      <!-- Scanning In-Progress Feedback -->
      <div class="card hidden" id="urlScanningState" style="text-align:center;padding:var(--space-8);">
        <div class="scan-animation" style="margin:0 auto var(--space-4);"><div class="scan-animation-inner"></div></div>
        <h3 style="font-size:var(--text-lg);font-weight:var(--font-bold);color:var(--text-primary);margin-bottom:6px;">Evaluating URL Infrastructure…</h3>
        <p class="text-secondary text-sm" id="urlScanStatusStep">Verifying SSL certificates, domain age, redirects and lexical patterns…</p>
      </div>

      <!-- Report Container -->
      <div id="urlReportOutput"></div>

    </div>
  `;

  setupUrlScannerHandlers();
}

function setupUrlScannerHandlers() {
  const input = document.getElementById('urlScanInput');
  const clearIcon = document.getElementById('urlScanClearBtn');
  const errorEl = document.getElementById('urlScanError');

  input?.addEventListener('input', () => {
    if (clearIcon) clearIcon.style.display = input.value ? 'flex' : 'none';
    errorEl?.classList.add('hidden');
  });

  clearIcon?.addEventListener('click', () => {
    if (input) { input.value = ''; input.focus(); }
    if (clearIcon) clearIcon.style.display = 'none';
  });

  document.getElementById('btnClearUrlField')?.addEventListener('click', () => {
    if (input) { input.value = ''; input.focus(); }
    if (clearIcon) clearIcon.style.display = 'none';
    document.getElementById('urlReportOutput').innerHTML = '';
  });

  document.querySelectorAll('.filter-chip[data-test-url]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (input) {
        input.value = btn.dataset.testUrl;
        if (clearIcon) clearIcon.style.display = 'flex';
      }
    });
  });

  document.getElementById('btnRunUrlScan')?.addEventListener('click', () => executeUrlScan());
  document.getElementById('btnScanCurrentBrowserTab')?.addEventListener('click', async () => {
    let target = 'https://example-banking-portal.com';
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.url) target = tab.url;
      }
    } catch (e) {}
    if (input) {
      input.value = target;
      if (clearIcon) clearIcon.style.display = 'flex';
    }
    await executeUrlScan();
  });

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') executeUrlScan();
  });
}

async function executeUrlScan() {
  const input = document.getElementById('urlScanInput');
  const val = input?.value.trim();
  const errorEl = document.getElementById('urlScanError');
  const loader = document.getElementById('urlScanningState');
  const output = document.getElementById('urlReportOutput');

  if (!val) {
    if (errorEl) { errorEl.textContent = 'Please enter a URL to scan.'; errorEl.classList.remove('hidden'); }
    return;
  }

  if (!Utils.isValidUrl(val)) {
    if (errorEl) { errorEl.textContent = 'Please provide a valid URL format (e.g., domain.com or https://site.org).'; errorEl.classList.remove('hidden'); }
    return;
  }

  errorEl?.classList.add('hidden');
  output.innerHTML = '';
  loader?.classList.remove('hidden');

  try {
    const report = await ApiService.scanUrl(val);
    await Storage.ScanHistory.add(report);
    loader?.classList.add('hidden');
    renderDetailedReport(output, report);
  } catch (err) {
    loader?.classList.add('hidden');
    Utils.showToast('Failed to complete URL analysis.', 'error');
  }
}

function renderDetailedReport(container, report) {
  const scoreColor = Utils.getRiskColor(report.riskScore);
  const sevClass = Utils.getSeverityBadgeClass(report.severity);
  const verdictClass = Utils.getVerdictBadgeClass(report.verdict);
  const domain = Utils.extractDomain(report.target);

  const indicators = report.indicators && report.indicators.length > 0
    ? report.indicators
    : [
        { type: report.severity, icon: '⚠️', title: 'Flagged Domain Indicators', description: 'Lexical structure matches heuristic patterns often linked with domain spoofing or newly-registered domains.' }
      ];

  const recs = report.recommendations && report.recommendations.length > 0
    ? report.recommendations
    : [
        'Do not submit login credentials or OTPs on this destination.',
        'Verify identity through an alternate verified communication channel.',
        'Close browser tabs communicating with this domain.'
      ];

  container.innerHTML = `
    <div class="card card-lg" style="margin-top:var(--space-6);animation:fadeInUp 0.3s ease;">

      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:var(--space-4);border-bottom:1px solid var(--border);padding-bottom:var(--space-5);margin-bottom:var(--space-5);">
        <div style="display:flex;gap:var(--space-5);align-items:center;">
          <div style="text-align:center;">
            <div style="font-size:48px;font-weight:var(--font-bold);color:${scoreColor};line-height:1;">${report.riskScore}</div>
            <div style="font-size:var(--text-xs);color:var(--text-muted);text-transform:uppercase;letter-spacing:var(--tracking-wider);margin-top:2px;">Risk Score</div>
          </div>
          <div>
            <div style="display:flex;gap:var(--space-2);align-items:center;margin-bottom:6px;">
              <span class="badge ${sevClass}">${Utils.getSeverityLabel(report.severity)}</span>
              <span class="badge ${verdictClass}">${Utils.capitalize(report.verdict)}</span>
              <span class="badge badge-url">URL Threat</span>
            </div>
            <div style="font-size:var(--text-lg);font-weight:var(--font-bold);color:var(--text-primary);font-family:var(--font-mono);">${Utils.sanitizeHtml(domain)}</div>
            <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px;">Evaluated ${Utils.timeAgo(report.timestamp)} • Confidence: ${report.confidence}%</div>
          </div>
        </div>
        <div class="demo-notice">⚗ Prototype Threat Model</div>
      </div>

      <!-- Why We Flagged It -->
      <div style="margin-bottom:var(--space-5);">
        <h4 style="font-size:var(--text-sm);font-weight:var(--font-bold);color:var(--text-primary);text-transform:uppercase;letter-spacing:var(--tracking-wide);margin-bottom:var(--space-2);">
          Why We Flagged It
        </h4>
        <p style="font-size:var(--text-sm);color:var(--text-secondary);background:var(--bg-input);padding:var(--space-4);border-radius:var(--radius-md);border-left:3px solid ${scoreColor};line-height:var(--leading-loose);">
          ${Utils.sanitizeHtml(report.summary)}
        </p>
      </div>

      <!-- Threat Indicators -->
      <div style="margin-bottom:var(--space-5);">
        <h4 style="font-size:var(--text-sm);font-weight:var(--font-bold);color:var(--text-primary);text-transform:uppercase;letter-spacing:var(--tracking-wide);margin-bottom:var(--space-3);">
          Detected Indicators
        </h4>
        <div style="display:flex;flex-direction:column;gap:var(--space-2);">
          ${indicators.map(ind => `
            <div class="threat-indicator threat-indicator-${ind.type}">
              <div class="threat-indicator-icon">${ind.icon || '⚠️'}</div>
              <div class="threat-indicator-body">
                <div class="threat-indicator-title">${Utils.sanitizeHtml(ind.title)}</div>
                <div class="threat-indicator-desc">${Utils.sanitizeHtml(ind.description)}</div>
              </div>
              <span class="badge badge-${ind.type}">${Utils.capitalize(ind.type)}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Recommendations -->
      <div style="margin-bottom:var(--space-5);">
        <h4 style="font-size:var(--text-sm);font-weight:var(--font-bold);color:var(--text-primary);text-transform:uppercase;letter-spacing:var(--tracking-wide);margin-bottom:var(--space-3);">
          Recommended Security Actions
        </h4>
        <div style="display:flex;flex-direction:column;gap:var(--space-2);">
          ${recs.map((rec, i) => `
            <div style="display:flex;align-items:flex-start;gap:var(--space-3);background:var(--bg-card);padding:var(--space-3);border:1px solid var(--border);border-radius:var(--radius-md);">
              <span style="width:22px;height:22px;border-radius:50%;background:var(--accent-glow);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:var(--font-bold);flex-shrink:0;">${i+1}</span>
              <span style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.4;">${Utils.sanitizeHtml(rec)}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Expandable Technical Details -->
      <div class="expandable" id="urlTechExpandable">
        <div class="expandable-header" onclick="this.parentElement.classList.toggle('open')">
          <span class="expandable-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Technical Telemetry & Infrastructure Details
          </span>
          <span class="expandable-arrow">▼</span>
        </div>
        <div class="expandable-body">
          <pre class="code-block-full">
Target Host: ${domain}
Analyzed URI: ${report.target}
Detection Classification: ${report.verdict.toUpperCase()} (Severity: ${report.severity})
Confidence Score: ${report.confidence}%
SSL Status: ${report.technical?.ssl || 'Encrypted (Let\'s Encrypt authority)'}
IP / AS Routing: ${report.technical?.ipAddress || '198.51.100.42'} (${report.technical?.asn || 'AS13335 / Cloudflare'})
Domain Registration Age: ${report.technical?.domainAge || '12 days (Newly registered)'}
Origin Country: ${report.technical?.country || 'NL'}
Redirect Chain Hops: ${(report.technical?.redirectChain || [domain]).join(' -> ')}
Engine Match Count: ${report.technical?.detectionEngines || '16/24 heuristic detectors triggered'}
Engine Implementation Mode: Frontend Demonstration Simulation
          </pre>
        </div>
      </div>

    </div>
  `;
}

