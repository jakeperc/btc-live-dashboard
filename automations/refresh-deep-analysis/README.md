# refresh-deep-analysis (v2)

Slash command: `/refresh-deep-analysis`

Weekly **synthesis** layer that sits on top of `/refresh-market-news`. Curation answers *what happened*; this answers *what does it mean, how do the themes interact, and what should we watch next* — with **explicit probabilities + Brier-scored calibration** so the analyst compounds skill over time.

Runs Fable 5 with **extended thinking** through a 5-phase pass and maintains a **structured, time-decayed analyst memory** at `automations/refresh-deep-analysis/memory/`.

| Constant | File | UI location | Treatment |
|---|---|---|---|
| `DEEP_ANALYSIS` | `src/data/deep-analysis.js` | Analysis tab → all sections | One object — replaced in full each run |
| `FORECAST_LEDGER` | `src/data/forecast-ledger.js` | Analysis tab → "Track record" (top of tab; anchor `#/analysis/track-record`) + the crawler rendition | One object — regenerated in full from `memory/watch-list-outcomes.md` + `memory/calibration.md` in every run in which a row resolves (step 21b) |

Plus optionally `index.html:13` `<meta name="description">` — only if the primary narrative materially shifted (same rule as `/refresh-market-news`).

The **editorial rules** live in `SCOPE.md` § "Editorial rules for Deep AI Analysis". The **memory design** lives in `memory/INDEX.md`. This file is the **operational playbook**.

## Hard scope (do not violate)

- Edit ONLY `DEEP_ANALYSIS` in `src/data/deep-analysis.js`, `FORECAST_LEDGER` in `src/data/forecast-ledger.js` (regenerated, never hand-patched — step 21b), and the auto-mutable files inside `automations/refresh-deep-analysis/memory/`. Plus optionally `index.html:13`.
- **Do NOT Read `src/BitcoinDashboard.jsx`.** Theme inputs live in `src/data/market-news.js` (MARKET_THEME, CURATED_MARKET_UPDATES) and `src/data/headlines.js` (HISTORICAL_HIGHLIGHTS).
- Use a narrow anchored `Edit` to replace the `DEEP_ANALYSIS` object — never rewrite the data file wholesale.
- **NEVER auto-mutate `memory/editorial-lessons.md`** — user-owned.
- Never touch Thesis, Strategy, live-API code, URL constants, theme constants, adoption data, or anything in `SCOPE.md` § "Out of scope".
- Preserve `DEEP_ANALYSIS` shape exactly (see "JS shape spec" below).
- Primary sources only. No aggregators.
- **Extended thinking required** for Phase 3.
- **Probabilities are mandatory** on every `watchList` item, every `contrarianTake`, every `primaryAnalysis.thesis`. Rounded to 0.05.
- **Memory writes are part of the run.** Skipping them = incomplete.

## Workflow

### Phase 1 — Load memory + current state (orchestrated, relevance-routed)

Follow the load order in `memory/INDEX.md`. Briefly:

