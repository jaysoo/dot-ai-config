import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { theme } from "../theme";
import { Caption, SceneProps } from "../scenes/SceneKit";
import { CacheTile } from "./ProductKit";

type Mode = "unreliable" | "poison";
type Tone = "read" | "write";

interface IOItem {
  label: string;
  cx: number;
  cy: number; // chip center
  ax: number;
  ay: number; // task edge anchor
  tone: Tone;
}
interface Spec {
  sandbox: { x: number; y: number; w: number; h: number };
  task: { x: number; y: number; w: number; h: number };
  io: IOItem[];
  cache: { x: number; y: number; w: number; h: number };
  cacheFrom: { x: number; y: number };
  config: { x: number; y: number };
  configCross: { x: number; y: number };
  configTo: { x: number; y: number };
  sub: string;
  minimal?: boolean;
}

const TASK_LABEL = "backend:build";
const BAD_FILE = "config.json";

/* --------------------------------------------------------------- geometry */
const shorten = (ax: number, ay: number, bx: number, by: number, ra: number, rb: number) => {
  const dx = bx - ax;
  const dy = by - ay;
  const L = Math.hypot(dx, dy) || 1;
  const ux = dx / L;
  const uy = dy / L;
  return { x1: ax + ux * ra, y1: ay + uy * ra, x2: bx - ux * rb, y2: by - uy * rb, ux, uy };
};

