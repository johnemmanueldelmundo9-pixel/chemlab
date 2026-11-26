# Module 3: Thermochemistry & Equilibrium

## 1. Systems, Surroundings & State vs. Path Functions
- **Thermochemistry** is the study of heat changes occurring during chemical reactions and physical phase changes (crucial in fuels, batteries, engines, refrigeration, and chemical manufacturing).
- **System, Surroundings & Universe:**
  - **System:** The specific part of the universe being studied (e.g., reactants in a beaker).
  - **Surroundings:** Everything outside the thermodynamic boundary that can exchange heat or work with the system.
  - **Universe:** $\text{System} + \text{Surroundings}$ (total energy is conserved).

| System Type | Matter Exchange | Energy Exchange | Engineering Example |
| :--- | :--- | :--- | :--- |
| **Open System** | Yes | Yes | Boiling water in an open beaker or pot |
| **Closed System** | No | Yes | Sealed gas cylinder or bottle warming in sunlight |
| **Isolated System** | No | No (ideally) | Well-insulated bomb calorimeter or vacuum thermos |

- **State Functions vs. Path Functions:**
  - **State functions** depend **only on initial and final states**, independent of the path taken: internal energy ($U$), enthalpy ($H$), pressure ($P$), volume ($V$), temperature ($T$).
  - **Path functions** depend on **how** the change occurs and are not stored properties: heat ($q$) and work ($w$).

---

## 2. First Law of Thermodynamics, Heat ($q$) & Pressure-Volume Work ($w$)
- **First Law of Thermodynamics (Chemistry Convention):**
  $$\Delta U = q + w$$
- **Sign Conventions:**

| Quantity | Positive ($+$) | Negative ($-$) |
| :--- | :--- | :--- |
| **Heat ($q$)** | System **absorbs** heat (endothermic, e.g., ice melting) | System **releases** heat (exothermic, e.g., steam condensing) |
| **Work ($w$)** | Work done **on** system (gas compression, $\Delta V < 0$) | Work done **by** system (gas expansion, $\Delta V > 0$) |

- **Heat Formulas:**
  $$q = m \cdot c \cdot \Delta T \qquad \text{and} \qquad q = C \cdot \Delta T$$
  where $m$ is mass ($\text{g}$), $c$ is specific heat capacity ($\text{J/g}\cdot^\circ\text{C}$, $4.184\text{ J/g}\cdot^\circ\text{C}$ for water), $C$ is total heat capacity ($\text{J/}^\circ\text{C}$), and $\Delta T = T_{\text{final}} - T_{\text{initial}}$.
- **Pressure-Volume Work Formula:**
  $$w = -P \Delta V \qquad (1\text{ L}\cdot\text{atm} = 101.3\text{ J})$$

### Worked Example 1: Specific Heat & Cooling
**Problem:** A $350\text{ g}$ sample of water ($c = 4.184\text{ J/g}\cdot^\circ\text{C}$) cools from $82^\circ\text{C}$ to $30^\circ\text{C}$. Find the heat transferred.
**Solution:**
$$\Delta T = 30 - 82 = -52^\circ\text{C}$$
$$q = (350\text{ g})(4.184\text{ J/g}\cdot^\circ\text{C})(-52^\circ\text{C}) = -76,148.8\text{ J} \approx \mathbf{-76.1\text{ kJ}}$$
*(Negative sign indicates water lost $76.1\text{ kJ}$ of heat to the surroundings.)*

### Worked Example 2: Pressure-Volume Work & First Law
**Problem:** A gas is compressed from $8.0\text{ L}$ to $3.5\text{ L}$ against a constant external pressure of $1.20\text{ atm}$. Calculate $w$ in joules. If the gas also releases $150\text{ J}$ of heat, find $\Delta U$.
**Solution:**
$$\Delta V = 3.5 - 8.0 = -4.5\text{ L}$$
$$w = -P\Delta V = -(1.20\text{ atm})(-4.5\text{ L}) = +5.4\text{ L}\cdot\text{atm} \times 101.3\text{ J/(L}\cdot\text{atm)} = \mathbf{+547\text{ J}}$$
$$\Delta U = q + w = -150\text{ J} + 547\text{ J} = \mathbf{+397\text{ J}}$$

---

## 3. Enthalpy ($\Delta H$), Thermochemical Equations & Calorimetry
- **Enthalpy ($H$):** At constant pressure, heat transfer equals the enthalpy change: $\Delta H = q_p = H_{\text{products}} - H_{\text{reactants}}$.
  - **Exothermic ($\Delta H < 0$):** Products have lower enthalpy than reactants; heat is released to surroundings (e.g., combustion).
  - **Endothermic ($\Delta H > 0$):** Products have higher enthalpy than reactants; heat is absorbed from surroundings (e.g., thermal decomposition of $\text{CaCO}_3$).
- **Manipulating Thermochemical Equations (Extensive Property):**
  - Multiplying coefficients by a factor $k$ multiplies $\Delta H$ by $k$ (e.g., $\text{CH}_4 + 2\text{O}_2 \rightarrow \text{CO}_2 + 2\text{H}_2\text{O}$, $\Delta H = -890\text{ kJ}$; burning $3\text{ mol CH}_4$ releases $3 \times (-890) = -2670\text{ kJ}$).
  - Reversing an equation flips the sign of $\Delta H$ (e.g., $\text{CaCO}_3 \rightarrow \text{CaO} + \text{CO}_2$, $\Delta H = +178\text{ kJ} \Rightarrow \text{CaO} + \text{CO}_2 \rightarrow \text{CaCO}_3$, $\Delta H = -178\text{ kJ}$).
