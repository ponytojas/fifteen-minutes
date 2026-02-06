import { describe, it, expect } from "vitest";
import { clamp01, smoothstep } from "./smoothstep";

describe("clamp01", () => {
  it("clamps values below 0", () => {
    expect(clamp01(-0.5)).toBe(0);
  });

  it("clamps values above 1", () => {
    expect(clamp01(1.5)).toBe(1);
  });

  it("passes through values in [0, 1]", () => {
    expect(clamp01(0.5)).toBe(0.5);
  });

  it("returns 0 for 0", () => {
    expect(clamp01(0)).toBe(0);
  });

  it("returns 1 for 1", () => {
    expect(clamp01(1)).toBe(1);
  });
});

describe("smoothstep", () => {
  it("returns 0 at edge0", () => {
    expect(smoothstep(5, 15, 5)).toBe(0);
  });

  it("returns 1 at edge1", () => {
    expect(smoothstep(5, 15, 15)).toBe(1);
  });

  it("returns 0 below edge0", () => {
    expect(smoothstep(5, 15, 3)).toBe(0);
  });

  it("returns 1 above edge1", () => {
    expect(smoothstep(5, 15, 20)).toBe(1);
  });

  it("returns 0.5 at midpoint", () => {
    expect(smoothstep(0, 10, 5)).toBe(0.5);
  });

  it("is monotonically increasing", () => {
    const values = [];
    for (let x = 0; x <= 10; x += 0.5) {
      values.push(smoothstep(0, 10, x));
    }
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]);
    }
  });
});
