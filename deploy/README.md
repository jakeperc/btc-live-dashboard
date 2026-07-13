# Deploy extras

## `.htaccess` — enable cheap repeat visits (optional, recommended)

Both live hosts (jakepercy.com and nati-crypto.com, Apache shared hosting)
currently send an `ETag` but **no `Cache-Control` header**, so browsers guess
how long to cache the page. Uploading the `.htaccess` in this folder next to
the deployed `index.html` tells them to *revalidate on every visit*:

- Repeat visit while the page is unchanged → `304 Not Modified` (~1 kB)
  instead of re-downloading the full page (~216 kB Brotli).
- Visit right after a weekly rebuild → fresh page immediately, no stale cache.

### How to deploy

1. Upload `deploy/.htaccess` to the same directory as the deployed
   `index.html` on each host (the `/bitcoin/` folder).
2. Verify:

   ```
   curl -sI https://jakepercy.com/bitcoin/ | grep -i cache-control
   ```

   should print `Cache-Control: no-cache`. In browser DevTools → Network,
   a second load of the page should show status **304**.

### Rollback

Delete the uploaded `.htaccess`. Behavior returns to today's default
(heuristic caching).

## What gets deployed

`npm run build` regenerates both self-contained files:

- `dist/index.html` → upload to jakepercy.com/bitcoin/
- `dist/index.nati-crypto.html` → upload to nati-crypto.com/bitcoin/ (rename to `index.html` there)

Each file is fully self-contained (CSS + JS + SEO content inlined); no other
assets need uploading.
