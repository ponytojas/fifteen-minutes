import type { OsmElement } from "./overpass";
import type { CityMeta, CityBoundary, PoiPack, StopsPack, Stop } from "@/types";

const CATEGORIES = [
  "grocery",
  "gym",
  "park",
  "healthcare",
  "cafe",
  "library",
] as const;

function categorizeElement(el: OsmElement): number | null {
  const tags = el.tags ?? {};

  // grocery
  if (
    tags.shop === "supermarket" ||
    tags.shop === "grocery" ||
    tags.shop === "convenience"
  ) {
    return 0;
  }
  // gym
  if (tags.leisure === "fitness_centre") {
    return 1;
  }
  // park
  if (tags.leisure === "park") {
    return 2;
  }
  // healthcare
  if (
    tags.amenity === "pharmacy" ||
    tags.amenity === "hospital" ||
    tags.amenity === "clinic" ||
    tags.amenity === "doctors"
  ) {
    return 3;
  }
  // cafe
  if (tags.amenity === "cafe") {
    return 4;
  }
  // library
  if (tags.amenity === "library") {
    return 5;
  }

  return null;
}

function isTransitStop(el: OsmElement): boolean {
  const tags = el.tags ?? {};
  return (
    tags.highway === "bus_stop" ||
    tags.railway === "tram_stop" ||
    tags.railway === "station" ||
    tags.railway === "halt" ||
    tags.station === "subway" ||
    (tags.public_transport === "stop_position" && tags.bus === "yes")
  );
}

function getTransitType(
  el: OsmElement,
): "subway" | "rail" | "tram" | "bus" {
  const tags = el.tags ?? {};
  if (tags.station === "subway" || tags.railway === "subway") return "subway";
  if (tags.railway === "station" || tags.railway === "halt") return "rail";
  if (tags.railway === "tram_stop") return "tram";
  return "bus";
}

// Synthetic departures per hour by stop type
const SYNTHETIC_FREQ: Record<string, number> = {
  subway: 12,
  rail: 3,
  tram: 8,
  bus: 4,
};

// Synthetic route diversity per hour
const SYNTHETIC_ROUTES: Record<string, number> = {
  subway: 3,
  rail: 2,
  tram: 2,
  bus: 1,
};

function getCoords(el: OsmElement): { lat: number; lon: number } | null {
  if (el.lat != null && el.lon != null) {
    return { lat: el.lat, lon: el.lon };
  }
  if (el.center) {
    return { lat: el.center.lat, lon: el.center.lon };
  }
  return null;
}

export function osmToPois(elements: OsmElement[]): PoiPack {
  const pois: PoiPack["pois"] = [];

  for (const el of elements) {
    const cat = categorizeElement(el);
    if (cat === null) continue;

    const coords = getCoords(el);
    if (!coords) continue;

    pois.push({
      lat: coords.lat,
      lon: coords.lon,
      cat,
      name: el.tags?.name,
    });
  }

  return {
    categories: [...CATEGORIES],
    pois,
  };
}

export function osmToStops(elements: OsmElement[]): StopsPack {
  const stops: Stop[] = [];
  const seen = new Set<string>();

  for (const el of elements) {
    if (!isTransitStop(el)) continue;

    const coords = getCoords(el);
    if (!coords) continue;

    // Deduplicate by rounded coords (within ~10m)
    const key = `${coords.lat.toFixed(4)},${coords.lon.toFixed(4)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const type = getTransitType(el);
    const baseFreq = SYNTHETIC_FREQ[type];
    const baseRoutes = SYNTHETIC_ROUTES[type];

    // Create hourly arrays with time-of-day variation
    const freqWk: number[] = [];
    const freqWe: number[] = [];
    const routesWk: number[] = [];
    const routesWe: number[] = [];

    for (let h = 0; h < 24; h++) {
      // Apply time-of-day factor
      let factor: number;
      if (h >= 7 && h <= 9) factor = 1.5; // Morning peak
      else if (h >= 16 && h <= 19) factor = 1.4; // Evening peak
      else if (h >= 10 && h <= 15) factor = 1.0; // Midday
      else if (h >= 20 && h <= 22) factor = 0.6; // Evening
      else if (h >= 5 && h <= 6) factor = 0.5; // Early morning
      else factor = 0.2; // Night

      freqWk.push(Math.round(baseFreq * factor * 10) / 10);
      freqWe.push(Math.round(baseFreq * factor * 0.7 * 10) / 10); // Weekend ~70% of weekday
      routesWk.push(Math.round(baseRoutes * factor * 10) / 10);
      routesWe.push(Math.round(baseRoutes * factor * 0.7 * 10) / 10);
    }

    stops.push({
      id: el.tags?.name || `stop-${el.id}`,
      lat: coords.lat,
      lon: coords.lon,
      freqWk,
      freqWe,
      routesWk,
      routesWe,
    });
  }

  return { stops };
}

export function buildCityMeta(
  name: string,
  bounds: [number, number, number, number],
  center: [number, number],
  boundary?: CityBoundary,
): CityMeta {
  return {
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    version: new Date().toISOString().slice(0, 10),
    bounds,
    boundary,
    center,
    defaultH3Res: 9,
  };
}
