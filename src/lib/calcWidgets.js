// Calculator widgets (the tools inside modules), owned by the calcu side.
// UI only: every number is computed by the pure functions in ./chemistry/*.js and covered by tests.
// mountWidget() in widgets.js spreads CALC_WIDGETS into its registry; keep the widget names stable
// because module content refers to them by name.
import { ELEMENTS } from '../data/elements.js';
import { parseSig, roundSig, mulDiv, addSub } from './chemistry/sigfigs.js';
import { toScientific, fromScientific } from './chemistry/notation.js';
import { UNITS, factor } from './chemistry/units.js';
import { parseFormula, molarMass } from './chemistry/molarMass.js';
import { density, percentError, temperature } from './chemistry/measure.js';
import { moleConvert } from './chemistry/mole.js';

const $ = (r, s) => r.querySelector(s);
const field = (label, inner) => `<label class="wd-field">${label}${inner}</label>`;
const num = (v, attr = '') => `<input type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="${v}" ${attr}>`;

/* ---------- formatting ---------- */
// 5780 -> "5.78 x 10^3" when toPrecision switches to exponent form.
function expHtml(s) {
  if (!s.includes('e')) return s;
  const [a, b] = s.split('e');
  return `${a} \u00d7 10<sup>${+b}</sup>`;
}
function sci(x, n = 4) {
  if (!isFinite(x)) return '\u2014';
  return expHtml(x.toPrecision(n));
}
const trimNum = (x, d = 6) => String(Number(x.toPrecision(d)));
const kHtml = (k) => expHtml(String(Number(k.toPrecision(6))));
const sigHtml = (p) => [...p.mant].map((c, i) => (p.flags[i] ? `<mark>${c}</mark>` : c)).join('') + (p.exp !== null ? ` \u00d7 10<sup>${p.exp}</sup>` : '');
const sigCount = (n) => `${n} significant figure${n === 1 ? '' : 's'}`;
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/* ---------- 1. significant figures: count, round, calculate ---------- */
function sigfigs(h) {
  h.innerHTML = `<div class="wd-body"><h3 class="wd-h">Count significant figures</h3>
    <p class="wd-hint">Non-zero digits count. Leading zeros do not. Zeros between digits count. Trailing zeros count only when there is a decimal point or an exponent.</p>
    ${field('Number', num('0.00250'))}
    <p class="wd-out" role="status" aria-live="polite"></p>
    <p class="wd-hint" data-hint>Try 100, 100., 1.00e2, 1.008 or 0.0025.</p></div>`;
  const inp = $(h, 'input'), out = $(h, '.wd-out'), hint = $(h, '[data-hint]');
  const run = () => {
    const p = parseSig(inp.value);
    if (!p) {
      out.textContent = 'Enter a non-zero number.';
      hint.textContent = 'Try 100, 100., 1.00e2, 1.008 or 0.0025.';
      return;
    }
    out.innerHTML = `<span class="wd-num">${sigHtml(p)}</span><strong>${sigCount(p.n)}</strong>`;
    hint.innerHTML = p.exp !== null
      ? 'Every digit in the mantissa counts in scientific notation.'
      : p.mant.includes('.')
        ? 'The highlighted digits are significant. The trailing zero counts because there is a decimal point.'
        : 'The highlighted digits are significant. Trailing zeros with no decimal point do not count.';
  };
  inp.addEventListener('input', run); run();
}

function rounder(h) {
  h.innerHTML = `<div class="wd-body"><h3 class="wd-h">Round to significant figures</h3>
    <p class="wd-hint">Keep the requested number of significant figures, then look at the first digit you drop: 5 or more rounds the last kept digit up.</p>
    <div class="wd-row">${field('Number', num('6.3849', 'data-x'))}
    ${field('Significant figures', `<select data-n>${[1, 2, 3, 4, 5, 6].map((n) => `<option ${n === 2 ? 'selected' : ''}>${n}</option>`).join('')}</select>`)}</div>
    <p class="wd-out" role="status" aria-live="polite"></p><p class="wd-hint" data-hint></p></div>`;
  const x = $(h, '[data-x]'), n = $(h, '[data-n]'), out = $(h, '.wd-out'), hint = $(h, '[data-hint]');
  const run = () => {
    const p = parseSig(x.value);
    if (!p) { out.textContent = 'Enter a non-zero number.'; hint.textContent = ''; return; }
    const r = roundSig(parseFloat(x.value), +n.value);
    out.innerHTML = `${x.value.trim()} \u2192 <strong class="wd-num">${expHtml(r.text)}</strong>`;
    const digits = p.mant.replace('.', '').replace(/^0+/, ''), drop = digits[+n.value];
    hint.textContent = +n.value > p.n
      ? `The number as typed has only ${sigCount(p.n)}. The extra digits in scientific notation are placeholders, not new precision.`
      : +n.value === p.n
        ? `The number already has ${sigCount(p.n)}; no digit is dropped.`
        : drop
          ? `The first digit dropped is ${drop}: ${+drop >= 5 ? 'round the last kept digit up.' : 'leave the last kept digit as it is.'}`
          : 'Nothing to drop: the number already has this few digits.';
  };
  [x, n].forEach((el) => el.addEventListener('input', run)); run();
}

