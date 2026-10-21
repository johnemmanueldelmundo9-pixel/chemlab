// Interactive periodic table: click (or press Enter on) any element to open its detail card.
// Deep links: #/periodic-table/26 opens iron. Data lives in src/data/elements.js.
import { ELEMENTS } from '../data/elements.js';

const CATS = {
  alkali: ['Alkali metal', 25], alkaline: ['Alkaline earth metal', 70], halogen: ['Halogen', 100],
  nonmetal: ['Reactive nonmetal', 140], metalloid: ['Metalloid', 170], post: ['Post-transition metal', 205],
  transition: ['Transition metal', 245], lanthanide: ['Lanthanide', 285], actinide: ['Actinide', 320], noble: ['Noble gas', 355],
};
const STATES = { solid: ['Solid', 245], liquid: ['Liquid', 170], gas: ['Gas', 25], unknown: ['Unknown', null] };
const BLOCKS = { s: ['s-block', 25], p: ['p-block', 140], d: ['d-block', 245], f: ['f-block', 320] };
const MODES = {
  category: { label: 'Category', map: CATS, key: (e) => e.c },
  state: { label: 'State at 25 °C', map: STATES, key: (e) => e.st },
  block: { label: 'Block', map: BLOCKS, key: (e) => e.b },
};
const STATE_TEXT = { solid: 'Solid', liquid: 'Liquid', gas: 'Gas', unknown: 'Unknown (too few atoms ever made to tell)' };

const MINUS = '\u2212';
const NA = '<span class="na" title="Not available or not known">\u2014</span>';
const trim = (x, d = 1) => String(+x.toFixed(d)).replace('-', MINUS);
const sgn = (n) => (n > 0 ? `+${n}` : n < 0 ? `${MINUS}${Math.abs(n)}` : '0');
const sig = (v, p) => String(Number(v.toPrecision(p)));
const fmtK = (K) => `${trim(K - 273.15)} \u00b0C <small>(${trim(K)} K)</small>`;
const massShort = (e) => (e.mb ? `[${e.m}]` : sig(e.m, 5));
const massFull = (e) => (e.mb ? `[${e.m}]` : String(e.m));
const econfHtml = (s) => s.replace(/(\d[spdf])(\d+)/g, '$1<sup>$2</sup>');
const byZ = (z) => ELEMENTS[z - 1];

const state = { mode: 'category', filter: null, query: '', z: null };
let root, dlg, cells = new Map(), coords = [];

function pos(e) {
  if (e.g) return { col: e.g, row: e.p + 1 };
  if (e.c === 'lanthanide') return { col: 3 + (e.z - 57), row: 10 };
  return { col: 3 + (e.z - 89), row: 11 };
}
function hueFor(e) {
  const m = MODES[state.mode];
  const v = m.map[m.key(e)];
  return v ? v[1] : null;
}
const hueStyle = (h) => (h == null ? '--h:250;--c:0.008' : `--h:${h}`);

