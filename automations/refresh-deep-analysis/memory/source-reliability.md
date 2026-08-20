# Source Reliability

**Per-source predictiveness ledger.** Track which primary sources have surfaced material new information that turned out to be load-bearing for the analysis.

Used in Phase 2 (research) to weight which sources to validate against. Higher reliability = check this source first.

Score: `prime` (always check first) / `solid` (consistently useful) / `mixed` (sometimes signal, sometimes noise) / `low` (often premature or wrong) / `dormant` (no signal in 26 weeks).

## Scores

| Source | Type | Score | Last material hit | Notes |
|---|---|---|---|---|
| `banking.senate.gov` | .gov / committee | prime | MAY 12, 2026 (CLARITY draft release) | Primary source for committee markups; releases drafts ahead of vote. |
| `whitehouse.gov/presidential-actions` | .gov / EO | prime | (pre-seed) | Strategic Bitcoin Reserve EO surfaced here first. |
| `sec.gov/edgar` | regulatory / filings | prime | MAY 26, 2026 (MSTR 8-K disclosing $1.5B convert repurchase + 4,391 BTC gain via debt retirement, unchanged 843,738 stack — direct primary, beat press by ~24h) | Public-co treasury moves filed here first (often days before press). **ACCESS NOTE (AUG 19): direct fetch still 403 (4th consecutive run), but the market-news pass captured search-verified accession URLs for both load-bearing filings — Aug 10 8-K (000119312526341297, the THESIS-004-retiring third sale) and Aug 17 8-K (000119312526353240, eighth no-buy week) — closing the carried 'accession pending' item. Score unchanged.** |
| `strategy.com/press` | corporate IR | solid | MAY 11, 2026 (535 BTC buy) | Reliable; weekly cadence; press release lags 8-K by ~24h. |
| `bitcointreasuries.net` | tracker | solid | (ongoing) | Aggregates corporate + sovereign holdings. Use for state-of-play, not breaking news. |
| `farside.co.uk/btc` | data | solid | (daily) | ETF flow data. Reliable for direction; daily granularity sometimes lags fund disclosures. **ACCESS NOTE (AUG 19): 403'd a 4th consecutive run — dailies via KuCoin/financefeeds/Blockchain.News/CoinStats cross-checks; expect ±$5–30M variance between restatements.** |
| `federalreserve.gov` | .gov / monetary | prime | AUG 3, 2026 (Jul 29 FOMC statement fetched directly — the 9–3 hold with three named +25bp dissents, "energy supply shocks" language; the run's macro resolution, scoring the ratification watch MISS at 0.01) | Dot plots + minutes + statements are primary macro signal. Statement URL pattern `newsevents/pressreleases/monetaryYYYYMMDDa.htm` reachable this cycle. |
| `treasury.gov` | .gov / monetary | solid | (quarterly issuance) | Issuance schedule + sanctions actions. |
| `bls.gov` | .gov / macro data | prime | JUL 19, 2026 (June CPI Summary — the cycle's decisive macro resolution) | CPI + Employment Situation = the two prime macro releases. Cite the current-release nr0.htm URL, not archives. **ACCESS NOTE (AUG 7): 403'd on the July Employment Situation — figures scored on 4-outlet corroboration; score unchanged (access failure, not accuracy).** |
| `cmegroup.com` (FedWatch) | data / rate pricing | solid | JUL 19, 2026 (post-CPI pricing: ~70% July hold / ~30% July hike, ~65% September hike — the market-state read that capped the CPI watch at PARTIAL and set the FOMC-ratification watch at 0.25) | The primary for rate-path market pricing (futures-implied). Press restates it with lag/rounding — cite the tool directly; single-day swings are real information (Sept odds ran ~30%→>75%→~65% inside 6 sessions this cycle). |
| `github.com/bitcoin/bips` | protocol | prime | (BIP draft updates) | Authoritative for protocol proposals; check BIP repo before press coverage. |
| `coindesk.com` | press | mixed | **AUG 19, 2026 (MSCI consultation coverage Aug 14 — the run's key corporate-structure development + Strategy's response)** — prior hits: the Aug 6 no-vote confirmation, Thune's Jul 23 concession, BSTR/Cantor scrap, Japan FIEA | Useful for confirmation + color; never sole source for a slot or thesis. Congressional-process + policy coverage strong FOUR months running — the reliable first read on Senate crypto mechanics. |
| `bitcoinmagazine.com` | press | mixed | (per cycle) | Same as CoinDesk; protocol coverage stronger than regulatory. |
| `cointelegraph.com` | press | mixed | (per cycle) | Same. Sometimes premature; verify against primary. |
| `cnbc.com` | press | mixed | JUN 17, 2026 (Warsh's first FOMC — hawkish dot plot flips to project a 2026 hike, 9/18 officials, 17/18 upside inflation risk; the single highest-information macro resolution of the system to date — 7 macro watch rows scored against it) | Reliable for Fed / macro confirmation. Verify quoted dot-plot details against `federalreserve.gov` (the Jun 17 page returned 403; outcome corroborated across NYSE/NPR/Fox/Conference Board) and PCE against `bea.gov`. Strong macro coverage two cycles. |
| `bea.gov` | .gov / macro data | prime | MAY 28, 2026 (April core PCE release — Fed's preferred gauge, primary not aggregator-restated) | Core PCE = Fed's preferred gauge; primary source for the print CNBC/Reuters restate. Pair with `bls.gov` CPI. |
| `bloomberg.com` | press | solid | JUL 19, 2026 (Saylor's Strategy raises reserve to $3 billion with stock sale — the Jul 13 8-K's liability-pre-funding read, the run's key corporate datapoint; prior hit JUN 5 sub-$60K break) | Better for institutional context than tape-running breaking news; strong on corporate capital-structure framing. Verify 8-K figures against sec.gov/edgar. |
| `investing.com` | press / desk analysis | mixed | JUL 8, 2026 ("Bitcoin ETF flows show a fragile rebound, not a confirmed recovery" — the well-calibrated framing of the 3-day inflow streak: IBIT was still bleeding on Jul 2 and only turned Jul 7, so the recovery is real but unconfirmed against the ~$5.4B YTD hole; also the Jun 13 "$3.4B bleed more cyclical than structural" GBTC fee-hierarchy tell) | Useful for desk-style synthesis + flow-composition reads AND for measured "don't over-read the bounce" framing; verify flow figures against Farside/TheBlock. Not a primary source — confirmation tier. |
| `prestoresearch` (Presto Research) | research / desk | solid | JUN 5, 2026 (independently attributed the June slump to "competition from gold and AI stocks as investors reassess Fed rate-cut prospects" — the SECOND distinct source naming the AI-rotation mechanism, upgrading the `risk-asset-relative-performance → btc-etf-rotation` edge weak→medium) | Desk research; useful as an independent corroborator of flow-driver attribution. Verify against primary flow data (Farside). |
| `coinglass.com` | data / tracker | solid | MAY 15, 2026 (BTC ETF $1B weekly outflow aggregation — first weekly outflow after six straight inflow weeks) | Useful for ETF AUM + flow direction. Cross-check single-day prints against Farside. |
| `arkhamintelligence.com` | on-chain | mixed | MAY 16, 2026 (Bhutan sovereign drawdown attribution) | Strong for on-chain attribution; can over-interpret cluster activity. When attribution is disputed (as Bhutan/DHI is), flag the dispute. |
| `bgeometrics.com` | on-chain / data | solid | JUL 2, 2026 (2026 whale-accumulation cohort analysis — LTH SOPR ~0.8 = first below-cost LTH selling since 2023 + whale-tagged accumulation spike sub-$60K; the composite capitulation signal behind the contrarian 0.35→0.40 and the new `spot-lth-whale-accumulation → price-floor` edge) | On-chain cohort + SOPR + accumulation analytics; useful for the capitulation/handoff read the flow tape can't show. Also hosts the BIP signaling tracker. Verify cohort attribution against a second on-chain source (Glassnode/CryptoQuant) before load-bearing use. |
| `fortune.com` | press | mixed | MAY 15, 2026 (Warsh-dominoes analysis: Treasury inflation data → rate cuts → FOMC framing) | Useful for macro-policy synthesis; verify rate-cut probability claims against `cmegroup.com/FedWatch` and `federalreserve.gov`. |
| `finance.yahoo.com` | press / data | mixed | JUN 24, 2026 (Jun 9 ethics-talks collapse — the run's most material regulatory development) | ETF-flow color + regulatory developments; cross-check prints vs Farside, floor timing vs congress.gov. Confirmation tier. |
| `tftc.io` | press / data | mixed | JUN 28, 2026 (streak-to-7 + FBTC-flip; surfaced the Jun 24 YTD-cumulative inversion) | Cites Farside/Balchunas — verify cumulative figures vs Farside. Confirmation tier. |
| `bitbo.io` | tracker | solid | JUN 28, 2026 (Strategy held 847,363 BTC through the fresh ~$58K low with NO dip-buy 8-K Jun 24–28 — the cash-parking-as-policy confirmation; carried from the Jun 24 treasury-pivot print) | Corporate-treasury holdings + transaction tracker (alongside bitcointreasuries.net). Use for state-of-play; verify individual buys/sales against SEC EDGAR 8-Ks (primary). |
| `coinstats.app` | press / AI-aggregated | low | JUN 24, 2026 (sub-$60K break tape summary) | AI-aggregated; NOT primary — cross-check price vs an exchange and liquidations vs Coinglass. |
| `cryptotimes.io` | press | low | MAY 14, 2026 (CLARITY timeline analysis) | Synthesis pieces only; never sole source; verify timing vs congress.gov. |
| `ccn.com` | press | mixed | JUN 28, 2026 (BTC ~$58K low on ~$1.26B liquidations across 209,000+ traders; named $55K as the next support — the cleanest tape frame for the second-cascade day) | Useful for price/liquidation tape + level-mapping. Cross-check liquidation totals against Coinglass (figures vary by window) and price against an exchange/CoinGecko. Confirmation tier, not primary. |
| `interactivecrypto.com` | press | low | JUN 28, 2026 (sub-$60K sentiment snapshot) | AI-aggregated; NOT primary — verify price vs an exchange, F&G vs alternative.me. Lowest tier. |
| `thehill.com` | press | mixed | JUN 28, 2026 (House SAVE America Act gridlock halts floor action; Senate two-week recess — the exogenous floor-time-scarcity development that upgraded the must-pass-standoff causal edge and stepped CLARITY 0.30→0.25) | Strong on congressional-calendar / floor-process reporting (the second-order legislative-timing channel). Verify floor scheduling against `congress.gov` + the Senate floor calendar. Confirmation tier for the calendar-congestion read. |
| `pymnts.com` | press | mixed | JUN 28, 2026 (CLARITY Act nears Senate floor ahead of the recess deadline; Stifel desk framing end-of-July as the practical passage deadline after which 2026 odds "deteriorate materially") | Useful for policy-desk framing + deadline analysis on market-structure legislation. Verify vote-timing claims against `banking.senate.gov` + `congress.gov`. Confirmation tier. |
| `axios.com` | press | mixed | JUL 19, 2026 (CLARITY held up as Democrats seek the ethics provision — the cleanest mainstream sourcing on the merged draft omitting Section 604 + the Murphy/Van Hollen/Merkley defections, the run's operative regulatory development) | Strong on congressional process/vote-math reporting; thin on crypto mechanics. Verify floor scheduling against `congress.gov` + the Senate calendar. Confirmation tier. |
| `foxnews.com` | press | mixed | JUL 19, 2026 (Iran 60-day deal reaches halfway mark as ceasefire collapses — 300+ U.S. strikes, Hormuz shipping attacks, Trump declaring the ceasefire "over"; the macro-inversion datapoint that re-activated the energy-shock edge) | Useful for White-House/security-establishment sourcing on the Iran file; frame with a second outlet (CNN/NPR ran the mediation-continuing side). Confirmation tier. |
| `bloomingbit.io` | press / data restatement | low | JUL 19, 2026 (Jul 17 ETF flows $132.3M, IBIT +$136.5M / FBTC −$4.2M; FedWatch restatement 70.1% July hold / 64.9% Sept hike) | Bloomberg-affiliated Korean crypto feed; useful fast restatement of Farside + FedWatch figures when primaries are unreachable. NOT primary — verify against Farside/CME. |
| `fxleaders.com` | press / FX desk | **BANNED — never cite** | JUL 26, 2026 (NEGATIVE hit: published FABRICATED content; a draft citation had to be excised) | **Hard rule: never cite, including restatements.** Use CME FedWatch directly, or CNBC/Yahoo restatements. |
| `en.cryptonomist.ch` | press / data restatement | low | JUL 26, 2026 (Jul 23 −$225.2M streak-breaker; ~$1B 7-day streak; week +$274M through Thu; Fear & Greed 28) | Fast ETF-flow restatement tier used when farside.co.uk 403s. NOT primary — streak totals disputed vs other restatements ($981.2M vs $999.38M this run; phrase as "just under $1B"). Cross-check against Crypto Briefing/CoinStats. |
| `theblock.co` | press | mixed | AUG 3, 2026 (Strategy Aug 3 8-K full restatement — 1,638 BTC @ $63,957, 842,138 holdings, $4B reserve — the run's load-bearing corporate fact while EDGAR 403'd; also the "Bitcoin Drive engaged" + STRC-12% piece) | Strong on corporate-filing restatements with full figures; used as the EDGAR fallback two runs running (with Cointelegraph as the second independent fetch). Press tier — verify against EDGAR whenever reachable. |
| `blog.coinkite.com` | vendor advisory / primary | solid | AUG 3, 2026 (Coldcard Mk3 seed-generation advisory + entropy backgrounder — THE primary source for the largest hardware-wallet breach in Bitcoin history; root cause, affected firmware range 4.0.1–5.0.3, migration guidance) | Vendor security advisories are primary for incident scope/cause (with the usual vendor-interest caveat on blame framing — cross-check loss tallies against independent trackers like Crypto Briefing/CoinDesk). |
| `cryptoticker.io` | press / data restatement | low | AUG 3, 2026 (weekly wrap: BTC $63,153 week close −2%; week ETF net −$61.53M; July +$172.4M; Warsh "no soft inflation target"; Sept odds >60%) | Fast weekly-wrap restatement tier. NOT primary — its July ETF total ($172.4M) diverges from CoinDesk's daybook (~$205M); phrase monthly totals as "about $200M." |
| `trmlabs.com` | blockchain forensics / research | solid | AUG 7, 2026 ("Inside the $116M Coldcard hack" — the authoritative tally: 1,816 BTC / four waves / 128→40-bit quantification) | Primary-adjacent for incident scope/attribution (like Arkham). Tallies vary by tracker — prefer TRM/Galaxy's methodology-stated figure, phrase alternatives as ranges. |
| `congress.gov` | .gov / legislative record | prime | **AUG 19, 2026 (NEW row): H.R. 3633 actions page — the canonical CLARITY status record (House passage Jul 2025 294–134; Senate referral/committee actions), cited per the user's status-clarity hint** | The authoritative bill-status source; floor SCHEDULE lives with the Senate calendar/leadership, not here — pair with floor reporting for timing questions. |
| `euronews.com` | press / business desk | mixed | **AUG 19, 2026 (NEW row): "SEC unveils new crypto rules" (Aug 19, FETCHED) — carried the accurate Regulation Crypto Assets figures ($5M/$75M, 60-day comment, safe harbor, state preemption) while sec.gov 403'd direct fetch** | Useful European restatement tier for U.S. regulatory figures; verify against the SEC rule PDF when reachable. Confirmation tier. |
| `kucoin.com/news/flash` | exchange news flash | low | **AUG 19, 2026 (NEW row): BIP-110 failure fetch (Aug 9) — 2.53%/51 blocks final signaling, block-961,632 split, 2-block minority stall, AntPool trigger detail** | Fast, figure-dense flash tier (also used for ETF-flow dailies while Farside 403s). NOT primary — verify protocol facts against bip110.org/BIP repo and flows against Farside when reachable. |
| `thenationalnews.com` | press / energy & Gulf desk | mixed | **AUG 7, 2026 (NEW row): "Oil prices slump on potential US–Iran deal to open Strait of Hormuz" (Aug 3, fetched) — Brent $83.51 −5.09%, the Hormuz-first-then-nuclear talks structure, and the 2026 Brent arc (>$126 April peak → <$72 early July → +24% July spike)** | Gulf-based outlet — strong on Hormuz/OPEC logistics detail underserved by U.S. press; frame geopolitical claims with a second outlet (its "deal imminent" sourcing leans regional officials). Confirmation tier. |

## Per-source notes (evolved over time)

### `banking.senate.gov`
- Markup schedule + bill drafts published 24–72h before vote. Read the draft text, not the press release.
- Chair opening statements at markup are leading signals of which amendments will gain traction.

### `sec.gov/edgar`
- 8-Ks for treasury moves filed within 4 business days; often 1–2 days before press. Set up direct EDGAR full-text search for major issuers.
- Form 4 (insider transactions) sometimes leads policy announcements.

### `strategy.com/press`
- Pattern through 2024–2026: weekly Monday press release describing prior week's buy. Deviation from this cadence is itself a signal.

### Press tier (mixed)
- **CoinDesk** stronger on regulatory/ETF coverage; weaker on protocol.
- **Bitcoin Magazine** stronger on protocol; sometimes overstates sovereign signaling.
- **Cointelegraph** weakest tier; verify everything against primary.

## Anti-pattern: aggregators

Never cite as primary:
- News aggregators (Google News, Apple News).
- Social media (X, Reddit) — useful as a discovery channel only.
- Re-blogs and listicles.

## Hygiene rules

1. **Update only when a source materially affects the run.** A source that surfaces nothing new doesn't move on the ladder.
2. **Score adjustments require evidence.** A `prime` source that misses a major story can drop; one that catches a story everyone else missed can rise.
3. **Press tier is permanently `mixed` — never `prime`.** They aren't primary sources; they're confirmation.
4. **Dormant sources don't disappear.** They stay in the ledger; if a story re-elevates them, the score is updated.
