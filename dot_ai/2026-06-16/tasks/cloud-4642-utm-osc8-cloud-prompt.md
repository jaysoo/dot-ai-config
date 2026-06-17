# CLOUD-4642: UTM codes + OSC 8 clickable link in Cloud prompt footers

Linear: https://linear.app/nxdev/issue/CLOUD-4642
Branch: CLOUD-4642

## Goal

Cloud setup prompt footers show `https://nx.dev/nx-cloud` (clean text). Wrap it in an
OSC 8 hyperlink so supported terminals make it clickable, and the *link target* carries
the UTM querystring. UTM never shown in visible text (ugly).

UTM mediums (utm_source=nx-cli):
- create-nx-workspace -> utm_medium=create-nx-workspace
- nx init             -> utm_medium=nx-init
- nx migrate          -> utm_medium=nx-migrate

## Touch points

- packages/nx/src/utils/ab-testing.ts (footers for setupNxCloud/setupViewLogs)
- packages/nx/src/command-line/nx-cloud/connect/connect-to-nx-cloud.ts (nxCloudPrompt renders footer)
  - connectExistingRepoToNxCloudPrompt(command) -> init/view-logs
  - connectToNxCloudWithPrompt('migrate')       -> migrate
- packages/create-nx-workspace/src/utils/nx/ab-testing.ts (setupCI/setupNxCloud/setupNxCloudV2 footers)
- packages/create-nx-workspace/src/internal-utils/prompts.ts (nxCloudPrompt renders footer)

## Approach

- New util `terminalLink(text, url)` per package (nx core + CNW; CNW bundles separately).
  Emits OSC 8 sequence only when terminal supports hyperlinks; else returns plain text.
- New `linkifyCloudUrl(footer, medium)` replaces the literal `https://nx.dev/nx-cloud`
  in a footer with `terminalLink(url, url + utm)`.
- Thread medium through the prompt render functions (command -> medium for nx core; fixed
  create-nx-workspace for CNW).

## Tests

- terminal-link unit: forced on/off via env, OSC 8 framing, plain fallback.
- linkify: UTM present in target, plain text preserved.
