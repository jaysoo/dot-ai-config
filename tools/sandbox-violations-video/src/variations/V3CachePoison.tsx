import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { theme, STORY } from "../theme";
import { ramp, NxMark, useCount } from "../components/util";

/**
 * V3 — "Cache Poison"
 * Security framing. Declared inputs feed a hash → cache key. A rogue file is
 * read but never hashed, so when an attacker mutates it the key is unchanged
 * and Nx serves a poisoned artifact from cache.
 */

const Chip: React.FC<{
  label: string;
  delay: number;
  color?: string;
  rogue?: boolean;
}> = ({ label, delay, color = theme.text, rogue }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, delay + 10);
  return (
    <div
      style={{
        opacity: t,
        transform: `translateX(${(1 - t) * -20}px)`,
        fontFamily: theme.mono,
        fontSize: 26,
        color,
        padding: "12px 18px",
        borderRadius: 10,
        border: `1.5px solid ${rogue ? theme.red : theme.stroke}`,
        background: rogue ? "rgba(239,68,68,0.08)" : theme.bgPanel,
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "fit-content",
      }}
    >
      {rogue ? "☠" : "📄"} {label}
    </div>
  );
};

export const V3CachePoison: React.FC = () => {
  const frame = useCurrentFrame();
  const hash = useCount(STORY.violations, 0, 10);

  // hash key for the declared-only inputs (never changes)
  const key = "a1f9…c0";

  // attacker mutates rogue file ~frame 170; key flashes "same"
  const sameFlash = interpolate(
    frame,
    [200, 215, 245, 260],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(1200px 700px at 70% 10%, #18121e 0%, ${theme.bg} 60%)`,
        padding: 72,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <NxMark size={42} color={theme.red} />
        <span style={{ fontFamily: theme.sans, fontSize: 28, color: theme.textDim, letterSpacing: 2, textTransform: "uppercase" }}>
          Sandbox violation → cache poisoning
        </span>
      </div>

      <div
        style={{
          fontFamily: theme.sans,
          fontSize: 60,
          fontWeight: 800,
          color: theme.text,
          marginBottom: 50,
          opacity: ramp(frame, 6, 24),
        }}
      >
        When inputs lie, the cache can be{" "}
        <span style={{ color: theme.red }}>poisoned</span>.
      </div>

      <div style={{ display: "flex", gap: 56, alignItems: "flex-start" }}>
        {/* declared inputs feeding hash */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontFamily: theme.sans, fontSize: 24, color: theme.textDim, marginBottom: 4 }}>
            Declared inputs
          </div>
          <Chip label="src/index.ts" delay={20} />
          <Chip label="tsconfig.json" delay={30} />
          <Chip label="package.json" delay={40} />
          <div style={{ marginTop: 18 }}>
            <div style={{ fontFamily: theme.sans, fontSize: 24, color: theme.red, marginBottom: 8, opacity: ramp(frame, 120, 132) }}>
              Read at runtime — but NOT declared
            </div>
            <Chip label={STORY.rogueFile} delay={130} color={theme.red} rogue />
          </div>
        </div>

        {/* arrow */}
        <div
          style={{
            alignSelf: "center",
            fontSize: 56,
            color: theme.textFaint,
            opacity: ramp(frame, 50, 64),
          }}
        >
          →
        </div>

        {/* hash + cache key */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, alignSelf: "center" }}>
          <div
            style={{
              border: `1.5px solid ${theme.strokeHi}`,
              background: theme.bgPanel,
              borderRadius: 16,
              padding: "26px 34px",
              fontFamily: theme.mono,
              opacity: ramp(frame, 56, 70),
            }}
          >
            <div style={{ fontSize: 22, color: theme.textDim, marginBottom: 8 }}>
              hash(declared inputs)
            </div>
            <div style={{ fontSize: 40, color: theme.cyan, fontWeight: 700 }}>
              cache-key {key}
            </div>
          </div>
          <div
            style={{
              border: `1.5px solid ${sameFlash > 0.3 ? theme.red : theme.stroke}`,
              background: `rgba(239,68,68,${sameFlash * 0.12})`,
              borderRadius: 16,
              padding: "20px 30px",
              fontFamily: theme.sans,
              fontSize: 26,
              color: theme.text,
              opacity: ramp(frame, 150, 168),
              maxWidth: 540,
            }}
          >
            ☠ Attacker mutates{" "}
            <span style={{ fontFamily: theme.mono, color: theme.red }}>
              {STORY.rogueFile}
            </span>{" "}
            — key stays{" "}
            <span style={{ color: sameFlash > 0.3 ? theme.red : theme.cyan, fontWeight: 700 }}>
              {key}
            </span>
          </div>
        </div>
      </div>

      {/* verdict */}
      <Sequence from={258}>
        <div
          style={{
            position: "absolute",
            left: 72,
            right: 72,
            bottom: 64,
            opacity: ramp(frame - 258, 0, 16),
            border: `1.5px solid ${theme.amberStroke}`,
            background: theme.amberBg,
            borderRadius: 16,
            padding: "24px 32px",
            fontFamily: theme.sans,
            fontSize: 32,
            color: theme.text,
          }}
        >
          <b style={{ color: theme.amber }}>{hash} of {STORY.total} tasks</b> can serve a
          poisoned artifact from cache. Declare the input — or fix the code that reads it.
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
