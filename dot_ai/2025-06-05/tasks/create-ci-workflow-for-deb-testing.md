# Plan: Create Simple CI Workflow for .deb Package Testing

**Task Type:** New Feature  
**Date:** 2025-06-05  
**Objective:** Create a minimal GitHub Actions CI workflow that builds a .deb package and verifies it can be installed and run.

## Requirements
- Test on Ubuntu 24.04 (Noble Numbat)
- Build .deb package
- Install package with `apt-get install`
- Verify `nx --version` works
- No error handling needed - fail fast if anything goes wrong

## Implementation Steps

### Step 1: Create CI Workflow
**File:** `.github/workflows/ci.yml`

Create workflow that:
1. Runs on Ubuntu 24.04
2. Installs build dependencies
3. Builds .deb package
4. Installs the .deb package
5. Runs `nx --version`

**Key elements:**
- Use `ubuntu-24.04` runner (not ubuntu-latest which is 22.04)
- Trigger on push and PR
- No matrix, no complex error handling

### Step 2: Build Process
```bash
# Install dependencies
sudo apt-get update
sudo apt-get install -y devscripts build-essential debhelper nodejs npm

# Build package
debuild -us -uc -b
```

### Step 3: Test Process
```bash
# Install .deb
sudo apt-get install -y ./nx_*.deb

# Test nx command
nx --version
```

## Expected Outcome
Pipeline passes = .deb installs correctly and nx command works
Pipeline fails = Something is broken (visible in logs)