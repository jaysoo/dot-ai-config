# Turbo remote-cache poisoning: findings + working PoC

**Date:** 2026-06-11
**Goal:** Demonstrate that Turborepo remote cache is unsafe without input guarding.
Pick real high-star Turbo repos, find configs where a build reads a file that is
NOT in the cache key, and prove that this lets a malicious branch poison the cache
for `main` with an artifact that runs arbitrary code on load.
**Purpose:** Sales/enablement narrative for Nx Cloud Task Sandboxing.

> Scope note: the end-to-end exploit was run in a LOCAL, self-contained monorepo.
> Real repos were analyzed statically (their public `turbo.json` + `tsconfig`
> graph). No real repo was built, no package was published, nothing reached real
> downstream users. The "published package" section is a conceptual attack-chain
> walkthrough only.

## How Turbo decides the cache key (verified empirically, turbo 2.9.18)

For a task without an explicit `inputs`, the cache key folds in:

- the package's OWN files (git-tracked + untracked-not-ignored), and
- root files listed in `globalDependencies`, the root lockfile, root
  `package.json`, root `turbo.json`, and declared `env` / `globalEnv`.

Two things are therefore INVISIBLE to the key by default, both confirmed by
running the real binary (see PoC):

1. **Gitignored files** read at build time. Proven: a gitignored
   `secret.gen.js` inside a package never appears in `inputs`.
2. **Any file outside the package that is not in `globalDependencies`** - shared
   root configs, sibling shared-config packages, root data/banner files. Proven:
   editing root `shared/brand.js` produced a byte-identical key
   (`ec85d09ea396e535` clean == evil).

There is no mechanism in Turbo that checks the declared inputs actually cover what
the build reads. That gap is the whole vulnerability class.

## Repos analyzed (top non-vercel Turbo repos by stars)

shadcn-ui/ui, supabase, astro, plane, payload, trpc, heroui, next-auth, dub,
novel were the candidate set. Cloned and inspected 6: **shadcn-ui, payload, trpc,
dub, novel, next-auth**.

## Strongest case (verified): nextauthjs/next-auth `docs#build`

This is the textbook exploit - an EXPLICIT `inputs` list that omits entire source
directories the build compiles into its cached output. Unambiguous, and the output
is executable server code.

- `turbo.json` `docs#build.inputs` = `pages/**, utils/**, public/**,
  components/**, theme.config.tsx, typedoc*, vercel.json, next-sitemap.config.cjs,
  next.config.js`. It does NOT list `app/**` or `hooks/**`.
- `docs/app/` is a real Next.js App Router dir: `docs/app/api/cron/route.ts`,
  `docs/app/api/og/route.tsx`. These compile into the cached output.
- `docs#build.outputs` includes `.next/**/*` (and `build/**/*`).
- Reproduced locally (turbo 2.9.18, dry-run hash of `docs#build`):
  - before edit: `2e0720f6fb6999eb`
  - after appending a top-level `console.log` to `docs/app/api/cron/route.ts`:
    `2e0720f6fb6999eb` (IDENTICAL)
  - `app/api/cron/route.ts` is absent from the task's 406 declared inputs.

So a Next.js server route source can change, be compiled into `.next/**`, and
Turbo still computes the same hash and replays the cached artifact. A malicious
branch edits `docs/app/api/cron/route.ts`, seeds the hash, and `main` deploys the
poisoned `.next` server bundle - server-side code execution on the docs deploy.
(Verified by me, not taken on faith - dry-run hashes match before/after.)

## Confirmed exposures (>= 3 repos, concrete named unhashed input)

Each below is a real file, read at build time (via tsconfig `extends`), that lives
outside the consuming package and is absent from `globalDependencies`. Editing it
changes compiled output but not the cache key. The base configs set
output-affecting options (`target`, `module`, `moduleResolution`, `jsx`,
`paths`) - and `paths` is the sharp one: an attacker can remap an import to a
malicious module at compile time.

The shared config must be referenced by RELATIVE PATH to a plain file (not a
workspace package). Hashes below were reproduced before/after editing the file.

| Repo | Unhashed input | Consumed by (built/published) | hash before==after |
|------|----------------|-------------------------------|--------------------|
| **payloadcms/payload** | root `tsconfig.base.json` via `extends: ../../tsconfig.base.json` | 8+ published pkgs: `storage-s3`, `storage-vercel-blob`, `plugin-search`, `translations`, `live-preview-react`, `create-payload-app`, ... | `8fd25c6dd79de644` (`@payloadcms/translations`, target ES2022->ES2017) |
| **shadcn-ui/ui** | root `tsconfig.json` via `extends: ../../tsconfig.json` | published `shadcn` CLI (`bin -> dist/index.js`, millions of installs) | `a69edad1dc8223aa` (`shadcn`, added target ES2015) |

**Disproven: dubinc/dub.** Its shared config IS a workspace package (`tsconfig`),
so `@dub/ui`'s extends (`tsconfig/react-library.json`) resolves through the
dependency graph and Turbo hashes it transitively. Verified: editing
`react-library.json` DID change `@dub/ui`'s hash (`c07b2466e4500c73` ->
`2829a13557d9f38a`). The workspace-package indirection is the accidental fix -
this is the difference between a vulnerable and a safe shared-config setup.

