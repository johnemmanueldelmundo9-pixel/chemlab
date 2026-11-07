// Lesson content, keyed by module id. Written from the course slide decks (Chemistry for Engineers).
// Block types: ['h', text] ['p', html] ['list', [html]] ['note', html] ['table', [head], [[row]]]
//              ['check', {q, options, answer, why}]   ['w', widgetName]  (see lib/widgets.js)
// Lessons/tools not listed here show as "Soon" on the module page.

const chk = (q, options, answer, why) => ['check', { q, options, answer, why }];

export const CONTENT = {
  'basic-concepts': {
    lessons: [
      { title: 'Classifying matter', blocks: [
        ['p', '<strong>Chemistry</strong> is the study of matter and the changes it undergoes. <strong>Matter</strong> is anything that has mass and takes up space. Chemists sort it by <em>composition</em>: what it is made of.'],
        ['table', ['Term', 'Meaning', 'Example'], [
          ['Substance', 'Definite composition and distinct properties', 'Water'],
          ['Element', 'Cannot be split into simpler substances by chemical means', 'Gold'],
          ['Compound', 'Atoms of two or more elements chemically united; separated only by chemical means', 'Water, H\u2082O'],
          ['Mixture', 'Two or more substances that can be separated by physical means', 'Air'],
          ['Homogeneous mixture', 'Uniform throughout', 'Salt dissolved in water'],
          ['Heterogeneous mixture', 'Not uniform throughout', 'Sand and water'],
        ]],
        ['note', 'Separating a <strong>mixture</strong> into its substances only needs physical methods (filtering, evaporating). Separating a <strong>compound</strong> into its elements needs a chemical reaction.'],
        ['h', 'Try it: classify these'],
        ['w', 'classify'],
      ] },
      { title: 'States and properties of matter', blocks: [
        ['p', 'Substances exist as solid, liquid or gas. What separates them is the distance and freedom of movement of their particles.'],
        ['list', [
          '<strong>Solid:</strong> particles are packed close in an orderly pattern and can only vibrate in place.',
          '<strong>Liquid:</strong> particles are close but not locked in position, so they slide past each other.',
          '<strong>Gas:</strong> particles are far apart compared with their own size and move freely.',
        ]],
        ['h', 'Physical and chemical properties'],
        ['p', 'A <strong>physical property</strong> can be observed without changing what the substance is. A <strong>chemical property</strong> only shows up when the substance reacts and becomes something new.'],
        ['table', ['Type', 'Depends on amount?', 'Examples'], [
          ['Intensive physical', 'No', 'Colour, odour, density, melting point, boiling point'],
          ['Extensive physical', 'Yes', 'Mass, volume, length'],
          ['Chemical', '\u2014', 'Flammability, heat of combustion, stability toward water or air'],
        ]],
        chk('Which of these is an <em>extensive</em> property?', ['Density', 'Mass', 'Boiling point', 'Colour'], 1, 'Mass changes with the amount of sample. Density, boiling point and colour are the same for 1 g or 1 kg.'),
        ['h', 'Simulation: heat it up'],
        ['w', 'states'],
      ] },
      { title: 'Changes of matter', blocks: [
        ['p', 'In a <strong>chemical reaction</strong>, one or more substances change into new substances. A <strong>chemical equation</strong> is the shorthand: <strong>reactants</strong> (starting materials) on the left, <strong>products</strong> on the right, joined by an arrow.'],
        ['p', 'Letters after each formula give the physical state:'],
        ['table', ['Symbol', 'Meaning'], [['(s)', 'solid'], ['(l)', 'liquid'], ['(g)', 'gas'], ['(aq)', 'aqueous: dissolved in water']]],
        ['note', 'KBr(aq) + AgNO\u2083(aq) \u2192 KNO\u2083(aq) + AgBr(s). Two clear solutions are mixed and a solid, silver bromide, appears.'],
        chk('In the equation above, which product is the solid?', ['KNO\u2083', 'AgBr', 'KBr', 'AgNO\u2083'], 1, 'Only AgBr carries the (s) label; the others are dissolved (aq).'),
      ] },
      { title: 'Measurement and SI units', blocks: [
        ['p', 'A <strong>measurement</strong> always has two parts: a number and a unit. Without the unit, the number means nothing. A <em>qualitative</em> observation has no number.'],
        ['table', ['Quantity', 'Unit', 'Symbol'], [
          ['Mass', 'kilogram', 'kg'], ['Length', 'meter', 'm'], ['Time', 'second', 's'], ['Temperature', 'kelvin', 'K'],
          ['Electric current', 'ampere', 'A'], ['Amount of substance', 'mole', 'mol'], ['Luminous intensity', 'candela', 'cd'],
        ]],
        ['p', '<strong>Derived quantities</strong> such as area, volume and density are combinations of the fundamental ones. Volume comes from length: 1 L = 1 dm\u00b3 = 1000 cm\u00b3, and 1 cm\u00b3 = 1 mL.'],
        ['table', ['Prefix', 'Symbol', 'Power of 10'], [
          ['giga', 'G', '10\u2079'], ['mega', 'M', '10\u2076'], ['kilo', 'k', '10\u00b3'], ['centi', 'c', '10\u207b\u00b2'],
          ['milli', 'm', '10\u207b\u00b3'], ['micro', '\u00b5', '10\u207b\u2076'], ['nano', 'n', '10\u207b\u2079'], ['pico', 'p', '10\u207b\u00b9\u00b2'],
        ]],
        chk('How many cm\u00b3 are in 1 L?', ['10', '100', '1000', '1 000 000'], 2, '1 L = (10 cm)\u00b3 = 1000 cm\u00b3.'),
      ] },
      { title: 'Significant figures and scientific notation', blocks: [
        ['p', 'Every measurement has some uncertainty. We record all the digits we are sure of plus the first uncertain one. Those are the <strong>significant figures</strong>.'],
        ['h', 'Counting rules'],
        ['list', [
          '<strong>Non-zero digits</strong> always count. 1458 has 4.',
          '<strong>Leading zeros</strong> never count. 0.0025 has 2.',
          '<strong>Captive zeros</strong> (between non-zero digits) always count. 1.008 has 4.',
          '<strong>Trailing zeros</strong> count only if the number has a decimal point. 100 has 1, but 1.00 \u00d7 10\u00b2 has 3.',
          '<strong>Exact numbers</strong> (counted items, definitions like 1 in = 2.54 cm) have unlimited significant figures.',
        ]],
        ['w', 'sigfigs'],
        ['h', 'In calculations'],
        ['list', [
          '<strong>Multiply or divide:</strong> keep as many significant figures as the least precise factor. 4.56 \u00d7 1.4 = 6.38 \u2192 <strong>6.4</strong>.',
          '<strong>Add or subtract:</strong> keep as many decimal places as the least precise term. 22.13 + 17.0 + 2.024 = 41.154 \u2192 <strong>41.2</strong>.',
        ]],
        chk('What is 22.13 + 17.0 + 2.024, correctly rounded?', ['41.154', '41.15', '41.2', '41'], 2, '17.0 has one decimal place, the fewest, so the answer has one decimal place.'),
        ['h', 'Scientific notation'],
        ['p', 'Write numbers as N \u00d7 10<sup>n</sup> with 1 \u2264 N &lt; 10. Moving the decimal point left makes n positive; moving it right makes n negative. 0.00567 = 5.67 \u00d7 10<sup>\u22123</sup> and 456000 = 4.56 \u00d7 10<sup>5</sup>.'],
        ['h', 'Accuracy and precision'],
        ['p', '<strong>Accuracy</strong> is how close a value is to the true value. <strong>Precision</strong> is how close repeated measurements are to each other. A set of darts can be tightly grouped (precise) yet far from the bullseye (not accurate).'],
      ] },
      { title: 'Dimensional analysis', blocks: [
        ['p', '<strong>Dimensional analysis</strong> (the factor-label method) converts units by multiplying by <strong>conversion factors</strong>: fractions whose top and bottom are the same quantity in different units, such as 2.54 cm / 1 in.'],
        ['note', 'given unit \u00d7 (desired unit / given unit) = desired unit. If the units do not cancel to what you want, something is set up wrong.'],
        ['p', 'Example: 8.50 in \u00d7 (2.54 cm / 1 in) = 21.6 cm. The inches cancel, and 8.50 (3 sig figs) sets the precision because 2.54 is exact.'],
        ['p', 'For volumes, cube the length factor: 1 m = 10\u00b2 cm, so 1 m\u00b3 = (10\u00b2 cm)\u00b3 = 10\u2076 cm\u00b3. For several steps, chain factors, like pounds \u2192 grams \u2192 milligrams.'],
        ['h', 'Try it: convert and see the setup'],
        ['w', 'convert'],
        chk('Convert 275 L to m\u00b3. Which answer is right?', ['0.275 m\u00b3', '275 000 m\u00b3', '2.75 m\u00b3', '0.0275 m\u00b3'], 0, '1 L = 10\u207b\u00b3 m\u00b3, so 275 L = 0.275 m\u00b3.'),
      ] },
      { title: 'The mole and Avogadro\u2019s number', blocks: [
        ['p', 'Atoms are far too small to count one by one, so chemists count in <strong>moles</strong>, just as we count eggs in dozens. One mole is the amount of substance containing as many particles as there are atoms in exactly 12 g of carbon-12.'],
        ['note', '<strong>Avogadro\u2019s number:</strong> 1 mol = 6.022 \u00d7 10\u00b2\u00b3 particles. The <strong>molar mass</strong> (g/mol) of an element is its atomic mass in grams.'],
        ['list', [
          'Moles \u2192 particles: multiply by 6.022 \u00d7 10\u00b2\u00b3.',
          'Grams \u2192 moles: divide by the molar mass. 6.46 g He \u00f7 4.003 g/mol = 1.61 mol.',
          'Moles \u2192 grams: multiply by the molar mass. 0.356 mol Zn \u00d7 65.39 g/mol = 23.3 g.',
          'Atoms inside molecules: 2.00 mol CO\u2082 holds 2 \u00d7 2.00 mol O atoms, or 2.41 \u00d7 10\u00b2\u2074 oxygen atoms.',
        ]],
        ['h', 'Try it'],
        ['w', 'mole'],
        chk('How many molecules are in 1.00 mol of water?', ['6.022 \u00d7 10\u00b2\u00b3', '18.02', '3.011 \u00d7 10\u00b2\u00b3', '1.00'], 0, 'One mole of anything contains 6.022 \u00d7 10\u00b2\u00b3 particles. The 18.02 is its mass in grams.'),
      ] },
    ],
    tools: {
      'sim-1': { title: 'States of matter', widget: 'states', intro: 'Drag the temperature and watch how the particles behave in each state.' },
      'calc-1': { title: 'Significant figure counter', widget: 'sigfigs', intro: 'Type any number to see which digits are significant.' },
      'calc-2': { title: 'Unit converter', widget: 'convert', intro: 'Converts with the factor-label setup shown and the right number of significant figures.' },
      'calc-3': { title: 'Mole calculator', widget: 'mole', intro: 'Switch between grams, moles and number of particles.' },
    },
    quiz: [
      { q: 'Salt dissolved in water is best classified as:', options: ['An element', 'A compound', 'A homogeneous mixture', 'A heterogeneous mixture'], answer: 2, why: 'The composition is uniform, and the salt can be recovered by evaporating: a physical method.' },
      { q: 'How many significant figures are in 0.0025?', options: ['1', '2', '3', '4'], answer: 1, why: 'Leading zeros only locate the decimal point. Only 2 and 5 count.' },
      { q: '4.56 \u00d7 1.4 should be reported as:', options: ['6.4', '6.38', '6.384', '6'], answer: 0, why: '1.4 has two significant figures, so the product has two.' },
      { q: '8.50 in is how many cm? (1 in = 2.54 cm exactly)', options: ['3.35 cm', '21.6 cm', '216 cm', '21.59 cm'], answer: 1, why: '8.50 \u00d7 2.54 = 21.59, rounded to 3 significant figures is 21.6.' },
      { q: 'How many moles are in 6.46 g of helium (4.003 g/mol)?', options: ['0.620 mol', '1.61 mol', '25.9 mol', '6.46 mol'], answer: 1, why: '6.46 g \u00f7 4.003 g/mol = 1.61 mol.' },
    ],
  },

  'atomic-periodicity': {
    lessons: [
      { title: 'Atomic models', blocks: [
        ['p', 'The idea of the atom is old: Democritus called the smallest pieces of matter <em>atomos</em>, meaning uncuttable. It faded for centuries, then returned when chemists began measuring how elements combine. John Dalton turned it into a theory between 1803 and 1807.'],
        ['table', ['Who', 'Discovery', 'Model'], [
          ['Thomson (1897)', 'Cathode rays are streams of negative particles: electrons', 'Plum pudding: electrons embedded in a positive sphere'],
          ['Millikan (1909)', 'Measured the electron charge, 1.602 \u00d7 10\u207b\u00b9\u2079 C', 'Allowed the electron mass to be calculated'],
          ['Rutherford (1910)', 'Gold foil: a few alpha particles bounced straight back', 'Nuclear model: tiny, dense, positive nucleus'],
        ]],
        ['p', 'Rutherford found the proton in 1919, and Chadwick found the neutron in 1932. So the atom is made of electrons, protons and neutrons.'],
        chk('What did the back-scattered alpha particles in the gold foil experiment show?', ['Atoms are solid spheres', 'A small, dense, positive nucleus exists', 'Electrons orbit in shells', 'Neutrons are charged'], 1, 'Only a tiny, dense, positively charged centre could turn an alpha particle back. This ruled out the plum-pudding model.'),
      ] },
      { title: 'Protons, neutrons and electrons', blocks: [
        ['table', ['Particle', 'Charge', 'Mass (amu)'], [['Electron', '1\u2212', '5.486 \u00d7 10\u207b\u2074'], ['Proton', '1+', '1.0073'], ['Neutron', '0', '1.0087']]],
        ['list', [
          'Protons and neutrons sit in the tiny nucleus. Almost all of an atom\u2019s volume is the space where electrons are found.',
          'Atoms have equal numbers of protons and electrons, so they have no net charge.',
          'Most atoms are 100\u2013500 pm across. 1 \u00c5 = 100 pm = 10\u207b\u00b9\u2070 m.',
          '1 amu = 1.66054 \u00d7 10\u207b\u00b2\u2074 g, a unit made for masses this small.',
        ]],
        chk('The charge of a proton is:', ['\u22121.602 \u00d7 10\u207b\u00b9\u2079 C', '+1.602 \u00d7 10\u207b\u00b9\u2079 C', '0', '+1.0073 C'], 1, 'Equal in size and opposite in sign to the electron\u2019s charge.'),
      ] },
      { title: 'Atomic number, mass number and isotopes', blocks: [
        ['p', 'The <strong>atomic number (Z)</strong> is the number of protons, and it defines the element. The <strong>mass number (A)</strong> is protons + neutrons. <strong>Isotopes</strong> are atoms of the same element with different numbers of neutrons.'],
        ['note', '\u00b9\u2079\u2077Au: Z = 79, so 79 protons and 79 electrons. Neutrons = 197 \u2212 79 = 118.'],
        ['p', 'Elements occur as mixtures of isotopes, so the atomic mass on the periodic table is a weighted average. Chlorine is 75.78% \u00b3\u2075Cl (34.969 amu) and 24.22% \u00b3\u2077Cl (36.966 amu), which gives 35.45 amu. Try your own below.'],
        ['w', 'isotope'],
        chk('How many neutrons are in \u00b9\u2079\u2077Au?', ['79', '118', '197', '276'], 1, 'Neutrons = mass number \u2212 atomic number = 197 \u2212 79.'),
      ] },
    ],
    tools: {
      'sim-1': { title: 'Quantum number explorer', widget: 'quantum', intro: 'Choose n and see every allowed l, m\u2097, subshell and orbital count.' },
      'calc-1': { title: 'Average atomic mass', widget: 'isotope', intro: 'Enter isotope abundances and masses to find the weighted average.' },
    },
    quiz: [
      { q: 'Who discovered the neutron?', options: ['Thomson', 'Rutherford', 'Chadwick', 'Millikan'], answer: 2, why: 'James Chadwick found the neutron in 1932.' },
      { q: 'An atom has 17 protons and 18 neutrons. Its mass number is:', options: ['17', '18', '35', '1'], answer: 2, why: 'Mass number = protons + neutrons = 35.' },
      { q: 'Isotopes of an element differ in their number of:', options: ['Protons', 'Electrons in the neutral atom', 'Neutrons', 'Atomic number'], answer: 2, why: 'Same protons (same element), different neutrons.' },
    ],
  },
};
