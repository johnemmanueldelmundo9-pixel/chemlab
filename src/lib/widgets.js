// Interactive widgets used inside lessons and as the module's calculators/simulations.
// mountWidget(name, hostElement) fills the host and wires its events. All maths lives in ./chemistry/*.js.
import { ELEMENTS } from '../data/elements.js';
import { parseSig, roundSig, mulDiv, addSub } from './chemistry/sigfigs.js';
import { toScientific, fromScientific } from './chemistry/notation.js';
import { UNITS, factor } from './chemistry/units.js';
import { parseFormula, molarMass } from './chemistry/molarMass.js';
import { density, percentError, temperature } from './chemistry/measure.js';

const NA = 6.022e23;
const $ = (r, s) => r.querySelector(s);
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

/* ---------- formatting ---------- */
// 5780 -> "5.78 x 10^3" when toPrecision switches to exponent form.
export function sci(x, n = 4) {
  if (!isFinite(x)) return '\u2014';
  return expHtml(x.toPrecision(n));
}
const expHtml = (s) => { if (!s.includes('e')) return s; const [a, b] = s.split('e'); return `${a} \u00d7 10<sup>${+b}</sup>`; };
const trimNum = (x, d = 6) => String(Number(x.toPrecision(d)));
const kHtml = (k) => { const x = String(Number(k.toPrecision(6))); if (!x.includes('e')) return x; const [a, b] = x.split('e'); return (a === '1' ? '10' : `${a} \u00d7 10`) + `<sup>${+b}</sup>`; };
const field = (label, inner) => `<label class="wd-field">${label}${inner}</label>`;
const num = (v, attr = '') => `<input type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="${v}" ${attr}>`;
const sigHtml = (p) => [...p.mant].map((c, i) => (p.flags[i] ? `<mark>${c}</mark>` : c)).join('') + (p.exp !== null ? ` \u00d7 10<sup>${p.exp}</sup>` : '');

/* ---------- classify matter ---------- */
const ITEMS = [
  ['Gold (Au)', 'element', 'Gold is an element: it cannot be split into simpler substances.'],
  ['Water (H\u2082O)', 'compound', 'Two elements chemically united. Only a chemical reaction can split it.'],
  ['Salt dissolved in water', 'homogeneous', 'Uniform throughout, and evaporation (a physical method) recovers the salt.'],
  ['Sand and water', 'heterogeneous', 'You can see the sand: the composition is not uniform.'],
  ['Oxygen gas (O\u2082)', 'element', 'Made of one kind of atom only, even though the atoms are joined in pairs.'],
  ['Brass (copper + zinc)', 'homogeneous', 'An alloy is a uniform mixture of metals.'],
  ['Table sugar (C\u2081\u2082H\u2082\u2082O\u2081\u2081)', 'compound', 'Fixed composition of carbon, hydrogen and oxygen.'],
  ['Concrete', 'heterogeneous', 'Gravel, sand and cement stay visibly distinct.'],
  ['Air (filtered, no dust)', 'homogeneous', 'Gases mix evenly, and the parts can be separated physically (by cooling and distilling).'],
  ['Carbon dioxide (CO\u2082)', 'compound', 'Carbon and oxygen chemically united in a fixed ratio.'],
  ['Pizza', 'heterogeneous', 'Different parts with visibly different composition.'],
  ['Iron (Fe)', 'element', 'One kind of atom only.'],
];
const KINDS = [['element', 'Element'], ['compound', 'Compound'], ['homogeneous', 'Homogeneous mixture'], ['heterogeneous', 'Heterogeneous mixture']];

