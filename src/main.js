import { mountShell } from './components/shell.js';
import { startRouter } from './router.js';
import { initAuth } from './lib/auth.js';

// The account-deletion email link returns to /?confirm=delete&code=...  Send the visitor to the
// confirmation page, keeping the rest of the query (Supabase reads and removes `code` itself).
const params = new URLSearchParams(location.search);
if (params.get('confirm') === 'delete') {
  params.delete('confirm');
  const q = params.toString();
  history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + '#/confirm-delete');
}

mountShell();
startRouter(document.getElementById('main'));
initAuth(); // optional accounts: does nothing until Supabase is configured in src/config.js