/* ---------------- building the page ---------------- */
export function renderPeriodic(outlet, arg) {
  if (outlet.querySelector('.pt-page')) { sync(arg); return false; } // already showing: just open/close the card
  state.filter = null; state.query = ''; state.z = null;
  outlet.innerHTML = `
    <section class="pt-page">
      <div class="container">
        <a class="back" href="#/">\u2190 Home</a>
        <p class="eyebrow">Reference</p>
        <h1>Periodic table</h1>
        <p class="pt-lead">All 118 elements. Click any element to see its atomic mass, oxidation states, electron configuration, melting and boiling points, and more.</p>
        <div class="pt-tools">
          <label class="pt-search"><span class="sr-only">Search elements</span>
            <input type="search" id="pt-q" placeholder="Search by name, symbol or number" autocomplete="off">
          </label>
          <div class="pt-modes" role="group" aria-label="Colour the table by">
            ${Object.entries(MODES).map(([k, m]) => `<button type="button" data-mode="${k}" aria-pressed="${k === state.mode}">${m.label}</button>`).join('')}
          </div>
        </div>
        <div class="pt-legend" role="group" aria-label="Legend: click to highlight a group"></div>
        <p class="pt-count" id="pt-count" aria-live="polite"></p>
        <div class="pt-scroll" tabindex="-1"><div class="pt-grid" id="pt-grid"></div></div>
        <p class="pt-swipe">Swipe sideways to see the whole table.</p>
        <p class="pt-note">Data comes from the open-source mendeleev database and is checked against standard references. Values can differ a little between textbooks, so follow the table your teacher uses for exams. Bracketed masses are the mass number of the most stable isotope.</p>
      </div>
    </section>`;
  root = outlet.querySelector('.pt-page');
  buildGrid();
  buildDialog();
  paint();
  root.querySelector('#pt-q').addEventListener('input', (e) => { state.query = e.target.value.trim().toLowerCase(); paint(); });
  root.querySelector('#pt-q').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { const first = matches()[0]; if (first) open(first.z); }
  });
  root.querySelector('.pt-modes').addEventListener('click', (e) => {
    const b = e.target.closest('[data-mode]'); if (!b) return;
    state.mode = b.dataset.mode; state.filter = null;
    root.querySelectorAll('.pt-modes button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    paint();
  });
  root.querySelector('.pt-legend').addEventListener('click', (e) => {
    const b = e.target.closest('[data-key]'); if (!b) return;
    state.filter = state.filter === b.dataset.key ? null : b.dataset.key; paint();
  });
  sync(arg);
  return true;
}

function buildGrid() {
  const grid = root.querySelector('#pt-grid');
  cells = new Map(); coords = [];
  let html = '';
  for (let g = 1; g <= 18; g++) html += `<span class="pt-gh" style="grid-column:${g};grid-row:1">${g}</span>`;
  html += `<div class="pt-hint" aria-hidden="true"><strong>Pick an element</strong><span>Click any tile for its full details. Use the arrow keys to move around.</span></div>`;
  html += `<span class="pt-ph" style="grid-column:3;grid-row:7">57\u201371</span><span class="pt-ph" style="grid-column:3;grid-row:8">89\u2013103</span>`;
  html += `<span class="pt-fl" style="grid-column:1/3;grid-row:10">Lanthanides</span><span class="pt-fl" style="grid-column:1/3;grid-row:11">Actinides</span>`;
  for (const e of ELEMENTS) {
    const { col, row } = pos(e);
    coords.push({ z: e.z, col, row });
    html += `<button type="button" class="el" data-z="${e.z}" style="grid-column:${col};grid-row:${row}" aria-haspopup="dialog" aria-label="${e.n}, atomic number ${e.z}">
      <span class="el-z">${e.z}</span><span class="el-s">${e.s}</span><span class="el-n">${e.n}</span><span class="el-m">${massShort(e)}</span></button>`;
  }
  grid.innerHTML = html;
  grid.querySelectorAll('.el').forEach((b) => cells.set(+b.dataset.z, b));
  grid.addEventListener('click', (e) => { const b = e.target.closest('.el'); if (b) open(+b.dataset.z); });
  grid.addEventListener('keydown', (e) => {
    const b = e.target.closest('.el'); if (!b) return;
    const dir = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }[e.key];
    if (!dir) return;
    e.preventDefault();
    const me = coords[+b.dataset.z - 1];
    let best = null, bestD = Infinity;
    for (const c of coords) {
      const dx = c.col - me.col, dy = c.row - me.row;
      if (dir[0] ? Math.sign(dx) !== dir[0] : Math.sign(dy) !== dir[1]) continue;
      const d = dir[0] ? Math.abs(dx) * 10 + Math.abs(dy) : Math.abs(dy) * 10 + Math.abs(dx);
      if (d < bestD) { bestD = d; best = c; }
    }
    if (best) cells.get(best.z).focus();
  });
}

