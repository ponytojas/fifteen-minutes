import type { Config } from "../types";

export type RecomputePath =
  | "weights-only"     // Only top-level/category weights changed
  | "time-window"      // dayType or time window changed
  | "amenity-radius"   // amenityBudgetMin changed
  | "transit-radius"   // maxWalkToStopMin, walkSpeed, or streetFactor changed
  | "full";            // Multiple types of changes or structural change

/**
 * Determine the minimal recompute path needed given old and new configs.
 */
export function getRecomputePath(prev: Config, next: Config): RecomputePath {
  const spatialChanged =
    prev.walkSpeedMetersPerMin !== next.walkSpeedMetersPerMin ||
    prev.streetFactor !== next.streetFactor;

  const amenityRadiusChanged =
    prev.amenityBudgetMin !== next.amenityBudgetMin;

  const transitRadiusChanged =
    prev.maxWalkToStopMin !== next.maxWalkToStopMin;

  const timeChanged =
    prev.dayType !== next.dayType ||
    prev.timeWindow.startHour !== next.timeWindow.startHour ||
    prev.timeWindow.endHour !== next.timeWindow.endHour;

  const capsChanged =
    prev.freqCap !== next.freqCap ||
    prev.divCap !== next.divCap;

  const weightsChanged =
    prev.wAmenities !== next.wAmenities ||
    prev.wTransit !== next.wTransit ||
    prev.wFreq !== next.wFreq ||
    prev.wDiv !== next.wDiv ||
    !categoryWeightsEqual(prev.categoryWeights, next.categoryWeights) ||
    !amenityEnabledEqual(prev.amenityEnabled, next.amenityEnabled);

  // If spatial constants changed, everything must be recomputed
  if (spatialChanged) return "full";

  // If both amenity and transit radii changed, full recompute
  if (amenityRadiusChanged && transitRadiusChanged) return "full";

  if (transitRadiusChanged) return "transit-radius";
  if (amenityRadiusChanged) return "amenity-radius";

  // Time window change affects only transit aggregates
  if (timeChanged || capsChanged) {
    if (weightsChanged) return "time-window"; // time + weights => still time-window path handles both
    return "time-window";
  }

  if (weightsChanged) return "weights-only";

  return "weights-only"; // No meaningful change
}

function categoryWeightsEqual(
  a: Record<string, number>,
  b: Record<string, number>,
): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => a[k] === b[k]);
}

function amenityEnabledEqual(
  a: Record<string, boolean>,
  b: Record<string, boolean>,
): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => a[k] === b[k]);
}
