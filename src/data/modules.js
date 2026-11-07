// Single source of truth for the modules.
// Modules 1-3 follow the course slide decks (Chemistry for Engineers). `outline` names the planned
// lessons / simulations / calculators; `plan` counts must match it (they drive progress %).
// Lesson text lives in data/content.js. `status` is 'ready' once a module has content to open.

export const MODULES = [
  {
    id: 'intro-lab-safety', num: 1, hue: 95, status: 'soon',
    title: 'Introduction to Chemistry & Lab Safety',
    blurb: 'Why engineers need chemistry, and how to work safely in the lab.',
    topics: ['Why chemistry', 'Lab conduct', 'PPE & first aid'],
    outline: {
      lessons: ['Why chemistry matters for engineers', 'Lab conduct and housekeeping', 'Chemicals: handling, storage and waste', 'PPE, first aid and spills'],
      sims: [], calcs: [],
    },
    plan: { lessons: 4, sims: 0, calcs: 0 },
    icon: 'flame',
  },
  {
    id: 'basic-concepts', num: 2, hue: 215, status: 'ready',
    title: 'Basic Chemical Concepts',
    blurb: 'Matter, measurement and the mole: the language and arithmetic of chemistry.',
    topics: ['Matter & mixtures', 'SI units & sig figs', 'Dimensional analysis', 'The mole'],
    outline: {
      lessons: ['Classifying matter', 'States and properties of matter', 'Changes of matter', 'Measurement and SI units', 'Significant figures and scientific notation', 'Dimensional analysis', 'The mole and Avogadro\u2019s number'],
      sims: ['States of matter'],
      calcs: ['Significant figure counter', 'Unit converter', 'Mole calculator'],
    },
    plan: { lessons: 7, sims: 1, calcs: 3 },
    icon: 'flask',
  },
  {
    id: 'atomic-periodicity', num: 3, hue: 275, status: 'ready',
    title: 'Atomic Structure & Periodicity',
    blurb: 'Inside the atom, and why the periodic table works.',
    topics: ['Atomic models', 'Isotopes', 'Quantum numbers', 'Electron configuration'],
    outline: {
      lessons: ['Atomic models', 'Protons, neutrons and electrons', 'Atomic number, mass number and isotopes', 'The periodic table', 'Quantum numbers', 'Electron configuration'],
      sims: ['Quantum number explorer'],
      calcs: ['Average atomic mass'],
    },
    plan: { lessons: 6, sims: 1, calcs: 1 },
    icon: 'atom',
  },
  {
    id: 'bonding-molecular', num: 4, hue: 340, status: 'soon',
    title: 'Bonding & Molecular Structure',
    blurb: 'How atoms join, and why molecules take their shapes.',
    topics: ['Ionic & covalent', 'Lewis structures', 'VSEPR shapes'],
    plan: { lessons: 5, sims: 2, calcs: 1 },
    icon: 'molecule',
  },
  {
    id: 'stoichiometry-reactions', num: 5, hue: 30, status: 'soon',
    title: 'Stoichiometry & Chemical Reactions',
    blurb: 'Count atoms by weighing them, and predict reaction yields.',
    topics: ['Balancing equations', 'Limiting reagent', 'Percent yield'],
    plan: { lessons: 6, sims: 1, calcs: 4 },
    icon: 'balance',
  },
  {
    id: 'states-gas-laws', num: 6, hue: 170, status: 'soon',
    title: 'States of Matter & Gas Laws',
    blurb: 'From solids to gases, and the laws that govern pressure, volume and temperature.',
    topics: ['Boyle & Charles', 'Combined gas law', 'Ideal gas law'],
    plan: { lessons: 5, sims: 2, calcs: 3 },
    icon: 'gas',
  },
  {
    id: 'thermo-equilibrium', num: 7, hue: 55, status: 'soon',
    title: 'Thermochemistry & Equilibrium',
    blurb: 'Energy changes in reactions and how systems settle at balance.',
    topics: ['Enthalpy & Hess', 'Calorimetry', 'Le Chatelier'],
    plan: { lessons: 6, sims: 2, calcs: 3 },
    icon: 'flame',
  },
  {
    id: 'electrochemistry', num: 8, hue: 135, status: 'soon',
    title: 'Electrochemistry',
    blurb: 'Redox reactions, batteries and the electricity of chemistry.',
    topics: ['Redox', 'Galvanic cells', 'Nernst equation'],
    plan: { lessons: 5, sims: 1, calcs: 2 },
    icon: 'bolt',
  },
];

export const getModule = (id) => MODULES.find((m) => m.id === id);

// Total trackable items in a module: every lesson, simulation, calculator + 1 quiz.
export const totalItems = (m) => m.plan.lessons + m.plan.sims + m.plan.calcs + 1;
