import React from "react";
import {
  useCurrentFrame,
  interpolate,
  Easing,
  AbsoluteFill,
} from "remotion";
import { theme } from "../theme";
import { Check, Cross, Spinner } from "../components/util";

/** ramp over a fraction window [a,b] of a scene of length dur */
export const fr = (
  f: number,
  dur: number,
  a: number,
  b: number,
  easing = Easing.out(Easing.cubic)
) =>
  interpolate(f, [dur * a, dur * b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export type SceneProps = {
  dur: number;
  accent: string;
  secur?: boolean;
};

/* ----------------------------------------------------------------- Background */

export type Bg = "flat" | "radial" | "grid";

export const Background: React.FC<{ bg: Bg; accent: string }> = ({
  bg,
  accent,
}) => {
  if (bg === "radial")
    return (
      <AbsoluteFill
        style={{
          background: `radial-gradient(1300px 800px at 72% 8%, ${accent}14 0%, ${theme.bg} 58%)`,
        }}
      />
    );
  if (bg === "grid")
    return (
      <AbsoluteFill style={{ background: theme.bg }}>
        <AbsoluteFill
          style={{
            backgroundImage: `linear-gradient(${theme.stroke}55 1px, transparent 1px), linear-gradient(90deg, ${theme.stroke}55 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(circle at 50% 40%, black 0%, transparent 75%)",
          }}
        />
      </AbsoluteFill>
    );
  return <AbsoluteFill style={{ background: theme.bg }} />;
};

/* ----------------------------------------------------------------- Task card */

export const TaskCard: React.FC<{
  label: string;
  state: "run" | "ok" | "bad";
  flag?: number; // 0..1 red emphasis
  style?: React.CSSProperties;
}> = ({ label, state, flag = 0, style }) => {
  const border =
    state === "bad"
      ? `rgba(239,68,68,${0.5 + flag * 0.5})`
      : state === "ok"
      ? theme.greenDim
      : theme.stroke;
  return (
    <div
      style={{
        width: 360,
        borderRadius: 20,
        border: `3px solid ${border}`,
        background:
          state === "bad"
            ? `rgba(239,68,68,${0.06 + flag * 0.12})`
            : state === "ok"
            ? "rgba(51,217,121,0.05)"
            : theme.bgPanel,
        padding: "26px 30px",
        display: "flex",
        alignItems: "center",
        gap: 18,
        boxShadow:
          state === "bad" && flag > 0
            ? `0 0 ${flag * 60}px rgba(239,68,68,0.4)`
            : "none",
        ...style,
      }}
    >
      <div style={{ width: 36 }}>
        {state === "run" ? (
          <Spinner size={34} />
        ) : state === "ok" ? (
          <Check size={34} />
        ) : (
          <Cross size={34} />
        )}
      </div>
      <div>
        <div style={{ fontFamily: theme.mono, fontSize: 20, color: theme.textDim }}>
          nx run
        </div>
        <div
          style={{
            fontFamily: theme.mono,
            fontSize: 38,
            fontWeight: 700,
            color: state === "bad" ? theme.red : state === "ok" ? theme.green : theme.text,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------- Cache node */

export const CacheBox: React.FC<{
  poison: number; // 0..1
  fixed?: number; // 0..1 (protected)
  size?: number;
}> = ({ poison, fixed = 0, size = 1 }) => {
  const bad = poison > 0.3 && fixed < 0.3;
  const ok = fixed > 0.3;
  const color = ok ? theme.green : bad ? theme.red : theme.strokeHi;
  return (
    <div
      style={{
        width: 300 * size,
        height: 220 * size,
        borderRadius: 24,
        border: `3px solid ${color}`,
        background: theme.bgPanel,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        boxShadow:
          bad || ok ? `0 0 ${40 * size}px ${color}55` : "none",
      }}
    >
      <div style={{ fontFamily: theme.sans, fontSize: 24 * size, color: theme.textDim }}>
        Remote cache
      </div>
      <div style={{ fontSize: 64 * size }}>{ok ? "🛡️" : bad ? "☠️" : "📦"}</div>
      <div
        style={{
          fontFamily: theme.mono,
          fontSize: 22 * size,
          fontWeight: 700,
          color,
        }}
      >
        {ok ? "key busts correctly" : bad ? "stale = poisoned" : "key a1f9…c0"}
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------- Fix button */

export const FixButton: React.FC<{ glow?: number; pressed?: number }> = ({
  glow = 0,
  pressed = 0,
}) => (
  <div
    style={{
      background: theme.purple,
      color: "#fff",
      fontFamily: theme.sans,
      fontWeight: 800,
      fontSize: 30,
      padding: "18px 34px",
      borderRadius: 14,
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      transform: `scale(${1 - pressed * 0.06})`,
      boxShadow: `0 0 ${glow * 50}px rgba(124,92,255,0.7)`,
    }}
  >
    <span>✦</span> Fix with AI
  </div>
);

/* ----------------------------------------------------------------- Cursor */

export const Cursor: React.FC<{
  x: number;
  y: number;
  click?: number; // 0..1 click pulse
}> = ({ x, y, click = 0 }) => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 24 24"
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `scale(${1 - click * 0.2})`,
      filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.6))",
      zIndex: 50,
    }}
  >
    <path
      d="M4 2l16 9-7 1.5L9.5 20 4 2z"
      fill="#fff"
      stroke="#000"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

/* ----------------------------------------------------------------- Stat block */

export const StatBlock: React.FC<{
  value: React.ReactNode;
  sub: React.ReactNode;
  color: string;
}> = ({ value, sub, color }) => (
  <div
    style={{
      background: theme.bgPanel,
      border: `1px solid ${theme.stroke}`,
      borderRadius: 18,
      padding: "26px 36px",
    }}
  >
    <div
      style={{
        fontFamily: theme.sans,
        fontWeight: 850,
        fontSize: 92,
        color,
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </div>
    <div style={{ fontFamily: theme.sans, fontSize: 26, color: theme.textDim, marginTop: 8 }}>
      {sub}
    </div>
  </div>
);

/* ----------------------------------------------------------------- Caption */

export const Caption: React.FC<{
  children: React.ReactNode;
  show: number;
}> = ({ children, show }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 54,
      display: "flex",
      justifyContent: "center",
      opacity: show,
      transform: `translateY(${(1 - show) * 12}px)`,
    }}
  >
    <span
      style={{
        fontFamily: theme.sans,
        fontSize: 32,
        lineHeight: 1.3,
        color: theme.text,
        background: "rgba(8,8,11,0.92)",
        border: `1px solid ${theme.stroke}`,
        padding: "14px 30px",
        borderRadius: 14,
        maxWidth: 1500,
        textAlign: "center",
      }}
    >
      {children}
    </span>
  </div>
);
