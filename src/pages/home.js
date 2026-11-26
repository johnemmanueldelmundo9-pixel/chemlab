import { MODULES, totalItems } from '../data/modules.js';
import { CONTENT } from '../data/content.js';
import { moduleCard } from '../components/moduleCard.js';
import { atomSvg } from '../components/atom.js';
import { overallProgress } from '../lib/progress.js';
import { icon } from '../lib/icons.js';

const STEPS = [
  ['book', 'Learn', 'Short, plain-language lessons that build one idea at a time.'],
  ['sliders', 'Simulate', 'Every module has live simulations with controls, a readout and a what-to-notice line.'],
  ['calc', 'Calculate', 'Step-by-step calculators for the maths: moles, enthalpy, equilibrium, cell potential and redox.'],
  ['check', 'Quiz', 'Instant feedback with worked solutions, so mistakes become lessons.'],
];

// Every built-in calculator and simulation, derived from module outlines + content titles.
const PICKS = {
  calc: MODULES.flatMap((m) => (m.outline?.calcs || []).map((_, i) => {
    const id = `calc-${i + 1}`;
    const title = CONTENT[m.id]?.tools?.[id]?.title;
    return title ? { id, title, module: m.title, route: `#/module/${m.id}?item=${id}` } : null;
  }).filter(Boolean)),
  sim: MODULES.flatMap((m) => (m.outline?.sims || []).map((_, i) => {
    const id = `sim-${i + 1}`;
    const title = CONTENT[m.id]?.tools?.[id]?.title;
    return title ? { id, title, module: m.title, route: `#/module/${m.id}?item=${id}` } : null;
  }).filter(Boolean)),
};

