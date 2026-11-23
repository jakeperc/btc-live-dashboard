# Deep Analysis — Analyst Memory Index (v2)

Persistent context for `/refresh-deep-analysis`. Read at the start of every run, written to at the end. Time-decayed, relevance-routed. No other automation touches this directory.

**Design philosophy:** the memory is **knowledge** (what we believe), **calibration** (how often we're right), and **active retrieval** (pull what's relevant per run) — not just journals.

## Read flow (Phase 1 of every run)

### Always load (the hot path — ~6 files, ~10–15 KB)

1. **This file** (`INDEX.md`) — orchestrator + decay rules.
2. **`editorial-lessons.md`** — **user-owned**, hard constraints for this run.
3. **`next-run-briefing.md`** — priority TODOs left by the previous run (scoring deadlines, hypotheses to test, theses due for falsification check, stale theme files). **Start the run by working through this.**
4. **`calibration.md`** — current Brier scores + bias detection ("you over-estimate regulatory follow-through by ~18%"). Used as a prior against today's draft.
5. **`heuristics.md`** — distilled rules promoted by the quarterly consolidation pass.
6. **`thesis-tracker.md`** — active primary theses + their falsification conditions + current status.

### Read-with-relevance (warm path — load only matches)

7. **`themes/*.md`** — load only the theme files whose `slug` matches a theme currently in `MARKET_THEME` + `CURATED_MARKET_UPDATES`. Typically 4–6 files.
8. **`actors/*.md`** — load only the actor files whose `slug` matches an actor materially named in this week's themes. Typically 3–8 files.
9. **`causal-model.md`** — load fully (it's small) but focus on edges whose nodes are in this week's themes/actors.
10. **`source-reliability.md`** — load fully; use to weight which primary sources to validate against this week.

### Tail (the journals — for context, not as primary input)

11. **`theme-history.jsonl`** — tail the last ~8 entries for narrative arc.
12. **`watch-list-outcomes.md`** — read unresolved items whose `window` has elapsed (score in Phase 1 work; write in Phase 5).
13. **`cross-current-patterns.md`** — load active patterns; archived section can be skimmed.
14. **`contrarian-ledger.md`** — read unresolved items whose `resolution-window` has elapsed.

## Write flow (Phase 5 of every run, after writing `DEEP_ANALYSIS`)

1. **Append to `theme-history.jsonl`** — current run snapshot.
2. **Score + append in `watch-list-outcomes.md`** — compute Brier score per resolved item; append new items with their probabilities.
3. **Score + append in `contrarian-ledger.md`** — same.
4. **Update `cross-current-patterns.md`** — bump `last observed` on matches; add novel + structural patterns.
5. **Update `thesis-tracker.md`** — check active theses against their `falsificationConditions`; flag any for retirement; add the new run's primary thesis.
6. **Update `causal-model.md`** — refine link strengths from this week's evidence; add new edges; weaken contradicted edges.
7. **Update `source-reliability.md`** — note which sources surfaced material new info this week.
8. **Update `calibration.md`** — recompute aggregate Brier; re-bin per-category (regulation / macro / protocol / corporate / sovereign); update bias estimates if N ≥ threshold.
9. **Update or create `themes/<slug>.md`** — for each theme in the current top 5, append dated facts; refine status; add open questions.
10. **Update or create `actors/<slug>.md`** — same for materially-mentioned actors.
11. **WRITE (replace, not append) `next-run-briefing.md`** — prioritized to-do list for the next run.
12. **Apply decay rules** (below). **Confirm total memory directory size <300 KB after pruning.**

## Files & decay rules

| File / dir | Format | Decay |
|---|---|---|
| `INDEX.md` | Markdown | Manual only |
| `editorial-lessons.md` | Markdown | **User-owned — never auto-mutate** |
| `next-run-briefing.md` | Markdown | Overwritten every run (no decay) |
| `calibration.md` | Markdown | Append-only summary log; entries >52 weeks pruned |
| `heuristics.md` | Markdown | Promoted/retired by `/consolidate-deep-analysis`. Retired heuristics stay in an `## Retired` section for audit |
| `thesis-tracker.md` | Markdown | Active theses live indefinitely. Retired theses move to `## Retired` for ≤26 weeks, then pruned |
| `causal-model.md` | Markdown | Edges with `last refreshed` >52 weeks → weaken to `dormant`; >78 weeks → archive |
| `source-reliability.md` | Markdown | Per-source rolling 26-week window |
| `theme-history.jsonl` | JSONL | >26 weeks → prune |
| `watch-list-outcomes.md` | Markdown table | >26 weeks → archive (keep audit trail) |
| `cross-current-patterns.md` | Markdown | `last observed` >26 weeks → archive |
| `contrarian-ledger.md` | Markdown | >52 weeks → prune |
| `themes/<slug>.md` | Markdown | No edits >26 weeks → mark `dormant` in INDEX; manual archive after 52 weeks |
| `actors/<slug>.md` | Markdown | Same as themes |

## Core themes (annotated at the Q3 2026 consolidation)

Slot-1 category / theme-file activity across the 17 MAY 18 – SEP 26, 2026 runs:

- **`etfs`** — slot-1 category (as ETFs / MARKETS) in 14 of 17 runs. The dominant recurring theme of the project; its theme file and the `etf-net-inflows → spot-price-pressure` edge are effectively always-hot-path, relevance-routing notwithstanding.
- **`corporate-treasuries`** — never slot-1 by category, but a top-5 fixture in every run since MAY 18 (either as a card or as the secondary anchor of the slot-1 narrative, e.g. "…Bounded Corporate Leak"). Pairs tightly with `etfs` per `heuristics.md` #1–#3.
- **`fed-monetary-policy`** — slot-1 twice (SEP 13, SEP 16) but a top-5 or matrix-row presence in nearly every run since JUN. The macro backdrop for almost every other theme's probability.
- **`exchange-security`** (NOV 2 – NOV 9) — slot 1 on the Binance theft for one run; OUT from NOV 9 (the discount was a one-week driver); matrix deltas assigned (→ clarity +0.02, → policy +0.03) and KEPT; **ARCHIVED NOV 16** (`../memory-archive/themes/`) — RESTORE on a second major-exchange failure or Binance's full post-incident report.

Treat these three as the default relevance-load even when a given week's `MARKET_THEME`/`CURATED_MARKET_UPDATES` slugs don't obviously name them — they are rarely irrelevant to the primary thesis.

## Consolidation log

- **SEP 26, 2026 — first-ever `/consolidate-deep-analysis` pass** (covering the full MAY 18 – SEP 26 project history; overdue since ~AUG 17). 5 heuristics promoted, 2 retired (`heuristics.md`); theme-interaction matrix rules adopted (category floor/cap respected, excluded-theme sympathy nudge zeroed, fed↔etfs delta 0.10→0.07 — `theme-interactions.md`); calibration MATRIX bias correction formalized (`calibration.md`); "Manager fragmentation" cross-current moved to Archived; several files condensed for headroom. Full report: `briefings/2026-Q3.md`. Next due ~13 weeks out (~late Dec 2026) or sooner on a regime shift.

## Archived files (moved out of `memory/` to stay under the 300 KB cap)

- **NOV 23, 2026:** TWO files moved to `../memory-archive/actors/`: `sec.md` (not loaded since OCT 24 — RESTORE on the custody rule's adoption, a Regulation Crypto Assets final rule, or an SEC nomination) and `strive.md` (not loaded NOV 23 — RESTORE on a SATS tranche, a Strive coin sale, or SATS sustainably <$90; `themes/corporate-treasuries.md` carries the cohort line). Directory 298.3 KB at the start of the run and 315.7 KB after the writes (cap 300,000 bytes); decay applied by the two moves, by trimming the NOV 23 journal entry and the briefing, and by condensing in place as the writes landed: `calibration.md` (the NOV 16 run-history row → one line), `watch-list-outcomes.md` (the NOV 16 resolved lessons → stubs; the NOV 16 housekeeping replaced), `thesis-tracker.md` (the NOV 16 decomposition/evidence replaced), `causal-model.md` (NOV 16 texts inside refreshed edges; the Regulation edges trimmed), `cross-current-patterns.md` (NOV 16 texts inside bumped entries), `contrarian-ledger.md` (the NOV 16 original → one paragraph), `theme-interactions.md` (the NOV 16 stamp → one line), `heuristics.md` (#3's evidence block → a Retired stub), `theme-history.jsonl` (the NOV 16 entry truncated), the five theme files and `actors/strategy-mstr.md` / `fed.md` / `blackrock.md` (NOV 16 statuses → ~400 chars; blackrock's NOV 9 bullet → one line), this log (the NOV 16 entry → this line). Other restore triggers unchanged: `exchange-security` (a second major-exchange failure / Binance's report), `sovereign-reserves` (a sovereign event / H.R. 8957 on the floor; the 0.20 row scores Dec 31), `cftc.md` (the CTX NPRM / the Dec 14 record), `trump-admin.md` (a Witt successor), `fidelity.md` (an FBTC-led week outside stress). Next to condense: `source-reliability.md`'s long-tail rows (bitbo, bernama/equiti, thedefiant), `watch-list-outcomes.md`'s pre-SEP 26 Resolved rows, `causal-model.md`'s Sovereign/Protocol sections.
- **NOV 16, 2026 (condensed NOV 23; git):** THREE files moved to `../memory-archive/`: `themes/exchange-security.md`, `themes/sovereign-reserves.md`, `actors/cftc.md` (restore triggers above). 295.1 KB → 313.4 KB after writes → condensed in place to ~298 KB (calibration run-history, watch-list stubs, journals, theme/actor NOV 9 statuses, the OCT log entries).
- **NOV 9, 2026 (condensed NOV 16; git):** no files moved; `actors/trump-media.md` CREATED. Directory 304.6 KB at the start (over the cap); condensed in place (`causal-model.md` Macro arcs, `source-reliability.md` per-run cells, `cross-current-patterns.md`, journals, the six theme files).
- **NOV 2, 2026 (condensed NOV 16; git):** no files moved; `themes/exchange-security.md` CREATED (novel; 0.00 deltas). Directory 299.9 KB at the start; condensed in place (`thesis-tracker.md`, `contrarian-ledger.md`, `watch-list-outcomes.md`, `calibration.md`, journals, theme files).
- **OCT 7 – OCT 24, 2026 (condensed NOV 16; git):** OCT 7 `themes/liquid-sidechain.md` → `../memory-archive/` (RESTORE on a second bug or a peg-out reopening). OCT 16 `actors/msci.md` CREATED (306.5 KB at the start; condensed in place; hygiene rule 7 added). OCT 24 `actors/strive.md` CREATED; `themes/sovereign-reserves.md` ACTIVE but out of the top-5 (the H.R. 8957 row memory-only; restore triggers in its status line); 322 KB after writes → condensed to just under 300 KB.
- **SEP 26, 2026 (condensed OCT 7; git):** `themes/sovereign-reserves.md` and `actors/cftc.md` RESTORED (triggers fired: H.R. 8957 reported 28–21; the CFTC pre-rule to OIRA); `themes/protocol-security.md` (RESTORE on a consensus/BIP event or a new adjacent-layer incident) and `actors/senate-banking.md` (RESTORE if a lame-duck CLARITY vote is noticed) moved to `../memory-archive/`; journals and several theme/actor files condensed. Still archived: `trump-admin.md` (restore on a White House move on the CFTC rules or a lame-duck push), `fidelity.md` (restore on an FBTC-led WEEK outside stress), `spacex.md`, `japan-fiea.md`.

- **JUN 28 – SEP 16, 2026 (condensed SEP 26; full log in git):** JUN 28 archived `cftc.md`, `sec.md`, `senate-banking.md`, `trump-admin.md` (cap pressure; quiet actors). AUG 7 archived `themes/sovereign-reserves.md` + `actors/fidelity.md` (cap at 323 KB) with restore triggers (a sovereign event; an FBTC-led week outside stress). AUG 19 RESTORED `sec.md` (Regulation Crypto Assets). SEP 13 RESTORED `senate-banking.md` (the cloture vote noticed); CREATED `themes/fed-monetary-policy.md` + `themes/liquid-sidechain.md`; condensed the journals and theme/actor files to arc summaries. SEP 16 no moves; `us-crypto-policy.md` back on active watch.

## Hard rules

1. **`editorial-lessons.md` is user-owned.** Read it every run; never overwrite it. The user hand-edits this file with feedback.
2. **Memory writes are part of the run.** Failing to write memory in Phase 5 = the run is incomplete.
3. **Total directory size must stay <300 KB** after decay rules applied. If still over, archive the longest-quiet theme/actor files.
4. **Probabilities are mandatory** on every `watchList` item, every `contrarianTake`, and every `primaryAnalysis.thesis`. Calibration cannot improve without explicit numbers.
5. **No other automation touches this directory.** `/refresh-market-news`, `/refresh-headlines-archive`, etc., must not read or write here.
6. **Relevance-routed loading is mandatory** — don't load all themes/actors every run. Use the slug-match step.

## Probability discipline

- Calibration improves with explicit estimates + feedback. **Every** prediction carries `p ∈ [0,1]` rounded to 0.05.
- After resolution, compute **Brier score** = `(p - outcome)²` where outcome ∈ {0, 1}. There is no partial credit; a row the event text genuinely cannot decide is `no-resolution` and is excluded from all Brier and calibration math.
- Aggregate Brier <0.20 = decent, <0.10 = strong, <0.05 = elite. Compute rolling over last 20 resolved items.
- Per-category bias: track signed residual `p - outcome` per theme category. Surface in `calibration.md` once N ≥ 8 per category.
- **The model is allowed to reason from `calibration.md` priors in Phase 3.** If calibration says "you over-estimate regulatory follow-through by 18%," apply a haircut to today's regulatory probabilities.

## Consolidation

Quarterly (~every 13 runs): `/consolidate-deep-analysis` runs and:
- Distills recurring patterns from `cross-current-patterns.md` into heuristics.
- Retires heuristics that have been contradicted.
- Re-bins calibration per theme category.
- Archives stale theme/actor files.
- Surfaces recommendations for `editorial-lessons.md` (user-approved adoption only).
- Writes a `briefings/YYYY-Q#.md` snapshot in `briefings/`.

## Briefings archive

Quarterly briefings live in `briefings/`. Briefings **older than 12 months** are moved to `briefings/archive/`. `/refresh-deep-analysis` should NOT load anything from `briefings/archive/` during its routine relevance-load — those are for retrospective audit only. `/consolidate-deep-analysis` handles the move during its quarterly pass.

When relevance-load needs a deep historical pattern (rare), it may open a specific archived briefing by name, but archives are not part of the default warm path.

## What memory is FOR

- **Compounding knowledge.** Each run adds dated facts, refines causal models, updates theme/actor profiles.
- **Calibration.** Brier scoring forces honest probabilities and surfaces biases.
- **Continuity.** Don't redefine themes we've been tracking. Don't propose the same contrarian take repeatedly.
- **Active retrieval.** Pull what's relevant per run, don't pollute context with stale material.
- **Self-discipline.** Heuristics + thesis tracker + falsification conditions = anti-confirmation-bias scaffolding.

## What memory is NOT FOR

- Re-litigating the current themes (those live in `MARKET_THEME` / `CURATED_MARKET_UPDATES`).
- Storing full text of past `DEEP_ANALYSIS` values (git history).
- Long essays. Each memory file is structured + terse.
- User-level facts about the operator.
