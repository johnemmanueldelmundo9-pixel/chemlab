// Atomic-structure widgets for Module 3. Registered in widgets.js through ATOM_WIDGETS.
// Uses the .wd-* classes from lesson.css plus the "Atomic structure widgets" block added at the end of that file.
import { ELEMENTS } from '../data/elements.js';
import { electronConfig, condensed, unpaired, lastElectron, boxes, checkQuantum, shells, EXCEPTIONS } from './chemistry/atoms.js';

const $ = (r, s) => r.querySelector(s);
const field = (label, inner) => `<label class="wd-field">${label}${inner}</label>`;
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const cfgHtml = (list) => list.map((s) => `${s.name}<sup>${s.count}</sup>`).join(' ');
const spin = (ms) => (ms > 0 ? '+\u00bd' : '\u2212\u00bd');
const sgn = (x) => (x > 0 ? `+${x}` : x < 0 ? `\u2212${-x}` : '0');
const byZ = (z) => ELEMENTS.find((e) => e.z === z);
function find(q) {
  const t = String(q).trim().toLowerCase();
  if (!t) return null;
  if (/^\d+$/.test(t)) return byZ(+t) || null;
  return ELEMENTS.find((e) => e.s.toLowerCase() === t || e.n.toLowerCase() === t) || null;
}

/* Multiple-choice game (same behaviour as the lab-safety games). bank: [[prompt, answer, why], ...] */
function game(h, bank, { n = 8, label = 'Question' } = {}) {
  const pool = [...new Set(bank.map((b) => b[1]))];
  let set, i, score, opts, done;
  const start = () => { set = shuffle(bank).slice(0, n); i = 0; score = 0; draw(); };
  const draw = () => {
    if (i >= set.length) {
      h.innerHTML = `<div class="wd-body"><p class="wd-big">${score} of ${set.length} correct</p><p>${score === set.length ? 'Perfect.' : score >= set.length * 0.7 ? 'Good work.' : 'Review the lesson, then play again for a new set.'}</p><div><button type="button" class="btn btn-ghost btn-sm" data-r>Play again</button></div></div>`;
      return;
    }
    done = false;
    const [q, a] = set[i];
    opts = shuffle([a, ...shuffle(pool.filter((x) => x !== a)).slice(0, 3)]);
    h.innerHTML = `<div class="wd-body"><p class="wd-label">${label} ${i + 1} of ${set.length}</p><p class="wd-big">${q}</p>
      <div class="wd-btns" style="grid-template-columns:1fr">${opts.map((o, k) => `<button type="button" data-k="${k}">${o}</button>`).join('')}</div>
      <p class="wd-fb" role="status" aria-live="polite"></p></div>`;
  };
  h.onclick = (e) => {
    if (e.target.closest('[data-r]')) { start(); return; }
    if (e.target.closest('[data-n]')) { i++; draw(); return; }
    const b = e.target.closest('[data-k]');
    if (!b || done) return;
    done = true;
    const [, a, why] = set[i], ok = opts[+b.dataset.k] === a;
    if (ok) score++;
    h.querySelectorAll('[data-k]').forEach((x) => { x.disabled = true; if (opts[+x.dataset.k] === a) x.classList.add('right'); });
    if (!ok) b.classList.add('wrong');
    $(h, '.wd-fb').innerHTML = `<strong>${ok ? 'Correct.' : 'Not quite.'}</strong> ${why} <button type="button" class="btn btn-primary btn-sm" data-n>${i === set.length - 1 ? 'See score' : 'Next'}</button>`;
    $(h, '[data-n]').focus();
  };
  start();
}

