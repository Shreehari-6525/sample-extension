/**
 * TrustShield AI — Auth Controller
 * Manages view switching, form validation, and prototype auth flows.
 */

'use strict';

/* ════════════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  await ThemeManager.init();

  // A visitor who already has a session never needs the auth screens.
  if (await AuthGuard.isAuthenticated()) {
    window.location.replace(AuthGuard.dashboardUrl('overview'));
    return;
  }

  setupNavigation();
  setupForms();
  window.addEventListener('hashchange', handleHashRouting);
  handleHashRouting();
});

const DASHBOARD_REDIRECT_DELAY_MS = 900;

/* ════════════════════════════════════════════════════════════
   VIEW MANAGEMENT
════════════════════════════════════════════════════════════ */
// 'signin' is the landing screen. 'success' is only reachable right after a sign-in.
const VIEWS = ['signin', 'register', 'forgot', 'success'];
const DEFAULT_VIEW = 'signin';

function showView(viewId) {
  VIEWS.forEach(id => {
    const el = document.getElementById(`view-${id}`);
    if (el) el.classList.toggle('hidden', id !== viewId);
  });
  if (window.location.hash !== `#${viewId}`) {
    history.replaceState(null, '', `#${viewId}`);
  }
}

function handleHashRouting() {
  const hash = window.location.hash.replace('#', '') || DEFAULT_VIEW;
  // 'success' can't be opened by typing the hash — it only follows a real sign-in.
  const valid = (VIEWS.includes(hash) && hash !== 'success') ? hash : DEFAULT_VIEW;
  showView(valid);
}

/* ════════════════════════════════════════════════════════════
   NAVIGATION WIRING
════════════════════════════════════════════════════════════ */
function setupNavigation() {
  // Sign In (landing screen)
  document.getElementById('btnGoRegisterFromSignin')?.addEventListener('click', () => showView('register'));
  document.getElementById('btnForgotPw')?.addEventListener('click', () => showView('forgot'));

  // Register
  document.getElementById('btnBackFromRegister')?.addEventListener('click', () => showView('signin'));
  document.getElementById('btnGoSignInFromRegister')?.addEventListener('click', () => showView('signin'));

  // Forgot
  document.getElementById('btnBackFromForgot')?.addEventListener('click', () => showView('signin'));
  document.getElementById('btnBackToSignin')?.addEventListener('click', () => showView('signin'));

  // Success
  document.getElementById('btnGoToDashboard')?.addEventListener('click', goToDashboard);

  // Google buttons (placeholder only — no session is created)
  document.querySelectorAll('.btn-google').forEach(btn => {
    btn.addEventListener('click', handleGoogleAuth);
  });

  // Password toggles
  setupPasswordToggle('signinPassword', 'toggleSigninPw');
  setupPasswordToggle('regPassword', 'toggleRegPw');
  setupPasswordToggle('regConfirmPassword', 'toggleRegConfirmPw');
}

/* Same-tab redirect so the auth screen is replaced by the dashboard. */
function goToDashboard() {
  window.location.replace(AuthGuard.dashboardUrl('overview'));
}

/* Show the success state, then continue to the dashboard. */
function completeSignIn(messageHtml) {
  document.getElementById('successMsg').innerHTML = messageHtml;
  showView('success');
  setTimeout(goToDashboard, DASHBOARD_REDIRECT_DELAY_MS);
}

/* ════════════════════════════════════════════════════════════
   FORM SETUP
════════════════════════════════════════════════════════════ */
function setupForms() {
  document.getElementById('formSignin')?.addEventListener('submit', handleSignIn);
  document.getElementById('formRegister')?.addEventListener('submit', handleRegister);
  document.getElementById('formForgot')?.addEventListener('submit', handleForgotPassword);

  // Pressing a submit button must not blur the field first: blur validation can hide an
  // error message, shifting the layout so the click lands off the button and is lost.
  document.querySelectorAll('.auth-form button[type="submit"]').forEach(btn => {
    btn.addEventListener('mousedown', e => e.preventDefault());
  });

  // Live validation
  document.getElementById('signinEmail')?.addEventListener('blur', () =>
    validateEmail('signinEmail', 'signinEmailError'));
  document.getElementById('regEmail')?.addEventListener('blur', () =>
    validateEmail('regEmail', 'regEmailError'));
  document.getElementById('regName')?.addEventListener('blur', () =>
    validateRequired('regName', 'regNameError', 'Name is required'));
  document.getElementById('regPassword')?.addEventListener('blur', () =>
    validatePassword('regPassword', 'regPwError'));
  document.getElementById('regConfirmPassword')?.addEventListener('blur', () =>
    validateConfirmPassword('regPassword', 'regConfirmPassword', 'regConfirmPwError'));
}

