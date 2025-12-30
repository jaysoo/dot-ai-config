# NXC-3641: Centralized Template Updater

## Goal
Create a centralized repository (`nrwl/nx-template-updater`) that automatically updates CNW template repos when new Nx versions are published.

## Constraints
1. Template repos must have exactly ONE commit ("Initial commit")
2. Must run `nx migrate` (not just version bumps)
3. Changes must be reviewed via PR before merging
4. Decoupled from Nx publish to avoid blocking releases

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    nrwl/nx-template-updater                      │
├─────────────────────────────────────────────────────────────────┤
│  .github/workflows/                                              │
│    ├── check-and-update.yml    # Nightly version check          │
│    └── post-merge-squash.yml   # Webhook receiver for squashing │
│                                                                  │
│  scripts/                                                        │
│    ├── check-version.sh        # Compare npm vs template version│
│    ├── update-template.sh      # Clone, migrate, push branch    │
│    └── squash-to-initial.sh    # Orphan branch + force push     │
│                                                                  │
│  config/                                                         │
│    └── templates.json          # List of template repos         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
        ┌───────────────────────────────────────────┐
        │           Template Repos                   │
        ├───────────────────────────────────────────┤
        │  • nrwl/empty-template                    │
        │  • nrwl/react-template (future)           │
        │  • nrwl/node-template (future)            │
        │  • etc.                                    │
        └───────────────────────────────────────────┘
```

## Implementation Plan

### Phase 1: Create the Updater Repository

#### 1.1 Repository Setup
- [ ] Create `nrwl/nx-template-updater` repository
- [ ] Add README explaining purpose and workflow
- [ ] Configure repository settings (branch protection, etc.)

#### 1.2 Template Configuration (`config/templates.json`)
```json
{
  "templates": [
    {
      "repo": "nrwl/empty-template",
      "preset": "apps",
      "description": "Empty Nx workspace template"
    }
  ],
  "nxPackage": "nx",
  "checkSchedule": "0 5 * * *"
}
```

#### 1.3 Version Check Script (`scripts/check-version.sh`)
```bash
#!/bin/bash
# Compares latest npm version with version in template's package.json
# Outputs: should_update=true/false, latest_version=X.X.X

LATEST_VERSION=$(npm view nx version)
TEMPLATE_VERSION=$(curl -s "https://raw.githubusercontent.com/$REPO/main/package.json" | jq -r '.devDependencies.nx // .dependencies.nx')

