/**
 * TrustShield AI — Utility Functions
 * Shared helpers used across all pages.
 */

'use strict';

const Utils = (() => {

  /* ── Date & Time ─────────────────────────────────────────── */
  function formatDate(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function formatTime(isoString) {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  function formatDateTime(isoString) {
    return `${formatDate(isoString)}, ${formatTime(isoString)}`;
  }

  function timeAgo(isoString) {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days  = Math.floor(hours / 24);
    if (mins < 1)   return 'Just now';
    if (mins < 60)  return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  /* ── String Helpers ──────────────────────────────────────── */
  function truncate(str, max = 50) {
    if (!str) return '';
    return str.length > max ? str.substring(0, max) + '…' : str;
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function sanitizeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ── URL Helpers ─────────────────────────────────────────── */
  function extractDomain(url) {
    try {
      const u = new URL(url.startsWith('http') ? url : 'https://' + url);
      return u.hostname;
    } catch { return url; }
  }

  function isValidUrl(str) {
    try {
      const u = new URL(str.startsWith('http') ? str : 'https://' + str);
      return u.hostname.includes('.');
    } catch { return false; }
  }

  /* ── Risk Score Helpers ──────────────────────────────────── */
  function getRiskColor(score) {
    if (score >= 80) return 'var(--danger)';
    if (score >= 60) return 'var(--severity-high)';
    if (score >= 35) return 'var(--warning)';
    return 'var(--success)';
  }

  function getRiskClass(score) {
    if (score >= 80) return 'danger';
    if (score >= 60) return 'high';
    if (score >= 35) return 'warning';
    return 'success';
  }

  function getSeverityLabel(severity) {
    const map = { critical: 'Critical', high: 'High', moderate: 'Moderate', low: 'Low / Safe' };
    return map[severity] || capitalize(severity);
  }

  function getVerdictBadgeClass(verdict) {
    const map = { malicious: 'badge-malicious', suspicious: 'badge-suspicious', safe: 'badge-safe' };
    return map[verdict] || 'badge-neutral';
  }

  function getSeverityBadgeClass(severity) {
    const map = { critical: 'badge-critical', high: 'badge-high', moderate: 'badge-moderate', low: 'badge-low' };
    return map[severity] || 'badge-neutral';
  }

  /* ── DOM Helpers ─────────────────────────────────────────── */
  function el(selector, parent = document) {
    return parent.querySelector(selector);
  }

  function els(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  }

  function show(el)  { if (el) el.classList.remove('hidden'); }
  function hide(el)  { if (el) el.classList.add('hidden'); }
  function toggle(el){ if (el) el.classList.toggle('hidden'); }

  function setHTML(el, html)  { if (el) el.innerHTML = html; }
  function setText(el, text)  { if (el) el.textContent = text; }

  /* ── Toast Notifications ─────────────────────────────────── */
  function showToast(message, type = 'info', duration = 3500) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = { success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span style="font-size:16px;flex-shrink:0">${icons[type] || icons.info}</span>
      <span style="font-size:13px;color:var(--text-primary);flex:1">${sanitizeHtml(message)}</span>
      <button class="toast-close" aria-label="Dismiss">×</button>
    `;
    container.appendChild(toast);
    toast.querySelector('.toast-close').addEventListener('click', () => dismissToast(toast));
    setTimeout(() => dismissToast(toast), duration);
  }

  function dismissToast(toast) {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }

  /* ── Number formatting ───────────────────────────────────── */
  function formatNumber(n) {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n.toString();
  }

  /* ── Debounce ────────────────────────────────────────────── */
  function debounce(fn, ms = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }

  /* ── Open Dashboard Tab ─────────────────────────────────── */
  function openDashboard(hash = '') {
    const url = chrome.runtime.getURL('dashboard/dashboard.html') + (hash ? '#' + hash : '');
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, '_blank');
    }
  }

  return {
    formatDate, formatTime, formatDateTime, timeAgo,
    truncate, capitalize, sanitizeHtml,
    extractDomain, isValidUrl,
    getRiskColor, getRiskClass, getSeverityLabel,
    getVerdictBadgeClass, getSeverityBadgeClass,
    el, els, show, hide, toggle, setHTML, setText,
    showToast,
    formatNumber,
    debounce,
    openDashboard,
  };

})();

