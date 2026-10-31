/**
 * TrustShield AI — Settings Workspace
 * User configuration for appearance, alerts, security preferences, and session management.
 */

'use strict';

async function loadSettingsPage() {
  const content = document.getElementById('pageContent');
  if (!content) return;

  const currentTheme = ThemeManager.getTheme();
  const authState = await Storage.Auth.get();
  const user = authState?.user || MockData.users.citizen;

  content.innerHTML = `
    <div class="page-container">

      <div class="page-header">
        <div>
          <h1 class="page-title">Settings & Configuration</h1>
          <p class="page-desc">Personalize user interface themes, security notifications, and defensive rules</p>
        </div>
        <div class="demo-notice">⚗ Prototype Settings</div>
      </div>

      <!-- Section 1: Appearance & Theme -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Appearance & Color Scheme</div>
            <div class="card-subtitle">Choose your preferred visual presentation mode</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:var(--space-4);">
          <label class="auth-role-card">
            <input type="radio" name="settingsTheme" value="dark" ${currentTheme === 'dark' ? 'checked' : ''} />
            <div class="auth-role-card-inner">
              <span class="auth-role-icon">🌙</span>
              <div>
                <div class="auth-role-name">Dark Cyber Theme</div>
                <div class="auth-role-desc">High-contrast SOC mode</div>
              </div>
            </div>
          </label>

          <label class="auth-role-card">
            <input type="radio" name="settingsTheme" value="light" ${currentTheme === 'light' ? 'checked' : ''} />
            <div class="auth-role-card-inner">
              <span class="auth-role-icon">☀️</span>
              <div>
                <div class="auth-role-name">Light Theme</div>
                <div class="auth-role-desc">Daytime productivity</div>
              </div>
            </div>
          </label>

          <label class="auth-role-card">
            <input type="radio" name="settingsTheme" value="system" ${currentTheme === 'system' ? 'checked' : ''} />
            <div class="auth-role-card-inner">
              <span class="auth-role-icon">💻</span>
              <div>
                <div class="auth-role-name">System Default</div>
                <div class="auth-role-desc">Follow OS preference</div>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Section 2: Notifications & Alerts -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Security Notifications</div>
            <div class="card-subtitle">Control when TrustShield AI triggers browser toast notifications</div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:var(--space-4);">
          <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:var(--space-3);border-bottom:1px solid var(--border);">
            <div>
              <div class="font-semibold text-primary text-sm">Critical Security Alerts</div>
              <div class="text-xs text-secondary mt-1">Receive immediate alert when a malicious phishing site is blocked.</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="notifCrit" checked />
              <div class="toggle-track"><div class="toggle-thumb"></div></div>
            </label>
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:var(--space-3);border-bottom:1px solid var(--border);">
            <div>
              <div class="font-semibold text-primary text-sm">High-Risk Suspicious Warnings</div>
              <div class="text-xs text-secondary mt-1">Warn when navigating to domains with typosquatting or newly registered records.</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="notifHigh" checked />
              <div class="toggle-track"><div class="toggle-thumb"></div></div>
            </label>
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
              <div class="font-semibold text-primary text-sm">Scan Completion Notifications</div>
              <div class="text-xs text-secondary mt-1">Display banner when an asynchronous background scan is completed.</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="notifDone" />
              <div class="toggle-track"><div class="toggle-thumb"></div></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Section 3: Privacy & Demonstration Data -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Privacy & Local Storage</div>
            <div class="card-subtitle">Manage offline demonstration cache and inspection history</div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:var(--space-4);">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
              <div class="font-semibold text-primary text-sm">Clear Local Scan Cache</div>
              <div class="text-xs text-secondary mt-1">Purge all locally evaluated URL and Email/SMS scan logs from Chrome Storage.</div>
            </div>
            <button class="btn btn-danger btn-sm" id="btnSettingsClearCache">
              Clear Storage
            </button>
          </div>

          <div class="alert alert-info" style="margin-top:var(--space-2);">
            <div class="alert-content">
              <div class="alert-title">Prototype Privacy Guarantee</div>
              No website credentials, passwords, or personal email strings are sent to external cloud servers. All scan operations run using local browser demonstration rules.
            </div>
          </div>
        </div>
      </div>

      <!-- Section 4: Account & Session -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Active User Session</div>
            <div class="card-subtitle">Account credentials and authentication state</div>
          </div>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-4);">
          <div style="display:flex;align-items:center;gap:var(--space-3);">
            <div class="avatar avatar-lg">${AuthGuard.initialsOf(user)}</div>
            <div>
              <div class="font-bold text-primary">${Utils.sanitizeHtml(user.name)}</div>
              <div class="text-xs text-muted">${Utils.sanitizeHtml(user.email)} • <span style="color:var(--accent)">${user.role === 'secops' ? 'SecOps Admin' : 'Citizen User'}</span></div>
            </div>
          </div>

          <div style="display:flex;gap:var(--space-3);">
            <button class="btn btn-secondary btn-sm" onclick="window.location.hash='#profile'">
              Manage Profile
            </button>
            <button class="btn btn-ghost btn-sm" id="btnSettingsSignOut" style="color:var(--danger)">
              Sign Out
            </button>
          </div>
        </div>
      </div>

    </div>
  `;

  setupSettingsHandlers();
}

function setupSettingsHandlers() {
  // Theme radio buttons
  document.querySelectorAll('input[name="settingsTheme"]').forEach(radio => {
    radio.addEventListener('change', async (e) => {
      const selected = e.target.value;
      await ThemeManager.setTheme(selected);
      updateThemeSwitcherUI(selected);
      Utils.showToast(`Applied ${selected} theme.`, 'info');
    });
  });

  // Clear cache button
  document.getElementById('btnSettingsClearCache')?.addEventListener('click', () => {
    showConfirmDialog({
      title: 'Purge Local Demonstration Storage?',
      message: 'This will reset your local scan history and cached preference values.',
      confirmText: 'Purge Data',
      onConfirm: async () => {
        await Storage.ScanHistory.clear();
        Utils.showToast('Local scan cache cleared successfully.', 'success');
      }
    });
  });

  // Sign out button
  document.getElementById('btnSettingsSignOut')?.addEventListener('click', () => {
    showConfirmDialog({
      title: 'Sign Out of TrustShield AI?',
      message: 'You will return to the extension authentication screen.',
      confirmText: 'Sign Out',
      onConfirm: async () => {
        await Storage.Auth.clear();
        Utils.showToast('Signed out successfully.', 'info');
        window.location.href = '../auth/auth.html#signin';
      }
    });
  });
}