function classify(h) {
  let order = shuffle(ITEMS).slice(0, 8), i = 0, score = 0, answered = false;
  const draw = () => {
    if (i >= order.length) {
      h.innerHTML = `<div class="wd-body"><p class="wd-big">${score} of ${order.length} correct</p><p>${score >= 7 ? 'Excellent sorting.' : score >= 5 ? 'Good. Re-read the table and try again for a new set.' : 'Review the lesson table, then play again for a new set.'}</p><div><button type="button" class="btn btn-ghost btn-sm" data-r>Play again</button></div></div>`;
      return;
    }
    answered = false;
    h.innerHTML = `<div class="wd-body"><p class="wd-label">Item ${i + 1} of ${order.length}</p><p class="wd-big">${order[i][0]}</p>
      <div class="wd-btns">${KINDS.map(([k, l]) => `<button type="button" data-k="${k}">${l}</button>`).join('')}</div>
      <p class="wd-fb" role="status" aria-live="polite"></p></div>`;
  };
  h.onclick = (e) => {
    if (e.target.closest('[data-r]')) { order = shuffle(ITEMS).slice(0, 8); i = 0; score = 0; draw(); return; }
    if (e.target.closest('[data-n]')) { i++; draw(); return; }
    const b = e.target.closest('[data-k]');
    if (!b || answered) return;
    answered = true;
    const [, kind, why] = order[i], ok = b.dataset.k === kind;
    if (ok) score++;
    h.querySelectorAll('[data-k]').forEach((x) => { x.disabled = true; if (x.dataset.k === kind) x.classList.add('right'); });
    if (!ok) b.classList.add('wrong');
    $(h, '.wd-fb').innerHTML = `<strong>${ok ? 'Correct.' : 'Not quite.'}</strong> ${why} <button type="button" class="btn btn-primary btn-sm" data-n>${i === order.length - 1 ? 'See score' : 'Next'}</button>`;
  };
  draw();
}

/* ---------- significant figures: counter, rounder, operations ---------- */
function sigfigs(h) {
  h.innerHTML = `<div class="wd-body"><h3 class="wd-h">Count significant figures</h3>${field('Number', num('0.00250'))}
    <p class="wd-out" role="status" aria-live="polite"></p>
    <p class="wd-hint">Try 100, 100., 1.00e2, 1.008 or 0.0025. Highlighted digits are significant.</p></div>`;
  const inp = $(h, 'input'), out = $(h, '.wd-out');
  const run = () => {
    const p = parseSig(inp.value);
    out.innerHTML = p ? `<span class="wd-num">${sigHtml(p)}</span><strong>${p.n} significant figure${p.n === 1 ? '' : 's'}</strong>` : 'Enter a non-zero number.';
  };
  inp.addEventListener('input', run); run();
}

function rounder(h) {
  h.innerHTML = `<div class="wd-body"><h3 class="wd-h">Round to significant figures</h3><div class="wd-row">${field('Number', num('6.3849', 'data-x'))}
    ${field('Significant figures', `<select data-n>${[1, 2, 3, 4, 5, 6].map((n) => `<option ${n === 2 ? 'selected' : ''}>${n}</option>`).join('')}</select>`)}</div>
    <p class="wd-out" role="status" aria-live="polite"></p><p class="wd-hint"></p></div>`;
  const x = $(h, '[data-x]'), n = $(h, '[data-n]');
  const run = () => {
    const v = parseFloat(x.value);
    if (isNaN(v) || v === 0) { $(h, '.wd-out').textContent = 'Enter a non-zero number.'; $(h, '.wd-hint').textContent = ''; return; }
    const r = roundSig(v, +n.value);
    $(h, '.wd-out').innerHTML = `${x.value.trim()} \u2192 <strong class="wd-num">${expHtml(r.text)}</strong>`;
    const all = String(Math.abs(v)).replace(/^0\.0*|\./g, ''), d = all[+n.value];
    $(h, '.wd-hint').textContent = d ? `The first digit dropped is ${d}: ${+d >= 5 ? 'round the last kept digit up.' : 'leave the last kept digit as it is.'}` : 'Nothing to drop: the number already has this few digits.';
  };
  [x, n].forEach((el) => el.addEventListener('input', run)); run();
}

