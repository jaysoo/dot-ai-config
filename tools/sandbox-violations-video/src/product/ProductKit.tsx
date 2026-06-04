import React from "react";
import { theme } from "../theme";

/**
 * Skull-free, per-task cache tile. The framing is a *guarantee*: a healthy
 * task's cache is "reliable"; a task that read an undeclared input is flagged
 * "unreliable" (or "at risk" in poison-mode wording) — never implying the
 * platform itself is insecure.
 */
export type TileState = "idle" | "good" | "bad";

export const CacheTile: React.FC<{
  state: TileState;
  mode?: "unreliable" | "poison";
  reveal?: number; // 0..1 colour/glow fill
  width?: number;
  compact?: boolean;
}> = ({ state, mode = "unreliable", reveal = 1, width = 360, compact = false }) => {
  const good = state === "good";
  const bad = state === "bad";
  const color = good ? theme.green : bad ? theme.amber : theme.textFaint;
  const icon = good ? "🛡️" : bad ? "⚠️" : "📦";
  const label = good
    ? "reliable"
    : bad
    ? mode === "poison"
      ? "poisoning risk"
      : "unreliable"
    : "cached";
  return (
    <div
      style={{
        width,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: compact ? "14px 18px" : "18px 24px",
        borderRadius: 16,
        border: `2.5px solid ${state === "idle" ? theme.stroke : color}`,
        background: bad
          ? `rgba(240,180,41,${0.12 * reveal})`
          : good
          ? `rgba(51,217,121,${0.09 * reveal})`
          : theme.bgPanel,
        boxShadow: good || bad ? `0 0 ${26 * reveal}px ${color}44` : "none",
      }}
    >
      <span style={{ fontSize: compact ? 32 : 40 }}>{icon}</span>
      <div>
        <div style={{ fontFamily: theme.sans, fontSize: compact ? 18 : 20, color: theme.textDim }}>
          cache entry
        </div>
        <div
          style={{
            fontFamily: theme.mono,
            fontSize: compact ? 26 : 31,
            fontWeight: 700,
            color,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

/** A short dotted connector with an arrowhead, fading in via `t`. */
export const Connector: React.FC<{ t: number; w?: number; bad?: boolean }> = ({
  t,
  w = 150,
  bad,
}) => (
  <svg width={w} height={24} style={{ opacity: t }}>
    <line
      x1={4}
      y1={12}
      x2={w - 16}
      y2={12}
      stroke={bad ? theme.amber : theme.strokeHi}
      strokeWidth={3}
      strokeDasharray="2 9"
      strokeLinecap="round"
    />
    <path
      d={`M${w - 18} 5l10 7-10 7z`}
      fill={bad ? theme.amber : theme.strokeHi}
    />
  </svg>
);
