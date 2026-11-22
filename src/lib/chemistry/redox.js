// Redox and electrochemistry maths: oxidation numbers, half-reaction balancing, cell potentials, Nernst, electrolysis. Pure functions (no DOM).
import { parseFormula } from './molarMass.js';
import { R_J, R_L, F } from './thermo.js';

const SYMBOLS = new Set('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr'.split(' '));
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const lcm = (a, b) => (a * b) / gcd(a, b);

/* ---------- reading ions and species ---------- */
export function parseIon(input) {
  let s = String(input).trim()
    .replace(/[\u2080-\u2089]/g, (c) => String(c.charCodeAt(0) - 0x2080)).replace(/[\u2212\u2013]/g, '-')
    .replace(/[\u2070\u00b9\u00b2\u00b3\u2074-\u2079]/g, (c) => '^' + '0123456789'['\u2070\u00b9\u00b2\u00b3\u2074\u2075\u2076\u2077\u2078\u2079'.indexOf(c)])
    .replace(/\u207a/g, '+').replace(/\u207b/g, '-');
  s = s.replace(/\((s|l|g|aq)\)$/i, '');
  let charge = 0, m;
  // "Fe3+", "Cu2+", "S2-", "N3-": a lone element symbol, then a digit, then a sign, means that charge (not a subscript).
  if ((m = s.match(/^([A-Z][a-z]?)(\d)([+-])$/)) && !['H', 'C', 'F', 'Cl', 'Br', 'I'].includes(m[1]) && (!['N', 'O', 'S', 'P', 'Se'].includes(m[1]) || m[3] === '-')) return { formula: m[1], counts: { [m[1]]: 1 }, charge: (m[3] === '+' ? 1 : -1) * +m[2], label: labelOf(m[1], (m[3] === '+' ? 1 : -1) * +m[2]) };
  if ((m = s.match(/^(.*?)\s*[\^(\s]\s*(\d+)\s*([+-])\s*\)?$/))) { s = m[1]; charge = (m[3] === '+' ? 1 : -1) * +m[2]; }
  else if ((m = s.match(/^(.*?)\s*[\^(\s]\s*([+-])\s*(\d+)\s*\)?$/))) { s = m[1]; charge = (m[2] === '+' ? 1 : -1) * +m[3]; }
  else if ((m = s.match(/^(.*?)\s*\^?\(?([+-]+)\)?$/))) { s = m[1]; charge = (m[2][0] === '+' ? 1 : -1) * m[2].length; }
  const formula = s.replace(/\s/g, ''), counts = formula ? parseFormula(formula) : null;
  return counts && Object.keys(counts).every((e) => SYMBOLS.has(e)) ? { formula, counts, charge, label: `${formula}${charge ? (Math.abs(charge) > 1 ? `^${Math.abs(charge)}` : '^') + (charge > 0 ? '+' : '-') : ''}`.replace('^+', '+').replace('^-', '-') } : null;
}
// Plain text label such as "Cr2O7^2-" or "Fe3+" or "H2O".
export function labelOf(formula, charge) { return !charge ? formula : Math.abs(charge) === 1 ? `${formula}${charge > 0 ? '+' : '-'}` : `${formula}${Math.abs(charge)}${charge > 0 ? '+' : '-'}`; }

