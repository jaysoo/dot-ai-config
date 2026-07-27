import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { theme } from "../theme";

/** Eased 0->1 ramp over [start,end] frames. */
export const ramp = (
  frame: number,
  start: number,
  end: number,
  easing = Easing.out(Easing.cubic)
) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Pop-in spring scale, anchored at a frame. */
export const usePop = (delay: number, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.8 } });
};

export const FadeUp: React.FC<{
  delay?: number;
  y?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, y = 24, children, style }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, delay + 18);
  return (
    <div
      style={{
        opacity: t,
        transform: `translateY(${(1 - t) * y}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Count up to a target integer between [start,end] frames. */
export const useCount = (target: number, start: number, end: number) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(t * target);
};

/** The rounded-square Nx Cloud mark. */
export const NxMark: React.FC<{ size?: number; color?: string }> = ({
  size = 56,
  color = theme.text,
}) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <rect
      x="6"
      y="6"
      width="108"
      height="108"
      rx="28"
      stroke={color}
      strokeWidth="9"
    />
    <path
      d="M34 86V40l26 32 26-32v46"
      stroke={color}
      strokeWidth="11"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const Check: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = theme.green,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 12.5l5 5L20 6"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Cross: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = theme.red,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export const Spinner: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = theme.textDim,
}) => {
  const frame = useCurrentFrame();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ transform: `rotate(${frame * 18}deg)` }}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={theme.stroke}
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M12 3a9 9 0 0 1 9 9"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};
