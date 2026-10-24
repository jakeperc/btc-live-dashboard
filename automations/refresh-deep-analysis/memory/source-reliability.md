# Source Reliability

**Per-source predictiveness ledger.** Track which primary sources have surfaced material new information that turned out to be load-bearing for the analysis. **Trimmed SEP 13 and OCT 16, 2026** — low-tier rows condensed to one line; per-hit history in git.

Used in Phase 2 (research) to weight which sources to validate against. Higher reliability = check this source first.

Score: `prime` (always check first) / `solid` (consistently useful) / `mixed` (sometimes signal, sometimes noise) / `low` (often premature or wrong) / `dormant` (no signal in 26 weeks).

## Scores

| Source | Type | Score | Last material hit | Notes |
|---|---|---|---|---|
| `banking.senate.gov` | .gov / committee | prime | MAY 12, 2026 (CLARITY draft) | Committee markups + drafts; floor timing lives with leadership. |
| Senate floor schedule (`senate.gov` / `democrats.senate.gov`) | .gov / floor timing | prime | SEP 13, 2026 (the Sep 14 convening notice + cloture ripening) | The authoritative source for WHEN a vote happens. |
| U.S. Senate Daily Press (`dailypress.senate.gov`) | .gov / floor record | prime | **OCT 16, 2026: pro formas Oct 19/22/26/29; back Nov 9, 3 p.m.; first vote 5:30 p.m. on H.R. 2347 — the lame-duck row (0.10) is priced on it.** OCT 7: the Sep 30 adjournment record scored the cloture row MISS. | The same-day floor record; the fastest .gov source for a roll call and its aftermath. |
| `whitehouse.gov/presidential-actions` | .gov / EO | prime | (pre-seed) | The SBR EO. Silent on the ethics compromise all year; the crypto council now unstaffed (Witt, Oct 14 — confirmed via press, no White House document). |
| `sec.gov/edgar` | regulatory / filings | prime | **OCT 16, 2026 — fifth straight reachable run: the Strategy Oct 13 (Ex. 99.1: 250 BTC; $21.0M ATM; STRC $192.4M; USD Cash $640.5M) and Oct 16 (November daily STRC dividends) 8-Ks — the purchase row resolved on the Oct 13 filing.** | Public-co treasury moves filed here first. Read the BTC, ATM and USD Cash lines AND the preferred-repurchase line (the competing capital use). |
| `strategy.com/press` | corporate IR | solid | MAY 11, 2026 | 403 again (OCT 16); the 8-K exhibit carries the press release. |
| `bitcointreasuries.net` | tracker | solid | (ongoing) | State-of-play aggregate; `YARDSTICKS` 848,000 (Oct 12). |
| `bitbo.io` | tracker | solid | OCT 7, 2026 (IBIT 806,037.6 BTC — scored both IBIT tail rows) | `/treasuries/blackrock-ibit/` (the `/ibit/` path 404s). Not pulled OCT 16. |
| `farside.co.uk/btc` | data | solid | (daily) | **403 for the EIGHTH consecutive run.** `tftc.io`'s monthly table (Farside basis) is the canonical restatement this run (resolved the week-2/3 flow prints); The Block's page was image-only; phrase week totals as "about". |
| `tftc.io` (Bitcoin ETF flows table; Arkham restatements) | tracker / Farside-basis restatement | solid | **OCT 16, 2026: the October daily table (Oct 7 −$487.1M … Oct 15 +$5.1M; MTD −$534.8M) — the run's canonical flow source — and the Oct 8 seized-coin piece (Arkham labels; batch totals do not reconcile — say "about 17,800").** | Verify load-bearing days against a second outlet (CryptoTicker / SoSoValue agreed within $5M). |
| `federalreserve.gov` | .gov / monetary | prime | **OCT 16, 2026: the Sep 15–16 minutes (read; "most participants … another increase … by year end"; inflation risks "skewed to the upside"; the Desk paused reserve-management purchases) + the October calendar (Oct 27–28 FOMC; the Oct 15 Warsh–Georgieva chat).** | Speeches, statements, SEP, calendar, minutes (2 p.m. ET three weeks after the meeting — the OCT 7 run was too early by hours). |
| `treasury.gov` (`home.treasury.gov`) | .gov / rates + issuance | prime | **OCT 16, 2026 — the par table again corrected press: 30Y 5.67 (Oct 7) → 5.43 (Oct 15); 10Y 5.28 → 5.10; press prints ran 5–10bp higher. The 30Y row (0.40) scores from this table only.** | Cite the Treasury table for yield levels, never press. |
| `bls.gov` | .gov / macro data | prime | **OCT 16, 2026: September CPI (Oct 14: 3.7% / core 2.6%; gasoline +9.1% m/m) and PPI (Oct 15: 6.3%; energy +10.8% m/m) — the run's macro driver.** | Cite the current-release nr0.htm URL. |
| `bea.gov` | .gov / macro data | prime | OCT 7, 2026 (August PCE 3.4% / 3.0%) | Next: Oct 30 PCE (not verified on the BEA calendar). |
| `cmegroup.com` (FedWatch) | data / rate pricing | solid | JUL 19, 2026 | Unreachable; CentralBank.watch + press restatements (FinanceFeeds carried the intraday path 22% → 50% → 31.6%). |
| `centralbank.watch` | data / rate-pricing restatement | solid (snapshot LAGS — check the date) | **OCT 16, 2026: the Oct 15 snapshot (Oct 28 hike 28.0%; Dec 9 cumulative 89.8%) — the HOLD row's restatement datum; press (post-Warsh Oct 16) ~15%.** | A clean restatement of CME pricing with a visible date; the gap to same-day press is the chair's remark, not an error. |
| `polymarket.com` | market-implied odds | solid (as ODDS, never as facts) | OCT 16, 2026 — CLARITY signed-in-2026 6% ($24.1M) | Over-priced CLARITY all year relative to the ledger; now below our lame-duck VOTE row (0.10) — different questions. |
| Senators' press pages | .gov / member statements | solid | SEP 16, 2026 (Gallego's no-vote statement) | Verbatim member positions. |
| `govinfo.gov` (BILLSTATUS XML) | .gov / legislative record | prime | SEP 26, 2026 (BILLSTATUS-119hr8957.xml) | The reachable canonical record while `congress.gov` 403s. |
| `financialservices.house.gov` · `docs.house.gov` | .gov / committee record + text | prime | SEP 26, 2026 (the H.R. 8957 markup + Steil substitute) | Read the amendment text, not the press summary. |
| `waysandmeans.house.gov` | .gov / committee | solid | SEP 26, 2026 (H.R. 10357, 38–5) | Cite the release. |
| `reginfo.gov` (OIRA EO 12866 review) | .gov / rulemaking docket | prime (RIN detail page never fetched directly — moot: the ANPRM published) | SEP 26, 2026 (RIN 3038-AF80 prerule received Sep 17) | The docket stage + EO 12866's clocks predicted the Oct 13 publication to within two weeks. |
| `cftc.gov` | .gov / regulator | prime | **OCT 16, 2026: releases 9307-26 (Oct 5 — the ANPRM; "Regulation CTX" / "Regulation CAM"; 91 FR 64811 Oct 13) and 9309-26 / 9310-26 (Oct 9 — the event-contract IFR/NPRM) — the ANPRM row HIT.** | Press releases are the reachable primary; the FR itself is bot-walled (below). |
| `federalregister.gov` | .gov / rulemaking record | prime (bot wall: `/d/` links redirect to `unblock.federalregister.gov` this run; `public-inspection.federalregister.gov/<doc>.pdf` is reachable but binary) | OCT 7, 2026 (the FinCEN withdrawals; the documents API for absence checks) | Use the documents API for presence/absence; cite the agency release + the public-inspection PDF when the HTML page is walled. |
| `mnav.com` | tracker (MSTR premium to BTC NAV) | solid (verify against price × shares / NAV) | **OCT 16, 2026: 1.06× at the Oct 16 close; MSTR $151; 52-week 0.95–1.43× (CEBE 1.19×).** Prior: 1.07× (Sep 26). | The premium variable for the reflexivity valve — pulled this run; pull every run. The mNAV <1.0× row (0.45) scores here. |
| `app2.msci.com` (index announcements, DocGet) | index provider / primary | **prime (NEW row OCT 16)** | **OCT 16, 2026: the Oct 15 consultation results (adopted "with minor changes"; final list Nov 11; effective at the close of Nov 30) — the MSCI row HIT at 0.55.** | `pub_key=aq0wbkjxPgo=` is the Oct 15 document; `pub_key=DD3Olh5uInk=` is the JANUARY announcement — do not confuse. The potential-deletion xlsx (msci.com/downloads/…) not fetched; Unchained restated it. |
| `unchainedcrypto.com` | press | mixed (NEW row) | OCT 16, 2026 — the MSCI potential-deletion list (Strategy, Metaplanet, Yellow Cake, Upexi, Skel; 17-name watchlist) | Restated MSCI's xlsx; verify against the file when reachable. |
| `tradingeconomics.com` | data / commodities | solid for LEVELS, mixed for narrative (NEW row) | OCT 16, 2026 — gold ~$4,169 (Oct 16; +2.4% from Oct 7), Brent ~$106 (the GFS Pride sinking) | Commodity levels when a primary exchange page is unreachable; verify a load-bearing narrative elsewhere. |
| `status.blockstream.com` | vendor incident page / primary | solid for INCIDENTS; weak for RECOVERY status | OCT 16, 2026 — lists "no incidents" Oct 12–16 while peg-outs remain suspended; a status page's silence is not a reopening (the Liquid row scored MISS at 0.35 with Bitcoin.com News Oct 11 as the restatement) | Cross-check recovery milestones with the Liquid blog / Telegram; the page tracks uptime, not the peg. |
| `finance.yahoo.com` | press | mixed | OCT 16, 2026 — the AP Warsh piece (Bangkok quotes; the CME odds path; Williams), the Oct 15 price piece, the BeInCrypto Witt piece | Price snapshots and restatements; verify against the docket / a second outlet. |
| `fortune.com` (daily price pages) | press / price | mixed (NEW row) | OCT 16, 2026 — a consistent 7–8 a.m. ET daily price series (Oct 8 $82,622 … Oct 16 $82,645) | A clean daily anchor; NOT a Friday close (the thesis's #1 scores on closes — need a close source). |
| `coindesk.com` | press | mixed | OCT 16, 2026 — the Oct 15 live (BTC near $80K; the CME odds path; Nasdaq futures) | Confirmation + color; never sole source. |
| `theblock.co` | press | mixed | OCT 16, 2026 — the Oct 13 London High Court piece (FT restatement); the flows page was image-only this run | The ETF-flow restatement when it renders; corporate-filing restatements with full figures. |
| `thedefiant.io` · `orrick.com` · `archives.gov` (EO 12866) | press / law-firm / primary text | mixed / solid / prime | OCT 7, 2026 — the reginfo restatement; the Oct 2 process summary; §6(b)(2) (10 working days) — the clock that called the ANPRM date | Cite the underlying docket when it exists. |
| `cointelegraph.com` | press | mixed | OCT 16, 2026 — the MSCI 3.1% / 13M-share passive-ownership figure (Strategy's August statement) and the Witt departure | Verify against a primary before citing; the 3.1% figure traced to Strategy's own statement. |
| `bloomberg.com` · `cnbc.com` | press | solid / mixed | AUG 25 / SEP 13, 2026 | Institutional context; verify figures against primaries. |
| `github.com/bitcoin/bips` · `bitcoincore.org` | protocol | prime | (BIP-361 Draft; Core 32.0 NOT released as of Oct 16 — 31.1 latest) | Authoritative for protocol proposals and releases. |
| `congress.gov` | .gov / legislative record | prime | AUG 19, 2026 | 403s; govinfo BILLSTATUS is the fallback. |
| `crypto.news` · `cryptoinamerica.com` · `thehackernews.com` · `aljazeera.com` · `euronews.com` · `thenationalnews.com` · `axios.com` · `thehill.com` · `pymnts.com` · `foxnews.com` · `npr.org` | press | mixed | SEP 13 and earlier | Congressional / security / Gulf-energy color; verify against primaries. |
| `blog.coinkite.com` · `trmlabs.com` · `bgeometrics.com` · `coinglass.com` · `arkhamintelligence.com` · `prestoresearch` · `investing.com` | vendor / on-chain / research | solid–mixed | AUG 7 and earlier (Arkham labels via TFTC, OCT 16) | Verify load-bearing figures against a second source. |
| `cryptoticker.io` · `fxstreet.com` (SoSoValue) · `financefeeds.com` · `hedgeco.net` · `kucoin.com/news/flash` · `cryptotimes.io` · `en.cryptonomist.ch` · `bloomingbit.io` · `coinstats.app` · `interactivecrypto.com` · `crowdfundinsider.com` · `news.bitcoin.com` | fast restatement tier | low–mixed | OCT 16 (CryptoTicker −$539.8M MTD; FXStreet/SoSoValue −$681M week; FinanceFeeds the intraday odds path; Bitcoin.com News the Liquid freeze Oct 11) | Fast figure restatements when primaries are unreachable; NOT primary; phrase disputed totals as ranges. |
| `fxleaders.com` | press / FX desk | **EXCLUDED — never cite** | JUL 26, 2026 (a figure no primary source supported) | Hard rule: never cite, including restatements. |

## Per-source notes (evolved over time)

### `sec.gov/edgar`
- 8-Ks for treasury moves within 4 business days; the Monday 8-K is the buy/sale/ATM tell in BOTH directions. Read the ATM line, the USD Cash line and the preferred-repurchase line (OCT 16: $192.4M of STRC buybacks vs $21.5M of coins — the competing use is the story).

### `home.treasury.gov`
- The daily par yield curve is the primary for rate levels; press restatements drift by 5–10bp on volatile days (OCT 16: press 5.446% vs par 5.43 on Oct 15).

### Press tier (mixed)
- **CoinDesk** stronger on regulatory/ETF/market-structure; **The Block** the best ETF-flow restatement when its page renders (image-only OCT 16 — TFTC carried it); **Bitcoin Magazine** stronger on protocol; **Cointelegraph** — verify against a primary before citing.

## Anti-pattern: aggregators

Never cite as primary: news aggregators, social media (discovery only), re-blogs and listicles.

## Hygiene rules

1. **Update only when a source materially affects the run.**
2. **Score adjustments require evidence.**
3. **Press tier is permanently `mixed` — never `prime`.**
4. **Dormant sources don't disappear.**
5. **Access failures are logged, not scored (SEP 13).** A 403 is an access note; the score moves only on accuracy.
6. **A status page's silence is not a recovery milestone (OCT 16).** Score completion rows from an explicit statement, never from the absence of an incident.
