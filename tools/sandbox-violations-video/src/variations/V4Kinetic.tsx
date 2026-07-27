import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { theme, STORY } from "../theme";
import { ramp, useCount, NxMark } from "../components/util";

/**
 * V4 — "Kinetic Type"
 * Minimal, punchy kinetic typography. Three beats, full-screen, bold.
 */

const Word: React.FC<{
  children: React.ReactNode;
  delay: number;
  size?: number;
  color?: string;
}> = ({ children, delay, size = 120, color = theme.text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 16, mass: 0.7 } });
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: theme.sans,
        fontWeight: 850,
        fontSize: size,
        color,
        letterSpacing: -2,
        opacity: s,
        transform: `translateY(${(1 - s) * 50}px)`,
        lineHeight: 1.05,
      }}
    >
      {children}
    </span>
  );
};

const Beat: React.FC<{ from: number; durationInFrames: number; children: React.ReactNode }> = ({
  from,
  durationInFrames,
  children,
}) => {
  return (
    <Sequence from={from} durationInFrames={durationInFrames}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 100 }}>
        {children}
      </AbsoluteFill>
    </Sequence>
  );
};

export const V4Kinetic: React.FC = () => {
  const frame = useCurrentFrame();
  const count = useCount(STORY.violations, 8, 34);

  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <div style={{ position: "absolute", top: 56, left: 64, opacity: 0.5 }}>
        <NxMark size={40} />
      </div>

      {/* Beat 1: the number */}
      <Beat from={0} durationInFrames={96}>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 24, justifyContent: "center" }}>
            <span
              style={{
                fontFamily: theme.sans,
                fontWeight: 900,
                fontSize: 300,
                color: theme.amber,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              {count}
            </span>
            <span style={{ fontFamily: theme.sans, fontWeight: 800, fontSize: 110, color: theme.textDim }}>
              / {STORY.total}
            </span>
          </div>
          <div style={{ marginTop: 10 }}>
            <Word delay={26} size={70} color={theme.text}>
              tasks broke the sandbox
            </Word>
          </div>
        </div>
      </Beat>

      {/* Beat 2: three tasks, one flags */}
      <Beat from={96} durationInFrames={96}>
        <div style={{ display: "flex", gap: 50 }}>
          {[
            { l: "build", ok: true, d: 4 },
            { l: "test", ok: true, d: 12 },
            { l: "lint", ok: false, d: 20 },
          ].map((t) => {
            const f = frame - 96;
            const flag = !t.ok ? ramp(f, 44, 58) : 0;
            const sp = spring({ frame: f - t.d, fps: 30, config: { damping: 15 } });
            return (
              <div
                key={t.l}
                style={{
                  width: 320,
                  height: 320,
                  borderRadius: 28,
                  border: `3px solid ${t.ok ? theme.greenDim : `rgba(239,68,68,${0.4 + flag * 0.6})`}`,
                  background: t.ok ? "rgba(51,217,121,0.06)" : `rgba(239,68,68,${flag * 0.12})`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 16,
                  opacity: sp,
                  transform: `scale(${0.85 + sp * 0.15})`,
                  boxShadow: !t.ok ? `0 0 ${flag * 60}px rgba(239,68,68,0.4)` : "none",
                }}
              >
                <span style={{ fontSize: 90 }}>{t.ok ? "✅" : flag > 0.5 ? "🚩" : "⏳"}</span>
                <span style={{ fontFamily: theme.mono, fontSize: 38, color: t.ok ? theme.green : theme.red }}>
                  {t.l}
                </span>
              </div>
            );
          })}
        </div>
      </Beat>

      {/* Beat 3: cache punchline */}
      <Beat from={192} durationInFrames={108}>
        <div style={{ textAlign: "center" }}>
          <Word delay={0} size={64} color={theme.textDim}>
            re-run the flagged task →
          </Word>
          <div style={{ marginTop: 16 }}>
            <Word delay={14} size={130} color={theme.green}>
              CACHE HIT
            </Word>
          </div>
          <div style={{ marginTop: 26 }}>
            <Word delay={40} size={56} color={theme.red}>
              ...but the result is stale. Cache poisoned.
            </Word>
          </div>
        </div>
      </Beat>
    </AbsoluteFill>
  );
};
