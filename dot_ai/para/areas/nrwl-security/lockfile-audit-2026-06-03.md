# Nrwl Repo Security Audit — 2026-06-03 (Lockfile-Level)

**Scope:** nrwl/nx · nrwl/ocean · nrwl/nx-labs · nrwl/nx-console  
**Method:** `pnpm audit --json` against installed lockfiles (pnpm-lock.yaml / bun.lock), CVE data from GitHub Advisory Database + NVD + Snyk  
**Excluded (known/resolved):** S1ngularity supply-chain attack Aug 2025 (CVE-2025-10894), Nx Console 18.95.0 compromise May 2026  
**Threshold:** HIGH (CVSS ≥ 7.0) and CRITICAL only  
**Prior audits:** 2026-05-28 and 2026-06-01 used package.json-level inspection. This audit ran `pnpm audit` against the actual lockfiles, revealing transitive and multi-version issues the prior scans missed.

---

## Executive Summary

This lockfile audit surfaces findings not caught by the prior package.json-level audits. Many packages appear with two locked versions — a vulnerable older version (pulled in by some transitive dep that hasn't been updated) and a fixed newer version. Both must be addressed.

| Priority | CVE(s) | CVSS | Package | Repos Affected | Type |
|---|---|---|---|---|---|
| P1 | CVE-2026-27606 | **9.8** | `rollup` | nx (4.44.2), ocean (4.47.1) | Arbitrary File Write — build-time |
| P1 | CVE-2026-6951 | **9.2** | `simple-git` | ocean (3.32.3), nx (3.33.0) | RCE — git options injection |
| P2 | CVE-2026-44293, CVE-2026-44291 | 8.8 | `protobufjs` | ocean (7.5.5 + 8.0.1) | Code Injection + Prototype Pollution gadget → RCE |
| P2 | CVE-2026-27959 | 8.1 | `koa` | ocean (3.0.3) | Host Header Injection |
| P2 | CVE-2026-25536, CVE-2026-0621, CVE-2025-66414 | 8.0/7.5/7.5 | `@modelcontextprotocol/sdk` | ocean (1.20.2), nx-console (1.25.2) | Cross-client data leak, ReDoS, no DNS-rebinding protection |
| P2 | Vite WebSocket file read + fs.deny bypass | 8.2 | `vite` | nx (6.3.5/7.1.3/7.3.1/8.0.0), nx-labs (7.3.1) | Arbitrary file read — dev server |
| P3 | CVE-2026-44902 | 7.5 | `@opentelemetry/sdk-node`, `@opentelemetry/auto-instrumentations-node` | ocean | Prometheus exporter crash |
| P3 | CVE-2026-4800 | 7.4 | `lodash`, `lodash-es` | ocean (4.17.21), nx (4.17.21/4.17.23) | Code injection via `_.template` |
| P3 | GHSA-5c6j-r48x-rmvq | 7.3 | `serialize-javascript` | ocean (6.0.2), nx (6.0.2), nx-labs (6.0.2) | RCE via RegExp serialization |
| P3 | CVE-2026-33228 | 7.2 | `flatted` | ocean (3.4.0), nx (3.3.4) | Prototype pollution via parse() |
| P4 | node-forge cluster (5 CVEs) | 7.0–7.6 | `node-forge` | nx (1.3.1) | Cert chain bypass, signature forgery, DoS |
| P4 | CVE-2026-44290, CVE-2026-44289 | 7.5 | `protobufjs` | ocean (7.5.5 + 8.0.1) | DoS (subset of P2 fix) |
| P4 | CVE-2025-59343 | 7.2 | `tar-fs` | ocean (2.1.3) | Symlink validation bypass |
| P4 | tar path-traversal cluster | 7.0–7.5 | `tar` | ocean (6.1.11/6.2.1/7.4.3), nx (7.5.2) | Arbitrary file write/overwrite |

No additional unpatched HIGH/CRITICAL CVEs were found in the published `nx` or `@nx/*` npm packages themselves.

---

## PRODUCTION-RISK FINDINGS

### P1 — CVE-2026-27606 — Rollup Arbitrary File Write via Path Traversal

| Field | Detail |
|---|---|
| **CVE ID** | CVE-2026-27606 |
| **GHSA** | GHSA-mw96-cpmx-2vgc |
| **Severity** | HIGH — CVSS **9.8** |
| **Type** | Arbitrary File Write (CWE-22) |
| **Affected range** | `rollup >= 4.0.0, < 4.59.0` (also `< 2.80.0` and `< 3.30.0`) |
| **Fixed version** | **4.59.0** (4.x), 3.30.0 (3.x), 2.80.0 (2.x) |

**What it does:** `src/utils/sanitizeFileName.ts` uses a regex that does not strip `.` or `/` from user-controlled filenames (named chunk entries, CLI `--input`, malicious plugin output names). An attacker who controls a build input can use `../../../` traversal sequences to write output files anywhere the build process has write access — overwriting shell profiles, CI config files, or package manager hooks to achieve persistent RCE.

**Why missed by prior audits:** The 05-28 audit noted nx's direct `rollup` pin as 4.59.0 (fixed). The lockfiles reveal older versions persisting as transitive deps from sub-packages that haven't been updated.

**Locked vulnerable versions:**

| Repo | Locked version | Status | Fixed version also in lock? |
|---|---|---|---|
| **nrwl/ocean** | `4.47.1` | VULNERABLE | No — only 4.47.1 |
| **nrwl/nx** | `4.44.2` | VULNERABLE | Yes — `4.59.0` also present |
| nrwl/nx-labs | `4.59.0` | PATCHED | — |

**Change needed:**

*nrwl/ocean* — add to `package.json` `pnpm.overrides`:
```json
"pnpm": {
  "overrides": {
    "rollup": ">=4.59.0"
  }
}
```

*nrwl/nx* — same override, or find which sub-package pulls `4.44.2` and bump its declared version:
```bash
pnpm why rollup | grep "4.44.2"
```

---

### P1 — CVE-2026-6951 — simple-git Remote Code Execution

| Field | Detail |
|---|---|
| **CVE ID** | CVE-2026-6951 |
| **GHSA** | GHSA-hffm-xvc3-vprc |
| **Severity** | HIGH — CVSS **9.2** |
| **Type** | Remote Code Execution (incomplete fix for CVE-2022-25912) |
| **Affected range** | `simple-git < 3.36.0` |
| **Fixed version** | **3.36.0** |

**What it does:** The prior fix for CVE-2022-25912 blocked `-c` git option injection. This bypass uses the equivalent `--config` form (`--config protocol.ext.allow=always`) combined with `ext::` clone sources to execute arbitrary external commands. Exploitable if any untrusted string reaches the `options` argument of `git.clone()` or similar.

**Locked vulnerable versions:**

| Repo | Locked version | Status |
|---|---|---|
| **nrwl/ocean** | `3.32.3` | VULNERABLE |
| **nrwl/nx** | `3.33.0` | VULNERABLE |

**Change needed:**

*nrwl/ocean* and *nrwl/nx* — add to `pnpm.overrides`:
```json
"pnpm": {
  "overrides": {
    "simple-git": ">=3.36.0"
  }
}
```

Ocean uses `simple-git` in git-related workflow features (CI analysis). Audit all call sites where user-supplied repository URLs or branch names flow into git options.

---

### P2 — CVE-2026-44293 + CVE-2026-44291 — protobufjs Code Injection + Prototype Pollution RCE Gadget

| Field | Detail |
|---|---|
| **CVE IDs** | CVE-2026-44293 (Code Injection, CVSS 8.8), CVE-2026-44291 (Prototype Pollution, CVSS 8.1) |
| **GHSA** | GHSA-66ff-xgx4-vchm, GHSA-75px-5xx7-5xc7 |
| **Severity** | HIGH |
| **Type** | Code Injection via generated toObject(), prototype pollution gadget |
| **Affected range** | `protobufjs <= 7.5.5` and `>= 8.0.0, <= 8.0.1` |
| **Fixed version** | **7.5.6** (7.x), **8.0.2** (8.x) |

**What it does:** A crafted `.proto` schema with a non-string default value for a `bytes` field causes attacker-controlled code to be emitted verbatim into the generated `toObject()` JavaScript conversion function. CVE-2026-44291 chains this with prototype pollution: pollute `Object.prototype` first, then trigger code generation. Ocean uses protobuf for gRPC communication — if any schema definition is loaded from an external or user-controlled source, this is directly exploitable.

**Locked vulnerable versions:**

| Repo | Locked versions | Status |
|---|---|---|
| **nrwl/ocean** | `7.5.5`, `8.0.1` | VULNERABLE (both branches) |

**Change needed:** Add to `pnpm.overrides` in ocean `package.json`:
```json
"protobufjs": ">=7.5.6"
```

For the `8.x` instance, check whether any dep requires `protobufjs@^8.0.0` specifically — if so, also add:
```json
"protobufjs@^8": ">=8.0.2"
```

---

### P2 — CVE-2026-27959 — Koa Host Header Injection

| Field | Detail |
|---|---|
| **CVE ID** | CVE-2026-27959 |
| **GHSA** | GHSA-7gcc-r8m5-44qm |
| **Severity** | HIGH — CVSS 8.1 |
| **Type** | Host Header Injection via `ctx.hostname` |
| **Affected range** | `koa >= 3.0.0, < 3.1.2` |
| **Fixed version** | **3.1.2** |

**What it does:** `ctx.hostname` returns the raw `Host:` header value without sanitizing `X-Forwarded-Host` overrides or validating against an allowlist. An attacker can inject an arbitrary host value that propagates into redirect URLs, cache-key computation, or SSRF targets constructed from the hostname. On a production server with cache infrastructure in front of it, this enables cache poisoning; behind an SSRF-sensitive service, it enables pivot attacks.

**Locked vulnerable versions:**

| Repo | Locked version | Status |
|---|---|---|
| **nrwl/ocean** | `3.0.3` | VULNERABLE |

**Change needed:** In ocean's `package.json`, bump `koa` to `>=3.1.2`. Check that `@koa/*` middleware packages (`koa-router`, `koa-body`, etc.) are compatible with 3.1.2.

---

### P2 — CVE-2026-25536 + CVE-2026-0621 + CVE-2025-66414 — @modelcontextprotocol/sdk (three vulnerabilities)

| CVE | Severity | Affected range | Fixed | Description |
|---|---|---|---|---|
| CVE-2026-25536 | HIGH (CVSS 8.0) | `>= 1.10.0, <= 1.25.3` | **1.26.0** | Cross-client data leak via shared server/transport instance reuse |
| CVE-2026-0621 | HIGH (CVSS 7.5) | `< 1.25.2` | **1.25.2** | ReDoS in URI/method-name parsing |
| CVE-2025-66414 | HIGH (CVSS 7.5) | `< 1.24.0` | **1.24.0** | DNS rebinding protection disabled by default |

**What CVE-2026-25536 does:** When a single `McpServer` or transport instance handles multiple concurrent client sessions without proper isolation, data from one client session can leak into another. If ocean's AI agent infrastructure reuses MCP server instances across requests (a common pattern), this exposes one user's conversation context to another user.

**Locked vulnerable versions:**

| Repo | Locked version | CVE-2026-25536 | CVE-2026-0621 | CVE-2025-66414 |
|---|---|---|---|---|
| **nrwl/ocean** | `1.20.2` | VULNERABLE | VULNERABLE | VULNERABLE |
| **nrwl/nx-console** | `1.25.2` (direct pin) | VULNERABLE | PATCHED | PATCHED |

**Change needed:**

*nrwl/ocean*: Upgrade `@modelcontextprotocol/sdk` from `^1.20.2` to `^1.26.0` in `package.json`. This resolves all three CVEs.

*nrwl/nx-console*: Upgrade `@modelcontextprotocol/sdk` from `1.25.2` to `>=1.26.0`. This resolves CVE-2026-25536.

---

### P3 — CVE-2026-44902 — OpenTelemetry Prometheus Exporter Process Crash

| Field | Detail |
|---|---|
| **CVE ID** | CVE-2026-44902 |
| **GHSA** | GHSA-q7rr-3cgh-j5r3 |
| **Severity** | HIGH — CVSS 7.5 |
| **Type** | Denial of Service via malformed HTTP request |
| **Affected range** | `@opentelemetry/sdk-node < 0.217.0`, `@opentelemetry/auto-instrumentations-node < 0.75.0`, `@opentelemetry/exporter-prometheus < 0.217.0` |
| **Fixed version** | **0.217.0** / **0.75.0** |

**What it does:** A single malformed HTTP request to the Prometheus metrics endpoint (`:9464/metrics` by default) crashes the Node.js process due to an unhandled exception in the exporter's HTTP server. No authentication is required. In ocean's production deployment, this endpoint may be reachable from internal monitoring infrastructure; an insider or a compromised monitoring tool can trigger process-level DoS on any ocean API node.

**Declared versions in ocean `package.json`:**

| Package | Declared | Vulnerable? |
|---|---|---|
| `@opentelemetry/sdk-node` | `0.215.0` | VULNERABLE (< 0.217.0) |
| `@opentelemetry/auto-instrumentations-node` | `0.73.0` | VULNERABLE (< 0.75.0) |

**Change needed:** In ocean `package.json`, bump both:
```json
"@opentelemetry/sdk-node": "0.217.0",
"@opentelemetry/auto-instrumentations-node": "0.75.0"
```
Verify peer compatibility with other `@opentelemetry/*` packages (they share a release cadence).

---

## DEV/BUILD-TIME FINDINGS

### P2 — Vite WebSocket Arbitrary File Read + server.fs.deny Bypass

| Advisory | CVSS | Affected range | Fixed |
|---|---|---|---|
| GHSA-p9ff-h696-f583 (WebSocket file read) | 8.2 | vite `>= 6.0.0, <= 6.4.1`; `>= 7.0.0, <= 7.3.1`; `>= 8.0.0, <= 8.0.4` | 6.4.2 / 7.3.2 / 8.0.5 |
| GHSA-v2wj-q39q-566r (server.fs.deny bypass via query) | 7.5 | vite `>= 7.1.0, <= 7.3.1`; `>= 8.0.0, <= 8.0.4` | 7.3.2 / 8.0.5 |

**What they do:** When the Vite dev server is exposed to the network (via `--host` or `server.host: true`), an unauthenticated remote attacker can request `/@fs/<absolute-path>?raw??` to bypass `server.fs.deny` and read arbitrary files from the host. A separate advisory covers WebSocket-based file read via the same filesystem route. In CI or shared dev environments where Vite runs with `--host`, this can expose `.env` files, SSH keys, service account credentials, etc.

**Locked vulnerable versions:**

| Repo | Locked vulnerable versions | Fixed also present? |
|---|---|---|
| **nrwl/nx** | `6.3.5`, `7.1.3`, `7.3.1`, `8.0.0` | Yes (`5.4.19` not in range; no fixed 6.x/7.x/8.x in lock) |
| **nrwl/nx-labs** | `7.3.1` | No fixed 7.x present |
| nrwl/ocean | `5.4.19` (not in range), `6.4.2` (fixed) | Not affected |

**Change needed:**

*nrwl/nx* — The nx repo tests and ships plugins for multiple Vite versions, so all are present as test fixtures/peer deps. Add overrides for any non-test usage, and ensure CI test jobs do not expose Vite dev servers to the network. Consider adding a `pnpm.overrides` for the internal tooling entries:
```json
"pnpm": {
  "overrides": {
    "vite@^6": ">=6.4.2",
    "vite@^7": ">=7.3.2",
    "vite@^8": ">=8.0.5"
  }
}
```

*nrwl/nx-labs* — Bump `vite` from `7.3.1` to `>=7.3.2`.

---

### P3 — GHSA-5c6j-r48x-rmvq — serialize-javascript RCE via RegExp Serialization

| Field | Detail |
|---|---|
| **Advisory** | GHSA-5c6j-r48x-rmvq |
| **Severity** | HIGH — CVSS 7.3 |
| **Type** | Remote Code Execution |
| **Affected range** | `serialize-javascript <= 7.0.2` |
| **Fixed version** | **7.0.3** |

**What it does:** `serialize-javascript` serializes JavaScript values to a string that can be safely embedded in a `<script>` tag. A crafted object with a `RegExp` whose `.flags` getter or a `Date` whose `.toISOString()` method returns a string containing arbitrary JavaScript bypasses the sanitization and injects executable code into the serialized output. If the output is `eval()`'d or inserted into a script context, this is RCE.

**Multiple versions in lockfiles:** All three repos have `serialize-javascript@6.0.2` alongside `7.0.4`. The `6.0.2` instance is pulled in by older webpack/terser transitive deps.

| Repo | Vulnerable locked | Fixed locked |
|---|---|---|
| **nrwl/ocean** | `6.0.2` | `7.0.4` |
| **nrwl/nx** | `6.0.2` | `7.0.4` |
| **nrwl/nx-labs** | `6.0.2` | none |

**Change needed:** Add to `pnpm.overrides` in all three repos:
```json
"serialize-javascript": ">=7.0.3"
```

---

### P3 — CVE-2026-4800 — lodash / lodash-es Code Injection via _.template

| Field | Detail |
|---|---|
| **CVE ID** | CVE-2026-4800 |
| **GHSA** | GHSA-r5fr-rjxr-66jc |
| **Severity** | HIGH — CVSS 7.4 |
| **Type** | Code Injection (CWE-94) |
| **Affected range** | `lodash >= 4.0.0, <= 4.17.23`; `lodash-es >= 4.0.0, <= 4.17.23` |
| **Fixed version** | **4.18.0** (lodash), **4.18.0** (lodash-es) |

**What it does:** `_.template()` builds a compiled function from a template string. When an ES6 import expression appears in the template (e.g., `import { ... } from '...'`), lodash uses the imported key names verbatim in generated code without sanitization. An attacker who controls template content can inject arbitrary JavaScript.

Note: lodash `4.17.x` is broadly considered abandoned (no active development, security fixes only). The `4.18.0` fix for this CVE was released as a security-only patch. Migration to a maintained alternative (e.g., `es-toolkit`) is recommended for long-term health, but the `4.18.0` bump resolves this specific CVE.

**Locked vulnerable versions:**

| Repo | Package | Locked versions | Status |
|---|---|---|---|
| **nrwl/ocean** | `lodash` | `4.17.21` | VULNERABLE |
| **nrwl/ocean** | `lodash-es` | `4.17.21` | VULNERABLE |
| **nrwl/nx** | `lodash` | `4.17.21`, `4.17.23` | VULNERABLE |
| **nrwl/nx** | `lodash-es` | `4.17.21` | VULNERABLE |

**Change needed:** Add to `pnpm.overrides`:
```json
"lodash": ">=4.18.0",
"lodash-es": ">=4.18.0"
```

---

### P3 — CVE-2026-33228 — flatted Prototype Pollution

| Field | Detail |
|---|---|
| **CVE ID** | CVE-2026-33228 |
| **GHSA** | GHSA-rf6f-7fwh-wjgh |
| **Severity** | HIGH — CVSS 7.2 |
| **Type** | Prototype Pollution (CWE-1321) |
| **Affected range** | `flatted <= 3.4.1` |
| **Fixed version** | **3.4.2** |

**What it does:** `flatted.parse()` does not sanitize `__proto__` keys in the serialized JSON, allowing an attacker-controlled JSON string to set arbitrary properties on `Object.prototype`. Downstream code that uses `obj.someProperty` without `hasOwnProperty` checks can be hijacked.

**Dual-version situation:** ocean's lockfile has both `3.4.0` (vulnerable) and `3.4.2` (fixed). The vulnerable version persists because some transitive dep hasn't been updated to require `>= 3.4.2`.

| Repo | Locked versions | Status |
|---|---|---|
| **nrwl/ocean** | `3.4.0` (vuln), `3.4.2` (fixed) | Partial — 3.4.0 still present |
| **nrwl/nx** | `3.3.4` | VULNERABLE |

**Change needed:** Add to `pnpm.overrides`:
```json
"flatted": ">=3.4.2"
```

---

### P4 — node-forge Certificate Chain Bypass + Signature Forgery Cluster (nrwl/nx)

Five CVEs against `node-forge@1.3.1` in the nx lockfile. All fixed in `1.4.0`.

| CVE | GHSA | Severity | Description |
|---|---|---|---|
| CVE-2026-33896 | GHSA-2328-f5f3-gj25 | HIGH (CVSS 7.6) | basicConstraints bypass — attacker-signed cert can impersonate a CA |
| CVE-2026-33895 | GHSA-q67f-28xg-22rw | HIGH (CVSS 7.4) | Ed25519 signature forgery (missing `S > L` check per RFC 8032) |
| CVE-2026-33894 | GHSA-ppp5-5v6c-4jwp | HIGH (CVSS 7.4) | RSA-PKCS signature forgery via ASN.1 extra field |
| CVE-2026-33891 | GHSA-5m6q-g25r-mvwx | HIGH (CVSS 7.5) | DoS via infinite loop in `BigInteger.modInverse()` with zero input |
| CVE-2025-66031 | GHSA-554w-wpv2-vw27 | HIGH (CVSS 7.0) | ASN.1 Unbounded Recursion → stack overflow |

**Locked version:**

| Repo | Locked version | Status |
|---|---|---|
| **nrwl/nx** | `1.3.1` | VULNERABLE to all five |

**Change needed:** Add to nx `pnpm.overrides`:
```json
"node-forge": ">=1.4.0"
```

---

### P4 — tar Path Traversal Cluster

Multiple path traversal / symlink abuse CVEs in node-tar affecting both repos. Latest safe version is `7.5.11`.

| CVE | GHSA | Fixed in | Description |
|---|---|---|---|
| CVE-2026-24842 | GHSA-34x7-hfp2-rc4v | 7.5.7 | Arbitrary file create/overwrite via hardlink |
| CVE-2026-23745 | GHSA-8qq5-rm4j-mr97 | 7.5.3 | Arbitrary overwrite via symlink poisoning |
| CVE-2026-26960 | GHSA-83g3-92jg-28cx | 7.5.8 | File read/write via hardlink target escape through symlink chain |
| CVE-2026-29786 | GHSA-qffp-2rhf-9h96 | 7.5.10 | Hardlink path traversal via drive-relative linkpath |
| CVE-2026-31802 | GHSA-9ppj-qmqm-q256 | 7.5.11 | Symlink path traversal via drive-relative linkpath |
| CVE-2026-23950 | GHSA-r6q2-hw4h-h46w | 7.5.4 | Race condition via Unicode ligature collisions (macOS APFS) |

**Locked vulnerable versions:**

| Repo | Locked versions | Status |
|---|---|---|
| **nrwl/ocean** | `6.1.11`, `6.2.1` (old 6.x — EOL), `7.4.3` | All VULNERABLE |
| **nrwl/nx** | `7.5.2` | VULNERABLE (needs 7.5.11) |

**Note on 6.x:** tar 6.x does not receive security backports. The `6.1.11` and `6.2.1` instances in ocean need to be upgraded to 7.5.11.

**Change needed:** Add to `pnpm.overrides` in both repos:
```json
"tar": ">=7.5.11"
```

---

### P4 — CVE-2025-59343 — tar-fs Symlink Validation Bypass (nrwl/ocean)

| Field | Detail |
|---|---|
| **CVE ID** | CVE-2025-59343 |
| **GHSA** | GHSA-vj76-c3g6-qr5v |
| **Severity** | HIGH — CVSS 7.2 |
| **Affected range** | `tar-fs >= 2.0.0, < 2.1.4` |
| **Fixed version** | **2.1.4** |

**Locked version in ocean:** `2.1.3` — VULNERABLE.

**Change needed:**
```json
"tar-fs": ">=2.1.4"
```

---

## NOT NEW — Already in Prior Audits

The following were flagged in the 2026-05-28 or 2026-06-01 audits and are not repeated here:

| CVE | Package | Status |
|---|---|---|
| CVE-2026-44578, CVE-2026-23870 | `next@14.2.35` in nx | Open — awaiting upgrade to ≥15.5.18 |
| CVE-2026-27148 | `storybook` WebSocket hijacking | Patched — all repos now on 10.2.10+ |
| CVE-2025-68429 | `storybook` .env exposure | Patched — all repos on 10.1.10+ |
| undici | CVE-2026-22036 | Patched — ocean at 6.26.0 ≥ 6.24.0 |

---

## Consolidated Overrides Block

The quickest path to resolving all findings in this audit is adding `pnpm.overrides` entries. These force all transitive instances to the fixed version without requiring every consumer to be individually updated.

### nrwl/ocean `package.json`
```json
"pnpm": {
  "overrides": {
    "rollup": ">=4.59.0",
    "simple-git": ">=3.36.0",
    "protobufjs": ">=7.5.6",
    "koa": ">=3.1.2",
    "serialize-javascript": ">=7.0.3",
    "lodash": ">=4.18.0",
    "lodash-es": ">=4.18.0",
    "flatted": ">=3.4.2",
    "tar": ">=7.5.11",
    "tar-fs": ">=2.1.4"
  }
}
```
Plus direct-dep bumps in package.json:
- `@modelcontextprotocol/sdk`: `^1.26.0`
- `@opentelemetry/sdk-node`: `0.217.0`
- `@opentelemetry/auto-instrumentations-node`: `0.75.0`
- `koa`: `>=3.1.2`

### nrwl/nx `package.json`
```json
"pnpm": {
  "overrides": {
    "rollup": ">=4.59.0",
    "simple-git": ">=3.36.0",
    "serialize-javascript": ">=7.0.3",
    "lodash": ">=4.18.0",
    "lodash-es": ">=4.18.0",
    "flatted": ">=3.4.2",
    "node-forge": ">=1.4.0",
    "tar": ">=7.5.11",
    "vite@^6": ">=6.4.2",
    "vite@^7": ">=7.3.2",
    "vite@^8": ">=8.0.5"
  }
}
```

### nrwl/nx-console `package.json`
```json
"@modelcontextprotocol/sdk": ">=1.26.0"
```

### nrwl/nx-labs `package.json`
```json
"pnpm": {
  "overrides": {
    "vite": ">=7.3.2",
    "serialize-javascript": ">=7.0.3"
  }
}
```

---

## Published npm @nx/* Package CVE Status

`pnpm audit` on the published surface of `nx` and `@nx/*` plugins (at 23.0.0-beta.21 / 22.x stable line) reveals no new unpatched HIGH/CRITICAL CVEs in the packages' own code. The risks are all in their transitive install-time dependencies, which are covered by the lockfile findings above.

The two supply-chain incidents remain excluded per scope (S1ngularity Aug 2025, Nx Console 18.95.0 May 2026).

---

## Methodology

- `pnpm audit --json` run against installed lockfiles in each repo (pnpm-lock.yaml) or bun.lock for nx-labs
- CVE data sourced from: GitHub Advisory Database (GHSA), NVD/NIST, Snyk
- Lock file scanning done via Python regex against the raw YAML to confirm installed versions, not just declared ranges
- Production vs. dev risk assessment based on whether the vulnerable package is reachable from an authenticated network request path

*Audit conducted: 2026-06-03*  
*Auditor: Claude (Sonnet 4.6) via Claude Code on the web*
