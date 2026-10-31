/**
 * TrustShield AI — User Profile & Role Switcher Page
 * Displays user identity, monthly scan metrics, and the Citizen vs SecOps interface mode switcher.
 */

'use strict';

async function loadProfilePage() {
  const content = document.getElementById('pageContent');
  if (!content) return;

  const authState = await Storage.Auth.get();
  const currentRole = await Storage.UserRole.get() || authState?.user?.role || 'citizen';
  const user = currentRole === 'secops' ? MockData.users.secops : (authState?.user || MockData.users.citizen);

  content.innerHTML = `
    <div class="page-container">

      <div class="page-header">
        <div>
          <h1 class="page-title">User Profile & Interface Mode</h1>
          <p class="page-desc">Manage account identity and toggle between Citizen and SecOps presentation modes</p>
        </div>
        <div class="demo-notice">⚗ Prototype Profile</div>
      </div>

      <!-- Identity Card -->
      <div class="card card-lg">
        <div style="display:flex;align-items:center;gap:var(--space-6);flex-wrap:wrap;">
          <div class="avatar avatar-xl" style="font-size:28px;">
            ${AuthGuard.initialsOf(user)}
          </div>

          <div style="flex:1;min-width:260px;">
            <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:4px;">
              <h2 style="font-size:var(--text-2xl);font-weight:var(--font-bold);color:var(--text-primary);">
                ${Utils.sanitizeHtml(user.name)}
              </h2>
              <span class="badge ${currentRole === 'secops' ? 'badge-critical' : 'badge-low'}">
                ${currentRole === 'secops' ? 'SecOps Admin' : 'Citizen User'}
              </span>
            </div>
            <p style="font-size:var(--text-sm);color:var(--text-secondary);font-family:var(--font-mono);">
              ${Utils.sanitizeHtml(user.email)}
            </p>
            <div style="display:flex;gap:var(--space-4);margin-top:var(--space-3);font-size:var(--text-xs);color:var(--text-muted);">
              <span>Member since: ${Utils.formatDate(user.joinDate || '2026-08-15')}</span>
              <span>•</span>
              <span>Account ID: ${user.id || 'usr-demo-01'}</span>
            </div>
          </div>

          <div style="display:flex;gap:var(--space-3);">
            <button class="btn btn-secondary btn-sm" id="btnEditProfile">Edit Details</button>
            <button class="btn btn-danger btn-sm" id="btnProfileSignOut">Sign Out</button>
          </div>
        </div>
      </div>

      <!-- Monthly Scanning Activity Summary -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon stat-icon-accent">🔍</div>
          <div class="stat-body">
            <div class="stat-value">${user.scansThisMonth || 48}</div>
            <div class="stat-label">Scans Conducted This Month</div>
            <div class="stat-trend up">Personal activity</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-danger">🛡️</div>
          <div class="stat-body">
            <div class="stat-value" style="color:var(--danger)">${user.threatsBlocked || 7}</div>
            <div class="stat-label">Threats Averted</div>
            <div class="stat-trend up">Phishing prevented</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-success">⚡</div>
          <div class="stat-body">
            <div class="stat-value">100%</div>
            <div class="stat-label">Protection Uptime</div>
            <div class="stat-trend up">Shield nominal</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-warning">🕒</div>
          <div class="stat-body">
            <div class="stat-value">&lt; 1.4s</div>
            <div class="stat-label">Average Analysis Latency</div>
            <div class="stat-trend up">High responsiveness</div>
          </div>
        </div>
      </div>

      <!-- Interface Presentation Role Switcher -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Select Interface Presentation Role</div>
            <div class="card-subtitle">Choose whether reports emphasize simple explanations or deep SOC technical telemetry</div>
          </div>
          <span class="badge badge-info">Presentation Mode</span>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-6);margin-top:var(--space-3);">

          <!-- Citizen Card -->
          <div class="card ${currentRole === 'citizen' ? 'card-accent' : ''}" style="cursor:pointer;border-width:2px;${currentRole === 'citizen' ? 'border-color:var(--accent);' : ''}" id="cardSelectCitizen">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3);">
              <div style="display:flex;align-items:center;gap:var(--space-3);">
                <div style="font-size:24px;">👤</div>
                <div>
                  <h3 style="font-size:var(--text-md);font-weight:var(--font-bold);color:var(--text-primary);">Citizen User Mode</h3>
                  <div style="font-size:var(--text-xs);color:var(--text-muted);">Consumer & everyday browsing</div>
                </div>
              </div>
              <input type="radio" name="profileRoleRadio" value="citizen" ${currentRole === 'citizen' ? 'checked' : ''} style="cursor:pointer;" />
            </div>

            <ul style="display:flex;flex-direction:column;gap:var(--space-2);font-size:var(--text-xs);color:var(--text-secondary);line-height:1.6;">
              <li>✓ Plain-language threat summaries (no cybersecurity jargon)</li>
              <li>✓ Clear actionable recommendations (e.g. "Do not enter password")</li>
              <li>✓ High-contrast visual safety indicators</li>
              <li>✓ Streamlined one-click scanning workflows</li>
            </ul>
          </div>

          <!-- SecOps Admin Card -->
          <div class="card ${currentRole === 'secops' ? 'card-accent' : ''}" style="cursor:pointer;border-width:2px;${currentRole === 'secops' ? 'border-color:var(--accent);' : ''}" id="cardSelectSecops">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3);">
              <div style="display:flex;align-items:center;gap:var(--space-3);">
                <div style="font-size:24px;">🛡️</div>
                <div>
                  <h3 style="font-size:var(--text-md);font-weight:var(--font-bold);color:var(--text-primary);">SecOps Admin Mode</h3>
                  <div style="font-size:var(--text-xs);color:var(--text-muted);">Security analysts & SOC teams</div>
                </div>
              </div>
              <input type="radio" name="profileRoleRadio" value="secops" ${currentRole === 'secops' ? 'checked' : ''} style="cursor:pointer;" />
            </div>

            <ul style="display:flex;flex-direction:column;gap:var(--space-2);font-size:var(--text-xs);color:var(--text-secondary);line-height:1.6;">
              <li>✓ Comprehensive forensic parameters (ASN, IP, SSL certificate logs)</li>
              <li>✓ Raw lexical scoring and NLP urgency indexes</li>
              <li>✓ Deep telemetry breakdown for forensic correlation</li>
              <li>✓ Complete technical indicator logs and redirect chain traces</li>
            </ul>
          </div>

        </div>

        <div class="alert alert-info mt-4">
          <div class="alert-content">
            <div class="alert-title">Prototype Note</div>
            Role toggling alters UI explanations and telemetry depth. No actual backend role-based access control (RBAC) is enforced during this frontend design phase.
          </div>
        </div>
      </div>

    </div>
  `;

  setupProfileHandlers();
}

