# Nrwl Repos Security Audit — 2026-05-31

**Scope:** nrwl/nx · nrwl/ocean · nrwl/nx-labs · nrwl/nx-console  
**Method:** Root `package.json` + `pnpm-workspace.yaml` inspected from each repo's default branch. Versions cross-referenced against NVD, GitHub Advisory Database (GHSA), socket.dev, Snyk, and vendor security blogs.  
**Severity filter:** HIGH (CVSS ≥ 7.0) and CRITICAL only.  
**Excluded per scope:** CVE-2025-10894 / S1ngularity supply-chain (Aug 2025, resolved); Nx Console 18.95.0 supply-chain (May 2026, resolved).

---

## What's New in This Report (vs. 2026-05-28 / 2026-05-29 audits)

### Progress since last audit

| Repo | Item | Status |
|------|------|--------|
| nrwl/nx | Storybook CVE-2026-27148 (pinned 10.1.0) | ✅ **PATCHED** — now at 10.2.10 |
| nrwl/nx-console | Storybook CVE-2026-27148 (pinned 10.1.9) | ✅ **PATCHED** — now at 10.2.10 |

### Still outstanding from prior reports

| # | CVE | Package | Repo(s) | Report |
|---|-----|---------|---------|--------|
| — | CVE-2026-27148 | `storybook 10.2.9` | nrwl/nx-labs | 2026-05-28 |
| — | CVE-2026-23745 | `tar ^6.2.1` | nrwl/ocean | 2026-05-29 |
| — | CVE-2026-41907 | `uuid ^3.3.3` | nrwl/ocean | 2026-05-29 |
| — | CVE-2026-41907 | `uuid 8.3.2` | nrwl/nx-console | 2026-05-29 |

### New findings in this report

| # | CVE | Severity | CVSS | Package | Repo(s) | Pinned | Fixed |
|---|-----|----------|------|---------|---------|--------|-------|
| 1 | CVE-2026-26996 | **HIGH** | ~7.5 | `minimatch` | nrwl/nx-labs, nrwl/nx-console | 9.0.3 / 9.0.5 | 9.0.6 |
| 2 | CVE-2026-27903 | **HIGH** | ~7.5 | `minimatch` | nrwl/nx-labs, nrwl/nx-console | 9.0.3 / 9.0.5 | 9.0.6 |
| 3 | CVE-2026-27904 | **HIGH** | ~7.5 | `minimatch` | nrwl/nx-labs, nrwl/nx-console | 9.0.3 / 9.0.5 | 9.0.6 |

---

## Finding 1 — CVE-2026-26996, CVE-2026-27903, CVE-2026-27904 · HIGH · minimatch ReDoS (three co-patched CVEs)

**Severity:** HIGH — ReDoS / event-loop starvation in Node.js  
**CWE:** CWE-1333 (Inefficient Regular Expression Complexity)

### Description

Three distinct Regular Expression Denial of Service (ReDoS) vulnerabilities were patched together in minimatch 9.0.6 / 10.2.1 (backported across the 3.x–10.x line) in February 2026:

| CVE | Pattern that triggers backtracking | Complexity |
|-----|------------------------------------|------------|
| **CVE-2026-26996** | Many consecutive `*` wildcards followed by a literal character that doesn't appear in the test string | O(2ⁿ) |
| **CVE-2026-27903** | Nested `*()` / `+()` extglob quantifiers producing nested unbounded regex quantifiers | catastrophic |
| **CVE-2026-27904** | Multiple non-adjacent `**` (GLOBSTAR) segments against a non-matching path | O(C(n,k)) binomial |

All three allow an attacker who can supply glob patterns to Node.js code that calls `minimatch()` to stall the event loop indefinitely, causing denial of service. In build tooling and CI runners, patterns often originate from user-supplied config files or CLI flags.

**Published:** February 16–24, 2026  
**Patched by:** Isaac Schlueter (minimatch maintainer) and Jordan Harband (Socket)

### Affected version ranges (9.x line)

| Branch | Vulnerable range | Fixed version |
|--------|-----------------|---------------|
| 9.x | < 9.0.6 | **9.0.6** |
| 10.x | < 10.2.1 | 10.2.1 |
| 8.x | < 8.0.5 | 8.0.5 |

### Repos and pinned versions

| Repo | Where pinned | Pinned version | Status |
|------|-------------|----------------|--------|
| nrwl/nx-labs | `devDependencies.minimatch` | **9.0.3** | **VULNERABLE** (9.0.3 < 9.0.6) |
| nrwl/nx-console | `dependencies.minimatch` | **9.0.5** | **VULNERABLE** (9.0.5 < 9.0.6) |
| nrwl/nx | `pnpm-workspace.yaml` catalog + override | `10.2.5` | ✅ PATCHED (10.2.5 ≥ 10.2.1) |
| nrwl/ocean | `dependencies.minimatch` | `9.0.7` | ✅ PATCHED (9.0.7 ≥ 9.0.6) |

