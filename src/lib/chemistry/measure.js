// Density, temperature scales and percent error. Pure functions.
export const density = (mass, volume) => (volume > 0 ? mass / volume : null);
export const percentError = (measured, accepted) => (accepted !== 0 ? (Math.abs(measured - accepted) / Math.abs(accepted)) * 100 : null);
export function temperature(value, from, to) {
  const K = from === 'C' ? value + 273.15 : from === 'F' ? ((value - 32) * 5) / 9 + 273.15 : value;
  return to === 'C' ? K - 273.15 : to === 'F' ? ((K - 273.15) * 9) / 5 + 32 : K;
}
