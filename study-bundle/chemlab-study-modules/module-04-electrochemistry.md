# Module 4: Electrochemistry

## 1. Redox Reactions & Oxidation Numbers
- **Core Concept (`OIL RIG`):**
  - **Oxidation:** Loss of electrons (**O**xidation **I**s **L**oss); oxidation number **increases**.
  - **Reduction:** Gain of electrons (**R**eduction **I**s **G**ain); oxidation number **decreases**.
  - **Oxidizing agent:** Accepts electrons and **gets reduced**.
  - **Reducing agent:** Donates electrons and **gets oxidized**.
- **5 Oxidation Number Assignment Rules:**
  1. Free uncombined element $= 0$ (e.g., $\text{Zn}(s) = 0$, $\text{O}_2(g) = 0$, $\text{Fe}(s) = 0$).
  2. Monatomic ion $=$ ion charge (e.g., $\text{Fe}^{3+} = +3$, $\text{Cl}^- = -1$).
  3. Oxygen is usually $-2$ (exceptions: $-1$ in peroxides like $\text{H}_2\text{O}_2$; $+2$ in $\text{OF}_2$).
  4. Hydrogen is $+1$ with nonmetals (and $-1$ in metal hydrides like $\text{NaH}$).
  5. The sum of oxidation numbers equals $0$ for a neutral compound or the overall charge for a polyatomic ion (e.g., in $\text{MnO}_4^-$: $x + 4(-2) = -1 \Rightarrow \text{Mn} = +7$).

---

## 2. Balancing Redox Equations in Acidic Solution (Half-Reaction Method)
1. Split the net ionic equation into separate **oxidation** and **reduction** half-reactions.
2. Balance all elements **other than $\text{O}$ and $\text{H}$**.
3. Balance **$\text{O}$** by adding $\text{H}_2\text{O}$; balance **$\text{H}$** by adding $\text{H}^+$.
4. Balance **net charge** on each side by adding electrons ($e^-$).
5. Multiply half-reactions by integers to equalize $e^-$ transferred, add them together, and cancel identical species.

### Worked Example 1 (Acidic): $\text{MnO}_4^- + \text{Fe}^{2+} \rightarrow \text{Mn}^{2+} + \text{Fe}^{3+}$
- **Reduction:** $\text{MnO}_4^- + 8\text{H}^+ + 5e^- \rightarrow \text{Mn}^{2+} + 4\text{H}_2\text{O}$
- **Oxidation ($\times 5$):** $5\text{Fe}^{2+} \rightarrow 5\text{Fe}^{3+} + 5e^-$
- **Balanced Net Equation:**
  $$\text{MnO}_4^- + 8\text{H}^+ + 5\text{Fe}^{2+} \rightarrow \text{Mn}^{2+} + 4\text{H}_2\text{O} + 5\text{Fe}^{3+}$$
  *(Charge check: Left $= -1 + 8 + 10 = +17$; Right $= +2 + 15 = +17$.)*

---

## 3. Balancing Redox Equations in Basic Solution
1. Complete all steps as if in **acidic solution**.
2. Add one $\text{OH}^-$ to **both sides** for every $\text{H}^+$ present.
3. Combine $\text{H}^+ + \text{OH}^- \rightarrow \text{H}_2\text{O}$ on the side with $\text{H}^+$.
4. Cancel excess $\text{H}_2\text{O}$ appearing on both sides (zero $\text{H}^+$ should remain).

### Worked Example 2 (Basic): $\text{MnO}_4^- + \text{I}^- \rightarrow \text{MnO}_2 + \text{I}_2$
- **Reduction in basic media:** $\text{MnO}_4^- + 2\text{H}_2\text{O} + 3e^- \rightarrow \text{MnO}_2 + 4\text{OH}^-$ (multiply by $2$)
- **Oxidation:** $2\text{I}^- \rightarrow \text{I}_2 + 2e^-$ (multiply by $3$)
- **Balanced Net Equation:**
  $$2\text{MnO}_4^- + 6\text{I}^- + 4\text{H}_2\text{O} \rightarrow 2\text{MnO}_2 + 3\text{I}_2 + 8\text{OH}^-$$

---

## 4. Galvanic vs. Electrolytic Cells & Salt Bridges

