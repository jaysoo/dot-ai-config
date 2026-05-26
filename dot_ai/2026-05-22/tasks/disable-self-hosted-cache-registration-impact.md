# Impact research: disable self-hosted cache key registration endpoint

**Date:** 2026-05-22
**Repos:** nx (CLI wrapper), ocean (nx-api Kotlin handlers, nx-cloud Remix app, `@nx/key`, deprecated cache packages)
**Question:** What breaks (and what doesn't) if we disable the endpoint `@nx/key` hits to register a new free self-hosted cache key?
**Companion spec:** `.ai/2026-05-20/specs/remote-cache-deprecation.md` (CVE-2025-36852 / CREEP, 4 cache packages deprecated 2026-05-21)

## TL;DR

- Endpoint to disable: `POST /nx-cloud/self-hosted-cache/activate` (and optionally its `GET` companion for polling).
- It is the only remaining self-service entry point for a free self-hosted cache key. Web sign-up routes already redirect away (`/powerpack/request/free`, `/powerpack/request/trial`, `/self-hosted-cache`).
- No runtime impact on existing customers. Keys validate locally in Rust (decrypt-and-parse). No server round-trip after activation.
- Unaffected: paid Powerpack via Stripe, admin manual issuance, in-app trial requests, and the separate `GET /nx-cloud/powerpack/licenses` license-refresh used by Cloud-connected workspaces.
- `nx register` and `nx g @nx/<s3|gcs|azure|shared-fs>-cache:init` fail at the activation step for new self-hosted cache registrations.
- nx repo / CLI: no code change required. Keep `nx register`. It only wraps `@nx/key`. `nx register --key <existing-key>` stays valid and local.
- ocean repo / Cloud: gate the API endpoint. Pick the response status and body carefully because old `@nx/key` clients are in the wild.
- Return `404` with a deprecation body from the POST. Existing `@nx/key` forwards `404` bodies but not `410` bodies. A `410` falls back to a generic "please try again later" message.

## Repo responsibility split

| Repo      | Owns                                                                                        | Needed change                                                                                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nx`      | `nx register` command wrapper in `packages/nx/src/command-line/register/register.ts`        | None required. Keep the command and the `--key` path. Optional: release note that new self-hosted cache key registration is closed.                                                 |
| `ocean`   | `nx-api` endpoint, Nx Cloud verification UI, `@nx/key`, deprecated cache package generators | Required. Gate `POST /nx-cloud/self-hosted-cache/activate`. Keep `GET` temporarily to drain in-flight requests.                                                                     |
| published | Existing `@nx/key` packages already installed in user workspaces, and older Nx CLI versions | Cannot be patched retroactively. Server response behavior is the compatibility boundary.                                                                                            |

## Endpoint inventory

`@nx/key` (both v5 npm and ocean source under `libs/nx-packages/nx-key/`) talks to nx-api over exactly two URLs:

| Endpoint                                             | Method | Purpose                                                                                                                                                                                     | Server file                                                         |
| ---------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `/nx-cloud/self-hosted-cache/activate`               | POST   | Submit name/email/org/seats. Inserts `MNxPowerpackProspect` + `MNxSelfHostedCacheActivationRequest`, emails verify link. Returns `requestId`.                                               | `apps/nx-api/src/main/kotlin/handlers/ActivationKeyHandlers.kt:110` |
| `/nx-cloud/self-hosted-cache/activate?requestId=...` | GET    | Poll until status `VERIFIED`. First success flips to `COMPLETED` and returns `activationKey`.                                                                                               | `apps/nx-api/.../ActivationKeyHandlers.kt:53`                       |
| `/nx-cloud/powerpack/licenses?nxVersion=N`           | GET    | Cloud-connected workspaces resolve their paid Powerpack license from org. Uses `Nx-Cloud-Id` + `Authorization` + `Nx-Cloud-Personal-Access-Token` headers. Not part of free-key signup.     | `apps/nx-api/.../PowerpackHandlers.kt:125`                          |

The verification link in the email points to `${nxCloudAppUrl}/self-hosted-cache/verify?verifyToken=...`, which lands in the Remix app:

- `apps/nx-cloud/app/routes/_resource.self-hosted-cache.verify.tsx` -> `selfHostedCacheVerifyLoader` (`libs/nx-cloud/feature-nx-self-hosted-cache-activation-requests/src/lib/nx-self-hosted-cache-verify-loader.server.ts`)
- Loader calls `generateNxPowerpackLicense(...)` with `FEATURES.SELF_HOSTED_CACHE: true`, sets `licenseId` on the activation request, redirects to `/self-hosted-cache/verify/success`.

## CLI callers of the POST

| Caller                                                | Repo  | Call site                                                                                                            |
| ----------------------------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------- |
| `nx register` (no `--key`, picks "Self-hosted Cache") | nx    | `packages/nx/src/command-line/register/register.ts` -> `@nx/key` `registerNxKey`                                     |
| `nx g @nx/s3-cache:init` (auto-register)              | ocean | `libs/nx-packages/s3-cache/src/generators/init/generator.ts:42`                                                      |
| `nx g @nx/gcs-cache:init`                             | ocean | `libs/nx-packages/gcs-cache/src/generators/init/generator.ts:27`                                                     |
| `nx g @nx/azure-cache:init`                           | ocean | `libs/nx-packages/azure-cache/src/generators/init/generator.ts:39`                                                   |
| `nx g @nx/shared-fs-cache:init`                       | ocean | `libs/nx-packages/shared-fs-cache/src/generators/init/generator.ts:17`                                               |
| `@nx/key` `autoRegisterNxKey`                         | ocean | `libs/nx-packages/nx-key/src/auto-register.ts:107` (`api.post('nx-cloud/self-hosted-cache/activate', ...)` line 280) |

`nx register --key <paste>` and `nx register --key=<key>` paths do not call this endpoint. They go through local JWT-style decrypt only. Same for any workspace with `.nx/cache.key` or `NX_KEY` already on disk.

## What stays working after disable

| Flow                                                    | Why unaffected                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Existing users running tasks with an already-issued key | Key decrypts and validates locally in Rust (`libs/nx-packages/nx-key/src/key/nx_key.rs:102`). No server hit.                                                                                                                                                                                                                  |
| Paid Powerpack via Stripe                               | Separate flow: `_resource.billing.start-nx-powerpack-license-*-checkout-session.tsx` -> `process-payment-nx-powerpack-license-checkout.server.ts` -> `generateNxPowerpackLicenseKey`. Writes `MPowerpackLicense` directly.                                                                                                    |
| Cloud-connected workspaces fetching paid licenses       | `GET /nx-cloud/powerpack/licenses` retrieves an existing `MPowerpackLicense` keyed by org. No registration.                                                                                                                                                                                                                   |
| Admin manual license issuance                           | `_auth.admin.powerpack.licenses.create.tsx` -> `feature-admin/.../generate-nx-powerpack-license-action.server.tsx`.                                                                                                                                                                                                           |
| In-app trial requests                                   | `feature-organization-nx-powerpack/.../nx-powerpack-registered-request-trial-license-action.server.ts` and the `feature-nx-powerpack` variant. Both call `generateNxPowerpackLicense` directly. The web routes `/powerpack/request/free` and `/powerpack/request/trial` already redirect (see "Already disabled" below).      |
| `nx register --key <existing-key>`                      | Local activation only.                                                                                                                                                                                                                                                                                                        |

## What breaks after disable

| Flow                                                                                                                                | Surface                                                                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `nx register` (interactive, picks Self-hosted Cache)                                                                                | CLI reaches `@nx/key`, submits the POST, and fails. With existing `@nx/key`, a `404` body surfaces. A `410` body does not and falls back to the generic "Failed to initiate..." message.                                                                                                                                             |
| `nx g @nx/<pkg>:init` for the four deprecated cache packages                                                                        | Generator runs `autoRegisterNxKey` before any other prompts. `performNxKeyActivation` catches the failure, logs an error, returns `null`. Generator continues to package-specific config prompts and writes. Net effect: users can still wire local S3/GCS/Azure/shared-fs config but cannot obtain a new free self-hosted cache key. |
| Auto-register triggered from a fresh repo without a key                                                                             | Same activation failure. Logs the activation error and returns `null` unless the failure happens before `performNxKeyActivation` catches it.                                                                                                                                                                                          |
| In-flight requestIds polling `GET /nx-cloud/self-hosted-cache/activate?requestId=...` after the user already received the email     | If only POST is gated, GET still resolves verified requests. If GET is also gated, polls error with body text. Worst case: 1-15 min wasted on a wall. 900s polling cap.                                                                                                                                                              |

`@nx/key` client behavior on POST failure (`libs/nx-packages/nx-key/src/auto-register.ts:284`):

```
if (axios.isAxiosError(error) && error.response?.status === 404) {
  throw new Error(error.response.data || 'Activation endpoint not found');
}
... 'Failed to initiate self-hosted cache key activation, please try again later.'
```

Only `404 Not Found` surfaces the POST response body in existing clients. `410 Gone` is semantically cleaner, but existing `@nx/key` clients fall through to:

```
Failed to initiate self-hosted cache key activation, please try again later.
```

Use `404` with a clear body to surface the deprecation message to old clients without shipping a new `@nx/key`.

## Data lifecycle

Records the POST creates today (none after disable on this path):

- `MNxPowerpackProspect`: sales lead tracking. Insert failures are swallowed (try/catch in handler).
- `MNxSelfHostedCacheActivationRequest`: 24h `expiresAt`, status `PENDING -> VERIFIED -> COMPLETED`. The verify-loader flips to VERIFIED and attaches `licenseId`. GET poll flips to COMPLETED on first successful retrieval.
- `MPowerpackLicense` row with `featurePermissions.SELF_HOSTED_CACHE: true`, `organizationId: null`, `seatCount: <from form>`, `expiresAt: null`, `note: "Self-hosted cache activation key only."`, `termsUrl: cloud.nx.app/terms/self-hosted-cache/2025/03/05`.

These rows don't gate anything else. Cleanup not required before disable. Existing rows continue to validate against locally-stored keys.

Email side: template `nx-self-hosted-cache-activation-verify-email` (via Mandrill/MailChimp). If POST is gated, no emails sent. Template can stay registered.

## Already disabled / dead code in this domain

- `apps/nx-cloud/app/routes/_auth.powerpack.request.free.tsx`: JSDoc `@deprecated: Use self-hosted cache screen instead.` Loader redirects to `nx.dev/remote-cache`.
- `apps/nx-cloud/app/routes/_auth.powerpack.request.trial.tsx`: uses `NxPowerpackRedirectLoader` which sends `/powerpack`.
- `apps/nx-cloud/app/routes/_auth.self-hosted-cache._index.tsx`: redirects to `nx.dev/remote-cache`.
- All 4 deprecated cache packages already print a CVE-2025-36852 warning at runtime (`libs/nx-packages/<pkg>/src/remote-cache.ts`) pointing at `https://nx.dev/docs/reference/deprecated/self-hosted-cache-packages`.

The CLI POST is the last live front door. Closing it is consistent with the 2026-05-21 deprecation.

## Tests affected

### ocean tests

- `apps/nx-cloud-e2e-playwright/e2e/self-hosted-cache-activation-key/cli-activation-key-flow.spec.ts`: inserts a PENDING request directly into Mongo, then visits the verify URL. Does not hit the POST endpoint. Stays green if we only gate POST.
- `apps/nx-api/src/test/kotlin/handlers/PowerpackHandlersTests.kt`: covers `GET /nx-cloud/powerpack/licenses`, not the activate POST. Unaffected.
- Any direct tests of `ActivationKeyHandlers` (no dedicated file found via grep) need updating if the response changes.
- `libs/nx-packages/nx-key/src/test/activate-license.spec.ts` is local-only (file roundtrip). Unaffected.
- Add an `ActivationKeyHandlers` test for POST `/nx-cloud/self-hosted-cache/activate` returning `404` with the deprecation body. If `@nx/key` is updated, add coverage for `410` body forwarding there too.

### nx tests

- No required Nx CLI test change if `packages/nx/src/command-line/register/register.ts` stays unchanged.
- If docs or release notes change in the nx repo, follow the Astro docs workflow: read `astro-docs/README.md`, edit under `astro-docs/src/content/docs/`, format with `npx prettier -- FILE_NAME`, then run `nx run-many -t test,build,lint -p astro-docs` before broader affected or full validation.

## Recommended approach

### Local NX_CLOUD_API compatibility test

Before changing the production handler, use a local mock to verify exactly what old `@nx/key` clients show for each status code.

Create `/tmp/self-hosted-cache-activation-mock.js`:

```js
const http = require('http');

const port = Number(process.env.PORT || 48731);
const status = Number(process.env.STATUS || 404);
const message =
  process.env.MESSAGE ||
  'Self-hosted cache key registration is no longer available. These packages are deprecated due to CVE-2025-36852 (CREEP). Migrate to Nx Cloud: https://nx.dev/docs/deprecations/self-hosted-cache-packages';

const server = http.createServer((req, res) => {
  if (req.url?.startsWith('/nx-cloud/self-hosted-cache/activate')) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      console.log(`${req.method} ${req.url} -> ${status}`);
      if (body) {
        console.log(body);
      }
      res.writeHead(status, { 'content-type': 'text/plain' });
      res.end(message);
    });
    return;
  }

  res.writeHead(404, { 'content-type': 'text/plain' });
  res.end('Not found');
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Mock NX_CLOUD_API listening on http://127.0.0.1:${port}`);
  console.log(`Returning ${status} from /nx-cloud/self-hosted-cache/activate`);
});
```

Run it:

```bash
STATUS=404 node /tmp/self-hosted-cache-activation-mock.js
```

In a fresh Nx workspace without `.nx/cache.key` or `NX_KEY`, point `@nx/key` at the mock:

```bash
NX_CLOUD_API=http://127.0.0.1:48731 nx g @nx/s3-cache:init
```

Accept registration prompts, enter dummy contact data. Expected for existing clients:

- `STATUS=404`: CLI prints the mock body verbatim.
- `STATUS=410`: CLI suppresses the body and prints `Failed to initiate self-hosted cache key activation, please try again later.`

Confirms the compatibility reason for returning `404` even though `410` is semantically cleaner.

### ocean / Cloud implementation

1. Gate POST, keep GET (drain in-flight polls):
   ```kotlin
   post("/nx-cloud/self-hosted-cache/activate") {
       return@post call.respond(
           HttpStatusCode.NotFound,
           "Self-hosted cache key registration is no longer available. " +
           "These packages are deprecated due to CVE-2025-36852 (CREEP). " +
           "Migrate to Nx Cloud: https://nx.dev/docs/deprecations/self-hosted-cache-packages",
       )
   }
   ```

   - `404 NotFound` is the compatibility choice. Existing `@nx/key` forwards the response body for POST `404`.
   - `410 Gone` is semantically correct, but existing `@nx/key` does not forward the POST response body for `410`. Users would see a generic retry message.
   - If Ocean also ships a new `@nx/key`, update `auto-register.ts` to forward body text for `410` too. That improves future clients but does not help older clients already installed.
2. Add a version-plan entry (`.nx/version-plans/`) for the changed package. Describe the change as customer-facing deprecation behavior.
3. Optional second step: short-circuit GET once the longest in-flight request would have expired (24h after deploy). Or leave it. It harms nobody and returns 404 for unknown requestIds.
4. Do not touch `/nx-cloud/powerpack/licenses`. That serves paying customers.

### nx / CLI implementation

1. Do not remove or disable `nx register`. Old Nx versions and current Nx versions call into `@nx/key`. Removing the wrapper in the nx repo does not stop old clients and would also break valid `nx register --key <existing-key>` usage.
2. No code change required in `packages/nx/src/command-line/register/register.ts`. The command correctly delegates to `@nx/key`.
3. No change required in `packages/nx/src/utils/require-nx-key.ts`. It should still install and load `@nx/key` for key-enabled features.
4. Optional: update Nx-facing docs or release notes to say new self-hosted cache key registration is no longer available, while `nx register --key` remains supported for existing or paid keys.

## Volume baseline (queried 2026-05-22, prod nrwl-api, last 30 days)

Both collections show identical CLI-path counts because every `nxPowerpackProspects` row created in the window came from `checkoutUrl="://nx-cli"` + `formSubmissionIntent="free"`. No other prospects flow is active. Confirms web sign-up routes are already drained.

- Activation requests: **254 in 30 days, avg 8.5/day**. Daily range 1-21. Late April ran hotter (15-21/day peaks 4/28-30), May trended lower (mostly 1-15/day).
- Status breakdown: 214 COMPLETED (84%), 35 PENDING (14%), 5 VERIFIED-not-completed (2%).
- Stranded-CLI-users cohort post-disable: ~8-10/day attempting registration. Small enough that telemetry on the gated POST is cheap (low log volume) and worth keeping for the first 2 weeks to confirm the falloff.
- PENDING rows (started, never clicked verify): 35 in 30 days. Per Jack: not worth lifecycle outreach. We don't want them anyway. Rows expire silently at 24h.

## Open questions / things to confirm before merge

- Sales / CS: should the deprecation body include a contact link for users who want to convert to paid Powerpack instead of Nx Cloud? Current draft only points to the deprecation doc.
- Linear ticket: NXC-4488 (filed 2026-05-22, due 2026-05-27).

## File map (for reviewer / implementer)

ocean / Cloud server:

- `apps/nx-api/src/main/kotlin/handlers/ActivationKeyHandlers.kt` (change here)
- `apps/nx-api/src/main/kotlin/Main.kt`: route registration (no change needed)
- `libs/nx-cloud/feature-nx-self-hosted-cache-activation-requests/src/lib/nx-self-hosted-cache-verify-loader.server.ts`: verify-loader (unchanged; still serves in-flight requests if GET stays open)
- `libs/nx-cloud/data-access-api/src/lib/mutations/nx-powerpack/generate-nx-powerpack-license.server.ts`: shared license generator (unchanged; still used by Stripe / admin / trial)

ocean / published client packages:

- `libs/nx-packages/nx-key/src/auto-register.ts`: the caller. No required change if Cloud returns POST `404` with a body. Optional: also surface `410` body text for future clients.
- `libs/nx-packages/<s3|gcs|azure|shared-fs>-cache/src/generators/init/generator.ts`: no required change if the intent is to block new package onboarding via failed registration.

nx / CLI repo:

- `packages/nx/src/command-line/register/register.ts`: leave intact.
- `packages/nx/src/utils/nx-key.ts`, `require-nx-key.ts`: leave intact.
- `astro-docs/`: optional docs-only follow-up if Nx docs should explicitly mention that new self-hosted cache key registration is closed.
