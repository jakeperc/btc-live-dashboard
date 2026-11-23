# publish-weekly — last run

**2026-11-19 (Thursday) 05:48 UTC / 00:48 ET — owner-requested force-run of `headlines-archive`, in the same session as the 04:42 UTC run recorded below. Published.**

- Pushed: **yes** — commit `74ac8f8` on `master`, `Weekly refresh (Nov 16): six-month archive re-curated with the stories that aged out since October; thesis 0.8, Brier 0.19 over 56`.
- Deploy: pages.yml run 44467619070 — https://github.com/jakeperc/btc-live-dashboard/actions/runs/44467619070 — **success** (completed 05:48:30 UTC).
- Site: `Last-Modified: Thu, 19 Nov 2026 05:48:23 GMT`.
- Gates: `npm run build` exit 0; `npm test` exit 0 (schema clean, glossary 32 / 0, check:llms clean); `check:plain -- --verify` exit 1 (structural 0, hard 0, soft 24). Editor and cold-read not re-run (`headlines.js` is outside the Editor's fields).
- Manifest: not bumped (force-run). headlines-archive stays at 2026-11-19T04:41:12Z; next due Dec 14.
- Why: a review of the 04:42 run found playbook step 3 had been skipped. Stories that left `HISTORICAL_HIGHLIGHTS` since Oct 24 were never considered, because the agent was not shown them; the archive had nothing between Sep 22 and Oct 29 and five of ten items were from June.

SIX_MONTH_HIGHLIGHTS after the force-run (10): Oct 29 Strategy sold 5,552 Bitcoin in the quarter and 6,947 this year, first sale June 1 (10-Q and 8-K on sec.gov) · Oct 21 OCC stablecoin rules, in force Jan 18, 2027 (OCC Bulletin 2026-50) · Oct 12 London High Court on 61,000 seized Bitcoin (The Block; judgment not located) · Sep 21 $999 million ETF day (CryptoSlate citing SoSoValue; Farside 403) · Sep 16 Fed rise, now naming chair Warsh (Fed press release) · Sep 15 CLARITY blocked 49–50 (Senate roll call 234) · Aug 19 Treasury buybacks (Treasury release sb0607; the $70,000 and liquidation figures from a secondary outlet seen in search results only) · Aug 18 SEC token-sale proposal (SEC release 2026-76) · Jun 25 21-month low (Crypto Briefing) · Jun 12 SpaceX, 18,712 Bitcoin bought for $661 million (S-1, note 7).

- Promoted: Oct 29, Oct 21, Oct 12. Dropped: Jun 17 (Fed hold), Jun 5 (merged into Jun 25), Jun 1 (merged into Oct 29).
- Orchestrator edit: removed "and buy back shares" from the Oct 29 title; the agent had it from a search summary only.
- Left out, for the Dec 14 run or the owner: the Oct 29 Binance theft (judged an overlap with the Oct 30 item in the four-week list, which ages out around Nov 27, so the theft is absent from both lists until Dec 14 unless force-run again); Oct 15 MSCI rule and Oct 14 inflation (same themes as Nov 11 and Nov 10 items); Oct 28 Fed hold; Sep 30 best third quarter since 2017 and Oct 20 SpaceX–Tesla merger talk (not verified on an opened page).
- Still secondary-only: "largest stock-market debut ever" and the $75 billion raise (Jun 12), "first rise since 2023" and "chair Warsh" (Sep 16), "leading Bitcoin-holding company" (The Block's phrase).

Found by the review, not acted on (for Monday Nov 23):
- Strategy's Nov 16 8-K: 485 Bitcoin for $33.4 million, holdings 850,849. The page says 850,364; the 0.55 watch row on this filing resolved as a hit and is unscored.
- Fed minutes released Nov 18; secondary reports say almost all officials backed further rises and a couple floated more than a quarter point for December. Fed text not read.
- Price about $63,300 at 05:30 UTC Nov 19, Nov 18 low near $62,400 against the Nov 15 low of about $62,000.
- Unverified items from a weekly rollup: SEC and CFTC nominees named, Supreme Court rejects Custodia Bank's Fed-account bid, MARA sells Bitcoin to repay loans. Russian exchanges may organise trades from Nov 22.
- `automations/refresh-all/README.md` still names 850K as Strategy's next milestone (crossed Nov 9).
- Structural: the four-week list rolls weekly and the archive runs monthly, so a story aging out between archive runs is in neither list for up to 25 days.
- The mid-week firing is unexplained: the task is set to Mondays, Monday's run succeeded, and the run history shows no failed run before this one.

---

## Earlier the same night — the scheduled firing

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