Additional, orthogonal exposure across the loosely-configured repos: none set
`envMode: "strict"`.
In default loose mode, env vars the build reads but does not declare are passed
through yet NOT hashed - so an undeclared env var (or a gitignored file) is a
second poisoning channel even in the better-configured repos.

Notes:
- **trpc** is the counter-example that proves the fix: it lists `tsconfig.json`,
  `tsconfig.build.json`, `.eslintrc.config.js`, `scripts/**` in
  `globalDependencies`, so the tsconfig vector is closed. It still has the
  gitignore + loose-env gaps. The "fix" is exactly manual input guarding -
  which is what Nx Cloud Task Sandboxing does automatically and enforceably.
- **novel** only hashes `**/.env.*local`; exposed via gitignore + loose env.
- shadcn `registry:build` declares `outputs: []` (produces files it does not
  track) - separate correctness smell.

## Working end-to-end PoC (./turbo-cache-poisoning-poc)

Self-contained pnpm+turbo monorepo mirroring the payload shape (no
`globalDependencies`; a package build reads root `shared/brand.js` and inlines it
into its artifact). `run-poc.sh`:

```
STEP 1  main: clean build  -> key ec85d09ea396e535, clean artifact, no payload
STEP 2  attacker branch: edit ONLY shared/brand.js (add payload), force build
        -> SAME key ec85d09ea396e535, poisoned artifact written to shared cache
STEP 3  victim on clean main (verified: zero payload in source), fresh tree
        -> cache HIT ec85d09ea396e535 -> restores attacker artifact
RESULT  victim runs:
          [PWNED] arbitrary code executing inside the cached artifact
          [PWNED] can read $HOME -> .CFUserTextEncoding, .DDPreview, .DS_Store
        and /tmp/PWNED_BY_CACHE.txt is created on the victim machine
```

The victim never edited the malicious file, never saw the payload in their tree,
and did not build - they replayed the attacker's artifact from cache because the
key matched. That is the complete chain: cache poisoning -> arbitrary code
execution on every machine that pulls the cache.

Run it: `cd turbo-cache-poisoning-poc && pnpm install && bash run-poc.sh`

## HTTP remote-cache poisoning (real network, not a shared dir)

`remote-cache-server.mjs` is a minimal but real implementation of Turbo's open
`/v8/artifacts/:hash` protocol (same one self-hosted caches like
`ducktors/turborepo-remote-cache` implement). `run-poc-http.sh` points Turbo at it
with `--remote-only` (`--cache=remote:rw`) so every read/write crosses HTTP.

The server access log IS the proof:

```
PUT  fa3ffbf974112528  <- 665 bytes   main uploads CLEAN artifact
GET  fa3ffbf974112528  -> 200 665     victim pulls clean (round-trip works)
PUT  fa3ffbf974112528  <- 678 bytes   attacker OVERWRITES, poisoned, SAME hash
GET  fa3ffbf974112528  -> 200 678     victim on clean main pulls POISONED  -> [PWNED]
PUT  deadbeefcafe0000  <- 43 bytes    raw curl, arbitrary bytes, made-up hash -> 202
GET  deadbeefcafe0000  -> 200         server returns them: ZERO content validation
```

Victim output after the HTTP pull:

```
[PWNED] arbitrary code executing inside the cached artifact
[PWNED] can read $HOME -> .CFUserTextEncoding, .DDPreview, .DS_Store
/tmp/PWNED_BY_CACHE.txt created (poisoned over HTTP)
```

Two independent facts the server demonstrates:

1. The cache is keyed by the INPUT hash, not a content hash of the output. The
   server never checks that the uploaded bytes correspond to the hash, so any
   holder of a write token (every branch, every CI job - the token is shared)
   can store arbitrary bytes under any hash. The raw `curl PUT` returning 202 for
   `deadbeefcafe0000` makes this concrete: no repo, no build, just curl.
2. Turbo signing (off by default) would not help: it signs that the UPLOADER held
   the key, it does not bind the artifact to its inputs. An authorized branch can
   still poison `main`.

Run it: `cd turbo-cache-poisoning-poc && pnpm install && bash run-poc-http.sh`

## Supply-chain: cache poisoning -> published package -> consumer RCE (../turbo-supply-chain-poc)

End-to-end, fully local PoC. A publishable package (`poc-widget`) whose build
inlines an unhashed root file (`shared/banner.js`) into BOTH its `dist/index.js`
AND a generated `postinstall.js`. The HTTP remote cache server from above is
reused. `run-supply-chain.sh`:

```
STEP 1  main: clean build -> PUT clean artifact to HTTP cache; pack; consumer install -> benign
STEP 2  attacker branch: edit ONLY shared/banner.js (payload), build --cache=remote:w
        -> poisoned artifact PUT under the SAME hash 48244ab055ecf941
STEP 3  release pipeline on CLEAN main (no payload in source): turbo build --remote-only
        -> cache HIT 48244ab055ecf941, release NEVER rebuilds, restores poisoned outputs
        -> npm pack -> tarball now contains the poisoned postinstall.js
STEP 4a consumer: `npm install poc-widget`  -> postinstall runs -> RCE on consumer
STEP 4b consumer: `require('poc-widget')`   -> poisoned dist runs -> RCE on consumer
```

