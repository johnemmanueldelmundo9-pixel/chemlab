// Lab-safety widgets for Module 1. They are registered in widgets.js through LAB_WIDGETS.
// Uses the .wd-* classes from lesson.css plus the small "Lab safety widgets" block added at the end of that file.
const $ = (r, s) => r.querySelector(s);
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

/* Generic multiple-choice game. bank: [[prompt, correctAnswer, why], ...]
   fixed = a list of options that never changes (e.g. waste categories); otherwise 3 wrong options come from the other answers. */
function game(h, bank, { n = 8, fixed = null, label = 'Question' } = {}) {
  const pool = [...new Set(bank.map((b) => b[1]))];
  let set, i, score, opts, done;
  const start = () => { set = shuffle(bank).slice(0, n); i = 0; score = 0; draw(); };
  const draw = () => {
    if (i >= set.length) {
      const msg = score === set.length ? 'Perfect.' : score >= set.length * 0.7 ? 'Good work.' : 'Review the lesson, then play again for a new set.';
      h.innerHTML = `<div class="wd-body"><p class="wd-big">${score} of ${set.length} correct</p><p>${msg}</p><div><button type="button" class="btn btn-ghost btn-sm" data-r>Play again</button></div></div>`;
      return;
    }
    done = false;
    const [q, a] = set[i];
    opts = fixed || shuffle([a, ...shuffle(pool.filter((x) => x !== a)).slice(0, 3)]);
    h.innerHTML = `<div class="wd-body"><p class="wd-label">${label} ${i + 1} of ${set.length}</p><p class="wd-big">${q}</p>
      <div class="wd-btns" style="grid-template-columns:1fr">${opts.map((o, k) => `<button type="button" data-k="${k}">${o}</button>`).join('')}</div>
      <p class="wd-fb" role="status" aria-live="polite"></p></div>`;
  };
  h.onclick = (e) => {
    if (e.target.closest('[data-r]')) { start(); return; }
    if (e.target.closest('[data-n]')) { i++; draw(); return; }
    const b = e.target.closest('[data-k]');
    if (!b || done) return;
    done = true;
    const [, a, why] = set[i], ok = opts[+b.dataset.k] === a;
    if (ok) score++;
    h.querySelectorAll('[data-k]').forEach((x) => { x.disabled = true; if (opts[+x.dataset.k] === a) x.classList.add('right'); });
    if (!ok) b.classList.add('wrong');
    $(h, '.wd-fb').innerHTML = `<strong>${ok ? 'Correct.' : 'Not quite.'}</strong> ${why} <button type="button" class="btn btn-primary btn-sm" data-n>${i === set.length - 1 ? 'See score' : 'Next'}</button>`;
    $(h, '[data-n]').focus();
  };
  start();
}

