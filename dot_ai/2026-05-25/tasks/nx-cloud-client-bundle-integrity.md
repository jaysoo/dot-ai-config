# Nx Cloud client bundle integrity (signed manifest + harden update path)

**Date:** 2026-05-25
**Status:** Draft, not yet filed in Linear
**Trigger:** Socket.dev alerts on `nx@22.7.3` flagged `dist/src/command-line/nx-cloud/utils.js` as obfuscated (conf 0.9). Source is 42 lines of plain TS; "obfuscation" label is from scanning bundled dist. False positive on the surface, but the underlying mechanism the scanner is gesturing at -- auto-fetching + `require()`-ing a tarball with only TLS as the integrity guarantee -- is a real supply-chain gap.

## Current behavior

`verifyOrUpdateNxCloudClient` (`packages/nx/src/nx-cloud/update-manager.ts:63`) talks to `process.env.NX_CLOUD_API || options?.url || 'https://cloud.nx.app'`. Server returns `{ valid, version, url }`. On invalid, client:

1. `axios.get(url, { responseType: 'stream' })` -> tarball (`:327`)
2. gunzip + tar-extract into `<runnerBundleInstallDirectory>/<version>/` (`:340-376`)
3. `require(fullPath)` (`:139`)
4. Calls `nxCloudClient.commands[commandName]()` where `commandName` is a string passed from caller (`utils.ts:40`)

No signature on tarball. No hash check. No commandName allowlist. If `cloud.nx.app` distribution is ever compromised, or a user is MITM'd on a non-HSTS network, RCE on every Nx invocation that triggers a refresh (every 30 min minimum per `shouldVerifyInstalledRunnerBundle`).

## Expected behavior

Cloud bundle integrity verified before `require()`. Auto-update still works -- this is not "freeze the bundle", it's "verify what the bundle is before running it".

## Proposed work

1. **Signed manifest in verify response.**
   - Server returns `{ valid, version, url, sha256, signature }` where `signature` = ed25519 over `sha256||version`.
   - Pin ed25519 pubkey in nx source.
   - Client: stream tarball -> sha256 hash while writing to disk -> verify hash matches -> verify signature -> only then `require()`.
   - Backwards compat: missing `sha256`/`signature` -> warn once + allow for one minor, then enforce in next minor. Enterprise self-hosted servers need migration window.

2. **Allowlist `commandName` in `executeNxCloudCommand` (`utils.ts:40`).**
   - Currently `nxCloudClient.commands[commandName]()` will dispatch to any string key. Cheap defense in depth.
   - Hardcoded set of expected commands (`connect`, `onboard`, etc.) -- whatever cloud-bundle currently ships as `.commands.*`.

3. **Refuse silent fallback in `getCloudOptions` catch (`utils.ts:23`).**
   - Currently `try { return getCloudOptions() } catch { return {} }`. Silently drops `customProxyConfigPath` + `url` on any malformed config.
   - Log on fallback so misconfig is visible.

4. **Cert pinning on `cloud.nx.app`** -- only when `NX_CLOUD_API` is NOT overridden. Enterprise installs have own CAs, can't pin.

5. **Document local-daemon trust model.**
   - Add 1-line comment at `daemon/server/server.ts:244` (v8 deserialize) and `:259-261` (env refresh) documenting "same-UID Unix socket, trust boundary = OS user". Heads off the next Socket.dev AI re-flag and same review question from any other scanner.

## Non-goals

- Disable auto-update. Cloud client *must* stay current (it ships fix-ci, connect, onboard logic). Goal is verify-then-run, not pin-and-stale.
- Sign the nx CLI itself (separate problem; npm provenance covers it).

## Sequencing

Cloud server change (manifest + signature) lands first. CLI change follows behind a warn-only flag for one release. Enforce in the release after.

Server-side owners: Orca (CLOUD-XXXX). CLI side: Dolphin (NXC-XXXX).

## Open questions

- Is there an existing signing infra for any other Nx Cloud artifact that can be reused (release tarballs, agent images)?
- Enterprise self-hosted cloud servers run older versions for months -- what's the right deprecation window for the warn-only -> enforce flip?
- Where does the pinned pubkey rotate? Key in source means a major bump to rotate; could ship a 2-of-N pubkey set to allow rotation without breaking older CLIs.

## References

- Socket alerts (2026-05-22): `nx@22.7.3`, `dist/src/daemon/server/server.js` (AI medium), `dist/src/command-line/nx-cloud/utils.js` (obfuscation 0.9). Both false-positive in surface tag, second one is the real signal.
- `packages/nx/src/nx-cloud/update-manager.ts:63-156` (verify), `:319-377` (download+extract)
- `packages/nx/src/command-line/nx-cloud/utils.ts:28-42` (executeNxCloudCommand)
- `packages/nx/src/daemon/server/server.ts:244` (v8.deserialize), `:256-269` (process.env refresh)
