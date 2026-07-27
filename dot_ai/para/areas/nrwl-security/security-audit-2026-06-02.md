# Nrwl Security Audit — 2026-06-02

**Scope:** nrwl/nx · nrwl/ocean · nrwl/nx-labs · nrwl/nx-console  
**Methodology:** Package.json inspection + CVE database cross-reference (NVD, GitHub Advisory Database, Snyk, GitLab Advisories)  
**Threshold:** HIGH (CVSS ≥ 7.0) and CRITICAL only  
**Exclusions:** S1ngularity supply-chain attack (CVE-2025-10894, Aug 2025) and Nx Console 18.95.0 extension compromise (May 2026) — both already disclosed, patched, and postmortemed by the Nx team.

---

## ACTIONABLE FINDINGS

Two unpatched HIGH-severity vulnerabilities require a dependency change today.

---

### FINDING 1 — CVE-2026-39363

| Field | Detail |
|---|---|
| **CVE** | CVE-2026-39363 |
| **Severity** | HIGH — CVSS 8.2 |
| **Package** | `vite` |
| **Affected range** | `>= 8.0.0, <= 8.0.4` (also `>= 7.0.0, <= 7.3.1` and `>= 6.0.0, <= 6.4.1`) |
| **Fixed version** | `8.0.5` |
| **Repo** | `nrwl/nx` |
| **Current pin** | `"vite": "8.0.0"` in `package.json` devDependencies |

**Description:** The `fetchModule` method exposed via the Vite dev server's WebSocket connection does not apply the same `server.fs.allow` access-control checks that HTTP requests face. An attacker who can reach the dev server's WebSocket port (no Origin header required) can invoke `fetchModule` via the `vite:invoke` event with a `file://…?raw` or `file://…?inline` URL and exfiltrate arbitrary files from the host as JavaScript strings—including `.env`, SSH keys, cloud credentials, and source code.

**Exploitation condition:** The dev server must be exposed to a non-localhost network (started with `--host` or `server.host: true`). This is routine in CI containers and Docker-based dev setups—both of which the Nx monorepo uses. Nx's own docs and many generator templates suggest `--host` for remote devboxes.

**Required change — `nrwl/nx` `package.json`:**
```diff
-    "vite": "8.0.0",
+    "vite": "8.0.5",
```

Also verify the `catalog:vite` entries in `pnpm-workspace.yaml` if vite appears there for `vitest` or other catalog consumers.

