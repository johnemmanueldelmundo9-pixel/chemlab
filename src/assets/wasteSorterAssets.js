// Waste sorter assets — svg-asset-craft rules.
// Explicit fills, #231f20 ink, round caps/joins, no CSS variables.
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);

export const REAGENT_INFO = {
  'Sodium chloride': ['NaCl', '#dbe4ea', 'A simple salt; dissolves freely in water.'],
  'Magnesium sulfate': ['MgSO\u2084', '#dbe4ea', 'Epsom salt; a neutral inorganic salt.'],
  'Sodium bicarbonate': ['NaHCO\u2083', '#dbe4ea', 'A mild alkaline salt that neutralises acids.'],
  'Sulfuric acid': ['H\u2082SO\u2084', '#f6c9c2', 'A strong inorganic acid: corrosive and heat-producing when diluted.'],
  'Hydrochloric acid': ['HCl', '#f6c9c2', 'A strong acid that attacks metals and skin.'],
  'Benzoic acid': ['C\u2087H\u2086O\u2082', '#f6c9c2', 'An organic acid; still handled as acid waste.'],
  'Nitric acid': ['HNO\u2083', '#f6c9c2', 'A strong oxidising acid; keep it separate.'],
  'Sodium hydroxide': ['NaOH', '#cfe0f7', 'A strong base: caustic to skin and eyes.'],
  'Potassium hydroxide': ['KOH', '#cfe0f7', 'A strong caustic base.'],
  'Ammonium hydroxide': ['NH\u2084OH', '#cfe0f7', 'A base with a strong, volatile odour.'],
  'Ethanol': ['C\u2082H\u2085OH', '#f7dfa8', 'An alcohol: a flammable organic solvent.'],
  'Acetone': ['C\u2083H\u2086O', '#f7dfa8', 'A volatile, highly flammable organic solvent.'],
  'Hexane': ['C\u2086H\u2081\u2084', '#f7dfa8', 'A flammable non-polar organic solvent.'],
  'Xylene': ['C\u2088H\u2081\u2080', '#f7dfa8', 'A flammable aromatic organic solvent.'],
  'Silver nitrate': ['AgNO\u2083', '#bfe6df', 'An inorganic oxidizer that needs its own container.'],
  'Potassium permanganate': ['KMnO\u2084', '#bfe6df', 'A strong inorganic oxidizer.'],
};

export function reagentBottle(name) {
  const [formula, tint, clue] = REAGENT_INFO[name] || ['?', '#dbe4ea', 'An unknown reagent: handle as hazardous.'];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 160" role="img" aria-label="Reagent bottle of ${esc(name)}" class="reagent-bottle">
    <g stroke="#231f20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="52" y="12" width="36" height="14" rx="4" fill="#c9c2b2"/>
      <path d="M56 26h28v18l22 22v62a14 14 0 0 1-14 14H48a14 14 0 0 1-14-14V66l22-22z" fill="${tint}"/>
      <path d="M34 96h72M34 108h72" stroke-opacity=".35"/>
      <rect x="40" y="70" width="60" height="44" rx="4" fill="#fffdf7"/>
      <text x="70" y="86" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="#231f20">${esc(name)}</text>
      <text x="70" y="103" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" font-weight="800" fill="#231f20">${esc(formula)}</text>
      <path d="M40 122h60" stroke="#dc2626" stroke-width="5"/>
    </g>
  </svg>`;
}

export const reagentClue = (name) => (REAGENT_INFO[name] || ['?', '', 'An unknown reagent: handle as hazardous.'])[2];

const carboy = (label, color, stripe) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150" role="img" aria-label="${label} waste carboy" class="carboy-svg">
  <g stroke="#231f20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="44" y="10" width="32" height="14" rx="4" fill="#231f20"/>
    <path d="M40 24h40v12l14 18v70a12 12 0 0 1-12 12H38a12 12 0 0 1-12-12V54l14-18z" fill="${color}"/>
    <path d="M34 66h52M34 74h52" stroke="#ffffff" stroke-opacity=".7" stroke-dasharray="6 5" stroke="${stripe}"/>
    <rect x="30" y="88" width="60" height="34" rx="4" fill="#fffdf7"/>
    <text x="60" y="109" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" font-weight="800" fill="#231f20">${label.toUpperCase()}</text>
  </g>
</svg>`;

export const WASTE_CARBOYS = [
  { key: 'Salts', color: '#64748b', stripe: '#334155', svg: carboy('Salts', '#64748b', '#334155') },
  { key: 'Acids', color: '#dc2626', stripe: '#7f1d1d', svg: carboy('Acids', '#dc2626', '#7f1d1d') },
  { key: 'Bases', color: '#2563eb', stripe: '#1e3a8a', svg: carboy('Bases', '#2563eb', '#1e3a8a') },
  { key: 'Organic', color: '#d97706', stripe: '#92400e', svg: carboy('Organic', '#d97706', '#92400e') },
  { key: 'Inorganic', color: '#0d9488', stripe: '#134e4a', svg: carboy('Inorganic', '#0d9488', '#134e4a') },
];
