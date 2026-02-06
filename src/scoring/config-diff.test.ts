import { describe, it, expect } from "vitest";
import { getRecomputePath } from "./config-diff";
import { defaultConfig } from "../app/config-defaults";

describe("getRecomputePath", () => {
  const base = defaultConfig();

  it("returns weights-only when only wAmenities changes", () => {
    const next = { ...base, wAmenities: 0.8 };
    expect(getRecomputePath(base, next)).toBe("weights-only");
  });

  it("returns weights-only when a category weight changes", () => {
    const next = { ...base, categoryWeights: { ...base.categoryWeights, grocery: 0.3 } };
    expect(getRecomputePath(base, next)).toBe("weights-only");
  });

  it("returns weights-only when an amenity toggle changes", () => {
    const next = {
      ...base,
      amenityEnabled: { ...base.amenityEnabled, cafe: false },
    };
    expect(getRecomputePath(base, next)).toBe("weights-only");
  });

  it("returns time-window when dayType changes", () => {
    const next = { ...base, dayType: "weekend" as const };
    expect(getRecomputePath(base, next)).toBe("time-window");
  });

  it("returns time-window when startHour changes", () => {
    const next = { ...base, timeWindow: { startHour: 8, endHour: 10 } };
    expect(getRecomputePath(base, next)).toBe("time-window");
  });

  it("returns amenity-radius when amenityBudgetMin changes", () => {
    const next = { ...base, amenityBudgetMin: 20 };
    expect(getRecomputePath(base, next)).toBe("amenity-radius");
  });

  it("returns transit-radius when maxWalkToStopMin changes", () => {
    const next = { ...base, maxWalkToStopMin: 15 };
    expect(getRecomputePath(base, next)).toBe("transit-radius");
  });

  it("returns full when walkSpeed changes", () => {
    const next = { ...base, walkSpeedMetersPerMin: 100 };
    expect(getRecomputePath(base, next)).toBe("full");
  });

  it("returns full when streetFactor changes", () => {
    const next = { ...base, streetFactor: 1.5 };
    expect(getRecomputePath(base, next)).toBe("full");
  });

  it("returns weights-only when nothing changes", () => {
    expect(getRecomputePath(base, { ...base })).toBe("weights-only");
  });
});
