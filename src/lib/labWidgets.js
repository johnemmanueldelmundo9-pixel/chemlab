// Lab-safety widgets for Module 1. They are registered in widgets.js through LAB_WIDGETS.
// Uses the .wd-* classes from lesson.css plus the small "Lab safety widgets" block added at the end of that file.
import {
  SVG_NS, VIEWBOX, ASSET_DEFS, BASE_MARKUP, ZONE_MARKERS, SILHOUETTE_SVG,
  standaloneSvg, hazardMarkup, assertSvgNamespace, mountSvgLayer,
} from '../assets/ppeDollAssets.js';
import { GHS, GHS_SVGS } from '../assets/ghsAssets.js';
import { glasswareSvg } from '../assets/glasswareAssets.js';
import { reagentBottle, reagentClue, WASTE_CARBOYS } from '../assets/wasteSorterAssets.js';
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
  ['Prepare an exact volume of a standard solution.', 'Volumetric flask', 'The single calibration mark is accurate for one fixed volume only.'],
  ['Deliver a measured volume drop by drop from a vertical tube.', 'Burette', 'The stopcock gives precise control in titrations.'],
  ['Transfer a small liquid volume without a bulb.', 'Pipette', 'Never use mouth suction: use a filler or bulb.'],
  ['Pour a liquid into a narrow-necked container.', 'Funnel', 'A funnel keeps the liquid off the bench and out of the neck threads.'],
  ['Hold a small reaction mixture that can be heated.', 'Test tube', 'Leave it open when heating and point it away from people.'],
  ['Heat a small solid sample to high temperature.', 'Crucible', 'Use tongs: hot porcelain looks the same as cold.'],
  ['Grind a solid reagent into a fine powder.', 'Mortar and pestle', 'Grind in small portions and keep the powder contained.'],
  ['Support and heat apparatus above a flame.', 'Ring stand / Tripod', 'A stable stand keeps the setup from tipping over.'],
  ['Heat a substance with a controlled gas flame.', 'Bunsen burner', 'Check for flammable solvents before lighting.'],
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
  // Studio-derived asset keys, aligned to the original PPE scoring indices.
  const KEY_OF = [
    'lab-coat', 'closed-shoes', 'long-pants', 'safety-goggles', 'nitrile-gloves',
    'sandals', 'shorts', 'dangling-jewelry', 'loose-hair', 'synthetic-nails',
  ];
  const SAFE_IDX = [0, 1, 2, 3, 4];
  const UNSAFE_IDX = [5, 6, 7, 8, 9];
  const ZONE_OF = ['torso', 'feet', 'legs', 'eyes', 'hands', 'feet', 'legs', 'head', 'head', 'hands'];
  const WHY = {
    0: 'Skin and clothing are exposed to chemical splashes.',
    1: 'Feet are exposed to spills and broken glass.',
    2: 'Bare legs are exposed to spills and splashes.',
    3: 'Eyes are unprotected from splashes and vapours.',
    4: 'Skin can absorb toxic or corrosive chemicals.',
    5: 'Open toes leave feet exposed to splashes and broken glass.',
    6: 'Bare legs are exposed to chemical spills.',
    7: 'Dangling jewelry can snag on equipment and trap chemicals.',
    8: 'Loose hair can catch fire or dip into reagents; tie it back.',
    9: 'Acrylic nails are porous and flammable; gloves do not make them safe.',
  };
  let checked = false;

  const pickedSet = () => new Set([...h.querySelectorAll('input')].map((x, i) => (x.checked ? i : -1)).filter((i) => i >= 0));

  function hazardState() {
    const on = pickedSet();
    const zones = new Set();
    const reasons = [];
    UNSAFE_IDX.forEach((i) => {
      if (!on.has(i)) return;
      zones.add(ZONE_OF[i]);
      reasons.push(`<strong>${PPE[i][0]}:</strong> ${WHY[i]}`);
    });
    if (checked) {
      SAFE_IDX.forEach((i) => {
        if (on.has(i)) return;
        zones.add(ZONE_OF[i]);
        reasons.push(`<strong>Missing ${PPE[i][0]}:</strong> ${WHY[i]}`);
      });
    }
    return { on, zones, reasons };
  }

  function paintStage(hz) {
    const stage = $(h, '.ppe-stage');
    if (!stage) return;
    stage.innerHTML = `<svg xmlns="${SVG_NS}" viewBox="${VIEWBOX}" role="img" aria-label="Layered laboratory paper doll"><title>Layered lab-safety paper doll</title></svg>`;
    const svg = stage.querySelector('svg');
    mountSvgLayer(svg, BASE_MARKUP);
    const visible = new Set(hz.on);
    // Required item wins the visual swap; the selection itself is unchanged for scoring.
    if (visible.has(1)) visible.delete(5);
    if (visible.has(2)) visible.delete(6);
    if (visible.has(4)) visible.delete(9);
    ASSET_DEFS.slice(1)
      .filter((a) => visible.has(KEY_OF.indexOf(a.key)))
      .sort((a, b) => a.z - b.z)
      .forEach((a) => mountSvgLayer(svg, a.markup));
    mountSvgLayer(svg, ZONE_MARKERS);
    hz.zones.forEach((z) => mountSvgLayer(svg, hazardMarkup(z)));
    assertSvgNamespace(svg);
  }

  function updateCards(hz) {
    h.querySelectorAll('.ppe-card').forEach((card, i) => {
      const on = hz.on.has(i);
      const wrong = on && UNSAFE_IDX.includes(i);
      const missing = checked && SAFE_IDX.includes(i) && !on;
      const safe = on && checked && SAFE_IDX.includes(i);
      card.classList.toggle('is-on', on);
      card.classList.toggle('is-hazard', wrong || missing);
      card.classList.toggle('is-safe', safe);
      const badge = $(card, '.card-badge');
      if (badge) {
        badge.hidden = !(wrong || missing || safe);
        badge.textContent = wrong ? 'HAZARD / UNSAFE' : missing ? 'MISSING PPE' : safe ? 'SAFE PPE' : '';
      }
    });
  }

  function updateBanner(hz) {
    const banner = $(h, '.ppe-feedback');
    if (!banner) return;
    const complete = checked && !hz.reasons.length && SAFE_IDX.every((i) => hz.on.has(i));
    if (complete) {
      banner.className = 'ppe-feedback is-safe';
      banner.textContent = 'Lab ready — all five required items are worn and no hazards are selected.';
    } else if (hz.reasons.length) {
      banner.className = 'ppe-feedback is-hazard';
      banner.innerHTML = `<strong>Safety hazards:</strong><ul>${hz.reasons.map((r) => `<li>${r}</li>`).join('')}</ul>`;
    } else {
      banner.className = 'ppe-feedback';
      banner.textContent = 'Equip items, then press Check my outfit to validate.';
    }
  }

  function render() {
    const hz = hazardState();
    paintStage(hz);
    updateCards(hz);
    updateBanner(hz);
  }

  h.innerHTML = `<div class="wd-body ppe-wd">
    <p class="wd-hint">Click a paper cutout to equip it, click again to remove it, or drag it onto the figure. Wrong items flag in red immediately.</p>
    <div class="ppe-layout">
      <div class="ppe-stage" aria-label="Paper doll mannequin"></div>
      <fieldset class="wd-fs ppe-cards"><legend class="wd-h">You are about to handle a corrosive liquid. Tick everything you will wear or do.</legend>
        ${PPE.map((p, i) => `<label class="wd-check ppe-card" draggable="true" data-i="${i}"><input type="checkbox" data-i="${i}"><span class="ppe-thumb">${SILHOUETTE_SVG}${standaloneSvg(KEY_OF[i])}</span><span class="ppe-meta"><span>${p[0]}</span><span class="card-badge" hidden></span></span></label>`).join('')}
      </fieldset>
    </div>
    <div class="ppe-actions"><button type="button" class="btn btn-primary btn-sm" data-c>Check my outfit</button></div>
    <div class="ppe-feedback" role="status" aria-live="polite"></div>
    <div class="wd-fb" role="status" aria-live="polite"></div></div>`;

  render();
  h.onchange = render;
  h.addEventListener('dragstart', (e) => {
    const card = e.target.closest('.ppe-card');
    if (!card) return;
    e.dataTransfer.setData('text/plain', card.dataset.i);
    e.dataTransfer.effectAllowed = 'copy';
    card.classList.add('is-dragging');
  });
  h.addEventListener('dragend', (e) => { e.target.closest('.ppe-card')?.classList.remove('is-dragging'); });
  const stage = $(h, '.ppe-stage');
  stage.addEventListener('dragover', (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; stage.classList.add('is-drop-target'); });
  stage.addEventListener('dragleave', () => stage.classList.remove('is-drop-target'));
  stage.addEventListener('drop', (e) => {
    e.preventDefault();
    stage.classList.remove('is-drop-target');
    const input = h.querySelector(`input[data-i="${e.dataTransfer.getData('text/plain')}"]`);
    if (input) { input.checked = !input.checked; render(); }
  });

  h.onclick = (e) => {
    if (!e.target.closest('[data-c]')) return;
    checked = true;
    render();
    const picked = [...h.querySelectorAll('input')].map((x) => x.checked);
    const wrong = PPE.filter((p, i) => picked[i] && !p[1]), missed = PPE.filter((p, i) => !picked[i] && p[1]);
    $(h, '.wd-fb').innerHTML = !wrong.length && !missed.length
      ? '<p><strong>Lab ready.</strong> You have everything required and nothing that is not allowed.</p>'
      : `${missed.length ? `<p><strong>Missing:</strong></p><ul>${missed.map((p) => `<li>${p[0]}: ${p[2]}</li>`).join('')}</ul>` : ''}${wrong.length ? `<p><strong>Not allowed:</strong></p><ul>${wrong.map((p) => `<li>${p[0]}: ${p[2]}</li>`).join('')}</ul>` : ''}`;
  };
}

