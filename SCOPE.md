# BTC Dashboard Update Scope

What the automation prompts are allowed to change, where each thing lives, and the editorial rules. The prompts read this file as their source of truth.

> **Reading this file:** each refresh skill should `Read offset/limit` only the section that applies to it — not the whole file. Section anchors are listed below.
>
> | Skill | Section anchor |
> |---|---|
> | `/refresh-fallbacks` | "Out of scope" + the Tier 1 fallbacks row + "Audience & plain-language standard" (it owns `YARDSTICKS`) |
> | `/refresh-market-news` | "Editorial rules for the top-5 themes" + "Audience & plain-language standard" + "Out of scope" |
> | `/refresh-headlines-archive` | "Out of scope" |
> | `/refresh-deep-analysis` | "Editorial rules for Deep AI Analysis" + "Audience & plain-language standard" + "Out of scope" |
> | `/refresh-adoption` | "Out of scope" + Tier 1/2/3 rows + "Audience & plain-language standard" |
> | `/refresh-all` | full file, once |
> | `/refresh-plain-language` | "Audience & plain-language standard" + "Out of scope" |

## In scope
Each refresh skill owns its own per-domain file under `src/data/`. Skills should read ONLY their file — never the app code (`src/BitcoinDashboard.jsx` shell, `src/tabs/`, `src/components/`, `src/hooks/`, `src/lib/`), which contains none of this data.

