import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { STORY2 } from "../story";
import { fr, Caption, SceneProps } from "./SceneKit";

/**
 * Cache mechanics: api:build's cache key is hashed from declared inputs only.
 * The untracked config.json changes, the key doesn't, so Nx replays a stale
 * (poisoned) artifact. This is exactly what the sandbox check catches.
 */
export const CacheScene: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const key = "a1f9…c0";
  const same = interpolate(
    f,
    [dur * 0.6, dur * 0.68, dur * 0.9, dur * 0.97],
    [0, 1, 1, 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const Chip: React.FC<{ label: string; d: number; rogue?: boolean }> = ({
    label,
    d,
    rogue,
  }) => {
    const t = fr(f, dur, d, d + 0.08);
    return (
      <div
        style={{
          opacity: t,
          transform: `translateX(${(1 - t) * -20}px)`,
          fontFamily: theme.mono,
          fontSize: 27,
          color: rogue ? theme.red : theme.text,
          padding: "13px 20px",
          borderRadius: 10,
          border: `1.5px solid ${rogue ? theme.red : theme.stroke}`,
          background: rogue ? "rgba(239,68,68,0.08)" : theme.bgPanel,
          width: "fit-content",
        }}
      >
        {rogue ? "☠ " : "📄 "}
        {label}
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ padding: "110px 96px" }}>
      <div
        style={{
          fontFamily: theme.sans,
          fontSize: 56,
          fontWeight: 850,
          color: theme.text,
          marginBottom: 54,
          opacity: fr(f, dur, 0.02, 0.16),
        }}
      >
        Why the cache can't be trusted
      </div>

      <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontFamily: theme.sans, fontSize: 24, color: theme.textDim }}>
            api:build · declared inputs
          </div>
          <Chip label="src/**/*.ts" d={0.1} />
          <Chip label="tsconfig.json" d={0.16} />
          <div
            style={{
              marginTop: 14,
              fontFamily: theme.sans,
              fontSize: 23,
              color: theme.red,
              opacity: fr(f, dur, 0.26, 0.36),
            }}
          >
            read at build time · NOT declared
          </div>
          <Chip label={STORY2.file} d={0.3} rogue />
        </div>

        <div style={{ fontSize: 54, color: theme.textFaint, opacity: fr(f, dur, 0.34, 0.44) }}>
          →
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              border: `1.5px solid ${theme.strokeHi}`,
              background: theme.bgPanel,
              borderRadius: 16,
              padding: "24px 32px",
              opacity: fr(f, dur, 0.4, 0.52),
              fontFamily: theme.mono,
            }}
          >
            <div style={{ fontSize: 22, color: theme.textDim, marginBottom: 6 }}>
              hash(declared inputs only)
            </div>
            <div style={{ fontSize: 40, color: theme.cyan, fontWeight: 700 }}>
              cache-key {key}
            </div>
          </div>
          <div
            style={{
              border: `1.5px solid ${same > 0.3 ? theme.red : theme.stroke}`,
              background: `rgba(239,68,68,${same * 0.12})`,
              borderRadius: 16,
              padding: "20px 30px",
              opacity: fr(f, dur, 0.58, 0.7),
              fontFamily: theme.sans,
              fontSize: 26,
              color: theme.text,
              maxWidth: 560,
            }}
          >
            ☠ {STORY2.file} changes — key stays{" "}
            <span style={{ color: same > 0.3 ? theme.red : theme.cyan, fontWeight: 700 }}>
              {key}
            </span>
            . A stale artifact is replayed.
          </div>
        </div>
      </div>

      <Caption show={fr(f, dur, 0.8, 0.9)}>
        Nx Cloud's sandbox catches exactly this — an input it never saw.
      </Caption>
    </AbsoluteFill>
  );
};
