# BTC Dashboard Update Scope

What the automation prompts are allowed to change, where each thing lives, and the editorial rules. The prompts read this file as their source of truth.

> **Reading this file:** each refresh skill should `Read offset/limit` only the section that applies to it — not the whole file. Section anchors are listed below.
>
> | Skill | Section anchor |
> |---|---|
> | `/refresh-fallbacks` | "Out of scope" + the Tier 1 fallbacks row |
> | `/refresh-market-news` | "Editorial rules for the top-5 themes" + "Out of scope" |
> | `/refresh-headlines-archive` | "Out of scope" |
> | `/refresh-deep-analysis` | "Editorial rules for Deep AI Analysis" + "Out of scope" |
> | `/refresh-adoption` | "Out of scope" + Tier 1/2/3 rows |
> | `/refresh-all` | full file, once |

## In scope
Each refresh skill owns its own per-domain file under `src/data/`. Skills should read ONLY their file — never `src/BitcoinDashboard.jsx`, which is the React component and contains none of this data anymore.

### Tier 1 — Weekly / event-driven
| Constant | File | Section in UI | Source of truth |
|---|---|---|---|
| `MARKET_THEME` | `src/data/market-news.js` | Dashboard → Market Pulse (story #1) | RSS + .gov + IR |
| `CURATED_MARKET_UPDATES` | `src/data/market-news.js` | Dashboard → 4 cards below live price (stories #2–5) | Same |
| `FALLBACK_NEWS` | `src/data/market-news.js` | Headlines (used only if RSS fetch fails) | Same RSS pool |
| `HISTORICAL_HIGHLIGHTS` | `src/data/headlines.js` | Headlines → past 4 weeks | Same |
| `SIX_MONTH_HIGHLIGHTS` | `src/data/headlines.js` | Headlines → past 6 months | Same |
| `DEEP_ANALYSIS` | `src/data/deep-analysis.js` | Analysis tab → all sections | Macro + the 5 themes above + `automations/refresh-deep-analysis/memory/` (v2: probabilities + Brier calibration) |
| `COMPANY_HOLDINGS` | `src/data/adoption.js` | Adoption → public-co treasuries | bitcointreasuries.net + SEC + mstr-tracker |
| `FALLBACK_PRICE` / `FALLBACK_ATH` / `FALLBACK_ATH_DATE` / `FALLBACK_MINED` / `FALLBACK_BLOCK` | `src/data/fallbacks.js` | Live price card (only if APIs fail) | CoinGecko + mempool snapshot |

### Tier 2 — Monthly / event-driven
| Constant | File | Section in UI | Source of truth |
|---|---|---|---|
| `COUNTRY_HOLDINGS` | `src/data/adoption.js` | Adoption → sovereign reserves | bitcointreasuries.net (countries) + .gov |
| `<meta name="description">` | `index.html:13` | HTML head | Only re-edit when the dashboard's primary identity (scope, title, theme colors, dominant narrative *category*) shifts — not routine data refreshes. |

### Tier 3 — Quarterly
| Constant | File | Section in UI | Source |
|---|---|---|---|
| `ADOPTION_INDEX_TOP20` | `src/data/adoption.js` | Adoption → top-20 index | Chainalysis Global Adoption Index |
| `ADOPTION_DATA` | `src/data/adoption.js` | Adoption → % by country | Triple-A, Statista |

## Out of scope — never touch
- **Thesis tab data** (`src/data/thesis.js` — `THESIS_METRICS`, `SOFT_MONEY_COSTS`, `SILENT_TAX_*`, `BTC_ISSUANCE_DATA`, `MONEY_HISTORY`, `HARDNESS_DATA`, `PROPERTIES_MATRIX`, `TIME_PREFERENCE`, `THESIS_FLOW`, `POSITIONING_LENSES`).
- **Strategy tab data** (`src/data/strategy.js` — `ALLOCATION_BANDS`, `COMMON_MISTAKES`, `HISTORICAL_DRAWDOWNS`, `STRATEGY_SOURCES`, `DCA_WEEKLY_OPTIONS`).
- **`src/BitcoinDashboard.jsx`** — the React component. Refresh skills must never Read or Edit this file; their owned data lives in `src/data/`.
- **Live-API code** — anything inside `useEffect`, `fetch(...)`, or `setInterval` (all in `BitcoinDashboard.jsx`).
- **URL constants** in `BitcoinDashboard.jsx` (live endpoints — these auto-refresh themselves).
- `PRICE_CHART_RANGES` and `TABS` in `BitcoinDashboard.jsx` (config, not data).
- **`automations/refresh-deep-analysis/memory/`** — owned exclusively by `/refresh-deep-analysis`. No other automation reads or writes here. The file `editorial-lessons.md` inside that directory is **user-owned** and must never be auto-mutated by any automation (including `/refresh-deep-analysis`).

## Editorial rules for the top-5 themes (`MARKET_THEME` + `CURATED_MARKET_UPDATES`)
These two constants are managed as **one ranked set of 5 themes**. `MARKET_THEME` is slot 1 (the most important story). `CURATED_MARKET_UPDATES[0..3]` are slots 2–5 in descending importance.

1. **Ranked + deduped.** No two slots may share the same underlying driver. "MSTR raises $X" and "Saylor crosses 700K BTC" are one theme, not two.
2. **Replacement threshold.** A slot is only replaced if a new candidate theme is *materially more important* than the slot it would replace. "More recent" alone never qualifies. Test: would a sophisticated reader who saw the dashboard last week feel something major is missing if we keep the current slot?
3. **Themes have continuity.** A theme like "U.S. market-structure legislation" survives multiple discrete headlines. New developments **refine the existing slot's `narrative`/`detail`** rather than displacing it.
4. **Voice: short-form analysis for newbies.** Translate jargon ("spot ETF inflows" → "people putting money into Bitcoin funds on the stock market"). Plain English. No `BREAKING:`, no clickbait, no emojis.
   - `MARKET_THEME` must include: `narrative` (1–2 sentences — what's happening), `whyItMatters` (1–2 sentences — plain-English stakes), `milestone` (the next concrete dated event to watch).
   - Each `CURATED_MARKET_UPDATES` item must include: `title` (names the theme), `detail` (1–2 sentences — what is happening + why a non-expert should care), `sources[]`.
5. **De-dup pass mandatory.** Before writing, list the 5 chosen themes side by side and confirm no overlap.
6. **Primary sources only.** `sources[]` must point at originating outlets: .gov, SEC EDGAR, official IR, bitcointreasuries.net, Farside Investors, then major BTC press. Never re-blogs or aggregators.
7. **Preserve JS shape exactly.** Same keys. `statusTone` must be one of `advancing` / `active` / `stalled` / `passed`. `asOf` format: `MMM D, YYYY` uppercase (e.g. `MAY 12, 2026`).

## Editorial rules for Deep AI Analysis (`DEEP_ANALYSIS` v2)
The `DEEP_ANALYSIS` object is the weekly synthesis layer rendered on the Analysis tab. Curation (the top-5 themes) says *what happened*; this says *what it means*. Generated by `/refresh-deep-analysis` with extended thinking + explicit probabilities + Brier-scored calibration.

1. **Macro context is mandatory.** `marketContext` must describe cycle position, liquidity backdrop, rates/dollar regime, and gold/BTC behavior. If it could be replaced by "BTC went up/down this week," it fails.
2. **Synthesis, not paraphrase.** `primaryAnalysis.body` must add insight beyond `MARKET_THEME.narrative` — causal chains, stakeholder analysis, historical analogs, invalidation conditions. If a paragraph could appear in `MARKET_THEME.narrative` or `CURATED_MARKET_UPDATES.detail`, it does not belong here.
3. **Cross-currents must actually cross.** Each `crossCurrents[].themesConnected` must list ≥2 distinct themes. A single-theme deep-dive is not a cross-current.
4. **Every `watchList` item is dated, categorized, and probability-tagged.** `window` must be a concrete date or tight quarter. `category` ∈ {regulation, macro, protocol, corporate, sovereign, etf, market-structure}. `probability` is required, rounded to 0.05, never 0.50 (refusal). `signal` must contain "if X, then Y" reasoning.
5. **Contrarian take is mandatory, serious, and probability-tagged.** `contrarianTake.probability` ∈ [0.10, 0.45]. `<0.10` = strawman; `≥0.50` = no longer contrarian. The `body` must be a coherent alternative read a thoughtful skeptic would offer.
6. **Primary thesis carries a probability + falsification conditions.** `primaryAnalysis.thesisProbability` is required. `primaryAnalysis.falsificationConditions` lists 3–5 concrete observable conditions any one of which retires the thesis.
7. **Calibration block** is included once N ≥ 8 resolved items. Before that, seed with `{aggregateBrier: null, nResolved: 0, briefSummary: "Seeding…"}`.
8. **Primary sources only.** Same priority order as `/refresh-market-news` — `.gov`, SEC EDGAR, official IR, bitcointreasuries.net, Farside Investors, BIPs, then major BTC press as supporting context only.

The `/refresh-deep-analysis` automation also maintains a **project-scoped analyst memory** at `automations/refresh-deep-analysis/memory/` — read at the start of each run, written to at the end, time-decayed, with relevance-routed loading of theme + actor knowledge files. The quarterly companion command `/consolidate-deep-analysis` distills the journals into heuristics + re-bins calibration. See `memory/INDEX.md` for the full design.

## Universal rules
- Edits go to the relevant `src/data/<owner>.js` file (and `index.html` only on primary-identity shifts). **Never edit `dist/index.html` directly** — it's regenerated by `npm run build`.
- Use narrow `Edit` calls anchored to the constant name; never Read or rewrite a data file wholesale.
- After any source edit, rebuild with `npm run build` so `dist/index.html` stays in sync. If npm isn't on PATH, use the fallback documented in the project's auto-memory.
- Re-sort `COMPANY_HOLDINGS` and `COUNTRY_HOLDINGS` by `btc` descending after any row change.
- Headline `date` format: `MMM D` (e.g. `May 14`).