| Feature | Galvanic (Voltaic) Cell | Electrolytic Cell |
| :--- | :--- | :--- |
| **Energy Conversion** | Chemical $\rightarrow$ Electrical | Electrical $\rightarrow$ Chemical |
| **Reaction Spontaneity** | Spontaneous ($\Delta G < 0$, $E_{\text{cell}} > 0$) | Nonspontaneous ($\Delta G > 0$, driven by external power supply) |
| **Anode (Oxidation)** | **Negative ($-$)** terminal | **Positive ($+$)** terminal |
| **Cathode (Reduction)** | **Positive ($+$)** terminal | **Negative ($-$)** terminal |
| **Universal Rule** | **Oxidation always occurs at the anode; reduction always occurs at the cathode.** |

- **Cell Notation (Daniell Cell):**
  $$\text{Zn}(s) \mid \text{Zn}^{2+}(aq) \parallel \text{Cu}^{2+}(aq) \mid \text{Cu}(s)$$
  - Single vertical line ($\mid$): phase boundary; double vertical line ($\parallel$): **salt bridge**.
- **Role of the Salt Bridge:** Prevents charge buildup by allowing spectator ions to migrate—**anions move toward the anode** (to balance newly formed $\text{Zn}^{2+}$), while **cations move toward the cathode** (to replace consumed $\text{Cu}^{2+}$). Electrons travel strictly through the external wire from anode to cathode.

---

## 5. Standard Reduction Potentials & Cell Voltage ($E^\circ_{\text{cell}}$)
$$E^\circ_{\text{cell}} = E^\circ_{\text{cathode}} - E^\circ_{\text{anode}}$$
- **Critical Rule:** Standard reduction potential ($E^\circ_{\text{red}}$) is an **intensive property** (joules per coulomb). **Never multiply $E^\circ_{\text{red}}$** when multiplying a half-reaction to balance electrons!

### Worked Example 3: Aluminum–Copper Galvanic Cell
Given: $\text{Al}^{3+} + 3e^- \rightarrow \text{Al}$ ($E^\circ_{\text{red}} = -1.66\text{ V}$) and $\text{Cu}^{2+} + 2e^- \rightarrow \text{Cu}$ ($E^\circ_{\text{red}} = +0.34\text{ V}$):
- Copper has the more positive reduction potential $\rightarrow$ **Cathode**; Aluminum $\rightarrow$ **Anode**.
- Balanced reaction ($n = 6\text{ mol } e^-$): $2\text{Al}(s) + 3\text{Cu}^{2+}(aq) \rightarrow 2\text{Al}^{3+}(aq) + 3\text{Cu}(s)$
- Standard Cell Potential:
  $$E^\circ_{\text{cell}} = +0.34\text{ V} - (-1.66\text{ V}) = \mathbf{+2.00\text{ V}}$$

---

## 6. Gibbs Free Energy ($\Delta G^\circ$), Nernst Equation & Electrolysis
- **Relationship Between $E^\circ_{\text{cell}}$ and $\Delta G^\circ$:**
  $$\Delta G^\circ = -n F E^\circ_{\text{cell}} \quad (F = 96,485\text{ C/mol } e^-)$$
  - $E^\circ_{\text{cell}} > 0 \Rightarrow \Delta G^\circ < 0$ (**spontaneous** forward reaction)
  - $E^\circ_{\text{cell}} = 0 \Rightarrow \Delta G^\circ = 0$ (**equilibrium**)
  - $E^\circ_{\text{cell}} < 0 \Rightarrow \Delta G^\circ > 0$ (**nonspontaneous**; reverse direction favored)
- **For the $\text{Al}/\text{Cu}$ Cell ($n = 6$, $E^\circ_{\text{cell}} = +2.00\text{ V}$):**
  $$\Delta G^\circ = -(6)(96,485\text{ C/mol})(2.00\text{ V}) = -1,157,820\text{ J/mol} \approx \mathbf{-1.16 \times 10^3\text{ kJ/mol}}$$
- **Nernst Equation (Non-Standard Concentrations at $25^\circ\text{C}$):**
  $$E_{\text{cell}} = E^\circ_{\text{cell}} - \frac{RT}{nF}\ln Q = E^\circ_{\text{cell}} - \frac{0.0592\text{ V}}{n}\log_{10} Q$$
- **Faraday's Law of Electrolysis:**
  $$Q_{\text{charge}} = I \cdot t \qquad n_{e^-} = \frac{I \cdot t}{F} \qquad m_{\text{deposited}} = \frac{I \cdot t \cdot M}{n \cdot F}$$
