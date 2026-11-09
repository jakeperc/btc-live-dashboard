# publish-weekly — last run

**2026-11-02 (Monday) 12:19 UTC / 07:19 ET — scheduled run of `btc-publish-weekly`. Published.**

- Pushed: **yes** — commit `369bbf7` on `master`, `Weekly refresh (Nov 2): record Binance theft knocks Bitcoin to a six-week low; thesis 0.55, Brier 0.20 over 47`.
- Preflight: on `master` at `3b35312`, tree clean except last week's `last-run.md`, `git pull --ff-only origin master` already up to date.
- Deploy: pages.yml run 41443614544 — https://github.com/jakeperc/btc-live-dashboard/actions/runs/41443614544 — **success** (completed 12:19:19 UTC).
- Site: `Last-Modified: Mon, 02 Nov 2026 12:19:12 GMT` (was Sat, 24 Oct 2026 21:30:55 GMT).
- Gates: `npm run build` exit 0 (check:schema clean; check:plain exit 1, style only; no `llms:` warnings); `npm test` exit 0 (schema clean, glossary 32 passed / 0 failed, check:llms clean); `check:plain -- --verify` exit 1 (structural 0, hard 0, soft 25; 68 cards verified against the 11:59 UTC snapshot).
- Manifest: `last-run` and adoption / market-news / deep-analysis / plain-language set to 2026-11-02T12:17:57Z; fallbacks (Oct 16) and headlines-archive (Oct 24) preserved.

## Refresh summary (cadence gate, no hint)

| agent | last ran | threshold | result |
|---|---|---|---|
| fallbacks | 2026-10-16 (17 days) | 30 days | skipped (cadence) |
| adoption | 2026-10-24 (9 days) | 6 days | updated — Strive 36,818 → 43,000 BTC (SEC 8-K Oct 26, 43,000 as of Oct 23); Strategy 848,517 confirmed (8-K Oct 26); COUNTRY_HOLDINGS, ADOPTION_INDEX_TOP20, ADOPTION_DATA skipped on their own cadence |
| market-news | 2026-10-24 (9 days) | 6 days | updated — slot 1 replaced: Oct 29 $6.3B Binance theft, Oct 30 six-week low ~$76,100, October −7%, ETFs −$643M Oct 30; slots 2–5 refined (Fed 10–2 hold, December rise "likely"; Strategy Q3 sold 5,552 BTC, no buy Oct 19–25; Nov 3 elections, CLARITY stalled, Senate back Nov 9; Moscow Exchange BTC trading from Dec 1); FALLBACK_NEWS 4/4 replaced; HISTORICAL_HIGHLIGHTS 14 → 14 (6 added, 6 dropped); milestone date corrected to Nov 3 from Binance's own announcement |
| headlines-archive | 2026-10-24 (9 days) | 25 days | skipped (cadence) |
| deep-analysis | 2026-10-24 (9 days) | 6 days | updated — THESIS-006 and THESIS-007 retired; THESIS-008 "Buyers Withdrawn, Beta Exposed" at 0.55 (below the $87,570 yearly open through Dec 31); contrarian 0.25 ("the theft was the bottom"); 3 rows scored: Fed hold 0.75 HIT (0.0625), ETF three-of-five weeks 0.55 MISS (0.3025), 30-year ≥5.80% 0.40 MISS (0.16); aggregate Brier 0.20 over 47, rolling-20 0.13; FORECAST_LEDGER regenerated; 6 rendered watch rows (ETF week to Nov 6 0.55, Strategy buy by Nov 9 0.65, MSCI Nov 11 0.80, Senate vote by Dec 18 0.10, Fed rise Dec 9 0.70, Binance proof-of-reserves by Nov 9 0.85); memory 297.5 KB after decay; new theme file `exchange-security.md` |
| plain-language | event-gated | ran — two passes, 26 fields, ~320 words (first pass 22 fields / ~130 words; cold-read follow-up 12 fields / ~190 words); no facts, numbers or sources added; one rule-20 trip (a date added to watchList[5].plain) reverted; glossary untouched (proposals in drafter-notes: stablecoin/USDT, IBIT) |

Cold-read (Haiku, text only): "what happened" passed on every card; failures were missing owner consequences (watchList 0/2/3, crossCurrents 1/2) and two `wouldChange` lines with no direction — fixed by the Editor's second pass; residue (undefined "withdrawals" in capped bodies, "quarter point"/"key rate" in a locked event, no falsifier in crossCurrents[1]) is in `automations/refresh-plain-language/drafter-notes.md` § "Cold-read failures, Nov 2".

Edit-volume trend (Oct 7 → Oct 16 → Oct 24 → Nov 2): ~60 → ~315 → ~370–410 → ~320 words. Not falling. The Editor's read is that writers deliver bodies at exactly their caps without consequence clauses, so every fix is word-for-word; the writer prompts, not the Editor, are where the next improvement is.

Open items for the owner:
- `themeInteractions.adjustments[].reasoning` in `deep-analysis.js` is pure ledger dialect; confirmed it never renders (referenced only inside the data file).
- Strategy's Nov 2 8-K was not on EDGAR by 11:59 UTC; the Strategy watch row (0.65) is scored against the Nov 2 or Nov 9 filing.
- `drafter-notes.md` is 18 lines (playbook limit 15) because the cold-read residue was appended on the orchestrator's instruction.
- Binance's full proof-of-reserves report is due Nov 3 UTC; the watch row allows until Nov 9.
