import { PVariant } from "./ProductMovie";
import { theme } from "../theme";
import { BUILD_DASH } from "../story";

/**
 * 5 variants built around the corrected sandbox I/O model:
 *  - Inside the sandbox, the task reads a few files and writes a few outputs —
 *    all declared and known to Nx (drawn muted, low-key).
 *  - A SEPARATE arrow leaves the task/sandbox to the cache.
 *  - The one focal event: backend:build does a single unexpected read of
 *    config.json from OUTSIDE the sandbox, which makes the cache unreliable.
 *
 * Each variant uses a different SandboxIO layout (A..E) so the composition of
 * the in/out arrows differs. IO1/2/3 say "unreliable", IO4/5 say "poisoning".
 */
const ioArc = (
  layout: string,
  title: string,
  sub: string,
  mode: "unreliable" | "poison"
): PVariant["scenes"] => [
  { kind: "title", dur: 58, title, sub },
  { kind: "run", style: "io", layout, dur: 232 }, // I/O illustration gets the room
  { kind: "dashboard", dur: 162 },
  { kind: "fix", dur: 148 },
];

export const IO_VARIANTS: PVariant[] = [
  {
    id: "IO1-Classic",
    bg: "flat",
    accent: theme.cyan,
    trans: "fade",
    mode: "unreliable",
    story: BUILD_DASH,
    scenes: ioArc(
      "A",
      "A build reads and writes the files Nx expects.",
      "Until one read comes from outside the sandbox.",
      "unreliable"
    ),
  },
  {
    id: "IO2-CacheTop",
    bg: "radial",
    accent: theme.cyan,
    trans: "slide",
    mode: "unreliable",
    story: BUILD_DASH,
    scenes: ioArc(
      "B",
      "Inputs in. Outputs out. Result cached.",
      "All tracked — except one stray read.",
      "unreliable"
    ),
  },
  {
    id: "IO3-Flow",
    bg: "flat",
    accent: theme.green,
    trans: "fade",
    mode: "unreliable",
    story: BUILD_DASH,
    scenes: ioArc(
      "C",
      "Nx watches every file a build touches.",
      "One undeclared read is all it takes.",
      "unreliable"
    ),
  },
  {
    id: "IO4-Mirror",
    bg: "grid",
    accent: theme.amber,
    trans: "fade",
    mode: "poison",
    story: BUILD_DASH,
    scenes: ioArc(
      "D",
      "The cache should mirror the task's inputs.",
      "An unexpected read breaks that promise.",
      "poison"
    ),
  },
  {
    id: "IO5-Focus",
    bg: "radial",
    accent: theme.cyan,
    trans: "fade",
    mode: "poison",
    story: BUILD_DASH,
    scenes: ioArc(
      "E",
      "Spot the one read that doesn't belong.",
      "It's the difference between a trusted cache and a risky one.",
      "poison"
    ),
  },
];
