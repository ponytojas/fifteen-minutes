const OVERPASS_API = "https://overpass-api.de/api/interpreter";

export type OsmElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

type OverpassResponse = {
  elements: OsmElement[];
};

export function buildOverpassQuery(
  bounds: [number, number, number, number],
): string {
  const [minLon, minLat, maxLon, maxLat] = bounds;
  const bbox = `${minLat},${minLon},${maxLat},${maxLon}`;

  return `
[out:json][timeout:240];
(
  node["shop"~"supermarket|grocery|convenience"](${bbox});
  node["leisure"="fitness_centre"](${bbox});
  node["leisure"="park"](${bbox});
  way["leisure"="park"](${bbox});
  node["amenity"~"pharmacy|hospital|clinic|doctors"](${bbox});
  node["amenity"="cafe"](${bbox});
  node["amenity"="library"](${bbox});
  node["highway"="bus_stop"](${bbox});
  node["railway"="tram_stop"](${bbox});
  node["railway"="station"](${bbox});
  node["railway"="halt"](${bbox});
  node["station"="subway"](${bbox});
  node["public_transport"="stop_position"]["bus"="yes"](${bbox});
);
out center body;
`.trim();
}

export async function fetchOverpassData(
  bounds: [number, number, number, number],
): Promise<OsmElement[]> {
  const query = buildOverpassQuery(bounds);

  const res = await fetch(OVERPASS_API, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!res.ok) {
    throw new Error(`Overpass API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as OverpassResponse;
  return data.elements;
}
