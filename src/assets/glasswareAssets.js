// Glassware match-up specimen illustrations — svg-asset-craft rules.
// viewBox 0 0 120 120, rgba glass tint, #231f20 ink, round caps/joins, no CSS variables.
const GLASS = 'rgba(185, 228, 238, 0.45)';
const METAL = '#c9c2b2';
const DARK = '#3b332b';

const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-hidden="true" class="specimen-svg"><g stroke="#231f20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">${inner}</g></svg>`;

export const GLASSWARE = {
  'Beaker': svg(`<path d="M32 28h56l-6 70H38z" fill="${GLASS}"/><path d="M28 28h64M44 48h12M44 62h9M44 76h12"/>`),
  'Erlenmeyer flask': svg(`<path d="M50 22h20v28l24 48H26l24-48z" fill="${GLASS}"/><path d="M46 22h28M42 84h36"/>`),
  'Graduated cylinder': svg(`<path d="M46 18h28v88H46z" fill="${GLASS}"/><path d="M46 98h28M52 34h10M52 48h8M52 62h10M52 76h8"/>`),
  'Volumetric flask': svg(`<path d="M54 18h12v34c0 6 20 16 20 34a32 32 0 0 1-64 0c0-18 20-28 20-34V18z" fill="${GLASS}"/><path d="M50 18h20M52 66h16"/>`),
  'Burette': svg(`<path d="M52 12h16v86H52z" fill="${GLASS}"/><path d="M52 98l8 12 8-12M60 98v12M58 40h8M58 56h8M58 72h8"/><circle cx="68" cy="100" r="4" fill="${METAL}"/>`),
  'Pipette': svg(`<path d="M56 30h8l2 66h-12z" fill="${GLASS}"/><circle cx="60" cy="24" r="9" fill="${GLASS}"/>`),
  'Funnel': svg(`<path d="M24 30h72L62 74v28h-4V74z" fill="${GLASS}"/>`),
  'Test tube': svg(`<path d="M48 20h24v62a12 12 0 0 1-24 0z" fill="${GLASS}"/><path d="M44 20h32"/>`),
  'Crucible': svg(`<path d="M38 54h44l-5 40H43z" fill="${METAL}"/><path d="M34 54h52M48 46h24v8H48z"/>`),
  'Mortar and pestle': svg(`<path d="M28 62h64l-10 34H38z" fill="${METAL}"/><path d="M62 20l12 42"/>`),
  'Spatula': svg(`<path d="M26 78l52-38M78 40c8-6 16-2 16 4s-8 10-16 4z" fill="${METAL}"/>`),
  'Striker': svg(`<path d="M34 56h52v20H34z" fill="${DARK}"/><path d="M40 50h40v6H40z" fill="${METAL}"/>`),
  'Watch glass': svg(`<path d="M20 72a40 22 0 0 1 80 0z" fill="${GLASS}"/>`),
  'Condenser': svg(`<path d="M44 20h32v80H44z" fill="${GLASS}"/><path d="M52 20v80M68 20v80M38 34h12M70 80h12"/>`),
  'Ring stand / Tripod': svg(`<path d="M60 20v72M32 92h56M40 92l20-52 20 52"/>`),
  'Evaporating dish': svg(`<path d="M24 56a36 18 0 0 0 72 0z" fill="${METAL}"/>`),
  'Glass stirring rod': svg(`<path d="M28 88L90 30"/><circle cx="90" cy="30" r="3" fill="${GLASS}"/>`),
  'Crucible tongs': svg(`<path d="M30 26l40 44M42 22l40 44M70 70l16 20"/>`),
  'Pasteur pipette with dropper bulb': svg(`<path d="M56 30h8l2 66h-12z" fill="${GLASS}"/><rect x="53" y="16" width="14" height="18" rx="7" fill="#3b82a6"/>`),
  'Test tube holder': svg(`<path d="M28 46h44v18H28z" fill="${METAL}"/><path d="M72 55h26"/>`),
  'Ring clamp with wire mesh': svg(`<path d="M28 30v60M28 76h56M40 76a18 14 0 0 1 36 0z" fill="${GLASS}"/>`),
  'Separatory funnel': svg(`<path d="M50 16h20v22l20 42a20 20 0 0 1-40 0l20-42z" fill="${GLASS}"/><path d="M58 82v22h4V82"/>`),
  'Büchner funnel': svg(`<path d="M32 34h56l-10 40H42z" fill="${GLASS}"/><path d="M42 74h36v20H42z" fill="${METAL}"/>`),
  'Wash bottle': svg(`<path d="M40 46h40l6 50H34z" fill="${GLASS}"/><path d="M52 46V28h18v18M70 28l14-12"/>`),
  'Bunsen burner': svg(`<path d="M48 58h24l6 42H42z" fill="${DARK}"/><path d="M54 42h12v16H54z" fill="${GLASS}"/><path d="M40 100h40"/>`),
};

export const glasswareSvg = (name) => GLASSWARE[name] || GLASSWARE['Beaker'];