/* ---------- banks ---------- */
const GLASS = [
  ['Measure about 25 mL of a liquid.', 'Graduated cylinder', 'It is marked with a volume scale for approximate measuring.'],
  ['Swirl and heat a solution without it splashing out.', 'Erlenmeyer flask', 'The narrow neck keeps liquid in while you swirl.'],
  ['Hold, mix or roughly heat a liquid.', 'Beaker', 'A general-purpose container. Its markings are only approximate.'],
  ['Cover a small sample, or let a few drops evaporate.', 'Watch glass', 'A shallow curved dish of glass.'],
  ['Pick up a hot crucible.', 'Crucible tongs', 'Never use your hands: hot glass looks like cold glass.'],
  ['Transfer a small amount of a solid reagent.', 'Spatula', 'Chemicals are never touched with fingers.'],
  ['Add a liquid a few drops at a time.', 'Pasteur pipette with dropper bulb', 'Never fill a pipette by mouth.'],
  ['Hold a test tube while it is being heated.', 'Test tube holder', 'It keeps your fingers away from the heat.'],
  ['Light a Bunsen burner.', 'Striker', 'Check that no flammable solvents are nearby first.'],
  ['Support a flask over a flame so it is heated evenly.', 'Ring clamp with wire mesh', 'The mesh spreads the heat so the glass does not touch the flame.'],
  ['Separate two liquids that do not mix.', 'Separatory funnel', 'The denser liquid is drained from the bottom.'],
  ['Cool a vapor back into a liquid during distillation.', 'Condenser', 'Cold water flows through its outer jacket.'],
  ['Evaporate a solution to leave the solid behind.', 'Evaporating dish', 'A wide, shallow dish gives a large surface for evaporation.'],
  ['Filter a mixture quickly using suction.', 'B\u00fcchner funnel', 'Used together with a side-arm flask and vacuum tubing.'],
  ['Rinse glassware with distilled water.', 'Wash bottle', 'Squeezing the bottle gives a controlled stream.'],
  ['Stir a solution.', 'Glass stirring rod', 'Glass does not react with most solutions.'],
];
const WASTE = [
  ['Sodium chloride', 'Salts', 'A simple salt.'], ['Magnesium sulfate', 'Salts', 'A simple salt.'], ['Sodium bicarbonate', 'Salts', 'A simple salt.'],
  ['Sulfuric acid', 'Acids', 'A strong inorganic acid.'], ['Hydrochloric acid', 'Acids', 'A strong acid.'], ['Benzoic acid', 'Acids', 'An organic acid, still handled with acid waste.'], ['Nitric acid', 'Acids', 'A strong acid. Keep it separate from other waste.'],
  ['Sodium hydroxide', 'Bases', 'A strong base.'], ['Potassium hydroxide', 'Bases', 'A strong base.'], ['Ammonium hydroxide', 'Bases', 'A base.'],
  ['Ethanol', 'Organic', 'An alcohol: an organic solvent.'], ['Acetone', 'Organic', 'An organic solvent. It is also flammable.'], ['Hexane', 'Organic', 'An organic solvent.'], ['Xylene', 'Organic', 'An organic solvent.'],
  ['Silver nitrate', 'Inorganic', 'An inorganic compound that needs its own waste container.'], ['Potassium permanganate', 'Inorganic', 'An inorganic oxidizer.'],
];
const CABINET = [
  ['Hydrochloric acid', 'Acid cabinet', 'Acids go in a dedicated acid cabinet.'], ['Sulfuric acid', 'Acid cabinet', 'Acids go in a dedicated acid cabinet.'],
  ['Acetone', 'Flammable liquid cabinet', 'Flammables go in an approved flammable liquid storage cabinet.'], ['Hexane', 'Flammable liquid cabinet', 'Flammables go in an approved flammable liquid storage cabinet.'], ['Ethanol', 'Flammable liquid cabinet', 'Flammables go in an approved flammable liquid storage cabinet.'],
  ['Potassium cyanide (highly toxic)', 'Locked poison cabinet', 'Highly toxic chemicals need a lockable, clearly labelled poison cabinet.'], ['Mercury compounds (highly toxic)', 'Locked poison cabinet', 'Highly toxic chemicals need a lockable, clearly labelled poison cabinet.'],
  ['Concentrated ammonia solution (strong odour)', 'Ventilated cabinet', 'Volatile and strong-smelling chemicals are stored in a ventilated cabinet.'],
  ['Sodium metal (reacts with water)', 'Water-tight, cool and dry cabinet', 'Water-sensitive chemicals are kept dry and apart from all other chemicals.'],
];
const AID = [
  ['Acid splashes on your arm.', 'Remove affected clothing and rinse with plenty of water for at least 15 minutes.', 'Large amounts of water, for a long time: at a sink, shower or hose.'],
  ['A chemical gets in your eye.', 'Rinse eyes, eyelids and face with lukewarm water at the eyewash station for at least 15 minutes.', 'Keep rinsing the full 15 minutes, then get medical help.'],
  ['You get a small cut from glass.', 'Rinse with water, press a sterile pad on the cut and apply a dressing.', 'Gentle, even pressure stops minor bleeding.'],
  ['A cut will not stop bleeding.', 'Keep gentle pressure on a sterile pad and call the school nurse immediately.', 'Significant bleeding needs help straight away.'],
  ['You have a first-degree burn: red skin, mild swelling and pain.', 'Rinse or immerse it in water for at least 10 minutes.', 'Cooling in water, then a skin cream if appropriate.'],
  ['A burn has blisters, or looks white or charred.', 'Clean the area if possible, keep it dry and call for medical help.', 'Second- and third-degree burns need a medical professional.'],
  ['A flammable liquid spills near a flame.', 'Extinguish all flames, shut down experiments and vacate the room.', 'A spill that is a fire hazard means everyone leaves until it is corrected.'],
  ['A small acid spill lands on the floor.', 'Contain it, clear the area, cover it with powdered sodium bicarbonate and clean up.', 'Absorb and neutralise, dispose of the waste properly, then mop the floor dry.'],
];
const CONDUCT = [
  ['Eating a snack at your bench while you wait.', 'Not allowed', 'No eating, drinking or smoking in the lab.'],
  ['Reading the whole procedure before you start.', 'Allowed', 'This is required: study the procedure and its hazards beforehand.'],
  ['Working alone on a dangerous procedure.', 'Not allowed', 'Do not work alone, especially when procedures are dangerous.'],
  ['Leaving a heating experiment to check your phone.', 'Not allowed', 'Never leave experiment operations unattended.'],
  ['Asking the instructor how a piece of equipment works.', 'Allowed', 'If you do not understand it, ask for help.'],
  ['Sitting on the laboratory bench.', 'Not allowed', 'Benches are for work, not for sitting.'],
  ['Trying to catch a beaker that is falling.', 'Not allowed', 'Never attempt to catch falling objects. Step back and clean up safely.'],
  ['Trying your own variation of the experiment.', 'Not allowed', 'No unauthorized experiments.'],
  ['Washing your hands before and after the experiment.', 'Allowed', 'Always wash before and after.'],
  ['Keeping the path to the exit clear.', 'Allowed', 'Exits and emergency equipment must never be blocked.'],
  ['Filling a pipette by mouth suction.', 'Not allowed', 'Never use mouth suction. Use a pipette bulb.'],
  ['Smelling or tasting a chemical to identify it.', 'Not allowed', 'Do not taste or smell chemicals.'],
  ['Pouring unused chemical back into the stock bottle.', 'Not allowed', 'Never return unused chemicals to the original container.'],
  ['Carrying a bottle that is too heavy for you.', 'Not allowed', 'Never carry bottles or containers that are too heavy for you.'],
];
const FIVES = [
  ['Seiri', 'Sort: remove everything you do not need', 'Eliminate unnecessary items.'],
  ['Seiton', 'Set in order: a clearly marked place for everything', 'Everything needed has a defined, labelled place.'],
  ['Seiso', 'Shine: clean the workplace thoroughly and regularly', 'Clean it thoroughly on a regular basis.'],
  ['Seiketsu', 'Sanitize: keep cleanliness at a high standard', 'Maintain a high standard of cleanliness at all times.'],
  ['Shitsuke', 'Self-discipline: put everything back where it belongs', 'The habit that keeps the other four going.'],
];
const AREAS = [
  ['A steel bridge is slowly turning to rust.', 'Corrosion and material degradation', 'Rusting is a chemical process.'],
  ['Choosing between aluminium, steel and plastic for a part.', 'Materials selection', 'Chemistry explains the composition, structure and behaviour of materials.'],
  ['Designing a battery pack for a vehicle.', 'Energy and fuels', 'Batteries, combustion and fuels depend on chemical reactions.'],
  ['Treating wastewater before it is released.', 'Water and environmental engineering', 'pH, contaminants and pollution are chemistry problems.'],
  ['Choosing a coating and cleaning process for a factory line.', 'Manufacturing and industrial processes', 'Coatings, cleaning and quality control all involve chemistry.'],
  ['Writing the rules for storing acids and solvents safely.', 'Safety', 'Knowing how acids, bases and flammables behave makes workplaces safer.'],
  ['A machine part keeps failing and nobody can see why.', 'Problem-solving', 'A problem that looks mechanical may actually be a chemical change.'],
];

