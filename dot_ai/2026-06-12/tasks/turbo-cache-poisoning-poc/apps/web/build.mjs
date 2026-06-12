import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

// The app consumes @poc/lib's BUILT output (the correct, package-boundary way).
// It depends on ^build, so Turbo restores @poc/lib/dist from cache before this runs.
const lib = readFileSync(
  new URL("../../packages/lib/dist/index.js", import.meta.url),
  "utf8"
);

mkdirSync(new URL("./dist/", import.meta.url), { recursive: true });
const out = `// @poc/web bundle (embeds @poc/lib)
${lib}
console.log("[@poc/web] app started, lib.greet() =", module.exports?.greet?.() ?? require("@poc/lib").greet());
`;
writeFileSync(new URL("./dist/index.js", import.meta.url), out);
console.log("[@poc/web] built dist/index.js");