/* ---------- oxidation numbers ---------- */
const FIXED = { F: -1, Li: 1, Na: 1, K: 1, Rb: 1, Cs: 1, Be: 2, Mg: 2, Ca: 2, Sr: 2, Ba: 2, Al: 3, Zn: 2, Ag: 1, Cd: 2, O: -2, H: 1 };
const SOLVE = (sp, fixed, unknown) => (sp.charge - Object.entries(sp.counts).reduce((t, [el, n]) => t + (el === unknown ? 0 : fixed[el] * n), 0)) / sp.counts[unknown];
// Returns { element: oxidation number } (the average over atoms of that element) or null when it cannot be decided.
export function oxidationNumbers(sp) {
  const els = Object.keys(sp.counts);
  if (els.length === 1) return { [els[0]]: sp.charge / sp.counts[els[0]] };
  const fixed = { ...FIXED }, unk = els.filter((e) => !(e in FIXED));
  if (unk.length === 1) return { ...Object.fromEntries(els.filter((e) => e !== unk[0]).map((e) => [e, fixed[e]])), [unk[0]]: SOLVE(sp, fixed, unk[0]) };
  if (unk.length === 0) {
    const total = els.reduce((t, e) => t + fixed[e] * sp.counts[e], 0);
    if (Math.abs(total - sp.charge) < 1e-9) return Object.fromEntries(els.map((e) => [e, fixed[e]]));
    const relax = els.includes('O') ? 'O' : els.includes('H') ? 'H' : null;                      // peroxides, OF2, hydrides
    if (relax) return { ...Object.fromEntries(els.map((e) => [e, fixed[e]])), [relax]: SOLVE(sp, fixed, relax) };
    return null;
  }
  const hal = unk.filter((e) => ['Cl', 'Br', 'I'].includes(e) && !els.includes('O') && !els.includes('F'));
  if (unk.length - hal.length === 1) { const f2 = { ...fixed }; hal.forEach((e) => { f2[e] = -1; }); const u = unk.find((e) => !hal.includes(e)); return { ...Object.fromEntries(els.filter((e) => e !== u).map((e) => [e, f2[e]])), [u]: SOLVE(sp, f2, u) }; }
  return null;
}

/* ---------- balancing a half-reaction in acid ---------- */
const H2O = parseIon('H2O'), HP = parseIon('H+');
const add = (list, sp, n) => { if (n <= 0) return; const f = list.find((x) => x.sp.label === sp.label); if (f) f.coef += n; else list.push({ sp, coef: n }); };
export function halfReaction(R, P) {
  const common = Object.keys(R.counts).filter((e) => e in P.counts && e !== 'H' && e !== 'O');
  const main = common[0] || (R.counts.O && P.counts.O ? 'O' : R.counts.H && P.counts.H ? 'H' : null);
  if (!main) return null;
  const a = R.counts[main], b = P.counts[main], L = lcm(a, b), nR = L / a, nP = L / b;
  const left = [{ sp: R, coef: nR }], right = [{ sp: P, coef: nP }];
  const o = (sp, n) => (sp.counts.O || 0) * n;
  if (main !== 'O') { const d = o(R, nR) - o(P, nP); if (d > 0) add(right, H2O, d); else add(left, H2O, -d); }
  const hOf = (list) => list.reduce((t, x) => t + (x.sp.counts.H || 0) * x.coef, 0);
  if (main !== 'H') { const d = hOf(left) - hOf(right); if (d > 0) add(right, HP, d); else add(left, HP, -d); }
  const ch = (list) => list.reduce((t, x) => t + x.sp.charge * x.coef, 0), d = ch(left) - ch(right);
  return { left, right, e: Math.abs(d), kind: d > 0 ? 'reduction' : 'oxidation' };
}