1. **`memory/INDEX.md`** — orchestrator + decay rules.
2. **`memory/editorial-lessons.md`** — user constraints, hard for this run.
2b. **`automations/refresh-plain-language/reader-feedback.md`** and **`automations/refresh-plain-language/drafter-notes.md`** — the reader-facing feedback loop. The first is user-owned comprehension law; the second is what last week Editor had to fix, plus the items it could NOT fix because they needed facts you have and it does not. Both live outside `memory/`, so the memory-directory ownership rule is untouched. Treat both as hard constraints on this draft.
3. **`memory/next-run-briefing.md`** — work through priority TODOs **before** broad research. Score deadlines, theses to falsification-check, theme files to refresh.
4. **`memory/calibration.md`** — read aggregate Brier + active bias corrections. Apply as priors in Phase 3.
5. **`memory/heuristics.md`** — load promoted heuristics; treat as durable priors.
6. **`memory/thesis-tracker.md`** — read active theses + falsification status. Identify any due for retirement.
7. **Relevance-routed:** for each theme currently in `MARKET_THEME` + `CURATED_MARKET_UPDATES`, load the matching `memory/themes/<slug>.md`. For each major actor named in those themes, load `memory/actors/<slug>.md`. Typically 4–6 themes + 3–8 actors.
8. **`memory/causal-model.md`** + **`memory/source-reliability.md`** — load fully (small).
9. **Tail** the journals: last ~8 entries of `theme-history.jsonl`; unresolved + recently-resolved rows of `watch-list-outcomes.md` and `contrarian-ledger.md`; active section of `cross-current-patterns.md`.
10. **Read current dashboard state.** `MARKET_THEME` + `CURATED_MARKET_UPDATES` from `src/data/market-news.js`, `HISTORICAL_HIGHLIGHTS` from `src/data/headlines.js`, current `DEEP_ANALYSIS` from `src/data/deep-analysis.js`. If `/refresh-market-news` just ran and `automations/refresh-market-news/last-run-artifacts.md` exists, prefer it over re-fetching the same primary sources.
11. **Score Phase 1 resolutions.** For each unresolved item whose `window` has elapsed:
    - Assign outcome ∈ {1.0 hit, 0.0 miss, no-resolution}. **There is no partial credit.** A binary forecast is judged against the threshold stated in its own event text and the cited primary source: either it was met or it was not. Only if the event text genuinely cannot decide it, mark `no-resolution` — it is then EXCLUDED from every Brier, residual and decile figure (and from `nResolved`). Never pick an outcome to make the numbers look better or worse; state the reasoning in the one-line lesson.
    - Compute Brier `(p − outcome)²` for hits and misses only.
    - Write a 1-line lesson with primary-source citation.
    - Hold these for Phase 5 write-back.

### Phase 2 — Research

12. **Survey macro context.** WebSearch the last ~1 week for Fed/FOMC posture, Treasury issuance, dollar (DXY), gold, real rates, equities risk-on/off. Macro framing for `marketContext`. Source priority: `federalreserve.gov`, `bls.gov`, `treasury.gov`, FRED. Bloomberg/Reuters acceptable for rate/equity color but never sole source.
13. **Validate primary sources** for the 5 themes. WebFetch ≥1 primary per slot-1 theme. Cross-check against `memory/source-reliability.md` — prime sources first.
14. **Hunt cross-theme connections.** Explicitly search for stories connecting ≥2 themes from the current 5 (or 1 current theme + 1 dormant pattern). Use `memory/causal-model.md` edges as a starting hypothesis set.
14a. **Second-order / shared-resource scan (timing risk that shares no keywords).** A theme can be moved by contention for a shared scarce resource that a theme-scoped search will never surface. For each active **legislative/regulatory** theme, run a non-crypto search on the **congressional calendar environment** (appropriations / shutdown / debt deadlines, must-pass bills competing for floor time, leadership priorities, presidential signing standoffs) — a bill can slip on *timing alone*, with no change to votes or merits. Generalize per theme: legislation → floor time; macro → Fed attention / balance-sheet capacity; protocol → block space + dev consensus; market-structure → liquidity / collateral. **Any legislative `watchList` item's `signal` must explicitly carry this exogenous-calendar risk** — the if/then should name what could derail it on *timing* (e.g., "if a must-pass standoff freezes the floor through mid-July, then the bill slips past recess"), not only its merits.
15. **Time-anchor every catalyst** for the `watchList`. Each item must have a concrete `window` (date or tight quarter), not "soon."
16. **Find the smartest counter-narrative.** For `contrarianTake`, identify a serious analyst's coherent alternative read. Recall: probability must be ≥0.10 (else strawman) and <0.50 (else it's the base case).

### Phase 3 — Draft with extended thinking

17. **Engage extended thinking.** Reason across:
    - How memory priors shape framing (cite `heuristics.md` entries or `causal-model.md` edges in your reasoning if they bind).
    - Which `crossCurrents` are durable (recurring in `cross-current-patterns.md`) vs. novel.
    - Whether `contrarianTake` is differentiated from prior weeks (check `contrarian-ledger.md`).
    - Apply calibration bias corrections from `memory/calibration.md` to today's probabilities.
