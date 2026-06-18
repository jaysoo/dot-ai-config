---
name: pre-pr-review
description: Adversarial multi-dimension review of a branch's uncommitted/committed diff before opening or updating a PR. Fans out review dimensions (correctness, design conformance, copy/voice, hygiene/tests), adversarially verifies each finding, and drafts a terse PR description. Use for a pre-PR review, "review my branch before I open the PR", adversarial PR review, or a conformance gate before push. For deep maintainability/abstraction audits use thermo-nuclear-code-quality-review instead (complementary, not a substitute).
disable-model-invocation: true
---

# Pre-PR Review

A scoped, adversarial review of exactly the files a branch changes, run as a `Workflow` so each dimension and each finding-verification is its own subagent. The point is to catch real defects + conformance violations BEFORE the diff is public, and to hand back a terse PR description grounded in the actual diff.

Distinct from `thermo-nuclear-code-quality-review` (a single deep maintainability/abstraction audit). This skill is breadth-first correctness/conformance with adversarial verification. Run both when the change is large.

## When to use

- Before `create_pr` / `mark_pr_ready`, or before pushing a follow-up to an open PR.
- The user asks to "review the branch", "check before I open the PR", or wants a conformance gate.
- Costs real tokens (spawns several agents). Only run when the user opted into a PR or asked for a review.

## Process

1. **Scope the diff.** Get the exact files in scope - do NOT trust `git diff <default-branch>` blindly (a stale/divergent local default ref can list thousands of unrelated files). Use `git status --short` for uncommitted work, or `git log <merge-base>..HEAD --name-only` for committed. Pass the explicit file list into the workflow; list NEW (untracked) files separately since `git diff` won't show them.
2. **Pick dimensions** that fit the change. Defaults:
   - **correctness** - trace data/prop threading loader -> container -> component; gating/eligibility logic; circular-dep / import-boundary safety; tsconfig project refs match new cross-lib imports; demo-mode short-circuits.
   - **design** - for UI repos, read the repo's `DESIGN.md` (esp. its pre-ship gate list) and check tokens-only colors, no gradient text, no backdrop-blur/glassmorphism, no >1px colored side-stripe, status = icon+label+color, focus-visible, dark mode.
   - **copy** - read `DESIGN.md` voice section + `PRODUCT.md`; factual accuracy, banned AI-voice lexicon, punctuation, casing.
   - **hygiene** - leftover console.log/debug/TODO, dead code, scratch-dir references leaking into commits, and whether new specs actually assert the new behavior (renamed test that still asserts the old thing).
3. **Fan out + adversarially verify.** `pipeline(dimensions, review, verify)`: each dimension agent returns structured findings; each finding is then verified by a skeptic agent that defaults `isReal=false` unless it can cite the exact line. Keep only confirmed findings.
4. **Draft the PR description** in parallel (a separate agent reads the diff) in the user's house style (terse Current/Expected Behavior, just the issue id).
5. **Report** confirmed findings by severity; apply the critical/major ones; surface low-severity as optional. Then proceed to commit/push/PR.

## Workflow template

Inline the file lists as constants (do not rely on `args` - it has arrived undefined). Use `agentType: 'Explore'` for the read-only review agents.

```js
export const meta = {
  name: 'pre-pr-review',
  description: 'Adversarial pre-PR review of a branch diff + PR description draft',
  phases: [{ title: 'Review' }, { title: 'Verify' }],
}

const CWD = '<repo root>'
const MODIFIED = [ /* explicit paths */ ]
const NEW = [ /* untracked paths - Read directly */ ]

const CONTEXT = `Reviewing branch <X> at ${CWD}. ONLY these files are in scope (ignore git-diff-vs-default noise). Inspect modified via \`git diff -- <file>\`, NEW via Read.\n<file lists>\n<invariants to verify>`

const FINDINGS = { type:'object', additionalProperties:false, required:['findings'], properties:{ findings:{ type:'array', items:{ type:'object', additionalProperties:false, required:['title','file','severity','detail'], properties:{ title:{type:'string'}, file:{type:'string'}, line:{type:'string'}, severity:{type:'string', enum:['critical','major','minor','nit']}, detail:{type:'string'}, suggestedFix:{type:'string'} } } } } }
const VERDICT = { type:'object', additionalProperties:false, required:['isReal','reasoning'], properties:{ isReal:{type:'boolean'}, confirmedSeverity:{type:'string', enum:['critical','major','minor','nit']}, reasoning:{type:'string'} } }

const DIMENSIONS = [ {key:'correctness', prompt:'...'}, {key:'design', prompt:'...'}, {key:'copy', prompt:'...'}, {key:'hygiene', prompt:'...'} ]

phase('Review')
const [reviewed, prDraft] = await Promise.all([
  pipeline(
    DIMENSIONS,
    (d) => agent(`${CONTEXT}\n\nDIMENSION: ${d.prompt}`, { label:`review:${d.key}`, phase:'Review', schema:FINDINGS, agentType:'Explore' }),
    (review, d) => parallel((review?.findings || []).map((f) => () =>
      agent(`${CONTEXT}\n\nAdversarially verify this ${d.key} finding. Default isReal=false unless you cite the exact line.\n${JSON.stringify(f)}`,
        { label:`verify:${d.key}`, phase:'Verify', schema:VERDICT })
        .then((v) => ({ ...f, dimension:d.key, verdict:v })))),
  ),
  agent(`${CONTEXT}\n\nDraft a TERSE PR description (Current Behavior 1-3 sentences, Expected Behavior 1-3, ASCII punctuation).`, { label:'pr-description', phase:'Review', schema:{ type:'object', additionalProperties:false, required:['currentBehavior','expectedBehavior'], properties:{ currentBehavior:{type:'string'}, expectedBehavior:{type:'string'}, surfaces:{type:'array', items:{type:'string'}} } } }),
])
const confirmed = reviewed.flat().filter(Boolean).filter((f) => f.verdict?.isReal)
return { confirmed, prDraft }
```

## Gotchas

- Tell the review agents the in-scope file list AND that the local default ref may be stale - otherwise they review unrelated files.
- Pass NEW files as a separate list; `git diff` omits untracked files.
- Feed each dimension the repo's actual `DESIGN.md` / `PRODUCT.md` path so it checks against committed gates, not assumptions.
- The verifier must default to `isReal=false`; this is what kills plausible-but-wrong findings.
- Don't also run the review yourself after delegating - relay the workflow's confirmed findings.
