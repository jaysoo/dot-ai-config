import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { theme } from "../theme";
import { BUILD_STORY } from "../story";
import { fr, Caption, SceneProps } from "../scenes/SceneKit";
import { Check, Cross, Spinner } from "../components/util";
import { CacheTile, TileState } from "./ProductKit";

type Mode = "unreliable" | "poison";

/* -------- geometry (1920x1080) -------- */
const ROW_Y = [250, 500, 750];
const SBX = { left: 600, w: 430, h: 168 }; // sandbox boundary box
const INPUT_X = 250;
const CACHE_X = 1240;
const EXT = { x: 690, y: 868, w: 540, h: 150 }; // external file, outside backend's sandbox

const rowState = (
  f: number,
  dur: number,
  resolve: number,
  bad: boolean
): "run" | "ok" | "bad" => (f < dur * resolve ? "run" : bad ? "bad" : "ok");

/** horizontal arrow with a draw-in + a flowing packet */
const HArrow: React.FC<{
  x1: number;
  x2: number;
  y: number;
  draw: number; // 0..1
  flow: number; // 0..1 packet position (hidden when 0 or >=1)
  color: string;
  label?: string;
  labelColor?: string;
}> = ({ x1, x2, y, draw, flow, color, label, labelColor }) => {
  const xEnd = interpolate(draw, [0, 1], [x1, x2]);
  const px = interpolate(flow, [0, 1], [x1, x2]);
  return (
    <>
      <line
        x1={x1}
        y1={y}
        x2={xEnd - 14}
        y2={y}
        stroke={color}
        strokeWidth={3}
        strokeDasharray="2 9"
        strokeLinecap="round"
      />
      {draw > 0.92 && <path d={`M${x2 - 16} ${y - 7}l11 7-11 7z`} fill={color} />}
      {flow > 0.02 && flow < 0.98 && <circle cx={px} cy={y} r={9} fill={color} />}
      {label && (
        <text
          x={(x1 + x2) / 2}
          y={y - 16}
          fill={labelColor ?? theme.textDim}
          fontSize={20}
          fontFamily={theme.sans}
          textAnchor="middle"
          opacity={draw}
        >
          {label}
        </text>
      )}
    </>
  );
};

