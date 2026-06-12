import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const lib = readFileSync(
  new URL("../../packages/lib/dist/index.js", import.meta.url),
  "utf8"
);
mkdirSync(new URL("./dist/", import.meta.url), { recursive: true });
const out = `// @poc/web bundle (embeds lib)
${lib}
console.log("[web] app started, greet() =", greet());
`;
writeFileSync(new URL("./dist/index.js", import.meta.url), out);
console.log("[web] built dist/index.js");
