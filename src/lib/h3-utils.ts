import { polygonToCells, cellToLatLng, getResolution } from "h3-js";
import type { CityBoundary } from "../types/city";

function generateHexesFromBounds(
  bounds: [number, number, number, number],
  res: number,
): string[] {
  const [minLon, minLat, maxLon, maxLat] = bounds;

  // Default H3 coordinate order is [lat, lon].
  const bboxLoop: Array<[number, number]> = [
    [minLat, minLon],
    [minLat, maxLon],
    [maxLat, maxLon],
    [maxLat, minLon],
    [minLat, minLon],
  ];

  return polygonToCells(bboxLoop, res);
}

function generateHexesFromBoundary(boundary: CityBoundary, res: number): string[] {
  if (boundary.type === "Polygon") {
    return polygonToCells(boundary.coordinates as number[][][], res, true);
  }

  const out = new Set<string>();
  for (const polygon of boundary.coordinates) {
    const cells = polygonToCells(polygon as number[][][], res, true);
    for (const cell of cells) {
      out.add(cell);
    }
  }
  return [...out];
}

/**
 * Generate H3 hex IDs for a city at a given resolution.
 * Uses city boundary when available, with bounds as fallback.
 */
export function generateHexes(
  bounds: [number, number, number, number], // [minLon, minLat, maxLon, maxLat]
  res: number,
  boundary?: CityBoundary,
): string[] {
  if (boundary) {
    try {
      const hexes = generateHexesFromBoundary(boundary, res);
      if (hexes.length > 0) return hexes;
    } catch {
      // Fall through to bounds fill if boundary geometry is invalid.
    }
  }

  return generateHexesFromBounds(bounds, res);
}

/**
 * Get the centroid [lat, lon] of an H3 cell.
 */
export function hexCentroid(h3: string): { lat: number; lon: number } {
  const [lat, lon] = cellToLatLng(h3);
  return { lat, lon };
}

export function hexResolution(h3: string): number {
  return getResolution(h3);
}
