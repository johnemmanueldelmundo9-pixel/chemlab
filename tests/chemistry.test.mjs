// Run with:  node tests/chemistry.test.mjs   (no dependencies)
import assert from 'node:assert/strict';
import { countSigFigs, roundSig, mulDiv, addSub, roundPlaces } from '../src/lib/chemistry/sigfigs.js';
import { toScientific, fromScientific } from '../src/lib/chemistry/notation.js';
import { factor, convert } from '../src/lib/chemistry/units.js';
import { parseFormula, molarMass } from '../src/lib/chemistry/molarMass.js';
import { density, percentError, temperature } from '../src/lib/chemistry/measure.js';
import { moleConvert, AVOGADRO } from '../src/lib/chemistry/mole.js';

const near = (a, b, t = 1e-9) => assert.ok(Math.abs(a - b) <= t * Math.max(1, Math.abs(b)), `${a} != ${b}`);

// counting (the rules in the deck)
for (const [s, n] of [['1458', 4], ['0.0025', 2], ['1.008', 4], ['100', 1], ['100.', 3], ['1.00e2', 3], ['0.00250', 3], ['2.50', 3]]) assert.equal(countSigFigs(s), n, s);
assert.equal(countSigFigs('0'), null); assert.equal(countSigFigs('abc'), null);

// rounding
assert.equal(roundSig(6.384, 2).text, '6.4'); assert.equal(roundSig(41.154, 3).text, '41.2');
assert.equal(roundSig(7.75, 2).text, '7.8'); assert.equal(roundSig(1.005, 3).text, '1.01'); assert.equal(roundSig(9.996, 3).text, '10.0');
assert.equal(roundSig(21.59, 3).text, '21.6'); assert.equal(roundPlaces(2.675, 2), 2.68);

// arithmetic rules from the deck
assert.equal(mulDiv('4.56', '1.4', '*').text, '6.4');
assert.equal(addSub('22.13', '17.0', '+').text, '39.1');
near(addSub('22.13', '17.0', '+').raw, 39.13);

// scientific notation
assert.deepEqual(toScientific('0.00567'), { mantissa: '5.67', exp: -3, n: 3 });
assert.deepEqual(toScientific('456000'), { mantissa: '4.56', exp: 5, n: 3 });
assert.deepEqual(toScientific('100.'), { mantissa: '1.00', exp: 2, n: 3 });
assert.equal(fromScientific('5.67', -3), '0.00567'); assert.equal(fromScientific('4.56', 5), '456000'); assert.equal(fromScientific('1.5', 1), '15');

// unit conversion: the deck's worked problems
near(convert(8.5, 'Length', 'in', 'cm'), 21.59); near(convert(57.8, 'Length', 'm', 'cm'), 5780);
near(convert(0.0833, 'Mass', 'lb', 'mg'), 37784.88, 1e-6); near(convert(1.36e9 * 1e9, 'Volume', 'm\u00b3', 'L'), 1.36e21 * 1, 1e-9);
near(convert(275, 'Volume', 'L', 'm\u00b3'), 0.275); near(convert(0.808, 'Density', 'g/cm\u00b3', 'kg/m\u00b3'), 808);
near(convert(515, 'Speed', 'm/s', 'mi/h'), 1152.0, 1e-3); near(convert(90, 'Speed', 'km/h', 'm/s'), 25);
assert.equal(factor('Length', 'm', 'nope'), null);

// formulas and molar mass
assert.deepEqual(parseFormula('Ca(OH)2'), { Ca: 1, O: 2, H: 2 });
assert.deepEqual(parseFormula('Al2(SO4)3'), { Al: 2, S: 3, O: 12 });
assert.deepEqual(parseFormula('CuSO4.5H2O'), { Cu: 1, S: 1, O: 9, H: 10 });
assert.deepEqual(parseFormula('C60'), { C: 60 });
assert.equal(parseFormula('ca(oh)2'), null); assert.equal(parseFormula('Ca(OH'), null); assert.equal(parseFormula(''), null);
const M = { H: 1.008, C: 12.011, O: 15.999, Ca: 40.078 };
near(molarMass(parseFormula('Ca(OH)2'), (e) => M[e]).total, 74.092, 1e-6);
near(molarMass(parseFormula('C60'), (e) => M[e]).total, 720.66, 1e-6);
assert.ok(molarMass({ Xx: 1 }, (e) => M[e]).error);

// measurement helpers
near(density(27.0, 10.0), 2.7); near(percentError(9.5, 10), 5); near(temperature(25, 'C', 'K'), 298.15);
near(temperature(100, 'C', 'F'), 212); near(temperature(-40, 'F', 'C'), -40);

// mole conversions: grams, moles and particles
near(moleConvert(25.0, 'g', 74.092).mol, 0.33742, 1e-4);
near(moleConvert(2.00, 'mol', 18.015).mass, 36.03, 1e-4);
near(moleConvert(2.00, 'mol', 18.015).particles / AVOGADRO, 2, 1e-12);
near(moleConvert(AVOGADRO, 'p', 18.015).mol, 1);
assert.equal(moleConvert(-1, 'g', 18), null);
assert.equal(moleConvert(1, 'x', 18), null);
assert.equal(moleConvert(1, 'g', 0), null);
console.log('all chemistry tests passed');