const WHO = [
  ['Called the smallest pieces of matter \u201catomos\u201d, meaning uncuttable.', 'Democritus', 'The idea faded for centuries and returned in the 17th century.'],
  ['Proposed an atomic theory with four postulates (1803\u20131807).', 'Dalton', 'Dalton linked the idea of elements with the idea of atoms.'],
  ['Showed that cathode rays are streams of negative particles, the electron (1897).', 'Thomson', 'The rays were the same whatever the cathode was made of.'],
  ['Measured the charge of the electron (1909).', 'Millikan', 'Together with Thomson\u2019s charge-to-mass ratio, this gave the electron\u2019s mass.'],
  ['Proposed the nuclear model after the gold foil experiment.', 'Rutherford', 'Some alpha particles bounced back, which the plum-pudding model could not explain.'],
  ['Discovered the neutron (1932).', 'Chadwick', 'Rutherford had found the proton in 1919.'],
  ['Proposed the wave equation for the electron (1926).', 'Schr\u00f6dinger', 'It started quantum (wave) mechanics.'],
  ['Stated that no two electrons can share all four quantum numbers.', 'Pauli', 'This is the Pauli exclusion principle.'],
  ['Proposed that electrons have spin (1925).', 'Uhlenbeck and Goudsmit', 'Spin gave the fourth quantum number.'],
];
const SIMILAR = [
  ['Which element is most like magnesium?', 'Calcium', 'Same group (2A, the alkaline earth metals).'],
  ['Which element is most like lithium?', 'Sodium', 'Same group (1A, the alkali metals): soft, very reactive metals.'],
  ['Which element is most like helium?', 'Neon', 'Same group (8A, the noble gases): unreactive gases.'],
  ['Which element is most like fluorine?', 'Chlorine', 'Same group (7A, the halogens).'],
  ['Which element is most like oxygen?', 'Sulfur', 'Same group (6A).'],
  ['Which element is most like potassium?', 'Rubidium', 'Same group (1A).'],
];

/* ---------- Gold foil experiment ---------- */
function scatter(h) {
  const W = 340, H = 230, FX = 170, SP = 30;
  h.innerHTML = `<div class="wd-body"><canvas width="${W}" height="${H}" role="img" aria-label="Alpha particles hitting a gold foil"></canvas>
    <div class="wd-row">${field('Model of the atom', '<select data-m><option value="p">Plum pudding (Thomson)</option><option value="n">Nuclear (Rutherford)</option></select>')}</div>
    <div class="wd-btns"><button type="button" data-fire>Fire 100 particles</button><button type="button" data-reset>Reset counts</button></div>
    <p class="wd-out" role="status" aria-live="polite"></p><p class="wd-hint"></p></div>`;
  const cv = $(h, 'canvas'), g = cv.getContext('2d'), sel = $(h, '[data-m]');
  let c = { straight: 0, side: 0, back: 0 };
  const colors = () => { const s = getComputedStyle(cv); return { ink: s.getPropertyValue('--ink-3') || '#888', mod: s.getPropertyValue('--mod') || '#1b8a8f' }; };
  const foil = () => {
    const { ink, mod } = colors();
    g.clearRect(0, 0, W, H);
    g.globalAlpha = 0.18; g.fillStyle = ink; g.fillRect(FX - 8, 0, 16, H); g.globalAlpha = 1;
    for (let y = SP / 2; y < H; y += SP) {
      if (sel.value === 'p') { g.globalAlpha = 0.25; g.fillStyle = mod; g.beginPath(); g.arc(FX, y, 13, 0, 6.283); g.fill(); g.globalAlpha = 1; }
      g.fillStyle = sel.value === 'p' ? ink : mod; g.beginPath(); g.arc(FX, y, sel.value === 'p' ? 1.5 : 2.4, 0, 6.283); g.fill();
    }
    g.fillStyle = ink; g.fillText('source \u2192', 6, 14);
  };
  const report = () => {
    const t = c.straight + c.side + c.back;
    $(h, '.wd-out').innerHTML = t ? `Of ${t} particles: <strong>${c.straight}</strong> passed almost straight through, <strong>${c.side}</strong> were deflected by 10\u00b0 to 90\u00b0, <strong>${c.back}</strong> bounced back.` : 'No particles fired yet.';
    $(h, '.wd-hint').textContent = sel.value === 'p' ? 'A spread-out positive charge can only nudge a fast alpha particle a little. Nothing bounces back.' : 'Almost all the atom is empty space, so most particles pass through. A rare one meets the tiny, dense nucleus head-on and bounces back.';
  };
  const fire = () => {
    foil(); const { ink, mod } = colors();
    g.lineWidth = 1;
    for (let k = 0; k < 100; k++) {
      const y0 = 6 + Math.random() * (H - 12), cy = SP / 2 + Math.round((y0 - SP / 2) / SP) * SP, b = y0 - cy;
      const th = sel.value === 'p' ? (Math.random() - 0.5) * 0.05 : Math.sign(b || 1) * 2 * Math.atan(0.15 / Math.max(Math.abs(b), 1e-4));
      const deg = Math.abs(th) * 57.296, kind = deg < 10 ? 'straight' : deg < 90 ? 'side' : 'back';
      c[kind]++;
      g.strokeStyle = kind === 'straight' ? ink : kind === 'side' ? mod : '#d62d2d'; g.globalAlpha = kind === 'straight' ? 0.28 : 0.95; g.lineWidth = kind === 'straight' ? 1 : 1.6;
      g.beginPath(); g.moveTo(0, y0); g.lineTo(FX, y0); g.lineTo(FX + Math.cos(th) * 260, y0 + Math.sin(th) * 260); g.stroke();
    }
    g.globalAlpha = 1; report();
  };
  $(h, '[data-fire]').addEventListener('click', fire);
  $(h, '[data-reset]').addEventListener('click', () => { c = { straight: 0, side: 0, back: 0 }; foil(); report(); });
  sel.addEventListener('change', () => { c = { straight: 0, side: 0, back: 0 }; foil(); report(); });
  foil(); report();
}

