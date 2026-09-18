# Theme: Liquid Sidechain Exploit (Bitcoin-adjacent security)

- **Slug:** `liquid-sidechain` (mapped onto the `protocol-security` matrix row; `themes/protocol-security.md` is the umbrella)
- **Category:** Protocol / security (adjacent layer — a federated sidechain)
- **First tracked:** SEP 13, 2026 (entered the top-5 as slot 5, replacing the resolved forks card)
- **Last updated:** SEP 16, 2026
- **Status (SEP 16):** Active, unchanged — no vendor update since the Sep 10 10:00 UTC status entry (block production resumed; peg operations suspended; reserve restoration "in progress"); SideSwap peg-ins open since Sep 11; peg-outs closed. Row HELD 0.65; a second silent week steps it to 0.55–0.60. The slot-5 card was left untouched by market-news (its significance gate closed).
- **Status (SEP 13):** Active, live — **~3,996 BTC (~$320M, ~95% of the federation reserve) pegged out Sep 6 via an Elements range-proof verification-cache bug; 3,400 BTC returned Sep 7; 598.5 BTC (~$47M) retained as a self-declared "bounty"; Blockstream refused ransom (Sep 11); block production resumed Sep 10 (initially without transactions); SideSwap peg-ins reopened Sep 11; PEG-OUTS STILL SUSPENDED; Adam Back: the peg will be covered 1:1.** Bitcoin mainnet untouched; no keys compromised (11 of 15 functionary keys signed a peg-out that looked valid). Watch row: peg-outs reopen with 1:1 backing by Oct 15, **0.65**. Theme standalone 0.65.

## Key dated facts

- **SEP 6, 2026, 15:53:10 UTC (Liquid block 4,050,336)** — exploit: ~4,000 unbacked L-BTC minted via the Elements bug and pegged out through SideSwap's Peg-out Authorization Key ("that key was not compromised, nor were any others"). Patch deployed Sep 7 01:09 UTC (Elements v23.3.4); functionary/bridge updates deployed. [Blockstream status](https://status.blockstream.com/incidents/b8b719f3-db70-4487-9cff-946e69509228)
- **SEP 7, 2026** — 3,400 BTC returned; the attackers styled themselves "friendly hackers" and demanded a 10% bounty (Sep 9). [The Hacker News](https://thehackernews.com/2026/09/liquid-hackers-return-3400-bitcoin.html)
- **SEP 10–11, 2026** — blocks resume; peg-ins reopen (SideSwap); peg-outs closed; reserve restoration in progress; ransom refused.
- Context: a minor Symbiosis Bitcoin-bridge exploit (~15 BTC) the same week — not tracked.

## Analytical frame

- The second adjacent-layer failure of the summer (Coldcard Mk3, Jul 30 — a self-custody DEVICE; Liquid — a FEDERATED vault). Both left the base layer and the ETF custodial wrapper untouched → the `self-custody-security-failure → custodial-wrapper-relative-advantage` edge generalized to ADJACENT-LAYER failure (2nd instance; still no flow-level confirmation — the tape was Fed-dominated).
- Dashboard frame: "every extra layer asks for extra trust"; coins in ordinary wallets were never at risk.
- Not a consensus event — it does not touch BIP/fork tracking.

## Open questions

1. Is the 598.5 BTC gap covered by Blockstream/partners (1:1 restored) or socialized on L-BTC holders?
2. Is a second bug found in the post-incident audit?
3. Does L-BTC supply/usage shrink durably (the peg-out queue when reopened)?
4. Any regulatory read-across (a federated peg treated as a custodian)? None observed.

## Upcoming catalysts

| Date / window | Catalyst | Why it matters |
|---|---|---|
| by Oct 15, 2026 | peg-outs reopen with 1:1 backing | the watch row (0.65); users' locked coins |
| Q4 2026 | post-mortem / audit; Elements release notes | second-bug risk; the theme's exit |

## Press / source bias notes

- `status.blockstream.com` is the primary for scope and timeline (vendor-interest caveat on blame framing). The `Liquid_BTC` X incident report is social — context only. The Hacker News carried the returned/retained split accurately.
