// Animated Bohr-style atom for the hero. Electrons travel along tilted orbits (SMIL).
const ORBIT = 'M 200 200 m -150 0 a 150 56 0 1 0 300 0 a 150 56 0 1 0 -300 0';

export function atomSvg() {
  const orbit = (deg, dur, begin) => `
    <g transform="rotate(${deg} 200 200)">
      <path class="orbit" d="${ORBIT}"/>
      <circle class="electron" r="7">
        <animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${ORBIT}"/>
      </circle>
    </g>`;
  return `
    <svg viewBox="0 0 400 400" role="img" aria-label="Animated atom with three electron orbits">
      ${orbit(0, 7, 0)}${orbit(60, 9, -3)}${orbit(120, 11, -6)}
      <circle class="nucleus" cx="200" cy="200" r="20"/>
      <circle class="nuc-b" cx="191" cy="206" r="12"/>
      <circle class="nucleus" cx="208" cy="192" r="11"/>
    </svg>`;
}
