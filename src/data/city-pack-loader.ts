import type { CityMeta, PoiPack, StopsPack, H3Pack } from "../types";
import {
  CityMetaSchema,
  PoiPackSchema,
  StopsPackSchema,
  H3PackSchema,
} from "./schemas";

async function fetchJson<T>(url: string, parse: (data: unknown) => T): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const json: unknown = await res.json();
  return parse(json);
}

export async function loadCityMeta(cityId: string): Promise<CityMeta> {
  return fetchJson(`/cities/${cityId}/city.json`, (d) =>
    CityMetaSchema.parse(d),
  );
}

export async function loadPois(cityId: string): Promise<PoiPack> {
  return fetchJson(`/cities/${cityId}/pois.json`, (d) =>
    PoiPackSchema.parse(d),
  );
}

export async function loadStops(cityId: string): Promise<StopsPack> {
  return fetchJson(`/cities/${cityId}/stops.json`, (d) =>
    StopsPackSchema.parse(d),
  );
}

export async function loadH3(cityId: string): Promise<H3Pack | null> {
  try {
    return await fetchJson(`/cities/${cityId}/h3.json`, (d) =>
      H3PackSchema.parse(d),
    );
  } catch {
    return null;
  }
}