18. **Compose** in this order:
    - **`asOf`** — today's date, `MMM D, YYYY` uppercase.
    - **`headline`** — one sharp framing sentence, **≤20 words**. It is rendered under the plain summary, so it is prose, not a slug.
    - **`plainSummary`** — one plain-English sentence (≤45 words, zero jargon) a curious non-investor fully understands on its own: the week's bottom line. **Plain-field standard** (applies to every `plain*` below): a smart 12-year-old reading level, no jargon, no ticker/level/acronym soup, and do NOT restate probability numbers (the UI shows them). These `plain*` fields are the *collapsed/default* view of the Analysis tab — what most readers see before expanding — so they must stand alone.
    - **`marketContext`** — 1 paragraph, **≤100 words**, macro-aware. Its opening sentence is Tier 1: a newcomer must understand it standing alone.
    - **`primaryAnalysis.themeTitle`** — mirrors `MARKET_THEME.title`.
    - **`primaryAnalysis.plain`** — one plain-English sentence restating the main read (plain-field standard above).
    - **`primaryAnalysis.body`** — 4–6 paragraphs as `string[]`, **≤120 words each and ≤650 words in total**. Each paragraph: ONE idea, opening with a Tier 1 sentence (≤25 words, no undefined terms) that says what changed for a reader, then the mechanism — causal chain, stakeholder analysis, or historical analog. Not a paraphrase of `MARKET_THEME.narrative`. Invalidation belongs in `falsificationConditions`, not in every paragraph.
    - **`primaryAnalysis.thesisProbability`** — `p` for the primary thesis playing out (e.g., for CLARITY → institutional unlock, p of clean-passage-and-allocator-response over 12 months). Rounded to 0.05.
    - **`primaryAnalysis.falsificationConditions`** — 3–5 concrete observable conditions any one of which retires the thesis. **≤35 words each, comparators spelled out in words** ("at least two of the three weeks", never "≥2 of 3"). This field is read-only to the Editor — it is the scoring letter next week's resolution reads — so if you leave a glyph here, the Editor must expand it, that expansion pushes the field over cap, and nobody downstream can fix it.
    - **`crossCurrents`** — 2–3 items, each `{ title, plain, body, themesConnected }`. Each must connect at least 2 themes in `themesConnected`. `title` ≤15 words. **`plain`** — one Tier 1 sentence, ≤30 words, saying what the interaction means for a reader; it is the lead line the card shows. `body` ≤150 words on the *interaction*, not on the individual themes.
    - **`watchList`** — 4–6 items. Each: `{ event, plain, category, window, probability, signal }`. Probability rounded to 0.05. `category` ∈ {regulation, macro, protocol, corporate, sovereign, etf, market-structure}. `event` ≤25 words, written in plain words — no glyph math, spell "at least". `plain` ≤35 words, jargon-free, saying what the item would mean in human terms, and using the band phrase for its probability (never the number). `signal` ≤100 words in this shape: **"Last time: … (≤20 words). Why this number: … If yes, … If no, …"** — Tier 3, so forecasting language is welcome but thesis IDs, raw decimals, category names and HIT/MISS verdicts are not.
    - **`contrarianTake`** — `{ probability, plain, body }`. Probability in [0.10, 0.45]. `body` **≤150 words**. `plain` = one jargon-free sentence, ≤45 words, summarising the other side using its band phrase.
    - **`calibration`** — `{ aggregateBrier, briefSummary }`. Read from `memory/calibration.md`. `briefSummary` is one short sentence ("18 items scored, aggregate Brier 0.21, mildly overconfident on regulation"). Omit if N < 8 resolutions.
    - **`sources`** — primary sources only.

