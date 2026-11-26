// PPE Doll Studio — modular SVG asset definitions.
// Follows .agents/skills/svg-asset-craft/SKILL.md: one 280x460 grid, closed paths,
// explicit hex/RGBA fills, namespace-safe mounting. No external dependencies.

export const SVG_NS = 'http://www.w3.org/2000/svg';
export const VIEWBOX = '0 0 280 460';

export const LANDMARKS = {
  crown: [140, 26], eyes: [[128, 74], [152, 74]], ears: [[104, 80], [176, 80]],
  neck: [140, 120], shoulders: [[96, 130], [184, 130]], wrists: [[58, 260], [222, 260]],
  waist: [140, 240], knees: [[112, 330], [168, 330]], ankles: [[118, 404], [162, 404]],
};

const INK = '#231f20';
const SKIN = '#f4dfd0';
const HAIR = '#3a2a20';

export const ASSET_DEFS = [
  {
    key: 'mannequin-base', label: 'Mannequin base', z: 0,
    markup: `<rect x="34" y="16" width="212" height="428" rx="34" fill="none" stroke="#b8aa96" stroke-width="1.5" stroke-dasharray="5 5" aria-hidden="true"/>
    <g stroke="${INK}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
      <!-- tied-back crop and bun -->
      <path d="M105 72 C103 43 117 27 140 27 C163 27 177 43 175 72 C166 55 154 49 140 49 C126 49 114 55 105 72 Z" fill="${HAIR}"/>
      <ellipse cx="140" cy="34" rx="14" ry="9" fill="${HAIR}"/>
      <!-- ears and face -->
      <path d="M106 78 q-10 -5 -9 7 q2 10 10 8" fill="${SKIN}"/>
      <path d="M174 78 q10 -5 9 7 q-2 10 -10 8" fill="${SKIN}"/>
      <ellipse cx="140" cy="74" rx="34" ry="40" fill="${SKIN}"/>
      <path d="M119 67 q9 -6 18 0 M143 67 q9 -6 18 0" fill="none" stroke-width="1.5"/>
      <ellipse cx="128" cy="75" rx="3.2" ry="2.6" fill="${INK}" stroke="none"/>
      <ellipse cx="152" cy="75" rx="3.2" ry="2.6" fill="${INK}" stroke="none"/>
      <path d="M140 79 l-3 9 h6" fill="none" stroke-width="1.3"/>
      <path d="M130 98 q10 6 20 0" fill="none" stroke-width="1.5"/>
      <!-- neck and sculpted torso -->
      <path d="M128 108 v18 q12 9 24 0 v-18" fill="${SKIN}"/>
      <path d="M98 129 Q140 115 182 129 L190 156 L180 232 Q140 244 100 232 L90 156 Z" fill="${SKIN}"/>
      <path d="M112 148 q28 12 56 0 M110 196 q30 8 60 0" fill="none" stroke-width="1.2"/>
      <!-- arms to the wrist landmarks -->
      <path d="M96 135 C78 158 66 202 52 244 L64 252 C78 212 90 170 106 151 Z" fill="${SKIN}"/>
      <path d="M184 135 C202 158 214 202 228 244 L216 252 C202 212 190 170 174 151 Z" fill="${SKIN}"/>
      <!-- five-fingered hands -->
      <path d="M48 256 q-10 2 -11 10 l-1 6 q0 6 6 6 l2 -7 q1 8 4 8 l1 -9 q2 9 5 9 l2 -9 q3 8 6 7 l3 -8 q4 6 7 2 q3 -5 -4 -10 q-7 -5 -20 -5 z" fill="${SKIN}"/>
      <path d="M232 256 q10 2 11 10 l1 6 q0 6 -6 6 l-2 -7 q-1 8 -4 8 l-1 -9 q-2 9 -5 9 l-2 -9 q-3 8 -6 7 l-3 -8 q-4 6 -7 2 q-3 -5 4 -10 q7 -5 20 -5 z" fill="${SKIN}"/>
      <!-- thighs, knees, calves, ankles -->
      <path d="M104 246 L106 330 L104 404 L128 404 L130 330 L132 250 Z" fill="${SKIN}"/>
      <path d="M148 250 L150 330 L148 404 L172 404 L174 330 L176 246 Z" fill="${SKIN}"/>
      <path d="M108 330 q10 5 18 0 M154 330 q10 5 18 0" fill="none" stroke-width="1.2"/>
      <path d="M106 356 q10 6 20 0 M154 356 q10 6 20 0" fill="none" stroke-width="1.2"/>
      <!-- bare feet aligned to shoe overlays -->
      <path d="M104 404 Q100 424 116 430 L134 430 Q138 426 128 406 Z" fill="${SKIN}"/>
      <path d="M176 404 Q180 424 164 430 L146 430 Q142 426 152 406 Z" fill="${SKIN}"/>
      <!-- base undershirt and athletic shorts -->
      <path d="M104 130 Q140 122 176 130 L180 158 L170 234 Q140 244 110 234 L100 158 Z" fill="#e8e3d9"/>
      <path d="M126 130 L140 145 L154 130" fill="none" stroke-width="1.5"/>
      <path d="M104 232 L176 232 L174 310 L150 308 L140 276 L130 308 L106 310 Z" fill="#d9d2c4"/>
      <path d="M104 236 h72 M110 306 q8 3 16 0 M154 308 q8 3 16 0" fill="none" stroke-width="1.2"/>
    </g>`,
  },
  {
    key: 'lab-coat', label: 'Lab coat', z: 6,
    markup: `<g class="ppe-layer" stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="#ffffff">
      <path d="M98 128 Q140 116 182 128 L190 154 L180 308 Q140 320 100 308 L90 154 Z" fill="#ffffff"/>
      <path d="M98 128 L88 154 L50 244 L64 252 L104 156 Z" fill="#f6f4ee"/>
      <path d="M182 128 L192 154 L230 244 L216 252 L176 156 Z" fill="#f6f4ee"/>
      <path d="M50 244 L64 252 M216 252 L230 244" fill="none"/>
      <path d="M116 128 L140 154 L164 128 L152 126 L140 140 L128 126 Z" fill="#f6f4ee"/>
      <path d="M140 140 L140 312" fill="none" stroke-width="1.6"/>
      <circle cx="132" cy="176" r="2.8" fill="${INK}" stroke="none"/><circle cx="132" cy="206" r="2.8" fill="${INK}" stroke="none"/><circle cx="132" cy="236" r="2.8" fill="${INK}" stroke="none"/><circle cx="132" cy="266" r="2.8" fill="${INK}" stroke="none"/>
      <circle cx="148" cy="176" r="2.8" fill="${INK}" stroke="none"/><circle cx="148" cy="206" r="2.8" fill="${INK}" stroke="none"/><circle cx="148" cy="236" r="2.8" fill="${INK}" stroke="none"/><circle cx="148" cy="266" r="2.8" fill="${INK}" stroke="none"/>
      <rect x="106" y="246" width="26" height="32" rx="3" fill="#f6f4ee"/><rect x="148" y="246" width="26" height="32" rx="3" fill="#f6f4ee"/>
      <rect x="156" y="160" width="20" height="22" rx="2" fill="#f6f4ee"/>
    </g>`,
  },
  {
    key: 'long-pants', label: 'Long pants', z: 3,
    markup: `<g class="ppe-layer" stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="#d8d2c5">
      <path d="M104 246 L176 246 L174 404 L150 404 L140 282 L130 404 L106 404 Z" fill="#d8d2c5"/>
      <path d="M104 250 h72" stroke="#4a5568" stroke-width="5" fill="none"/>
      <path d="M116 258 L114 398 M164 258 L166 398" stroke="#4a5568" stroke-width="1.4" fill="none"/>
      <path d="M106 396 h24 M150 396 h24" stroke="#4a5568" stroke-width="2" fill="none"/>
    </g>`,
  },
  {
    key: 'closed-shoes', label: 'Closed shoes', z: 5,
    markup: `<g class="ppe-layer" stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="#3b332b">
      <path d="M106 402 Q100 422 116 432 L136 432 Q142 428 132 406 Z" fill="#3b332b"/>
      <path d="M174 402 Q180 422 164 432 L144 432 Q138 428 148 406 Z" fill="#3b332b"/>
      <path d="M104 429 Q120 439 138 429 M142 429 Q160 439 176 429" fill="#1f1a16" stroke="none"/>
      <path d="M112 412 l16 6 M114 420 l16 6 M166 412 l-16 6 M164 420 l-16 6" fill="none" stroke="#d9cfc0" stroke-width="1.6"/>
    </g>`,
  },
  {
    key: 'safety-goggles', label: 'Safety goggles', z: 8,
    markup: `<g class="ppe-layer" stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
      <path d="M104 58 Q140 50 176 58 L178 82 Q140 92 102 82 Z" fill="rgba(140, 215, 230, 0.55)"/>
      <path d="M104 58 L94 60 v18 l10 -2 M176 58 l10 2 v18 l-10 -2" fill="#ffffff"/>
      <path d="M94 62 h-18 M184 62 h18" stroke="#111111" stroke-width="4" fill="none"/>
      <path d="M114 68 h18 M148 68 h18" stroke="#ffffff" stroke-width="2" fill="none"/>
    </g>`,
  },
  {
    key: 'nitrile-gloves', label: 'Nitrile gloves', z: 7,
    markup: `<g class="ppe-layer" stroke="#23566f" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="#3b82a6">
      <path d="M44 244 q-8 0 -9 10 l-1 12 q0 8 8 9 l14 1 q8 0 10 -8 l2 -12 q1 -10 -8 -12 z" fill="#3b82a6"/>
      <path d="M236 244 q8 0 9 10 l1 12 q0 8 -8 9 l-14 1 q-8 0 -10 -8 l-2 -12 q-1 -10 8 -12 z" fill="#3b82a6"/>
      <path d="M36 246 q10 6 22 0 M222 246 q10 6 22 0" fill="none" stroke="#e6f3f8" stroke-width="3"/>
      <path d="M31 262 l-5 8 M37 269 l-4 9 M44 272 l-2 10 M52 272 l2 10 M59 268 l6 8" fill="none" stroke="#23566f" stroke-width="1.8"/>
      <path d="M249 262 l5 8 M243 269 l4 9 M236 272 l2 10 M228 272 l-2 10 M221 268 l-6 8" fill="none" stroke="#23566f" stroke-width="1.8"/>
    </g>`,
  },
  {
    key: 'sandals', label: 'Sandals', z: 4,
    markup: `<g class="ppe-layer" stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
      <path d="M104 418 Q100 432 116 436 L136 436 Q142 432 132 414 Z" fill="#c8a56a"/>
      <path d="M176 418 Q180 432 164 436 L144 436 Q138 432 148 414 Z" fill="#c8a56a"/>
      <path d="M108 420 q12 -10 24 -2 M116 414 q10 -8 20 -2" fill="none" stroke="#8a6a3c" stroke-width="3"/>
      <path d="M172 420 q-12 -10 -24 -2 M164 414 q-10 -8 -20 -2" fill="none" stroke="#8a6a3c" stroke-width="3"/>
      <circle cx="112" cy="411" r="3" fill="${SKIN}" stroke="none"/><circle cx="120" cy="409" r="3" fill="${SKIN}" stroke="none"/><circle cx="128" cy="411" r="3" fill="${SKIN}" stroke="none"/>
      <circle cx="168" cy="411" r="3" fill="${SKIN}" stroke="none"/><circle cx="160" cy="409" r="3" fill="${SKIN}" stroke="none"/><circle cx="152" cy="411" r="3" fill="${SKIN}" stroke="none"/>
    </g>`,
  },
  {
    key: 'shorts', label: 'Shorts', z: 2,
    markup: `<g class="ppe-layer" stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="#c9c2b2">
      <path d="M104 246 L176 246 L174 320 L150 318 L140 286 L130 318 L106 320 Z" fill="#c9c2b2"/>
      <path d="M104 250 h72" stroke="#8a8474" stroke-width="4" fill="none"/>
      <path d="M110 318 q8 4 16 2 M154 320 q8 2 16 -2" fill="none" stroke-width="1.4"/>
      <rect x="110" y="252" width="20" height="14" rx="2" fill="#d8d2c5"/>
      <rect x="150" y="252" width="20" height="14" rx="2" fill="#d8d2c5"/>
    </g>`,
  },
  {
    key: 'dangling-jewelry', label: 'Dangling jewelry', z: 9,
    markup: `<g class="ppe-layer" stroke="#a67c22" stroke-width="2" fill="none" stroke-linecap="round">
      <circle cx="103" cy="84" r="7" stroke="#d4a63a" stroke-width="3"/>
      <circle cx="177" cy="84" r="7" stroke="#d4a63a" stroke-width="3"/>
      <path d="M126 126 Q140 156 154 126" stroke="#d4a63a" stroke-width="3"/>
      <path d="M132 132 Q140 168 148 132" stroke="#e3bd57" stroke-width="2"/>
      <circle cx="140" cy="176" r="5" fill="#d4a63a" stroke="#a67c22"/>
    </g>`,
  },
  {
    key: 'loose-hair', label: 'Loose hair', z: 1,
    markup: `<g class="ppe-layer" stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="${HAIR}">
      <path d="M106 62 Q98 120 92 190 Q98 246 88 270 L108 262 Q118 210 116 146 Z" fill="${HAIR}"/>
      <path d="M174 62 Q182 120 188 190 Q182 246 192 270 L172 262 Q162 210 164 146 Z" fill="${HAIR}"/>
      <path d="M114 70 Q140 88 166 70" fill="none" stroke-width="1.4"/>
      <path d="M102 110 Q98 180 96 236 M178 110 Q182 180 184 236" fill="none" stroke="#5c4635" stroke-width="1.4"/>
    </g>`,
  },
  {
    key: 'synthetic-nails', label: 'Synthetic nails', z: 10,
    markup: `<g class="ppe-layer" stroke="#a32f52" stroke-width="1.4" stroke-linejoin="round" fill="#d2486a">
      <path d="M38 266 l-4 14 4 -3 3 9 3 -9 4 3 -4 -14 z"/>
      <path d="M44 270 l-3 12 4 -3 3 8 3 -8 4 3 -3 -12 z"/>
      <path d="M242 266 l4 14 -4 -3 -3 9 -3 -9 -4 3 4 -14 z"/>
      <path d="M236 270 l3 12 -4 -3 -3 8 -3 -8 -4 3 3 -12 z"/>
    </g>`,
  },
];

