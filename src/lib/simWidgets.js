// Six teaching simulations. Controls -> live visual -> readout -> one "what to notice" line.
import { spillOutcome, molarity, heatFlow, equilibriumShift, cellPotential, faraday } from './chemistry/simulations.js';

const $ = (s, r) => r.querySelector(s), $$ = (s, r) => [...r.querySelectorAll(s)];
const frame = (id, controls, stage, readout, notice) => `
  <div class="sim-grid" data-sim="${id}">
    <div class="sim-controls">${controls}</div>
    <div>
      <div class="sim-stage">${stage}</div>
      <dl class="sim-readout">${readout}</dl>
      <p class="sim-notice">${notice}</p>
    </div>
  </div>`;
const range = (name, label, value, min, max, step) =>
  `<label class="wd-field">${label}<input type="range" data-k="${name}" min="${min}" max="${max}" step="${step}" value="${value}"><output data-o="${name}">${value}</output></label>`;
const buttons = (name, items, first) =>
  `<div class="wd-field"><span>${name}</span><div class="wd-btns">${items.map((x, i) => `<button type="button" class="sim-token" data-k="${name}" data-v="${x}" aria-pressed="${i === 0}">${x}</button>`).join('')}</div></div>`;
const val = (r, k) => Number($(`[data-k="${k}"]`, r)?.value || 0);
const selected = (r, k) => $$(`[data-k="${k}"]`, r).find((b) => b.getAttribute('aria-pressed') === 'true')?.dataset.v || '';
const wireTokens = (r, fn) => {
  $$('.sim-token', r).forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.k;
    $$('.sim-token', r).filter((x) => x.dataset.k === k).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    fn();
  }));
};
const wireRanges = (r, fn) => {
  $$('input[type="range"]', r).forEach((i) => i.addEventListener('input', () => {
    const out = $(`[data-o="${i.dataset.k}"]`, r);
    if (out) out.textContent = i.value;
    fn();
  }));
};

export function spillSim(host) {
  host.innerHTML = frame('spill',
    buttons('kind', ['acid', 'base', 'solvent'], 0) + buttons('action', ['rinse', 'absorb'], 0),
    '<div class="sim-bar"><i style="width:20%"></i></div><p>Corrosive or flammable liquid on the bench</p>',
    '<div><dt>Risk score</dt><dd data-r="score">–</dd></div>',
    '<span data-r="notice">Choose a spill and a response.</span>');
  const run = () => {
    const o = spillOutcome(selected(host, 'kind'), selected(host, 'action'));
    $('[data-r="score"]', host).textContent = o.score.toFixed(1);
    $('[data-r="notice"]', host).textContent = o.notice;
    $('.sim-bar i', host).style.width = `${Math.round(o.score * 10)}%`;
  };
  wireTokens(host, run); run();
}

export function molaritySim(host) {
  host.innerHTML = frame('molarity',
    range('mass', 'Mass (g)', 5.85, 0.5, 30, 0.05) + range('mm', 'Molar mass (g/mol)', 58.44, 18, 250, 0.01) + range('vol', 'Volume (mL)', 250, 50, 1000, 50),
    '<div class="sim-bar"><i style="width:40%"></i></div><p>Solute dissolving in a volumetric flask</p>',
    '<div><dt>mol/L</dt><dd data-r="conc">–</dd></div><div><dt>Litres</dt><dd data-r="litres">–</dd></div>',
    '<span data-r="notice">Volume is converted from mL to L before dividing.</span>');
  const run = () => {
    const r = molarity(val(host, 'mass'), val(host, 'mm'), val(host, 'vol'));
    $('[data-r="conc"]', host).textContent = r.concentration.toFixed(3);
    $('[data-r="litres"]', host).textContent = r.litres.toFixed(3);
    $('.sim-bar i', host).style.width = `${Math.min(100, Math.round(r.concentration * 200))}%`;
    $('[data-r="notice"]', host).textContent = `${val(host, 'vol')} mL = ${r.litres.toFixed(3)} L. More volume means lower concentration.`;
  };
  wireRanges(host, run); run();
}

export function heatFlowSim(host) {
  host.innerHTML = frame('heatflow',
    range('mass', 'Mass (g)', 100, 10, 500, 10) + range('c', 'Specific heat (J/g·K)', 4.18, 0.1, 5, 0.01) + range('dt', 'Temperature rise (K)', 20, 1, 100, 1),
    '<div class="sim-bar"><i style="width:30%"></i></div><p>Heat flowing into the sample</p>',
    '<div><dt>q (J)</dt><dd data-r="q">–</dd></div>',
    '<span data-r="notice">q = m × c × ΔT.</span>');
  const run = () => {
    const q = heatFlow(val(host, 'mass'), val(host, 'c'), val(host, 'dt'));
    $('[data-r="q"]', host).textContent = q.toFixed(0);
    $('.sim-bar i', host).style.width = `${Math.min(100, Math.round(q / 20))}%`;
    $('[data-r="notice"]', host).textContent = `q = ${val(host, 'mass')} × ${val(host, 'c')} × ${val(host, 'dt')}. Watch how each slider changes the heat.`;
  };
  wireRanges(host, run); run();
}

