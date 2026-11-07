// Scientific notation <-> decimal, keeping significant figures. Pure functions.
import { parseSig } from './sigfigs.js';

// "0.00567" -> { mantissa: "5.67", exp: -3 }; "456000" -> { "4.56", 5 }; "100." -> { "1.00", 2 }
export function toScientific(raw) {
  const p = parseSig(raw);
  if (!p) return null;
  if (p.exp !== null) { // already has an exponent: normalise it
    const base = toScientific(p.mant);
    return { mantissa: base.mantissa, exp: base.exp + p.exp, n: p.n };
  }
  const digits = p.mant.replace('.', ''), dotPos = p.mant.includes('.') ? p.mant.indexOf('.') : p.mant.length;
  const f = p.flags.indexOf(true), sigDigits = [...p.mant].filter((c, i) => p.flags[i]).join('');
  const exp = dotPos - [...p.mant.slice(0, f)].filter((c) => c !== '.').length - 1;
  void digits;
  return { mantissa: sigDigits[0] + (sigDigits.length > 1 ? '.' + sigDigits.slice(1) : ''), exp, n: p.n };
}

// ("5.67", -3) -> "0.00567"; ("4.56", 5) -> "456000"
export function fromScientific(mantissa, exp) {
  const m = String(mantissa).trim();
  if (!/^\d+\.?\d*$/.test(m) || !Number.isInteger(exp)) return null;
  const D = m.replace('.', ''), pos = (m.includes('.') ? m.indexOf('.') : m.length) + exp;
  if (pos <= 0) return '0.' + '0'.repeat(-pos) + D;
  if (pos >= D.length) return D + '0'.repeat(pos - D.length);
  return D.slice(0, pos) + '.' + D.slice(pos);
}
