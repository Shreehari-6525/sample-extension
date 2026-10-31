/**
 * TrustShield AI — Service Worker (Manifest V3)
 * Handles extension lifecycle and tab events.
 */

'use strict';

/* ── Install & Activate ─────────────────────────────────────── */
self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e  => e.waitUntil(clients.claim()));

/* ── Authentication screen ───────────────────────────────────── */
function openAuthPage(view) {
  const page = view === 'legal' ? 'auth/legal.html' : 'auth/auth.html' + (view ? '#' + view : '#signin');
  const url = chrome.runtime.getURL(page);
  // Fall back to a new window if there is no current window to hold a tab (e.g. at browser start-up).
  chrome.tabs.create({ url }).catch(() => chrome.windows.create({ url }));
}

/* First install → land on the authentication screen. */
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') openAuthPage('signin');
});

/* ── Open Dashboard on Icon Click (fallback) ─────────────────── */
// The popup handles this in normal operation.
// This handles edge cases where popup is disabled.
chrome.action.onClicked.addListener(tab => {
  // This fires only when no popup is defined — popup takes priority.
  // The dashboard itself redirects to the auth screen if there is no session.
  chrome.tabs.create({ url: chrome.runtime.getURL('dashboard/dashboard.html') });
});

/* ── Context Menu (future: right-click scan) ─────────────────── */
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus?.create({
    id: 'trustshield-scan-url',
    title: 'Scan with TrustShield AI',
    contexts: ['link', 'selection'],
  });
});

/* ── Message Passing ─────────────────────────────────────────── */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openDashboard') {
    chrome.tabs.create({ url: chrome.runtime.getURL('dashboard/dashboard.html' + (message.hash ? '#' + message.hash : '')) });
    sendResponse({ success: true });
  }
  if (message.action === 'openAuth') {
    openAuthPage(message.view);
    sendResponse({ success: true });
  }
  if (message.action === 'getCurrentTabUrl') {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      sendResponse({ url: tabs[0]?.url || '' });
    });
    return true; // Keep channel open for async response
  }
});

