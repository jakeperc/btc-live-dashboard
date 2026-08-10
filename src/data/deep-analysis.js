// DEEP ANALYSIS — owner: /refresh-deep-analysis (weekly, v2).
// Do not Read src/BitcoinDashboard.jsx to edit this — edit this file instead.
//
// Weekly synthesis layer. Sits on top of MARKET_THEME + CURATED_MARKET_UPDATES.
// Curation says what happened; this says what it means, how the themes interact,
// and what to watch next.
// v2: explicit probabilities + falsification conditions + Brier-scored calibration.
// Persisted analyst memory lives at automations/refresh-deep-analysis/memory/.

export const DEEP_ANALYSIS = {
  asOf: "AUG 7, 2026",
  headline: "The gate opened from the outside: a shrinking jobs count did what cool inflation alone couldn't — knocked the September rate rise off the table — and the fund money that had been waiting came back, roughly $750 million of it before the report even landed. The range thesis strengthens to 0.60; Wednesday's CPI and Monday's Strategy filing are the two wires that decide whether the range's top edge becomes the story.",
  plainSummary: "A surprisingly weak jobs report convinced markets the Fed won't raise rates next month, money flowed back into Bitcoin funds every day this week, and Bitcoin hit its highest price of the month. Next week's inflation report is the last big hurdle.",
  marketContext: "The macro regime flipped in one morning. July payrolls FELL 23,000 against an expected 83,000 gain — the first monthly decline in months, with May and June revised down a combined 103,000 and wage growth at its coolest since May 2021 — and within hours the September rate hike markets had priced at roughly two-in-three became an expected hold. The 10-year yield fell from ~4.67% toward 4.60%, the dollar slipped, and gold surged to a seven-week high — Bitcoin rose WITH the hedge asset this week, reversing last week's divergence, as both caught the rate-relief bid. Oil compounded the turn: Brent slid from $101 in late July to about $79 as daily U.S.–Iran talks produced agreed coordinates for a protected Hormuz shipping lane. Bitcoin ran from a $63,150 weekly open to $65,340 — its August high, still about 48% below the October 2025 peak — with its historically worst-seasonality month suddenly carrying its friendliest setup since spring.",
  primaryAnalysis: {
    themeTitle: "The Weak Jobs Report Broke the Standoff: September Hike Bets Collapse and the ETF Money Comes Back",
    plain: "Our best read strengthens: Bitcoin's summer has been a waiting game on interest rates, and this week the wait broke in Bitcoin's favor — money is returning. The question now is whether next week's inflation report confirms the all-clear.",
    thesisProbability: 0.60,
    body: [
      "The range thesis's central mechanism — demand is WAITING on the rate gate, not gone — got its cleanest confirmation yet, with one wrinkle the model didn't predict: the order of events. Money returned to the spot ETFs on all four trading days BEFORE Friday's jobs report — roughly $750 million Monday through Thursday, more than triple July's entire net intake, with BlackRock's IBIT absorbing about $604 million of it — while a September hike was still priced at two-in-three. Then the report landed (payrolls −23,000 against +83,000 expected; −103,000 of back-month revisions; the coolest wage growth in over five years), rate futures flipped from hike to hold within hours, and Bitcoin tagged $65,340. Strictly, our five-regime transmission model said flows track the NEXT decision's posted odds; this week they tracked where the odds were GOING — either allocators priced the data pipeline (oil's slide toward $79 made a cool CPI and a September hold progressively more likely all week), or the post-expiry, deleveraged tape simply ran out of sellers. Sixth regime observation, and a refinement rather than an anomaly: the marginal allocator prices the expected path of the gate, not its current setting.",
      "The composition of the relief matters more than its size. This is not immaculate disinflation — it is a labor market losing altitude: the headline decline leaned on a largely seasonal 53,000-job government drop, but private hiring managed only +30,000, unemployment fell to 4.1% for the wrong reason (people leaving the workforce), and the May–June revisions mean the 'improving labor market' the July FOMC statement described was partly a data artifact. The Fed now has both mandates pulling in opposite directions — inflation still above target, with three committee members on record wanting a hike nine days ago, and employment now visibly cracking. Historically, and in our own calibration record, the employment side wins that argument: a genuine labor-market break is the one dovish force the rate market consistently respects. But it cuts both ways, and this is the thesis's live risk rather than its comfort: soft data is bullish for risk assets only until it reads as recessionary. The marker to watch is behavioral — if data keeps softening and Bitcoin starts falling WITH equities despite friendly rate pricing, the regime has rotated from inflation-gated to growth-gated, and the contrarian take below gets the pen.",
      "Mechanically, the thesis strengthened along the exact path named at its August 3 initiation: 'the range's edges hold through both August prints with at least one positive flow week.' The first print has now passed with the range intact ($65,340 sits inside the $55K–$68K band) and the positive flow week is effectively banked — so 0.55 steps to 0.60, one step, with the August 12 CPI still unresolved. Two falsification notes are worth reading closely. First, the upside falsifier (#5: a >$70K weekly close BEFORE September-hike odds fell below 50%) closed its window WITHOUT firing — the odds fell first, exactly the sequence the gating model predicts: legitimate upside runs THROUGH the gate, not around it. It is rewritten forward: a breakout against a RE-locked gate would still falsify. Second, the demand falsifier (#3) is now ARMED for the first time — a dovish surprise has occurred, so the clock on 'flows must respond within two weekly prints' is running; with this week nearly banked positive it will most likely be defused within days, which is itself information. The remaining tests are dated: Wednesday's CPI (the first print carrying the July tariff schedule's full pass-through, set against a reversed energy input — a genuine two-channel decomposition), then the range's own top — the July 21 high at $66,910, then the $68K band edge. A tame CPI with flows positive makes the up-edge, not the middle, the live part of the range into the September 15–16 FOMC.",
      "The corporate pillar said nothing this week — and the silence is about to become the sharpest single datapoint on the board. The week's entire restart happened WITHOUT corporate participation: Strategy has gone six weekly filings without a purchase, has sold below cost in two successive dividend cycles, and files its next 8-K Monday. That filing arrives under materially changed conditions: the rate excuse is dying (September repriced to a hold), the stock of reasons NOT to deploy is shrinking (a $4.0B reserve already covers roughly two years of preferred obligations, and $20B+ of ATM stock-sale capacity sits idle), and the price has recovered to its August high. This is the cleanest version yet of the discriminating test our financing-window model has carried since June: if the cost-of-capital regime eases and deployment STILL doesn't resume, the retreat is doctrine, not constraint. A resumed buy would make next week the first since May with both structural pillars — fund flows and the corporate bid — simultaneously constructive, and would open the thesis's path toward 0.65–0.70. A third-cycle sale into an opening gate and a full buffer would be strategic reallocation in all but name: falsifier #2 fires, the overhang re-rates from bounded to open-ended, and the range's floor, not its top, becomes the question. We hold the third-sale watch at 0.40 — the ledger's costliest lesson this summer was over-weighting this company's stated doctrine against its revealed behavior.",
      "The crypto bill's summer died on schedule — and our watch row died with it, instructively. No cloture petition was filed by Wednesday; Majority Leader Thune confirmed there will be no vote before the five-week recess; our 0.30 'petition-and-vote' row scores a MISS (Brier 0.09). The instructive part is WHY the modal-outcome logic failed: we reasoned a doomed vote had messaging value before the midterms; leadership instead treated the cloture vote as an asset to spend at the optimal moment — 'queued up first thing' when the Senate returns September 14 — banking it rather than burning it. That is the same lesson the Strategy ledger taught in July, generalized from corporations to politicians: price the revealed calendar, not the stated commitment. The September setup is now unusually concrete, and cleaner than July's ever was: the first procedural vote can occur September 15–16; the Collins–Murray funding deal (89–4, government open through December 11) has removed the floor-time competition that killed the bill twice this summer; and the constraint is purely votes — about seven Democrats, with the Gallego–Tillis ethics compromise sitting unanswered at the White House and prediction markets down at roughly 13% for 2026 enactment. We hold September at 0.25: the freed floor and the 'first thing' commitment argue up; the demonstrated vote deficit and a 13% market argue down; both are real.",
      "The week also retired two of the ledger's cheapest uncertainties. BIP-110's flag day arrived with under 1% of mining power signaling — lock-in failed, our 0.10 watch scores a MISS at a 0.01 Brier (the ledger's first protocol resolution), and what remains is a two-week mandatory window in which a 2–8% minority of enforcing nodes reject non-signaling blocks (a would-be chain with effectively zero mining power behind it), plus Sztorc's airdrop-style eCash spinoff around August 21. We seed the residual split-tail at 0.10 and expect noise, not news — the ETF wrappers are prospectus-insulated from forked assets. The Coldcard breach grew to ~1,816 BTC (~$116M across 5,200+ addresses — now ranked the third-largest crypto hack of 2026), but the drain curve is decelerating post-patch; containment steps to 0.25. Neither is flow-relevant; both are narrative. The honest bottom line: two of August's three deciding wires — the jobs print and the flow restart — broke constructive this week, and only the CPI remains. The thesis strengthens to 0.60, but its character shifts: for two months the question was whether the range would hold; after this week, the live question is which EDGE it exits — and for the first time since spring, the top edge has the better-evidenced path.",
    ],
    falsificationConditions: [
      "BTC posts a weekly close below $55,000 through Oct 31, 2026 — the bounded-overhang claim fails and the structural break in price becomes the base case (a close below $50,000 is the hard confirmation).",
      "Strategy's filings show a third consecutive dividend-cycle net BTC sale, a monthly sale materially above dividend size (>$200M), or explicit strategic-reallocation language — despite a ~$4.0B reserve covering ~2 years of obligations — the 'bounded, liability-sized leak' leg fails; the overhang is open-ended.",
      "ARMED (Aug 7): the dovish data surprise has now occurred — if ETF flows print net-negative in the two weekly readings that follow it (weeks ending Aug 7 and Aug 14), the rate-gate model is wrong and demand is simply absent, not waiting. (This week's ~$750M restart makes early defusal the likely outcome — which is itself confirmation.)",
      "A liquidation cascade (≥$1B forced liquidations or ≥15% over ≤7 days) prints on an ordinary non-expiry session — leverage, not the flow/leak balance, is setting price again and the range breaks mechanically.",
      "REWRITTEN (Aug 7 — the original closed its window unfired: September-hike odds fell below 50% before any breakout, the exact sequence the gating model predicts): BTC posts a weekly close above $70,000 while September-hike odds stand ABOVE 50% — e.g., a breakout against a gate re-locked by a hot CPI — meaning something other than the rate gate is driving, and the gating model is wrong even if the direction is welcome.",
    ],
  },
  crossCurrents: [
    {
      title: "The tape front-ran the gate: the sixth Fed→flows transmission arrived early",
      body: "The macro theme (slot 3) and the ETF-flow theme (slot 1) crossed for the sixth time in eight weeks — and for the first time, the flows moved BEFORE the macro data did. The transmission model built across five prior regimes says money tracks the next Fed decision's odds: it left on hawkish minutes, returned on a soft CPI, stalled on a hawkish hold. This week broke the sequence: four straight inflow days (~$750M) printed while a September hike was still two-in-three priced, and only THEN did Friday's jobs miss flip the odds to a hold — ratifying a restart already underway. Two readings, both informative. Either allocators priced the data pipeline — oil's slide from $101 to $79 made a cool August CPI progressively more likely each day, so the smart money bought the expected repricing rather than the posted one — or the post-expiry, deleveraged book simply had no sellers left and any bid moved the tape. The refinement for the model: the marginal allocator prices the gate's expected path, not its current setting. The clean test comes Wednesday: if flows stall INTO the CPI and restart after, the anticipation read weakens; if they keep running through it, the pipeline read wins — and the transmission model gains a forward-looking channel.",
      themesConnected: ["Federal Reserve / Macro", "Spot Bitcoin ETF Flows"],
    },
    {
      title: "September 15–16 is now a twin catalyst: the Fed decision and the crypto bill's vote land on the same two days",
      body: "The regulation theme (slot 2) and the macro theme (slot 3) just had their resolution windows collapse onto the same 48 hours. The CLARITY Act's first procedural vote, per Thune's 'queued up first thing' commitment after the Senate's September 14 return, can occur September 15–16 — the exact dates of the Fed's next meeting. Our synchronized-tailwinds pattern (tracked since May) holds that allocators rarely act on regulatory clarity OR rate relief alone: clarity into a hostile rate environment is a trickle; clarity into easing is the unlock. That pattern has spent the summer running in its inverted, hostile form — the bill died in July exactly as the hike went live. Now both legs point the other way and converge on one window: markets arrive at September 15 expecting a HOLD (post-jobs repricing), on a Senate floor cleared of shutdown risk (the Collins–Murray CR through December 11 removed the floor-time competition that killed the bill twice). If both break constructive inside those two days — a hold with dovish guidance plus a cleared cloture — the original acceleration case fires from a mid-range base; if both break hostile — a hot-CPI-forced hike plus a failed cloture — the bear's conjunction assembles in one window. The discipline note: between now and September 14 the regulatory theme has NO scheduled catalysts. Five quiet weeks; the temptation to re-litigate it weekly should be resisted.",
      themesConnected: ["CLARITY Act / U.S. Regulation", "Federal Reserve / Macro"],
    },
    {
      title: "The restart without the corporate bid: one pillar back, one still leaking",
      body: "The ETF theme (slot 1) and the corporate-treasury theme (slot 4) moved in opposite directions this week, and the divergence frames Monday's filing as the sharpest single datapoint on the board. Demand restarted — roughly $750M across four days, the strongest week since mid-July — while the corporate pillar stayed exactly where the retired thesis left it: six weekly filings without a purchase, two successive below-cost sale cycles, a junior cohort still liquidating. The absorption arithmetic has inverted since last week. In July's record-quiet month, a $105M corporate sale was informationally heavy against a $200M monthly intake; against a $750M inflow WEEK, a dividend-sized sale is a rounding error — the leak only regains pricing power if demand stalls (a hot CPI) or the leak grows (a third-cycle sale, watched at 0.40). That asymmetry is why the range thesis strengthened despite zero corporate improvement. Monday is the first chance since May for the two pillars to align constructive: a resumed buy under an opening rate gate and a full $4B buffer would complete the alignment; a third sale despite all three conditions would tell us the distribution is doctrine — and doctrine, unlike dividends, has no calendar and no cap.",
      themesConnected: ["Corporate Treasury Wave", "Spot Bitcoin ETF Flows"],
    },
  ],
  watchList: [
    {
      event: "The Aug 12 CPI confirms the jobs-driven repricing: September-hike odds close below 40% after the print",
      plain: "One inflation report next Wednesday largely decides whether the Fed really stays on hold — the friendly outcome Bitcoin is now priced for.",
      category: "macro",
      window: "by Aug 14, 2026",
      probability: 0.60,
      signal: "Restated 0.25→0.60: the jobs leg landed maximally dovish — payrolls −23K against +83K expected, −103K of revisions, the coolest wage growth since May 2021 — and rate futures flipped from a two-in-three September hike to an expected hold within hours. What remains is the CPI's first full tariff pass-through, now set against TWO disinflationary inputs: the reversed energy shock (Brent $101→$79) and a visibly cracking labor market that raises the Fed's bar to hike regardless of a warm print. If core stays tame, odds pin under 40% into Jackson Hole (Warsh's first keynote) and the flow restart runs toward the range top; if tariffs run the print hot, the July precedent applies — that relief was fully repossessed in ten days — and the week's entire repricing unwinds. Not scored until the print: the July lesson is that a repricing isn't sticky until the next data ratifies it.",
    },
    {
      event: "Spot Bitcoin ETFs print positive net flows in the week ending Aug 14, completing the ≥3-of-4 sustain test",
      plain: "Money returned to Bitcoin funds every day this week. One more positive week would confirm the recovery is real and not a one-off.",
      category: "etf",
      window: "by Aug 14, 2026",
      probability: 0.65,
      signal: "Restated 0.25→0.65 on resolved arithmetic: week three (ending Aug 7) is effectively banked positive — roughly $750M across Aug 3–6, more than triple July's entire net intake, and Friday's session cannot plausibly erase it — so the ≥3-of-4 test comes down to week four alone, spanning the Aug 12 CPI. The restart is still IBIT-concentrated (~$604M of the $750M; GBTC still bleeding), so composition risk remains, but the fed→flows transmission now points the right way: with a September hold expected, the marginal allocator's reason to wait is gone. Both weeks positive → THESIS-004's demand leg confirms and falsifier #3 (armed by the jobs surprise) is defused; a negative CPI-week print → the sustain test dies at 2-of-4 and the demand question re-opens exactly where the bear wants it.",
    },
    {
      event: "Strategy's Monday 8-K (Aug 10) — and the third-cycle question: a THIRD consecutive dividend-cycle net BTC sale despite the ~$4.0B reserve (by Sep 30)",
      plain: "Bitcoin's biggest corporate holder reports Monday. Buying again would be its first good sign in six weeks; selling a third time would say the sales are policy, not bill-paying.",
      category: "corporate",
      window: "by Sep 30, 2026 (next tell: Mon Aug 10)",
      probability: 0.40,
      signal: "HELD 0.40 — no filing since Aug 3, but Monday's 8-K now lands under the cleanest test conditions the financing-window model has had: the rate excuse is dying (September repriced to a hold), the $4.0B reserve covers ~2 years of the $1.76B/yr preferred bill, $20B+ of ATM capacity sits idle, and the price recovered to its August high. The calibration lesson stays priced in: weight revealed behavior (six no-buy filings, two successive below-cost sales, tease-then-sell social posts) over stated intent. A resumed buy = the first both-pillars-constructive week since May and the thesis's path toward 0.65–0.70; a third-cycle sale despite gate + buffer + price = strategic reallocation in all but name — falsifier #2 fires and the overhang re-rates open-ended. The formal test remains the September STRC cycle; every Monday filing between now and then is a preview.",
    },
    {
      event: "The Senate holds the CLARITY cloture vote Sep 15–16 and it CLEARS with the SEC/CFTC commodity split intact",
      plain: "The big crypto rules bill gets one more chance in mid-September — the same two days as the Fed's next rate decision.",
      category: "regulation",
      window: "by Sep 30, 2026",
      probability: 0.25,
      signal: "HELD 0.25 after the pre-recess endgame resolved MISS (no petition, no vote — scored 0.09 against our 0.30). The September setup is cleaner than July's ever was: Thune says the bill is 'queued up first thing' after the Sep 14 return (first vote possible Sep 15–16, colliding with the FOMC), and the Collins–Murray CR (89–4, government funded through Dec 11) removed the floor-time competition that killed the summer window twice. The constraint is now purely votes: ~7 Democrats short, the Gallego–Tillis ethics compromise unanswered at the White House, several Republicans reportedly soft — prediction markets price 2026 enactment near 13%. Held rather than raised or cut: the freed floor and banked-vote commitment argue up; the demonstrated deficit argues down. The next material evidence is a White House response to Gallego–Tillis or a named vote-count shift — until then, five quiet weeks.",
    },
    {
      event: "A consequential chain split from the BIP-110 mandatory window (through ~Aug 21) or the eCash spinoff (~Aug 21): a divergent chain persisting >24h or a split asset listed on a major exchange",
      plain: "Two attempts to split off from Bitcoin's network land this month. Almost no miners support them, so both are expected to fizzle quietly.",
      category: "protocol",
      window: "by Aug 31, 2026",
      probability: 0.10,
      signal: "Successor to the resolved flag-day row (lock-in MISS at p=0.10, Brier 0.01 — the ledger's first protocol resolution): BIP-110's mandatory signaling window opened at block 961,632 (~Aug 7) with under 1% of hashpower signaling, so activation is dead and the residual tail is enforcement noise — an estimated 2–8% of listening nodes (mostly Bitcoin Knots) now reject non-signaling blocks, meaning any chain they track has effectively zero mining power behind it. Sztorc's eCash Drivechain spinoff lands ~block 964,000 (~Aug 21), airdrop-style; IBIT's prospectus permanently abandons forked assets, insulating the ETF complex. If a divergent chain persists >24h or a split asset gets a major listing, the tail fired and the core-non-endorsement edge's split-risk leg validates; the expected outcome is that both events pass as headlines without a tape.",
    },
    {
      event: "Coldcard exploit losses cross ~2,500 BTC cumulative OR a second hardware-wallet vendor or firmware lineage is confirmed vulnerable (by Aug 31, 2026)",
      plain: "Thieves are still draining old, flawed hardware wallets — but more slowly now that a fix is out. The question is whether the theft wave burns out or keeps growing.",
      category: "protocol",
      window: "by Aug 31, 2026",
      probability: 0.25,
      signal: "Stepped 0.30→0.25 on a decelerating curve: the tally ran 594 BTC (first 25-minute sweep, Jul 30) → ~1,367 BTC/$89M (Aug 2–3) → ~1,816 BTC/$116M across 5,200+ addresses in four waves (TRM Labs/Galaxy, Aug 4 — now the third-largest crypto hack of 2026), but no comparable fifth wave has printed since patch week, and independent tallies ($111M–$130M) are converging rather than compounding. The root cause is fully characterized — a March 2021 Mk3 firmware bug cut effective key strength from 128 bits to as little as 40 — and the fix requires MIGRATION, not just patching, so the residual risk is the unmigrated pool. Crossing ~2,500 BTC would mean that pool is larger than assumed and the self-custody headline drag persists; a second vendor confirmed vulnerable (a small share of this row's weight) would convert an incident into a category crisis. The curve flattening through mid-August scores this MISS — the contained outcome.",
    },
  ],
  contrarianTake: {
    probability: 0.25,
    plain: "The other side: the weak jobs numbers that helped Bitcoin this week may be the start of a real economic slowdown — and in a slowdown, investors tend to dump risky assets like Bitcoin first, low interest rates or not.",
    body: "The serious contrarian re-grounds this week, because the old bear lost two of its named legs in one morning — the September hike is off the table and the flows restarted, both of which its own invalidation list flagged. What survives is sharper: the jobs report that saved Bitcoin is a recession tell, not a green light. Payrolls posting their first outright DECLINE, 103,000 of downward revisions, participation falling, wage growth at five-year lows — that is a labor market rolling over, and rate relief born of economic weakness has historically been a trap for risk assets: the easing trade works until the growth scare overtakes it. Bitcoin's own 2026 tape argues it sits on the wrong side of that rotation — all year it has fallen WITH equities and the AI complex on risk-off days (the opportunity-cost pattern in our ledger), and this very week the pure hedge asset, gold, surged to a seven-week high while Bitcoin merely reclaimed its August range: in a genuine slowdown the hedge bid chooses gold, and Bitcoin trades as high-beta risk. Add the leg the bear already won — the biggest corporate holder is a confirmed serial below-cost seller with the junior cohort liquidating — plus Bitcoin's worst seasonal month, and the resolution shape is a range that breaks DOWN on growth fear even as hike odds stay low, with the base case's rate-gate logic looking backward the whole way. Priced at 0.25, down from 0.30: this is a coherent regime-rotation read with real evidence, but price, flows, and the deleveraged book all argue against it right now — it needs a soft-data print that markets SELL to come alive.",
  },
  themeInteractions: {
    regime: "reinforcing",
    pairs: [
      { themes: ["clarity-act", "etfs"], delta: 0.08, direction: "reinforcing" },
      { themes: ["clarity-act", "corporate-treasuries"], delta: 0.10, direction: "reinforcing" },
      { themes: ["clarity-act", "fed-monetary-policy"], delta: 0.04, direction: "reinforcing" },
      { themes: ["clarity-act", "protocol-security"], delta: 0.03, direction: "reinforcing" },
      { themes: ["etfs", "corporate-treasuries"], delta: 0.10, direction: "reinforcing" },
      { themes: ["etfs", "fed-monetary-policy"], delta: 0.10, direction: "reinforcing" },
      { themes: ["etfs", "protocol-security"], delta: -0.02, direction: "contradicting" },
      { themes: ["corporate-treasuries", "fed-monetary-policy"], delta: 0.07, direction: "reinforcing" },
      { themes: ["corporate-treasuries", "protocol-security"], delta: 0.04, direction: "reinforcing" },
      { themes: ["fed-monetary-policy", "protocol-security"], delta: 0.00, direction: "reinforcing" },
    ],
    adjustments: [
      {
        theme: "etfs",
        draftProbability: 0.60,
        netDelta: 0.08,
        finalProbability: 0.70,
        reasoning: "REGIME HELD REINFORCING; contagion 1 of 3: (1) no outflow streak — the tape is an INFLOW streak (four straight days, ~$750M); (2) no cascade; (3) downward corporate spillover still active (serial seller + DAT unwind) — one condition of three. Standalone stepped UP 0.40→0.60 on the confirmed restart: strongest week since mid-July, sustain row repriced 0.25→0.65, September hold expected. Concentration caveat stands (IBIT ~80% of the intake; GBTC bleeding). Nudges: clarity (p=0.25) +0.08×0.25=+0.020; corporate (p=0.25) +0.10×0.25=+0.025; fed (p=0.55) +0.10×0.55=+0.055; protocol (p=0.80) −0.02×0.80=−0.016. Sum +0.084 → 0.60+0.08=0.68 → 0.70 (rounded). The directly-judged THESIS-004 = 0.60 remains the load-bearing forecast.",
      },
      {
        theme: "fed-monetary-policy",
        draftProbability: 0.55,
        netDelta: 0.09,
        finalProbability: 0.65,
        reasoning: "Standalone stepped UP 0.30→0.55 — the week's decisive move: the jobs report (−23K, −103K revisions, coolest wages since May 2021) flipped September from a two-in-three hike to an expected hold within hours, and oil's $101→$79 slide removed the energy channel the July FOMC statement itself blamed. The macro watch row restated 0.25→0.60 (jobs leg landed; CPI leg remains — the tariff pass-through is the one live counter-input). Not higher than 0.55: the July precedent (relief repossessed in 10 days) says the repricing isn't sticky until the CPI ratifies it. Nudges: etfs (p=0.60) +0.10×0.60=+0.060; corporate (p=0.25) +0.07×0.25=+0.0175; clarity (p=0.25) +0.04×0.25=+0.010; protocol 0.00. Sum +0.0875 → 0.55+0.09=0.64 → 0.65 (rounded).",
      },
      {
        theme: "corporate-treasuries",
        draftProbability: 0.25,
        netDelta: 0.15,
        finalProbability: 0.40,
        reasoning: "Standalone HELD 0.25 — no new filing this week; the pillar stays where the Aug 3 8-K left it (six no-buy filings, two below-cost sale cycles, DAT unwind), and Monday's filing under an opening rate gate is the doctrine test. Nudges: etfs (p=0.60) +0.10×0.60=+0.060; clarity (p=0.25) +0.10×0.25=+0.025; fed (p=0.55) +0.07×0.55=+0.0385; protocol (p=0.80) +0.04×0.80=+0.032. Sum +0.1555 → CLAMPED to +0.15 → 0.25+0.15=0.40. Note the clamp fired — the reinforcing cluster is pulling hard on a standalone the evidence keeps pinned low; the standalone 0.25 is load-bearing, and the third-sale watch (0.40) is the real forecast on this theme.",
      },
      {
        theme: "clarity-act",
        draftProbability: 0.25,
        netDelta: 0.12,
        finalProbability: 0.35,
        reasoning: "Non-cluster theme — reinforcing rule throughout. Standalone HELD 0.25 (the September-cloture row): the pre-recess endgame row resolved MISS (no petition, no vote — Brier 0.09 against our 0.30), and the September setup improved structurally (floor cleared by the CR through Dec 11; 'queued up first thing'; vote possible Sep 15–16) while the vote math stayed unproven (~7 Dems short; markets ~13% for enactment). Held, not raised: the offsets are real on both sides. Nudges: etfs (p=0.60) +0.08×0.60=+0.048; corporate (p=0.25) +0.10×0.25=+0.025; fed (p=0.55) +0.04×0.55=+0.022; protocol (p=0.80) +0.03×0.80=+0.024. Sum +0.119 → 0.25+0.12=0.37 → 0.35 (rounded). The standalone 0.25 is load-bearing.",
      },
      {
        theme: "protocol-security",
        draftProbability: 0.80,
        netDelta: 0.01,
        finalProbability: 0.80,
        reasoning: "Standalone HELD 0.80 (containment): the flag-day row resolved as priced (lock-in MISS at 0.10 — under 1% signaling; Brier 0.01, the ledger's first protocol resolution), and the Coldcard drain curve is decelerating post-patch ($89M → $116M, then flattening; containment watch stepped 0.30→0.25). Residual tails: the mandatory-window/eCash split noise (new row, 0.10) and a second vulnerable vendor. Nudges: clarity (p=0.25) +0.03×0.25=+0.0075; etfs (p=0.60) −0.02×0.60=−0.012; corporate (p=0.25) +0.04×0.25=+0.010; fed 0.00. Sum +0.0055 → 0.80+0.01=0.81 → 0.80 (rounded). The protocol→etfs sign-flip question for SECURITY incidents stays FLAGGED — no flow-level custody-mix datapoint arrived this week (the restart is rate-attributable), so the −0.02 stands unchanged for now.",
      },
    ],
  },
  calibration: {
    aggregateBrier: 0.18,
    nResolved: 21,
    briefSummary: "21 predictions scored; our accuracy score (Brier — lower is better) improved from 0.19 to 0.18 on two clean resolutions this week. We gave the pre-recess crypto-bill vote a 30% chance — it didn't happen — and the Bitcoin fork's activation just 10% — it fizzled on schedule. Standing lesson, applied twice this week: price what institutions actually do (filings, floor schedules) over what their leaders say.",
  },
  sources: [
    { label: "BLS — Employment Situation, July 2026: payrolls fall 23,000, unemployment 4.1% (Aug 7)", url: "https://www.bls.gov/news.release/archives/empsit_08072026.htm" },
    { label: "Cointelegraph — Bitcoin tags $65,340 August high as weak jobs numbers flip Fed rate bets from hike to hold (Aug 7)", url: "https://cointelegraph.com/markets/bitcoin-price-tags-653k-august-high-as-low-us-jobs-numbers-cool-fed-rate-bets" },
    { label: "Crypto Briefing — BlackRock's Bitcoin ETF pulls in $604M across four straight days of inflows (Aug 6)", url: "https://cryptobriefing.com/blackrock-ibit-bitcoin-etf-604m-inflows/" },
    { label: "CoinDesk — Senate won't vote on crypto Clarity Act before its summer break (Aug 6)", url: "https://www.coindesk.com/policy/2026/08/06/senate-won-t-vote-on-crypto-clarity-act-before-its-summer-break" },
    { label: "NBC News — Senate leaders reach a deal to avert a shutdown before the midterm elections (funding through Dec 11)", url: "https://www.nbcnews.com/politics/congress/senate-leaders-reach-deal-avert-shutdown-2026-elections-rcna590564" },
    { label: "The National — Oil slumps on a potential US–Iran deal to open the Strait of Hormuz (Aug 3)", url: "https://www.thenationalnews.com/business/energy/2026/08/03/oil-prices-slump-on-potential-us-iran-deal-to-open-strait-of-hormuz/" },
    { label: "Kitco — Gold and silver rally as yields fall after the surprise jobs loss (Aug 7)", url: "https://www.kitco.com/news/article/2026-08-07/gold-silver-rally-yields-fall-after-surprise-jobs-loss-kitco-am-report" },
    { label: "TRM Labs — Inside the $116M Coldcard hack, the largest hardware-wallet exploit of 2026 (Aug 4)", url: "https://www.trmlabs.com/resources/blog/the-largest-hardware-wallet-exploit-of-2026-inside-the-usd-116-million-coldcard-hack" },
    { label: "Coinkite — Coldcard Mk3 seed-generation security advisory and patched firmware (Aug 1)", url: "https://blog.coinkite.com/coldcard-mk3-seed-generation-warning/" },
    { label: "Bitcoin.com News — BIP-110 reaches its August flag day with only ~5 EH/s signaling", url: "https://news.bitcoin.com/bip-110-pushes-bitcoin-toward-august-fork-deadline-with-only-5-eh-s-signaling/" },
    { label: "Federal Reserve — FOMC statement: the 9–3 hold with three dissents for a hike (July 29, background)", url: "https://www.federalreserve.gov/newsevents/pressreleases/monetary20260729a.htm" },
  ],
};
