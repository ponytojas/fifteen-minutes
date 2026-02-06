import type { CityBoundary } from "@/types";

export type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  boundingbox: [string, string, string, string]; // [south, north, west, east]
  type: string;
  osm_id: number;
  geojson?: {
    type: string;
    coordinates: unknown;
  };
};

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

function toLonLat(value: unknown): [number, number] | null {
  if (!Array.isArray(value) || value.length < 2) return null;
  const lon = Number(value[0]);
  const lat = Number(value[1]);
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
  return [lon, lat];
}

function toRing(value: unknown): [number, number][] | null {
  if (!Array.isArray(value) || value.length < 4) return null;
  const ring: [number, number][] = [];
  for (const point of value) {
    const lonLat = toLonLat(point);
    if (!lonLat) return null;
    ring.push(lonLat);
  }
  return ring;
}

function toPolygonCoordinates(value: unknown): [number, number][][] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const polygon: [number, number][][] = [];
  for (const ringValue of value) {
    const ring = toRing(ringValue);
    if (!ring) return null;
    polygon.push(ring);
  }
  return polygon;
}

function toMultiPolygonCoordinates(
  value: unknown,
): [number, number][][][] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const multiPolygon: [number, number][][][] = [];
  for (const polygonValue of value) {
    const polygon = toPolygonCoordinates(polygonValue);
    if (!polygon) return null;
    multiPolygon.push(polygon);
  }
  return multiPolygon;
}

export function extractCityBoundary(
  result: Pick<NominatimResult, "geojson">,
): CityBoundary | undefined {
  const geometry = result.geojson;
  if (!geometry) return undefined;

  if (geometry.type === "Polygon") {
    const coordinates = toPolygonCoordinates(geometry.coordinates);
    return coordinates ? { type: "Polygon", coordinates } : undefined;
  }

  if (geometry.type === "MultiPolygon") {
    const coordinates = toMultiPolygonCoordinates(geometry.coordinates);
    return coordinates ? { type: "MultiPolygon", coordinates } : undefined;
  }

  return undefined;
}

export async function searchCities(
  query: string,
): Promise<NominatimResult[]> {
  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit: "8",
    featuretype: "city",
    addressdetails: "1",
    polygon_geojson: "1",
  });

  const res = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
    headers: { "User-Agent": "FifteenMinuteAtlas/1.0" },
  });

  if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);
  return res.json() as Promise<NominatimResult[]>;
}
