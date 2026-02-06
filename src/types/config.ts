export type DayType = "weekday" | "weekend";

export type Config = {
  walkSpeedMetersPerMin: number;
  streetFactor: number;
  amenityBudgetMin: number;
  maxWalkToStopMin: number;

  dayType: DayType;
  timeWindow: { startHour: number; endHour: number };

  categoryWeights: Record<string, number>;
  amenityEnabled: Record<string, boolean>;

  wFreq: number;
  wDiv: number;

  wAmenities: number;
  wTransit: number;

  freqCap: number;
  divCap: number;
};
