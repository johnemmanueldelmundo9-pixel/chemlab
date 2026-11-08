// Lesson content, keyed by module id. Written from the course slide decks (Chemistry for Engineers), in original wording.
// Block types: ['h', text] ['p', html] ['list', [html]] ['note', html] ['table', [head], [[row]]]
//              ['check', {q, options, answer, why}]   ['w', widgetName]   (see lib/widgets.js)
//              ['ex', title, problem, [step html, ...]]   a worked example revealed one step at a time
//              ['img', src, alt, caption]   an image figure (see pages/module.js)
// Items not listed here show as "Soon" on the module page. A module only opens when its status is 'ready'.
import { LAB_SAFETY } from './labSafety.js';
import { ATOMIC } from './atomic.js';
const chk = (q, options, answer, why) => ['check', { q, options, answer, why }];

export const CONTENT = {
  'intro-lab-safety': LAB_SAFETY,
  'basic-concepts': {
    lessons: [
      { title: 'Classifying matter', blocks: [
        ['p', 'Look around you: a glass of water, the air, a coin, a salad. All of it is <strong>matter</strong>, anything that has mass and takes up space. <strong>Chemistry</strong> is the study of matter and the changes it undergoes.'],
        ['p', 'Chemists sort matter by what it is made of. The first question to ask is: <em>can I separate it by physical means, such as filtering, sorting or evaporating?</em> If yes, it is a mixture. If no, it is a substance.'],
        ['table', ['Term', 'Meaning', 'Example'], [
          ['Substance', 'Definite composition and distinct properties', 'Water'],
          ['Element', 'Cannot be split into simpler substances by chemical means', 'Gold, oxygen'],
          ['Compound', 'Atoms of two or more elements chemically united; separated only by chemical means', 'Water (H\u2082O)'],
          ['Mixture', 'Two or more substances that can be separated by physical means', 'Air, salad'],
          ['Homogeneous mixture', 'Uniform throughout', 'Salt dissolved in water'],
          ['Heterogeneous mixture', 'Not uniform throughout', 'Sand and water'],
        ]],
        ['note', '<strong>Remember:</strong> mixtures are split by <em>physical</em> methods, compounds by <em>chemical</em> methods (a reaction). The pieces of a mixture keep their identity, but a compound has properties of its own that differ from its elements.'],
        chk('Sugar dissolved in water looks the same everywhere. What is it?', ['A compound', 'A homogeneous mixture', 'A heterogeneous mixture', 'An element'], 1, 'It is a mixture because the sugar can be recovered by evaporating the water, and it is homogeneous because it is uniform throughout.'),
        ['h', 'Try it: sort these'],
        ['w', 'classify'],
      ] },
      { title: 'States, properties and changes of matter', blocks: [
        ['p', 'Substances exist as a solid, a liquid or a gas. The difference is how far apart the particles are and how freely they move.'],
        ['list', [
          '<strong>Solid:</strong> particles are packed close in an orderly pattern and can only vibrate in place.',
          '<strong>Liquid:</strong> particles are close but not locked in position, so they slide past one another.',
          '<strong>Gas:</strong> particles are far apart compared with their own size and move freely.',
        ]],
        ['w', 'states'],
        ['h', 'Physical and chemical properties'],
        ['p', 'A <strong>physical property</strong> can be measured or observed without changing what the substance is. A <strong>chemical property</strong> only shows up when the substance reacts and becomes something new.'],
        ['table', ['Type', 'Depends on the amount?', 'Examples'], [
          ['Intensive physical', 'No', 'Colour, odour, taste, density, melting point, boiling point'],
          ['Extensive physical', 'Yes', 'Mass, volume, length'],
          ['Chemical', '\u2014', 'Flammability, heat of combustion, whether it reacts with water or air'],
        ]],
        chk('Which of these is an <em>extensive</em> property?', ['Density', 'Mass', 'Boiling point', 'Colour'], 1, 'Mass changes with the amount of sample. Density, boiling point and colour are the same for 1 g or 1 kg.'),
        ['h', 'Chemical reactions and equations'],
        ['p', 'In a <strong>chemical reaction</strong>, one or more substances change into new substances. A <strong>chemical equation</strong> is the shorthand. <strong>Reactants</strong> (the starting materials) go on the left, <strong>products</strong> on the right, with an arrow between them.'],
        ['table', ['Symbol', 'Meaning'], [['(s)', 'solid'], ['(l)', 'liquid'], ['(g)', 'gas'], ['(aq)', 'aqueous: dissolved in water']]],
        ['note', 'KBr(aq) + AgNO\u2083(aq) \u2192 KNO\u2083(aq) + AgBr(s). Two clear solutions are mixed and a solid, silver bromide, appears.'],
        chk('In the equation above, which product is the solid?', ['KNO\u2083', 'AgBr', 'KBr', 'AgNO\u2083'], 1, 'Only AgBr carries the (s) label. The others are dissolved, shown by (aq).'),
      ] },
      { title: 'Measurement and SI units', blocks: [
        ['p', 'Suppose a recipe says \u201c2\u201d. Two what? A <strong>measurement</strong> always has two parts: a <strong>number</strong> and a <strong>unit</strong>. Without both, it means nothing. An observation with no number, such as \u201cthe liquid is blue\u201d, is <em>qualitative</em>.'],
        ['table', ['Quantity', 'SI unit', 'Symbol'], [
          ['Mass', 'kilogram', 'kg'], ['Length', 'meter', 'm'], ['Time', 'second', 's'], ['Temperature', 'kelvin', 'K'],
          ['Electric current', 'ampere', 'A'], ['Amount of substance', 'mole', 'mol'], ['Luminous intensity', 'candela', 'cd'],
        ]],
        ['p', 'These seven are the <strong>fundamental</strong> units. Everything else is <strong>derived</strong> from them: area (m\u00b2), volume (m\u00b3), density (kg/m\u00b3) and speed (m/s). In the lab, smaller units are common: centimeter, gram and second (CGS).'],
        ['h', 'Prefixes'],
        ['p', 'Prefixes scale a unit up or down by a power of ten, so we do not write long strings of zeros.'],
        ['table', ['Prefix', 'Symbol', 'Power of 10', 'Example'], [
          ['giga', 'G', '10\u2079', '1 GHz'], ['mega', 'M', '10\u2076', '1 MPa'], ['kilo', 'k', '10\u00b3', '1 km = 1000 m'], ['centi', 'c', '10\u207b\u00b2', '1 cm = 0.01 m'],
          ['milli', 'm', '10\u207b\u00b3', '1 mL = 0.001 L'], ['micro', '\u00b5', '10\u207b\u2076', '1 \u00b5m'], ['nano', 'n', '10\u207b\u2079', '1 nm'], ['pico', 'p', '10\u207b\u00b9\u00b2', '1 pm'],
        ]],
        ['h', 'Volume'],
        ['p', 'Volume is not a fundamental unit; it comes from length. Chemists use the liter all the time: <strong>1 L = 1 dm\u00b3 = 1000 cm\u00b3 = 1000 mL</strong>, and so 1 cm\u00b3 = 1 mL.'],
        ['note', '<strong>Temperature:</strong> the SI unit is the kelvin. K = \u00b0C + 273.15. There is nothing colder than 0 K.'],
        chk('How many cm\u00b3 are in 1 L?', ['10', '100', '1000', '1 000 000'], 2, '1 L = 1 dm\u00b3 = (10 cm)\u00b3 = 1000 cm\u00b3.'),
        chk('The prefix \u201cmilli\u201d means:', ['10\u00b3', '10\u207b\u00b3', '10\u207b\u00b2', '10\u207b\u2076'], 1, 'Milli is one thousandth: 1 mm = 10\u207b\u00b3 m.'),
        ['h', 'Try it: convert units'],
        ['w', 'convert'],
      ] },
      { title: 'Significant figures and rounding', blocks: [
        ['p', 'Imagine reading a ruler marked in millimeters. You can be sure of the whole millimeters, and you <em>estimate</em> the next digit by eye. A reading of 7.43 cm has three certain-or-estimated digits. Those are its <strong>significant figures</strong>: all the digits known for certain, plus the first uncertain one.'],
        ['h', 'Rules for counting'],
        ['list', [
          '<strong>Non-zero digits</strong> always count. 1458 has 4.',
          '<strong>Leading zeros</strong> never count; they only place the decimal point. 0.0025 has 2.',
          '<strong>Captive zeros</strong> (between non-zero digits) always count. 1.008 has 4.',
          '<strong>Trailing zeros</strong> count only if the number has a decimal point. 100 has 1, but 100. and 1.00 \u00d7 10\u00b2 have 3.',
          '<strong>Exact numbers</strong> come from counting (10 experiments) or from definitions (1 in = 2.54 cm). They never limit the number of significant figures.',
        ]],
        ['w', 'sigfigs'],
        chk('How many significant figures are in 0.04050?', ['2', '3', '4', '5'], 2, 'The leading zeros do not count. The 4, the captive 0, the 5 and the trailing 0 (there is a decimal point) do: 4 digits.'),
        ['h', 'Rounding off'],
        ['p', 'To round, look at the <strong>first digit you are going to drop</strong>:'],
        ['list', [
          'If it is <strong>4 or less</strong>, leave the last kept digit as it is. 6.342 \u2192 6.3 (2 significant figures).',
          'If it is <strong>5 or more</strong>, raise the last kept digit by one. 6.384 \u2192 6.4 (2 significant figures) and 41.154 \u2192 41.2 (3 significant figures).',
          '<strong>Round only at the very end.</strong> In a multi-step problem keep one or two extra digits along the way, then round the final answer once.',
        ]],
        ['note', 'Some instructors use \u201cround half to even\u201d when the dropped digit is exactly 5. ChemLab always rounds a 5 up, the most common classroom rule. Follow whatever your instructor asks for in exams.'],
        ['w', 'rounder'],
        ['h', 'Significant figures in calculations'],
        ['list', [
          '<strong>Multiply or divide:</strong> the answer has as many significant figures as the factor with the <em>fewest</em>.',
          '<strong>Add or subtract:</strong> the answer has as many <em>decimal places</em> as the number with the fewest.',
        ]],
        ['ex', 'Multiplying', 'Calculate 2.50 \u00d7 3.1.', [
          'The calculator shows 2.50 \u00d7 3.1 = 7.75.',
          '2.50 has 3 significant figures; 3.1 has 2. The fewest is <strong>2</strong>.',
          'Round 7.75 to 2 significant figures. The dropped digit is 5, so round up: <strong>7.8</strong>.',
        ]],
        ['ex', 'Adding', 'Calculate 22.13 + 17.0 + 2.024.', [
          'The calculator shows 41.154.',
          'Decimal places: 22.13 has 2, 17.0 has 1, 2.024 has 3. The fewest is <strong>1</strong>.',
          'Round to one decimal place: the dropped digit is 5, so <strong>41.2</strong>.',
        ]],
        ['w', 'sigops'],
        chk('What is 12.11 + 0.3, correctly rounded?', ['12.41', '12.4', '12.5', '12'], 1, '0.3 has one decimal place, the fewest, so the answer has one: 12.41 \u2192 12.4.'),
      ] },
      { title: 'Scientific notation, accuracy and precision', blocks: [
        ['p', 'The mass of one carbon atom is about 0.0000000000000000000000199 g. Nobody wants to write that. <strong>Scientific notation</strong> writes it as <strong>N \u00d7 10<sup>n</sup></strong>, where N is between 1 and 10 and n is a whole number: 1.99 \u00d7 10<sup>\u221223</sup> g.'],
        ['list', [
          'Move the decimal point until you have a number between 1 and 10.',
          'Moved <strong>left</strong>: the exponent is <strong>positive</strong>. 456000 \u2192 4.56 \u00d7 10<sup>5</sup>.',
          'Moved <strong>right</strong>: the exponent is <strong>negative</strong>. 0.00567 \u2192 5.67 \u00d7 10<sup>\u22123</sup>.',
          'Scientific notation also settles trailing zeros: 1.00 \u00d7 10<sup>2</sup> clearly has 3 significant figures.',
        ]],
        ['w', 'scinot'],
        chk('Write 0.000072 in scientific notation.', ['7.2 \u00d7 10\u207b\u2075', '7.2 \u00d7 10\u207b\u2074', '72 \u00d7 10\u207b\u2076', '7.2 \u00d7 10\u2075'], 0, 'The decimal point moves 5 places to the right to give 7.2, so the exponent is \u22125.'),
        ['h', 'Accuracy and precision'],
        ['p', 'These two words are not the same. <strong>Accuracy</strong> is how close a measurement is to the <em>true</em> value. <strong>Precision</strong> is how close repeated measurements are to <em>each other</em>.'],
        ['p', 'A common way to check accuracy is the <strong>percent error</strong>: |measured \u2212 accepted| \u00f7 accepted \u00d7 100. The smaller it is, the more accurate the result.'],
        ['h', 'Throw some darts'],
        ['p', 'Move the sliders to see all four combinations.'],
        ['w', 'darts'],
        chk('A scale always reads 0.50 g too high, but gives the same reading every time. It is:', ['Accurate and precise', 'Precise but not accurate', 'Accurate but not precise', 'Neither'], 1, 'Repeat readings agree (precise), but they are all off from the true mass (not accurate).'),
      ] },
      { title: 'Dimensional analysis', blocks: [
        ['p', 'How many centimeters are in 2 meters? You already know: 2 \u00d7 100 = 200 cm. What you did is called <strong>dimensional analysis</strong> (the factor-label method): multiply by a <strong>conversion factor</strong>, a fraction whose top and bottom are the same quantity in different units.'],
        ['note', '2 m \u00d7 (100 cm / 1 m) = 200 cm. The meters cancel because one is on top and one on the bottom, leaving centimeters.'],
        ['list', [
          'Write the <strong>given</strong> quantity and the unit you want.',
          'Choose a conversion factor with the <strong>unit you want to remove on the bottom</strong>, so it cancels.',
          'Chain factors when there is no direct one (pounds \u2192 grams \u2192 milligrams).',
          'Check that the units cancel to the one you wanted. If not, a factor is upside down.',
          'Round to the significant figures of the <em>measured</em> numbers. Defined factors such as 100 cm = 1 m are exact.',
        ]],
        ['ex', 'A length in two steps', 'A pipe is 3.25 in long. What is its length in millimeters? (1 in = 2.54 cm exactly.)', [
          'Plan: in \u2192 cm \u2192 mm.',
          '3.25 in \u00d7 (2.54 cm / 1 in) \u00d7 (10 mm / 1 cm). Inches cancel, then centimeters cancel.',
          '3.25 \u00d7 2.54 \u00d7 10 = 82.55. The measured value has 3 significant figures, so the answer is <strong>82.6 mm</strong>.',
        ]],
        ['ex', 'A speed', 'A truck travels at 90.0 km/h. What is its speed in m/s?', [
          'Convert distance and time separately: km \u2192 m, then h \u2192 s.',
          '90.0 km/h \u00d7 (1000 m / 1 km) \u00d7 (1 h / 3600 s).',
          '90.0 \u00d7 1000 \u00f7 3600 = 25. Keeping 3 significant figures: <strong>25.0 m/s</strong>.',
        ]],
        ['ex', 'A volume: cube the length factor', 'A tank holds 4.50 L. What is its volume in m\u00b3?', [
          'Use 1 L = 1000 cm\u00b3, then convert cm\u00b3 to m\u00b3.',
          'For volume, the length factor must be cubed: 1 m = 100 cm, so 1 m\u00b3 = (100 cm)\u00b3 = 10\u2076 cm\u00b3.',
          '4.50 L \u00d7 (1000 cm\u00b3 / 1 L) \u00d7 (1 m\u00b3 / 10\u2076 cm\u00b3) = <strong>4.50 \u00d7 10\u207b\u00b3 m\u00b3</strong>.',
        ]],
        ['ex', 'A density', 'A metal has a density of 2.5 g/cm\u00b3. What is that in kg/m\u00b3?', [
          'Two conversions: g \u2192 kg on top, cm\u00b3 \u2192 m\u00b3 on the bottom.',
          '2.5 g/cm\u00b3 \u00d7 (1 kg / 1000 g) \u00d7 (10\u2076 cm\u00b3 / 1 m\u00b3).',
          '2.5 \u00d7 10\u2076 \u00f7 1000 = 2500, so <strong>2.5 \u00d7 10\u00b3 kg/m\u00b3</strong>.',
        ]],
        chk('To convert 275 L to m\u00b3, what do you get?', ['0.275 m\u00b3', '275 000 m\u00b3', '2.75 m\u00b3', '0.0275 m\u00b3'], 0, '1 L = 10\u207b\u00b3 m\u00b3, so 275 L = 0.275 m\u00b3.'),
        ['w', 'convert'],
      ] },
      { title: 'The mole and molar mass', blocks: [
        ['p', 'You buy eggs by the dozen, paper by the ream. Atoms are so tiny that chemists need a far bigger counting unit: the <strong>mole</strong>. One mole is the amount of substance containing as many particles as there are atoms in exactly 12 g of carbon-12.'],
        ['note', '<strong>Avogadro\u2019s number:</strong> 1 mol = 6.022 \u00d7 10\u00b2\u00b3 particles. One mole of water molecules, of iron atoms or of sodium ions each contains 6.022 \u00d7 10\u00b2\u00b3 particles.'],
        ['h', 'Molar mass'],
        ['p', 'The <strong>molar mass</strong> is the mass of one mole, in g/mol. For an element it is the atomic mass from the periodic table, in grams. For a compound, add up the atomic masses of every atom in the formula, using the subscripts as multipliers.'],
        ['ex', 'Molar mass of a compound', 'Find the molar mass of Ca(OH)\u2082.', [
          'Count the atoms. The subscript 2 outside the brackets multiplies everything inside: 1 Ca, 2 O, 2 H.',
          'Ca: 1 \u00d7 40.078 = 40.078. O: 2 \u00d7 15.999 = 31.998. H: 2 \u00d7 1.008 = 2.016.',
          'Add: 40.078 + 31.998 + 2.016 = 74.092. Molar mass = <strong>74.09 g/mol</strong>.',
        ]],
        ['h', 'Three conversions to master'],
        ['list', [
          'Grams \u2192 moles: divide by the molar mass.',
          'Moles \u2192 grams: multiply by the molar mass.',
          'Moles \u2192 particles: multiply by 6.022 \u00d7 10\u00b2\u00b3 (and the other way, divide).',
        ]],
        ['ex', 'Grams to moles to particles', 'How many moles and how many formula units are in 25.0 g of NaCl? (molar mass 58.44 g/mol)', [
          'Grams \u2192 moles: 25.0 g \u00d7 (1 mol / 58.44 g) = 0.4278 mol. With 3 significant figures: <strong>0.428 mol</strong>.',
          'Moles \u2192 particles: 0.4278 mol \u00d7 (6.022 \u00d7 10\u00b2\u00b3 / 1 mol) = 2.576 \u00d7 10\u00b2\u00b3.',
          'Rounded to 3 significant figures: <strong>2.58 \u00d7 10\u00b2\u00b3 formula units</strong>.',
        ]],
        ['p', '<strong>Atoms inside molecules.</strong> 2.00 mol of CO\u2082 contains 2.00 \u00d7 6.022 \u00d7 10\u00b2\u00b3 molecules, and each has 2 oxygen atoms, so there are 2.41 \u00d7 10\u00b2\u2074 oxygen atoms.'],
        ['h', 'Try it'],
        ['w', 'mole'],
        chk('How many molecules are in 1.00 mol of water?', ['6.022 \u00d7 10\u00b2\u00b3', '18.02', '3.011 \u00d7 10\u00b2\u00b3', '1.00'], 0, 'One mole of anything is 6.022 \u00d7 10\u00b2\u00b3 particles. The 18.02 is its mass in grams.'),
        chk('How many moles are in 6.46 g of helium (4.003 g/mol)?', ['0.620 mol', '1.61 mol', '25.9 mol', '6.46 mol'], 1, '6.46 g \u00f7 4.003 g/mol = 1.61 mol.'),
      ] },
    ],
    tools: {
      'sim-1': { title: 'States of matter', widget: 'states', intro: 'Drag the temperature and watch how the particles behave in each state.' },
      'sim-2': { title: 'Matter sorter', widget: 'classify', intro: 'Classify each item as an element, a compound, or a homogeneous or heterogeneous mixture. A new set of 8 every round.' },
      'sim-3': { title: 'Accuracy and precision', widget: 'darts', intro: 'Set accuracy and precision separately and see how the darts land.' },
      'calc-1': { title: 'Significant figures toolkit', widget: 'sigtools', intro: 'Count significant figures, round a number, and add, subtract, multiply or divide with the right precision.' },
      'calc-2': { title: 'Scientific notation', widget: 'scinot', intro: 'Convert in both directions. The significant figures are kept.' },
      'calc-3': { title: 'Unit converter', widget: 'convert', intro: 'Shows the factor-label setup and rounds to the right number of significant figures.' },
      'calc-4': { title: 'Density, temperature and percent error', widget: 'measure', intro: 'Three everyday lab calculations in one place.' },
      'calc-5': { title: 'Molar mass and mole calculator', widget: 'mole', intro: 'Type a formula to get its molar mass, then convert between grams, moles and particles.' },
    },
    quiz: [
      { q: 'Salt dissolved in water is best classified as:', options: ['An element', 'A compound', 'A homogeneous mixture', 'A heterogeneous mixture'], answer: 2, why: 'The composition is uniform, and the salt can be recovered by evaporating the water: a physical method.' },
      { q: 'Which of these is an intensive property?', options: ['Mass', 'Volume', 'Density', 'Length'], answer: 2, why: 'Density is the same for any amount of the substance. Mass, volume and length depend on the amount.' },
      { q: 'In KBr(aq) + AgNO\u2083(aq) \u2192 KNO\u2083(aq) + AgBr(s), what does (aq) mean?', options: ['A solid', 'A gas', 'Dissolved in water', 'A liquid metal'], answer: 2, why: '(aq) means aqueous: dissolved in water.' },
      { q: 'How many significant figures are in 0.0025?', options: ['1', '2', '3', '4'], answer: 1, why: 'Leading zeros only locate the decimal point. Only 2 and 5 count.' },
      { q: 'Round 6.384 to 2 significant figures.', options: ['6.3', '6.4', '6.38', '6'], answer: 1, why: 'The first digit dropped is 8, which is 5 or more, so 6.3 becomes 6.4.' },
      { q: '4.56 \u00d7 1.4 should be reported as:', options: ['6.4', '6.38', '6.384', '6'], answer: 0, why: '1.4 has two significant figures, so the product has two: 6.384 \u2192 6.4.' },
      { q: '22.13 + 17.0 + 2.024 should be reported as:', options: ['41.154', '41.15', '41.2', '41'], answer: 2, why: '17.0 has one decimal place, the fewest, so the sum has one decimal place.' },
      { q: 'Write 456 000 in scientific notation (3 significant figures).', options: ['4.56 \u00d7 10\u2074', '4.56 \u00d7 10\u2075', '45.6 \u00d7 10\u2074', '4.56 \u00d7 10\u207b\u2075'], answer: 1, why: 'The decimal point moves 5 places left, so the exponent is +5.' },
      { q: 'Four readings of 20.15, 20.14, 20.16 and 20.15 mL are close together, but the true volume is 25.00 mL. The readings are:', options: ['Accurate and precise', 'Precise but not accurate', 'Accurate but not precise', 'Neither'], answer: 1, why: 'They agree with each other (precise) but not with the true value (not accurate).' },
      { q: '8.50 in is how many cm? (1 in = 2.54 cm exactly)', options: ['3.35 cm', '21.6 cm', '216 cm', '21.59 cm'], answer: 1, why: '8.50 \u00d7 2.54 = 21.59, rounded to 3 significant figures is 21.6.' },
      { q: 'The density of liquid nitrogen is 0.808 g/cm\u00b3. In kg/m\u00b3 that is:', options: ['0.808', '8.08', '808', '808 000'], answer: 2, why: '0.808 g/cm\u00b3 \u00d7 (1 kg / 1000 g) \u00d7 (10\u2076 cm\u00b3 / 1 m\u00b3) = 808 kg/m\u00b3.' },
      { q: 'How many moles of He are in 6.46 g? (molar mass 4.003 g/mol)', options: ['0.620 mol', '1.61 mol', '25.9 mol', '6.46 mol'], answer: 1, why: '6.46 g \u00f7 4.003 g/mol = 1.61 mol.' },
      { q: 'What is the molar mass of Ca(OH)\u2082? (Ca 40.078, O 15.999, H 1.008)', options: ['57.09 g/mol', '74.09 g/mol', '58.09 g/mol', '114.2 g/mol'], answer: 1, why: 'Ca(OH)\u2082 has 1 Ca, 2 O and 2 H: 40.078 + 2(15.999) + 2(1.008) = 74.092, so 74.09 g/mol.' },
    ],
    reference: {
      terms: [
        ['Matter', 'Anything that has mass and occupies space.'],
        ['Substance', 'Matter with a definite composition and distinct properties.'],
        ['Mixture', 'Two or more substances that can be separated by physical means.'],
        ['Element', 'A substance that cannot be broken into simpler substances by chemical means.'],
        ['Compound', 'A substance made of atoms of two or more elements chemically united.'],
        ['Intensive property', 'A property that does not depend on the amount of substance (density, boiling point).'],
        ['Extensive property', 'A property that depends on the amount of substance (mass, volume).'],
        ['Significant figures', 'The certain digits of a measurement plus the first uncertain one.'],
        ['Accuracy', 'How close a measurement is to the true value.'],
        ['Precision', 'How close repeated measurements are to each other.'],
        ['Conversion factor', 'A fraction equal to 1 that relates two units of the same quantity.'],
        ['Mole', 'The amount of substance containing 6.022 \u00d7 10\u00b2\u00b3 particles.'],
        ['Molar mass', 'The mass of one mole of a substance, in g/mol.'],
      ],
      formulas: [
        ['Density', '\u03c1 = m \u00f7 V'],
        ['Temperature', 'K = \u00b0C + 273.15 and \u00b0F = 1.8 \u00d7 \u00b0C + 32'],
        ['Percent error', '|measured \u2212 accepted| \u00f7 accepted \u00d7 100'],
        ['Volume', '1 L = 1000 mL = 1000 cm\u00b3 = 1 dm\u00b3'],
        ['Multiply / divide', 'Keep the fewest significant figures'],
        ['Add / subtract', 'Keep the fewest decimal places'],
        ['Moles from mass', 'n = mass \u00f7 molar mass'],
        ['Particles', 'N = n \u00d7 6.022 \u00d7 10\u00b2\u00b3'],
      ],
    },
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

CONTENT['atomic-periodicity'] = ATOMIC;
