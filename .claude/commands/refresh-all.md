---
description: Orchestrator — cadence-gated parallel sub-agents (market-news on Fable 5.1, adoption + headlines-archive on Sonnet 5.5, fallbacks on Haiku) + Fable 5.1 deep-analysis (fires as soon as market-news completes), Opus 5.5 Editor, single rebuild at end
---

You are the **Orchestrator** for the BTC Live Dashboard refresh suite.

## Step 1 — Read context

1. `SCOPE.md` (full file).
2. `automations/README.md` — roster + universal rules.
3. `automations/refresh-all/README.md` — orchestrator-specific rules.
4. `automations/refresh-all/run-manifest.json` — last-run timestamps per agent (read if exists; if missing, treat all agents as due).

Read sub-playbooks only for agents that pass the cadence gate in Step 2 — skip the rest.

## Step 2 — Cadence gate (pre-spawn)

Using `run-manifest.json`, compute days since each agent last ran. Spawn only agents that meet or exceed their threshold. If the manifest doesn't exist, all agents are due.

**Only the agents in the table below are cadence-gated.** Ignore any other key in `agents` — `plain-language` is recorded there for audit only and is event-gated in Step 4.5, never scheduled here.

| Agent | Threshold | Cadence |
|---|---|---|
| `fallbacks` | 30 days | Monthly (last-resort constants) |
| `adoption` | 6 days | Weekly, Monday anchor |
| `market-news` | 6 days | Weekly, Monday anchor |
| `headlines-archive` | 25 days | Monthly (curated archive only) |
| `deep-analysis` | 6 days | Weekly, Monday anchor (chains after market-news) |

The editorial cadence is **Monday morning weekly** for adoption, market-news, and deep-analysis. The threshold is set to 6 days (not 7) so Monday-to-Monday always opens the gate even if the prior run started slightly later in the morning. Each agent's playbook also has its own **significance gate** that decides whether the polled work actually produces an edit — at weekly cadence the gate will rarely close, but it stays in place as a safety net (esp. for mid-week force-runs).

For genuinely major mid-week news, **force-run** with `/refresh-all <hint>` (e.g. `/refresh-all SEC approved BTC options ETF`). The concrete trigger list lives in `automations/refresh-all/README.md` § "Mid-week force-run triggers".

If $ARGUMENTS names a specific agent or table (e.g. "force:fallbacks", "MSTR filed 8-K"), override the gate for that agent.

Report which agents are due and which are skipped **before spawning anything**.

## Step 3 — Launch Phase 1 agents (background, parallel)

Spawn all due Phase 1 agents in a single message with `run_in_background: true` — `model: haiku` for Agent 1 (Fallbacks); `model: sonnet` (Sonnet 5.5) for Agents 2 and 4 (Adoption, Headlines Archive — both are fact-verification jobs); `model: fable` (Fable 5.1) for Agent 3 (Market News). Agents not due are skipped entirely — do not spawn them.

Every agent prompt must include: **`SKIP REBUILD — the orchestrator runs npm run build once at the end.`**

**Agent 1 — Fallbacks (if due, `model: haiku`, `run_in_background: true`)**
Read `automations/refresh-fallbacks/README.md`, then `src/data/fallbacks.js`. Fetch current BTC price, ATH, block height, and mined supply from primary sources. Update the five constants (`FALLBACK_MINED`, `FALLBACK_BLOCK`, `FALLBACK_PRICE`, `FALLBACK_ATH`, `FALLBACK_ATH_DATE`) in `src/data/fallbacks.js`. Sanity-check: ATH ≥ price, block strictly increases, mined between 19.5M–21M. Use narrow `Edit` anchored on constant names. Report old → new for each. SKIP REBUILD.

**Agent 2 — Adoption (if due, `model: sonnet` / Sonnet 5.5, `run_in_background: true`)**
Read `automations/refresh-adoption/README.md`, then `src/data/adoption.js`. Check internal cadence gates per-table — skip tables not due. Update due constants. Re-sort `COMPANY_HOLDINGS` and `COUNTRY_HOLDINGS` by `btc` descending after any row change. Use narrow `Edit` calls. Report per-table: skipped/updated, row delta, top-3 changes, sort verified. SKIP REBUILD.

**Agent 3 — Market News (if due, `model: fable` / Fable 5.1, `run_in_background: true`)**
Read `automations/refresh-market-news/README.md`, then `src/data/market-news.js` and the `HISTORICAL_HIGHLIGHTS` block of `src/data/headlines.js`. Follow the 5-phase playbook. Update `MARKET_THEME`, `CURATED_MARKET_UPDATES`, `FALLBACK_NEWS`, `HISTORICAL_HIGHLIGHTS`. After all edits, write `automations/refresh-market-news/last-run-artifacts.md` with the primary URLs + key facts validated this run. Report slot changes and HISTORICAL_HIGHLIGHTS delta. SKIP REBUILD.