export const SandboxRun: React.FC<SceneProps & { mode: Mode }> = ({ dur, mode }) => {
  const f = useCurrentFrame();
  const tasks = BUILD_STORY.tasks;

  // staggered, slow reveal so each row is readable, all settled by ~0.5*dur
  const sched = [
    { appear: 0.04, run: 0.14, resolve: 0.28 },
    { appear: 0.15, run: 0.24, resolve: 0.38 },
    { appear: 0.26, run: 0.34, resolve: 0.48 }, // backend (bad)
  ];
  const headT = fr(f, dur, 0.02, 0.12);
  const violationT = fr(f, dur, 0.46, 0.56); // backend reaches outside
  // Caption fully visible for the last ≥2.5s (75f @30fps) so it stays readable
  // after the run animation has settled.
  const HOLD = 78;
  const capShow = interpolate(f, [dur - HOLD - 16, dur - HOLD], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      {/* heading */}
      <div
        style={{
          position: "absolute",
          top: 68,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: headT,
          fontFamily: theme.sans,
          fontSize: 36,
          color: theme.textDim,
          fontWeight: 600,
        }}
      >
        Each build runs in its <span style={{ color: theme.text }}>own sandbox</span>
        {"  "}
        <span style={{ color: theme.textFaint, fontSize: 28 }}>
          — Nx watches every read &amp; write
        </span>
      </div>

      {/* SVG: sandbox boundaries + arrows */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {tasks.map((t, i) => {
          const y = ROW_Y[i];
          const s = sched[i];
          const appear = fr(f, dur, s.appear, s.appear + 0.12);
          const running = f >= dur * s.run;
          const draw = fr(f, dur, s.run, s.run + 0.12);
          const flow = interpolate(
            f,
            [dur * s.run, dur * (s.resolve + 0.04)],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const bad = t.bad;
          return (
            <g key={t.id} opacity={appear}>
              {/* sandbox boundary */}
              <rect
                x={SBX.left}
                y={y - SBX.h / 2}
                width={SBX.w}
                height={SBX.h}
                rx={18}
                fill="rgba(255,255,255,0.015)"
                stroke={theme.strokeHi}
                strokeWidth={2.5}
                strokeDasharray="9 7"
              />
              <text
                x={SBX.left + 14}
                y={y - SBX.h / 2 + 26}
                fill={theme.textFaint}
                fontSize={18}
                fontFamily={theme.mono}
              >
                sandbox
              </text>

              {/* reads in (declared) */}
              <HArrow
                x1={INPUT_X + 150}
                x2={SBX.left}
                y={y}
                draw={draw}
                flow={running ? flow : 0}
                color={theme.cyan}
                label="reads"
                labelColor={theme.cyan}
              />
              {/* writes out → cache */}
              <HArrow
                x1={SBX.left + SBX.w}
                x2={CACHE_X}
                y={y}
                draw={draw}
                flow={running ? Math.max(0, flow - 0.15) : 0}
                color={bad ? theme.amber : theme.green}
                label="writes"
                labelColor={bad ? theme.amber : theme.green}
              />

              {/* backend: unexpected read reaching OUTSIDE the sandbox */}
              {bad && (
                <g opacity={violationT}>
                  {/* arrow piercing the bottom wall down to the external file */}
                  <line
                    x1={SBX.left + 90}
                    y1={y + SBX.h / 2}
                    x2={SBX.left + 90}
                    y2={EXT.y}
                    stroke={theme.amber}
                    strokeWidth={3}
                    strokeDasharray="2 8"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M${SBX.left + 83} ${y + SBX.h / 2 + 8}l7 -11 7 11z`}
                    fill={theme.amber}
                  />
                  {/* warning where it crosses the boundary */}
                  <circle
                    cx={SBX.left + 90}
                    cy={y + SBX.h / 2}
                    r={15}
                    fill={theme.bg}
                    stroke={theme.amber}
                    strokeWidth={2.5}
                  />
                  <text
                    x={SBX.left + 90}
                    y={y + SBX.h / 2 + 7}
                    fill={theme.amber}
                    fontSize={22}
                    fontWeight={700}
                    fontFamily={theme.sans}
                    textAnchor="middle"
                  >
                    !
                  </text>
                  <text
                    x={SBX.left + 120}
                    y={(y + SBX.h / 2 + EXT.y) / 2 + 6}
                    fill={theme.amber}
                    fontSize={21}
                    fontFamily={theme.sans}
                  >
                    unexpected read
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* HTML overlays: inputs, task cards, cache tiles */}
      {tasks.map((t, i) => {
        const y = ROW_Y[i];
        const s = sched[i];
        const appear = fr(f, dur, s.appear, s.appear + 0.12);
        const state = rowState(f, dur, s.resolve, t.bad);
        const resolved = f >= dur * s.resolve;
        const cacheState: TileState = !resolved ? "idle" : t.bad ? "bad" : "good";
        const cacheReveal = fr(f, dur, s.resolve, s.resolve + 0.14);
        const flag = t.bad ? fr(f, dur, s.resolve, s.resolve + 0.14) : 0;
        return (
          <React.Fragment key={t.id}>
            {/* declared inputs chip */}
            <div
              style={{
                position: "absolute",
                left: INPUT_X - 110,
                top: y - 34,
                width: 260,
                textAlign: "center",
                opacity: appear,
              }}
            >
              <div style={{ fontFamily: theme.sans, fontSize: 18, color: theme.textFaint }}>
                declared inputs
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontFamily: theme.mono,
                  fontSize: 22,
                  color: theme.textDim,
                  border: `1.5px solid ${theme.stroke}`,
                  background: theme.bgPanel,
                  borderRadius: 10,
                  padding: "8px 12px",
                }}
              >
                {BUILD_STORY.declared}
              </div>
            </div>

            {/* task card inside the sandbox */}
            <div
              style={{
                position: "absolute",
                left: SBX.left + 30,
                top: y - 48,
                width: SBX.w - 60,
                height: 96,
                borderRadius: 14,
                border: `3px solid ${
                  state === "bad" ? theme.amber : state === "ok" ? theme.greenDim : theme.stroke
                }`,
                background:
                  state === "bad"
                    ? `rgba(240,180,41,${0.08 + flag * 0.1})`
                    : state === "ok"
                    ? "rgba(51,217,121,0.06)"
                    : theme.bgPanel,
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "0 22px",
                opacity: appear,
                boxShadow:
                  state === "bad" && flag > 0 ? `0 0 ${flag * 40}px ${theme.amber}55` : "none",
              }}
            >
              <div style={{ width: 30 }}>
                {state === "run" ? (
                  <Spinner size={28} />
                ) : state === "ok" ? (
                  <Check size={28} />
                ) : (
                  <Cross size={28} color={theme.amber} />
                )}
              </div>
              <div
                style={{
                  fontFamily: theme.mono,
                  fontSize: 30,
                  fontWeight: 700,
                  color: state === "bad" ? theme.amber : state === "ok" ? theme.green : theme.text,
                }}
              >
                {t.id}
              </div>
            </div>

            {/* cache tile */}
            <div style={{ position: "absolute", left: CACHE_X, top: y - 40, opacity: appear }}>
              <CacheTile state={cacheState} mode={mode} reveal={cacheReveal} width={330} compact />
            </div>
          </React.Fragment>
        );
      })}

      {/* external file, outside the sandbox */}
      <div
        style={{
          position: "absolute",
          left: EXT.x,
          top: EXT.y,
          width: EXT.w,
          opacity: violationT,
        }}
      >
        <div style={{ fontFamily: theme.sans, fontSize: 19, color: theme.amber, marginBottom: 6 }}>
          outside the sandbox · never declared
        </div>
        <div
          style={{
            fontFamily: theme.mono,
            fontSize: 26,
            color: theme.text,
            border: `2px solid ${theme.amber}`,
            background: "rgba(240,180,41,0.08)",
            borderRadius: 12,
            padding: "14px 18px",
            display: "inline-block",
          }}
        >
          📄 {BUILD_STORY.file}
        </div>
      </div>

      <Caption show={capShow}>
        <b style={{ color: theme.amber }}>backend:build</b> read outside its sandbox — so only{" "}
        <b style={{ color: theme.amber }}>its</b> cache is{" "}
        {mode === "poison" ? "a poisoning risk" : "unreliable"}.
      </Caption>
    </AbsoluteFill>
  );
};
