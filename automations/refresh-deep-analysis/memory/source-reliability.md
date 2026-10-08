# Source Reliability

**Per-source predictiveness ledger.** Track which primary sources have surfaced material new information that turned out to be load-bearing for the analysis. **Trimmed SEP 13, 2026** — low-tier rows condensed to one line; per-hit history in git.

Used in Phase 2 (research) to weight which sources to validate against. Higher reliability = check this source first.

Score: `prime` (always check first) / `solid` (consistently useful) / `mixed` (sometimes signal, sometimes noise) / `low` (often premature or wrong) / `dormant` (no signal in 26 weeks).

## Scores

| Source | Type | Score | Last material hit | Notes |
|---|---|---|---|---|
| `banking.senate.gov` | .gov / committee | prime | MAY 12, 2026 (CLARITY draft release) | Committee markups + drafts. Since the merged text, floor timing lives with leadership — pair with the Senate floor schedule. |
| Senate floor schedule (`senate.gov` / `democrats.senate.gov`) | .gov / floor timing | prime | **SEP 13, 2026 (NEW row): the Sep 14 convening notice + the CLARITY cloture motion ripening Tue Sep 15 2:15 p.m. — the run's canonical legislative-timing fact** | The authoritative source for WHEN a vote happens; congress.gov carries the record afterward. |
| U.S. Senate Daily Press (`dailypress.senate.gov`) | .gov / floor record | prime | **OCT 7, 2026: the Sep 30 record — adjourned 11:24 p.m., no action on H.R. 3633, next vote Nov 9 5:30 p.m. (cloture on H.R. 2347) — scored the cloture row MISS.** Prior SEP 16: the Sep 15 roll call "Failed, 49-50"; Tillis's motion to reconsider | The same-day floor record; the fastest .gov source for a roll call and its procedural aftermath. |
| `whitehouse.gov/presidential-actions` | .gov / EO | prime | (pre-seed) | Strategic Bitcoin Reserve EO. Silent on the Tillis–Gallego ethics compromise all summer — the silence is itself the vote-math variable. |
| `sec.gov/edgar` | regulatory / filings | prime | OCT 7, 2026 — fourth straight reachable run; the Strategy Sep 28 / Oct 1 / Oct 5 and Strive Oct 5 8-Ks (two rows resolved on the Sep 28 filing) | Public-co treasury moves filed here first. Read the BTC, ATM and USD Cash lines. |
| `strategy.com/press` | corporate IR | solid | MAY 11, 2026 | 403 this run (the MSCI letter read via The Block). Lags the 8-K. |
| `bitcointreasuries.net` | tracker | solid | (ongoing) | State-of-play aggregate; the YARDSTICKS source for Strategy's holdings (845,050). |
| `bitbo.io` | tracker | solid | **OCT 7, 2026: IBIT 806,037.6 BTC as of Oct 6 (801,033.4 on Sep 30; Oct 2 +4,189) — scored both IBIT tail rows (MISS at 0.05: ~$67B AUM; 46.6K behind Strategy's 847,666).** Prior: SEP 16 784,525.6; SEP 13 779,839.7 (Sep 1) | Corporate + ETF holdings tracker (`/treasuries/blackrock-ibit/` — the `/ibit/` path 404s). Verify buys/sales against EDGAR. |
| `farside.co.uk/btc` | data | solid | (daily) | **403 for the SEVENTH consecutive run.** The Block's structured flows page (`/data/etfs/bitcoin-etf/spot-bitcoin-etf-flows`) is the canonical restatement (resolved the two-week row OCT 7); TFTC, KuCoin, Crypto Times cross-checks; expect ±$5–30M variance and phrase week totals as "about". |
| `federalreserve.gov` | .gov / monetary | prime | OCT 7, 2026 — Jefferson's Oct 1 speech + the October calendar (minutes Oct 7, 2 p.m.); **the Sep 15–16 minutes URL was 404 at run time (~14:00 UTC) — read them next run** | Speeches, statements, SEP, FOMC calendar, minutes (2 p.m. ET three weeks after the meeting). |
| `treasury.gov` (`home.treasury.gov`) | .gov / rates + issuance | prime (upgraded SEP 13) | SEP 26, 2026 — the par table corrects press intraday/misquoted yield prints most runs (see `themes/fed-monetary-policy.md`) | Cite the Treasury table for yield levels, never press; issuance + buyback schedules here. |
| `bls.gov` | .gov / macro data | prime | OCT 7, 2026 — the September Employment Situation (Oct 2: +29K; Jul revised to −10K) — the weak-DATA carve-out's trigger | Cite the current-release nr0.htm URL. |
| `bea.gov` | .gov / macro data | prime | OCT 7, 2026 — the August PCE release (Sep 30: 3.4% / core 3.0%, both below forecast) — the print that started October's flip to a hold | Core PCE = the Fed's gauge; cite the release page. |
| `cmegroup.com` (FedWatch) | data / rate pricing | solid | JUL 19, 2026 | Unreachable this run; CentralBank.watch used as the restatement. |
| `centralbank.watch` | data / rate-pricing restatement | solid (snapshot LAGS — check the date) | OCT 7, 2026 — the Oct 6 snapshot (Oct 28 hike 19.5%; Dec 9 cumulative 84.3%; 82bp over nine meetings) — the HOLD row's restatement datum; CME ~15% (Oct 2) / 24% (Oct 5) via CoinDesk agree in direction | A clean restatement of CME pricing with a visible snapshot date; verify against FedWatch when reachable. |
| `polymarket.com` | market-implied odds | solid (as ODDS, never as facts) | SEP 13, 2026 — CLARITY 2026 odds 23% ($15.23M traded) | Use for the market's own probability; over-priced CLARITY all year relative to the ledger's calls (JUL 26: 45% vs our 0.20 MISS). |
| Senators' press pages (`gallego.senate.gov`, `cortezmasto.senate.gov`) | .gov / member statements | solid | SEP 16, 2026 — Gallego's Sep 15 no-vote statement; the primary text behind press quotes | Verbatim member positions; the vote-math primary once a roll call is over. |
| `tftc.io` (Bitcoin ETF flows table) | tracker / Farside-basis restatement | solid | SEP 16, 2026 — resolved a misdated aggregator figure against the September daily table | The cleanest Farside restatement while farside.co.uk 403s; verify load-bearing days against a second outlet. |
| `govinfo.gov` (BILLSTATUS XML) | .gov / legislative record | prime | **SEP 26, 2026 (NEW row): BILLSTATUS-119hr8957.xml — "Ordered to be Reported (Amended) by the Yeas and Nays: 28 - 21" (Sep 16); sponsors/cosponsors; the introduced text for the substitute delta** | The reachable canonical record while `congress.gov` 403s. |
| `financialservices.house.gov` · `docs.house.gov` | .gov / committee record + text | prime | SEP 26, 2026 (new row) — the H.R. 8957 markup + Steil substitute (see `themes/sovereign-reserves.md`); a press "Waters amendment rejected" claim is NOT in the record | Read the amendment text, not the press summary; the committee page is the vote record. |
| `waysandmeans.house.gov` | .gov / committee | solid | SEP 26, 2026 (new row) — H.R. 10357 approved 38–5 | Provisions travel badly through aggregators — cite the release. |
| `reginfo.gov` (OIRA EO 12866 review) | .gov / rulemaking docket | prime (dashboard reachable; RIN detail page not yet fetched) | SEP 26, 2026 (new row) — RIN 3038-AF80 prerule received Sep 17, press-restated consistently | Fetch the RIN detail page directly next run; the docket stage is the instrument a row scores on. |
| `mnav.com` | tracker (MSTR premium to BTC NAV) | solid (verify against price × shares / NAV) | SEP 26, 2026 (new row) — Strategy mNAV 1.07× at the Sep 26 close (52-week range 0.95–1.43×) | The missing premium variable for the reflexivity valve — pull it every run. |
| `finance.yahoo.com` | press | mixed | OCT 7, 2026 — the Oct 2 price piece ($86,459 after the jobs report), the Oct 7 market live (30Y 5.70%; stocks off records) and The Block's Q3 ETF piece ($6.3B; net assets $109.3B) | Price snapshots and restatements; verify against the docket / a second outlet. |
| `thedefiant.io` | press | mixed | OCT 7, 2026 (new row) — the reginfo.gov entry for RIN 3038-AF80 restated with the EO 12866 review clocks (10 working days for a prerule vs 90 for rules) and "the agency's only sitting commissioner" | Rulemaking-docket restatements; the clock verified against EO 12866 §6(b)(2); reginfo.gov itself still unfetched. |
| `orrick.com` (law-firm insight) | legal analysis | solid (process facts; not a primary for events) | OCT 7, 2026 (new row) — Oct 2: the OIRA submission "not yet published"; SEC comments to Oct 20; Tillis's reconsider motion preserves a path | Clean process summaries; cite the underlying docket when it exists. |
| `archives.gov` (EO 12866 text) | .gov / primary text | prime | OCT 7, 2026 (new row) — §6(b)(2): OIRA review of preliminary regulatory actions within 10 working days; proposed/final rules within 90 calendar days — corrected the ANPRM row's premise | The primary for review-clock claims. |
| `status.blockstream.com` | vendor incident page / primary | solid | **SEP 13, 2026 (NEW row): the Liquid incident page — ~4,000 BTC withdrawn via SideSwap's Peg-out Authorization Key ("not compromised"); block production resumed Sep 10; peg operations suspended** | Primary for incident scope/timeline (vendor-interest caveat on blame framing); cross-check loss/return tallies with an independent outlet. |
| `github.com/bitcoin/bips` | protocol | prime | (BIP draft updates) | Authoritative for protocol proposals. Quiet this run. |
| `congress.gov` | .gov / legislative record | prime | AUG 19, 2026 (H.R. 3633 actions page) | **Fetch timed out / 403 this run** — retained as canonical; pair with the floor schedule for timing. |
| `federalregister.gov` | .gov / rulemaking record | prime | OCT 7, 2026 — the FinCEN withdrawals (FR Docs 2026-20430 / -20429, Oct 6; read via the public-inspection PDFs by market-news) and the **documents API** (`/api/v1/documents.json?conditions[agencies][]=...`) — a bot-wall-free way to confirm what has NOT been published (no CFTC crypto document Sep 17–Oct 7) | Use the API for presence/absence checks; the SEC press page is the fallback for SEC rule dates. |
| `cftc.gov` | .gov / regulator | prime | SEP 26, 2026 — press-release index reachable; the OIRA filing itself was NOT announced here (surfaced via reginfo.gov restatements) | Speeches + press releases; the fallback-track source if CLARITY fails. |
| `coindesk.com` | press | mixed | SEP 26, 2026 — the three-month-streak / 2012-analog piece used in the primary body | Confirmation + color; never sole source. Strong on congressional mechanics and market structure. |
| `theblock.co` | press | mixed | SEP 26, 2026 — the $998.95M-day flow/price restatement (this run's canonical) | The reliable ETF-flow restatement while Farside 403s; corporate-filing restatements with full figures. |
| `bloomberg.com` | press | solid | AUG 25, 2026 (three-month high $81,257; >$4B bearish positions liquidated; biggest three-day surge since 2023) | Institutional context; verify figures against primaries. |
| `cnbc.com` | press | mixed | SEP 13, 2026 (Aug 28 yields piece; Aug 31 analyst roundup "not everyone is convinced"; Sep 10 Brent $107.63 settle) | Fed/macro confirmation; verify against `federalreserve.gov` / `bls.gov`. |
| `crypto.news` | press | mixed | **SEP 13, 2026 (NEW row): "CLARITY Act faces defeat as Senate ethics fight deepens" (Sep 8) — the Rounds/Tillis quotes that stepped the cloture row to 0.15** | Congressional color; verify vote-count claims. |
| `cryptoinamerica.com` | press / newsletter | mixed | SEP 13, 2026 (the Sep 10 GOP substitute text: DeFi provisions, credit-union authority, stablecoin rewards unchanged; White House "radio silence") | Useful early read of bill text; verify against congress.gov when reachable. |
| `thehackernews.com` | press / security | mixed | SEP 13, 2026 (Liquid: 3,996 BTC out; 3,400 returned; 598.5 retained) | Security-incident restatement; pair with the vendor page. |
| `aljazeera.com` | press | mixed | SEP 13, 2026 (Brent tops $100 Sep 9 on tanker strikes + missile attacks; yields at multidecade highs) | Gulf/energy color; frame with a second outlet. |
| `blog.coinkite.com` · `trmlabs.com` | vendor advisory · forensics | solid | AUG 3–7, 2026 (Coldcard root cause; the $116M / 1,816-BTC tally) | Incident closed (contained). |
| `bgeometrics.com` · `coinglass.com` · `arkhamintelligence.com` | on-chain / data | solid / solid / mixed | JUL 2 / MAY 15 / MAY 16, 2026 | Cohort + flow + attribution tools; verify load-bearing figures against a second source. |
| `prestoresearch` · `investing.com` | research / desk | solid / mixed | JUN 5 / JUL 8, 2026 | Independent corroborators of flow-driver attribution; confirmation tier. |
| `axios.com` · `thehill.com` · `pymnts.com` · `foxnews.com` · `npr.org` | press | mixed | JUL 19 / JUN 28 / JUN 28 / JUL 19 / SEP 1 (CR passage 370–48), 2026 | Congressional process + calendar color; verify timing against the Senate schedule. NPR fetch 403'd this run. |
| `euronews.com` · `thenationalnews.com` | press | mixed | AUG 19 / AUG 7, 2026 | Regulatory-figure and Gulf-energy restatements; confirmation tier. |
| `hedgeco.net` · `kucoin.com/news/flash` (SEP 16: a KuCoin-tier snippet misdated the Sep 15 ETF print as +$260M — never load-bearing) · `cryptotimes.io` · `en.cryptonomist.ch` · `bloomingbit.io` · `cryptoticker.io` · `coinstats.app` · `interactivecrypto.com` | fast restatement tier | low | SEP 13 (HedgeCo: the Aug 28 −$201.8M / week +$924.5M print) and earlier | Fast figure restatements when primaries are unreachable; NOT primary; phrase disputed totals as ranges. |
| `crowdfundinsider.com` | press | low | SEP 13, 2026 (eCash phases: alpha Aug 23 / beta ~Sep 20 / mainnet ~Oct 31) | Used for the fork timeline; verify against the project's own materials. |
| `fxleaders.com` | press / FX desk | **BANNED — never cite** | JUL 26, 2026 (fabricated content) | Hard rule: never cite, including restatements. |

## Per-source notes (evolved over time)

### `sec.gov/edgar`
- 8-Ks for treasury moves within 4 business days; the Monday 8-K is now the buy/sale/ATM tell in BOTH directions (SEP 13). Read the ATM line and the USD Cash line, not just the BTC line.

### `banking.senate.gov` / Senate floor schedule
- Drafts 24–72h before action; the floor schedule (not the committee) governs cloture timing; leadership's stated commitments are weak evidence against the schedule (vote-banking).

### `home.treasury.gov`
- The daily par yield curve + real-yield tables are the primary for rate levels; press restatements drift by 5–10bp on volatile days.

### Press tier (mixed)
- **CoinDesk** stronger on regulatory/ETF/market-structure; **The Block** the best ETF-flow restatement while Farside 403s; **Bitcoin Magazine** stronger on protocol; **Cointelegraph** weakest — verify everything.

## Anti-pattern: aggregators

Never cite as primary: news aggregators, social media (discovery only), re-blogs and listicles.

## Hygiene rules

1. **Update only when a source materially affects the run.**
2. **Score adjustments require evidence.**
3. **Press tier is permanently `mixed` — never `prime`.**
4. **Dormant sources don't disappear.**
5. **Access failures are logged, not scored (SEP 13).** A 403 is an access note; the score moves only on accuracy.
