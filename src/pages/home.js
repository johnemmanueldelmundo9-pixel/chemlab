import { MODULES } from '../data/modules.js';
import { moduleCard } from '../components/moduleCard.js';
import { atomSvg } from '../components/atom.js';
import { overallProgress } from '../lib/progress.js';
import { icon } from '../lib/icons.js';

const STEPS = [
  ['book', 'Learn', 'Short, plain-language lessons that build one idea at a time.'],
  ['sliders', 'Simulate', 'Drag sliders and watch gases, atoms and reactions respond live.'],
  ['calc', 'Calculate', 'Step-by-step calculators for the maths: moles, gas laws, enthalpy, cell potential.'],
  ['check', 'Quiz', 'Instant feedback with worked solutions, so mistakes become lessons.'],
];

export function renderHome(el) {
  const all = overallProgress();
  const started = all.done > 0;
  const next = MODULES[0];

  el.innerHTML = `
    <section class="hero">
      <div class="container">
        <div>
          <p class="eyebrow">Interactive chemistry</p>
          <h1>Chemistry you can <em>see, tweak</em> and actually understand.</h1>
          <p class="hero-lead">Seven modules from atomic structure to electrochemistry, each with lessons, live simulations, calculators and quizzes. Free, with an optional AI tutor that answers your questions.</p>
          <div class="hero-cta">
            <a class="btn btn-primary" href="#/module/${next.id}">${started ? 'Continue learning' : 'Start with Module 1'}</a>
            <a class="btn btn-ghost" href="#/modules">Browse all modules</a>
          </div>
          <div class="hero-pills">
            <a class="chip chip-link" href="#/periodic-table">Periodic table</a><span class="chip">7 modules</span><span class="chip">Simulations</span><span class="chip">Calculators</span><span class="chip">Quizzes</span><span class="chip">AI tutor</span>
          </div>
        </div>
        <div class="atom-stage" aria-hidden="false">
          ${atomSvg()}
          <span class="formula" style="left:0;top:12%">PV = nRT</span>
          <span class="formula" style="right:0;top:22%">ΔH = ΣH(p) − ΣH(r)</span>
          <span class="formula" style="left:4%;bottom:14%">E°cell = E°red − E°ox</span>
          <span class="formula" style="right:6%;bottom:6%">pH = −log[H⁺]</span>
        </div>
      </div>
    </section>

    <section class="section" id="modules">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">Curriculum</p>
          <h2>Choose a module</h2>
          <p>Follow them in order, or jump straight to what you're studying.</p>
        </div>
        <div class="progress-summary">
          <strong>${all.pct}% overall</strong>
          <div class="progress" role="progressbar" aria-label="Overall progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${all.pct}"><i style="width:${all.pct}%"></i></div>
          <span class="chip">${all.done} of ${all.total} activities</span>
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
            <p>Ask about any concept on screen and get a step-by-step explanation. ChemBot runs on Ollama on your own computer, so your questions stay private. The calculators do the final maths, so numbers are always checked.</p>
            <button class="btn btn-primary" type="button" id="open-chat">Check AI status</button>
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
  // Pause SMIL electron motion for people who prefer reduced motion.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) el.querySelector('.atom-stage svg')?.pauseAnimations();
}