function setupProfileHandlers() {
  const switchRole = async (role) => {
    await Storage.UserRole.set(role);
    await Storage.Auth.set({
      user: role === 'secops' ? MockData.users.secops : MockData.users.citizen,
      token: 'demo'
    });
    updateUserProfileUI();
    Utils.showToast(`Switched presentation mode to ${role === 'secops' ? 'SecOps Admin' : 'Citizen User'}.`, 'success');
    loadProfilePage();
  };

  document.getElementById('cardSelectCitizen')?.addEventListener('click', () => switchRole('citizen'));
  document.getElementById('cardSelectSecops')?.addEventListener('click', () => switchRole('secops'));

  document.querySelectorAll('input[name="profileRoleRadio"]').forEach(radio => {
    radio.addEventListener('change', (e) => switchRole(e.target.value));
  });

  document.getElementById('btnEditProfile')?.addEventListener('click', () => {
    Utils.showToast('Profile editing will connect to Spring Boot user management API in production.', 'info');
  });

  document.getElementById('btnProfileSignOut')?.addEventListener('click', () => {
    showConfirmDialog({
      title: 'Sign Out?',
      message: 'Are you sure you want to exit your TrustShield AI session?',
      confirmText: 'Sign Out',
      onConfirm: async () => {
        await Storage.Auth.clear();
        window.location.href = '../auth/auth.html#signin';
      }
    });
  });
}

