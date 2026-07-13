// Beginner explainer data — owner: dashboard structural feature (NOT a refresh skill).
// This is intentionally EVERGREEN: it explains the general mechanics of a Bitcoin
// sell-off in plain English, so it never goes stale and needs no cadence upkeep.
// Anything time-specific ("what's driving it right now") is read live in the
// component from existing data (24h price move + MARKET_THEME) — never hardcoded here.
//
// Plain-English voice for someone learning from scratch. No jargon without a glossary
// term. No dated facts. No "buy/sell" advice.

export const DIP_EXPLAINER = {
  title: "Why does Bitcoin fall like this?",
  intro:
    "Sharp drops are normal in Bitcoin's history — it has fallen 50% or more several times and still gone on to new highs. A big move down is rarely one thing; it's usually a few of these happening at once and feeding each other. Here's what's behind them, in plain English.",
  drivers: [
    {
      name: "Money leaving Bitcoin funds",
      term: "etf",
      plain:
        "Most big investors now buy Bitcoin through stock-market funds (ETFs) instead of holding coins directly. When lots of them cash out at once, the fund has to sell real Bitcoin to pay them back — and that selling pushes the price down.",
    },
    {
      name: "Borrowed-money bets getting wiped out",
      term: "liquidation",
      plain:
        "Many traders bet on Bitcoin using borrowed money. If the price falls past a certain point, the exchange automatically sells their position to get its loan back. One wave of these forced sales pushes the price lower, which triggers the next wave — a fast snowball.",
    },
    {
      name: "Higher interest rates",
      plain:
        "When safe places like savings accounts and government bonds pay good interest, a risky asset that pays none has to compete harder for people's money. So when central banks keep rates high, some money rotates out of Bitcoin and into 'boring and safe.'",
    },
    {
      name: "Scary world headlines",
      plain:
        "Wars, oil shocks, and economic fear make investors want to hold cash and sell their riskiest things first. Bitcoin is often near the top of that 'sell when nervous' list, so global bad news tends to hit it quickly.",
    },
    {
      name: "Big holders selling",
      term: "distribution",
      plain:
        "When a large, well-known holder sells — even a small amount — it can rattle everyone else. The sale itself may be tiny; it's the signal that 'even they are selling' that moves the mood.",
    },
  ],
  perspective: {
    heading: "Why long-term holders usually sit still",
    body: [
      "Forced selling burns itself out. A borrowed-money bet can only be wiped out once — so once the over-leveraged crowd is flushed out, that particular source of selling is simply gone.",
      "History rhymes. In May 2021 Bitcoin fell about 53% in a near-identical panic — forced selling, scary headlines, 'this time it's different' — and went on to new highs within months. It doesn't always play out that way, which is exactly why this dashboard tracks what would prove the calm case wrong (see the Analysis tab).",
      "Patience is the whole game. The hardest and most rewarding skill in money is judging an asset by where it's headed over years, not how it feels this week. Panic-selling into a forced-selling wave is how short-term fear turns a paper dip into a permanent loss.",
    ],
  },
};