/* ---------- balancing a whole redox equation ---------- */
const eqText = (left, right) => `${left.map((x) => `${x.coef > 1 ? x.coef : ''}${x.sp.label}`).join(' + ')} -> ${right.map((x) => `${x.coef > 1 ? x.coef : ''}${x.sp.label}`).join(' + ')}`;
const sideCount = (side, key) => side.reduce((t, x) => t + (key === 'charge' ? x.sp.charge * x.coef : (x.sp.counts[key] || 0) * x.coef), 0);
export function balanceRedox(text, medium = 'acidic') {
  const t = String(text).trim().split(/\s*(?:->|=>|\u2192|=)\s*/);
  if (t.length !== 2) return { ok: false, error: 'Write the equation like "MnO4- + Fe2+ -> Mn2+ + Fe3+", with a space on each side of every +.' };
  const side = (s) => s.split(/\s+\+\s+/).map((x) => parseIon(x.replace(/^\d+\s*(?=[A-Za-z(])/, '')));
  const R = side(t[0]), P = side(t[1]);
  if ([...R, ...P].some((x) => !x)) return { ok: false, error: 'Could not read one of the formulas. Use capital letters for elements and write charges like Fe3+, MnO4- or Cr2O7 2-.' };
  const on = new Map(); for (const sp of [...R, ...P]) { const n = oxidationNumbers(sp); if (!n) return { ok: false, error: `Could not assign oxidation numbers to ${sp.label}. Write the ions separately (for example Cu2+ and SO4 2-).` }; on.set(sp.label, n); }
  const pure = (sp) => Object.keys(sp.counts).length === 1;
  const cands = [];
  for (const r of R) for (const p of P) for (const e of Object.keys(r.counts)) {
    if (!(e in p.counts) || on.get(r.label)[e] === on.get(p.label)[e]) continue;
    if ((e === 'H' || e === 'O') && !(pure(r) || pure(p) || (e === 'O' && (on.get(r.label).O !== -2 || on.get(p.label).O !== -2)))) continue;
    if (r.label === 'H2O' || p.label === 'H2O' || r.label === 'OH-' || p.label === 'OH-') { if (!(pure(r) || pure(p) || on.get(r.label)[e] === -1 || on.get(p.label)[e] === -1)) continue; }
    cands.push({ r, p, e, up: on.get(p.label)[e] > on.get(r.label)[e] });
  }
  if (cands.length < 2) return { ok: false, error: 'Fewer than two species change oxidation number. A redox reaction needs one species oxidized and one reduced; check the equation.' };
  if (cands.length > 2 || cands.every((c) => c.up) || cands.every((c) => !c.up)) return { ok: false, error: 'This equation has more than one oxidized or reduced species, which this tool cannot split into two half-reactions. Balance the half-reactions separately.' };
  const halves = cands.map((c) => ({ ...halfReaction(c.r, c.p), c })), ox = halves.find((h) => h.c.up), red = halves.find((h) => !h.c.up);
  if (!ox || !red || ox.left === undefined) return { ok: false, error: 'Could not balance these half-reactions.' };
  const L = lcm(ox.e, red.e), mo = L / ox.e, mr = L / red.e;
  // add the two half-reactions and cancel
  const net = new Map(), put = (list, sign, mult) => list.forEach((x) => { const k = x.sp.label; net.set(k, { sp: x.sp, n: (net.get(k)?.n || 0) + sign * x.coef * mult }); });
  put(ox.left, 1, mo); put(ox.right, -1, mo); put(red.left, 1, mr); put(red.right, -1, mr);
  const steps = { ox, red, mo, mr, electrons: L };
  let left = [...net.values()].filter((x) => x.n > 0).map((x) => ({ sp: x.sp, coef: x.n })), right = [...net.values()].filter((x) => x.n < 0).map((x) => ({ sp: x.sp, coef: -x.n }));
  if (medium === 'basic') {
    const hl = left.find((x) => x.sp.label === 'H+'), hr = right.find((x) => x.sp.label === 'H+'), k = (hl || hr)?.coef || 0;
    if (k) {
      steps.hydroxide = k;
      const drop = (list) => list.filter((x) => x.sp.label !== 'H+'), OH = parseIon('OH-');
      if (hl) { left = drop(left); add(left, H2O, k); add(right, OH, k); } else { right = drop(right); add(right, H2O, k); add(left, OH, k); }
      const wl = left.find((x) => x.sp.label === 'H2O'), wr = right.find((x) => x.sp.label === 'H2O');
      if (wl && wr) { const m = Math.min(wl.coef, wr.coef); wl.coef -= m; wr.coef -= m; left = left.filter((x) => x.coef > 0); right = right.filter((x) => x.coef > 0); }
    }
  }
  const g = [...left, ...right].reduce((a, x) => gcd(a, x.coef), 0) || 1;
  left = left.map((x) => ({ ...x, coef: x.coef / g })); right = right.map((x) => ({ ...x, coef: x.coef / g }));
  const order = (list, input) => [...list].sort((a, b) => { const ia = input.findIndex((s) => s.label === a.sp.label), ib = input.findIndex((s) => s.label === b.sp.label); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); });
  left = order(left, R); right = order(right, P);
  for (const k of [...new Set([...left, ...right].flatMap((x) => Object.keys(x.sp.counts)))]) if (sideCount(left, k) !== sideCount(right, k)) return { ok: false, error: `Could not balance ${k}. Check the equation (are all the species that take part included?).` };
  if (sideCount(left, 'charge') !== sideCount(right, 'charge')) return { ok: false, error: 'Charge did not balance. Check the equation.' };
  return { ok: true, left, right, text: eqText(left, right), steps, on: Object.fromEntries(on), oxidized: ox.c, reduced: red.c, medium, g };
}