function sigops(h) {
  h.innerHTML = `<div class="wd-body"><h3 class="wd-h">Calculate with the right precision</h3>
    <p class="wd-hint">Multiply and divide: keep the fewest significant figures. Add and subtract: keep the fewest decimal places.</p>
    <div class="wd-row">${field('First number', num('4.56', 'data-a'))}
    ${field('Operation', '<select data-o><option value="*">\u00d7 multiply</option><option value="/">\u00f7 divide</option><option value="+">+ add</option><option value="-">\u2212 subtract</option></select>')}
    ${field('Second number', num('1.4', 'data-b'))}</div>
    <p class="wd-out" role="status" aria-live="polite"></p><p class="wd-hint" data-hint></p></div>`;
  const a = $(h, '[data-a]'), b = $(h, '[data-b]'), o = $(h, '[data-o]'), out = $(h, '.wd-out'), hint = $(h, '[data-hint]');
  const run = () => {
    const A = parseSig(a.value), B = parseSig(b.value);
    if (!A || !B) { out.textContent = 'Enter two non-zero numbers.'; hint.textContent = ''; return; }
    const mul = o.value === '*' || o.value === '/', r = mul ? mulDiv(a.value, b.value, o.value) : addSub(a.value, b.value, o.value);
    if (!r) { out.textContent = o.value === '/' && parseFloat(b.value) === 0 ? 'You cannot divide by zero.' : 'Check both numbers.'; hint.textContent = ''; return; }
    const sym = { '*': '\u00d7', '/': '\u00f7', '+': '+', '-': '\u2212' }[o.value];
    const shown = mul
      ? `${a.value.trim()} (${A.n} sf) ${sym} ${b.value.trim()} (${B.n} sf)`
      : `${a.value.trim()} (${A.places} dp) ${sym} ${b.value.trim()} (${B.places} dp)`;
    out.innerHTML = `${shown} = ${trimNum(r.raw, 10)} \u2192 report <strong class="wd-num">${expHtml(r.text)}</strong>`;
    hint.textContent = mul
      ? `Multiplication and division keep the fewest significant figures: ${plural(r.n, 'significant figure', 'significant figures')}.`
      : `Addition and subtraction keep the fewest decimal places: ${plural(r.places, 'decimal place', 'decimal places')}.`;
  };
  [a, b, o].forEach((el) => el.addEventListener('input', run)); run();
}

function sigtools(h) {
  h.innerHTML = '<div class="wd-sec"></div><div class="wd-sec"></div><div class="wd-sec"></div>';
  const [a, b, c] = h.querySelectorAll('.wd-sec');
  sigfigs(a); rounder(b); sigops(c);
}

