// Sign in / Sign up dialog. Accounts are optional: "Continue without an account" is always there.
import { signIn, signUp, isConfigured } from '../lib/auth.js';

let dlg = null;
let mode = 'signin';

function build() {
  dlg = document.createElement('dialog');
  dlg.className = 'auth-dialog';
  dlg.setAttribute('aria-labelledby', 'auth-title');
  dlg.innerHTML = `
    <div class="auth-card">
      <button type="button" class="auth-x" aria-label="Close">×</button>
      <h2 id="auth-title">Save your progress</h2>
      <p class="auth-sub">An account is optional. ChemLab works fully without one. Sign in only if you want your progress kept across devices.</p>
      <div class="auth-tabs" role="tablist">
        <button type="button" role="tab" data-mode="signin">Sign in</button>
        <button type="button" role="tab" data-mode="signup">Sign up</button>
      </div>
      <form class="auth-form" novalidate>
        <label>Email<input type="email" name="email" autocomplete="email" required></label>
        <label>Password<input type="password" name="password" required></label>
        <p class="auth-msg" role="status" aria-live="polite"></p>
        <button class="btn btn-primary auth-submit" type="submit"></button>
      </form>
      <button type="button" class="auth-skip">Continue without an account</button>
    </div>`;
  document.body.append(dlg);

  const form = dlg.querySelector('.auth-form');
  const msg = dlg.querySelector('.auth-msg');
  const submit = dlg.querySelector('.auth-submit');
  const say = (text, bad = false) => { msg.textContent = text; msg.dataset.bad = bad ? '1' : ''; };

  function setMode(next) {
    mode = next;
    dlg.querySelectorAll('[role=tab]').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.mode === mode)));
    submit.textContent = mode === 'signup' ? 'Create account' : 'Sign in';
    form.password.autocomplete = mode === 'signup' ? 'new-password' : 'current-password';
    say(isConfigured() ? '' : 'Accounts are not set up yet. You can keep learning without one.', !isConfigured());
    submit.disabled = !isConfigured();
  }
  dlg.setMode = setMode;

  dlg.querySelectorAll('[role=tab]').forEach((t) => t.addEventListener('click', () => setMode(t.dataset.mode)));
  dlg.querySelector('.auth-x').addEventListener('click', () => dlg.close());
  dlg.querySelector('.auth-skip').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;
    if (!/^\S+@\S+\.\S+$/.test(email)) return say('Enter a valid email address.', true);
    if (password.length < 8) return say('Use at least 8 characters for your password.', true);
    submit.disabled = true; say(mode === 'signup' ? 'Creating your account…' : 'Signing in…');
    try {
      if (mode === 'signup') {
        const r = await signUp(email, password);
        if (r.needsConfirm) { say('Almost done! Open the confirmation email we sent, click the link, then sign in.'); form.reset(); return; }
      } else {
        await signIn(email, password);
      }
      form.reset(); dlg.close();
    } catch (err) {
      say(err.message, true);
    } finally {
      submit.disabled = !isConfigured();
    }
  });
}

export function openAuth(nextMode = 'signin') {
  if (!dlg) build();
  dlg.setMode(nextMode);
  if (!dlg.open) dlg.showModal();
  dlg.querySelector('input[name=email]').focus();
}
