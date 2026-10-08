# Actor: CFTC (Commodity Futures Trading Commission)

- **Slug:** `cftc`
- **Category:** Regulator
- **Role:** Would be Bitcoin's primary federal regulator (spot + derivatives) under CLARITY; with the bill blocked, the agency is building the same perimeter BY RULE under existing authority — the concrete actor of the `administrative-rulemaking-substitution` edge.
- **First tracked:** MAY 18, 2026 · **Archived:** JUN 28, 2026 · **RESTORED:** SEP 26, 2026 (trigger: a concrete rulemaking step — the pre-rule filed for White House review)
- **Last updated:** OCT 7, 2026

## Snapshot

- **OCT 7, 2026 — THE REVIEW CLOCK WAS 10 WORKING DAYS, NOT 90: THE AGENCY IS THE GATE NOW.** EO 12866 §6(b)(2): OIRA reviews "notices of inquiry, advance notices of proposed rulemaking, or other preliminary regulatory actions prior to a Notice of Proposed Rulemaking" within 10 working days (90 calendar days for proposed and final rules) — so the review of RIN 3038-AF80 (received Sep 17) ran ~Oct 1. No CFTC crypto document in the Federal Register Sep 17–Oct 7 (FR API search); Orrick (Oct 2): "not yet published". The Defiant: the only CFTC action pending White House review; Selig the agency's only sitting commissioner (verify on cftc.gov). Row restated 0.60→0.65 (ANPRM in the FR by Dec 31); instrument risk logged (a skip to an NPRM hits the 0.10 row instead). reginfo.gov's RIN page STILL not fetched directly. [EO 12866](https://www.archives.gov/files/federal-register/executive-orders/pdf/12866.pdf) · [FR search (CFTC, crypto)](https://www.federalregister.gov/documents/search?conditions%5Bagencies%5D%5B%5D=commodity-futures-trading-commission&conditions%5Bterm%5D=crypto) · [The Defiant](https://thedefiant.io/news/regulation/cftc-files-crypto-market-rulemaking-with-white-house-at-prerule-stage)
- **SEP 17–24, 2026 — THE PRE-RULE WENT TO OIRA TWO DAYS AFTER THE SENATE VOTE.** Per the OIRA EO 12866 docket (press-restated consistently by Yahoo Finance, NewsBTC, cryptotimes, cryptodaily — fetch `reginfo.gov` by RIN next run): **RIN 3038-AF80, "Regulation of Crypto Asset Transactions and Crypto Asset Markets", stage PRERULE (an advance notice, not an NPRM), received Sep 17.** Content (Selig's Aug 20 / Sep 16 / Sep 24 descriptions): a new "crypto asset market" registration category modeled on designated contract markets, letting unregistered venues offer leveraged / margined spot trading under CFTC oversight. Timeline: OIRA review ≤90 days (+30 possible) → Federal Register publication of the ANPRM (~Nov–Dec) → ~60-day comment → an NPRM in 2027 → a final rule late 2027 at the earliest. Sep 24: staff FAQ updates on registrants' crypto activities (PR 9303-26); Selig on CNBC: "it's go time." Sep 22: Selig keynote at the Treasury Market Conference (opaselig11 — not fetched). No press release announced the OIRA filing. **Ledger:** the NPRM-by-Dec-31 row restated 0.55→0.10 (wrong instrument); successor row = Federal Register publication of the ANPRM by Dec 31, 0.60. [CFTC PR 9303-26](https://www.cftc.gov/PressRoom/PressReleases/9303-26) · [Selig Aug 20](https://www.cftc.gov/PressRoom/SpeechesTestimony/opaselig10) · [Yahoo Finance — the OIRA filing](https://finance.yahoo.com/markets/crypto/articles/cftc-just-sent-crypto-rules-162414716.html)
- **AUG 20 – SEP 16, 2026 (condensed):** the Innovation Advisory Committee pledge (Aug 20: staff directed to propose rules if Congress fails — a "crypto asset market" DCM designation with margined trading); Sep 16, the day after cloture failed 49–50: "locked in and ready to ship its rules for the new frontier of finance."
- Standing: Bitcoin a commodity (CFTC v. McDonnell, 2018); budget ~10× smaller than the SEC's — the funding gap is the implementation risk of any spot-market perimeter.

## Causal links

- ← `themes/clarity-act.md` (legislative failure → agency weight: the clarity→policy +0.05 leg, now observed twice — Sep 16 pledge, Sep 17 filing)
- → `themes/us-crypto-policy.md` (the administrative track's second leg beside the SEC's Regulation Crypto Assets and the Sep 17 Innovation Exemption)
- → `themes/etfs.md` / `themes/corporate-treasuries.md` (a spot-market perimeter by rule = a partial, rescindable substitute for the statutory unlock)

## Open questions

1. RESOLVED in form (the 10-working-day review ran ~Oct 1). Now: does the Commission sign and publish the ANPRM before the Dec 11 CR lapse — or skip to an NPRM?
2. Is Selig the only sitting commissioner (a press claim) — and can a one-member Commission act alone on an ANPRM?
3. Funding: can the CFTC staff a spot-market regime without a new appropriation?
4. SEC–CFTC boundary for hybrid products — joint action or turf?

## Source priority for this actor

1. `cftc.gov` — press releases (index reachable this run), speeches (index reachable; individual pages not fetched).
2. `reginfo.gov` — the EO 12866 review docket (the RIN detail page STILL needs a direct fetch — carried TODO); `federalregister.gov`'s documents API for presence/absence; EO 12866's text (archives.gov) for the review clocks.
3. Chair testimony / TV appearances — verify quotes against a transcript.
4. Press is **mixed**; the OIRA filing was consistently restated across four outlets (RIN and date agree).
