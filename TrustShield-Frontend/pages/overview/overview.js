/**
 * TrustShield AI — Dashboard Overview Page
 * Primary metrics, recent scanning activity, threat distribution, and quick status.
 */

'use strict';

async function loadOverviewPage() {
  const content = document.getElementById('pageContent');
  if (!content) return;

  const stats = await ApiService.getOverviewStats();
  const history = await ApiService.getScanHistory();
  const recentScans = history.slice(0, 5);

  content.innerHTML = `
    <div class="page-container">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard Overview</h1>
          <p class="page-desc">System health, detection metrics, and recent browser scanning activity</p>
        </div>
        <div class="demo-notice">⚗ Demo Statistics — Not Live Production Telemetry</div>
      </div>

      <!-- Quick Scan Hero Banner -->
      <div class="card card-accent" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-4);">
        <div>
          <h2 style="font-size:var(--text-lg);font-weight:var(--font-bold);color:var(--text-primary);margin-bottom:4px;">
            Intelligent Threat Engine Active
          </h2>
          <p style="font-size:var(--text-sm);color:var(--text-secondary);max-width:620px;">
            TrustShield AI is analyzing suspicious domain structures, phishing lures, and deceptive credential harvesting patterns across websites and messaging channels.
          </p>
        </div>
        <div style="display:flex;gap:var(--space-3);align-items:center;">
          <button class="btn btn-secondary btn-sm" onclick="window.location.hash='#universal-scan'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Universal Scanner
          </button>
          <button class="btn btn-primary btn-sm" onclick="window.location.hash='#url-scanner'">
            Scan URL Now
          </button>
        </div>
      </div>

      <!-- Key Stat Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon stat-icon-accent">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          <div class="stat-body">
            <div class="stat-value">${Utils.formatNumber(stats.totalScans)}</div>
            <div class="stat-label">Total Scans Performed</div>
            <div class="stat-trend up">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg>
              +12.4% this week
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-danger">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div class="stat-body">
            <div class="stat-value" style="color:var(--danger)">${stats.threatsDetected}</div>
            <div class="stat-label">Threats Detected</div>
            <div class="stat-trend down">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg>
              11.1% flagged rate
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-success">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="stat-body">
            <div class="stat-value" style="color:var(--success)">${Utils.formatNumber(stats.safeScans)}</div>
            <div class="stat-label">Verified Safe Targets</div>
            <div class="stat-trend up">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg>
              85.4% benign traffic
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-warning">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="stat-body">
            <div class="stat-value" style="color:var(--warning)">${stats.highRisk}</div>
            <div class="stat-label">High-Risk Interceptions</div>
            <div class="stat-trend up" style="color:var(--warning)">
              Active zero-day indicators
            </div>
          </div>
        </div>
      </div>

      <!-- Split View: Recent Scans + Threat Distributions -->
      <div class="dashboard-split-grid">

        <!-- Left: Recent Activity Feed -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Recent Scanning Activity</div>
              <div class="card-subtitle">Latest evaluations across URLs and incoming messages</div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="window.location.hash='#history'">View All History →</button>
          </div>

          <div style="display:flex;flex-direction:column;gap:var(--space-3);" id="overviewRecentList">
            ${recentScans.map(item => {
              const isUrl = item.type === 'url';
              const sevBadge = Utils.getSeverityBadgeClass(item.severity);
              const verdictBadge = Utils.getVerdictBadgeClass(item.verdict);
              const scoreColor = Utils.getRiskColor(item.riskScore);
              const label = isUrl ? Utils.extractDomain(item.target) : item.displayTarget;

              return `
                <div class="scan-row" onclick="window.location.hash='#report'" title="Click to view full analysis">
                  <div class="scan-row-icon ${isUrl ? 'scan-row-icon-url' : 'scan-row-icon-email'}">
                    ${isUrl ? '🔗' : '✉️'}
                  </div>
                  <div class="scan-row-body">
                    <div class="scan-row-target">${Utils.sanitizeHtml(label)}</div>
                    <div class="scan-row-meta">
                      <span class="badge ${isUrl ? 'badge-url' : 'badge-email'}">${isUrl ? 'URL' : 'Email/SMS'}</span>
                      <span>${Utils.timeAgo(item.timestamp)}</span>
                      <span>•</span>
                      <span>Confidence: ${item.confidence}%</span>
                    </div>
                  </div>
                  <div style="display:flex;align-items:center;gap:var(--space-3);">
                    <span class="badge ${sevBadge}">${Utils.getSeverityLabel(item.severity)}</span>
                    <span class="badge ${verdictBadge}">${Utils.capitalize(item.verdict)}</span>
                    <div class="scan-row-score" style="color:${scoreColor}">${item.riskScore}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right: Threat Distributions & Status -->
        <div style="display:flex;flex-direction:column;gap:var(--space-6);">

          <!-- Threat Breakdown -->
          <div class="card">
            <div class="card-header">
              <div class="card-title">Threat Breakdown</div>
              <span class="badge badge-info">Demonstration</span>
            </div>

            <div style="display:flex;flex-direction:column;gap:var(--space-3);">
              <div>
                <div style="display:flex;justify-content:space-between;font-size:var(--text-xs);margin-bottom:4px;">
                  <span class="text-secondary">Phishing Portals & Credential Harvesters</span>
                  <span class="text-primary font-semibold">41%</span>
                </div>
                <div class="progress-bar"><div class="progress-fill progress-fill-danger" style="width:41%"></div></div>
              </div>

              <div>
                <div style="display:flex;justify-content:space-between;font-size:var(--text-xs);margin-bottom:4px;">
                  <span class="text-secondary">Domain Spoofing & Typosquatting</span>
                  <span class="text-primary font-semibold">28%</span>
                </div>
                <div class="progress-bar"><div class="progress-fill progress-fill-warning" style="width:28%"></div></div>
              </div>

              <div>
                <div style="display:flex;justify-content:space-between;font-size:var(--text-xs);margin-bottom:4px;">
                  <span class="text-secondary">Urgency & OTP Fraud Messages</span>
                  <span class="text-primary font-semibold">19%</span>
                </div>
                <div class="progress-bar"><div class="progress-fill progress-fill-warning" style="width:19%"></div></div>
              </div>

              <div>
                <div style="display:flex;justify-content:space-between;font-size:var(--text-xs);margin-bottom:4px;">
                  <span class="text-secondary">Suspicious Redirect Chains</span>
                  <span class="text-primary font-semibold">12%</span>
                </div>
                <div class="progress-bar"><div class="progress-fill progress-fill-accent" style="width:12%"></div></div>
              </div>
            </div>

            <div style="margin-top:var(--space-4);padding-top:var(--space-4);border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
              <span class="text-xs text-muted">Scope: URL and Email/SMS only</span>
              <a href="#analytics" class="text-xs text-accent">Deep Analytics →</a>
            </div>
          </div>

          <!-- Browser Protection Status Card -->
          <div class="card">
            <div class="card-header">
              <div class="card-title">Browser Shield</div>
              <div class="protection-pill active" style="font-size:10px;">
                <span class="dot dot-success dot-pulse"></span>
                <span>Active</span>
              </div>
            </div>

            <p style="font-size:var(--text-xs);color:var(--text-secondary);line-height:var(--leading-loose);margin-bottom:var(--space-3);">
              Real-time tab monitoring is scheduled for the full production release. Current UI displays active security state for prototype workflows.
            </p>

            <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg-input);padding:var(--space-3);border-radius:var(--radius-md);">
              <span class="text-xs font-semibold text-primary">Interception Alerts</span>
              <span class="text-xs text-success">Enabled</span>
            </div>

            <button class="btn btn-secondary btn-full btn-sm mt-3" onclick="window.location.hash='#protection'">
              Configure Shield Settings
            </button>
          </div>

        </div>

      </div>

    </div>
  `;
}