18a. **Plain pass — write for the reader, not the ledger.** Do this while the sources are still in front of you; it is the step the Editor CANNOT do for you, because the Editor may not add facts.
    - **Author every `plain*` field yourself.** They are the collapsed view — the only thing most readers ever see.
    - **Define every term and every person at first use**, in the field where it first appears. "cloture — the Senate vote that ends debate"; "Strategy (the software company, formerly MicroStrategy, that holds more Bitcoin than any other)". A newcomer reads "Strategy disclosed a sale" as a common noun.
    - **Give every number a yardstick**, from the field itself or from `YARDSTICKS` in `src/data/fallbacks.js`. "00M per sale — about a tenth of one normal week of ETF buying."
    - **Strip the ledger.** Thesis IDs, raw Brier decimals, calibration category names, regime labels, HIT/MISS verdicts and "haircut"/"on its letter" idiom are already recorded in the memory files — repeating them in prose costs the reader and gains the ledger nothing. Say "we gave this 65% odds and were wrong", which is the strongest sentence on the page for a technical reader. `calibration.briefSummary` is the single rendered window into the ledger; its existing inline gloss ("Brier — lower is better") is the house exemplar.
    - **Match certainty to probability.** Use the band phrase from `SCOPE.md` § "Audience & plain-language standard". A 10%-probability row whose plain line says "unaffected either way" is a violation — 10% is a real tail.

### Phase 3b — Cross-theme interaction matrix

18b. **Load interaction matrix.** Read `memory/theme-interactions.md`. It contains pairwise deltas, the Step 0 regime rule, and application rules.
18b2. **Determine the regime (matrix Step 0).** Classify this run as `reinforcing` (default — risk-on/neutral) or `contagion` (risk-off / broad-deleveraging cascade) per the activation conditions in `theme-interactions.md`. In a cascade the all-reinforcing matrix pushes correlated themes the WRONG way (UP into a downside move); `contagion` flips the correlated-risk cluster (`etfs`, `corporate-treasuries`, `fed-monetary-policy`) to transmit weakness DOWN. Record the choice in `themeInteractions.regime`.
18c. **Compute adjustments.** For each theme T in the current top-5, for each other theme S look up `delta(S→T)`, then:
   - **`reinforcing` regime:** `weighted_delta = delta(S→T) × p(S)`.
   - **`contagion` regime:** for pairs where both S and T are in the correlated-risk cluster AND `delta(S→T) > 0`, `weighted_delta = − delta(S→T) × max(0, 0.50 − p(S))` (transmits weakness DOWN, never lifts); every other pair keeps the `reinforcing` rule.
   - Sum all weighted deltas. Clamp the net to [-0.15, +0.15].
   - Adjusted: `clamp(p(T) + net, 0.05, 0.95)`, rounded to 0.05.
18d. **If a theme is not in the matrix** (novel theme, no prior row/column), use delta 0.00 and flag it in `next-run-briefing.md`.
18e. **Write `themeInteractions` block** into the draft `DEEP_ANALYSIS` (see JS shape below). Set `regime`; include the applied pairs (mark any contagion-applied pair `direction: "contagion"`), per-theme net adjustments with before/after probabilities, and one-line reasoning per material adjustment (|net| >= 0.03).

### Phase 4 — Critique pass