function matches() {
  const q = state.query, m = MODES[state.mode];
  return ELEMENTS.filter((e) => {
    const okQ = !q || e.n.toLowerCase().includes(q) || e.s.toLowerCase() === q || String(e.z) === q || (e.alt || '').toLowerCase().includes(q);
    const okF = !state.filter || m.key(e) === state.filter;
    return okQ && okF;
  });
}

function paint() {
  const m = MODES[state.mode];
  const ok = new Set(matches().map((e) => e.z));
  for (const e of ELEMENTS) {
    const b = cells.get(e.z);
    b.style.cssText = `grid-column:${pos(e).col};grid-row:${pos(e).row};${hueStyle(hueFor(e))}`;
    b.classList.toggle('dim', !ok.has(e.z));
  }
  root.querySelector('.pt-legend').innerHTML = Object.entries(m.map).map(([k, [label, h]]) =>
    `<button type="button" class="lg" data-key="${k}" aria-pressed="${state.filter === k}" style="${hueStyle(h)}"><i></i>${label}</button>`).join('');
  const n = ok.size;
  root.querySelector('#pt-count').textContent = (state.query || state.filter) ? `${n} element${n === 1 ? '' : 's'} highlighted` : '';
}

/* ---------------- detail card ---------------- */
function buildDialog() {
  dlg?.remove();
  dlg = document.createElement('dialog');
  dlg.className = 'el-dialog';
  dlg.setAttribute('aria-label', 'Element details');
  document.body.append(dlg);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => {
    state.z = null;
    if (/^#\/periodic-table\/\d/.test(location.hash)) history.replaceState(null, '', '#/periodic-table');
  });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1);
  });
  dlg.addEventListener('click', (e) => {
    const b = e.target.closest('[data-step]'); if (b) step(+b.dataset.step);
    if (e.target.closest('.el-x')) dlg.close();
  });
}

