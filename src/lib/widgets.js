// Interactive widgets used inside lessons and as the module's calculators/simulations.
// mountWidget(name, hostElement) fills the host and wires its events. No dependencies besides the element data.
import { ELEMENTS } from '../data/elements.js';

const NA = 6.022e23;
const $ = (r, s) => r.querySelector(s);

/* ---------- helpers ---------- */
export function sci(x, n = 4) {
  if (!isFinite(x)) return '\u2014';
  const s = x.toPrecision(n);
  if (!s.includes('e')) return s;
  const [a, b] = s.split('e');
  return `${a} \u00d7 10<sup>${+b}</sup>`;
}

// Counts significant figures in a typed number ("0.0025", "100.", "1.00e2").
export function sigCount(raw) {
  const s = String(raw).trim().replace(/^[+-]/, '').replace(/[\s,]/g, '');
  const m = s.match(/^(\d*\.?\d*)(?:[eE]([+-]?\d+))?$/);
  if (!m || !/\d/.test(m[1])) return null;
  const mant = m[1], dot = mant.includes('.');
  const idx = [...mant].map((c, i) => (/\d/.test(c) ? i : -1)).filter((i) => i >= 0);
  const nz = idx.filter((i) => mant[i] !== '0');
  if (!nz.length) return null;
  const first = nz[0], last = dot ? idx[idx.length - 1] : nz[nz.length - 1];
  let n = 0, html = '';
  [...mant].forEach((c, i) => {
    const sig = /\d/.test(c) && i >= first && i <= last;
    if (sig) n++;
    html += sig ? `<mark>${c}</mark>` : c;
  });
  if (m[2] !== undefined) html += ` \u00d7 10<sup>${+m[2]}</sup>`;
  return { n, html };
}

/* ---------- classify matter ---------- */
const ITEMS = [
  ['Gold (Au)', 'element', 'Gold is an element: it cannot be split into simpler substances.'],
  ['Water (H\u2082O)', 'compound', 'Two elements chemically united. Only a chemical reaction can split it.'],
  ['Salt dissolved in water', 'homogeneous', 'Uniform throughout, and evaporation (a physical method) recovers the salt.'],
  ['Sand and water', 'heterogeneous', 'You can see the sand: the composition is not uniform.'],
  ['Oxygen gas (O\u2082)', 'element', 'Made of one kind of atom only.'],
  ['Brass (copper + zinc)', 'homogeneous', 'An alloy is a uniform mixture of metals.'],
  ['Table sugar (C\u2081\u2082H\u2082\u2082O\u2081\u2081)', 'compound', 'Fixed composition of carbon, hydrogen and oxygen.'],
  ['Concrete', 'heterogeneous', 'Gravel, sand and cement stay visibly distinct.'],
];
const KINDS = [['element', 'Element'], ['compound', 'Compound'], ['homogeneous', 'Homogeneous mixture'], ['heterogeneous', 'Heterogeneous mixture']];

function classify(h) {
  let i = 0, score = 0, answered = false;
  const draw = () => {
    if (i >= ITEMS.length) {
      h.innerHTML = `<div class="wd-body"><p><strong>${score} of ${ITEMS.length} correct.</strong></p><button type="button" class="btn btn-ghost btn-sm" data-r>Play again</button></div>`;
      return;
    }
    const [name] = ITEMS[i];
    answered = false;
    h.innerHTML = `<div class="wd-body"><p class="wd-label">Item ${i + 1} of ${ITEMS.length}</p><p class="wd-big">${name}</p>
      <div class="wd-btns">${KINDS.map(([k, l]) => `<button type="button" data-k="${k}">${l}</button>`).join('')}</div>
      <p class="wd-fb" role="status" aria-live="polite"></p></div>`;
  };
  h.onclick = (e) => {
    if (e.target.closest('[data-r]')) { i = 0; score = 0; draw(); return; }
    if (e.target.closest('[data-n]')) { i++; draw(); return; }
    const b = e.target.closest('[data-k]');
    if (!b || answered) return;
    answered = true;
    const [, kind, why] = ITEMS[i], ok = b.dataset.k === kind;
    if (ok) score++;
    h.querySelectorAll('[data-k]').forEach((x) => { x.disabled = true; if (x.dataset.k === kind) x.classList.add('right'); });
    if (!ok) b.classList.add('wrong');
    $(h, '.wd-fb').innerHTML = `${ok ? 'Correct.' : 'Not quite.'} ${why} <button type="button" class="btn btn-primary btn-sm" data-n>${i === ITEMS.length - 1 ? 'See score' : 'Next'}</button>`;
  };
  draw();
}

