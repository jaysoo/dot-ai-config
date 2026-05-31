# Sandbox Violations — Remotion explainers

Five 10-second React + [Remotion](https://remotion.dev) animations that distill the
Nx Cloud **sandbox violations** UI (CI run page + analytics dashboard) into a short
explainer. Each one tells the same 3-beat story in a different visual style:

1. **Call out the scale** — "8 of 446 tasks have sandbox violations" (the X-of-Y hook).
2. **Show it happen** — 3 tasks run; 2 are clean, 1 reads a file outside its declared
   inputs and gets flagged.
3. **Show why it matters** — re-running the flagged task serves a result straight from
   cache, even though an untracked file changed. The cache is unreliable → cache-poisoning risk.

> A *sandbox violation* = a task read or wrote files that aren't in the inputs/outputs
> Nx knows about. Either a misconfig (declare the input) or a bug in the project code.

## Variations

| ID | Name | Style |
|----|------|-------|
| `V1-Terminal` | Terminal Trace | CLI log stream — tasks run, one flags, re-run hits cache |
| `V2-Dashboard` | Analytics Dashboard | Recreates the purple analytics page: 8/446 stat + violations table |
| `V3-CachePoison` | Cache Poison | Security framing — declared inputs → hash → key never busts |
| `V4-Kinetic` | Kinetic Type | Minimal bold typography, 3 full-screen beats |
| `V5-Pipeline` | Pipeline Flow | Project-graph nodes feeding a shared cache that goes stale |

## Combined-arc variants (run → cache → dashboard → fix)

A second round that merges the V5 pipeline and V2 dashboard concepts into one
story and adds a **Fix with AI** resolution: 3 tasks run, `api:build` does an
unexpected read of `../shared/config.json` (test & lint stay clean), the cache
becomes untrustworthy, the simplified Nx Cloud UI shows **1 of 3** tasks
violating, then a cursor clicks *Fix with AI* and the missing input is written
into `project.json` — `api:build` is now protected from cache poisoning.

Built from composable scenes (`src/scenes/`) arranged per-variant in
`src/combined/variants.ts`. 5 are 10s, 5 are 20s (the longer ones include the
cache-key explainer and a verifying re-run).

| ID | Length | Style |
|----|--------|-------|
| `C1-GraphFlow` | 10s | Graph run → dashboard → fix (closest to V5+V2) |
| `C2-Terminal` | 10s | Terminal run, slide transitions, cyan |
| `C3-Kinetic` | 10s | Kinetic title intro, amber |
| `C4-Security` | 10s | Red security framing on a grid |
| `C5-Cards` | 10s | Card-based run, purple, slide |
| `L1-Walkthrough` | 20s | Full arc incl. cache-key explainer |
| `L2-SecurityDeepDive` | 20s | Poisoning-first, grid + red |
| `L3-ProductDemo` | 20s | Title + cards + big dashboard/fix focus |
| `L4-Narrative` | 20s | Caption-led, cyan |
| `L5-GraphCentric` | 20s | Long graph emphasis |

## Develop

```bash
npm install
npm run dev          # Remotion Studio at localhost:3000
```

## Render

```bash
# Renders the 10 combined variants to out/*.mp4 (1920x1080, 30fps)
npm run render:all
node render-all.mjs single   # just the first-round 5
node render-all.mjs all      # all 15

# If Remotion can't download its own Chrome (e.g. restricted network),
# point it at an existing Chromium:
REMOTION_BROWSER_EXECUTABLE=/path/to/chromium npm run render:all
```

## Bonus: the GitHub PR comment

The nx-cloud PR comment currently lists command runs but says nothing about sandbox
violations. Suggested one-liner to add under the runs table when violations exist:

> ⚠️ **8 of 446 tasks** have sandbox violations — cache may be unreliable.
> [View on the sandbox violations dashboard →](…)

Design tokens (colors, fonts) live in `src/theme.ts`; shared helpers in
`src/components/util.tsx`; one file per variation under `src/variations/`.
