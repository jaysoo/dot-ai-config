# Nrwl Repos Security Audit — 2026-05-29

**Scope:** nrwl/nx · nrwl/ocean · nrwl/nx-labs · nrwl/nx-console  
**Method:** package.json dependency inventory cross-referenced against CVE databases (NVD, GitHub Advisory Database, Snyk, socket.dev), npm advisories, and vendor security blogs.  
**Exclusions (per scope):** CVE-2025-10894 / S1ngularity supply-chain (Aug 2025, patched); Nx Console 18.95.0 supply-chain (May 2026, patched).

---

## Summary

| # | CVE | Severity | CVSS | Package | Repo(s) | Pinned version | Fixed version |
|---|-----|----------|------|---------|---------|----------------|---------------|
| 1 | CVE-2026-23745 | **HIGH** | 8.2 | `tar` | nrwl/ocean | `^6.2.1` | `7.5.3` |
| 2 | CVE-2026-41907 | **HIGH** | 8.1 | `uuid` | nrwl/nx-console | `8.3.2` (devDep) | `11.1.1` |
| 3 | CVE-2026-41907 | HIGH | 8.1 | `uuid` | nrwl/ocean | `^3.3.3` (prod dep) | `11.1.1` |

All other HIGH/CRITICAL CVEs checked (see §4) are already patched by the current pinned versions in these repos.

---

## Finding 1 — CVE-2026-23745: node-tar arbitrary file overwrite (HIGH, CVSS 8.2)

### What it is

The `tar` (node-tar) library ≤ 7.5.2 does not sanitise the `linkpath` field of hardlink and symlink entries when `preservePaths` is `false` (the default). A crafted malicious `.tar` archive can bypass the extraction root restriction, allowing:

- **Arbitrary File Overwrite** via hardlink entries pointing outside the target directory
- **Symlink Poisoning** via absolute-path symlink targets

Published January 2026. PoC available. Fixed in 7.5.3 (commit `340eb285`, maintainer isaacs).