- **Coffee-Cup Calorimetry:**
  $$q_{\text{reaction}} = -q_{\text{solution}} = -(m_{\text{soln}} \cdot c_{\text{soln}} \cdot \Delta T)$$

### Worked Example 3: Coffee-Cup Calorimeter
**Problem:** A reaction occurs in $250\text{ g}$ of aqueous solution ($c = 4.184\text{ J/g}\cdot^\circ\text{C}$), raising its temperature from $24.5^\circ\text{C}$ to $31.8^\circ\text{C}$. Find $q_{\text{solution}}$ and $q_{\text{reaction}}$.
**Solution:**
$$\Delta T = 31.8 - 24.5 = +7.3^\circ\text{C}$$
$$q_{\text{solution}} = (250\text{ g})(4.184\text{ J/g}\cdot^\circ\text{C})(7.3^\circ\text{C}) = +7,636\text{ J} \approx \mathbf{+7.64\text{ kJ}}$$
$$q_{\text{reaction}} = -q_{\text{solution}} = \mathbf{-7.64\text{ kJ}} \quad (\text{exothermic})$$

---

## 4. Hess's Law & Average Bond Energies
- **Hess's Law:** Because enthalpy is a state function, if a reaction is the sum of multiple steps, $\Delta H_{\text{overall}} = \sum \Delta H_{\text{steps}}$.

### Worked Example 4: Hess's Law
**Problem:** Find $\Delta H$ for $\text{C}(s) + \frac{1}{2}\text{O}_2(g) \rightarrow \text{CO}(g)$ given:
1. $\text{C}(s) + \text{O}_2(g) \rightarrow \text{CO}_2(g) \quad \Delta H_1 = -394\text{ kJ}$
2. $\text{CO}(g) + \frac{1}{2}\text{O}_2(g) \rightarrow \text{CO}_2(g) \quad \Delta H_2 = -283\text{ kJ}$
**Solution:** Reverse equation (2) ($\Delta H = +283\text{ kJ}$) and add to equation (1) so $\text{CO}_2$ cancels:
$$\Delta H = -394\text{ kJ} + 283\text{ kJ} = \mathbf{-111\text{ kJ}}$$

- **Estimating $\Delta H$ from Average Bond Energies:**
  Breaking bonds requires energy (endothermic), while forming bonds releases energy (exothermic):
  $$\Delta H \approx \sum E_{\text{bonds broken (reactants)}} - \sum E_{\text{bonds formed (products)}}$$

| Bond | Average Energy ($\text{kJ/mol}$) | Bond | Average Energy ($\text{kJ/mol}$) |
| :--- | :--- | :--- | :--- |
| $\text{H–H}$ | $436$ | $\text{O–H}$ | $463$ |
| $\text{H–Cl}$ | $431$ | $\text{O=O}$ | $498$ |
| $\text{Cl–Cl}$ | $242$ | $\text{C–O}$ | $358$ |
| $\text{C–H}$ | $413$ | $\text{C=O}$ | $799$ |
| $\text{C–C}$ | $347$ | $\text{N–H}$ | $391$ |
| $\text{C=C}$ | $614$ | $\text{N–N}$ | $163$ |
| $\text{C}\equiv\text{C}$ | $839$ | $\text{N}\equiv\text{N}$ | $945$ |

### Worked Example 5: Bond Energy Enthalpy Estimate
**Problem:** Estimate $\Delta H$ for $\text{CH}_4 + 2\text{O}_2 \rightarrow \text{CO}_2 + 2\text{H}_2\text{O}$.
**Solution:**
- **Bonds broken:** $4(\text{C–H}) + 2(\text{O=O}) = 4(413) + 2(498) = 1652 + 996 = 2648\text{ kJ}$
- **Bonds formed:** $2(\text{C=O}) + 4(\text{O–H}) = 2(799) + 4(463) = 1598 + 1852 = 3450\text{ kJ}$
- **Net $\Delta H$:** $\Delta H \approx 2648 - 3450 = \mathbf{-802\text{ kJ/mol}}$ (exothermic)

---

## 5. Chemical Equilibrium ($K_c$), Reaction Quotient ($Q$) & Le Chatelier's Principle
At **dynamic equilibrium**, forward and reverse reaction rates are equal and concentrations remain constant. For $a\text{A} + b\text{B} \rightleftharpoons c\text{C} + d\text{D}$:
$$K_c = \frac{[\text{C}]^c [\text{D}]^d}{[\text{A}]^a [\text{B}]^b}$$
*(Pure solids $(s)$ and pure liquids $(l)$ are omitted from $K_c$ and $K_p$ expressions.)*

- **Reaction Quotient ($Q$) vs. $K$:**
  - $Q < K \Rightarrow$ shifts **right ($\rightarrow$)** toward products.
  - $Q = K \Rightarrow$ at **equilibrium**.
  - $Q > K \Rightarrow$ shifts **left ($\leftarrow$)** toward reactants.
- **Le Chatelier's Principle Summary:**
  - Adding reactant or removing product shifts **right** ($K$ unchanged).
  - Increasing pressure (decreasing volume) shifts toward **fewer moles of gas** ($K$ unchanged).
  - Increasing temperature shifts in the **endothermic direction** ($K$ increases if $\Delta H > 0$; $K$ decreases if $\Delta H < 0$).
  - Adding a **catalyst** speeds up both directions equally with **no shift** and no change in $K$.
