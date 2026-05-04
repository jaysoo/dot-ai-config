# Issue #35455 — `@nx/s3-cache 5.0.3` causes `tokio-runtime-worker` panic

GitHub: https://github.com/nrwl/nx/issues/35455
Severity: high (every Nx command panics for s3-cache users on 5.0.3)
Working dir: `/Users/jack/projects/ocean`

## Symptom

```
thread '<unnamed>' panicked at generic-array-0.14.7/src/lib.rs:572:9:
assertion `left == right` failed
  left: 36
  right: 32
```

5.0.2 worked fine. 5.0.3 (published 2026-04-23) panics on every `nx` command in workspaces with `@nx/s3-cache` installed.

## Root cause

Compile-time injection of `NX_POWERPACK_ENCRYPTION_KEY` at `libs/nx-packages/nx-key/src/crypto.rs:18-25,37`:

```rust
let encryption_key: String = String::from(obfstr::obfstr!(match std::option_env!(
    "NX_POWERPACK_ENCRYPTION_KEY"
) {
    Some(key) => key,
    None => "cG4bnmydvFzs9xqgKoZEpAiw4ciDngds",  // 32 chars
}));
...
Aes256CbcDecryptor::new(encryption_key.as_bytes().into(), iv.into())
```

`.into()` to `&GenericArray<u8, U32>` requires exactly 32 bytes. AES-256 spec.

The published 5.0.3 binary was compiled with `NX_POWERPACK_ENCRYPTION_KEY` set to a 36-byte UUID-format value (32 hex + 4 dashes). 1Password entry under `NX_POWERPACK_ENCRYPTION_KEY` (created Sept 2024) had the same UUID-format value — almost certainly someone ran `uuidgen` for "32-char random string" without realizing UUIDs add 4 dashes. The real AES-256 key (matching prod API server's encryption) is different and lives only in prod env.

## Why 5.0.0–5.0.2 worked but 5.0.3 didn't

The compile-time env injection in the powerpack publish workflow is newer than the 1Password entry. Prior builds didn't read the env var → used the Rust fallback (32 bytes) → matched whatever prod API has. Apr 23 publish happened to pick up the bad 36-byte value.

## Smoking gun reproduction

Built nx-key locally with deliberate 36-byte env var:

```fish
NX_POWERPACK_ENCRYPTION_KEY="abcdefghijklmnopqrstuvwxyz0123456789" \
  pnpm nx run nx-key:build-rust --skip-nx-cache
```

Added `eprintln!("[nx-key] enc_key.len={} iv.len={}", encryption_key.len(), iv.len());` at crypto.rs:37. Swapped binary into `/tmp/remote1/node_modules/@nx/key-darwin-arm64/`, cleared the native file cache (see below), ran `nx g @nx/s3-cache:init`. Output:

```
[nx-key] enc_key.len=36 iv.len=16
thread '<unnamed>' panicked at /Users/jack/.cargo/.../generic-array-0.14.7/src/lib.rs:572:9:
  left: 36
  right: 32
```

Identical numbers as the published 5.0.3 binary. Hypothesis confirmed.

## Resolution

1. Pulled correct 32-byte value from prod API server env
2. Updated GitHub secret `NX_POWERPACK_ENCRYPTION_KEY`
3. First republish attempt (5.0.4-beta.1) **still panicked** — Nx Cloud remote cache hit on `build-rust` task served the broken Apr 23 binary. `nx.json` `rust` namedInput doesn't include the env var, so cache treats new build as identical input.
4. Second republish with `--skip-nx-cache` → 5.0.4 works.

5.0.4 is safe for all existing customers (5.0.2 → 5.0.4 transitive: both contain prod's KEY_X, both decrypt server-issued blobs identically). 5.0.3 customers either never got past the panic (no key.ini written) or have a key.ini encrypted by API with KEY_X, which 5.0.4 decrypts.

## Issues uncovered along the way (worth follow-up PRs)

1. **Cache poisoning vector** — `nx.json` `rust` namedInput should include `{ "env": "NX_POWERPACK_ENCRYPTION_KEY" }` so cache busts when the secret changes. Apply the same to all crypto-relevant env vars.
2. **Native file cache invalidation bug** — `@nx/key/index.js` patches `module._load` to copy `.node` to `$TMPDIR/nx-native-file-cache-<hash>/<VERSION>-<basename>` and reuses it forever. Keyed only on version+basename, not content. A re-published version (or a swapped local binary) is silently ignored. Add content-hash to cache key, or invalidate on package upgrade.
3. **No build-time validation of secret length** — workflow should fail loudly if `NX_POWERPACK_ENCRYPTION_KEY` byte length ≠ 32. Length is an integer, won't be masked in logs:
   ```yaml
   - env:
       K: ${{ secrets.NX_POWERPACK_ENCRYPTION_KEY }}
     run: |
       BYTES=$(printf %s "$K" | wc -c | tr -d ' ')
       [ "$BYTES" = "32" ] || { echo "::error::need 32 bytes, got $BYTES"; exit 1; }
   ```
4. **Rust panic on bad input** — `crypto.rs::decrypt` should `const_assert!` the fallback length at compile time and `Err(LicenseErrors::Invalid)` on bad runtime length, not panic. Process-killing panic in tokio worker → SIGABRT → users hit total breakage with no actionable error.
5. **Missing rotation runbook** — no `docs/powerpack-key-rotation.md`. Whoever rotated the secret 3 weeks ago would have benefited from a written procedure (32 bytes ASCII, deploy server first, etc.).
6. **Server/client fallback divergence** — `encryption.server.ts` fallback is `'ThisMustHaveThirtyTwoCharacterss'`; Rust fallback is `'cG4bnmydvFzs9xqgKoZEpAiw4ciDngds'`. If both ever fall back, decryption silently fails. Unify or remove fallbacks.

## Files referenced

- `libs/nx-packages/nx-key/src/crypto.rs` — the panicking decrypt fn
- `libs/nx-packages/nx-key/Cargo.toml` — aes 0.8.4, cbc 0.1.2
- `libs/ocean/util-misc/src/lib/server/encryption.server.ts` — server-side counterpart
- `.github/workflows/release-powerpack-packages.yml` — publish workflow with secret injection (lines 84, 317, 345, 359)
- `nx.json` — `rust` namedInput at `targetDefaults.build-rust.inputs`

## Cross-checks performed

- Strings analysis of published 5.0.3 `.node` confirmed `crypto.rs` is the only AES caller in the binary
- md5 comparison of cached binary vs published binary confirmed cache hit on 5.0.4-beta.1
- 5.0.2 vs 5.0.3 tarball diff: WASM rebuilt, axios bumped 1.13.6 → 1.15.0 (JS only), index.js/native.js deobfuscated (`NO_OBFUSCATE` env leaked into prod build — separate hygiene issue)
