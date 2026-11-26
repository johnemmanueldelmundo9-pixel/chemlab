// Lesson discussion extras: compact switcher, lesson navigation, quiz CTA, and inline SVG visuals.
// Static, dependency-free, and additive — no existing route, id or selector is changed.

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const frame = (label, inner) => `
<svg viewBox="0 0 640 180" role="img" aria-label="${esc(label)}" preserveAspectRatio="xMidYMid meet">
  <rect x="1" y="1" width="638" height="178" rx="6" fill="#fffdf7" stroke="#c9bda8"/>
  ${inner}
</svg>`;

const dots = (x, y, cols, rows, gap, r, fill) => {
  let out = '';
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) out += `<circle cx="${x + i * gap}" cy="${y + j * gap}" r="${r}" fill="${fill}" stroke="#231f20" stroke-width="1.5"/>`;
  return out;
};
const dividers = (xs) => xs.map((x) => `<path d="M${x} 8v148" stroke="#c9bda8" fill="none"/>`).join('');
const labels = (items) => items.map(([x, t]) => `<text x="${x}" y="164" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#5c554a">${esc(t)}</text>`).join('');
const atom = (cx, cy, r, fill) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#231f20" stroke-width="2"/>`;
const bond = (x1, y1, x2, y2) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#231f20" stroke-width="5" stroke-linecap="round" fill="none"/>`;
const triatomic = (cx, cy, deg) => {
  const rad = deg * Math.PI / 180;
  const pt = (dx) => [(cx + dx * Math.cos(rad)).toFixed(1), (cy + dx * Math.sin(rad)).toFixed(1)];
  const [bx1, by1] = pt(-17), [bx2, by2] = pt(17);
  return bond(bx1, by1, cx, cy) + bond(cx, cy, bx2, by2)
    + atom(cx, cy, 9, '#0f766e') + atom(bx1, by1, 7, '#b45309') + atom(bx2, by2, 7, '#b45309');
};
const dimer = (x1, y1, x2, y2) => bond(x1, y1, x2, y2)
  + atom(x1, y1, 7, '#b45309') + atom(x2, y2, 7, '#b45309');
const box = (x, y, w, h, text, fill = '#fffdf7', stroke = '#c9bda8') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill}" stroke="${stroke}"/>` +
  `<text x="${x + w / 2}" y="${y + h / 2 + 5}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="650" fill="#231f20">${esc(text)}</text>`;

