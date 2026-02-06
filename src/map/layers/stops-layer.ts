import { ScatterplotLayer } from "deck.gl";
import type { StopEvidence } from "../../types";

export type StopPoint = {
  lat: number;
  lon: number;
  freqPerHour: number;
  id: string;
};

export function createStopsLayer(
  allStops: StopPoint[],
  opts: {
    evidenceStops?: StopPoint[] | null;
    evidenceFocusMode: boolean;
    isDark?: boolean;
  },
) {
  const data = opts.evidenceFocusMode && opts.evidenceStops
    ? opts.evidenceStops
    : allStops;

  const isDark = opts.isDark ?? true;

  // In light mode use a darker blue for contrast against the light basemap
  const baseColor: [number, number, number] = isDark
    ? [66, 165, 245]
    : [25, 118, 210];

  return new ScatterplotLayer<StopPoint>({
    id: "stops",
    data,
    pickable: true,
    getPosition: (d) => [d.lon, d.lat],
    getRadius: (d) =>
      opts.evidenceFocusMode ? 60 : Math.max(20, d.freqPerHour * 4),
    getFillColor: [
      ...baseColor,
      opts.evidenceFocusMode ? 220 : 120,
    ] as [number, number, number, number],
    radiusUnits: "meters",
    radiusMinPixels: opts.evidenceFocusMode ? 6 : 2,
    radiusMaxPixels: opts.evidenceFocusMode ? 14 : 8,
    opacity: opts.evidenceFocusMode ? 1 : 0.6,
    updateTriggers: {
      getRadius: [opts.evidenceFocusMode],
      getFillColor: [opts.evidenceFocusMode, isDark],
    },
  });
}

export function stopsFromEvidence(stops: StopEvidence[]): StopPoint[] {
  return stops.map((s) => ({
    lat: s.lat,
    lon: s.lon,
    freqPerHour: s.freqPerHour,
    id: s.id,
  }));
}
