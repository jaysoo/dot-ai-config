---
description: >
  Review supply chain security posture for Nx published packages.
  Checks npm audit, 2FA enforcement, trusted publishing, token hygiene,
  and dependency provenance. Run monthly. Especially important given
  past npm package compromise incidents.
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - WebFetch
  - Task
---

# Supply Chain Security Review

Monthly security audit focused on the supply chain: how Nx packages are
published, who can publish them, and whether dependencies introduce risk.
This exists because Nx has been hit by npm supply chain attacks before.

## Scope

$ARGUMENTS

Default: all publishable packages in the Nx monorepo plus `@nrwl` and
`@nx-cloud` scoped packages on npm. If running from the orchestrator,
also inspect ocean's publishing workflows. If arguments provided, scope
accordingly.

### Multi-repo support

- **nx repo** (nrwl/nx): All publishable `@nx/*` and `@nrwl/*` packages.
  Inspect `.github/workflows/` for publish pipelines.
- **ocean repo** (Nx Cloud): All publishable `@nx-cloud/*` packages.
  Inspect ocean's CI/CD publish configuration. Ocean publishes separately
  from the nx repo — check both pipelines for consistent security posture.

### npm scopes to check

- `@nx` — Nx CLI packages
- `@nrwl` — Legacy scope (still published for compat)
- `@nx-cloud` — Nx Cloud packages
- `nx` (unscoped) — Core CLI package
- `nx-cloud` (unscoped) — Cloud CLI package
- `create-nx-workspace` — CNW
- `create-nx-plugin` — CNP

## File Management

Area directory: `.ai/para/areas/supply-chain-security/`

1. Current month as `YYYY-MM`.
2. If report exists, **update in place**. Preserve `> NOTE:` / `<!-- manual -->`.
3. If not, create new. Ensure README.md links it.

### README.md structure

```markdown
# Supply Chain Security

Monthly review of Nx's npm publishing security posture. Tracks 2FA
enforcement, trusted publishing, token hygiene, dependency vulnerabilities,
and org access controls.

## Incident History

_Link past incidents here for context:_
- {date}: {brief description of npm compromise incident}

## Reports

- [YYYY-MM](./YYYY-MM.md) — {one-line: N issues found / all clear}
```

## Step 1: npm Audit

```bash
# Run audit at repo root
npm audit --json 2>/dev/null | jq '{
  total: .metadata.totalDependencies,
  vulnerabilities: .metadata.vulnerabilities
}'

# Also check with production-only deps
npm audit --omit=dev --json 2>/dev/null
```

For each vulnerability found, assess:
- Is it in a production dependency or dev-only?
- Does Nx actually use the vulnerable code path? (grep for imports)
- Is there a patch available?
- Is it a transitive dep we can't easily control?

## Step 2: Published Package Integrity

```bash
# List all publishable packages
find packages/ -name "package.json" -not -path "*/node_modules/*" \
  | xargs jq -r 'select(.private != true) | .name' 2>/dev/null
```

For each publishable package, check on npm:

```bash
# Check latest published version matches what we expect
npm view <pkg> dist-tags --json 2>/dev/null

# Check who published the latest version
npm view <pkg> --json | jq '{
  latest: ."dist-tags".latest,
  time: .time[."dist-tags".latest],
  maintainers: [.maintainers[].name]
}'
```

Flag:
- Packages where latest publish was by an unexpected account
- Packages with dist-tags pointing to unexpected versions
- Any `@nrwl` packages that aren't in our repo (potential typosquat)

## Step 3: Org Access Review

```bash
# List npm org members (requires auth)
npm org ls nrwl 2>/dev/null
npm org ls nx 2>/dev/null
```

Check:
- Are there members who are no longer on the team?
- Do all members have 2FA enabled?
- Who has publish (write) access vs read-only?

If npm cli doesn't provide this, note it as a manual check item.

## Step 4: GitHub Publishing Workflow

```bash
# Check publish workflows
find .github/workflows/ -name "*.yml" -o -name "*.yaml" \
  | xargs grep -l "npm publish\|npx nx release\|npm.*publish" 2>/dev/null
```

For each publishing workflow, verify:
- Uses `id-token: write` permission (OIDC trusted publishing)
- Does NOT use long-lived npm tokens stored in secrets
- Has environment protection rules (approval required)
- Runs on a specific branch only (main/release)
- No third-party actions with write access to npm credentials

```bash
# Check if provenance is enabled
grep -r "provenance" .github/workflows/ .npmrc package.json
```

## Step 5: Dependency Provenance

For top 20 most critical dependencies (by how deeply they're used):

```bash
# Check if dependency publishes with provenance
npm view <pkg> dist.attestations --json 2>/dev/null
```

Note which critical deps do and don't publish with provenance/SLSA attestations.

## Step 6: Typosquat Check

```bash
# Check for packages with similar names to @nx/* and @nrwl/*
# Common typosquat patterns: missing @, letter swap, extra char
npm view nx-devkit 2>/dev/null  # should not exist or be ours
npm view nrwl-nx 2>/dev/null
npm view @nx-cloud/runner 2>/dev/null
```

Check a handful of plausible typosquats. Flag any that exist and aren't ours.

## Step 7: Compare with last month

- Vulnerabilities that were open last month: resolved?
- New vulnerabilities introduced
- Org membership changes
- Any publishing workflow modifications

## Write the report

```markdown
# Supply Chain Security — {Month Year}

_Last updated: {datetime}_

## Status: {🟢 Clear / 🟡 Issues Found / 🔴 Action Required}

## Summary
- npm audit: {N vulnerabilities (N critical, N high, N moderate)}
- Org access: {N members with publish access}
- Publishing: {trusted publishing status}
- Provenance: {N of top 20 deps publish with attestations}

## ⚠️ Action Required
{Anything that needs immediate attention. If nothing, say "None."}

## npm Audit Results

### Production Dependencies
| Package | Severity | Vulnerability | Affects Nx? | Fix Available? |
|---------|----------|--------------|-------------|---------------|

### Dev Dependencies
{Same table, lower priority}

## Publishing Security
- Trusted publishing (OIDC): {✅/❌}
- Provenance attestations: {✅/❌}
- Environment protection: {✅/❌}
- Token hygiene: {status}

## Org Access
| Member | Role | 2FA | Last Publish | Still on Team? |
|--------|------|-----|-------------|----------------|

{Flag anyone who shouldn't have access}

## Typosquat Check
{Results or "No suspicious packages found"}

## Dependency Provenance (Top 20)
| Dependency | Publishes Provenance? | SLSA Level |
|-----------|----------------------|------------|

## Manual Checks Needed
{Items this automated scan can't verify — list for human follow-up}
```

Save to `.ai/para/areas/supply-chain-security/YYYY-MM.md` and update README.md.