export const BASE_MARKUP = ASSET_DEFS[0].markup;
export const LAYER_MARKUP = Object.fromEntries(ASSET_DEFS.slice(1).map((a) => [a.key, a.markup]));

export const ZONE_MARKERS = `<g class="studio-zones" fill="none" stroke="#4a5568" stroke-width="1.4" stroke-dasharray="3 3" opacity="0.65">
  <circle data-zone="head" cx="98" cy="58" r="5"/><circle data-zone="eyes" cx="182" cy="58" r="5"/>
  <circle data-zone="torso" cx="140" cy="190" r="5"/><circle data-zone="hands" cx="56" cy="284" r="5"/>
  <circle data-zone="legs" cx="140" cy="350" r="5"/><circle data-zone="feet" cx="140" cy="440" r="5"/>
</g>`;

// Red hazard callouts: ring + ! badge on the affected body zone.
export const HAZARD_ZONES = {
  head: { cx: 140, cy: 70, rx: 38, ry: 46, badge: [190, 48] },
  eyes: { cx: 140, cy: 74, rx: 34, ry: 18, badge: [190, 76] },
  torso: { cx: 140, cy: 190, rx: 52, ry: 70, badge: [202, 148] },
  hands: { cx: 56, cy: 264, rx: 18, ry: 20, badge: [34, 236], second: 224 },
  legs: { cx: 140, cy: 332, rx: 44, ry: 100, badge: [198, 300] },
  feet: { cx: 140, cy: 420, rx: 48, ry: 20, badge: [198, 416] },
};

