/**
 * Shared design tokens, pulled from the Nx Cloud sandbox-violations UI screenshots.
 * Keeping them in one place so all 5 variations feel like one product.
 */
export const theme = {
  bg: "#0c0c0f",
  bgPanel: "#141418",
  bgPanelHi: "#1c1c22",
  stroke: "#2a2a32",
  strokeHi: "#3a3a45",

  text: "#f4f4f6",
  textDim: "#a0a0ad",
  textFaint: "#6b6b78",

  // Nx Cloud accents
  green: "#33d979",
  greenDim: "#1f7a45",
  red: "#ef4444",
  redDim: "#7a1f1f",
  amber: "#f0b429",
  amberBg: "rgba(240, 180, 41, 0.08)",
  amberStroke: "rgba(240, 180, 41, 0.45)",
  purple: "#7c5cff",
  purpleBg: "rgba(124, 92, 255, 0.12)",
  purpleStroke: "rgba(124, 92, 255, 0.5)",
  cyan: "#3ad6e0",

  mono: "'SF Mono', 'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
  sans: "'Inter', -apple-system, system-ui, sans-serif",
} as const;

export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 300, // 10s
} as const;

// The shared story facts (matching the screenshots: 8 of 446).
export const STORY = {
  total: 446,
  violations: 8,
  clean: 438,
  tasks: [
    { name: "nx:build", project: "auth", status: "ok" as const },
    { name: "nx:test", project: "ui", status: "ok" as const },
    { name: "nx:lint", project: "workspace", status: "violation" as const },
  ],
  rogueFile: "../../tmp/.cache-state.json",
};
