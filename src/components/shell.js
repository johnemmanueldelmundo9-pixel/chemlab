// Page chrome: header, main outlet, footer and the AI tutor launcher.
import { icon } from '../lib/icons.js';
import { toggleTheme } from '../lib/theme.js';
import { resetProgress } from '../lib/progress.js';
import { clearRemoteProgress } from '../lib/auth.js';
import { mountAccount } from './accountMenu.js';
import { mountSavePrompt } from './savePrompt.js';
import { mountChat } from './chat.js';

export function mountShell() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <header class="site-header">
      <div class="container">
        <a class="brand" href="#/" aria-label="ChemLab home">
          <svg class="brand-mark" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="16" cy="16" r="3" fill="currentColor" stroke="none"/>
            <ellipse cx="16" cy="16" rx="13" ry="5.5"/>
            <ellipse cx="16" cy="16" rx="13" ry="5.5" transform="rotate(60 16 16)"/>
            <ellipse cx="16" cy="16" rx="13" ry="5.5" transform="rotate(120 16 16)"/>
          </svg>
          <span>Chem<em>Lab</em></span>
        </a>
        <nav class="nav" aria-label="Main">
          <a href="#/modules">Modules</a>
          <a href="#/periodic-table">Periodic table</a>
          <a href="#/how-it-works">How it works</a>
          <a href="#/ai-tutor">AI tutor</a>
        </nav>
        <div class="header-actions">
          <button class="icon-btn theme-toggle" type="button" aria-label="Toggle dark mode">
            <span class="sun">${icon('sun')}</span><span class="moon">${icon('moon')}</span>
          </button>
          <a class="btn btn-primary btn-sm hide-sm" href="#/module/basic-concepts">Start learning</a>
        </div>
      </div>
    </header>
    <main id="main" tabindex="-1"></main>
    <footer class="site-footer">
      <div class="container">
        <span>© ${new Date().getFullYear()} ChemLab · Built for learning chemistry. · <a href="#/periodic-table">Periodic table</a></span>
        <button type="button" id="reset-progress">Reset my progress</button>
      </div>
    </footer>`;

  app.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
  app.querySelector('#reset-progress').addEventListener('click', async () => {
    if (confirm('Clear all saved progress (on this device and in your account, if you are signed in)?')) {
      await clearRemoteProgress();
      resetProgress();
      location.reload();
    }
  });
  mountAccount(app.querySelector('.header-actions'));
  mountSavePrompt();
  mountChat(app);
}
