import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  CityMeta,
  Config,
  Explanation,
  HexScore,
  PoiPack,
  StopsPack,
} from "../types";
import type { Locale } from "../i18n/types";
import { defaultConfig } from "./config-defaults";

export type PersistedCityData = {
  city: CityMeta;
  pois: PoiPack;
  stops: StopsPack;
};

export type EvidenceTarget =
  | null
  | {
      type: "amenity";
      category: string;
      poi: { lat: number; lon: number };
      hex: { lat: number; lon: number };
    }
  | {
      type: "transit";
      stops: Array<{ lat: number; lon: number }>;
      hex: { lat: number; lon: number };
    };

type TopArea = { h3: string; score: number; reasons: string[] };

type AppState = {
  cityId: string | null;
  cityMeta: CityMeta | null;
  config: Config;
  scores: HexScore[];
  selectedHex: string | null;
  explanation: Explanation | null;
  evidenceFocusMode: boolean;
  evidenceTarget: EvidenceTarget;
  topAreas: TopArea[];
  isLoading: boolean;
  h3Resolution: number;
  hexLayerVisible: boolean;
  hexLayerOpacity: number;
  poisLayerVisible: boolean;
  settingsOpen: boolean;
  explainOpen: boolean;
  searchOpen: boolean;
  infoOpen: boolean;
  locale: Locale;
  hasHydrated: boolean;
  persistedCityData: PersistedCityData | null;
};

type AppActions = {
  setCity: (id: string, meta: CityMeta) => void;
  setConfig: (config: Config) => void;
  updateConfig: (partial: Partial<Config>) => void;
  setScores: (scores: HexScore[]) => void;
  selectHex: (h3: string | null) => void;
  setExplanation: (explanation: Explanation | null) => void;
  setEvidenceTarget: (target: EvidenceTarget) => void;
  toggleEvidenceFocus: () => void;
  setTopAreas: (areas: TopArea[]) => void;
  setLoading: (loading: boolean) => void;
  setH3Resolution: (res: number) => void;
  setHexLayerVisible: (visible: boolean) => void;
  toggleHexLayerVisible: () => void;
  setHexLayerOpacity: (opacity: number) => void;
  setPoisLayerVisible: (visible: boolean) => void;
  togglePoisLayerVisible: () => void;
  setSettingsOpen: (open: boolean) => void;
  setExplainOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setInfoOpen: (open: boolean) => void;
  setLocale: (locale: Locale) => void;
  setHydrated: (hydrated: boolean) => void;
  setPersistedCityData: (data: PersistedCityData | null) => void;
};

export const useStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      cityId: null,
      cityMeta: null,
      config: defaultConfig(),
      scores: [],
      selectedHex: null,
      explanation: null,
      evidenceFocusMode: false,
      evidenceTarget: null,
      topAreas: [],
      isLoading: false,
      h3Resolution: 9,
      hexLayerVisible: true,
      hexLayerOpacity: 0.8,
      poisLayerVisible: true,
      settingsOpen: false,
      explainOpen: false,
      searchOpen: false,
      infoOpen: false,
      locale: "en" as Locale,
      hasHydrated: false,
      persistedCityData: null,

      setCity: (id, meta) =>
        set({
          cityId: id,
          cityMeta: meta,
          selectedHex: null,
          explanation: null,
          evidenceFocusMode: false,
          evidenceTarget: null,
          topAreas: [],
          explainOpen: false,
        }),
      setConfig: (config) => set({ config }),
      updateConfig: (partial) =>
        set((state) => ({ config: { ...state.config, ...partial } })),
      setScores: (scores) => set({ scores }),
      selectHex: (h3) =>
        set({
          selectedHex: h3,
          explanation: null,
          evidenceTarget: null,
          evidenceFocusMode: false,
        }),
      setExplanation: (explanation) => set({ explanation }),
      setEvidenceTarget: (target) =>
        set({ evidenceTarget: target, evidenceFocusMode: target !== null }),
      toggleEvidenceFocus: () =>
        set((state) => ({
          evidenceFocusMode: !state.evidenceFocusMode,
          evidenceTarget: state.evidenceFocusMode ? null : state.evidenceTarget,
        })),
      setTopAreas: (areas) => set({ topAreas: areas }),
      setLoading: (loading) => set({ isLoading: loading }),
      setH3Resolution: (res) => set({ h3Resolution: res }),
      setHexLayerVisible: (visible) => set({ hexLayerVisible: visible }),
      toggleHexLayerVisible: () =>
        set((state) => ({ hexLayerVisible: !state.hexLayerVisible })),
      setHexLayerOpacity: (opacity) => set({ hexLayerOpacity: opacity }),
      setPoisLayerVisible: (visible) => set({ poisLayerVisible: visible }),
      togglePoisLayerVisible: () =>
        set((state) => ({ poisLayerVisible: !state.poisLayerVisible })),
      setSettingsOpen: (open) => set({ settingsOpen: open }),
      setExplainOpen: (open) => set({ explainOpen: open }),
      setSearchOpen: (open) => set({ searchOpen: open }),
      setInfoOpen: (open) => set({ infoOpen: open }),
      setLocale: (locale) => set({ locale }),
      setHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      setPersistedCityData: (data) => set({ persistedCityData: data }),
    }),
    {
      name: "fifteen-minute-atlas",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cityId: state.cityId,
        cityMeta: state.cityMeta,
        h3Resolution: state.h3Resolution,
        hexLayerVisible: state.hexLayerVisible,
        hexLayerOpacity: state.hexLayerOpacity,
        poisLayerVisible: state.poisLayerVisible,
        locale: state.locale,
        persistedCityData: state.persistedCityData,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("[Store] Failed to rehydrate", error);
        }
        state?.setHydrated(true);
      },
    },
  ),
);
