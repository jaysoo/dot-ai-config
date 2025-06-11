# Installation Methods for Private GitHub Repos

## Option 1: GitHub CLI (gh) - Recommended
```bash
# Install using gh (GitHub CLI)
gh api repos/nrwl/raw-docs/contents/install.sh --jq '.content' | base64 -d | bash
```

**Pros:**
- Uses existing GitHub authentication
- No token management needed
- Clean and secure

**Cons:**
- Requires `gh` CLI installed and authenticated

## Option 2: Environment Variable Token
```bash
# Set token as environment variable (not committed)
export GITHUB_TOKEN="your-personal-access-token"

# Use in curl
curl -fsSL -H "Authorization: token $GITHUB_TOKEN" \
  "https://raw.githubusercontent.com/nrwl/raw-docs/main/install.sh" | bash
```

**Pros:**
- Works with standard curl
- Token not in command history if exported first

**Cons:**
- Requires manual token management

## Option 3: Direct Git Clone
```bash
# Clone, run install, then optionally remove
git clone https://github.com/nrwl/raw-docs.git /tmp/raw-docs-installer && \
  bash /tmp/raw-docs-installer/install.sh && \
  rm -rf /tmp/raw-docs-installer
```

**Pros:**
- Uses existing git authentication
- No special tools needed

**Cons:**
- Less elegant than one-liner

## Option 4: NPX Package (Future)
```bash
# If published as npm package
npx @nrwl/raw-docs-installer
```

**Pros:**
- Very clean syntax
- Handles updates well

**Cons:**
- Requires publishing to npm
- More setup work

## Option 5: GitHub Release Assets
```bash
# Download from releases (if public releases are enabled)
curl -fsSL https://github.com/nrwl/raw-docs/releases/latest/download/install.sh | bash
```

**Pros:**
- No authentication needed if releases are public
- Clean URL

**Cons:**
- Requires setting up releases
- May still need auth for private repos

## Recommended Approach

For immediate use with a private repo, I recommend **Option 1 (GitHub CLI)** because:

1. Most developers already have `gh` installed and configured
2. No token management needed
3. Secure and clean
4. Works with SSO and 2FA

### Implementation in README:

```markdown
## Quick Install

Using GitHub CLI (recommended):
```bash
gh api repos/nrwl/raw-docs/contents/install.sh --jq '.content' | base64 -d | bash
```

Or with personal access token:
```bash
export GITHUB_TOKEN="your-token-here"
curl -fsSL -H "Authorization: token $GITHUB_TOKEN" \
  "https://raw.githubusercontent.com/nrwl/raw-docs/main/install.sh" | bash
```

Or clone and run:
```bash
git clone https://github.com/nrwl/raw-docs.git /tmp/raw-docs-installer && \
  bash /tmp/raw-docs-installer/install.sh && \
  rm -rf /tmp/raw-docs-installer
```
```