/* ---------- Hazard pictograms (GHS) ---------- */
function ghs(h) {
  let quizMode = false, qi = 0, qScore = 0, qAnswered = false, order = [];
  const all = () => GHS.map((_, i) => i);

  function explore() {
    h.innerHTML = `<div class="wd-body"><p class="wd-hint">The Globally Harmonized System (GHS) uses nine pictograms on chemical labels. Select one.</p>
      <div class="wd-ghs">${GHS.map((g, i) => `<button type="button" class="wd-tile" data-i="${i}" aria-pressed="false">${GHS_SVGS[i]}<span>${g[0]}</span></button>`).join('')}</div>
      <div><button type="button" class="btn btn-primary btn-sm" data-drill>Practice / Quiz these 9 symbols</button></div>
      <div class="wd-fb" role="status" aria-live="polite"><p>Select a pictogram to see what it means.</p></div></div>`;
  }
  function drill() {
    if (qi >= order.length) {
      h.innerHTML = `<div class="wd-body"><p class="wd-big">${qScore} of ${order.length} correct</p>
        <div><button type="button" class="btn btn-ghost btn-sm" data-r>Play again</button> <button type="button" class="btn btn-sm" data-explore>Back to explore</button></div></div>`;
      return;
    }
    qAnswered = false;
    const target = order[qi];
    const opts = shuffle([target, ...shuffle(all().filter((i) => i !== target)).slice(0, 3)]);
    h.innerHTML = `<div class="wd-body ghs-quiz"><p class="wd-label">Symbol ${qi + 1} of ${order.length}</p>
      <div class="ghs-quiz-target">${GHS_SVGS[target]}</div>
      <p class="wd-big">Which hazard does this pictogram warn about?</p>
      <div class="wd-btns" style="grid-template-columns:1fr">${opts.map((i) => `<button type="button" data-k="${i}">${GHS[i][0]}</button>`).join('')}</div>
      <p class="wd-fb" role="status" aria-live="polite"></p>
      <div><button type="button" class="btn btn-sm" data-explore>Back to explore</button></div></div>`;
  }
  h.onclick = (e) => {
    if (e.target.closest('[data-drill]')) { quizMode = true; order = shuffle(all()); qi = 0; qScore = 0; drill(); return; }
    if (e.target.closest('[data-explore]')) { quizMode = false; explore(); return; }
    if (e.target.closest('[data-r]')) { order = shuffle(all()); qi = 0; qScore = 0; drill(); return; }
    if (e.target.closest('[data-n]')) { qi++; drill(); return; }
    if (quizMode) {
      const b = e.target.closest('[data-k]');
      if (!b || qAnswered) return;
      qAnswered = true;
      const ok = +b.dataset.k === order[qi];
      if (ok) qScore++;
      h.querySelectorAll('[data-k]').forEach((x) => { x.disabled = true; if (+x.dataset.k === order[qi]) x.classList.add('right'); });
      if (!ok) b.classList.add('wrong');
      const g = GHS[order[qi]];
      $(h, '.wd-fb').innerHTML = `<strong>${ok ? 'Correct.' : 'Not quite.'}</strong> ${g[1]} Examples: ${g[2]}. <button type="button" class="btn btn-primary btn-sm" data-n>${qi === order.length - 1 ? 'See score' : 'Next'}</button>`;
      $(h, '[data-n]').focus();
      return;
    }
    const b = e.target.closest('[data-i]');
    if (!b) return;
    h.querySelectorAll('.wd-tile').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const g = GHS[+b.dataset.i];
    $(h, '.wd-fb').innerHTML = `<p><strong>${g[0]}.</strong> ${g[1]}</p><p>Examples: ${g[2]}.</p>`;
  };
  explore();
}