/* ---------- Dress for the lab ---------- */
const PPE = [
  ['Lab gown: full length, long sleeves', true, 'Protects your skin and clothes from splashes.'],
  ['Closed shoes that cover the whole foot', true, 'Protect against spills and broken glass.'],
  ['Long pants', true, 'Cover your legs completely.'],
  ['Safety goggles', true, 'Protect your eyes. Contact lenses should be avoided where possible.'],
  ['Chemical-resistant gloves (for toxic, corrosive or volatile chemicals)', true, 'No glove protects against every chemical, so choose one that suits the chemical.'],
  ['Sandals or open-toed shoes', false, 'Never allowed: they leave your feet exposed.'],
  ['Shorts', false, 'Long pants that cover the legs are the standard.'],
  ['Dangling jewelry', false, 'Remove it: it can catch on equipment.'],
  ['Long hair left loose', false, 'Tie it back and fold up loose long sleeves.'],
  ['Synthetic fingernails', false, 'Not recommended: they are made of a very flammable polymer.'],
];
function ppe(h) {
  h.innerHTML = `<div class="wd-body"><fieldset class="wd-fs"><legend class="wd-h">You are about to handle a corrosive liquid. Tick everything you will wear or do.</legend>
    ${PPE.map((p, i) => `<label class="wd-check"><input type="checkbox" data-i="${i}"><span>${p[0]}</span></label>`).join('')}</fieldset>
    <div><button type="button" class="btn btn-primary btn-sm" data-c>Check my outfit</button></div><div class="wd-fb" role="status" aria-live="polite"></div></div>`;
  h.onclick = (e) => {
    if (!e.target.closest('[data-c]')) return;
    const picked = [...h.querySelectorAll('input')].map((x) => x.checked);
    const wrong = PPE.filter((p, i) => picked[i] && !p[1]), missed = PPE.filter((p, i) => !picked[i] && p[1]);
    $(h, '.wd-fb').innerHTML = !wrong.length && !missed.length
      ? '<p><strong>Lab ready.</strong> You have everything required and nothing that is not allowed.</p>'
      : `${missed.length ? `<p><strong>Missing:</strong></p><ul>${missed.map((p) => `<li>${p[0]}: ${p[2]}</li>`).join('')}</ul>` : ''}${wrong.length ? `<p><strong>Not allowed:</strong></p><ul>${wrong.map((p) => `<li>${p[0]}: ${p[2]}</li>`).join('')}</ul>` : ''}`;
  };
}

