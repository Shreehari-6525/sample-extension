/**
 * TrustShield AI — Browser Protection Workspace
 * Interactive configuration for real-time web navigation defenses and prototype monitoring states.
 */

'use strict';

async function loadBrowserProtectionPage() {
  const content = document.getElementById('pageContent');
  if (!content) return;

  const status = await ApiService.getProtectionStatus();
  const savedSettings = await Storage.Settings.get() || {};
  const isEnabled = savedSettings.protectionEnabled !== undefined ? savedSettings.protectionEnabled : status.enabled;

  content.innerHTML = `
    <div class="page-container">

      <div class="page-header">
        <div>
          <h1 class="page-title">Browser Shield & Live Defense</h1>
          <p class="page-desc">Automated inspection rules for active tabs, deceptive redirections, and phishing intercepts</p>
        </div>
        <div class="demo-notice">⚗ Prototype Protection Workspace</div>
      </div>

      <!-- Main Status Hero Banner -->
      <div class="card card-lg ${isEnabled ? 'card-accent' : ''}" style="display:flex;align-items:center;justify-content:space-between;gap:var(--space-6);flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:var(--space-5);">
          <div style="width:64px;height:64px;border-radius:var(--radius-lg);background:${isEnabled ? 'var(--success-bg)' : 'var(--danger-bg)'};border:1.5px solid ${isEnabled ? 'var(--success)' : 'var(--danger)'};display:flex;align-items:center;justify-content:center;font-size:32px;">
            ${isEnabled ? '🛡️' : '⚠️'}
          </div>
          <div>
            <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:4px;">
              <h2 style="font-size:var(--text-xl);font-weight:var(--font-bold);color:var(--text-primary);">
                Browser Protection is ${isEnabled ? 'Active' : 'Disabled'}
              </h2>
              <span class="protection-pill ${isEnabled ? 'active' : 'inactive'}">
                <span class="dot ${isEnabled ? 'dot-success dot-pulse' : 'dot-danger'}"></span>
                <span>${isEnabled ? 'Guarded' : 'At Risk'}</span>
              </span>
            </div>
            <p style="font-size:var(--text-sm);color:var(--text-secondary);max-width:540px;">
              ${isEnabled
                ? 'TrustShield AI is inspecting active tab URLs against known phishing indicators, domain spoofing patterns, and newly-registered malicious endpoints.'
                : 'Automated warnings and background checks are currently paused. Enable protection to maintain defensive browser coverage.'}
            </p>
          </div>
        </div>

        <!-- Master Switch -->
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:var(--space-2);">
          <label class="toggle-wrapper">
            <span class="toggle-label font-semibold" style="font-size:var(--text-sm);color:var(--text-primary);">
              Shield Switch
            </span>
            <div class="toggle">
              <input type="checkbox" id="masterProtectionToggle" ${isEnabled ? 'checked' : ''} />
              <div class="toggle-track"><div class="toggle-thumb"></div></div>
            </div>
          </label>
          <span class="text-xs text-muted" id="masterToggleSubtext">${isEnabled ? 'Protection active' : 'Click to enable'}</span>
        </div>
      </div>

      <!-- Live Defense Modules -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Defensive Inspection Modules</div>
            <div class="card-subtitle">Granular switches for specific browser monitoring routines</div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:var(--space-4);">

          <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3) 0;border-bottom:1px solid var(--border);">
            <div>
              <div class="font-semibold text-primary text-sm">Real-time URL Phishing Inspection</div>
              <div class="text-xs text-secondary mt-1">Evaluates every address entered into the navigation bar against domain spoofing algorithms.</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="toggleUrlInspect" checked />
              <div class="toggle-track"><div class="toggle-thumb"></div></div>
            </label>
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3) 0;border-bottom:1px solid var(--border);">
            <div>
              <div class="font-semibold text-primary text-sm">Suspicious Redirection Intercept</div>
              <div class="text-xs text-secondary mt-1">Pauses and alerts when a webpage triggers automated hops across multiple third-party hosts.</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="toggleRedirectInspect" checked />
              <div class="toggle-track"><div class="toggle-thumb"></div></div>
            </label>
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3) 0;border-bottom:1px solid var(--border);">
            <div>
              <div class="font-semibold text-primary text-sm">Fake Banking Portal Detection</div>
              <div class="text-xs text-secondary mt-1">Identifies counterfeit financial login forms harvesting user identifiers and passwords.</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="toggleBankInspect" checked />
              <div class="toggle-track"><div class="toggle-thumb"></div></div>
            </label>
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3) 0;">
            <div>
              <div class="font-semibold text-primary text-sm">High-Severity Warning Dialogs</div>
              <div class="text-xs text-secondary mt-1">Displays full-screen interstitial warning when a known phishing website is encountered.</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="toggleWarningDialogs" checked />
              <div class="toggle-track"><div class="toggle-thumb"></div></div>
            </label>
          </div>

        </div>
      </div>

      <!-- How It Works Section -->
      <div class="dashboard-half-grid">
        <div class="card">
          <div class="card-header">
            <div class="card-title">How Browser Protection Works</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:var(--space-3);font-size:var(--text-sm);color:var(--text-secondary);line-height:var(--leading-loose);">
            <p>
              1. <strong>Local Analysis:</strong> When you navigate to a webpage, TrustShield AI inspects the URL's domain name, character distribution, and structure locally.
            </p>
            <p>
              2. <strong>Heuristic Checks:</strong> The extension detects typosquatting (e.g., replacement of 'o' with '0' in reputable brand domains) and suspicious top-level domains.
            </p>
            <p>
              3. <strong>Zero-Data Retention:</strong> Only the domain string is inspected. Browsing history is not collected or transmitted to external servers.
            </p>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">Architecture Notice</div>
          </div>
          <div class="alert alert-info" style="margin-bottom:var(--space-4);">
            <div class="alert-content">
              <div class="alert-title">Prototype Phase Implementation</div>
              This frontend displays simulated protection controls. Background declarativeNetRequest and tab interception listeners are prepared for connection with the Spring Boot backend service.
            </div>
          </div>
          <p style="font-size:var(--text-xs);color:var(--text-muted);line-height:var(--leading-loose);">
            Future integration target: Java Spring Boot REST API + Python ML inference daemon with local browser SQLite cache.
          </p>
          <button class="btn btn-primary btn-sm mt-4" id="btnSaveProtectionPrefs">
            Save Protection Preferences
          </button>
        </div>
      </div>

    </div>
  `;

  setupBrowserProtectionHandlers();
}

function setupBrowserProtectionHandlers() {
  const masterToggle = document.getElementById('masterProtectionToggle');
  const subtext = document.getElementById('masterToggleSubtext');

  masterToggle?.addEventListener('change', async (e) => {
    const enabled = e.target.checked;
    await Storage.Settings.set({ protectionEnabled: enabled });
    await Storage.Protection.set(enabled ? 'active' : 'inactive');

    if (subtext) subtext.textContent = enabled ? 'Protection active' : 'Click to enable';
    updateProtectionStatusUI();
    Utils.showToast(enabled ? 'Browser Protection enabled.' : 'Browser Protection disabled.', enabled ? 'success' : 'warning');
    loadBrowserProtectionPage();
  });

  document.getElementById('btnSaveProtectionPrefs')?.addEventListener('click', () => {
    Utils.showToast('Browser protection preferences saved successfully.', 'success');
  });
}

