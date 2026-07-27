import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { DEFAULT_DASH, DashStory } from "../story";
import { Check } from "../components/util";
import { fr, Caption, SceneProps } from "../scenes/SceneKit";
import { CacheTile } from "./ProductKit";

type Mode = "unreliable" | "poison";

/**
 * Fix-with-AI resolution, skull-free and reassuring: the missing input is
 * written into project.json, and api:build's cache flips from at-risk back to
 * a *guaranteed reliable* state.
 */
export const PFix: React.FC<SceneProps & { mode: Mode; story?: DashStory }> = ({
  dur,
  mode,
  story = DEFAULT_DASH,
}) => {
  const f = useCurrentFrame();
  const working = interpolate(f, [0, dur * 0.08, dur * 0.2, dur * 0.28], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const addLine = fr(f, dur, 0.26, 0.4);
  const heal = fr(f, dur, 0.48, 0.64);
  const rerun = fr(f, dur, 0.68, 0.82);

  const cl = (txt: string, color: string = theme.text, op = 1) => (
    <div style={{ color, opacity: op }}>{txt}</div>
  );

  return (
    <AbsoluteFill style={{ padding: "66px 96px" }}>
      <div
        style={{
          fontFamily: theme.sans,
          fontSize: 42,
          fontWeight: 850,
          color: theme.purple,
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: Math.max(working, 0.3),
        }}
      >
        ✦ {working > 0.2 ? "Fixing with AI…" : "Fixed by AI"}
      </div>
      <div
        style={{
          fontFamily: theme.sans,
          fontSize: 28,
          color: theme.textDim,
          marginBottom: 34,
          opacity: fr(f, dur, 0.2, 0.32),
        }}
      >
        The undeclared input is now part of {story.badTask}'s config.
      </div>

      <div style={{ display: "flex", gap: 56, alignItems: "center" }}>
        <div
          style={{
            flex: 1.2,
            background: "#0a0a0d",
            border: `1px solid ${theme.strokeHi}`,
            borderRadius: 16,
            padding: "28px 34px",
            fontFamily: theme.mono,
            fontSize: 30,
            lineHeight: 1.65,
            whiteSpace: "pre",
            opacity: fr(f, dur, 0.16, 0.28),
          }}
        >
          {cl(story.projectJson, theme.textFaint)}
          {cl('"build": {', theme.textDim)}
          {cl('  "inputs": [', theme.textDim)}
          {story.inputsBefore.map((inp) => cl(`    "${inp}",`, theme.text))}
          <div
            style={{
              color: theme.green,
              background: `rgba(51,217,121,${addLine * 0.16})`,
              opacity: addLine,
              transform: `translateX(${(1 - addLine) * -20}px)`,
              borderRadius: 6,
              fontWeight: 700,
            }}
          >
            {`+   "${story.added}"`}
          </div>
          {cl("  ]", theme.textDim)}
          {cl("}", theme.textDim)}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <div style={{ fontFamily: theme.mono, fontSize: 30, fontWeight: 700, color: theme.text, opacity: fr(f, dur, 0.3, 0.42) }}>
            {story.badTask}
          </div>
          <CacheTile state={heal > 0.4 ? "good" : "bad"} mode={mode} reveal={Math.max(heal, 0.4)} width={360} />
          <div
            style={{
              opacity: heal,
              fontFamily: theme.sans,
              fontSize: 26,
              fontWeight: 800,
              color: theme.green,
              display: "flex",
              alignItems: "center",
              gap: 10,
              textAlign: "center",
            }}
          >
            <Check size={26} /> cache reliability guaranteed
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 38,
          opacity: rerun,
          fontFamily: theme.mono,
          fontSize: 27,
          color: theme.textDim,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span style={{ color: theme.green }}>$</span> nx run {story.badTask}
        <span style={{ color: theme.green }}>
          → input now tracked · cache hit is verified
        </span>
      </div>

      <Caption show={fr(f, dur, 0.86, 0.95)}>
        {mode === "poison" ? (
          <>
            No poisoning risk — every cache hit is{" "}
            <b style={{ color: theme.green }}>verified against the right inputs</b>.
          </>
        ) : (
          <>
            <b style={{ color: theme.green }}>0 of {story.total}</b> {story.unit} violating — the
            cache is reliable again.
          </>
        )}
      </Caption>
    </AbsoluteFill>
  );
};