/* ---------- Hazard pictograms (GHS) ---------- */
const D = '<polygon points="50,4 96,50 50,96 4,50" fill="#fff" stroke="#d62d2d" stroke-width="7" stroke-linejoin="round"/>';
const GHS = [
  ['Explosive', 'Unstable explosives, self-reactive substances and organic peroxides.', 'Peroxides, some nitro compounds', '<polygon fill="#111" points="50,28 56,42 71,35 62,48 76,56 60,58 62,73 50,64 38,73 40,58 24,56 38,48 29,35 44,42"/>'],
  ['Flammable', 'Catches fire easily. Keep away from flames and sparks.', 'Acetone, ethanol, hexane', '<path fill="#111" d="M50 24c3 12 18 16 18 32a18 18 0 0 1-36 0c0-8 4-13 8-17 1 6 4 9 8 10-2-8-1-16 2-25z"/>'],
  ['Oxidizer', 'May cause or intensify a fire by supplying oxygen.', 'Potassium permanganate, nitrates', '<circle cx="50" cy="66" r="13" fill="none" stroke="#111" stroke-width="5"/><path fill="#111" d="M50 24c2 8 11 10 11 20a11 11 0 0 1-22 0c0-5 2-8 5-10 1 4 3 6 5 6-1-5-1-10 1-16z"/>'],
  ['Compressed gas', 'Gas under pressure. A cylinder can explode if heated, or be dangerous if dropped.', 'Nitrogen, oxygen, helium cylinders', '<rect x="38" y="30" width="24" height="44" rx="11" fill="#111"/><rect x="45" y="22" width="10" height="9" fill="#111"/>'],
  ['Corrosive', 'Burns skin, damages eyes and attacks metals.', 'Hydrochloric acid, sodium hydroxide', '<path fill="#111" d="M36 24l7 12a8 8 0 1 1-14 0zM62 24l7 12a8 8 0 1 1-14 0z"/><rect x="26" y="62" width="48" height="8" fill="#111"/>'],
  ['Toxic', 'Can be fatal if swallowed, inhaled or absorbed through skin.', 'Cyanides, mercury compounds', '<circle cx="50" cy="40" r="15" fill="#111"/><rect x="43" y="52" width="14" height="11" fill="#111"/><circle cx="44" cy="40" r="4" fill="#fff"/><circle cx="56" cy="40" r="4" fill="#fff"/><path d="M28 72l44-14M72 72L28 58" stroke="#111" stroke-width="5" stroke-linecap="round"/>'],
  ['Health hazard', 'May cause cancer, genetic damage, or long-term harm to organs.', 'Benzene, formaldehyde', '<circle cx="50" cy="31" r="8" fill="#111"/><path fill="#111" d="M32 74c0-16 7-27 18-27s18 11 18 27z"/><polygon fill="#fff" points="50,52 53,58 59,58 54,62 56,68 50,64 44,68 46,62 41,58 47,58"/>'],
  ['Harmful or irritant (exclamation mark)', 'Irritates skin or eyes, or is harmful in smaller amounts.', 'Many cleaning products and solvents', '<rect x="45" y="26" width="10" height="32" rx="4" fill="#111"/><circle cx="50" cy="70" r="6" fill="#111"/>'],
  ['Hazardous to the environment', 'Harms aquatic life. Never pour it down the drain.', 'Copper sulfate, silver nitrate, heavy-metal salts', '<polygon fill="#111" points="50,22 66,46 58,46 70,62 30,62 42,46 34,46"/><rect x="47" y="62" width="6" height="12" fill="#111"/>'],
];
function ghs(h) {
  h.innerHTML = `<div class="wd-body"><p class="wd-hint">The Globally Harmonized System (GHS) uses nine pictograms on chemical labels. Select one.</p>
    <div class="wd-ghs">${GHS.map((g, i) => `<button type="button" class="wd-tile" data-i="${i}" aria-pressed="false"><svg viewBox="0 0 100 100" aria-hidden="true">${D}${g[3]}</svg><span>${g[0]}</span></button>`).join('')}</div>
    <div class="wd-fb" role="status" aria-live="polite"><p>Select a pictogram to see what it means.</p></div></div>`;
  h.onclick = (e) => {
    const b = e.target.closest('[data-i]'); if (!b) return;
    h.querySelectorAll('.wd-tile').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const g = GHS[+b.dataset.i];
    $(h, '.wd-fb').innerHTML = `<p><strong>${g[0]}.</strong> ${g[1]}</p><p>Examples: ${g[2]}.</p>`;
  };
}