/* ---------- 2. scientific notation ---------- */
function scinot(h) {
  h.innerHTML = `<div class="wd-body"><h3 class="wd-h">Decimal to scientific notation</h3>
    <p class="wd-hint">Move the decimal point until one non-zero digit is in front. The number of places moved is the exponent, and the significant figures stay the same.</p>
    ${field('Number', num('0.00567', 'data-d'))}
    <p class="wd-out" data-o1 role="status" aria-live="polite"></p><p class="wd-hint" data-h1></p>
    <h3 class="wd-h">Scientific notation to decimal</h3>
    <p class="wd-hint">Enter a mantissa from 1 up to (but not including) 10 and a whole-number exponent.</p>
    <div class="wd-row">${field('Mantissa N (1 \u2264 N &lt; 10)', num('4.56', 'data-m'))}${field('Exponent n', num('5', 'data-e'))}</div>
    <p class="wd-out" data-o2 role="status" aria-live="polite"></p><p class="wd-hint" data-h2></p></div>`;
  const d = $(h, '[data-d]'), m = $(h, '[data-m]'), e = $(h, '[data-e]');
  const r1 = () => {
    const s = toScientific(d.value);
    if (!s) { $(h, '[data-o1]').textContent = 'Enter a non-zero number.'; $(h, '[data-h1]').textContent = ''; return; }
    $(h, '[data-o1]').innerHTML = `${d.value.trim()} = <span class="wd-num">${s.mantissa} \u00d7 10<sup>${s.exp}</sup></span><strong>${sigCount(s.n)}</strong>`;
    if (s.exp < 0) $(h, '[data-h1]').textContent = `The decimal point moved ${plural(-s.exp, 'place', 'places')} to the right, so the exponent is negative.`;
    else if (s.exp > 0) $(h, '[data-h1]').textContent = `The decimal point moved ${plural(s.exp, 'place', 'places')} to the left, so the exponent is positive.`;
    else $(h, '[data-h1]').textContent = 'No movement is needed: the exponent is 0. The significant figures are unchanged.';
  };
  const r2 = () => {
    const mant = parseFloat(m.value), exp = parseInt(e.value, 10);
    const valid = /^\d+\.?\d*$/.test(m.value.trim()) && mant >= 1 && mant < 10 && Number.isInteger(exp);
    const s = valid ? fromScientific(m.value, exp) : null;
    $(h, '[data-o2]').innerHTML = s
      ? `<span class="wd-num">${m.value.trim()} \u00d7 10<sup>${exp}</sup> = ${s}</span>`
      : 'The mantissa must be at least 1 and less than 10, and the exponent a whole number.';
    $(h, '[data-h2]').textContent = s
      ? exp === 0
        ? 'An exponent of 0 means the decimal point does not move.'
        : `Move the decimal point ${plural(Math.abs(exp), 'place', 'places')} to the ${exp > 0 ? 'right' : 'left'}.`
      : '';
  };
  d.addEventListener('input', r1); [m, e].forEach((x) => x.addEventListener('input', r2)); r1(); r2();
}

/* ---------- 3. unit converter (factor-label) ---------- */
function convert(h) {
  const cats = Object.keys(UNITS);
  h.innerHTML = `<div class="wd-body"><div class="wd-row">
    ${field('Quantity', `<select data-c>${cats.map((c) => `<option>${c}</option>`).join('')}</select>`)}${field('Value', num('8.50', 'data-v'))}
    ${field('From', '<select data-f></select>')}${field('To', '<select data-t></select>')}</div>
    <p class="wd-out" role="status" aria-live="polite"></p><p class="wd-hint" data-hint></p></div>`;
  const c = $(h, '[data-c]'), v = $(h, '[data-v]'), f = $(h, '[data-f]'), t = $(h, '[data-t]');
  const out = $(h, '.wd-out'), hint = $(h, '[data-hint]');
  const fill = () => {
    const u = Object.keys(UNITS[c.value]), opt = u.map((x) => `<option>${x}</option>`).join('');
    f.innerHTML = opt; t.innerHTML = opt;
    const pick = { Length: ['in', 'cm'], Mass: ['lb', 'kg'], Volume: ['m\u00b3', 'mL'], Time: ['h', 's'], Speed: ['km/h', 'm/s'], Density: ['g/cm\u00b3', 'kg/m\u00b3'] }[c.value] || [u[0], u[1]];
    f.value = pick[0]; t.value = pick[1];
  };
  const run = () => {
    const raw = v.value.replace(/,/g, '').trim(), s = parseSig(raw), x = parseFloat(raw), k = factor(c.value, f.value, t.value);
    if (isNaN(x) || k === null) { out.textContent = 'Enter a number.'; hint.textContent = ''; return; }
    if (x === 0) { out.innerHTML = `0${c.value.startsWith('SI') ? '' : ' '}${f.value} = <strong class="wd-num">0${c.value.startsWith('SI') ? '' : ' '}${t.value}</strong>`; hint.textContent = 'Zero converts to zero in any unit.'; return; }
    if (!s) { out.textContent = 'Enter a number.'; hint.textContent = ''; return; }
    const r = roundSig(x * k, s.n), pre = c.value.startsWith('SI') ? '' : ' ';
    out.innerHTML = `${raw}${pre}${f.value} \u00d7 <span class="wd-frac"><span>${kHtml(k)}${pre}${t.value}</span><span>1${pre}${f.value}</span></span> = <strong class="wd-num">${expHtml(r.text)}${pre}${t.value}</strong>`;
    hint.textContent = `${f.value} cancels, leaving ${t.value}. ${plural(s.n, 'significant figure', 'significant figures')}, like your value. The conversion factor itself is treated as exact.`;
  };
  c.addEventListener('change', () => { fill(); run(); });
  [v, f, t].forEach((el) => el.addEventListener('input', run));
  fill(); run();
}

