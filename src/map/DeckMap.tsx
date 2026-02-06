import { useState, useCallback, useMemo } from "react";
import DeckGL from "deck.gl";
import { Map } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useStore } from "../app/store";
import { useTranslation } from "../i18n";
import { useTheme } from "../components/theme-provider";
import { createScoreSurfaceLayer } from "./layers/score-surface";
import {
  createStopsLayer,
  stopsFromEvidence,
  type StopPoint,
} from "./layers/stops-layer";
import { createPoisLayer, type PoiPoint } from "./layers/pois-layer";
import {
  createEvidenceLinesLayer,
  buildAmenityLines,
  buildTransitLines,
} from "./layers/evidence-lines";
import { createSelectionHighlightLayer } from "./layers/selection-highlight";
import { Tooltip } from "../components/Tooltip";
import type { HexScore } from "../types";
import type { PickingInfo, Layer } from "deck.gl";

const MAP_STYLES = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
} as const;

type HoverInfo = (
  | {
      kind: "score";
      x: number;
      y: number;
      score: number;
      reasons?: string[];
    }
  | {
      kind: "poi";
      x: number;
      y: number;
      title: string;
      subtitle?: string;
    }
) | null;

export function DeckMap() {
  const scores = useStore((s) => s.scores);
  const selectedHex = useStore((s) => s.selectedHex);
  const selectHex = useStore((s) => s.selectHex);
  const cityMeta = useStore((s) => s.cityMeta);
  const evidenceFocusMode = useStore((s) => s.evidenceFocusMode);
  const evidenceTarget = useStore((s) => s.evidenceTarget);
  const explanation = useStore((s) => s.explanation);
  const hexLayerVisible = useStore((s) => s.hexLayerVisible);
  const hexLayerOpacity = useStore((s) => s.hexLayerOpacity);
  const poisLayerVisible = useStore((s) => s.poisLayerVisible);
  const persistedCityData = useStore((s) => s.persistedCityData);
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  const cityId = cityMeta?.id ?? null;

  const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);

  const initialViewState = useMemo(
    () => ({
      longitude: cityMeta?.center[0] ?? 13.405,
      latitude: cityMeta?.center[1] ?? 52.52,
      zoom: cityMeta ? 13 : 3,
      pitch: 0,
      bearing: 0,
    }),
    [cityMeta],
  );

  const allCityPois = useMemo(() => {
    if (!persistedCityData || !cityId) return [];
    if (persistedCityData.city.id !== cityId) return [];

    const { categories, pois } = persistedCityData.pois;
    return pois.map((poi) => ({
      lat: poi.lat,
      lon: poi.lon,
      category: categories[poi.cat] ?? "unknown",
      name: poi.name,
    }));
  }, [cityId, persistedCityData]);

  const layers = useMemo(() => {
    const result: Layer[] = [];

    // Score surface
    if (hexLayerVisible && scores.length > 0) {
      result.push(
        createScoreSurfaceLayer(scores, {
          opacity: evidenceFocusMode
            ? Math.min(hexLayerOpacity, 0.25)
            : hexLayerOpacity,
          selectedHex,
          isDark,
        }),
      );
    }

    // Selection highlight
    const highlight = createSelectionHighlightLayer(selectedHex, isDark);
    if (highlight) result.push(highlight);

    // Stops layer
    if (explanation?.transit.consideredStops) {
      const allStops = explanation.transit.consideredStops.map((s) => ({
        lat: s.lat,
        lon: s.lon,
        freqPerHour: s.freqPerHour,
        id: s.id,
      }));

      const evidenceStops =
        evidenceTarget?.type === "transit"
          ? stopsFromEvidence(explanation.transit.consideredStops)
          : null;

      result.push(
        createStopsLayer(allStops, {
          evidenceStops,
          evidenceFocusMode,
          isDark,
        }),
      );
    }

    // POIs layer
    if (poisLayerVisible) {
      const evidencePoi =
        evidenceTarget?.type === "amenity"
          ? (() => {
              const target = evidenceTarget as {
                type: "amenity";
                category: string;
                poi: { lat: number; lon: number };
              };
              return {
                lat: target.poi.lat,
                lon: target.poi.lon,
                category: target.category,
                name: explanation?.amenities.find(
                  (a) => a.category === target.category,
                )?.nearest.name,
              };
            })()
          : null;

      result.push(
        createPoisLayer(allCityPois, {
          evidencePoi,
          evidenceFocusMode,
        }),
      );
    }

    // Evidence lines
    if (evidenceFocusMode && evidenceTarget && explanation) {
      if (evidenceTarget.type === "amenity") {
        const target = evidenceTarget as {
          type: "amenity";
          poi: { lat: number; lon: number };
          hex: { lat: number; lon: number };
        };
        result.push(
          createEvidenceLinesLayer(
            buildAmenityLines(target.hex, target.poi, isDark),
          ),
        );
      } else if (evidenceTarget.type === "transit") {
        const target = evidenceTarget as {
          type: "transit";
          stops: Array<{ lat: number; lon: number }>;
          hex: { lat: number; lon: number };
        };
        result.push(
          createEvidenceLinesLayer(
            buildTransitLines(target.hex, target.stops, isDark),
          ),
        );
      }
    }

    return result;
  }, [
    scores,
    selectedHex,
    evidenceFocusMode,
    evidenceTarget,
    explanation,
    allCityPois,
    isDark,
    hexLayerVisible,
    hexLayerOpacity,
    poisLayerVisible,
  ]);

  const onHover = useCallback((info: PickingInfo<HexScore | PoiPoint | StopPoint>) => {
    if (!info.object || !info.layer?.id) {
      setHoverInfo(null);
      return;
    }

    if (info.layer.id === "score-surface") {
      const scoreObj = info.object as HexScore;
      setHoverInfo({
        kind: "score",
        x: info.x,
        y: info.y,
        score: scoreObj.score,
        reasons: scoreObj.reasons,
      });
      return;
    }

    if (info.layer.id === "pois") {
      const poi = info.object as PoiPoint;
      setHoverInfo({
        kind: "poi",
        x: info.x,
        y: info.y,
        title: poi.name?.trim() ? poi.name : t("tooltip.poi"),
        subtitle: t(`category.${poi.category}`),
      });
      return;
    }

    if (info.layer.id === "stops") {
      const stop = info.object as StopPoint;
      setHoverInfo({
        kind: "poi",
        x: info.x,
        y: info.y,
        title: t("tooltip.stop"),
        subtitle: `${Math.round(stop.freqPerHour)} ${t("unit.depPerHour")}`,
      });
      return;
    }

    setHoverInfo(null);
  }, [t]);

  const onClick = useCallback(
    (info: PickingInfo<HexScore>) => {
      if (info.object && info.layer?.id === "score-surface") {
        selectHex(info.object.h3);
      }
    },
    [selectHex],
  );

  return (
    <div className="relative h-full w-full">
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
        onHover={onHover}
        onClick={onClick}
      >
        <Map mapStyle={MAP_STYLES[resolvedTheme]} />
      </DeckGL>
      {hoverInfo && <Tooltip {...hoverInfo} />}
    </div>
  );
}
