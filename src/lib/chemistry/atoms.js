// Atomic structure maths: electron configurations, quantum numbers, isotopes. Pure functions (no DOM).

// Subshells in filling order (the Madelung / "diagonal" rule).
export const ORDER = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p'];
const L = { s: 0, p: 1, d: 2, f: 3 };
export const subshell = (name) => ({ name, n: +name[0], l: L[name[1]], cap: 2 * (2 * L[name[1]] + 1) });

// Well-known elements whose ground state breaks the filling order (counts of the subshells that differ).
export const EXCEPTIONS = {
  24: { '4s': 1, '3d': 5 }, 29: { '4s': 1, '3d': 10 }, 41: { '5s': 1, '4d': 4 }, 42: { '5s': 1, '4d': 5 },
  44: { '5s': 1, '4d': 7 }, 45: { '5s': 1, '4d': 8 }, 46: { '5s': 0, '4d': 10 }, 47: { '5s': 1, '4d': 10 },
  57: { '4f': 0, '5d': 1 }, 58: { '4f': 1, '5d': 1 }, 64: { '4f': 7, '5d': 1 }, 78: { '6s': 1, '4f': 14, '5d': 9 }, 79: { '6s': 1, '4f': 14, '5d': 10 },
  89: { '5f': 0, '6d': 1 }, 90: { '5f': 0, '6d': 2 }, 91: { '5f': 2, '6d': 1 }, 92: { '5f': 3, '6d': 1 }, 93: { '5f': 4, '6d': 1 }, 96: { '5f': 7, '6d': 1 },
};

// Ground-state configuration of the neutral atom: [{ name:'4s', n, l, cap, count }] in filling order, empty subshells left out.
export function electronConfig(Z) {
  if (!Number.isInteger(Z) || Z < 1 || Z > 118) return null;
  let left = Z;
  const counts = {};
  for (const name of ORDER) { const c = Math.min(left, subshell(name).cap); counts[name] = c; left -= c; }
  Object.assign(counts, EXCEPTIONS[Z] || {});
  // Heavy-element exceptions keep the 4f/5f total consistent with Z: rebalance the outer s subshell if needed.
  let total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total !== Z) { const s = ORDER.filter((n) => n[1] === 's').reverse().find((n) => counts[n] > 0); counts[s] += Z - total; }
  return ORDER.filter((n) => counts[n] > 0).map((n) => ({ ...subshell(n), count: counts[n] }));
}

const CORES = [[86, 'Rn', '6p'], [54, 'Xe', '5p'], [36, 'Kr', '4p'], [18, 'Ar', '3p'], [10, 'Ne', '2p'], [2, 'He', '1s']];
// { core: 'Ar' | null, rest: [subshells after the noble-gas core] }
export function condensed(Z) {
  const cfg = electronConfig(Z);
  if (!cfg) return null;
  const c = CORES.find(([z]) => z < Z);
  if (!c) return { core: null, rest: cfg };
  const cut = ORDER.indexOf(c[2]);
  return { core: c[1], rest: cfg.filter((s) => ORDER.indexOf(s.name) > cut) };
}

export const orbitals = (s) => 2 * s.l + 1;
// Number of unpaired electrons: Hund's rule fills every orbital singly before pairing.
export const unpaired = (cfg) => cfg.reduce((t, s) => t + (s.count <= orbitals(s) ? s.count : 2 * orbitals(s) - s.count), 0);

// Orbital boxes for one subshell: [{ up, down }, ...] (Hund's rule, spin-up first).
export function boxes(s) {
  const o = orbitals(s), out = Array.from({ length: o }, () => ({ up: false, down: false }));
  for (let k = 0; k < s.count; k++) { if (k < o) out[k].up = true; else out[k - o].down = true; }
  return out;
}

// The four quantum numbers of the last electron added (the course convention: fill m_l from -l upward, spin +1/2 first).
export function lastElectron(cfg) {
  const s = [...cfg].sort((a, b) => ORDER.indexOf(a.name) - ORDER.indexOf(b.name)).pop();
  const o = orbitals(s), k = s.count; // k-th electron in this subshell
  const idx = (k <= o ? k : k - o) - 1;
  return { name: s.name, n: s.n, l: s.l, ml: -s.l + idx, ms: k <= o ? 0.5 : -0.5 };
}

// Is (n, l, ml, ms) an allowed set? Returns { valid, reason }.
export function checkQuantum(n, l, ml, ms) {
  const int = Number.isInteger;
  if (![n, l, ml].every((x) => int(x))) return { valid: false, reason: 'n, l and m\u2097 must be whole numbers.' };
  if (n < 1) return { valid: false, reason: 'n must be 1 or more.' };
  if (l < 0 || l > n - 1) return { valid: false, reason: `For n = ${n}, l can only be ${Array.from({ length: n }, (_, i) => i).join(', ').replace(/, (\d+)$/, ' or $1')}.` };
  if (ml < -l || ml > l) return { valid: false, reason: `For l = ${l}, m\u2097 can only be ${l === 0 ? '0' : Array.from({ length: 2 * l + 1 }, (_, i) => i - l).map((x) => (x > 0 ? '+' + x : x)).join(', ')}.` };
  if (ms !== 0.5 && ms !== -0.5) return { valid: false, reason: 'm\u209b can only be +1/2 or \u22121/2.' };
  return { valid: true, reason: 'All values are allowed.', subshell: `${n}${'spdfgh'[l]}` };
}

// Average atomic mass from [{ pct, mass }, ...].
export function averageMass(isotopes) {
  return { mass: isotopes.reduce((t, i) => t + (i.pct / 100) * i.mass, 0), totalPct: isotopes.reduce((t, i) => t + i.pct, 0) };
}

// Particles in an atom or ion: Z protons, A - Z neutrons, Z - charge electrons.
export const particles = (Z, A, charge = 0) => ({ p: Z, n: A - Z, e: Z - charge });

// Electrons per shell (n = 1, 2, 3, ...) for a Bohr-style drawing; an ion uses the configuration of the atom with the same electron count.
export function shells(e) {
  const cfg = e >= 1 ? electronConfig(Math.min(e, 118)) : [];
  const out = [];
  for (const s of cfg) out[s.n - 1] = (out[s.n - 1] || 0) + s.count;
  return Array.from(out, (x) => x || 0);
}
