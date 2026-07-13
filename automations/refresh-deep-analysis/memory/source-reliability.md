# Source Reliability

**Per-source predictiveness ledger.** Track which primary sources have surfaced material new information that turned out to be load-bearing for the analysis.

Used in Phase 2 (research) to weight which sources to validate against. Higher reliability = check this source first.

Score: `prime` (always check first) / `solid` (consistently useful) / `mixed` (sometimes signal, sometimes noise) / `low` (often premature or wrong) / `dormant` (no signal in 26 weeks).

## Scores

| Source | Type | Score | Last material hit | Notes |
|---|---|---|---|---|
| `banking.senate.gov` | .gov / committee | prime | MAY 12, 2026 (CLARITY draft release) | Primary source for committee markups; releases drafts ahead of vote. |
| `whitehouse.gov/presidential-actions` | .gov / EO | prime | (pre-seed) | Strategic Bitcoin Reserve EO surfaced here first. |
| `sec.gov/edgar` | regulatory / filings | prime | MAY 26, 2026 (MSTR 8-K disclosing $1.5B convert repurchase + 4,391 BTC gain via debt retirement, unchanged 843,738 stack — direct primary, beat press by ~24h) | Public-co treasury moves filed here first (often days before press). |
| `strategy.com/press` | corporate IR | solid | MAY 11, 2026 (535 BTC buy) | Reliable; weekly cadence; press release lags 8-K by ~24h. |
| `bitcointreasuries.net` | tracker | solid | (ongoing) | Aggregates corporate + sovereign holdings. Use for state-of-play, not breaking news. |
| `farside.co.uk/btc` | data | solid | (daily) | ETF flow data. Reliable for direction; daily granularity sometimes lags fund disclosures. |
| `federalreserve.gov` | .gov / monetary | prime | (FOMC cycles) | Dot plots + minutes are primary macro signal. |
| `treasury.gov` | .gov / monetary | solid | (quarterly issuance) | Issuance schedule + sanctions actions. |
| `bls.gov` | .gov / macro data | prime | **JUL 6, 2026 (June Employment Situation — +57K payrolls vs ~115K consensus, UR 4.2%/participation 61.5%, Apr/May −74K; the swing macro input that repriced the rate path dovish and scored the macro rate-path-toward-cuts watch a HIT)** | Core PCE = Fed's preferred gauge; primary, not aggregator-restated. Employment Situation = the other prime macro release. NOTE: the .htm archive URL returned 403 on WebFetch this run — figures corroborated via CNBC/Yahoo/Kiplinger restatement; verify the primary when reachable. |
| `github.com/bitcoin/bips` | protocol | prime | (BIP draft updates) | Authoritative for protocol proposals; check BIP repo before press coverage. |
| `coindesk.com` | press | mixed | JUL 8, 2026 (the 2yr breakeven inflation rate falling <2% for the first time since 2024 → "inflation outlook underpins Bitcoin bulls after best week since March" — the market-based dovish confirmation ahead of Jul 14 CPI that raised the June-CPI + THESIS-003 reads; also the May 29 AI-rotation re-attribution) | Useful for confirmation + color. Never sole source for a Market Pulse slot or DEEP_ANALYSIS thesis. ETF-flow + macro coverage strong; note its driver attribution shifted week-over-week (Iran → AI) — track whether the AI-rotation read holds. |
| `bitcoinmagazine.com` | press | mixed | (per cycle) | Same as CoinDesk; protocol coverage stronger than regulatory. |
| `cointelegraph.com` | press | mixed | (per cycle) | Same. Sometimes premature; verify against primary. |
| `cnbc.com` | press | mixed | JUN 17, 2026 (Warsh's first FOMC — hawkish dot plot flips to project a 2026 hike, 9/18 officials, 17/18 upside inflation risk; the single highest-information macro resolution of the system to date — 7 macro watch rows scored against it) | Reliable for Fed / macro confirmation. Verify quoted dot-plot details against `federalreserve.gov` (the Jun 17 page returned 403; outcome corroborated across NYSE/NPR/Fox/Conference Board) and PCE against `bea.gov`. Strong macro coverage two cycles. |
| `bea.gov` | .gov / macro data | prime | MAY 28, 2026 (April core PCE release — Fed's preferred gauge, primary not aggregator-restated) | Core PCE = Fed's preferred gauge; primary source for the print CNBC/Reuters restate. Pair with `bls.gov` CPI. |
| `bloomberg.com` | press | solid | JUN 5, 2026 (Bitcoin below $60K — first since Nov 2024 Trump win; $1.8B/72h liquidations, $4.4B 13-day ETF streak, support levels — the cleanest primary frame for the sub-$60K break) | Better for institutional context than tape-running breaking news; strong this run on the price-regime break. |
| `investing.com` | press / desk analysis | mixed | JUL 8, 2026 ("Bitcoin ETF flows show a fragile rebound, not a confirmed recovery" — the well-calibrated framing of the 3-day inflow streak: IBIT was still bleeding on Jul 2 and only turned Jul 7, so the recovery is real but unconfirmed against the ~$5.4B YTD hole; also the Jun 13 "$3.4B bleed more cyclical than structural" GBTC fee-hierarchy tell) | Useful for desk-style synthesis + flow-composition reads AND for measured "don't over-read the bounce" framing; verify flow figures against Farside/TheBlock. Not a primary source — confirmation tier. |
| `prestoresearch` (Presto Research) | research / desk | solid | JUN 5, 2026 (independently attributed the June slump to "competition from gold and AI stocks as investors reassess Fed rate-cut prospects" — the SECOND distinct source naming the AI-rotation mechanism, upgrading the `risk-asset-relative-performance → btc-etf-rotation` edge weak→medium) | Desk research; useful as an independent corroborator of flow-driver attribution. Verify against primary flow data (Farside). |
| `coinglass.com` | data / tracker | solid | MAY 15, 2026 (BTC ETF $1B weekly outflow aggregation — first weekly outflow after six straight inflow weeks) | Useful for ETF AUM + flow direction. Cross-check single-day prints against Farside. |
| `arkhamintelligence.com` | on-chain | mixed | MAY 16, 2026 (Bhutan sovereign drawdown attribution) | Strong for on-chain attribution; can over-interpret cluster activity. When attribution is disputed (as Bhutan/DHI is), flag the dispute. |
| `bgeometrics.com` | on-chain / data | solid | JUL 2, 2026 (2026 whale-accumulation cohort analysis — LTH SOPR ~0.8 = first below-cost LTH selling since 2023 + whale-tagged accumulation spike sub-$60K; the composite capitulation signal behind the contrarian 0.35→0.40 and the new `spot-lth-whale-accumulation → price-floor` edge) | On-chain cohort + SOPR + accumulation analytics; useful for the capitulation/handoff read the flow tape can't show. Also hosts the BIP signaling tracker. Verify cohort attribution against a second on-chain source (Glassnode/CryptoQuant) before load-bearing use. |
| `fortune.com` | press | mixed | MAY 15, 2026 (Warsh-dominoes analysis: Treasury inflation data → rate cuts → FOMC framing) | Useful for macro-policy synthesis; verify rate-cut probability claims against `cmegroup.com/FedWatch` and `federalreserve.gov`. |
| `finance.yahoo.com` | press / data | mixed | JUN 24, 2026 (CLARITY Act ethics-talks collapse Jun 9 — the most material regulatory development of the run: bill fractured into two tracks, state-AG provision withdrawn over Trump's ~$2.3B crypto holdings, 7+ Dem votes needed. Also the prior Jun 18 FBTC/IBIT manager-fragmentation tell) | Useful for ETF-flow color + by-fund breakdowns AND regulatory developments; cross-check single-day/weekly prints against Farside, and floor-vote timing against congress.gov + banking.senate.gov. Confirmation tier, not primary. |
| `tftc.io` | press / data | mixed | JUN 28, 2026 (the seventh-straight redemption day, ~$1.79B for the week, and FBTC joining the outflows — the ETF-tape confirmation that the whole complex is now redeeming; follows the Jun 24 YTD-cumulative-negative print) | Surfaced the cumulative-flow inversion (Jun 24) and the streak-to-7 + FBTC-flip (Jun 28). Cites Farside + Bloomberg's Balchunas for the underlying flow data — verify cumulative figures against Farside directly. Confirmation tier; strong on ETF-flow narrative two runs running. |
| `bitbo.io` | tracker | solid | JUN 28, 2026 (Strategy held 847,363 BTC through the fresh ~$58K low with NO dip-buy 8-K Jun 24–28 — the cash-parking-as-policy confirmation; carried from the Jun 24 treasury-pivot print) | Corporate-treasury holdings + transaction tracker (alongside bitcointreasuries.net). Use for state-of-play; verify individual buys/sales against SEC EDGAR 8-Ks (primary). |
| `coinstats.app` | press / AI-aggregated | low | JUN 24, 2026 (Bitcoin breaks $60K to $59,175, 20-month low; ~$850M liquidations in 4h; second sub-$60K breach this month) | AI-aggregated daily price/liquidation summary. Useful for a fast read of the tape but NOT primary — liquidation figures vary by time window ($237M–$850M cited); cross-check price against an exchange/CoinGecko and liquidations against Coinglass. |
| `cryptotimes.io` | press | low | MAY 14, 2026 (CLARITY timeline analysis from 15-9 win to July 4 signing) | Useful for synthesis pieces (timeline analysis) but never sole source. Verify floor-vote timing against `banking.senate.gov` + `congress.gov`. |
| `ccn.com` | press | mixed | JUN 28, 2026 (BTC ~$58K low on ~$1.26B liquidations across 209,000+ traders; named $55K as the next support — the cleanest tape frame for the second-cascade day) | Useful for price/liquidation tape + level-mapping. Cross-check liquidation totals against Coinglass (figures vary by window) and price against an exchange/CoinGecko. Confirmation tier, not primary. |
| `interactivecrypto.com` | press | low | JUN 28, 2026 (BTC near $60K on Jun 28 amid record ETF outflows + Extreme Fear reading 18 — the sentiment/recovery-off-low snapshot) | AI/aggregated daily price + sentiment summary. Useful for a fast Fear & Greed + recovery read; NOT primary — verify price against an exchange and F&G against alternative.me. Lowest tier. |
| `thehill.com` | press | mixed | JUN 28, 2026 (House SAVE America Act gridlock halts floor action; Senate two-week recess — the exogenous floor-time-scarcity development that upgraded the must-pass-standoff causal edge and stepped CLARITY 0.30→0.25) | Strong on congressional-calendar / floor-process reporting (the second-order legislative-timing channel). Verify floor scheduling against `congress.gov` + the Senate floor calendar. Confirmation tier for the calendar-congestion read. |
| `pymnts.com` | press | mixed | JUN 28, 2026 (CLARITY Act nears Senate floor ahead of the recess deadline; Stifel desk framing end-of-July as the practical passage deadline after which 2026 odds "deteriorate materially") | Useful for policy-desk framing + deadline analysis on market-structure legislation. Verify vote-timing claims against `banking.senate.gov` + `congress.gov`. Confirmation tier. |

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
