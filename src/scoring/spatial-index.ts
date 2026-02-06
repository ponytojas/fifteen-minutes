import KDBush from "kdbush";
import * as geokdbush from "geokdbush";

export type IndexedPoint = {
  idx: number;
  lon: number;
  lat: number;
};

export class SpatialIndex {
  private index: KDBush;
  private points: IndexedPoint[];

  constructor(points: IndexedPoint[]) {
    this.points = points;
    this.index = new KDBush(points.length);
    for (const p of points) {
      this.index.add(p.lon, p.lat);
    }
    this.index.finish();
  }

  /**
   * Find the nearest point to (lon, lat).
   * Returns the point and its index, or null if no points exist.
   */
  nearest(
    lon: number,
    lat: number,
    maxResults = 1,
    maxDistance = Infinity,
  ): IndexedPoint[] {
    const results = geokdbush.around(
      this.index,
      lon,
      lat,
      maxResults,
      maxDistance,
    );
    return results.map((id: number) => this.points[id]);
  }

  /**
   * Find all points within a radius (in km) of (lon, lat).
   */
  within(lon: number, lat: number, radiusKm: number): IndexedPoint[] {
    const results = geokdbush.around(
      this.index,
      lon,
      lat,
      Infinity,
      radiusKm,
    );
    return results.map((id: number) => this.points[id]);
  }
}

/**
 * Build per-category spatial indexes from a PoiPack.
 */
export function buildCategoryIndexes(
  categories: string[],
  pois: Array<{ lat: number; lon: number; cat: number; name?: string }>,
): Map<string, { index: SpatialIndex; pois: typeof pois }> {
  const result = new Map<string, { index: SpatialIndex; pois: typeof pois }>();

  for (let catIdx = 0; catIdx < categories.length; catIdx++) {
    const catName = categories[catIdx];
    const catPois = pois.filter((p) => p.cat === catIdx);
    const indexed: IndexedPoint[] = catPois.map((p, i) => ({
      idx: i,
      lon: p.lon,
      lat: p.lat,
    }));
    result.set(catName, {
      index: new SpatialIndex(indexed),
      pois: catPois,
    });
  }

  return result;
}

/**
 * Build a spatial index for transit stops.
 */
export function buildStopIndex(
  stops: Array<{ lat: number; lon: number }>,
): SpatialIndex {
  const indexed: IndexedPoint[] = stops.map((s, i) => ({
    idx: i,
    lon: s.lon,
    lat: s.lat,
  }));
  return new SpatialIndex(indexed);
}
