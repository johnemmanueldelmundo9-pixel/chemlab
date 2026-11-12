import { icon } from '../lib/icons.js';
import { moduleProgress } from '../lib/progress.js';

export function moduleCard(m) {
  const p = moduleProgress(m);
  const soon = m.status !== 'ready';
  const state = p.pct > 0 ? `${p.pct}% complete` : soon ? `${p.total} activities planned` : 'Not started';
  const parts = [
    `${m.plan.lessons} lessons`,
    m.plan.sims ? `${m.plan.sims} sims` : '',
    m.plan.calcs ? `${m.plan.calcs} calcs` : '',
    'quiz',
  ].filter(Boolean);
  return `
    <a class="module-card" href="#/module/${m.id}" style="--h:${m.hue}">
      <div class="mc-top">
        <span class="mc-icon">${icon(m.icon)}</span>
        <span class="mc-num" aria-hidden="true">${String(m.num).padStart(2, '0')}</span>
      </div>
      <div>
        <h3><span class="sr-only">Module ${m.num}: </span>${m.title}</h3>
        <p>${m.blurb}</p>
      </div>
      <div class="mc-topics">${m.topics.map((t) => `<span class="chip">${t}</span>`).join('')}</div>
      <div class="mc-foot">
        <div class="mc-features">${parts.map((x) => `<span>${x}</span>`).join('')}</div>
        <div class="progress" role="progressbar" aria-label="${m.title} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p.pct}"><i style="width:${p.pct}%"></i></div>
        <div class="mc-meta">
          <span>${state}</span>
          <span class="badge ${soon ? 'badge-soon' : ''}">${soon ? 'Coming soon' : 'Open'}</span>
        </div>
      </div>
    </a>`;
}
