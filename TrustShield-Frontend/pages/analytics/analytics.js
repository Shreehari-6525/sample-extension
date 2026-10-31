/**
 * TrustShield AI — Threat Analytics Dashboard
 * Visual cyber-telemetry charts using lightweight vanilla HTML5 canvas and CSS gauges.
 */

'use strict';

async function loadAnalyticsPage() {
  const content = document.getElementById('pageContent');
  if (!content) return;

  const data = await ApiService.getAnalytics();

  content.innerHTML = `
    <div class="page-container">

      <div class="page-header">
        <div>
          <h1 class="page-title">Threat Intelligence & Analytics</h1>
          <p class="page-desc">Aggregated telemetry, distribution patterns, and heuristic trend detection</p>
        </div>
        <div class="demo-notice">⚗ Prototype Analytics Dataset</div>
      </div>

      <!-- Top Volume Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon stat-icon-accent">📊</div>
          <div class="stat-body">
            <div class="stat-value">${Utils.formatNumber(data.totalScans)}</div>
            <div class="stat-label">Total Analyzed Targets</div>
            <div class="stat-trend up">Entire evaluation cycle</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-accent">🔗</div>
          <div class="stat-body">
            <div class="stat-value">${data.urlScans}</div>
            <div class="stat-label">URL & Website Scans</div>
            <div class="stat-trend up">66% of total volume</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-warning">✉️</div>
          <div class="stat-body">
            <div class="stat-value">${data.emailSmsScans}</div>
            <div class="stat-label">Email / SMS Scans</div>
            <div class="stat-trend up">34% of total volume</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-danger">🛡️</div>
          <div class="stat-body">
            <div class="stat-value" style="color:var(--danger)">${data.malicious}</div>
            <div class="stat-label">Confirmed Malicious Flags</div>
            <div class="stat-trend down">Zero-day lures detected</div>
          </div>
        </div>
      </div>

      <!-- Chart Row 1: Weekly Trend + Severity Distribution -->
      <div class="dashboard-split-grid">

        <!-- Weekly Activity Canvas Chart -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">7-Day Threat Activity & Trend</div>
              <div class="card-subtitle">Daily scans (bars) vs intercepted threats (accent line)</div>
            </div>
            <div class="chart-legend">
              <span class="chart-legend-item"><span class="chart-legend-dot" style="background:#00E5FF"></span> Scans</span>
              <span class="chart-legend-item"><span class="chart-legend-dot" style="background:#FF4757"></span> Threats</span>
            </div>
          </div>

          <div style="position:relative;height:240px;width:100%;">
            <canvas id="weeklyActivityCanvas" width="600" height="240"></canvas>
          </div>
        </div>

        <!-- Severity Distribution -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Severity Distribution</div>
              <div class="card-subtitle">Breakdown of assigned risk tiers</div>
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:var(--space-4);padding:var(--space-2) 0;">
            ${data.severityDist.map(item => {
              const total = data.totalScans || 1284;
              const pct = Math.round((item.count / total) * 100);
              return `
                <div>
                  <div style="display:flex;justify-content:space-between;font-size:var(--text-xs);margin-bottom:6px;">
                    <span style="font-weight:var(--font-semibold);color:var(--text-primary);display:flex;align-items:center;gap:6px;">
                      <span style="width:8px;height:8px;border-radius:50%;background:${item.color};"></span>
                      ${item.label}
                    </span>
                    <span class="text-secondary">${item.count} detections (${pct}%)</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width:${pct}%;background:${item.color};"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>

      <!-- Chart Row 2: URL Threat Types & Email/SMS Threat Types -->
      <div class="dashboard-half-grid">

        <!-- URL Threat Distribution -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">URL Threat Classifications</div>
              <div class="card-subtitle">Dominant attack vectors targeting browser web traffic</div>
            </div>
            <span class="badge badge-url">Web Traffic</span>
          </div>

          <div style="display:flex;flex-direction:column;gap:var(--space-3);">
            ${data.urlThreatTypes.map(item => {
              const pct = Math.round((item.count / 143) * 100);
              return `
                <div>
                  <div style="display:flex;justify-content:space-between;font-size:var(--text-xs);margin-bottom:4px;">
                    <span class="text-primary font-semibold">${item.label}</span>
                    <span class="text-muted">${item.count} incidents</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width:${pct}%;background:${item.color}"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Email / SMS Phishing Vectors -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Email / SMS Phishing Lures</div>
              <div class="card-subtitle">Common social engineering manipulation patterns</div>
            </div>
            <span class="badge badge-email">Message Vectors</span>
          </div>

          <div style="display:flex;flex-direction:column;gap:var(--space-3);">
            ${data.emailThreatTypes.map(item => {
              const pct = Math.round((item.count / 143) * 100);
              return `
                <div>
                  <div style="display:flex;justify-content:space-between;font-size:var(--text-xs);margin-bottom:4px;">
                    <span class="text-primary font-semibold">${item.label}</span>
                    <span class="text-muted">${item.count} incidents</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width:${pct}%;background:${item.color}"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>

      <!-- Top Detected Heuristic Indicators -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Most Common Heuristic Threat Signals</div>
            <div class="card-subtitle">Top behavioral triggers identified by the prototype analysis engine</div>
          </div>
          <span class="badge badge-info">Top Indicators</span>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:var(--space-4);">
          ${data.topIndicators.map((ind, i) => `
            <div style="background:var(--bg-input);padding:var(--space-4);border-radius:var(--radius-md);border:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
              <div style="display:flex;align-items:center;gap:var(--space-3);">
                <span style="font-size:var(--text-base);font-weight:var(--font-bold);color:var(--text-muted);font-family:var(--font-mono);width:20px;">#${i+1}</span>
                <span style="font-size:var(--text-sm);font-weight:var(--font-semibold);color:var(--text-primary);">${ind.label}</span>
              </div>
              <span class="badge badge-neutral" style="font-family:var(--font-mono);">${ind.count} occurrences</span>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;

  // Draw pure vanilla canvas chart
  setTimeout(() => drawActivityChart(data.weeklyTrend), 50);
}

function drawActivityChart(weeklyTrend) {
  const canvas = document.getElementById('weeklyActivityCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const paddingBottom = 30;
  const paddingTop = 20;
  const paddingLeft = 40;
  const paddingRight = 20;

  const chartW = w - paddingLeft - paddingRight;
  const chartH = h - paddingTop - paddingBottom;

  const labels = weeklyTrend.labels;
  const scans = weeklyTrend.scans;
  const threats = weeklyTrend.threats;
  const maxScan = 240;

  ctx.clearRect(0, 0, w, h);

  // Draw subtle grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = paddingTop + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(w - paddingRight, y);
    ctx.stroke();

    // Y Axis label
    ctx.fillStyle = '#64748B';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    const val = Math.round(maxScan - (maxScan / 4) * i);
    ctx.fillText(String(val), paddingLeft - 8, y + 3);
  }

  // Draw Bars for Scans
  const barWidth = chartW / labels.length * 0.45;
  const step = chartW / labels.length;

  labels.forEach((label, i) => {
    const x = paddingLeft + step * i + (step - barWidth) / 2;
    const barH = (scans[i] / maxScan) * chartH;
    const y = paddingTop + chartH - barH;

    // Bar gradient
    const grad = ctx.createLinearGradient(x, y, x, y + barH);
    grad.addColorStop(0, '#00E5FF');
    grad.addColorStop(1, 'rgba(0, 229, 255, 0.15)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]) : ctx.rect(x, y, barWidth, barH);
    ctx.fill();

    // X Axis label
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + barWidth / 2, h - 8);
  });

  // Draw Line for Threats
  ctx.beginPath();
  ctx.strokeStyle = '#FF4757';
  ctx.lineWidth = 2.5;

  labels.forEach((_, i) => {
    const x = paddingLeft + step * i + step / 2;
    const lineH = (threats[i] / maxScan) * chartH;
    const y = paddingTop + chartH - lineH;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Draw threat dots
  labels.forEach((_, i) => {
    const x = paddingLeft + step * i + step / 2;
    const lineH = (threats[i] / maxScan) * chartH;
    const y = paddingTop + chartH - lineH;

    ctx.fillStyle = '#FF4757';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#080D17';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
}

