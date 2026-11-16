# publish-weekly — last run

**2026-11-09 (Monday) 12:31 UTC / 07:31 ET — scheduled run of `btc-publish-weekly`. Published.**

- Pushed: **yes** — commit `d9406df` on `master`, `Weekly refresh (Nov 9): bitcoin hits its lowest since august as the midterm rally fades; thesis 0.65, Brier 0.19 over 50`.
- Preflight: on `master` at `369bbf7`, tree clean except last week's `last-run.md`, `git pull --ff-only origin master` already up to date (11:08 UTC).
- Deploy: pages.yml run 42617557888 — https://github.com/jakeperc/btc-live-dashboard/actions/runs/42617557888 — **success** (completed 12:31:08 UTC).
- Site: `Last-Modified: Mon, 09 Nov 2026 12:30:51 GMT` (was Mon, 02 Nov 2026 12:19:12 GMT). `llms.txt` reads "data as of 2026-11-09".
- Gates: `npm run build` exit 0 (check:schema clean, 10 modules; check:plain exit 1, style only; no `llms:` warnings); `npm test` exit 0 (schema clean, glossary 32 passed / 0 failed, check:llms clean); `check:plain -- --verify` exit 1 (structural 0, hard 0, soft 28; 71 cards verified against the 12:10 UTC snapshot, no numeric drift).
- Manifest: `last-run` and adoption / market-news / deep-analysis / plain-language set to 2026-11-09T12:29:33Z; fallbacks (Oct 16) and headlines-archive (Oct 24) preserved.

## Refresh summary (cadence gate, no hint)

| agent | last ran | threshold | result |
|---|---|---|---|
| fallbacks | 2026-10-16 (24 days) | 30 days | skipped (cadence) |
| adoption | 2026-11-02 (7 days) | 6 days | polled, no edits — Strategy Nov 2 8-K: 811 BTC bought, 849,327 total (+0.10%, under the 1% gate; stored 848,517); Strive 43,124 per The Block (+0.29%, under gate); Luxembourg SWF 1% crypto plan and Bhutan reserve approval not added (plan / no primary source); COUNTRY_HOLDINGS, ADOPTION_INDEX_TOP20, ADOPTION_DATA on their own cadence; bitcointreasuries.net corporations page 404 |
| market-news | 2026-11-02 (7 days) | 6 days | updated — slot 1 replaced: Nov 8 low $73,477 (lowest since Aug 21), fifth losing week, ETF week to Nov 6 −$1.28B (worst since June), election rally to $81,000 Nov 4 reversed by the Nov 5 Nasdaq −5.5% day and hot Nov 6 jobs (+165k vs 59k); slots 2–5 refined (Dec 9 rise ~77%, CPI Nov 10; Strategy Nov 2 8-K + Trump Media 4,259 BTC collateral move + MSCI Nov 11; Democrats win both chambers, CLARITY alive only via motion to reconsider until Jan 3, CR expires Dec 11, FinCEN cuts off MEXC Nov 6; Bank of Russia retail rule effective Nov 17, Moscow Exchange Dec 1); FALLBACK_NEWS 4/4 replaced; HISTORICAL_HIGHLIGHTS 14 → 14 (10 added, 10 dropped); check:plain exit 0 after one fix pass |
| headlines-archive | 2026-10-24 (16 days) | 25 days | skipped (cadence) |
| deep-analysis | 2026-11-02 (7 days) | 6 days | updated — THESIS-008 "Buyers Withdrawn, Beta Exposed" kept, 0.55 → 0.65 (reclaim distance to $87,570 now 18.3%; beta and flow legs confirmed; corporate leg amended to "small and premium-gated"); 3 rows scored: ETF week to Nov 6 0.55 MISS (0.3025), Strategy buy by Nov 9 0.65 HIT (0.1225, Nov 2 8-K), Binance proof-of-reserves 0.85 HIT (0.0225, Recovery Update #5); aggregate Brier 0.19 over 50, rolling-20 0.14; FORECAST_LEDGER regenerated (3 rows prepended, openCount 15); 6 rendered watch rows (ETF inflow week to Nov 13 0.35, Strategy buy Nov 9/16 8-K 0.65, MSCI Nov 11 0.80, Fed rise Dec 9 0.75, Senate vote by Dec 18 0.10, Friday close <$75,000 Nov 13–27 0.45 held); new contrarian "April 2025 analog" 0.25; regime contagion (2nd run), deficit weighting engaged; memory 304.6 → 295.1 KB after decay; new `actors/trump-media.md` |
| plain-language | event-gated | ran — two passes, 28 fields, ~290 words (first pass 22 fields / ~200 words; cold-read follow-up 12 fields / ~90 words); no facts, numbers or sources added; glossary untouched (proposals in drafter-notes: MEXC, stablecoin/USDT, IBIT, "Bitcoin funds", inflation, index, filing, bonds) |

Cold-read (Haiku, text only): "what happened" passed on all 17 cards. Failures fixed by the Editor's second pass: watchList[5].plain read as self-contradictory (0.45 "leaning no" while price already below the line — now says the call predates the drop and today's price does not count); CURATED[1] gave no chain from an MSCI removal to a Bitcoin owner (now in detail: forced share sales could slow the share sales that buy coins); crossCurrents[1] "its own measure" unnamed; "forced closures / borrowed bets" undefined; CURATED[2] / crossCurrents[2] now say the bill picks Bitcoin's regulator. Residue for the drafters in `automations/refresh-plain-language/drafter-notes.md`: a plain share count still needs a source; number disagreements across the page (Nov 5 fall 5.5% vs 5.6%; September inflation 3.7% vs 3.6%; gold ~$4,090 vs source); CURATED[1].detail never says where the other $98.5M went; "dies unless the Senate votes again" overstates a vote; BlackRock, "permitting bill", "futures" undefined; STRC line cut from crossCurrents[1].body (fact still in body[3] and CURATED[1].detail).

Edit-volume trend (Oct 7 → Oct 16 → Oct 24 → Nov 2 → Nov 9): ~60 → ~315 → ~370–410 → ~320 → ~290 words. Flat to slightly down, not converging. Pattern unchanged: writers deliver bodies at exactly their caps without glosses or owner consequences, so every Editor fix is word-for-word. The writer prompts, not the Editor, remain where the next improvement is.

Open items for the owner:
- Strategy's Nov 9 8-K was not on EDGAR at 11:40 UTC; the Strategy watch row (0.65) is scored against the Nov 9 or Nov 16 filing. The adoption row still shows 848,517; the latest 8-K figure is 849,327 (reconcile per the cross-tab rule if the Nov 9 filing moves it past 1%).
- Primary sources unreachable this run: farside.co.uk (403; flows via TFTC's Farside-matched table), apnews.com, cbr.ru (Bank of Russia rule via Russian press), senate.gov periodical press (403), Binance Recovery Update #7 page (98% figure secondary only).
- Senate count 54–44 with two seats uncalled as of Nov 4; Ohio margin provisional.
- Glossary backlog (repeat offenders): MEXC ×4, USDT ×3, STRC ×2, IBIT ×2, plus SEC, OCC, Nasdaq, share premium from Oct 24.
- `drafter-notes.md` is 13 lines (playbook limit 15).
- MSCI decision Nov 11, CPI Nov 10, Bank of Russia rule Nov 17, Trump Media put right Nov 30, FOMC Dec 9, CR Dec 11 are the dated events the next run should resolve.