19. **Re-read against the v2 checklist:**
    - (a) Is `marketContext` actually macro-aware, or just restating BTC price?
    - (b) Does `primaryAnalysis.body` add insight beyond `MARKET_THEME.narrative`?
    - (c) Does each `crossCurrents` item connect ≥2 themes?
    - (d) Is every `watchList` item dated, falsifiable, AND carrying an honest probability (not 0.50)?
    - (e) Is `contrarianTake.probability` in [0.10, 0.45]? Is the body a real counter-argument?
    - (f) Are `falsificationConditions` concrete + observable?
    - (g) Are all sources primary (per `source-reliability.md` scoring)?
    - (h) Does the draft honor every active line in `editorial-lessons.md`?
    - (i) Does the draft build on prior `theme-history.jsonl` continuity?
    - (j) **Has calibration bias been applied?** If `calibration.md` flags overconfidence in regulation by +X%, did today's regulatory probabilities get haircut by that amount?
    - (k) **Were cross-theme interactions applied?** Check `themeInteractions.adjustments` — are net deltas reasonable (within ±0.15)? Does the reasoning chain track? Any novel theme missing from the matrix flagged? **Is `themeInteractions.regime` set and does it match the tape — `contagion` in a deleveraging cascade, `reinforcing` otherwise? In a cascade, confirm the correlated-risk cluster's net deltas are ≤ 0 (the matrix must not be lifting `etfs`/`corporate-treasuries`/`fed-monetary-policy` into a downside move).**
    - (l) **Are the `plain*` fields truly plain?** Could a curious non-investor understand `plainSummary`, `primaryAnalysis.plain`, `contrarianTake.plain`, and every `watchList[].plain` with no other context and no jargon? If any needs a glossary term to parse, or restates a probability number, rewrite it. These are the collapsed/default view of the Analysis tab.
    - (m) **Read every paragraph aloud.** Could you say it to a relative at dinner and have them nod rather than squint? Any sentence over 45 words fails on length alone; the longest sentence in the Aug 19 build was 92.
    - (n) **Run `npm run check:plain -- --file src/data/deep-analysis.js`.** Fix hard findings, re-run **once**, then proceed regardless and list anything still outstanding in your report. Do NOT loop: the Editor is the backstop and the weekly publish is never blocked on style. Findings in fields you own but the Editor may not touch (`watchList[].event`, `falsificationConditions`) are specifically yours to fix — nobody downstream can.
20. **Revise.** Apply notes. Work from interaction-adjusted probabilities. If a section fails its check, cut and redraft.

### Phase 5 — Significance gate, write, update memory, rebuild

20a. **Significance gate (DEEP_ANALYSIS write only).** The cadence trigger in `/refresh-all` is now frequent (every 2 days). Most polls should produce **zero DEEP_ANALYSIS writes**. Compare the drafted v2 object against the currently-stored one:

   - **Probability shifts.** Skip the write unless at least one of these changed by ≥ 0.05 rounded: `primaryAnalysis.thesisProbability`, any `watchList[].probability`, `contrarianTake.probability`, or any `themeInteractions.adjustments[].finalProbability`.
   - **Set membership.** Skip the write unless the set of themes (`primaryAnalysis.themeTitle` + `crossCurrents[].themesConnected` + `watchList[].event`) differs from the stored object in a non-cosmetic way (new theme entering, retired theme leaving, new cross-current, retired cross-current).
   - **Falsification.** Skip the write unless `primaryAnalysis.falsificationConditions` materially changed, **or** any prior falsification condition was tripped this run (force a write to retire/replace the thesis).
   - **Calibration.** A `calibration.aggregateBrier` delta < 0.02 with no per-category bias correction change is not by itself enough to justify a write.
   - **`asOf` alone is never enough.** Bumping the date string with no other material change fails the gate.

   If the gate closes, **do not write `DEEP_ANALYSIS`** — but still complete the memory writes in step 22 (memory updates are part of every polled run, per the v2 design). Report `DEEP_ANALYSIS unchanged (significance gate)`.