/* ---------- significant figures ---------- */
function sigfigs(h) {
  h.innerHTML = `<div class="wd-body"><label class="wd-field">Number<input type="text" inputmode="decimal" value="0.00250" autocomplete="off" spellcheck="false"></label>
    <p class="wd-out" role="status" aria-live="polite"></p>
    <p class="wd-hint">Try 100, 100., 1.00e2, 1.008 or 0.0025. Highlighted digits are significant.</p></div>`;
  const inp = $(h, 'input'), out = $(h, '.wd-out');
  const run = () => {
    const r = sigCount(inp.value);
    out.innerHTML = r ? `<span class="wd-num">${r.html}</span><strong>${r.n} significant figure${r.n === 1 ? '' : 's'}</strong>` : 'Enter a non-zero number.';
  };
  inp.addEventListener('input', run); run();
}

/* ---------- unit converter (factor-label) ---------- */
const UNITS = {
  Length: { m: 1, km: 1e3, cm: 1e-2, mm: 1e-3, '\u00b5m': 1e-6, nm: 1e-9, in: 0.0254, mi: 1609.344 },
  Mass: { g: 1, kg: 1e3, mg: 1e-3, lb: 453.6 },
  Volume: { L: 1, mL: 1e-3, 'cm\u00b3': 1e-3, 'm\u00b3': 1e3, gal: 3.785 },
};
function convert(h) {
  const cats = Object.keys(UNITS);
  h.innerHTML = `<div class="wd-body"><div class="wd-row">
    <label class="wd-field">Quantity<select data-c>${cats.map((c) => `<option>${c}</option>`).join('')}</select></label>
    <label class="wd-field">Value<input type="text" inputmode="decimal" value="8.50" data-v></label>
    <label class="wd-field">From<select data-f></select></label>
    <label class="wd-field">To<select data-t></select></label></div>
    <p class="wd-out" role="status" aria-live="polite"></p><p class="wd-hint"></p></div>`;
  const c = $(h, '[data-c]'), v = $(h, '[data-v]'), f = $(h, '[data-f]'), t = $(h, '[data-t]');
  const fill = () => {
    const u = Object.keys(UNITS[c.value]);
    f.innerHTML = u.map((x) => `<option>${x}</option>`).join('');
    t.innerHTML = u.map((x) => `<option>${x}</option>`).join('');
    f.value = u[c.value === 'Length' ? 6 : 3] || u[0]; t.value = u[c.value === 'Length' ? 2 : 1];
  };
  const run = () => {
    const U = UNITS[c.value], s = sigCount(v.value), x = parseFloat(v.value);
    if (!s || isNaN(x)) { $(h, '.wd-out').textContent = 'Enter a number.'; return; }
    const k = Number((U[f.value] / U[t.value]).toPrecision(10)), r = x * k;
    $(h, '.wd-out').innerHTML = `${v.value.trim()} ${f.value} \u00d7 <span class="wd-frac"><span>${sci(k, 6).replace(/\.?0+(?= |<|$)/, '')} ${t.value}</span><span>1 ${f.value}</span></span> = <strong>${sci(r, s.n)} ${t.value}</strong>`;
    $(h, '.wd-hint').textContent = `${f.value} cancels, leaving ${t.value}. Answer rounded to ${s.n} significant figure${s.n === 1 ? '' : 's'}, as in your value. Factors from the unit table are treated as exact.`;
  };
  c.addEventListener('change', () => { fill(); run(); });
  [v, f, t].forEach((el) => el.addEventListener('input', run));
  fill(); run();
}

