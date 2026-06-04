import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { theme, STORY } from "../theme";
import { ramp, NxMark, Check, Cross, Spinner, useCount } from "../components/util";

/**
 * V1 — "Terminal Trace"
 * A CLI log streams: 3 tasks run, one reads a file outside its inputs and is
 * flagged. The summary line calls out "8 of 446". Then the flagged task is
 * re-run and restored straight from cache — proving the cache is unreliable.
 */

const Line: React.FC<{
  delay: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay, children, style }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, delay + 8);
  return (
    <div
      style={{
        opacity: t,
        transform: `translateX(${(1 - t) * -14}px)`,
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontFamily: theme.mono,
        fontSize: 30,
        lineHeight: 1.7,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const TaskLine: React.FC<{
  delay: number;
  doneAt: number;
  label: string;
  violation?: boolean;
}> = ({ delay, doneAt, label, violation }) => {
  const frame = useCurrentFrame();
  const done = frame >= doneAt;
  return (
    <Line delay={delay}>
      <div style={{ width: 30 }}>
        {!done ? (
          <Spinner size={26} />
        ) : violation ? (
          <Cross size={26} />
        ) : (
          <Check size={26} />
        )}
      </div>
      <span style={{ color: theme.textDim }}>nx run</span>
      <span style={{ color: done && violation ? theme.red : theme.text }}>
        {label}
      </span>
      {done && (
        <span
          style={{
            color: violation ? theme.red : theme.green,
            marginLeft: 10,
            fontSize: 24,
          }}
        >
          {violation ? "SANDBOX VIOLATION" : "ok"}
        </span>
      )}
    </Line>
  );
};

export const V1Terminal: React.FC = () => {
  const frame = useCurrentFrame();
  const count = useCount(STORY.violations, 150, 175);

  // re-run section reveal
  const cacheGlow = interpolate(frame, [250, 270, 300], [0, 1, 1], {
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: theme.bg, padding: 70 }}>
      {/* window chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 34,
        }}
      >
        <NxMark size={46} />
        <span
          style={{
            fontFamily: theme.sans,
            fontSize: 30,
            color: theme.textDim,
            fontWeight: 600,
          }}
        >
          nx affected --targets=build,test,lint
        </span>
        <span style={{ flex: 1 }} />
        <span style={{ display: "flex", gap: 10 }}>
          {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
            <span
              key={c}
              style={{ width: 16, height: 16, borderRadius: 99, background: c }}
            />
          ))}
        </span>
      </div>

      {/* task run log */}
      <div style={{ marginLeft: 6 }}>
        <TaskLine delay={10} doneAt={70} label="auth:build" />
        <TaskLine delay={26} doneAt={92} label="ui:test" />
        <TaskLine delay={42} doneAt={120} label="workspace:lint" violation />

        {/* violation detail */}
        <Sequence from={120} layout="none">
          <Line delay={4} style={{ marginTop: 8, marginLeft: 44, fontSize: 25 }}>
            <span style={{ color: theme.amber }}>↳ read</span>
            <span style={{ color: theme.text }}>{STORY.rogueFile}</span>
            <span style={{ color: theme.textFaint }}>— not in declared inputs</span>
          </Line>
        </Sequence>
      </div>

      {/* summary callout */}
      <Sequence from={140} layout="none">
        <div
          style={{
            marginTop: 46,
            border: `1.5px solid ${theme.amberStroke}`,
            background: theme.amberBg,
            borderRadius: 16,
            padding: "26px 32px",
            display: "flex",
            alignItems: "center",
            gap: 22,
            opacity: ramp(frame - 140, 0, 16),
          }}
        >
          <span style={{ fontSize: 40 }}>⚠️</span>
          <div>
            <div style={{ fontFamily: theme.sans, fontSize: 36, color: theme.amber, fontWeight: 700 }}>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{count}</span> of {STORY.total} tasks have sandbox violations
            </div>
            <div style={{ fontFamily: theme.sans, fontSize: 24, color: theme.textDim, marginTop: 4 }}>
              Tasks touched files outside declared inputs / outputs. Cache may be unreliable.
            </div>
          </div>
        </div>
      </Sequence>

      {/* re-run from cache — the punchline */}
      <Sequence from={232} layout="none">
        <div style={{ marginTop: 40, opacity: ramp(frame - 232, 0, 14) }}>
          <Line delay={0} style={{ fontSize: 27 }}>
            <span style={{ color: theme.textFaint }}>$</span>
            <span style={{ color: theme.text }}>nx run workspace:lint</span>
            <span style={{ color: theme.textFaint }}>(re-run)</span>
          </Line>
          <Line delay={18} style={{ marginLeft: 30, fontSize: 27 }}>
            <Check size={24} color={theme.green} />
            <span style={{ color: theme.green }}>existing outputs match the cache, remotely</span>
          </Line>
          <div
            style={{
              marginTop: 22,
              marginLeft: 30,
              padding: "20px 26px",
              borderRadius: 14,
              border: `1.5px solid ${theme.redDim}`,
              background: `rgba(239,68,68,${0.06 + cacheGlow * 0.06})`,
              fontFamily: theme.sans,
              fontSize: 27,
              color: theme.text,
              maxWidth: 1180,
              boxShadow: `0 0 ${cacheGlow * 40}px rgba(239,68,68,0.25)`,
            }}
          >
            <b style={{ color: theme.red }}>Cache hit — but the rogue file changed.</b>{" "}
            The input that should have busted the cache was never tracked, so a
            poisoned result is served as if it were clean.
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
