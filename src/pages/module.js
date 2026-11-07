// Module page: a hub for the module's parts, plus an in-page reader that opens lessons, tools and the quiz.
// Everything happens inside renderModule(el, id), so the router needs no changes.
// Item ids match lib/progress.js: "lesson-1", "sim-1", "calc-1", "quiz".
import { MODULES, getModule, totalItems } from '../data/modules.js';
import { CONTENT } from '../data/content.js';
import { icon } from '../lib/icons.js';
import { getAll, markDone, moduleProgress } from '../lib/progress.js';
import { mountWidget } from '../lib/widgets.js';

const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const named = (list, n, label, prefix) =>
  Array.from({ length: n }, (_, i) => ({ id: `${prefix}-${i + 1}`, name: list?.[i] || `${label} ${i + 1}` }));

function parts(m) {
  const o = m.outline || {}, p = m.plan;
  return [
    { key: 'lessons', title: 'Lessons', icon: 'book', blurb: 'Short explanations with interactive checks.', items: named(o.lessons, p.lessons, 'Lesson', 'lesson') },
    { key: 'sims', title: 'Simulations', icon: 'sliders', blurb: 'Change a setting and watch the chemistry respond.', items: named(o.sims, p.sims, 'Simulation', 'sim') },
    { key: 'calcs', title: 'Calculators', icon: 'calc', blurb: 'Step-by-step working for the maths in this module.', items: named(o.calcs, p.calcs, 'Calculator', 'calc') },
    { key: 'quiz', title: 'Quiz', icon: 'check', blurb: 'Instant feedback on every answer.', items: [{ id: 'quiz', name: 'Module quiz' }] },
  ].filter((s) => s.items.length);
}

const has = (m, id) => {
  const c = CONTENT[m.id] || {};
  if (id === 'quiz') return !!c.quiz?.length;
  if (id.startsWith('lesson-')) return !!c.lessons?.[+id.slice(7) - 1];
  return !!c.tools?.[id];
};

const check = (q, label = 'Quick check') => `
  <div class="chk" data-ans="${q.answer}">
    <p class="chk-q"><strong>${label}.</strong> ${q.q}</p>
    <div class="chk-opts">${q.options.map((o, i) => `<button type="button" data-i="${i}">${o}</button>`).join('')}</div>
    <p class="chk-why" role="status" aria-live="polite" hidden>${q.why}</p>
  </div>`;

