#!/usr/bin/env bash
# security-self-scan.sh
# Local, read-only security self-scan for developer machines (macOS/Linux).
#
# Goal:
#   Fail only on concrete, locally verifiable risky states:
#   - plaintext or locally usable developer credentials
#   - unencrypted private keys
#   - powerful GitHub/npm/local auth that a process on the machine can reuse
#   - known best-effort supply-chain attack markers
#
# Non-goal:
#   This is not an EDR, malware scanner, or guarantee the machine is clean.
#   A clean result means "no obvious locally verifiable problems found."
#
# Exit code:
#   0 PASS, 2 FAIL

set -uo pipefail

worst=0
declare -a FINDINGS

note() {
  printf '  [%s] %s\n' "$1" "$2"
  FINDINGS+=("$1|$2")
}

fail() {
  note FAIL "$1"
  worst=2
}

pass() {
  note PASS "$1"
}

warn() {
  note WARN "$1"
}

section() {
  printf '\n=== %s ===\n' "$1"
}

has_command() {
  command -v "$1" >/dev/null 2>&1
}

is_macos() {
  [ "$(uname 2>/dev/null)" = "Darwin" ]
}

trim() {
  sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
}

is_unencrypted_private_key() {
  key_file="$1"
  if has_command ssh-keygen; then
    ssh-keygen -y -P "" -f "$key_file" >/dev/null 2>&1
    return $?
  fi

  # Fallback when ssh-keygen is unavailable. This is less complete.
  if head -n5 "$key_file" 2>/dev/null | grep -q 'ENCRYPTED'; then
    return 1
  fi
  return 0
}

has_npm_auth_token() {
  npmrc="$1"
  [ -f "$npmrc" ] || return 1
  grep -qE '(^|[/:])(_authToken|_auth|_password)[[:space:]]*=' "$npmrc" 2>/dev/null
}

has_secret_assignment() {
  file="$1"
  [ -f "$file" ] || return 1
  grep -nEi \
    '(^|[[:space:]])(export[[:space:]]+)?[A-Z_]*(TOKEN|SECRET|API_?KEY|PASSWORD|PRIVATE_?KEY)[A-Z_]*[[:space:]]*=[[:space:]]*["'"'"']?[A-Za-z0-9_./+=:@%,-]{12,}' \
    "$file" >/dev/null 2>&1
}