### Tier 1 — Weekly / event-driven
| Constant | File | Section in UI | Source of truth |
|---|---|---|---|
| `MARKET_THEME` | `src/data/market-news.js` | Dashboard → Market Pulse (story #1) | RSS + .gov + IR |
| `CURATED_MARKET_UPDATES` | `src/data/market-news.js` | Dashboard → 4 cards below live price (stories #2–5) | Same |
| `FALLBACK_NEWS` | `src/data/market-news.js` | Headlines (used only if RSS fetch fails) | Same RSS pool |
| `HISTORICAL_HIGHLIGHTS` | `src/data/headlines.js` | Headlines → past 4 weeks | Same |
| `SIX_MONTH_HIGHLIGHTS` | `src/data/headlines.js` | Headlines → past 6 months | Same |
| `DEEP_ANALYSIS` | `src/data/deep-analysis.js` | Analysis tab → all sections | Macro + the 5 themes above + `automations/refresh-deep-analysis/memory/` (v2: probabilities + Brier calibration) |
| `FORECAST_LEDGER` | `src/data/forecast-ledger.js` | Analysis tab → Track record (every scored forecast with its Brier score; the recruiter's page) | Regenerated in full by `/refresh-deep-analysis` from `memory/watch-list-outcomes.md` + `memory/calibration.md` whenever a row resolves; `sum(resolved[].count)` must equal `calibration.nResolved` |
| `COMPANY_HOLDINGS` | `src/data/adoption.js` | Adoption → public-co treasuries | bitcointreasuries.net + SEC + mstr-tracker |
| `FALLBACK_PRICE` / `FALLBACK_ATH` / `FALLBACK_ATH_DATE` / `FALLBACK_MINED` / `FALLBACK_BLOCK` / `ETF_COMPLEX_FALLBACK` / `GLOBAL_CRYPTO_HOLDERS_FALLBACK` | `src/data/fallbacks.js` | Live price card (only if APIs fail); Dashboard stat tiles for the ETF complex and global holders | CoinGecko + mempool snapshot; Farside / issuer totals; Triple-A |

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
- **All app code under `src/` outside `src/data/`** — the shell (`src/BitcoinDashboard.jsx`), `src/main.jsx`, `src/styles.css`, and everything under `src/tabs/`, `src/components/`, `src/hooks/`, and `src/lib/`. Refresh skills must never Read or Edit these files; their owned data lives in `src/data/`.
- **Live-API code** — anything inside `useEffect`, `fetch(...)`, or `setInterval` (in `src/hooks/`).
- **URL constants** in `src/lib/constants.js` (live endpoints — these auto-refresh themselves).
- `PRICE_CHART_RANGES` (`src/tabs/DashboardTab.jsx`), `TABS` (`src/lib/constants.js`) and `TAB_SLUGS` / `ANCHORS` (`src/lib/routes.js`, the `#/tab/anchor` URL scheme) — config, not data.
- **Thesis short path** (`THESIS_QUICK` in `src/data/thesis.js`) — user-authored like the rest of the Thesis tab. `npm run check:plain` measures it; no automation edits it.
- **`automations/refresh-plain-language/reader-feedback.md`** and **`house-dialect.txt`** — **user-owned**. Every writer and the Editor reads them; no automation may edit them. (`drafter-notes.md` in the same directory is the Editor's to replace each run.)
- **`automations/refresh-deep-analysis/memory/`** — owned exclusively by `/refresh-deep-analysis`. No other automation reads or writes here. The file `editorial-lessons.md` inside that directory is **user-owned** and must never be auto-mutated by any automation (including `/refresh-deep-analysis`).

## Audience & plain-language standard

**Read this before writing any prose.** Every refresh skill that writes text is held to it, and `npm run check:plain` measures it.

### Why this exists

Three audiences read this dashboard: friends and family learning Bitcoin from scratch, intermediate observers staying current, and recruiters evaluating the author. **Audience one is the binding constraint.** A newcomer who hits a sentence they cannot parse does not look up the term — they conclude the whole page is not for them, and they stop trusting the parts they *could* have understood. Precision that cannot be read is not precision; it is decoration.

The failure this standard exists to prevent was measured, not imagined: the Aug 19 build ran ~4,500 words on the Analysis tab with 182–369-word paragraphs, one 92-word sentence, undefined terms (`cloture` seven times, `ATM`, `open interest`, `tranche`), and the analyst's private bookkeeping (`THESIS-004 retires`, `0.42 Brier miss`, `haircut like Fed-INTENT bets`) rendered as though it were analysis. Word caps already existed in these playbooks and were exceeded 100% of the time, because nothing measured them. Now something does.

**Plain is not shallow.** Depth comes from mechanism, analogy, and stating what would prove us wrong — never from vocabulary.

### Three registers, mapped to fields that already exist

The tabs are already progressive disclosure, so each disclosure level gets its own register. This is how one document serves the newcomer and the recruiter at once.

| Tier | Fields | Rule |
|---|---|---|
| **1 — Newcomer** (collapsed/default view) | `plainSummary`, every `plain`, `MARKET_THEME.whyItMatters`, **the first sentence of every body paragraph**, `CURATED[].plain` | Dinner-table test. Zero undefined terms. No probability numbers. Opening sentence ≤25 words. |
| **2 — Intermediate** (expanded prose) | rest of `body[]`, `crossCurrents[].body`, `CURATED[].detail`, `marketContext`, `MARKET_THEME.narrative` / `milestone` | Define every term and every person at first use. Every number gets a yardstick. |
| **3 — Technical** (expand-only, two levels deep) | `watchList[].signal`, `falsificationConditions[]`, `calibration.briefSummary` | May use forecasting language — "we gave this 65% odds and were wrong" is the most recruiter-relevant sentence on the page. Bans only *bookkeeping*. |

**The distinction that matters:** `THESIS-004 retires (the fourth falsification-driven retirement)` is bookkeeping — delete it. *"We gave the flow recovery 65% odds, it failed, and here is the model change that follows"* is the analysis — keep it, in Tier 3, in words.

### The nine principles

1. **Consequence first, mechanism second.** Consequence means *what changes in the world* — price, rules, supply, demand, custody risk. **Never what the reader should do.** Second person is allowed only for safety facts ("your coins are unaffected", scam warnings). Never in second person: buy, sell, add, trim, hold, wait, "a good time to", "consider". This site does not give financial advice.
2. **Plain is not shallow.** If a paragraph loses its argument when simplified, it was ornament, not argument.
3. **One idea per paragraph.** Prefer the verb to the noun: "investors re-priced rates", not "the repricing".
4. **Define at first use — terms *and* people.** "cloture — the Senate vote that ends debate"; "Strategy (the software company, formerly MicroStrategy, that holds more Bitcoin than any other)". A newcomer reads "Strategy disclosed its third sale" as a common noun. *A glossary entry is the last resort; the first resort is not needing the word.*
5. **Every number gets a yardstick.** "$100M per sale — about a tenth of one normal week of ETF buying." Bare figures mean nothing to a newcomer.
6. **Never more certain than the analysis.** Use the band phrase for the probability (below). If the source sentence hedges — *despite / only / unless / not higher because* — the rewrite keeps that condition.
7. **Rendered vs internal.** Thesis IDs, raw Brier decimals, calibration category names, regime labels and HIT/MISS verdicts already live in the memory files. Prose must not duplicate them. Say "65% odds", never "0.65". `calibration.briefSummary` is the single rendered window into the ledger.
8. **Analogies declare where they break** (the Thesis tab's `breaks` pattern).
9. **No glyph math (`>=`, `<=`, arrows), no `BREAKING:`, no emoji in prose, no SHOUT-CAPS emphasis, no ticker soup.** Spell "at least"; name the company before its ticker.

Principles 1, 3, 5 and 8 are judgment calls verified by reading aloud. The rest are measured by `npm run check:plain`.

### Verbal probability bands — mandatory phrasing

| p | Phrase |
|---|---|
| 0.05–0.15 | "unlikely" |
| 0.20–0.35 | "possible but less likely than not" |
| 0.40–0.45 | "close to a coin flip, leaning no" |
| 0.55–0.60 | "slightly more likely than not" |
| 0.65–0.80 | "likely" |
| 0.85–0.95 | "very likely" |

Any Tier 1 sentence summarising a probabilistic claim uses the band phrase for its probability. A 10%-probability row whose plain line reads "your Bitcoin is unaffected either way" is a standard violation: 10% is a real tail, and absolute language ("either way", "guaranteed", "never") denies it.

### Word budget

Caps are **ceilings, not targets**. A field that is already clear and under cap is left alone — never shortened to hit a number.

| Field | Cap (words) |
|---|---|
| `headline` | 20 |
| `plainSummary`, every `plain` | 45 (absolute ceiling) |
| `primaryAnalysis.themeTitle`, `CURATED[].title` | 12 preferred / 15 hard |
| `marketContext` | 100 |
| `primaryAnalysis.body[]` | 650 total · ≤120 per paragraph · ≤6 paragraphs |
| `falsificationConditions[]` | 35 each |
| `crossCurrents[].plain` / `.body` | 30 / 150 |
| `watchList[].event` / `.plain` / `.signal` | 25 / 35 / 100 |
| `contrarianTake.body` | 150 |
| `MARKET_THEME.narrative` / `whyItMatters` / `milestone` | 90 / 60 / 60 |
| `CURATED[].detail` / `.plain` | 150 / 30 |
| **Sentences** | **longest ≤45 (hard)**, average ≤22 |

Comparators are **written as words from the start** — "at least two of the three weeks", not "≥2 of 3". The caps above assume spelled-out comparators. Converting a glyph after the fact adds words and can push a field past its cap, and `falsificationConditions[]` and `watchList[].event` are read-only to the Editor, so only the drafter can then bring them back under.

`watchList[].signal` has a required shape so 100 words carries its load:
> "Last time: … (≤20 words). Why this number: … If yes, … If no, …" — and spell the arrows out.

**Sentence length is the dominant comprehension lever.** A 110-word paragraph made of three 37-word sentences still fails the read-aloud test. Cap the sentence first, the paragraph second.

### Yardsticks

`YARDSTICKS` in `src/data/fallbacks.js` (owner: `/refresh-fallbacks`, monthly) holds the standing comparators — average weekly ETF net flow, Strategy's holdings, annual new issuance, total ETF assets, and so on. Any writer, and the Editor, may compare a figure to a `YARDSTICKS` value without fresh research, and the numeric-invariant check lets those values through.

### Three worked rewrites

**Ledger leak into analysis.**
> Before: "…firing the thesis's corporate falsifier on its letter… THESIS-004 retires (the fourth falsification-driven retirement; still zero hindsight retirements), and the overhang re-rates from bounded to open-ended: the leak is doctrine."
> After: "That third sale settles it. We had assumed the selling would stop once the company's cash pile was rebuilt; the pile passed $4.6 billion and the selling continued anyway. So we are retiring that assumption — this is policy, not a cash squeeze."

**Undefined term into a definition with a yardstick.**
> Before: "…a derivatives book that had thinned to its lowest CME open interest since February 2024, with volume migrated to offshore perpetuals."
> After: "Fewer traders held positions on regulated U.S. exchanges than at any point since early 2024 — open interest, the count of live bets, sat at a two-year low. Trading had moved offshore. A thin market moves further on the same piece of news."

**Over-confident plain line into a calibrated one.**
> Before (a row priced at 10%): "Almost nobody supports it, so the expected outcome is a non-event — your Bitcoin is unaffected either way."
> After: "Almost nobody supports this splinter version, so a quiet non-event is the likely outcome. In the unlikely case of disruption, your own coins stay where they are." (32 words. The scam warning belongs in `signal`, not here — it would push this past the 35-word cap.)

## Editorial rules for the top-5 themes (`MARKET_THEME` + `CURATED_MARKET_UPDATES`)
These two constants are managed as **one ranked set of 5 themes**. `MARKET_THEME` is slot 1 (the most important story). `CURATED_MARKET_UPDATES[0..3]` are slots 2–5 in descending importance.

1. **Ranked + deduped.** No two slots may share the same underlying driver. "MSTR raises $X" and "Saylor crosses 700K BTC" are one theme, not two.
2. **Replacement threshold.** A slot is only replaced if a new candidate theme is *materially more important* than the slot it would replace. "More recent" alone never qualifies. Test: would a sophisticated reader who saw the dashboard last week feel something major is missing if we keep the current slot?
3. **Themes have continuity.** A theme like "U.S. market-structure legislation" survives multiple discrete headlines. New developments **refine the existing slot's `narrative`/`detail`** rather than displacing it.
4. **Voice: short-form analysis for newbies.** Translate jargon ("spot ETF inflows" → "people putting money into Bitcoin funds on the stock market"). Plain English. No `BREAKING:`, no clickbait, no emojis. **The full standard, including the word budget these fields are measured against, is § "Audience & plain-language standard" above — read it.**
   - `MARKET_THEME` must include: `narrative` (what is happening, ≤90 words), `whyItMatters` (the plain-English stakes, ≤60 words — this is the Tier 1 line the card shows while collapsed), `milestone` (the next concrete dated event, ≤60 words).
   - Each `CURATED_MARKET_UPDATES` item must include: `title` (names the theme, ≤15 words), **`plain`** (ONE sentence, ≤30 words: what happened and why it matters to someone who owns Bitcoin — this is the collapsed card view), `detail` (≤150 words, every term defined at first use), `sources[]`.
   - **`wouldChange`** on `MARKET_THEME` and on every `CURATED_MARKET_UPDATES` item: ONE sentence, ≤30 words, naming the observable thing that would change our read — the "what would change the author's mind" line the cold-read test asked for. Tier 2; rendered only in the expanded views, never in the collapsed card.
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

9. **The plain layer is part of the deliverable, not a garnish.** Every `plain*` field is written by this skill, from the sources it already fetched — the Editor cannot add facts and will not invent them. Honour the tier map, the word budget and the probability bands in § "Audience & plain-language standard". Analyst bookkeeping (thesis IDs, raw Brier decimals, calibration category names, HIT/MISS verdicts) stays in the memory files; `calibration.briefSummary` is the one rendered window. Run `npm run check:plain -- --file src/data/deep-analysis.js` before the significance gate.
10. **The Track record is part of the deliverable.** Whenever a watch row resolves, regenerate `FORECAST_LEDGER` in `src/data/forecast-ledger.js` in full: newest first; grouped rows carry `count`; every `lesson` in plain English (≤45 words, "we gave this 15% odds and it happened"); every `event` is the scoring letter (≤35 words, comparators spelled out). It is the recruiter's page — a forecast we scored wrong stays on it forever. Run `npm run check:plain -- --file src/data/forecast-ledger.js` after writing it.

The `/refresh-deep-analysis` automation also maintains a **project-scoped analyst memory** at `automations/refresh-deep-analysis/memory/` — read at the start of each run, written to at the end, time-decayed, with relevance-routed loading of theme + actor knowledge files. The quarterly companion command `/consolidate-deep-analysis` distills the journals into heuristics + re-bins calibration. See `memory/INDEX.md` for the full design.

## Universal rules
- Edits go to the relevant `src/data/<owner>.js` file (and `index.html` only on primary-identity shifts). **Never edit `dist/index.html` directly** — it's regenerated by `npm run build`.
- Use narrow `Edit` calls anchored to the constant name; never Read or rewrite a data file wholesale.
- After any source edit, rebuild with `npm run build` so `dist/index.html` stays in sync. If npm isn't on PATH, use the fallback documented in the project's auto-memory.
- Re-sort `COMPANY_HOLDINGS` and `COUNTRY_HOLDINGS` by `btc` descending after any row change.
- Headline `date` format: `MMM D` (e.g. `May 14`).
- **After any prose edit, run `npm run check:plain -- --file src/data/<your-file>`.** Fix hard findings once, re-run once, then proceed and list anything left in your report — never loop on it. The Editor is the backstop, and the weekly publish is never blocked on style.
- **One exception to "edit only your own file":** `/refresh-plain-language` (the Editor) rewrites prose values across `market-news.js` (including each card's `wouldChange`), `deep-analysis.js`, `adoption.js` and `forecast-ledger.js` (only `summary.plain`, `summary.byCategory[].plain` and `resolved[].lesson` — `resolved[].event` is the scoring letter and read-only), and appends to `glossary.js`. It may not touch any other key, it never edits `thesis.js` or `strategy.js` (measured by the checker, authored by the user), and it never reads `automations/refresh-deep-analysis/memory/`.
- **Build gate:** `npm run build` runs `scripts/check-schema.mjs` first; a shape violation in any `src/data/*.js` module fails the build before Vite runs. `npm run check:schema` runs it alone.