/* ---------- standard reduction potentials (25 degC, 1 M, 1 atm) ---------- */
const hf = (s) => s.split(' + ').map((x) => { const m = x.match(/^(\d+)?\s*([A-Za-z0-9+\-^()]+?)(?:\((s|l|g|aq)\))?$/); return [m[2], m[1] ? +m[1] : 1, m[3] || 'aq']; });
const half = (id, label, E, n, lhs, rhs) => ({ id, label, E, n, left: hf(lhs), right: hf(rhs) });
export const POTENTIALS = [
  half('Li', 'Li\u207a + e\u207b \u2192 Li', -3.04, 1, 'Li+', 'Li(s)'), half('K', 'K\u207a + e\u207b \u2192 K', -2.93, 1, 'K+', 'K(s)'), half('Ca', 'Ca\u00b2\u207a + 2e\u207b \u2192 Ca', -2.87, 2, 'Ca2+', 'Ca(s)'),
  half('Na', 'Na\u207a + e\u207b \u2192 Na', -2.71, 1, 'Na+', 'Na(s)'), half('Mg', 'Mg\u00b2\u207a + 2e\u207b \u2192 Mg', -2.37, 2, 'Mg2+', 'Mg(s)'), half('Al', 'Al\u00b3\u207a + 3e\u207b \u2192 Al', -1.66, 3, 'Al3+', 'Al(s)'),
  half('Mn', 'Mn\u00b2\u207a + 2e\u207b \u2192 Mn', -1.18, 2, 'Mn2+', 'Mn(s)'), half('H2Oalk', '2H\u2082O + 2e\u207b \u2192 H\u2082 + 2OH\u207b', -0.83, 2, '2H2O(l)', 'H2(g) + 2OH-'), half('Zn', 'Zn\u00b2\u207a + 2e\u207b \u2192 Zn', -0.76, 2, 'Zn2+', 'Zn(s)'),
  half('Cr', 'Cr\u00b3\u207a + 3e\u207b \u2192 Cr', -0.74, 3, 'Cr3+', 'Cr(s)'), half('Fe', 'Fe\u00b2\u207a + 2e\u207b \u2192 Fe', -0.44, 2, 'Fe2+', 'Fe(s)'), half('Cd', 'Cd\u00b2\u207a + 2e\u207b \u2192 Cd', -0.40, 2, 'Cd2+', 'Cd(s)'),
  half('Co', 'Co\u00b2\u207a + 2e\u207b \u2192 Co', -0.28, 2, 'Co2+', 'Co(s)'), half('Ni', 'Ni\u00b2\u207a + 2e\u207b \u2192 Ni', -0.26, 2, 'Ni2+', 'Ni(s)'), half('Sn', 'Sn\u00b2\u207a + 2e\u207b \u2192 Sn', -0.14, 2, 'Sn2+', 'Sn(s)'),
  half('Pb', 'Pb\u00b2\u207a + 2e\u207b \u2192 Pb', -0.13, 2, 'Pb2+', 'Pb(s)'), half('H', '2H\u207a + 2e\u207b \u2192 H\u2082', 0.00, 2, '2H+', 'H2(g)'), half('Sn4', 'Sn\u2074\u207a + 2e\u207b \u2192 Sn\u00b2\u207a', 0.15, 2, 'Sn4+', 'Sn2+'),
  half('Cu', 'Cu\u00b2\u207a + 2e\u207b \u2192 Cu', 0.34, 2, 'Cu2+', 'Cu(s)'), half('O2alk', 'O\u2082 + 2H\u2082O + 4e\u207b \u2192 4OH\u207b', 0.40, 4, 'O2(g) + 2H2O(l)', '4OH-'), half('Cu1', 'Cu\u207a + e\u207b \u2192 Cu', 0.52, 1, 'Cu+', 'Cu(s)'),
  half('I2', 'I\u2082 + 2e\u207b \u2192 2I\u207b', 0.54, 2, 'I2(s)', '2I-'), half('Fe3', 'Fe\u00b3\u207a + e\u207b \u2192 Fe\u00b2\u207a', 0.77, 1, 'Fe3+', 'Fe2+'), half('Ag', 'Ag\u207a + e\u207b \u2192 Ag', 0.80, 1, 'Ag+', 'Ag(s)'),
  half('Hg', 'Hg\u00b2\u207a + 2e\u207b \u2192 Hg', 0.85, 2, 'Hg2+', 'Hg(l)'), half('NO3', 'NO\u2083\u207b + 4H\u207a + 3e\u207b \u2192 NO + 2H\u2082O', 0.96, 3, 'NO3- + 4H+', 'NO(g) + 2H2O(l)'), half('Br2', 'Br\u2082 + 2e\u207b \u2192 2Br\u207b', 1.07, 2, 'Br2(l)', '2Br-'),
  half('O2', 'O\u2082 + 4H\u207a + 4e\u207b \u2192 2H\u2082O', 1.23, 4, 'O2(g) + 4H+', '2H2O(l)'), half('Cr2O7', 'Cr\u2082O\u2087\u00b2\u207b + 14H\u207a + 6e\u207b \u2192 2Cr\u00b3\u207a + 7H\u2082O', 1.33, 6, 'Cr2O7^2- + 14H+', '2Cr3+ + 7H2O(l)'),
  half('Cl2', 'Cl\u2082 + 2e\u207b \u2192 2Cl\u207b', 1.36, 2, 'Cl2(g)', '2Cl-'), half('Au', 'Au\u00b3\u207a + 3e\u207b \u2192 Au', 1.50, 3, 'Au3+', 'Au(s)'), half('MnO4', 'MnO\u2084\u207b + 8H\u207a + 5e\u207b \u2192 Mn\u00b2\u207a + 4H\u2082O', 1.51, 5, 'MnO4- + 8H+', 'Mn2+ + 4H2O(l)'),
  half('H2O2', 'H\u2082O\u2082 + 2H\u207a + 2e\u207b \u2192 2H\u2082O', 1.78, 2, 'H2O2(aq) + 2H+', '2H2O(l)'), half('F2', 'F\u2082 + 2e\u207b \u2192 2F\u207b', 2.87, 2, 'F2(g)', '2F-'),
];
export const potential = (id) => POTENTIALS.find((p) => p.id === id);