/* ---------- Build an atom ---------- */
function atombuilder(h) {
  const st = { p: 6, n: 6, e: 6 };
  const PRESETS = [['Carbon-12', 6, 6, 6], ['Carbon-14', 6, 8, 6], ['Chlorine-37', 17, 20, 17], ['Sodium ion', 11, 12, 10], ['Chloride ion', 17, 18, 18], ['Gold-197', 79, 118, 79]];
  h.innerHTML = `<div class="wd-body"><div class="wd-row">
      ${field('Protons <output data-op></output>', '<input type="range" min="1" max="36" data-p>')}
      ${field('Neutrons <output data-on></output>', '<input type="range" min="0" max="60" data-n>')}
      ${field('Electrons <output data-oe></output>', '<input type="range" min="0" max="40" data-e>')}</div>
    <div class="wd-chips">${PRESETS.map((p, i) => `<button type="button" class="wd-chip" data-pre="${i}">${p[0]}</button>`).join('')}</div>
    <div class="wd-atom"><svg viewBox="0 0 220 220" role="img" aria-label="Bohr-style drawing of the atom"></svg><div class="wd-out wd-atomtext" role="status" aria-live="polite"></div></div>
    <p class="wd-hint">Change the protons and you change the element. Change the neutrons and you get another isotope. Change the electrons and you get an ion. Shells are a simplified Bohr-style picture.</p></div>`;
  const draw = () => {
    const { p, n, e } = st, el = byZ(p), A = p + n, q = p - e, sh = shells(e);
    $(h, '[data-op]').textContent = p; $(h, '[data-on]').textContent = n; $(h, '[data-oe]').textContent = e;
    let svg = `<circle cx="110" cy="110" r="${14 + Math.min(10, p / 8)}" fill="var(--mod)"/><text x="110" y="114" text-anchor="middle" font-size="10" font-weight="700" fill="var(--brand-ink)">${A}</text>`;
    sh.forEach((cnt, i) => {
      const r = 34 + i * 20;
      svg += `<circle cx="110" cy="110" r="${r}" fill="none" stroke="var(--line)" stroke-width="1.2"/>`;
      for (let k = 0; k < cnt; k++) { const a = -Math.PI / 2 + (2 * Math.PI * k) / cnt; svg += `<circle cx="${(110 + r * Math.cos(a)).toFixed(1)}" cy="${(110 + r * Math.sin(a)).toFixed(1)}" r="3" fill="var(--accent)"/>`; }
    });
    $(h, 'svg').innerHTML = svg;
    const kind = q === 0 ? 'a neutral atom' : q > 0 ? `a cation (charge ${q}+)` : `an anion (charge ${-q}\u2212)`;
    $(h, '.wd-atomtext').innerHTML = `<span class="wd-iso"><sup>${A}</sup><sub>${p}</sub>${el.s}${q ? `<sup class="wd-ch">${q > 0 ? (q > 1 ? q : '') + '+' : (q < -1 ? -q : '') + '\u2212'}</sup>` : ''}</span>
      <strong>${el.n}-${A}</strong><span>${kind}</span><span>${p} protons, ${n} neutrons, ${e} electrons</span>`;
  };
  const sync = () => { $(h, '[data-p]').value = st.p; $(h, '[data-n]').value = st.n; $(h, '[data-e]').value = st.e; draw(); };
  h.oninput = (ev) => { const k = ['p', 'n', 'e'].find((x) => ev.target.matches(`[data-${x}]`)); if (k) { st[k] = +ev.target.value; draw(); } };
  h.onclick = (ev) => { const b = ev.target.closest('[data-pre]'); if (b) { const [, p, n, e] = PRESETS[+b.dataset.pre]; Object.assign(st, { p, n, e }); sync(); } };
  sync();
}

