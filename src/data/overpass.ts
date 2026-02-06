const OVERPASS_DIRECT = "https://overpass-api.de/api/interpreter";
const OVERPASS_CACHED = "https://15minutes.ponytojas.dev/api/overpass";

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

async function postOverpass(
  endpoint: string,
  query: string,
): Promise<OverpassResponse> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!res.ok) {
    // Try to surface useful error context
    const text = await res.text().catch(() => "");
    throw new Error(
      `Overpass API error (${endpoint}): ${res.status} ${res.statusText}${text ? ` — ${text.slice(0, 300)}` : ""}`,
    );
  }

  return (await res.json()) as OverpassResponse;
}

export async function fetchOverpassData(
  bounds: [number, number, number, number],
): Promise<OsmElement[]> {
  const query = buildOverpassQuery(bounds);

  // 1) Try cached/proxied service first
  try {
    const data = await postOverpass(OVERPASS_CACHED, query);
    return data.elements;
  } catch (e) {
    // Optional: log once, or attach to your telemetry
    console.warn(
      "[overpass] cached endpoint failed, falling back to direct",
      e,
    );
  }

  // 2) Fallback: direct Overpass
  const data = await postOverpass(OVERPASS_DIRECT, query);
  return data.elements;
}
