# Nx Easy Issues: Batch Commands

## Close Stale Issues

For issues older than 6 months with low engagement:

```bash
# Close stale issues
gh issue close -R nrwl/nx 29143 26651 28674 \
  -c "Closing this issue due to inactivity (6+ months). If this issue is still relevant with the latest version of Nx, please feel free to reopen with updated information or create a new issue. Thank you for your contribution!"
```

## Close Issues with Workarounds

For issues where verified workarounds exist:

```bash
# Close with workaround - Example for #30589
gh issue close -R nrwl/nx 30589 \
  -c "Closing this issue as a verified workaround has been provided in the comments above. The workaround addresses the immediate need while we consider a more comprehensive solution in future releases. Please try the workaround with the latest version of Nx. If you encounter any issues, feel free to open a new issue. Thank you!"

# Close with workaround - Example for #27849
gh issue close -R nrwl/nx 27849 \
  -c "Thank you for providing a working solution! Since a verified fix has been shared and tested by the community, I'm closing this issue. The workaround can be applied locally while we evaluate incorporating it into the core. If you'd like to contribute this as a PR, we'd be happy to review it!"
```

## View Multiple Issues Efficiently

Instead of viewing issues one by one:

```bash
# Get details for top 10 easy issues in one command
gh issue list -R nrwl/nx --json number,title,state,labels,body,comments \
  --jq '.[] | select(.number == 29143 or .number == 30589 or .number == 30163 or .number == 26651 or .number == 27849 or .number == 31572 or .number == 31037 or .number == 30649 or .number == 30199 or .number == 29508)'
```

## Create PRs for Documentation Issues

Template for documentation PRs:

```bash
# After making documentation changes
git checkout -b docs/update-nx-release-docs
git add docs/
git commit -m "docs(release): update nx release documentation

- Add missing basic release/publish documentation
- Clarify version handling with '*' in package.json
- Update examples to match current API

Fixes #30163
Fixes #30649"

git push -u origin docs/update-nx-release-docs

gh pr create --title "docs(release): update nx release documentation" \
  --body "$(cat <<'EOF'
## Current Behavior

The nx release documentation is missing basic information about release and publish commands, and the meaning of '*' version in package.json is unclear.

## Expected Behavior

Documentation should clearly explain:
- Basic nx release workflow
- How to use nx release publish
- What '*' version means in project package.json files

## Related Issue(s)

Fixes #30163
Fixes #30649

🤖 Generated with [Claude Code](https://claude.ai/code)
EOF
)"
```

## Batch Update Tutorials

For updating multiple tutorials at once:

```bash
# Create branch for tutorial updates
git checkout -b docs/update-tutorials-eslint-config

# After updates
git add nx-dev/
git commit -m "docs: update tutorials for ESLint flat config format

- Update React monorepo tutorial for .eslint.config.mjs
- Update Angular tutorial for new ESLint config
- Ensure all examples use Nx 20.4.6+ syntax

Fixes #30199"

git push -u origin docs/update-tutorials-eslint-config
```

## Quick Investigation Commands

```bash
# Check if an issue has recent activity
gh issue view -R nrwl/nx 29143 --json comments --jq '.comments[-1].createdAt'

# Find all documentation-labeled issues
gh issue list -R nrwl/nx -l "type: docs" -s open --json number,title

# Export issue data for further analysis
gh issue list -R nrwl/nx -s open -L 100 --json number,title,labels,createdAt,comments \
  --jq '.[] | select(.labels[].name == "type: docs") | {number, title, commentCount: .comments | length}'
```

## Automated Fix Templates

### For Configuration Issues

```bash
# Clone reproduction repo
git clone [REPO_URL] /tmp/claude/repro-[ISSUE_NUMBER]
cd /tmp/claude/repro-[ISSUE_NUMBER]

# Apply fix
# ... make changes ...

# Test the fix
nx affected:test
nx affected:lint
```

### For Documentation Issues

```bash
# Search for the file to update
nx serve-docs nx-dev  # Start docs server
# Navigate to http://localhost:4200 to verify changes
```

## Notes

- Always test fixes with `nx prepush` before creating PRs
- Group related issues into single PRs when possible
- Use descriptive commit messages following conventional commits
- Include "Fixes #ISSUE_NUMBER" in PR descriptions for auto-closing