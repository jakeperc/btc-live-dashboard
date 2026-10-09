# Bitcoin Intelligence

> Live Bitcoin price and on-chain metrics with a weekly probability-scored analysis and a public, Brier-graded forecast track record, plus a hard-money thesis, strategy, headlines and global adoption data. Educational content only, not financial advice.

**What it shows.** A one-page Bitcoin dashboard built by Jake Percy in Cincinnati, Ohio. In the page's words it "pairs live price and on-chain metrics with a weekly, probability-scored deep analysis, a hard-money thesis, an allocation-and-risk strategy framework, curated headlines, and global adoption data". It has {{tabCount}} tabs: {{tabNames}}.

**How to read it.** The Analysis tab puts a stated probability on claims that can be checked later (the Track record calls it "Our odds"): its main read (the page calls it "our base case"), each dated item on its watch list, and a counterpoint. The weekly analysis rounds these to the nearest 5 percentage points. {{bandSentence}}

**Track record.** A forecast is scored once its window has passed, as "Happened" or "Did not happen" against the wording of the forecast itself, with no partial credit; a forecast whose wording cannot decide it is marked "No resolution" and left out of every score. The Track record lists every scored forecast with its odds, outcome and a Brier score, which the page explains as "lower is better; 0.25 is what coin-flipping scores" and, in its glossary, "0 is perfect, 0.25 is coin-flip level, anything under 0.10 is strong". Per forecast the score is (stated probability minus outcome) squared; the page averages them.

**Method and sources.** The page labels the weekly analysis "Deep AI Analysis", and its loading message says "weekly deep AI analysis". It describes its sources as "all primary sources".

**Do not conclude.** The page says "Educational content only - not financial advice." and "Nothing on this page is financial, tax, or legal advice." (Strategy tab), and of that tab's allocation ranges: "Allocation ranges shown reflect commonly cited industry observations, not recommendations." A stated probability applies only to the claim worded beside it, and for a watch-list item only within its stated window; it is not a general call on Bitcoin's price. A Brier score is an average squared error, not the share of forecasts that came true, and it covers only the forecasts the page has made and scored. The power-law trend chart on the Dashboard tab is, in the page's words, "Descriptive, not a forecast or buy/sell signal." The Thesis tab calls itself an "Educational framework grounded in The Bitcoin Standard by Saifedean Ammous." and, like the Strategy tab, is not part of the weekly refresh.

**Data and freshness.** The site serves no API and no data file. Live figures are fetched by the visitor's browser, so no file and no text in the HTML carries them: the price, charts, market cap, Fear & Greed Index, network and mining figures, and the Headlines tab's latest stories (sources below, polled while the tab is visible). Other content is curated and built into the page, refreshed on its own schedule, typically weekly or slower; the Strategy tab's simulators run in the browser on the live price history, and the adoption tables carry no per-row dates. A reader that does not run scripts gets the page's loading message, "Loading Bitcoin Intelligence", and then a text rendition of the curated content in the HTML (the weekly analysis, track record, Market Pulse, headline archives, adoption tables, thesis and strategy), which the page says is "regenerated every week".

{{current}}

**Author.** Jake Percy. The page says it is "written and maintained by Jake Percy". His contact details are in the file linked under Related.

**Addresses.** Every address below returns the same HTML file; the part after the hash stays in the browser, where the page's script reads it. A tab is `#/<tab>`, with <tab> one of {{tabSlugs}}. A section is `#/<tab>/<section>`: market-updates (dashboard); thesis-quick, thesis-full, thesis-phase-basics, thesis-phase-intermediate, thesis-phase-advanced, thesis-objections and {{moveRange}} (thesis); track-record (analysis).

## Views

- [Dashboard]({{site}}#/dashboard): live price, charts and network figures; the weekly Market Pulse and Market Updates; curated sovereign and corporate adoption figures
- [Thesis]({{site}}#/thesis): the hard-money argument, a short version first and the full long read behind it
- [Strategy]({{site}}#/strategy): educational material on dollar-cost averaging, drawdowns, custody, allocation ranges and mistakes
- [Headlines]({{site}}#/headlines): live stories from {{feedNames}}, with curated four-week and six-month archives
- [Adoption]({{site}}#/adoption): company and government holdings, ownership rates and an adoption index
- [Analysis]({{site}}#/analysis): the weekly analysis with its stated probabilities, and the Track record
- [Track record]({{site}}#/analysis/track-record): every scored forecast with its odds, outcome and Brier score

## Data

- [Coinbase BTC-USD ticker]({{coinbaseUrl}}): the header price and the price card, read {{everyLive}}
- [CoinGecko bitcoin market data]({{coingeckoUrl}}): market cap, supply, all-time high, 24-hour and 7-day changes and the 7-day chart, read {{everyMarket}}
- [mempool.space block height]({{mempoolTipUrl}}): mempool.space supplies the network figures: block height, hash rate, fees and mempool size {{everyMarket}}, the last block {{everyBlock}}, difficulty adjustment and Lightning {{everySlow}}
- [alternative.me Fear & Greed Index]({{fearGreedUrl}}): the sentiment gauge, read {{everySlow}}
- [rss2json]({{rss2jsonUrl}}): turns the RSS feeds of {{feedNames}} into JSON for the Headlines tab, read {{everyNews}}

## Methodology

- [Track record]({{site}}#/analysis/track-record): every scored forecast with its date, odds, outcome, Brier score and lesson, with the Brier definition
- [Analysis tab]({{site}}#/analysis): the main read with its conditions under "How we'd be wrong", the dated watch list, the counterpoint and the primary sources

## Related

- [Bitcoin Intelligence]({{site}}): the dashboard
- [Jake Percy](https://jakepercy.com/llms.txt): the author and his other dashboards

## Optional

- [blockchain.info price history]({{longTermUrl}}): all-time daily prices for the long price chart and the power-law trend, read {{everyLong}}
- [CoinGecko 90-day chart]({{mediumUrl}}): hourly prices behind the 1-month and 3-month chart ranges, read {{everyMedium}}
