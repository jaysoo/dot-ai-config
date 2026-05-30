// Renders all 5 variations to out/*.mp4
import { execSync } from "node:child_process";

const ids = [
  "V1-Terminal",
  "V2-Dashboard",
  "V3-CachePoison",
  "V4-Kinetic",
  "V5-Pipeline",
];

// Allow pointing at a pre-installed Chromium (e.g. Playwright's) when Remotion
// can't download its own Chrome Headless Shell.
const browser = process.env.REMOTION_BROWSER_EXECUTABLE
  ? `--browser-executable="${process.env.REMOTION_BROWSER_EXECUTABLE}"`
  : "";

for (const id of ids) {
  console.log(`\n▶ Rendering ${id} ...`);
  execSync(`npx remotion render src/index.ts ${id} out/${id}.mp4 ${browser}`, {
    stdio: "inherit",
  });
}
console.log("\n✅ All variations rendered to out/");
