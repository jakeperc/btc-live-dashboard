# publish-weekly — last run

**2026-10-24 (Saturday) — run by hand from the orchestrator session that created the automation; the first scheduled run is Monday 2026-10-26 06:07 ET.**

- Pushed: yes. Commits `13c3b8b` (Weekly refresh (Oct 24): war fears and a tech rout push Bitcoin back under $80,000; thesis 0.35, Brier 0.20 over 44) and `921df9a` (Add /publish-weekly).
- Deploy: pages.yml run 40134362173 — success. https://github.com/jakeperc/btc-live-dashboard/actions/runs/40134362173
- Site: `Last-Modified: Sat, 24 Oct 2026 21:29:00 GMT`; `llms.txt` reports data as of 2026-10-24.
- Gates: check:plain verify exit 1 (structural 0 · hard 0 · soft 36, no numeric drift); build exit 0; npm test 32 passed.

## Refresh summary

| agent | result |
|---|---|
| fallbacks | skipped (cadence, 8 of 30 days) |
| adoption | updated — Strive 35,595 → 36,818 BTC (Oct 19 8-K); Strategy reconciled to 848,517 in adoption.js and YARDSTICKS |
| market-news | updated — 4 slots refined, sovereign card replaced by new wrappers; 14-item 4-week archive; FALLBACK_NEWS 4 items |
| headlines-archive | updated — 10 verified items, 3 stale claims corrected, no overlap with the 4-week list |
| deep-analysis | updated — thesis 0.35 held; Strategy purchase row HIT (Brier 0.06); nResolved 44, Brier 0.20, rolling-20 0.14; memory 299.9 KB |
| plain-language | 22 fields, net −44 tokens over two passes; cold-read owner-consequence failures fixed on the four news cards and the summary; residue in drafter-notes.md |

Note for Monday 2026-10-26: the weekly agents' 6-day gate will still be closed (2 days since this run), so that run should report nothing to publish. The first full automated publish is expected Monday 2026-11-02.
