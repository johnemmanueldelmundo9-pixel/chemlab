// Sign in / Sign up / Forgot password / Reset password dialog.
// Accounts are optional: "Continue without an account" is always there.
import { signIn, signUp, requestPasswordReset, updatePassword, isConfigured } from '../lib/auth.js';
import { checkPassword } from '../lib/password.js';

const EYE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
const EYE_OFF = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a10 10 0 0 0 4.4-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';

const COPY = {
  signin: ['Save your progress', 'An account is optional. ChemLab works fully without one. Sign in only if you want your progress kept across devices.', 'Sign in'],
  signup: ['Save your progress', 'An account is optional. ChemLab works fully without one. Create one only if you want your progress kept across devices.', 'Create account'],
  forgot: ['Reset your password', 'Enter your email and we will send you a link to choose a new password.', 'Send reset link'],
  reset:  ['Choose a new password', 'Pick a new password for your account.', 'Update password'],
};

let dlg = null;
let mode = 'signin';
let busy = false;

function build() {
  dlg = document.createElement('dialog');
  dlg.className = 'auth-dialog';
  dlg.setAttribute('aria-labelledby', 'auth-title');
  dlg.innerHTML = `
    <div class="auth-card">
      <button type="button" class="auth-x" aria-label="Close">×</button>
      <h2 id="auth-title"></h2>
      <p class="auth-sub"></p>
      <div class="auth-tabs" role="tablist" data-modes="signin signup">
        <button type="button" role="tab" data-mode="signin">Sign in</button>
        <button type="button" role="tab" data-mode="signup">Sign up</button>
      </div>
      <form class="auth-form" novalidate>
        <div class="field" data-modes="signin signup forgot">
          <label for="auth-email">Email</label>
          <input id="auth-email" type="email" name="email" autocomplete="email">
        </div>
        <div class="field" data-modes="signin signup reset">
          <label for="auth-pw" class="pw-label">Password</label>
          <div class="pw-wrap">
            <input id="auth-pw" type="password" name="password">
            <button type="button" class="pw-toggle" aria-label="Show password" aria-pressed="false">${EYE}</button>
          </div>
        </div>
        <ul class="pw-rules" data-modes="signup reset" aria-label="Password requirements">
          <li data-rule="length">At least 8 characters</li>
          <li data-rule="number">At least one number</li>
          <li data-rule="special">At least one special character (like ! @ # $ %)</li>
        </ul>
        <div class="field" data-modes="signup reset">
          <label for="auth-pw2">Confirm password</label>
          <input id="auth-pw2" type="password" name="confirm" autocomplete="new-password">
        </div>
        <button type="button" class="auth-link" data-go="forgot" data-modes="signin">Forgot password?</button>
        <p class="auth-msg" role="status" aria-live="polite"></p>
        <button class="btn btn-primary auth-submit" type="submit"></button>
      </form>
      <button type="button" class="auth-link" data-go="signin" data-modes="forgot">Back to sign in</button>
      <button type="button" class="auth-skip" data-modes="signin signup forgot">Continue without an account</button>
    </div>`;
  document.body.append(dlg);

  const form = dlg.querySelector('.auth-form');
  const msg = dlg.querySelector('.auth-msg');
  const submit = dlg.querySelector('.auth-submit');
  const toggle = dlg.querySelector('.pw-toggle');

  const say = (text, kind = 'result') => { msg.textContent = text; msg.dataset.kind = kind; msg.dataset.bad = ''; };

  function state() {
    const email = form.email.value.trim();
    const pw = form.password.value;
    const rules = checkPassword(pw);
    const emailOk = /^\S+@\S+\.\S+$/.test(email);
    const match = pw.length > 0 && pw === form.confirm.value;
    const ok = { signin: emailOk && pw.length > 0, signup: emailOk && rules.ok && match, forgot: emailOk, reset: rules.ok && match }[mode];
    return { email, pw, rules, match, ok };
  }

  function validate() {
    const s = state();
    dlg.querySelectorAll('.pw-rules li').forEach((li) => li.classList.toggle('met', s.rules[li.dataset.rule]));
    submit.disabled = busy || !isConfigured() || !s.ok;
    if (msg.dataset.kind !== 'result') {
      if (!isConfigured()) say('Accounts are not set up yet. You can keep learning without one.', 'hint');
      else if ((mode === 'signup' || mode === 'reset') && form.confirm.value && !s.match) say('Passwords do not match yet.', 'hint');
      else say('', 'hint');
    }
  }

  function setMode(next) {
    mode = next;
    const [title, sub, label] = COPY[mode];
    dlg.querySelector('#auth-title').textContent = title;
    dlg.querySelector('.auth-sub').textContent = sub;
    submit.textContent = label;
    dlg.querySelectorAll('[data-modes]').forEach((el) => { el.hidden = !el.dataset.modes.split(' ').includes(mode); });
    dlg.querySelectorAll('[role=tab]').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.mode === mode)));
    dlg.querySelector('.pw-label').textContent = mode === 'reset' ? 'New password' : 'Password';
    form.password.autocomplete = mode === 'signin' ? 'current-password' : 'new-password';
    form.password.value = ''; form.confirm.value = '';
    say('', 'hint'); validate();
  }
  dlg.setMode = setMode;

  toggle.addEventListener('click', () => {
    const show = form.password.type === 'password';
    form.password.type = form.confirm.type = show ? 'text' : 'password';
    toggle.innerHTML = show ? EYE_OFF : EYE;
    toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    toggle.setAttribute('aria-pressed', String(show));
  });

  dlg.querySelectorAll('[role=tab]').forEach((t) => t.addEventListener('click', () => setMode(t.dataset.mode)));
  dlg.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.go)));
  dlg.querySelector('.auth-x').addEventListener('click', () => dlg.close());
  dlg.querySelector('.auth-skip').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  form.addEventListener('input', () => { if (msg.dataset.kind === 'result') say('', 'hint'); validate(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const s = state();
    if (!s.ok || busy) return;
    busy = true; validate();
    say({ signup: 'Creating your account…', signin: 'Signing in…', forgot: 'Sending…', reset: 'Updating…' }[mode], 'result');
    try {
      if (mode === 'signup') {
        const r = await signUp(s.email, s.pw);
        if (r.needsConfirm) { say('Almost done! Open the confirmation email we sent and click the link. Use this same browser.', 'result'); form.password.value = form.confirm.value = ''; return; }
        dlg.close();
      } else if (mode === 'signin') {
        await signIn(s.email, s.pw); dlg.close();
      } else if (mode === 'forgot') {
        await requestPasswordReset(s.email);
        say('If that email has an account, a reset link is on its way. Open it in this same browser.', 'result');
      } else {
        await updatePassword(s.pw);
        say('Password updated. You are signed in.', 'result');
        setTimeout(() => dlg.open && dlg.close(), 1400);
      }
    } catch (err) {
      say(err.message, 'result'); msg.dataset.bad = '1';
    } finally {
      busy = false; validate();
    }
  });
}

export function openAuth(nextMode = 'signin') {
  if (!dlg) build();
  dlg.setMode(nextMode);
  if (!dlg.open) dlg.showModal();
  dlg.querySelector(nextMode === 'reset' ? '#auth-pw' : '#auth-email').focus();
}
