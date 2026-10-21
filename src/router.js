// Tiny hash router: works on any static host (Vercel, GitHub Pages, XAMPP) with no server config.
import { renderHome } from './pages/home.js';
import { renderModule, renderNotFound } from './pages/module.js';
import { renderConfirmDelete } from './pages/confirmDelete.js';
import { renderPeriodic } from './pages/periodic.js';

const HOME_SECTIONS = ['modules', 'how-it-works', 'ai-tutor'];

export function startRouter(outlet) {
  function route() {
    const path = location.hash.replace(/^#\/?/, '');
    const [head, arg] = path.split('/');

    if (path === '' || HOME_SECTIONS.includes(head)) {
      renderHome(outlet);
      if (head) document.getElementById(head)?.scrollIntoView();
      else scrollTo(0, 0);
    } else if (head === 'periodic-table') {
      if (renderPeriodic(outlet, arg)) scrollTo(0, 0); // true only when the page was freshly built
    } else if (head === 'confirm-delete') {
      renderConfirmDelete(outlet);
      scrollTo(0, 0);
    } else if (head === 'module' && arg) {
      renderModule(outlet, arg);
      scrollTo(0, 0);
    } else {
      renderNotFound(outlet);
    }
  }
  addEventListener('hashchange', route);
  // Re-draw progress bars after account sync or sign out (keep the scroll position).
  addEventListener('chemlab:progress-synced', () => { const y = scrollY; route(); scrollTo(0, y); });
  route();
}
