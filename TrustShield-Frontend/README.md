# TrustShield AI — Chrome Extension

**Intelligent Threat Detection & Browser Protection**

> ⚗ **UI Prototype / Demo Phase** — This is a frontend-only build. All scan results, statistics, and threat reports use demonstration data. No real threat detection, authentication, or backend integration is active in this phase.

---

## Overview

TrustShield AI is a professional cybersecurity Chrome Extension that protects users against:

1. **URL / Website Threat Detection** — Phishing sites, domain spoofing, typosquatting, fake banking portals, malicious redirects
2. **Email / SMS Phishing Detection** — Credential theft, OTP fraud, social engineering, CEO fraud, Business Email Compromise

---

## Installation (Development Mode)

### Prerequisites
- Google Chrome or Chromium-based browser (version 114+)
- Chrome Extensions developer mode enabled

### Steps

1. **Clone or download** this repository to your machine.

2. **Open Chrome Extensions:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Or: Menu (⋮) → More Tools → Extensions

3. **Enable Developer Mode:**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the extension:**
   - Click **"Load unpacked"**
   - Navigate to and select the `TrustShield-Frontend` folder (the folder containing `manifest.json`)
   - Click **"Select Folder"**

5. **Verify installation:**
   - The TrustShield AI icon should appear in your Chrome toolbar
   - Click the icon to open the popup

6. **Pin the extension (recommended):**
   - Click the puzzle piece icon in the toolbar
   - Click the pin icon next to TrustShield AI

---

## Authentication Flow (prototype)

```
Launch → Sign In / Create Account → Dashboard → Features → Sign Out → Sign In
```

- **Protected:** the dashboard (overview, scanners, history, analytics, protection, settings, profile) and the popup scanner. Without a session, the dashboard redirects to `auth/auth.html#signin` and the popup shows a sign-in / create-account screen instead of the scanner.
- **Sign Out:** Profile page, Settings page, and the popup footer. Signing out in one place also sends any other open dashboard tab back to the sign-in screen.
- **Prototype only:** sign-in and account creation are simulated and store a local demo session in `chrome.storage.local`. **Continue with Google** is a placeholder — it requests no credentials and creates no session.
- **Backend-ready:** `scripts/auth-guard.js` is the one place that decides whether a session is valid. When the Spring Boot backend and Google OAuth are connected, replace `isAuthenticated()` with a JWT/`/auth/me` check and `ApiService.login/register` with real calls; no page needs to change.

---

## Project Structure

```
TrustShield-Frontend/
│
├── manifest.json                    # Chrome Manifest V3 configuration
├── README.md                        # This file
│
├── assets/
│   └── icons/                       # Extension icons (16, 32, 48, 128px)
│
├── styles/
│   ├── design-system.css            # CSS variables, typography, spacing, base
│   ├── components.css               # Reusable UI components
│   └── themes.css                   # Dark / Light / System theme support
│
├── scripts/
│   ├── api-service.js               # API abstraction layer (mock during demo phase)
│   ├── auth-guard.js                # Session check + redirect to auth screen (single integration point)
│   ├── mock-data.js                 # All demonstration data (clearly labeled)
│   ├── storage.js                   # Chrome Storage API wrapper
│   ├── theme-manager.js             # Theme switching logic
│   └── utils.js                     # Shared utility functions
│
├── popup/                           # Chrome extension popup (380×560px)
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
│
├── auth/                            # Authentication screens
│   ├── auth.html                    # Sign In (landing), Create Account, Forgot Password
│   ├── auth.css
│   ├── auth.js
│   ├── legal.html / .css / .js      # Placeholder Terms of Service & Privacy Policy
│
├── dashboard/                       # Full-page dashboard (opens in new tab)
│   ├── dashboard.html
│   ├── dashboard.css
│   └── dashboard.js
│
├── pages/                           # Individual dashboard pages
│   ├── overview/
│   ├── universal-scan/
│   ├── url-scanner/
│   ├── email-sms-scanner/
│   ├── threat-report/
│   ├── scan-history/
│   ├── analytics/
│   ├── browser-protection/
│   ├── settings/
│   └── profile/
│
├── components/                      # Shared HTML components
└── background/
    └── service-worker.js            # MV3 service worker
```

---

## Features

### Popup
- Protection status indicator
- URL scanner with current tab scan
- Email/SMS scanner
- Recent scan history (last 5)
- Quick scan results
- Dashboard navigation
- Theme toggle (dark/light)

