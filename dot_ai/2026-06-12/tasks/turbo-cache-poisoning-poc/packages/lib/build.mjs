import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

// Bundlers routinely inline content read from shared locations (banners, version
// stamps, generated constants, license headers). Here we inline the root-level
// brand banner directly into the emitted artifact.
const banner = readFileSync(new URL("../../shared/brand.js", import.meta.url), "utf8");
const src = readFileSync(new URL("./src/index.js", import.meta.url), "utf8");

mkdirSync(new URL("./dist/", import.meta.url), { recursive: true });

// The banner is concatenated as executable code: anything in shared/brand.js runs
// the moment this module is loaded.
const out = `// ---- inlined from shared/brand.js (NOT in cache key) ----
${banner}
// ---- package source ----
${src.replace("export function", "function")}
module.exports = { greet };
`;

writeFileSync(new URL("./dist/index.js", import.meta.url), out);
console.log("[@poc/lib] built dist/index.js");
