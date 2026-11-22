// Thermochemistry maths: heat, calorimetry, heating curves, Hess's law, enthalpies of formation, free energy. Pure functions (no DOM).

export const R_J = 8.314;          // J/(mol K)
export const R_L = 0.08206;        // L atm/(mol K)
export const F = 96485;            // C/mol

// Specific heats in J/(g degC)
export const SPECIFIC_HEAT = [['Water (liquid)', 4.184], ['Ice', 2.09], ['Steam', 2.01], ['Aluminum', 0.897], ['Copper', 0.385], ['Iron', 0.449], ['Silver', 0.235], ['Gold', 0.129], ['Lead', 0.129], ['Zinc', 0.388], ['Ethanol', 2.44], ['Glass (Pyrex)', 0.84]];

const ok = (x) => typeof x === 'number' && Number.isFinite(x);

// q = m c dT. Exactly one of q, m, c, dT may be missing (null / NaN).
export function solveHeat({ q, m, c, dT }) {
  const miss = ['q', 'm', 'c', 'dT'].filter((k) => !ok({ q, m, c, dT }[k]));
  if (miss.length !== 1) return { error: miss.length ? 'Leave exactly one box empty: that is the one to find.' : 'Leave one box empty: that is the one to find.' };
  const u = miss[0];
  if (u === 'q') return { unknown: u, value: m * c * dT };
  if (u === 'm') return c * dT === 0 ? { error: 'c and \u0394T cannot be zero.' } : { unknown: u, value: q / (c * dT) };
  if (u === 'c') return m * dT === 0 ? { error: 'm and \u0394T cannot be zero.' } : { unknown: u, value: q / (m * dT) };
  return m * c === 0 ? { error: 'm and c cannot be zero.' } : { unknown: u, value: q / (m * c) };
}

// Hot object mixed with a cooler one, no heat lost: m1 c1 (Tf - T1) + m2 c2 (Tf - T2) = 0. Leave Tf or c2 empty.
export function mixing({ m1, c1, T1, m2, c2, T2, Tf }) {
  if (!ok(Tf) && [m1, c1, T1, m2, c2, T2].every(ok)) return { unknown: 'Tf', value: (m1 * c1 * T1 + m2 * c2 * T2) / (m1 * c1 + m2 * c2) };
  if (ok(Tf) && !ok(c2) && [m1, c1, T1, m2, T2].every(ok)) return Tf === T2 ? { error: 'The final temperature cannot equal the starting temperature of object 2.' } : { unknown: 'c2', value: (-m1 * c1 * (Tf - T1)) / (m2 * (Tf - T2)) };
  return { error: 'Fill in everything except the final temperature, or everything except c of object 2 (with the final temperature given).' };
}

// Coffee-cup or bomb calorimeter. massSol (g), cSol J/(g degC), dT (degC), Ccal J/degC, moles of the reacting substance.
export function calorimeter({ massSol = 0, cSol = 4.184, dT, Ccal = 0, moles }) {
  if (![massSol, cSol, dT, Ccal].every(ok)) return { error: 'Check the numbers.' };
  const qSol = massSol * cSol * dT, qCal = Ccal * dT, qRxn = -(qSol + qCal);
  const out = { qSol, qCal, qRxn, exothermic: qRxn < 0 };
  if (ok(moles) && moles > 0) out.dHperMol = qRxn / moles / 1000; // kJ/mol
  return out;
}

// Heat to take water between two temperatures (J). Phase by temperature unless told otherwise: ice below 0, liquid 0-100, steam above 100.
export const WATER = { cIce: 2.09, cLiq: 4.184, cSteam: 2.01, hFus: 334, hVap: 2260 };
export function heatingCurve(m, T1, T2, p1, p2) {
  const phase = (T, forced) => forced || (T < 0 ? 'ice' : T > 100 ? 'steam' : 'liquid');
  let a = phase(T1, p1), b = phase(T2, p2), sign = 1, t1 = T1, t2 = T2;
  const order = ['ice', 'liquid', 'steam'];
  if (order.indexOf(a) > order.indexOf(b) || (a === b && T1 > T2)) { [a, b] = [b, a]; [t1, t2] = [t2, t1]; sign = -1; }
  const steps = [], bounds = { ice: [null, 0], liquid: [0, 100], steam: [100, null] }, c = { ice: WATER.cIce, liquid: WATER.cLiq, steam: WATER.cSteam };
  for (let i = order.indexOf(a); i <= order.indexOf(b); i++) {
    const ph = order[i], from = i === order.indexOf(a) ? t1 : bounds[ph][0], to = i === order.indexOf(b) ? t2 : bounds[ph][1];
    if (from !== to) steps.push({ label: `Warm ${ph === 'liquid' ? 'liquid water' : ph === 'ice' ? 'ice' : 'steam'} from ${from} to ${to} \u00b0C`, q: m * c[ph] * (to - from), formula: `${m} \u00d7 ${c[ph]} \u00d7 ${to - from}` });
    if (i < order.indexOf(b)) steps.push(i === 0 ? { label: 'Melt the ice at 0 \u00b0C', q: m * WATER.hFus, formula: `${m} \u00d7 ${WATER.hFus}` } : { label: 'Boil the water at 100 \u00b0C', q: m * WATER.hVap, formula: `${m} \u00d7 ${WATER.hVap}` });
  }
  const total = steps.reduce((s, x) => s + x.q, 0);
  return { steps: steps.map((s) => ({ ...s, q: s.q * sign })), total: total * sign, released: sign < 0 };
}

