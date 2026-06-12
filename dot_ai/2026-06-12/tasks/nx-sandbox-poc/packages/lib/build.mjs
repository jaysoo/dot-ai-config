import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

// Same misconfig as the Turbo PoC: inline a file that lives outside the project
// and outside the declared inputs. Whatever is in shared/brand.js becomes
// executable code in the artifact.
const banner = readFileSync(new URL("../../shared/brand.js", import.meta.url), "utf8");
const src = readFileSync(new URL("./src/index.js", import.meta.url), "utf8");

mkdirSync(new URL("./dist/", import.meta.url), { recursive: true });
const out = `// ---- inlined from shared/brand.js (NOT in cache key) ----
${banner}
// ---- project source ----
${src.replace("export function", "function")}
module.exports = { greet };
`;
writeFileSync(new URL("./dist/index.js", import.meta.url), out);
console.log("[lib] built dist/index.js");
