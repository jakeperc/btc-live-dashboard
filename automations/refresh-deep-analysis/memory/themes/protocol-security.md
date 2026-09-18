# Theme: Bitcoin Protocol & Adjacent-Layer Security

- **Slug:** `protocol-security` (the matrix row; sub-themes: quantum migration, the August forks, Coldcard, and — from SEP 13 — the Liquid sidechain exploit, which has its own file `themes/liquid-sidechain.md`)
- **Category:** Protocol / technical / adjacent-layer security
- **First tracked:** MAY 18, 2026
- **Last updated:** SEP 16, 2026 (no material change: the Liquid status page is silent since Sep 10 — peg-ins open, peg-outs closed; row HELD 0.65; eCash beta ~Sep 20 pending; see the SEP 13 status below)
- **Status (SEP 13):** Active — **SLOT 5 ROTATED FORKS → THE LIQUID SIDECHAIN EXPLOIT; THE FORK THREADS CLOSED AS PRICED.** (1) **Forks:** the eCash (ECX) hard fork ran its ALPHA phase from ~Aug 23 at block 963,648 with practice tokens (pECX), no confirmed exchange support and no price (25,092 blocks in ~13 hours after the difficulty reset; hashrate 3.53 PH/s); BETA ~Sep 20 at block ~967,680; MAINNET ~Oct 31 at block ~973,728 with permanent 1:1 balances. No mainnet disruption → the split-tail watch scored MISS at 0.10 (Brier 0.01); re-seeded on the mainnet phase at **0.05** (by Nov 15). BIP-110 is dead (final signaling 2.53%; the minority chain stalled Aug 9). The `core-non-endorsement` edge completed both legs → `strong`. Scam warning standing: never enter keys to "claim" fork coins. (2) **Coldcard:** the tally stayed static (~1,816 BTC / ~$116M since Aug 4); no second vendor → the containment watch scored MISS at 0.10 (Brier 0.01); the incident is CLOSED. (3) **Liquid (Sep 6):** ~3,996 BTC pegged out via an Elements range-proof verification-cache bug; 3,400 returned; 598.5 retained; peg-outs suspended; mainnet untouched — see `themes/liquid-sidechain.md`; watch row 1:1 restoration by Oct 15, **0.65** = the theme standalone. (4) **Quantum:** quiet; the BIP-361 watch steps 0.35→0.05 (17 quiet weeks; window Sep 30). (5) **Mining (context):** hashrate ~1 ZH/s daily snapshot (Sep 4); difficulty +1.31% to 127.45T (Sep 6) after a ~10% drop to 125.81T (~Aug 23, the second-largest 2026 decline). Protocol calibration: N=3, +0.10 — heavily-evidenced non-events at 0.05. [Crowdfund Insider — eCash phases](https://www.crowdfundinsider.com/2026/08/300508-bitcoin-holders-prepare-for-matching-ecash-ecx-balances-as-multi-phase-hard-fork-begins/) · [Blockstream — Liquid status](https://status.blockstream.com/incidents/b8b719f3-db70-4487-9cff-946e69509228)
- **Statuses JUN 24 – AUG 19 (condensed SEP 13; full text in git):** BIP-110 (a contested data-limit UASF; ~0.31% signaling from June; Core non-endorsing; Knots-backed) lapsed at its Aug 7 flag day (block 961,632) at 2.53% vs 55% — the lock-in watch MISS at 0.10, the ledger's first protocol resolution; the enforcing-node minority chain mined 2 blocks and stalled. Coldcard Mk3 (Jul 30 – Aug 4): a March-2021 firmware bug routed seed entropy through a software RNG (fw 4.0.1–5.0.3; effective key strength as low as 40 bits) — the largest hardware-wallet breach in Bitcoin's history (~1,816 BTC / ~$116M / four waves, TRM); patched Aug 1; the counter-frame (randomness hygiene, not self-custody as a model) stands. The eCash spinoff (Sztorc; airdrop-style; IBIT's prospectus abandons forked assets) was pre-sharpened into the split-tail letter (major-exchange listing OR mainnet disruption).

## Sub-threads (state)

- **Quantum migration (long-tail).** BIP-360 (post-quantum signature format, P2MR path) foundational; draft BIP-361 a staged sunset for legacy signatures after post-quantum outputs exist; ~3M BTC permanently lost = the future political flashpoint. No sovereign comment; no pool/exchange position. Dormant-watch.
- **Forks.** Closed except the eCash calendar (beta ~Sep 20; mainnet ~Oct 31). Nothing consensus-level is pending on Bitcoin itself.
- **Adjacent-layer security.** Two incidents in six weeks (device; federated sidechain); base layer and ETF custody untouched both times → the generalized `adjacent-layer-security-failure → base-layer / custodial-wrapper relative advantage` edge (weak/medium) and the matching cross-current pattern (2 instances).

## Causal links

- `core-non-endorsement + low-miner-signaling → contested-soft-fork-activation-unlikely / chain-split-risk` (`strong` — both legs validated quiet)
- `adjacent-layer-security-failure → base-layer / custodial-wrapper relative advantage` (`weak/medium`; 2 instances; needs a custody-mix datapoint)
- `quantum-migration-bip-progress → sovereign-holder-engagement` (`weak`, forward-looking)
- ↔ `themes/etfs.md` (the matrix's protocol→etfs −0.02 sign question stays FLAGGED for security incidents)

## Open questions

1. Liquid: is the 598.5-BTC gap covered 1:1 and when do peg-outs reopen? (Row 0.65.)
2. eCash mainnet (Oct 31): any major-exchange listing or mainnet harm? (0.05.)
3. A custody-mix datapoint after two adjacent-layer failures — does any flow/holdings series show a shift toward regulated custody?
4. Quantum: the first pool/exchange/sovereign position on BIP-361 (2027 window; re-seed after Sep 30).

## Upcoming catalysts

| Date / window | Catalyst | Why it matters |
|---|---|---|
| ~Sep 20, 2026 (block ~967,680) | eCash beta phase | noise unless an exchange lists it |
| by Oct 15, 2026 | Liquid peg-outs reopen with 1:1 backing | row 0.65; the theme's exit |
| ~Oct 31, 2026 (block ~973,728) | eCash mainnet (permanent balances) | row 0.05 (by Nov 15) |
| 2027+ | first sovereign comment on BIP-361; first pool/exchange position | politicizes the quantum conversation |

## Press / source bias notes

- `github.com/bitcoin/bips` prime for BIPs; `status.blockstream.com` primary for Liquid; TRM/Galaxy for the Coldcard tally; Crowdfund Insider / WEEX for the eCash calendar (verify against project materials); press conflates "signaling" with "activation" — be precise.