Advisory: [GHSA-8qq5-rm4j-mr97](https://github.com/advisories/GHSA-8qq5-rm4j-mr97)

### Where it appears

| Repo | Path in package.json | Type | Installed range |
|------|---------------------|------|-----------------|
| nrwl/ocean | `dependencies.tar` | **production** | `^6.2.1` → resolves to latest 6.x (≤ 7.5.2) |

The advisory lists the affected range as `<= 7.5.2`. All 6.x versions are numerically below 7.5.3, placing them inside the vulnerable range. No 6.x backport patch has been released; the only remediation is upgrading to the 7.x line at ≥ 7.5.3.

### Affected code path

ocean uses `tar` as a direct production dependency. Any server-side code path that calls `tar.extract()` or similar on archive data received from external sources (e.g. uploaded artefacts, fetched tarballs) is in scope. CI/CD pipelines that extract third-party archives are also at risk.

### Required change — nrwl/ocean

```diff
# package.json
-    "tar": "^6.2.1",
+    "tar": "^7.5.3",
```

The 7.x API is a drop-in compatible superset of 6.x for the standard `extract`/`create`/`list` calls. Run `pnpm install` and verify any call sites that pass custom `linkpath` or `preservePaths` options.

---

## Finding 2 — CVE-2026-41907: uuid missing buffer bounds check in v3/v5/v6 (HIGH, CVSS 8.1)

### What it is

The `uuid` npm package before 11.1.1 (and isolated 12.0.0 / 13.0.0) does not validate that a caller-supplied output buffer has enough remaining capacity for the `v3()`, `v5()`, or `v6()` UUID generation functions. Passing a too-short buffer or an out-of-range `offset` causes a silent out-of-range write into the caller's TypedArray, corrupting application state without throwing an exception. CVSS 4.0 base score 8.1.

Advisory: [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq). Published April 2026.

Fixed versions: **11.1.1**, 12.0.1, 13.0.1, 14.0.0 (main).

### Finding 2a — nrwl/nx-console (devDep, higher confidence)

| Repo | Path | Type | Pinned |
|------|------|------|--------|
| nrwl/nx-console | `devDependencies.uuid` | dev | `8.3.2` |

uuid npm package v8 exposes `uuid.v3()`, `uuid.v4()`, and `uuid.v5()` — the exact functions with the missing boundary check. `8.3.2 < 11.1.1` places this firmly in the advisory range. Impact is limited to development/build tooling (CI, test infrastructure), not the shipped VSCode extension.

**Required change — nrwl/nx-console:**

```diff
# package.json
-    "uuid": "8.3.2",
+    "uuid": "^11.1.1",
```

The `uuid@11` API is backward-compatible for v1/v4 usage. If any code imports named exports (`import { v3, v5 } from 'uuid'`), that style still works. The legacy `require('uuid').v3()` style is unchanged.

### Finding 2b — nrwl/ocean (prod dep, lower confidence — functional impact may not apply)

| Repo | Path | Type | Pinned |
|------|------|------|--------|
| nrwl/ocean | `dependencies.uuid` | **production** | `^3.3.3` |

uuid npm package v3 predates the `v3()` / `v5()` / `v6()` UUID-generation API — those functions were introduced in uuid npm v4. This means the specific exploit path (calling `uuid.v3()` with a custom buffer) **does not apply to uuid@3.x**. Vulnerability scanners will still flag `^3.3.3` because it falls in the advisory's `< 11.1.1` range.

Regardless of exploitability, uuid@3.x is end-of-life and should be upgraded. The realistic impact here is that any automated security scanner (Dependabot, Snyk, etc.) will now block CI on this.

**Required change — nrwl/ocean:**

```diff
# package.json
-    "uuid": "^3.3.3",
+    "uuid": "^11.1.1",
```

> ⚠️  **Breaking change:** uuid@3 uses the legacy default export (`const uuidv4 = require('uuid/v4')`). uuid@11 uses named exports (`import { v4 as uuidv4 } from 'uuid'`). All import sites in ocean that use the old path-based API must be updated. Search for `require('uuid/` or `from 'uuid/` and rewrite as named imports.

---

## §3 — Packages checked and confirmed safe

The following CVEs were researched during this audit. All are unactioned because the repos' pinned versions already meet or exceed the patched release.

| CVE | Severity | Package | CVE fixed in | Pinned in repo | Repo(s) | Status |
|-----|----------|---------|--------------|----------------|---------|--------|
| CVE-2026-40175 | CRITICAL (CVSS 10) | `axios` | 1.15.0 | `1.16.0` | nx, ocean | ✅ Patched |
| CVE-2025-58754 | HIGH (CVSS 7.5) | `axios` | 1.12.0 | `1.16.0` | nx, ocean | ✅ Patched |
| CVE-2025-55182 / CVE-2025-66478 | CRITICAL (CVSS 10) | `next` | 14.2.35 | `14.2.35` | nx | ✅ Patched |
| CVE-2026-44578 | HIGH (CVSS 8.6) | `next` | 15.5.16 | `14.2.35` | nx | ✅ Not affected (14.x explicitly excluded from scope) |
| CVE-2025-61686 | HIGH (CVSS 9.1) | `@remix-run/node` | 2.17.2 | `2.17.4` | ocean | ✅ Patched |
| CVE-2026-22029 | HIGH (CVSS 8.0) | `react-router` | 6.30.2 (v6 line) | `6.30.3` | ocean, nx | ✅ Patched |
| CVE-2025-31125 | MEDIUM (CVSS 5.3) | `vite` | 6.2.4 / 5.4.16 | `8.0.0` (nx), `6.4.2` (ocean), `8.0.9` (nx-console) | all | ✅ Patched |
| GHSA-67mh-4wv8-2f99 | MEDIUM (CVSS 5.3) | `esbuild` | 0.25.0 | `0.25.0` | nx | ✅ Patched; ocean/nx-console use older versions but this is dev-only and below HIGH threshold |

### Axis supply-chain context

`axios@1.14.1` and `axios@0.30.4` were the two compromised versions in the March 2026 Sapphire Sleet supply-chain attack. Both repos pin `axios@1.16.0`, which post-dates the incident and was published clean. **No action required.**

---

## §4 — Out-of-scope or non-actionable items

| Item | Reason out of scope |
|------|--------------------|
| CVE-2025-10894 (S1ngularity, nx npm supply-chain) | Explicitly excluded — already disclosed, patched, and postmortemed by Nx team (Aug 2025) |
| Nx Console 18.95.0 supply-chain (May 2026) | Explicitly excluded — already disclosed and resolved |
| CVE-2025-14847 (MongoBleed) | Affects the **MongoDB Server binary**, not the `mongodb` npm client driver. ocean's `mongodb@6.17.0` npm package is a client library; the server is a separate deployment concern |
| CVE-2025-22874 (esbuild Go TLS) | Affects Go's `crypto/x509` package, surfaced when esbuild is compiled with Go 1.24.0–1.24.3. Impacts esbuild binary cert verification, not the Node.js module API used by these repos |
| CVE-2026-26956 / CVE-2026-22709 (vm2 sandbox escape) | Neither repo depends on `vm2` |

---

## §5 — Recommended remediation priority

1. **nrwl/ocean `tar@^6.2.1` → `^7.5.3`** — Production dependency, HIGH severity, path traversal / arbitrary file overwrite. Upgrade is straightforward (API compatible). **Do first.**

2. **nrwl/nx-console `uuid@8.3.2` → `^11.1.1`** — Dev dependency, HIGH severity, affects build/test tooling. Low-friction upgrade (named exports already work the same way in uuid@8+). **Do second.**

3. **nrwl/ocean `uuid@^3.3.3` → `^11.1.1`** — Production dependency, technically in advisory range but exploit path does not apply to uuid@3 API. Upgrade is a **breaking API change** (import paths change). Audit all import sites before merging. Still worth fixing to clear scanner noise and retire an EOL package.

---

## Methodology notes

- All four `package.json` files were read from each repo's default branch at time of audit.
- Dependency versions were cross-referenced against NVD, GitHub Advisory Database (GHSA), and vendor blogs.
- `pnpm.overrides` / `overrides` stanzas in each `package.json` were inspected to verify effective resolved versions.
- Transitive-only dependencies (not listed as direct deps) were not exhaustively scanned in this pass; running `pnpm audit` in each repo is the recommended complement to this report.
- Supply-chain attacks (malicious package publishes already removed from the registry) were checked but not included unless the current pinned version falls in the malicious range.

---

*Report generated: 2026-05-29. Next recommended audit cycle: 2026-08-29 or after any major dependency version bump.*