export function hazardMarkup(zone) {
  const z = HAZARD_ZONES[zone];
  if (!z) return '';
  const ring = (cx) => `<ellipse cx="${cx}" cy="${z.cy}" rx="${z.rx}" ry="${z.ry}" fill="rgba(220, 38, 38, 0.10)" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="6 4"/>`;
  return `<g class="studio-hazard" stroke-linecap="round">
    ${ring(z.cx)}${z.second ? ring(z.second) : ''}
    <circle cx="${z.badge[0]}" cy="${z.badge[1]}" r="13" fill="#dc2626" stroke="#fdfbf5" stroke-width="2"/>
    <text x="${z.badge[0]}" y="${z.badge[1] + 5}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="800" fill="#ffffff">!</text>
  </g>`;
}

// Faint body guide shown behind every cutout thumbnail so the layer's body position is obvious.
export const SILHOUETTE_SVG = `<svg xmlns="${SVG_NS}" viewBox="${VIEWBOX}" opacity="0.18" aria-hidden="true">
  <g fill="#f4dfd0" stroke="#231f20" stroke-width="3" stroke-linejoin="round">
    <ellipse cx="140" cy="74" rx="34" ry="40"/><path d="M128 108 v18 q12 9 24 0 v-18"/>
    <path d="M98 129 Q140 115 182 129 L190 156 L180 232 Q140 244 100 232 L90 156 Z"/>
    <path d="M96 135 C78 158 66 202 52 244 L64 252 C78 212 90 170 106 151 Z"/>
    <path d="M184 135 C202 158 214 202 228 244 L216 252 C202 212 190 170 174 151 Z"/>
    <path d="M104 246 L106 404 L128 404 L130 250 Z"/><path d="M148 250 L150 404 L172 404 L176 246 Z"/>
  </g>
</svg>`;

