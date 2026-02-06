import type { Config, AmenityEvidence } from "../types";
import type { SpatialIndex } from "./spatial-index";
import { haversineMeters } from "../lib/haversine";
import { clamp01, smoothstep } from "../lib/smoothstep";

type CategoryIndex = {
  index: SpatialIndex;
  pois: Array<{ lat: number; lon: number; cat: number; name?: string }>;
};

export type AmenityResult = {
  amenityTotal: number;
  evidence: AmenityEvidence[];
};

/**
 * Score amenities for a single hex centroid.
 * Returns per-category evidence and the weighted amenity total.
 */
export function scoreAmenities(
  centroid: { lat: number; lon: number },
  categoryIndexes: Map<string, CategoryIndex>,
  config: Config,
): AmenityResult {
  const evidence: AmenityEvidence[] = [];
  let weightedSum = 0;
  let weightSum = 0;

  for (const [category, { index, pois }] of categoryIndexes) {
    const weight = config.categoryWeights[category] ?? 0;
    const isEnabledByUser = config.amenityEnabled[category] ?? true;
    const enabled = isEnabledByUser && weight > 0;

    if (!enabled) {
      evidence.push({
        category,
        enabled: false,
        weight,
        nearest: { lat: 0, lon: 0 },
        distanceM: 0,
        timeMin: 0,
        normalized: 0,
        contribution: 0,
      });
      continue;
    }

    // Find nearest POI (maxDistance 10km in km)
    const nearest = index.nearest(centroid.lon, centroid.lat, 1, 10);

    if (nearest.length === 0) {
      evidence.push({
        category,
        enabled: true,
        weight,
        nearest: { lat: 0, lon: 0 },
        distanceM: Infinity,
        timeMin: Infinity,
        normalized: 0,
        contribution: 0,
      });
      continue;
    }

    const poi = pois[nearest[0].idx];
    const distanceM = haversineMeters(
      centroid.lat,
      centroid.lon,
      poi.lat,
      poi.lon,
    );
    const timeMin =
      (distanceM * config.streetFactor) / config.walkSpeedMetersPerMin;
    const normalized = clamp01(
      1 - smoothstep(5, config.amenityBudgetMin, timeMin),
    );
    const contribution = weight * normalized;

    weightedSum += contribution;
    weightSum += weight;

    evidence.push({
      category,
      enabled: true,
      weight,
      nearest: { name: poi.name, lat: poi.lat, lon: poi.lon },
      distanceM,
      timeMin,
      normalized,
      contribution,
    });
  }

  const amenityTotal = weightSum > 0 ? weightedSum / weightSum : 0;

  return { amenityTotal, evidence };
}