has_env_secret_assignment() {
  file="$1"
  [ -f "$file" ] || return 1

  previous_line=""
  while IFS= read -r line || [ -n "$line" ]; do
    case "$line" in
      "" | [[:space:]]\#* | \#*)
        previous_line="$line"
        continue
        ;;
    esac

    line="${line#export }"
    case "$line" in
      *=*) ;;
      *)
        previous_line="$line"
        continue
        ;;
    esac

    key="$(printf '%s' "${line%%=*}" | trim)"
    value="$(printf '%s' "${line#*=}" | sed 's/[[:space:]]#.*$//' | trim)"
    value="${value%\"}"
    value="${value#\"}"
    value="${value%\'}"
    value="${value#\'}"

    if ! printf '%s\n' "$key" | grep -qE '(TOKEN|SECRET|API_?KEY|PASSWORD|PASSWD|PRIVATE_?KEY|ACCESS_?KEY|AUTH|CREDENTIAL|SESSION|BEARER)'; then
      previous_line="$line"
      continue
    fi

    if printf '%s\n' "$previous_line" | grep -qiE 'test|fake|e2e|local|localhost'; then
      previous_line="$line"
      continue
    fi

    value_lower="$(printf '%s' "$value" | tr '[:upper:]' '[:lower:]')"
    case "$value_lower" in
      "" | fake | dummy | test | testing | changeme | change-me | example | placeholder | local | localhost)
        previous_line="$line"
        continue
        ;;
      fake-* | fake_* | dummy-* | dummy_* | test-* | test_* | e2e-* | e2e_* | local-* | local_* | example-* | example_* | mock-* | mock_* | sample-* | sample_*)
        previous_line="$line"
        continue
        ;;
      *-fake | *_fake | *-dummy | *_dummy | *-test | *_test | *-e2e | *_e2e | *-local | *_local | *-example | *_example | *-mock | *_mock | *-sample | *_sample)
        previous_line="$line"
        continue
        ;;
      http://localhost:* | https://localhost:* | http://127.0.0.1:* | https://127.0.0.1:* | http://0.0.0.0:* | https://0.0.0.0:* | mongodb://localhost:* | mongodb://127.0.0.1:*)
        previous_line="$line"
        continue
        ;;
    esac

    case "$value" in
      "-----BEGIN "*PRIVATE\ KEY*"-----") return 0 ;;
      ghp_* | gho_* | ghu_* | ghs_* | ghr_* | github_pat_*)
        [ "${#value}" -ge 24 ] && return 0
        ;;
      glpat-*)
        [ "${#value}" -ge 26 ] && return 0
        ;;
      xoxb-* | xoxa-* | xoxp-* | xoxr-* | xoxs-*)
        [ "${#value}" -ge 24 ] && return 0
        ;;
      sk-*)
        [ "${#value}" -ge 23 ] && return 0
        ;;
      AKIA* | ASIA*)
      if [ "${#value}" -eq 20 ] && printf '%s\n' "$value" | grep -qE '^(AKIA|ASIA)[0-9A-Z]+$'; then
          return 0
        fi
        ;;
    esac

    if [ "${#value}" -ge 40 ] && printf '%s\n' "$value" | grep -qE '^[A-Za-z0-9+/=]+$'; then
      return 0
    fi
    if [ "${#value}" -ge 32 ] && printf '%s\n' "$value" | grep -qE '^[A-Fa-f0-9]+$'; then
      return 0
    fi
    if [ "${#value}" -ge 32 ] && printf '%s\n' "$value" | grep -qE '^[A-Za-z0-9]+$'; then
      return 0
    fi
    previous_line="$line"
  done < "$file"

  return 1
}

has_cloud_plaintext_credentials() {
  cloud_file="$1"
  [ -f "$cloud_file" ] || return 1
  grep -qiE '(aws_access_key_id|aws_secret_access_key|aws_session_token|client_secret|refresh_token|access_token)[[:space:]]*=' "$cloud_file" 2>/dev/null
}

