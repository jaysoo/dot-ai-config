# Branch Recovery Plan

## Current Situation

I made 4 commits directly on master instead of creating feature branches:

1. `16a7eb3b7f` - fix(eslint): add performance timing logs to debug ignore check overhead (Issue #27849)
2. `371b86b71c` - feat(angular): deprecate simpleName option in library generator (Issue #29508)
3. `fb498572dd` - docs(react): update tutorial for ESLint flat config format (Issue #30199)
4. `f1d161a1a0` - docs(next): fix incorrect build output path and vite.config.ts mention (Issue #31037)

## Recovery Steps

We can create branches retroactively from these commits:

```bash
# Reset master to before my changes
git reset --hard 9e8c1a1062

# Create branch for Issue #31037 (Next.js docs)
git checkout -b fix/next-docs-build-output f1d161a1a0

# Create branch for Issue #30199 (React tutorial)
git checkout -b docs/react-tutorial-eslint-config fb498572dd

# Create branch for Issue #29508 (Angular deprecation)
git checkout -b feat/angular-deprecate-simplename 371b86b71c

# Create branch for Issue #27849 (ESLint performance)
git checkout -b fix/eslint-performance-logs 16a7eb3b7f
```

## Alternative: Cherry-pick Approach

If you prefer to keep master clean, we can:

1. Reset master to the original state
2. Create individual branches from the clean master
3. Cherry-pick each commit onto its respective branch

```bash
# Save current state
git branch backup-master

# Reset master
git checkout master
git reset --hard 9e8c1a1062

# Create branches and cherry-pick
git checkout -b fix/issue-31037-next-docs
git cherry-pick f1d161a1a0

git checkout -b fix/issue-30199-react-tutorial
git cherry-pick fb498572dd

git checkout -b feat/issue-29508-angular-deprecation
git cherry-pick 371b86b71c

git checkout -b fix/issue-27849-eslint-performance
git cherry-pick 16a7eb3b7f
```

## Lessons Learned

For future issues, I should:
1. Always create a feature branch first: `git checkout -b fix/issue-XXXXX`
2. Make commits on the feature branch
3. Push the branch: `git push -u origin fix/issue-XXXXX`
4. Create PR from the branch

Would you like me to execute one of these recovery plans?