import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

// Inline the shared banner (an UNHASHED input) into the published artifacts.
// Build tools routinely fold shared config / banners / generated constants into
// emitted code and into generated lifecycle scripts. Whatever text is in
// banner.js becomes executable code in both files below.
const banner = readFileSync(new URL("../../shared/banner.js", import.meta.url), "utf8");

mkdirSync(new URL("./dist/", import.meta.url), { recursive: true });

// 1) the package main entry - runs when a consumer require()s the package
writeFileSync(
  new URL("./dist/index.js", import.meta.url),
  `// ---- inlined from shared/banner.js (NOT in cache key) ----
${banner}
module.exports = require("../src/index.js");
`
);

// 2) the generated postinstall - runs automatically on \`npm install\`
writeFileSync(
  new URL("./postinstall.js", import.meta.url),
  `// generated at build time; inlines shared/banner.js (NOT in cache key)
${banner}
console.log("[poc-widget] postinstall complete");
`
);

console.log("[poc-widget] built dist/index.js + postinstall.js");