/* ---------- 4. density, temperature and percent error ---------- */
function measure(h) {
  h.innerHTML = `<div class="wd-body">${field('Calculate', '<select data-k><option value="d">Density (mass \u00f7 volume)</option><option value="t">Temperature scales</option><option value="p">Percent error</option></select>')}
    <div class="wd-row" data-f></div><p class="wd-out" role="status" aria-live="polite"></p><p class="wd-hint" data-hint></p></div>`;
  const k = $(h, '[data-k]'), box = $(h, '[data-f]'), out = $(h, '.wd-out'), hint = $(h, '[data-hint]');
  const forms = {
    d: () => field('Mass (g)', num('27.0', 'data-1')) + field('Volume (cm\u00b3)', num('10.0', 'data-2')),
    t: () => field('Temperature', num('25', 'data-1')) + field('Scale', '<select data-2><option>C</option><option>K</option><option>F</option></select>'),
    p: () => field('Measured value', num('9.5', 'data-1')) + field('Accepted value', num('10.0', 'data-2')),
  };
  const run = () => {
    const a = $(h, '[data-1]'), b = $(h, '[data-2]'), x = parseFloat(String(a.value).replace(/,/g, ''));
    if (isNaN(x)) { out.textContent = 'Enter a number.'; hint.textContent = ''; return; }
    if (k.value === 'd') {
      const y = parseFloat(String(b.value).replace(/,/g, '')), r = density(x, y);
      if (r === null) { out.textContent = 'Volume must be above zero.'; hint.textContent = ''; return; }
      const A = parseSig(a.value), B = parseSig(b.value), n = Math.min(A?.n ?? 3, B?.n ?? 3);
      out.innerHTML = `\u03c1 = m / V = ${a.value.trim()} g \u00f7 ${b.value.trim()} cm\u00b3 = <strong class="wd-num">${sci(r, n)} g/cm\u00b3</strong>`;
      hint.textContent = `Mass has ${A?.n ?? 3} significant figures and volume has ${B?.n ?? 3}. Division keeps the fewest: ${plural(n, 'significant figure', 'significant figures')}. Density is an intensive property: it does not depend on how much you have.`;
    } else if (k.value === 't') {
      const sc = b.value, K = temperature(x, sc, 'K'), C = temperature(x, sc, 'C'), F = temperature(x, sc, 'F');
      if (K < 0) { out.textContent = 'That is below absolute zero (0 K), which is impossible.'; hint.textContent = ''; return; }
      const t1 = (v) => Number(v.toFixed(2)), fromLabel = sc === 'K' ? 'K' : `\u00b0${sc}`;
      const shown = [['C', `${t1(C)} \u00b0C`], ['K', `${t1(K)} K`], ['F', `${t1(F)} \u00b0F`]]
        .filter(([unit]) => unit !== sc).map(([, text]) => `<strong class="wd-num">${text}</strong>`).join(' ');
      out.innerHTML = `${x} ${fromLabel} = ${shown}`;
      hint.textContent = 'K = \u00b0C + 273.15, \u00b0C = (\u00b0F \u2212 32) \u00d7 5/9, and \u00b0F = 1.8 \u00d7 \u00b0C + 32. The kelvin is the SI unit for temperature.';
    } else {
      const y = parseFloat(String(b.value).replace(/,/g, '')), r = percentError(x, y);
      if (r === null) { out.textContent = 'The accepted value cannot be zero.'; hint.textContent = ''; return; }
      const A = parseSig(a.value), B = parseSig(b.value), n = Math.min(A?.n ?? 3, B?.n ?? 3);
      out.innerHTML = `% error = |measured \u2212 accepted| \u00f7 |accepted| \u00d7 100 = |${a.value.trim()} \u2212 ${b.value.trim()}| \u00f7 |${b.value.trim()}| \u00d7 100 = <strong class="wd-num">${sci(r, n)}%</strong>`;
      hint.textContent = 'Percent error compares a measurement with the accepted value. A small value means the measurement is accurate; the sign is dropped because the formula uses the absolute difference.';
    }
  };
  const draw = () => { box.innerHTML = forms[k.value](); box.querySelectorAll('input,select').forEach((el) => el.addEventListener('input', run)); run(); };
  k.addEventListener('change', draw); draw();
}

