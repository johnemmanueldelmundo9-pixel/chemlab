// Placeholder module page. Each module's real content will live in src/modules/<id>/.
import { getModule } from '../data/modules.js';
import { icon } from '../lib/icons.js';

export function renderModule(el, id) {
  const m = getModule(id);
  if (!m) return renderNotFound(el);
  const { lessons, sims, calcs } = m.plan;
  el.innerHTML = `
    <div class="container module-page" style="--h:${m.hue}">
      <a class="back" href="#/modules">← All modules</a>
      <p class="eyebrow">Module ${String(m.num).padStart(2, '0')}</p>
      <h1>${m.title}</h1>
      <p style="color:var(--ink-2);margin-bottom:20px">${m.blurb}</p>
      <h2 style="font-size:1.1rem;margin-bottom:8px">What you'll cover</h2>
      <ul>${m.topics.map((t) => `<li>${t}</li>`).join('')}</ul>
      <div class="coming">${icon('flask')}
        <p style="margin-top:8px"><strong>This module is being built.</strong> Planned: ${lessons} lessons, ${sims} simulation${sims > 1 ? 's' : ''}, ${calcs} calculators and a quiz.</p>
      </div>
    </div>`;
  el.querySelector('.coming svg').style.cssText = 'width:28px;height:28px;color:var(--brand)';
}

export function renderNotFound(el) {
  el.innerHTML = `<div class="container module-page"><h1>Page not found</h1><p><a href="#/">Back to home</a></p></div>`;
}