export function renderHome(el) {
  const all = overallProgress();
  const started = all.done > 0;
  const next = MODULES[0];
  const ready = MODULES.filter((m) => m.status === 'ready');
  const activities = ready.reduce((n, m) => n + totalItems(m), 0);
  // Tab and picker state are managed below.

  el.innerHTML = `
    <section class="hero">
      <div class="container">
        <div>
          <p class="eyebrow">Interactive chemistry</p>
          <h1>Chemistry you can <em>see, tweak</em> and actually understand.</h1>
          <p class="hero-lead">Four modules are available: lab safety, basic concepts, thermochemistry and electrochemistry. They contain 13 lessons, 13 live simulations, 14 calculators and 2 quizzes. Free, with an optional AI tutor that answers your questions.</p>
          <div class="hero-cta">
            <a class="btn btn-primary" href="#/module/${next.id}">${started ? 'Continue learning' : 'Start learning'}</a>
            <a class="btn btn-ghost" href="#/modules">Browse all modules</a>
          </div>
          <ul class="hero-facts">
            <li><strong>${MODULES.length}</strong> modules available</li>
            <li><strong>${ready.length}</strong> open now</li>
            <li><strong>${activities}</strong> activities</li>
          </ul>
        </div>
        <div class="hero-visual">
          <div class="atom-stage" aria-hidden="true">
            ${atomSvg()}
          </div>
          <nav class="hero-tabs" role="tablist" aria-label="Explore ChemLab">
            <a class="hero-tab" role="tab" aria-selected="false" aria-controls="hero-picker" data-picker="calc" href="#/module/basic-concepts">Calculator</a>
            <a class="hero-tab" role="tab" aria-selected="false" aria-controls="hero-picker" data-picker="sim" href="#/module/intro-lab-safety">Simulation</a>
            <a class="hero-tab" role="tab" aria-selected="false" href="#/periodic-table">Periodic Table</a>
          </nav>
          <div class="hero-picker" id="hero-picker" role="tabpanel" hidden></div>
        </div>
      </div>
    </section>

    <section class="section" id="modules">
      <div class="container">
        <div class="section-head section-head-row">
          <div>
            <p class="eyebrow">Curriculum</p>
            <h2>Choose a module</h2>
            <p>Follow them in order, or jump straight to what you're studying.</p>
          </div>
          <div class="progress-summary">
            <div class="ps-top"><span class="ps-label">Your progress</span><strong class="ps-pct">${all.pct}%</strong></div>
            <div class="progress" role="progressbar" aria-label="Overall progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${all.pct}"><i style="width:${all.pct}%"></i></div>
            <span class="ps-meta">${all.done} of ${all.total} activities</span>
          </div>
        </div>
        <div class="module-grid">${MODULES.map(moduleCard).join('')}</div>
      </div>
    </section>

    <section class="section pt-promo-section">
      <div class="container">
        <a class="pt-promo" href="#/periodic-table">
          <span class="pt-promo-icon">${icon('table')}</span>
          <span class="pt-promo-text">
            <strong>Interactive periodic table</strong>
            <span>All 118 elements. Tap one to see its atomic mass, oxidation states, electron configuration, melting point and more.</span>
          </span>
          <span class="btn btn-primary btn-sm">Open the table</span>
        </a>
      </div>
    </section>

    <section class="section band" id="how-it-works">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">How it works</p>
          <h2>Every module follows the same four steps</h2>
          <p>Read it, play with it, calculate it, then prove you've got it.</p>
        </div>
        <div class="steps">
          ${STEPS.map(([i, t, d]) => `<div class="step">${icon(i)}<h3>${t}</h3><p>${d}</p></div>`).join('')}
        </div>
      </div>
    </section>

    <section class="section" id="ai-tutor">
      <div class="container">
        <div class="ai-card">
          <div>
            <p class="eyebrow">AI tutor</p>
            <h2>Stuck? Ask ChemBot.</h2>
            <p>Ask about any concept and get a step-by-step explanation. ChemBot only answers chemistry, and it tailors its answers to the module you are on. AI can be wrong, so check important numbers with the step-by-step calculators.</p>
            <button class="btn btn-primary" type="button" id="open-chat">Ask ChemBot</button>
          </div>
          <div class="chat-demo" aria-hidden="true">
            <div class="bubble you">Why does the pressure go up when I shrink the container?</div>
            <div class="bubble bot">Same number of gas particles, less room, so they hit the walls more often. That's Boyle's law: <code>P₁V₁ = P₂V₂</code> at constant temperature.</div>
            <div class="bubble you">Show me with numbers.</div>
          </div>
        </div>
      </div>
    </section>`;

  el.querySelector('#open-chat').addEventListener('click', () => dispatchEvent(new Event('chemlab:open-chat')));
  // The hero atom is meant to always move, so its SMIL animation is never paused here.
  const tabs = el.querySelector('.hero-tabs');
  tabs?.addEventListener('keydown', (e) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
    const links = [...tabs.querySelectorAll('[role="tab"]')];
    const i = links.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? links.length - 1
      : e.key === 'ArrowRight' ? (i + 1) % links.length : (i - 1 + links.length) % links.length;
    links[next].focus();
  });

  const picker = el.querySelector('.hero-picker');
  const pickerTabs = [...el.querySelectorAll('[data-picker]')];
  let openKind = '';

  function closePicker() {
    openKind = '';
    picker.hidden = true;
    pickerTabs.forEach((t) => t.setAttribute('aria-selected', 'false'));
  }
  function openPicker(kind) {
    openKind = kind;
    const label = kind === 'calc' ? 'Calculators' : 'Simulations';
    picker.innerHTML = `<p class="hero-picker-label">${label} · ${PICKS[kind].length} available</p>
      <div class="hero-picker-list">${PICKS[kind].map((it) => `<a class="hero-pick" href="${it.route}"><span class="hero-pick-name">${it.title}</span><span class="hero-pick-mod">${it.module}</span></a>`).join('')}</div>`;
    picker.hidden = false;
    pickerTabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.picker === kind)));
  }
  pickerTabs.forEach((tab) => tab.addEventListener('click', (e) => {
    e.preventDefault();
    if (openKind === tab.dataset.picker) closePicker();
    else openPicker(tab.dataset.picker);
  }));
  if (window.__chemlabPickerOutside) document.removeEventListener('click', window.__chemlabPickerOutside);
  window.__chemlabPickerOutside = (e) => {
    if (!e.target.closest('.hero-tabs, .hero-picker')) closePicker();
  };
  document.addEventListener('click', window.__chemlabPickerOutside);
  if (window.__chemlabPickerEsc) document.removeEventListener('keydown', window.__chemlabPickerEsc);
  window.__chemlabPickerEsc = (e) => { if (e.key === 'Escape') closePicker(); };
  document.addEventListener('keydown', window.__chemlabPickerEsc);
}