/* --------------------------------------------------------------- Arrow */
const Arrow: React.FC<{
  ax: number;
  ay: number;
  bx: number;
  by: number;
  ra?: number;
  rb?: number;
  draw: number; // 0..1
  color: string;
  width?: number;
  flow?: number | null; // packet position 0..1
  label?: string;
  labelColor?: string;
  labelDy?: number;
}> = ({ ax, ay, bx, by, ra = 6, rb = 6, draw, color, width = 2, flow = null, label, labelColor, labelDy = -12 }) => {
  const s = shorten(ax, ay, bx, by, ra, rb);
  const ex = s.x1 + (s.x2 - s.x1) * draw;
  const ey = s.y1 + (s.y2 - s.y1) * draw;
  // arrowhead at current end, oriented along the vector
  const back = 12;
  const wing = 5;
  const bx0 = ex - back * s.ux;
  const by0 = ey - back * s.uy;
  const head = `M${ex} ${ey} L${bx0 + wing * -s.uy} ${by0 + wing * s.ux} L${bx0 - wing * -s.uy} ${by0 - wing * s.ux} Z`;
  const fx = flow != null ? s.x1 + (s.x2 - s.x1) * flow : 0;
  const fy = flow != null ? s.y1 + (s.y2 - s.y1) * flow : 0;
  return (
    <g opacity={draw > 0.02 ? 1 : 0}>
      <line
        x1={s.x1}
        y1={s.y1}
        x2={ex}
        y2={ey}
        stroke={color}
        strokeWidth={width}
        strokeDasharray="2 7"
        strokeLinecap="round"
      />
      {draw > 0.15 && <path d={head} fill={color} />}
      {flow != null && flow > 0.02 && flow < 0.98 && <circle cx={fx} cy={fy} r={width + 4} fill={color} />}
      {label && draw > 0.5 && (
        <text
          x={(s.x1 + s.x2) / 2}
          y={(s.y1 + s.y2) / 2 + labelDy}
          fill={labelColor ?? theme.textFaint}
          fontSize={18}
          fontFamily={theme.sans}
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
};

/* --------------------------------------------------------------- FileChip */
const FileChip: React.FC<{
  cx: number;
  cy: number;
  label: string;
  draw: number;
  tone?: "muted" | "bad";
  tracked?: boolean | null; // ✓ / ✗ / none
}> = ({ cx, cy, label, draw, tone = "muted", tracked = null }) => {
  const bad = tone === "bad";
  const w = Math.max(120, label.length * 12 + 46);
  const h = 44;
  const color = bad ? theme.amber : theme.textDim;
  const stroke = bad ? theme.amber : theme.stroke;
  const bg = bad ? "rgba(240,180,41,0.08)" : theme.bgPanel;
  return (
    <g opacity={draw} transform={`translate(${cx - w / 2}, ${cy - h / 2})`}>
      <rect x={0} y={0} width={w} height={h} rx={9} fill={bg} stroke={stroke} strokeWidth={bad ? 2 : 1.4} />
      {/* tiny file glyph */}
      <rect x={14} y={12} width={15} height={20} rx={2.5} fill="none" stroke={color} strokeWidth={1.6} />
      <text x={40} y={28} fill={color} fontSize={20} fontFamily={theme.mono}>
        {label}
      </text>
      {tracked === true && (
        <text x={w - 16} y={28} fill={theme.green} fontSize={20} fontFamily={theme.sans} textAnchor="middle">
          ✓
        </text>
      )}
      {tracked === false && (
        <text x={w - 16} y={28} fill={theme.amber} fontSize={20} fontFamily={theme.sans} textAnchor="middle">
          ✗
        </text>
      )}
    </g>
  );
};

/* --------------------------------------------------------------- specs */
const SPECS: Record<string, Spec> = {
  // A — reads left, writes top, cache right, bad read bottom
  A: {
    sandbox: { x: 300, y: 250, w: 840, h: 520 },
    task: { x: 470, y: 470, w: 300, h: 110 },
    io: [
      { label: "App.tsx", cx: 388, cy: 360, ax: 470, ay: 495, tone: "read" },
      { label: "index.ts", cx: 388, cy: 500, ax: 470, ay: 525, tone: "read" },
      { label: "hooks.ts", cx: 388, cy: 640, ax: 470, ay: 555, tone: "read" },
      { label: "dist/main.js", cx: 560, cy: 322, ax: 560, ay: 470, tone: "write" },
      { label: "dist/app.css", cx: 800, cy: 322, ax: 720, ay: 470, tone: "write" },
    ],
    cache: { x: 1300, y: 455, w: 380, h: 150 },
    cacheFrom: { x: 770, y: 525 },
    config: { x: 560, y: 880 },
    configCross: { x: 560, y: 770 },
    configTo: { x: 560, y: 580 },
    sub: "Reads and writes Nx knows about stay inside the sandbox.",
  },
  // B — reads left, writes right, cache top, bad read bottom
  B: {
    sandbox: { x: 300, y: 320, w: 840, h: 420 },
    task: { x: 490, y: 460, w: 300, h: 110 },
    io: [
      { label: "App.tsx", cx: 392, cy: 430, ax: 490, ay: 495, tone: "read" },
      { label: "index.ts", cx: 392, cy: 515, ax: 490, ay: 515, tone: "read" },
      { label: "utils.ts", cx: 392, cy: 600, ax: 490, ay: 545, tone: "read" },
      { label: "dist/main.js", cx: 980, cy: 470, ax: 790, ay: 495, tone: "write" },
      { label: "dist/app.css", cx: 980, cy: 565, ax: 790, ay: 535, tone: "write" },
    ],
    cache: { x: 480, y: 150, w: 380, h: 120 },
    cacheFrom: { x: 640, y: 460 },
    config: { x: 640, y: 880 },
    configCross: { x: 640, y: 740 },
    configTo: { x: 640, y: 570 },
    sub: "Outputs are written, the result is cached — all tracked.",
  },
  // C — reads top, writes right, cache bottom, bad read left
  C: {
    sandbox: { x: 380, y: 250, w: 820, h: 470 },
    task: { x: 520, y: 420, w: 300, h: 110 },
    io: [
      { label: "App.tsx", cx: 545, cy: 305, ax: 580, ay: 420, tone: "read" },
      { label: "index.ts", cx: 700, cy: 305, ax: 670, ay: 420, tone: "read" },
      { label: "hooks.ts", cx: 860, cy: 305, ax: 760, ay: 420, tone: "read" },
      { label: "dist/main.js", cx: 1030, cy: 445, ax: 820, ay: 455, tone: "write" },
      { label: "dist/app.css", cx: 1030, cy: 560, ax: 820, ay: 505, tone: "write" },
    ],
    cache: { x: 480, y: 795, w: 380, h: 140 },
    cacheFrom: { x: 670, y: 530 },
    config: { x: 230, y: 475 },
    configCross: { x: 380, y: 475 },
    configTo: { x: 520, y: 475 },
    sub: "Nx tracks every declared read and write.",
  },
  // D — reads right, writes top, cache left, bad read bottom
  D: {
    sandbox: { x: 360, y: 260, w: 840, h: 500 },
    task: { x: 520, y: 470, w: 300, h: 110 },
    io: [
      { label: "App.tsx", cx: 1070, cy: 415, ax: 820, ay: 505, tone: "read" },
      { label: "index.ts", cx: 1070, cy: 525, ax: 820, ay: 525, tone: "read" },
      { label: "hooks.ts", cx: 1070, cy: 635, ax: 820, ay: 555, tone: "read" },
      { label: "dist/main.js", cx: 560, cy: 332, ax: 600, ay: 470, tone: "write" },
      { label: "dist/app.css", cx: 800, cy: 332, ax: 740, ay: 470, tone: "write" },
    ],
    cache: { x: 20, y: 455, w: 330, h: 150 },
    cacheFrom: { x: 520, y: 525 },
    config: { x: 670, y: 880 },
    configCross: { x: 670, y: 760 },
    configTo: { x: 670, y: 580 },
    sub: "Inputs in, outputs out — the cache mirrors the task.",
  },
  // E — minimal/focus: reads left, write top, cache right, bad read bottom + tracked ticks
  E: {
    sandbox: { x: 320, y: 260, w: 820, h: 500 },
    task: { x: 480, y: 470, w: 300, h: 110 },
    io: [
      { label: "App.tsx", cx: 398, cy: 440, ax: 480, ay: 505, tone: "read" },
      { label: "index.ts", cx: 398, cy: 600, ax: 480, ay: 555, tone: "read" },
      { label: "dist/bundle.js", cx: 630, cy: 332, ax: 630, ay: 470, tone: "write" },
    ],
    cache: { x: 1300, y: 455, w: 380, h: 150 },
    cacheFrom: { x: 780, y: 525 },
    config: { x: 560, y: 880 },
    configCross: { x: 560, y: 760 },
    configTo: { x: 560, y: 580 },
    sub: "Only one read breaks the pattern.",
    minimal: true,
  },
};

/* --------------------------------------------------------------- helpers */
const fr = (f: number, dur: number, a: number, b: number) =>
  interpolate(f, [dur * a, dur * b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

/* --------------------------------------------------------------- scene */
export const SandboxIO: React.FC<SceneProps & { mode: Mode; layout?: string }> = ({
  dur,
  mode,
  layout = "A",
}) => {
  const f = useCurrentFrame();
  const spec = SPECS[layout] ?? SPECS.A;
  const SB = spec.sandbox;
  const T = spec.task;

  const boxT = fr(f, dur, 0, 0.1);
  const cacheBoxT = fr(f, dur, 0.3, 0.4);
  const cacheArrowT = fr(f, dur, 0.34, 0.46);
  const configChipT = fr(f, dur, 0.4, 0.47);
  const configArrowT = fr(f, dur, 0.45, 0.58);
  const warnT = fr(f, dur, 0.56, 0.63);
  const badFlip = fr(f, dur, 0.58, 0.66);

  // caption fully visible for the last ~2.6s (HOLD frames) once the bad read lands
  const HOLD = 90;
  const capShow = interpolate(f, [dur - HOLD - 16, dur - HOLD], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // gentle looping packets to keep declared I/O alive but quiet
  const cacheFlow = ((f / dur - 0.4) * 2.2) % 1;
  const configFlow = configArrowT; // single deliberate pass as it draws

  const cacheCenter = { x: spec.cache.x + spec.cache.w / 2, y: spec.cache.y + spec.cache.h / 2 };

  return (
    <AbsoluteFill>
      {/* heading */}
      <div
        style={{
          position: "absolute",
          top: 66,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: fr(f, dur, 0.02, 0.12),
          fontFamily: theme.sans,
        }}
      >
        <div style={{ fontSize: 38, fontWeight: 700, color: theme.text }}>
          Inside <span style={{ color: theme.cyan, fontFamily: theme.mono }}>{TASK_LABEL}</span>'s sandbox
        </div>
        <div style={{ fontSize: 24, color: theme.textDim, marginTop: 6 }}>{spec.sub}</div>
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* sandbox boundary */}
        <g opacity={boxT}>
          <rect
            x={SB.x}
            y={SB.y}
            width={SB.w}
            height={SB.h}
            rx={20}
            fill="rgba(255,255,255,0.012)"
            stroke={theme.strokeHi}
            strokeWidth={2.5}
            strokeDasharray="10 8"
          />
          <text x={SB.x + 16} y={SB.y + 28} fill={theme.textFaint} fontSize={18} fontFamily={theme.mono}>
            sandbox · declared I/O tracked by Nx
          </text>
        </g>

        {/* declared I/O arrows (muted) */}
        {spec.io.map((it, i) => {
          const d = fr(f, dur, 0.12 + i * 0.04, 0.24 + i * 0.04);
          const read = it.tone === "read";
          return (
            <Arrow
              key={`a${i}`}
              ax={read ? it.cx : it.ax}
              ay={read ? it.cy : it.ay}
              bx={read ? it.ax : it.cx}
              by={read ? it.ay : it.cy}
              ra={read ? 78 : 8}
              rb={read ? 8 : 78}
              draw={d}
              color={theme.textFaint}
              width={spec.minimal ? 1.6 : 2}
            />
          );
        })}

        {/* cache arrow — separate, out of the task & sandbox (calm cyan) */}
        <Arrow
          ax={spec.cacheFrom.x}
          ay={spec.cacheFrom.y}
          bx={cacheCenter.x}
          by={cacheCenter.y}
          ra={10}
          rb={spec.cache.w / 2 + 10}
          draw={cacheArrowT}
          color={theme.cyan}
          width={2.6}
          flow={cacheArrowT > 0.95 ? (cacheFlow > 0 ? cacheFlow : null) : cacheArrowT}
          label="caches result"
          labelColor={theme.cyan}
        />

        {/* the one unexpected read — from outside, across the wall (amber, the focus) */}
        <Arrow
          ax={spec.config.x}
          ay={spec.config.y}
          bx={spec.configTo.x}
          by={spec.configTo.y}
          ra={30}
          rb={8}
          draw={configArrowT}
          color={theme.amber}
          width={3.2}
          flow={configFlow}
          label="unexpected read"
          labelColor={theme.amber}
          labelDy={18}
        />
        {/* warning where it pierces the sandbox wall */}
        <g opacity={warnT}>
          <circle
            cx={spec.configCross.x}
            cy={spec.configCross.y}
            r={16}
            fill={theme.bg}
            stroke={theme.amber}
            strokeWidth={2.5}
          />
          <text
            x={spec.configCross.x}
            y={spec.configCross.y + 8}
            fill={theme.amber}
            fontSize={24}
            fontWeight={700}
            fontFamily={theme.sans}
            textAnchor="middle"
          >
            !
          </text>
        </g>

        {/* file chips (on top of arrows) */}
        {spec.io.map((it, i) => {
          const d = fr(f, dur, 0.1 + i * 0.04, 0.2 + i * 0.04);
          return (
            <FileChip
              key={`c${i}`}
              cx={it.cx}
              cy={it.cy}
              label={it.label}
              draw={d}
              tracked={spec.minimal ? true : null}
            />
          );
        })}

        {/* config.json chip (outside, the bad one) */}
        <g opacity={configChipT}>
          <FileChip
            cx={spec.config.x}
            cy={spec.config.y}
            label={BAD_FILE}
            draw={1}
            tone="bad"
            tracked={spec.minimal ? false : null}
          />
          <text
            x={spec.config.x}
            y={spec.config.y + 42}
            fill={theme.amber}
            fontSize={18}
            fontFamily={theme.sans}
            textAnchor="middle"
          >
            outside the sandbox · not declared
          </text>
        </g>

        {/* task node */}
        <g opacity={boxT}>
          <rect
            x={T.x}
            y={T.y}
            width={T.w}
            height={T.h}
            rx={16}
            fill={theme.bgPanel}
            stroke={badFlip > 0.4 ? theme.amber : theme.strokeHi}
            strokeWidth={3}
          />
          <text x={T.x + T.w / 2} y={T.y + 38} fill={theme.textDim} fontSize={18} fontFamily={theme.mono} textAnchor="middle">
            nx run
          </text>
          <text
            x={T.x + T.w / 2}
            y={T.y + 76}
            fill={badFlip > 0.4 ? theme.amber : theme.text}
            fontSize={34}
            fontWeight={700}
            fontFamily={theme.mono}
            textAnchor="middle"
          >
            {TASK_LABEL}
          </text>
        </g>
      </svg>

      {/* cache tile (HTML, for nicer text) */}
      <div
        style={{
          position: "absolute",
          left: cacheCenter.x - spec.cache.w / 2,
          top: cacheCenter.y - 46,
          opacity: cacheBoxT,
        }}
      >
        <CacheTile
          state={badFlip > 0.4 ? "bad" : "good"}
          mode={mode}
          reveal={Math.max(cacheBoxT, badFlip)}
          width={spec.cache.w}
        />
      </div>

      <Caption show={capShow}>
        One undeclared read makes <b style={{ color: theme.amber }}>{TASK_LABEL}</b>'s cache{" "}
        {mode === "poison" ? "a poisoning risk" : "unreliable"} — its result no longer matches its inputs.
      </Caption>
    </AbsoluteFill>
  );
};
