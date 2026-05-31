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

/**
 * Refined P2: three builds, each running in its own sandbox. backend:build
 * reaches outside its sandbox to read a shared file it never declared, so only
 * backend:build's cache becomes unreliable. frontend & shared-lib stay clean.
 */
export interface DashStory {
  violations: number;
  total: number;
  badTask: string;
  file: string;
  projectJson: string;
  inputsBefore: readonly string[];
  added: string;
  unit: "builds" | "tasks";
  rows: readonly { id: string; bad: boolean; reads: number }[];
}

export const BUILD_STORY = {
  tasks: [
    { id: "frontend:build", bad: false },
    { id: "shared-lib:build", bad: false },
    { id: "backend:build", bad: true },
  ],
  total: 3,
  violations: 1,
  badTask: "backend:build",
  declared: "src/**, project deps",
  file: "libs/shared/config.json",
  projectJson: "apps/backend/project.json",
  inputsBefore: ["production", "^production"],
  added: "{workspaceRoot}/libs/shared/config.json",
} as const;

/** Build-themed story for the shared Dashboard/Fix scenes (P2). */
export const BUILD_DASH: DashStory = {
  violations: BUILD_STORY.violations,
  total: BUILD_STORY.total,
  badTask: BUILD_STORY.badTask,
  file: BUILD_STORY.file,
  projectJson: BUILD_STORY.projectJson,
  inputsBefore: BUILD_STORY.inputsBefore,
  added: BUILD_STORY.added,
  unit: "builds",
  rows: [
    { id: "frontend:build", bad: false, reads: 0 },
    { id: "shared-lib:build", bad: false, reads: 0 },
    { id: "backend:build", bad: true, reads: 1 },
  ],
};

/** Default story (the api:build arc) so existing variants are unchanged. */
export const DEFAULT_DASH: DashStory = {
  violations: STORY2.violations,
  total: STORY2.total,
  badTask: STORY2.badTask,
  file: STORY2.file,
  projectJson: "apps/api/project.json",
  inputsBefore: STORY2.inputsBefore,
  added: STORY2.added,
  unit: "tasks",
  rows: [
    { id: "api:build", bad: true, reads: 1 },
    { id: "ui:test", bad: false, reads: 0 },
    { id: "auth:lint", bad: false, reads: 0 },
  ],
};

