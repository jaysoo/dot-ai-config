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
 * V5 — "Pipeline Flow"
 * A project-graph view: three task nodes push artifacts down an edge into a
 * shared cache node. One node is flagged for a file outside its inputs; when
 * it re-runs, the cache returns the (stale) artifact — drawn as a red replay.
 */

const W = 1920;
const H = 1080;

const nodes = [
  { id: "build", x: 360, y: 250, bad: false },
  { id: "test", x: 360, y: 540, bad: false },
  { id: "lint", x: 360, y: 830, bad: true },
];
const cache = { x: 1240, y: 540 };

const Node: React.FC<{
  n: (typeof nodes)[number];
  delay: number;
}> = ({ n, delay }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, delay + 14);
  const flag = n.bad ? ramp(frame, 96, 112) : 0;
  const color = n.bad && flag > 0.4 ? theme.red : theme.green;
  return (
    <g opacity={t} transform={`translate(${n.x},${n.y}) scale(${0.8 + t * 0.2})`}>
      <rect
        x={-150}
        y={-66}
        width={300}
        height={132}
        rx={20}
        fill={theme.bgPanel}
        stroke={color}
        strokeWidth={3}
      />
      <text x={-118} y={-12} fill={theme.textDim} fontSize={26} fontFamily={theme.mono}>
        nx run
      </text>
      <text x={-118} y={28} fill={color} fontSize={40} fontFamily={theme.mono} fontWeight={700}>
        {n.id}
      </text>
      {n.bad && flag > 0.4 && (
        <text x={108} y={-30} fontSize={52} textAnchor="middle">
          🚩
        </text>
      )}
    </g>
  );
};

// a packet traveling along the edge from node -> cache
const Packet: React.FC<{
  from: { x: number; y: number };
  start: number;
  bad?: boolean;
  reverse?: boolean;
}> = ({ from, start, bad, reverse }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });
  if (p <= 0 || p >= 1) return null;
  const a = reverse ? cache : from;
  const b = reverse ? from : cache;
  const x = interpolate(p, [0, 1], [a.x + (reverse ? 0 : 150), b.x - (reverse ? 0 : 150)]);
  const y = interpolate(p, [0, 1], [a.y, b.y]);
  return (
    <circle cx={x} cy={y} r={12} fill={bad ? theme.red : theme.cyan}>
    </circle>
  );
};

export const V5Pipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const count = useCount(STORY.violations, 150, 175);
  const rogueIn =
    ramp(frame, 84, 100) * (1 - ramp(frame, 214, 228)); // fade out before bottom callout

  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <div style={{ position: "absolute", top: 48, left: 64, display: "flex", alignItems: "center", gap: 14, zIndex: 2 }}>
        <NxMark size={42} />
        <span style={{ fontFamily: theme.sans, fontSize: 30, color: theme.textDim, fontWeight: 600 }}>
          Project graph · task pipeline
        </span>
      </div>

      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {/* edges */}
        {nodes.map((n, i) => {
          const t = ramp(frame, 30 + i * 8, 50 + i * 8);
          return (
            <line
              key={n.id}
              x1={n.x + 150}
              y1={n.y}
              x2={cache.x - 150}
              y2={cache.y}
              stroke={n.bad ? theme.redDim : theme.stroke}
              strokeWidth={3}
              strokeDasharray="2 10"
              strokeLinecap="round"
              opacity={t * 0.9}
            />
          );
        })}

        {/* rogue file dropping into the lint node */}
        <g opacity={rogueIn}>
          <line x1={360} y1={1010} x2={360} y2={900} stroke={theme.red} strokeWidth={3} strokeDasharray="4 8" />
          <text x={360} y={1045} fill={theme.red} fontSize={26} fontFamily={theme.mono} textAnchor="middle">
            ☠ {STORY.rogueFile} (untracked read)
          </text>
        </g>

        {/* nodes */}
        {nodes.map((n, i) => (
          <Node key={n.id} n={n} delay={20 + i * 10} />
        ))}

        {/* cache node */}
        {(() => {
          const t = ramp(frame, 40, 58);
          const poison = ramp(frame, 210, 226);
          return (
            <g opacity={t} transform={`translate(${cache.x},${cache.y})`}>
              <rect
                x={-160}
                y={-110}
                width={320}
                height={220}
                rx={24}
                fill={theme.bgPanel}
                stroke={poison > 0.3 ? theme.red : theme.strokeHi}
                strokeWidth={3}
                style={{ filter: poison > 0.3 ? "drop-shadow(0 0 30px rgba(239,68,68,0.5))" : "none" }}
              />
              <text x={0} y={-48} fill={theme.textDim} fontSize={26} fontFamily={theme.sans} textAnchor="middle">
                Remote cache
              </text>
              <text x={0} y={6} fontSize={70} textAnchor="middle">
                {poison > 0.3 ? "☠" : "📦"}
              </text>
              <text
                x={0}
                y={74}
                fill={poison > 0.3 ? theme.red : theme.green}
                fontSize={28}
                fontFamily={theme.mono}
                textAnchor="middle"
                fontWeight={700}
              >
                {poison > 0.3 ? "stale = poisoned" : "key a1f9…c0"}
              </text>
            </g>
          );
        })()}

        {/* packets: initial run (write to cache) */}
        <Packet from={nodes[0]} start={58} />
        <Packet from={nodes[1]} start={66} />
        <Packet from={nodes[2]} start={74} bad />

        {/* re-run: cache replays the stale artifact back (reverse, red) */}
        <Packet from={nodes[2]} start={188} bad reverse />
      </svg>

      {/* callout */}
      <Sequence from={132}>
        <div
          style={{
            position: "absolute",
            top: 70,
            right: 64,
            width: 560,
            opacity: ramp(frame - 132, 0, 16),
            border: `1.5px solid ${theme.amberStroke}`,
            background: theme.amberBg,
            borderRadius: 16,
            padding: "22px 28px",
          }}
        >
          <div style={{ fontFamily: theme.sans, fontSize: 34, color: theme.amber, fontWeight: 800 }}>
            {count} of {STORY.total} tasks
          </div>
          <div style={{ fontFamily: theme.sans, fontSize: 24, color: theme.textDim, marginTop: 4 }}>
            read or wrote files outside their declared inputs / outputs.
          </div>
        </div>
      </Sequence>

      <Sequence from={232}>
        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            bottom: 40,
            opacity: ramp(frame - 232, 0, 16),
            textAlign: "center",
            fontFamily: theme.sans,
            fontSize: 32,
            color: theme.text,
          }}
        >
          Re-run reads from cache — <b style={{ color: theme.red }}>the untracked file never busted the key</b>. Cache unreliable.
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
