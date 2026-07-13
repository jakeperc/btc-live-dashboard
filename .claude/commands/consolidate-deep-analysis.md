---
description: Quarterly memory distillation — promote heuristics, retire contradicted ones, re-bin calibration, archive stale, write quarterly briefing
---

You are the **Memory Steward** for `/refresh-deep-analysis`. This is the quarterly distillation pass — knowledge synthesis, not weekly accumulation.

## Refreshes

- `automations/refresh-deep-analysis/memory/heuristics.md` — promote/retire
- `automations/refresh-deep-analysis/memory/calibration.md` — per-category re-bin + new bias corrections
- `automations/refresh-deep-analysis/memory/causal-model.md` — consolidate weak/unused edges
- `automations/refresh-deep-analysis/memory/cross-current-patterns.md` — archive stale; mature emerging
- `automations/refresh-deep-analysis/memory/themes/*.md` + `actors/*.md` — mark dormant / archive
- **NEW** `automations/refresh-deep-analysis/memory/briefings/YYYY-Q#.md` — quarterly snapshot

**Never** auto-mutates `editorial-lessons.md` (user-owned).

## Read first

1. `automations/refresh-deep-analysis/memory/INDEX.md` — orchestrator + decay rules.
2. `automations/consolidate-deep-analysis/README.md` — full 9-phase playbook.
3. **Every** file in `automations/refresh-deep-analysis/memory/` (including all of `themes/` and `actors/`). No relevance-routing — this is a global review.
4. Most recent `briefings/<latest>.md` (if any).
5. `SCOPE.md` § "Out of scope".

## Hard constraints

- Edit only memory files in `automations/refresh-deep-analysis/memory/`. Don't touch `DEEP_ANALYSIS`, no rebuild.
- Never auto-mutate `editorial-lessons.md` — recommendations only, surfaced in the report.
- Conservative on promotion (3-cycle floor). Aggressive on retirement (single decisive contradiction).
- Archive, don't delete.
- Write the quarterly briefing snapshot — it's the institutional record.

## Now do it

Follow the 9-phase playbook end-to-end:

1. Load full memory (no relevance-routing).
2. Heuristic promotion + retirement.
3. Calibration re-bin (per-category bias + decile reliability if N ≥ 30).
4. Causal-model consolidation (weaken/archive dormant; strengthen evidenced).
5. Theme + actor lifecycle (mark dormant >26w; archive >52w).
6. Cross-current pattern lifecycle.
7. Editorial-lessons recommendations (report only, never edit).
8. Write `briefings/YYYY-Q#.md` snapshot.
9. Report.

Report:
- Heuristics promoted / retired with cited evidence.
- Calibration changes (new aggregate Brier, new biases).
- Causal-model deltas (edges added/strengthened/weakened/archived).
- Theme/actor lifecycle changes.
- Top-3 narrative shifts over the quarter.
- Open hypotheses worth promoting next quarter.
- Recommendations for `editorial-lessons.md` (user adopts manually).
- Briefing file path.

`$ARGUMENTS` may include a quarter override (e.g., `2026-Q2`) or "force-rerun" if running off-cycle after a regime shift.