const BASIC_VISUALS = [
  {
    label: 'Matter sorted into an element, a compound and a mixture',
    caption: 'Physical sorting separates mixtures; compounds need a chemical change.',
    draw: () => frame('Matter sorted into an element, a compound and a mixture', `
      ${dividers([214, 428])}
      <g>
        ${atom(87, 68, 9, '#0f766e')}${atom(127, 68, 9, '#0f766e')}
        ${atom(87, 88, 9, '#0f766e')}${atom(127, 88, 9, '#0f766e')}
        ${atom(107, 58, 9, '#0f766e')}${atom(107, 98, 9, '#0f766e')}
      </g>
      <g>
        ${triatomic(285, 60, 0)}${triatomic(357, 60, 18)}
        ${triatomic(285, 100, -15)}${triatomic(357, 100, 8)}
      </g>
      <g>
        ${atom(474, 54, 9, '#0f766e')}${atom(524, 94, 9, '#0f766e')}${atom(566, 52, 9, '#0f766e')}
        ${dimer(470, 104, 488, 104)}${dimer(540, 116, 558, 116)}${dimer(590, 88, 608, 88)}
      </g>
      ${labels([[107, 'Element'], [321, 'Compound'], [534, 'Mixture']])}
      <g font-family="system-ui, -apple-system, sans-serif" font-size="9" fill="#5c554a">
        <circle cx="148" cy="176" r="4" fill="#0f766e" stroke="#231f20" stroke-width="1"/>
        <text x="157" y="179">Teal = Atom A</text>
        <circle cx="266" cy="176" r="4" fill="#b45309" stroke="#231f20" stroke-width="1"/>
        <text x="275" y="179">Brown = Atom B</text>
        <path d="M398 176h16" stroke="#231f20" stroke-width="3" stroke-linecap="round"/>
        <text x="420" y="179">Bar = Chemical bond</text>
      </g>`),
  },
  {
    label: 'Particle arrangements in solids, liquids and gases',
    caption: 'Particle spacing and freedom of movement distinguish the three states.',
    draw: () => frame('Particle arrangements in solids, liquids and gases', `
      ${dividers([214, 428])}
      ${dots(89, 60, 3, 3, 18, 4, '#0f766e')}
      ${dots(81, 65, 3, 2, 26, 4, '#0f766e')}
      ${dots(87, 58, 2, 2, 40, 4, '#0f766e')}
      ${labels([[107, 'Solid · ordered'], [321, 'Liquid · flowing'], [535, 'Gas · spread out']])}`),
  },
  {
    label: 'Seven fundamental SI units',
    caption: 'Every measurement carries a number and a unit; derived units come from these seven.',
    draw: () => frame('Seven fundamental SI units', `
      ${box(40, 58, 140, 62, 'Mass · kg')}${box(196, 58, 140, 62, 'Length · m')}${box(352, 58, 140, 62, 'Time · s')}${box(508, 58, 92, 62, 'mol')}
      ${box(40, 128, 140, 30, 'Current · A', '#f6f1e6')}${box(196, 128, 140, 30, 'Temperature · K', '#f6f1e6')}${box(352, 128, 248, 30, 'Luminous intensity · cd', '#f6f1e6')}`),
  },
  {
    label: 'A ruler reading illustrating significant figures',
    caption: 'Certain digits plus the first estimated digit give the significant figures.',
    draw: () => frame('A ruler reading illustrating significant figures', `
      <path d="M60 112h520" stroke="#231f20" stroke-width="2" fill="none"/>
      ${Array.from({ length: 11 }, (_, i) => `<path d="M${60 + i * 52} 112v${i % 5 === 0 ? 16 : 9}" stroke="#231f20" fill="none"/>`).join('')}
      <path d="M214 92v40" stroke="#b45309" stroke-width="3" fill="none"/>
      <text x="224" y="70" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#231f20">7.43 cm</text>
      ${labels([[80, 'certain'], [470, '3 significant figures']])}`),
  },
  {
    label: 'Scientific notation and an accuracy target',
    caption: 'Scientific notation keeps the scale; accuracy is closeness to the true value.',
    draw: () => frame('Scientific notation and an accuracy target', `
      <circle cx="180" cy="90" r="62" fill="none" stroke="#c9bda8"/>
      <circle cx="180" cy="90" r="32" fill="none" stroke="#c9bda8"/>
      <circle cx="180" cy="90" r="6" fill="#b45309"/>
      <path d="M262 54l-60 26M288 104l-74-10" stroke="#0f766e" stroke-width="2" fill="none"/>
      ${box(370, 54, 230, 40, '1.99 × 10⁻²³ g')}
      ${labels([[180, 'accurate + precise'], [485, 'N × 10ⁿ, 1 ≤ N < 10']])}`),
  },
  {
    label: 'A factor-label conversion chain',
    caption: 'Place the unwanted unit on the bottom so it cancels, then check the final unit.',
    draw: () => frame('A factor-label conversion chain', `
      ${box(32, 56, 120, 60, '2 m')}
      <path d="M160 86h36" stroke="#0f766e" stroke-width="2" fill="none"/>
      ${box(202, 56, 220, 60, '× (100 cm / 1 m)')}
      <path d="M430 86h36" stroke="#0f766e" stroke-width="2" fill="none"/>
      ${box(472, 56, 132, 60, '200 cm')}
      ${labels([[92, 'given'], [312, 'conversion factor'], [538, 'wanted unit']])}`),
  },
  {
    label: 'Counting particles by the mole',
    caption: 'One mole counts 6.022 × 10²³ particles; molar mass gives its mass in grams.',
    draw: () => frame('Counting particles by the mole', `
      ${dots(71, 67, 4, 2, 26, 6, '#0f766e')}
      ${box(300, 48, 300, 44, '1 mol = 6.022 × 10²³ particles')}
      ${box(300, 104, 300, 44, 'Ca(OH)₂ = 74.09 g/mol', '#f6f1e6')}
      ${labels([[110, 'particles'], [450, 'mole & molar mass']])}`),
  },
];

