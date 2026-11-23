// Pure maths for the teaching simulations. No DOM, no side effects, all testable.

export function spillOutcome(kind, action) {
  const safe = {
    acid: 'rinse',
    base: 'rinse',
    solvent: 'absorb',
  }[kind] === action;
  const spread = { acid: 0.8, base: 0.75, solvent: 1 }[kind] ?? 0.8;
  const score = safe ? Math.round(10 * (1 - spread) * 10) / 10 : Math.round((4 + spread * 6) * 10) / 10;
  return {
    safe,
    score,
    notice: safe
      ? `${kind[0].toUpperCase() + kind.slice(1)}: the right response limits the spread.`
      : `${kind[0].toUpperCase() + kind.slice(1)} needs ${safe === false ? (kind === 'solvent' ? 'an absorbent, not water' : 'water rinsing') : 'a different response'}.`,
  };
}

export function molarity(massGrams, molarMass, volumeMl) {
  const litres = volumeMl / 1000; // mL -> L before dividing
  const moles = massGrams / molarMass;
  return { moles, litres, concentration: litres > 0 ? moles / litres : 0 };
}

export function heatFlow(massGrams, specificHeat, deltaT) {
  return massGrams * specificHeat * deltaT; // joules
}

export function equilibriumShift(stress) {
  const table = {
    reactant: { dir: 'right', q: 'Q < K', notice: 'Adding reactant makes the system use it up: shifts right.' },
    product: { dir: 'left', q: 'Q > K', notice: 'Adding product makes the system consume it: shifts left.' },
    cool: { dir: 'right', q: 'Q < K', notice: 'Cooling an exothermic reaction favours heat production: shifts right.' },
    heat: { dir: 'left', q: 'Q > K', notice: 'Heating an exothermic reaction favours heat absorption: shifts left.' },
  };
  return table[stress] || { dir: 'none', q: 'Q = K', notice: 'No stress: the system is already at equilibrium.' };
}

// Nernst equation at 25 °C, using base-10 logs.
export function cellPotential(cathodeE, anodeE, concentration, electrons = 2) {
  const standard = cathodeE - anodeE;
  const q = 1 / concentration; // simplified: reduced ion concentration on the cathode side
  return { standard, potential: standard - (0.0592 / electrons) * Math.log10(q), q };
}

export function faraday(currentAmps, seconds, molarMass, electrons = 2) {
  const coulombs = currentAmps * seconds;
  const moles = coulombs / (96485 * electrons);
  return { coulombs, moles, grams: moles * molarMass, gasLitres: moles * 24.5 };
}
