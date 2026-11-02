# publish-weekly — last run

**2026-10-26 (Monday) 10:08 UTC / 06:08 ET — first scheduled run of `btc-publish-weekly`. Nothing to publish.**

- Pushed: no — every cadence gate was closed, no agent ran, no file under `src/data/` changed.
- Preflight: on `master` at `3b35312`, clean tree, `git pull --ff-only origin master` already up to date.
- Commit: none. Deploy: none triggered; the Oct 24 deploy (pages.yml run 40134362173) is still live.
- Site: `Last-Modified: Sat, 24 Oct 2026 21:30:55 GMT`.
- Gates: build and `npm test` not run (nothing changed since the Oct 24 publish, which passed both).
- Manifest: `automations/refresh-all/run-manifest.json` left untouched on purpose — no agent ran, and an uncommitted manifest edit would trip next Monday's preflight.

## Refresh summary (cadence gate, no hint)

| agent | last ran | threshold | result |
|---|---|---|---|
| fallbacks | 2026-10-16 (10 days) | 30 days | skipped (cadence) |
| adoption | 2026-10-24 (1.5 days) | 6 days | skipped (cadence) |
| market-news | 2026-10-24 (1.5 days) | 6 days | skipped (cadence) |
| headlines-archive | 2026-10-24 (1.5 days) | 25 days | skipped (cadence) |
| deep-analysis | 2026-10-24 (1.5 days) | 6 days | skipped (cadence; market-news not force-targeted) |
| plain-language | — | event-gated | skipped — no prose changed |

Rebuild: skipped (no source edits). `index.html`: untouched.

This is the outcome last week's record predicted: the Saturday Oct 24 hand-run reset the weekly clocks, so the 6-day gate stays closed until the week of Nov 2. The first full automated publish is expected **Monday 2026-11-02**. The live page still shows the Oct 24 analysis (thesis 0.35, Brier 0.20 over 44).