export function leChatelierSim(host) {
  host.innerHTML = frame('lechat',
    buttons('stress', ['reactant', 'product', 'cool', 'heat'], 0),
    '<div class="sim-stage-arrow" data-r="arrow" style="font-size:2.4rem">⇌</div><p>Exothermic equilibrium</p>',
    '<div><dt>Comparison</dt><dd data-r="q">–</dd></div>',
    '<span data-r="notice">Choose a stress to see the shift.</span>');
  const run = () => {
    const r = equilibriumShift(selected(host, 'stress'));
    $('[data-r="q"]', host).textContent = r.q;
    $('[data-r="arrow"]', host).textContent = r.dir === 'right' ? '→' : r.dir === 'left' ? '←' : '⇌';
    $('[data-r="notice"]', host).textContent = r.notice;
  };
  wireTokens(host, run); run();
}

export function galvanicSim(host) {
  host.innerHTML = frame('galvanic',
    `<label class="wd-field">Cathode<select data-k="cathode"><option value="0.34">Cu²⁺/Cu</option><option value="0.80">Ag⁺/Ag</option><option value="-0.76">Zn²⁺/Zn</option></select></label>
     <label class="wd-field">Anode<select data-k="anode"><option value="-0.76">Zn²⁺/Zn</option><option value="-0.44">Fe²⁺/Fe</option><option value="0.34">Cu²⁺/Cu</option></select></label>
     ${range('conc', 'Cathode ion concentration', 1, 0.01, 2, 0.01)}`,
    '<div class="sim-bar"><i style="width:60%"></i></div><p>Two half-cells joined by a salt bridge</p>',
    '<div><dt>E° (V)</dt><dd data-r="standard">–</dd></div><div><dt>E (V)</dt><dd data-r="potential">–</dd></div>',
    '<span data-r="notice">Changing concentration changes the cell voltage.</span>');
  const run = () => {
    const c = cellPotential(Number(val(host, 'cathode')), Number(val(host, 'anode')), val(host, 'conc') || 1);
    $('[data-r="standard"]', host).textContent = c.standard.toFixed(2);
    $('[data-r="potential"]', host).textContent = c.potential.toFixed(2);
    $('[data-r="notice"]', host).textContent = `At ${val(host, 'conc')} mol/L the voltage is ${c.potential.toFixed(2)} V. The Nernst term shifts it from E°.`;
    $('.sim-bar i', host).style.width = `${Math.min(100, Math.max(4, Math.round(c.potential * 40)))}%`;
  };
  $$('select', host).forEach((s) => s.addEventListener('change', run));
  wireRanges(host, run); run();
}

export function electrolysisSim(host) {
  host.innerHTML = frame('electrolysis',
    range('current', 'Current (A)', 2, 0.1, 10, 0.1) + range('time', 'Time (s)', 600, 60, 3600, 60) + range('mm', 'Metal molar mass (g/mol)', 63.5, 20, 200, 0.5),
    '<div class="sim-bar"><i style="width:20%"></i></div><p>Metal plating onto the cathode</p>',
    '<div><dt>grams plated</dt><dd data-r="grams">–</dd></div><div><dt>gas (L)</dt><dd data-r="gas">–</dd></div>',
    '<span data-r="notice">Faraday: charge decides how much deposits.</span>');
  const run = () => {
    const r = faraday(val(host, 'current'), val(host, 'time'), val(host, 'mm'));
    $('[data-r="grams"]', host).textContent = r.grams.toFixed(3);
    $('[data-r="gas"]', host).textContent = r.gasLitres.toFixed(2);
    $('.sim-bar i', host).style.width = `${Math.min(100, Math.round(r.grams * 40))}%`;
    $('[data-r="notice"]', host).textContent = `${r.coulombs.toFixed(0)} C of charge plates ${r.grams.toFixed(3)} g and releases ${r.gasLitres.toFixed(2)} L of gas.`;
  };
  wireRanges(host, run); run();
}

export const SIM_WIDGETS = { spillSim, molaritySim, heatFlowSim, leChatelierSim, galvanicSim, electrolysisSim };
