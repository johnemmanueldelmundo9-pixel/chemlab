// Modules 7 (thermochemistry and equilibrium) and 8 (electrochemistry):
// reading lessons plus calculators/simulations and quiz banks.
// Lesson block types match content.js: ['h'|'p'|'note'|'list'|'table'|'ex'|'w'|'check', ...]
const tool = (title, widget, intro) => ({ title, widget, intro });
const chk = (q, options, answer, why) => ['check', { q, options, answer, why }];

export const THERMO = {
  lessons: [
    { title: 'Systems, surroundings, state functions and the First Law', blocks: [
      ['p', '<strong>Thermochemistry</strong> studies heat changes in reactions and phase changes. It underpins fuels, batteries, engines, refrigeration and chemical manufacturing.'],
      ['p', 'The <strong>system</strong> is the part of the universe being studied. The <strong>surroundings</strong> are everything outside its boundary. Together they make up the <strong>universe</strong>, and total energy is conserved.'],
      ['table', ['System type', 'Matter exchange', 'Energy exchange', 'Engineering example'], [
        ['Open', 'Yes', 'Yes', 'Boiling water in an open beaker'],
        ['Closed', 'No', 'Yes', 'Sealed gas cylinder warming in sunlight'],
        ['Isolated', 'No', 'No (ideally)', 'Insulated bomb calorimeter or vacuum flask'],
      ]],
      ['h', 'State functions vs. path functions'],
      ['p', '<strong>State functions</strong> depend only on the initial and final states: internal energy (U), enthalpy (H), pressure (P), volume (V) and temperature (T). <strong>Path functions</strong> depend on how the change happens: heat (q) and work (w).'],
      ['h', 'The First Law of Thermodynamics'],
      ['note', 'Chemistry sign convention: <strong>ΔU = q + w</strong>. Heat absorbed by the system is positive; work done <em>on</em> the system is positive.'],
      ['table', ['Quantity', 'Positive (+)', 'Negative (−)'], [
        ['Heat q', 'System absorbs heat (endothermic)', 'System releases heat (exothermic)'],
        ['Work w', 'Work done on the system (compression)', 'Work done by the system (expansion)'],
      ]],
      chk('A system absorbs 560 J of heat and does 150 J of work on the surroundings. What is ΔU?', ['+410 J', '+710 J', '−410 J', '−710 J'], 0, 'q = +560 J and w = −150 J, so ΔU = q + w = +410 J.'),
    ] },
    { title: 'Heat transfer, pressure-volume work and calorimetry', blocks: [
      ['p', 'Sensible heat uses <strong>q = m c ΔT</strong>, or <strong>q = C ΔT</strong> when the whole object has heat capacity C. Water has c = 4.184 J g⁻¹ °C⁻¹. ΔT = T_final − T_initial.'],
      ['p', 'Expanding gas does work against the surroundings: <strong>w = −PΔV</strong>, with <strong>1 L·atm = 101.3 J</strong>. Compression (ΔV &lt; 0) gives positive w; expansion gives negative w.'],
      ['ex', 'Cooling water', 'A 350 g water sample cools from 82 °C to 30 °C. Find the heat transferred.', [
        'ΔT = 30 − 82 = −52 °C.',
        'q = (350 g)(4.184 J g⁻¹ °C⁻¹)(−52 °C) = −76,148.8 J.',
        'So q ≈ <strong>−76.1 kJ</strong>: the water lost heat to the surroundings.',
      ]],
      ['ex', 'Compression and the First Law', 'A gas is compressed from 8.0 L to 3.5 L against 1.20 atm. It also releases 150 J of heat. Find w and ΔU.', [
        'ΔV = 3.5 − 8.0 = −4.5 L.',
        'w = −PΔV = −(1.20)(−4.5) = +5.4 L·atm × 101.3 = <strong>+547 J</strong>.',
        'ΔU = q + w = −150 J + 547 J = <strong>+397 J</strong>.',
      ]],
      ['h', 'Coffee-cup calorimetry'],
      ['p', 'At constant pressure the solution gains what the reaction loses: <strong>q_reaction = −q_solution = −(m_soln c_soln ΔT)</strong>.'],
      ['ex', 'A neutralisation in a coffee cup', '250 g of solution rises from 24.5 °C to 31.8 °C. Find q_solution and q_reaction.', [
        'ΔT = 31.8 − 24.5 = +7.3 °C.',
        'q_solution = (250)(4.184)(7.3) = +7,636 J ≈ <strong>+7.64 kJ</strong>.',
        'q_reaction = −q_solution = <strong>−7.64 kJ</strong>, so the reaction is exothermic.',
      ]],
      ['w', 'calorimetry'],
      chk('A gas is compressed from 8.0 L to 3.5 L against 1.20 atm. How much work is done?', ['+547 J', '−547 J', '+5.4 J', '−456 J'], 0, 'w = −PΔV = −(1.20)(−4.5) L·atm = +5.4 L·atm = +547 J.'),
    ] },
    { title: 'Enthalpy, thermochemical equations and Hess’s law', blocks: [
      ['p', 'At constant pressure, <strong>ΔH = q_p = H_products − H_reactants</strong>. Exothermic reactions have ΔH &lt; 0; endothermic reactions have ΔH &gt; 0.'],
      ['p', 'Enthalpy is an <strong>extensive</strong> property, so it scales with the amount of reaction.'],
      ['table', ['Change to the equation', 'Effect on ΔH', 'Example'], [
        ['Multiply coefficients by k', 'Multiply ΔH by k', '3 × CH₄ combustion: 3(−890) = −2670 kJ'],
        ['Reverse the equation', 'Change the sign of ΔH', 'CaCO₃ → CaO + CO₂ is +178 kJ; reverse is −178 kJ'],
      ]],
      ['h', 'Hess’s law'],
      ['p', 'Because enthalpy is a state function, the enthalpy change of a reaction that is the sum of several steps equals the <strong>sum of the step enthalpies</strong>, regardless of the route.'],
      ['ex', 'Carbon monoxide formation', 'Find ΔH for C(s) + ½O₂(g) → CO(g) given C + O₂ → CO₂ (ΔH = −394 kJ) and CO + ½O₂ → CO₂ (ΔH = −283 kJ).', [
        'Reverse the second equation: CO₂ → CO + ½O₂, ΔH = +283 kJ.',
        'Add it to the first so CO₂ cancels.',
        'ΔH = −394 + 283 = <strong>−111 kJ</strong>.',
      ]],
      chk('Given the two combustion equations above, what is ΔH for C + ½O₂ → CO?', ['−111 kJ', '−677 kJ', '+111 kJ', '+677 kJ'], 0, 'Reverse the CO combustion step and add: −394 + 283 = −111 kJ.'),
    ] },
    { title: 'Bond energies and reaction enthalpy estimation', blocks: [
      ['p', 'Breaking bonds requires energy (endothermic) and forming bonds releases energy (exothermic). We estimate <strong>ΔH ≈ ΣE_bonds broken − ΣE_bonds formed</strong>.'],
      ['table', ['Bond', 'kJ/mol', 'Bond', 'kJ/mol'], [
        ['H–H', '436', 'O–H', '463'],
        ['H–Cl', '431', 'O=O', '498'],
        ['Cl–Cl', '242', 'C–O', '358'],
        ['C–H', '413', 'C=O', '799'],
        ['C–C', '347', 'N–H', '391'],
        ['C=C', '614', 'N–N', '163'],
        ['C≡C', '839', 'N≡N', '945'],
      ]],
      ['ex', 'Methane combustion estimate', 'Estimate ΔH for CH₄ + 2O₂ → CO₂ + 2H₂O.', [
        'Bonds broken: 4(C–H) + 2(O=O) = 4(413) + 2(498) = 2648 kJ.',
        'Bonds formed: 2(C=O) + 4(O–H) = 2(799) + 4(463) = 3450 kJ.',
        'ΔH ≈ 2648 − 3450 = <strong>−802 kJ/mol</strong>, exothermic.',
      ]],
      ['note', 'Bond energies are averages, so this method estimates rather than measures ΔH. It works best for gas-phase reactions.'],
      chk('In the bond-energy estimate, forming new bonds is:', ['Endothermic (energy absorbed)', 'Exothermic (energy released)', 'Always zero', 'The same as breaking them'], 1, 'Forming bonds releases energy, which is why the formed-bond term is subtracted.'),
    ] },
    { title: 'Dynamic chemical equilibrium, Q vs. K and Le Chatelier’s principle', blocks: [
      ['p', 'At <strong>dynamic equilibrium</strong> the forward and reverse rates are equal and concentrations stay constant. For aA + bB ⇌ cC + dD: <strong>K_c = [C]ᶜ[D]ᵈ / ([A]ᵃ[B]ᵇ)</strong>. Pure solids and liquids are omitted.'],
      ['table', ['Condition', 'Meaning', 'Direction of change'], [
        ['Q &lt; K', 'Too little product', 'Shifts right, toward products'],
        ['Q = K', 'At equilibrium', 'No net change'],
        ['Q &gt; K', 'Too much product', 'Shifts left, toward reactants'],
      ]],
      ['h', 'Le Chatelier’s principle'],
      ['table', ['Stress', 'Response', 'Effect on K'], [
        ['Add reactant or remove product', 'Shifts right', 'K unchanged'],
        ['Increase pressure / decrease volume', 'Shifts toward fewer gas moles', 'K unchanged'],
        ['Increase temperature', 'Shifts in endothermic direction', 'K increases if ΔH &gt; 0; decreases if ΔH &lt; 0'],
        ['Add a catalyst', 'No shift; both rates increase', 'K unchanged'],
      ]],
      ['ex', 'Heating an exothermic equilibrium', 'For an exothermic reaction at equilibrium, what happens when temperature is raised?', [
        'Treat heat as a product of an exothermic reaction.',
        'Adding heat shifts the system in the endothermic direction, which is left toward reactants.',
        'Because the forward reaction is exothermic, <strong>K decreases</strong>.',
      ]],
      chk('For an exothermic equilibrium reaction, what happens when temperature is increased?', ['Shifts left toward reactants and K decreases', 'Shifts right toward products and K increases', 'No shift occurs', 'Only the catalyst changes K'], 0, 'Heat behaves like a product; adding it shifts left and lowers K for an exothermic reaction.'),
    ] },
  ],
  tools: {
    'calc-1': tool('Heat and temperature change', 'heatq', 'Solve q = m c ΔT for heat, mass, specific heat or temperature change.'),
    'calc-2': tool('Calorimetry', 'calorimetry', 'Coffee-cup and bomb calorimeters, and mixing a hot and a cool object.'),
    'calc-3': tool('Heating curve of water', 'heatcurve', 'The heat needed to take water through melting, warming and boiling, step by step.'),
    'calc-4': tool('Hess’s law', 'hess', 'Give the target reaction and the reactions you know. The tool finds how to combine them and adds up ΔH.'),
    'calc-5': tool('Enthalpy of reaction from formation enthalpies', 'enthalpyf', 'Type a balanced equation. ΔH° = ΣΔHf°(products) − ΣΔHf°(reactants).'),
    'calc-6': tool('Free energy and spontaneity', 'gibbs', 'ΔG = ΔH − TΔS, the crossover temperature, and K.'),
    'calc-7': tool('Equilibrium constant, Q and Kₚ/Kᶜ', 'kq', 'Write the K expression, find K from equilibrium amounts, compare Q with K, or convert Kₚ and Kᶜ.'),
    'calc-8': tool('ICE table solver', 'ice', 'Solve for the equilibrium amounts from the starting amounts and K, or find K from one equilibrium amount.'),
    'calc-9': tool('Le Chatelier’s principle', 'lechat', 'Pick a stress and see which way the equilibrium shifts, and why.'),
  },
  quiz: [
    { q: 'A system absorbs 560 J of heat and does 150 J of work on the surroundings. What is ΔU?', options: ['+410 J', '+710 J', '−410 J', '−710 J'], answer: 0, why: 'q = +560 J and w = −150 J, so ΔU = +410 J.' },
    { q: 'A gas is compressed from 8.0 L to 3.5 L against 1.20 atm (1 L·atm = 101.3 J). How much work is done?', options: ['+547 J', '−547 J', '+5.4 J', '−456 J'], answer: 0, why: 'w = −PΔV = +5.4 L·atm = +547 J.' },
    { q: 'Given C + O₂ → CO₂ (−394 kJ) and CO + ½O₂ → CO₂ (−283 kJ), what is ΔH for C + ½O₂ → CO?', options: ['−111 kJ', '−677 kJ', '+111 kJ', '+677 kJ'], answer: 0, why: 'Reverse the second equation and add: −394 + 283 = −111 kJ.' },
    { q: 'For an exothermic equilibrium reaction, what happens when temperature is increased?', options: ['Equilibrium shifts left toward reactants and K decreases', 'Equilibrium shifts right toward products and K increases', 'No shift occurs', 'Only the catalyst changes K'], answer: 0, why: 'Heat acts like a product; adding it shifts left and lowers K.' },
    { q: 'A reaction raises 250 g of solution from 24.5 °C to 31.8 °C. What is q_reaction?', options: ['+7.64 kJ (endothermic)', '−7.64 kJ (exothermic)', '0 kJ', '+7636 kJ'], answer: 1, why: 'q_solution = +7.64 kJ, so q_reaction = −q_solution = −7.64 kJ.' },
    { q: 'Which expression estimates reaction enthalpy from bond energies?', options: ['ΔH ≈ ΣE formed − ΣE broken', 'ΔH ≈ ΣE broken − ΣE formed', 'ΔH ≈ ΣE broken + ΣE formed', 'ΔH ≈ PΔV'], answer: 1, why: 'Breaking absorbs energy and forming releases it, so ΔH ≈ broken − formed.' },
  ],
  reference: {
    head: ['Equation', 'Meaning'],
    terms: [
      ['State function', 'Depends only on initial and final states (U, H, P, V, T).'],
      ['Path function', 'Depends on the route taken (q, w).'],
      ['System', 'The part of the universe being studied.'],
      ['Surroundings', 'Everything outside the system boundary.'],
      ['Enthalpy', 'Heat transferred at constant pressure, ΔH = q_p.'],
      ['Le Chatelier', 'A system at equilibrium shifts to oppose an applied stress.'],
    ],
    formulas: [
      ['First Law', 'ΔU = q + w'],
      ['Sensible heat', 'q = m c ΔT = C ΔT'],
      ['PV work', 'w = −PΔV (1 L·atm = 101.3 J)'],
      ['Calorimetry', 'q_reaction = −q_solution'],
      ['Bond energies', 'ΔH ≈ ΣE broken − ΣE formed'],
      ['Equilibrium', 'K_c = [C]ᶜ[D]ᵈ / ([A]ᵃ[B]ᵇ)'],
    ],
  },
};