21. **Write `DEEP_ANALYSIS`** into `src/data/deep-analysis.js` via a narrow anchored `Edit` ONLY if step 20a opened the gate. Preserve shape exactly.
21b. **Write `src/data/forecast-ledger.js`.** Regenerate `FORECAST_LEDGER` in full from `memory/watch-list-outcomes.md` (the Resolved table) + `memory/calibration.md` (aggregate, rolling-20, per-category residuals for categories with N ≥ 3, the decile curve) in **every run in which a row resolves** — this write is NOT gated by step 20a, because a scored forecast is material on its own. Rules: newest first by `resolvedOn`; one row per resolved forecast; a series scored as one block (the June dot-plot seven) stays ONE grouped row that keeps `count` and lists `probabilities`; `sum(resolved[].count)` must equal `calibration.nResolved` (and `summary.nResolved`); `event` is the scoring letter rewritten for a newcomer (≤35 words, comparators spelled out, no thesis IDs or bookkeeping), `lesson` ≤45 words in plain English ("we gave this 15% odds and it happened"), `source` is the primary link the outcome was scored against; `made` = the asOf of the run that published the forecast, `resolvedOn` = the run that scored it. Never hand-edit an outcome, probability or Brier here — fix the memory ledger and regenerate. Then run `npm run check:plain -- --file src/data/forecast-ledger.js` and the import check `node --input-type=module -e "const m = await import('./src/data/forecast-ledger.js'); const L=m.FORECAST_LEDGER; console.log(L.resolved.reduce((s,r)=>s+r.count,0), L.summary.nResolved)"` (the two numbers must match).
22. **Update memory** (skip `editorial-lessons.md` — user-owned):
    - **`theme-history.jsonl`** — append `{"asOf","slot1Category","slot1Title","headline","framingShift","thesisProbability"}`.
    - **`watch-list-outcomes.md`** — write the Phase-1 resolutions (outcome, Brier, lesson) to the Resolved section; append new `watchList` items (with probabilities) to the Active section.
    - **`contrarian-ledger.md`** — score any resolved entries; append the new `contrarianTake` with its probability + resolution-window.
    - **`thesis-tracker.md`** — increment stalled-run counter on theses with no new material evidence; check falsificationConditions; flag for retirement if triggered; register the new run's primary thesis as `THESIS-NNN` if novel.
    - **`causal-model.md`** — refine edge strengths from this week's evidence; add novel edges (with mechanism); weaken contradicted edges.
    - **`source-reliability.md`** — note which sources surfaced material new info this week.
    - **`calibration.md`** — recompute aggregate Brier (rolling 20); update per-category mean residual if N ≥ 8; append a run-history row.
    - **`cross-current-patterns.md`** — bump `last observed` on matches; add novel + structural patterns.
    - **`themes/<slug>.md`** — for each theme in the current top 5, append dated facts, refine status, update open questions + upcoming catalysts.
    - **`actors/<slug>.md`** — same for materially-mentioned actors. Create new files if a major actor first appears this week (e.g., `actors/metaplanet.md` if Metaplanet becomes a recurring driver).
    - **REPLACE `next-run-briefing.md`** — prioritized TODOs for the next run.
23. **Apply decay rules** per `memory/INDEX.md`. Confirm total memory directory size <300 KB.
24. **Rebuild.** `npm run build`, or the codex `node scripts/build.mjs` fallback. **Skip the rebuild if step 20a closed the gate AND no other agent in this orchestrated run wrote to a `src/data/*.js` file** — `dist/index.html` is already in sync. Memory-only writes do not change the bundled dashboard.
25. **Report.** Summarize:
    - Significance gate outcome: opened (and which trigger fired) or closed (and why).
    - `DEEP_ANALYSIS` changes vs. prior version (skip if gate closed).
    - Resolutions scored this run (outcomes, Brier deltas).
    - Memory updates: new patterns, edges refined, files refreshed/created.
    - Calibration status (aggregate Brier, any new bias corrections).
    - Active falsification flags fired.
    - Cross-theme interaction adjustments applied (per-theme before/after probabilities).
    - Whether `editorial-lessons.md` constraints affected the draft.
    - `index.html:13` meta touched? Rebuild result.

## JS shape spec (v2)

