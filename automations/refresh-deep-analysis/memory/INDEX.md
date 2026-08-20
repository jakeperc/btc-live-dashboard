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

## Archived files (moved out of `memory/` to stay under the 300 KB cap)

- **JUN 28, 2026:** `actors/cftc.md`, `actors/sec.md`, `actors/senate-banking.md`, `actors/trump-admin.md` moved to `../memory-archive/actors/` under INDEX hard rule #3 (longest-quiet actor files; zero material updates since MAY 18, no role in current themes). They are NOT in the routine warm-path load. **Restore to `actors/` if its actor re-enters a current theme materially** (e.g., CLARITY re-couples → `senate-banking.md`/`trump-admin.md`; a CFTC/SEC jurisdiction action lands). Audit trail preserved in the archive dir + git history.
- **AUG 7, 2026:** `themes/sovereign-reserves.md` + `actors/fidelity.md` moved to `../memory-archive/` under hard rule #3 (cap pressure at 323 KB after the mid-week run's writes; sovereign-reserves out of the top-5 since JUL 19 with no sovereign event since; fidelity unloaded 3 consecutive runs, FBTC appearing only as flow line-items). **Restore `sovereign-reserves.md` on any sovereign reserve/drawdown event** (Argentina/Pakistan IMF watch, Bhutan, a G20 announcement); **restore `fidelity.md` if a within-complex composition divergence re-opens outside a stress window** (note AUG 19: the −$390M week was FBTC-led, but inside a whipsaw window — one more FBTC-led week outside stress = restore).
- **AUG 19, 2026:** `actors/sec.md` **RESTORED** from `../memory-archive/actors/` — the documented restore trigger fired (a major SEC action: proposed Regulation Crypto Assets, Aug 18 — the agency's first comprehensive crypto rulebook; the SEC is now a primary driver of the slot-1 theme `us-crypto-policy`). `cftc.md`, `senate-banking.md`, `trump-admin.md` remain archived — candidates to restore next run: `senate-banking.md` when the Sep 15–16 cloture is formally NOTICED on the floor schedule; `trump-admin.md` if presidential engagement escalates beyond the Aug 19 "fair version" push (e.g., a White House answer to Gallego–Tillis); `cftc.md` if the Aug 20 Innovation Advisory Committee readout is material.

## Hard rules

1. **`editorial-lessons.md` is user-owned.** Read it every run; never overwrite it. The user hand-edits this file with feedback.
2. **Memory writes are part of the run.** Failing to write memory in Phase 5 = the run is incomplete.
3. **Total directory size must stay <300 KB** after decay rules applied. If still over, archive the longest-quiet theme/actor files.
4. **Probabilities are mandatory** on every `watchList` item, every `contrarianTake`, and every `primaryAnalysis.thesis`. Calibration cannot improve without explicit numbers.
5. **No other automation touches this directory.** `/refresh-market-news`, `/refresh-headlines-archive`, etc., must not read or write here.
6. **Relevance-routed loading is mandatory** — don't load all themes/actors every run. Use the slug-match step.

## Probability discipline

- Calibration improves with explicit estimates + feedback. **Every** prediction carries `p ∈ [0,1]` rounded to 0.05.
- After resolution, compute **Brier score** = `(p - outcome)²` where outcome ∈ {0, 1} (`partial` = 0.5).
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
