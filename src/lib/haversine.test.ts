import { describe, it, expect } from "vitest";
import { haversineMeters } from "./haversine";

describe("haversineMeters", () => {
  it("returns 0 for same point", () => {
    expect(haversineMeters(52.52, 13.405, 52.52, 13.405)).toBe(0);
  });

  it("computes known distance: Berlin Brandenburger Tor to Alexanderplatz (~1.8km)", () => {
    const d = haversineMeters(52.5163, 13.3777, 52.5219, 13.4132);
    expect(d).toBeGreaterThan(1700);
    expect(d).toBeLessThan(2600);
  });

  it("computes distance Berlin to Munich (~500km)", () => {
    const d = haversineMeters(52.52, 13.405, 48.1351, 11.582);
    expect(d).toBeGreaterThan(490_000);
    expect(d).toBeLessThan(520_000);
  });
});
