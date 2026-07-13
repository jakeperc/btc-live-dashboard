// DEEP ANALYSIS — owner: /refresh-deep-analysis (weekly, v2).
// Do not Read src/BitcoinDashboard.jsx to edit this — edit this file instead.
//
// Weekly synthesis layer. Sits on top of MARKET_THEME + CURATED_MARKET_UPDATES.
// Curation says what happened; this says what it means, how the themes interact,
// and what to watch next.
// v2: explicit probabilities + falsification conditions + Brier-scored calibration.
// Persisted analyst memory lives at automations/refresh-deep-analysis/memory/.

export const DEEP_ANALYSIS = {
  asOf: "JUL 12, 2026",
  headline: "The rebound got its first real test and passed it choppily rather than cleanly. The three-day inflow streak broke almost immediately — spot ETFs shed $84.9M (Jul 8) and $95.3M (Jul 9) as the market digested the hawkish June FOMC minutes — but BlackRock's IBIT bought the dip straight back, leading +$90.4M (Jul 10) and helping to a +$197.4M day (Jul 11), so the week still closed net-positive at about +$124.9M. That is the shape of tactical rotation, not conviction in either direction: the passive bellwether re-engaging after a two-day wobble rather than a straight-line recovery or a resumed exodus. Away from flows, the corporate scaffolding cracked a little more — a second Bitcoin-treasury vehicle (Bitcoin Standard Treasury's Cantor merger) fell apart on July 8 — and CLARITY's window narrowed to a hard August 7 recess deadline with the defense bill (NDAA) set to eat the first week of Senate floor time. The cyclical read holds at 0.60 into the decisive June CPI print on July 14; the structural-break bear holds at 0.30.",
  plainSummary: "The recovery in Bitcoin funds hit its first bump: money flowed out for two days after the Fed's notes reminded everyone it's still worried about inflation, then the biggest fund pulled it right back, and the week finished positive overall. It's an encouraging but bumpy turn. The real test is an inflation report on July 14 — everything is holding until then.",
  marketContext: "The dovish setup that built over the prior fortnight held but wasn't confirmed. The June jobs miss (+57K vs ~115K) and a 2-year breakeven inflation rate below 2% still anchor a softer rate path — September-hike odds near 30%, the July 28–29 FOMC ~76% priced for a hold at 3.50–3.75%, the 2-year yield near 4.1% — but the June FOMC minutes (released July 8, from the hawkish June 17 meeting) reconfirmed nine of eighteen officials projecting a hike, and that backward-looking reminder was enough to knock ETF flows negative for two sessions before the bid returned. Gold held near $4,000 and the dollar stayed soft. Bitcoin consolidated its best-week-since-March gains, climbing from ~$61.9K (Jul 8) to ~$64.3K (Jul 10) and holding ~$64.2K into the weekend, pressing $65K resistance (still ~49% below October 2025's $126,080 record). Year-to-date ETF flows remain ~$5.4 billion negative. June CPI on July 14 is the print that confirms or unwinds the whole repricing.",
  primaryAnalysis: {
    themeTitle: "Cyclical Deleveraging vs. Structural Break",
    plain: "Our read holds steady at mildly bullish. The money coming back into Bitcoin funds wobbled this week — out for two days, then back — but the biggest fund led the recovery and the week ended positive, which fits a normal bumpy turn more than a fresh collapse. Nothing was settled, and a big inflation report lands July 14, so we're holding our call rather than nudging it.",
    thesisProbability: 0.60,
    body: [
      "THESIS-003 reads the June drawdown as a cyclical leverage-flush rather than the structural unwind of the spot-ETF bid. It stepped to 0.60 on July 8 when the flow reversal extended and broadened to IBIT-led. This force-run holds it at 0.60: the four-day delta since is genuinely two-sided, and with the decisive June CPI print only two days out (July 14), moving the number now would be overtrading exactly the kind of short window the June 13 lesson warns against. The disciplined call is to hold into the print.",
      "The two-sidedness is the story. On the constructive side, the passive-bellwether tell survived a stress test: the hawkish June FOMC minutes (July 8) pushed the complex to back-to-back outflow days (−$84.9M July 8, −$95.3M July 9), yet IBIT — the fund that drove ~75% of the June exodus — turned straight back to lead +$90.4M on July 10 and the complex printed +$197.4M on July 11, closing the seven-day window net-positive at ~+$124.9M. The Jul 6–10 business week itself netted positive (~+$197M on the daily tape). So the dip got bought by the same passive vehicle whose re-engagement is the core cyclical evidence — the fed→flows coupling ran through a hawkish input and came out intact. On the cautionary side, the clean three-day streak I credited last week broke on the very next data event; a recovery that wobbles on backward-looking minutes is fragile, which is precisely why last week's read was 'a fragile rebound, not a confirmed recovery.' The fragility and the dip-buying roughly offset — a wash that argues for holding, not stepping.",
      "The corporate pillar, already the laggard, showed a second crack — and it is a new kind. Strategy's record 3,588-BTC dividend-funded sale remains unreversed (no new 8-K; holdings verified at 843,775 BTC). To that this week adds a pipeline signal: Bitcoin Standard Treasury's merger with a Cantor Fitzgerald-linked vehicle was scrapped on July 8, terms now being renegotiated (its ~30,021 BTC held, not sold). Where Strategy's leak is the corporate floor bending under fixed liabilities, the BSTR collapse is the corporate on-ramp stalling — the treasury-vehicle route that was supposed to widen institutional access to Bitcoin (the bullish legitimization channel SpaceX's listing represented) hitting execution risk in a higher-for-longer, compressed-premium regime. Neither fires falsification #3 — BSTR is a deal failure, not a strategic BTC sale — but together they are why the corporate leg keeps capping the cyclical read at 0.60 rather than letting it run to 0.65.",
      "The regulatory prop did not just stay frozen — its clock got shorter and more crowded. CryptoSlate and the congressional calendar now pin a hard August 7 recess deadline as the effective cutoff for pre-break Senate passage, and the defense authorization bill (NDAA) is set to consume the week of July 13+ floor time. The binding constraint on CLARITY was never its vote math but floor time, and the NDAA is a concrete, high-priority competitor for exactly the scarce first week back. That tightens the theme's condition-#2 clock (no pre-recess cloture → retire THESIS-001) from a loose 'before the August recess' to a dated August 7, with the first usable week already spoken for. The CLARITY watch steps down 0.25→0.20 and its window tightens to August 7 on this — a small but real deterioration, entirely exogenous to CLARITY's own merits, and the second-order floor-time channel doing exactly what the adjacency sweep was built to catch.",
      "Net, the ledger since July 8 reads: flow/macro pillar held (dip bought, week net-positive, but the streak's fragility exposed); corporate pillar deteriorated marginally (BSTR pipeline crack on top of the unreversed Strategy sale); regulatory pillar deteriorated marginally (Aug 7 deadline + NDAA squeeze). Two small negatives and one wash is not a downgrade — the constructive core (IBIT re-engaging, best week since March, breakevens sub-2%) is intact and CPI has not printed — but it is the reason 0.60 holds rather than steps up on a net-positive flow week. The path to 0.65–0.70 is unchanged and still one-third met: a confirmed positive ETF week, a durable $66,000 reclaim, and a soft June CPI that the July 28–29 FOMC ratifies. The path back to 0.50–0.55 is a hot CPI that unwinds the repricing and relapses flows.",
    ],
    falsificationConditions: [
      "BTC posts a weekly close below $55,000 (structural next-leg) or below $50,000 (full structural break) through Q3 2026 — either retires the cyclical read; the $50K line is the hard trip.",
      "Spot Bitcoin ETFs fail to print a positive weekly net inflow through end-July 2026 AND 2026 YTD cumulative flows fail to begin repairing — the July inflow days prove a blip, not a re-coupling.",
      "Strategy escalates from liability-driven sales to a thesis-citing strategic net sale, OR a top-10 corporate / a second sovereign discloses a strategic net sale, OR Strategy keeps net-selling across successive dividend cycles — the corporate/sovereign floor structurally downshifts rather than merely servicing fixed obligations.",
      "A third liquidation cascade (≥$1B forced liquidations or ≥15% over ≤7 days) prints on an ordinary (non-expiry) session — a successive wave not explainable by a scheduled quarter-end flush reads cleanly structural.",
      "June CPI (July 14) surprises hot and the July 28–29 FOMC re-hardens the hike path, unwinding the jobs-driven dovish repricing, AND flows relapse negative — the macro-beta escape hatch that opened this month shuts again, confirming the higher-for-longer re-rating.",
    ],
  },
  crossCurrents: [
    {
      title: "A second Bitcoin-treasury vehicle's merger collapses — the corporate on-ramp cracks just as the ETF bid tries to heal",
      body: "The corporate-treasury theme (slot 4) and the ETF / institutional-access theme (slot 1) crossed this week in a way that complicates the bull case's legitimization story. For two months the constructive corporate narrative has been about widening access — SpaceX's Nasdaq listing surfacing 18,712 BTC, treasury vehicles bringing a Bitcoin balance sheet into equities that allocators who never touch a spot ETF still track. On July 8 that pipeline sprang its first visible leak: Bitcoin Standard Treasury's merger with a Cantor Fitzgerald-linked SPAC was scrapped, terms sent back for renegotiation (its ~30,021 BTC held, not sold). The interaction that matters is that this lands in the same window the ETF bid is trying to re-establish itself — so the two institutional on-ramps for Bitcoin are diverging: the ETF channel is choppy-but-healing (IBIT bought the dip, week net-positive) while the alternative treasury-vehicle channel just showed execution risk. It rhymes with Strategy's fixed-dividend leak — both are the corporate scaffolding straining under a higher-for-longer cost of capital and compressed premiums — but it is a distinct mechanism: not a forced sale, a stalled deal. It does not move price and it does not fire a falsification, but it is a reminder that the corporate leg the structural-bull case leans on is the pillar that keeps producing bad news while the flow leg heals, and a second scrapped or repriced vehicle would promote this from a one-off to a pipeline problem.",
      themesConnected: ["Corporate Treasury Wave", "Spot Bitcoin ETF Flows"],
    },
    {
      title: "The hawkish June minutes stress-tested the rate→flow coupling — and IBIT bought the dip",
      body: "The Fed/macro theme (slot 3) and the ETF-flow theme (slot 1) crossed within a single week and, for once, gave a clean both-directions read on their coupling. On July 8 the June FOMC minutes — backward-looking, from the hawkish June 17 meeting that projected a 2026 hike — were enough to knock the complex to two straight outflow days (−$84.9M, −$95.3M): a hawkish input transmitting down to flows exactly as the causal model's fed→etfs cost-of-capital edge predicts. Then the same edge ran the other way: as the market looked through the stale minutes toward the softer forward setup (sub-2% breakevens, a soft-CPI hope for July 14), BlackRock's IBIT led the flows straight back (+$90.4M July 10), and the week closed net-positive. That is the coupling demonstrated in both directions inside four sessions — hawkish reminder pushes flows out, forward-dovish setup pulls them back — which is stronger evidence for the 'June exodus was substantially rate-driven, therefore reversible' read than last week's one-directional snap. The bear's load-bearing claim (a permanent AI-rotation exit no rate signal can move) has to explain why the single biggest passive vehicle keeps re-engaging on rate cues. The caveat is unchanged and about to bind: the minutes were backward-looking, the dovish setup is market-implied not printed, and June CPI on July 14 is the hard test of whether the coupling keeps running in the bulls' direction.",
      themesConnected: ["Federal Reserve / Macro", "Spot Bitcoin ETF Flows"],
    },
    {
      title: "The structural-holder architecture keeps leaking while flows heal — corporate and sovereign floors on the same fiscal clock",
      body: "The corporate-treasury theme (slot 4) and the sovereign-reserve theme (slot 5) crossed again this week on the same underlying logic: the 'permanently removed float' the bull case counts on is, across both cohorts, liability- and fiscally-gated. Strategy's record dividend-funded sale is unreversed; Bitcoin Standard Treasury's merger vehicle stumbled; and Bhutan kept drawing its reserve down (a further ~250 BTC to ~3,704, still funding the Gelephu project). Three data points, one shape — a corporate holder selling to service fixed obligations, a corporate vehicle failing to list, a sovereign spending its stack — all in the same higher-for-longer window that tightens financing and fiscal constraints simultaneously. The interaction is that this architecture is the pillar diverging from the recovery: while the ETF/flow leg heals (IBIT re-engaging, week net-positive), the structural-holder leg keeps producing small cracks. That asymmetry is exactly why the cyclical read is capped at 0.60 — the cyclical case needs the float that was counted as locked to actually stay locked, and this week it kept quietly leaking at the margins. It is not enough to fire falsification #3 (no thesis-citing strategic sale from a top-10 holder, no second sovereign strategic seller), but a second sovereign drawdown or a repeat Strategy sale next dividend cycle would tip the cross-cohort pattern from 'liability servicing' toward 'structural downshift.'",
      themesConnected: ["Corporate Treasury Wave", "Sovereign Reserves"],
    },
  ],
  watchList: [
    {
      event: "Spot Bitcoin ETFs print a confirmed positive net inflow WEEK by Jul 31, 2026, beginning to repair the YTD-negative cumulative flow",
      plain: "A full week of money flowing back into Bitcoin funds would be the first real sign the year's exodus is reversing. This week looks like it got there on the net — but it was bumpy, and a hot inflation report could undo it.",
      category: "etf",
      window: "by Jul 31, 2026",
      probability: 0.60,
      signal: "Raised 0.55→0.60: on the daily tape the Jul 6–10 business week netted positive (~+$197M) and the rolling seven-day window is +$124.9M despite the Jul 8–9 outflow wobble on the hawkish FOMC minutes — a positive weekly print has very likely already occurred, and IBIT led the recovery (Jul 10 +$90.4M, Jul 11 +$197.4M). Not higher because the watch also asks the print to 'begin repairing' the ~$5.4B YTD hole (a ~$200M week barely dents it) and to survive June CPI (Jul 14), which sits inside the window and could relapse the following weeks. A confirmed, sustained positive week that starts repairing YTD → THESIS-003 toward 0.65. A hot CPI that flips flows back negative before end-July → falsification #2 re-hardens the structural-exit framing.",
    },
    {
      event: "BTC posts a weekly close below $55,000 (next leg of the structural break)",
      plain: "A weekly finish under $55,000 would confirm the slide is deepening rather than finding a floor — the opposite of the consolidation near $64K now underway.",
      category: "market-structure",
      window: "by Aug 31, 2026",
      probability: 0.25,
      signal: "The intermediate downside marker between the ~$57.7K June low and the $50K falsification line. Held at 0.25: Bitcoin consolidated its best-week-since-March gains near $64K, pressing $65K resistance, with no third cascade. Not stepped lower despite the further stall because June CPI (Jul 14) is a live two-day-out binary that could break price down hard — lowering this into the print would be imprudent. A hot CPI is the live trigger; absent that, a base above $60K into August breaks the structural-break momentum and the cyclical read consolidates. A weekly close <$55K would confirm the sub-$60K break as a structural lower-high and bring the $50K test into view (THESIS-003 falsification #1).",
    },
    {
      event: "Senate CLARITY floor vote clears 60-vote cloture with commodity classification intact before the August 7 recess",
      plain: "A big U.S. crypto law clearing the Senate — the one that hands Bitcoin to the commodity regulator (CFTC) rather than the securities regulator (SEC) — would be a Bitcoin-specific reason for buyers to return. Its window just shrank to a hard early-August deadline.",
      category: "regulation",
      window: "by Aug 7, 2026",
      probability: 0.20,
      signal: "Stepped DOWN 0.25→0.20 and the window tightened to a hard Aug 7 recess cutoff. Two exogenous developments squeezed the floor-time budget: the effective deadline for pre-break Senate passage is now dated Aug 7 (CryptoSlate), and the defense authorization bill (NDAA) is set to consume the week of July 13+ floor time — the first usable Senate week back — leaving only ~2 weeks for a bill that is still unscheduled at Calendar No. 423 with no cloture motion and three unresolved fights (Trump's crypto disclosure, Section 604 developer/law-enforcement protections, stablecoin yield). This is the second-order floor-time channel, not a change in CLARITY's vote math: the bill can slip on calendar congestion alone. Prediction markets still price FULL-2026 passage ~48–50% (a fall-session path); this pre-recess-cloture watch is lower and falling. An ethics deal + a pre-Aug-7 floor window with the SEC/CFTC commodity split intact re-couples flows → lift THESIS-003; a slip past Aug 7 with no vote fires condition #2 and retires THESIS-001.",
    },
    {
      event: "Strategy escalates to a thesis-citing strategic net sale OR keeps net-selling across successive dividend cycles (not just servicing one dividend window)",
      plain: "If Strategy starts selling Bitcoin because it has changed its mind about Bitcoin — rather than just to pay a bill — that would signal the biggest corporate holder is genuinely retreating.",
      category: "corporate",
      window: "by Sep 30, 2026",
      probability: 0.30,
      signal: "Held at 0.30. Strategy's July record sale (3,588 BTC / ~$216M to fund preferred dividends; holdings verified 843,775 BTC) remains unreversed — no new 8-K this window, so the fixed-dividend leak stands un-offset through the recovery, but there is also no repeat and no thesis-citing exit (it still buys via raises). The exact early-July sale size carries a reporting discrepancy (market-news ~3,588 BTC vs the adoption desk's ~2,225 BTC for Jul 1–5), but both reconcile to 843,775 held and to sustained-modest-selling. A REPEAT next dividend cycle or a strategy-citing sale fires falsification #3; a rising price that reopens the issuance window and restores majority-into-BTC deployment confirms the leak was tactical.",
    },
    {
      event: "June CPI (Jul 14) prints soft enough to sustain the jobs-driven dovish repricing through the July 28–29 FOMC",
      plain: "The jobs report cooled rate-hike fears; a mild inflation reading on July 14 would lock that in, keeping the Fed off Bitcoin's back into the late-July meeting. Market inflation bets are already easing.",
      category: "macro",
      window: "by Jul 30, 2026",
      probability: 0.55,
      signal: "The confirmation leg of the macro shift and the most imminent catalyst on the board — now two days out. Held at 0.55: no new inflation data since July 8 (the June FOMC minutes were backward-looking and moved nothing forward), so the sub-2% 2-year breakeven + the June jobs miss remain the case for a soft print, and the (softened) macro over-confidence correction still points the same way — breakevens easing is the data moving, not a Fed-intent read. Capped at 0.55 because a single hot print (shelter or energy re-accelerating; May inflation ran hot at 4.2%) can unwind it in an afternoon. A soft CPI sustains the macro-beta bid and supports THESIS-003; a hot one re-hardens higher-for-longer and reopens ETF-outflow pressure (falsification #5).",
    },
    {
      event: "A second sovereign or top-10 corporate holder discloses a strategic BTC net sale comparable to Bhutan",
      plain: "If another government or big company starts selling its Bitcoin for a change of strategy, it would confirm that 'permanent' holdings are really only held until money is needed elsewhere.",
      category: "sovereign",
      window: "by Sep 30, 2026",
      probability: 0.30,
      signal: "The float-durability tripwire spanning both cohorts. Held at 0.30: Bhutan kept drawing down (a further ~250 BTC to ~3,704, >70% off peak) — a continuation of the same fiscal drawdown, not a new second strategic seller — and no top-10 corporate disclosed a strategic net sale this window (Strategy's sale is liability-driven; BSTR's scrapped merger is a deal failure, not a BTC sale). A sovereign under fiscal stress (Argentina/Pakistan under IMF programs) or a top-10 corporate citing a changed thesis would confirm the pattern and fire THESIS-003 falsification #3. If none emerges, the structural-holder base holds and the float-scarcity buffer survives.",
    },
    {
      event: "BIP-110 (contested data-limit soft fork) locks in via version-bit-4 signaling by the ~Aug 7, 2026 UASF flag day (block 961,632)",
      plain: "A small group is trying to change Bitcoin's rules to limit junk data in transactions, but almost no miners back it — the bigger risk is a brief, messy chain split, not the change actually passing.",
      category: "protocol",
      window: "by Aug 7, 2026 (flag day) / signaling periods through Q3 2026",
      probability: 0.10,
      signal: "BIP-110 would impose a temporary cap on arbitrary data stored in Bitcoin transactions; activation is via a user-activated soft fork (UASF) with a flag day at block 961,632 (~Aug 7, 2026) and an early-lock-in trigger if any single 2,016-block difficulty period signals version-bit 4 at ≥55%. Held low at 0.10: signaling remains near ~0.31%, no major mining pool has signaled, and Bitcoin Core has not endorsed it (backing concentrated in Bitcoin Knots). If any 2,016-block period crosses 55%, early lock-in plus activation one period later; if signaling stays sub-threshold but a UASF/Sztorc-style fork client gains node share into the same August window, a contentious chain-split tail risk rather than a clean activation. If neither fires, BIP-110 lapses at the flag day as a non-event. (Note the calendar coincidence: the BIP-110 flag day and the CLARITY recess deadline both fall ~Aug 7 — unrelated, but a crowded date.)",
    },
  ],
  contrarianTake: {
    probability: 0.30,
    plain: "The flip side still worth taking seriously: this is a relief rally inside a downtrend, not the turn. A bumpy week of fund flows and cooling inflation bets don't undo a Fed that still projected a hike, and the year's money has still left. The tell is that Bitcoin's biggest corporate holder just made its largest sale ever and a second treasury company's deal just fell apart — the corporate side keeps producing bad news while the price drifts up.",
    body: "With the cyclical read at 0.60, the serious contrarian remains the structural-break bear, held at 0.30. The bear's case actually gained a little texture this week even as price consolidated higher. The strongest evidence is unchanged and unreversed — Strategy's record 3,588-BTC sale, the most ideological corporate holder lightening up to meet fixed obligations, with no sign the recovery has reopened its issuance window — and it was joined by a fresh crack: Bitcoin Standard Treasury's Cantor merger collapsed on July 8, the corporate on-ramp stalling in the same regime that is bending the corporate floor. The bear reads the choppy flow tape as confirmation, not refutation: a three-day streak that broke on backward-looking minutes is the signature of a relief bounce, not a durable re-coupling, and the whole dovish edifice rests on one labor print plus market-implied breakevens against a Fed that projected a hike — June CPI on July 14 can pull the floor out in an afternoon (May ran hot at 4.2%). The honest concession the bear still owes is composition: IBIT bought the July dip, and a passive bellwether that keeps re-engaging on rate cues is hard to square with a clean 'structural AI-rotation exit,' which is why this stays at 0.30 rather than climbing back to 0.35 — the exodus looks substantially rate-driven, i.e. reversible. So the bear holds: a lower high built on a jobs number and a bumpy flow week, into which the strongest corporate hands are distributing and the treasury-vehicle pipeline is stalling. Below the base case; freshly evidenced; not a strawman.",
  },
  themeInteractions: {
    regime: "reinforcing",
    pairs: [
      { themes: ["clarity-act", "etfs"], delta: 0.08, direction: "reinforcing" },
      { themes: ["clarity-act", "sovereign-reserves"], delta: 0.05, direction: "reinforcing" },
      { themes: ["clarity-act", "corporate-treasuries"], delta: 0.10, direction: "reinforcing" },
      { themes: ["clarity-act", "fed-monetary-policy"], delta: 0.04, direction: "reinforcing" },
      { themes: ["etfs", "sovereign-reserves"], delta: 0.06, direction: "reinforcing" },
      { themes: ["etfs", "corporate-treasuries"], delta: 0.10, direction: "reinforcing" },
      { themes: ["etfs", "fed-monetary-policy"], delta: 0.10, direction: "reinforcing" },
      { themes: ["sovereign-reserves", "corporate-treasuries"], delta: 0.07, direction: "reinforcing" },
      { themes: ["sovereign-reserves", "fed-monetary-policy"], delta: 0.03, direction: "reinforcing" },
      { themes: ["corporate-treasuries", "fed-monetary-policy"], delta: 0.07, direction: "reinforcing" },
    ],
    adjustments: [
      {
        theme: "etfs",
        draftProbability: 0.55,
        netDelta: 0.13,
        finalProbability: 0.70,
        reasoning: "REGIME HELD REINFORCING; contagion 0 of 3 conditions: (1) multi-week outflow streak with etfs bearish p<0.40 ✗ — the week closed net-positive (~+$124.9M) and etfs is drafted 0.55; (2) in-window ≥$1B cascade ✗ — BTC consolidated near $64K, no cascade; (3) downward corporate spillover ✗ this window — the BSTR merger collapse and Strategy's unreversed sale are deal/liability events, not an active in-window price cascade. Reinforcing nudges: clarity (p=0.20) +0.08×0.20=+0.016; sovereign (p=0.40) +0.06×0.40=+0.024; corporate (p=0.35) +0.10×0.35=+0.035; fed (p=0.55) +0.10×0.55=+0.055. Sum +0.130 → 0.55+0.13=0.68 → 0.70 (rounded). Standalone draft 0.55 HELD (positive net week + IBIT dip-bought, but the streak broke on the minutes and YTD is still ~$5.4B negative). The directly-judged THESIS-003 = 0.60 is the load-bearing forecast, not this matrix etfs-final 0.70.",
      },
      {
        theme: "corporate-treasuries",
        draftProbability: 0.35,
        netDelta: 0.14,
        finalProbability: 0.50,
        reasoning: "Reinforcing regime. Nudges: clarity (p=0.20) +0.10×0.20=+0.020; etfs (p=0.55) +0.10×0.55=+0.055; sovereign (p=0.40) +0.07×0.40=+0.028; fed (p=0.55) +0.07×0.55=+0.0385. Sum +0.1415 → 0.35+0.14=0.49 → 0.50. Standalone draft 0.35 HELD: Strategy's record dividend-funded sale is unreversed (no new 8-K) AND a second treasury vehicle (BSTR/Cantor) failed to list on Jul 8 — the corporate architecture is producing fresh cracks, not repairing. Standalone 0.35 is load-bearing; the matrix 0.50 is arithmetic lifted by the reinforcing cluster and should NOT be read as a bullish corporate call while the record sale stands un-offset and the vehicle pipeline is stalling.",
      },
      {
        theme: "fed-monetary-policy",
        draftProbability: 0.55,
        netDelta: 0.10,
        finalProbability: 0.65,
        reasoning: "Bullish-for-BTC easing tilt HELD 0.55: the sub-2% 2-year breakeven + June jobs miss still anchor the dovish setup, and no new inflation data landed since Jul 8. The June FOMC minutes (Jul 8) reconfirmed the hawkish June dot plot but are backward-looking — the market looked through them (IBIT bought the dip), so no downgrade; but not raised either, because June CPI (Jul 14) hasn't confirmed. Reinforcing nudges: clarity (p=0.20) +0.04×0.20=+0.008; etfs (p=0.55) +0.10×0.55=+0.055; corporate (p=0.35) +0.07×0.35=+0.0245; sovereign (p=0.40) +0.03×0.40=+0.012. Sum +0.0995 → 0.55+0.10=0.65. The load-bearing macro forecast is the CPI-confirmation watch at 0.55, not this matrix 0.65.",
      },
      {
        theme: "clarity-act",
        draftProbability: 0.20,
        netDelta: 0.12,
        finalProbability: 0.30,
        reasoning: "Non-cluster theme — reinforcing rule throughout. Etfs (p=0.55) +0.08×0.55=+0.044; sovereign (p=0.40) +0.05×0.40=+0.020; corporate (p=0.35) +0.10×0.35=+0.035; fed (p=0.55) +0.04×0.55=+0.022. Sum +0.121 → 0.20+0.12=0.32 → 0.30 (rounded). Standalone stepped DOWN 0.25→0.20 (hard Aug 7 recess deadline + NDAA consuming the Jul 13+ floor week — the floor-time squeeze intensified). Matrix arithmetic lands at 0.30; the load-bearing pre-recess-cloture forecast is the standalone 0.20 (used in the watchList), NOT the 0.30 matrix output.",
      },
      {
        theme: "sovereign-reserves",
        draftProbability: 0.40,
        netDelta: 0.08,
        finalProbability: 0.50,
        reasoning: "Non-cluster theme — reinforcing rule throughout. Etfs (p=0.55) +0.06×0.55=+0.033; clarity (p=0.20) +0.05×0.20=+0.010; corporate (p=0.35) +0.07×0.35=+0.0245; fed (p=0.55) +0.03×0.55=+0.0165. Sum +0.084 → 0.40+0.08=0.48 → 0.50 (rounded). Standalone stepped DOWN 0.45→0.40: no new sovereign ADD this window (the Mubadala +16% IBIT datapoint is a week old) while Bhutan kept selling (~250 BTC to ~3,704) — the accumulation-side counter to the drawdown lost its fresh support. Final 0.50 is matrix-derived arithmetic, not a primary forecast.",
      },
    ],
  },
  calibration: {
    aggregateBrier: 0.21,
    nResolved: 13,
    briefSummary: "13 items scored; aggregate Brier 0.21, unchanged this mid-week force-run — no watch windows elapsed since July 6 (the next resolutions are June CPI on July 14, the FBTC/IBIT divergence by July 20, and the positive-ETF-week test by July 31). Macro category remains N=8 with a +0.27 mean residual (net over-confident on Fed easing, but with the weak-data growth-scare exception carved out); the softened correction continues to support the June-CPI-confirmation watch at 0.55 on the sub-2% 2-year breakeven — a market-data signal, not a Fed-intent read.",
  },
  sources: [
    { label: "CoinStats AI — Bitcoin ETF flows Jul 11: +$197.4M (7-day +$124.9M); BTC tests $65K resistance", url: "https://coinstats.app/ai/a/crypto-news-update-11-July-2026" },
    { label: "CoinBriefing — US spot Bitcoin ETFs see $90.4M inflows Jul 10, IBIT ($86.8M) leads recovery after the Jul 8–9 outflow wobble", url: "https://cryptobriefing.com/bitcoin-ethereum-etf-inflows-july-10/" },
    { label: "CryptoSlate — CLARITY Act misses July target, August 7 becomes the critical Senate recess deadline; NDAA consumes July floor time", url: "https://cryptoslate.com/clarity-act-misses-july-target-and-runs-into-an-august-7-senate-clock/" },
    { label: "BeInCrypto — Strategy's early-July BTC sale confirmed via SEC filing; holdings 843,775 BTC (sale-size reporting discrepancy noted)", url: "https://beincrypto.com/microstrategy-sold-far-more-bitcoin/" },
    { label: "CoinDesk — U.S. inflation outlook underpins Bitcoin bulls (2-year breakeven below 2% for the first time since 2024)", url: "https://www.coindesk.com/daybook-us/2026/07/06/u-s-inflation-outlook-underpins-bitcoin-bulls-after-best-week-since-march" },
    { label: "Bitcoin Magazine — Strategy (MSTR) sells 3,588 BTC for $216M to fund preferred dividends (843,775 BTC) — unreversed", url: "https://bitcoinmagazine.com/news/strategy-mstr-sells-3588-bitcoin" },
  ],
};
