// First-visit storage notice. ChemLab uses no advertising or analytics cookies, so this is an
// explanation with one clear "Got it" button, not a pre-ticked consent wall.
const KEY = 'chemlab:storage-notice:v1';

export function mountStorageNotice() {
  try { if (localStorage.getItem(KEY)) return; } catch { return; }

  const el = document.createElement('section');
  el.className = 'storage-notice';
  el.setAttribute('role', 'region');
  el.setAttribute('aria-label', 'Storage notice');
  el.innerHTML = `
    <p>ChemLab keeps your theme, lesson progress and current chat in this browser. It sets no advertising or tracking cookies. <a href="#/cookies">What is stored</a>.</p>
    <button type="button" class="btn btn-primary btn-sm">Got it</button>`;
  document.body.append(el);

  el.querySelector('button').addEventListener('click', () => {
    try { localStorage.setItem(KEY, '1'); } catch { /* storage may be blocked */ }
    el.remove();
  });
}