function sigops(h) {
  h.innerHTML = `<div class="wd-body"><h3 class="wd-h">Calculate with the right precision</h3><div class="wd-row">${field('First number', num('4.56', 'data-a'))}
    ${field('Operation', '<select data-o><option value="*">\u00d7 multiply</option><option value="/">\u00f7 divide</option><option value="+">+ add</option><option value="-">\u2212 subtract</option></select>')}
    ${field('Second number', num('1.4', 'data-b'))}</div>
    <p class="wd-out" role="status" aria-live="polite"></p><p class="wd-hint"></p></div>`;
  const a = $(h, '[data-a]'), b = $(h, '[data-b]'), o = $(h, '[data-o]');
  const run = () => {
    const mul = o.value === '*' || o.value === '/', r = mul ? mulDiv(a.value, b.value, o.value) : addSub(a.value, b.value, o.value);
    if (!r) { $(h, '.wd-out').textContent = 'Enter two non-zero numbers.'; $(h, '.wd-hint').textContent = ''; return; }
    $(h, '.wd-out').innerHTML = `Calculator shows ${trimNum(r.raw, 10)} \u2192 report <strong class="wd-num">${expHtml(mul ? r.text : r.text)}</strong>`;
    $(h, '.wd-hint').textContent = mul ? `Multiply and divide: keep the fewest significant figures. Here that is ${r.n}.` : `Add and subtract: keep the fewest decimal places. Here that is ${r.places}.`;
  };
  [a, b, o].forEach((el) => el.addEventListener('input', run)); run();
}

function sigtools(h) {
  h.innerHTML = '<div class="wd-sec"></div><div class="wd-sec"></div><div class="wd-sec"></div>';
  const [a, b, c] = h.querySelectorAll('.wd-sec');
  sigfigs(a); rounder(b); sigops(c);
}

/* ---------- scientific notation ---------- */
function scinot(h) {
  h.innerHTML = `<div class="wd-body"><h3 class="wd-h">Decimal to scientific notation</h3>${field('Number', num('0.00567', 'data-d'))}
    <p class="wd-out" data-o1 role="status" aria-live="polite"></p><p class="wd-hint" data-h1></p>
    <h3 class="wd-h">Scientific notation to decimal</h3>
    <div class="wd-row">${field('N (between 1 and 10)', num('4.56', 'data-m'))}${field('Exponent n', num('5', 'data-e'))}</div>
    <p class="wd-out" data-o2 role="status" aria-live="polite"></p></div>`;
  const d = $(h, '[data-d]'), m = $(h, '[data-m]'), e = $(h, '[data-e]');
  const r1 = () => {
    const s = toScientific(d.value);
    if (!s) { $(h, '[data-o1]').textContent = 'Enter a non-zero number.'; $(h, '[data-h1]').textContent = ''; return; }
    $(h, '[data-o1]').innerHTML = `<span class="wd-num">${s.mantissa} \u00d7 10<sup>${s.exp}</sup></span><strong>${s.n} significant figure${s.n === 1 ? '' : 's'}</strong>`;
    $(h, '[data-h1]').textContent = s.exp < 0 ? `The decimal point moved ${-s.exp} place${s.exp === -1 ? '' : 's'} to the right, so the exponent is negative.` : s.exp > 0 ? `The decimal point moved ${s.exp} place${s.exp === 1 ? '' : 's'} to the left, so the exponent is positive.` : 'No movement needed: the exponent is 0.';
  };
  const r2 = () => {
    const mv = parseFloat(m.value), s = /^\d+\.?\d*$/.test(m.value.trim()) && mv >= 1 && mv < 10 ? fromScientific(m.value, parseInt(e.value, 10)) : null;
    $(h, '[data-o2]').innerHTML = s ? `<span class="wd-num">${m.value.trim()} \u00d7 10<sup>${parseInt(e.value, 10)}</sup> = ${s}</span>` : 'N must be at least 1 and less than 10, and n a whole number.';
  };
  d.addEventListener('input', r1); [m, e].forEach((x) => x.addEventListener('input', r2)); r1(); r2();
}

