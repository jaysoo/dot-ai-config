# Extract Nx 21.0 Pre-release Versions

## Task Overview
Extract all beta, rc, and canary versions from Nx 21.0.x releases, sort them according to semantic versioning, and output to `nx-versions.txt`.

## Steps

### 1. Fetch Nx 21.0 Package Information
- Run `npm view nx@21.0 --json` to get detailed package information
- Parse the JSON response to extract version data

### 2. Filter Pre-release Versions
- Extract versions that match patterns:
  - `21.0.x-beta.x`
  - `21.0.x-rc.x`
  - `21.0.x-canary.x`
- Ensure we capture all variations of pre-release identifiers

### 3. Sort Versions According to Semver
- Use proper semantic versioning rules for sorting
- Pre-release versions should be sorted by:
  1. Major.Minor.Patch numbers
  2. Pre-release type (canary < beta < rc)
  3. Pre-release number

### 4. Write Results to File
- Output sorted versions to `nx-versions.txt` in the `.ai/2025-06-06` directory
- One version per line for easy reading

## Implementation Approach

### Script Design
Create a Node.js script (`extract-versions.mjs`) that:
1. Executes `npm view` command
2. Parses the output to find all versions
3. Filters for pre-release versions
4. Sorts using semver library or custom sorting logic
5. Writes results to file

### Reasoning
- Using Node.js for better JSON parsing and string manipulation
- ESM module format for modern JavaScript features
- Programmatic approach ensures accurate filtering and sorting

## Expected Outcome
- A file `nx-versions.txt` containing all Nx 21.0 pre-release versions
- Versions properly sorted according to semver rules
- Clear visibility into the pre-release history of Nx 21.0

## Notes
- The npm registry may have many pre-release versions
- Need to handle different pre-release naming conventions
- Results will be stored in `.ai/2025-06-06/` to avoid polluting the repository