```js
const DEEP_ANALYSIS = {
  asOf: "MAY 18, 2026",
  headline: "...",
  plainSummary: "...",                         // NEW — 1 plain-English sentence, no jargon; the week's bottom line for a non-investor (always-visible lead)
  marketContext: "...",
  primaryAnalysis: {
    themeTitle: "...",
    plain: "...",                             // NEW — 1 plain-English sentence, no jargon; the main read (collapsed card summary). Don't restate the probability.
    body: ["...", "..."],
    thesisProbability: 0.65,                  // NEW v2
    falsificationConditions: ["...", "..."],  // NEW v2 — 3–5 concrete conditions
  },
  crossCurrents: [
    {
      title: "...",                              // <=15 words
      plain: "...",                              // NEW — 1 Tier 1 sentence, <=30 words: what this interaction means for a reader. Rendered as the lead line above the body.
      body: "...",                               // <=150 words, on the INTERACTION
      themesConnected: ["...", "..."],
    },
  ],
  watchList: [
    {
      event: "...",
      plain: "...",                           // NEW — short, jargon-free phrase: why this matters in human terms (collapsed row summary)
      category: "regulation",                 // NEW v2 — see categories list
      window: "...",
      probability: 0.65,                      // NEW v2 — required, rounded to 0.05
      signal: "...",
    },
  ],
  contrarianTake: {                           // NEW v2 — was string, now object
    probability: 0.30,                        // required, in [0.10, 0.45]
    plain: "...",                             // NEW — 1 plain-English sentence, no jargon; the other side (collapsed card summary)
    body: "...",
  },
  themeInteractions: {                         // NEW v2.1 — cross-theme interaction matrix
    regime: "reinforcing",                     // NEW JUN 2026 — "reinforcing" (risk-on/neutral, default) | "contagion" (risk-off cascade). Optional; absent = "reinforcing" for back-compat.
    pairs: [
      {
        themes: ["clarity-act", "etfs"],
        delta: 0.08,
        direction: "reinforcing",              // "reinforcing" | "contradicting" | "contagion"
      },
    ],
    adjustments: [
      {
        theme: "clarity-act",
        draftProbability: 0.65,
        netDelta: 0.04,
        finalProbability: 0.70,
        reasoning: "Reinforced by strong ETF inflows (+0.08×0.55) and corporate momentum (+0.10×0.60).",
      },
    ],
  },
  calibration: {                              // NEW v2 — optional, omit if N < 8
    aggregateBrier: 0.21,
    briefSummary: "18 items scored; mildly overconfident on regulation (+15%).",
  },
  sources: [{ label: "...", url: "..." }],
};
```

**Category enum for `watchList[].category`:** `regulation` / `macro` / `protocol` / `corporate` / `sovereign` / `etf` / `market-structure`.

### `FORECAST_LEDGER` shape (`src/data/forecast-ledger.js`, step 21b)

```js
export const FORECAST_LEDGER = {
  asOf: "SEP 16, 2026",                         // the run that last wrote this file
  summary: {
    nResolved: 32,                              // === sum(resolved[].count) over hit/miss rows (no-resolution rows excluded) === calibration.nResolved
    aggregateBrier: 0.19,                       // all-time mean, 2 decimals (calibration.md "All-time")
    rolling20Brier: 0.17,                       // calibration.md "Last 20 items"
    plain: "…",                                 // ≤45 words, Tier 1 — defines "Brier score" inline in plain words + the headline read
    byCategory: [                               // ONLY categories with N ≥ 3, from the per-category bias table
      { category: "macro", n: 14, meanResidual: 0.26, plain: "…≤30 words: what the sign means (\"we have leaned too optimistic about…\")" },
    ],
    bands: [                                    // the decile calibration curve; every row is a hit or a miss (no-resolution rows are excluded)
      { range: "0–10%", n: 5, hitRate: 0.00 },
    ],
  },
  resolved: [                                   // newest first by resolvedOn
    {
      id: "2026-09-16-fomc-one-and-done",       // stable slug: <resolvedOn ISO>-<topic>
      made: "SEP 13, 2026",                     // asOf of the run that published the forecast
      window: "Sep 16, 2026",
      resolvedOn: "SEP 16, 2026",               // asOf of the run that scored it
      category: "macro",                        // same enum as watchList[].category
      event: "…",                               // the scoring letter for a newcomer, ≤35 words, comparators in words, no bookkeeping
      probability: 0.40,                        // rounded to 0.05; grouped rows: the mean of `probabilities` rounded to 0.05
      outcome: "miss",                          // hit | miss | no-resolution (no-resolution: brier null, count 1, not counted in nResolved or any aggregate)
      brier: 0.16,                              // (p − outcome)²; grouped rows: mean per-forecast Brier; null for no-resolution
      count: 1,                                 // N for a grouped row, then also probabilities: [..N values..]
      lesson: "…",                              // ≤45 words, plain English — "we gave this 15% odds and it happened"
      source: { label: "…", url: "https://…" }, // the primary source the outcome was scored against
    },
  ],
  openCount: 13,                                // rendered watchList rows + memory-only open rows
};
```