Server log proves the round trip: `PUT 621` (clean) then `PUT 683` (poisoned,
same hash) then `GET 200 683` (release pulls poisoned). The release engineer's
source tree is clean; they only ran `turbo build && npm pack`. The malicious code
never appeared in a reviewed diff on `main`.

Two delivery vectors, different mitigations:

- **postinstall.js** - runs automatically on `npm install`. Mitigated only if the
  consumer sets `ignore-scripts` (NOT the npm default; npm/yarn-classic run
  scripts by default, pnpm 9+ blocks them). Note: this machine has
  `ignore-scripts=true` set globally, so the demo runs the consumer install with
  `--ignore-scripts=false` to represent a default consumer.
- **dist/index.js (import-time)** - runs the moment the consumer does
  `require('poc-widget')`. `ignore-scripts` does NOT help here. Demonstrated with
  `--ignore-scripts` still set: the marker is dropped anyway. This is the more
  serious, harder-to-mitigate vector.

Run it: `cd turbo-supply-chain-poc && pnpm install --ignore-scripts && bash run-supply-chain.sh`

## Earlier framing: poisoning a published package (now demonstrated above)

shadcn's published CLI and dub's `@dub/ui` / `@dub/utils` build through exactly
the unhashed-tsconfig path above. The chain a real attacker would use:

1. Open an innocuous PR that touches only the unhashed file (root tsconfig /
   shared config) - reviewers see a one-line config tweak, CI is green.
2. CI on that branch builds and WRITES to the shared remote cache under the same
   key `main` will compute (the changed file is not in the key).
3. The release job on `main` gets a cache HIT and ships the attacker's artifact -
   with, e.g., a `paths` remap pulling in a malicious module, or inlined code -
   to npm. Postinstall or import-time code then runs on every downstream install.

Preconditions: shared writable remote cache across branches (the default for
Turbo remote cache / CI setups) and a build that reads an unhashed input (shown
above). No malicious-looking source ever lands on `main`.

## Side-by-side: Nx + Task Sandboxing (../nx-sandbox-poc)

Same misconfig rebuilt in a real Nx workspace (`packages/lib` build inlines
root `shared/brand.js`, which is outside the project's declared inputs).
`run-nx-poc.sh` has three parts:

**PART A - BEFORE (honest baseline):** Nx's default cache is poisonable the SAME
way Turbo's is. No input-hash cache is safe by itself - whoever builds a hash
first owns the entry, and the undeclared file is not in the hash. A malicious
branch seeds the hash with a poisoned artifact; the victim on clean main gets a
`[local cache]` hit and runs the attacker's code (`[PWNED]`, reads `$HOME`, drops
the marker). The protection is the sandbox, not the tool's logo.

**PART B - AFTER (Task Sandboxing):** the build runs in a clean root that exposes
ONLY the declared inputs. `shared/` was never declared, so it is absent:

```
sandbox exposes: node_modules  nx.json  package.json  packages   (no 'shared/')
Error: ENOENT: no such file or directory, open '.../nx-sandbox/shared/brand.js'
sandbox build exit code: 1  -> undeclared input caught, nothing cached, cannot be poisoned
```

The missing input fails the build loudly at build time instead of silently
producing a poisonable artifact. (Shown here via an OS-level isolation analog -
copy only declared inputs into a clean root and run. Nx Cloud Task Sandboxing
does exactly this isolation automatically and enforceably in the task runner; the
paid cloud product was not run in this environment.)

**PART C - THE FIX:** declare the input
(`inputs: [..., "{workspaceRoot}/shared/**"]`). Now editing `shared/brand.js`
busts the hash - the rebuild shows `nx run lib:build` WITHOUT `[local cache]`, so
there is no false replay. Sandboxing is what FORCES you to declare it: the build
will not pass until every read is a declared input.

Run it: `cd nx-sandbox-poc && pnpm install && bash run-nx-poc.sh`

## Why this is the Nx Cloud pitch

Turbo trusts the author to enumerate every input. Miss one (or have a teammate
read a gitignored/shared file) and the cache is silently poisonable across
branches. Nx Cloud Task Sandboxing runs the task in a sandbox that exposes ONLY
declared inputs, so an undeclared read FAILS LOUDLY at build time instead of
silently producing a cache-poisonable artifact. The vulnerability here is not a
Turbo bug - it is the absence of input guarding, which is precisely the feature
being sold.

## Honesty / calibration

- Mechanism (key collision, gitignore exclusion, root-file exclusion) was run
  against the real turbo 2.9.18 binary - proven, not asserted.
- Real-repo findings are static (config + tsconfig graph). The repos were not
  built end-to-end and no cache was actually poisoned in them.
- Nothing was published; no real downstream user was affected.
