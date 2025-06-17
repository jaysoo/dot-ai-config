# Update for nx-easy-issues.md Scoring Tables

Please update the scoring criteria tables in the nx-easy-issues.md file as follows:

## Updated Positive Scoring Table

```markdown
### ✅ Positive Scoring

| Criteria                       | Score | Notes                              |
| :----------------------------- | :---- | :--------------------------------- |
| Has VERIFIED workaround        | +5    | "confirmed working", check marks   |
| User provided code fix         | +4    | "here's the fix", includes diff    |
| Has reproduction (GitHub repo) | +3    | Detects repro links + keywords     |
| Documentation-related          | +3    | Labels or mentions `docs`          |
| Simple config fix              | +3    | Clear config change patterns       |
| Workaround posted              | +2    | "workaround" in comments/body      |
| Dependency update              | +1    | Mentions "update", "upgrade", etc. |
| Older than 6 months            | +1    | Based on `createdAt`               |
| Low engagement                 | +1    | <5 comments + <5 reactions         |
| Config/setup issue             | +1    | Mentions "config", "install", etc. |
```

## Updated Negative Scoring Table

```markdown
### 🚫 Negative Scoring

| Criteria                             | Penalty | Notes                               |
| :----------------------------------- | :------ | :---------------------------------- |
| Marked or labeled as breaking        | -10     | Excludes automatically              |
| Requires architectural changes       | -8      | "refactor", "redesign" keywords     |
| Requires native module compilation   | -8      | wasm, node-gyp, platform-specific   |
| Issue in upstream dependency         | -6      | Not fixable in Nx codebase          |
| Package manager specific issue       | -6      | npm/yarn/pnpm errors                |
| Module system mismatch               | -5      | ESM/CommonJS conflicts              |
| Complex discussion (>10 comments)    | -5      | >3 unique participants              |
| Negative sentiment (frustrated, etc) | -5      | Placeholder: simple sentiment check |
| Complex migration issue              | -4      | After version upgrades              |
| Multiple failed fix attempts         | -4      | Previous PRs closed                 |
| Bot asked for reproduction           | -3      | Indicates issue is not actionable yet |
```

## Key Changes Summary
1. Added 2 new high-value positive criteria
2. Added 6 new negative criteria to filter out complex issues
3. Adjusted scores: Documentation +3 (was +2), Dependency +1 (was +2)
4. Increased minimum score threshold from 2 to 4