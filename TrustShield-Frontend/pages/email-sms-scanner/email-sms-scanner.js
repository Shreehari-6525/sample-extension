/**
 * TrustShield AI — Dedicated Email / SMS Scanner Page
 */

'use strict';

async function loadEmailSmsPage() {
  const content = document.getElementById('pageContent');
  if (!content) return;

  content.innerHTML = `
    <div class="page-container">

      <div class="page-header">
        <div>
          <h1 class="page-title">Email / SMS Phishing Scanner</h1>
          <p class="page-desc">Analyze messages for social engineering, urgency manipulation, OTP theft, and credential harvesting</p>
        </div>
        <div class="demo-notice">⚗ Prototype NLP Threat Engine</div>
      </div>

      <!-- Main Input Card -->
      <div class="card card-lg">
        <div class="card-header">
          <div>
            <div class="card-title">Inspect Incoming Communication</div>
            <div class="card-subtitle">Paste suspected email bodies, SMS text messages, or direct alerts</div>
          </div>
          <span class="badge badge-email">Message Analysis</span>
        </div>

        <div class="input-group" style="margin-bottom:var(--space-4);">
          <label class="input-label" for="msgScanInput">Message Content</label>
          <textarea class="textarea" id="msgScanInput" rows="7" placeholder="Paste full email text, SMS message, sender headers, or links here...&#10;&#10;e.g. 'URGENT: Your bank account will be suspended within 24 hours. Click here to verify...'"></textarea>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;">
            <span class="input-error hidden" id="msgScanError" role="alert"></span>
            <span class="text-xs text-muted" id="msgCharCount">0 characters</span>
          </div>
        </div>

        <!-- Sample Lures -->
        <div style="margin-bottom:var(--space-5);">
          <div class="text-xs text-muted mb-2 font-semibold">PRE-LOAD REALISTIC THREAT SAMPLES:</div>
          <div style="display:flex;gap:var(--space-2);flex-wrap:wrap;">
            <button class="filter-chip" id="loadSampleOtp" style="color:var(--danger);border-color:rgba(255,71,87,0.3)">OTP Interception SMS</button>
            <button class="filter-chip" id="loadSampleAccount" style="color:var(--danger);border-color:rgba(255,71,87,0.3)">Suspended Account Email</button>
            <button class="filter-chip" id="loadSampleCeo" style="color:var(--danger);border-color:rgba(255,71,87,0.3)">CEO Wire Transfer (BEC)</button>
            <button class="filter-chip" id="loadSampleSafe" style="color:var(--success);border-color:rgba(0,214,143,0.3)">Legitimate Order Update</button>
          </div>
        </div>

        <div style="display:flex;gap:var(--space-3);align-items:center;flex-wrap:wrap;">
          <button class="btn btn-primary" id="btnRunMsgScan">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21"/></svg>
            Analyze Message Threat
          </button>
          <button class="btn btn-ghost" id="btnClearMsgField">Clear Content</button>
        </div>
      </div>

      <!-- Scanning Feedback -->
      <div class="card hidden" id="msgScanningState" style="text-align:center;padding:var(--space-8);">
        <div class="scan-animation" style="margin:0 auto var(--space-4);"><div class="scan-animation-inner"></div></div>
        <h3 style="font-size:var(--text-lg);font-weight:var(--font-bold);color:var(--text-primary);margin-bottom:6px;">Inspecting Linguistic Heuristics…</h3>
        <p class="text-secondary text-sm">Evaluating urgency pressure, sender spoofing flags, and credential theft vectors…</p>
      </div>

      <!-- Report Container -->
      <div id="msgReportOutput"></div>

    </div>
  `;

  setupEmailSmsHandlers();
}

function setupEmailSmsHandlers() {
  const textarea = document.getElementById('msgScanInput');
  const countEl = document.getElementById('msgCharCount');
  const errorEl = document.getElementById('msgScanError');

  textarea?.addEventListener('input', () => {
    if (countEl) countEl.textContent = `${textarea.value.length} characters`;
    errorEl?.classList.add('hidden');
  });

  document.getElementById('btnClearMsgField')?.addEventListener('click', () => {
    if (textarea) { textarea.value = ''; textarea.focus(); }
    if (countEl) countEl.textContent = '0 characters';
    document.getElementById('msgReportOutput').innerHTML = '';
  });

  // Pre-load buttons
  document.getElementById('loadSampleOtp')?.addEventListener('click', () => {
    setSampleText(
      `Your OTP for SBI NetBanking is 847291. Valid for 10 min. DO NOT share this OTP with anyone.\n\nURGENT: Forward this OTP to 9876543210 or reply immediately to authenticate your account reset.`
    );
  });

  document.getElementById('loadSampleAccount')?.addEventListener('click', () => {
    setSampleText(
      `Subject: URGENT: Your PayPal account has been locked!\n\nDear Customer,\n\nWe detected unauthorized login attempts from IP 192.168.1.5. You must verify your credentials within 24 hours or your balance will be permanently frozen.\n\nClick here immediately: http://paypal-secure-verify.xyz/login`
    );
  });

  document.getElementById('loadSampleCeo')?.addEventListener('click', () => {
    setSampleText(
      `From: Robert Mitchell <robert.ceo@corp-partner.org>\nSubject: Confidential - Immediate Wire Needed\n\nHi Alex,\n\nI am currently in an executive meeting and cannot take calls. Please process an urgent vendor invoice payment of $14,500 to our offshore supplier right away. Keep this private until the acquisition closes.\n\nAccount: 4892-1029-4410`
    );
  });

  document.getElementById('loadSampleSafe')?.addEventListener('click', () => {
    setSampleText(
      `From: notifications@github.com\nSubject: [GitHub] Security advisory published\n\nHi Alex,\n\nA new advisory CVE-2026-1102 has been published for a repository you follow. You can review the details on github.com at your convenience.`
    );
  });

  document.getElementById('btnRunMsgScan')?.addEventListener('click', executeMessageScan);
}

