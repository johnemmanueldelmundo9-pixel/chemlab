// Solver widgets for Module 7 (thermochemistry and equilibrium) and Module 8 (electrochemistry).
// Registered in widgets.js through SOLVER_WIDGETS. The maths is in ./chemistry/thermo.js, equilibrium.js and redox.js.
// Uses the .wd-* classes in lesson.css plus the "Solver widgets" block added at the end of that file.
import { parseSig, roundSig } from './chemistry/sigfigs.js';
import { SPECIFIC_HEAT, solveHeat, mixing, calorimeter, heatingCurve, parseEq, hess, HF, reactionEnthalpy, gibbs, KfromDG, DGfromK, R_J } from './chemistry/thermo.js';
import { reaction, expression, quotient, gasMoles, KpFromKc, KcFromKp, solveICE, leChatelier } from './chemistry/equilibrium.js';
import { parseIon, oxidationNumbers, balanceRedox, POTENTIALS, potential, cell, cellQ, nernst, ELECTRODE, faraday, gasVolume } from './chemistry/redox.js';

const $ = (r, s) => r.querySelector(s);
const field = (label, inner, wide) => `<label class="wd-field"${wide ? ' style="grid-column:1/-1"' : ''}>${label}${inner}</label>`;
const warn = (t) => `<p class="wd-warn">${t}</p>`;
const sub = (f) => String(f).replace(/(\d+)/g, '<sub>$1</sub>');
const ion = (formula, charge) => `${sub(formula)}${charge ? `<sup>${Math.abs(charge) > 1 ? Math.abs(charge) : ''}${charge > 0 ? '+' : '\u2212'}</sup>` : ''}`;
const sp = (label) => { const p = parseIon(label); return p ? ion(p.formula, p.charge) : sub(label); };
const exp = (t) => { if (!t.includes('e')) return t; const [a, b] = t.split('e'); return `${a} \u00d7 10<sup>${+b}</sup>`; };
// Round to n significant figures (n from the typed inputs) and format.
const S = (x, n = 3) => (x === 0 ? '0' : Number.isFinite(x) ? exp(roundSig(x, n).text).replace(/-/g, '\u2212') : '\u2014');
const nsf = (raw, keys, dflt = 3) => { const c = keys.map((k) => (String(raw[k] ?? '').trim() ? parseSig(raw[k])?.n : null)).filter(Boolean); return c.length ? Math.min(...c) : dflt; };
const arrow = (s) => (s === 'right' ? '\u2192' : s === 'left' ? '\u2190' : '\u2194');
const f = (k, label, value, extra = {}) => ({ key: k, label, value, ...extra });
const fhtml = (d) => d.type === 'select'
  ? field(d.label, `<select data-k="${d.key}">${d.options.map(([v, l]) => `<option value="${v}"${String(v) === String(d.value) ? ' selected' : ''}>${l}</option>`).join('')}</select>`, d.wide)
  : field(d.label, `<input type="text" ${d.type === 'text' ? '' : 'inputmode="decimal"'} autocomplete="off" spellcheck="false" value="${d.value ?? ''}" data-k="${d.key}">`, d.wide);

