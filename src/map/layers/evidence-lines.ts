import { LineLayer } from "deck.gl";

type LineData = {
  from: [number, number]; // [lon, lat]
  to: [number, number];   // [lon, lat]
  color: [number, number, number, number];
};

export function createEvidenceLinesLayer(lines: LineData[]) {
  return new LineLayer<LineData>({
    id: "evidence-lines",
    data: lines,
    getSourcePosition: (d) => d.from,
    getTargetPosition: (d) => d.to,
    getColor: (d) => d.color,
    getWidth: 2,
    widthUnits: "pixels",
    opacity: 0.8,
  });
}

export function buildAmenityLines(
  hexCentroid: { lat: number; lon: number },
  poi: { lat: number; lon: number },
  isDark = true,
): LineData[] {
  return [
    {
      from: [hexCentroid.lon, hexCentroid.lat],
      to: [poi.lon, poi.lat],
      color: isDark ? [255, 255, 255, 160] : [40, 40, 40, 180],
    },
  ];
}

export function buildTransitLines(
  hexCentroid: { lat: number; lon: number },
  stops: Array<{ lat: number; lon: number }>,
  isDark = true,
): LineData[] {
  const color: [number, number, number, number] = isDark
    ? [66, 165, 245, 140]
    : [25, 118, 210, 160];

  return stops.map((s) => ({
    from: [hexCentroid.lon, hexCentroid.lat],
    to: [s.lon, s.lat],
    color,
  }));
}
