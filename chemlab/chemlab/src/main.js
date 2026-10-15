import { mountShell } from './components/shell.js';
import { startRouter } from './router.js';

mountShell();
startRouter(document.getElementById('main'));
