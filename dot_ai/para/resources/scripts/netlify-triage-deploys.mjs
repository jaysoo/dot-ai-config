#!/usr/bin/env node
/**
 * Netlify Deploy Triage Script
 *
 * Fetches pending_review deploys across Netlify sites, checks if associated
 * PRs touch relevant paths, auto-rejects irrelevant deploys, and lists
 * ones needing review. For PRs with multiple deploys, only the latest is
 * kept for review.
 *
 * Usage:
 *   node netlify-triage-deploys.mjs [--dry-run] [--reject]
 *
 * Flags:
 *   --dry-run   Show what would happen without rejecting (default)
 *   --reject    Actually reject non-relevant deploys
 *
 * Requires: NETLIFY_TOKEN env var, gh CLI authenticated
 */

import { execSync } from "node:child_process";

const TOKEN = process.env.NETLIFY_TOKEN;
const REPO = "nrwl/nx";
const DRY_RUN = !process.argv.includes("--reject");

if (!TOKEN) {
  console.error(
    "Error: NETLIFY_TOKEN not set. Run: export NETLIFY_TOKEN='your-token'"
  );
  process.exit(1);
}

// --- Site configurations ---
// Each site has a Netlify site ID and path prefixes that are relevant.
// A PR needs to touch at least one relevant path to warrant review.

const SITES = [
  {
    name: "nx-docs",
    siteId: "97126ce8-23a6-4afa-81d5-cfd11be8f614",
    relevantPaths: ["astro-docs/"],
    description: "Astro docs site",
  },
  {
    name: "nx-dev",
    siteId: "3b166fac-34f7-4db1-8059-3cdf998e4af0",
    relevantPaths: ["docs/", "blog/", "nx-dev/"],
    description: "Next.js marketing site",
  },
];

// --- Netlify API helpers ---

async function fetchPendingDeploys(siteId) {
  const deploys = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `https://api.netlify.com/api/v1/sites/${siteId}/deploys?state=pending_review&per_page=100&page=${page}`,
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );
    if (!res.ok)
      throw new Error(`Netlify API error: ${res.status} ${res.statusText}`);

    const batch = await res.json();
    if (batch.length === 0) break;

    deploys.push(...batch);
    process.stderr.write(`  Fetched page ${page} (${batch.length} deploys)\n`);
    page++;
  }

  return deploys;
}

async function rejectDeploy(deployId) {
  const res = await fetch(
    `https://api.netlify.com/api/v1/deploys/${deployId}/cancel`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
    }
  );
  if (!res.ok)
    throw new Error(`Failed to reject ${deployId}: ${res.status}`);
  return res.json();
}

// --- GitHub helpers ---

// Cache: PR number -> { files, state }
const prCache = new Map();

function getPrInfo(prNumber) {
  if (prCache.has(prNumber)) return prCache.get(prNumber);

  try {
    const output = execSync(
      `gh pr view ${prNumber} --repo ${REPO} --json files,state --jq '{state: .state, files: [.files[].path]}'`,
      { encoding: "utf-8", timeout: 15000, stdio: ["pipe", "pipe", "pipe"] }
    ).trim();
    const info = JSON.parse(output);
    prCache.set(prNumber, info);
    return info;
  } catch (e) {
    prCache.set(prNumber, null);
    return null;
  }
}

function touchesRelevantPaths(files, relevantPaths) {
  if (!files) return null;
  return files.some((f) => relevantPaths.some((p) => f.startsWith(p)));
}

function getRelevantFiles(files, relevantPaths) {
  if (!files) return [];
  return files.filter((f) => relevantPaths.some((p) => f.startsWith(p)));
}

// --- Process one site ---

