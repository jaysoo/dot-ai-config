import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { theme } from "../theme";
import { fr, SceneProps } from "./SceneKit";

export const TitleScene: React.FC<SceneProps & { title: string; sub?: string }> = ({
  dur,
  accent,
  title,
  sub,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 16, mass: 0.7 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 120 }}>
      <div
        style={{
          fontFamily: theme.sans,
          fontWeight: 900,
          fontSize: 92,
          color: theme.text,
          letterSpacing: -2,
          textAlign: "center",
          opacity: s,
          transform: `translateY(${(1 - s) * 40}px)`,
          lineHeight: 1.08,
        }}
      >
        {title}
      </div>
      {sub && (
        <div
          style={{
            marginTop: 22,
            fontFamily: theme.sans,
            fontSize: 38,
            color: accent,
            fontWeight: 700,
            opacity: fr(f, dur, 0.25, 0.5),
          }}
        >
          {sub}
        </div>
      )}
    </AbsoluteFill>
  );
};