export const ELECTRO = {
  lessons: [
    { title: 'Redox reactions and oxidation numbers', blocks: [
      ['p', '<strong>Oxidation Is Loss</strong> (OIL) and <strong>Reduction Is Gain</strong> (RIG) of electrons. Oxidation raises the oxidation number; reduction lowers it.'],
      ['table', ['Agent', 'What it does', 'What happens to it'], [
        ['Oxidizing agent', 'Accepts electrons', 'Gets reduced'],
        ['Reducing agent', 'Donates electrons', 'Gets oxidized'],
      ]],
      ['h', 'Five rules for assigning oxidation numbers'],
      ['list', [
        'Free uncombined elements have oxidation number 0 (Zn(s), O₂(g), Fe(s)).',
        'A monatomic ion equals its charge (Fe³⁺ = +3, Cl⁻ = −1).',
        'Oxygen is usually −2, but −1 in peroxides such as H₂O₂ and +2 in OF₂.',
        'Hydrogen is +1 with nonmetals, −1 in metal hydrides such as NaH.',
        'The numbers sum to 0 for a neutral compound or to the ion charge for a polyatomic ion.',
      ]],
      ['ex', 'Worked oxidation numbers', 'Find the highlighted oxidation numbers in MnO₄⁻, Cr₂O₇²⁻, H₂O₂ and OF₂.', [
        'MnO₄⁻: x + 4(−2) = −1, so Mn = <strong>+7</strong>.',
        'Cr₂O₇²⁻: 2x + 7(−2) = −2, so Cr = <strong>+6</strong>.',
        'H₂O₂ is a peroxide, so O = <strong>−1</strong>, not −2.',
        'OF₂: x + 2(−1) = 0, so O = <strong>+2</strong> because fluorine is always −1.',
      ]],
      chk('What is the oxidation number of oxygen in hydrogen peroxide, H₂O₂?', ['−2', '−1', '+1', '+2'], 1, 'H₂O₂ is a peroxide, so each oxygen is −1.'),
    ] },
    { title: 'Balancing redox equations in acidic solution', blocks: [
      ['p', 'The <strong>half-reaction method</strong> splits a redox reaction into oxidation and reduction parts, balances each, then recombines them.'],
      ['list', [
        'Split the net ionic equation into oxidation and reduction half-reactions.',
        'Balance every element except O and H.',
        'Balance O with H₂O, then H with H⁺.',
        'Balance charge by adding electrons (e⁻).',
        'Multiply to equalise electrons, add the halves and cancel common species.',
      ]],
      ['ex', 'Permanganate and iron(II)', 'Balance MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺ in acid.', [
        'Reduction: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O.',
        'Oxidation × 5: 5Fe²⁺ → 5Fe³⁺ + 5e⁻.',
        'Add: <strong>MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 4H₂O + 5Fe³⁺</strong>. Charge: left +17, right +17.',
      ]],
      ['ex', 'Dichromate and iodide', 'Balance Cr₂O₇²⁻ + I⁻ → Cr³⁺ + I₂ in acid.', [
        'Reduction: Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O.',
        'Oxidation: 2I⁻ → I₂ + 2e⁻, multiplied by 3.',
        'Add: <strong>Cr₂O₇²⁻ + 14H⁺ + 6I⁻ → 2Cr³⁺ + 3I₂ + 7H₂O</strong>.',
      ]],
      ['w', 'redoxbal'],
      chk('In acidic solution, oxygen in a half-reaction is balanced by adding:', ['H⁺', 'H₂O', 'OH⁻', 'e⁻'], 1, 'Add H₂O to balance oxygen first; then use H⁺ to balance hydrogen.'),
    ] },
    { title: 'Balancing redox equations in basic solution', blocks: [
      ['p', 'For basic solution, balance as if acidic and then convert every H⁺ into water using OH⁻.'],
      ['list', [
        'Complete all acidic-solution steps first.',
        'Add one OH⁻ to <em>both</em> sides for every H⁺ present.',
        'Combine H⁺ + OH⁻ → H₂O on the side that contained H⁺.',
        'Cancel excess H₂O on both sides; no H⁺ should remain.',
      ]],
      ['ex', 'Permanganate and iodide in base', 'Balance MnO₄⁻ + I⁻ → MnO₂ + I₂ in basic solution.', [
        'Reduction × 2: 2MnO₄⁻ + 4H₂O + 6e⁻ → 2MnO₂ + 8OH⁻.',
        'Oxidation × 3: 6I⁻ → 3I₂ + 6e⁻.',
        'Add: <strong>2MnO₄⁻ + 6I⁻ + 4H₂O → 2MnO₂ + 3I₂ + 8OH⁻</strong>.',
      ]],
      ['ex', 'Permanganate and sulfite in base', 'Balance MnO₄⁻ + SO₃²⁻ → MnO₂ + SO₄²⁻ in basic solution.', [
        'Sulfur goes from +4 to +6 (2e⁻); manganese from +7 to +4 (3e⁻).',
        'Use 2 permanganate ions and 3 sulfite ions for 6 electrons.',
        'Result: <strong>2MnO₄⁻ + 3SO₃²⁻ + H₂O → 2MnO₂ + 3SO₄²⁻ + 2OH⁻</strong>.',
      ]],
      chk('After balancing a half-reaction in acid, what is added to convert it to basic solution?', ['One OH⁻ to each side per H⁺', 'One H⁺ to each side', 'Extra electrons', 'More water only'], 0, 'Add OH⁻ to both sides for each H⁺, then combine H⁺ + OH⁻ into H₂O.'),
    ] },
    { title: 'Galvanic vs. electrolytic cells and salt bridges', blocks: [
      ['table', ['Feature', 'Galvanic (voltaic)', 'Electrolytic'], [
        ['Energy conversion', 'Chemical → electrical', 'Electrical → chemical'],
        ['Spontaneity', 'Spontaneous, E_cell &gt; 0', 'Driven by an external supply'],
        ['Anode sign', 'Negative (−)', 'Positive (+)'],
        ['Cathode sign', 'Positive (+)', 'Negative (−)'],
      ]],
      ['note', '<strong>Universal rule:</strong> oxidation always occurs at the anode and reduction always at the cathode.'],
      ['p', 'Daniell cell notation: <strong>Zn(s) | Zn²⁺(aq) ‖ Cu²⁺(aq) | Cu(s)</strong>. A single line is a phase boundary; a double line is the salt bridge.'],
      ['p', 'The salt bridge prevents charge buildup: <strong>anions migrate toward the anode</strong> to balance newly formed Zn²⁺, while cations migrate toward the cathode to replace consumed Cu²⁺. Electrons travel through the external wire only.'],
      ['p', 'In molten NaCl electrolysis, Na⁺ is reduced to sodium metal at the cathode and Cl⁻ is oxidised to chlorine gas at the anode.'],
      chk('In a galvanic cell, which way do anions in the salt bridge migrate?', ['Toward the anode compartment', 'Toward the cathode compartment', 'Through the external wire', 'They remain stationary'], 0, 'Anions move toward the anode to balance positive ions produced by oxidation.'),
    ] },
    { title: 'Standard reduction potentials and cell voltage', blocks: [
      ['p', '<strong>E°_cell = E°_cathode − E°_anode</strong>, using standard reduction potentials. The half-reaction with the more positive E°_red is the cathode.'],
      ['note', 'E°_red is an <strong>intensive</strong> property (J/C). <strong>Never multiply</strong> it when a half-reaction is scaled to balance electrons.'],
      ['table', ['Half-reaction', 'E°_red (V)'], [
        ['Ag⁺ + e⁻ → Ag', '+0.80'],
        ['Cu²⁺ + 2e⁻ → Cu', '+0.34'],
        ['Fe²⁺ + 2e⁻ → Fe', '−0.44'],
        ['Zn²⁺ + 2e⁻ → Zn', '−0.76'],
        ['Al³⁺ + 3e⁻ → Al', '−1.66'],
      ]],
      ['ex', 'Four standard cells', 'Calculate E°_cell for Zn/Cu, Fe/Cu, Cu/Ag and Al/Cu.', [
        'Zn/Cu: +0.34 − (−0.76) = <strong>+1.10 V</strong>.',
        'Fe/Cu: +0.34 − (−0.44) = <strong>+0.78 V</strong>.',
        'Cu/Ag: +0.80 − (+0.34) = <strong>+0.46 V</strong>.',
        'Al/Cu: +0.34 − (−1.66) = <strong>+2.00 V</strong> (n = 6 electrons).',
      ]],
      chk('Given E°(Ag⁺/Ag) = +0.80 V and E°(Cu²⁺/Cu) = +0.34 V, what is E°cell for Cu + 2Ag⁺ → Cu²⁺ + 2Ag?', ['+0.46 V', '+1.26 V', '+1.14 V', '−0.46 V'], 0, 'Cathode Ag (+0.80) minus anode Cu (+0.34) gives +0.46 V.'),
    ] },
    { title: 'Cell potential, Gibbs free energy and electrolysis', blocks: [
      ['p', '<strong>ΔG° = −n F E°_cell</strong>, with F = 96,485 C mol⁻¹. A positive E°_cell gives a negative ΔG° and a spontaneous cell.'],
      ['table', ['E°_cell', 'ΔG°', 'Spontaneity'], [
        ['&gt; 0', '&lt; 0', 'Forward reaction spontaneous'],
        ['= 0', '= 0', 'Equilibrium'],
        ['&lt; 0', '&gt; 0', 'Nonspontaneous; reverse favoured'],
      ]],
      ['ex', 'Free energy of the Al/Cu cell', 'Find ΔG° for the Al/Cu cell with n = 6 and E° = +2.00 V.', [
        'ΔG° = −(6)(96,485 C/mol)(2.00 V).',
        'ΔG° = −1,157,820 J/mol ≈ <strong>−1.16 × 10³ kJ/mol</strong>.',
      ]],
      ['h', 'Non-standard conditions and electrolysis'],
      ['p', 'The Nernst equation at 25 °C is <strong>E_cell = E°_cell − (0.0592 V / n) log₁₀ Q</strong>. For electrolysis, Q_charge = It, n_e = It/F, and the deposited mass is m = ItM/(nF).'],
      chk('For a spontaneous galvanic cell, the sign of ΔG° is:', ['Positive', 'Negative', 'Zero', 'Undefined'], 1, 'E°cell > 0 makes ΔG° = −nFE°cell negative.'),
    ] },
  ],
  tools: {
    'calc-1': tool('Oxidation numbers', 'oxnum', 'Assign oxidation numbers to the atoms in any list of species.'),
    'calc-2': tool('Redox equation balancer', 'redoxbal', 'Balance a redox equation by the half-reaction method, in acidic or basic solution, with every step shown.'),
    'calc-3': tool('Cell potential, ΔG° and K', 'cellpot', 'Pick two half-reactions: get the cathode, anode, E°cell, ΔG°, K and the cell notation.'),
    'calc-4': tool('Nernst equation', 'nernst', 'E of a cell when concentrations are not 1 M.'),
    'calc-5': tool('Electrolysis (Faraday’s law)', 'electrolysis', 'Mass, time or current for an electrolysis, and the volume of any gas produced.'),
  },
  quiz: [
    { q: 'Given E°(Ag⁺/Ag) = +0.80 V and E°(Cu²⁺/Cu) = +0.34 V, what is E°cell for Cu + 2Ag⁺ → Cu²⁺ + 2Ag?', options: ['+0.46 V', '+1.26 V', '+1.14 V', '−0.46 V'], answer: 0, why: 'Cathode Ag (+0.80) minus anode Cu (+0.34) = +0.46 V.' },
    { q: 'In a galvanic cell, which way do anions in the salt bridge migrate?', options: ['Toward the anode compartment', 'Toward the cathode compartment', 'Through the external wire', 'They remain stationary'], answer: 0, why: 'Anions move toward the anode to balance positive ions formed there.' },
    { q: 'Oxidation always occurs at the:', options: ['Anode', 'Cathode', 'Salt bridge', 'External wire'], answer: 0, why: 'Anode = oxidation and cathode = reduction in every electrochemical cell.' },
    { q: 'What is the oxidation number of manganese in MnO₄⁻?', options: ['+4', '+6', '+7', '−7'], answer: 2, why: 'x + 4(−2) = −1 gives x = +7.' },
    { q: 'When balancing a redox half-reaction in acid, hydrogen is balanced with:', options: ['OH⁻', 'H⁺', 'e⁻', 'H₂O'], answer: 1, why: 'Balance O with H₂O first, then H with H⁺.' },
    { q: 'A positive E°cell means ΔG° is: ', options: ['Positive and nonspontaneous', 'Negative and spontaneous', 'Zero', 'Unchanged'], answer: 1, why: 'ΔG° = −nFE°cell, so positive E°cell gives negative ΔG°.' },
  ],
  reference: {
    head: ['Equation', 'Meaning'],
    terms: [
      ['Oxidation', 'Loss of electrons; oxidation number increases at the anode.'],
      ['Reduction', 'Gain of electrons; oxidation number decreases at the cathode.'],
      ['Oxidizing agent', 'Accepts electrons and is reduced.'],
      ['Salt bridge', 'Completes the circuit and maintains charge neutrality.'],
      ['Galvanic cell', 'Spontaneous chemical reaction producing electrical energy.'],
      ['Electrolytic cell', 'External electricity driving a nonspontaneous reaction.'],
    ],
    formulas: [
      ['Cell voltage', 'E°cell = E°cathode − E°anode'],
      ['Free energy', 'ΔG° = −nFE°cell'],
      ['Nernst, 25 °C', 'E = E° − (0.0592/n) log Q'],
      ['Charge', 'Q = I t'],
      ['Electrolysis mass', 'm = I t M / (n F)'],
    ],
  },
};