# Only update for stable releases (no canary, beta, rc)
if [[ "$LATEST_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  if [ "$LATEST_VERSION" != "$TEMPLATE_VERSION" ]; then
    echo "should_update=true"
    echo "latest_version=$LATEST_VERSION"
  fi
fi
```

#### 1.4 Update Template Script (`scripts/update-template.sh`)
```bash
#!/bin/bash
# Args: REPO, VERSION, GITHUB_TOKEN

set -e

REPO=$1
VERSION=$2
BRANCH="update-nx-$VERSION"

# Clone template repo
git clone "https://x-access-token:${GITHUB_TOKEN}@github.com/${REPO}.git" workspace
cd workspace

# Create update branch
git checkout -b "$BRANCH"

# Run Nx migration
npx nx migrate nx@$VERSION --run-migrations=false
npm install
npx nx migrate --run-migrations

# Commit changes
git add -A
git commit -m "chore: update to Nx $VERSION

- Ran nx migrate nx@$VERSION
- Applied all migrations

🤖 Automated update by nx-template-updater"

# Push branch
git push origin "$BRANCH"

# Create PR via GitHub CLI
gh pr create \
  --repo "$REPO" \
  --title "chore: update to Nx $VERSION" \
  --body "## Automated Nx Update

This PR updates the template to Nx $VERSION.

### Changes
- Ran \`nx migrate nx@$VERSION\`
- Applied all migrations

### Post-Merge
After merging, a workflow will automatically squash all commits to maintain a single 'Initial commit'.

---
🤖 Created by [nx-template-updater](https://github.com/nrwl/nx-template-updater)"
```

#### 1.5 Squash Script (`scripts/squash-to-initial.sh`)
```bash
#!/bin/bash
# Squashes all commits into single "Initial commit" using orphan branch

set -e

REPO=$1

git clone "https://x-access-token:${GITHUB_TOKEN}@github.com/${REPO}.git" workspace
cd workspace

# Create orphan branch (no history)
git checkout --orphan temp-squash

# Stage all files
git add -A

# Create single commit
git commit -m "Initial commit

Nx workspace template - automatically maintained.
Current Nx version: $(jq -r '.devDependencies.nx // .dependencies.nx' package.json)

🤖 Generated by nx-template-updater"

# Replace main branch
git branch -M main
git push -f origin main
```

### Phase 2: GitHub Workflows

#### 2.1 Nightly Check Workflow (`.github/workflows/check-and-update.yml`)
```yaml
name: Check and Update Templates

on:
  schedule:
    - cron: '0 5 * * *'  # Daily at 5:00 UTC
  workflow_dispatch:
    inputs:
      force_version:
        description: 'Force update to specific version (optional)'
        required: false

jobs:
  check-version:
    runs-on: ubuntu-latest
    outputs:
      should_update: ${{ steps.check.outputs.should_update }}
      latest_version: ${{ steps.check.outputs.latest_version }}
    steps:
      - uses: actions/checkout@v4

      - name: Check for new Nx version
        id: check
        run: |
          LATEST=$(npm view nx version)
          echo "latest_version=$LATEST" >> $GITHUB_OUTPUT

          # Check if stable release
          if [[ "$LATEST" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            echo "should_update=true" >> $GITHUB_OUTPUT
          else
            echo "should_update=false" >> $GITHUB_OUTPUT
          fi

  update-templates:
    needs: check-version
    if: needs.check-version.outputs.should_update == 'true'
    runs-on: ubuntu-latest
    strategy:
      matrix:
        template:
          - nrwl/empty-template
          # Add more templates here
      fail-fast: false
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Check if template needs update
        id: template-check
        run: |
          TEMPLATE_VERSION=$(curl -s "https://raw.githubusercontent.com/${{ matrix.template }}/main/package.json" | jq -r '.devDependencies.nx // .dependencies.nx')
          LATEST="${{ needs.check-version.outputs.latest_version }}"

          if [ "$TEMPLATE_VERSION" != "$LATEST" ]; then
            echo "needs_update=true" >> $GITHUB_OUTPUT
          else
            echo "needs_update=false" >> $GITHUB_OUTPUT
          fi

      - name: Update template
        if: steps.template-check.outputs.needs_update == 'true'
        env:
          GITHUB_TOKEN: ${{ secrets.TEMPLATE_UPDATER_PAT }}
          GH_TOKEN: ${{ secrets.TEMPLATE_UPDATER_PAT }}
        run: |
          ./scripts/update-template.sh \
            "${{ matrix.template }}" \
            "${{ needs.check-version.outputs.latest_version }}"
```

#### 2.2 Post-Merge Squash Workflow

**Option A: Webhook in template repos**
Each template repo has a workflow triggered on PR merge:

```yaml
# In each template repo: .github/workflows/post-merge-squash.yml
name: Squash to Initial Commit

on:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  squash:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.SQUASH_PAT }}

      - name: Squash to single commit
        run: |
          git checkout --orphan temp-squash
          git add -A
          git commit -m "Initial commit

          Nx workspace template.
          Current version: $(jq -r '.devDependencies.nx' package.json)

          🤖 Auto-maintained by nx-template-updater"

          git branch -M main
          git push -f origin main
```

**Option B: Repository dispatch from updater**
Updater repo triggers squash after detecting PR merge.

### Phase 3: Authentication & Permissions

#### Option A: Personal Access Token (PAT)

**Setup (5 minutes):**
1. Create a Fine-Grained PAT under a bot account (e.g., `nrwl-bot`)
2. Scope to `nrwl` organization
3. Repository access: Select template repos + updater repo
4. Permissions: `contents: write`, `pull_requests: write`

**Secrets needed:**
| Secret | Location | Purpose |
|--------|----------|---------|
| `TEMPLATE_UPDATER_PAT` | `nx-template-updater` repo | Clone, push, create PRs |
| `SQUASH_PAT` | Each template repo | Force push after merge |

**Workflow usage:**
```yaml
- name: Clone and update template
  env:
    GITHUB_TOKEN: ${{ secrets.TEMPLATE_UPDATER_PAT }}
    GH_TOKEN: ${{ secrets.TEMPLATE_UPDATER_PAT }}
  run: ./scripts/update-template.sh "${{ matrix.template }}" "$VERSION"
```

**Pros:**
- Simple 5-minute setup
- No app infrastructure to maintain
- Works immediately

**Cons:**
- Tied to user account (needs bot account)
- PAT expires (max 1 year for fine-grained)
- Broader permissions than necessary

---

#### Option B: GitHub App (Recommended)

**Setup (15-20 minutes):**

1. **Create the App** (Settings → Developer settings → GitHub Apps → New):
   ```
   Name: Nx Template Updater
   Homepage: https://github.com/nrwl/nx-template-updater
   Webhook: Inactive (uncheck)
   ```

2. **Permissions:**
   | Permission | Access | Why |
   |------------|--------|-----|
   | Contents | Read & Write | Clone repos, push branches |
   | Pull requests | Read & Write | Create PRs |
   | Metadata | Read | Required for all apps |

3. **Install on nrwl org:**
   - Select "Only select repositories"
   - Add: `empty-template`, `nx-template-updater`, (future templates)

4. **Generate private key:**
   - Download `.pem` file
   - Store as `APP_PRIVATE_KEY` secret (base64 encoded)

5. **Note the IDs:**
   - App ID (e.g., `123456`)
   - Installation ID (from org install page)

**Secrets needed:**
| Secret | Location | Value |
|--------|----------|-------|
| `APP_ID` | `nx-template-updater` | App ID from settings |
| `APP_PRIVATE_KEY` | `nx-template-updater` | Base64 of .pem file |

**Workflow usage:**
```yaml
jobs:
  update-templates:
    runs-on: ubuntu-latest
    steps:
      - name: Generate GitHub App token
        id: app-token
        uses: actions/create-github-app-token@v1
        with:
          app-id: ${{ secrets.APP_ID }}
          private-key: ${{ secrets.APP_PRIVATE_KEY }}
          owner: nrwl
          repositories: empty-template,nx-template-updater

      - name: Clone and update template
        env:
          GITHUB_TOKEN: ${{ steps.app-token.outputs.token }}
          GH_TOKEN: ${{ steps.app-token.outputs.token }}
        run: ./scripts/update-template.sh "${{ matrix.template }}" "$VERSION"
```

**Pros:**
- No token expiration (private key doesn't expire)
- Minimal permissions (only what's needed)
- Not tied to any user account
- Clear audit trail (shows "Nx Template Updater [bot]")
- Can revoke/reinstall without affecting users

**Cons:**
- 15-20 minute initial setup
- Need to update installation when adding new templates

---

#### Recommendation: GitHub App

The extra 10-15 minutes of setup is worth it because:
1. No annual PAT rotation needed
2. Bot commits show as "Nx Template Updater [bot]" (professional)
3. Easier to audit and revoke if needed
4. Adding new templates = just update installation scope

### Phase 4: Template Repo Setup

#### 4.1 For Each Template Repo
- [ ] Add post-merge squash workflow
- [ ] Configure branch protection:
  - Require PR reviews
  - Allow force push from squash workflow (via PAT/App)
- [ ] Add `SQUASH_PAT` secret

#### 4.2 Branch Protection Bypass
Since we need to force push after merge, either:
1. Use a PAT from an admin account
2. Use GitHub App with bypass permissions
3. Temporarily disable protection (not recommended)

## Rollout Plan

### Step 1: Proof of Concept
1. Create `nrwl/nx-template-updater` repo
2. Implement for single template (`empty-template`)
3. Test full flow manually

### Step 2: Automate
1. Enable scheduled workflow
2. Monitor for one release cycle
3. Verify squash works correctly

### Step 3: Scale
1. Add remaining template repos to matrix
2. Document process for adding new templates

### Phase 5: Slack Notifications (#monitoring)

Alerts go to **#monitoring** channel (same as e2e matrix nightlies and nx publish).

#### Notification Events

| Event | Message | Color |
|-------|---------|-------|
| New version detected | "🔍 New Nx version X.X.X detected, updating templates..." | blue |
| PR created | "📝 Created PR for {template}: {pr_url}" | blue |
| PR merged + squashed | "✅ {template} updated to Nx X.X.X" | green |
| Migration failed | "❌ Migration failed for {template}: {error}" | red |
| No update needed | (silent - no notification) | - |

#### Workflow Integration

```yaml
env:
  SLACK_WEBHOOK_URL: ${{ secrets.SLACK_MONITORING_WEBHOOK }}

jobs:
  notify-start:
    runs-on: ubuntu-latest
    if: needs.check-version.outputs.should_update == 'true'
    steps:
      - name: Notify Slack - Update starting
        uses: slackapi/slack-github-action@v1.26.0
        with:
          payload: |
            {
              "text": "🔍 Template Updater: New Nx version ${{ needs.check-version.outputs.latest_version }} detected",
              "attachments": [
                {
                  "color": "#1E90FF",
                  "fields": [
                    { "title": "Version", "value": "${{ needs.check-version.outputs.latest_version }}", "short": true },
                    { "title": "Templates", "value": "empty-template", "short": true }
                  ]
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_MONITORING_WEBHOOK }}
          SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK

  update-templates:
    # ... existing job ...
    steps:
      # ... existing steps ...

      - name: Notify Slack - PR created
        if: success()
        uses: slackapi/slack-github-action@v1.26.0
        with:
          payload: |
            {
              "text": "📝 Template Updater: PR created for ${{ matrix.template }}",
              "attachments": [
                {
                  "color": "#1E90FF",
                  "fields": [
                    { "title": "Template", "value": "${{ matrix.template }}", "short": true },
                    { "title": "Version", "value": "${{ needs.check-version.outputs.latest_version }}", "short": true },
                    { "title": "PR", "value": "${{ steps.create-pr.outputs.pr_url }}", "short": false }
                  ]
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_MONITORING_WEBHOOK }}
          SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK

      - name: Notify Slack - Failure
        if: failure()
        uses: slackapi/slack-github-action@v1.26.0
        with:
          payload: |
            {
              "text": "❌ Template Updater: Migration failed for ${{ matrix.template }}",
              "attachments": [
                {
                  "color": "#FF0000",
                  "fields": [
                    { "title": "Template", "value": "${{ matrix.template }}", "short": true },
                    { "title": "Version", "value": "${{ needs.check-version.outputs.latest_version }}", "short": true },
                    { "title": "Workflow", "value": "${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}", "short": false }
                  ]
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_MONITORING_WEBHOOK }}
          SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK
```

#### Post-Merge Notification (in template repo)

```yaml
# In template repo: .github/workflows/post-merge-squash.yml
- name: Notify Slack - Update complete
  if: success()
  uses: slackapi/slack-github-action@v1.26.0
  with:
    payload: |
      {
        "text": "✅ Template updated: ${{ github.repository }}",
        "attachments": [
          {
            "color": "#00FF00",
            "fields": [
              { "title": "Repository", "value": "${{ github.repository }}", "short": true },
              { "title": "Nx Version", "value": "$(jq -r '.devDependencies.nx' package.json)", "short": true }
            ]
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_MONITORING_WEBHOOK }}
    SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK
```

#### Required Secret

Add `SLACK_MONITORING_WEBHOOK` to:
- `nrwl/nx-template-updater` (for update notifications)
- Each template repo (for post-merge notifications)

Or use organization-level secret if available.

## Open Questions

1. **Where to run squash workflow?**
   - In each template repo (simpler permissions)
   - In updater repo via dispatch (centralized)

## Files to Create

```
nrwl/nx-template-updater/
├── .github/
│   └── workflows/
│       └── check-and-update.yml
├── scripts/
│   ├── check-version.sh
│   ├── update-template.sh
│   └── squash-to-initial.sh
├── config/
│   └── templates.json
└── README.md
```

## Success Criteria

- [ ] Templates automatically updated within 24h of new Nx release
- [ ] PRs created with proper migration (not just version bump)
- [ ] Template repos maintain single "Initial commit"
- [ ] No manual intervention required for happy path
- [ ] Failures are visible and actionable
