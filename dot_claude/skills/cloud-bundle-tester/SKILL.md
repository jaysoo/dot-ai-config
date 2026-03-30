---
name: cloud-bundle-tester
description: Test nx-cloud client-bundle commands locally against snapshot, staging, or local environments. Use when testing onboarding, fix-ci, or other nx-cloud CLI commands. Triggers on "test bundle", "cloud bundle", "nx-cloud local", "test onboard", "bundle tester".
---

# Cloud Bundle Tester

Test nx-cloud client-bundle commands by building the bundle locally and running it against a target environment.

## Quick Start

### 1. Build the client bundle

```bash
nx build nx-packages-client-bundle
```

Output: `dist/libs/nx-packages/client-bundle/src/index.js`

Use `nx build-watch nx-packages-client-bundle` for continuous rebuilds during development.

### 2. Configure a PAT for the target environment

Get a Personal Access Token from the target environment's UI, then:

```bash
# For snapshot
npx nx-cloud configure --personal-access-token=<PAT> --nx-cloud-url=https://snapshot.nx.app

# For staging
npx nx-cloud configure --personal-access-token=<PAT> --nx-cloud-url=https://staging.nx.app

# For local
npx nx-cloud configure --personal-access-token=<PAT> --nx-cloud-url=http://localhost:4203
```

PATs are stored in `~/.nxCloudAuth` (nxcloud.ini) per URL.

### 3. Run commands

Use the wrapper script:

```bash
./tools/scripts/nx-cloud-local.sh <environment> <command> [args...]
```

## Environments

| Name       | URL                         | Notes                                    |
|------------|-----------------------------|------------------------------------------|
| `snapshot` | `https://snapshot.nx.app`   | Latest merged code from main             |
| `staging`  | `https://staging.nx.app`    | Pre-production                           |
| `local`    | `http://localhost:4203`     | Local dev server (`nx serve nx-cloud`)   |

## Examples

```bash
# List available commands
./tools/scripts/nx-cloud-local.sh snapshot

# Onboarding
./tools/scripts/nx-cloud-local.sh snapshot onboard
./tools/scripts/nx-cloud-local.sh snapshot onboard status --json
./tools/scripts/nx-cloud-local.sh snapshot onboard connect-workspace --json

# Other commands
./tools/scripts/nx-cloud-local.sh staging validate
./tools/scripts/nx-cloud-local.sh local login
```

## GitHub Device Flow (Onboarding)

If testing the `onboard connect` command which uses GitHub OAuth device flow, you need the GitHub App credentials as env vars. Ask a teammate for the values of:

- `NX_CLOUD_GITHUB_APP_CLIENT_ID`
- `NX_CLOUD_GITHUB_APP_CLIENT_SECRET`
- `NX_CLOUD_GITHUB_APP_APP_ID`

## Key Files

- **Script**: `tools/scripts/nx-cloud-local.sh`
- **Bundle source**: `libs/nx-packages/client-bundle/src/index.ts` — command map
- **Onboard command**: `libs/nx-packages/client-bundle/src/lib/core/commands/onboarding/`
- **Build output**: `dist/libs/nx-packages/client-bundle/src/index.js`
- **Build config**: `libs/nx-packages/client-bundle/project.json`

## Troubleshooting

- **"Client bundle not found"**: Run `nx build nx-packages-client-bundle` first
- **Auth errors**: Re-run `npx nx-cloud configure` with a fresh PAT for the target URL
- **Stale bundle**: Rebuild after code changes, or use `nx build-watch nx-packages-client-bundle`
- **Local env not responding**: Ensure `nx serve nx-cloud` is running on port 4203
