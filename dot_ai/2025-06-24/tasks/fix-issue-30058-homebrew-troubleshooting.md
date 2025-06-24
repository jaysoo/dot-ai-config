# Plan: Fix Issue #30058 - Add Homebrew Troubleshooting for Global Nx Installation

**Created**: 2025-06-24
**Issue**: https://github.com/nrwl/nx/issues/30058
**Type**: Documentation improvement
**Priority**: MEDIUM, AI Suitability: HIGH

## Problem Summary

Users who installed Nx globally using npm from a Homebrew-installed Node.js may encounter confusion when trying to uninstall or update Nx. The issue occurs when:
1. `which nx` shows `/opt/homebrew/bin/nx`
2. `brew list` shows no Nx installation (because it was installed via npm, not brew)
3. `npm uninstall -g nx` doesn't work if they've switched to a node version manager

## Solution Overview

Add troubleshooting documentation to explain this edge case and provide the fix:
- Use the Homebrew-installed npm directly: `/opt/homebrew/bin/npm uninstall -g nx`

## Implementation Plan

### Step 1: Locate the Target Documentation File
- [ ] Find the file for https://nx.dev/recipes/installation/update-global-installation
- [ ] Review existing content to understand the structure

### Step 2: Add Homebrew Edge Case Section
- [ ] Add a new subsection about Homebrew-installed Node.js
- [ ] Include clear symptoms of the issue
- [ ] Provide step-by-step resolution

### Step 3: Content to Add

```markdown
## Troubleshooting Homebrew Node.js Installations

If you installed Nx globally using npm from a Homebrew-installed Node.js, you might encounter issues when trying to uninstall or update Nx.

### Symptoms

- Running `which nx` shows `/opt/homebrew/bin/nx`
- `brew list` doesn't show Nx (because it was installed via npm, not Homebrew)
- `npm uninstall -g nx` doesn't work if you've switched to a node version manager

### Solution

The Nx executable is linked to Homebrew's npm installation. To uninstall it:

```bash
# Use Homebrew's npm directly to uninstall
/opt/homebrew/bin/npm uninstall -g nx

# Verify it's removed
which nx  # Should return "nx not found"

# Now you can reinstall using your preferred method
npm install -g nx@latest
```

This ensures you remove the Homebrew-linked version before installing with your current Node.js setup.
```

### Step 4: Validate Changes
- [ ] Ensure the documentation renders correctly
- [ ] Check that code blocks are properly formatted
- [ ] Verify the solution is clear and actionable

### Step 5: Testing
- [ ] Run documentation build locally
- [ ] Check for any broken links or formatting issues

## Expected Outcome

- Users encountering the Homebrew edge case will find clear instructions
- The documentation will help users understand why standard uninstall commands don't work
- Clear resolution steps will prevent frustration

## Files to Modify

1. `docs/shared/recipes/installation/update-global-installation.md` (likely location)

## PR Description

```markdown
## Current Behavior

Users who installed Nx globally using npm from Homebrew-installed Node.js have no clear documentation on how to handle uninstall issues when switching to node version managers.

## Expected Behavior

Documentation includes a troubleshooting section explaining the Homebrew edge case and how to properly uninstall Nx in this scenario.

## Related Issue(s)

Fixes #30058
```

## CRITICAL: Implementation Tracking

Keep track of implementation progress in this document as work proceeds.