/* ---------- Periodic table explorer ---------- */
const BLOCK_HUE = { s: 25, p: 140, d: 245, f: 320 };
function ptexplorer(h) {
  const pos = (e) => (e.g ? { c: e.g, r: e.p } : e.c === 'lanthanide' ? { c: 3 + (e.z - 57), r: 9 } : { c: 3 + (e.z - 89), r: 10 });
  let block = 'all', sel = null;
  h.innerHTML = `<div class="wd-body"><div class="wd-chips" role="group" aria-label="Highlight a block">${['all', 's', 'p', 'd', 'f'].map((b) => `<button type="button" class="wd-chip" data-b="${b}" aria-pressed="${b === 'all'}">${b === 'all' ? 'All elements' : b + '-block'}</button>`).join('')}</div>
    <div class="wd-scroll"><div class="wd-pt">${ELEMENTS.map((e) => { const q = pos(e); return `<button type="button" data-z="${e.z}" style="grid-column:${q.c};grid-row:${q.r};--h:${BLOCK_HUE[e.b] ?? 250}" aria-label="${e.n}, atomic number ${e.z}"><small>${e.z}</small>${e.s}</button>`; }).join('')}</div></div>
    <div class="wd-fb" role="status" aria-live="polite"><p>Select an element.</p></div></div>`;
  const paint = () => {
    h.querySelectorAll('[data-b]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.b === block)));
    h.querySelectorAll('.wd-pt button').forEach((b) => { const e = byZ(+b.dataset.z); b.classList.toggle('dim', block !== 'all' && e.b !== block); b.classList.toggle('on', sel === e.z); });
    if (!sel) return;
    const e = byZ(sel), c = condensed(e.z), cfg = electronConfig(e.z);
    $(h, '.wd-fb').innerHTML = `<p><strong>${e.n} (${e.s})</strong>, atomic number ${e.z}</p>
      <p>Group: ${e.g ?? 'none (f-block)'} \u00b7 Period: ${e.p} \u00b7 Block: ${e.b}-block \u00b7 ${e.c}</p>
      <p>Configuration: ${c.core ? `[${c.core}] ` : ''}${cfgHtml(c.rest)} \u00b7 Unpaired electrons: ${unpaired(cfg)}</p>`;
  };
  h.onclick = (ev) => {
    const b = ev.target.closest('[data-b]'); if (b) { block = b.dataset.b; paint(); return; }
    const t = ev.target.closest('[data-z]'); if (t) { sel = +t.dataset.z; paint(); }
  };
  paint();
}

/* ---------- Electron configuration ---------- */
function econfig(h) {
  h.innerHTML = `<div class="wd-body">${field('Element (symbol, name or atomic number)', '<input type="text" value="Fe" autocomplete="off" spellcheck="false" data-q>')}
    <div class="wd-out-col" role="status" aria-live="polite"></div></div>`;
  const out = $(h, '.wd-out-col');
  const run = () => {
    const e = find($(h, '[data-q]').value);
    if (!e) { out.innerHTML = '<p>Type an element such as Fe, selenium or 83.</p>'; return; }
    const cfg = electronConfig(e.z), c = condensed(e.z), le = lastElectron(cfg), n = unpaired(cfg);
    const row = (s) => `<div class="wd-orbrow"><span class="wd-orbname">${s.name}<sup>${s.count}</sup></span>${boxes(s).map((b) => `<span class="wd-box" aria-label="${b.up && b.down ? 'paired' : b.up ? 'one electron' : 'empty'}">${b.up ? '\u2191' : ''}${b.down ? '\u2193' : ''}</span>`).join('')}</div>`;
    out.innerHTML = `<p class="wd-big">${e.n} (${e.s}), Z = ${e.z}</p>
      <dl class="wd-grid"><div><dt>Full configuration</dt><dd>${cfgHtml(cfg)}</dd></div><div><dt>Condensed</dt><dd>${c.core ? `[${c.core}] ` : ''}${cfgHtml(c.rest)}</dd></div>
      <div><dt>Unpaired electrons</dt><dd>${n}</dd></div><div><dt>Last electron</dt><dd>(${le.n}, ${le.l}, ${sgn(le.ml)}, ${spin(le.ms)})<small class="wd-sub">n, l, m\u2097, m\u209b</small></dd></div></dl>
      <p class="wd-label">Orbital diagram${c.core ? ` (outside the [${c.core}] core)` : ''}</p>${c.rest.map(row).join('')}
      <p class="wd-hint">The last electron is in the ${le.name} subshell. ${EXCEPTIONS[e.z] ? `${e.n} is one of the well-known exceptions: its real configuration differs from the simple filling order, which this tool uses.` : 'Orbitals fill singly first (Hund\u2019s rule), spin up, then pair up with spin down.'}</p>`;
  };
  $(h, '[data-q]').addEventListener('input', run); run();
}

/* ---------- Quantum number checker ---------- */
function qncheck(h) {
  h.innerHTML = `<div class="wd-body"><div class="wd-row">${field('n', '<input type="text" inputmode="numeric" value="3" data-n>')}${field('l', '<input type="text" inputmode="numeric" value="2" data-l>')}
    ${field('m\u2097', '<input type="text" inputmode="numeric" value="-2" data-m>')}${field('m\u209b', '<select data-s><option value="0.5">+1/2</option><option value="-0.5">\u22121/2</option></select>')}</div>
    <p class="wd-out" role="status" aria-live="polite"></p><p class="wd-hint"></p></div>`;
  const run = () => {
    const v = (k) => { const t = $(h, `[data-${k}]`).value.trim().replace('\u2212', '-'); return /^[+-]?\d+(\.\d+)?$/.test(t) ? Number(t) : NaN; };
    const n = v('n'), l = v('l'), m = v('m'), s = +$(h, '[data-s]').value, r = checkQuantum(n, l, m, s);
    $(h, '.wd-out').innerHTML = `<strong>(${$(h, '[data-n]').value}, ${$(h, '[data-l]').value}, ${$(h, '[data-m]').value}, ${spin(s)}): ${r.valid ? 'VALID' : 'INVALID'}</strong>`;
    $(h, '.wd-hint').textContent = r.valid ? `${r.reason} This electron is in a ${r.subshell} orbital.` : r.reason;
  };
  h.addEventListener('input', run); run();
}

export const ATOM_WIDGETS = {
  scatter, atombuilder, ptexplorer, econfig, qncheck,
  whodid: (h) => game(h, WHO, { n: 7, label: 'Who' }),
  similar: (h) => game(h, SIMILAR, { n: 5, label: 'Question' }),
};
