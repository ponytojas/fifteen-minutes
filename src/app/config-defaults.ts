import type { Config } from "../types";

export const defaultConfig = (): Config => ({
  walkSpeedMetersPerMin: 80,
  streetFactor: 1.2,
  amenityBudgetMin: 15,
  maxWalkToStopMin: 10,
  dayType: "weekday",
  timeWindow: { startHour: 7, endHour: 10 },
  categoryWeights: {
    grocery: 1,
    gym: 0.5,
    park: 0.8,
    healthcare: 0.7,
    cafe: 0.3,
    library: 0.3,
  },
  amenityEnabled: {
    grocery: true,
    gym: true,
    park: true,
    healthcare: true,
    cafe: true,
    library: true,
  },
  wFreq: 0.7,
  wDiv: 0.3,
  wAmenities: 0.5,
  wTransit: 0.5,
  freqCap: 60,
  divCap: 40,
});
