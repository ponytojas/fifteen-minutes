import type { Config, Stop, TransitEvidence, StopEvidence } from "../types";
import type { SpatialIndex } from "./spatial-index";
import { haversineMeters } from "../lib/haversine";
import { clamp01 } from "../lib/smoothstep";

export type TransitResult = {
  transitTotal: number;
  evidence: TransitEvidence;
};

/**
 * Score transit for a single hex centroid.
 * Returns the transit contribution and full evidence for the explanation panel.
 */
export function scoreTransit(
  centroid: { lat: number; lon: number },
  stopIndex: SpatialIndex,
  stops: Stop[],
  config: Config,
): TransitResult {
  const radiusM =
    (config.maxWalkToStopMin * config.walkSpeedMetersPerMin) / config.streetFactor;
  const radiusKm = radiusM / 1000;

  // Find all stops within radius
  const nearbyPoints = stopIndex.within(centroid.lon, centroid.lat, radiusKm);

  const { startHour, endHour } = config.timeWindow;
  const hours: number[] = [];
  for (let h = startHour; h < endHour; h++) {
    hours.push(h);
  }
  const windowSize = hours.length || 1;

  const consideredStops: StopEvidence[] = [];
  let freqSum = 0;
  let divSum = 0;

  // Histogram: sum departures per hour across all considered stops
  const histMap = new Map<number, number>();
  for (const h of hours) {
    histMap.set(h, 0);
  }

  for (const point of nearbyPoints) {
    const stop = stops[point.idx];
    const freq = config.dayType === "weekday" ? stop.freqWk : stop.freqWe;
    const routes = config.dayType === "weekday" ? stop.routesWk : stop.routesWe;

    // Average departures/hour in window
    let freqTotal = 0;
    let routesTotal = 0;
    for (const h of hours) {
      freqTotal += freq[h];
      routesTotal += routes[h];
      histMap.set(h, (histMap.get(h) ?? 0) + freq[h]);
    }
    const freqPerHour = freqTotal / windowSize;
    const routesMetric = routesTotal / windowSize;

    const distanceM = haversineMeters(
      centroid.lat,
      centroid.lon,
      stop.lat,
      stop.lon,
    );
    const timeMin =
      (distanceM * config.streetFactor) / config.walkSpeedMetersPerMin;

    freqSum += freqPerHour;
    divSum += routesMetric;

    consideredStops.push({
      id: stop.id,
      lat: stop.lat,
      lon: stop.lon,
      freqPerHour,
      routesMetric,
      distanceM,
      timeMin,
    });
  }

  const freqSumCapped = Math.min(freqSum, config.freqCap);
  const freqScore = clamp01(freqSumCapped / config.freqCap);
  const divScore = clamp01(Math.log1p(divSum) / Math.log1p(config.divCap));

  const contribution = config.wFreq * freqScore + config.wDiv * divScore;
  const transitTotal =
    config.wFreq + config.wDiv > 0
      ? contribution / (config.wFreq + config.wDiv)
      : 0;

  const histogram = hours.map((h) => ({
    hour: h,
    departures: histMap.get(h) ?? 0,
  }));

  return {
    transitTotal,
    evidence: {
      enabled: true,
      maxWalkToStopMin: config.maxWalkToStopMin,
      consideredStops,
      aggregates: {
        stopsCount: consideredStops.length,
        freqSum,
        freqSumCapped,
        freqScore,
        divSum,
        divScore,
      },
      weights: { wFreq: config.wFreq, wDiv: config.wDiv },
      contribution,
      histogram,
    },
  };
}