/* ---------- unit converter (factor-label) ---------- */
function convert(h) {
  const cats = Object.keys(UNITS);
  h.innerHTML = `<div class="wd-body"><div class="wd-row">
    ${field('Quantity', `<select data-c>${cats.map((c) => `<option>${c}</option>`).join('')}</select>`)}${field('Value', num('8.50', 'data-v'))}
    ${field('From', '<select data-f></select>')}${field('To', '<select data-t></select>')}</div>
    <p class="wd-out" role="status" aria-live="polite"></p><p class="wd-hint"></p></div>`;
  const c = $(h, '[data-c]'), v = $(h, '[data-v]'), f = $(h, '[data-f]'), t = $(h, '[data-t]');
  const fill = () => {
    const u = Object.keys(UNITS[c.value]), opt = u.map((x) => `<option>${x}</option>`).join('');
    f.innerHTML = opt; t.innerHTML = opt;
    const pick = { Length: ['in', 'cm'], Mass: ['lb', 'kg'], Volume: ['m\u00b3', 'mL'], Time: ['h', 's'], Speed: ['km/h', 'm/s'], Density: ['g/cm\u00b3', 'kg/m\u00b3'] }[c.value] || [u[0], u[1]];
    f.value = pick[0]; t.value = pick[1];
  };
  const run = () => {
    const s = parseSig(v.value), x = parseFloat(v.value), k = factor(c.value, f.value, t.value);
    if (!s || isNaN(x) || k === null) { $(h, '.wd-out').textContent = 'Enter a non-zero number.'; $(h, '.wd-hint').textContent = ''; return; }
    const r = roundSig(x * k, s.n), pre = c.value.startsWith('SI') ? '' : ' ';
    $(h, '.wd-out').innerHTML = `${v.value.trim()}${pre}${f.value} \u00d7 <span class="wd-frac"><span>${kHtml(k)}${pre}${t.value}</span><span>1${pre}${f.value}</span></span> = <strong class="wd-num">${expHtml(r.text)}${pre}${t.value}</strong>`;
    $(h, '.wd-hint').textContent = `${f.value} cancels, leaving ${t.value}. Rounded to ${s.n} significant figure${s.n === 1 ? '' : 's'}, like your value. The conversion factor itself is treated as exact.`;
  };
  c.addEventListener('change', () => { fill(); run(); });
  [v, f, t].forEach((el) => el.addEventListener('input', run));
  fill(); run();
}

/* ---------- density, temperature, percent error ---------- */
function measure(h) {
  h.innerHTML = `<div class="wd-body">${field('Calculate', '<select data-k><option value="d">Density (mass \u00f7 volume)</option><option value="t">Temperature scales</option><option value="p">Percent error</option></select>')}
    <div class="wd-row" data-f></div><p class="wd-out" role="status" aria-live="polite"></p><p class="wd-hint"></p></div>`;
  const k = $(h, '[data-k]'), box = $(h, '[data-f]');
  const forms = {
    d: () => field('Mass (g)', num('27.0', 'data-1')) + field('Volume (cm\u00b3)', num('10.0', 'data-2')),
    t: () => field('Temperature', num('25', 'data-1')) + field('Scale', '<select data-2><option>C</option><option>K</option><option>F</option></select>'),
    p: () => field('Measured value', num('9.5', 'data-1')) + field('Accepted value', num('10.0', 'data-2')),
  };
  const run = () => {
    const a = $(h, '[data-1]'), b = $(h, '[data-2]'), x = parseFloat(a.value), o = $(h, '.wd-out'), hint = $(h, '.wd-hint');
    if (isNaN(x)) { o.textContent = 'Enter a number.'; hint.textContent = ''; return; }
    if (k.value === 'd') {
      const y = parseFloat(b.value), r = density(x, y);
      o.innerHTML = r === null ? 'Volume must be above zero.' : `Density = ${a.value.trim()} g \u00f7 ${b.value.trim()} cm\u00b3 = <strong class="wd-num">${sci(r, Math.min(parseSig(a.value)?.n || 3, parseSig(b.value)?.n || 3))} g/cm\u00b3</strong>`;
      hint.textContent = 'Density is an intensive property: it does not depend on how much of the substance you have.';
    } else if (k.value === 't') {
      const sc = b.value, K = temperature(x, sc, 'K'), C = temperature(x, sc, 'C'), F = temperature(x, sc, 'F');
      if (K < 0) { o.textContent = 'That is below absolute zero (0 K), which is impossible.'; hint.textContent = ''; return; }
      o.innerHTML = `<strong class="wd-num">${C.toFixed(2)} \u00b0C</strong><strong class="wd-num">${K.toFixed(2)} K</strong><strong class="wd-num">${F.toFixed(2)} \u00b0F</strong>`;
      hint.textContent = 'K = \u00b0C + 273.15 and \u00b0F = 1.8 \u00d7 \u00b0C + 32. The kelvin is the SI unit for temperature.';
    } else {
      const y = parseFloat(b.value), r = percentError(x, y);
      o.innerHTML = r === null ? 'The accepted value cannot be zero.' : `Percent error = <strong class="wd-num">${r.toFixed(2)}%</strong>`;
      hint.textContent = '|measured \u2212 accepted| \u00f7 accepted \u00d7 100. It tells you how accurate a measurement is.';
    }
  };
  const draw = () => { box.innerHTML = forms[k.value](); box.querySelectorAll('input,select').forEach((el) => el.addEventListener('input', run)); run(); };
  k.addEventListener('change', draw); draw();
}