/* ---------- mole calculator ---------- */
const SUBS = [
  { n: 'Water (H\u2082O)', m: 18.015, e: 'molecules' }, { n: 'Carbon dioxide (CO\u2082)', m: 44.009, e: 'molecules' },
  { n: 'Sodium chloride (NaCl)', m: 58.44, e: 'formula units' }, { n: 'Glucose (C\u2086H\u2081\u2082O\u2086)', m: 180.16, e: 'molecules' },
  ...ELEMENTS.filter((e) => !e.mb).map((e) => ({ n: `${e.n} (${e.s})`, m: e.m, e: 'atoms' })),
];
function mole(h) {
  h.innerHTML = `<div class="wd-body"><div class="wd-row">
    <label class="wd-field">Substance<select data-s>${SUBS.map((s, i) => `<option value="${i}">${s.n}</option>`).join('')}</select></label>
    <label class="wd-field">Amount<input type="text" inputmode="decimal" value="6.46" data-a></label>
    <label class="wd-field">Unit<select data-u><option value="g">grams</option><option value="mol">moles</option><option value="p">particles</option></select></label></div>
    <dl class="wd-grid" role="status" aria-live="polite"></dl><p class="wd-hint"></p></div>`;
  const s = $(h, '[data-s]'), a = $(h, '[data-a]'), u = $(h, '[data-u]');
  s.value = SUBS.findIndex((x) => x.n.startsWith('Helium'));
  const run = () => {
    const S = SUBS[+s.value], x = parseFloat(a.value);
    if (isNaN(x) || x < 0) { $(h, '.wd-grid').innerHTML = '<p>Enter a positive number.</p>'; return; }
    const mol = u.value === 'g' ? x / S.m : u.value === 'mol' ? x : x / NA;
    $(h, '.wd-grid').innerHTML = `<div><dt>Molar mass</dt><dd>${S.m} g/mol</dd></div><div><dt>Mass</dt><dd>${sci(mol * S.m, 4)} g</dd></div>
      <div><dt>Moles</dt><dd>${sci(mol, 4)} mol</dd></div><div><dt>${S.e}</dt><dd>${sci(mol * NA, 4)}</dd></div>`;
    $(h, '.wd-hint').textContent = 'grams \u00f7 molar mass = moles; moles \u00d7 6.022 \u00d7 10\u00b2\u00b3 = particles.';
  };
  [s, a, u].forEach((el) => el.addEventListener('input', run)); run();
}

/* ---------- average atomic mass ---------- */
function isotope(h) {
  let rows = [[75.78, 34.969], [24.22, 36.966]];
  const draw = () => {
    h.innerHTML = `<div class="wd-body"><table class="wd-tbl"><thead><tr><th>Abundance (%)</th><th>Mass (amu)</th><th></th></tr></thead><tbody>
      ${rows.map((r, i) => `<tr><td><input type="text" inputmode="decimal" value="${r[0]}" data-i="${i}" data-j="0" aria-label="Abundance ${i + 1}"></td>
      <td><input type="text" inputmode="decimal" value="${r[1]}" data-i="${i}" data-j="1" aria-label="Mass ${i + 1}"></td>
      <td><button type="button" class="wd-x" data-del="${i}" aria-label="Remove isotope ${i + 1}">\u00d7</button></td></tr>`).join('')}</tbody></table>
      <button type="button" class="btn btn-ghost btn-sm" data-add>Add isotope</button>
      <p class="wd-out" role="status" aria-live="polite"></p></div>`;
    calc();
  };
  const calc = () => {
    const tot = rows.reduce((s, r) => s + (+r[0] || 0), 0);
    const avg = rows.reduce((s, r) => s + ((+r[0] || 0) / 100) * (+r[1] || 0), 0);
    $(h, '.wd-out').innerHTML = `Average atomic mass = <strong>${avg.toFixed(3)} amu</strong>` + (Math.abs(tot - 100) > 0.05 ? `<br><span class="wd-warn">Abundances add up to ${+tot.toFixed(2)}%, not 100%.</span>` : '');
  };
  h.oninput = (e) => { const i = e.target.dataset.i; if (i === undefined) return; rows[+i][+e.target.dataset.j] = e.target.value; calc(); };
  h.onclick = (e) => {
    if (e.target.closest('[data-add]')) { rows.push(['', '']); draw(); }
    const d = e.target.closest('[data-del]'); if (d && rows.length > 1) { rows.splice(+d.dataset.del, 1); draw(); }
  };
  draw();
}

/* ---------- quantum numbers ---------- */
function quantum(h) {
  h.innerHTML = `<div class="wd-body"><label class="wd-field">Principal quantum number n<select data-n>${[1, 2, 3, 4, 5, 6].map((n) => `<option>${n}</option>`).join('')}</select></label>
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

/* ---------- states of matter simulation ---------- */
function states(h) {
  const W = 320, H = 220, N = 36;
  h.innerHTML = `<div class="wd-body"><canvas width="${W}" height="${H}" role="img" aria-label="Particles in a container"></canvas>
    <label class="wd-field">Temperature<input type="range" min="0" max="100" value="15" data-t></label>
    <p class="wd-out" role="status" aria-live="polite"></p></div>`;
  const cv = $(h, 'canvas'), g = cv.getContext('2d'), range = $(h, '[data-t]');
  cv.style.color = 'var(--brand)';
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
    g.clearRect(0, 0, W, H);
    g.strokeStyle = getComputedStyle(cv).color; g.globalAlpha = 0.35; g.strokeRect(1, 1, W - 2, H - 2); g.globalAlpha = 1;
    g.fillStyle = getComputedStyle(cv).color;
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

const WIDGETS = { classify, sigfigs, convert, mole, isotope, quantum, states };
export function mountWidget(name, host) { WIDGETS[name]?.(host); }