export function standaloneSvg(key) {
  const def = ASSET_DEFS.find((a) => a.key === key);
  if (!def) throw new Error(`Unknown asset: ${key}`);
  return `<svg xmlns="${SVG_NS}" viewBox="${VIEWBOX}" role="img" aria-labelledby="title-${key}"><title id="title-${key}">${def.label} — layered laboratory paper-doll asset</title>${def.markup}</svg>`;
}

export const STANDALONE = Object.fromEntries(ASSET_DEFS.map((a) => [a.key, standaloneSvg(a.key)]));

// Runtime guard: <g> nodes built with document.createElement land in the HTML
// namespace and browsers silently refuse to paint them. Check every node.
export function assertSvgNamespace(node) {
  const bad = [];
  if (!node || node.namespaceURI !== SVG_NS) bad.push(node || 'null');
  node?.querySelectorAll('*').forEach((n) => { if (n.namespaceURI !== SVG_NS) bad.push(n); });
  if (bad.length) console.error('[svg-asset-craft] non-SVG namespace node(s):', bad);
  return bad.length === 0;
}

export function mountSvgLayer(svgEl, markup) {
  const tpl = document.createElement('template');
  tpl.innerHTML = `<svg xmlns="${SVG_NS}">${markup}</svg>`;
  const source = tpl.content.querySelector('svg');
  // Import EVERY top-level node: base markup is a cut-line <rect> plus the body <g>.
  // Importing only firstElementChild silently drops the human figure.
  const nodes = [...source.childNodes].map((n) => document.importNode(n, true));
  const bad = nodes.filter((n) => n.nodeType === 1 && !assertSvgNamespace(n));
  if (bad.length) throw new Error('Refusing to mount an HTML-namespaced <g>');
  nodes.forEach((n) => svgEl.appendChild(n));
  return nodes;
}

/* ChemLab compatibility: map studio keys to the existing 10-item PPE scoring array.
   0 lab gown, 1 closed shoes, 2 long pants, 3 goggles, 4 gloves,
   5 sandals, 6 shorts, 7 jewelry, 8 loose hair, 9 nails. */
const PPE_ORDER = [
  'lab-coat', 'closed-shoes', 'long-pants', 'safety-goggles', 'nitrile-gloves',
  'sandals', 'shorts', 'dangling-jewelry', 'loose-hair', 'synthetic-nails',
];
export const DOLL_BASE_SVG = standaloneSvg('mannequin-base');
export const PPE_LAYERS = Object.fromEntries(PPE_ORDER.map((key, i) => [i, LAYER_MARKUP[key]]));
export const CUTOUT_THUMBNAILS = Object.fromEntries(ASSET_DEFS.slice(1).map((a) => [a.key, standaloneSvg(a.key)]));