function setSampleText(txt) {
  const textarea = document.getElementById('msgScanInput');
  const countEl = document.getElementById('msgCharCount');
  if (textarea) {
    textarea.value = txt;
    if (countEl) countEl.textContent = `${txt.length} characters`;
  }
}

async function executeMessageScan() {
  const textarea = document.getElementById('msgScanInput');
  const val = textarea?.value.trim();
  const errorEl = document.getElementById('msgScanError');
  const loader = document.getElementById('msgScanningState');
  const output = document.getElementById('msgReportOutput');

  if (!val) {
    if (errorEl) { errorEl.textContent = 'Please enter a message to analyze.'; errorEl.classList.remove('hidden'); }
    return;
  }

  if (val.length < 10) {
    if (errorEl) { errorEl.textContent = 'Message is too short to evaluate. Please enter more context.'; errorEl.classList.remove('hidden'); }
    return;
  }

  errorEl?.classList.add('hidden');
  output.innerHTML = '';
  loader?.classList.remove('hidden');

  try {
    const report = await ApiService.scanEmailSms(val);
    await Storage.ScanHistory.add(report);
    loader?.classList.add('hidden');
    renderMessageReport(output, report);
  } catch (err) {
    loader?.classList.add('hidden');
    Utils.showToast('Failed to evaluate message threat.', 'error');
  }
}

function renderMessageReport(container, report) {
  const scoreColor = Utils.getRiskColor(report.riskScore);
  const sevClass = Utils.getSeverityBadgeClass(report.severity);
  const verdictClass = Utils.getVerdictBadgeClass(report.verdict);

  const indicators = report.indicators && report.indicators.length > 0
    ? report.indicators
    : [
        { type: report.severity, icon: '⚡', title: 'Psychological Urgency Trigger', description: 'Imposes short countdowns or penalties to bypass user scrutiny.' },
        { type: report.severity, icon: '🎭', title: 'Deceptive Action Hook', description: 'Coerces recipient into transferring sensitive tokens, OTPs, or passwords.' }
      ];

  const recs = report.recommendations && report.recommendations.length > 0
    ? report.recommendations
    : [
        'Never forward one-time passwords (OTPs) or security codes to any caller or requester.',
        'Contact the sending organization through their public telephone number or verified app.',
        'Do not click embedded links or download unexpected attachments.'
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
              <span class="badge badge-email">Email / SMS</span>
            </div>
            <div style="font-size:var(--text-base);font-weight:var(--font-semibold);color:var(--text-primary);max-width:550px;">
              "${Utils.sanitizeHtml(Utils.truncate(report.target, 70))}"
            </div>
            <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px;">Evaluated ${Utils.timeAgo(report.timestamp)} • Confidence: ${report.confidence}%</div>
          </div>
        </div>
        <div class="demo-notice">⚗ Prototype NLP Model</div>
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
          Detected Linguistic & Structural Indicators
        </h4>
        <div style="display:flex;flex-direction:column;gap:var(--space-2);">
          ${indicators.map(ind => `
            <div class="threat-indicator threat-indicator-${ind.type}">
              <div class="threat-indicator-icon">${ind.icon || '✉️'}</div>
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
          Recommended Protective Actions
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
      <div class="expandable" id="msgTechExpandable">
        <div class="expandable-header" onclick="this.parentElement.classList.toggle('open')">
          <span class="expandable-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            NLP Intent Vectors & Technical Features
          </span>
          <span class="expandable-arrow">▼</span>
        </div>
        <div class="expandable-body">
          <pre class="code-block-full">
Heuristic Intent: ${report.verdict.toUpperCase()} PHISHING LURE
Detected Attack Category: Credential Harvest / Social Engineering / Urgency Manipulation
Calculated Urgency Index: ${report.technical?.urgencyScore || '8.7 / 10 (Critical)'}
Sender Impersonation Pattern: ${report.technical?.senderAnalysis || 'Generic unauthorized domain or masqueraded executive identity'}
Targeted Vectors: OTP Tokens, Banking Passwords, Immediate Wire Transfers
Model Prototype Version: TrustShield NLP-Phish v0.4 (Demonstration mock)
          </pre>
        </div>
      </div>

    </div>
  `;
}

