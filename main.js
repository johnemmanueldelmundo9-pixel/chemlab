import { mountShell } from './components/shell.js';
import { startRouter } from './router.js';
import { initAuth } from './lib/auth.js';

mountShell();
startRouter(document.getElementById('main'));
initAuth(); // optional accounts: does nothing until Supabase is configured in src/config.js