### Authentication UI
- Welcome screen
- Email + password sign in
- Account registration with role selection
- Forgot password flow
- Continue with Google (placeholder)
- Two account roles: Citizen User & SecOps Admin

### Dashboard
- Client-side hash routing (no page reloads)
- Collapsible sidebar navigation
- Dark / Light / System theme support
- 9 pages: Overview, Universal Scan, URL Scanner, Email/SMS, History, Analytics, Browser Protection, Settings, Profile

### Scanning
- URL threat analysis with full report
- Email/SMS phishing analysis with full report
- Threat indicators with severity levels
- Risk score (0–100 gauge)
- Recommended actions
- Expandable technical details

### Reports
- Animated risk score circle
- Critical / High / Moderate / Low severity badges
- Malicious / Suspicious / Safe verdict
- Confidence percentage
- Threat indicator explanations
- Security recommendations
- Technical details (expandable)

### Analytics
- Total scans, URL scans, Email/SMS scans
- Weekly trend charts (canvas)
- URL threat type distribution
- Email/SMS threat type distribution
- Severity distribution
- Top threat indicators

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Extension | Chrome Manifest V3 |
| HTML | HTML5 |
| Styles | CSS3 (custom properties, no framework) |
| JavaScript | Vanilla ES6+ (no external libraries) |
| Icons | Inline SVG |
| Storage | Chrome Storage API |
| Charts | Vanilla Canvas API |

---

## Demo Data Notice

> ⚗ **All data in this application is for demonstration purposes only.**
>
> Risk scores, threat percentages, confidence values, scan history, and analytics statistics are **not real ML predictions**. They are clearly labeled demonstration data.
>
> The application is a UI prototype designed for visual review and integration planning.

---

## Planned Backend Integration

```
Chrome Extension UI  →  Spring Boot Backend  →  Python ML Service  →  MySQL
```

### Backend (Java Spring Boot)
- `POST /api/v1/auth/login` — JWT authentication
- `POST /api/v1/auth/register` — BCrypt hashed registration
- `GET  /api/v1/auth/google` — Google OAuth 2.0
- `POST /api/v1/scan/url` — URL threat detection
- `POST /api/v1/scan/message` — Email/SMS phishing detection
- `GET  /api/v1/history` — User scan history
- `GET  /api/v1/analytics` — Threat analytics
- `GET  /api/v1/dashboard/overview` — Dashboard stats

### Integration Points
All API calls are centralized in `scripts/api-service.js`. Replace mock `delay()` returns with real `fetch()` calls pointing to your Spring Boot backend.

```javascript
// Current (demo):
async function scanUrl(url) {
  await delay(1400);
  return MockData.threatReports['scan-001'];
}

// Future (production):
async function scanUrl(url) {
  const headers = await _getAuthHeaders();
  const res = await fetch(`${CONFIG.BASE_URL}/scan/url`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ url })
  });
  return await res.json();
}
```

### User Roles
- **Citizen User** — Simplified threat explanations, clear recommendations
- **SecOps Admin** — Full technical details, analytics, detailed indicators

---

## Chrome Permissions Used

| Permission | Reason |
|-----------|--------|
| `storage` | Save theme, settings, and local scan history |
| `activeTab` | Read current tab URL for "Scan Current Tab" |
| `tabs` | Open dashboard in new tab |

No `<all_urls>` permission. No content scripts injected without user action.

---

## Development Workflow

```bash
# No build step needed — pure HTML/CSS/JS

# 1. Load in Chrome
# chrome://extensions/ → Load unpacked → select this folder

# 2. After editing files, click the refresh icon on the extension card
#    (or press Ctrl+R on the popup while DevTools is open)

# 3. For dashboard changes, close and reopen the dashboard tab
```

---

## Stage Completion Status

| Stage | Status | Description |
|-------|--------|-------------|
| 1 — Planning | ✅ Complete | Architecture, folder structure, design system |
| 2 — Design System | ✅ Complete | CSS tokens, components, themes |
| 3 — Popup + Auth | ✅ Complete | Popup UI, auth screens |
| 4 — Dashboard | ✅ Complete | Layout, sidebar, routing |
| 5 — Scanners | ✅ Complete | URL, Email/SMS, threat reports |
| 6 — Supporting | ✅ Complete | History, analytics, protection, settings, profile |
| 7 — Integration | ✅ Complete | All navigation wired, prototype interactions |
| 8 — Verification | ✅ Complete | Loaded in Chrome, errors fixed |

---

## License

This is a proprietary frontend prototype for the TrustShield AI project.
Not for redistribution.

---

*TrustShield AI — Protecting users from online threats, one scan at a time.*

