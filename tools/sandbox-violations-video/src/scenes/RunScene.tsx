import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { theme } from "../theme";
import { STORY2 } from "../story";
import { Check, Cross, Spinner } from "../components/util";
import { fr, TaskCard, CacheBox, Caption, SceneProps } from "./SceneKit";

type RunStyle = "graph" | "cards" | "terminal";

/* ---- shared timing fractions ---- */
const T = {
  appear: [0.0, 0.18] as const,
  spin: 0.3,
  pass: [0.28, 0.42] as const,
  read: [0.32, 0.46] as const,
  flag: [0.46, 0.6] as const,
  flow: [0.56, 0.78] as const,
  poison: [0.7, 0.86] as const,
};

/* =============================================================== GRAPH */
const Graph: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const nodes = [
    { id: "api:build", x: 200, y: 150, bad: true },
    { id: "ui:test", x: 200, y: 440, bad: false },
    { id: "auth:lint", x: 200, y: 730, bad: false },
  ];
  const cache = { x: 1300, y: 420 };
  const buildState =
    f < dur * T.spin ? "run" : "bad";
  const flag = fr(f, dur, T.flag[0], T.flag[1]);
  const poison = fr(f, dur, T.poison[0], T.poison[1]);

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {nodes.map((n, i) => {
          const t = fr(f, dur, 0.16 + i * 0.03, 0.3 + i * 0.03);
          const flowP = interpolate(
            f,
            [dur * T.flow[0] + i * 6, dur * T.flow[1]],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const ax = n.x + 360;
          const ay = n.y + 62;
          const bx = cache.x;
          const by = cache.y + 110;
          return (
            <g key={n.id}>
              <line
                x1={ax}
                y1={ay}
                x2={bx}
                y2={by}
                stroke={n.bad ? theme.redDim : theme.stroke}
                strokeWidth={3}
                strokeDasharray="2 12"
                strokeLinecap="round"
                opacity={t * 0.9}
              />
              {flowP > 0 && flowP < 1 && (
                <circle
                  cx={interpolate(flowP, [0, 1], [ax, bx])}
                  cy={interpolate(flowP, [0, 1], [ay, by])}
                  r={11}
                  fill={n.bad ? theme.red : theme.cyan}
                />
              )}
            </g>
          );
        })}
      </svg>

      {nodes.map((n, i) => {
        const t = fr(f, dur, 0.0 + i * 0.04, 0.16 + i * 0.04);
        const state = n.bad
          ? buildState
          : f < dur * T.pass[0]
          ? "run"
          : "ok";
        return (
          <div
            key={n.id}
            style={{
              position: "absolute",
              left: n.x,
              top: n.y,
              opacity: t,
              transform: `translateX(${(1 - t) * -30}px)`,
            }}
          >
            <TaskCard label={n.id} state={state as any} flag={n.bad ? flag : 0} />
            {n.bad && (
              <div
                style={{
                  marginTop: 14,
                  opacity: fr(f, dur, T.read[0], T.read[1]),
                  fontFamily: theme.mono,
                  fontSize: 24,
                  color: theme.amber,
                }}
              >
                ↳ reads <span style={{ color: theme.red }}>{STORY2.file}</span>
                <div style={{ color: theme.textFaint, fontSize: 21 }}>
                  not in declared inputs
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: cache.x,
          top: cache.y,
          opacity: fr(f, dur, 0.2, 0.34),
        }}
      >
        <CacheBox poison={poison} />
      </div>

      <Caption show={fr(f, dur, T.poison[0], T.poison[1])}>
        <b style={{ color: theme.red }}>{STORY2.badTask}</b> cached from an
        untracked input — the cache can't be trusted.
      </Caption>
    </AbsoluteFill>
  );
};

/* =============================================================== CARDS */
const Cards: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const flag = fr(f, dur, T.flag[0], T.flag[1]);
  const poison = fr(f, dur, T.poison[0], T.poison[1]);
  const cards = [
    { id: "api:build", bad: true },
    { id: "ui:test", bad: false },
    { id: "auth:lint", bad: false },
  ];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", gap: 44, marginBottom: 70 }}>
        {cards.map((c, i) => {
          const t = fr(f, dur, i * 0.05, 0.18 + i * 0.05);
          const state = c.bad
            ? f < dur * T.spin
              ? "run"
              : "bad"
            : f < dur * T.pass[0]
            ? "run"
            : "ok";
          return (
            <div
              key={c.id}
              style={{ opacity: t, transform: `translateY(${(1 - t) * 30}px) scale(${0.9 + t * 0.1})` }}
            >
              <TaskCard label={c.id} state={state as any} flag={c.bad ? flag : 0} />
              {c.bad && (
                <div
                  style={{
                    marginTop: 14,
                    textAlign: "center",
                    opacity: fr(f, dur, T.read[0], T.read[1]),
                    fontFamily: theme.mono,
                    fontSize: 21,
                    color: theme.amber,
                  }}
                >
                  ↳ reads {STORY2.file}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ opacity: fr(f, dur, 0.5, 0.64), transform: "scale(0.85)" }}>
        <CacheBox poison={poison} />
      </div>
      <Caption show={fr(f, dur, T.poison[0], T.poison[1])}>
        <b style={{ color: theme.red }}>{STORY2.badTask}</b> read a file outside its
        inputs — its cache entry is now unreliable.
      </Caption>
    </AbsoluteFill>
  );
};

/* =============================================================== TERMINAL */
const Terminal: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const rows = [
    { id: "auth:lint", bad: false, done: 0.34 },
    { id: "ui:test", bad: false, done: 0.42 },
    { id: "api:build", bad: true, done: 0.52 },
  ];
  return (
    <AbsoluteFill style={{ padding: 110, justifyContent: "center" }}>
      <div style={{ fontFamily: theme.mono, fontSize: 34 }}>
        <div style={{ color: theme.textDim, marginBottom: 24 }}>
          $ nx run-many -t build,test,lint
        </div>
        {rows.map((r, i) => {
          const t = fr(f, dur, 0.05 + i * 0.05, 0.2 + i * 0.05);
          const done = f >= dur * r.done;
          return (
            <div
              key={r.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 14,
                opacity: t,
              }}
            >
              <div style={{ width: 30 }}>
                {!done ? (
                  <Spinner size={28} />
                ) : r.bad ? (
                  <Cross size={28} />
                ) : (
                  <Check size={28} />
                )}
              </div>
              <span style={{ color: theme.textDim }}>nx run</span>
              <span style={{ color: done && r.bad ? theme.red : theme.text }}>
                {r.id}
              </span>
              {done && (
                <span
                  style={{
                    color: r.bad ? theme.red : theme.green,
                    fontSize: 26,
                    marginLeft: 8,
                  }}
                >
                  {r.bad ? "SANDBOX VIOLATION" : "ok"}
                </span>
              )}
            </div>
          );
        })}
        <div
          style={{
            marginTop: 18,
            marginLeft: 46,
            opacity: fr(f, dur, T.read[0] + 0.1, T.read[1] + 0.1),
            fontSize: 28,
            color: theme.amber,
          }}
        >
          ↳ read <span style={{ color: theme.red }}>{STORY2.file}</span> — not in
          declared inputs
        </div>
      </div>
      <Caption show={fr(f, dur, T.poison[0], T.poison[1])}>
        An untracked read means <b style={{ color: theme.red }}>api:build</b>'s cache
        can be poisoned.
      </Caption>
    </AbsoluteFill>
  );
};

export const RunScene: React.FC<SceneProps & { style?: RunStyle }> = ({
  style = "graph",
  ...p
}) => {
  if (style === "cards") return <Cards {...p} />;
  if (style === "terminal") return <Terminal {...p} />;
  return <Graph {...p} />;
};
