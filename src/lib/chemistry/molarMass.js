// Chemical formulas -> element counts -> molar mass. Pure: the caller supplies the atomic-mass lookup.

// "Ca(OH)2" -> { Ca: 1, O: 2, H: 2 };  "CuSO4.5H2O" (or with a middle dot) works too.
export function parseFormula(input) {
  const s = String(input).replace(/\s/g, '').replace(/[\u2022\u00b7*]/g, '.');
  if (!s) return null;
  const parts = s.split('.'), total = {};
  for (let k = 0; k < parts.length; k++) {
    const mm = k > 0 ? parts[k].match(/^(\d+)(.+)$/) : null;
    const mult = mm ? +mm[1] : 1, str = mm ? mm[2] : parts[k];
    const c = parseGroup(str);
    if (!c) return null;
    for (const [el, n] of Object.entries(c)) total[el] = (total[el] || 0) + n * mult;
  }
  return Object.keys(total).length ? total : null;
}
function parseGroup(s) {
  let i = 0;
  const num = () => { let j = i; while (/\d/.test(s[i] || '')) i++; return j === i ? 1 : +s.slice(j, i); };
  const seq = (close) => {
    const out = {};
    while (i < s.length && s[i] !== close) {
      if (s[i] === '(' || s[i] === '[') {
        const end = s[i] === '(' ? ')' : ']'; i++;
        const inner = seq(end); if (!inner || s[i] !== end) return null; i++;
        const n = num();
        for (const [el, c] of Object.entries(inner)) out[el] = (out[el] || 0) + c * n;
      } else if (/[A-Z]/.test(s[i])) {
        let el = s[i++]; while (/[a-z]/.test(s[i] || '')) el += s[i++];
        out[el] = (out[el] || 0) + num();
      } else return null;
    }
    return out;
  };
  const r = seq(null);
  return r && i === s.length ? r : null;
}

// counts + massOf(symbol) -> { total, rows: [{ el, n, mass, sub }] } or { error }
export function molarMass(counts, massOf) {
  const rows = [];
  for (const [el, n] of Object.entries(counts)) {
    const mass = massOf(el);
    if (mass == null) return { error: `Unknown element symbol: ${el}` };
    rows.push({ el, n, mass, sub: n * mass });
  }
  return { rows, total: rows.reduce((s, r) => s + r.sub, 0) };
}
