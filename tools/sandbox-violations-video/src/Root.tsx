import React from "react";
import { Composition } from "remotion";
import { VIDEO } from "./theme";
import { V1Terminal } from "./variations/V1Terminal";
import { V2Dashboard } from "./variations/V2Dashboard";
import { V3CachePoison } from "./variations/V3CachePoison";
import { V4Kinetic } from "./variations/V4Kinetic";
import { V5Pipeline } from "./variations/V5Pipeline";

const common = {
  width: VIDEO.width,
  height: VIDEO.height,
  fps: VIDEO.fps,
  durationInFrames: VIDEO.durationInFrames,
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="V1-Terminal" component={V1Terminal} {...common} />
    <Composition id="V2-Dashboard" component={V2Dashboard} {...common} />
    <Composition id="V3-CachePoison" component={V3CachePoison} {...common} />
    <Composition id="V4-Kinetic" component={V4Kinetic} {...common} />
    <Composition id="V5-Pipeline" component={V5Pipeline} {...common} />
  </>
);
