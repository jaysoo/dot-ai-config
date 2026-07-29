---
name: ocean-trivy-verify
description: >
  Verify CVE/image-vulnerability fixes for ocean (Nx Cloud / Polygraph) docker
  images by building the real image locally and scanning it with the exact
  trivy version our trivy-operator deploys. Covers finding where a flagged
  package actually lives (base-image npm bundle vs app node_modules vs inlined
  esbuild code), the scoped rego ignorePolicy escape hatch in
  cloud-infrastructure, and the disk/JSON gotchas. Triggers on "trivy",
  "verify CVE fix", "scan the image", "image vulnerability", "trivy alert",
  "is the CVE gone", "check the docker image for vulns".
---

# Ocean Trivy Verify (CVE fixes in docker images)

Worked example: CLOUD-4926 (node-tar CVE-2026-59873), ocean PR #12614, 2026-07-29.

## 0. Pin the scanner version

Match what prod runs, not latest. Deployed version lives in
`cloud-infrastructure/kubernetes/kustomize/overlays/*/nx-cloud/trivy-operator/values.yaml`
under `trivy.image.tag` (0.63.0 as of 2026-07). Run it via docker, no install:

```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  mirror.gcr.io/aquasec/trivy:<TAG> image --scanners vuln <IMAGE>
```

## 1. Locate the vulnerable copy FIRST

A package can exist in 4 places; the fix differs per place:

1. **Base image npm bundle** (`usr/local/lib/node_modules/npm/node_modules/...`):
   comes from `node:XX-alpine`, not from our lockfile. Check what base ships:
   `docker run --rm node:22-alpine3.23 sh -c 'npm -v'` and read the dep's
   package.json inside. Fix = pin newer npm in runtime stage
   (`RUN npm install -g npm@<exact>`) or wait for base bump. npm publishes with
   BUNDLED deps, so `npm view npm@X dependencies.<pkg>` gives the range but the
   installed version is whatever the tarball vendored - verify in a container.
2. **App node_modules in image** (`/app/node_modules/...`): from
   `dist/apps/<app>/package.json` + lockfile via builder `pnpm install --prod`.
   Fix = bump workspace dep/override in ocean root.
3. **Inlined by esbuild** (client-bundle, server-build chunks): no package.json
   in image, invisible to trivy. Grep bundles for module specifiers
   (`from "tar"`, `require("tar")`) AND for library-internal strings
   (e.g. `ustar` for node-tar) - declared-only deps can differ from inlined code.
4. **Declared but never installed**: pnpm override rewrites lockfile importer
   specifiers, so package.json text can lie. Check `node_modules/<pkg>/package.json`
   and the lockfile importer block, not the declaration.

Quick scan of the bare base image reproduces base-only findings without
building anything:

```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  mirror.gcr.io/aquasec/trivy:<TAG> image --scanners vuln node:22-alpine3.23
```

## 2. Build the real image and scan

```bash
# dist/apps/<app> must exist and be FRESH - stale dist lockfiles pin old dep
# versions for the builder's pnpm install and give false positives/negatives.
docker build -t <app>-cve-test -f apps/<app>/Dockerfile .

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  mirror.gcr.io/aquasec/trivy:<TAG> image --scanners vuln <app>-cve-test \
  2>/dev/null | grep -c <CVE-ID>   # expect 0 after fix
```

Spot-check versions inside the image:

```bash
docker run --rm <app>-cve-test sh -c \
  'npm -v; node -p "require(\"/app/node_modules/<pkg>/package.json\").version"'
```

## 3. Gotchas (each cost real time)

- **`no space left on device`**: trivy exports the full image via the daemon.
  Fix: `docker builder prune -af`, `docker image prune -f`,
  `docker container prune -f`. NEVER `docker volume prune` - stopped worktree
  mongo/valkey stacks keep data in "unattached" volumes.
- **JSON output**: `--output /tmp/x.json` writes inside the ephemeral trivy
  container and vanishes. Mount a dir: `-v $PWD:/out ... --output /out/x.json`.
- **Piped exit codes lie in fish**: check `$pipestatus[1]`, or write JSON to a
  file and check it parses.
- **Severity mismatch NVD vs trivy**: NVD shows CVSS 3.1, trivy prefers CVSS
  4.0 - same CVE can be High on NVD and Critical in trivy. Not a bug.
- **Fixing one advisory can surface the next**: after clearing the target CVE,
  re-read the scan for NEW findings on the same package (CLOUD-4926: pinning
  npm 11.18.0 cleared the critical but its bundled tar 7.5.19 carried a fresh
  MEDIUM fixed only in 7.5.21).

## 4. Suppression path (when no fix exists upstream)

Scans come from trivy-operator, deployed by ArgoCD from cloud-infrastructure
kustomize overlays (dev, staging, prod EU, prod NA under
`kubernetes/kustomize/overlays/*/nx-cloud/trivy-operator/values.yaml`).

- Chart <= 0.29.0 mounts the ignore file as plain `.trivyignore`; trivy picks
  format by EXTENSION, so YAML-scoped ignores (paths/purls/statement) are
  silently misparsed. `trivy.ignoreFileName` (allows `.trivyignore.yaml`)
  needs chart >= 0.33.x.
- Chart values.yaml comments can be stale vs the actual chart template - check
  the template at the chart's APP version tag (helm index maps chart version
  to app version; chart 0.29.0 = app v0.27.0), e.g. `ignoreFile` must be a
  YAML LIST because the template `range`s over it.
- On current chart, the scoped equivalent is a rego `trivy.ignorePolicy`:

```rego
package trivy
default ignore = false
ignore {
  input.VulnerabilityID == "<CVE-ID>"
  startswith(input.PkgPath, "usr/local/lib/node_modules/npm/")
  time.now_ns() < time.parse_rfc3339_ns("<EXPIRY>T00:00:00Z")
}
```

  Path-scope it so an app copy still alerts; add a time guard so it
  self-expires. Test the exact policy text with the deployed trivy version
  against the base image before opening the PR (step 0 command +
  `--ignore-policy /pol/policy.rego`).
- Prefer fixing in the image over suppressing: suppression is config debt in a
  second repo. CLOUD-4926 ended with the npm pin in ocean and the infra
  suppression PR closed unmerged.
