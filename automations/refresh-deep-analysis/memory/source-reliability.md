# Source Reliability

**Per-source predictiveness ledger.** Track which primary sources have surfaced material new information that turned out to be load-bearing for the analysis. **Trimmed SEP 13, OCT 16 and NOV 9, 2026** — per-run 'Last material hit' cells condensed to the latest; history in git.

Used in Phase 2 (research) to weight which sources to validate against. Higher reliability = check this source first.

Score: `prime` (always check first) / `solid` (consistently useful) / `mixed` (sometimes signal, sometimes noise) / `low` (often premature or wrong) / `dormant` (no signal in 26 weeks).

## Scores

| Source | Type | Score | Last material hit | Notes |
|---|---|---|---|---|
| `banking.senate.gov` | .gov / committee | prime | MAY 12, 2026 (CLARITY draft) | Committee markups + drafts; floor timing lives with leadership. Warren in line to chair from Jan 3 — watch for her bill's text. |
| Senate floor schedule (`senate.gov` / `democrats.senate.gov`) | .gov / floor timing | prime | SEP 13, 2026 | The authoritative source for WHEN a vote happens; 403 on `senate.gov` floor pages NOV 9 (market-news) — Roll Call carried the Nov 9 permitting cloture. |
| U.S. Senate Daily Press (`dailypress.senate.gov`) | .gov / floor record | prime (403 since OCT 24 — access note) | OCT 16, 2026 (the Nov 9 return + H.R. 2347 cloture) | The same-day floor record. Fallback when walled: `senate.gov/legislative/schedule`, Roll Call. |
| `whitehouse.gov/presidential-actions` | .gov / EO | prime | (pre-seed) | The SBR EO. The crypto council unstaffed since Oct 14. |
| `sec.gov/edgar` | regulatory / filings | prime | **NOV 9, 2026 — the Nov 2 Strategy 8-K (811 BTC; $164.0M ATM split $65.5M coins / $98.5M cash; STRC $208.2M; USD Cash $132.7M) scored the purchase row HIT; the filing index confirmed NO Nov 9 8-K at ~11:40 UTC; Strive's Nov 2 8-K (124 BTC → 43,124; SATS 7,003,418) and Nov 6 8-K (Q3 results, not read).** | Public-co treasury moves filed here first. Read the BTC, ATM, USD Cash AND preferred-repurchase lines; the ATM line now splits coins vs cash. |
| `strategy.com/press` | corporate IR | solid | MAY 11, 2026 | 403; the 8-K carries the release. |
| `bitcointreasuries.net` | tracker | solid | (ongoing) | `YARDSTICKS` 849,000 (Oct 19). |
| `bitbo.io` | tracker | solid | OCT 7, 2026 (IBIT 806,037.6 BTC) | `/treasuries/blackrock-ibit/`. Not pulled since. |
| `farside.co.uk/btc` | data | solid | (daily) | **403 for the TENTH consecutive run.** `tftc.io`'s monthly table (Farside basis) is canonical; phrase week totals as "about". |
| `tftc.io` (Bitcoin ETF flows table) | tracker / Farside-basis restatement | solid | **NOV 9, 2026: the November table (Nov 2 −$398.6M … Nov 6 −$411.9M; week −$1,281.7M) scored the restart row MISS.** | Verify load-bearing days against a second outlet; Blockhead agreed on the week total. |
| `federalreserve.gov` | .gov / monetary | prime | NOV 2, 2026 (the Oct 28 statement — the HOLD row HIT) | Statements, minutes (Nov 18 for Oct 28), SEP, calendar. No speeches found Nov 2–8 (search). |
| `treasury.gov` (`home.treasury.gov`) | .gov / rates + issuance + FinCEN | prime | **NOV 9, 2026: the November par table (10Y 5.05 → 4.86; 30Y 5.26) and press release sb0685 (the FinCEN 9714(a) order on MEXC) — both via market-news.** | Cite the Treasury table for yield levels; the FinCEN news page 404s — use the Treasury release. |
| `bls.gov` | .gov / macro data | prime | **NOV 9, 2026: the October Employment Situation (+165K vs 59K; revisions +84K; 4.1%) — the run's macro driver; the CPI schedule (Nov 10).** | Cite the current-release nr0.htm URL. |
| `bea.gov` | .gov / macro data | prime | NOV 2, 2026 (Q3 GDP +3.4%; Sept PCE 3.6%) | Next: October PCE Nov 25. |
| `cmegroup.com` (FedWatch) | data / rate pricing | solid | JUL 19, 2026 | Unreachable; CentralBank.watch + press (Blockhead: 76.8%). |
| `centralbank.watch` | data / rate-pricing restatement | solid (snapshot LAGS — check the date) | **NOV 9, 2026: the Nov 6 snapshot (Dec 9 hike 77.1%; cumulative 82.6% by Jan 27) — the HIKE row's restatement datum.** | A clean restatement of CME pricing with a visible date. |
| `polymarket.com` | market-implied odds | solid (as ODDS, never as facts) | NOV 9, 2026 — CLARITY signed-in-2026 3% ($25.0M) | Over-priced CLARITY all year; now below our vote row (0.10) — different questions. Kalshi (via FXStreet): 6% before 2027. |
| Senators' press pages | .gov / member statements | solid | SEP 16, 2026 | Verbatim member positions. |
| `govinfo.gov` (BILLSTATUS XML) | .gov / legislative record | prime | SEP 26, 2026 | The reachable canonical record while `congress.gov` 403s. |
| `financialservices.house.gov` · `docs.house.gov` | .gov / committee record + text | prime | SEP 26, 2026 | Read the amendment text, not the press summary. |
| `waysandmeans.house.gov` | .gov / committee | solid | SEP 26, 2026 | Cite the release. |
| `reginfo.gov` (OIRA EO 12866 review) | .gov / rulemaking docket | prime | SEP 26, 2026 | The docket stage + EO 12866's clocks called the ANPRM date. |
| `cftc.gov` | .gov / regulator | prime | OCT 16, 2026 (the ANPRM; the event-contract rules) | Regulation CTX comments due Dec 14. |
| `federalregister.gov` | .gov / rulemaking record | prime (bot wall on `/d/` links) | OCT 7, 2026 | Use the documents API for presence/absence; cite the agency release + the public-inspection PDF. |
| `mnav.com` | tracker (MSTR premium to BTC NAV) | **mixed (restated WITHOUT notice three times: OCT 24, NOV 2, NOV 9)** | **NOV 9, 2026: headline 1.16× 'as at close' (updated Nov 9; MSTR $129; BTC NAV $63.1B), 52-week range 0.98–1.32× (0.98–1.33× Nov 2; 0.98–1.37× Oct 24; 0.95–1.43× Oct 16); CEBE 1.35×; a share-count cross-check ≈ 0.86×.** | The mNAV <1.0× row scores on the HEADLINE figure; log the basis each pull. NOV 9 lesson: the issuer acts on ITS method — the ATM reopened at this reading; never restate a Strategy row on the cross-check (calibration rule 13). |
| CoinGecko API (`api.coingecko.com` — `/coins/bitcoin/history?date=DD-MM-YYYY`) | data / price | **prime for LEVELS** | **NOV 9, 2026: 00:00 UTC prices Nov 5 $80,443 · Nov 6 $76,006 (the Nov 5 UTC-day move −5.5% — THESIS-008 #3 checked on the named series) · Nov 7 $75,775 (the Friday close — the <$75K row NOT resolved; press said "$74,921") · Nov 9 $74,740.** | Use `history?date=` for weekly-close letters (the close = 00:00 UTC the next day, and say so); market-news fetches the live endpoint. |
| `am.jpmorgan.com` (LTCMA) | asset-manager primary | prime | OCT 24, 2026 (the 2027 LTCMA — bitcoin NOT in the covariance matrices) | Verify allocator quotes against the primary. |
| `occ.gov` (bulletins) | .gov / bank regulator | prime | OCT 24, 2026 (Bulletin 2026-50 — the GENIUS Act final rule) | Cite the bulletin. |
| `finma.ch` | foreign regulator / primary | prime for the FACT, binary for the TEXT | OCT 24, 2026 (the Oct 20 retail ETF approval) | BBIT still unlisted Nov 9 (The Block / market-news). |
| `cbr.ru` (Bank of Russia) | foreign regulator / primary | prime (press page 404/403 NOV 9 — access note) | — | Directive 7441-U (Sept 11; effective Nov 17) cited via PPT.ru; Izvestia for the Moscow Exchange (Dec 1). |
| `financefeeds.com` (Farside restatement) | fast restatement tier | solid for WEEKLY TABLES; mixed for politics | NOV 9, 2026 (the Tillis motion-to-reconsider / Jan 3 expiry / Hill quote — via market-news) | Verify quotes against a second outlet (CNBC Make It agreed on the framing). |
| `app2.msci.com` (index announcements, DocGet) | index provider / primary | prime | OCT 16, 2026 (the Oct 15 results — the MSCI row HIT) | `pub_key=aq0wbkjxPgo=` is the Oct 15 document; pull the Nov 11 list the day of and check the pub_key date. |
| `binance.com/square` ("Binance Announcement", verified) | exchange / official account | **solid for the FACT of a publication (NEW row NOV 9); weak for liabilities** | **NOV 9, 2026: Security Incident Recovery Update #5 (Nov 2) — zk PoR complete for the Oct 31 snapshot; ten tokens ≥1:1 — scored the PoR row HIT at 0.85.** Update #7 (Nov 4, ~98%) NOT located on an official page — secondary only. | The reachable Binance primary (the PoR page is JS-rendered). A zk PoR is a snapshot of assets vs on-platform liabilities, not an audit of the company's debts. |
| `unchainedcrypto.com` | press | mixed | OCT 16, 2026 (the MSCI deletion list restatement) | Verify against the xlsx when reachable. |
| `tradingeconomics.com` | data / commodities | solid for LEVELS, mixed for narrative | NOV 2, 2026 (gold $3,907; Brent $108.35) | Not pulled NOV 9 — Bernama (COMEX settle) + Equiti (Brent, DXY) used. |
| `bernama.com` · `equiti.com` | press / commodity levels | mixed (NEW row NOV 9) | NOV 9, 2026 — COMEX gold settle $4,087.60 (Nov 6); Brent ~$94.50 and DXY 101.48 (Nov 5) | Levels only; verify a load-bearing narrative elsewhere. |
| `status.blockstream.com` | vendor incident page / primary | solid for INCIDENTS; weak for RECOVERY status | OCT 16, 2026 | A status page's silence is not a reopening. |
| `finance.yahoo.com` | press | mixed (solid for index CLOSES) | NOV 9, 2026 — the Nov 6 close (Nasdaq 24,579.42, +1.09%; −3.37% w/w) | Verify against a second outlet. |
| `fortune.com` (daily price pages) | press / price | mixed | OCT 16, 2026 | A 7–8 a.m. ET series; NOT a Friday close. |
| `coindesk.com` | press | mixed | OCT 16, 2026 | Confirmation + color; never sole source. |
| `theblock.co` | press | mixed (solid for FLOW and PoR restatements) | NOV 9, 2026 — the Nov 2 Binance PoR piece (DeFiLlama outflows ~$3.29B from a $7B peak) — the PoR row's restatement | The ETF-flow restatement when it renders; hack/PoR coverage consistent with the Binance post. |
| `blockhead.co` | press / weekly recap | mixed (NEW row NOV 9) | NOV 9, 2026 — the week recap (CoinGecko OHLC; the −$1.28B week; YTD ≈ −$914M; CryptoQuant 89%/33K; CME 76.8%) | Secondary for every figure it carries; the YTD flip and the CryptoQuant data need a primary before they render as fact. |
| `nbcnews.com` · `cnbc.com` (election desks) | press / election results | solid for CALLS, mixed for analysis | NOV 9, 2026 — Senate 54–44 (two uncalled), House ≥245, Brown 50.0–45.2; CNBC Make It's Reiners / Mulyadi quotes | Composition from the desks; the lame-duck read from the calendar, not the quotes. |
| `thedefiant.io` · `orrick.com` · `archives.gov` (EO 12866) | press / law-firm / primary text | mixed / solid / prime | OCT 7, 2026 | Cite the underlying docket when it exists. |
| `hklaw.com` (Holland & Knight) | law-firm calendar | solid (NEW row NOV 9) | NOV 9, 2026 — the lame-duck deadlines (CR Dec 11; NDAA; Farm Bill; Dec 31 extenders) | The floor-time edge's calendar source while `ofr.harvard.edu` 403s. |
| `cointelegraph.com` | press | mixed | OCT 16, 2026 | Verify against a primary before citing. |
| `bloomberg.com` · `cnbc.com` | press | solid / mixed | NOV 2, 2026 (Warsh presser; the Binance coverage) | Institutional context; verify figures against primaries. |
| `github.com/bitcoin/bips` · `bitcoincore.org` | protocol | prime | (Core 32.1, Oct 27 — unchanged) | Authoritative for protocol proposals and releases. |
| `congress.gov` | .gov / legislative record | prime | AUG 19, 2026 | 403s; govinfo BILLSTATUS is the fallback. |
| `ibtimes.co.uk` | press | mixed (NEW row NOV 9) | NOV 9, 2026 — the Nov 5 Nasdaq/SOXX figures (citing CNBC) and the Trump Media 4,259 BTC collateral move (citing Arkham) | Restates CNBC and Arkham; verify the Trump Media read against a filing before any sale claim. |
| `crypto.news` · `ppt.ru` · `rollcall.com` · `financefeeds.com` · `cryptoticker.io` · `fxstreet.com` · `news.bitcoin.com` · other fast-restatement outlets | fast restatement tier | low–mixed | NOV 9, 2026 — the Nov 5 liquidation totals ($1.08B / $1.24B / $1.66B — CoinGlass; rule 11 cleared on agreement); PPT.ru for Directive 7441-U; Roll Call for the Nov 9 cloture | Fast figure restatements when primaries are unreachable; NOT primary; phrase disputed totals as ranges. |
| CoinGlass liquidation totals via press | vendor via restatement | low–mixed (consistent across outlets NOV 2 and NOV 9) | NOV 9, 2026 — Nov 5 $1.0–1.66B total, longs $0.9–1.27B | Never a Brier-scored threshold on its own (watch-list rule 11); contagion condition 2 accepted on three agreeing restatements. |
| `fxleaders.com` | press / FX desk | **EXCLUDED — never cite** | JUL 26, 2026 | Hard rule: never cite, including restatements. |

## Per-source notes (evolved over time)

### `sec.gov/edgar`
- 8-Ks for treasury moves within 4 business days; the Monday 8-K is the buy/sale/ATM tell in BOTH directions. Read the ATM line (now split between coins and cash — NOV 2), the USD Cash line and the preferred-repurchase line (the competing use: $208.2M vs $65.5M).

### `home.treasury.gov`
- The daily par yield curve is the primary for rate levels; press restatements drift by 5–10bp on volatile days.

### Press tier (mixed)
- **CoinDesk** stronger on regulatory/ETF/market-structure; **The Block** the best ETF-flow and exchange-incident restatement; **Bitcoin Magazine** stronger on protocol; **Cointelegraph** — verify against a primary before citing; **Blockhead** a useful weekly recap whose on-chain figures (CryptoQuant) and YTD sums are secondary.

## Anti-pattern: aggregators

Never cite as primary: news aggregators, social media (discovery only), re-blogs and listicles.

## Hygiene rules

1. **Update only when a source materially affects the run.**
2. **Score adjustments require evidence.**
3. **Press tier is permanently `mixed` — never `prime`.**
4. **Dormant sources don't disappear.**
5. **Access failures are logged, not scored (SEP 13).** A 403 is an access note; the score moves only on accuracy.
6. **A status page's silence is not a recovery milestone (OCT 16).**
7. **A tracker can restate its series without notice (OCT 24).** Log the basis (and the site's stated 52-week range) every pull.
8. **Name the price series in any daily-move letter (NOV 2).** NOV 9: the Friday "close" was $75,775 on CoinGecko's 00:00 UTC series and "$74,921" in press — a row's letter names its series.
9. **An exchange's official account is primary for the FACT of a publication, not for its adequacy (NOV 9).** Binance's Update #5 scored the PoR row; the 44-token Update #7 exists only in secondary reports until the page is located.
