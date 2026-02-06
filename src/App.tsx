import { useEffect, useCallback, useRef } from "react";
import { Analytics } from "@vercel/analytics/react";
import { DeckMap } from "./map/DeckMap";
import { useStore } from "./app/store";
import { useWorker } from "./worker/use-worker";
import { useTranslation } from "./i18n";
import { ControlsPanel } from "./components/ControlsPanel";
import { ExplainPanel } from "./components/ExplainPanel";
import { TopAreasList } from "./components/TopAreasList";
import { MapToolbar } from "./components/MapToolbar";
import { TopAreasCard } from "./components/TopAreasCard";
import { CitySearchDialog } from "./components/CitySearchDialog";
import { InfoDialog } from "./components/InfoDialog";
import { MapLegend } from "./components/MapLegend";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./components/ui/sheet";
import { ScrollArea } from "./components/ui/scroll-area";
import { Card, CardContent } from "./components/ui/card";
import { DotMatrixLoader } from "./components/ui/dot-matrix-loader";
import type { Config } from "./types";

function App() {
  const selectedHex = useStore((s) => s.selectedHex);
  const isLoading = useStore((s) => s.isLoading);
  const cityMeta = useStore((s) => s.cityMeta);
  const config = useStore((s) => s.config);
  const scores = useStore((s) => s.scores);
  const h3Resolution = useStore((s) => s.h3Resolution);
  const hasHydrated = useStore((s) => s.hasHydrated);
  const persistedCityData = useStore((s) => s.persistedCityData);
  const setLoading = useStore((s) => s.setLoading);
  const setConfig = useStore((s) => s.setConfig);

  const settingsOpen = useStore((s) => s.settingsOpen);
  const setSettingsOpen = useStore((s) => s.setSettingsOpen);
  const explainOpen = useStore((s) => s.explainOpen);
  const setExplainOpen = useStore((s) => s.setExplainOpen);
  const searchOpen = useStore((s) => s.searchOpen);
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const infoOpen = useStore((s) => s.infoOpen);
  const setInfoOpen = useStore((s) => s.setInfoOpen);

  const { postMessage } = useWorker();
  const { t, locale } = useTranslation();
  const bootstrapRef = useRef(false);
  const prevH3ResolutionRef = useRef(h3Resolution);

  // Load the single persisted city snapshot (if any) once after hydration.
  useEffect(() => {
    if (!hasHydrated || bootstrapRef.current) return;
    bootstrapRef.current = true;

    if (persistedCityData) {
      setLoading(true);
      setSearchOpen(false);
      postMessage({
        type: "LOAD_RAW_DATA",
        city: persistedCityData.city,
        pois: persistedCityData.pois,
        stops: persistedCityData.stops,
        h3Res: h3Resolution,
      });
      return;
    }

    setSearchOpen(true);
  }, [
    hasHydrated,
    persistedCityData,
    h3Resolution,
    postMessage,
    setLoading,
    setSearchOpen,
  ]);

  // Send config to worker whenever it changes
  useEffect(() => {
    postMessage({ type: "SET_CONFIG", config });
  }, [config, postMessage]);

  // Request explanation when a hex is selected
  useEffect(() => {
    if (selectedHex) {
      postMessage({ type: "SELECT_HEX", h3: selectedHex });
    }
  }, [selectedHex, postMessage]);

  // Request top areas after scores update
  useEffect(() => {
    if (scores.length > 0) {
      postMessage({ type: "GET_TOP_N", n: 20 });
    }
  }, [scores, postMessage]);

  // Auto-open explain sheet when hex is selected
  useEffect(() => {
    if (selectedHex) {
      setExplainOpen(true);
    }
  }, [selectedHex, setExplainOpen]);

  // Update document lang attribute when locale changes
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // H3 resolution change
  useEffect(() => {
    if (!cityMeta) {
      prevH3ResolutionRef.current = h3Resolution;
      return;
    }

    if (prevH3ResolutionRef.current === h3Resolution) return;
    prevH3ResolutionRef.current = h3Resolution;

    setLoading(true);
    postMessage({ type: "SET_H3_RESOLUTION", res: h3Resolution });
  }, [cityMeta, h3Resolution, postMessage, setLoading]);

  const handleConfigChange = useCallback(
    (newConfig: Config) => {
      if (cityMeta) {
        setLoading(true);
      }
      setConfig(newConfig);
    },
    [cityMeta, setConfig, setLoading],
  );

  const handleJumpToHex = useCallback(
    (h3: string, lat: number, lon: number) => {
      void h3;
      void lat;
      void lon;
      // Map jump handled via viewState control in DeckMap
    },
    [],
  );

  const searchDialogOpen =
    searchOpen || (hasHydrated && !cityMeta && !isLoading);

  return (
    <div className="relative h-full w-full">
      {/* Full-screen map */}
      <DeckMap />

      {/* Loading popover */}
      {isLoading && (
        <Card className="absolute bottom-8 left-4 z-40 w-52 gap-0 border-border bg-card/90 py-2 shadow-xl backdrop-blur-md">
          <CardContent className="flex items-center gap-3 px-3 py-2">
            <DotMatrixLoader variant="grid" size="md" />
            <p className="text-sm text-muted-foreground">{t("app.loadingCityData")}</p>
          </CardContent>
        </Card>
      )}

      {/* Floating toolbar */}
      <MapToolbar />

      {/* Floating top areas card */}
      <TopAreasCard />

      {/* Floating legend */}
      <MapLegend />

      {/* Left Sheet: Settings */}
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent
          side="left"
          className="w-80 border-border bg-card/95 backdrop-blur-lg"
        >
          <SheetHeader className="px-5 pt-5 pb-3">
            <SheetTitle>{t("settings.title")}</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-6.5rem)] px-5 pb-5">
            <ControlsPanel onConfigChange={handleConfigChange} />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Right Sheet: Explanation */}
      <Sheet open={explainOpen} onOpenChange={setExplainOpen}>
        <SheetContent
          side="right"
          className="w-[30rem] border-border bg-card/95 backdrop-blur-lg"
        >
          <SheetHeader className="px-5 pt-5 pb-3">
            <SheetTitle>{t("explain.title")}</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-6.5rem)] px-5 pb-5">
            <ExplainPanel />
            <TopAreasList onJumpToHex={handleJumpToHex} />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* City Search Dialog */}
      <CitySearchDialog open={searchDialogOpen} onOpenChange={setSearchOpen} />

      {/* Info Dialog */}
      <InfoDialog open={infoOpen} onOpenChange={setInfoOpen} />

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}

export default App;