/* ---------- molar mass and mole calculator ---------- */
const BY_SYMBOL = new Map(ELEMENTS.map((e) => [e.s, e]));
function mole(h) {
  h.innerHTML = `<div class="wd-body"><div class="wd-row">${field('Formula (e.g. H2O, Ca(OH)2, C60)', num('Ca(OH)2', 'data-s'))}
    ${field('Amount', num('25.0', 'data-a'))}${field('Unit', '<select data-u><option value="g">grams</option><option value="mol">moles</option><option value="p">particles</option></select>')}</div>
    <div class="wd-scroll"><table class="wd-tbl" data-t></table></div>
    <dl class="wd-grid" role="status" aria-live="polite"></dl><p class="wd-hint"></p></div>`;
  const s = $(h, '[data-s]'), a = $(h, '[data-a]'), u = $(h, '[data-u]');
  const run = () => {
    const counts = parseFormula(s.value), grid = $(h, '.wd-grid'), tbl = $(h, '[data-t]'), hint = $(h, '.wd-hint');
    tbl.innerHTML = ''; hint.textContent = '';
    if (!counts) { grid.innerHTML = '<p>Enter a formula with capital letters for each element, like NaCl or Al2(SO4)3.</p>'; return; }
    const mm = molarMass(counts, (el) => BY_SYMBOL.get(el)?.m);
    if (mm.error) { grid.innerHTML = `<p>${mm.error}</p>`; return; }
    tbl.innerHTML = `<thead><tr><th>Element</th><th>Atoms</th><th>Atomic mass (g/mol)</th><th>Subtotal</th></tr></thead><tbody>${mm.rows.map((r) => `<tr><td>${r.el}</td><td>${r.n}</td><td>${r.mass}</td><td>${r.sub.toFixed(3)}</td></tr>`).join('')}</tbody>`;
    const x = parseFloat(a.value);
    if (isNaN(x) || x < 0) { grid.innerHTML = `<div><dt>Molar mass</dt><dd>${mm.total.toFixed(3)} g/mol</dd></div>`; return; }
    const mol = u.value === 'g' ? x / mm.total : u.value === 'mol' ? x : x / NA;
    grid.innerHTML = `<div><dt>Molar mass</dt><dd>${mm.total.toFixed(3)} g/mol</dd></div><div><dt>Mass</dt><dd>${sci(mol * mm.total, 4)} g</dd></div>
      <div><dt>Moles</dt><dd>${sci(mol, 4)} mol</dd></div><div><dt>Particles</dt><dd>${sci(mol * NA, 4)}</dd></div>`;
    hint.textContent = 'grams \u00f7 molar mass = moles; moles \u00d7 6.022 \u00d7 10\u00b2\u00b3 = particles. Atoms of one element inside the formula = particles \u00d7 the number shown in the Atoms column.';
  };
  [s, a, u].forEach((el) => el.addEventListener('input', run)); run();
}

