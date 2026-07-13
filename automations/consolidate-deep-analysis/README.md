# consolidate-deep-analysis

Slash command: `/consolidate-deep-analysis`

**Quarterly knowledge-distillation pass** that runs every ~13 weeks. Where `/refresh-deep-analysis` adds to memory each week, this command **synthesizes** memory — promoting durable patterns to heuristics, retiring contradicted ones, re-binning calibration, archiving stale files, and writing a quarterly briefing snapshot.

Without this, memory grows but never gets sharper.

## Refreshes

- `automations/refresh-deep-analysis/memory/heuristics.md` (promotes / retires)
- `automations/refresh-deep-analysis/memory/calibration.md` (per-category re-bin + new bias corrections)
- `automations/refresh-deep-analysis/memory/causal-model.md` (consolidate weak/unused edges)
- `automations/refresh-deep-analysis/memory/cross-current-patterns.md` (archive stale; mature emerging)
- `automations/refresh-deep-analysis/memory/themes/*.md` (mark dormant; archive >52 weeks quiet)
- `automations/refresh-deep-analysis/memory/actors/*.md` (same)
- `automations/refresh-deep-analysis/memory/briefings/YYYY-Q#.md` — new quarterly snapshot (one per run)

**Never** auto-mutates `editorial-lessons.md`. May produce recommendations for it (in the report) for the user to manually adopt.

## Hard scope

- Edit ONLY the files above.
- Don't touch `DEEP_ANALYSIS` in `src/data/deep-analysis.js` (that's `/refresh-deep-analysis`'s job).
- Don't change the schema of any memory file — just promote/retire/re-bin/archive within the existing schemas.
- Don't run more often than quarterly. Distillation needs enough data to be meaningful.

## Workflow

### Phase 1 — Load full memory

1. Read **every** file in `automations/refresh-deep-analysis/memory/` (including all of `themes/` and `actors/`). Unlike weekly runs, no relevance-routing — this is a global review.
2. Read the last quarterly briefing (`briefings/<latest>.md`) if it exists, to understand the prior baseline.

### Phase 2 — Heuristic promotion + retirement

3. **For each candidate heuristic** in `heuristics.md`:
    - Count supporting evidence (run dates cited).
    - Count counter-evidence.
    - **Promote** if ≥3 supporting cycles + <50% counter-evidence ratio.
    - **Retire** if any single decisive contradiction OR persistent counter-evidence ratio >50%.
    - **Keep as candidate** otherwise.
4. **For each promoted heuristic** already in active rotation:
    - Re-test against the last quarter's runs.
    - Retire if newly contradicted.
5. **Look for emerging patterns** in `cross-current-patterns.md` with ≥3 `last observed` bumps over the past quarter. Propose as new candidate heuristics if structural.

### Phase 3 — Calibration re-bin

6. **Aggregate Brier** — recompute rolling-20 and all-time.
7. **Per-category bias** — for each category with N ≥ 8 resolved items, compute mean signed residual `mean(p − outcome)`. If `|residual| ≥ 0.10`, add or refresh a bias correction entry.
8. **Decile reliability** — at N ≥ 30, compute the calibration curve. Surface deviations >0.10 as biases to correct.
9. **Update `calibration.md`** with: new aggregate, new per-category numbers, new bias corrections (or retire ones that are now N=0 or have closed to <0.05 residual).

### Phase 4 — Causal model consolidation

10. **For each edge in `causal-model.md`:**
    - If `last refreshed` >52 weeks AND no supporting evidence in past quarter → weaken to `dormant`.
    - If `last refreshed` >78 weeks → archive (move to `## Archive`).
    - If new evidence accumulated → bump strength (within scale).
    - If contradicting evidence → weaken strength.
11. **Prune duplicate / overlapping edges.** A graph with 100 weak edges is noise; aim for 15–25 well-validated edges.

### Phase 5 — Theme + actor maintenance

12. **For each `themes/<slug>.md`:**
    - If `last updated` >26 weeks: mark `dormant` in INDEX.md.
    - If >52 weeks: move to `themes/_archive/<slug>.md`. Keep readable for future revival.
13. **For each `actors/<slug>.md`:** same.
14. **Cross-check against `theme-history.jsonl` and `MARKET_THEME` history.** If a slug has been the slot-1 theme ≥3 times this quarter, consider promoting it to a "core theme" annotation in INDEX.md.

### Phase 6 — Cross-current pattern lifecycle

15. **Promote** patterns observed ≥3 times in distinct runs → propose as heuristics (Phase 2).
16. **Archive** patterns with `last observed` >26 weeks (move to `## Archived` section).
17. Don't delete; archived patterns can re-emerge.

### Phase 7 — Editorial-lessons recommendations (no auto-mutation)

18. **Read `editorial-lessons.md`.** Count lines + last-active dates.
19. **Recommend** in the report:
    - Lessons that have been honored consistently for 6+ months → suggest user can prune.
    - Patterns observed in user feedback (if e.g., the user has edited several DEEP_ANALYSIS outputs in similar ways) → suggest as new lessons for the user to add.
20. **Never edit the file.** The user adopts recommendations manually.

### Phase 8 — Quarterly briefing snapshot

21. **Write `briefings/YYYY-Q#.md`** — one-pager covering:
    - Aggregate calibration (rolling Brier, top biases).
    - Heuristics promoted / retired this quarter.
    - Causal-model changes (new/strengthened/weakened/archived edges).
    - Theme/actor lifecycle changes.
    - Top-3 narrative shifts over the quarter (consult `theme-history.jsonl`).
    - Open hypotheses worth promoting in next quarter.
    - Recommendations for `editorial-lessons.md` (for user to adopt manually).

### Phase 9 — Report

22. Summarize all of the above to the user in chat. **No code rebuild** — `DEEP_ANALYSIS` doesn't change in a consolidation run.

## Hygiene rules

- **Frequency:** quarterly. Not weekly. Not monthly. Distillation needs enough new data.
- **Conservative on promotion.** Bad heuristics bias priors for months. 3 cycles is the floor, not the ceiling.
- **Aggressive on retirement.** A heuristic that's failed once is suspect; failed twice is dead.
- **Archive, don't delete.** Old patterns / themes / actors / edges may re-emerge. Keep them readable, just out of the hot path.
- **Editorial-lessons is sacred.** Recommendations only.
- **Briefings are forever.** Keep all `briefings/YYYY-Q#.md` files. They're the system's institutional memory.

## When to call

- Roughly every 13 weeks (every ~13 weekly `/refresh-deep-analysis` runs).
- After a major regime shift (e.g., a primary thesis retires, CLARITY Act passes, major calibration milestone hit) — even off-cycle.
- Manually if the user notices memory bloat or stale patterns.

## Common pitfalls

- **Running too often.** Distillation without data points is noise.
- **Over-promoting.** Promoting on 2 cycles bakes in bias.
- **Under-retiring.** Holding onto failed heuristics because they used to work.
- **Auto-editing `editorial-lessons.md`.** Hard violation.
- **Not writing the briefing snapshot.** The snapshot IS the institutional memory.
- **Skipping the causal-model pass.** Weak edges compound into noise; prune them.
