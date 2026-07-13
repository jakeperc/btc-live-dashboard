# refresh-all

Slash command: `/refresh-all`

Orchestrator. Runs every refresh command in sequence, then performs a **single rebuild at the end** so `dist/index.html` is regenerated once (not 4–5 times).

## What it runs

In this order:

1. **`/refresh-fallbacks`** workflow (cheapest, runs first so any sanity-check failure aborts early).
2. **`/refresh-adoption`** workflow (cadence-gated — most sub-tables skip on routine runs).
3. **`/refresh-headlines-archive`** workflow (monthly cadence — usually no-op on weekly runs).
4. **`/refresh-market-news`** workflow (always runs in full).
5. **`/refresh-deep-analysis`** workflow (always runs after `/refresh-market-news`; consumes the just-updated themes as synthesis input).

`/refresh-market-news` runs before `/refresh-deep-analysis` because the deep-analysis layer reads `MARKET_THEME` + `CURATED_MARKET_UPDATES` as its primary input. Keeping them adjacent in the chain also lets the research from the news pass inform the synthesis pass with minimal redundant WebSearch traffic. Deep analysis is last because its report is the most context-rich (memory updates, framing shifts, contrarian-take aging) — putting it last means meta-description re-check happens after every content edit has settled.

## Hard scope (do not violate)

All hard-scope rules from every sub-command apply. Specifically:
- Never touch Thesis, Strategy, live-API code, URL constants, or anything in `SCOPE.md` § "Out of scope".
- Per-command cadence gates still apply — `/refresh-all` does not force-refresh tables that aren't due.

## Workflow

1. **Load context once.**
   - Read `SCOPE.md` once. Each sub-command reads its own section via `Read offset/limit` — do not re-read the full file per sub.
   - Read `automations/README.md` (roster + universal rules).
   - Read all four playbooks: `refresh-fallbacks`, `refresh-adoption`, `refresh-headlines-archive`, `refresh-market-news`.
   - Read the current values of every in-scope constant from `src/data/*.js` (the per-domain modules — `fallbacks.js`, `adoption.js`, `headlines.js`, `market-news.js`, `deep-analysis.js`). Do NOT Read `src/BitcoinDashboard.jsx`.

2. **Run each sub-workflow in sequence**, but with these orchestrator-specific tweaks:
   - **Skip the rebuild step** in each sub-workflow (steps that say `npm run build` — defer to the end).
   - **Accumulate a per-section change log** as you go.
   - **`/refresh-market-news` writes `automations/refresh-market-news/last-run-artifacts.md`** at the end of its Phase 5 — primary URLs + dated facts. `/refresh-deep-analysis` reads it instead of re-fetching the same sources.
   - **`/refresh-deep-analysis` still runs its memory writes inside the orchestrated pass** — memory updates are part of every deep-analysis run, even when orchestrated. Only the rebuild is deferred.
   - **Skip `index.html` edits** unless the dashboard's *primary identity* changed (e.g. dominant narrative category shifts category). Routine theme/data refreshes do not need it.
   - If a sub-workflow fails or hits a sanity-check it cannot resolve, **stop and report** rather than proceeding.

3. **Single rebuild at the end.** Once all sub-workflows have completed their edits, run `npm run build` (or the codex `node` + `vite` + `make-single-file` fallback). `dist/index.html` must match source.

4. **Unified report.** One summary covering:
   - Per sub-command: skipped / updated, key changes.
   - Total constants edited.
   - Whether `index.html` meta was touched.
   - Rebuild result.

## Argument forwarding

If `$ARGUMENTS` is non-empty, forward the hint to **all** sub-workflows. Each sub-command interprets it according to its own playbook (e.g., `"MSTR filed an 8-K"` → routed by `/refresh-adoption` to `COMPANY_HOLDINGS`; routed by `/refresh-market-news` to evaluate the slot ranking).

