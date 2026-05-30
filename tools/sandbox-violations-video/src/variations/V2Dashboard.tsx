import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { theme, STORY } from "../theme";
import { ramp, NxMark, useCount, FadeUp } from "../components/util";

/**
 * V2 — "Analytics Dashboard"
 * Recreates the Sandbox-violations analytics page: a big 8 / 446 stat,
 * a table where one row trips red, and a cache-reliability banner.
 */

const Stat: React.FC<{
  label: string;
  value: number;
  color: string;
  delay: number;
}> = ({ label, value, color, delay }) => {
  const count = useCount(value, delay, delay + 30);
  return (
    <FadeUp delay={delay} style={{ flex: 1 }}>
      <div
        style={{
          background: theme.bgPanel,
          border: `1px solid ${theme.stroke}`,
          borderRadius: 18,
          padding: "32px 38px",
        }}
      >
        <div style={{ fontFamily: theme.sans, fontSize: 26, color: theme.textDim }}>
          {label}
        </div>
        <div
          style={{
            fontFamily: theme.sans,
            fontSize: 96,
            fontWeight: 800,
            color,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1.1,
          }}
        >
          {count}
        </div>
      </div>
    </FadeUp>
  );
};

const rows = [
  { task: "auth:build", reads: 0, writes: 0, bad: false },
  { task: "ui:test", reads: 0, writes: 0, bad: false },
  { task: "workspace:lint", reads: 7, writes: 0, bad: true },
  { task: "cypress:lint", reads: 4, writes: 0, bad: true },
  { task: "vite:lint", reads: 2, writes: 0, bad: true },
];

const Row: React.FC<{ r: (typeof rows)[number]; delay: number }> = ({
  r,
  delay,
}) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, delay + 12);
  const pulse =
    r.bad && r.task === "workspace:lint"
      ? 0.5 + 0.5 * Math.sin((frame - delay) / 6)
      : 0;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.6fr 1fr 1fr",
        alignItems: "center",
        padding: "22px 30px",
        borderBottom: `1px solid ${theme.stroke}`,
        fontFamily: theme.mono,
        fontSize: 30,
        opacity: t,
        transform: `translateX(${(1 - t) * 24}px)`,
        background: r.bad
          ? `rgba(239,68,68,${0.05 + pulse * 0.06})`
          : "transparent",
      }}
    >
      <span style={{ color: r.bad ? theme.red : theme.text }}>{r.task}</span>
      <Cell n={r.reads} bad={r.reads > 0} />
      <Cell n={r.writes} bad={r.writes > 0} />
    </div>
  );
};

const Cell: React.FC<{ n: number; bad: boolean }> = ({ n, bad }) =>
  bad ? (
    <span>
      <span
        style={{
          background: "rgba(239,68,68,0.18)",
          color: theme.red,
          padding: "4px 16px",
          borderRadius: 8,
          fontWeight: 700,
        }}
      >
        {n}
      </span>
    </span>
  ) : (
    <span style={{ color: theme.textFaint }}>{n}</span>
  );

export const V2Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: theme.bg, padding: "56px 72px" }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 30 }}>
        <NxMark size={44} />
        <span style={{ fontFamily: theme.sans, fontSize: 30, color: theme.textDim }}>
          Nx Cloud
        </span>
        <span style={{ color: theme.textFaint, fontSize: 26 }}>/ Analytics /</span>
        <span style={{ fontFamily: theme.sans, fontSize: 30, color: theme.text, fontWeight: 700 }}>
          Sandbox violations
        </span>
      </div>

      {/* stats */}
      <div style={{ display: "flex", gap: 26, marginBottom: 26 }}>
        <Stat label="Latest reports with violations" value={STORY.violations} color={theme.red} delay={12} />
        <Stat label="Latest clean reports" value={STORY.clean} color={theme.green} delay={20} />
      </div>

      {/* purple "fix" banner */}
      <FadeUp delay={40}>
        <div
          style={{
            background: theme.purpleBg,
            border: `1px solid ${theme.purpleStroke}`,
            borderRadius: 16,
            padding: "22px 30px",
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 30,
          }}
        >
          <span style={{ fontSize: 30 }}>🛡️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: theme.sans, fontSize: 30, color: theme.text, fontWeight: 700 }}>
              {STORY.violations} of {STORY.total} tasks read or wrote files Nx didn't expect
            </div>
            <div style={{ fontFamily: theme.sans, fontSize: 23, color: theme.textDim }}>
              One AI prompt fixes it — or extend inputs / outputs in project.json
            </div>
          </div>
          <div
            style={{
              background: theme.purple,
              color: "#fff",
              fontFamily: theme.sans,
              fontWeight: 700,
              fontSize: 26,
              padding: "14px 26px",
              borderRadius: 12,
            }}
          >
            ✦ Fix with AI
          </div>
        </div>
      </FadeUp>

      {/* table */}
      <FadeUp delay={64}>
        <div
          style={{
            background: theme.bgPanel,
            border: `1px solid ${theme.stroke}`,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 1fr 1fr",
              padding: "20px 30px",
              fontFamily: theme.sans,
              fontSize: 26,
              color: theme.textDim,
              fontWeight: 700,
              borderBottom: `1px solid ${theme.strokeHi}`,
            }}
          >
            <span>Task</span>
            <span>Unexpected reads</span>
            <span>Unexpected writes</span>
          </div>
          {rows.map((r, i) => (
            <Row key={r.task} r={r} delay={74 + i * 12} />
          ))}
        </div>
      </FadeUp>

      {/* cache reliability punchline */}
      <Sequence from={210}>
        <div
          style={{
            position: "absolute",
            left: 72,
            right: 72,
            bottom: 44,
            opacity: ramp(frame - 210, 0, 16),
            fontFamily: theme.sans,
            fontSize: 30,
            color: theme.text,
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: theme.bg,
            padding: "16px 0",
          }}
        >
          <span style={{ fontSize: 30 }}>⚠️</span>
          <span>
            Untracked inputs mean a <b style={{ color: theme.red }}>stale cache hit</b> can be
            served as clean — a cache-poisoning risk.
          </span>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
