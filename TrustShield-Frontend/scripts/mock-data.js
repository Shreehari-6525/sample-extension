/**
 * TrustShield AI — Mock Data
 * ─────────────────────────────────────────────────────────────
 * ALL data in this file is for DEMONSTRATION PURPOSES ONLY.
 * These are not real threat detections, real users, or real scans.
 * Replace with API calls (api-service.js) during backend integration.
 * ─────────────────────────────────────────────────────────────
 */

'use strict';

const MockData = {

  /* ── USER PROFILES ──────────────────────────────────────── */
  users: {
    citizen: {
      id: 'demo-citizen-001',
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      initials: 'AJ',
      role: 'citizen',
      roleLabel: 'Citizen User',
      joinDate: '2026-08-15',
      scansThisMonth: 48,
      threatsBlocked: 7,
    },
    secops: {
      id: 'demo-secops-001',
      name: 'Sarah Chen',
      email: 'sarah.chen@trustshield.io',
      initials: 'SC',
      role: 'secops',
      roleLabel: 'SecOps Admin',
      joinDate: '2025-03-01',
      scansThisMonth: 342,
      threatsBlocked: 61,
    }
  },

  /* ── DASHBOARD OVERVIEW STATS ───────────────────────────── */
  overviewStats: {
    totalScans:      1284,
    threatsDetected: 143,
    safeScans:       1097,
    highRisk:        44,
    protectionStatus: 'active',
    lastUpdated: new Date().toISOString(),
  },

  /* ── SCAN HISTORY ────────────────────────────────────────── */
  scanHistory: [
    {
      id: 'scan-001',
      type: 'url',
      target: 'paypal-secure-verify.xyz',
      displayTarget: 'paypal-secure-verify.xyz',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      riskScore: 97,
      severity: 'critical',
      verdict: 'malicious',
      confidence: 98,
    },
    {
      id: 'scan-002',
      type: 'email',
      target: 'URGENT: Your account has been locked. Click here...',
      displayTarget: 'URGENT: Your account has been locked...',
      timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
      riskScore: 89,
      severity: 'critical',
      verdict: 'malicious',
      confidence: 95,
    },
    {
      id: 'scan-003',
      type: 'url',
      target: 'https://www.google.com',
      displayTarget: 'google.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      riskScore: 2,
      severity: 'low',
      verdict: 'safe',
      confidence: 99,
    },
    {
      id: 'scan-004',
      type: 'url',
      target: 'login.micros0ft-portal.net',
      displayTarget: 'login.micros0ft-portal.net',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      riskScore: 91,
      severity: 'critical',
      verdict: 'malicious',
      confidence: 96,
    },
    {
      id: 'scan-005',
      type: 'email',
      target: 'Your OTP for SBI NetBanking is 847291. Valid for 10 min.',
      displayTarget: 'Your OTP for SBI NetBanking is 847291...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
      riskScore: 72,
      severity: 'high',
      verdict: 'suspicious',
      confidence: 81,
    },
    {
      id: 'scan-006',
      type: 'url',
      target: 'https://github.com/microsoft/vscode',
      displayTarget: 'github.com/microsoft/vscode',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
      riskScore: 1,
      severity: 'low',
      verdict: 'safe',
      confidence: 99,
    },
    {
      id: 'scan-007',
      type: 'email',
      target: 'Dear Customer, Your invoice #INV-20248832 is overdue. Pay now to avoid penalty.',
      displayTarget: 'Dear Customer, Your invoice is overdue...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
      riskScore: 55,
      severity: 'moderate',
      verdict: 'suspicious',
      confidence: 73,
    },
    {
      id: 'scan-008',
      type: 'url',
      target: 'secure-banking.hdfc-alerts.co.in',
      displayTarget: 'hdfc-alerts.co.in',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
      riskScore: 95,
      severity: 'critical',
      verdict: 'malicious',
      confidence: 97,
    },
    {
      id: 'scan-009',
      type: 'url',
      target: 'https://stackoverflow.com/questions',
      displayTarget: 'stackoverflow.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
      riskScore: 3,
      severity: 'low',
      verdict: 'safe',
      confidence: 99,
    },
    {
      id: 'scan-010',
      type: 'email',
      target: 'Hi John, I need you to urgently transfer $8,500 to our new vendor. CEO - Robert',
      displayTarget: 'Urgent wire transfer request from CEO...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      riskScore: 88,
      severity: 'critical',
      verdict: 'malicious',
      confidence: 92,
    }
  ],

  /* ── THREAT REPORTS ──────────────────────────────────────── */
  threatReports: {

    /* Malicious URL - Phishing */
    'scan-001': {
      id: 'scan-001',
      type: 'url',
      target: 'paypal-secure-verify.xyz',
      riskScore: 97,
      severity: 'critical',
      verdict: 'malicious',
      confidence: 98,
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      summary: 'This URL exhibits multiple high-confidence phishing indicators targeting PayPal users. The domain impersonates PayPal\'s login portal using a look-alike domain designed to steal credentials.',
      indicators: [
        { id: 'i1', type: 'critical', icon: '🎯', title: 'Domain Impersonation', description: 'The domain "paypal-secure-verify.xyz" mimics PayPal\'s legitimate domain. The use of hyphens and the word "secure" are classic social engineering tactics to appear trustworthy.' },
        { id: 'i2', type: 'critical', icon: '🔗', title: 'Suspicious TLD', description: 'The ".xyz" top-level domain is commonly abused by phishing actors due to its low cost and minimal registration requirements.' },
        { id: 'i3', type: 'critical', icon: '🏛️', title: 'Fake Banking Portal', description: 'Page content analysis indicates a credential harvesting form mimicking PayPal\'s login interface.' },
        { id: 'i4', type: 'high',     icon: '📍', title: 'Suspicious Redirect Chain', description: 'The URL redirects through multiple intermediate domains before reaching the phishing landing page.' },
        { id: 'i5', type: 'moderate', icon: '📅', title: 'Newly Registered Domain', description: 'Domain registered within the past 14 days, consistent with disposable phishing infrastructure.' },
      ],
      recommendations: [
        'Do not enter your PayPal credentials or any personal information on this site.',
        'Close this tab immediately.',
        'Report this URL to PhishTank or the Anti-Phishing Working Group.',
        'If you already entered credentials, change your PayPal password immediately.',
        'Enable two-factor authentication on your PayPal account.',
        'Access PayPal only through paypal.com directly in your browser.',
      ],
      technical: {
        registeredDomain: 'paypal-secure-verify.xyz',
        ipAddress: '185.220.101.47',
        asn: 'AS204428 / Frantech Solutions',
        country: 'Netherlands',
        domainAge: '14 days',
        ssl: 'Self-signed certificate (Let\'s Encrypt — Free)',
        redirectChain: ['paypal-secure-verify.xyz', 'r1.track-analytics.co', 'phish-landing-page.xyz'],
        detectionEngines: '14/22 engines flagged',
      }
    },

    /* Malicious Email */
    'scan-002': {
      id: 'scan-002',
      type: 'email',
      target: 'URGENT: Your account has been locked. Click here to restore access within 24 hours or your account will be permanently deleted.',
      riskScore: 89,
      severity: 'critical',
      verdict: 'malicious',
      confidence: 95,
      timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
      summary: 'This message contains multiple classic phishing patterns including artificial urgency, account threat framing, and credential theft tactics commonly associated with phishing campaigns targeting banking customers.',
      indicators: [
        { id: 'i1', type: 'critical', icon: '⚡', title: 'Artificial Urgency & Threat', description: 'The message creates false urgency ("24 hours", "permanently deleted") to pressure the victim into acting without thinking — a primary social engineering technique.' },
        { id: 'i2', type: 'critical', icon: '🎭', title: 'Credential Theft Intent', description: 'The call-to-action ("Click here to restore access") is designed to capture login credentials on a fake portal.' },
        { id: 'i3', type: 'high',     icon: '✉️', title: 'Sender Impersonation Pattern', description: 'The message does not identify a specific legitimate sender and uses generic framing consistent with mass phishing campaigns.' },
        { id: 'i4', type: 'moderate', icon: '📝', title: 'Generic Salutation', description: 'Legitimate institutions address customers by name. Generic "Dear Customer" or no salutation indicates a mass-sent phishing template.' },
      ],
      recommendations: [
        'Do not click any links in this message.',
        'Do not enter your credentials on any page reached from this message.',
        'Verify your account status by visiting your bank\'s official website directly.',
        'Contact your bank\'s official customer support to confirm account status.',
        'Report this message as phishing through your email client.',
        'Block the sender and delete the message.',
      ],
      technical: {
        senderAnalysis: 'Generic sender pattern — no verified domain',
        urgencyScore: '9.4 / 10',
        manipulationTechniques: ['Artificial urgency', 'Account threat', 'Fear induction', 'Time pressure'],
        phishingPatterns: ['Mass template structure', 'Generic salutation', 'Anonymous CTA link'],
        languageIndicators: 'Threat language, command imperatives',
      }
    },

    /* Safe URL */
    'scan-003': {
      id: 'scan-003',
      type: 'url',
      target: 'https://www.google.com',
      riskScore: 2,
      severity: 'low',
      verdict: 'safe',
      confidence: 99,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      summary: 'This URL is a well-established, globally recognized domain with a strong security reputation. No threat indicators were detected.',
      indicators: [
        { id: 'i1', type: 'low', icon: '✅', title: 'Verified Legitimate Domain', description: 'google.com is a globally recognized, trusted domain with decades of established reputation.' },
        { id: 'i2', type: 'low', icon: '🔒', title: 'Valid SSL Certificate', description: 'The domain uses a valid SSL certificate issued by a trusted Certificate Authority.' },
        { id: 'i3', type: 'low', icon: '📅', title: 'Long-standing Domain', description: 'Domain registered since 1997 with consistent ownership and reputation.' },
      ],
      recommendations: [
        'This URL appears to be safe.',
        'Always ensure you\'re on the official google.com domain.',
        'Keep your browser and extensions updated for ongoing protection.',
      ],
      technical: {
        registeredDomain: 'google.com',
        ssl: 'Valid — Google Trust Services',
        domainAge: '29 years',
        country: 'United States',
        detectionEngines: '0/22 engines flagged',
      }
    },
  },

  /* ── ANALYTICS DATA ──────────────────────────────────────── */
  analytics: {
    totalScans:        1284,
    urlScans:          847,
    emailSmsScans:     437,
    malicious:         143,
    suspicious:        201,
    safe:              940,

    /* Trend data — last 7 days */
    weeklyTrend: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      scans:   [145, 178, 134, 201, 167, 98, 112],
      threats: [18,  24,  15,  31,  21,  9,  11],
    },

    /* URL threat types */
    urlThreatTypes: [
      { label: 'Phishing',           count: 58, color: '#FF4757' },
      { label: 'Domain Spoofing',    count: 31, color: '#FF6B35' },
      { label: 'Typosquatting',      count: 22, color: '#FFB020' },
      { label: 'Malicious Redirect', count: 19, color: '#B478FF' },
      { label: 'Fake Portal',        count: 13, color: '#00E5FF' },
    ],

    /* Email/SMS threat types */
    emailThreatTypes: [
      { label: 'Phishing Intent',        count: 44, color: '#FF4757' },
      { label: 'Credential Theft',       count: 31, color: '#FF6B35' },
      { label: 'OTP Theft',             count: 19, color: '#FFB020' },
      { label: 'CEO Fraud / BEC',       count: 12, color: '#B478FF' },
      { label: 'Social Engineering',    count: 37, color: '#00E5FF' },
    ],

    /* Severity distribution */
    severityDist: [
      { label: 'Critical', count: 44,  color: '#FF4757' },
      { label: 'High',     count: 99,  color: '#FF6B35' },
      { label: 'Moderate', count: 201, color: '#FFB020' },
      { label: 'Low / Safe', count: 940, color: '#00D68F' },
    ],

    /* Top indicators */
    topIndicators: [
      { label: 'Artificial Urgency',       count: 87 },
      { label: 'Suspicious Domain',        count: 72 },
      { label: 'Credential Theft Pattern', count: 65 },
      { label: 'Newly Registered Domain',  count: 54 },
      { label: 'Sender Impersonation',     count: 48 },
      { label: 'Typosquatted Domain',      count: 43 },
    ]
  },

  /* ── BROWSER PROTECTION STATUS ──────────────────────────── */
  protectionStatus: {
    enabled: true,
    mode: 'active',
    lastChecked: new Date().toISOString(),
    blockedToday: 3,
    monitoredTabs: 4,
    features: {
      urlScanning: true,
      phishingAlerts: true,
      suspiciousRedirects: true,
      highRiskWarnings: true,
    }
  }
};

/* ─── Export ─────────────────────────────────────────────────── */
if (typeof module !== 'undefined') module.exports = MockData;

