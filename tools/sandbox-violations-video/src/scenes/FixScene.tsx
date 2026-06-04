import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { STORY2 } from "../story";
import { Check } from "../components/util";
import { fr, CacheBox, Caption, SceneProps } from "./SceneKit";

/**
 * Aftermath of "Fix with AI": the missing input is written into project.json,
 * api:build flips to clean, and the cache key now busts correctly — protected
 * from cache poisoning. Longer durations also show the verifying re-run.
 */
export const FixScene: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();

  const working = interpolate(f, [0, dur * 0.1, dur * 0.22, dur * 0.3], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const addLine = fr(f, dur, 0.28, 0.42);
  const protectedT = fr(f, dur, 0.5, 0.64);
  const rerun = fr(f, dur, 0.7, 0.84); // verifying re-run (long videos have room)

  const codeLine = (txt: string, color: string = theme.text, op = 1, indent = 0) => (
    <div style={{ color, opacity: op, paddingLeft: indent }}>{txt}</div>
  );

  return (
    <AbsoluteFill style={{ padding: "70px 96px" }}>
      {/* working shimmer */}
      <div
        style={{
          fontFamily: theme.sans,
          fontSize: 40,
          fontWeight: 800,
          color: theme.purple,
          marginBottom: 30,
          opacity: Math.max(working, 0.18),
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        ✦ {working > 0.2 ? "Fixing with AI…" : "Fixed by AI"}
      </div>

      <div style={{ display: "flex", gap: 56, alignItems: "center" }}>
        {/* project.json diff */}
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
            opacity: fr(f, dur, 0.18, 0.3),
          }}
        >
          <div style={{ color: theme.textFaint, fontSize: 22, marginBottom: 10 }}>
            apps/api/project.json
          </div>
          {codeLine('"build": {', theme.textDim)}
          {codeLine('  "inputs": [', theme.textDim)}
          {STORY2.inputsBefore.map((inp) =>
            codeLine(`    "${inp}",`, theme.text)
          )}
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
            {`+   "${STORY2.added}"`}
          </div>
          {codeLine("  ]", theme.textDim)}
          {codeLine("}", theme.textDim)}
        </div>

        {/* protected cache */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ transform: "scale(0.95)", opacity: fr(f, dur, 0.3, 0.46) }}>
            <CacheBox poison={1} fixed={protectedT} />
          </div>
          <div
            style={{
              opacity: protectedT,
              fontFamily: theme.sans,
              fontSize: 28,
              fontWeight: 800,
              color: theme.green,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Check size={28} /> api:build protected
          </div>
        </div>
      </div>

      {/* verifying re-run line */}
      <div
        style={{
          marginTop: 40,
          opacity: rerun,
          fontFamily: theme.mono,
          fontSize: 28,
          color: theme.textDim,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span style={{ color: theme.green }}>$</span> nx run api:build
        <span style={{ color: theme.green }}>
          → config.json now tracked · cache busts correctly
        </span>
      </div>

      <Caption show={fr(f, dur, 0.86, 0.95)}>
        No more cache poisoning. <b style={{ color: theme.green }}>0 of 3</b> tasks violating.
      </Caption>
    </AbsoluteFill>
  );
};