async function triageSite(site) {
  console.log(`\n${"#".repeat(70)}`);
  console.log(`# ${site.name} (${site.description})`);
  console.log(`# Relevant paths: ${site.relevantPaths.join(", ")}`);
  console.log(`${"#".repeat(70)}`);

  console.log("\nFetching pending deploys...");
  const deploys = await fetchPendingDeploys(site.siteId);
  console.log(`Found ${deploys.length} pending deploys\n`);

  if (deploys.length === 0) {
    console.log("Nothing to do!");
    return { reject: [], review: [], unknown: [], total: 0, prCount: 0 };
  }

  const results = {
    reject: [],
    review: [],
    unknown: [],
  };

  // Group by PR
  const prMap = new Map();

  for (const deploy of deploys) {
    const prNumber = deploy.review_id;
    if (!prNumber) {
      results.unknown.push({ deploy, reason: "no PR associated" });
      continue;
    }
    if (!prMap.has(prNumber)) {
      prMap.set(prNumber, { deploys: [] });
    }
    prMap.get(prNumber).deploys.push(deploy);
  }

  // Check each PR
  const prNumbers = [...prMap.keys()];
  console.log(`Checking ${prNumbers.length} unique PRs...`);

  for (let i = 0; i < prNumbers.length; i++) {
    const prNumber = prNumbers[i];
    const entry = prMap.get(prNumber);

    process.stderr.write(
      `  [${i + 1}/${prNumbers.length}] PR #${prNumber}...`
    );
    const info = getPrInfo(prNumber);
    const files = info?.files ?? null;
    const isRelevant = touchesRelevantPaths(files, site.relevantPaths);

    if (info === null) {
      process.stderr.write(" (couldn't fetch PR)\n");
      for (const deploy of entry.deploys) {
        results.unknown.push({
          deploy,
          reason: `PR #${prNumber} inaccessible`,
        });
      }
    } else if (info.state === "MERGED" || info.state === "CLOSED") {
      process.stderr.write(` ${info.state.toLowerCase()} -> reject\n`);
      for (const deploy of entry.deploys) {
        results.reject.push({
          deploy,
          prNumber,
          reason: info.state.toLowerCase(),
        });
      }
    } else if (isRelevant) {
      const relevantFiles = getRelevantFiles(files, site.relevantPaths);
      process.stderr.write(` relevant (${relevantFiles.length} files)`);
      // Keep only the latest deploy, reject older ones
      const [latest, ...older] = entry.deploys;
      results.review.push({
        deploy: latest,
        prNumber,
        files,
        relevantFiles,
      });
      for (const deploy of older) {
        results.reject.push({
          deploy,
          prNumber,
          reason: "stale deploy",
        });
      }
      if (older.length > 0) {
        process.stderr.write(
          ` (keeping latest, rejecting ${older.length} stale)`
        );
      }
      process.stderr.write("\n");
    } else {
      process.stderr.write(" no relevant changes\n");
      for (const deploy of entry.deploys) {
        results.reject.push({ deploy, prNumber, reason: "no relevant changes" });
      }
    }
  }

  // Report
  console.log("\n" + "-".repeat(70));

  // Reject list
  console.log(`\n--- REJECT (${results.reject.length} deploys) ---`);
  if (results.reject.length > 0) {
    const byPr = new Map();
    for (const r of results.reject) {
      if (!byPr.has(r.prNumber))
        byPr.set(r.prNumber, { deploys: [], reason: r.reason });
      byPr.get(r.prNumber).deploys.push(r.deploy);
    }
    for (const [pr, { deploys: deps, reason }] of byPr) {
      console.log(
        `  PR #${pr} (${deps.length} deploy${deps.length > 1 ? "s" : ""}, ${reason}): ${deps[0].title}`
      );
    }
  }

  // Review list
  console.log(`\n--- REVIEW (${results.review.length} deploys) ---`);
  if (results.review.length > 0) {
    for (const r of results.review) {
      console.log(`  PR #${r.prNumber}: ${r.deploy.title}`);
      console.log(`    URL: https://github.com/${REPO}/pull/${r.prNumber}`);
      console.log(`    Preview: ${r.deploy.deploy_ssl_url}`);
      console.log(`    Relevant files (${r.relevantFiles.length}):`);
      for (const f of r.relevantFiles.slice(0, 5)) {
        console.log(`      - ${f}`);
      }
      if (r.relevantFiles.length > 5) {
        console.log(`      ... and ${r.relevantFiles.length - 5} more`);
      }
    }
  }

  // Unknown
  if (results.unknown.length > 0) {
    console.log(`\n--- UNKNOWN (${results.unknown.length} deploys) ---`);
    for (const u of results.unknown) {
      console.log(`  ${u.deploy.id}: ${u.deploy.title} (${u.reason})`);
    }
  }

  return {
    ...results,
    total: deploys.length,
    prCount: prMap.size,
  };
}

// --- Main ---

async function main() {
  console.log(
    DRY_RUN
      ? "=== DRY RUN (use --reject to actually reject) ==="
      : "=== LIVE MODE: will reject irrelevant deploys ==="
  );

  // Triage all sites
  const allResults = [];
  for (const site of SITES) {
    const results = await triageSite(site);
    allResults.push({ site, ...results });
  }

  // Aggregate
  const totalReject = allResults.flatMap((r) => r.reject);
  const totalReview = allResults.flatMap((r) => r.review);
  const totalUnknown = allResults.flatMap((r) => r.unknown);
  const totalDeploys = allResults.reduce((sum, r) => sum + r.total, 0);
  const totalPrs = allResults.reduce((sum, r) => sum + r.prCount, 0);

  // Reject
  console.log("\n" + "=".repeat(70));
  if (DRY_RUN) {
    console.log(
      `Would reject ${totalReject.length} deploys across ${SITES.length} sites. Run with --reject to execute.`
    );
  } else {
    console.log(
      `Rejecting ${totalReject.length} deploys across ${SITES.length} sites...`
    );
    let rejected = 0;
    for (const r of totalReject) {
      try {
        await rejectDeploy(r.deploy.id);
        rejected++;
        if (rejected % 10 === 0) {
          process.stderr.write(
            `  Rejected ${rejected}/${totalReject.length}\n`
          );
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (e) {
        console.error(`  Failed to reject ${r.deploy.id}: ${e.message}`);
      }
    }
    console.log(
      `\nDone! Rejected ${rejected}/${totalReject.length} deploys.`
    );
  }

  // Grand summary
  console.log("\n" + "=".repeat(70));
  console.log("GRAND SUMMARY");
  console.log("=".repeat(70));
  for (const r of allResults) {
    console.log(
      `  ${r.site.name.padEnd(12)} ${String(r.total).padStart(3)} pending, ${String(r.reject.length).padStart(3)} reject, ${String(r.review.length).padStart(3)} review, ${String(r.unknown.length).padStart(3)} unknown`
    );
  }
  console.log("  " + "-".repeat(60));
  console.log(
    `  ${"TOTAL".padEnd(12)} ${String(totalDeploys).padStart(3)} pending, ${String(totalReject.length).padStart(3)} reject, ${String(totalReview.length).padStart(3)} review, ${String(totalUnknown.length).padStart(3)} unknown`
  );
  console.log(`  Unique PRs checked: ${prCache.size}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