function block([t, a, b]) {
  switch (t) {
    case 'h': return `<h2>${a}</h2>`;
    case 'p': return `<p>${a}</p>`;
    case 'list': return `<ul>${a.map((x) => `<li>${x}</li>`).join('')}</ul>`;
    case 'note': return `<aside class="note">${a}</aside>`;
    case 'table': return `<div class="tbl"><table><thead><tr>${a.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${b.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    case 'check': return check(a);
    case 'w': return `<div class="wd" data-w="${a}"></div>`;
    default: return '';
  }
}

export function renderModule(el, id) {
  const m = getModule(id);
  if (!m) return renderNotFound(el);
  const c = CONTENT[m.id] || {};
  let view = null; // null = hub, otherwise { id, i?, score? }

  const nextItem = () => {
    const done = new Set(getAll()[m.id] || []);
    return parts(m).flatMap((s) => s.items).find((it) => has(m, it.id) && !done.has(it.id));
  };

  /* ---------- hub ---------- */
  function hub() {
    const ready = m.status === 'ready';
    const done = new Set(getAll()[m.id] || []);
    const sections = parts(m);
    const p = moduleProgress(m);
    const nx = nextItem(), started = done.size > 0;
    const missing = sections.some((s) => s.items.some((it) => !has(m, it.id)));
    const i = MODULES.findIndex((x) => x.id === m.id);
    const prev = MODULES[i - 1], next = MODULES[i + 1];
    const { lessons, sims, calcs } = m.plan;
    const cta = nx ? `<button type="button" class="btn btn-primary" data-open="${nx.id}">${started ? 'Continue' : 'Start'}: ${nx.name}</button>` : '';

    el.innerHTML = `
    <div class="mod-page" style="--h:${m.hue}">
      <section class="mod-hero"><div class="container">
        <a class="back" href="#/modules">\u2190 All modules</a>
        <div class="mod-hero-grid">
          <div class="mod-hero-text">
            <p class="eyebrow">Module ${String(m.num).padStart(2, '0')}</p>
            <h1>${m.title}</h1>
            <p class="mod-lead">${m.blurb}</p>
            <div class="mod-topics" aria-label="Topics">${m.topics.map((t) => `<span class="chip">${t}</span>`).join('')}</div>
            ${cta ? `<div class="mod-cta">${cta}</div>` : ''}
          </div>
          <aside class="mod-summary" aria-label="Your progress in this module">
            <span class="mod-summary-icon">${icon(m.icon)}</span>
            <strong>${p.pct}% complete</strong>
            <div class="progress" role="progressbar" aria-label="${m.title} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p.pct}"><i style="width:${p.pct}%"></i></div>
            <span class="mod-summary-meta">${p.done} of ${totalItems(m)} activities</span>
            <span class="badge ${ready ? '' : 'badge-soon'}">${ready ? 'Open' : 'Coming soon'}</span>
          </aside>
        </div>
      </div></section>
      <section class="section mod-parts"><div class="container">
        ${missing ? `<div class="mod-coming">${icon('flask')}<p><strong>${ready ? 'Some parts are still being written.' : 'This module is being built.'}</strong> Planned: ${plural(lessons, 'lesson')}${sims ? `, ${plural(sims, 'simulation')}` : ''}${calcs ? `, ${plural(calcs, 'calculator')}` : ''} and a quiz.</p></div>` : ''}
        <div class="section-head"><h2>${ready ? 'What\u2019s in this module' : 'What will be in this module'}</h2><p>Work through the parts in order, or jump to the one you need.</p></div>
        <div class="mod-grid">${sections.map((s) => `
          <section class="mod-card" aria-labelledby="mc-${s.key}">
            <header><span class="mod-card-icon">${icon(s.icon)}</span><div><h3 id="mc-${s.key}">${s.title}</h3><p>${s.blurb}</p></div>
              <span class="chip mod-card-count">${s.items.filter((it) => done.has(it.id)).length}/${s.items.length}</span></header>
            <ul class="mod-list">${s.items.map((it) => {
              const tick = done.has(it.id) ? `<span class="mi-state" data-done="1">${icon('check')}<span class="sr-only">Completed</span></span>` : '<span class="mi-state" aria-hidden="true"></span>';
              return has(m, it.id)
                ? `<li><button type="button" class="mod-item" data-open="${it.id}">${tick}<span class="mi-name">${it.name}</span></button></li>`
                : `<li><span class="mod-item is-soon">${tick}<span class="mi-name">${it.name}</span><span class="badge badge-soon">Soon</span></span></li>`;
            }).join('')}</ul>
          </section>`).join('')}</div>
      </div></section>
      <nav class="container mod-pager" aria-label="Other modules">
        ${prev ? `<a class="mod-pager-link" href="#/module/${prev.id}"><small>Previous module</small><span>${prev.title}</span></a>` : '<span></span>'}
        ${next ? `<a class="mod-pager-link is-next" href="#/module/${next.id}"><small>Next module</small><span>${next.title}</span></a>` : '<span></span>'}
      </nav>
    </div>`;
  }

  /* ---------- reader ---------- */
  function reader() {
    const itemId = view.id, isQuiz = itemId === 'quiz';
    const item = parts(m).flatMap((s) => s.items).find((it) => it.id === itemId);
    let body = '', title = item.name;
    if (itemId.startsWith('lesson-')) {
      const L = c.lessons[+itemId.slice(7) - 1];
      title = L.title;
      body = L.blocks.map(block).join('') + `<div class="rd-actions"><button type="button" class="btn btn-primary" data-finish="${itemId}">Mark lesson complete</button></div>`;
    } else if (isQuiz) {
      body = quizBody();
    } else {
      const t = c.tools[itemId];
      title = t.title;
      body = `<p>${t.intro}</p><div class="wd" data-w="${t.widget}"></div><div class="rd-actions"><button type="button" class="btn btn-primary" data-finish="${itemId}">Mark as done</button></div>`;
    }
    el.innerHTML = `
    <div class="mod-page" style="--h:${m.hue}">
      <article class="container rd">
        <button type="button" class="rd-back" data-back>\u2190 ${m.title}</button>
        <p class="eyebrow">${isQuiz ? 'Quiz' : item.id.startsWith('lesson') ? 'Lesson' : item.id.startsWith('sim') ? 'Simulation' : 'Calculator'}</p>
        <h1 tabindex="-1">${title}</h1>
        ${body}
      </article>
    </div>`;
    el.querySelectorAll('.wd').forEach((n) => mountWidget(n.dataset.w, n));
    scrollTo(0, 0);
    el.querySelector('h1').focus({ preventScroll: true });
  }

  function quizBody() {
    const qs = c.quiz;
    if (view.i >= qs.length) {
      const pct = Math.round((view.score / qs.length) * 100), pass = pct >= 70;
      if (pass) markDone(m.id, 'quiz');
      return `<div class="note"><p><strong>${view.score} of ${qs.length} correct (${pct}%).</strong> ${pass ? 'Quiz complete: it now counts toward your progress.' : 'Score 70% or more to complete the quiz. Review the lessons and try again.'}</p></div>
        <div class="rd-actions"><button type="button" class="btn btn-ghost" data-retry>Try again</button><button type="button" class="btn btn-primary" data-back>Back to module</button></div>`;
    }
    return `<p class="wd-label">Question ${view.i + 1} of ${qs.length}</p>${check(qs[view.i], 'Choose one')}
      <div class="rd-actions"><button type="button" class="btn btn-primary" data-next hidden>${view.i === qs.length - 1 ? 'See score' : 'Next question'}</button></div>`;
  }

  const paint = () => (view ? reader() : hub());

  /* One handler for the whole page; assigned (not added) so re-rendering never stacks listeners. */
  el.onclick = (e) => {
    const open = e.target.closest('[data-open]');
    if (open) { view = { id: open.dataset.open, i: 0, score: 0 }; paint(); return; }
    if (e.target.closest('[data-back]')) { view = null; paint(); scrollTo(0, 0); return; }
    const fin = e.target.closest('[data-finish]');
    if (fin) { markDone(m.id, fin.dataset.finish); view = null; paint(); scrollTo(0, 0); return; }
    if (e.target.closest('[data-retry]')) { view = { id: 'quiz', i: 0, score: 0 }; paint(); return; }
    if (e.target.closest('[data-next]')) { view.i++; paint(); return; }
    const opt = e.target.closest('.chk-opts button');
    if (opt) {
      const box = opt.closest('.chk');
      if (box.dataset.locked) return;
      box.dataset.locked = '1';
      const right = +box.dataset.ans, ok = +opt.dataset.i === right;
      box.querySelectorAll('.chk-opts button').forEach((b) => { b.disabled = true; if (+b.dataset.i === right) b.classList.add('right'); });
      if (!ok) opt.classList.add('wrong');
      box.querySelector('.chk-why').hidden = false;
      box.querySelector('.chk-why').insertAdjacentText('afterbegin', ok ? 'Correct. ' : 'Not quite. ');
      if (view?.id === 'quiz') { if (ok) view.score++; el.querySelector('[data-next]').hidden = false; }
    }
  };

  paint();
}

export function renderNotFound(el) {
  el.innerHTML = `<div class="container module-page"><h1>Page not found</h1><p><a href="#/">Back to home</a></p></div>`;
}
