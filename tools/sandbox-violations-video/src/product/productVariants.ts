import { PVariant } from "./ProductMovie";
import { theme } from "../theme";

/**
 * 5 product-demo variants, all 20s (600f): title → run (slow, per-task cache)
 * → dashboard (1 of 3) → fix-with-AI. No skull anywhere; the cache is framed
 * as a reliability guarantee. Three use "unreliable" wording, two use
 * "poisoning" (P4, P5).
 */
const arc = (
  runStyle: "rows" | "cards",
  title: string,
  sub: string
): PVariant["scenes"] => [
  { kind: "title", dur: 70, title, sub },
  { kind: "run", style: runStyle, dur: 180 },
  { kind: "dashboard", dur: 170 },
  { kind: "fix", dur: 180 },
];

export const PRODUCT_VARIANTS: PVariant[] = [
  {
    id: "P1-Guarantee",
    bg: "radial",
    accent: theme.green,
    trans: "fade",
    mode: "unreliable",
    scenes: arc(
      "rows",
      "One task read a file Nx didn't expect.",
      "See how Nx Cloud keeps every cache honest."
    ),
  },
  {
    id: "P2-Inputs",
    bg: "flat",
    accent: theme.cyan,
    trans: "slide",
    mode: "unreliable",
    scenes: arc(
      "rows",
      "Your cache is only as good as its inputs.",
      "Nx Cloud guarantees it stays reliable."
    ),
  },
  {
    id: "P3-PerTask",
    bg: "radial",
    accent: theme.purple,
    trans: "fade",
    mode: "unreliable",
    scenes: arc(
      "cards",
      "Three tasks. Three caches. One problem.",
      "Fix it in a single click."
    ),
  },
  {
    id: "P4-PoisonAware",
    bg: "grid",
    accent: theme.amber,
    trans: "fade",
    mode: "poison",
    scenes: arc(
      "rows",
      "An untracked input can poison a task's cache.",
      "Nx Cloud catches it before you ship."
    ),
  },
  {
    id: "P5-TrustHits",
    bg: "radial",
    accent: theme.purple,
    trans: "slide",
    mode: "poison",
    scenes: arc(
      "cards",
      "Cache hits you can actually trust.",
      "Even when a task misbehaves."
    ),
  },
];
