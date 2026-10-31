/**
 * TrustShield AI — API Service (Placeholder Layer)
 * ─────────────────────────────────────────────────────────────
 * DEMO PHASE: All methods return mock data via simulated async delay.
 *
 * BACKEND INTEGRATION GUIDE:
 *   Replace each method's return value with a real fetch() call.
 *   Base URL and auth headers are defined at the top of this file.
 *   JWT token will be stored in chrome.storage.local by auth flow.
 *
 * Planned backend: Java Spring Boot + Spring Security + JWT
 * Planned ML service: Python (URL + Email/SMS detection)
 * ─────────────────────────────────────────────────────────────
 */

'use strict';

const ApiService = (() => {

  /* ── CONFIGURATION ──────────────────────────────────────────
   * TODO (Backend Integration): Update BASE_URL to the real endpoint.
   * ─────────────────────────────────────────────────────────── */
  const CONFIG = {
    BASE_URL: 'http://localhost:8080/api/v1',   // Spring Boot base URL
    ML_URL:   'http://localhost:5000/predict',  // Python ML service URL
    TIMEOUT_MS: 8000,
  };

  /* ── SIMULATED NETWORK DELAY (demo only) ────────────────────── */
  const delay = (ms = 1200) => new Promise(res => setTimeout(res, ms));

  /* ── AUTH HELPER (stub) ─────────────────────────────────────
   * TODO: Read real JWT from chrome.storage.local after login.
   * ─────────────────────────────────────────────────────────── */
  async function _getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer demo-jwt-token-placeholder',
    };
  }

  /* ── DEMO RISK SCORE GENERATOR ──────────────────────────────
   * Produces a plausible-looking risk score based on input heuristics.
   * This is NOT a real ML prediction — demo only.
   * ─────────────────────────────────────────────────────────── */
  function _generateDemoScore(input) {
    const phishingKeywords = [
      'verify', 'secure', 'update', 'login', 'account', 'confirm',
      'urgent', 'otp', 'password', 'suspended', 'locked', 'click here',
      'paypal', 'bank', 'transfer', 'wire', 'invoice',
      'xyz', 'xyz.', '.tk', '.ml', '.ga', 'micros0ft', '-secure', '-verify'
    ];
    const safeIndicators = ['google.com', 'github.com', 'stackoverflow.com', 'microsoft.com', 'amazon.com'];

    const lowInput = input.toLowerCase();
    if (safeIndicators.some(s => lowInput.includes(s))) return { score: Math.floor(Math.random() * 5) + 1, severity: 'low', verdict: 'safe' };

    const matchCount = phishingKeywords.filter(k => lowInput.includes(k)).length;
    const baseScore = Math.min(100, 20 + matchCount * 18 + Math.floor(Math.random() * 15));

    if (baseScore >= 80) return { score: baseScore, severity: 'critical', verdict: 'malicious' };
    if (baseScore >= 60) return { score: baseScore, severity: 'high',     verdict: 'suspicious' };
    if (baseScore >= 35) return { score: baseScore, severity: 'moderate', verdict: 'suspicious' };
    return                      { score: baseScore, severity: 'low',      verdict: 'safe' };
  }

  /* ═══════════════════════════════════════════════════════════
   * PUBLIC API METHODS
   * ═══════════════════════════════════════════════════════════ */

  /**
   * Scan a URL for threats.
   * @param {string} url
   * @returns {Promise<Object>} Threat report object
   *
   * TODO (Backend): POST ${CONFIG.BASE_URL}/scan/url  { url }
   * Expected response: { riskScore, severity, verdict, indicators, ... }
   */
  async function scanUrl(url) {
    await delay(1400);
    const { score, severity, verdict } = _generateDemoScore(url);

    // Check if we have a pre-built demo report for this scan
    const existing = Object.values(MockData.threatReports).find(r =>
      r.type === 'url' && url.includes(r.target.replace('https://www.', '').replace('https://', ''))
    );
    if (existing) return { ...existing, _isDemo: true };

    return {
      id: 'scan-' + Date.now(),
      type: 'url',
      target: url,
      riskScore: score,
      severity,
      verdict,
      confidence: Math.min(99, 70 + Math.floor(Math.random() * 28)),
      timestamp: new Date().toISOString(),
      summary: verdict === 'safe'
        ? 'No significant threat indicators were detected for this URL.'
        : 'This URL exhibits threat indicators consistent with phishing or malicious activity.',
      indicators: [],
      recommendations: verdict === 'safe'
        ? ['This URL appears safe based on current indicators.', 'Always verify URLs before entering sensitive information.']
        : ['Do not enter personal information on this site.', 'Close this tab immediately.', 'Report suspicious URLs to your security team.'],
      technical: { registeredDomain: url, _isDemo: true },
      _isDemo: true,
    };
  }

  /**
   * Scan an Email or SMS message for phishing.
   * @param {string} text  The full message body
   * @returns {Promise<Object>} Threat report object
   *
   * TODO (Backend): POST ${CONFIG.BASE_URL}/scan/message  { text }
   */
  async function scanEmailSms(text) {
    await delay(1600);
    const { score, severity, verdict } = _generateDemoScore(text);

    const existing = Object.values(MockData.threatReports).find(r =>
      r.type === 'email' && r.target === text
    );
    if (existing) return { ...existing, _isDemo: true };

    return {
      id: 'scan-' + Date.now(),
      type: 'email',
      target: text,
      displayTarget: text.length > 60 ? text.substring(0, 60) + '...' : text,
      riskScore: score,
      severity,
      verdict,
      confidence: Math.min(99, 68 + Math.floor(Math.random() * 30)),
      timestamp: new Date().toISOString(),
      summary: verdict === 'safe'
        ? 'This message does not exhibit significant phishing patterns.'
        : 'This message contains indicators consistent with phishing, social engineering, or credential theft.',
      indicators: [],
      recommendations: verdict === 'safe'
        ? ['This message appears safe.', 'Always verify unexpected requests independently.']
        : ['Do not click any links in this message.', 'Do not share OTPs or passwords.', 'Verify with the sender through an official channel.'],
      technical: { urgencyScore: score > 70 ? '8.2/10' : '2.1/10', _isDemo: true },
      _isDemo: true,
    };
  }

  /**
   * Fetch scan history with optional filters.
   * @param {{ category?: string, severity?: string, search?: string, sort?: string }} filters
   * @returns {Promise<Array>}
   *
   * TODO (Backend): GET ${CONFIG.BASE_URL}/history?category=url&severity=critical
   */
  async function getScanHistory(filters = {}) {
    await delay(600);
    let results = [...MockData.scanHistory];
    if (filters.category && filters.category !== 'all')
      results = results.filter(r => r.type === filters.category);
    if (filters.severity && filters.severity !== 'all')
      results = results.filter(r => r.severity === filters.severity);
    if (filters.verdict && filters.verdict !== 'all')
      results = results.filter(r => r.verdict === filters.verdict);
    if (filters.search)
      results = results.filter(r => r.displayTarget.toLowerCase().includes(filters.search.toLowerCase()));
    if (filters.sort === 'score-desc') results.sort((a, b) => b.riskScore - a.riskScore);
    if (filters.sort === 'score-asc')  results.sort((a, b) => a.riskScore - b.riskScore);
    return results;
  }

  /**
   * Fetch a single threat report by scan ID.
   * @param {string} scanId
   * @returns {Promise<Object|null>}
   *
   * TODO (Backend): GET ${CONFIG.BASE_URL}/reports/{scanId}
   */
  async function getThreatReport(scanId) {
    await delay(400);
    return MockData.threatReports[scanId] || null;
  }

  /**
   * Fetch analytics data.
   * @returns {Promise<Object>}
   *
   * TODO (Backend): GET ${CONFIG.BASE_URL}/analytics
   */
  async function getAnalytics() {
    await delay(700);
    return MockData.analytics;
  }

  /**
   * Fetch dashboard overview stats.
   * @returns {Promise<Object>}
   *
   * TODO (Backend): GET ${CONFIG.BASE_URL}/dashboard/overview
   */
  async function getOverviewStats() {
    await delay(500);
    return MockData.overviewStats;
  }

  /**
   * Fetch protection status.
   * @returns {Promise<Object>}
   *
   * TODO (Backend): GET ${CONFIG.BASE_URL}/protection/status
   */
  async function getProtectionStatus() {
    await delay(300);
    return MockData.protectionStatus;
  }

  /**
   * User login.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ success: boolean, user?: Object, token?: string, error?: string }>}
   *
   * TODO (Backend): POST ${CONFIG.BASE_URL}/auth/login  { email, password }
   * Expected response: { token, user: { id, name, email, role } }
   */
  async function login(credentials) {
    await delay(1000);
    if (!credentials.email || !credentials.password)
      return { success: false, error: 'Email and password are required.' };
    // Demo: any non-empty credentials succeed
    return {
      success: true,
      token: 'demo-jwt-token-placeholder',
      user: MockData.users.citizen,
      _isDemo: true,
    };
  }

  /**
   * User registration.
   * @param {{ name: string, email: string, password: string, role: string }} data
   * @returns {Promise<{ success: boolean, error?: string }>}
   *
   * TODO (Backend): POST ${CONFIG.BASE_URL}/auth/register
   * Backend uses BCrypt for password hashing.
   */
  async function register(data) {
    await delay(1200);
    if (!data.name || !data.email || !data.password)
      return { success: false, error: 'All fields are required.' };
    return { success: true, _isDemo: true };
  }

  /**
   * Request password reset email.
   * @param {{ email: string }} data
   * @returns {Promise<{ success: boolean }>}
   *
   * TODO (Backend): POST ${CONFIG.BASE_URL}/auth/forgot-password
   */
  async function forgotPassword(data) {
    await delay(900);
    return { success: true, _isDemo: true };
  }

  /**
   * Fetch the current user's profile.
   * @returns {Promise<Object>}
   *
   * TODO (Backend): GET ${CONFIG.BASE_URL}/user/profile  (requires JWT)
   */
  async function getProfile() {
    await delay(400);
    return MockData.users.citizen;
  }

  /**
   * Update protection settings.
   * @param {Object} settings
   * @returns {Promise<{ success: boolean }>}
   *
   * TODO (Backend): PUT ${CONFIG.BASE_URL}/protection/settings
   */
  async function updateProtectionSettings(settings) {
    await delay(500);
    return { success: true, _isDemo: true };
  }

  /* ─── Public Interface ────────────────────────────────────── */
  return {
    scanUrl,
    scanEmailSms,
    getScanHistory,
    getThreatReport,
    getAnalytics,
    getOverviewStats,
    getProtectionStatus,
    login,
    register,
    forgotPassword,
    getProfile,
    updateProtectionSettings,
    CONFIG,
  };

})();

