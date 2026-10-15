// Single source of truth for the seven modules.
// `plan` = how many items each module will contain (drives progress %).
// `status` flips from "soon" to "ready" as each module is built.

export const MODULES = [
  {
    id: 'basic-concepts', num: 1, hue: 215, status: 'soon',
    title: 'Basic Chemical Concepts',
    blurb: 'Matter, measurement and the language of chemistry.',
    topics: ['Matter & mixtures', 'SI units', 'Significant figures'],
    plan: { lessons: 4, sims: 1, calcs: 2 },
    icon: 'flask',
  },
  {
    id: 'atomic-periodicity', num: 2, hue: 275, status: 'soon',
    title: 'Atomic Structure & Periodicity',
    blurb: 'Inside the atom, and why the periodic table works.',
    topics: ['Electron configuration', 'Isotopes', 'Periodic trends'],
    plan: { lessons: 5, sims: 2, calcs: 2 },
    icon: 'atom',
  },
  {
    id: 'bonding-molecular', num: 3, hue: 340, status: 'soon',
    title: 'Bonding & Molecular Structure',
    blurb: 'How atoms join, and why molecules take their shapes.',
    topics: ['Ionic & covalent', 'Lewis structures', 'VSEPR shapes'],
    plan: { lessons: 5, sims: 2, calcs: 1 },
    icon: 'molecule',
  },
  {
    id: 'stoichiometry-reactions', num: 4, hue: 30, status: 'soon',
    title: 'Stoichiometry & Chemical Reactions',
    blurb: 'Count atoms by weighing them, and predict reaction yields.',
    topics: ['The mole', 'Balancing equations', 'Limiting reagent'],
    plan: { lessons: 6, sims: 1, calcs: 4 },
    icon: 'balance',
  },
  {
    id: 'states-gas-laws', num: 5, hue: 170, status: 'soon',
    title: 'States of Matter & Gas Laws',
    blurb: 'From solids to gases, and the laws that govern pressure, volume and temperature.',
    topics: ['Boyle & Charles', 'Combined gas law', 'Ideal gas law'],
    plan: { lessons: 5, sims: 2, calcs: 3 },
    icon: 'gas',
  },
  {
    id: 'thermo-equilibrium', num: 6, hue: 55, status: 'soon',
    title: 'Thermochemistry & Equilibrium',
    blurb: 'Energy changes in reactions and how systems settle at balance.',
    topics: ['Enthalpy & Hess', 'Calorimetry', "Le Chatelier"],
    plan: { lessons: 6, sims: 2, calcs: 3 },
    icon: 'flame',
  },
  {
    id: 'electrochemistry', num: 7, hue: 135, status: 'soon',
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
