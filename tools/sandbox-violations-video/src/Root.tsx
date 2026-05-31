import React from "react";
import { Composition } from "remotion";
import { VIDEO } from "./theme";
import { V1Terminal } from "./variations/V1Terminal";
import { V2Dashboard } from "./variations/V2Dashboard";
import { V3CachePoison } from "./variations/V3CachePoison";
import { V4Kinetic } from "./variations/V4Kinetic";
import { V5Pipeline } from "./variations/V5Pipeline";
import { Movie, totalFrames } from "./combined/Movie";
import { VARIANTS } from "./combined/variants";
import { ProductMovie, ptotal } from "./product/ProductMovie";
import { PRODUCT_VARIANTS } from "./product/productVariants";

const common = {
  width: VIDEO.width,
  height: VIDEO.height,
  fps: VIDEO.fps,
  durationInFrames: VIDEO.durationInFrames,
};

export const RemotionRoot: React.FC = () => (
  <>
    {/* First-round single-concept explainers */}
    <Composition id="V1-Terminal" component={V1Terminal} {...common} />
    <Composition id="V2-Dashboard" component={V2Dashboard} {...common} />
    <Composition id="V3-CachePoison" component={V3CachePoison} {...common} />
    <Composition id="V4-Kinetic" component={V4Kinetic} {...common} />
    <Composition id="V5-Pipeline" component={V5Pipeline} {...common} />

    {/* Combined-arc variants: run → [cache] → dashboard → fix-with-AI */}
    {VARIANTS.map((v) => (
      <Composition
        key={v.id}
        id={v.id}
        component={Movie as React.FC<Record<string, unknown>>}
        defaultProps={{ v }}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={totalFrames(v)}
      />
    ))}

    {/* Product-demo variants (20s): per-task cache, skull-free, fix-with-AI */}
    {PRODUCT_VARIANTS.map((v) => (
      <Composition
        key={v.id}
        id={v.id}
        component={ProductMovie as React.FC<Record<string, unknown>>}
        defaultProps={{ v }}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={ptotal(v)}
      />
    ))}
  </>
);
