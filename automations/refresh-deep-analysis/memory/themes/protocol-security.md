# Theme: Bitcoin Protocol & Security (Quantum Migration)

- **Slug:** `protocol-security`
- **Category:** Protocol / technical
- **First tracked:** MAY 18, 2026
- **Last updated:** AUG 19, 2026
- **Status (AUG 19):** Active (slot 5 rotated Coldcard SECURITY → PROTOCOL forks) — **BIP-110 IS FULLY DEAD, ON THE PRICED PATH: final mandatory-window signaling 2.53% (51 blocks) vs the 55% required; enforcing nodes split at block 961,632; the minority chain mined 2 blocks and STALLED (26 behind by Aug 9 AM); AntPool's first non-signaling block triggered the split; no exchange/wallet adoption; mainnet untouched; difficulty math makes revival impractical.** The `core-non-endorsement` edge's split leg is now ~90% resolved quiet — only the **eCash spinoff (block 964,000, ~Aug 21, inside 48h of this run)** remains: airdrop-style Drivechain fork, ~500K Satoshi-era coins reassigned on the new chain, auto-airdrop to all holders, scam warning standing (never enter keys to "claim" fork coins). **Split-tail row held 0.10 with the letter SHARPENED pre-event** (consequential = major-exchange listing OR mainnet disruption — the old >24h-divergent-chain leg was BIP-110-specific and would have tripped on an airdrop fork working as designed). **Coldcard: tally STATIC at ~1,816 BTC / ~$116M since Aug 4 — no fifth wave, no arrests, no second-vendor claim; containment watch stepped 0.25→0.10 (trending MISS = contained, as priced); Coldcard demoted to the archives on the market-news side.** Theme standalone 0.85. Quiet eCash lapse next run → consider rotating protocol out of the top-5. [KuCoin flash — fork fails](https://www.kucoin.com/news/flash/bitcoin-bip-110-fork-fails-as-mainnet-outpaces-minority-chain-by-26-blocks) · [AMINA — August forks](https://aminagroup.com/research/bitcoin-fork-august-2026-bip-110-ecash-covenants-and-the-quantum-clock/)
- **Status (AUG 7 — mid-week force-run):** Active — **BOTH DATED SUB-THREADS RESOLVED AS PRICED.** (2) **BIP-110: the flag day arrived (block 961,632, ~Aug 7) with signaling ~0–2.45% of blocks — lock-in FAILED; the watch scored MISS at p=0.10 (Brier 0.01), the ledger's first protocol resolution.** The mandatory window runs to block 963,648 (~Aug 21) with enforcing nodes (est. 2–8%, mostly Knots) rejecting non-signaling blocks — a would-be chain with ~zero hashpower; successor split-tail row seeded at **0.10** (covers the window + the eCash spinoff, block 964,000 ~Aug 21, airdrop-style, IBIT prospectus-insulated). The `core-non-endorsement` edge's activation leg VALIDATED; split leg pending. (3) **Coldcard: tally grew then decelerated — ~1,816 BTC / ~$116M / 5,200+ addresses in four waves (TRM Labs citing Galaxy Research, Aug 4; now the 3rd-largest 2026 hack; YTD >$1.2B/276 incidents), root cause quantified (fw 4.0.1 software-RNG fallback: effective key strength 128 → as low as 40 bits, remotely brute-forceable)** — no comparable fifth wave since patch week; independent tallies converging ($111M BM / $116M TRM / $130M Yahoo-unconfirmed). Containment watch stepped 0.30→**0.25**. The protocol→etfs sign-flip question stays FLAGGED — the week's inflows are rate-attributable, so no custody-mix datapoint yet.
- **Status (AUG 3):** Active — **THE THEME ENTERED THE FORMAL TOP-5 VIA A THIRD SUB-THREAD: HARDWARE-WALLET SECURITY.** Market-news slot 5 rotated the August-forks card out for the **Coldcard Mk3 exploit** — the largest hardware-wallet breach in Bitcoin's history (~1,367 BTC / ~$89M by Aug 2–3; see dated facts). This memory file now carries THREE sub-threads: (1) quantum migration (long-tail); (2) BIP-110 flag day + Sztorc spinoff (final week — flag day ~Fri Aug 7, block 961,632; signaling still ~0–0.31%, ≈5 EH/s of ~940; Foundry ran a hashrate-weighted miner vote timed to the flag block; watch p=0.10 SCORES next run; eCash spinoff ~Aug 21, block 964,000); (3) self-custody security (Coldcard — containment watch p=0.30 by Aug 31). Matrix note: this run mapped the security sub-theme onto the existing protocol-security row (containment probability 0.80 as p(S)); the protocol→etfs −0.02 delta is FLAGGED for a sign review — a self-custody failure arguably favors the custodial wrapper (new causal edge `self-custody-security-failure → custodial-wrapper-relative-advantage`, weak).
- **Prior status (JUL 26):** two sub-threads: quantum migration (long-tail) + BIP-110 (near-dated, low activation odds + split tail); Sztorc thread dated; watch held p=0.10; signaling sub-1%.

## Key dated facts (AUG 3 additions — Coldcard sub-thread)

- **JUL 30 – AUG 3, 2026** — **Coldcard Mk3 seed-RNG exploit (largest hardware-wallet breach in Bitcoin history).** Waves began Jul 30: first sweep **594 BTC (~$38M) in ~25 minutes** (CoinDesk); ~1,082.65 BTC / $70.2M from 1,196 addresses in 41 minutes per initial tallies; **~1,367 BTC / ~$89M from 4,585 addresses by Aug 2–3** (Crypto Briefing). Root cause: a **March 2021 firmware bug routed seed entropy through a software RNG instead of the hardware RNG** — affected Mk3 firmware **4.0.1–5.0.3**; keys reproducible OFFLINE (no device access needed). **Coinkite advisory + patched firmware by Aug 1**; guidance: a patch cannot fix an already-weak seed — **migrate funds to freshly generated wallets**; dice-roll entropy or a strong BIP-39 passphrase = protected. Editorial frame for the dashboard: a randomness-hygiene failure, not a failure of self-custody as a model — unaffected devices/newer models untouched; institutional/ETF custody architecturally unaffected. Containment watch p=0.30 (tally crosses ~2,500 BTC or a second vendor confirmed, by Aug 31): the tally is a race between attacker sweeps and user migration. [Coinkite advisory](https://blog.coinkite.com/coldcard-mk3-seed-generation-warning/) · [entropy backgrounder](https://blog.coinkite.com/entropy-technical-backgrounder/) · [CoinDesk — 594 BTC in 25 min](https://www.coindesk.com/tech/2026/07/31/major-bitcoin-wallet-flaw-drains-594-btc-in-25-minute-sweep) · [Crypto Briefing — $89M](https://cryptobriefing.com/coldcard-firmware-flaw-bitcoin-hack-89-million/)

## Key dated facts (JUL 25–26, re-condensed AUG 7; full text in git)

- **JUL 26** — the "two August forks" flag substantiated: BIP-110 flag day ~Aug 7 (resolved AUG 7 — see status) + Sztorc's eCash Drivechain spinoff at block 964,000 (~Aug 21 15:00 UTC; airdrop-style, credits existing holders, NOT a contested rules rewrite; IBIT's prospectus permanently abandons forked/airdropped assets — ETF-flow mechanics insulated, market effect = headline noise). [Bitcoin.com News](https://news.bitcoin.com/august-timeline-puts-bitcoin-bip-110-signaling-and-paul-sztorcs-hard-fork-in-focus/)
- **JUL 25** — difficulty: the projected ~16% cut did NOT materialize (realized +0.99% at block 959,616; ~Aug 8 retarget est. ~+0.8–2.3%) — treat large pre-retarget projections as low-reliability. Miner-stress candidate context: Poolin Ch11 (Jul 22, $163.7M/~11,700 frozen wallets); cost-to-mine ~$84K vs spot; ~$19B capex → AI/HPC.

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