// Cell made of two half-cells. Returns E, delta G, K and the net reaction.
export function cell(idA, idB, T = 298.15) {
  const A = potential(idA), B = potential(idB);
  if (!A || !B || idA === idB) return { ok: false, error: 'Pick two different half-reactions.' };
  const [c, a] = A.E >= B.E ? [A, B] : [B, A], n = lcm(c.n, a.n), sc = n / c.n, sa = n / a.n;
  const E0 = c.E - a.E, net = new Map(), put = (list, sign, mult) => list.forEach(([sp, k, st]) => { const e = net.get(sp) || { sp, st, nu: 0 }; e.nu += sign * k * mult; net.set(sp, e); });
  put(c.left, -1, sc); put(c.right, 1, sc); put(a.right, -1, sa); put(a.left, 1, sa);
  const species = [...net.values()].filter((x) => x.nu !== 0);
  return { ok: true, cathode: c, anode: a, n, E0, dG0: (-n * F * E0) / 1000, K: Math.exp((n * F * E0) / (R_J * T)), spontaneous: E0 > 0, species, sc, sa };
}
// Reaction quotient from amounts of the aqueous and gaseous species (solids and liquids are left out).
export function cellQ(species, amounts) { return species.filter((x) => x.st === 'aq' || x.st === 'g').reduce((q, x) => q * Math.pow(amounts[x.sp] ?? 1, x.nu), 1); }
// Nernst: E = E0 - (RT/nF) ln Q
export const nernst = (E0, n, Q, T = 298.15) => E0 - ((R_J * T) / (n * F)) * Math.log(Q);

