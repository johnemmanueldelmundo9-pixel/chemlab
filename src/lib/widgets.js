// Interactive widgets used inside lessons and as the module's calculators/simulations.
// mountWidget(name, hostElement) fills the host and wires its events. All maths lives in ./chemistry/*.js.
// Calculator UI lives in ./calcWidgets.js (CALC_WIDGETS) so the calcu and module sides can work apart.
import { LAB_WIDGETS } from './labWidgets.js';
import { CALC_WIDGETS } from './calcWidgets.js';

const $ = (r, s) => r.querySelector(s);
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const field = (label, inner) => `<label class="wd-field">${label}${inner}</label>`;
const num = (v, attr = '') => `<input type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="${v}" ${attr}>`;

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

/* ---------- Module 3: isotopes ---------- */
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

const WIDGETS = { ...LAB_WIDGETS, ...CALC_WIDGETS, classify, darts, states, isotope, quantum };
export function mountWidget(name, host) { WIDGETS[name]?.(host); }
