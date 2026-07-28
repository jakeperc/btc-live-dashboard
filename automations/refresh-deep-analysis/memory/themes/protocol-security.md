# Theme: Bitcoin Protocol & Security (Quantum Migration)

- **Slug:** `protocol-security`
- **Category:** Protocol / technical
- **First tracked:** MAY 18, 2026
- **Last updated:** JUL 26, 2026
- **Status:** Active — two distinct sub-threads: (1) quantum migration (long-tail, no urgency); (2) BIP-110 data-limit soft fork (near-dated, Aug 2026 flag day, low activation odds + chain-split tail). JUL 26: the Sztorc thread is now DATED (see below) — August has TWO fork events; watch-row held p=0.10; BIP-110 signaling still sub-1%. Note: the market-news card rail's slot 5 rotated to an August-forks card this run — this theme is a candidate for formal top-5 entry next run if the fork window generates real market noise.

## Key dated facts (JUL 26 additions)

- **JUL 26, 2026** — **The "two August forks" flag SUBSTANTIATED:** (1) BIP-110 UASF flag day ~Aug 7 (block 961,632), signaling still sub-1%, no major pool, Core non-endorsing; (2) **Paul Sztorc's eCash Drivechain hard fork now has a concrete split point: block 964,000, estimated ~Aug 21 15:00 UTC** — a spinoff chain built on BIP-300/301 Drivechain functionality that credits existing BTC holders with an equivalent eCash balance (airdrop-style; NOT a contested rewrite of Bitcoin's rules). Institutional insulation: IBIT's SEC-filed prospectus states the trust permanently and irrevocably abandons rights to forked/airdropped assets — so no ETF-flow mechanics hang on the split; the market effect is headline noise. [Bitcoin.com News — August timeline](https://news.bitcoin.com/august-timeline-puts-bitcoin-bip-110-signaling-and-paul-sztorcs-hard-fork-in-focus/) · bip110.org
- **JUL 25, 2026** — **Difficulty: the widely-projected ~16% cut did NOT materialize** — the realized adjustment at block 959,616 was **+0.99%**; the next retarget (~Aug 4) currently estimates ~+2.3%. Treat large pre-retarget difficulty projections as low-reliability. Context for the miner-stress candidate theme: Poolin filed Chapter 11 (Jul 22, $163.7M owed to ~11,700 frozen wallets); press cites cost-to-mine ~$84K vs ~$65K spot; ~$19B of miner capex migrating to AI/HPC hosting.

## Current state

**Quantum-migration sub-thread.** BIP-360 (post-quantum signature format, P2MR path) is the foundational proposal. Draft BIP-361 proposes a staged sunset for legacy signatures *after* post-quantum outputs exist. Debate is technical-first but will become geopolitical as sovereign holders gain stake in lost-coin-disposition (the ~3M BTC permanently lost).

**BIP-110 data-limit sub-thread (new JUN 24, 2026).** BIP-110 is a *contested* soft-fork proposal that would impose a temporary set of consensus rules limiting how much arbitrary (non-monetary) data can be stored in Bitcoin transactions. Activation is via a user-activated soft fork (UASF) with a flag day at block **961,632 (~Aug 7, 2026, ~17:59 UTC)**; mandatory-signaling window runs blocks 961632–963647. Early lock-in triggers if any single 2,016-block difficulty period signals **version-bit 4 at ≥55%**, activating one difficulty period later. As of **Jun 22, 2026 signaling is ~0.31%** — negligible; **no major mining pool has signaled**, and **Bitcoin Core (largest implementation / node share) has NOT endorsed it** — backing is concentrated in Bitcoin Knots (Luke Dashjr). A separate Paul Sztorc hard-fork thread sits in the same August window, so the live risk is a contentious-fork / chain-split tail rather than a clean activation. Adam Back has publicly warned the effort may self-fork or simply fail to activate by Aug 7.

## Key dated facts

