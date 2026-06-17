---
name: readme-demo-injector
description: Save a live third-party page (GitHub repo page, npmx/npm package page, docs site) as a local static copy and inject an element into it (badge, banner, widget) for demos without shipping to prod. Use when user wants to "demo X on the GitHub README", "inject the badge into a real page", "make this page work locally", "mock up how it looks on npmjs/github", or "download and serve this page with my change". Output is a directory servable with `npx serve`.
---

# README Demo Injector

Capture a real page, inject a local element (badge/banner/widget), serve statically. Lets Jack demo a feature on github.com/nrwl/nx or a package page without deploying.

## Process

### 1. Capture the page

Pick capture method by host + rendering model:

- **curl** (only if host is in the sandbox network allowlist, e.g. github.com): `curl -sL <url> -o <dir>/index.html`. CHECK the target element exists in static HTML before trusting this (see gotcha 1).
- **Playwright hydrated-DOM capture** (default for SPA/blocked hosts):
  1. Start a save-server (POST body -> file) on 127.0.0.1:
     ```python
     # save-server.py: BaseHTTPRequestHandler, do_POST writes body to /tmp/<name>.html,
     # respond 200 with Access-Control-Allow-Origin: *
     ```
  2. Navigate with playwright MCP, wait for hydration.
  3. Capture, choosing transport by page CSP:
     - Page CSP allows `connect-src 127.0.0.1` (npmx.dev does): `browser_evaluate` -> `fetch('http://127.0.0.1:PORT/name', {method:'POST', body: '<!doctype html>\n' + document.documentElement.outerHTML})`
     - Page CSP blocks localhost (github.com does): `browser_run_code_unsafe` -> get outerHTML via `page.evaluate`, then `page.request.post(...)` — Playwright's request context bypasses page CSP. (`require`/`import('fs')` are NOT available in that VM; POST is the only file transport.)
  - NEVER return the full HTML as the tool result (hundreds of KB floods context). Always POST to the save-server.

### 2. Sanitize (python script written to a FILE — fish mangles `!=` in heredocs/inline)

In order:
1. Insert `<base href="https://<origin>/">` right after `<head>` so relative assets/links resolve to the real origin.
2. Strip CSP meta tags: `re.sub(r'<meta[^>]*Content-Security-Policy[^>]*>', '', s)` — saved-page CSP blocks cross-origin styles AND the injected element (`upgrade-insecure-requests` also rewrites http localhost img URLs to https).
3. Strip ALL scripts: `re.sub(r'<script\b[^>]*>.*?</script>', '', s, flags=re.S)` + modulepreload/preload links. React/Nuxt hydration re-renders and DROPS injected nodes (timing-dependent — may look fine once then vanish). CSS `<link>`s stay; page remains styled.
4. STRIP SCRIPTS BEFORE INJECTING — otherwise the injection can land inside a script JSON payload and get stripped with it.

### 3. Inject

- Find anchor point in the static markup (e.g. README badge row: locate `alt="License"` img, insert after its closing `</a>`).
- Assert the injected marker survives in the final file (`assert 'alt="..."' in s`).
- For GitHub README rows match shields style: `?style=for-the-badge` (28px uppercase); npm-ish pages use flat/flat-square (20px).

### 4. Serve + verify

- `npx serve <dir>` (or `python3 -m http.server`).
- Screenshot via playwright; check the injected `<img>` has `naturalWidth > 0` (0 = blocked/broken, e.g. CORP).
- If the injected resource comes from another local app: that app must send `Cross-Origin-Resource-Policy: cross-origin` (helmet defaults to same-origin -> `ERR_BLOCKED_BY_RESPONSE.NotSameOrigin`).

## Gotchas recap

- Static curl of github.com keeps the README only in script payloads; the rendered `<article>` needs hydrated-DOM capture.
- Multiple inline SVGs on one preview page collide on duplicate ids (clipPath) — embed via `<img>` tags instead.
- file:// is blocked for playwright MCP — always serve over http.
- Playwright MCP screenshots only write inside its allowed roots (cwd / .playwright-mcp) — clean up artifacts from the repo afterwards.
