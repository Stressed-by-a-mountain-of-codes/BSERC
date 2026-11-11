# /one-page-revision — Without vs With Skill (3 inputs)

Demonstrates the same task run **without** the skill (typical ad-hoc response) vs **with** `/one-page-revision` skill (structured one-page sheet). Shows what got better: consistent structure, scannability, high-yield focus, pitfalls, and self-check.

## Input 1 — Thermodynamics (Carnot / heat engines)
**Input notes:** Carnot engine is an ideal reversible heat engine operating between hot reservoir Th and cold Tc. Efficiency eta = 1 - Tc/Th (temperatures in Kelvin). No engine more efficient than Carnot between same reservoirs (Carnot theorem). Real engines have friction, irreversible processes so lower efficiency. Second law: heat cannot fully convert to work in cyclic process.

### Without skill (typical)
> A Carnot engine is a theoretical engine that has the maximum possible efficiency. Its efficiency is given by 1 - Tc/Th where Tc is the cold temperature and Th is the hot temperature in Kelvin. Real engines are less efficient because of friction and other losses. According to the second law of thermodynamics, you can't convert all heat into work.

**Issues:** unstructured, misses explicit Carnot theorem statement, no steps/components, no pitfalls/self-check, not optimized for quick revision.

### With skill (`/one-page-revision`)
# Carnot Engine & Efficiency — One-Page Revision

## Key ideas (must-know)
- Carnot engine: **ideal, reversible** heat engine between reservoirs at **T_h** (hot) and **T_c** (cold).
- Sets the **maximum efficiency** limit for any engine between the same two reservoirs.
- Real engines are less efficient due to **irreversibilities** (friction, heat loss, non-quasistatic steps).

## Definitions / Terms
- **Reversible process:** idealized, no entropy generation; can be reversed with no net change.
- **Thermal reservoir:** large body at constant temperature.

## Formulas / Rules / Key facts
- **Efficiency:** \(\eta = 1 - \frac{T_c}{T_h}\) (T in **Kelvin**).
- **Carnot theorem:** No heat engine operating between T_h, T_c is more efficient than a Carnot engine.
- **Second law (Kelvin–Planck):** No cyclic device converts all absorbed heat into work (\(\eta < 100\%\)).

## Process / Steps
1. Isothermal expansion at T_h (absorbs Q_h) → 2. Adiabatic expansion → 3. Isothermal compression at T_c (rejects Q_c) → 4. Adiabatic compression.

## Common mistakes & exam tips
- Using °C instead of **Kelvin** in \(\eta\) formula.
- Saying friction is the *only* reason ideal limit exists—**reversibility/2nd law** sets the fundamental limit.

## Quick self-check
1. If T_h=500 K, T_c=300 K, \(\eta\)=? — (**0.4 or 40%**)
2. Can any real engine beat Carnot between same T_h,T_c? — (**No**)
3. Why \(\eta<1\) always? — (**Must reject heat to T_c / 2nd law**)

**What got better:** structured sections, formula highlighted, explicit theorem/process, pitfalls corrected, and self-check questions with answers.

---

## Input 2 — Biology (Photosynthesis basics)
**Input notes:** Photosynthesis in chloroplasts: converts light energy to chemical energy (glucose). Overall: 6CO2 + 6H2O + light -> C6H12O6 + 6O2. Two stages: light-dependent reactions (thylakoid, produce ATP & NADPH, split water release O2) and Calvin cycle/light-independent (stroma, fixes CO2 into sugar using ATP/NADPH). Factors: light intensity, CO2, temperature.

### Without skill (typical)
> Photosynthesis is the process plants use to make food. It happens in chloroplasts and uses sunlight, carbon dioxide and water to produce glucose and oxygen. There are light reactions and the Calvin cycle. Light, CO2 and temperature affect the rate.

**Issues:** vague, missing locations/details of stages, equation not emphasized, no key terms/pitfalls/questions.

### With skill (`/one-page-revision`)
# Photosynthesis — One-Page Revision

## Key ideas (must-know)
- Converts **light energy → chemical energy** (glucose) in **chloroplasts**.
- Requires CO₂, H₂O, light; produces glucose and **O₂** (from water).

## Definitions / Terms
- **Chloroplast:** organelle; **thylakoids** (light reactions), **stroma** (Calvin cycle).
- **ATP/NADPH:** energy and reducing power carriers.

## Formulas / Rules / Key facts
- Overall: \(6CO_2 + 6H_2O + \text{light} \rightarrow C_6H_{12}O_6 + 6O_2\).
- **Light-dependent (thylakoid):** splits H₂O → O₂, makes ATP & NADPH.
- **Calvin cycle (stroma):** fixes CO₂ into sugar using ATP & NADPH.
- **Limiting factors:** light intensity, CO₂ concentration, temperature.

## Process / Steps
1. Light reactions capture light → ATP/NADPH + O₂. 2. Calvin cycle uses ATP/NADPH to fix CO₂ → glucose.

## Common mistakes & exam tips
- O₂ comes from **water**, not CO₂. Calvin cycle is “light-independent” but depends on ATP/NADPH from light reactions.

## Quick self-check
1. Where do light reactions occur? — (**Thylakoid membranes**)
2. Main products of light reactions? — (**ATP, NADPH, O₂**)
3. What fixes CO₂? — (**Calvin cycle in stroma**)

**What got better:** precise locations/products, balanced equation, limiting factors, common misconception corrected, quick checks.

---

## Input 3 — Computer Science (Big-O basics)
**Input notes:** Big-O describes upper bound growth of time/space with input size n. Common: O(1) constant, O(log n) logarithmic (binary search), O(n) linear, O(n log n) (merge sort), O(n^2) quadratic (nested loops). Drop constants and lower-order terms. Compare algorithms by dominant term for large n.

### Without skill (typical)
> Big O notation tells you how fast an algorithm grows. O(1) is constant, O(n) is linear, O(n^2) is quadratic. You ignore constants. Merge sort is O(n log n) and binary search is O(log n).

**Issues:** missing definition nuance (upper bound), space complexity not mentioned, rules incomplete, no pitfalls/self-check, few examples.

### With skill (`/one-page-revision`)
# Big-O Notation — One-Page Revision

## Key ideas (must-know)
- **Big-O** gives an **upper bound** on how time/space grows as input size **n** increases.
- Focus on **growth rate** for large n (scalability), not exact runtime.

## Definitions / Terms
- **Time complexity:** growth of steps/time; **Space complexity:** growth of extra memory.

## Formulas / Rules / Key facts
| Complexity | Name | Example |
|---|---|---|
| O(1) | Constant | Array index access |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Single loop scan |
| O(n log n) | Linearithmic | Merge sort |
| O(n²) | Quadratic | Nested loops |

- **Simplify:** drop constants and lower-order terms (e.g., 3n² + n → O(n²)).

## Process / Steps
1. Count operations vs n → 2. Keep dominant term → 3. Drop constants/coefficients.

## Common mistakes & exam tips
- Confusing O(1) (constant time) with “one operation”; it means **independent of n**.
- Forgetting best/avg/worst can differ (Big-O often states worst/upper bound).

## Quick self-check
1. Dominant term of 5n log n + 20n? — (**O(n log n)**)
2. Binary search complexity? — (**O(log n)**)
3. Two nested loops over n? — (**O(n²)**, if inner is O(n))

**What got better:** clear definition (upper bound, time/space), comparison table, simplification rules, pitfalls, and self-checks in a consistent one-page layout.
