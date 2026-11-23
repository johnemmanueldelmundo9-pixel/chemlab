// Single source of truth for the four modules that ship.
// `outline` names the lessons / simulations / calculators; `plan` counts must match it (they drive progress %).
// `status` flips from "soon" to "ready" when a module is finished. Lesson text lives in data/content.js.
// A module only opens its items when status is 'ready', so drafts in content.js stay hidden until then.
// Module ids never change (progress is saved by id). Modules 7 and 8 keep their course numbers.

export const MODULES = [
  {
    id: 'intro-lab-safety', num: 1, hue: 95, status: 'ready',
    title: 'Introduction to Chemistry & Lab Safety',
    blurb: 'Why engineers need chemistry, and how to work safely in the laboratory.',
    topics: ['Why chemistry', 'Lab conduct', 'PPE & hazards', 'Waste & first aid'],
    outline: {
      lessons: ['Why chemistry matters for engineers', 'Lab conduct, housekeeping and hygiene', 'Glassware, equipment and tools', 'Handling, storing and labelling chemicals', 'Personal protective equipment (PPE)', 'Waste disposal, first aid and spills'],
      sims: ['Dress for the lab', 'Hazard pictograms', 'Glassware match-up', 'Waste sorter', 'Spill response'],
      calcs: [],
    },
    plan: { lessons: 6, sims: 5, calcs: 0 },
    icon: 'flame',
  },
  {
    id: 'basic-concepts', num: 2, hue: 215, status: 'ready',
    title: 'Basic Chemical Concepts',
    blurb: 'Matter, measurement and the mole: the language and arithmetic of chemistry.',
    topics: ['Matter & mixtures', 'Significant figures', 'Unit conversion', 'The mole'],
    outline: {
      lessons: ['Classifying matter', 'States, properties and changes of matter', 'Measurement and SI units', 'Significant figures and rounding', 'Scientific notation, accuracy and precision', 'Dimensional analysis', 'The mole and molar mass'],
      sims: ['States of matter', 'Matter sorter', 'Accuracy and precision', 'Solution strength'],
      calcs: ['Significant figures toolkit', 'Scientific notation', 'Unit converter', 'Density, temperature and percent error', 'Molar mass and mole calculator'],
    },
    plan: { lessons: 7, sims: 4, calcs: 5 },
    icon: 'flask',
  },
  {
    id: 'thermo-equilibrium', num: 7, hue: 55, status: 'ready', noQuiz: true,
    title: 'Thermochemistry & Equilibrium',
    blurb: 'Energy changes in reactions and how systems settle at balance.',
    topics: ['Enthalpy & Hess', 'Calorimetry', 'Le Chatelier'],
    outline: {
      lessons: [],
      sims: ['Heat flow', 'Le Chatelier'],
      calcs: [
        'Heat and temperature change', 'Calorimetry', 'Heating curve of water',
        'Hess’s law', 'Enthalpy of reaction from formation enthalpies',
        'Free energy and spontaneity', 'Equilibrium constant, Q and Kp/Kc',
        'ICE table solver', 'Le Chatelier’s principle',
      ],
    },
    plan: { lessons: 0, sims: 2, calcs: 9 },
    icon: 'flame',
  },
  {
    id: 'electrochemistry', num: 8, hue: 135, status: 'ready', noQuiz: true,
    title: 'Electrochemistry',
    blurb: 'Redox reactions, batteries and the electricity of chemistry.',
    topics: ['Redox', 'Galvanic cells', 'Nernst equation'],
    outline: {
      lessons: [],
      sims: ['Heat flow', 'Le Chatelier'],
      calcs: [
        'Oxidation numbers', 'Redox equation balancer', 'Cell potential, ΔG° and K',
        'Nernst equation', 'Electrolysis (Faraday’s law)',
      ],
    },
    plan: { lessons: 0, sims: 2, calcs: 5 },
    icon: 'bolt',
  },
];

export const getModule = (id) => MODULES.find((m) => m.id === id);

// Total trackable items in a module: lessons, simulations, calculators and (when there is one) a quiz.
// Modules 7 and 8 ship calculators only, so they have no quiz to count.
export const totalItems = (m) => m.plan.lessons + m.plan.sims + m.plan.calcs + (m.noQuiz ? 0 : 1);