/* ---------- registered widgets ---------- */
function glassware(h) {
  let set, i, score, streak, opts, done;
  const names = () => GLASS.map((g) => g[1]);
  const start = () => { set = shuffle(GLASS).slice(0, 8); i = 0; score = 0; streak = 0; draw(); };
  const draw = () => {
    if (i >= set.length) {
      h.innerHTML = `<div class="wd-body"><p class="wd-big">${score} of ${set.length} correct</p>
        <p>${score === set.length ? 'Perfect bench work.' : score >= 6 ? 'Good work. Review the lesson and try again.' : 'Review the tool list, then play a new round.'}</p>
        <div><button type="button" class="btn btn-ghost btn-sm" data-r>Play again</button></div></div>`;
      return;
    }
    done = false;
    const [q, answer, why] = set[i];
    opts = shuffle([answer, ...shuffle(names().filter((n) => n !== answer)).slice(0, 3)]);
    h.innerHTML = `<div class="wd-body workbench-wd">
      <div class="wb-header"><p class="wd-label">Task ${i + 1} of ${set.length}</p><span class="wb-pill">Score ${score} · Streak ${streak}</span></div>
      <div class="wb-progress" role="progressbar" aria-label="Task progress" aria-valuemin="0" aria-valuemax="${set.length}" aria-valuenow="${i}"><i style="width:${(i / set.length) * 100}%"></i></div>
      <div class="wb-target" data-drop-target><span class="wb-target-label">Lab workbench · target slot</span><strong>${q}</strong><small>Click a specimen or drag it onto the slot</small></div>
      <div class="specimen-grid">${opts.map((name, k) => `<button type="button" class="specimen-card" draggable="true" data-k="${k}"><span class="specimen-art">${glasswareSvg(name)}</span><strong>${name}</strong><small>SPECIMEN ${'ABCD'[k]}</small></button>`).join('')}</div>
      <p class="wd-fb" role="status" aria-live="polite"></p></div>`;
  };
  const answer = (k) => {
    if (done) return;
    done = true;
    const chosen = opts[k], correct = chosen === set[i][1], why = set[i][2];
    if (correct) { score++; streak++; } else streak = 0;
    h.querySelectorAll('.specimen-card').forEach((b) => {
      b.disabled = true;
      if (opts[+b.dataset.k] === set[i][1]) b.classList.add('is-correct');
    });
    if (!correct) h.querySelector(`[data-k="${k}"]`)?.classList.add('is-wrong');
    const fb = $(h, '.wd-fb');
    fb.className = `wd-fb ${correct ? 'wb-good' : 'wb-bad'}`;
    fb.innerHTML = `<strong>${correct ? 'CORRECT' : 'INCORRECT'}.</strong> ${why} <button type="button" class="btn btn-primary btn-sm" data-n>${i === set.length - 1 ? 'See score' : 'Next task'}</button>`;
    $(h, '[data-n]').focus();
  };
  h.onclick = (e) => {
    if (e.target.closest('[data-r]')) { start(); return; }
    if (e.target.closest('[data-n]')) { i++; draw(); return; }
    const b = e.target.closest('.specimen-card[data-k]');
    if (b) answer(+b.dataset.k);
  };
  h.addEventListener('dragstart', (e) => {
    const card = e.target.closest('.specimen-card');
    if (!card) return;
    e.dataTransfer.setData('text/plain', card.dataset.k);
    e.dataTransfer.effectAllowed = 'copy';
  });
  const target = () => h.querySelector('[data-drop-target]');
  h.addEventListener('dragover', (e) => { if (e.target.closest('[data-drop-target]')) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; } });
  h.addEventListener('drop', (e) => {
    if (!e.target.closest('[data-drop-target]')) return;
    e.preventDefault();
    const k = e.dataTransfer.getData('text/plain');
    if (k !== '') answer(+k);
  });
  start();
}

