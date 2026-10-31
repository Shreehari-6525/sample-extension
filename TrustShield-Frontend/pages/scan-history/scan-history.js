/**
 * TrustShield AI — Scan History Page
 * Filterable, searchable repository of past URL and Email/SMS threat evaluations.
 */

'use strict';

async function loadScanHistoryPage() {
  const content = document.getElementById('pageContent');
  if (!content) return;

  // Retrieve stored history or fallback to demo dataset
  const stored = await Storage.ScanHistory.get();
  const allRecords = stored && stored.length > 0 ? stored : MockData.scanHistory;

  content.innerHTML = `
    <div class="page-container">

      <div class="page-header">
        <div>
          <h1 class="page-title">Scan History</h1>
          <p class="page-desc">Comprehensive log of evaluated URLs, web domains, and messaging lures</p>
        </div>
        <div class="demo-notice">⚗ Prototype History Log</div>
      </div>

      <!-- Filter Controls Card -->
      <div class="card">
        <div style="display:flex;gap:var(--space-4);flex-wrap:wrap;align-items:center;justify-content:space-between;margin-bottom:var(--space-4);">

          <!-- Search Input -->
          <div class="search-input-wrapper" style="flex:1;min-width:240px;">
            <span class="search-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input type="text" class="search-input" id="historySearchInput" placeholder="Search target domain, URL, or message snippet..." />
          </div>

          <!-- Sort Select -->
          <div style="display:flex;align-items:center;gap:var(--space-2);">
            <label for="historySortSelect" class="text-xs text-muted font-semibold uppercase">Sort By:</label>
            <select class="select" id="historySortSelect">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="risk-desc">Highest Risk Score</option>
              <option value="risk-asc">Lowest Risk Score</option>
            </select>
          </div>

        </div>

        <!-- Filter Chips: Category & Severity -->
        <div style="display:flex;flex-direction:column;gap:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--border);">

          <div style="display:flex;align-items:center;gap:var(--space-2);flex-wrap:wrap;">
            <span class="text-xs text-muted font-semibold uppercase" style="min-width:70px;">Category:</span>
            <button class="filter-chip active" data-category="all">All Channels</button>
            <button class="filter-chip" data-category="url">URLs Only</button>
            <button class="filter-chip" data-category="email">Email / SMS Only</button>
          </div>

          <div style="display:flex;align-items:center;gap:var(--space-2);flex-wrap:wrap;">
            <span class="text-xs text-muted font-semibold uppercase" style="min-width:70px;">Severity:</span>
            <button class="filter-chip active" data-severity="all">All Severities</button>
            <button class="filter-chip" data-severity="critical" style="color:var(--danger)">Critical</button>
            <button class="filter-chip" data-severity="high" style="color:var(--severity-high)">High</button>
            <button class="filter-chip" data-severity="moderate" style="color:var(--warning)">Moderate</button>
            <button class="filter-chip" data-severity="low" style="color:var(--success)">Safe / Low</button>
          </div>

        </div>
      </div>

      <!-- Results Count & Actions -->
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span class="text-xs text-muted" id="historyCountLabel">Showing ${allRecords.length} records</span>
        <button class="btn btn-ghost btn-sm" id="btnClearHistoryBtn">Clear Local Records</button>
      </div>

      <!-- History List -->
      <div id="historyListContainer" style="display:flex;flex-direction:column;gap:var(--space-3);"></div>

    </div>
  `;

  setupHistoryFilters(allRecords);
}

function setupHistoryFilters(records) {
  let currentCategory = 'all';
  let currentSeverity = 'all';
  let currentSearch = '';
  let currentSort = 'newest';

  const container = document.getElementById('historyListContainer');
  const countLabel = document.getElementById('historyCountLabel');
  const searchInput = document.getElementById('historySearchInput');
  const sortSelect = document.getElementById('historySortSelect');

  function renderFiltered() {
    let list = [...records];

    if (currentCategory !== 'all') {
      list = list.filter(r => r.type === currentCategory);
    }

    if (currentSeverity !== 'all') {
      list = list.filter(r => r.severity === currentSeverity);
    }

    if (currentSearch.trim()) {
      const q = currentSearch.toLowerCase();
      list = list.filter(r =>
        (r.target || '').toLowerCase().includes(q) ||
        (r.displayTarget || '').toLowerCase().includes(q)
      );
    }

    if (currentSort === 'newest') {
      list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else if (currentSort === 'oldest') {
      list.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } else if (currentSort === 'risk-desc') {
      list.sort((a, b) => b.riskScore - a.riskScore);
    } else if (currentSort === 'risk-asc') {
      list.sort((a, b) => a.riskScore - b.riskScore);
    }

    if (countLabel) countLabel.textContent = `Showing ${list.length} of ${records.length} records`;

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-state card">
          <div class="empty-state-icon">🔍</div>
          <div class="empty-state-title">No Scan Records Match Filters</div>
          <div class="empty-state-msg">Try resetting category or severity chips, or clearing search criteria.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(item => {
      const isUrl = item.type === 'url';
      const sevBadge = Utils.getSeverityBadgeClass(item.severity);
      const verdictBadge = Utils.getVerdictBadgeClass(item.verdict);
      const scoreColor = Utils.getRiskColor(item.riskScore);
      const label = isUrl ? Utils.extractDomain(item.target) : item.displayTarget || item.target;

      return `
        <div class="scan-row" data-history-id="${item.id || ''}">
          <div class="scan-row-icon ${isUrl ? 'scan-row-icon-url' : 'scan-row-icon-email'}">
            ${isUrl ? '🔗' : '✉️'}
          </div>

          <div class="scan-row-body">
            <div class="scan-row-target">${Utils.sanitizeHtml(label)}</div>
            <div class="scan-row-meta">
              <span class="badge ${isUrl ? 'badge-url' : 'badge-email'}">${isUrl ? 'URL' : 'Email/SMS'}</span>
              <span>${Utils.formatDateTime(item.timestamp)} (${Utils.timeAgo(item.timestamp)})</span>
              <span>•</span>
              <span>Confidence: ${item.confidence || 90}%</span>
            </div>
          </div>

          <div style="display:flex;align-items:center;gap:var(--space-3);">
            <span class="badge ${sevBadge}">${Utils.getSeverityLabel(item.severity)}</span>
            <span class="badge ${verdictBadge}">${Utils.capitalize(item.verdict)}</span>
            <div class="scan-row-score" style="color:${scoreColor}">${item.riskScore}</div>
            <button class="btn btn-ghost btn-sm" onclick="window.location.hash='#report'" style="padding:4px 8px;">
              View Details →
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Bind category chips
  document.querySelectorAll('[data-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-category]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderFiltered();
    });
  });

  // Bind severity chips
  document.querySelectorAll('[data-severity]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-severity]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSeverity = btn.dataset.severity;
      renderFiltered();
    });
  });

  // Bind search input
  searchInput?.addEventListener('input', Utils.debounce((e) => {
    currentSearch = e.target.value;
    renderFiltered();
  }, 250));

  // Bind sort select
  sortSelect?.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderFiltered();
  });

  // Clear button
  document.getElementById('btnClearHistoryBtn')?.addEventListener('click', () => {
    showConfirmDialog({
      title: 'Clear Local Scan Records?',
      message: 'This will purge local demonstration scan records stored in this browser session.',
      confirmText: 'Clear Records',
      onConfirm: async () => {
        await Storage.ScanHistory.clear();
        Utils.showToast('Scan history records cleared.', 'info');
        loadScanHistoryPage();
      }
    });
  });

  // Initial render
  renderFiltered();
}

