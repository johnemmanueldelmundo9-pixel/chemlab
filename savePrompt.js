// One gentle, dismissible nudge after the first bit of progress: "Create an account to save it?"
// Never shown when signed in, when accounts aren't set up, or for 7 days after "Maybe later".
import { getUser, isConfigured } from '../lib/auth.js';

const KEY = 'chemlab:save-prompt-snooze';
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;

function snoozed() {
  try { return Date.now() < Number(localStorage.getItem(KEY) || 0); } catch { return false; }
}
function snooze() {
  try { localStorage.setItem(KEY, String(Date.now() + SNOOZE_MS)); } catch { /* ignore */ }
}

export function mountSavePrompt() {
  let card = null;
  const close = () => { card?.remove(); card = null; };

  addEventListener('chemlab:progress', () => {
    if (card || getUser() || !isConfigured() || snoozed()) return;
    card = document.createElement('aside');
    card.className = 'save-prompt';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', 'Save your progress');
    card.innerHTML = `
      <strong>Nice work! Want to save your progress?</strong>
      <p>Create a free account to keep it on every device. Totally optional.</p>
      <div class="save-actions">
        <button type="button" class="btn btn-primary btn-sm" data-a="yes">Create account</button>
        <button type="button" class="btn btn-ghost btn-sm" data-a="later">Maybe later</button>
      </div>`;
    card.addEventListener('click', (e) => {
      const a = e.target.closest('[data-a]')?.dataset.a;
      if (!a) return;
      if (a === 'later') snooze();
      close();
      if (a === 'yes') dispatchEvent(new CustomEvent('chemlab:open-auth', { detail: { mode: 'signup' } }));
    });
    document.body.append(card);
  });
}
