// Animated Bohr-style atom for the hero. Electrons travel along tilted orbits (SMIL),
// with two lagging copies behind each one so the motion reads as a trail rather than a jump.
const ORBIT = 'M 200 200 m -150 0 a 150 56 0 1 0 300 0 a 150 56 0 1 0 -300 0';

export function atomSvg() {
  const orbit = (deg, dur, begin) => {
    const trail = (lag, r, cls) => `
      <circle class="${cls}" r="${r}">
        <animateMotion dur="${dur}s" begin="${(begin - lag).toFixed(2)}s" repeatCount="indefinite" path="${ORBIT}"/>
      </circle>`;
    return `
    <g transform="rotate(${deg} 200 200)">
      <path class="orbit" d="${ORBIT}"/>
      <path class="orbit-flow" d="${ORBIT}" style="animation-duration:${(dur * 0.55).toFixed(1)}s"/>
      ${trail(0.30, 7, 'electron-trail')}
      ${trail(0.15, 7, 'electron-trail')}
      <circle class="electron" r="7">
        <animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${ORBIT}"/>
      </circle>
    </g>`;
  };
  return `
    <svg viewBox="0 0 400 400" role="img" aria-label="Animated atom with three electron orbits">
      <defs>
        <radialGradient id="atom-glow">
          <stop offset="0%" stop-color="var(--accent)" stop-opacity=".55"/>
          <stop offset="55%" stop-color="var(--accent)" stop-opacity=".16"/>
          <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle class="nuc-glow" cx="200" cy="200" r="78" fill="url(#atom-glow)"/>
      ${orbit(0, 5.5, 0)}${orbit(60, 7, -2.4)}${orbit(120, 8.5, -4.8)}
      <circle class="nucleus" cx="200" cy="200" r="20"/>
      <circle class="nuc-b" cx="191" cy="206" r="12"/>
      <circle class="nucleus" cx="208" cy="192" r="11"/>
    </svg>`;
}
