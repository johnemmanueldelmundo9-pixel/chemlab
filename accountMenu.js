// Header account area: Sign in / Sign up when logged out, an avatar menu when logged in.
import { onAuthChange, signOut } from '../lib/auth.js';
import { openAuth } from './authDialog.js';

export function mountAccount(slot) {
  const root = document.createElement('div');
  root.className = 'acct';
  slot.prepend(root);

  function renderOut() {
    root.innerHTML = `
      <button type="button" class="btn btn-ghost btn-sm" data-act="signin">Sign in</button>
      <button type="button" class="btn btn-ghost btn-sm acct-signup" data-act="signup">Sign up</button>`;
  }
  function renderIn(user) {
    root.innerHTML = `
      <button type="button" class="acct-btn" aria-haspopup="menu" aria-expanded="false" aria-label="Account menu"></button>
      <div class="acct-menu" role="menu" hidden>
        <div class="acct-email"></div>
        <button type="button" role="menuitem" data-act="signout">Log out</button>
      </div>`;
    root.querySelector('.acct-btn').textContent = (user.email || '?')[0].toUpperCase();
    root.querySelector('.acct-email').textContent = user.email || '';
  }

  const toggleMenu = (open) => {
    const menu = root.querySelector('.acct-menu');
    const btn = root.querySelector('.acct-btn');
    if (!menu) return;
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  };

  root.addEventListener('click', async (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'signin' || act === 'signup') openAuth(act);
    else if (act === 'signout') { toggleMenu(false); await signOut(); }
    else if (e.target.closest('.acct-btn')) toggleMenu(root.querySelector('.acct-menu').hidden);
  });
  addEventListener('click', (e) => { if (!root.contains(e.target)) toggleMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleMenu(false); });
  addEventListener('chemlab:open-auth', (e) => openAuth(e.detail?.mode || 'signup'));

  onAuthChange((user) => (user ? renderIn(user) : renderOut()));
}