**Agent 4 — Headlines Archive (if due, `model: sonnet` / Sonnet 5.5, `run_in_background: true`)**
Read `automations/refresh-headlines-archive/README.md`, then `src/data/headlines.js`. Curate `SIX_MONTH_HIGHLIGHTS` (exactly 10 items, all `important: true`, window: older than 4 weeks, younger than ~6 months, no overlap with `HISTORICAL_HIGHLIGHTS`). Rank by lasting impact. Use narrow `Edit` anchored on the constant. Report items promoted, dropped, added. SKIP REBUILD.

## Step 4 — Fire deep-analysis the moment market-news completes

Do **not** wait for Agents 1, 2, or 4. As soon as the market-news completion notification arrives, immediately spawn Agent 5. The other Phase 1 agents continue running in the background.

If market-news was skipped (not due): check whether `automations/refresh-market-news/last-run-artifacts.md` was written within the last 7 days. If fresh, proceed immediately. If stale or missing, note it in the final report but still proceed.

If deep-analysis is not due (cadence gate) and market-news was not force-targeted, skip Agent 5. **Note:** when deep-analysis fires only because market-news was force-targeted (i.e., deep-analysis was not itself due on cadence), it is treated as a force-run for manifest purposes — its timestamp does NOT bump (see Step 5).

**Agent 5 — Deep Analysis (if due, `subagent_type: deep-analyst` — Fable 5.1, pinned as `claude-fable-5-1` in `.claude/agents/deep-analyst.md`; do not pass `model`, which would override the pin)**
Follow the refresh-deep-analysis v2 5-phase playbook in full. Load memory files per `automations/refresh-deep-analysis/memory/INDEX.md` order. Read `automations/refresh-market-news/last-run-artifacts.md` instead of re-fetching those sources. Use **extended thinking** for the Phase 3 synthesis pass. Apply Brier scoring to resolved items. Update all auto-mutable memory files. Stay under 300 KB total memory directory size. SKIP REBUILD.

## Step 4.5 — Plain-language pass (the Editor)

Runs **after every agent above has finished** — including `headlines-archive` and `adoption`, which write files the checker imports — and **before** the build in Step 5. Do not start it while anything is still running: the snapshot in 4.5.2 must capture a settled tree.

**4.5.1 — Decide whether it runs.** Detect changes mechanically, not from agent reports:

```
git status --porcelain src/data
```

Run the Editor if that lists any file, or if `$ARGUMENTS` contains `force:plain-language`. Otherwise skip it and report `plain-language: skipped — no prose changed`. A deep-analysis run whose significance gate closed writes only memory files, so it correctly does not trigger the Editor.

**4.5.2 — Snapshot before the edit.**

```
npm run check:plain -- --snapshot
```

This writes `automations/refresh-plain-language/.invariants-<timestamp>.json` — the per-card numeric fingerprint plus a full copy of each data file, which is the restore source if the Editor drifts a fact. Always through `npm run`: a bare `node scripts/...` call needs a permission the unattended Monday run does not have, and a permission prompt at 04:00 stalls the whole pipeline.

**4.5.3 — Agent 6 — Editor (`subagent_type: plain-language-editor`, foreground — Opus 5.5 at `effort: high`, pinned as `claude-opus-5-5` in the agent file; do not pass `model`, which would override the pin).**

> Read `automations/refresh-plain-language/README.md`, then `SCOPE.md` § "Audience & plain-language standard", `automations/refresh-plain-language/reader-feedback.md`, `house-dialect.txt`, `src/data/glossary.js`, and `automations/refresh-plain-language/last-check.md`. Then read ONLY these changed files: `<list from 4.5.1>`. **Do NOT read `automations/refresh-deep-analysis/memory/` or `automations/refresh-market-news/last-run-artifacts.md`** — the value of this pass is that you cannot. Rewrite rendered prose in place per the playbook: consequence first, define at first use, probability band phrases, longest sentence under 45 words. Never add a fact, number or source; never touch a read-only field; leave compliant fields byte-identical. Replace `automations/refresh-plain-language/drafter-notes.md`. Verify with `npm run check:plain -- --verify`. SKIP REBUILD — the orchestrator runs npm run build once at the end.

Under `force:plain-language` no writer has run, so 4.5.1 yields nothing: pass **all** prose files instead — `src/data/deep-analysis.js` and `src/data/market-news.js`, plus `src/data/adoption.js` only if the hint names adoption.

Forward `$ARGUMENTS` to the Editor. It acts on free text only when prefixed `reader:`, so a news hint broadcast to every agent is not misread as a comprehension complaint.

**4.5.4 — Cold-read comprehension test (`model: haiku`).** The only check that measures understanding rather than length. Spawn a context-free agent given nothing but the rendered Tier 1 and Tier 2 text — no playbooks, no memory, no glossary:

> For each card below, answer in one sentence each: (1) What happened? (2) Why does it matter to somebody who owns Bitcoin? (3) What would change the author's mind? If you cannot answer from the text alone, say so and quote the sentence that lost you.

