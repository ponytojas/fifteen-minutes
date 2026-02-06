import type { WorkerIn, WorkerOut, Config, HexScore, CityMeta, PoiPack, StopsPack } from "../types";
import { loadCityMeta, loadPois, loadStops, loadH3 } from "../data/city-pack-loader";
import { generateHexes, hexCentroid } from "../lib/h3-utils";
import { buildCategoryIndexes, buildStopIndex } from "../scoring/spatial-index";
import type { SpatialIndex } from "../scoring/spatial-index";
import { scoreAmenities } from "../scoring/amenity";
import type { AmenityResult } from "../scoring/amenity";
import { scoreTransit } from "../scoring/transit";
import type { TransitResult } from "../scoring/transit";
import { getRecomputePath } from "../scoring/config-diff";

// --- Worker state ---
let cityMeta: CityMeta | null = null;
let pois: PoiPack | null = null;
let stops: StopsPack | null = null;
let hexes: string[] = [];
let currentConfig: Config | null = null;
let scores: HexScore[] = [];

// Indexes
let categoryIndexes: Map<string, { index: SpatialIndex; pois: PoiPack["pois"] }> | null = null;
let stopIndex: SpatialIndex | null = null;

// Caches
const amenityCache = new Map<string, AmenityResult>();
const transitCache = new Map<string, TransitResult>();

function post(msg: WorkerOut) {
  self.postMessage(msg);
}

function buildIndexes() {
  if (!pois || !stops) return;
  categoryIndexes = buildCategoryIndexes(pois.categories, pois.pois);
  stopIndex = buildStopIndex(stops.stops);
}

function buildScoreEntry(h3: string, amenity: AmenityResult, transit: TransitResult, cfg: Config): HexScore {
  const score =
    cfg.wAmenities * amenity.amenityTotal +
    cfg.wTransit * transit.transitTotal;

  const amenityReasons = amenity.evidence
    .filter((e) => e.enabled && e.nearest.lat !== 0)
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 2)
    .map((e) => `${e.category} ${Math.round(e.timeMin)}m`);

  const transitReason =
    transit.evidence.aggregates.stopsCount > 0
      ? `${Math.round(transit.evidence.aggregates.freqSum)} dep/h`
      : null;

  const reasons = [...amenityReasons];
  if (transitReason) reasons.push(transitReason);

  return { h3, score, reasons };
}

// --- Full recompute ---

function computeAllScores() {
  if (!currentConfig || !categoryIndexes || !stopIndex || !stops || hexes.length === 0) return;

  amenityCache.clear();
  transitCache.clear();
  const cfg = currentConfig;

  scores = hexes.map((h3) => {
    const centroid = hexCentroid(h3);
    const amenity = scoreAmenities(centroid, categoryIndexes!, cfg);
    amenityCache.set(h3, amenity);
    const transit = scoreTransit(centroid, stopIndex!, stops!.stops, cfg);
    transitCache.set(h3, transit);
    return buildScoreEntry(h3, amenity, transit, cfg);
  });

  post({ type: "SCORES_UPDATED", scores });
}

// --- Weights-only recompute: reuse cached normalized values ---

