import type { CityMeta, PoiPack, StopsPack } from "./city";
import type { Config } from "./config";
import type { Explanation } from "./explanation";

export type HexScore = {
  h3: string;
  score: number;
  reasons?: string[];
};

export type WorkerIn =
  | { type: "LOAD_CITY_PACK"; cityId: string }
  | {
      type: "LOAD_RAW_DATA";
      city: CityMeta;
      pois: PoiPack;
      stops: StopsPack;
      h3Res: number;
    }
  | { type: "SET_CONFIG"; config: Config }
  | { type: "SET_H3_RESOLUTION"; res: number }
  | { type: "SELECT_HEX"; h3: string }
  | { type: "GET_TOP_N"; n: number };

export type WorkerOut =
  | { type: "CITY_LOADED"; city: CityMeta }
  | { type: "SCORES_UPDATED"; scores: HexScore[] }
  | { type: "HEX_EXPLANATION"; explanation: Explanation }
  | {
      type: "TOP_N";
      items: Array<{ h3: string; score: number; reasons: string[] }>;
    }
  | { type: "ERROR"; message: string };
