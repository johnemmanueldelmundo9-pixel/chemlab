// "Delete account" step 2: the page the emailed link lands on.
import { authReady, getUser, deleteAccount } from '../lib/auth.js';

export async function renderConfirmDelete(outlet) {
  const shell = (inner) => {
    outlet.innerHTML = `<section class="section"><div class="container"><div class="confirm-card">${inner}</div></div></section>`;
    return outlet.querySelector('.confirm-card');
  };
  shell('<h1>Checking your link…</h1>');
  await authReady;
  if (!location.hash.startsWith('#/confirm-delete')) return; // visitor navigated away

  const user = getUser();
  if (!user) {
    const c = shell(`
      <h1>This link did not work</h1>
      <p>The confirmation link may have expired, or it was opened in a different browser than the one you requested it from. Sign in and start again from <strong>Delete account</strong>.</p>
      <a class="btn btn-primary" href="#/">Back to ChemLab</a>`);
    return c;
  }

  const c = shell(`
    <h1>Delete your ChemLab account?</h1>
    <p>You are about to permanently delete the account for <strong class="who"></strong> and all of its saved progress. This cannot be undone.</p>
    <p class="auth-msg" role="status" aria-live="polite"></p>
    <div class="del-actions">
      <button type="button" class="btn btn-danger" data-a="yes">Yes, delete my account</button>
      <a class="btn btn-ghost" href="#/">No, keep it</a>
    </div>`);
  c.querySelector('.who').textContent = user.email;
  const msg = c.querySelector('.auth-msg');
  const yes = c.querySelector('[data-a=yes]');
  yes.addEventListener('click', async () => {
    yes.disabled = true; msg.dataset.bad = ''; msg.textContent = 'Deleting…';
    try {
      await deleteAccount();
      shell(`
        <h1>Your account has been deleted</h1>
        <p>Your account and saved progress are gone. You can keep using ChemLab without an account, or sign up again any time.</p>
        <a class="btn btn-primary" href="#/">Back to ChemLab</a>`);
    } catch (err) {
      msg.textContent = err.message; msg.dataset.bad = '1'; yes.disabled = false;
    }
  });
}