/* ---------- accuracy vs precision darts ---------- */
function darts(h) {
  const S = 260;
  h.innerHTML = `<div class="wd-body"><canvas width="${S}" height="${S}" role="img" aria-label="Dartboard with six darts"></canvas>
    <div class="wd-row">${field('Accuracy (closeness to the bullseye)', '<input type="range" min="0" max="100" value="20" data-a>')}${field('Precision (tightness of the group)', '<input type="range" min="0" max="100" value="85" data-p>')}</div>
    <div><button type="button" class="btn btn-ghost btn-sm" data-again>Throw again</button></div>
    <p class="wd-out" role="status" aria-live="polite"></p></div>`;
  const cv = $(h, 'canvas'), g = cv.getContext('2d'), A = $(h, '[data-a]'), P = $(h, '[data-p]');
  cv.classList.add('sq');
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 0.75;
  let noise, ang;
  const roll = () => { noise = Array.from({ length: 6 }, () => [gauss(), gauss()]); ang = Math.random() * 6.283; };
  const draw = () => {
    const cs = getComputedStyle(cv), line = cs.getPropertyValue('--ink-3') || '#888', dart = cs.getPropertyValue('--mod') || '#1b8a8f';
    g.clearRect(0, 0, S, S); g.lineWidth = 1.5; g.strokeStyle = line;
    [120, 80, 40, 12].forEach((r, i) => { g.beginPath(); g.arc(S / 2, S / 2, r, 0, 6.283); g.globalAlpha = i === 3 ? 1 : 0.5; g.stroke(); });
    g.globalAlpha = 1;
    const off = ((100 - A.value) / 100) * 85, sd = 3 + ((100 - P.value) / 100) * 34, cx = S / 2 + Math.cos(ang) * off, cy = S / 2 + Math.sin(ang) * off;
    g.fillStyle = dart;
    for (const [nx, ny] of noise) { g.beginPath(); g.arc(Math.min(S - 6, Math.max(6, cx + nx * sd)), Math.min(S - 6, Math.max(6, cy + ny * sd)), 5, 0, 6.283); g.fill(); }
    const acc = A.value >= 60 ? 'High' : 'Low', pre = P.value >= 60 ? 'High' : 'Low';
    $(h, '.wd-out').innerHTML = `<strong>${acc} accuracy, ${pre.toLowerCase()} precision.</strong> ${acc === 'High' && pre === 'High' ? 'Close to the target and tightly grouped: the ideal measurement.' : acc === 'Low' && pre === 'High' ? 'Tightly grouped but off target: a consistent error, such as a badly calibrated instrument.' : acc === 'High' ? 'Centred on the target, but scattered: the average is right, single readings are not reliable.' : 'Scattered and off target.'}`;
  };
  roll();
  [A, P].forEach((el) => el.addEventListener('input', draw));
  $(h, '[data-again]').addEventListener('click', () => { roll(); draw(); });
  draw();
}

/* ---------- states of matter simulation ---------- */
function states(h) {
  const W = 320, H = 220, N = 36;
  h.innerHTML = `<div class="wd-body"><canvas width="${W}" height="${H}" role="img" aria-label="Particles in a container"></canvas>
    ${field('Temperature', '<input type="range" min="0" max="100" value="15" data-t>')}
    <p class="wd-out" role="status" aria-live="polite"></p></div>`;
  const cv = $(h, 'canvas'), g = cv.getContext('2d'), range = $(h, '[data-t]');
  const P = Array.from({ length: N }, (_, i) => {
    const hx = 70 + (i % 6) * 36, hy = H - 20 - Math.floor(i / 6) * 18, a = Math.random() * 6.283;
    return { x: hx, y: hy, hx, hy, vx: Math.cos(a), vy: Math.sin(a) };
  });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const state = () => (+range.value < 35 ? 'Solid' : +range.value < 65 ? 'Liquid' : 'Gas');
  const step = () => {
    const T = +range.value, st = state(), sp = 0.4 + T / 22, top = st === 'Gas' ? 6 : H * 0.42;
    for (const p of P) {
      if (st === 'Solid') { p.x += (p.hx - p.x) * 0.2 + (Math.random() - 0.5) * T * 0.09; p.y += (p.hy - p.y) * 0.2 + (Math.random() - 0.5) * T * 0.09; continue; }
      p.x += p.vx * sp; p.y += p.vy * sp;
      if (p.x < 6 || p.x > W - 6) { p.vx *= -1; p.x = Math.min(W - 6, Math.max(6, p.x)); }
      if (p.y < top || p.y > H - 6) { p.vy *= -1; p.y = Math.min(H - 6, Math.max(top, p.y)); }
    }
  };
  const draw = () => {
    const cs = getComputedStyle(cv);
    g.clearRect(0, 0, W, H);
    g.strokeStyle = cs.getPropertyValue('--ink-3') || '#888'; g.globalAlpha = 0.5; g.strokeRect(1, 1, W - 2, H - 2); g.globalAlpha = 1;
    g.fillStyle = cs.getPropertyValue('--mod') || '#1b8a8f';
    for (const p of P) { g.beginPath(); g.arc(p.x, p.y, 6, 0, 6.283); g.fill(); }
  };
  const label = () => {
    const d = { Solid: 'Particles are locked in place and only vibrate.', Liquid: 'Particles stay close but slide past one another.', Gas: 'Particles are far apart and move freely.' }[state()];
    $(h, '.wd-out').innerHTML = `<strong>${state()}</strong>. ${d}`;
  };
  const loop = () => { if (!cv.isConnected) return; step(); draw(); requestAnimationFrame(loop); };
  range.addEventListener('input', () => { label(); if (reduce) { for (let k = 0; k < 20; k++) step(); draw(); } });
  label(); draw(); if (!reduce) loop();
}