- **JUN 24–28, 2026** — No material BIP-110 movement: version-bit-4 signaling still ~0.31%, no major mining pool signaling, Bitcoin Core still non-endorsing. The ≥55% early-lock-in path remains effectively closed; the ~Aug 7 flag day (block 961,632) is the binding date and the live question stays whether a UASF/Sztorc fork client gains node share to produce a brief contentious split rather than whether the soft fork activates. Watch-row held p=0.10.
- **Jun 22, 2026** — BIP-110 version-bit-4 signaling at ~0.31%; no major mining pool signaling; Bitcoin Core not endorsing (per BGeometrics tracker + bip110.org).
- **~Aug 7, 2026** — BIP-110 UASF flag day at block 961,632 (mandatory-signaling window 961632–963647). Same window as a separate Sztorc hard-fork thread → chain-split tail risk.
- **2026** — BIP-110 assigned/circulated (originally under pseudonym "Dathon Ohm"); reference client released; Bitcoin Knots the primary backing implementation.
- **2026** — Draft BIP-361 published on github.com/bitcoin/bips.
- **2024–2025** — BIP-360 developed, P2MR path defined.

## Causal links

- → sovereign-holder-engagement (`weak` edge — speculative, not yet observed)
- → forced-migration-timeline (long-tail risk; markets not yet pricing)
- ← `themes/sovereign-reserves.md` (sovereigns have most to lose from a forced migration)

## Open questions

1. **Activation path.** Soft fork vs. hard fork vs. soft-fork-with-sunset. Mining-pool signaling will be the leading indicator.
2. **Lost-coin disposition.** ~3M BTC unmovable. Does a forced migration leave them frozen, or proposes a re-issuance / burn mechanism? The latter is a political flashpoint.
3. **Sovereign engagement.** No sovereign has yet commented on BIP-360/361 publicly. When the first one does, it materially changes the political calculus.
4. **Realistic timeline.** Quantum threat is years out (≥10y commonly cited). Migration could be done preemptively or reactively. Preemptive = political fight now; reactive = systemic risk later.
5. **BIP-110 — does version-bit-4 signaling move at all before Aug 7?** At ~0.31% with no pool support and Core non-endorsement, the ≥55% early-lock-in path is effectively closed. The decision-relevant question is whether a UASF/Sztorc fork client gains enough node share to produce a brief contentious split at the flag day, not whether the soft fork activates.

## Upcoming catalysts

| Date / window | Catalyst | Why it matters |
|---|---|---|
| ~Aug 7, 2026 | BIP-110 UASF flag day (block 961,632) | Activation/lock-in deadline; chain-split tail if a fork client has node share. ≥55% in any 2,016-block period before then = early lock-in. |
| Q3 2026 | BIP-110 version-bit-4 signaling trend (BGeometrics tracker) | Leading indicator; sustained sub-1% confirms the flag day lapses as a non-event |
| Q3 2026 | First major-pool position on legacy-signature sunset | Activation viability signal |
| Q3 2026 | First major-exchange position | Custody implications surface |
| 2027+ | First sovereign-holder comment on BIP-361 | Politicizes the conversation |
| 2027+ | First nation-state quantum-computing milestone | Could compress the timeline |

## Press / source bias notes

- `github.com/bitcoin/bips` is **prime** — read BIP drafts directly, not press summaries.
- Bitcoin Magazine has stronger protocol coverage than CoinDesk; still verify against the BIP repo.
- Mainstream press often conflates BIP-360 and BIP-361; be precise.
- For BIP-110: read `github.com/bitcoin/bips/blob/master/bip-0110.mediawiki` + `bip110.org` for the spec; the BGeometrics BIP-110 signaling page (`bgeometrics.com`) and bip110monitor.com are the live version-bit-4 signaling trackers. Press conflates "activation" (needs ≥55% or node-share enforcement) with mere "signaling has begun" — be precise.
