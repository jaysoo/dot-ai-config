import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { theme } from "../theme";
import { DEFAULT_DASH, DashStory } from "../story";
import { Check, Cross, NxMark } from "../components/util";
import { fr, FixButton, Cursor, StatBlock, Caption, SceneProps } from "./SceneKit";

/** Layout anchors shared with FixScene so the cut is seamless. */
export const DASH = {
  fixBtn: { x: 1456, y: 372 }, // top-left of the Fix button
};

export const DashHeader: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 30 }}>
    <NxMark size={42} />
    <span style={{ fontFamily: theme.sans, fontSize: 28, color: theme.textDim }}>
      Nx Cloud
    </span>
    <span style={{ color: theme.textFaint, fontSize: 24 }}>/ Analytics /</span>
    <span style={{ fontFamily: theme.sans, fontSize: 28, color: theme.text, fontWeight: 700 }}>
      Sandbox violations
    </span>
  </div>
);

export const Table: React.FC<{
  fixedRow?: boolean;
  reveal: (i: number) => number;
  rows?: DashStory["rows"];
}> = ({ fixedRow = false, reveal, rows = DEFAULT_DASH.rows }) => (
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
        padding: "18px 30px",
        fontFamily: theme.sans,
        fontSize: 25,
        color: theme.textDim,
        fontWeight: 700,
        borderBottom: `1px solid ${theme.strokeHi}`,
      }}
    >
      <span>Task</span>
      <span>Unexpected reads</span>
      <span>Status</span>
    </div>
    {rows.map((r, i) => {
      const t = reveal(i);
      const healed = fixedRow && r.bad;
      const bad = r.bad && !healed;
      return (
        <div
          key={r.id}
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr",
            alignItems: "center",
            padding: "22px 30px",
            borderBottom: `1px solid ${theme.stroke}`,
            fontFamily: theme.mono,
            fontSize: 30,
            opacity: t,
            transform: `translateX(${(1 - t) * 20}px)`,
            background: bad ? "rgba(240,180,41,0.08)" : healed ? "rgba(51,217,121,0.07)" : "transparent",
          }}
        >
          <span style={{ color: bad ? theme.amber : healed ? theme.green : theme.text }}>
            {r.id}
          </span>
          <span>
            {r.reads > 0 && !healed ? (
              <span
                style={{
                  background: "rgba(240,180,41,0.2)",
                  color: theme.amber,
                  padding: "3px 16px",
                  borderRadius: 8,
                  fontWeight: 700,
                }}
              >
                {r.reads}
              </span>
            ) : (
              <span style={{ color: theme.textFaint }}>0</span>
            )}
          </span>
          <span>
            {bad ? (
              <Cross size={26} color={theme.amber} />
            ) : (
              <Check size={26} color={theme.green} />
            )}
          </span>
        </div>
      );
    })}
  </div>
);

export const DashboardScene: React.FC<
  SceneProps & { clickAtEnd?: boolean; story?: DashStory }
> = ({ dur, clickAtEnd = true, story = DEFAULT_DASH }) => {
  const f = useCurrentFrame();

  // cursor glides to the Fix button and clicks near the end
  const move = interpolate(f, [dur * 0.55, dur * 0.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const cx = interpolate(move, [0, 1], [980, DASH.fixBtn.x + 90]);
  const cy = interpolate(move, [0, 1], [820, DASH.fixBtn.y + 34]);
  const click = clickAtEnd
    ? interpolate(f, [dur * 0.82, dur * 0.88, dur * 0.94], [0, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const btnGlow = Math.max(fr(f, dur, 0.4, 0.55), click);

  return (
    <AbsoluteFill style={{ padding: "52px 72px" }}>
      <DashHeader />

      <div style={{ display: "flex", gap: 26, marginBottom: 26, opacity: fr(f, dur, 0.08, 0.22) }}>
        <div style={{ flex: 1 }}>
          <StatBlock
            value={
              <>
                {story.violations}
                <span style={{ fontSize: 44, color: theme.textDim }}> / {story.total}</span>
              </>
            }
            sub={`${story.unit} with sandbox violations`}
            color={theme.amber}
          />
        </div>
        <div style={{ flex: 1 }}>
          <StatBlock value={story.total - story.violations} sub={`${story.unit} clean`} color={theme.green} />
        </div>
      </div>

      {/* purple fix banner */}
      <div
        style={{
          background: theme.purpleBg,
          border: `1px solid ${theme.purpleStroke}`,
          borderRadius: 16,
          padding: "22px 30px",
          display: "flex",
          alignItems: "center",
          gap: 18,
          marginBottom: 28,
          opacity: fr(f, dur, 0.2, 0.34),
        }}
      >
        <span style={{ fontSize: 30 }}>🛡️</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: theme.sans, fontSize: 28, color: theme.text, fontWeight: 700 }}>
            {story.badTask} read {story.file} — an input Nx didn't expect
          </div>
          <div style={{ fontFamily: theme.sans, fontSize: 22, color: theme.textDim }}>
            Fix the input config to restore cache reliability
          </div>
        </div>
        <FixButton glow={btnGlow} pressed={click} />
      </div>

      <Table rows={story.rows} reveal={(i) => fr(f, dur, 0.3 + i * 0.05, 0.44 + i * 0.05)} />

      <Caption show={fr(f, dur, 0.46, 0.56) * (1 - fr(f, dur, 0.78, 0.86))}>
        <b style={{ color: theme.amber }}>
          {story.violations} of {story.total}
        </b>{" "}
        {story.unit} broke the sandbox — one click to fix it.
      </Caption>

      {move > 0 && <Cursor x={cx} y={cy} click={click} />}
    </AbsoluteFill>
  );
};