const GENERIC = (label) => frame(label, `
  ${box(60, 50, 240, 90, 'Read the idea')}
  ${box(340, 50, 240, 90, 'Check the working', '#f6f1e6')}
  ${labels([[180, 'concept'], [460, 'worked example']])}`);

const THERMO_VISUALS = [
  null,
  {
    caption: 'The solution gains the heat the reaction releases: q_reaction = −q_solution.',
    draw: () => frame('Coffee-cup calorimeter heat transfer', `
      <path d="M236 42h168l-14 108q-3 16-20 16H270q-17 0-20-16z" fill="rgba(185, 228, 238, 0.45)" stroke="#231f20" stroke-width="2"/>
      <path d="M236 42h168" stroke="#231f20" stroke-width="3" fill="none"/>
      <path d="M320 42v-26" stroke="#231f20" stroke-width="2" fill="none"/>
      <rect x="314" y="4" width="12" height="16" rx="4" fill="#f6f1e6" stroke="#231f20" stroke-width="2"/>
      <path d="M268 108q52 22 104 0" stroke="#0f766e" stroke-width="3" fill="none"/>
      <path d="M292 128l-26 20M348 128l26 20" stroke="#b45309" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      ${labels([[320, 'insulated cup · solution absorbs heat']])}
      <text x="320" y="152" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="#5c554a">q_reaction = −q_solution</text>`),
  },
  {
    caption: 'Exothermic products sit lower; endothermic products sit higher than reactants.',
    draw: () => frame('Enthalpy profiles for exothermic and endothermic reactions', `
      ${dividers([320])}
      <path d="M50 146V44M50 146h246" stroke="#231f20" stroke-width="2" fill="none"/>
      <path d="M64 76q46-38 92 0t92 34" stroke="#0f766e" stroke-width="3" fill="none"/>
      <path d="M64 76h184" stroke="#c9bda8" stroke-dasharray="4 3" fill="none"/>
      <path d="M64 110h184" stroke="#c9bda8" stroke-dasharray="4 3" fill="none"/>
      <text x="252" y="72" font-family="system-ui, sans-serif" font-size="11" fill="#5c554a">reactants</text>
      <text x="252" y="124" font-family="system-ui, sans-serif" font-size="11" fill="#5c554a">products</text>
      <path d="M360 146V44M360 146h246" stroke="#231f20" stroke-width="2" fill="none"/>
      <path d="M374 110q46-54 92-54t92-36" stroke="#b45309" stroke-width="3" fill="none"/>
      <path d="M374 110h184" stroke="#c9bda8" stroke-dasharray="4 3" fill="none"/>
      <path d="M374 56h184" stroke="#c9bda8" stroke-dasharray="4 3" fill="none"/>
      <text x="562" y="106" font-family="system-ui, sans-serif" font-size="11" fill="#5c554a">reactants</text>
      <text x="562" y="70" font-family="system-ui, sans-serif" font-size="11" fill="#5c554a">products</text>
      ${labels([[163, 'Exothermic · ΔH < 0'], [477, 'Endothermic · ΔH > 0']])}`),
  },
  null, null, null,
];

