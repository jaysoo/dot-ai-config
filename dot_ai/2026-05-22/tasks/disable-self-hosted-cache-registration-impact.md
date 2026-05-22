# Impact research: disable self-hosted cache key registration endpoint

**Date:** 2026-05-22
**Repo:** ocean (nx-api Kotlin handlers, nx-cloud Remix app)
**Question:** What breaks (and what doesn't) if we disable / remove the endpoint that `@nx/key` hits to register a new free self-hosted cache key?
**Companion spec:** `.ai/2026-05-20/specs/remote-cache-deprecation.md` (CVE-2025-36852 / CREEP - 4 cache packages deprecated 2026-05-21)

## TL;DR

- The endpoint to disable is **`POST /nx-cloud/self-hosted-cache/activate`** (and optionally its `GET` companion for polling).
- It is the **only remaining self-service entry point** for getting a free self-hosted cache key. Web sign-up routes already redirect away (`/powerpack/request/free`, `/powerpack/request/trial`, `/self-hosted-cache`).
- Existing customers are not affected at runtime. Keys are validated locally (Rust, decrypt-and-parse). No server round-trip after activation.
- Disabling does **not** affect: paid Powerpack via Stripe, admin manual issuance, trial requests from in-app, or the separate `GET /nx-cloud/powerpack/licenses` license-refresh used by Cloud-connected workspaces.
- `nx register` and `nx g @nx/<s3|gcs|azure|shared-fs>-cache:init` will fail at the activation step. Do **not** remove the CLI commands - old CLI versions in the wild will hit the endpoint regardless; server response text is where the user-facing message lives.

## Endpoint inventory

`@nx/key` (both v5 npm and ocean source under `libs/nx-packages/nx-key/`) talks to nx-api over exactly two URLs:

| Endpoint                                             | Method | Purpose                                                                                                                                                                                         | Server file                                                         |
| ---------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `/nx-cloud/self-hosted-cache/activate`               | POST   | Submit name/email/org/seats. Inserts `MNxPowerpackProspect` + `MNxSelfHostedCacheActivationRequest`, emails verify link. Returns `requestId`.                                                   | `apps/nx-api/src/main/kotlin/handlers/ActivationKeyHandlers.kt:110` |
| `/nx-cloud/self-hosted-cache/activate?requestId=...` | GET    | Poll until status `VERIFIED`. First success flips to `COMPLETED` and returns `activationKey`.                                                                                                   | `apps/nx-api/.../ActivationKeyHandlers.kt:53`                       |
| `/nx-cloud/powerpack/licenses?nxVersion=N`           | GET    | Cloud-connected workspaces resolve their **paid** Powerpack license from org. Uses `Nx-Cloud-Id` + `Authorization` + `Nx-Cloud-Personal-Access-Token` headers. **Not part of free-key signup.** | `apps/nx-api/.../PowerpackHandlers.kt:125`                          |

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

`nx register --key <paste>` and `nx register --key=<key>` paths do **not** call this endpoint - they go through local JWT-style decrypt only. Same for any workspace that already has `.nx/cache.key` / `NX_KEY` env var on disk.

## What stays working after disable

| Flow                                                    | Why unaffected                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Existing users running tasks with an already-issued key | Key is decrypted/validated locally in Rust (`libs/nx-packages/nx-key/src/key/nx_key.rs:102`). No server hit.                                                                                                                                                                                                                      |
| Paid Powerpack via Stripe                               | Separate flow: `_resource.billing.start-nx-powerpack-license-*-checkout-session.tsx` -> `process-payment-nx-powerpack-license-checkout.server.ts` -> `generateNxPowerpackLicenseKey`. Touches `MPowerpackLicense` directly.                                                                                                       |
| Cloud-connected workspaces fetching paid licenses       | `GET /nx-cloud/powerpack/licenses` - retrieves existing row in `MPowerpackLicense` keyed by org. No registration.                                                                                                                                                                                                                 |
| Admin manual license issuance                           | `_auth.admin.powerpack.licenses.create.tsx` -> `feature-admin/.../generate-nx-powerpack-license-action.server.tsx`.                                                                                                                                                                                                               |
| In-app trial requests                                   | `feature-organization-nx-powerpack/.../nx-powerpack-registered-request-trial-license-action.server.ts` and the `feature-nx-powerpack` variant. Both call `generateNxPowerpackLicense` directly. The web routes `/powerpack/request/free` and `/powerpack/request/trial` are already redirect-only (see "Already disabled" below). |
| `nx register --key <existing-key>`                      | Local activation only.                                                                                                                                                                                                                                                                                                            |

## What breaks after disable

| Flow                                                                                                                                | Surface                                                                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `nx register` (interactive, picks Self-hosted Cache)                                                                                | CLI prints error from server response body (4xx/410).                                                                                                                                                                                                                                                                                |
| `nx g @nx/<pkg>:init` for the four deprecated cache packages                                                                        | Generator runs `autoRegisterNxKey` **first** before any other prompts. If the POST fails it throws; the rest of the generator (S3/GCS/Azure config prompts) never runs. Practical effect: the init generator becomes unusable for new users. Matches the deprecation intent - they shouldn't be onboarding to these packages anyway. |
| Auto-register triggered from a fresh repo without a key                                                                             | Same as above.                                                                                                                                                                                                                                                                                                                       |
| In-flight requestIds polling `GET /nx-cloud/self-hosted-cache/activate?requestId=...` after the user has already received the email | If only POST is gated, GET still resolves verified requests. If GET is also gated, polls error with body text. Worst case the user spent 1-15 min and hit a wall. 900s polling cap.                                                                                                                                                  |

`@nx/key` client behavior on the POST failure (`libs/nx-packages/nx-key/src/auto-register.ts:284`):

```
if (axios.isAxiosError(error) && error.response?.status === 404) {
  throw new Error(error.response.data || 'Activation endpoint not found');
}
... 'Failed to initiate self-hosted cache key activation, please try again later.'
```

So a `404 Not Found` or `410 Gone` with a body string surfaces as the body text. Use this to land a clear deprecation message.

## Data lifecycle

Records the POST creates (only if disabled, no new rows of these for that path):

- `MNxPowerpackProspect` - sales lead tracking. Insert failures are swallowed (try/catch in handler).
- `MNxSelfHostedCacheActivationRequest` - 24h `expiresAt`, status `PENDING -> VERIFIED -> COMPLETED`. The verify-loader flips to VERIFIED and attaches `licenseId`. GET poll flips to COMPLETED on first successful retrieval.
- `MPowerpackLicense` row with `featurePermissions.SELF_HOSTED_CACHE: true`, `organizationId: null`, `seatCount: <from form>`, `expiresAt: null`, `note: "Self-hosted cache activation key only."`, `termsUrl: cloud.nx.app/terms/self-hosted-cache/2025/03/05`.

These rows don't gate anything else - cleanup not required before disable. Existing rows continue to validate against locally-stored keys.

Email side: template `nx-self-hosted-cache-activation-verify-email` (via Mandrill/MailChimp). If POST is gated, no emails sent; template can stay registered.

## Already disabled / dead code in this domain

- `apps/nx-cloud/app/routes/_auth.powerpack.request.free.tsx` - JSDoc `@deprecated: Use self-hosted cache screen instead.` Loader redirects to `nx.dev/remote-cache`.
- `apps/nx-cloud/app/routes/_auth.powerpack.request.trial.tsx` - uses `NxPowerpackRedirectLoader` which sends `/powerpack`.
- `apps/nx-cloud/app/routes/_auth.self-hosted-cache._index.tsx` - redirects to `nx.dev/remote-cache`.
- All 4 deprecated cache packages already print a CVE-2025-36852 warning at runtime (`libs/nx-packages/<pkg>/src/remote-cache.ts`) and point at `https://nx.dev/docs/reference/deprecated/self-hosted-cache-packages`.

Conclusion: the CLI POST is the last live front door. Closing it is consistent with the 2026-05-21 deprecation.

## Tests affected

- `apps/nx-cloud-e2e-playwright/e2e/self-hosted-cache-activation-key/cli-activation-key-flow.spec.ts` - inserts a PENDING request directly into Mongo, then visits the verify URL. Does NOT hit the POST endpoint. **Stays green** if we only gate POST.
- `apps/nx-api/src/test/kotlin/handlers/PowerpackHandlersTests.kt` - covers `GET /nx-cloud/powerpack/licenses`, not the activate POST. Unaffected.
- Any direct tests of `ActivationKeyHandlers` (didn't find dedicated ones via grep) would need updating if we change the response.
- `libs/nx-packages/nx-key/src/test/activate-license.spec.ts` is local-only (file roundtrip). Unaffected.

## Recommended approach

1. **Gate POST, keep GET** (drain in-flight polls):
   ```kotlin
   post("/nx-cloud/self-hosted-cache/activate") {
       return@post call.respond(
           HttpStatusCode.Gone,
           "Self-hosted cache key registration is no longer available. " +
           "These packages are deprecated due to CVE-2025-36852 (CREEP). " +
           "Migrate to Nx Cloud: https://nx.dev/docs/deprecations/self-hosted-cache-packages",
       )
   }
   ```
   - `410 Gone` is semantically correct (permanently removed, not a routing mistake).
   - Body text reaches the CLI via `error.response.data` in `auto-register.ts`. The 404 branch swallows it less aggressively; if you want the cleanest CLI message also intercept 410 in `@nx/key` - but that requires shipping a new `@nx/key`, which old workspaces won't get. Better: rely on the generic "Failed to initiate..." path that still mentions retry. Acceptable trade-off.
2. **Add version-plan entry** (`.nx/version-plans/`) describing the change as `nx-cloud: fix` or `chore` depending on customer-facing nature.
3. **Optional second step**: also short-circuit the GET once the longest possible in-flight request would have expired (24h after deploy). Or leave it - it harms nobody, returns 404 for unknown requestIds.
4. **Do not** remove `nx register` or the generator init flows. Old `@nx/key` in the wild already calls the endpoint; server response is the canonical user-facing message. Removing the CLI commands gains nothing.
5. **Do not** touch `/nx-cloud/powerpack/licenses`. That serves paying customers.

## Open questions / things to confirm before merge

- Volume: how many `MNxPowerpackProspect` + `MNxSelfHostedCacheActivationRequest` rows are getting created per day right now? Worth a Mongo query before flipping the switch so we can quantify the "stranded CLI users" cohort. (Not done here - no DB access from this research session.)
- Marketing / lifecycle: is there an outbound email plan for users who issued free keys in the last N days but never completed verify? Their PENDING rows will expire silently.
- Sales/CS: should the 410 body include a contact link for users who want to convert to paid Powerpack instead of Nx Cloud? Current draft just points to the deprecation doc.
- Linear ticket? File one against nx-cloud team if not already tracked.

## File map (for reviewer / implementer)

Server (ocean):

- `apps/nx-api/src/main/kotlin/handlers/ActivationKeyHandlers.kt` - **change here**
- `apps/nx-api/src/main/kotlin/Main.kt` - route registration (no change needed)
- `libs/nx-cloud/feature-nx-self-hosted-cache-activation-requests/src/lib/nx-self-hosted-cache-verify-loader.server.ts` - verify-loader (unchanged; still serves in-flight requests if you leave GET open)
- `libs/nx-cloud/data-access-api/src/lib/mutations/nx-powerpack/generate-nx-powerpack-license.server.ts` - shared license generator (unchanged; still used by Stripe / admin / trial)

Client (ocean source mirror of `@nx/key`):

- `libs/nx-packages/nx-key/src/auto-register.ts` - the caller. Don't need to change; let it surface the server message.

CLI (nx repo):

- `packages/nx/src/command-line/register/register.ts` - leave intact.
- `packages/nx/src/utils/nx-key.ts`, `require-nx-key.ts` - leave intact.
