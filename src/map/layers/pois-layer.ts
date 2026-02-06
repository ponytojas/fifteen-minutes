import { ScatterplotLayer } from "deck.gl";

export type PoiPoint = {
  lat: number;
  lon: number;
  category: string;
  name?: string;
};

const CATEGORY_COLORS: Record<string, [number, number, number]> = {
  grocery: [76, 175, 80],
  gym: [255, 152, 0],
  park: [129, 199, 132],
  healthcare: [239, 83, 80],
  cafe: [161, 136, 127],
  library: [126, 87, 194],
};

const FALLBACK_COLOR: [number, number, number] = [120, 120, 120];

export function createPoisLayer(
  allPois: PoiPoint[],
  opts: {
    evidencePoi?: PoiPoint | null;
    evidenceFocusMode: boolean;
  },
) {
  const data = !opts.evidenceFocusMode
    ? allPois
    : opts.evidencePoi
      ? [opts.evidencePoi]
      : [];

  return new ScatterplotLayer<PoiPoint>({
    id: "pois",
    data,
    pickable: true,
    getPosition: (d) => [d.lon, d.lat],
    getRadius: opts.evidenceFocusMode ? 80 : 30,
    getFillColor: (d) => {
      const base = CATEGORY_COLORS[d.category] ?? FALLBACK_COLOR;
      return [...base, opts.evidenceFocusMode ? 240 : 140] as [number, number, number, number];
    },
    radiusUnits: "meters",
    radiusMinPixels: opts.evidenceFocusMode ? 8 : 3,
    radiusMaxPixels: opts.evidenceFocusMode ? 16 : 8,
    opacity: opts.evidenceFocusMode ? 1 : 0.5,
    updateTriggers: {
      getRadius: [opts.evidenceFocusMode],
      getFillColor: [opts.evidenceFocusMode],
    },
  });
}
