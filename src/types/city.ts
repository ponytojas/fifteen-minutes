export type CityBoundary =
  | {
      type: "Polygon";
      coordinates: [number, number][][]; // GeoJSON [lon, lat]
    }
  | {
      type: "MultiPolygon";
      coordinates: [number, number][][][]; // GeoJSON [lon, lat]
    };

export type CityMeta = {
  id: string;
  name: string;
  version: string;
  bounds: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
  boundary?: CityBoundary;
  center: [number, number]; // [lon, lat]
  defaultH3Res: number;
};

export type PoiPack = {
  categories: string[];
  pois: Array<{
    lat: number;
    lon: number;
    cat: number; // index into categories[]
    name?: string;
  }>;
};

export type Stop = {
  id: string;
  lat: number;
  lon: number;
  freqWk: number[]; // 24-length: departures per hour, weekday
  freqWe: number[]; // 24-length: departures per hour, weekend
  routesWk: number[]; // 24-length: distinct routes per hour, weekday
  routesWe: number[]; // 24-length: distinct routes per hour, weekend
};

export type StopsPack = {
  stops: Stop[];
};

export type H3Pack = {
  res: number;
  hexes: string[];
};
