// DEEP ANALYSIS — owner: /refresh-deep-analysis (weekly, v2).
// Do not Read src/BitcoinDashboard.jsx to edit this — edit this file instead.
//
// Weekly synthesis layer. Sits on top of MARKET_THEME + CURATED_MARKET_UPDATES.
// Curation says what happened; this says what it means, how the themes interact,
// and what to watch next.
// v2: explicit probabilities + falsification conditions + Brier-scored calibration.
// Persisted analyst memory lives at automations/refresh-deep-analysis/memory/.

export const DEEP_ANALYSIS = {
  asOf: "JUL 19, 2026",
  headline: "The catalyst three consecutive runs held for finally printed, and it was cool: June CPI fell 0.4% — the largest monthly drop since April 2020 — and spot Bitcoin ETFs answered with four straight inflow days (over $550M July 14–17, IBIT-led), stacking a second consecutive positive week and affirmatively ending the eight-week, $8B outflow era. Two named tests of the cyclical read resolved constructively, so THESIS-003 steps 0.60→0.65. What keeps it from going higher: the rate market still prices a September hike near 65% — and roughly 30% odds of a hike THIS month — because the Iran ceasefire collapsed at its halfway mark, Hormuz shipping is under attack, and Brent is back above $85. The flows are riding a disinflation print whose biggest input, June's 5.7% energy slump, has already reversed.",
  plainSummary: "The inflation report came in much cooler than expected, and money flowed back into Bitcoin funds every day since — the strongest stretch in months. But the U.S.–Iran truce has collapsed, oil is rising, and the Fed may still raise rates.",
  marketContext: "The macro tape inverted twice in one week. Into July 14 the rate market had re-hardened — September-hike odds above 75% and a July hike openly discussed — then June CPI fell 0.4% (largest monthly drop since April 2020; 3.5% annual vs 3.8% expected, core flat at 2.6%), Treasury yields dropped sharply, and hike pricing retreated to ~65% for September with ~70% odds of a July hold at 3.50–3.75%. The relief is real but hostage to geopolitics: the U.S.–Iran memorandum collapsed in practice at its 60-day halfway mark (300+ U.S. strikes, Hormuz shipping attacked, Brent above $85), and June's cool print leaned on a 5.7% energy slump recorded before the truce broke. Equities wobbled on an AI/chip-stock selloff. Bitcoin hit a three-week high above $65,100 on July 15 and settled near $64.7K — $60K support, $65K resistance — with YTD ETF flows still negative but now visibly repairing.",
  primaryAnalysis: {
    themeTitle: "Cyclical Deleveraging vs. Structural Break",
    plain: "We've nudged our read up. The two things we said would confirm a normal recovery — a cool inflation report and a full week of money returning to Bitcoin funds — both happened this week. We're not fully convinced yet, because oil is rising again as the Iran truce breaks down and the Fed hasn't shown its hand.",
    thesisProbability: 0.65,
    body: [
      "THESIS-003 steps 0.60→0.65, and the step is earned by resolved tests rather than tape momentum — the distinction the June 13 over-read lesson demands. Two of the four named conditions on the path to 0.65–0.70 resolved this week: June CPI printed decisively soft (−0.4% on the month, the largest drop since April 2020; 3.5% annual against 3.8% expected), and spot ETFs printed a confirmed positive WEEK — in fact a second consecutive one, with four straight post-CPI inflow days (+$239M combined July 14, then $108M, $79.2M and $132.3M Bitcoin-only). That affirmatively clears falsification #2 (a positive week before end-July, with repair begun) and kills the CPI leg of falsification #5 — two of the five ways this thesis could die are now structurally off the table, which is itself information. The remaining two conditions on the upgrade path — a durable $66K reclaim and a July FOMC that ratifies the relief — did not resolve, which is why 0.65 and not 0.70.",
      "The quality of the flow evidence matters as much as its size. These inflows printed through a HAWKISH repricing week: September-hike odds went from roughly 30% on July 8 to above 75% by July 13, a July hike was openly discussed, and the money came in anyway — before the CPI (the July 13 tape) it wobbled, but from July 14 it ran four days without a break, led by IBIT (+$136.5M on July 17 alone, with FBTC the only fund in outflow). Demand that persists while the rate path is hardening is stronger evidence of a re-established bid than demand that rides a dovish tape, and it completes a three-regime read of the fed→flows coupling inside two weeks: hawkish minutes pushed flows out (July 8–9), the soft print pulled them in (July 14–17), and a hawkish drift failed to push them back out. The tempering signal sits in the options market: the most crowded call strike moved DOWN from $80K to $70K (~$1.63B open interest) — positioning for repair toward a nearer top, not a resumption of the old uptrend.",
      "The macro leg is confirmed in data but hostage to a decision and a war. The dovish repricing of early July did not survive to the print — it broke by July 13 — and the coolest monthly CPI since April 2020 only pulled September-hike odds back to ~65%, with ~30% still on a hike THIS month. The reason the market won't fully spend the relief is visible in the print's own composition: the −0.4% was driven by a 5.7% energy slump, recorded almost entirely before the Iran ceasefire collapsed at its 60-day halfway mark. With 300+ U.S. strikes flown, Iranian attacks on Hormuz shipping, Trump declaring the ceasefire 'over,' and Brent holding above $85, July's energy component is already re-inflating — the June print borrowed its relief from a truce that no longer exists. This is the June 20 pattern ('relief the central bank refuses to spend') running in reverse: then, de-escalation couldn't buy a dovish Fed because core was sticky; now, re-escalation threatens the data-driven dovish case core inflation finally earned (core was flat on the month). The July 28–29 FOMC decides which force wins, and per the calibration record a Fed-DECISION dovish outcome gets a haircut, not the benefit of the doubt.",
      "The corporate pillar swapped fragility for absence. Strategy's July 13 8-K shows $466.7M raised July 6–12 — and zero BTC bought or sold, with the proceeds stacked into a $3.0B USD reserve. Read against the fixed-dividend leak, this is two-sided in a way the tape hasn't priced: the buffer is explicitly sized to service preferred obligations without selling BTC, which materially de-risks a repeat of the record 3,588-BTC sale (the Strategy watch steps DOWN 0.30→0.25 on it — the first improvement in the corporate risk picture since May), but it also confirms deployment-downshift-as-policy — the most ideological corporate buyer looked at a 15% recovery off the lows and chose to build a bunker instead of a position. The BSTR follow-up cuts the same way: the original Cantor merger agreement is now formally terminated, the PIPE financing dropped, the shareholder vote postponed indefinitely — the treasury-vehicle on-ramp's financing leg failed outright in this cost-of-capital regime, even though the deal (and its 30,021 BTC) survives in renegotiation. Net: the corporate floor is less likely to leak, and no more likely to bid.",
      "The regulatory board finally moved — in both directions at once — and gained a second jurisdiction. CLARITY's binding constraint rotated from floor time to votes: the NDAA cleared its week, Thune is targeting the week of July 20 for the floor, but the merged Banking–Agriculture draft omitted the Section 604 ethics language and Senators Murphy, Van Hollen and Merkley formally defected — so the bill is finally moving toward a vote it does not yet have the numbers to win (~7 Democratic votes needed for 60; betting markets swung full-2026 odds 24%→45% in four days). Either way THESIS-001 likely resolves within three weeks: cloture clearing lifts everything; a failed vote or an August 7 slip fires condition #2 and retires it. Meanwhile Japan quietly enacted the thing CLARITY only proposes — final passage of FIEA amendments reclassifying Bitcoin and ~104 assets as financial instruments, with Tokyo spot-ETF rails targeted for 2027 and a 20% flat tax from 2028. It does not move this quarter's tape, but the institutional-unlock mechanism this system has tracked all year is now law in the world's fourth-largest economy regardless of what Washington does by August 7.",
      "Net ledger: the flow pillar confirmed (two named tests resolved, the watch scored a HIT, YTD repairing); the macro pillar confirmed in data but pending a decision, with a live oil-shock tail; the corporate pillar de-risked but bid-less; the regulatory pillar at a genuine binary with a structural international positive banked. The path to 0.70–0.75: a July FOMC that holds and lets September-hike odds fade, flows staying net-positive in three of the next four weeks, and a durable $66K reclaim. The path back to 0.55: a July hike or a re-hardened path that relapses flows, or Hormuz escalation pushing Brent through $100 and handing back the CPI relief.",
    ],
    falsificationConditions: [
      "BTC posts a weekly close below $55,000 (structural next-leg) or below $50,000 (full structural break) through Q3 2026 — either retires the cyclical read; the $50K line is the hard trip.",
      "ETF flows flip back to net-negative for 3+ consecutive weeks after the July 28–29 FOMC — the post-CPI inflows prove a one-off data pop, not a re-established bid, and the YTD repair stalls.",
      "Strategy escalates from liability-driven sales to a thesis-citing strategic net sale, OR sells BTC again in a successive dividend cycle despite the $3.0B pre-funded reserve, OR a top-10 corporate / second sovereign discloses a strategic net sale — the floor leaks through the buffer built to stop it.",
      "A third liquidation cascade (≥$1B forced liquidations or ≥15% over ≤7 days) prints on an ordinary (non-expiry) session — a successive wave not explainable by a scheduled flush reads cleanly structural.",
      "Brent sustains above $100 for 2+ weeks on Hormuz escalation AND September-hike odds close above 75% after the July FOMC — the oil-shock channel reverses the CPI relief and re-hardens higher-for-longer with flows relapsing.",
    ],
  },
  crossCurrents: [
    {
      title: "Cool CPI meets burning Hormuz — the disinflation the flows are riding is hostage to a war the truce no longer contains",
      body: "The Fed/macro theme (slot 3) and the ETF-flow theme (slot 1) crossed this week through the CPI print's own composition. The −0.4% June CPI that ignited four straight ETF inflow days owed most of its size to a 5.7% energy slump — the largest since April 2020 — recorded while the Strait of Hormuz was open under the June 17 memorandum. That memorandum has now collapsed in practice: at the 60-day window's July 17 halfway mark the U.S. has struck 300+ Iranian targets, Iran is attacking commercial shipping, and Brent is holding above $85. So the interaction runs: the flows re-engaged on a disinflation signal whose biggest input has already reversed, and the rate market knows it — which is why the coolest monthly print since 2020 only pulled September-hike odds back to ~65% and left ~30% on a July hike. This is the June 20 'relief the central bank refuses to spend' pattern running in reverse: then, peace couldn't buy a dovish Fed because core inflation was sticky; now core has finally gone quiet (flat on the month) exactly as the energy tail re-ignites. If Hormuz escalation pushes oil through $100, July's CPI hands back the relief and the fed→flows coupling — demonstrated in both directions across the past two weeks — would run the bears' way into the July 28–29 FOMC.",
      themesConnected: ["Federal Reserve / Macro", "Spot Bitcoin ETF Flows"],
    },
    {
      title: "The passive bid returned; the corporate bid built a bunker — the two institutional pillars are now moving in opposite directions",
      body: "The ETF-flow theme (slot 1) and the corporate-treasury theme (slot 4) crossed in mirror image this week. In the same five sessions that spot ETFs took in over $550M (IBIT-led, four straight days), the biggest corporate holder raised $466.7M in fresh equity and put none of it into Bitcoin — Strategy's July 13 8-K shows zero BTC transacted and a USD reserve lifted to $3.0B. The 'buyer-class convergence under macro stress' pattern this memory has tracked since May is now resolving asymmetrically: the passive/ETF pillar has stepped back in, the corporate pillar has formalized its absence. The interaction cuts two ways. Constructively, the $3B buffer is sized to service Strategy's preferred dividends without selling BTC — it de-risks the fixed-dividend leak that produced June's forced sales, which is why the corporate-risk watch improved for the first time since May. Bearishly, it means the recovery is running on one institutional engine: the structural bid that made 2024–25 dips shallow (a corporate cohort that bought every drawdown) is standing down by policy, and the BSTR/Cantor follow-up — original agreement terminated, PIPE financing dropped, shareholder vote postponed indefinitely — shows the pipeline that would mint NEW corporate buyers is still jammed by the same cost-of-capital regime. Flows healing plus corporate abstention is a thinner floor than the bull case's rhetoric implies; it holds only while the ETF bid does.",
      themesConnected: ["Spot Bitcoin ETF Flows", "Corporate Treasury Wave"],
    },
    {
      title: "Two legislatures, one mechanism — Japan enacts the commodity-style reclassification Washington can't yet schedule",
      body: "The Japan FIEA theme (slot 5) and the CLARITY theme (slot 2) crossed as near-perfect controls on the same institutional-unlock mechanism. On July 15 Japan's parliament gave final passage to amendments reclassifying Bitcoin and ~104 crypto assets as financial instruments — insider-trading rules, issuer disclosures, Tokyo spot-ETF rails targeted for 2027, a 20% flat tax from 2028. Two days later the CLARITY Act, which proposes the equivalent reclassification for the U.S. (the SEC/CFTC commodity split), hit its ethics standoff: the merged Senate draft dropped the Section 604 conflict-of-interest language and three Democrats formally defected, leaving a floor vote targeted for the week of July 20 without the votes to clear it. The interaction is competitive pressure with a timing asymmetry: the thesis this system has carried all year — legal classification unlocks gated institutional capital — is now being implemented in the world's fourth-largest economy on a statutory clock, while the U.S. version resolves as a binary within three weeks (cloture, or condition #2 fires and THESIS-001 retires). The House's July 17 Federal Hall hearing made the competitiveness argument explicitly — 'onshoring innovation' — and Japan handed that argument its best evidence yet. A CLARITY failure in August would not kill the unlock mechanism; it would offshore its first at-scale test to Tokyo's 2027 ETF rails, with U.S. allocators watching from behind the gate.",
      themesConnected: ["Japan FIEA Reclassification", "CLARITY Act"],
    },
  ],
  watchList: [
    {
      event: "Spot Bitcoin ETFs stay net-positive in at least 3 of the 4 weekly prints through Aug 14, 2026 (the post-CPI repair survives the July FOMC)",
      plain: "Money has come back to Bitcoin funds for two straight weeks. If it keeps coming through the Fed's late-July meeting, the year's exodus is genuinely over rather than just pausing.",
      category: "etf",
      window: "by Aug 14, 2026",
      probability: 0.55,
      signal: "The successor to the positive-week watch that just resolved HIT (two consecutive positive weeks; four straight post-CPI inflow days totaling $550M+, IBIT-led with +$136.5M on Jul 17 alone). Set at 0.55, not higher, because the July 28–29 FOMC sits inside the window with ~30% odds of an outright hike priced and the Iran oil tail live — the flows have proven resilient through a hawkish REPRICING, but not yet through a hawkish DECISION. Three of four positive weeks → THESIS-003 toward 0.70 and the YTD repair becomes trend; flows flipping negative for the back half of the window → the new falsification #2 clock starts (3+ negative weeks post-FOMC retires the cyclical read).",
    },
    {
      event: "The July 28–29 FOMC holds rates AND September-hike odds close below 50% within two days of the meeting (the Fed ratifies the CPI relief)",
      plain: "The Fed meets in late July. If it leaves rates alone and traders stop expecting a September increase, the biggest weight on Bitcoin this year lifts. If it raises rates or talks tough, the recovery is in trouble.",
      category: "macro",
      window: "by Jul 31, 2026",
      probability: 0.25,
      signal: "The decision leg the data leg (June CPI, scored PARTIAL) could not settle. Set LOW at 0.25 per the standing macro calibration correction: this is a Fed-DECISION read, exactly the class of dovish forecast the record says to haircut (7 of 8 such calls missed at the June FOMC). The tape agrees: even after the coolest monthly CPI since April 2020, FedWatch prices ~65% for a September hike and ~30% for a hike at this very meeting, with 9 of 18 June dots already projecting one — and Brent above $85 on the Hormuz collapse gives the hawks fresh ammunition. A hold + fading September odds → THESIS-003 toward 0.70, fed standalone up, and the 2026 easing path reopens; a hike or a re-hardened path (September odds >75%) → falsification #5's macro leg fires toward a step back to 0.55.",
    },
    {
      event: "Senate CLARITY floor vote clears 60-vote cloture with commodity classification intact before the August 7 recess",
      plain: "The big U.S. crypto law — the one that hands Bitcoin to the commodity regulator (CFTC) rather than the securities regulator (SEC) — finally gets its Senate moment. It's headed to a vote it doesn't yet have the numbers to win.",
      category: "regulation",
      window: "by Aug 7, 2026",
      probability: 0.20,
      signal: "HELD at 0.20 with the binding constraint rotated: floor TIME is no longer the blocker (the NDAA cleared its week; Thune pledged a pre-recess vote, week of Jul 20 in active discussion) — VOTES are. The merged Banking–Agriculture draft omitted the Section 604 ethics language Democrats named as their price, and Sens. Murphy, Van Hollen and Merkley formally defected, leaving the bill short of the ~7 Democratic votes cloture needs. Betting markets swung full-2026 odds 24%→45% in four days — genuinely two-sided. The exogenous-calendar risk hasn't vanished (any must-pass surprise still eats the window), but the live question is whether leadership schedules a vote it can win or a messaging vote it can't. Cloture clearing with the SEC/CFTC split intact → institutional-unlock re-couples, lift THESIS-003; a failed cloture vote OR a slip past Aug 7 → condition #2 fires → RETIRE THESIS-001. Either way, this resolves within three weeks.",
    },
    {
      event: "Strategy sells BTC again in a successive dividend cycle OR escalates to a thesis-citing strategic net sale (despite the $3.0B pre-funded reserve)",
      plain: "Strategy just stockpiled three billion dollars in cash specifically so it won't have to sell Bitcoin to pay its bills. If it sells anyway, something is more broken than it looks.",
      category: "corporate",
      window: "by Sep 30, 2026",
      probability: 0.25,
      signal: "Stepped DOWN 0.30→0.25 — the first improvement in the corporate risk picture since May. The Jul 13 8-K shows $466.7M raised Jul 6–12 with ZERO BTC bought or sold and the USD reserve lifted to $3.0B — a buffer explicitly sized to service the preferred dividends that forced June–July's sales (June's 32 BTC, July's record 3,588 BTC), making a repeat mechanically less likely. The trade-off: no deployment either — holdings flat at 843,775 BTC through a 15% recovery, so the corporate bid remains absent by policy (~$23.8B ATM capacity idle). A sale printed THROUGH the buffer would be a materially worse signal than June's forced sales (fires falsification #3 hard); majority-into-BTC deployment resuming would confirm the leak was tactical and the pillar repairing.",
    },
    {
      event: "BTC posts a weekly close below $55,000 (next leg of the structural break)",
      plain: "A weekly finish under $55,000 would mean the summer slide is back on — the opposite of the recovery now underway near $65,000.",
      category: "market-structure",
      window: "by Aug 31, 2026",
      probability: 0.20,
      signal: "Stepped DOWN 0.25→0.20 post-CPI: the two-day-out binary that froze this row last run resolved constructively (soft print, four inflow days, three-week high $65.1K, $60K support intact, no cascade). From here the live downside triggers are a July FOMC hike surprise (~30% priced) or a Hormuz oil shock re-hardening the rate path — not a CPI binary. A base above $60K into August breaks the structural-break momentum entirely; a weekly close <$55K would mark the recovery as a failed rally and bring the $50K falsification line into view (THESIS-003 falsification #1).",
    },
    {
      event: "BIP-110 (contested data-limit soft fork) locks in via version-bit-4 signaling by the ~Aug 7, 2026 UASF flag day (block 961,632)",
      plain: "A small group wants to change Bitcoin's rules to limit junk data in transactions, but almost no miners back it — the realistic risk is a brief, messy split, not the change passing.",
      category: "protocol",
      window: "by Aug 7, 2026 (flag day)",
      probability: 0.10,
      signal: "Held at 0.10 into its final three weeks: signaling remains near ~0.31%, no major mining pool has signaled, and Bitcoin Core has not endorsed it (backing concentrated in Bitcoin Knots). If any 2,016-block period crosses 55%, early lock-in plus activation one period later; if signaling stays sub-threshold but a UASF/Sztorc-style fork client gains node share into the August window, the tail risk is a brief contentious chain split rather than a clean activation; if neither fires, BIP-110 lapses at the flag day as a non-event and the row scores. (Calendar note: the flag day and the CLARITY recess deadline both land ~Aug 7 — unrelated, but a crowded date.)",
    },
  ],
  contrarianTake: {
    probability: 0.25,
    plain: "The other side: one good inflation number doesn't end a downtrend. The Fed is still leaning toward raising rates, a fresh oil shock is brewing as the Iran truce collapses, and Bitcoin's biggest corporate buyer chose to stockpile cash instead of buying — the most informed money isn't acting convinced.",
    body: "With the cyclical read at 0.65, the serious contrarian remains the structural-break bear, stepped down 0.30→0.25 — but with its center of gravity honestly relocated, because its old flow leg was refuted. Last week's bear leaned on the choppy tape; the tape then printed four straight IBIT-led inflow days through a hawkish repricing, and the positive-week watch scored a HIT, so 'the passive base isn't really back' no longer carries the case. What does: the macro edifice under these flows is one soft print thick. The market went INTO the CPI pricing a September hike above 75% and came out still at ~65% with ~30% on a July hike — the coolest monthly print since 2020 bought back barely half the dovish repricing, because the print's energy-slump core is already stale with Hormuz under attack and Brent above $85. If July's CPI hands back the energy relief, the same coupling that pulled flows in pulls them straight back out, and the recovery reads as a data pop inside an unbroken downtrend — a lower high at $65K, right where the options market moved its favorite strike. The bear's second leg is behavioral: the most informed corporate actor in the asset just raised $467M and bought nothing, parking $3B in cash, and an eight-year-dormant whale moved 5,908 BTC into the bounce — the strongest hands are building optionality and exiting, not conviction-buying. Below the base case; freshly re-evidenced; not a strawman.",
  },
  themeInteractions: {
    regime: "reinforcing",
    pairs: [
      { themes: ["clarity-act", "etfs"], delta: 0.08, direction: "reinforcing" },
      { themes: ["clarity-act", "corporate-treasuries"], delta: 0.10, direction: "reinforcing" },
      { themes: ["clarity-act", "fed-monetary-policy"], delta: 0.04, direction: "reinforcing" },
      { themes: ["etfs", "corporate-treasuries"], delta: 0.10, direction: "reinforcing" },
      { themes: ["etfs", "fed-monetary-policy"], delta: 0.10, direction: "reinforcing" },
      { themes: ["corporate-treasuries", "fed-monetary-policy"], delta: 0.07, direction: "reinforcing" },
    ],
    adjustments: [
      {
        theme: "etfs",
        draftProbability: 0.65,
        netDelta: 0.10,
        finalProbability: 0.75,
        reasoning: "REGIME HELD REINFORCING; contagion 0 of 3: (1) no outflow streak — four straight post-CPI inflow days and two consecutive positive weeks, etfs drafted 0.65 (raised from 0.55 on the resolved positive-week watch); (2) no in-window cascade — BTC at a three-week high consolidating near $64.7K; (3) no downward corporate spillover — Strategy's Jul 13 8-K shows zero BTC sold. Reinforcing nudges: clarity (p=0.20) +0.08×0.20=+0.016; corporate (p=0.40) +0.10×0.40=+0.040; fed (p=0.45) +0.10×0.45=+0.045; japan-fiea not in matrix (delta 0.00, flagged). Sum +0.101 → 0.65+0.10=0.75. NOTE sovereign-reserves left the top-5 this run (Bhutan slot replaced by Japan FIEA), so its pairs drop out of the arithmetic. The directly-judged THESIS-003 = 0.65 is the load-bearing forecast, not this matrix etfs-final 0.75.",
      },
      {
        theme: "fed-monetary-policy",
        draftProbability: 0.45,
        netDelta: 0.10,
        finalProbability: 0.55,
        reasoning: "Standalone stepped DOWN 0.55→0.45 despite the soft CPI, because the rate PRICING hardened around it: September-hike odds sit ~65% (vs ~30% on Jul 8) with ~30% on a July hike, the dovish repricing having broken pre-print and only partially restored — and the Iran collapse re-opens the oil→inflation channel (Brent >$85). The data leg is dovish; the decision leg (Jul 28–29, a Fed-DECISION read → haircut per calibration) and the war leg are not. Reinforcing nudges: etfs (p=0.65) +0.10×0.65=+0.065; corporate (p=0.40) +0.07×0.40=+0.028; clarity (p=0.20) +0.04×0.20=+0.008. Sum +0.101 → 0.45+0.10=0.55. The load-bearing macro forecast is the FOMC-ratification watch at 0.25, not this matrix 0.55.",
      },
      {
        theme: "corporate-treasuries",
        draftProbability: 0.40,
        netDelta: 0.12,
        finalProbability: 0.50,
        reasoning: "Standalone stepped UP 0.35→0.40 — the first corporate improvement since May: no repeat sale in the Jul 6–12 window, and the $3.0B pre-funded USD reserve materially de-risks the fixed-dividend leak (the forced-sale mechanism that produced June–July's sales now has a cash buffer in front of it). Capped at 0.40 because the bid is still absent by policy (zero deployment of $467M raised; BSTR's original merger agreement formally terminated with the PIPE dropped — the new-vehicle pipeline still jammed). Reinforcing nudges: etfs (p=0.65) +0.10×0.65=+0.065; clarity (p=0.20) +0.10×0.20=+0.020; fed (p=0.45) +0.07×0.45=+0.0315. Sum +0.1165 → 0.40+0.12=0.52 → 0.50 (rounded). Standalone 0.40 is load-bearing; the matrix 0.50 is reinforcing-cluster arithmetic.",
      },
      {
        theme: "clarity-act",
        draftProbability: 0.20,
        netDelta: 0.10,
        finalProbability: 0.30,
        reasoning: "Non-cluster theme — reinforcing rule throughout. Standalone HELD 0.20 on two offsetting rotations: the floor-time constraint EASED (NDAA cleared; Thune targeting the week of Jul 20; a pre-recess vote now likely to actually occur) while the vote math WORSENED (merged draft omits the Section 604 ethics language; Murphy, Van Hollen, Merkley formally opposed; ~7 Democratic votes still needed). Betting markets swung full-2026 odds 24%→45% — two-sided, but this row prices the tighter pre-recess-cloture question. Nudges: etfs (p=0.65) +0.08×0.65=+0.052; corporate (p=0.40) +0.10×0.40=+0.040; fed (p=0.45) +0.04×0.45=+0.018. Sum +0.110 → 0.20+0.11=0.31 → 0.30 (rounded). The load-bearing forecast is the standalone 0.20 in the watchList, NOT the matrix 0.30.",
      },
      {
        theme: "japan-fiea",
        draftProbability: 0.60,
        netDelta: 0.0,
        finalProbability: 0.60,
        reasoning: "NEW THEME — enters the top-5 replacing sovereign-reserves (Bhutan slot). Not in the interaction matrix: all pairwise deltas 0.00 this run, flagged in next-run-briefing for row/column assessment (candidate couplings: japan-fiea↔etfs positive via the Tokyo spot-ETF rail; japan-fiea↔clarity-act positive via the competitiveness channel the Federal Hall hearing invoked). Standalone 0.60 = probability the enacted reform translates into working adoption rails roughly on schedule (TSE spot-ETF listings ~2027, 20% flat tax from Jan 2028): the statute is final (passed Jul 15) but implementation, FSA rulemaking, and the tax bill's own passage carry real slippage risk.",
      },
    ],
  },
  calibration: {
    aggregateBrier: 0.19,
    nResolved: 16,
    briefSummary: "16 items scored; aggregate Brier improved 0.21→0.19 on three resolutions this run — the positive-ETF-week watch HIT (p=0.60), the FBTC-vs-IBIT divergence MISS (p=0.40; the recovery was IBIT-led, inverting the tell), and the June-CPI confirmation PARTIAL (p=0.55; the print was decisively soft but the dovish repricing it was meant to sustain had already broken pre-print and only partially restored). Macro softens to N=9, +0.25 mean residual — still net over-confident on Fed easing, so the July FOMC ratification watch carries the full Fed-DECISION haircut at 0.25.",
  },
  sources: [
    { label: "U.S. Bureau of Labor Statistics — Consumer Price Index Summary, June 2026 (−0.4% MoM, 3.5% YoY)", url: "https://www.bls.gov/news.release/cpi.nr0.htm" },
    { label: "CNBC — June CPI falls 0.4%, September-hike odds ease to 63% from above 75% (July 14, 2026)", url: "https://www.cnbc.com/2026/07/14/consumer-price-index-inflation-report-june-2026.html" },
    { label: "CME FedWatch — post-CPI pricing: ~70% July hold, ~65% September hike", url: "https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html" },
    { label: "Crypto Briefing — BlackRock's IBIT leads Bitcoin ETFs with $79M inflows on July 16 (fourth-day streak context)", url: "https://cryptobriefing.com/blackrock-ibit-leads-bitcoin-etfs-79m-inflows-july-16/" },
    { label: "Bloomberg — Saylor's Strategy raises reserve to $3 billion with stock sale; no BTC bought or sold (July 13 8-K)", url: "https://www.bloomberg.com/news/articles/2026-07-13/saylor-s-strategy-raises-reserve-to-3-billion-with-stock-sale" },
    { label: "CoinDesk — Adam Back's BSTR and Cantor scrap original SPAC terms; PIPE dropped, vote postponed (July 8)", url: "https://www.coindesk.com/markets/2026/07/08/adam-back-s-bstr-scraps-original-spac-terms-seeks-new-deal" },
    { label: "Axios — CLARITY Act held up as Democrats seek ethics provision; merged draft omits Section 604 (July 17)", url: "https://www.axios.com/2026/07/17/clarity-act-delay-provision" },
    { label: "Fox News — Trump's 60-day Iran deal reaches halfway mark as ceasefire collapses into escalating war (July 17)", url: "https://www.foxnews.com/politics/trumps-60-day-iran-deal-reaches-halfway-mark-ceasefire-collapses-escalating-war" },
    { label: "CoinDesk — Japan reclassifies crypto as a financial asset, paves way for tax cuts and Tokyo spot ETFs (July 15)", url: "https://www.coindesk.com/policy/2026/07/15/japan-reclassifies-crypto-as-a-financial-asset-paves-way-for-tax-cuts" },
  ],
};
