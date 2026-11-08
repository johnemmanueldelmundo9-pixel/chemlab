// Single source of truth for the eight modules.
// `outline` names the lessons / simulations / calculators; `plan` counts must match it (they drive progress %).
// `status` flips from "soon" to "ready" when a module is finished. Lesson text lives in data/content.js.
// A module only opens its items when status is 'ready', so drafts in content.js stay hidden until then.
// Module ids never change (progress is saved by id), so renumbering `num` does not lose anyone's progress.

export const MODULES = [
  {
    id: 'intro-lab-safety', num: 1, hue: 95, status: 'ready',
    title: 'Introduction to Chemistry & Lab Safety',
    blurb: 'Why engineers need chemistry, and how to work safely in the laboratory.',
    topics: ['Why chemistry', 'Lab conduct', 'PPE & hazards', 'Waste & first aid'],
    outline: {
      lessons: ['Why chemistry matters for engineers', 'Lab conduct, housekeeping and hygiene', 'Glassware, equipment and tools', 'Handling, storing and labelling chemicals', 'Personal protective equipment (PPE)', 'Waste disposal, first aid and spills'],
      sims: ['Dress for the lab', 'Hazard pictograms', 'Glassware match-up', 'Waste sorter'],
      calcs: [],
    },
    plan: { lessons: 6, sims: 4, calcs: 0 },
    icon: 'flame',
  },
  {
    id: 'basic-concepts', num: 2, hue: 215, status: 'ready',
    title: 'Basic Chemical Concepts',
    blurb: 'Matter, measurement and the mole: the language and arithmetic of chemistry.',
    topics: ['Matter & mixtures', 'Significant figures', 'Unit conversion', 'The mole'],
    outline: {
      lessons: ['Classifying matter', 'States, properties and changes of matter', 'Measurement and SI units', 'Significant figures and rounding', 'Scientific notation, accuracy and precision', 'Dimensional analysis', 'The mole and molar mass'],
      sims: ['States of matter', 'Matter sorter', 'Accuracy and precision'],
      calcs: ['Significant figures toolkit', 'Scientific notation', 'Unit converter', 'Density, temperature and percent error', 'Molar mass and mole calculator'],
    },
    plan: { lessons: 7, sims: 3, calcs: 5 },
    icon: 'flask',
  },
  {
    id: 'atomic-periodicity', num: 3, hue: 275, status: 'ready',
    title: 'Atomic Structure & Periodicity',
    blurb: 'Inside the atom, and why the periodic table works.',
    topics: ['Electron configuration', 'Isotopes', 'Periodic trends'],
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
    topics: ['The mole', 'Balancing equations', 'Limiting reagent'],
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
    topics: ['Enthalpy & Hess', 'Calorimetry', "Le Chatelier"],
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
