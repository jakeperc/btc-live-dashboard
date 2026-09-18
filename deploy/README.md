# Deploy extras

## What gets deployed

`npm run build` (`node scripts/build.mjs`) produces a **split** build:

```
dist/
  index.html                 ← the page: no-cache, rebuilt weekly
  assets/
    index-<hash>.js          ← shell + Dashboard tab (eager)
    vendor-react-<hash>.js   ← react, react-dom, scheduler
    vendor-charts-<hash>.js  ← recharts + its d3 / lodash dependencies
    ThesisTab-<hash>.js      ← one lazy chunk per remaining tab, fetched on
    StrategyTab-<hash>.js       first visit to that tab
    HeadlinesTab-<hash>.js
    AdoptionTab-<hash>.js
    AnalysisTab-<hash>.js
    index-<hash>.css         ← already inlined into index.html; harmless if uploaded
```

**Upload the whole `dist/` folder** — `index.html` and the `assets/` directory
side by side — to `jakepercy.com/bitcoin/`. The page references its chunks by
relative path (`./assets/…`), so it works from any folder and needs no server
rewrites: every route is a hash route (`#/thesis`, `#/analysis/track-record`)
on the same `index.html`.

### Why the split, and what it means for caching

Every file in `assets/` has a **content hash in its name**. When a weekly
refresh changes the Analysis tab, only `AnalysisTab-<newhash>.js` (and
`index.html`, which points at it) change; `vendor-react-…` and
`vendor-charts-…` keep their names and stay cached. So:

- `index.html` is served with `Cache-Control: no-cache` — browsers revalidate
  it on every visit (a ~1 kB `304 Not Modified` when unchanged) and always see
  the Monday rebuild immediately.
- Hashed `.js` / `.css` files are served with
  `Cache-Control: public, max-age=31536000, immutable` — a year, and the
  browser will not even revalidate. Safe by construction: a changed file gets a
  new name, and a fresh `index.html` never references an old one.

Both rules live in `deploy/.htaccess` (below). Old chunk files from previous
builds can be left on the server or deleted; nothing references them.

### Single-file fallback

If you can only upload one file, run:

```
npm run build:single
```

That produces a fully self-contained `dist/index.html` (CSS, JS and SEO
content inlined, no `assets/` folder) — the shape this project shipped before
the split build. Upload just that file. It is larger on every visit (nothing is
cached separately) and every tab loads up front, but it needs nothing else.

## `.htaccess` — cache rules (recommended)

The live host (jakepercy.com, Apache shared hosting) sends an `ETag` but no
`Cache-Control` header by default, so browsers guess how long to cache. The
`.htaccess` in this folder sets the two rules above and pins the `.js` MIME
type (some shared hosts serve it as `text/plain`, which browsers refuse to run
as a module).

### How to deploy

1. Upload `deploy/.htaccess` to the same directory as the deployed
   `index.html` (the `/bitcoin/` folder).
2. Verify:

   ```
   curl -sI https://jakepercy.com/bitcoin/ | grep -i cache-control
   curl -sI https://jakepercy.com/bitcoin/assets/vendor-react-<hash>.js | grep -i -e cache-control -e content-type
   ```

   The first should print `Cache-Control: no-cache`; the second
   `Cache-Control: public, max-age=31536000, immutable` and
   `Content-Type: application/javascript`. In browser DevTools → Network, a
   second load should show `index.html` as **304** and the chunks as
   **(memory cache)** / **(disk cache)**.

### Rollback

Delete the uploaded `.htaccess`. Behaviour returns to the host default
(heuristic caching). The split build still works without it — chunks are just
revalidated more often than they need to be.
