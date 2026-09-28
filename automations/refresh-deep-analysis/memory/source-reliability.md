# Source Reliability

**Per-source predictiveness ledger.** Track which primary sources have surfaced material new information that turned out to be load-bearing for the analysis. **Trimmed SEP 13, 2026** — low-tier rows condensed to one line; per-hit history in git.

Used in Phase 2 (research) to weight which sources to validate against. Higher reliability = check this source first.

Score: `prime` (always check first) / `solid` (consistently useful) / `mixed` (sometimes signal, sometimes noise) / `low` (often premature or wrong) / `dormant` (no signal in 26 weeks).

## Scores

| Source | Type | Score | Last material hit | Notes |
|---|---|---|---|---|
| `banking.senate.gov` | .gov / committee | prime | MAY 12, 2026 (CLARITY draft release) | Committee markups + drafts. Since the merged text, floor timing lives with leadership — pair with the Senate floor schedule. |
| Senate floor schedule (`senate.gov` / `democrats.senate.gov`) | .gov / floor timing | prime | **SEP 13, 2026 (NEW row): the Sep 14 convening notice + the CLARITY cloture motion ripening Tue Sep 15 2:15 p.m. — the run's canonical legislative-timing fact** | The authoritative source for WHEN a vote happens; congress.gov carries the record afterward. |
| U.S. Senate Daily Press (`dailypress.senate.gov`) | .gov / floor record | prime | **SEP 16, 2026 (NEW row): the Sep 15 roll-call record — cloture on the motion to proceed to H.R. 3633 "Failed, 49-50" at 2:18 p.m.; the four Republican no votes named; Tillis's motion to reconsider timed at 3:01 p.m. — the run's canonical vote fact while congress.gov lagged** | The same-day floor record; the fastest .gov source for a roll call and its procedural aftermath. |
| `whitehouse.gov/presidential-actions` | .gov / EO | prime | (pre-seed) | Strategic Bitcoin Reserve EO. Silent on the Tillis–Gallego ethics compromise all summer — the silence is itself the vote-math variable. |
| `sec.gov/edgar` | regulatory / filings | prime | **SEP 26, 2026: the Sep 21 8-K (950 BTC "using USD Cash"; zero ATM; 846,000 / $75,416) + the Sep 25 8-K (daily dividend record dates; special meeting Oct 28) + Strive's Sep 21 8-K (1,355 BTC → 26,355) — the run's load-bearing corporate facts and the further-buy HIT; third straight reachable run. Prior: SEP 16 (the Sep 14 8-K); SEP 13 (the Aug 24 – Sep 8 8-Ks; the ledger's worst row)** | Public-co treasury moves filed here first. Access has alternated (403 four runs, reachable this run) — always try it first. |
| `strategy.com/press` | corporate IR | solid | MAY 11, 2026 | 403 this run (the MSCI letter read via The Block). Lags the 8-K. |
| `bitcointreasuries.net` | tracker | solid | (ongoing) | State-of-play aggregate; the YARDSTICKS source for Strategy's holdings (845,050). |
| `bitbo.io` | tracker | solid | **SEP 16, 2026: IBIT 784,525.6 BTC as of Sep 16 (Sep 14 +1,698.4; Sep 15 −2,128.7) vs Strategy 845,050 — the monthly holdings datapoint banked; gap ~60.5K. Prior SEP 13: IBIT 779,839.7 BTC as of Sep 1 — the first hard numerator datapoint for the crosses-Strategy watch in three runs (stepped 0.45→0.05)** | Corporate + ETF holdings tracker. Verify individual buys/sales against EDGAR. |
| `farside.co.uk/btc` | data | solid | (daily) | **403 for the SIXTH consecutive run.** Dailies via The Block (SoSoValue), HedgeCo, KuCoin, Crypto Briefing cross-checks; expect ±$5–30M variance between restatements and phrase week totals as "about". |
| `federalreserve.gov` | .gov / monetary | prime | **SEP 16, 2026: the FOMC statement (25bp to 3.75%–4.00%, 12–0; "Inflation remains elevated... a timelier return") and the SEP table (end-2026 median 4.1% from 3.8%; 16 of 18 see at least one more; 2027 4.1%) fetched — the run's load-bearing macro facts and the one-and-done MISS; the presser page is video-only (transcript pending). Prior SEP 13: Warsh's Jackson Hole keynote fetched — "Otherwise, we have work to do" / "a discipline, not a decision" — the sentence that repriced September and scored the hold-intact watch MISS** | Speeches, statements, SEP, FOMC calendar (fetched: Sep 15–16 with projections). |
| `treasury.gov` (`home.treasury.gov`) | .gov / rates + issuance | **prime** (UPGRADED SEP 13 from solid) | **SEP 26, 2026: the September par table (Sep 24: 2Y 4.18 / 10Y 5.10 / 30Y 5.47; Sep 25: 4.20 / 5.06 / 5.49) — corrected the press "5.21%" (an intraday print) to the 5.10% par close; the 2Y at 4.07% on Sep 16 also corrects a 4.45% press figure logged SEP 16. Prior SEP 13: the Sep 11 table (10Y 4.87%) + sb0607 (buybacks doubled) + the August refunding** | Cite the Treasury table for yield levels, never press; issuance + buyback schedules here. |
| `bls.gov` | .gov / macro data | prime | **SEP 13, 2026: all three releases fetched — Employment Situation (Sep 4: +162K, 4.1%), PPI (Sep 10: +0.4%/5.4%), CPI (Sep 11: +0.4%/3.4%, core 2.4%) — the data behind the 85–87% hike pricing** | Cite the current-release nr0.htm URL. Reachable this run after the Aug 7 403. |
| `bea.gov` | .gov / macro data | prime | MAY 28, 2026 (April core PCE) | Core PCE = the Fed's gauge; the August print lands Sep 30. |
| `cmegroup.com` (FedWatch) | data / rate pricing | solid | JUL 19, 2026 | Unreachable this run; CentralBank.watch used as the restatement. |
| `centralbank.watch` | data / rate-pricing restatement | solid (snapshot LAGS — check the date) | **SEP 26, 2026: the Sep 25 snapshot (Oct 28 hike 61.6% / hold 38.4%; Dec 9 cumulative 91.7%; ~89bp over nine meetings) — current this run and the standalone for the Fed-HOLD row; FedWatch (via CNBC) ~64% agrees. Prior: SEP 16 (a lagged Sep 15 snapshot: 43.5% / 88.4%); SEP 13 (Sep 11: hike 85%)** | A clean restatement of CME pricing with a visible snapshot date; verify against FedWatch when reachable. |
| `polymarket.com` | market-implied odds | solid (as ODDS, never as facts) | **SEP 13, 2026 (NEW row): "Clarity Act signed into law in 2026?" 23% on Sep 13 ($15.23M traded; path 82% Feb → 16% Sep 6 → 23%)** | Use for the market's own probability; note it has over-priced CLARITY all year relative to the ledger's calls (JUL 26: 45% vs our 0.20 MISS). |
| Senators' press pages (`gallego.senate.gov`, `cortezmasto.senate.gov`) | .gov / member statements | solid | **SEP 16, 2026 (NEW row): Gallego's Sep 15 statement ("I won't support any piece of legislation that enables him"); the seven-Democrat bloc's Jul 22 "falls short" statement (Cortez Masto) — the primary text behind the press quotes** | Verbatim member positions; the vote-math primary once a roll call is over. |
| `tftc.io` (Bitcoin ETF flows table) | tracker / Farside-basis restatement | solid | **SEP 16, 2026 (NEW row): the September daily table (Sep 14 +$160.0M; Sep 15 −$450.3M — IBIT −$161.7M, FBTC −$214.8M, ARKB −$17.4M; MTD +$17.1M) — resolved a misdated +$260M aggregator figure** | The cleanest Farside restatement while farside.co.uk 403s; verify load-bearing days against a second outlet. |
| `govinfo.gov` (BILLSTATUS XML) | .gov / legislative record | prime | **SEP 26, 2026 (NEW row): BILLSTATUS-119hr8957.xml — "Ordered to be Reported (Amended) by the Yeas and Nays: 28 - 21" (Sep 16); sponsors/cosponsors; the introduced text for the substitute delta** | The reachable canonical record while `congress.gov` 403s. |
| `financialservices.house.gov` · `docs.house.gov` | .gov / committee record + text | prime | **SEP 26, 2026 (NEW row): the Sep 16 markup page (nine measures; H.R. 8957 agreed 28–21; Steil ANS by voice vote; H.R. 10325 not agreed 21–28 — a press "Waters amendment rejected" claim is NOT in the record) + the Steil substitute PDF (20-year no-sale; audited proof of reserve; no purchase authority)** | Read the amendment text, not the press summary; the committee page is the vote record. |
| `waysandmeans.house.gov` | .gov / committee | solid | **SEP 26, 2026 (NEW row): the Sep 16 release — H.R. 10357 approved 38–5 (wash-sale 30 days; mining/staking ordinary income; $10 de minimis from 2028)** | Provisions travel badly through aggregators — cite the release. |
| `reginfo.gov` (OIRA EO 12866 review) | .gov / rulemaking docket | prime (dashboard reachable; the RIN detail page not yet fetched) | **SEP 26, 2026 (NEW row): the CFTC's RIN 3038-AF80 PRERULE received Sep 17 — press-restated consistently (Yahoo Finance, NewsBTC, cryptotimes, cryptodaily); the dashboard fetch showed only totals (88 pending)** | Fetch the RIN detail page directly next run; the docket stage (prerule / proposed / final) is the instrument a row scores on. |
| `mnav.com` | tracker (MSTR premium to BTC NAV) | solid (as a tracker; verify against MSTR price × shares / BTC NAV) | **SEP 26, 2026 (NEW row): Strategy mNAV 1.07× at the Sep 26 close (52-week range 0.95–1.43×); a coingape restatement had ~1.16–1.17× on Sep 21–22, "highest since June 22"** | The missing premium variable for the reflexivity valve — pull it every run. |
| `finance.yahoo.com` | press | mixed | **SEP 26, 2026 (NEW row): the Sep 18 price piece ($76,351 open; $77,991 at 7:25 a.m. ET — the THESIS-006 #4 clearance) and the CFTC–OIRA explainer (RIN, prerule stage, 90-day review)** | Price snapshots and rulemaking explainers; verify against the docket / a second outlet. |
| `status.blockstream.com` | vendor incident page / primary | solid | **SEP 13, 2026 (NEW row): the Liquid incident page — ~4,000 BTC withdrawn via SideSwap's Peg-out Authorization Key ("not compromised"); block production resumed Sep 10; peg operations suspended** | Primary for incident scope/timeline (vendor-interest caveat on blame framing); cross-check loss/return tallies with an independent outlet. |
| `github.com/bitcoin/bips` | protocol | prime | (BIP draft updates) | Authoritative for protocol proposals. Quiet this run. |
| `congress.gov` | .gov / legislative record | prime | AUG 19, 2026 (H.R. 3633 actions page) | **Fetch timed out / 403 this run** — retained as canonical; pair with the floor schedule for timing. |
| `federalregister.gov` | .gov / rulemaking record | prime | AUG 21, 2026 (Regulation Crypto Assets publication; comments to Oct 20) | **Bot wall on direct fetch this run** — the publication date and deadline were search-verified; the SEC press page is the fallback. |
| `cftc.gov` | .gov / regulator | prime | **SEP 26, 2026: press-release index reachable (9299-26 → 9304-26; PR 9303-26, Sep 24 = staff crypto FAQ updates); the OIRA filing (RIN 3038-AF80, Sep 17) was NOT announced on cftc.gov — it surfaced via reginfo.gov restatements; the speech index is reachable (Selig's Sep 22 Treasury Market Conference keynote, opaselig11, not fetched). Prior SEP 13: Selig's Aug 20 IAC pledge (release 9288-26)** | Speeches + press releases; the fallback-track source if CLARITY fails. |
| `coindesk.com` | press | mixed | **SEP 26, 2026: the Sep 23 three-month-streak piece (Jul +4.8% / Aug +25.2% / Sep +10.9%; the only precedent, 2012, then fell 9.7% in October) — the analog used in the primary body. Prior SEP 16: the decision-day live blog (BTC $75,400–75,700 through the FOMC; the Sep 15 −$450.4M print). Prior SEP 13: "A bitcoin short squeeze for the ages as futures open interest collapses" (Aug 25) — the composition read (short covering, not leverage) that scored THESIS-005 #5 and informed the clean-book judgment; also the Aug 27 eight-straight-days live blog** | Confirmation + color; never sole source. Strong on congressional mechanics and market structure. |
| `theblock.co` | press | mixed | **SEP 26, 2026: the Sep 22 $998.95M-day piece (IBIT $381.4M / ARKB $289.1M / FBTC $238.8M; BTC peak $87,300; ~$844M of shorts liquidated) — the run's canonical flow/price restatement. Prior SEP 16: the "Go time" piece (Atkins / Selig / Armstrong quotes) and the JPMorgan "not fully dead" note. Prior SEP 13: the Sep 4 largest-inflow-day piece (+$730.9M; IBIT $454M) and the Aug 8 Thune-files-cloture report; the Strategy-vs-MSCI letter (Sep 1) while strategy.com 403'd** | The reliable ETF-flow restatement while Farside 403s; corporate-filing restatements with full figures. |
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
