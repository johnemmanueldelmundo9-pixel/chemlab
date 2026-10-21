// "Delete account" step 1: explain, then email a confirmation link. Nothing is deleted yet.
import { getUser, requestDeleteLink } from '../lib/auth.js';

let dlg = null;

function build() {
  dlg = document.createElement('dialog');
  dlg.className = 'auth-dialog';
  dlg.setAttribute('aria-labelledby', 'del-title');
  dlg.innerHTML = `
    <div class="auth-card">
      <button type="button" class="auth-x" aria-label="Close">×</button>
      <h2 id="del-title">Delete your account?</h2>
      <p class="auth-sub del-text"></p>
      <p class="auth-msg" role="status" aria-live="polite"></p>
      <div class="del-actions">
        <button type="button" class="btn btn-danger del-send">Send confirmation email</button>
        <button type="button" class="btn btn-ghost del-cancel">Cancel</button>
      </div>
    </div>`;
  document.body.append(dlg);
  const msg = dlg.querySelector('.auth-msg');
  const send = dlg.querySelector('.del-send');
  const close = () => dlg.close();
  dlg.querySelector('.auth-x').addEventListener('click', close);
  dlg.querySelector('.del-cancel').addEventListener('click', close);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });

  send.addEventListener('click', async () => {
    send.disabled = true; msg.dataset.bad = ''; msg.textContent = 'Sending…';
    try {
      await requestDeleteLink();
      msg.textContent = 'Email sent! Open the link in it (in this same browser) to confirm. Your account stays untouched until you do.';
      send.hidden = true;
      dlg.querySelector('.del-cancel').textContent = 'Close';
    } catch (err) {
      msg.textContent = err.message; msg.dataset.bad = '1'; send.disabled = false;
    }
  });
}

export function openDeleteDialog() {
  const user = getUser();
  if (!user) return;
  if (!dlg) build();
  dlg.querySelector('.del-text').textContent =
    `This permanently deletes your ChemLab account and your saved progress. For your safety we will email a confirmation link to ${user.email}. Nothing is deleted until you open that link and confirm.`;
  const send = dlg.querySelector('.del-send');
  send.hidden = false; send.disabled = false;
  dlg.querySelector('.del-cancel').textContent = 'Cancel';
  const msg = dlg.querySelector('.auth-msg'); msg.textContent = ''; msg.dataset.bad = '';
  if (!dlg.open) dlg.showModal();
}
