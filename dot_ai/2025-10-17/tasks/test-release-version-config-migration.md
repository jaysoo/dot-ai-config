# Test Scenarios for release-version-config-changes Migration

## Test 1: nx.json with full generatorOptions (promotes all properties)
Add to `/tmp/nx-v22-migration-tests/js-test/nx.json`:
```json
{
  "release": {
    "version": {
      "generatorOptions": {
        "specifierSource": "prompt",
        "currentVersionResolver": "registry",
        "currentVersionResolverMetadata": { "tag": "latest" },
        "fallbackCurrentVersionResolver": "disk",
        "versionPrefix": "auto",
        "updateDependents": "auto",
        "logUnchangedProjects": true,
        "preserveLocalDependencyProtocols": false
      }
    }
  }
}
```

**Expected**: All properties promoted to top-level in `release.version`, `generatorOptions` removed

## Test 2: nx.json with install options (moves to versionActionsOptions)
Add to `/tmp/nx-v22-migration-tests/js-test/nx.json`:
```json
{
  "release": {
    "version": {
      "generatorOptions": {
        "skipLockFileUpdate": true,
        "installArgs": "--legacy-peer-deps",
        "installIgnoreScripts": true
      }
    }
  }
}
```

**Expected**: Creates `versionActionsOptions` with these 3 properties, adds `preserveLocalDependencyProtocols: false`

## Test 3: nx.json with packageRoot (replaces with manifestRootsToUpdate)
Add to `/tmp/nx-v22-migration-tests/js-test/nx.json`:
```json
{
  "release": {
    "version": {
      "generatorOptions": {
        "packageRoot": "dist/{projectName}"
      }
    }
  }
}
```

**Expected**: `generatorOptions.packageRoot` → `manifestRootsToUpdate: ["dist/{projectName}"]`, adds `preserveLocalDependencyProtocols: false`

## Test 4: nx.json with preserveLocalDependencyProtocols: true (removes it)
Add to `/tmp/nx-v22-migration-tests/js-test/nx.json`:
```json
{
  "release": {
    "version": {
      "generatorOptions": {
        "preserveLocalDependencyProtocols": true
      }
    }
  }
}
```

**Expected**: Entire `generatorOptions` removed, just leaves `release.version: {}`

## Test 5: nx.json with release groups
Add to `/tmp/nx-v22-migration-tests/js-test/nx.json`:
```json
{
  "release": {
    "groups": {
      "my-group": {
        "projects": ["my-lib"],
        "version": {
          "generatorOptions": {
            "specifierSource": "prompt",
            "skipLockFileUpdate": true
          }
        }
      }
    }
  }
}
```

**Expected**: Same transformations apply within the group's version config

## Test 6: my-lib/project.json with generatorOptions
Add to `/tmp/nx-v22-migration-tests/js-test/my-lib/project.json`:
```json
{
  "name": "my-lib",
  "release": {
    "version": {
      "generatorOptions": {
        "currentVersionResolver": "registry",
        "versionPrefix": "v"
      }
    }
  }
}
```

**Expected**: Properties promoted, `generatorOptions` removed, adds `preserveLocalDependencyProtocols: false`

## Test 7: my-lib/package.json with nx.release.version.generatorOptions
Modify `/tmp/nx-v22-migration-tests/js-test/my-lib/package.json` to add:
```json
{
  "name": "my-lib",
  "version": "0.0.1",
  "nx": {
    "release": {
      "version": {
        "generatorOptions": {
          "currentVersionResolver": "git-tag",
          "installArgs": "--frozen-lockfile"
        }
      }
    }
  }
}
```

**Expected**: `currentVersionResolver` promoted, `installArgs` moved to `versionActionsOptions`, adds `preserveLocalDependencyProtocols: false`

## Recommended Test Order
1. Start with Test 1 (full options) - comprehensive test
2. Run migration, verify changes
3. Test another scenario on a fresh checkout
4. Or combine multiple scenarios if they don't conflict

## Commands
```bash
cd /tmp/nx-v22-migration-tests/js-test
git checkout main
# Edit nx.json with test scenario
git add -A && git commit -m "test: add release version generatorOptions"
git checkout -b test-release-version-migration
printf '\n' | npx nx migrate 22.0.0-beta.6
npm install --legacy-peer-deps
npx nx migrate --run-migrations
git diff nx.json
```