function recomputeWeightsOnly(cfg: Config) {
  if (hexes.length === 0) return;

  scores = hexes.map((h3) => {
    const amenity = amenityCache.get(h3);
    const transit = transitCache.get(h3);
    if (!amenity || !transit) {
      // Fallback: full compute for this hex
      const centroid = hexCentroid(h3);
      const a = scoreAmenities(centroid, categoryIndexes!, cfg);
      amenityCache.set(h3, a);
      const t = scoreTransit(centroid, stopIndex!, stops!.stops, cfg);
      transitCache.set(h3, t);
      return buildScoreEntry(h3, a, t, cfg);
    }

    // Recompute amenity total with new category weights
    let weightedSum = 0;
    let weightSum = 0;
    const updatedEvidence = amenity.evidence.map((e) => {
      const newWeight = cfg.categoryWeights[e.category] ?? 0;
      const enabled = (cfg.amenityEnabled[e.category] ?? true) && newWeight > 0;
      const contribution = enabled ? newWeight * e.normalized : 0;
      if (enabled) {
        weightedSum += contribution;
        weightSum += newWeight;
      }
      return { ...e, weight: newWeight, enabled, contribution };
    });

    const newAmenityTotal = weightSum > 0 ? weightedSum / weightSum : 0;
    const updatedAmenity: AmenityResult = {
      amenityTotal: newAmenityTotal,
      evidence: updatedEvidence,
    };
    amenityCache.set(h3, updatedAmenity);

    // Recompute transit contribution with new sub-weights
    const { freqScore, divScore } = transit.evidence.aggregates;
    const newContrib = cfg.wFreq * freqScore + cfg.wDiv * divScore;
    const newTransitTotal =
      cfg.wFreq + cfg.wDiv > 0 ? newContrib / (cfg.wFreq + cfg.wDiv) : 0;
    const updatedTransit: TransitResult = {
      transitTotal: newTransitTotal,
      evidence: {
        ...transit.evidence,
        weights: { wFreq: cfg.wFreq, wDiv: cfg.wDiv },
        contribution: newContrib,
      },
    };
    transitCache.set(h3, updatedTransit);

    return buildScoreEntry(h3, updatedAmenity, updatedTransit, cfg);
  });

  post({ type: "SCORES_UPDATED", scores });
}

// --- Time window recompute: reuse amenity cache, recompute transit ---

function recomputeTimeWindow(cfg: Config) {
  if (!stopIndex || !stops || hexes.length === 0) return;

  transitCache.clear();

  scores = hexes.map((h3) => {
    const centroid = hexCentroid(h3);

    let amenity = amenityCache.get(h3);
    if (!amenity) {
      amenity = scoreAmenities(centroid, categoryIndexes!, cfg);
      amenityCache.set(h3, amenity);
    }

    const transit = scoreTransit(centroid, stopIndex!, stops!.stops, cfg);
    transitCache.set(h3, transit);

    return buildScoreEntry(h3, amenity, transit, cfg);
  });

  post({ type: "SCORES_UPDATED", scores });
}

// --- Amenity radius recompute: recompute amenity, reuse transit ---

function recomputeAmenityRadius(cfg: Config) {
  if (!categoryIndexes || hexes.length === 0) return;

  amenityCache.clear();

  scores = hexes.map((h3) => {
    const centroid = hexCentroid(h3);

    const amenity = scoreAmenities(centroid, categoryIndexes!, cfg);
    amenityCache.set(h3, amenity);

    let transit = transitCache.get(h3);
    if (!transit) {
      transit = scoreTransit(centroid, stopIndex!, stops!.stops, cfg);
      transitCache.set(h3, transit);
    }

    return buildScoreEntry(h3, amenity, transit, cfg);
  });

  post({ type: "SCORES_UPDATED", scores });
}

// --- Handlers ---

async function handleLoadCityPack(cityId: string) {
  try {
    const [meta, poiPack, stopsPack, h3Pack] = await Promise.all([
      loadCityMeta(cityId),
      loadPois(cityId),
      loadStops(cityId),
      loadH3(cityId),
    ]);

    cityMeta = meta;
    pois = poiPack;
    stops = stopsPack;

    if (h3Pack) {
      hexes = h3Pack.hexes;
    } else {
      hexes = generateHexes(meta.bounds, meta.defaultH3Res, meta.boundary);
    }

    buildIndexes();
    post({ type: "CITY_LOADED", city: meta });

    if (currentConfig) {
      computeAllScores();
    } else {
      scores = hexes.map((h3) => ({ h3, score: 0.5 }));
      post({ type: "SCORES_UPDATED", scores });
    }
  } catch (e) {
    post({
      type: "ERROR",
      message: e instanceof Error ? e.message : "Unknown error loading city pack",
    });
  }
}

function handleSetConfig(config: Config) {
  const prevConfig = currentConfig;
  currentConfig = config;

  if (!cityMeta || !pois || !stops || hexes.length === 0) return;
  if (!categoryIndexes || !stopIndex) return;

  if (!prevConfig) {
    computeAllScores();
    return;
  }

  const path = getRecomputePath(prevConfig, config);

  switch (path) {
    case "weights-only":
      recomputeWeightsOnly(config);
      break;
    case "time-window":
      recomputeTimeWindow(config);
      break;
    case "amenity-radius":
      recomputeAmenityRadius(config);
      break;
    case "transit-radius":
    case "full":
    default:
      computeAllScores();
      break;
  }
}