/* ---------- Module 2 (kept for later) ---------- */
function isotope(h) {
  let rows = [[75.78, 34.969], [24.22, 36.966]];
  const draw = () => {
    h.innerHTML = `<div class="wd-body"><div class="wd-scroll"><table class="wd-tbl"><thead><tr><th>Abundance (%)</th><th>Mass (amu)</th><th></th></tr></thead><tbody>
      ${rows.map((r, i) => `<tr><td><input type="text" inputmode="decimal" value="${r[0]}" data-i="${i}" data-j="0" aria-label="Abundance ${i + 1}"></td>
      <td><input type="text" inputmode="decimal" value="${r[1]}" data-i="${i}" data-j="1" aria-label="Mass ${i + 1}"></td>
      <td><button type="button" class="wd-x" data-del="${i}" aria-label="Remove isotope ${i + 1}">\u00d7</button></td></tr>`).join('')}</tbody></table></div>
      <div><button type="button" class="btn btn-ghost btn-sm" data-add>Add isotope</button></div>
      <p class="wd-out" role="status" aria-live="polite"></p></div>`;
    calc();
  };
  const calc = () => {
    const tot = rows.reduce((s, r) => s + (+r[0] || 0), 0), avg = rows.reduce((s, r) => s + ((+r[0] || 0) / 100) * (+r[1] || 0), 0);
    $(h, '.wd-out').innerHTML = `Average atomic mass = <strong>${avg.toFixed(3)} amu</strong>` + (Math.abs(tot - 100) > 0.05 ? `<br><span class="wd-warn">Abundances add up to ${+tot.toFixed(2)}%, not 100%.</span>` : '');
  };
  h.oninput = (e) => { const i = e.target.dataset.i; if (i === undefined) return; rows[+i][+e.target.dataset.j] = e.target.value; calc(); };
  h.onclick = (e) => {
    if (e.target.closest('[data-add]')) { rows.push(['', '']); draw(); }
    const d = e.target.closest('[data-del]'); if (d && rows.length > 1) { rows.splice(+d.dataset.del, 1); draw(); }
  };
  draw();
}

function quantum(h) {
  h.innerHTML = `<div class="wd-body">${field('Principal quantum number n', `<select data-n>${[1, 2, 3, 4, 5, 6].map((n) => `<option>${n}</option>`).join('')}</select>`)}
    <div class="wd-scroll"><table class="wd-tbl"><thead><tr><th>l</th><th>Subshell</th><th>m\u2097 values</th><th>Orbitals</th><th>Max electrons</th></tr></thead><tbody></tbody></table></div>
    <p class="wd-out" role="status" aria-live="polite"></p></div>`;
  const sel = $(h, '[data-n]'); sel.value = 3;
  const run = () => {
    const n = +sel.value; let rows = '';
    for (let l = 0; l < n; l++) {
      const ml = Array.from({ length: 2 * l + 1 }, (_, k) => k - l).map((x) => (x > 0 ? `+${x}` : x)).join(', ');
      rows += `<tr><td>${l}</td><td>${n}${'spdfgh'[l]}</td><td>${ml}</td><td>${2 * l + 1}</td><td>${2 * (2 * l + 1)}</td></tr>`;
    }
    $(h, 'tbody').innerHTML = rows;
    $(h, '.wd-out').innerHTML = `Shell n = ${n}: <strong>${n}\u00b2 = ${n * n} orbitals</strong>, holding up to <strong>${2 * n * n} electrons</strong>.`;
  };
  sel.addEventListener('input', run); run();
}

const WIDGETS = { classify, sigfigs, rounder, sigops, sigtools, scinot, convert, measure, mole, darts, states, isotope, quantum };
export function mountWidget(name, host) { WIDGETS[name]?.(host); }
