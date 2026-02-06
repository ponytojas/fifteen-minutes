import type { DayType } from "./config";

export type AmenityEvidence = {
  category: string;
  enabled: boolean;
  weight: number;
  nearest: { name?: string; lat: number; lon: number };
  distanceM: number;
  timeMin: number;
  normalized: number;
  contribution: number;
};

export type StopEvidence = {
  id: string;
  lat: number;
  lon: number;
  freqPerHour: number;
  routesMetric: number;
  distanceM: number;
  timeMin: number;
};

export type TransitAggregates = {
  stopsCount: number;
  freqSum: number;
  freqSumCapped: number;
  freqScore: number;
  divSum: number;
  divScore: number;
};

export type TransitEvidence = {
  enabled: boolean;
  maxWalkToStopMin: number;
  consideredStops: StopEvidence[];
  aggregates: TransitAggregates;
  weights: { wFreq: number; wDiv: number };
  contribution: number;
  histogram: Array<{ hour: number; departures: number }>;
};

export type Explanation = {
  h3: string;
  centroid: { lat: number; lon: number };
  dayType: DayType;
  timeWindow: { startHour: number; endHour: number };

  total: {
    score: number;
    confidence: "high" | "medium" | "low";
    formula: string;
  };

  amenities: AmenityEvidence[];
  transit: TransitEvidence;
};
