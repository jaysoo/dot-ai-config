import { readFile, rename, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const sourcePath = resolve(scriptDir, "../dot_codex/permissions.toml");
const codexHome = process.env.CODEX_HOME || join(homedir(), ".codex");
const targetPath = resolve(process.argv[2] || join(codexHome, "config.toml"));

const selectorStart = "# BEGIN dot-ai-config Codex permission selector";
const selectorEnd = "# END dot-ai-config Codex permission selector";
const profileStart = "# BEGIN dot-ai-config Codex permission profile";
const profileEnd = "# END dot-ai-config Codex permission profile";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function removeBlock(contents, start, end) {
  const pattern = new RegExp(
    `(?:^|\\n)${escapeRegExp(start)}\\n[\\s\\S]*?\\n${escapeRegExp(end)}(?:\\n|$)`,
    "g",
  );

  return contents.replace(pattern, "\n").trim();
}

const source = await readFile(sourcePath, "utf8");
const firstTable = source.search(/^\[/m);

if (firstTable === -1) {
  throw new Error(`${sourcePath} must contain a TOML table`);
}

const selector = source.slice(0, firstTable).trim();
const profile = source.slice(firstTable).trim();

let target = "";
try {
  target = await readFile(targetPath, "utf8");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

target = removeBlock(target, selectorStart, selectorEnd);
target = removeBlock(target, profileStart, profileEnd);

if (/^default_permissions\s*=/m.test(target)) {
  throw new Error(
    `${targetPath} already defines default_permissions outside the managed block`,
  );
}

if (/^\[permissions\.claude-compatible(?:\.|\])/m.test(target)) {
  throw new Error(
    `${targetPath} already defines claude-compatible outside the managed block`,
  );
}

const output = [
  selectorStart,
  selector,
  selectorEnd,
  "",
  target,
  "",
  profileStart,
  profile,
  profileEnd,
  "",
]
  .filter((part, index, parts) => part !== "" || parts[index - 1] !== "")
  .join("\n");

const temporaryPath = `${targetPath}.dot-ai-config.tmp`;
await writeFile(temporaryPath, output);
await rename(temporaryPath, targetPath);

console.log(`Synced Codex permission profile -> ${targetPath}`);