function handleSelectHex(h3: string) {
  if (!currentConfig || !categoryIndexes || !stopIndex || !stops) return;

  const centroid = hexCentroid(h3);
  const cfg = currentConfig;

  let amenity = amenityCache.get(h3);
  if (!amenity) {
    amenity = scoreAmenities(centroid, categoryIndexes, cfg);
    amenityCache.set(h3, amenity);
  }

  let transit = transitCache.get(h3);
  if (!transit) {
    transit = scoreTransit(centroid, stopIndex, stops.stops, cfg);
    transitCache.set(h3, transit);
  }

  const totalScore =
    cfg.wAmenities * amenity.amenityTotal +
    cfg.wTransit * transit.transitTotal;

  const formula = [
    `${cfg.wAmenities.toFixed(2)} * ${amenity.amenityTotal.toFixed(2)} (amenities)`,
    `+ ${cfg.wTransit.toFixed(2)} * ${transit.transitTotal.toFixed(2)} (transit)`,
    `= ${totalScore.toFixed(2)}`,
  ].join(" ");

  // Confidence badge
  const allHavePoi = amenity.evidence
    .filter((e) => e.enabled)
    .every((e) => e.distanceM < 5000);
  const stopsCount = transit.evidence.aggregates.stopsCount;
  const allNearby = amenity.evidence
    .filter((e) => e.enabled)
    .every((e) => e.timeMin <= cfg.amenityBudgetMin);

  let confidence: "high" | "medium" | "low";
  if (!allHavePoi || stopsCount < 3) {
    confidence = "low";
  } else if (stopsCount >= 8 && allNearby) {
    confidence = "high";
  } else {
    confidence = "medium";
  }

  post({
    type: "HEX_EXPLANATION",
    explanation: {
      h3,
      centroid,
      dayType: cfg.dayType,
      timeWindow: cfg.timeWindow,
      total: { score: totalScore, confidence, formula },
      amenities: amenity.evidence,
      transit: transit.evidence,
    },
  });
}

function handleGetTopN(n: number) {
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const top = sorted.slice(0, n).map((s) => ({
    h3: s.h3,
    score: s.score,
    reasons: s.reasons ?? [],
  }));
  post({ type: "TOP_N", items: top });
}

function handleLoadRawData(
  meta: CityMeta,
  poiPack: PoiPack,
  stopsPack: StopsPack,
  h3Res: number,
) {
  cityMeta = meta;
  pois = poiPack;
  stops = stopsPack;
  hexes = generateHexes(meta.bounds, h3Res, meta.boundary);

  buildIndexes();
  post({ type: "CITY_LOADED", city: meta });

  amenityCache.clear();
  transitCache.clear();

  if (currentConfig) {
    computeAllScores();
  } else {
    scores = hexes.map((h3) => ({ h3, score: 0.5 }));
    post({ type: "SCORES_UPDATED", scores });
  }
}

function handleSetH3Resolution(res: number) {
  if (!cityMeta) return;
  hexes = generateHexes(cityMeta.bounds, res, cityMeta.boundary);
  amenityCache.clear();
  transitCache.clear();
  if (currentConfig) {
    computeAllScores();
  } else {
    scores = hexes.map((h3) => ({ h3, score: 0.5 }));
    post({ type: "SCORES_UPDATED", scores });
  }
}

// --- Message dispatcher ---

self.onmessage = (e: MessageEvent<WorkerIn>) => {
  const msg = e.data;
  switch (msg.type) {
    case "LOAD_CITY_PACK":
      handleLoadCityPack(msg.cityId);
      break;
    case "LOAD_RAW_DATA":
      handleLoadRawData(msg.city, msg.pois, msg.stops, msg.h3Res);
      break;
    case "SET_CONFIG":
      handleSetConfig(msg.config);
      break;
    case "SET_H3_RESOLUTION":
      handleSetH3Resolution(msg.res);
      break;
    case "SELECT_HEX":
      handleSelectHex(msg.h3);
      break;
    case "GET_TOP_N":
      handleGetTopN(msg.n);
      break;
  }
};
