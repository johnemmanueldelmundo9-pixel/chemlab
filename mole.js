// Mole conversions: grams <-> moles <-> particles. Pure functions (no DOM).
export const AVOGADRO = 6.022e23;

// amount + unit ('g' grams, 'mol' moles, 'p' particles) + molar mass (g/mol)
// -> { mol, mass, particles } or null for an invalid input.
export function moleConvert(amount, unit, molarMass) {
  if (!(molarMass > 0) || !isFinite(amount) || amount < 0) return null;
  const mol = unit === 'g' ? amount / molarMass : unit === 'mol' ? amount : unit === 'p' ? amount / AVOGADRO : null;
  if (mol === null) return null;
  return { mol, mass: mol * molarMass, particles: mol * AVOGADRO };
}
