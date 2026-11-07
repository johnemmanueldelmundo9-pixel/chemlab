// Unit conversion by the factor-label method. Every table is relative to a base unit. Pure functions.
export const UNITS = {
  Length: { m: 1, km: 1e3, cm: 1e-2, mm: 1e-3, '\u00b5m': 1e-6, nm: 1e-9, in: 0.0254, ft: 0.3048, mi: 1609.344 },
  Mass: { g: 1, kg: 1e3, mg: 1e-3, '\u00b5g': 1e-6, lb: 453.6 },
  Volume: { L: 1, mL: 1e-3, 'cm\u00b3': 1e-3, 'm\u00b3': 1e3, gal: 3.785 },
  Time: { s: 1, min: 60, h: 3600, day: 86400, ms: 1e-3 },
  Speed: { 'm/s': 1, 'km/h': 1 / 3.6, 'mi/h': 0.44704, 'cm/s': 1e-2 },
  Density: { 'g/cm\u00b3': 1, 'g/mL': 1, 'kg/m\u00b3': 1e-3, 'g/L': 1e-3 },
  'SI prefix (any unit)': { G: 1e9, M: 1e6, k: 1e3, '(none)': 1, c: 1e-2, m: 1e-3, '\u00b5': 1e-6, n: 1e-9, p: 1e-12 },
};
// Factor so that: value_in_from * factor = value_in_to. Rounded to kill floating-point noise.
export function factor(category, from, to) {
  const t = UNITS[category];
  if (!t || !(from in t) || !(to in t)) return null;
  return Number((t[from] / t[to]).toPrecision(12));
}
export const convert = (value, category, from, to) => { const f = factor(category, from, to); return f === null ? null : value * f; };
