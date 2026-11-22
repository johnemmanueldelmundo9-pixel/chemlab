// Chemical equilibrium maths: K expressions, Q, ICE tables, Kp and Kc, Le Chatelier. Pure functions (no DOM).
import { parseEq, R_L } from './thermo.js';

const inExpr = (x, kind) => (kind === 'p' ? x.state === 'g' : x.state !== 's' && x.state !== 'l' && !(x.name === 'H2O' && !x.state && false));

// Reaction with stoichiometric coefficients nu (reactants negative). A species with no state is treated as aqueous.
export function reaction(text) {
  const eq = parseEq(text);
  if (!eq) return null;
  const items = [...eq.left.map((x) => ({ ...x, state: x.state || 'aq', nu: -x.coef })), ...eq.right.map((x) => ({ ...x, state: x.state || 'aq', nu: x.coef }))];
  const names = [...new Set(items.map((x) => x.name))];
  return { eq, items, names, nu: Object.fromEntries(names.map((n) => [n, items.filter((x) => x.name === n).reduce((s, x) => s + x.nu, 0)])), state: Object.fromEntries(items.map((x) => [x.name, x.state])) };
}
const sup = (n) => (n === 1 ? '' : `<sup>${n}</sup>`);
// The K expression as HTML and as a function of the amounts.
export function expression(rx, kind = 'c') {
  const num = rx.items.filter((x) => x.nu > 0 && inExpr(x, kind)), den = rx.items.filter((x) => x.nu < 0 && inExpr(x, kind));
  const part = (list) => (list.length ? list.map((x) => `[${x.name}]${sup(Math.abs(x.nu))}`).join('') : '1').replace(/\[/g, kind === 'p' ? 'P(' : '[').replace(/\]/g, kind === 'p' ? ')' : ']');
  return { html: `K<sub>${kind}</sub> = ${part(num)} / ${part(den)}`, num, den };
}
export function quotient(rx, amounts, kind = 'c') {
  const { num, den } = expression(rx, kind);
  const pr = (list) => list.reduce((p, x) => p * Math.pow(amounts[x.name], Math.abs(x.nu)), 1);
  return pr(num) / pr(den);
}
export const gasMoles = (rx) => rx.items.filter((x) => x.state === 'g').reduce((s, x) => s + x.nu, 0);     // delta n (gas)
export const KpFromKc = (Kc, T, dn) => Kc * Math.pow(R_L * T, dn);
export const KcFromKp = (Kp, T, dn) => Kp / Math.pow(R_L * T, dn);

// ICE: find the extent x so that Q = K. init: { name: concentration or pressure }. Solids and liquids are ignored.
export function solveICE(rx, init, K, kind = 'c') {
  const species = rx.names.filter((n) => inExpr({ state: rx.state[n], name: n }, kind));
  const c0 = Object.fromEntries(species.map((n) => [n, init[n] ?? 0])), nu = rx.nu;
  if (!(K > 0)) return { ok: false, error: 'K must be a positive number.' };
  let lo = -Infinity, hi = Infinity;
  for (const n of species) { if (nu[n] < 0) hi = Math.min(hi, c0[n] / -nu[n]); if (nu[n] > 0) lo = Math.max(lo, -c0[n] / nu[n]); }
  if (!Number.isFinite(hi) && !Number.isFinite(lo)) return { ok: false, error: 'Give at least one starting amount.' };
  if (!Number.isFinite(hi)) hi = 1e6; if (!Number.isFinite(lo)) lo = -1e6;
  if (lo > hi) return { ok: false, error: 'Those starting amounts are not possible.' };
  const f = (x) => { const a = Object.fromEntries(species.map((n) => [n, Math.max(c0[n] + nu[n] * x, 0)])); return Math.log(quotient(rx, a, kind)) - Math.log(K); };
  let a = lo + (hi - lo) * 1e-12, b = hi - (hi - lo) * 1e-12;
  let fa = f(a), fb = f(b);
  if (!(fa < 0 && fb > 0)) { if (Number.isNaN(fa) || Number.isNaN(fb) || fa >= 0 || fb <= 0) return { ok: false, error: 'No equilibrium was found for these numbers. Check that products and reactants are present.' }; }
  for (let i = 0; i < 300; i++) { const m = (a + b) / 2, fm = f(m); if (fm < 0) a = m; else b = m; }
  const x = (a + b) / 2, eq = Object.fromEntries(species.map((n) => [n, c0[n] + nu[n] * x]));
  return { ok: true, x, rows: species.map((n) => ({ name: n, initial: c0[n], change: nu[n] * x, equilibrium: eq[n], nu: nu[n] })), eq, Q: quotient(rx, eq, kind) };
}

// K from a full set of equilibrium amounts.
export function Kfrom(rx, amounts, kind = 'c') { return quotient(rx, amounts, kind); }

// Which way does the system shift? change: { type:'add'|'remove'|'volume'|'temperature'|'catalyst'|'inert', species, direction:'increase'|'decrease', dH:-1|1 }
export function leChatelier(rx, ch) {
  const side = (n) => (rx.nu[n] < 0 ? 'reactant' : 'product');
  const L = (s) => (s === 'right' ? 'to the right (more products)' : 'to the left (more reactants)');
  if (ch.type === 'add' || ch.type === 'remove') {
    const st = rx.state[ch.species];
    if (st === 's' || st === 'l') return { shift: 'none', text: `${ch.species} is a pure solid or liquid, so its amount does not appear in K and changing it does not shift the equilibrium.` };
    const add = ch.type === 'add', onLeft = side(ch.species) === 'reactant', dir = add === onLeft ? 'right' : 'left';
    return { shift: dir, text: `${add ? 'Adding' : 'Removing'} ${ch.species}, a ${side(ch.species)}: the system opposes the change, so it shifts ${L(dir)}. K does not change.` };
  }
  if (ch.type === 'volume') {
    const dn = gasMoles(rx), compress = ch.direction === 'decrease';
    if (dn === 0) return { shift: 'none', text: 'The number of moles of gas is the same on both sides, so changing the volume (pressure) does not shift the equilibrium.' };
    const dir = compress === (dn > 0) ? 'left' : 'right';
    return { shift: dir, text: `${compress ? 'Decreasing the volume raises the pressure' : 'Increasing the volume lowers the pressure'}. The system moves toward the side with ${compress ? 'fewer' : 'more'} moles of gas (${dn > 0 ? 'left has fewer' : 'right has fewer'}), so it shifts ${L(dir)}. K does not change.` };
  }
  if (ch.type === 'temperature') {
    const exo = ch.dH < 0, heat = ch.direction === 'increase', dir = heat === exo ? 'left' : 'right';
    return { shift: dir, text: `The reaction is ${exo ? 'exothermic (heat is a product)' : 'endothermic (heat is a reactant)'}. ${heat ? 'Adding heat' : 'Removing heat'} shifts it ${L(dir)}, and K ${dir === 'right' ? 'increases' : 'decreases'}. Temperature is the only change that alters K.` };
  }
  if (ch.type === 'inert') return { shift: 'none', text: 'Adding an inert gas at constant volume does not change any concentration or partial pressure, so there is no shift.' };
  return { shift: 'none', text: 'A catalyst speeds up the forward and reverse reactions equally. It helps the system reach equilibrium faster but does not shift it and does not change K.' };
}