/* ---------- reading chemical equations (shared with equilibrium.js) ---------- */
const ARROW = /\s*(?:<=>|<->|\u21cc|\u2194|=>|->|\u2192|=)\s*/;
export function parseEq(text) {
  const t = String(text).trim().replace(/(?<=[A-Za-z0-9)\]])\+(?=[A-Z0-9])/g, ' + ');
  const parts = t.split(ARROW);
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  const side = (s) => s.split(/\s+\+\s+/).map((term) => {
    const m = term.trim().match(/^(\d+\/\d+|\d+(?:\.\d+)?)?\s*(.+)$/);
    if (!m) return null;
    const coef = m[1] ? (m[1].includes('/') ? +m[1].split('/')[0] / +m[1].split('/')[1] : +m[1]) : 1;
    const sm = m[2].replace(/\s/g, '').match(/^(.*?)(?:\((s|l|g|aq)\))?$/i);
    return { coef, species: m[2].replace(/\s/g, ''), name: sm[1], state: sm[2] ? sm[2].toLowerCase() : '' };
  });
  const left = side(parts[0]), right = side(parts[1]);
  if ([...left, ...right].some((x) => !x || !x.name)) return null;
  return { left, right, reversible: /<=>|<->|\u21cc|\u2194/.test(t) };
}
// Net coefficient of each species (products positive, reactants negative).
export function eqVector(eq) {
  const v = new Map();
  eq.left.forEach((x) => v.set(x.species, (v.get(x.species) || 0) - x.coef));
  eq.right.forEach((x) => v.set(x.species, (v.get(x.species) || 0) + x.coef));
  return v;
}

// Hess's law: find the multiplier of each given equation so that they add up to the target. givens: [{ text, dH }]
export function hess(targetText, givens) {
  const t = parseEq(targetText), gs = givens.map((g) => parseEq(g.text));
  if (!t || gs.some((g) => !g)) return { ok: false, error: 'Write each equation like "C(s) + O2(g) -> CO2(g)", with a space on each side of every +.' };
  const vecs = gs.map(eqVector), tv = eqVector(t), species = [...new Set([...tv.keys(), ...vecs.flatMap((v) => [...v.keys()])])];
  const k = givens.length, A = species.map((s) => [...vecs.map((v) => v.get(s) || 0), tv.get(s) || 0]);
  // Gaussian elimination with partial pivoting
  const rows = A.length, piv = [];
  let r = 0;
  for (let c = 0; c < k && r < rows; c++) {
    let p = r; for (let i = r + 1; i < rows; i++) if (Math.abs(A[i][c]) > Math.abs(A[p][c])) p = i;
    if (Math.abs(A[p][c]) < 1e-12) continue;
    [A[r], A[p]] = [A[p], A[r]];
    for (let i = 0; i < rows; i++) if (i !== r) { const f = A[i][c] / A[r][c]; for (let j = c; j <= k; j++) A[i][j] -= f * A[r][j]; }
    piv.push(c); r++;
  }
  for (let i = r; i < rows; i++) if (Math.abs(A[i][k]) > 1e-9) return { ok: false, error: 'These equations cannot be combined to make the target. Check the species and their states, for example H2O(l) is not H2O(g).' };
  const mult = Array(k).fill(0);
  piv.forEach((c, i) => { mult[c] = A[i][k] / A[i][c]; });
  const snap = (x) => { for (let d = 1; d <= 6; d++) { const y = Math.round(x * d) / d; if (Math.abs(x - y) < 1e-9) return y; } return Math.round(x * 1e6) / 1e6; };
  const m = mult.map(snap), dH = m.reduce((s, x, i) => s + x * givens[i].dH, 0);
  return { ok: true, mult: m, dH, unique: piv.length === k, unused: m.map((x, i) => (x === 0 ? i : -1)).filter((i) => i >= 0) };
}

