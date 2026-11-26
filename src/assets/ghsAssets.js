// GHS hazard pictograms — Laboratory ledger vector assets.
// viewBox 0 0 100 100, explicit fills, #231f20 ink, round joins. No CSS variables.
const DIAMOND = '<polygon points="50,4 96,50 50,96 4,50" fill="#ffffff" stroke="#d62d2d" stroke-width="7" stroke-linejoin="round"/>';

export const GHS = [
  ['Explosive', 'Unstable explosives, self-reactive substances and organic peroxides.', 'Peroxides, some nitro compounds', '<polygon fill="#231f20" points="50,28 56,42 71,35 62,48 76,56 60,58 62,73 50,64 38,73 40,58 24,56 38,48 29,35 44,42"/>'],
  ['Flammable', 'Catches fire easily. Keep away from flames and sparks.', 'Acetone, ethanol, hexane', '<path fill="#231f20" d="M50 24c3 12 18 16 18 32a18 18 0 0 1-36 0c0-8 4-13 8-17 1 6 4 9 8 10-2-8-1-16 2-25z"/>'],
  ['Oxidizer', 'May cause or intensify a fire by supplying oxygen.', 'Potassium permanganate, nitrates', '<circle cx="50" cy="66" r="13" fill="none" stroke="#231f20" stroke-width="5"/><path fill="#231f20" d="M50 24c2 8 11 10 11 20a11 11 0 0 1-22 0c0-5 2-8 5-10 1 4 3 6 5 6-1-5-1-10 1-16z"/>'],
  ['Compressed gas', 'Gas under pressure. A cylinder can explode if heated, or be dangerous if dropped.', 'Nitrogen, oxygen, helium cylinders', '<rect x="38" y="30" width="24" height="44" rx="11" fill="#231f20"/><rect x="45" y="22" width="10" height="9" fill="#231f20"/>'],
  ['Corrosive', 'Burns skin, damages eyes and attacks metals.', 'Hydrochloric acid, sodium hydroxide', '<path fill="#231f20" d="M36 24l7 12a8 8 0 1 1-14 0zM62 24l7 12a8 8 0 1 1-14 0z"/><rect x="26" y="62" width="48" height="8" fill="#231f20"/>'],
  ['Toxic', 'Can be fatal if swallowed, inhaled or absorbed through skin.', 'Cyanides, mercury compounds', '<circle cx="50" cy="40" r="15" fill="#231f20"/><rect x="43" y="52" width="14" height="11" fill="#231f20"/><circle cx="44" cy="40" r="4" fill="#ffffff"/><circle cx="56" cy="40" r="4" fill="#ffffff"/><path d="M28 72l44-14M72 72L28 58" stroke="#231f20" stroke-width="5" stroke-linecap="round"/>'],
  ['Health hazard', 'May cause cancer, genetic damage, or long-term harm to organs.', 'Benzene, formaldehyde', '<circle cx="50" cy="31" r="8" fill="#231f20"/><path fill="#231f20" d="M32 74c0-16 7-27 18-27s18 11 18 27z"/><polygon fill="#ffffff" points="50,52 53,58 59,58 54,62 56,68 50,64 44,68 46,62 41,58 47,58"/>'],
  ['Harmful or irritant (exclamation mark)', 'Irritates skin or eyes, or is harmful in smaller amounts.', 'Many cleaning products and solvents', '<rect x="45" y="26" width="10" height="32" rx="4" fill="#231f20"/><circle cx="50" cy="70" r="6" fill="#231f20"/>'],
  ['Hazardous to the environment', 'Harms aquatic life. Never pour it down the drain.', 'Copper sulfate, silver nitrate, heavy-metal salts', '<polygon fill="#231f20" points="50,22 66,46 58,46 70,62 30,62 42,46 34,46"/><rect x="47" y="62" width="6" height="12" fill="#231f20"/>'],
];

export const GHS_SVGS = GHS.map((g) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${g[0]} GHS pictogram" class="ghs-svg">${DIAMOND}${g[3]}</svg>`);

export const ghsSvg = (index) => GHS_SVGS[index] || '';
