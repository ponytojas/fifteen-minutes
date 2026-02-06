import { H3HexagonLayer } from "deck.gl";

export function createSelectionHighlightLayer(
  selectedHex: string | null,
  isDark = true,
) {
  if (!selectedHex) return null;

  return new H3HexagonLayer({
    id: "selection-highlight",
    data: [{ h3: selectedHex }],
    getHexagon: (d: { h3: string }) => d.h3,
    filled: false,
    stroked: true,
    getLineColor: isDark ? [255, 255, 255, 255] : [30, 30, 30, 255],
    getLineWidth: 3,
    lineWidthUnits: "pixels",
    pickable: false,
    updateTriggers: {
      getLineColor: [isDark],
    },
  });
}