Plain-language tiers for the checker: `summary.plain` Tier 1 (cap 45), `byCategory[].plain` Tier 2 (cap 30), `resolved[].lesson` Tier 2 (cap 45, Editor-editable), `resolved[].event` Tier 3 (cap 35, read-only to the Editor — the drafter fixes it).

## Source priority

See `memory/source-reliability.md` for live scoring. Default order: `.gov` → SEC EDGAR → official IR → bitcointreasuries.net → Farside Investors → BIPs → major BTC press (supporting context only).

## Voice

Short-form analysis for a smart newbie. Translate jargon at first use. Plain English. No `BREAKING:`, no clickbait, no emojis. Confident but falsifiable. **Honor every line in `editorial-lessons.md`.**

## Common pitfalls

- **Restating themes instead of synthesizing.** If a paragraph could appear in `MARKET_THEME.narrative`, kill it.
- **Cross-currents that don't actually cross.** Single-theme deep-dives belong in `primaryAnalysis`, not `crossCurrents`.
- **Undated watch items.** Concrete date or tight quarter or it doesn't go in.
- **0.50 probabilities.** A refusal disguised as a forecast. Sharpen the question or commit.
- **Strawman contrarian.** Probability <0.10 means you don't believe it; reframe or cut.
- **Ignoring memory.** If the analysis reads like week 1 every week, the system is broken.
- **Forgetting to score resolutions.** Calibration cannot improve without Brier feedback.
- **Memory bloat.** If total >300 KB, decay rules weren't applied. Re-prune.
- **Overwriting `editorial-lessons.md`.** Hard violation.
- **Aggregator URLs in `sources[]`.** Replace with the underlying primary source.
- **Ledger leak.** `THESIS-004 retires` is a memory sentence, not a dashboard sentence. So are raw Brier decimals, `Fed-INTENT`, `HELD 0.25`, `scored MISS`, "haircut" and "on its letter". Write the lesson in words instead — that version is stronger for every audience.
- **Dropping the plain layer.** `DEEP_ANALYSIS` is replaced in full each run, so a `plain` field you omit is a field that vanishes from the site. `crossCurrents[].plain` is the newest and the easiest to forget.
- **Caps treated as targets.** They are ceilings. A clear 60-word paragraph is finished; do not pad it to 120.
- **Forgetting to rebuild.** `dist/index.html` must match source.

## Memory subsystem

See `memory/INDEX.md` for the orchestrator + decay rules. Active files in the hot path:

- `INDEX.md` (read first)
- `editorial-lessons.md` (user-owned, hard constraints)
- `next-run-briefing.md` (priority TODOs from prior run)
- `calibration.md` (Brier + bias corrections)
- `heuristics.md` (promoted rules)
- `thesis-tracker.md` (active theses + falsification)
- `causal-model.md` (X→Y graph)
- `source-reliability.md` (per-source scoring)
- `theme-interactions.md` (cross-theme interaction matrix + application rules)

Relevance-loaded:
- `themes/<slug>.md` (one per active theme; load only matches)
- `actors/<slug>.md` (one per major actor; load only matches)

Journals (tailed, not bulk-loaded):
- `theme-history.jsonl`
- `watch-list-outcomes.md`
- `contrarian-ledger.md`
- `cross-current-patterns.md`

## Quarterly consolidation

`/consolidate-deep-analysis` runs every ~13 weeks. Distills patterns into heuristics, retires contradicted heuristics, re-bins calibration per category, archives stale theme/actor files. See `automations/consolidate-deep-analysis/README.md`.
