import { Variant } from "./Movie";
import { theme } from "../theme";

/**
 * 10 variants of the combined arc (run → [cache] → dashboard → fix).
 * 5 at 10s (300f) and 5 at 20s (600f). Scene durations within each variant
 * sum to the target length.
 */
export const VARIANTS: Variant[] = [
  /* ===================================================== 10s (300 frames) */
  {
    id: "C1-GraphFlow", // canonical: graph run → dashboard → fix
    bg: "radial",
    accent: theme.green,
    trans: "fade",
    scenes: [
      { kind: "run", style: "graph", dur: 112 },
      { kind: "dashboard", dur: 108 },
      { kind: "fix", dur: 80 },
    ],
  },
  {
    id: "C2-Terminal", // terminal run, slide transitions
    bg: "flat",
    accent: theme.cyan,
    trans: "slide",
    scenes: [
      { kind: "run", style: "terminal", dur: 102 },
      { kind: "dashboard", dur: 108 },
      { kind: "fix", dur: 90 },
    ],
  },
  {
    id: "C3-Kinetic", // kinetic title intro, then quick fix
    bg: "flat",
    accent: theme.amber,
    trans: "fade",
    scenes: [
      { kind: "title", dur: 48, title: "Your cache is only as honest as its inputs.", sub: "Nx Cloud sandbox" },
      { kind: "run", style: "graph", dur: 92 },
      { kind: "dashboard", dur: 80 },
      { kind: "fix", dur: 80 },
    ],
  },
  {
    id: "C4-Security", // red security framing, grid bg
    bg: "grid",
    accent: theme.red,
    secur: true,
    trans: "fade",
    scenes: [
      { kind: "run", style: "graph", dur: 110 },
      { kind: "dashboard", dur: 100 },
      { kind: "fix", dur: 90 },
    ],
  },
  {
    id: "C5-Cards", // card-based run, purple, slide
    bg: "radial",
    accent: theme.purple,
    trans: "slide",
    scenes: [
      { kind: "run", style: "cards", dur: 112 },
      { kind: "dashboard", dur: 108 },
      { kind: "fix", dur: 80 },
    ],
  },

  /* ===================================================== 20s (600 frames) */
  {
    id: "L1-Walkthrough", // full arc with the cache explainer
    bg: "radial",
    accent: theme.green,
    trans: "fade",
    scenes: [
      { kind: "run", style: "graph", dur: 150 },
      { kind: "cache", dur: 140 },
      { kind: "dashboard", dur: 160 },
      { kind: "fix", dur: 150 },
    ],
  },
  {
    id: "L2-SecurityDeepDive", // poisoning-first, grid + red
    bg: "grid",
    accent: theme.red,
    secur: true,
    trans: "fade",
    scenes: [
      { kind: "run", style: "graph", dur: 140 },
      { kind: "cache", dur: 160 },
      { kind: "dashboard", dur: 150 },
      { kind: "fix", dur: 150 },
    ],
  },
  {
    id: "L3-ProductDemo", // title + cards + heavy dashboard/fix focus
    bg: "radial",
    accent: theme.purple,
    trans: "slide",
    scenes: [
      { kind: "title", dur: 60, title: "One unexpected read can poison your cache.", sub: "Fix it with one click." },
      { kind: "run", style: "cards", dur: 140 },
      { kind: "dashboard", dur: 180 },
      { kind: "fix", dur: 220 },
    ],
  },
  {
    id: "L4-Narrative", // caption-led, cyan
    bg: "flat",
    accent: theme.cyan,
    trans: "fade",
    scenes: [
      { kind: "title", dur: 70, title: "Three tasks ran. One lied about its inputs.", sub: "Here's what Nx Cloud did about it." },
      { kind: "run", style: "graph", dur: 140 },
      { kind: "cache", dur: 140 },
      { kind: "dashboard", dur: 120 },
      { kind: "fix", dur: 130 },
    ],
  },
  {
    id: "L5-GraphCentric", // long graph emphasis
    bg: "radial",
    accent: theme.green,
    trans: "fade",
    scenes: [
      { kind: "run", style: "graph", dur: 180 },
      { kind: "cache", dur: 150 },
      { kind: "dashboard", dur: 140 },
      { kind: "fix", dur: 130 },
    ],
  },
];
