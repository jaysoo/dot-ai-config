# Nrwl Repos Security Audit — 2026-05-30

Audited repos: **nrwl/nx**, **nrwl/ocean**, **nrwl/nx-labs**, **nrwl/nx-console**  
Scope: Unpatched HIGH (CVSS ≥ 7.0) and CRITICAL (CVSS ≥ 9.0) CVEs in direct and notable transitive dependencies, plus published @nx/* npm packages.  
Exclusions: S1ngularity supply-chain incident (Aug 2025, postmortemed), Nx Console 18.95.0 incident (May 2026, resolved).

Sources: NVD, Snyk advisory DB, GitHub Advisory Database, npm registry, Next.js/Vite/Storybook security blogs.

---

## Summary of Actionable Findings

| # | Severity | CVE | Package / Version | Affected Repo | Fixed Version | Action |
|---|----------|-----|-------------------|---------------|---------------|---------|
| 1 | **CRITICAL 9.2** | CVE-2026-6951 | `simple-git ^3.32.3` (lockfile likely <3.36.0) | nrwl/ocean | 3.36.0 | Bump constraint to `^3.36.0`, update lockfile |
| 2 | **HIGH 8.9** | CVE-2026-27148 | `storybook 10.2.9` | nrwl/nx-labs | 10.2.10 | Bump to `storybook@10.2.10` |
| 3 | **HIGH 8.2** | CVE-2026-39363 | `vite 8.0.0` | nrwl/nx | 8.0.5 | Bump to `vite@8.0.5` |
| 4 | **HIGH 8.1** | CVE-2026-41907 | `uuid ^3.3.3` | nrwl/ocean | 11.1.1 | Upgrade to `uuid@11.1.1`; review API compat |
| 5 | **HIGH 7.5** | CVE-2022-37603 | `loader-utils 2.0.3` | nrwl/nx | 2.0.4 | Bump to `loader-utils@2.0.4` |

---

## Finding 1 — CRITICAL

**CVE-2026-6951**  
**CVSS:** 9.2 (Critical) · CWE-94 Code Injection  
**Affected package:** `simple-git`  
**Affected version range:** `< 3.36.0`  
**Fixed version:** `3.36.0`  
**Affected repo:** nrwl/ocean (production dependency)

### Description

An incomplete fix for CVE-2022-25912 blocked the `-c` git flag but not its long-form equivalent `--config`. An attacker who can supply untrusted input to the `options` argument of any simple-git command can set `protocol.ext.allow=always` via the `--config` form and then use an `ext::` clone source to achieve arbitrary command execution on the host.

**Attack prerequisite:** Attacker-controlled input reaches a `simple-git` call (e.g., a user-supplied repository URL or branch name). In a platform like Ocean that orchestrates CI runs against user repos, this is a realistic attack surface.

### Status in nrwl/ocean

The package.json constraint is `"simple-git": "^3.32.3"`. This is `>= 3.32.3 < 4.0.0`. The constraint floor (3.32.3) is the fix for the earlier CVE-2026-28292 but is **below** the 3.36.0 threshold needed to patch CVE-2026-6951. If the pnpm lockfile was last frozen before 3.36.0 was published (April 25, 2026), the installed version is likely in the 3.32.x–3.35.x range and is **vulnerable**.

### Required change

```json
// ocean/package.json — production dependencies
"simple-git": "^3.36.0"  // was: "^3.32.3"
```

Then run `pnpm install` (or `pnpm update simple-git`) to update the lockfile.

---

## Finding 2 — HIGH

**CVE-2026-27148**  
**CVSS:** 8.9 (High)  
**Affected package:** `storybook`  
**Affected version range:** `>= 8.1.0 < 10.2.10`  
**Fixed version:** `10.2.10`  
**Affected repo:** nrwl/nx-labs (devDependency)

### Description

The Storybook dev server WebSocket does not validate the `Origin` header. Any page visited by a developer while `storybook dev` is running can open a WebSocket connection to `ws://localhost:6006` and inject arbitrary code into story files on disk (cross-site WebSocket hijacking leading to local file write / RCE). Disclosed February 2026, patched in 10.2.10 (released February 25, 2026).

**Attack prerequisite:** Developer has Storybook dev server running and visits a malicious webpage (phishing, drive-by). No network exposure required — localhost-only attack.

### Status in nrwl/nx-labs

nrwl/nx-labs pins `"storybook": "10.2.9"` — exactly one patch behind the fix. By contrast, nrwl/nx and nrwl/ocean both already pin `storybook@10.2.10`.

### Required change

```json
// nx-labs/package.json — dependencies
"storybook": "10.2.10"  // was: "10.2.9"
```

All `@storybook/*` peer packages (e.g., `@storybook/react-vite`, `@storybook/addon-docs`) should be bumped to `10.2.10` in the same pass.

---

## Finding 3 — HIGH

**CVE-2026-39363** (companion: CVE-2026-39364)  
**CVSS:** 8.2 (High) · EPSS 8.7% (93rd percentile, actively probed)  
**Affected package:** `vite`  
**Affected version range:** `8.0.0–8.0.4` (also 6.0.0–6.4.1 and 7.0.0–7.3.1)  
**Fixed version:** `8.0.5` (6.x: `6.4.2`; 7.x: `7.3.2`)  
**Affected repo:** nrwl/nx root (devDependency, pinned exactly to `8.0.0`)

### Description

The Vite dev server exposes a `fetchModule` WebSocket endpoint. If the dev server is reachable by an attacker (e.g., started with `--host` or `server.host: true` in CI), the attacker can:

- **CVE-2026-39363:** Invoke `vite:invoke` + `fetchModule` with a `file://` URL to read arbitrary files from the developer's machine, bypassing `server.fs` checks.
- **CVE-2026-39364:** Bypass the `server.fs.deny` blocklist by appending query parameters (`?raw`, `?import&raw`, etc.) to serve `.env` files and other denied paths.

**Attack prerequisite for full exploitation:** Dev server network-exposed (`--host`). In dev-only mode on localhost, exploitation requires a CSRF/WebSocket-hijacking vector (same class as CVE-2026-27148 above).

### Status in nrwl/nx

The root `package.json` devDependency is `"vite": "8.0.0"` (exact pin). Vite 8.0.0 is directly in the `8.0.0–8.0.4` vulnerable range.

Note: nrwl/ocean uses `vite@6.4.2` (the patched 6.x release). nrwl/nx-console uses `vite@8.0.9` (patched).

`@nx/vite` itself declares vite as a `peerDependency` (`^5 || ^6 || ^7 || ^8`), so end-users of `@nx/vite` bring their own vite — the internal pin in the monorepo doesn't affect published packages. However, contributors and CI workflows running `vite` commands within the nx monorepo are exposed.

### Required change

```json
// nx/package.json — devDependencies
"vite": "8.0.5"  // was: "8.0.0" (or "^8.0.5" to allow patch updates)
```

---

## Finding 4 — HIGH

**CVE-2026-41907**  
**CVSS:** 8.1 (High) · CWE-787 Out-of-Bounds Write  
**Affected package:** `uuid`  
**Affected version range:** All versions `< 11.1.1` when `v3()`, `v5()`, or `v6()` is called with a caller-provided output buffer  
**Fixed versions:** `11.1.1`, `12.0.1`, `13.0.2`, `14.0.0`  
**Affected repo:** nrwl/ocean (production dependency, `"uuid": "^3.3.3"`)

### Description

The `uuid` package's `v3()`, `v5()`, and `v6()` generation functions accept an optional `buf` + `offset` argument for writing the UUID into a caller-provided buffer. All versions through 14.0.0 fail to validate that the 16-byte UUID fits within `buf.length - offset`, allowing writes past the end of the buffer without raising an error. This produces silent memory corruption in adjacent buffer data.

Published April 2026. Companion issue CVE-2026-41988 (CVSS 3.2, Low) covers the edge-case of the control flow error itself; CVE-2026-41907 (CVSS 8.1) covers the broader bounds-check omission.

**Exploitability caveat:** Requires the caller to pass a `buf` argument to `uuid.v3()`, `uuid.v5()`, or `uuid.v6()`. `uuid.v4()` and calls without `buf` are unaffected. Review ocean's uuid usage to determine if the buffer-arg path is exercised.

### Status in nrwl/ocean

`"uuid": "^3.3.3"` resolves to package version `3.x` (far below `11.1.1`). All uuid versions `<= 10` are deprecated by the maintainers as of 2026 (`"uuid@10 and below is no longer supported"`). This is a major version jump (3 → 11); API compatibility review is required.

### Required change

```json
// ocean/package.json — production dependencies (or devDependencies per usage)
"uuid": "^11.1.1"  // was: "^3.3.3"
```

Audit all callers of `uuid` in ocean to check whether they pass a `buf` argument. If uuid is only called as `v4()` with no buffer, the practical exploitability is nil — but the dependency should still be upgraded given the deprecation status of the 3.x branch.

Also update `@types/uuid` to the matching major (types are bundled in uuid ≥ 7, so the `@types/uuid` dev dep can be removed).

---

## Finding 5 — HIGH

**CVE-2022-37603**  
**CVSS:** 7.5 (High) · CWE-1333 Inefficient Regex  
**Affected package:** `loader-utils`  
**Affected version range:** `>= 2.0.0 < 2.0.4` and `>= 1.0.0 < 1.4.2` and `>= 3.0.0 < 3.2.1`  
**Fixed version:** `2.0.4` (2.x); `1.4.2` (1.x); `3.2.1` (3.x)  
**Affected repo:** nrwl/nx (root `devDependencies`, plus `packages/webpack` and `packages/rspack` ship `^2.0.3`)

### Description

A Regular Expression Denial of Service (ReDoS) vulnerability in the `interpolateName` function in `interpolateName.js`. A crafted file path containing a pathological string causes catastrophic backtracking in the regex, consuming all available CPU until the process is killed or times out.

**Attack prerequisite:** Attacker controls a filename or resource path processed by webpack's `loader-utils.interpolateName()`. In CI pipelines where user-controlled repository content is built, this is achievable by adding a file with a malicious name.

**Note:** CVE-2022-37601 (prototype pollution, Critical CVSS 9.8) was the companion issue — it was *fixed in* 2.0.3. The root nx `package.json` pins `loader-utils` at exactly `2.0.3`, which patches CVE-2022-37601 but is still vulnerable to CVE-2022-37603.

### Status in nrwl/nx

- Root `package.json` devDependency: `"loader-utils": "2.0.3"` — exact pin, **vulnerable**
- `packages/webpack/package.json`: `"loader-utils": "^2.0.3"` — lower-bound only, **may resolve to 2.0.3**
- `packages/rspack/package.json`: `"loader-utils": "^2.0.3"` — same
- `packages/angular-rspack/package.json`: `"loader-utils": "3.3.1"` — 3.3.1 > 3.2.1 fix, **patched**

The published `@nx/webpack` and `@nx/rspack` packages declare `^2.0.3`, which npm will typically resolve to the latest `2.x` (currently `2.0.4`). However, the internal monorepo build is frozen at `2.0.3`.

### Required changes

```json
// nx/package.json — devDependencies
"loader-utils": "2.0.4"  // was: "2.0.3"

// packages/webpack/package.json and packages/rspack/package.json
"loader-utils": "^2.0.4"  // was: "^2.0.3" (tighten lower bound)
```

---

## Cleared Packages (No Actionable HIGH/CRITICAL CVE)

The following packages were audited and found to have no unpatched HIGH or CRITICAL CVEs at the pinned version:

| Package | Pinned Version | CVEs Checked | Verdict |
|---------|---------------|-------------|----------|
| `axios` | 1.16.0 | CVE-2026-40175 (SSRF, fixed 1.15.0), CVE-2025-58754 (DoS, fixed 1.12.0) | **Patched** |
| `express` | 4.21.2 | CVE-2024-43796, CVE-2024-47764, CVE-2024-29041 | **Patched** — 4.21.2 is above all fix points |
| `jsonwebtoken` | 9.0.3 | CVE-2022-23529 through CVE-2022-23541 | **Patched** — 9.0.0 is the fix |
| `bson` | 4.2.0 | CVE-2020-7610 (affects <1.1.4), CVE-2025-14847 (MongoDB _Server_, not npm pkg) | **No HIGH/CRITICAL npm CVE for 4.x** |
| `semver` | 7.5.4 | CVE-2022-25883 (ReDoS, fixed 7.5.2) | **Patched** |
| `undici` | ^6.23.0 | CVE-2025-22150 (fixed 6.21.1), CVE-2025-47279 (fixed 6.21.2), CVE-2026-22036 (decompression bomb, fixed 6.23.0) | **Patched** — constraint floor ≥ 6.23.0 |
| `mongodb` driver | 6.17.0 | CVE-2025-14847 (MongoBleed — MongoDB _Server_, not driver) | **No driver CVE found** |
| `ioredis` | 5.4.2 | All 2024–2026 CVEs | **No HIGH/CRITICAL CVEs found** |
| `jsdom` | 22.1.0 | All 2024–2026 CVEs | **No active HIGH/CRITICAL CVEs** |
| `node-fetch` | 2.7.0 | CVE-2022-0235 (fixed 2.6.7) | **Patched** |
| `helmet` | ~8.1.0 | All searched | **No HIGH/CRITICAL CVEs** |
| `ua-parser-js` | ^1.0.41 | Backdoor (affected 0.7.29/1.0.0, fixed 1.0.1) | **Patched** |
| `next` | 14.2.35 | CVE-2025-29927 (fixed 14.2.25), CVE-2025-66478 (14.x stable not affected), CVE-2025-55184 (DoS, fixed) | **Patched** — 14.x stable not in scope for App Router RSC CVEs |
| `storybook` | 10.2.10 (nx, ocean) | CVE-2025-68429 (env exposure, fixed 10.1.10), CVE-2026-27148 (fixed 10.2.10) | **Patched** |
| `webpack` | ^5.101.3 | CVE-2025-68157 (SSRF, CVSS 3.7 — LOW; only triggers with experimental `buildHttp`) | **Below threshold** |
| `loader-utils` | 3.3.1 (angular-rspack) | CVE-2022-37603 (fixed 3.2.1) | **Patched** |
| `rimraf` | 3.0.2 (nx-console devDep) | All searched | **No HIGH/CRITICAL CVEs** |
| `dotenv` | 10.0.0 (ocean devDep) | All searched | **No HIGH/CRITICAL CVEs** |
| `ini` | 4.1.3 | All searched | **No HIGH/CRITICAL CVEs in npm ini** |
| `universal-analytics` | 0.5.3 (nx-console devDep) | All searched | **No CVE** (package abandoned; GA UA sunset Jul 2023) |
| `vite` | 6.4.2 (ocean) | CVE-2026-39363 (fixed 6.4.2 — exactly patched) | **Patched** |
| `vite` | 8.0.9 (nx-console) | CVE-2026-39363 (fixed 8.0.5) | **Patched** |
| `simple-git` | ^3.32.3 re: CVE-2026-28292 | CVE-2026-28292 (RCE, fixed 3.32.3) | **Patched at constraint floor** |
| `@nx/*` published packages | 23.0.0-beta.18/20 | Checked latest published versions on npm | **No standalone HIGH/CRITICAL CVEs found against published @nx/* packages** |

---

## Non-CVE Risk Notes (Not actionable today, but flagged)

- **`bson 4.2.0`** (ocean): No specific HIGH/CRITICAL CVE against npm `bson` 4.x found, but this is a vintage 2021 release. The MongoDB Node.js driver 6.x ships its own `bson@6.x` internally. The ocean codebase pinning `bson@4.2.0` as a separate direct dependency is unusual and warrants investigation — it may be dead code or an accidental separate install that creates a version split. Consider removing the direct `bson` pin and relying on the transitive dep from `mongodb`.
- **`universal-analytics 0.5.3`** (nx-console devDep): Fully abandoned package (Google UA was sunset July 2023). No CVE found, but zero security patches going forward. Should be removed.
- **`uuid ^3.3.3`** (ocean): Beyond the CVE finding above, `uuid@10` and below is deprecated by maintainers. Even if no `buf` arg is ever passed in ocean's code (making CVE-2026-41907 unexploitable), upgrading is the right call.
- **`rxjs 6.5.5`** (ocean): rxjs 7.x has been the stable major since 2021. 6.5.5 has no known HIGH/CRITICAL CVEs but is far behind the maintained release line.

---

## Methodology

- Extracted `package.json` from the default branch of all four repos via GitHub API
- Checked `pnpm-workspace.yaml` catalog entries in nrwl/nx to resolve `catalog:` references
- Cross-referenced direct dependencies against NVD, Snyk, and GitHub Advisory Database
- Verified fix versions against npm registry metadata
- Excluded CVEs already patched at the pinned version and CVEs below CVSS 7.0
- For `@nx/*` published packages: checked the latest `23.0.0-beta.18/20` metadata; no standalone HIGH/CRITICAL CVEs found against the plugin packages themselves (as opposed to their peer/transitive deps)

---

*Report generated: 2026-05-30 by Claude Code (claude-sonnet-4-6)*
