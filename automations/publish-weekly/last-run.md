# publish-weekly — last run

**2026-11-19 (Thursday) 04:42 UTC / Wednesday Nov 18 23:42 ET — scheduled firing of `btc-publish-weekly`, two days after Monday's run. Published (archive only).**

- Pushed: **yes** — commit `becf3e7` on `master`, `Weekly refresh (Nov 16): six-month headlines archive re-curated, market cards unchanged; thesis 0.8, Brier 0.19 over 56`. The subject keeps "Nov 16" because the form takes its date from `DEEP_ANALYSIS.asOf`, which did not change.
- Preflight: on `master` at `dee08d7`, tree clean except last week's `last-run.md`, `git pull --ff-only origin master` already up to date.
- Deploy: pages.yml run 44460051430 — https://github.com/jakeperc/btc-live-dashboard/actions/runs/44460051430 — **success** (completed 04:42:06 UTC).
- Site: `Last-Modified: Thu, 19 Nov 2026 04:41:59 GMT` (was Mon, 16 Nov 2026 12:29:12 GMT). `llms.txt` still reads "data as of 2026-11-16".
- Gates: `npm run build` exit 0 once (check:schema clean, 10 modules; check:plain exit 1, style only; no `llms:` warnings); `npm test` exit 0 (schema clean, glossary 32 passed / 0 failed, check:llms clean); `check:plain -- --verify` exit 1 (structural 0, hard 0, soft 24; 77 cards verified against the 04:39 UTC snapshot, no numeric drift).
- Manifest: `last-run` and headlines-archive set to 2026-11-19T04:41:12Z; fallbacks / adoption / market-news / deep-analysis / plain-language (all Nov 16) preserved. The archive's next 25-day window opens Dec 14 04:41 UTC, before that Monday's 06:00 ET run.
- Why it fired mid-week: not determined by this run. The task is scheduled for Mondays and already ran Nov 16; this firing arrived Wednesday night ET. Worth a look at the task's run history.

## Refresh summary (cadence gate, no hint)

| agent | last ran | threshold | result |
|---|---|---|---|
| fallbacks | 2026-11-16 (2.7 days) | 30 days | skipped (cadence) |
| adoption | 2026-11-16 (2.7 days) | 6 days | skipped (cadence) |
| market-news | 2026-11-16 (2.7 days) | 6 days | skipped (cadence) |
| headlines-archive | 2026-10-24 (25.3 days) | 25 days | updated — SIX_MONTH_HIGHLIGHTS 10 → 10, window May 18 – Oct 21. Dropped: May 13 (Warsh confirmed as Fed chair; aged out of the window). Added: Jun 25, Bitcoin at about $58,100, a 21-month low, after the Fed's inflation gauge hit a three-year high, over $1 billion of bets force-closed (Crypto Briefing, https://cryptobriefing.com/bitcoin-21-month-low-interest-rate-fears/). Reworded after re-verification: Aug 19 (Treasury "says it will" at least double buybacks; Bitcoin "back to" $70,000), Jun 12 (SpaceX coins "bought at an average of about $35,300 each" replaces "$661 million", which was a multiplication and not a filing figure), Jun 1 (Strategy sold 3,588 "in the week to July 5", not cumulatively by then). Six items unchanged and re-verified (Sep 21, Sep 16, Sep 15, Aug 18, Jun 17, Jun 5). Nothing promoted from HISTORICAL_HIGHLIGHTS, which was not edited. check:plain headlines.js exit 0; check:schema clean |
| deep-analysis | 2026-11-16 (2.7 days) | 6 days | skipped (cadence; market-news not force-targeted) |
| plain-language | event-gated | ran, no edits — `headlines.js` is outside the Editor's editable fields; 0 fields, 0 words; did not read deep-analysis memory or the market-news artifacts; `drafter-notes.md` left as written Nov 16 |

Orchestrator send-back: the archive agent first labelled the new Jun 25 item "CoinDesk" without having found a CoinDesk page, and carried a "$1.5 billion" figure from an aggregator it had not opened. It was sent back once; the item now cites the outlet it actually read, and the figure reads "over $1 billion".

Cold-read test: not run. It covers Tier 1 and Tier 2 cards, and none changed.

Edit-volume trend (Oct 7 → Oct 16 → Oct 24 → Nov 2 → Nov 9 → Nov 16): ~60 → ~315 → ~370–410 → ~320 → ~290 → ~480 words. This run adds no data point (no writer of Editor-editable prose ran).

Open items for the owner:
- Verification depth: the archive items were checked against news outlets, law-firm notes and aggregators, not against Fed, SEC, Treasury or EDGAR pages. Three items carry "SEC EDGAR" / "U.S. Treasury" / "Federal Reserve" source labels on that basis.
- Jun 5: some outlets date the first dip below $60,000 to Jun 3; the item follows Protos (Jun 5, low $59,156).
- Aug 19: "toward $70,000" became "back to $70,000" on the strength of one outlet reporting a brief touch of $70,000.
- Editor's reader notes on archive titles, not applied (no agent owns routing them; the archive writer does not read `drafter-notes.md`): Jun 1 never says Strategy is a company; Jun 25 does not say why a bet gets force-closed and "Fed" is never spelled out in the archive; Aug 19 says "The Treasury" without "U.S.".
- All Nov 16 open items still stand (Strategy 8-K watch row, MARKET_THEME "fell alongside gold", unreachable primary sources, rolling-20 Brier, memory near the 300 KB cap, glossary backlog, dated events through Dec 11). Monday Nov 23 is the next full run.