/* ---------- registered widgets ---------- */
const GLASS_IMGS = [
  ['https://commons.wikimedia.org/wiki/Special:FilePath/Laboratory_Glasswares.jpg?width=700', 'Common glassware set'],
  ['https://commons.wikimedia.org/wiki/Special:FilePath/Erlenmeyer_flask.svg?width=400', 'Erlenmeyer flask'],
  ['https://commons.wikimedia.org/wiki/Special:FilePath/Mechero_Bunsen.jpg?width=400', 'Bunsen burner'],
];
function glassware(h) {
  h.innerHTML = `<div class="wd-body"><p class="wd-hint">Picture each tool first, then answer. A new set of 8 every round.</p>
    <div class="wd-glass">${GLASS_IMGS.map(([s, a]) => `<figure><img src="${s}" alt="${a}" loading="lazy" onerror="this.parentNode.style.display='none'"><figcaption>${a}</figcaption></figure>`).join('')}</div>
    <div data-g></div></div>`;
  game(h.querySelector('[data-g]'), GLASS, { n: 8, label: 'Which tool' });
}
export const LAB_WIDGETS = {
  glassware,
  waste: (h) => game(h, WASTE, { n: 8, fixed: ['Salts', 'Acids', 'Bases', 'Organic', 'Inorganic'], label: 'Waste item' }),
  storage: (h) => game(h, CABINET, { n: 6, fixed: ['Acid cabinet', 'Flammable liquid cabinet', 'Locked poison cabinet', 'Ventilated cabinet', 'Water-tight, cool and dry cabinet'], label: 'Chemical' }),
  firstaid: (h) => game(h, AID, { n: 6, label: 'Situation' }),
  conduct: (h) => game(h, CONDUCT, { n: 8, fixed: ['Allowed', 'Not allowed'], label: 'Scenario' }),
  fives: (h) => game(h, FIVES, { n: 5, fixed: FIVES.map((f) => f[1]), label: 'Term' }),
  engchem: (h) => game(h, AREAS, { n: 7, label: 'Problem' }),
  ppe, ghs,
};
