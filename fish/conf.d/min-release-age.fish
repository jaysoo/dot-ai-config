# Package manager min-release-age supply chain defense.
# Defaults configured in:
#   ~/.npmrc                       (min-release-age=1 day)
#   ~/.yarnrc.yml                  (npmMinimalAgeGate: 1440 min + nx allowlist)
#   ~/.bunfig.toml                 ([install] minimumReleaseAge=86400s + nx allowlist)
#   ~/Library/Preferences/pnpm/rc  (minimum-release-age=1440 min)
# npm has no exclusion list (cli/cli#8994). pnpm global rc cannot hold arrays;
# nx carveout for pnpm requires per-repo pnpm-workspace.yaml.
# Helpers below bypass the gate for one-off urgent installs.

function npm-now --description 'npm install bypassing min-release-age gate'
    env npm_config_min_release_age=0 npm $argv
end

function yarn-now --description 'yarn install bypassing min-release-age gate'
    env YARN_NPM_MINIMAL_AGE_GATE=0 yarn $argv
end

function pnpm-now --description 'pnpm install bypassing min-release-age gate'
    command pnpm $argv --config.minimumReleaseAge=0
end

function bun-now --description 'bun install bypassing min-release-age gate'
    command bun $argv --minimum-release-age=0
end
