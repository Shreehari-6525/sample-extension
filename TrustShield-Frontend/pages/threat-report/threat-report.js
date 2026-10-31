/**
 * TrustShield AI — Threat Analysis Report View
 * Full-page deep report presentation supporting both URL and Email/SMS scan results.
 */

'use strict';

async function loadThreatReportPage(reportId = 'scan-001') {
  const content = document.getElementById('pageContent');
  if (!content) return;

  // Retrieve specified or fallback report
  let report = await ApiService.getThreatReport(reportId);
  if (!report) {
    const list = await ApiService.getScanHistory();
    report = list[0] || MockData.threatReports['scan-001'];
  }

  const isUrl = report.type === 'url';
  const scoreColor = Utils.getRiskColor(report.riskScore);
  const sevBadge = Utils.getSeverityBadgeClass(report.severity);
  const verdictBadge = Utils.getVerdictBadgeClass(report.verdict);
  const targetLabel = isUrl ? Utils.extractDomain(report.target) : report.displayTarget || report.target;

  // SVG Gauge calculations
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (report.riskScore / 100) * circumference;

  content.innerHTML = `
    <div class="page-container">

      <!-- Breadcrumbs & Header -->
      <div class="page-header">
        <div>
          <div style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-xs);color:var(--text-muted);margin-bottom:4px;">
            <a href="#history" style="color:var(--text-muted);text-decoration:none;">Scan History</a>
            <span>/</span>
            <span style="color:var(--accent);">Report #${report.id || 'scan-001'}</span>
          </div>
          <h1 class="page-title">Threat Analysis & Explainability Report</h1>
          <p class="page-desc">Comprehensive heuristic breakdown of evaluated threat indicators and mitigation actions</p>
        </div>
        <div style="display:flex;gap:var(--space-2);align-items:center;">
          <div class="demo-notice">⚗ Demonstration Evaluation</div>
          <button class="btn btn-ghost btn-sm" onclick="window.print()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Export Report
          </button>
        </div>
      </div>

      <!-- Section A: Overall Risk Assessment -->
      <div class="card card-lg card-accent">
        <div style="display:grid;grid-template-columns:auto 1fr;gap:var(--space-8);align-items:center;">

          <!-- Circular Score Gauge -->
          <div style="position:relative;width:120px;height:120px;display:flex;align-items:center;justify-content:center;">
            <svg width="120" height="120" style="transform:rotate(-90deg);">
              <circle cx="60" cy="60" r="${radius}" fill="none" stroke="var(--bg-input)" stroke-width="10"></circle>
              <circle cx="60" cy="60" r="${radius}" fill="none" stroke="${scoreColor}" stroke-width="10"
                      stroke-linecap="round"
                      stroke-dasharray="${circumference}"
                      stroke-dashoffset="${strokeOffset}"
                      style="transition:stroke-dashoffset 1s ease;"></circle>
            </svg>
            <div style="position:absolute;text-align:center;">
              <span style="font-size:32px;font-weight:var(--font-bold);color:${scoreColor};line-height:1;">${report.riskScore}</span>
              <span style="display:block;font-size:10px;color:var(--text-muted);text-transform:uppercase;">/ 100</span>
            </div>
          </div>

          <!-- Target & Verdict summary -->
          <div>
            <div style="display:flex;gap:var(--space-2);align-items:center;margin-bottom:8px;flex-wrap:wrap;">
              <span class="badge ${isUrl ? 'badge-url' : 'badge-email'}">${isUrl ? 'URL Threat Analysis' : 'Email/SMS Phishing'}</span>
              <span class="badge ${sevBadge}">${Utils.getSeverityLabel(report.severity)}</span>
              <span class="badge ${verdictBadge}">${Utils.capitalize(report.verdict)}</span>
              <span class="text-xs text-muted" style="margin-left:auto;">${Utils.formatDateTime(report.timestamp)}</span>
            </div>

            <h2 style="font-size:var(--text-xl);font-weight:var(--font-bold);color:var(--text-primary);word-break:break-all;font-family:var(--font-mono);margin-bottom:6px;">
              ${Utils.sanitizeHtml(targetLabel)}
            </h2>

            <!-- Confidence Bar -->
            <div style="display:flex;align-items:center;gap:var(--space-3);max-width:380px;">
              <span class="text-xs text-muted" style="min-width:110px;">Detector Confidence:</span>
              <div class="progress-bar">
                <div class="progress-fill progress-fill-accent" style="width:${report.confidence || 95}%"></div>
              </div>
              <span class="text-xs font-semibold text-primary">${report.confidence || 95}%</span>
            </div>
          </div>

        </div>
      </div>

      <!-- Section B & C: Why We Flagged It & Detailed Indicators -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Threat Explainability & Indicators</div>
            <div class="card-subtitle">Plain English interpretation of why this entity was assigned risk</div>
          </div>
          <span class="badge badge-info">${(report.indicators || []).length} Signals Detected</span>
        </div>

        <div style="margin-bottom:var(--space-5);">
          <h4 style="font-size:var(--text-sm);font-weight:var(--font-bold);color:var(--text-primary);text-transform:uppercase;letter-spacing:var(--tracking-wide);margin-bottom:var(--space-2);">
            Executive Security Summary
          </h4>
          <p style="font-size:var(--text-sm);color:var(--text-secondary);background:var(--bg-input);padding:var(--space-4);border-radius:var(--radius-md);border-left:3px solid ${scoreColor};line-height:var(--leading-loose);">
            ${Utils.sanitizeHtml(report.summary)}
          </p>
        </div>

        <div>
          <h4 style="font-size:var(--text-sm);font-weight:var(--font-bold);color:var(--text-primary);text-transform:uppercase;letter-spacing:var(--tracking-wide);margin-bottom:var(--space-3);">
            Specific Indicator Breakdown
          </h4>
          <div style="display:flex;flex-direction:column;gap:var(--space-3);">
            ${(report.indicators || []).map(ind => `
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
      </div>

      <!-- Section D: Recommended Actions -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Mitigation & Protective Recommendations</div>
            <div class="card-subtitle">Step-by-step guidance tailored for end-user safety</div>
          </div>
          <span class="badge badge-low">Actionable</span>
        </div>

        <div style="display:flex;flex-direction:column;gap:var(--space-3);">
          ${(report.recommendations || []).map((rec, i) => `
            <div style="display:flex;align-items:flex-start;gap:var(--space-3);background:var(--bg-input);padding:var(--space-4);border:1px solid var(--border);border-radius:var(--radius-md);">
              <span style="width:26px;height:26px;border-radius:50%;background:var(--accent);color:var(--text-inverse);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:var(--font-bold);flex-shrink:0;">${i+1}</span>
              <div style="font-size:var(--text-sm);color:var(--text-primary);line-height:1.5;">${Utils.sanitizeHtml(rec)}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section E: Expandable Technical Inspection -->
      <div class="expandable" id="reportTechSection">
        <div class="expandable-header" onclick="this.parentElement.classList.toggle('open')">
          <span class="expandable-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Technical Forensics & Indicator Logs
          </span>
          <span class="expandable-arrow">▼</span>
        </div>
        <div class="expandable-body">
          <pre class="code-block-full">
=== TRUSTSHIELD THREAT REPORT TELEMETRY ===
Report Reference: ${report.id || 'N/A'}
Scope Entity: ${report.target}
Threat Category: ${isUrl ? 'URL_MALICIOUS_DOMAIN' : 'MESSAGE_PHISHING_LURE'}
Assessment Verdict: ${report.verdict.toUpperCase()} (Severity: ${report.severity.toUpperCase()})
Calculated Risk Index: ${report.riskScore}/100
Statistical Confidence: ${report.confidence || 95}%
Timestamp ISO: ${report.timestamp}
Simulation Engine: TrustShield Heuristic Prototype v1.0
Technical Metadata:
${JSON.stringify(report.technical || {}, null, 2)}
          </pre>
        </div>
      </div>

      <!-- Bottom navigation -->
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <button class="btn btn-ghost" onclick="window.location.hash='#history'">← Return to Scan History</button>
        <button class="btn btn-primary" onclick="window.location.hash='#universal-scan'">Run New Scan</button>
      </div>

    </div>
  `;
}

