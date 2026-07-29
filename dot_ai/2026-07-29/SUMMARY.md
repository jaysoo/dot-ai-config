# 2026-07-29 Summary

## CLOUD-4926: node-tar CVE-2026-59873 in frontend/polygraph images (completed)

Approach pivoted twice before landing:

1. Prior session's `rm -rf npm` Dockerfile commit rejected as trash; branch reset.
2. Suppression path built and verified (scoped rego `ignorePolicy` in
   cloud-infrastructure trivy-operator overlays, PR #5391) after finding the
   chart <= 0.29.0 cannot mount YAML-scoped ignore files (plain `.trivyignore`
   name, format picked by extension; values.yaml example comment was stale vs
   chart template - `ignoreFile` is a LIST).
3. Final: fix at source instead - ocean PR #12614 (branch CLOUD-4926, commit
   `725c661fc5`), infra PR #5391 closed unmerged by Jack.

Final PR content:
- Runtime Dockerfiles pin `npm@11.18.0` (first npm bundling tar >= 7.5.19);
  node base images all ship vulnerable copies (node:22 = npm 10.x dead line,
  node:24 = npm 11.16.0/tar 7.5.15).
- Workspace tar 7.5.20 -> 7.5.22: local trivy scan surfaced follow-on MEDIUM
  GHSA-r292-9mhp-454m (fixed 7.5.21) on our own tar. Surgical 12-line lockfile
  edit (full pnpm resolve rewrites unrelated peer resolutions - pre-existing
  drift); validated with `CI=true pnpm install --frozen-lockfile`.
- client-bundle declared tar 6.1.11 -> 7.5.22 (was inert: root override +
  esbuild inlining meant 7.5.20 actually shipped; declaration was the lie).
- tar v6 API names migrated: 3x `onentry` -> `onReadEntry` (v7 de-alias shim
  was carrying them since the 7.x bump in #12438).

Verification: built the real nx-cloud image locally, scanned with trivy 0.63.0
(deployed operator version): 0 findings for CVE-2026-59873, 0 criticals; only
remaining tar finding is MEDIUM on npm's bundled 7.5.19 (no npm release bundles
>= 7.5.21 yet; Dockerfile comment tracks removal).

Usage audit findings: nx-cloud server genuinely uses node-tar (terminal-output
and AI-fix-log extraction, inlined + external metrics-stream-worker); polygraph
ships zero node-tar (dev-only transitive via @remix-run/dev, pruned from image).

New skill: `ocean-trivy-verify` (dot_claude/skills/) - full build+scan+locate
workflow with gotchas (docker disk exhaustion, ephemeral-container --output,
chart-vs-app version mapping, bundled-dep verification).

Severity note for Linear: NVD High = CVSS 3.1 (7.5), trivy Critical = CVSS 4.0
(9.2) - same CVE, different scoring generations. Linear comment not posted yet.