// Standard enthalpies of formation at 25 degC in kJ/mol (typical textbook values; textbooks differ by a few tenths).
export const HF = { 'H2(g)': 0, 'O2(g)': 0, 'N2(g)': 0, 'Cl2(g)': 0, 'F2(g)': 0, 'Br2(l)': 0, 'C(s)': 0, 'S(s)': 0, 'Fe(s)': 0, 'Al(s)': 0, 'Na(s)': 0, 'Mg(s)': 0, 'Ca(s)': 0, 'Cu(s)': 0, 'Zn(s)': 0, 'C(diamond)': 1.9,
  'H2O(l)': -285.8, 'H2O(g)': -241.8, 'CO(g)': -110.5, 'CO2(g)': -393.5, 'CH4(g)': -74.8, 'C2H6(g)': -84.7, 'C3H8(g)': -103.8, 'C2H4(g)': 52.3, 'C2H2(g)': 226.7, 'C6H6(l)': 49.0,
  'CH3OH(l)': -238.7, 'C2H5OH(l)': -277.7, 'C6H12O6(s)': -1273.3, 'NH3(g)': -46.1, 'NO(g)': 90.3, 'NO2(g)': 33.2, 'N2O(g)': 81.6, 'N2O4(g)': 9.2, 'HCl(g)': -92.3, 'HF(g)': -271, 'HBr(g)': -36.3, 'HI(g)': 26.5,
  'SO2(g)': -296.8, 'SO3(g)': -395.7, 'H2S(g)': -20.6, 'H2O2(l)': -187.8, 'O3(g)': 142.7, 'NaCl(s)': -411.2, 'CaO(s)': -635.1, 'CaCO3(s)': -1206.9, 'Ca(OH)2(s)': -986.1, 'Fe2O3(s)': -824.2, 'Al2O3(s)': -1675.7, 'MgO(s)': -601.6, 'NaOH(s)': -425.6, 'NH4Cl(s)': -314.4, 'HNO3(l)': -174.1, 'H2SO4(l)': -814.0 };

// dH = sum n dHf(products) - sum n dHf(reactants). overrides: { species: value }. Returns the terms and the missing species.
export function reactionEnthalpy(text, overrides = {}) {
  const eq = parseEq(text);
  if (!eq) return { ok: false, error: 'Write the equation like "CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)".' };
  const val = (sp) => (sp in overrides && ok(overrides[sp]) ? overrides[sp] : HF[sp]);
  const terms = [...eq.left.map((x) => ({ ...x, side: 'reactant' })), ...eq.right.map((x) => ({ ...x, side: 'product' }))].map((x) => ({ ...x, hf: val(x.species) }));
  const missing = terms.filter((x) => !ok(x.hf)).map((x) => x.species);
  if (missing.length) return { ok: false, terms, missing, error: `No value for ${[...new Set(missing)].join(', ')}. Add it in the boxes below (include the state, such as (g), (l) or (s)).` };
  const sum = (side) => terms.filter((x) => x.side === side).reduce((s, x) => s + x.coef * x.hf, 0), p = sum('product'), r = sum('reactant');
  return { ok: true, terms, products: p, reactants: r, dH: p - r };
}

// dG = dH - T dS. dH in kJ, dS in J/K, T in K.
export function gibbs({ dH, dS, T }) {
  const dG = dH - (T * dS) / 1000, cross = dS !== 0 ? (dH * 1000) / dS : null;
  const kind = dH < 0 && dS > 0 ? 'Spontaneous at every temperature (exothermic and entropy increases).' : dH > 0 && dS < 0 ? 'Not spontaneous at any temperature (endothermic and entropy decreases).' : dH < 0 && dS < 0 ? 'Spontaneous at low temperatures only (enthalpy-driven).' : dH > 0 && dS > 0 ? 'Spontaneous at high temperatures only (entropy-driven).' : 'Special case: a zero in \u0394H or \u0394S.';
  return { dG, kind, crossover: cross !== null && cross > 0 ? cross : null, spontaneous: dG < 0, atEquilibrium: Math.abs(dG) < 1e-9 };
}
export const KfromDG = (dG, T) => Math.exp((-dG * 1000) / (R_J * T));           // dG in kJ/mol
export const DGfromK = (K, T) => (-R_J * T * Math.log(K)) / 1000;               // kJ/mol