/* ---------- electrolysis (Faraday): mass = I t M / (n F). Leave one of I, t, mass empty. ---------- */
export const ELECTRODE = [
  { id: 'Cu', label: 'Cu\u00b2\u207a \u2192 Cu (copper)', n: 2, M: 63.55 }, { id: 'Ag', label: 'Ag\u207a \u2192 Ag (silver)', n: 1, M: 107.87 }, { id: 'Zn', label: 'Zn\u00b2\u207a \u2192 Zn (zinc)', n: 2, M: 65.38 },
  { id: 'Ni', label: 'Ni\u00b2\u207a \u2192 Ni (nickel)', n: 2, M: 58.69 }, { id: 'Al', label: 'Al\u00b3\u207a \u2192 Al (aluminum)', n: 3, M: 26.98 }, { id: 'Na', label: 'Na\u207a \u2192 Na (sodium)', n: 1, M: 22.99 },
  { id: 'Mg', label: 'Mg\u00b2\u207a \u2192 Mg (magnesium)', n: 2, M: 24.31 }, { id: 'Au', label: 'Au\u00b3\u207a \u2192 Au (gold)', n: 3, M: 196.97 }, { id: 'Cr', label: 'Cr\u00b3\u207a \u2192 Cr (chromium)', n: 3, M: 52.00 },
  { id: 'Pb', label: 'Pb\u00b2\u207a \u2192 Pb (lead)', n: 2, M: 207.2 }, { id: 'H2', label: '2H\u207a \u2192 H\u2082 (hydrogen gas)', n: 2, M: 2.016, gas: true }, { id: 'Cl2', label: '2Cl\u207b \u2192 Cl\u2082 (chlorine gas)', n: 2, M: 70.90, gas: true }, { id: 'O2', label: '2H\u2082O \u2192 O\u2082 (oxygen gas)', n: 4, M: 32.00, gas: true },
];
export function faraday({ I, t, mass, n, M }) {
  const ok = (x) => typeof x === 'number' && Number.isFinite(x) && x > 0, miss = [['I', I], ['t', t], ['mass', mass]].filter(([, v]) => !ok(v)).map(([k]) => k);
  if (miss.length !== 1) return { error: 'Leave exactly one of current, time and mass empty: that is the one to find.' };
  const k = (n * F) / M;              // coulombs per gram
  const u = miss[0], value = u === 'mass' ? (I * t) / k : u === 'I' ? (mass * k) / t : (mass * k) / I;
  const mass2 = u === 'mass' ? value : mass, I2 = u === 'I' ? value : I, t2 = u === 't' ? value : t;
  return { unknown: u, value, charge: I2 * t2, molElectrons: (I2 * t2) / F, molProduct: mass2 / M, mass: mass2, I: I2, t: t2 };
}
export const gasVolume = (mol, T = 273.15, P = 1) => (mol * R_L * T) / P;
