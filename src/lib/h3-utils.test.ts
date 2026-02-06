import { describe, expect, it } from "vitest";
import type { CityBoundary } from "../types/city";
import { generateHexes } from "./h3-utils";

describe("generateHexes", () => {
  const bounds: [number, number, number, number] = [
    -0.3,
    -0.3,
    0.3,
    0.3,
  ];
  const res = 7;

  it("uses boundary polygon when provided", () => {
    const full = generateHexes(bounds, res);
    const boundary: CityBoundary = {
      type: "Polygon",
      coordinates: [
        [
          [-0.08, -0.08],
          [0.08, -0.08],
          [0.08, 0.08],
          [-0.08, 0.08],
          [-0.08, -0.08],
        ],
      ],
    };

    const clipped = generateHexes(bounds, res, boundary);
    const fullSet = new Set(full);

    expect(clipped.length).toBeGreaterThan(0);
    expect(clipped.length).toBeLessThan(full.length);
    expect(clipped.every((h3) => fullSet.has(h3))).toBe(true);
  });

  it("unions all polygons for multipolygon boundaries", () => {
    const polygonA: CityBoundary = {
      type: "Polygon",
      coordinates: [
        [
          [-0.18, -0.18],
          [-0.08, -0.18],
          [-0.08, -0.08],
          [-0.18, -0.08],
          [-0.18, -0.18],
        ],
      ],
    };
    const polygonB: CityBoundary = {
      type: "Polygon",
      coordinates: [
        [
          [0.08, 0.08],
          [0.18, 0.08],
          [0.18, 0.18],
          [0.08, 0.18],
          [0.08, 0.08],
        ],
      ],
    };
    const multi: CityBoundary = {
      type: "MultiPolygon",
      coordinates: [polygonA.coordinates, polygonB.coordinates],
    };

    const expected = new Set([
      ...generateHexes(bounds, res, polygonA),
      ...generateHexes(bounds, res, polygonB),
    ]);
    const combined = new Set(generateHexes(bounds, res, multi));

    expect(combined).toEqual(expected);
  });
});