/* A simple form: fields on top, the answer underneath, updating as you type. */
function form(h, spec) {
  h.innerHTML = `<div class="wd-body">${spec.top || ''}<div class="wd-row">${spec.fields.map(fhtml).join('')}</div>${spec.note ? `<p class="wd-hint">${spec.note}</p>` : ''}<div class="wd-out-col" role="status" aria-live="polite"></div></div>`;
  const out = $(h, '.wd-out-col');
  const go = () => {
    const raw = {}; spec.fields.forEach((d) => { raw[d.key] = $(h, `[data-k="${d.key}"]`).value; });
    const num = (k) => { const t = String(raw[k]).trim().replace(/,/g, ''); if (!t) return null; const x = Number(t); return Number.isFinite(x) ? x : NaN; };
    try { out.innerHTML = spec.run({ raw, num }); } catch (e) { out.innerHTML = warn('Check the numbers and try again.'); }
  };
  h.oninput = go; h.onchange = go; go();
  return { go, out };
}
// Several forms behind one drop-down.
function modes(h, list, labelText = 'What do you want to do?') {
  h.innerHTML = `<div class="wd-body">${field(labelText, `<select data-mode>${list.map(([id, l]) => `<option value="${id}">${l}</option>`).join('')}</select>`)}<div data-box></div></div>`;
  const box = $(h, '[data-box]'), sel = $(h, '[data-mode]');
  const draw = () => { const m = list.find(([id]) => id === sel.value); box.innerHTML = ''; const holder = document.createElement('div'); box.append(holder); form(holder, m[2]); };
  sel.addEventListener('change', (e) => { e.stopPropagation(); draw(); }); draw();
}
const table = (head, rows) => `<div class="wd-scroll"><table class="wd-tbl"><thead><tr>${head.map((x) => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((x) => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

/* ======================= MODULE 7: thermochemistry and equilibrium ======================= */

function heatq(h) {
  const spec = {
    top: field('Substance (fills in c)', `<select data-sub><option value="">Choose, or type your own c</option>${SPECIFIC_HEAT.map(([n, c]) => `<option value="${c}">${n}: ${c}</option>`).join('')}</select>`),
    fields: [f('q', 'Heat q (J)', ''), f('m', 'Mass m (g)', '50.0'), f('c', 'Specific heat c (J/g\u00b7\u00b0C)', '4.184'), f('dT', '\u0394T (\u00b0C)', '20.0'), f('Ti', 'Start T (\u00b0C, optional)', ''), f('Tf', 'End T (\u00b0C, optional)', '')],
    note: 'q = m \u00d7 c \u00d7 \u0394T. Leave the box you want to find empty. You can give \u0394T directly, or the start and end temperatures. Positive q means heat absorbed, negative means heat released.',
    run: ({ raw, num }) => {
      const q = num('q'), m = num('m'), c = num('c'), Ti = num('Ti'), Tf = num('Tf'); let dT = num('dT');
      if ([q, m, c, dT, Ti, Tf].some(Number.isNaN)) return warn('Enter numbers only.');
      if (dT === null && Ti !== null && Tf !== null) dT = Tf - Ti;
      const r = solveHeat({ q, m, c, dT }); if (r.error) return warn(r.error);
      const n = nsf(raw, ['q', 'm', 'c', 'dT'], 3), v = S(r.value, n), rq = raw.q.trim(), rm = raw.m.trim(), rc = raw.c.trim(), rd = raw.dT.trim() || String(dT), eqn = { q: `q = m \u00d7 c \u00d7 \u0394T = ${rm} g \u00d7 ${rc} J/(g\u00b7\u00b0C) \u00d7 ${rd} \u00b0C`, m: `m = q \u00f7 (c \u00d7 \u0394T) = ${rq} J \u00f7 (${rc} \u00d7 ${rd})`, c: `c = q \u00f7 (m \u00d7 \u0394T) = ${rq} J \u00f7 (${rm} g \u00d7 ${rd} \u00b0C)`, dT: `\u0394T = q \u00f7 (m \u00d7 c) = ${rq} J \u00f7 (${rm} g \u00d7 ${rc})` }[r.unknown];
      const unit = { q: 'J', m: 'g', c: 'J/(g\u00b7\u00b0C)', dT: '\u00b0C' }[r.unknown];
      return `<p>${eqn} = <strong class="wd-num">${v} ${unit}</strong></p>${r.unknown === 'q' ? `<p>${S(r.value / 1000, n)} kJ. ${r.value >= 0 ? 'Heat is absorbed (the temperature rises).' : 'Heat is released (the temperature falls).'}</p>` : ''}${r.unknown === 'dT' && Ti !== null ? `<p>Final temperature = ${Ti} + ${S(r.value, n)} = ${S(Ti + r.value, n)} \u00b0C.</p>` : ''}`;
    },
  };
  form(h, spec);
  $(h, '[data-sub]').addEventListener('change', (e) => { if (e.target.value) { $(h, '[data-k="c"]').value = e.target.value; $(h, '[data-k="c"]').dispatchEvent(new Event('input', { bubbles: true })); } });
}

function calorimetry(h) {
  const q = (x, n) => `${S(x, n)} J`;
  modes(h, [
    ['cup', 'Coffee-cup (solution) calorimeter: find \u0394H', {
      fields: [f('m', 'Mass of solution (g)', '100.0'), f('c', 'Specific heat of solution (J/g\u00b7\u00b0C)', '4.184'), f('dT', '\u0394T = T final \u2212 T initial (\u00b0C)', '6.5'), f('C', 'Calorimeter constant (J/\u00b0C, 0 if ignored)', '0'), f('n', 'Moles of reactant', '0.0500')],
      note: 'Assumes no heat escapes. The heat absorbed by the solution (and calorimeter) equals the heat released by the reaction: q(reaction) = \u2212(m c \u0394T + C \u0394T).',
      run: ({ raw, num }) => { const r = calorimeter({ massSol: num('m'), cSol: num('c'), dT: num('dT'), Ccal: num('C') ?? 0, moles: num('n') }); if (r.error) return warn(r.error); const n = nsf(raw, ['m', 'c', 'dT', 'n']); return `<dl class="wd-grid"><div><dt>Heat absorbed by solution</dt><dd>${q(r.qSol, n)}</dd></div><div><dt>Heat absorbed by calorimeter</dt><dd>${q(r.qCal, n)}</dd></div><div><dt>q of the reaction</dt><dd>${q(r.qRxn, n)}</dd></div>${r.dHperMol !== undefined ? `<div><dt>\u0394H per mole</dt><dd>${S(r.dHperMol, n)} kJ/mol</dd></div>` : ''}</dl><p><strong>${r.exothermic ? 'The reaction is exothermic: the solution got warmer and \u0394H is negative.' : 'The reaction is endothermic: the solution got cooler and \u0394H is positive.'}</strong></p>`; },
    }],
    ['bomb', 'Bomb calorimeter (constant volume)', {
      fields: [f('C', 'Calorimeter heat capacity (J/\u00b0C)', '10450'), f('dT', '\u0394T (\u00b0C)', '2.45'), f('n', 'Moles of sample burned', '0.0100')],
      note: 'q(reaction) = \u2212C \u00d7 \u0394T. A bomb calorimeter measures the heat at constant volume (\u0394E), which is close to \u0394H for reactions with little change in gas moles.',
      run: ({ raw, num }) => { const r = calorimeter({ massSol: 0, dT: num('dT'), Ccal: num('C'), moles: num('n') }); if (r.error) return warn(r.error); const n = nsf(raw, ['C', 'dT', 'n']); return `<p>q = \u2212${raw.C} J/\u00b0C \u00d7 ${raw.dT} \u00b0C = <strong class="wd-num">${q(r.qRxn, n)}</strong></p>${r.dHperMol !== undefined ? `<p>Per mole: <strong>${S(r.dHperMol, n)} kJ/mol</strong> (${r.exothermic ? 'exothermic' : 'endothermic'}).</p>` : ''}`; },
    }],
    ['mix', 'Mixing a hot and a cool object: find the final temperature or a specific heat', {
      fields: [f('m1', 'Object 1 mass (g)', '100.0'), f('c1', 'Object 1 c (J/g\u00b7\u00b0C)', '4.184'), f('T1', 'Object 1 start T (\u00b0C)', '22.0'), f('m2', 'Object 2 mass (g)', '50.0'), f('c2', 'Object 2 c (leave empty to find it)', ''), f('T2', 'Object 2 start T (\u00b0C)', '100.0'), f('Tf', 'Final T (\u00b0C, empty to find it)', '24.0')],
      note: 'Heat lost by the hot object equals heat gained by the cool one: m\u2081c\u2081(T\u1da0 \u2212 T\u2081) + m\u2082c\u2082(T\u1da0 \u2212 T\u2082) = 0.',
      run: ({ raw, num }) => { const v = Object.fromEntries(['m1', 'c1', 'T1', 'm2', 'c2', 'T2', 'Tf'].map((k) => [k, num(k)])); if (Object.values(v).some(Number.isNaN)) return warn('Enter numbers only.'); const r = mixing(v); if (r.error) return warn(r.error); const n = nsf(raw, ['m1', 'c1', 'm2', 'c2'].filter((k) => raw[k].trim())); return r.unknown === 'Tf' ? `<p>T<sub>final</sub> = (m\u2081c\u2081T\u2081 + m\u2082c\u2082T\u2082) \u00f7 (m\u2081c\u2081 + m\u2082c\u2082) = <strong class="wd-num">${S(r.value, n)} \u00b0C</strong></p>` : `<p>c\u2082 = \u2212m\u2081c\u2081(T\u1da0 \u2212 T\u2081) \u00f7 [m\u2082(T\u1da0 \u2212 T\u2082)] = <strong class="wd-num">${S(r.value, n)} J/(g\u00b7\u00b0C)</strong></p><p>Compare with the table of specific heats to identify the material.</p>`; },
    }],
  ]);
}

function heatcurve(h) {
  const P = [['', 'Decide from the temperature'], ['ice', 'Ice'], ['liquid', 'Liquid water'], ['steam', 'Steam']];
  form(h, {
    fields: [f('m', 'Mass of water (g)', '10.0'), f('T1', 'Start T (\u00b0C)', '-10'), f('T2', 'End T (\u00b0C)', '110'), f('p1', 'Start state', '', { type: 'select', options: P }), f('p2', 'End state', '', { type: 'select', options: P })],
    note: 'Uses c(ice) = 2.09, c(water) = 4.184, c(steam) = 2.01 J/g\u00b7\u00b0C, \u0394H(melting) = 334 J/g and \u0394H(boiling) = 2260 J/g. Set the state when the temperature is exactly 0 or 100 \u00b0C.',
    run: ({ raw, num }) => {
      const m = num('m'), T1 = num('T1'), T2 = num('T2'); if ([m, T1, T2].some((x) => x === null || Number.isNaN(x))) return warn('Enter the mass and both temperatures.');
      const r = heatingCurve(m, T1, T2, raw.p1 || undefined, raw.p2 || undefined), n = nsf(raw, ['m']);
      return `${table(['Step', 'Working', 'Heat (kJ)'], r.steps.map((s) => [s.label, `${s.formula} J`, S(s.q / 1000, n)]))}<p><strong>Total: ${S(r.total / 1000, n)} kJ ${r.released ? 'released (the water is cooling)' : 'absorbed'}.</strong></p><p class="wd-hint">Each warming step is q = m c \u0394T; each change of state is q = m \u00d7 \u0394H (the temperature stays constant).</p>`;
    },
  });
}

/* ---- Hess's law ---- */
const fmtCoef = (c) => { if (Math.abs(c - Math.round(c)) < 1e-9) return Math.round(c) === 1 ? '' : String(Math.round(c)); for (const d of [2, 3, 4]) if (Math.abs(c * d - Math.round(c * d)) < 1e-9) return `${Math.round(c * d)}/${d}`; return String(+c.toFixed(3)); };
function transform(text, m) {
  const eq = parseEq(text), arr = eq.reversible ? '\u21cc' : '\u2192', side = (l) => l.map((x) => `${fmtCoef(x.coef * Math.abs(m))}${x.species}`).join(' + ');
  return m < 0 ? `${side(eq.right)} ${arr} ${side(eq.left)}` : `${side(eq.left)} ${arr} ${side(eq.right)}`;
}
const pretty = (t) => t.replace(/([A-Za-z)])(\d+)/g, '$1<sub>$2</sub>');
const HESS_EX = { co: ['C(s) + 1/2O2(g) -> CO(g)', [['C(s) + O2(g) -> CO2(g)', '-393.5'], ['CO(g) + 1/2O2(g) -> CO2(g)', '-283.0'], ['', '']]], no2: ['N2(g) + 2O2(g) -> 2NO2(g)', [['N2(g) + O2(g) -> 2NO(g)', '180.6'], ['2NO(g) + O2(g) -> 2NO2(g)', '-114.2'], ['', '']]], dia: ['C(graphite) -> C(diamond)', [['C(graphite) + O2(g) -> CO2(g)', '-393.5'], ['C(diamond) + O2(g) -> CO2(g)', '-395.4'], ['', '']]] };
function hessTool(h) {
  h.innerHTML = `<div class="wd-body">${field('Example', '<select data-ex><option value="">Choose an example</option><option value="co">C \u2192 CO from two combustions</option><option value="no2">N\u2082 + O\u2082 \u2192 NO\u2082</option><option value="dia">graphite \u2192 diamond</option></select>')}
    ${field('Target reaction (the one you want \u0394H for)', '<input type="text" data-t autocomplete="off" spellcheck="false">', true)}
    <p class="wd-label">Given reactions and their \u0394H (kJ)</p><div data-rows></div>
    <div><button type="button" class="btn btn-ghost btn-sm" data-add>Add another reaction</button></div>
    <p class="wd-hint">Write equations like C(s) + O2(g) -> CO2(g) with a space on each side of every +. Include the state of every substance.</p>
    <div class="wd-out-col" role="status" aria-live="polite"></div></div>`;
  const rows = $(h, '[data-rows]'), out = $(h, '.wd-out-col');
  const addRow = (eq = '', dh = '') => { const d = document.createElement('div'); d.className = 'wd-hrow'; d.innerHTML = `<input type="text" data-e value="${eq}" aria-label="Given reaction" autocomplete="off" spellcheck="false"><input type="text" inputmode="decimal" data-d value="${dh}" aria-label="Enthalpy change in kilojoules" autocomplete="off">`; rows.append(d); };
  const load = (k) => { const [t, g] = HESS_EX[k]; $(h, '[data-t]').value = t; rows.innerHTML = ''; g.forEach(([e, d]) => addRow(e, d)); go(); };
  const go = () => {
    const target = $(h, '[data-t]').value, givens = [...rows.children].map((r) => ({ text: $(r, '[data-e]').value, dH: Number($(r, '[data-d]').value.replace(',', '.')), raw: $(r, '[data-d]').value })).filter((g) => g.text.trim());
    if (!target.trim() || !givens.length) { out.innerHTML = '<p>Enter the target reaction and the reactions you are given.</p>'; return; }
    if (givens.some((g) => !Number.isFinite(g.dH) || !g.raw.trim())) { out.innerHTML = warn('Give a number for every \u0394H.'); return; }
    const r = hess(target, givens);
    if (!r.ok) { out.innerHTML = warn(r.error); return; }
    const n = nsf({ a: givens.map((g) => g.raw).join(' ') && givens[0].raw }, ['a'], 4);
    const used = givens.map((g, i) => ({ ...g, m: r.mult[i] })).filter((g) => g.m !== 0);
    out.innerHTML = `<p class="wd-label">Use each given reaction like this</p>${table(['Given reaction', 'Do this', 'Becomes', '\u0394H (kJ)'], used.map((g) => [pretty(g.text), g.m === 1 ? 'keep as is' : g.m === -1 ? 'reverse it' : g.m < 0 ? `reverse it and \u00d7 ${fmtCoef(Math.abs(g.m))}` : `multiply by ${fmtCoef(g.m)}`, pretty(transform(g.text, g.m)), S(g.m * g.dH, n)]))}<p>Add them up and the intermediates cancel, leaving ${pretty(transform(target, 1))}.</p><p><strong>\u0394H = ${used.map((g) => S(g.m * g.dH, n)).join(' + ').replace(/\+ -/g, '\u2212 ')} = <span class="wd-num">${S(r.dH, n)} kJ</span></strong> (${r.dH < 0 ? 'exothermic' : 'endothermic'}).</p>${r.unique ? '' : '<p class="wd-hint">More than one combination works; this one is shown.</p>'}`;
  };
  $(h, '[data-ex]').addEventListener('change', (e) => { if (e.target.value) load(e.target.value); });
  $(h, '[data-add]').addEventListener('click', () => addRow());
  h.oninput = go; load('co');
}

function enthalpyf(h) {
  form(h, {
    fields: [f('eq', 'Balanced equation', 'CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)', { type: 'text', wide: true }), f('extra', 'Extra \u0394Hf values in kJ/mol (optional), like X(g)=-100, Y(s)=25', '', { type: 'text', wide: true })],
    note: '\u0394H\u00b0 = \u03a3 n\u0394Hf\u00b0(products) \u2212 \u03a3 n\u0394Hf\u00b0(reactants). Elements in their standard state have \u0394Hf\u00b0 = 0. Write the state of every substance, such as (g), (l) or (s). Table values are typical textbook values and may differ slightly from yours: use the extra box to override one.',
    run: ({ raw }) => {
      const ov = {}; String(raw.extra).split(',').forEach((p) => { const m = p.trim().match(/^(.+?)\s*=\s*(-?[\d.]+)$/); if (m) ov[m[1].replace(/\s/g, '')] = Number(m[2]); });
      const r = reactionEnthalpy(raw.eq, ov); if (!r.ok && !r.terms) return warn(r.error);
      const kj = (x) => String(+x.toFixed(2)).replace('-', '\u2212'), rows = r.terms.map((t) => [pretty(t.species), t.side, t.coef, t.hf === undefined ? '?' : kj(t.hf), t.hf === undefined ? '?' : kj(t.coef * t.hf)]);
      if (!r.ok) return `${table(['Substance', 'Side', 'n', '\u0394Hf\u00b0 (kJ/mol)', 'n \u00d7 \u0394Hf\u00b0'], rows)}${warn(r.error)}`;
      return `${table(['Substance', 'Side', 'n', '\u0394Hf\u00b0 (kJ/mol)', 'n \u00d7 \u0394Hf\u00b0'], rows)}<p>\u03a3 products = ${kj(r.products)} kJ, \u03a3 reactants = ${kj(r.reactants)} kJ</p><p><strong>\u0394H\u00b0 = (${kj(r.products)}) \u2212 (${kj(r.reactants)}) = <span class="wd-num">${kj(r.dH)} kJ</span></strong> (${r.dH < 0 ? 'exothermic' : 'endothermic'}) for the equation as written.</p>`;
    },
  });
}

function gibbsTool(h) {
  form(h, {
    fields: [f('dH', '\u0394H (kJ)', '-92.2'), f('dS', '\u0394S (J/K)', '-198.7'), f('T', 'Temperature T (K)', '298')],
    note: '\u0394G = \u0394H \u2212 T\u0394S (watch the units: \u0394S is in J/K, so divide by 1000). \u0394G < 0 means spontaneous. K = e^(\u2212\u0394G/RT).',
    run: ({ raw, num }) => {
      const dH = num('dH'), dS = num('dS'), T = num('T'); if ([dH, dS, T].some((x) => x === null || Number.isNaN(x))) return warn('Enter \u0394H, \u0394S and T.');
      const g = gibbs({ dH, dS, T }), n = nsf(raw, ['dH', 'dS']), K = KfromDG(g.dG, T);
      return `<p>\u0394G = ${raw.dH} \u2212 (${raw.T} \u00d7 ${raw.dS} \u00f7 1000) = <strong class="wd-num">${S(g.dG, n)} kJ</strong></p><p><strong>${g.atEquilibrium ? 'At equilibrium (\u0394G = 0).' : g.spontaneous ? 'Spontaneous at this temperature.' : 'Not spontaneous at this temperature.'}</strong> ${g.kind}</p>${g.crossover ? `<p>Temperature where \u0394G = 0: T = \u0394H \u00f7 \u0394S = ${S(g.crossover, n)} K (${S(g.crossover - 273.15, n)} \u00b0C).</p>` : ''}<p>K = e<sup>\u2212\u0394G/RT</sup> = e<sup>\u2212(${S(g.dG * 1000, n)})/(${R_J} \u00d7 ${T})</sup> = <strong>${S(K, n)}</strong> ${K > 1 ? '(products favored)' : '(reactants favored)'}</p>`;
    },
  });
}

/* ---- equilibrium: tools that build a box for each species ---- */
const inKind = (rx, kind) => rx.names.filter((n) => (kind === 'p' ? rx.state[n] === 'g' : rx.state[n] !== 's' && rx.state[n] !== 'l'));
function dynamic(h, { eq, top, extra, boxesLabel, run, kindDefault = 'c', modeList }) {
  h.innerHTML = `<div class="wd-body"><div class="wd-row">${field('Equation (use <=> and write states)', `<input type="text" value="${eq}" data-eq autocomplete="off" spellcheck="false">`, true)}
    ${field('Constant', `<select data-kind><option value="c"${kindDefault === 'c' ? ' selected' : ''}>K\u1d9c (concentrations)</option><option value="p"${kindDefault === 'p' ? ' selected' : ''}>K\u209a (pressures)</option></select>`)}
    ${modeList ? field('Mode', `<select data-mode>${modeList.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select>`) : ''}</div>
    <p class="wd-label" data-lab>${boxesLabel}</p><div class="wd-row" data-boxes></div><div class="wd-row" data-extra></div>
    <div class="wd-out-col" role="status" aria-live="polite"></div></div>`;
  const out = $(h, '.wd-out-col'), boxes = $(h, '[data-boxes]'), ex = $(h, '[data-extra]');
  let sig = '', vals = {}, exVals = {};
  const rxOf = () => reaction($(h, '[data-eq]').value);
  const rebuild = () => {
    const rx = rxOf(), kind = $(h, '[data-kind]').value, mode = $(h, '[data-mode]')?.value;
    if (!rx) { boxes.innerHTML = ''; ex.innerHTML = ''; sig = ''; return null; }
    const names = inKind(rx, kind), s = `${names.join()}|${kind}|${mode}`;
    if (s !== sig) {
      boxes.querySelectorAll('input').forEach((i) => { vals[i.dataset.n] = i.value; }); ex.querySelectorAll('input,select').forEach((i) => { exVals[i.dataset.k] = i.value; });
      boxes.innerHTML = names.map((n) => field(`${sub(n)} (${kind === 'p' ? 'atm' : 'M'})`, `<input type="text" inputmode="decimal" data-n="${n}" value="${vals[n] ?? (top?.defaults?.[n] ?? '')}" autocomplete="off">`)).join('');
      ex.innerHTML = extra({ rx, kind, mode, names, vals: exVals });
      sig = s;
    }
    return rx;
  };
  const go = () => {
    const rx = rebuild(); if (!rx) { out.innerHTML = warn('Write the reaction like N2(g) + 3H2(g) <=> 2NH3(g).'); return; }
    const kind = $(h, '[data-kind]').value, mode = $(h, '[data-mode]')?.value, amounts = {}, raw = {};
    boxes.querySelectorAll('input').forEach((i) => { const t = i.value.trim(); amounts[i.dataset.n] = t === '' ? null : Number(t); raw[i.dataset.n] = t; });
    const e = {}; ex.querySelectorAll('input,select').forEach((i) => { e[i.dataset.k] = i.value; });
    try { out.innerHTML = run({ rx, kind, mode, amounts, raw, e, expr: expression(rx, kind) }); } catch (err) { out.innerHTML = warn('Check the numbers and the equation.'); }
  };
  h.oninput = go; h.onchange = go; go();
}

function kq(h) {
  dynamic(h, {
    eq: 'N2(g) + 3H2(g) <=> 2NH3(g)', boxesLabel: 'Amounts of each substance (leave out solids and liquids)',
    modeList: [['K', 'Find K from equilibrium amounts'], ['Q', 'Compare Q with K (which way does it shift?)'], ['conv', 'Convert between Kp and Kc']],
    top: { defaults: { N2: '0.50', H2: '0.50', NH3: '0.10' } },
    extra: ({ mode, vals }) => (mode === 'Q' ? field('K (the equilibrium constant)', `<input type="text" inputmode="decimal" data-k="K" value="${vals.K ?? '0.50'}">`) : mode === 'conv' ? field('Known K', `<input type="text" inputmode="decimal" data-k="K" value="${vals.K ?? '0.0500'}">`) + field('Temperature (K)', `<input type="text" inputmode="decimal" data-k="T" value="${vals.T ?? '700'}">`) + field('Convert', `<select data-k="dir"><option value="kc2kp">K\u1d9c \u2192 K\u209a</option><option value="kp2kc">K\u209a \u2192 K\u1d9c</option></select>`) : ''),
    run: ({ rx, kind, mode, amounts, raw, e, expr }) => {
      const head = `<p>${expr.html}</p>`;
      if (mode === 'conv') {
        const K = Number(e.K), T = Number(e.T), dn = gasMoles(rx); if (!(K > 0) || !(T > 0)) return head + warn('Give K and T as positive numbers.');
        const r = e.dir === 'kc2kp' ? KpFromKc(K, T, dn) : KcFromKp(K, T, dn), n = nsf({ K: e.K }, ['K']);
        return `${head}<p>\u0394n (moles of gas, products \u2212 reactants) = ${dn}</p><p>K<sub>p</sub> = K<sub>c</sub>(RT)<sup>\u0394n</sup>, with R = 0.08206 L\u00b7atm/(mol\u00b7K)</p><p><strong>${e.dir === 'kc2kp' ? 'K<sub>p</sub>' : 'K<sub>c</sub>'} = <span class="wd-num">${S(r, n)}</span></strong>${dn === 0 ? ' (\u0394n = 0, so K<sub>p</sub> = K<sub>c</sub>)' : ''}</p>`;
      }
      const names = inKind(rx, kind), missing = names.filter((n) => amounts[n] === null || Number.isNaN(amounts[n]) || amounts[n] < 0);
      if (missing.length) return head + warn(`Enter a number (zero or more) for ${missing.map(sub).join(', ')}.`);
      const lowest = Math.min(...[...rx.items.filter((x) => x.nu < 0).map((x) => x.name)].map((nm) => (names.includes(nm) ? amounts[nm] : Infinity)));
      const val = quotient(rx, amounts, kind), n = nsf(raw, names.filter((x) => raw[x]));
      if (!Number.isFinite(val)) return head + warn('Q cannot be calculated: a reactant amount is zero.');
      void lowest;
      const sym = mode === 'K' ? `K<sub>${kind}</sub>` : 'Q';
      const sub1 = `${sym} = ${expr.html.split('=')[1].trim().replace(/\[([^\]]+)\]/g, (_, nm) => `(${raw[nm.replace(/<[^>]+>/g, '')] ?? ''})`)}`;
      void sub1;
      let msg = `<p><strong>${sym} = <span class="wd-num">${S(val, n)}</span></strong></p>`;
      if (mode === 'Q') {
        const K = Number(e.K); if (!(K > 0)) return head + msg + warn('Give K as a positive number.');
        const d = val < K * 0.9999 ? 'right' : val > K * 1.0001 ? 'left' : 'none';
        msg += `<p>Q ${d === 'right' ? '<' : d === 'left' ? '>' : '='} K, so ${d === 'none' ? '<strong>the system is at equilibrium</strong>.' : `<strong>the reaction proceeds ${d === 'right' ? 'to the right: products form' : 'to the left: reactants form'}</strong> until Q = K.`}</p>`;
      }
      return head + msg + `<p class="wd-hint">Solids and pure liquids are left out of the expression. ${mode === 'K' ? 'Use amounts measured at equilibrium.' : ''}</p>`;
    },
  });
}

function iceTool(h) {
  dynamic(h, {
    eq: 'H2(g) + I2(g) <=> 2HI(g)', boxesLabel: 'Initial amounts (leave a box empty if it is zero)',
    modeList: [['find', 'Find the equilibrium amounts from K'], ['findK', 'Find K from one equilibrium amount']],
    top: { defaults: { H2: '0.500', I2: '0.500' } },
    extra: ({ mode, names, vals }) => (mode === 'find' ? field('K', `<input type="text" inputmode="decimal" data-k="K" value="${vals.K ?? '54.3'}">`) : field('Substance measured at equilibrium', `<select data-k="sp">${names.map((n) => `<option value="${n}"${vals.sp === n ? ' selected' : ''}>${n}</option>`).join('')}</select>`) + field('Its equilibrium amount', `<input type="text" inputmode="decimal" data-k="val" value="${vals.val ?? '0.100'}">`)),
    run: ({ rx, kind, mode, amounts, raw, e, expr }) => {
      const names = inKind(rx, kind), init = Object.fromEntries(names.map((n) => [n, amounts[n] ?? 0]));
      if (names.some((n) => Number.isNaN(init[n]) || init[n] < 0)) return warn('Initial amounts must be numbers, zero or more.');
      const n = nsf(raw, names.filter((x) => raw[x]), 3);
      let K, ice;
      if (mode === 'find') { K = Number(e.K); ice = solveICE(rx, init, K, kind); }
      else {
        const nu = rx.nu[e.sp], val = Number(e.val), x = (val - init[e.sp]) / nu; if (!Number.isFinite(x)) return warn('Check the equilibrium amount.');
        const eqv = Object.fromEntries(names.map((nm) => [nm, init[nm] + rx.nu[nm] * x]));
        if (names.some((nm) => eqv[nm] < -1e-12)) return warn('That equilibrium amount is not possible with these starting amounts.');
        K = quotient(rx, eqv, kind); ice = { ok: true, x, rows: names.map((nm) => ({ name: nm, initial: init[nm], change: rx.nu[nm] * x, equilibrium: eqv[nm], nu: rx.nu[nm] })), Q: K };
      }
      if (!ice.ok) return `<p>${expr.html}</p>${warn(ice.error)}`;
      const fmt = (v) => S(v, n);
      return `<p>${expr.html}</p>${table(['', ...ice.rows.map((r) => sub(r.name))], [['Initial', ...ice.rows.map((r) => fmt(r.initial))], ['Change', ...ice.rows.map((r) => `${r.nu > 0 ? '+' : '\u2212'}${Math.abs(r.nu) === 1 ? '' : Math.abs(r.nu)}x`)], ['Equilibrium', ...ice.rows.map((r) => `<strong>${fmt(r.equilibrium)}</strong>`)]])}<p>${mode === 'find' ? `Solving K<sub>${kind}</sub> = ${expr.html.split('=')[1].trim()} = ${S(K, n)} for x gives <strong>x = ${S(ice.x, n)}</strong>.` : `From the measured amount, x = ${S(ice.x, n)}, which gives the changes shown.`}</p>${mode === 'find' ? `<p>Check: Q at equilibrium = ${S(ice.Q, n)}, equal to K.</p>` : `<p><strong>K<sub>${kind}</sub> = <span class="wd-num">${S(K, n)}</span></strong></p>`}<p class="wd-hint">x is solved exactly (no small-x approximation).</p>`;
    },
  });
}

function lechat(h) {
  h.innerHTML = `<div class="wd-body"><div class="wd-row">${field('Equation', '<input type="text" value="N2(g) + 3H2(g) <=> 2NH3(g)" data-eq autocomplete="off" spellcheck="false">', true)}
    ${field('\u0394H of the forward reaction', '<select data-dh><option value="-1">Negative (exothermic)</option><option value="1">Positive (endothermic)</option></select>')}
    ${field('Stress applied', '<select data-ch><option value="add">Add a substance</option><option value="remove">Remove a substance</option><option value="vdown">Decrease the volume (raise the pressure)</option><option value="vup">Increase the volume (lower the pressure)</option><option value="tup">Raise the temperature</option><option value="tdown">Lower the temperature</option><option value="cat">Add a catalyst</option><option value="inert">Add an inert gas (constant volume)</option></select>')}
    ${field('Substance', '<select data-sp></select>')}</div><div class="wd-out-col" role="status" aria-live="polite"></div></div>`;
  const out = $(h, '.wd-out-col'), spSel = $(h, '[data-sp]');
  let sig = '';
  const go = () => {
    const rx = reaction($(h, '[data-eq]').value); if (!rx) { out.innerHTML = warn('Write the reaction like N2(g) + 3H2(g) <=> 2NH3(g).'); return; }
    const s = rx.names.join(); if (s !== sig) { spSel.innerHTML = rx.names.map((n) => `<option value="${n}">${n}</option>`).join(''); sig = s; }
    const c = $(h, '[data-ch]').value, dH = +$(h, '[data-dh]').value;
    const ch = { add: { type: 'add', species: spSel.value }, remove: { type: 'remove', species: spSel.value }, vdown: { type: 'volume', direction: 'decrease' }, vup: { type: 'volume', direction: 'increase' }, tup: { type: 'temperature', direction: 'increase', dH }, tdown: { type: 'temperature', direction: 'decrease', dH }, cat: { type: 'catalyst' }, inert: { type: 'inert' } }[c];
    const r = leChatelier(rx, ch), reac = rx.names.filter((n) => rx.nu[n] < 0), prod = rx.names.filter((n) => rx.nu[n] > 0);
    const eff = r.shift === 'none' ? '' : `<p class="wd-label">Compared with the moment right after the change</p><p>${(r.shift === 'right' ? reac : prod).map((n) => `[${sub(n)}] falls`).join(', ')}; ${(r.shift === 'right' ? prod : reac).map((n) => `[${sub(n)}] rises`).join(', ')}.</p>`;
    out.innerHTML = `<p class="wd-big">${r.shift === 'none' ? 'No shift' : `Shifts ${r.shift === 'right' ? 'right' : 'left'} ${arrow(r.shift)}`}</p><p>${r.text}</p>${eff}`;
  };
  h.oninput = go; h.onchange = go; go();
}

/* ======================= MODULE 8: electrochemistry ======================= */

function oxnum(h) {
  form(h, {
    fields: [f('s', 'Species, separated by commas', 'MnO4-, Cr2O7 2-, H2O2, Fe3O4, NH4+, S2O3 2-', { type: 'text', wide: true })],
    note: 'Write charges like Fe3+, MnO4- or Cr2O7 2-. Rules used: elements are 0; O is \u22122 (peroxides \u22121); H is +1 (hydrides \u22121); group 1 is +1, group 2 is +2, F is \u22121; the numbers add up to the charge.',
    run: ({ raw }) => {
      const items = raw.s.split(',').map((x) => x.trim()).filter(Boolean), rows = [];
      for (const t of items) {
        const p = parseIon(t); if (!p) { rows.push([escape(t), warn('not understood'), '']); continue; }
        const on = oxidationNumbers(p);
        if (!on) { rows.push([sp(t), '<span class="wd-warn">cannot be decided automatically (write the ions separately)</span>', '']); continue; }
        const fmtN = (x) => (Number.isInteger(x) ? (x > 0 ? `+${x}` : x < 0 ? `\u2212${-x}` : '0') : `${x > 0 ? '+' : '\u2212'}${Math.abs(x).toFixed(2)} (average)`);
        rows.push([sp(t), Object.keys(p.counts).map((el) => `${el}: <strong>${fmtN(on[el])}</strong>`).join(', '), p.charge ? `charge ${p.charge > 0 ? '+' : '\u2212'}${Math.abs(p.charge)}` : 'neutral']);
      }
      return table(['Species', 'Oxidation numbers', ''], rows) + '<p class="wd-hint">An increase in oxidation number means oxidation (loss of electrons); a decrease means reduction (gain).</p>';
    },
  });
}
function escape(t) { return t.replace(/[<>&]/g, ''); }

function redoxbal(h) {
  const EX = [['MnO4- + Fe2+ -> Mn2+ + Fe3+', 'acidic'], ['Cr2O7 2- + I- -> Cr3+ + I2', 'acidic'], ['Cu + NO3- -> Cu2+ + NO', 'acidic'], ['MnO4- + I- -> MnO2 + I2', 'basic'], ['Cl2 -> Cl- + ClO-', 'basic'], ['MnO4- + C2O4 2- -> Mn2+ + CO2', 'acidic']];
  form(h, {
    top: field('Example', `<select data-ex><option value="">Choose an example</option>${EX.map(([e, m], i) => `<option value="${i}">${e.replace('->', '\u2192')} (${m})</option>`).join('')}</select>`),
    fields: [f('eq', 'Unbalanced equation (net ionic, a space on each side of every +)', EX[0][0], { type: 'text', wide: true }), f('med', 'Solution is', 'acidic', { type: 'select', options: [['acidic', 'Acidic'], ['basic', 'Basic']] })],
    note: 'Half-reaction method. Include only the species that change (spectator ions are left out) and do not add H\u2082O, H\u207a or OH\u207b: the tool adds them. Works when one species is oxidized and one is reduced.',
    run: ({ raw }) => {
      const r = balanceRedox(raw.eq, raw.med); if (!r.ok) return warn(r.error);
      const side = (list) => list.map((x) => `${x.coef > 1 ? x.coef : ''}${ion(x.sp.formula, x.sp.charge)}`).join(' + ');
      const half = (hf) => { const e = `${hf.e > 1 ? hf.e : ''}e\u207b`; return hf.kind === 'reduction' ? `${side(hf.left)} + ${e} \u2192 ${side(hf.right)}` : `${side(hf.left)} \u2192 ${side(hf.right)} + ${e}`; };
      const ch = (c) => `${c.e}: ${c.r.label.replace(/(\d+)/g, '$1')}`;
      void ch;
      const s = r.steps, on = (c) => { const e = c.e, a = r.on[c.r.label][e], b = r.on[c.p.label][e], f2 = (x) => (Number.isInteger(x) ? (x > 0 ? `+${x}` : x < 0 ? `\u2212${-x}` : '0') : x.toFixed(2)); return `${e} goes from ${f2(a)} to ${f2(b)}`; };
      return `<p class="wd-label">Balanced equation (${r.medium})</p><p class="wd-big">${side(r.left)} \u2192 ${side(r.right)}</p>
        <ol class="wd-steps"><li><strong>Oxidation numbers:</strong> ${on(r.oxidized)} (oxidized, loses electrons); ${on(r.reduced)} (reduced, gains electrons).</li>
        <li><strong>Oxidation half-reaction</strong> (balance atoms other than O and H, then O with H\u2082O, then H with H\u207a, then charge with e\u207b): ${half(s.ox)}</li>
        <li><strong>Reduction half-reaction:</strong> ${half(s.red)}</li>
        <li><strong>Equalize the electrons:</strong> multiply the oxidation half by ${s.mo} and the reduction half by ${s.mr} so that ${s.electrons} electrons are lost and gained.</li>
        <li><strong>Add the halves</strong> and cancel what appears on both sides (the electrons, and some H\u207a and H\u2082O).${r.g > 1 ? ` Divide everything by ${r.g}.` : ''}</li>
        ${r.medium === 'basic' ? `<li><strong>Basic solution:</strong> add ${s.hydroxide || 'the same number of'} OH\u207b to both sides for every H\u207a. Each H\u207a + OH\u207b becomes H\u2082O, and any H\u2082O on both sides cancels.</li>` : ''}
        <li><strong>Check:</strong> the atoms of every element and the total charge are the same on both sides.</li></ol>`;
    },
  });
  $(h, '[data-ex]').addEventListener('change', (e) => { if (e.target.value === '') return; const [eq, m] = EX[+e.target.value]; $(h, '[data-k="eq"]').value = eq; $(h, '[data-k="med"]').value = m; $(h, '[data-k="eq"]').dispatchEvent(new Event('input', { bubbles: true })); });
}

const potOptions = (sel) => POTENTIALS.map((p) => [p.id, `${p.label}  (${p.E >= 0 ? '+' : '\u2212'}${Math.abs(p.E).toFixed(2)} V)`]).map(([v, l]) => `<option value="${v}"${v === sel ? ' selected' : ''}>${l}</option>`).join('');
const halfCellText = (p, side) => { const sp0 = (side === 'ox' ? p.right : p.left).map(([n, c, st]) => ({ n, c, st })); return sp0; };
function cellNotation(c) {
  const hc = (p, anode) => { const red = p.right.find(([, , st]) => st === 's' || st === 'l' || st === 'g'), oxi = p.left.find(([, , st]) => st === 'aq'); const solid = anode ? p.right[0] : p.right[0]; void solid; const ionPart = anode ? p.left.filter(([, , st]) => st === 'aq').map(([n]) => sp(n)).join(', ') : p.left.filter(([, , st]) => st === 'aq').map(([n]) => sp(n)).join(', '); void red; void oxi; return ionPart; };
  const metal = (p) => { const m = p.right.find(([, , st]) => st === 's' || st === 'l'); return m ? `${sub(m[0])}(${m[2]})` : 'Pt(s)'; };
  const aq = (p, rev) => (rev ? p.right : p.left).filter(([, , st]) => st === 'aq' || st === 'g').map(([n]) => `${sp(n)}`).join(', ');
  void hc; void halfCellText;
  return `${metal(c.anode)} | ${[aq(c.anode, false), aq(c.anode, true)].filter(Boolean).join(', ') || '\u2014'} (1 M) || ${aq(c.cathode, false) || '\u2014'} (1 M) | ${metal(c.cathode)}`;
}
const netText = (species) => { const L = species.filter((x) => x.nu < 0), R = species.filter((x) => x.nu > 0); const t = (l) => l.map((x) => `${Math.abs(x.nu) > 1 ? Math.abs(x.nu) : ''}${sp(x.sp)}<small>(${x.st})</small>`).join(' + '); return `${t(L)} \u2192 ${t(R)}`; };

function cellpot(h) {
  form(h, {
    fields: [f('a', 'Half-reaction 1', 'Zn', { type: 'select', options: POTENTIALS.map((p) => [p.id, `${p.label}  (${p.E >= 0 ? '+' : '\u2212'}${Math.abs(p.E).toFixed(2)} V)`]) }), f('b', 'Half-reaction 2', 'Cu', { type: 'select', options: POTENTIALS.map((p) => [p.id, `${p.label}  (${p.E >= 0 ? '+' : '\u2212'}${Math.abs(p.E).toFixed(2)} V)`]) }), f('T', 'Temperature (K)', '298.15')],
    note: 'The half-reaction with the larger (more positive) E\u00b0 is the cathode (reduction). E\u00b0cell = E\u00b0cathode \u2212 E\u00b0anode. \u0394G\u00b0 = \u2212nFE\u00b0 and K = e^(nFE\u00b0/RT), with F = 96 485 C/mol and R = 8.314 J/(mol\u00b7K). Standard conditions: 1 M, 1 atm, 25 \u00b0C.',
    run: ({ raw, num }) => {
      const T = num('T') ?? 298.15, c = cell(raw.a, raw.b, T); if (!c.ok) return warn(c.error);
      return `<dl class="wd-grid"><div><dt>Cathode (reduction)</dt><dd>${c.cathode.label}</dd></div><div><dt>Anode (oxidation)</dt><dd>${c.anode.label.replace(/\u2192/, '\u2190')}</dd></div></dl>
        <p class="wd-label">Overall reaction (${c.n} electrons)</p><p class="wd-big">${netText(c.species)}</p>
        <p>E\u00b0cell = E\u00b0cathode \u2212 E\u00b0anode = ${c.cathode.E.toFixed(2)} \u2212 (${c.anode.E.toFixed(2)}) = <strong class="wd-num">${c.E0.toFixed(2)} V</strong></p>
        <p>\u0394G\u00b0 = \u2212nFE\u00b0 = \u2212(${c.n})(96485)(${c.E0.toFixed(2)}) \u00f7 1000 = <strong>${S(c.dG0, 3)} kJ</strong></p><p>K = e<sup>nFE\u00b0/RT</sup> = <strong>${S(c.K, 3)}</strong></p>
        <p><strong>${c.spontaneous ? 'E\u00b0 is positive: the reaction is spontaneous as a galvanic (voltaic) cell.' : 'E\u00b0 is negative: not spontaneous.'}</strong></p><p class="wd-hint">Cell notation: ${cellNotation(c)}</p>`;
    },
  });
}

function nernstTool(h) {
  h.innerHTML = `<div class="wd-body"><div class="wd-row">${field('Half-reaction 1', `<select data-a>${potOptions('Zn')}</select>`)}${field('Half-reaction 2', `<select data-b>${potOptions('Cu')}</select>`)}${field('Temperature (K)', '<input type="text" inputmode="decimal" value="298.15" data-T>')}</div>
    <p class="wd-label">Concentrations (M) and pressures (atm)</p><div class="wd-row" data-conc></div>
    <p class="wd-hint">E = E\u00b0 \u2212 (RT/nF) ln Q. Solids and liquids are left out of Q. Boxes left empty count as 1.</p><div class="wd-out-col" role="status" aria-live="polite"></div></div>`;
  const out = $(h, '.wd-out-col'), conc = $(h, '[data-conc]'), keep = {};
  let sig = '';
  const go = () => {
    const T = Number($(h, '[data-T]').value) || 298.15, c = cell($(h, '[data-a]').value, $(h, '[data-b]').value, T);
    if (!c.ok) { out.innerHTML = warn(c.error); return; }
    const aq = c.species.filter((x) => x.st === 'aq' || x.st === 'g'), s = aq.map((x) => x.sp).join();
    if (s !== sig) { conc.querySelectorAll('input').forEach((i) => { keep[i.dataset.sp] = i.value; }); conc.innerHTML = aq.map((x) => field(`${sp(x.sp)} (${x.st === 'g' ? 'atm' : 'M'})`, `<input type="text" inputmode="decimal" data-sp="${x.sp}" value="${keep[x.sp] ?? (x.sp === 'Zn2+' ? '0.010' : '1.0')}" autocomplete="off">`)).join(''); sig = s; }
    const amounts = {}; let bad = false; conc.querySelectorAll('input').forEach((i) => { const t = i.value.trim(), v = t === '' ? 1 : Number(t); if (!(v > 0)) bad = true; amounts[i.dataset.sp] = v; });
    if (bad) { out.innerHTML = warn('Concentrations must be positive numbers.'); return; }
    const Q = cellQ(c.species, amounts), E = nernst(c.E0, c.n, Q, T), n = 3;
    out.innerHTML = `<p class="wd-label">Overall reaction (${c.n} electrons)</p><p class="wd-big">${netText(c.species)}</p><p>E\u00b0 = ${c.E0.toFixed(2)} V, n = ${c.n}</p><p>Q = ${S(Q, n)}</p><p>E = ${c.E0.toFixed(2)} \u2212 (${R(T)} \u00d7 ${T}) \u00f7 (${c.n} \u00d7 96485) \u00d7 ln(${S(Q, n)}) = <strong class="wd-num">${S(E, n)} V</strong></p><p>\u0394G = \u2212nFE = <strong>${S((-c.n * 96485 * E) / 1000, n)} kJ</strong></p><p><strong>${E > 1e-6 ? 'The cell is spontaneous as written (E > 0).' : E < -1e-6 ? 'The reverse reaction is spontaneous (E < 0).' : 'The cell is at equilibrium (E = 0): it is a dead battery.'}</strong> ${E > c.E0 ? 'E is larger than E\u00b0 because Q < 1 (more reactant than product).' : E < c.E0 ? 'E is smaller than E\u00b0 because Q > 1 (more product than reactant).' : ''}</p>`;
  };
  h.oninput = go; h.onchange = go; go();
}
const R = () => '8.314';

function electrolysis(h) {
  const T = [['s', 'seconds'], ['min', 'minutes'], ['h', 'hours']];
  form(h, {
    fields: [f('sub', 'Substance deposited or released', 'Cu', { type: 'select', options: ELECTRODE.map((e) => [e.id, e.label]) }), f('I', 'Current I (A)', '2.50'), f('t', 'Time t', '30.0'), f('u', 'Time unit', 'min', { type: 'select', options: T }), f('mass', 'Mass (g)', ''), f('T', 'Gas temperature (K)', '273.15'), f('P', 'Gas pressure (atm)', '1.00')],
    note: 'mass = I \u00d7 t \u00d7 M \u00f7 (n \u00d7 F), with F = 96 485 C/mol and n the electrons per atom or molecule formed. Leave current, time or mass empty to find it. For gases the volume is worked out from the ideal gas law (default: STP).',
    run: ({ raw, num }) => {
      const e = ELECTRODE.find((x) => x.id === raw.sub), mult = { s: 1, min: 60, h: 3600 }[raw.u], I = num('I'), tt = num('t'), mass = num('mass');
      if ([I, tt, mass].some(Number.isNaN)) return warn('Enter numbers only.');
      const r = faraday({ I: I ?? NaN, t: tt === null ? NaN : tt * mult, mass: mass ?? NaN, n: e.n, M: e.M }); if (r.error) return warn(r.error);
      const n = nsf(raw, ['I', 't', 'mass'].filter((k) => raw[k].trim()), 3), tShown = r.t / mult;
      const find = r.unknown === 'mass' ? `${S(r.mass, n)} g` : r.unknown === 'I' ? `${S(r.I, n)} A` : `${S(tShown, n)} ${raw.u} (${S(r.t, n)} s)`;
      const gas = e.gas ? (() => { const Tk = Number(raw.T) || 273.15, P = Number(raw.P) || 1; return `<p>Volume of gas at ${Tk} K and ${P} atm: V = nRT/P = <strong>${S(gasVolume(r.molProduct, Tk, P), n)} L</strong></p>`; })() : '';
      return `<p>Charge Q = I \u00d7 t = ${S(r.I, n)} A \u00d7 ${S(r.t, n)} s = ${S(r.charge, n)} C</p><p>Moles of electrons = Q \u00f7 F = ${S(r.molElectrons, n)} mol</p><p>Moles of product = mol e\u207b \u00f7 ${e.n} = ${S(r.molProduct, n)} mol</p><p>Mass = mol \u00d7 ${e.M} g/mol = ${S(r.mass, n)} g</p>${gas}<p><strong>${r.unknown === 'mass' ? 'Mass' : r.unknown === 'I' ? 'Current needed' : 'Time needed'} = <span class="wd-num">${find}</span></strong></p>`;
    },
  });
}

export const SOLVER_WIDGETS = { heatq, calorimetry, heatcurve, hess: hessTool, enthalpyf, gibbs: gibbsTool, kq, ice: iceTool, lechat, oxnum, redoxbal, cellpot, nernst: nernstTool, electrolysis };
