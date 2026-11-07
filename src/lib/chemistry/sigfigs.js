// Significant figures: counting, rounding, and the two arithmetic rules. Pure functions (no DOM).

// Parse a typed number like "0.0025", "100.", "1.00e2". Returns null if it is not a non-zero number.
export function parseSig(raw) {
  const s = String(raw).trim().replace(/^[+-]/, '').replace(/[\s,]/g, '');
  const m = s.match(/^(\d*\.?\d*)(?:[eE]([+-]?\d+))?$/);
  if (!m || !/\d/.test(m[1])) return null;
  const mant = m[1], dot = mant.includes('.');
  const idx = [...mant].map((c, i) => (/\d/.test(c) ? i : -1)).filter((i) => i >= 0);
  const nz = idx.filter((i) => mant[i] !== '0');
  if (!nz.length) return null;
  const first = nz[0], last = dot ? idx[idx.length - 1] : nz[nz.length - 1];
  const flags = [...mant].map((c, i) => /\d/.test(c) && i >= first && i <= last);
  const places = dot ? mant.length - mant.indexOf('.') - 1 : 0; // decimal places as typed
  return { mant, exp: m[2] === undefined ? null : +m[2], flags, n: flags.filter(Boolean).length, places };
}
export const countSigFigs = (raw) => parseSig(raw)?.n ?? null;

// Round a number half-up at a number of decimal places (works for negative places too).
export function roundPlaces(x, places) {
  const f = 10 ** places;
  const r = Math.round(Number(`${Math.abs(x)}e${places}`)) / f;
  return Math.sign(x) * (Number.isFinite(r) ? r : Math.abs(x));
}

// Round to n significant figures. Returns { text, value }; text is plain ("5.78e3" style is handled by the caller).
export function roundSig(x, n) {
  if (x === 0) return { value: 0, text: (0).toFixed(Math.max(0, n - 1)) };
  const e = Math.floor(Math.log10(Math.abs(x)));
  const value = roundPlaces(x, n - 1 - e);
  const e2 = Math.floor(Math.log10(Math.abs(value))); // rounding can carry (9.99 -> 10.0)
  return { value, text: value.toPrecision(n), exp: e2 };
}

// Multiplication / division: result keeps the fewest significant figures among the inputs.
export function mulDiv(a, b, op) {
  const A = parseSig(a), B = parseSig(b);
  if (!A || !B) return null;
  const x = parseFloat(a), y = parseFloat(b);
  if (op === '/' && y === 0) return null;
  const raw = op === '*' ? x * y : x / y, n = Math.min(A.n, B.n);
  return { raw, n, ...roundSig(raw, n) };
}

// Addition / subtraction: result keeps the fewest decimal places among the inputs.
export function addSub(a, b, op) {
  const A = parseSig(a), B = parseSig(b);
  if (!A || !B) return null;
  const raw = op === '+' ? parseFloat(a) + parseFloat(b) : parseFloat(a) - parseFloat(b);
  const places = Math.min(A.places, B.places), value = roundPlaces(raw, places);
  return { raw, places, value, text: places >= 0 ? value.toFixed(places) : String(value) };
}
