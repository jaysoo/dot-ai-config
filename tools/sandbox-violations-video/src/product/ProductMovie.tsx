import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, Easing } from "remotion";
import { theme } from "../theme";
import { NxMark } from "../components/util";
import { Background, Bg } from "../scenes/SceneKit";
import { DashboardScene } from "../scenes/DashboardScene";
import { TitleScene } from "../scenes/TitleScene";
import { DashStory } from "../story";
import { PRun } from "./PRun";
import { PFix } from "./PFix";
import { SandboxRun } from "./SandboxRun";

export type Trans = "fade" | "slide" | "none";
export type Mode = "unreliable" | "poison";

export interface PScene {
  kind: "title" | "run" | "dashboard" | "fix";
  dur: number;
  style?: "rows" | "cards" | "sandbox";
  title?: string;
  sub?: string;
}

export interface PVariant {
  id: string;
  bg: Bg;
  accent: string;
  trans: Trans;
  mode: Mode;
  story?: DashStory; // overrides dashboard/fix data (P2 uses the build story)
  scenes: PScene[];
}

export const ptotal = (v: PVariant) => v.scenes.reduce((a, s) => a + s.dur, 0);

const ENTER = 14;
const EXIT = 12;

const Wrapper: React.FC<{ dur: number; trans: Trans; children: React.ReactNode }> = ({
  dur,
  trans,
  children,
}) => {
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
  const x = trans === "slide" ? (1 - inT) * 80 - (1 - outT) * 80 : 0;
  return (
    <AbsoluteFill style={{ opacity: inT * outT, transform: `translateX(${x}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

const render = (s: PScene, v: PVariant) => {
  const p = { dur: s.dur, accent: v.accent };
  switch (s.kind) {
    case "title":
      return <TitleScene {...p} title={s.title ?? ""} sub={s.sub} />;
    case "run":
      return s.style === "sandbox" ? (
        <SandboxRun {...p} mode={v.mode} />
      ) : (
        <PRun {...p} mode={v.mode} style={s.style as "rows" | "cards"} />
      );
    case "dashboard":
      return <DashboardScene {...p} story={v.story} />;
    case "fix":
      return <PFix {...p} mode={v.mode} story={v.story} />;
  }
};

export const ProductMovie: React.FC<{ v: PVariant }> = ({ v }) => {
  let off = 0;
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Background bg={v.bg} accent={v.accent} />
      <div style={{ position: "absolute", top: 40, right: 56, opacity: 0.25, zIndex: 60 }}>
        <NxMark size={40} color={v.accent} />
      </div>
      {v.scenes.map((s, i) => {
        const from = off;
        off += s.dur;
        return (
          <Sequence key={i} from={from} durationInFrames={s.dur}>
            <Wrapper dur={s.dur} trans={v.trans}>
              {render(s, v)}
            </Wrapper>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
