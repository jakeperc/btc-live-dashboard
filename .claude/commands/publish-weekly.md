---
description: Monday publisher — runs /refresh-all, verifies build + tests, commits the refresh on master, pushes, and watches the GitHub Pages deploy to bitcoin.jakepercy.com. Scheduled Mon 06:00 ET; safe to run by hand.
---

You are the **Publisher** for the BTC Live Dashboard. You run unattended on Monday morning, so never stop to ask a question: either finish and push, or stop before the push and write down why. The full playbook is `automations/publish-weekly/README.md` — read it first.

Argument (optional): `$ARGUMENTS` is forwarded verbatim to `/refresh-all` as its hint (for example a mid-week force-run reason). Empty on the scheduled run.

## Hard constraints

- Work only in this checkout on branch `master`. Never create a branch, never open a pull request, never force-push, never amend.
- Commit only `src/data/` and `automations/`. Never `git add -A` or `git add .`; never stage `dist/`, `node_modules/`, or anything under `src/` outside `src/data/`.
- Push only when `npm run build` succeeded, `/refresh-all` did not end on a plain-language exit 3 that it could not restore, and `npm test` exits 0. Any other outcome: no push, write `automations/publish-weekly/last-run.md` leading with the failure, stop.
- Everything through `npm run` / `npm test`, never a bare `node scripts/...` (that needs a permission the unattended run does not have).

## Steps

1. **Preflight.** `git rev-parse --abbrev-ref HEAD` must be `master`. `git status --porcelain` must list nothing except, at most, `automations/publish-weekly/last-run.md` (last week's run record, written after last week's commit; it is committed with this week's refresh). If anything else is modified or staged, stop and report it in `last-run.md`; a half-finished edit is never committed by the robot. `git fetch origin` then `git pull --ff-only origin master`; a non-fast-forward is a stop.
2. **Refresh.** Invoke the `refresh-all` skill with `$ARGUMENTS`. It runs the cadence gate, the agents, the Editor, the single `npm run build`, and updates `automations/refresh-all/run-manifest.json`. Keep its unified report; it goes into `last-run.md`.
3. **Nothing changed?** If `git status --porcelain src/data automations` is empty after the refresh (every gate closed), write `last-run.md` saying so and stop. Nothing to publish.
4. **Verify.** `npm test` (schema gate, glossary matcher, llms.txt check). Exit 0 or stop.
5. **Commit.** Stage with `git add src/data automations`. Subject in the standing form — read the values from the data files, do not invent them:
   `Weekly refresh (<MMM D from DEEP_ANALYSIS.asOf>): <market theme in a few lowercase words>; thesis <DEEP_ANALYSIS.primaryAnalysis.thesisProbability>, Brier <FORECAST_LEDGER.summary.aggregateBrier> over <FORECAST_LEDGER.summary.nResolved>`
   Body: three to six lines of what changed per agent (from the refresh report), then the attribution line the session gives you (`Co-Authored-By: ...`).
6. **Push.** `git push origin master`.
7. **Watch the deploy.** `gh run list --workflow pages.yml --limit 1 --json databaseId,status,conclusion,url`, then `gh run watch <id> --exit-status` (give it up to 15 minutes). Then `curl -sI https://bitcoin.jakepercy.com/` and record `Last-Modified`. A failed workflow is reported, not retried: the previous deploy is still live.
8. **Record.** Write `automations/publish-weekly/last-run.md`: timestamp, commit hash, deploy run URL and conclusion, `Last-Modified`, then the refresh report. It is written after this run's commit, so it rides along with the *next* run's commit; the preflight in step 1 tolerates it for that reason.

Report in one message: pushed or not (and why not), commit subject, deploy conclusion, site `Last-Modified`, and the refresh summary.
