import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, Easing } from "remotion";
import { theme } from "../theme";
import { NxMark } from "../components/util";
import { Background, Bg } from "../scenes/SceneKit";
import { RunScene } from "../scenes/RunScene";
import { CacheScene } from "../scenes/CacheScene";
import { DashboardScene } from "../scenes/DashboardScene";
import { FixScene } from "../scenes/FixScene";
import { TitleScene } from "../scenes/TitleScene";

export type SceneKind = "title" | "run" | "cache" | "dashboard" | "fix";
export type Trans = "fade" | "slide" | "none";

export interface SceneSpec {
  kind: SceneKind;
  dur: number;
  style?: "graph" | "cards" | "terminal";
  title?: string;
  sub?: string;
}

export interface Variant {
  id: string;
  bg: Bg;
  accent: string;
  secur?: boolean;
  trans: Trans;
  scenes: SceneSpec[];
}

export const totalFrames = (v: Variant) =>
  v.scenes.reduce((a, s) => a + s.dur, 0);

const ENTER = 12;
const EXIT = 10;

const SceneWrapper: React.FC<{
  dur: number;
  trans: Trans;
  children: React.ReactNode;
}> = ({ dur, trans, children }) => {
  const f = useCurrentFrame();
  const inT = interpolate(f, [0, ENTER], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const outT = interpolate(f, [dur - EXIT, dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  let transform = "none";
  if (trans === "slide") {
    const x = (1 - inT) * 80 - (1 - outT) * 80;
    transform = `translateX(${x}px)`;
  }
  return (
    <AbsoluteFill style={{ opacity: inT * outT, transform }}>{children}</AbsoluteFill>
  );
};

const renderScene = (s: SceneSpec, v: Variant) => {
  const p = { dur: s.dur, accent: v.accent, secur: v.secur };
  switch (s.kind) {
    case "title":
      return <TitleScene {...p} title={s.title ?? ""} sub={s.sub} />;
    case "run":
      return <RunScene {...p} style={s.style} />;
    case "cache":
      return <CacheScene {...p} />;
    case "dashboard":
      return <DashboardScene {...p} />;
    case "fix":
      return <FixScene {...p} />;
  }
};

export const Movie: React.FC<{ v: Variant }> = ({ v }) => {
  let off = 0;
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Background bg={v.bg} accent={v.accent} />
      {/* persistent watermark */}
      <div style={{ position: "absolute", top: 40, right: 56, opacity: 0.25, zIndex: 60 }}>
        <NxMark size={40} color={v.accent} />
      </div>
      {v.scenes.map((s, i) => {
        const from = off;
        off += s.dur;
        return (
          <Sequence key={i} from={from} durationInFrames={s.dur}>
            <SceneWrapper dur={s.dur} trans={v.trans}>
              {renderScene(s, v)}
            </SceneWrapper>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
