# publish-weekly

Slash command: `/publish-weekly`. Scheduled: **every Monday 06:00 America/New_York** as a Claude desktop scheduled task (`btc-publish-weekly`), which runs this command in the project folder `C:\Users\jpercy\Projects\btc-live-dashboard`.

The Publisher turns the weekly refresh into a live page with nobody at the keyboard: run `/refresh-all`, verify, commit on `master`, push. `.github/workflows/pages.yml` then builds, tests and publishes `dist/` to bitcoin.jakepercy.com. The push *is* the deploy.

## What it owns

| Writes | Purpose |
|---|---|
| the weekly commit on `master` | `src/data/*.js` + `automations/**` as left by `/refresh-all` |
| `automations/publish-weekly/last-run.md` | the run record: pushed or not, commit, deploy run, site `Last-Modified`, the refresh report |

It edits no data itself. Everything in `SCOPE.md` § "Out of scope" stays out of scope; the Publisher only stages what the refresh agents wrote.

## Why direct to master

Until 2026-10-24 a refresh landed as a pull request Jake merged by hand, so a forgotten Monday meant a stale page. Jake asked for the page to update itself. The gates that matter still run: `npm run build` (schema + plain-language structural gate) and `npm test` locally before the push, then `npm ci`, build and `npm test` again inside `pages.yml` before anything is published. A refresh that breaks the build never reaches the site; the previous deploy stays up.

Hand-made code changes are a different thing and still go through a branch and pull request, checked by `ci.yml`.

## Workflow

0. **Read** `.claude/commands/publish-weekly.md` (the steps) and this file.
1. **Preflight** — on `master`, clean tree (ignored files excepted), `git pull --ff-only origin master`. A dirty tree or a non-fast-forward is a stop: the robot never commits a half-finished edit and never merges.
2. **Refresh** — `/refresh-all $ARGUMENTS`. Cadence gate, Phase 1 agents, deep-analysis, Editor, cold-read test, one `npm run build`, manifest update. Its rules are its own (`automations/refresh-all/README.md`).
3. **Nothing changed** — if `git status --porcelain src/data automations` is empty, record and stop.
4. **Verify** — `npm test` must exit 0.
5. **Commit** — `git add src/data automations`, subject in the standing form (see the command), body from the refresh report, attribution line.
6. **Push** — `git push origin master`.
7. **Watch** — `gh run list --workflow pages.yml --limit 1`, then `gh run watch <id> --exit-status`, then `curl -sI https://bitcoin.jakepercy.com/` for `Last-Modified`.
8. **Record** — write `last-run.md`.

## Stop conditions (no push)

| Condition | What happens |
|---|---|
| not on `master`, dirty tree, non-fast-forward pull | stop before the refresh; `last-run.md` says why |
| `/refresh-all` ended on plain-language exit 3 it could not restore, or `npm run build` failed | stop; last week's `dist/` and page stay live |
| `npm test` fails | stop; report the failing check |
| `pages.yml` fails after the push | reported, not retried; the previous deploy is still served, the commit is on `master` for Jake to look at |

Every stop writes `automations/publish-weekly/last-run.md` first. The desktop app also notifies the session that created the task when a run finishes.

## Running it by hand

`/publish-weekly` in a session opened on the project folder does exactly what Monday does. With a hint — `/publish-weekly SEC approved BTC options ETF` — the hint is forwarded to `/refresh-all` as a mid-week force-run, and force-runs do not bump the manifest (the Monday cadence survives).

## The scheduled task

- Created 2026-10-24 from the Claude desktop app (Code tab) with the scheduled-tasks tool; stored at `%USERPROFILE%\.claude\scheduled-tasks\btc-publish-weekly\SKILL.md`. Its prompt is one line: run `/publish-weekly`.
- Cron `0 6 * * 1`, local time; the app adds a few minutes of jitter.
- **It runs while the Claude desktop app is open.** If the app is closed at 06:00 Monday it runs at the next launch. That is the price of running on this machine with its GitHub login; a cloud routine would run regardless but would need its own push credentials and a cloud environment with the repository.
- To change the time or pause it: Claude desktop → scheduled tasks, or ask a session to `update_scheduled_task`.

## Common pitfalls

- **Permission prompts.** Nobody is there to click. Use `npm run ...` / `npm test`, never a bare `node scripts/...`; stage with the two-path `git add`, never `-A`. If a Monday run stalls on a prompt, the fix is a permission rule, not a wider command.
- **Committing `dist/`.** It is gitignored and built by `pages.yml`; never force-add it.
- **Retrying the deploy.** A failed `pages.yml` run leaves the previous page live. Report it; do not push again to "kick" it.
- **Running in the OneDrive copy.** The project left OneDrive on 2026-10-23. The legacy folder has no remote; a refresh there reaches nobody.
