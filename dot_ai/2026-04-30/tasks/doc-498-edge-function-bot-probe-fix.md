# DOC-498: Edge function rewrite-framer-urls 500s on bot probes with leading //

- **Linear**: https://linear.app/nxdev/issue/DOC-498
- **Branch**: `doc-498-edge-function-bot-probe-fix`
- **Worktree**: `/Users/jack/projects/nx-worktrees/DOC-498`
- **Commit**: `62a48ca6e7`
- **PR**: https://github.com/nrwl/nx/pull/35527

## Problem

Netlify edge function logs flooded with `TypeError: error sending request for url (https://wp/wp-includes/wlwmanifest.xml): dns error: failed to lookup address information`. Same shape across `wp`, `wp2`, `wordpress`, `blog`, `shop`, `cms`, `test`, `xmlrpc.php`. Each bot probe causes `rewrite-framer-urls.ts` to throw → function 500s.

## Root cause

`rewrite-framer-urls.ts:205`:

```ts
const framerDestination = new URL(pathname, framerUrl);
```

Bot scanners send paths with a leading `//` like `GET //wp/wp-includes/wlwmanifest.xml`. `new URL("//wp/...", "https://framer.app")` treats `//wp/...` as a **protocol-relative URL** — `wp` becomes the host, not part of the path. Result: fetch goes to `https://wp/wp-includes/wlwmanifest.xml`, DNS fails, function throws.

Confirmed via curl with `--path-as-is`:

```
curl --path-as-is 'https://nx.dev//blog/wp-includes/wlwmanifest.xml'  # → 500
curl --path-as-is 'https://nx.dev//wp/wp-includes/wlwmanifest.xml'    # → 500
```

## Fix

Two-line change at top of `handler()`:

1. Collapse leading `/+` to `/` so protocol-relative hijack is impossible:

   ```ts
   const pathname = url.pathname.replace(/^\/+/, '/');
   ```

2. Short-circuit common WordPress / exploit probes with 404 (skip the upstream fetch entirely):

   ```ts
   const botProbeRegex =
     /(wp-(includes|admin|content)|xmlrpc\.php|wlwmanifest|\.env|\.git\/)/i;
   if (botProbeRegex.test(pathname)) return new Response(null, { status: 404 });
   ```

Net diff: 14 insertions, 1 deletion in `netlify/edge-functions/rewrite-framer-urls.ts`.

## Validation

- `deno check` clean.
- Reproduced bug on prod with `--path-as-is`.
- Preview verification commands (once Netlify builds PR #35527):

  ```bash
  PREVIEW=https://deploy-preview-35527--nxdev.netlify.app
  curl -sS -o /dev/null -w "%{http_code}\n" --path-as-is "$PREVIEW//blog/wp-includes/wlwmanifest.xml"  # expect 404
  curl -sS -o /dev/null -w "%{http_code}\n" --path-as-is "$PREVIEW//wp/wp-includes/wlwmanifest.xml"    # expect 404
  curl -sS -o /dev/null -w "%{http_code}\n" "$PREVIEW/"                                                # expect 200
  ```

## Follow-up

User flagged separately: when Framer upstream itself flakes (`connection reset`, `peer closed connection without sending TLS close_notify`, `Connection refused`), serve a static branded 500/503 page instead of letting Netlify default-error. Not in this PR — separate issue when prioritized.