is_noise_path() {
  case "$1" in
    */.git/* | */node_modules/* | */vendor/* | */dist/* | */build/* | */coverage/* | */.next/* | */.venv/* | */venv/* | */site-packages/*)
      return 0
      ;;
  esac
  return 1
}

fail_path_if_exists() {
  path="$1"
  reason="$2"
  if [ -e "$path" ]; then
    fail "$reason: $path."
    return 0
  fi
  return 1
}

find_first_named_file() {
  root="$1"
  shift
  [ -d "$root" ] || return 1
  find "$root" -maxdepth 5 -type f "$@" 2>/dev/null | while IFS= read -r f; do
    is_noise_path "$f" && continue
    printf '%s\n' "$f"
    break
  done
}

find_first_named_dir() {
  root="$1"
  shift
  [ -d "$root" ] || return 1
  find "$root" -maxdepth 5 -type d "$@" 2>/dev/null | while IFS= read -r d; do
    is_noise_path "$d" && continue
    printf '%s\n' "$d"
    break
  done
}

grep_first_file() {
  pattern="$1"
  root="$2"
  [ -d "$root" ] || return 1
  find "$root" -maxdepth 5 -type f \( \
    -name '*.js' -o -name '*.ts' -o -name '*.mjs' -o -name '*.cjs' -o \
    -name '*.json' -o -name '*.yml' -o -name '*.yaml' -o \
    -name '*.sh' -o -name '*.py' -o -name '*.md' \
  \) 2>/dev/null | while IFS= read -r f; do
    is_noise_path "$f" && continue
    [ "$(basename "$f")" = "$(basename "$0")" ] && continue
    if grep -qiE "$pattern" "$f" 2>/dev/null; then
      printf '%s\n' "$f"
      break
    fi
  done
}

grep_first_workflow() {
  pattern="$1"
  root="$2"
  [ -d "$root/.github/workflows" ] || return 1
  find "$root/.github/workflows" -maxdepth 1 -type f \( -name '*.yml' -o -name '*.yaml' \) 2>/dev/null |
    while IFS= read -r f; do
      if grep -qiE "$pattern" "$f" 2>/dev/null; then
        printf '%s\n' "$f"
        break
      fi
    done
}

find_config_files() {
  root="$1"
  name="$2"
  [ -d "$root" ] || return 1
  find "$root" -maxdepth 5 -type f -name "$name" 2>/dev/null | while IFS= read -r f; do
    is_noise_path "$f" && continue
    printf '%s\n' "$f"
  done
}

config_has_yaml_true() {
  file="$1"
  key="$2"
  [ -f "$file" ] || return 1
  grep -qiE "^[[:space:]]*$key[[:space:]]*:[[:space:]]*true([[:space:]#]|$)" "$file" 2>/dev/null
}

config_has_yaml_false() {
  file="$1"
  key="$2"
  [ -f "$file" ] || return 1
  grep -qiE "^[[:space:]]*$key[[:space:]]*:[[:space:]]*false([[:space:]#]|$)" "$file" 2>/dev/null
}

config_has_ini_true() {
  file="$1"
  key="$2"
  [ -f "$file" ] || return 1
  grep -qiE "^[[:space:]]*$key[[:space:]]+true([[:space:]#]|$)|^[[:space:]]*$key[[:space:]]*=[[:space:]]*true([[:space:]#]|$)" "$file" 2>/dev/null
}

config_has_ini_false() {
  file="$1"
  key="$2"
  [ -f "$file" ] || return 1
  grep -qiE "^[[:space:]]*$key[[:space:]]+false([[:space:]#]|$)|^[[:space:]]*$key[[:space:]]*=[[:space:]]*false([[:space:]#]|$)" "$file" 2>/dev/null
}

bump() { [ "$1" -gt "$worst" ] && worst="$1"; return 0; }

# ---------------------------------------------------------------------------
section "1. On-disk SSH private keys"
ssh_keys=()
for f in "$HOME"/.ssh/id_* "$HOME"/.ssh/*.pem; do
  [ -f "$f" ] || continue
  case "$f" in
    *.pub | *known_hosts* | *authorized_keys* | *config) continue ;;
  esac
  ssh_keys+=("$f")
done

if [ "${#ssh_keys[@]}" -eq 0 ]; then
  pass "No private SSH key files found in ~/.ssh."
else
  for f in "${ssh_keys[@]}"; do
    if is_unencrypted_private_key "$f"; then
      fail "Unencrypted private SSH key on disk: $f."
    else
      fail "Private SSH key on disk: $f. Even encrypted keys should live in an approved vault/agent."
    fi
  done
fi

# ---------------------------------------------------------------------------
section "2. Plaintext credentials in common files"
section_failed=0

for npmrc in "/.npmrc"; do
  if has_npm_auth_token "$npmrc"; then
    fail "npm auth material in $npmrc."
    section_failed=1
  fi
done

if [ -f "$HOME/.netrc" ] && grep -qiE '(^|[[:space:]])(password|login)[[:space:]]+' "$HOME/.netrc" 2>/dev/null; then
  fail "Credentials in ~/.netrc."
  section_failed=1
fi

if git config --global --get credential.helper 2>/dev/null | grep -q '^store$'; then
  fail "git credential.helper=store writes plaintext ~/.git-credentials."
  section_failed=1
fi

if [ -f "$HOME/.git-credentials" ]; then
  fail "Plaintext ~/.git-credentials present."
  section_failed=1
fi

for rc in "$HOME/.zshrc" "$HOME/.bashrc" "$HOME/.profile" "$HOME/.zprofile" "$HOME/.config/fish/config.fish"; do
  if has_secret_assignment "$rc"; then
    fail "Hardcoded secret-like assignment in $rc."
    section_failed=1
  fi
done

[ "$section_failed" -eq 0 ] && pass "No plaintext credentials found in npmrc, netrc, git credential files, or shell startup files."

# ---------------------------------------------------------------------------
section "3. Local cloud and registry sessions"
section_failed=0

# Directory existence alone is too noisy. Only fail on concrete credential/token files.
for aws_file in "$HOME/.aws/credentials" "$HOME/.aws/config"; do
  if has_cloud_plaintext_credentials "$aws_file"; then
    fail "AWS credential material found in $aws_file."
    section_failed=1
  fi
done

if [ -d "$HOME/.azure" ]; then
  for azure_file in "$HOME"/.azure/accessTokens.json "$HOME"/.azure/msal_token_cache.json "$HOME"/.azure/msal_token_cache.bin; do
    if [ -s "$azure_file" ]; then
      fail "Azure CLI token cache present: $azure_file."
      section_failed=1
    fi
  done
fi

# gcloud is intentionally ignored for now. The CLI normally stores credentials
# under ~/.config/gcloud, and the team does not yet have a low-noise remediation
# path for all developer workflows.

if [ -f "$HOME/.docker/config.json" ]; then
  if grep -qE '"auth"[[:space:]]*:' "$HOME/.docker/config.json" 2>/dev/null; then
    fail "Docker registry auth is stored in ~/.docker/config.json."
    section_failed=1
  elif grep -qE '"credsStore"|"credHelpers"' "$HOME/.docker/config.json" 2>/dev/null; then
    pass "Docker is configured to use an external credential helper."
  fi
fi

[ "$section_failed" -eq 0 ] && pass "No concrete local cloud, Docker, or npm credential material found."

# ---------------------------------------------------------------------------
section "4. Secret-like values in the live environment"
if env | grep -qiE '^[A-Z_]*(TOKEN|SECRET|API_?KEY|PASSWORD|PRIVATE_?KEY)[A-Z_]*=.{12,}' >/dev/null 2>&1; then
  fail "Secret-like values are present in the current process environment."
else
  pass "No secret-like values found in the current process environment."
fi

# ---------------------------------------------------------------------------
section "5. GitHub credential (gh) audit"
if ! has_command gh; then
  pass "gh is not installed."
elif ! gh auth token >/dev/null 2>&1; then
  pass "gh is logged out."
else
  hosts="${GH_CONFIG_DIR:-$HOME/.config/gh}/hosts.yml"
  if [ -f "$hosts" ] && grep -qiE '^[[:space:]]*oauth_token:' "$hosts"; then
    fail "gh token appears to be stored plaintext at $hosts."
  fi

  hdrs="$(gh api -i /user 2>/dev/null | tr -d '\r')"
  if printf '%s\n' "$hdrs" | grep -qi '^X-Oauth-Scopes:'; then
    scopes="$(printf '%s\n' "$hdrs" | grep -i '^X-Oauth-Scopes:' | cut -d: -f2-)"
    scopes_normalized="$(printf '%s' "$scopes" | tr ',' '\n' | trim)"

    if printf '%s\n' "$scopes_normalized" | grep -qix 'repo'; then
      fail "gh token has repo scope: full read/write access to private repos."
    elif printf '%s\n' "$scopes_normalized" | grep -qiE '^(public_repo|workflow|delete_repo|admin:.*|write:.*|delete:.*)$'; then
      fail "gh token carries write/admin scopes: $(printf '%s' "$scopes" | trim)."
    else
      pass "gh token scopes do not include obvious write/admin scopes: $(printf '%s' "${scopes:-<none>}" | trim)."
    fi
  else
    warn "gh token scopes could not be introspected; verify this fine-grained/App token manually."
  fi
fi

# ---------------------------------------------------------------------------
section "6. Supply-chain attack IOC quick check"
ioc=0

for rc in "$HOME/.zshrc" "$HOME/.bashrc"; do
  if [ -f "$rc" ] && tail -n5 "$rc" 2>/dev/null | grep -qiE 'shutdown -h|halt|poweroff'; then
    fail "$rc ends with a shutdown/halt command, a known s1ngularity-style marker."
    ioc=1
  fi
done

for path in \
  "$HOME/.config/gh-token-monitor" \
  "$HOME/.config/gh-token-monitor/token" \
  "$HOME/.local/bin/gh-token-monitor.sh" \
  "$HOME/Library/LaunchAgents/com.user.gh-token-monitor.plist" \
  "$HOME/.config/systemd/user/gh-token-monitor.service" \
  "$HOME/.config/kitty-monitor" \
  "$HOME/.config/kitty-monitor/token" \
  "$HOME/.local/bin/kitty-monitor.sh" \
  "$HOME/Library/LaunchAgents/com.user.kitty-monitor.plist" \
  "$HOME/.config/systemd/user/kitty-monitor.service" \
  "$HOME/.local/share/kitty/cat.py" \
  "$HOME/.config/systemd/user/pgsql-monitor.service" \
  "$HOME/.local/bin/pgmonitor.py" \
  "$HOME/.cache/.sys-update-check" \
  "$HOME/.cache/.sys-update-check-k8s" \
  "/var/tmp/.gh_update_state"; do
  if fail_path_if_exists "$path" "Known malicious persistence or staging artifact found"; then
    ioc=1
  fi
done

if [ -d "$HOME/.dev-env" ] && { [ -f "$HOME/.dev-env/.runner" ] || [ -f "$HOME/.dev-env/.credentials" ] || [ -f "$HOME/.dev-env/config.sh" ] || [ -f "$HOME/.dev-env/run.sh" ]; }; then
  fail "GitHub Actions runner-like persistence directory found: $HOME/.dev-env."
  ioc=1
fi

IOC_SCAN_ROOTS="${IOC_SCAN_ROOTS:-}"
if [ -n "$IOC_SCAN_ROOTS" ]; then
  warn "Current-tree IOC scan is skipped in fast mode even though IOC_SCAN_ROOTS is set; host IOC checks still ran."
else
  pass "Current-tree IOC scan skipped for speed; host IOC checks ran."
fi

if [ -f "/.claude/settings.json" ] && grep -qE '"hooks"|"mcpServers"|"env"' "/.claude/settings.json" 2>/dev/null; then
  fail "/.claude/settings.json defines hooks, mcpServers, or env."
  ioc=1
fi

[ "$ioc" -eq 0 ] && pass "No known IOC markers found in shallow scan."

# ---------------------------------------------------------------------------
section "7. Local security posture"

section_failed=0

if grep -qE '^[[:space:]]*ignore-scripts[[:space:]]*=[[:space:]]*true' "$HOME/.npmrc" 2>/dev/null; then
  pass "ignore-scripts=true is set in ~/.npmrc."
else
  fail "ignore-scripts=true is not set in ~/.npmrc."
  section_failed=1
fi

for npmrc in "/.npmrc"; do
  [ -f "$npmrc" ] || continue
  if grep -qiE '^[[:space:]]*ignore-scripts[[:space:]]*=[[:space:]]*false([[:space:]#]|$)' "$npmrc" 2>/dev/null; then
    fail "npm ignore-scripts is explicitly disabled in $npmrc."
    section_failed=1
  fi
  if grep -qiE '^[[:space:]]*dangerously-allow-all-builds[[:space:]]*=[[:space:]]*true([[:space:]#]|$)' "$npmrc" 2>/dev/null; then
    fail "pnpm dangerously-allow-all-builds=true is set in $npmrc."
    section_failed=1
  fi
done

for yarnrc in "/.yarnrc.yml"; do
  [ -f "$yarnrc" ] || continue
  if config_has_yaml_true "$yarnrc" "enableScripts"; then
    fail "Yarn enableScripts=true enables third-party postinstall scripts: $yarnrc."
    section_failed=1
  fi
done

for yarnrc in "/.yarnrc"; do
  [ -f "$yarnrc" ] || continue
  if config_has_ini_false "$yarnrc" "--ignore-scripts" || config_has_ini_false "$yarnrc" "ignore-scripts"; then
    fail "Yarn classic ignore-scripts is explicitly disabled: $yarnrc."
    section_failed=1
  fi
done

if env | grep -qE '^BUN_FEATURE_FLAG_DISABLE_IGNORE_SCRIPTS=1$' >/dev/null 2>&1; then
  fail "BUN_FEATURE_FLAG_DISABLE_IGNORE_SCRIPTS=1 is set in the environment."
  section_failed=1
fi

[ "$section_failed" -eq 0 ] && pass "No unsafe package-manager script policy overrides found."

# ---------------------------------------------------------------------------
# Locations only, never contents. .env files are allowed to exist, but they fail
# if they contain secret-looking assignments.
# Override roots with SWEEP_ROOTS; default is $HOME.
SWEEP_ROOTS="${SWEEP_ROOTS:-$HOME}"
section "8. Dot-env file sweep from $SWEEP_ROOTS (may take ~20 seconds)"

# Dirs we never descend into: speed (node_modules/caches) + avoid personal data.
# -prune SKIPS the subtree entirely; '! -path' would still walk every file in it.
prune_expr=()
for d in node_modules .git .polygraph .cache .Trash .npm .pnpm-store .yarn .gradle .m2 \
         Library .local/share/Trash dist build .next .turbo .venv venv vendor; do
  prune_expr+=( -name "$d" -o )
done
unset 'prune_expr[${#prune_expr[@]}-1]'   # drop trailing -o

sweep_hits=0
env_files=0
sweep_failed=0
for root in $SWEEP_ROOTS; do
  [ -d "$root" ] || continue
  while IFS= read -r f; do
    [ -n "$f" ] || continue
    case "$f" in
      # template/sample env files are meant to be committed; not secrets
      *.example|*.sample|*.template|*.dist|*.md) continue;;
    esac
    base="$(basename "$f")"
    case "$base" in
      .env|.env.*)
        env_files=$((env_files+1))
        if has_env_secret_assignment "$f"; then
          fail "Secret-like assignment found in env file: $f"
          sweep_failed=1
        fi
        ;;
    esac
    sweep_hits=$((sweep_hits+1))
  done < <(
    find "$root" \
      \( -type d \( "${prune_expr[@]}" \) -prune \) -o \
      -type f \( \
           -name '.env' -o -name '.env.*' \
      \) -print 2>/dev/null
  )
done
if [ "$sweep_hits" -eq 0 ]; then
  pass "No env files found under: $SWEEP_ROOTS"
elif [ "$sweep_failed" -eq 0 ]; then
  pass "Found $env_files env file(s), but no secret-like assignments in scanned env files."
fi

# ---------------------------------------------------------------------------
section "Result"
if [ "$worst" -eq 0 ]; then
  verdict=PASS
else
  verdict=FAIL
fi

note "$verdict" "Overall: $verdict"

warn_count=0
for finding in "${FINDINGS[@]}"; do
  case "$finding" in
    WARN\|*) warn_count=$((warn_count+1)) ;;
  esac
done

if [ "$warn_count" -gt 0 ]; then
  section "Warnings"
  for finding in "${FINDINGS[@]}"; do
    case "$finding" in
      WARN\|*) printf '  - %s\n' "${finding#WARN|}" ;;
    esac
  done
fi

exit "$worst"