function sync(arg) {
  const z = +arg;
  if (z >= 1 && z <= 118) show(z);
  else if (dlg?.open) dlg.close();
}
function open(z) { location.hash = `#/periodic-table/${z}`; }
function step(d) {
  const z = ((state.z - 1 + d + 118) % 118) + 1;
  history.replaceState(null, '', `#/periodic-table/${z}`);
  show(z);
}
function show(z) {
  state.z = z;
  dlg.innerHTML = detail(byZ(z));
  if (!dlg.open) dlg.showModal();
  dlg.querySelector('.el-body').scrollTop = 0;
  cells.get(z)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

const row = (label, value, extra = '') => `<div class="fact"><dt>${label}</dt><dd>${value ?? NA}${extra}</dd></div>`;
const oxChip = (n, main) => `<span class="ox ${main ? 'main' : ''}">${sgn(n)}</span>`;

function bohr(e) {
  const n = e.sh.length, size = 200, c = size / 2;
  const rad = (i) => (n === 1 ? 52 : 26 + (i * 68) / (n - 1));
  let svg = `<svg class="bohr" viewBox="0 0 ${size} ${size}" role="img" aria-label="Bohr model: ${e.sh.join(', ')} electrons per shell">`;
  svg += `<circle cx="${c}" cy="${c}" r="15" class="nuc"/><text x="${c}" y="${c + 4}" text-anchor="middle" class="nuc-t">${e.z}+</text>`;
  e.sh.forEach((cnt, i) => {
    const r = rad(i);
    svg += `<circle cx="${c}" cy="${c}" r="${r.toFixed(1)}" class="shell"/>`;
    for (let k = 0; k < cnt; k++) {
      const a = -Math.PI / 2 + (2 * Math.PI * k) / cnt;
      svg += `<circle cx="${(c + r * Math.cos(a)).toFixed(1)}" cy="${(c + r * Math.sin(a)).toFixed(1)}" r="2.7" class="elec"/>`;
    }
  });
  return svg + '</svg>';
}

function detail(e) {
  const [catLabel] = CATS[e.c];
  const prev = byZ(e.z === 1 ? 118 : e.z - 1), next = byZ(e.z === 118 ? 1 : e.z + 1);
  const gas = e.st === 'gas';
  const dens = e.d == null ? null : gas ? `${sig(e.d * 1000, 3)} g/L <small>(gas, 0 \u00b0C, 1 atm)</small>` : `${sig(e.d, 4)} g/cm\u00b3`;
  const ie = e.ie == null ? null : `${sig(e.ie, 4)} eV <small>(${Math.round(e.ie * 96.485)} kJ/mol)</small>`;
  const when = e.by && e.yr ? `${e.by}, ${e.yr}` : e.by || (e.yr ? String(e.yr) : null);
  const heavy = e.z >= 104
    ? `<p class="el-warn">Elements this heavy last only a fraction of a second, so most values here are predictions or estimates, and mass numbers differ between sources.</p>` : '';
  return `
    <div class="el-head" style="--h:${CATS[e.c][1]}">
      <button type="button" class="el-step" data-step="-1" aria-label="Previous element: ${prev.n}">\u2039</button>
      <div class="el-tile"><span class="t-z">${e.z}</span><span class="t-s">${e.s}</span><span class="t-n">${e.n}</span><span class="t-m">${massShort(e)}</span></div>
      <div class="el-title">
        <h2>${e.n}</h2>
        <p class="chips"><span class="chip-cat" style="--h:${CATS[e.c][1]}">${catLabel}</span><span class="chip-state">${STATE_TEXT[e.st].split(' (')[0]} at 25 \u00b0C</span></p>
      </div>
      <button type="button" class="el-step" data-step="1" aria-label="Next element: ${next.n}">\u203a</button>
      <button type="button" class="el-x" aria-label="Close">\u00d7</button>
    </div>
    <div class="el-body">
      ${heavy}
      <div class="el-cols">
        <section>
          <h3>Atom</h3>
          <dl class="facts">
            ${row('Atomic number', e.z)}
            ${row('Atomic mass', `${massFull(e)} u`, e.mb ? '<small class="sub">Mass number of the most stable isotope (no stable isotopes)</small>' : '')}
            ${row('Group', e.g ?? 'Not numbered (f-block)')}
            ${row('Period', e.p)}
            ${row('Block', `${e.b}-block`)}
            ${row('Electron configuration', econfHtml(e.e))}
            ${row('Electrons per shell', e.sh.join(', '))}
          </dl>
        </section>
        <figure class="bohr-wrap">${bohr(e)}<figcaption>Electrons per shell: ${e.sh.join(' \u00b7 ')}</figcaption></figure>
      </div>
      <section>
        <h3>Oxidation states</h3>
        <div class="ox-row">
          ${e.ox.length ? e.ox.map((n) => oxChip(n, true)).join('') : '<span class="na-text">No common oxidation states</span>'}
          ${e.ox2.map((n) => oxChip(n, false)).join('')}
        </div>
        <p class="ox-key"><i class="ox-dot main"></i> most common <i class="ox-dot"></i> other known states</p>
      </section>
      <div class="el-cols">
        <section>
          <h3>Physical properties</h3>
          <dl class="facts">
            ${row('State at 25 \u00b0C', STATE_TEXT[e.st])}
            ${row('Melting point', e.mp == null ? null : fmtK(e.mp))}
            ${row('Boiling point', e.bp == null ? null : fmtK(e.bp))}
            ${row('Density', dens)}
          </dl>
          ${e.note ? `<p class="el-note">${e.note}</p>` : ''}
        </section>
        <section>
          <h3>Atomic properties</h3>
          <dl class="facts">
            ${row('Electronegativity (Pauling)', e.en == null ? null : e.en)}
            ${row('Atomic radius', e.r == null ? null : `${e.r} pm`)}
            ${row('1st ionisation energy', ie)}
            ${row('Electron affinity', e.ea == null ? null : `${sig(e.ea, 3)} eV`)}
          </dl>
        </section>
      </div>
      <section>
        <h3>About</h3>
        <dl class="facts wide">
          ${row('Discovered', when ?? NA)}
          ${row('Name origin', e.org)}
          ${row('Uses', e.use)}
        </dl>
      </section>
    </div>`;
}