**References:**  
- [GitHub Advisory GHSA-p9ff-h696-f583](https://github.com/advisories/GHSA-p9ff-h696-f583)  
- [NVD CVE-2026-39363](https://nvd.nist.gov/vuln/detail/CVE-2026-39363)  
- [Microsoft Playwright tracking issue #40757](https://github.com/microsoft/playwright/issues/40757)

---

### FINDING 2 — CVE-2026-1526

| Field | Detail |
|---|---|
| **CVE** | CVE-2026-1526 |
| **Severity** | HIGH — CVSS 7.5 |
| **Package** | `undici` |
| **Affected range** | `< 6.24.0` (also `>= 7.0.0, < 7.24.0`) |
| **Fixed version** | `6.24.0` |
| **Repo** | `nrwl/ocean` |
| **Current pin** | `"undici": "^6.23.0"` in `package.json` `pnpm.overrides` |

**Description:** Undici's WebSocket client decompresses incoming permessage-deflate frames by accumulating all decompressed chunks in memory with no upper bound. A malicious WebSocket server can send a crafted compressed frame (~6 MB) that expands to ≥1 GB in memory, exhausting process memory and crashing the Node.js host. The decompression occurs in native/external memory, bypassing V8 heap limits, so the crash happens before any application-level rate limiting fires. CVSS vector: `AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H`.

**Why this matters for ocean:** `nrwl/ocean` is a production application (NxCloud backend). Its pnpm override pins undici at `^6.23.0` — a floor of 6.23.0 but no ceiling preventing resolution at 6.23.x. If `pnpm install` was last run before undici 6.24.0 was published, the lockfile resolves to a vulnerable 6.23.x. The override must be bumped to explicitly require ≥6.24.0.

**Required change — `nrwl/ocean` `package.json` `pnpm.overrides`:**
```diff
-      "undici": "^6.23.0"
+      "undici": "^6.24.0"
```
After updating, run `pnpm install` to regenerate the lockfile with an auditable 6.24.0+ resolution.

**References:**  
- [GitHub Advisory GHSA-vrm6-8vpv-qv8q](https://github.com/advisories/GHSA-vrm6-8vpv-qv8q)  
- [NVD CVE-2026-1526](https://nvd.nist.gov/vuln/detail/CVE-2026-1526)  
- [Snyk SNYK-JS-UNDICI-15518068](https://security.snyk.io/vuln/SNYK-JS-UNDICI-15518068)

---

## VERIFIED-PATCHED (no action required)

The following HIGH/CRITICAL CVEs were found during the audit but are already addressed by the pinned versions in these repos.

| CVE | Package | Severity | Fixed In | Status in repos |
|---|---|---|---|---|
| CVE-2026-40175 | `axios` | CRITICAL (9.9) | 1.15.0 | nx: 1.16.0 ✓  ocean: 1.16.0 ✓ |
| CVE-2026-25639 | `axios` | HIGH (7.5) | 1.13.5 | nx: 1.16.0 ✓  ocean: 1.16.0 ✓ |
| CVE-2025-58754 | `axios` | HIGH (7.x) | 1.12.0 | nx: 1.16.0 ✓  ocean: 1.16.0 ✓ |
| CVE-2025-66478 / CVE-2025-55182 | `next` / `react` | CRITICAL (10.0) | next 14.2.35 | nx: next 14.2.35 ✓ |
| CVE-2025-68429 | `storybook` | HIGH (7.3) | 10.1.10 | nx: 10.2.10 ✓  ocean: 10.2.10 ✓  nx-labs: 10.2.9 ✓  nx-console: 10.2.10 ✓ |
| CVE-2025-29775 (SAMLStorm) | `xml-crypto` via `@node-saml/node-saml` | CRITICAL | xml-crypto 6.0.1 | ocean: @node-saml/node-saml 5.1.0 depends on xml-crypto ^6.1.2 ✓ |

**Notes on SAMLStorm:** CVE-2025-29775 is a SAML authentication bypass. `nrwl/ocean` uses `@node-saml/node-saml ^5.1.0`. Confirmed via npm registry: version 5.1.0 lists `"xml-crypto": "^6.1.2"` as a dependency — this is post-fix (fix was in 6.0.1), so ocean is safe.

---

## BELOW HIGH THRESHOLD (excluded per scope)

| CVE | Package | CVSS | Reason excluded |
|---|---|---|---|
| CVE-2025-68157 | `webpack` | 3.7 (Low) | Only triggers when `experiments.buildHttp` is enabled; CVSS below threshold |
| CVE-2024-23334 | `esbuild` | Moderate | Dev-server only; below HIGH threshold |
| CVE-2026-1525 | `undici` | 6.5 (Medium) | Below threshold |
| CVE-2026-1527 | `undici` | 4.6 (Medium) | Below threshold |

---

## PUBLISHED NX PACKAGES (@nx/devkit, nx, etc.)

No unpatched HIGH/CRITICAL CVEs were found in the latest published versions of `nx` and its first-party plugins (`@nx/devkit`, `@nx/js`, `@nx/workspace`, `@nx/angular`, `@nx/react`, `@nx/vite`, `@nx/eslint`, etc.) beyond the two previously-excluded incidents (S1ngularity Aug 2025 and Nx Console 18.95.0 May 2026).

Users of the current latest stable `nx` and `@nx/*` packages (23.x series) are not exposed to any known unpatched HIGH/CRITICAL code-level CVE as of this audit date.

---

## AUDIT METHODOLOGY NOTES

- Package.json files were read directly from GitHub for the default branch (main/HEAD) of each repo.
- CVE data was cross-referenced against NVD, GitHub Advisory Database, Snyk, GitLab Advisories, and SentinelOne Vulnerability Database.
- For transitive dependencies (e.g., xml-crypto via node-saml), the npm registry was queried for the exact resolved version at the pinned range.
- The nrwl/ocean `pnpm-lock.yaml` (1.4 MB) could not be read in full; the undici finding is based on the `pnpm.overrides` range `^6.23.0` being potentially resolvable to a vulnerable 6.23.x.
- All CVE IDs were verified against at least two independent sources before inclusion.

---

*Audit conducted: 2026-06-02. Next recommended review: 2026-09-01 or upon any major dependency version bump.*