Note: nrwl/nx has `overrides.minimatch: '^10.2.5'` in `pnpm-workspace.yaml`, which pins all transitive minimatch resolutions to ≥ 10.2.5. Both nrwl/ocean and nrwl/nx are therefore unaffected.

### Required change — nrwl/nx-labs

`package.json`:
```diff
-    "minimatch": "9.0.3",
+    "minimatch": "9.0.6",
```

Or add an override to ensure transitive deps are also covered:
```json
"overrides": {
  "minimatch": "^9.0.6"
}
```

### Required change — nrwl/nx-console

`package.json`:
```diff
-    "minimatch": "9.0.5",
+    "minimatch": "9.0.6",
```

Or add/update the package-level `resolutions` (yarn 4 workspaces):
```json
"resolutions": {
  "minimatch": "^9.0.6"
}
```

### References

- [socket.dev: minimatch patches 3 high-severity ReDoS vulnerabilities](https://socket.dev/blog/minimatch-patches-3-high-severity-redos-vulnerabilities)
- [GHSA-3ppc-4f35-3m26 (CVE-2026-26996)](https://github.com/advisories/GHSA-3ppc-4f35-3m26)
- [CVE-2026-27903 on resolvedsecurity.com](https://www.resolvedsecurity.com/vulnerability-catalog/CVE-2026-27903)
- [CVE-2026-27904 on resolvedsecurity.com](https://www.resolvedsecurity.com/vulnerability-catalog/CVE-2026-27904)

---

## Still-Outstanding Item: storybook CVE-2026-27148 in nrwl/nx-labs

*(Full details in 2026-05-28 audit; reproduced here for completeness.)*

**CVE-2026-27148 — CVSS 8.9 (HIGH) — WebSocket hijacking → XSS / RCE**

The Storybook dev-server WebSocket handler has no origin validation. A developer who visits a malicious page while the local Storybook dev server is running can have arbitrary WebSocket messages injected, leading to persistent XSS or RCE on the developer machine. Production builds are **not** affected.

| Repo | Pinned version | Status |
|------|----------------|--------|
| nrwl/nx | ~~10.1.0~~ → **10.2.10** | ✅ PATCHED (since 05-28) |
| nrwl/nx-console | ~~10.1.9~~ → **10.2.10** | ✅ PATCHED (since 05-28) |
| nrwl/nx-labs | **10.2.9** | **STILL VULNERABLE** |
| nrwl/ocean | catalog: 10.2.10 | ✅ PATCHED |

**Required change — nrwl/nx-labs:**

```diff
-    "storybook": "10.2.9",
+    "storybook": "10.2.10",
```

(All co-versioned `@storybook/*` packages in nx-labs should be bumped together if present.)

---

## Still-Outstanding Items from 2026-05-29 Audit

These were first reported on 2026-05-29 and remain unpatched as of 2026-05-31:

### tar CVE-2026-23745 · HIGH (CVSS 8.2) — nrwl/ocean

node-tar ≤ 7.5.2 allows arbitrary file overwrite and symlink poisoning via crafted `.tar` archives. All 6.x versions are in the vulnerable range. Fixed in 7.5.3 (no 6.x backport).

| Repo | Pinned | Status |
|------|--------|--------|
| nrwl/ocean | `"tar": "^6.2.1"` | **STILL VULNERABLE** |

**Fix:** `"tar": "^7.5.3"` in ocean's `package.json`.

### uuid CVE-2026-41907 · HIGH (CVSS 8.1) — nrwl/ocean, nrwl/nx-console

Buffer bounds check missing in uuid v3/v5/v6 generation functions. uuid@3.x (ocean prod dep) doesn't expose those specific functions, so direct exploit path doesn't apply, but the version is EOL and will flag in all scanners. uuid@8.x (nx-console dev dep) does expose the vulnerable API.

| Repo | Pinned | Type | Status |
|------|--------|------|--------|
| nrwl/ocean | `"uuid": "^3.3.3"` | prod | STILL VULNERABLE (EOL, advisory range) |
| nrwl/nx-console | `"uuid": "8.3.2"` | dev | **STILL VULNERABLE** (exposes v3/v5 API) |

**Fix:** Upgrade to `uuid@^11.1.1` in both repos. Note that ocean's uuid@3 → @11 upgrade is a **breaking import change** (`require('uuid/v4')` → `import { v4 } from 'uuid'`); audit all call sites first.

---

## Published nx / @nx/* Package Status

Latest stable release as of 2026-05-31: **nx@23.0.0-beta.20** (latest beta) and **nx@22.7.5** (latest stable).

No unpatched HIGH/CRITICAL CVEs were found in published `nx` or `@nx/*` packages beyond the two excluded incidents:

- **CVE-2025-10894** (S1ngularity, Aug 2025) — excluded per scope; fully resolved, all malicious versions removed from npm
- **Nx Console 18.95.0** (May 2026) — excluded per scope; fully resolved within 11 minutes of discovery

Users on `nx@22.7.5` or `nx@23.0.0-beta.20` with current first-party plugins (`@nx/devkit`, `@nx/js`, `@nx/workspace`, `@nx/angular`, `@nx/react`, `@nx/vite`, `@nx/eslint`, etc.) are not exposed to any known unpatched CVEs in those packages themselves.

---

## Packages Reviewed and Confirmed Patched in This Pass

| Package | Repo(s) | Pinned | CVE checked | Status |
|---------|---------|--------|-------------|--------|
| `axios 1.16.0` | nx, ocean | `1.16.0` | CVE-2026-40175 (CRITICAL, fixed ≥1.13.2) | ✅ Patched |
| `next 14.2.35` | nx | `14.2.35` | CVE-2025-55182 (CRITICAL, fixed in 14.2.35) | ✅ Patched |
| `jsonwebtoken 9.0.3` | ocean | `9.0.3` | CVE-2022-23540 (fixed ≥9.0.0) | ✅ Patched |
| `minimatch 9.0.7` | ocean | `9.0.7` | CVE-2026-26996/27903/27904 (fixed ≥9.0.6) | ✅ Patched |
| `minimatch 10.2.5` | nx (catalog+override) | `10.2.5` | CVE-2026-26996/27903/27904 (fixed ≥10.2.1) | ✅ Patched |
| `storybook 10.2.10` | nx, ocean, nx-console | `10.2.10` | CVE-2026-27148 (CVSS 8.9, fixed in 10.2.10) | ✅ Patched |
| `undici ^6.23.0` | ocean | `^6.23.0` | CVE-2026-22036 (HIGH, fixed ≥6.23.0); CVE-2026-1527 (MEDIUM CVSS 4.6, fixed ≥6.24.0) | ✅ CVE-2026-22036 patched; CVE-2026-1527 is MEDIUM only |
| `esbuild 0.25.0` | nx | `0.25.0` | CVE-2024-23334 (MODERATE dev-server, fixed ≥0.25.0) | ✅ Patched |
| `esbuild 0.19.5/0.19.9` | nx-console, ocean | devDep | CVE-2024-23334 (MODERATE — below HIGH threshold), CVE-2025-22874 (Go stdlib binary issue, not JS API) | ⚠️ Below HIGH threshold; excluded per scope |

---

## Remediation Priority (All Open Items)

| Priority | CVE | Package → Fix | Repo | Urgency |
|----------|-----|---------------|------|---------|
| 1 | CVE-2026-26996/27903/27904 | `minimatch 9.0.3` → `9.0.6` | nrwl/nx-labs | **Immediate** (HIGH, new) |
| 2 | CVE-2026-26996/27903/27904 | `minimatch 9.0.5` → `9.0.6` | nrwl/nx-console | **Immediate** (HIGH, new) |
| 3 | CVE-2026-27148 | `storybook 10.2.9` → `10.2.10` | nrwl/nx-labs | **Immediate** (HIGH CVSS 8.9, outstanding since 05-28) |
| 4 | CVE-2026-23745 | `tar ^6.2.1` → `^7.5.3` | nrwl/ocean | **Soon** (HIGH CVSS 8.2, outstanding since 05-29) |
| 5 | CVE-2026-41907 | `uuid 8.3.2` → `^11.1.1` | nrwl/nx-console | **Soon** (HIGH CVSS 8.1, dev dep) |
| 6 | CVE-2026-41907 | `uuid ^3.3.3` → `^11.1.1` | nrwl/ocean | **Planned** (HIGH range, but exploit path N/A to uuid@3 API; breaking import change) |

---

## Methodology Notes

- Root `package.json` for all four repos read from default branch on 2026-05-31.
- `pnpm-workspace.yaml` catalogs and `overrides`/`pnpm.overrides` stanzas inspected to determine effective resolved version floors.
- Lockfiles were not inspected directly (too large); version ranges from `package.json` + overrides determine the floor; actual installed versions may be higher (and therefore patched) where the range allows it.
- For `^`-pinned ranges, the finding is conservative: a version at the floor of the range is assumed if no override sets a higher minimum.
- Transitive-only dependencies (not listed as direct deps) were not exhaustively scanned. Run `pnpm audit --prod` in each repo for full transitive coverage.

---

*Audit date: 2026-05-31. Previous audits: 2026-05-28, 2026-05-29. Next recommended cycle: 2026-08-31 or after a major version bump in any of the four repos.*