/* ════════════════════════════════════════════════════════════
   HANDLERS
════════════════════════════════════════════════════════════ */
async function handleSignIn(e) {
  e.preventDefault();
  const email    = document.getElementById('signinEmail').value.trim();
  const password = document.getElementById('signinPassword').value;

  let valid = true;
  if (!validateEmail('signinEmail', 'signinEmailError'))    valid = false;
  if (!validateRequired('signinPassword', 'signinPwError', 'Password is required')) valid = false;
  if (!valid) return;

  setButtonLoading('btnSignin', 'signinSpinner', true);
  hideFormError('signinFormError');

  try {
    const result = await ApiService.login({ email, password });
    if (result.success) {
      await Storage.Auth.set({ user: { ...result.user, email }, token: result.token });
      completeSignIn(`You're signed in as <strong>${Utils.sanitizeHtml(result.user.name)}</strong>`);
    } else {
      showFormError('signinFormError', result.error || 'Sign in failed. Please check your credentials.');
    }
  } finally {
    setButtonLoading('btnSignin', 'signinSpinner', false);
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const name     = document.getElementById('regName').value.trim();
  const email    = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const role     = document.querySelector('input[name="role"]:checked')?.value || 'citizen';

  let valid = true;
  if (!validateRequired('regName',     'regNameError',  'Full name is required'))    valid = false;
  if (!validateEmail('regEmail',       'regEmailError'))                             valid = false;
  if (!validatePassword('regPassword', 'regPwError'))                               valid = false;
  if (!validateConfirmPassword('regPassword', 'regConfirmPassword', 'regConfirmPwError')) valid = false;
  if (!valid) return;

  setButtonLoading('btnRegister', 'registerSpinner', true);
  hideFormError('registerFormError');

  try {
    const result = await ApiService.register({ name, email, password, role });
    if (result.success) {
      const user = { name, email, role, initials: AuthGuard.initialsOf({ name }) };
      await Storage.Auth.set({ user, token: 'demo' });
      completeSignIn(`Welcome, <strong>${Utils.sanitizeHtml(name)}</strong>! Your prototype account has been created.`);
    } else {
      showFormError('registerFormError', result.error || 'Registration failed. Please try again.');
    }
  } finally {
    setButtonLoading('btnRegister', 'registerSpinner', false);
  }
}

async function handleForgotPassword(e) {
  e.preventDefault();
  const email = document.getElementById('forgotEmail').value.trim();
  if (!validateEmail('forgotEmail', 'forgotEmailError')) return;

  setButtonLoading('btnSendReset', 'forgotSpinner', true);
  hideFormError('forgotFormError');

  try {
    await ApiService.forgotPassword({ email });
    const successEl = document.getElementById('forgotSuccess');
    successEl.textContent = `✅ If an account exists for ${email}, a reset link will be sent. (Demo: no email sent)`;
    successEl.classList.remove('hidden');
    document.getElementById('forgotEmail').value = '';
  } finally {
    setButtonLoading('btnSendReset', 'forgotSpinner', false);
  }
}

function handleGoogleAuth() {
  // Placeholder only: no Google credentials are requested and no session is created.
  Utils.showToast('Google sign-in is not available in this prototype. It will be added with Google OAuth 2.0 via the Spring Boot backend.', 'info', 5000);
}

/* ════════════════════════════════════════════════════════════
   VALIDATION HELPERS
════════════════════════════════════════════════════════════ */
function validateEmail(inputId, errorId) {
  const input = document.getElementById(inputId);
  const val   = input?.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!val) return showFieldError(inputId, errorId, 'Email address is required');
  if (!regex.test(val)) return showFieldError(inputId, errorId, 'Please enter a valid email address');
  clearFieldError(inputId, errorId);
  return true;
}

function validateRequired(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  if (!input?.value.trim()) return showFieldError(inputId, errorId, message);
  clearFieldError(inputId, errorId);
  return true;
}

function validatePassword(inputId, errorId) {
  const input = document.getElementById(inputId);
  const val   = input?.value;
  if (!val) return showFieldError(inputId, errorId, 'Password is required');
  if (val.length < 8) return showFieldError(inputId, errorId, 'Password must be at least 8 characters');
  clearFieldError(inputId, errorId);
  return true;
}

function validateConfirmPassword(passwordId, confirmId, errorId) {
  const pw  = document.getElementById(passwordId)?.value;
  const val = document.getElementById(confirmId)?.value;
  if (!val) return showFieldError(confirmId, errorId, 'Please confirm your password');
  if (val !== pw) return showFieldError(confirmId, errorId, 'Passwords do not match');
  clearFieldError(confirmId, errorId);
  return true;
}

function showFieldError(inputId, errorId, msg) {
  document.getElementById(inputId)?.classList.add('error');
  const err = document.getElementById(errorId);
  if (err) { err.textContent = msg; err.classList.remove('hidden'); }
  return false;
}

function clearFieldError(inputId, errorId) {
  document.getElementById(inputId)?.classList.remove('error');
  document.getElementById(errorId)?.classList.add('hidden');
}

function showFormError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.remove('hidden'); }
}

function hideFormError(id) {
  document.getElementById(id)?.classList.add('hidden');
}

/* ════════════════════════════════════════════════════════════
   UI HELPERS
════════════════════════════════════════════════════════════ */
function setButtonLoading(btnId, spinnerId, loading) {
  const btn     = document.getElementById(btnId);
  const spinner = document.getElementById(spinnerId);
  const text    = btn?.querySelector('.btn-text');
  if (!btn) return;
  btn.disabled = loading;
  spinner?.classList.toggle('hidden', !loading);
  if (text) text.style.opacity = loading ? '0.5' : '1';
}

function setupPasswordToggle(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn   = document.getElementById(btnId);
  if (!input || !btn) return;
  btn.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  });
}