Compare against the Editor's intended answers. Cards that fail go back to the Editor **once**; whatever still fails goes into `drafter-notes.md` for next week's writer. This replaces waiting for the owner to notice and type something.

**4.5.5 — Verify.**

```
npm run check:plain -- --verify
```

Act on the exit code — the distinction matters, because one of these ships a broken page:

| Exit | Meaning | Action |
|---|---|---|
| 0 / 1 | clean, or style only | proceed to Step 5 |
| **2** | hard prose findings in Editor-editable fields | re-spawn the Editor **once** with `last-check.md` as its hint, then **build regardless** and put the residue in the report. Never block the weekly publish on style. |
| **3** | **structural** — import failure, missing render-critical key, bad enum, glossary integrity, or numeric drift | **do NOT build.** Restore the affected file wholesale from the snapshot copy, re-run the check. Still 3 → `git checkout -- src/data/<file>` to ship last week's working content. Then build, and lead the report with the restore. |

A rule-20 numeric-drift finding means the Editor changed a figure it was not allowed to change. Restore; do not negotiate with it. If the snapshot is missing or more than 12 hours old the checker refuses to verify and exits 3 **without** restoring — a stale snapshot would silently revert this week's writer output to last week's.

## Step 5 — Rebuild + update manifest + unified report

After all running agents (Phase 1 + deep-analysis) have completed:

1. `npm run build` (or the codex `node scripts/build.mjs` fallback if npm isn't on PATH). **Skip the rebuild entirely if no agent wrote any source edits** — `dist/index.html` is already in sync. An Editor pass in Step 4.5 counts as a source edit. **If Step 4.5 ended on exit 3 and the restore did not clear it, do not build at all** — ship the previous `dist/` and lead the report with the failure.
2. Write/update `automations/refresh-all/run-manifest.json` — set `last-run` to now; update `agents.<name>` to now ONLY for agents that ran as part of the **regular cadence sweep** (their cadence gate opened on its own). **Agents that ran solely because of a `$ARGUMENTS` force-target override do NOT bump their timestamp** — this preserves the Monday cadence regardless of how many mid-week force-runs occur. Agents that polled-but-skipped-via-significance-gate still bump (they did the cadence work). The deep-analysis follow-on rule from Step 4 inherits this: if deep-analysis fired only because market-news was force-targeted, its timestamp also does not bump. Preserve prior timestamps for cadence-skipped agents.
3. Set `agents.plain-language` to now whenever the Editor actually edited (including under `force:`). It is audit-only — Step 2 never reads it, and the force-run rule above does not apply to it.
4. Unified report: per-agent skipped (cadence gate) / polled-but-no-edits (significance gate) / updated (cadence) / force-run (no manifest bump), key changes, rebuild result. Plus a **readability section**: `check:plain` exit code, fields the Editor touched, every substantive cut, cold-read failures, and **edit volume** (fields touched, words changed). Edit volume is the convergence metric — if it has not fallen across four Mondays, the writer prompts are the bug, and say so rather than letting the Editor keep patching output.

Manifest format:
```json
{
  "last-run": "2026-05-19T10:30:00Z",
  "agents": {
    "fallbacks": "2026-03-15T10:30:00Z",
    "adoption": "2026-05-19T10:30:00Z",
    "market-news": "2026-05-19T10:30:00Z",
    "headlines-archive": "2026-04-20T10:30:00Z",
    "deep-analysis": "2026-05-19T10:30:00Z"
  }
}
```

## Hard constraints

- All hard-scope rules from every sub-command apply. Never touch Thesis, Strategy, live-API code, URL constants, or anything in `SCOPE.md` § "Out of scope".
- Each agent edits only its owned file: `src/data/fallbacks.js`, `src/data/adoption.js`, `src/data/market-news.js` + `src/data/headlines.js`, `src/data/deep-analysis.js`. No agent reads `src/BitcoinDashboard.jsx`.
- **Suppress all per-agent rebuilds.** Run `npm run build` exactly ONCE at the end.
- **The Editor (Step 4.5) is the one agent that edits across owners.** It rewrites prose values in `market-news.js`, `deep-analysis.js` and `adoption.js`, and replaces `drafter-notes.md`. It touches no other key, edits no other file, and **never reads `automations/refresh-deep-analysis/memory/`** — that prohibition is the point of the pass and is verified by tool-call audit in the report.
- **Every prose-writing agent runs `npm run check:plain -- --file <its own file>`** before finishing, fixes hard findings once, re-runs once, then proceeds. No agent loops on the checker, and the weekly publish is never blocked on style.
- If a Phase 1 agent fails a sanity check it cannot resolve, log the failure, exclude it from the manifest update, and continue with remaining agents.

If $ARGUMENTS is non-empty, forward it to all due agents as an editorial hint / force-target. Force-targets override cadence gates for their named agent or table.
