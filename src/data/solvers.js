The solvers for Modules 7 (thermochemistry and equilibrium) and 8 (electrochemistry) are finished. I tested all 14 in a headless browser in dark and light mode, and nothing scrolls sideways. All the maths tests pass.

What you get

Module 7:

heat and temperature change
calorimetry (coffee-cup, bomb, mixing)
heating curve of water
Hess's law, where you give the target reaction and the reactions you know and the tool finds how to combine them
enthalpy of reaction from formation enthalpies, with a box to override a table value
free energy, crossover temperature and K
equilibrium constant, Q and Kp/Kc
an ICE table solver, solved exactly with no small-x shortcut
Le Chatelier's principle

Module 8:

oxidation numbers
redox balancer for acidic and basic solutions, with every step shown (MnO₄⁻ + Fe²⁺ comes out as MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O)
cell potential, ΔG° and K from 30 half-reactions
Nernst equation
electrolysis with Faraday's law, including gas volumes

These modules have only calculators. There are no lessons or quizzes yet, so the page shows "Soon" for the quiz, and nothing needs changing for that.

What to do

Upload these (new or replace):

File	Where	What to do
thermo.js, equilibrium.js, redox.js	src/lib/chemistry/	New
solverWidgets.js	src/lib/	New
solvers.js	src/data/	New
modules.js	src/data/	Replace (Modules 7 and 8 are now "ready")
thermo.test.mjs, redox.test.mjs	tests/	New (optional)

Edit these three files:

src/data/content.js:
At the very top add import { THERMO, ELECTRO } from './solvers.js';
At the very bottom add these two lines:
js
CONTENT['thermo-equilibrium'] = THERMO;
CONTENT['electrochemistry'] = ELECTRO;
src/lib/widgets.js:
Add import { SOLVER_WIDGETS } from './solverWidgets.js'; with the other imports.
In the const WIDGETS = { ... line, add ...SOLVER_WIDGETS, right after ...LAB_WIDGETS,. The three dots are part of it.
src/styles/lesson.css: paste this at the very bottom.
css
/* ---------- Solver widgets (Modules 7 and 8) ---------- */
.wd-out-col { display: grid; gap: 12px; }
.wd-hrow { display: grid; gap: 8px; grid-template-columns: 1fr 110px; margin-bottom: 8px; }
.wd-hrow input { width: 100%; padding: 10px 12px; border-radius: var(--radius-sm); border: 1px solid var(--line); background: var(--bg); color: var(--ink); font: inherit; font-size: .95rem; }
.wd-steps { margin: 0; padding-left: 1.3em; display: grid; gap: 8px; }
.wd-steps li { color: var(--ink); }
.wd-out-col small { font-size: .72em; color: var(--ink-3); }
.wd-out-col sub, .wd-out-col sup { line-height: 0; }
.wd-out-col .wd-grid dt { text-transform: none; }

One more small edit: in src/components/moduleCard.js, find <span>Lessons</span> in the mc-features line and change it to ${m.plan.lessons ? '<span>Lessons</span>' : ''}. Without this, the Modules 7 and 8 cards would still list "Lessons" though they have none.

Upload everything in one commit, then hard refresh with Ctrl+Shift+R.

Things to know
If the calcu side changed widgets.js or modules.js since: keep their version and add only the lines above. They only collide if both of you rewrite those two files.
Module 4 files: don't upload lewis.js, vsepr.js, bonding.js, bondWidgets.js or lewis.test.mjs. They are only the Module 4 starting point, and nothing uses them yet. Skipping them is fine.
Check these against your textbook:
The ΔHf° values are typical textbook ones, and yours may differ by a few tenths. The tool has an override box for that.
The water constants are 334 J/g for melting and 2260 J/g for boiling.
The tool uses R = 8.314 J/(mol·K) and 0.08206 L·atm/(mol·K), and F = 96 485 C/mol.
Redox: it works when one species is oxidized and one is reduced. Anything more complicated gets a clear message asking you to balance the half-reactions separately.
Not tested against your real site: I tested with the real page code and stand-in data, not your live router. Open Module 7 and click each calculator once after deploying.

Tell me which module to do next, or whether you want lessons and quizzes added to Modules 7 and 8.

Modules
Code
·JS
Solvers
Code
·JS
solverWidgets
Code
·JS
Thermo
Code
·JS
Equilibrium
Code
·JS
Redox
Code
·JS
Thermo.test
Code
·MJS
Redox.test
Code
·MJS
