# Actor: MSCI (index provider)

- **Slug:** `msci`
- **Category:** Market structure / index mechanics
- **Role:** Sets the eligibility screen that decides whether leveraged Bitcoin-treasury equities (Strategy, Metaplanet) stay in the global investable-market indexes that passive funds copy — the concrete actor of the `index-inclusion-screen → treasury-model-financing-pressure` edge (medium).
- **First tracked:** AUG 19, 2026 (as a watch row); actor file CREATED OCT 16, 2026 (the screen adopted; three dated events ahead)

## Snapshot

- **OCT 15, 2026 (08:48 GMT) — "Results of the Consultation on the Eligibility of Non-Operating Companies in the MSCI Global Investable Market Indexes": "MSCI will implement the proposal to define and classify non-operating companies as ineligible", with minor changes.** Mechanics: a core screen for "substantial operating assets"; then five non-industry-specific financial ratios — ineligible if flagged on four or more (Appendix I of the GIMI methodology); buffers on thresholds and timing; non-constituents barred if they fail in EITHER of the two latest annual periods; **current constituents removed only if they fail in BOTH** (an interim filing may be used); **effective with the November 2026 Index Review as of the close of Nov 30; the final list of affected securities Nov 11**; the Oct 10, 2025 interim DATCO measures discontinued. MSCI's announcement names no company; its potential-deletion list (xlsx; Sep 30 data; restated by Unchained): **Strategy, Metaplanet, Yellow Cake, Upexi, Skel Fjarfestingafelag**, with a 17-name watchlist (SharpLink, SUI Group, TON Strategy, Solana Company …). [MSCI results](https://app2.msci.com/webapp/index_ann/DocGet?pub_key=aq0wbkjxPgo=&lang=en&format=html) · [Unchained](https://unchainedcrypto.com/strategy-metaplanet-face-exit-from-msci-indexes-as-the-index-provider-adopts-new-test/)
- **Arc (condensed):** Jan 2026 — declined to act "at this time" (pub_key `DD3Olh5uInk=` — the JANUARY document; do not confuse); Aug 14 — consultation opened (operating assets <50% → ineligible; feedback to Sep 30; results Oct 16); Sep 1 — Strategy's letter ("discriminatory, arbitrary, and misguided"; Bitcoin reported as an operating segment under SEC guidance; REITs/timber exempted; a prospective-only fallback); a May simulation would have deleted Strategy, Metaplanet and Yellow Cake; Sep 30 — feedback closed, no signal; **Oct 15 — adopted.**
- **Size of the forced flow:** Strategy's own August figure — MSCI-tracking funds hold ~13M MSTR shares / 3.1% of basic shares, under one day's volume. JPMorgan's 2025 ~$2.8B selling estimate related to the WITHDRAWN 2025 proposal — do not use. The live channel is the PREMIUM (mNAV 1.17× Sep 21 → 1.06× Oct 16), not the share count.

## Ledger

- MSCI-adopts-the-screen (AUG 19 → held 0.55) — **HIT, Brier 0.2025** (OCT 16). Lesson: a consulted screen with a provider-published deletion simulation proceeds — price ≥0.65.
- The Nov 11 final list names Strategy — **0.80** (HELD OCT 24; no new MSCI document; MSTR $146 with BTC −2.5% — in line). Strategy's mNAV closes <1.00× by Nov 30 — **0.45 → 0.35** (OCT 24: mnav.com RESTATED its series — headline 1.18×, 52-week 0.98–1.37×; the row scores on the headline figure, so log the basis each run; equity-only cross-check ≈ 0.90×).
- **OCT 24 note:** no MSCI development this week; `last updated` stays OCT 16 for the snapshot. Next pull: `app2.msci.com` on Nov 11 (the November Index Review announcement) — check the pub_key against the date.

## Open questions

1. Nov 11: does the final list keep Strategy AND Metaplanet (both fail in both annual periods on the face of it) — or does a buffer / the interim-filing clause give a reprieve?
2. Does FTSE / S&P copy the screen (no sign yet)?
3. Does Strategy respond — a MSTR buyback from the $1.0B authority, litigation, or the counterintuitive lever (shrinking the stack to raise the operating share)?
4. The November Index Review's other deletions — any read-across to the DAT cohort's financing (Upexi, SharpLink).

## Upcoming catalysts

| Date / window | Catalyst | Why it matters |
|---|---|---|
| Nov 11, 2026 | the final list (row 0.80) | names the forced sellers' targets |
| Nov 30, 2026 (close) | changes effective | the passive selling day; the mNAV row (0.45) scores |
| 2027 | the May / November reviews | the screen's steady state |

## Source priority

1. `app2.msci.com` index announcements (DocGet) — prime; check the pub_key against the date.
2. `msci.com/downloads/documents/indexes/consultations/…` — the potential-deletion xlsx (not yet fetched).
3. Strategy's response (`strategy.com/msci`, 403) via the 8-K / The Block; Unchained / Cointelegraph for restatements (verify figures).
