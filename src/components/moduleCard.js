import { icon } from '../lib/icons.js';
import { moduleProgress } from '../lib/progress.js';

export function moduleCard(m) {
  const p = moduleProgress(m);
  const soon = m.status !== 'ready';
  return `
    <a class="module-card" href="#/module/${m.id}" style="--h:${m.hue}">
      <div class="mc-top">
        <span class="mc-icon">${icon(m.icon)}</span>
        <span class="mc-num">MODULE ${String(m.num).padStart(2, '0')}</span>
      </div>
      <div>
        <h3>${m.title}</h3>
        <p>${m.blurb}</p>
      </div>
      <div class="mc-topics">${m.topics.map((t) => `<span class="chip">${t}</span>`).join('')}</div>
      <div class="mc-foot">
        <div class="mc-features"><span>Lessons</span><span>Simulations</span><span>Calculators</span><span>Quiz</span></div>
        <div class="progress" role="progressbar" aria-label="${m.title} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p.pct}"><i style="width:${p.pct}%"></i></div>
        <div class="mc-meta">
          <span>${p.pct}% complete</span>
          <span class="badge ${soon ? 'badge-soon' : ''}">${soon ? 'Coming soon' : 'Open'}</span>
        </div>
      </div>
    </a>`;
}