function waste(h) {
  let set, i, score, done;
  const start = () => { set = shuffle(WASTE).slice(0, 8); i = 0; score = 0; draw(); };
  const draw = () => {
    if (i >= set.length) {
      h.innerHTML = `<div class="wd-body"><p class="wd-big">${score} of ${set.length} correct</p>
        <p>${score === set.length ? 'Every waste stream segregated correctly.' : 'Review the compatibility rules and run another batch.'}</p>
        <div><button type="button" class="btn btn-ghost btn-sm" data-r>Play again</button></div></div>`;
      return;
    }
    done = false;
    const [name, answer] = set[i];
    h.innerHTML = `<div class="wd-body waste-wd">
      <div class="wb-header"><p class="wd-label">Waste item ${i + 1} of ${set.length}</p><span class="wb-pill">Score ${score} / ${i}</span></div>
      <div class="wb-progress" role="progressbar" aria-label="Batch progress" aria-valuemin="0" aria-valuemax="${set.length}" aria-valuenow="${i}"><i style="width:${(i / set.length) * 100}%"></i></div>
      <div class="reagent-card" draggable="true"><div class="reagent-art">${reagentBottle(name)}</div><div class="reagent-copy"><strong>${name}</strong><p>${reagentClue(name)}</p><small>Drag this bottle onto a carboy</small></div></div>
      <div class="carboy-grid">${WASTE_CARBOYS.map((c) => `<button type="button" class="carboy-card" data-k="${c.key}">${c.svg}<span>${c.key}</span></button>`).join('')}</div>
      <p class="wd-fb" role="status" aria-live="polite"></p></div>`;
  };
  const answer = (key) => {
    if (done) return;
    done = true;
    const [name, correct, why] = set[i], ok = key === correct;
    if (ok) score++;
    h.querySelectorAll('.carboy-card').forEach((b) => {
      b.disabled = true;
      if (b.dataset.k === correct) b.classList.add('is-correct');
    });
    h.querySelector(`[data-k="${key}"]`)?.classList.toggle('is-wrong', !ok);
    const fb = $(h, '.wd-fb');
    fb.className = `wd-fb ${ok ? 'wb-good' : 'wb-bad'}`;
    fb.innerHTML = `<strong>${ok ? 'DISPOSED SAFELY' : 'INCOMPATIBLE / HAZARD'}.</strong> ${why} <button type="button" class="btn btn-primary btn-sm" data-n>${i === set.length - 1 ? 'See score' : 'Next item'}</button>`;
    $(h, '[data-n]').focus();
  };
  h.onclick = (e) => {
    if (e.target.closest('[data-r]')) { start(); return; }
    if (e.target.closest('[data-n]')) { i++; draw(); return; }
    const b = e.target.closest('.carboy-card[data-k]');
    if (b) answer(b.dataset.k);
  };
  h.addEventListener('dragstart', (e) => { if (e.target.closest('.reagent-card')) e.dataTransfer.setData('text/plain', 'reagent'); });
  h.addEventListener('dragover', (e) => { if (e.target.closest('.carboy-card')) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; } });
  h.addEventListener('drop', (e) => {
    const card = e.target.closest('.carboy-card');
    if (!card) return;
    e.preventDefault();
    answer(card.dataset.k);
  });
  start();
}

export const LAB_WIDGETS = {
  glassware,
  waste,
  storage: (h) => game(h, CABINET, { n: 6, fixed: ['Acid cabinet', 'Flammable liquid cabinet', 'Locked poison cabinet', 'Ventilated cabinet', 'Water-tight, cool and dry cabinet'], label: 'Chemical' }),
  firstaid: (h) => game(h, AID, { n: 6, label: 'Situation' }),
  conduct: (h) => game(h, CONDUCT, { n: 8, fixed: ['Allowed', 'Not allowed'], label: 'Scenario' }),
  fives: (h) => game(h, FIVES, { n: 5, fixed: FIVES.map((f) => f[1]), label: 'Term' }),
  engchem: (h) => game(h, AREAS, { n: 7, label: 'Problem' }),
  ppe, ghs,
};