**Force-runs do not bump the manifest.** Any agent that ran only because `$ARGUMENTS` overrode its cadence gate keeps its prior timestamp (see the slash-command's Step 5). This preserves the Monday-morning weekly cadence regardless of how many mid-week force-runs are triggered.

## Mid-week force-run triggers

The default cadence is Monday-morning weekly for adoption, market-news, and deep-analysis. Between Mondays, only force-run for events that meet the bar below. Each trigger is **binary and primary-source-verifiable** — you can answer yes/no without judgment. The significance gates in each sub-playbook still apply and may close on a force-run that turns out to be a re-blog of an already-captured story — that's correct behavior.

### Regulatory / legislative
- SEC approves or denies a new BTC product class (options, in-kind creates, new spot ETF issuer, sBTC/wBTC vehicle).
- A US market-structure bill (CLARITY-class) clears a chamber vote, conference, or presidential signature — not just markup.
- A **calendar shock** that threatens a pending CLARITY-class bill's pre-recess floor window — a government-shutdown / appropriations lapse, a must-pass-bill standoff freezing the chamber, or a presidential refusal to sign that stalls the legislative calendar. (Verifiable via the floor schedule / canceled votes, even though it carries no crypto keyword — this is the second-order risk the per-run "adjacency sweep" exists to catch; force-run if a normal run hasn't already surfaced it.)
- OFAC sanctions or unsanctions a top-10 BTC-adjacent entity (mixer, exchange, custodian).
- A G20 sovereign announces a strategic reserve, large strategic sale, or outright ban.

### Markets / corporate
- New BTC all-time high exceeding prior ATH by ≥ 3%.
- Single-day move of ≥ 15% in either direction.
- Single-day ETF net flow ≥ ±$1B (one fund) or ≥ ±$2B (aggregate).
- A top-10 corporate holder files an 8-K with a material action: ≥ 5,000 BTC acquired or sold, capital raise ≥ $1B explicitly earmarked for BTC, or change of CEO / treasury policy.
- Saylor / MSTR crosses a round-number milestone (next: 850K, 900K, 1M BTC).

### Protocol / infrastructure
- A BIP reaches activation lock-in, or a major soft-fork debate breaks containment (covenants, OP_CTV, etc.).
- A custodian, exchange, or large lightning operator fails, halts withdrawals, or files for bankruptcy.
- Confirmed exploit / theft ≥ $250M from a BTC-holding entity or BTC-adjacent protocol.
- Top-3 stablecoin (USDT, USDC, DAI) de-pegs by ≥ 2% sustained or is otherwise impaired.

### Macro tail
- Emergency / unscheduled Fed action (rate move outside FOMC, liquidity facility opened).
- Surprise FOMC: cut or hike ≥ 50bp vs. consensus, or a regime shift in dot-plot guidance.
- G7 bank failure or sovereign default event.

### Explicitly NOT triggers (wait for Monday)
- Single MSTR weekly buys, Saylor tweets.
- Individual whale on-chain moves.
- Single-exchange listings or ETF issuer marketing.
- "BTC crosses $X" round numbers other than true ATH.
- Re-blogs or secondary coverage of stories already in a slot.

### How to invoke
- General hint: `/refresh-all SEC approved BTC options ETF`
- Targeted: `/refresh-all force:adoption MSTR filed 8-K`

The hint forwards to every agent; relevant agents apply it, irrelevant ones ignore it. Force-runs don't bump the manifest, so the Monday baseline survives any number of mid-week interventions.

## Common pitfalls

- **Rebuilding multiple times.** Each sub-playbook says "rebuild after edits." In orchestrator mode, suppress all but the final rebuild.
- **Loading per-playbook context redundantly.** Read each playbook + `SCOPE.md` once at the start, then refer to them.
- **Letting one sub-workflow's failure silently drop edits from prior sub-workflows.** If you abort, report what was already edited so the user can decide whether to keep or revert.
- **Forcing refreshes on cadence-gated tables.** Even in `/refresh-all`, `ADOPTION_INDEX_TOP20` / `ADOPTION_DATA` should only refresh if fresh source data exists.
