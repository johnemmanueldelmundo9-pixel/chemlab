// "Watch to understand better": links to The Organic Chemistry Tutor on YouTube, per lesson.
// Two kinds of link:
//   v(title, id)  = one specific video (the id is the part after v= in the YouTube address)
//   s(title, query) = the channel's own search results for a topic. It always works and always shows that channel's videos on the topic.
// To swap a topic link for a specific video later, replace its s(...) with v('Exact title', 'VIDEOID').
// Keyed by module id, then by lesson id ("lesson-1" ...). pages/module.js shows them at the end of each lesson.

const CHANNEL = 'https://www.youtube.com/@TheOrganicChemistryTutor';
const s = (title, query) => ({ title, kind: 'search', url: `${CHANNEL}/search?query=${encodeURIComponent(query)}` });
const v = (title, id) => ({ title, kind: 'video', url: `https://www.youtube.com/watch?v=${id}` });

export const VIDEOS = {
  'intro-lab-safety': {
    'lesson-1': [s('Basic introduction to chemistry', 'basic introduction to chemistry')],
    'lesson-2': [s('Laboratory safety', 'lab safety')],
    'lesson-3': [s('Common laboratory equipment and glassware', 'laboratory equipment glassware')],
    'lesson-4': [s('Chemical hazards and safe handling', 'chemical safety hazard')],
    'lesson-5': [s('Protective equipment in the lab', 'lab safety goggles gloves')],
    'lesson-6': [s('Lab safety, first aid and spills', 'lab safety')],
  },
  'basic-concepts': {
    'lesson-1': [s('Types of matter: elements, compounds and mixtures', 'types of matter')],
    'lesson-2': [s('Physical and chemical properties and changes', 'physical and chemical changes')],
    'lesson-3': [s('SI base units and the metric system', 'SI base units')],
    'lesson-4': [v('What are significant figures and how to use them', 'BmeImtwhfj8'), s('More videos on significant figures and rounding', 'significant figures')],
    'lesson-5': [s('Scientific notation', 'scientific notation'), s('Accuracy and precision', 'accuracy and precision')],
    'lesson-6': [s('Converting units with conversion factors (dimensional analysis)', 'dimensional analysis conversion factors')],
    'lesson-7': [s('The mole, Avogadro\u2019s number and molar mass', 'mole avogadro molar mass')],
  },
  'atomic-periodicity': {
    'lesson-1': [s('Atomic theory and early atomic models', 'atomic theory models')],
    'lesson-2': [s('Cathode rays and the gold foil experiment', 'gold foil experiment')],
    'lesson-3': [s('Protons, neutrons and electrons', 'protons neutrons electrons')],
    'lesson-4': [s('Isotopes and average atomic mass', 'isotopes average atomic mass')],
    'lesson-5': [s('The periodic table', 'periodic table')],
    'lesson-6': [s('Quantum numbers', 'quantum numbers')],
    'lesson-7': [s('Electron configuration and orbital diagrams', 'electron configuration')],
  },
};
