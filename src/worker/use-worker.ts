import { useEffect, useCallback } from "react";
import { useStore } from "../app/store";
import type { WorkerIn, WorkerOut } from "../types";

let sharedWorker: Worker | null = null;

function ensureWorker() {
  if (sharedWorker) return sharedWorker;

  sharedWorker = new Worker(
    new URL("./scoring.worker.ts", import.meta.url),
    { type: "module" },
  );

  sharedWorker.onmessage = (e: MessageEvent<WorkerOut>) => {
    const msg = e.data;
    const {
      setCity,
      setScores,
      setExplanation,
      setTopAreas,
      setLoading,
      setHexLayerVisible,
      setPoisLayerVisible,
    } = useStore.getState();

    switch (msg.type) {
      case "CITY_LOADED":
        setCity(msg.city.id, msg.city);
        break;
      case "SCORES_UPDATED":
        setScores(msg.scores);
        setHexLayerVisible(true);
        setPoisLayerVisible(true);
        setLoading(false);
        break;
      case "HEX_EXPLANATION":
        setExplanation(msg.explanation);
        break;
      case "TOP_N":
        setTopAreas(msg.items);
        break;
      case "ERROR":
        console.error("[Worker]", msg.message);
        setLoading(false);
        break;
    }
  };

  return sharedWorker;
}

export function useWorker() {
  useEffect(() => {
    ensureWorker();
  }, []);

  const postMessage = useCallback((msg: WorkerIn) => {
    ensureWorker().postMessage(msg);
  }, []);

  return { postMessage };
}
