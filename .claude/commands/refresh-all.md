---
description: Orchestrator — cadence-gated parallel sub-agents (market-news on Fable 5, others Haiku) + Fable 5 deep-analysis (fires as soon as market-news completes), single rebuild at end
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

Spawn all due Phase 1 agents in a single message with `run_in_background: true` — `model: haiku` for Agents 1, 2 and 4; `model: fable` (Fable 5) for Agent 3 (Market News). Agents not due are skipped entirely — do not spawn them.

Every agent prompt must include: **`SKIP REBUILD — the orchestrator runs npm run build once at the end.`**

**Agent 1 — Fallbacks (if due, `model: haiku`, `run_in_background: true`)**
Read `automations/refresh-fallbacks/README.md`, then `src/data/fallbacks.js`. Fetch current BTC price, ATH, block height, and mined supply from primary sources. Update the five constants (`FALLBACK_MINED`, `FALLBACK_BLOCK`, `FALLBACK_PRICE`, `FALLBACK_ATH`, `FALLBACK_ATH_DATE`) in `src/data/fallbacks.js`. Sanity-check: ATH ≥ price, block strictly increases, mined between 19.5M–21M. Use narrow `Edit` anchored on constant names. Report old → new for each. SKIP REBUILD.

**Agent 2 — Adoption (if due, `model: haiku`, `run_in_background: true`)**
Read `automations/refresh-adoption/README.md`, then `src/data/adoption.js`. Check internal cadence gates per-table — skip tables not due. Update due constants. Re-sort `COMPANY_HOLDINGS` and `COUNTRY_HOLDINGS` by `btc` descending after any row change. Use narrow `Edit` calls. Report per-table: skipped/updated, row delta, top-3 changes, sort verified. SKIP REBUILD.

**Agent 3 — Market News (if due, `model: fable` / Fable 5, `run_in_background: true`)**
Read `automations/refresh-market-news/README.md`, then `src/data/market-news.js` and the `HISTORICAL_HIGHLIGHTS` block of `src/data/headlines.js`. Follow the 5-phase playbook. Update `MARKET_THEME`, `CURATED_MARKET_UPDATES`, `FALLBACK_NEWS`, `HISTORICAL_HIGHLIGHTS`. After all edits, write `automations/refresh-market-news/last-run-artifacts.md` with the primary URLs + key facts validated this run. Report slot changes and HISTORICAL_HIGHLIGHTS delta. SKIP REBUILD.

**Agent 4 — Headlines Archive (if due, `model: haiku`, `run_in_background: true`)**
Read `automations/refresh-headlines-archive/README.md`, then `src/data/headlines.js`. Curate `SIX_MONTH_HIGHLIGHTS` (exactly 10 items, all `important: true`, window: older than 4 weeks, younger than ~6 months, no overlap with `HISTORICAL_HIGHLIGHTS`). Rank by lasting impact. Use narrow `Edit` anchored on the constant. Report items promoted, dropped, added. SKIP REBUILD.

## Step 4 — Fire deep-analysis the moment market-news completes

Do **not** wait for Agents 1, 2, or 4. As soon as the market-news completion notification arrives, immediately spawn Agent 5. The other Phase 1 agents continue running in the background.

If market-news was skipped (not due): check whether `automations/refresh-market-news/last-run-artifacts.md` was written within the last 7 days. If fresh, proceed immediately. If stale or missing, note it in the final report but still proceed.

If deep-analysis is not due (cadence gate) and market-news was not force-targeted, skip Agent 5. **Note:** when deep-analysis fires only because market-news was force-targeted (i.e., deep-analysis was not itself due on cadence), it is treated as a force-run for manifest purposes — its timestamp does NOT bump (see Step 5).

**Agent 5 — Deep Analysis (if due, `model: fable` / Fable 5)**
Follow the refresh-deep-analysis v2 5-phase playbook in full. Load memory files per `automations/refresh-deep-analysis/memory/INDEX.md` order. Read `automations/refresh-market-news/last-run-artifacts.md` instead of re-fetching those sources. Use **extended thinking** for the Phase 3 synthesis pass. Apply Brier scoring to resolved items. Update all auto-mutable memory files. Stay under 300 KB total memory directory size. SKIP REBUILD.

## Step 5 — Rebuild + update manifest + unified report

After all running agents (Phase 1 + deep-analysis) have completed:

1. `npm run build` (or the codex `node` + `vite` + `make-single-file` fallback if npm isn't on PATH). **Skip the rebuild entirely if no agent wrote any source edits** — `dist/index.html` is already in sync.
2. Write/update `automations/refresh-all/run-manifest.json` — set `last-run` to now; update `agents.<name>` to now ONLY for agents that ran as part of the **regular cadence sweep** (their cadence gate opened on its own). **Agents that ran solely because of a `$ARGUMENTS` force-target override do NOT bump their timestamp** — this preserves the Monday cadence regardless of how many mid-week force-runs occur. Agents that polled-but-skipped-via-significance-gate still bump (they did the cadence work). The deep-analysis follow-on rule from Step 4 inherits this: if deep-analysis fired only because market-news was force-targeted, its timestamp also does not bump. Preserve prior timestamps for cadence-skipped agents.
3. Unified report: per-agent skipped (cadence gate) / polled-but-no-edits (significance gate) / updated (cadence) / force-run (no manifest bump), key changes, rebuild result.

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
- If a Phase 1 agent fails a sanity check it cannot resolve, log the failure, exclude it from the manifest update, and continue with remaining agents.

If $ARGUMENTS is non-empty, forward it to all due agents as an editorial hint / force-target. Force-targets override cadence gates for their named agent or table.
