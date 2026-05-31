/**
 * Combined-arc story (v2): tasks run → `api:build` does an unexpected input
 * read → cache is now untrustworthy → Nx Cloud sandbox flags it → simplified
 * dashboard shows 1 of 3 tasks violating → "Fix with AI" repairs the input
 * config so build is protected from cache poisoning.
 */
export const STORY2 = {
  tasks: [
    { id: "api:build", project: "api", target: "build", bad: true },
    { id: "ui:test", project: "ui", target: "test", bad: false },
    { id: "auth:lint", project: "auth", target: "lint", bad: false },
  ],
  total: 3,
  violations: 1,
  badTask: "api:build",
  file: "../shared/config.json",
  inputsBefore: ["production", "^production"],
  added: "../shared/config.json",
} as const;

// frame for fraction f of a scene of length dur
export const at = (dur: number, f: number) => Math.round(dur * f);