/* ---------- 5. molar mass and the mole ---------- */
const BY_SYMBOL = new Map(ELEMENTS.map((e) => [e.s, e]));
function mole(h) {
  h.innerHTML = `<div class="wd-body"><div class="wd-row">${field('Formula (e.g. H2O, Ca(OH)2, CuSO4.5H2O)', num('Ca(OH)2', 'data-s'))}
    ${field('Amount', num('25.0', 'data-a'))}${field('Unit', '<select data-u><option value="g">grams</option><option value="mol">moles</option><option value="p">particles</option></select>')}</div>
    <div class="wd-scroll"><table class="wd-tbl" data-t></table></div>
    <dl class="wd-grid" role="status" aria-live="polite"></dl><p class="wd-hint" data-hint></p></div>`;
  const s = $(h, '[data-s]'), a = $(h, '[data-a]'), u = $(h, '[data-u]'), tbl = $(h, '[data-t]'), grid = $(h, '.wd-grid'), hint = $(h, '[data-hint]');
  const run = () => {
    const counts = parseFormula(s.value);
    tbl.innerHTML = ''; hint.textContent = '';
    if (!counts) { grid.innerHTML = '<p>Enter a formula with a capital letter for each element, like NaCl, Al2(SO4)3 or CuSO4.5H2O.</p>'; return; }
    const mm = molarMass(counts, (el) => BY_SYMBOL.get(el)?.m);
    if (mm.error) { grid.innerHTML = `<p>${mm.error}</p>`; return; }
    tbl.innerHTML = `<thead><tr><th>Element</th><th>Atoms</th><th>Atomic mass (g/mol)</th><th>Subtotal</th></tr></thead><tbody>${mm.rows.map((r) => `<tr><td>${r.el}</td><td>${r.n}</td><td>${r.mass}</td><td>${r.sub.toFixed(3)}</td></tr>`).join('')}</tbody>`;

    const raw = a.value.replace(/,/g, '').trim(), x = parseFloat(raw), A = parseSig(raw), n = A?.n ?? 3;
    if (isNaN(x) || x < 0) {
      grid.innerHTML = `<div><dt>Molar mass (M)</dt><dd>${mm.total.toFixed(3)} g/mol</dd></div>`;
      hint.textContent = 'Enter an amount to convert between grams, moles and particles.';
      return;
    }

    const conv = moleConvert(x, u.value, mm.total);
    if (!conv) { grid.innerHTML = '<p>Choose grams, moles or particles and enter a non-negative amount.</p>'; return; }
    const { mol, mass, particles } = conv;
    const step = u.value === 'g'
      ? `n = m / M = ${raw} g \u00f7 ${mm.total.toFixed(3)} g/mol`
      : u.value === 'mol'
        ? `m = n \u00d7 M = ${raw} mol \u00d7 ${mm.total.toFixed(3)} g/mol`
        : `n = N / N\u2090 = ${raw} \u00f7 6.022 \u00d7 10\u00b2\u00b3`;
    grid.innerHTML = `<div><dt>Molar mass (M)</dt><dd>${mm.total.toFixed(3)} g/mol</dd></div>
      <div><dt>Moles (n)</dt><dd>${sci(mol, n)} mol</dd></div>
      <div><dt>Mass (m)</dt><dd>${sci(mass, n)} g</dd></div>
      <div><dt>Particles (N)</dt><dd>${sci(particles, n)}</dd></div>`;
    hint.innerHTML = `<strong>${step}</strong> = ${sci(u.value === 'g' ? mol : u.value === 'mol' ? mass : mol, n)} ${u.value === 'g' ? 'mol' : u.value === 'mol' ? 'g' : 'mol'}. ` +
      `Then N = n \u00d7 N\u2090 and m = n \u00d7 M. Answers keep ${plural(n, 'significant figure', 'significant figures')}, like your amount; the molar mass is treated as exact.`;
  };
  [s, a, u].forEach((el) => el.addEventListener('input', run)); run();
}

export const CALC_WIDGETS = { sigtools, scinot, convert, measure, mole };
