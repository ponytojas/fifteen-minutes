import { H3HexagonLayer } from "deck.gl";
import type { HexScore } from "../../types";

const COLOR_RAMP: [number, number, number, number][] = [
  [220, 36, 48, 180],   // 0.0 — red
  [245, 130, 32, 180],  // 0.25 — orange
  [255, 210, 63, 180],  // 0.5 — yellow
  [102, 194, 114, 180], // 0.75 — green
  [34, 139, 104, 180],  // 1.0 — dark green
];

const COLOR_RAMP_LIGHT: [number, number, number, number][] = [
  [220, 36, 48, 160],   // 0.0 — red
  [230, 120, 30, 160],  // 0.25 — orange
  [220, 180, 40, 160],  // 0.5 — yellow-gold
  [80, 170, 90, 160],   // 0.75 — green
  [20, 120, 85, 160],   // 1.0 — dark green
];

function scoreToColor(
  score: number,
  isDark: boolean,
): [number, number, number, number] {
  const ramp = isDark ? COLOR_RAMP : COLOR_RAMP_LIGHT;
  const t = Math.max(0, Math.min(1, score));
  const idx = t * (ramp.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, ramp.length - 1);
  const frac = idx - lo;

  return [
    Math.round(ramp[lo][0] + (ramp[hi][0] - ramp[lo][0]) * frac),
    Math.round(ramp[lo][1] + (ramp[hi][1] - ramp[lo][1]) * frac),
    Math.round(ramp[lo][2] + (ramp[hi][2] - ramp[lo][2]) * frac),
    Math.round(ramp[lo][3] + (ramp[hi][3] - ramp[lo][3]) * frac),
  ];
}

export function createScoreSurfaceLayer(
  data: HexScore[],
  opts: {
    opacity?: number;
    selectedHex?: string | null;
    isDark?: boolean;
  } = {},
) {
  const isDark = opts.isDark ?? true;

  return new H3HexagonLayer({
    id: "score-surface",
    data,
    pickable: true,
    filled: true,
    extruded: false,
    getHexagon: (d: HexScore) => d.h3,
    getFillColor: (d: HexScore) => scoreToColor(d.score, isDark),
    getLineColor: (d: HexScore) =>
      d.h3 === opts.selectedHex
        ? isDark
          ? [255, 255, 255, 255]
          : [0, 0, 0, 255]
        : isDark
          ? [0, 0, 0, 40]
          : [100, 100, 100, 40],
    getLineWidth: (d: HexScore) => (d.h3 === opts.selectedHex ? 3 : 1),
    lineWidthUnits: "pixels",
    opacity: opts.opacity ?? 0.8,
    updateTriggers: {
      getFillColor: [data.length, isDark],
      getLineColor: [opts.selectedHex, isDark],
      getLineWidth: [opts.selectedHex],
    },
  });
}
