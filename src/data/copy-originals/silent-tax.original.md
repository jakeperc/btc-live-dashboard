# Silent Tax — original copy snapshot (revert reference)

Saved before the **mobile "stepped" rebuild pilot**. The DESKTOP experience (the
pinned scroll-scrub) and its data (`SILENT_TAX_CHAPTERS` in `src/data/thesis.js`)
were **left unchanged** by the pilot — this file exists so we can revert the new
MOBILE copy (`SILENT_TAX_STEPS`, `SILENT_TAX_GUESS`, `SILENT_TAX_CODA`) back toward
the original wording if desired, or re-converge desktop + mobile onto one copy set.

Date of snapshot: 2026-06-30

---

## Original mobile fallback header (component `ThesisSilentTaxFallback`)

- Eyebrow: `The Silent Tax`
- Title: `$1 saved in 1971 is now worth $0.13.`
- Sub: `Since Nixon ended gold convertibility, the U.S. money supply has grown 32x. The bill is paid — quietly, decade by decade — by anyone holding cash.`

## Original chapters — `SILENT_TAX_CHAPTERS` (shared by desktop scrolly + old fallback)

| era | ppTarget | eyebrow | headline | body |
|---|---|---|---|---|
| 1971 | 1.00 | Aug 1971 | Nixon closes the gold window. | $1 bought a McDonald's hamburger, fries, and Coke. Then the U.S. unilaterally ends dollar-to-gold convertibility — and the experiment begins. |
| 1970s | 0.47 | 1971 – 1980 | Stagflation. Oil shocks. −52% in a decade. | Two oil shocks. Wage-price spirals. Money supply rises faster than output. Anyone holding cash savings pays the bill — silently, paycheck by paycheck. |
| 1980s | 0.29 | 1980 – 1990 | Reaganomics + S&L bailouts. −38%. | Hundreds of thrift institutions collapse. Taxpayers absorb the losses. Money is created again to backstop political mistakes — and the dollar quietly thins. |
| 2008 | 0.18 | Oct 2008 | GFC. QE1 begins. $1.3T in 18 months. | The Fed crosses a line that hadn't been crossed before. Quantitative easing becomes a permanent tool, not an emergency one — and it shows in every paycheck since. |
| 2020 | 0.14 | Mar 2020 – 2022 | Covid. 40% of every USD ever — in 24 months. | The fastest M2 expansion in U.S. history. By the time the chart updated, the dollar you held had already lost ground you cannot recover. |
| Today | 0.13 | 2025 | Your dollar is now worth 13 cents. | Same currency. Same paychecks. Denominated in a unit that has shed 87% of its purchasing power. The tax was paid. You were never told. |
| Coda | null | Meanwhile… | The supply you can't print. | Bitcoin's issuance halves every four years toward zero: 1.7% → 0.83% → 0.41% → 0.20%. Nobody, ever, on any timeline, can decide to print more. That is the difference. |

---

### To revert the mobile pilot entirely

In `src/BitcoinDashboard.jsx`, change the `ThesisSilentTaxPinned` branch back to:

```js
if (isMobile || reduceMotion) return <ThesisSilentTaxFallback />;
return <ThesisSilentTaxPinnedDesktop />;
```

…and (optionally) delete `SILENT_TAX_STEPS`, `SILENT_TAX_GUESS`, `SILENT_TAX_CODA`
from `src/data/thesis.js`, the `ThesisSilentTaxStepped` component, and the
`.thesis-tax-*` CSS block. Nothing else was touched.
