# Module 2: Basic Chemical Concepts

## 1. Classifying Matter
**Matter** is anything that has mass and occupies space. It is classified by composition and whether physical methods can separate it:

| Category | Definition | Separation Method | Examples |
| :--- | :--- | :--- | :--- |
| **Element** | Pure substance made of only **one type of atom** | Cannot be broken down chemically or physically | Copper ($\text{Cu}$), Oxygen ($\text{O}_2$), Iron ($\text{Fe}$) |
| **Compound** | Pure substance of **two or more elements chemically bonded** in a fixed mass ratio | Requires a **chemical change** (electrolysis, thermal decomposition) | Water ($\text{H}_2\text{O}$), Sodium chloride ($\text{NaCl}$), Carbon dioxide ($\text{CO}_2$) |
| **Homogeneous Mixture (Solution)** | Uniform composition throughout; single visible phase | **Physical methods** (distillation, crystallization, chromatography) | Saltwater, brass alloy, clean air |
| **Heterogeneous Mixture** | Non-uniform composition; distinct visible boundaries/phases | **Physical methods** (filtration, decanting, magnetic separation) | Sand in water, oil and vinegar, granite |

---

## 2. States, Properties & Changes of Matter
- **States of Matter:**
  - **Solid:** Definite shape and definite volume; particles vibrate in fixed positions.
  - **Liquid:** Indefinite shape (takes container shape), definite volume; particles slide past one another.
  - **Gas:** Indefinite shape and indefinite volume (compressible); particles move rapidly with negligible intermolecular forces.
- **Physical vs. Chemical Properties & Changes:**
  - **Physical change:** Alters state or appearance without changing chemical formula (melting, boiling, dissolving, grinding).
  - **Chemical change:** Forms one or more new substances with new chemical bonds (rusting, combustion, acid-base neutralization, electrolysis).
- **Intensive vs. Extensive Properties:**
  - **Intensive** (independent of sample size): density ($\rho$), temperature ($T$), boiling point, specific heat ($c$), standard reduction potential ($E^\circ$).
  - **Extensive** (depends on sample size): mass ($m$), volume ($V$), enthalpy ($H$), total heat ($q$).

---

## 3. Measurement & SI Base Units
Engineering calculations rely on consistent SI units and metric prefixes:

| Quantity | SI Unit | Symbol | Common Engineering Conversions |
| :--- | :--- | :--- | :--- |
| Length | meter | $\text{m}$ | $1\text{ m} = 100\text{ cm} = 1000\text{ mm} = 10^9\text{ nm}$ |
| Mass | kilogram | $\text{kg}$ | $1\text{ kg} = 1000\text{ g} = 10^6\text{ mg}$ |
| Time | second | $\text{s}$ | $1\text{ min} = 60\text{ s}$; $1\text{ h} = 3600\text{ s}$ |
| Temperature | kelvin | $\text{K}$ | $T(\text{K}) = T(^\circ\text{C}) + 273.15$ |
| Amount of substance | mole | $\text{mol}$ | $1\text{ mol} = 6.022 \times 10^{23}\text{ entities}$ |
| Volume (derived) | cubic meter | $\text{m}^3$ | $1\text{ L} = 1\text{ dm}^3 = 1000\text{ mL} = 1000\text{ cm}^3$ |
| Pressure (derived) | pascal | $\text{Pa}$ | $1\text{ atm} = 101,325\text{ Pa} = 101.325\text{ kPa} = 760\text{ mmHg}$ |

---

## 4. Significant Figures, Accuracy & Precision
- **Accuracy:** How close a measured value is to the true/accepted value.
- **Precision:** How closely repeated measurements agree with one another.
- **Significant Figure Rules:**
  1. All non-zero digits ($1\text{–}9$) are significant.
  2. Captive zeros between non-zero digits are significant ($1005 \rightarrow 4\text{ sig figs}$).
  3. Leading zeros to the left of the first non-zero digit are **never** significant ($0.00420 \rightarrow 3\text{ sig figs}$).
  4. Trailing zeros are significant **only if a decimal point is shown** ($25.00 \rightarrow 4\text{ sig figs}$; $2500 \rightarrow 2\text{ sig figs}$).
- **Arithmetic Rules:**
  - **Multiplication / Division:** Round the final result to the **fewest significant figures** among the inputs.
  - **Addition / Subtraction:** Round the final result to the **fewest decimal places** among the inputs.

---

## 5. Dimensional Analysis, The Mole & Stoichiometry
- **Molar Mass ($M$):** Mass of $1\text{ mol}$ of a substance in $\text{g/mol}$ (numerically equal to atomic/formula mass in $\text{amu}$).
- **Core Mole Relationships:**
  $$n = \frac{m}{M} \qquad N = n \cdot N_A \quad (N_A = 6.022 \times 10^{23}\text{ mol}^{-1}) \qquad c = \frac{n}{V_{\text{solution (L)}}}$$
- **Dilution Formula:** $C_1 V_1 = C_2 V_2$

### Worked Example 1: Stoichiometry & Limiting Reactant
**Problem:** How many grams of $\text{CO}_2$ are produced when $32.0\text{ g}$ of methane ($\text{CH}_4$, $M = 16.04\text{ g/mol}$) burns completely in excess oxygen?
$$\text{CH}_4(g) + 2\text{O}_2(g) \rightarrow \text{CO}_2(g) + 2\text{H}_2\text{O}(g)$$
**Solution:**
1. Convert mass of $\text{CH}_4$ to moles:
   $$n_{\text{CH}_4} = \frac{32.0\text{ g}}{16.04\text{ g/mol}} = 1.995\text{ mol CH}_4$$
2. Apply the mole ratio ($1\text{ mol CO}_2 : 1\text{ mol CH}_4$):
   $$n_{\text{CO}_2} = 1.995\text{ mol CO}_2$$
3. Convert moles of $\text{CO}_2$ ($M = 44.01\text{ g/mol}$) to grams:
   $$m_{\text{CO}_2} = 1.995\text{ mol} \times 44.01\text{ g/mol} = \mathbf{87.8\text{ g CO}_2}$$

### Worked Example 2: Solution Molarity & Dilution
**Problem:** What volume of $12.0\text{ M}$ $\text{HCl}$ stock solution is needed to prepare $500.0\text{ mL}$ of $0.250\text{ M}$ $\text{HCl}$?
**Solution:**
$$V_1 = \frac{C_2 V_2}{C_1} = \frac{(0.250\text{ M})(500.0\text{ mL})}{12.0\text{ M}} = \mathbf{10.4\text{ mL}}$$
