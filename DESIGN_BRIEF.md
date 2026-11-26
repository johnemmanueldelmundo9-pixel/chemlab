# ChemLab Experimental — design brief (v0)

Part of the main ChemLab project, but a **separate copy**. Nothing here is uploaded. The original `chemlab/` folder and `what changes.zip` are untouched.

## Mode

Redesign · Overhaul of the visual language. Product, content and technical contracts are preserved.

## Visual direction

"Laboratory ledger": paper-like surfaces, hairline rules, mono metadata and large chapter numerals. The atom stays the one moment of motion.

## Protected contracts (do not change)

- Routes, slugs, anchors and primary navigation labels.
- Module ids, lesson/sim/calc/quiz ids, progress keys and local/session storage keys.
- All lesson text, quiz items, legal/consent/privacy copy, owner details and credits.
- System fonts only; current oklch palette roles; bundled lab images.
- WCAG AA, reduced-motion rules, the atom motion exception, and no sideways scroll at 320–1920.
- Public component APIs and the no-build-step ES module setup.

## Dials

Variance 6 · Motion 4 · Density 6 (unchanged) · Assets 6 · Brand fidelity 6.

## Token decisions

- Keep every colour role in `tokens.css`; derive variants with `oklch()` only.
- Two system font stacks only: `--font-sans`, `--font-mono`.
- Spacing: actually use `--sp-*` (4/8/12/16/24/32/48/64/96) instead of literal px.
- Radius: 14 / 10 / 6. Shadow: two levels only.
- Hairlines replace heavy borders and most filled cards.

## Status

- v0: structural + token pass on home, hub and reader, built 20 November 2026.
- Awaiting direction approval before the full build.