const ELECTRO_VISUALS = [
  null, null, null,
  {
    caption: 'Electrons flow through the wire; salt-bridge ions keep both compartments neutral.',
    draw: () => frame('Daniell galvanic cell with salt bridge', `
      <rect x="78" y="70" width="150" height="76" rx="8" fill="rgba(185, 228, 238, 0.45)" stroke="#231f20" stroke-width="2"/>
      <rect x="412" y="70" width="150" height="76" rx="8" fill="rgba(185, 228, 238, 0.45)" stroke="#231f20" stroke-width="2"/>
      <rect x="132" y="44" width="14" height="86" rx="3" fill="#c9c2b2" stroke="#231f20" stroke-width="2"/>
      <rect x="434" y="44" width="14" height="86" rx="3" fill="#b45309" stroke="#231f20" stroke-width="2"/>
      <path d="M139 44h302" stroke="#231f20" stroke-width="3" fill="none"/>
      <path d="M250 44l34 0-10-6M250 44l10 6" stroke="#0f766e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <text x="290" y="32" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" font-weight="700" fill="#0f766e">e⁻ flow →</text>
      <path d="M228 60q112 0 112 42" stroke="#231f20" stroke-width="3" fill="none"/>
      <text x="284" y="116" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="#5c554a">salt bridge</text>
      <text x="96" y="100" font-family="ui-monospace, monospace" font-size="11" fill="#0f766e">anode −</text>
      <text x="452" y="100" font-family="ui-monospace, monospace" font-size="11" fill="#b45309">cathode +</text>
      <text x="96" y="132" font-family="system-ui, sans-serif" font-size="10" fill="#5c554a">Zn → Zn²⁺ + 2e⁻</text>
      <text x="432" y="132" font-family="system-ui, sans-serif" font-size="10" fill="#5c554a">Cu²⁺ + 2e⁻ → Cu</text>
      ${labels([[153, 'oxidation (anode)'], [487, 'reduction (cathode)']])}`),
  },
  null, null,
];

export function lessonSwitcher(m, lessonIndex) {
  const lessons = m.outline?.lessons || [];
  if (!lessons.length) return '';
  return `<nav class="lesson-switch" aria-label="Lessons in ${esc(m.title)}">${lessons.map((t, i) =>
    `<a class="lesson-switch-link${i === lessonIndex ? ' is-current' : ''}" href="#/module/${m.id}?item=lesson-${i + 1}"${i === lessonIndex ? ' aria-current="page"' : ''}>${i + 1}. ${esc(t)}</a>`
  ).join('')}</nav>`;
}

export function lessonNav(m, lessonIndex) {
  const lessons = m.outline?.lessons || [];
  if (!lessons.length) return '';
  const prev = lessons[lessonIndex - 1], next = lessons[lessonIndex + 1];
  return `<div class="lesson-nav">
    ${prev ? `<a class="btn btn-ghost" href="#/module/${m.id}?item=lesson-${lessonIndex}">← Previous lesson</a>` : '<span></span>'}
    ${next ? `<a class="btn btn-ghost" href="#/module/${m.id}?item=lesson-${lessonIndex + 2}">Next lesson →</a>` : '<span></span>'}
  </div>`;
}

export function startQuizBar(m, hasQuiz) {
  if (!hasQuiz) return '';
  return `<div class="quiz-cta-row"><a class="quiz-cta" href="#/quiz/${m.id}">Start Quiz</a>
    <span class="quiz-cta-note">${esc(m.title)} · module quiz</span></div>`;
}

export function lessonVisuals(m, lessonIndex) {
  const library = m.id === 'basic-concepts' ? BASIC_VISUALS
    : m.id === 'thermo-equilibrium' ? THERMO_VISUALS
    : m.id === 'electrochemistry' ? ELECTRO_VISUALS : null;
  if (!library) return '';
  const v = library[lessonIndex];
  if (!v) return '';
  return `<figure class="lesson-visual">${v.draw()}<figcaption>${esc(v.caption)}</figcaption></figure>`;
}

export { GENERIC };
