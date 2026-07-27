import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { STORY2 } from "../story";
import { TaskCard, fr, Caption, SceneProps } from "../scenes/SceneKit";
import { CacheTile, Connector, TileState } from "./ProductKit";

type Mode = "unreliable" | "poison";

// Slower, staggered reveal so every task is readable. Each task owns its cache.
const ROWS = [
  { id: "auth:lint", bad: false, appear: 0.06, resolve: 0.34 },
  { id: "ui:test", bad: false, appear: 0.2, resolve: 0.48 },
  { id: "api:build", bad: true, appear: 0.34, resolve: 0.64 },
];

const Heading: React.FC<{ f: number; dur: number }> = ({ f, dur }) => (
  <div
    style={{
      position: "absolute",
      top: 70,
      left: 0,
      right: 0,
      textAlign: "center",
      opacity: fr(f, dur, 0.02, 0.14),
      fontFamily: theme.sans,
      fontSize: 34,
      color: theme.textDim,
      fontWeight: 600,
    }}
  >
    Every task gets its <span style={{ color: theme.text }}>own cache entry</span>
  </div>
);

/* ------------------------------------------------------------------- rows */
const Rows: React.FC<SceneProps & { mode: Mode }> = ({ dur, mode }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Heading f={f} dur={dur} />
      <div style={{ display: "flex", flexDirection: "column", gap: 46, marginTop: 40 }}>
        {ROWS.map((r) => {
          const appearT = fr(f, dur, r.appear, r.appear + 0.14);
          const resolved = f >= dur * r.resolve;
          const state: "run" | "ok" | "bad" = resolved
            ? r.bad
              ? "bad"
              : "ok"
            : "run";
          const cacheState: TileState = !resolved ? "idle" : r.bad ? "bad" : "good";
          const cacheReveal = fr(f, dur, r.resolve, r.resolve + 0.14);
          const flag = r.bad ? fr(f, dur, r.resolve, r.resolve + 0.14) : 0;
          return (
            <div
              key={r.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 34,
                opacity: appearT,
                transform: `translateY(${(1 - appearT) * 26}px)`,
              }}
            >
              <div style={{ position: "relative" }}>
                <TaskCard label={r.id} state={state} flag={flag} style={{ width: 380 }} />
                {r.bad && (
                  <div
                    style={{
                      position: "absolute",
                      left: 8,
                      top: "100%",
                      marginTop: 10,
                      fontFamily: theme.mono,
                      fontSize: 22,
                      color: theme.amber,
                      opacity: fr(f, dur, r.resolve - 0.04, r.resolve + 0.08),
                      whiteSpace: "nowrap",
                    }}
                  >
                    reads {STORY2.file}
                  </div>
                )}
              </div>
              <Connector t={appearT} bad={r.bad && resolved} />
              <CacheTile state={cacheState} mode={mode} reveal={cacheReveal} />
            </div>
          );
        })}
      </div>
      <Caption show={fr(f, dur, 0.82, 0.92)}>
        Only <b style={{ color: theme.amber }}>api:build</b>'s cache is affected — the
        other two stay reliable.
      </Caption>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------- cards */
const Cards: React.FC<SceneProps & { mode: Mode }> = ({ dur, mode }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Heading f={f} dur={dur} />
      <div style={{ display: "flex", gap: 50, marginTop: 30 }}>
        {ROWS.map((r) => {
          const appearT = fr(f, dur, r.appear, r.appear + 0.14);
          const resolved = f >= dur * r.resolve;
          const state: "run" | "ok" | "bad" = resolved
            ? r.bad
              ? "bad"
              : "ok"
            : "run";
          const cacheState: TileState = !resolved ? "idle" : r.bad ? "bad" : "good";
          const cacheReveal = fr(f, dur, r.resolve, r.resolve + 0.14);
          const flag = r.bad ? fr(f, dur, r.resolve, r.resolve + 0.14) : 0;
          return (
            <div
              key={r.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 22,
                opacity: appearT,
                transform: `translateY(${(1 - appearT) * 26}px)`,
              }}
            >
              <TaskCard label={r.id} state={state} flag={flag} style={{ width: 380 }} />
              <div style={{ fontSize: 30, color: theme.textFaint, opacity: appearT }}>↓</div>
              <CacheTile state={cacheState} mode={mode} reveal={cacheReveal} width={300} compact />
              {r.bad && (
                <div
                  style={{
                    fontFamily: theme.mono,
                    fontSize: 21,
                    color: theme.amber,
                    opacity: fr(f, dur, r.resolve - 0.04, r.resolve + 0.08),
                  }}
                >
                  reads {STORY2.file}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Caption show={fr(f, dur, 0.82, 0.92)}>
        Each task is cached independently — only{" "}
        <b style={{ color: theme.amber }}>api:build</b> is affected.
      </Caption>
    </AbsoluteFill>
  );
};

export const PRun: React.FC<SceneProps & { mode: Mode; style?: "rows" | "cards" }> = ({
  style = "rows",
  ...p
}) => (style === "cards" ? <Cards {...p} /> : <Rows {...p} />);
