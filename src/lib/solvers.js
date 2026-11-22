// Module 7 (thermochemistry and equilibrium) and Module 8 (electrochemistry): solvers only for now.
// Lessons and quizzes can be added later; the module page shows them as "Soon" until they exist.
const tool = (title, widget, intro) => ({ title, widget, intro });

export const THERMO = {
  lessons: [],
  tools: {
    'calc-1': tool('Heat and temperature change', 'heatq', 'Solve q = m c \u0394T for heat, mass, specific heat or temperature change.'),
    'calc-2': tool('Calorimetry', 'calorimetry', 'Coffee-cup and bomb calorimeters, and mixing a hot and a cool object.'),
    'calc-3': tool('Heating curve of water', 'heatcurve', 'The heat needed to take water through melting, warming and boiling, step by step.'),
    'calc-4': tool('Hess\u2019s law', 'hess', 'Give the target reaction and the reactions you know. The tool finds how to combine them and adds up \u0394H.'),
    'calc-5': tool('Enthalpy of reaction from formation enthalpies', 'enthalpyf', 'Type a balanced equation. \u0394H\u00b0 = \u03a3\u0394Hf\u00b0(products) \u2212 \u03a3\u0394Hf\u00b0(reactants).'),
    'calc-6': tool('Free energy and spontaneity', 'gibbs', '\u0394G = \u0394H \u2212 T\u0394S, the crossover temperature, and K.'),
    'calc-7': tool('Equilibrium constant, Q and K\u209a/K\u1d9c', 'kq', 'Write the K expression, find K from equilibrium amounts, compare Q with K, or convert K\u209a and K\u1d9c.'),
    'calc-8': tool('ICE table solver', 'ice', 'Solve for the equilibrium amounts from the starting amounts and K, or find K from one equilibrium amount.'),
    'calc-9': tool('Le Chatelier\u2019s principle', 'lechat', 'Pick a stress and see which way the equilibrium shifts, and why.'),
  },
  quiz: [],
};

export const ELECTRO = {
  lessons: [],
  tools: {
    'calc-1': tool('Oxidation numbers', 'oxnum', 'Assign oxidation numbers to the atoms in any list of species.'),
    'calc-2': tool('Redox equation balancer', 'redoxbal', 'Balance a redox equation by the half-reaction method, in acidic or basic solution, with every step shown.'),
    'calc-3': tool('Cell potential, \u0394G\u00b0 and K', 'cellpot', 'Pick two half-reactions: get the cathode, anode, E\u00b0cell, \u0394G\u00b0, K and the cell notation.'),
    'calc-4': tool('Nernst equation', 'nernst', 'E of a cell when concentrations are not 1 M.'),
    'calc-5': tool('Electrolysis (Faraday\u2019s law)', 'electrolysis', 'Mass, time or current for an electrolysis, and the volume of any gas produced.'),
  },
  quiz: [],
};
