import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { DotMatrixLoader } from "@/components/ui/dot-matrix-loader";
import {
  searchCities,
  extractCityBoundary,
  type NominatimResult,
} from "@/data/nominatim";
import { fetchOverpassData } from "@/data/overpass";
import { osmToPois, osmToStops, buildCityMeta } from "@/data/osm-transform";
import { useStore } from "@/app/store";
import { useWorker } from "@/worker/use-worker";
import { useTranslation } from "@/i18n";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CitySearchDialog({ open, onOpenChange }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  const h3Resolution = useStore((s) => s.h3Resolution);
  const setLoading = useStore((s) => s.setLoading);
  const setPersistedCityData = useStore((s) => s.setPersistedCityData);
  const { postMessage } = useWorker();
  const { t } = useTranslation();

  // Debounced city search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      setError(null);
      try {
        const res = await searchCities(query);
        setResults(res);
      } catch (e) {
        setError(e instanceof Error ? e.message : t("search.searchFailed"));
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, t]);

  const handleSelect = useCallback(
    async (result: NominatimResult) => {
      setDownloading(true);
      setError(null);

      try {
        const [south, north, west, east] = result.boundingbox.map(Number);
        const bounds: [number, number, number, number] = [
          west,
          south,
          east,
          north,
        ];
        const center: [number, number] = [
          Number(result.lon),
          Number(result.lat),
        ];

        setDownloadStatus("search.fetchingOSM");
        const elements = await fetchOverpassData(bounds);

        setDownloadStatus("search.processingAmenities");
        const pois = osmToPois(elements);

        setDownloadStatus("search.processingTransit");
        const stops = osmToStops(elements);

        setDownloadStatus("search.buildingCity");
        const cityName =
          result.display_name.split(",")[0] || result.display_name;
        const boundary = extractCityBoundary(result);
        const city = buildCityMeta(cityName, bounds, center, boundary);
        setPersistedCityData({ city, pois, stops });

        setLoading(true);
        postMessage({
          type: "LOAD_RAW_DATA",
          city,
          pois,
          stops,
          h3Res: h3Resolution,
        });

        onOpenChange(false);
        setQuery("");
        setResults([]);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : t("search.downloadFailed"),
        );
      } finally {
        setDownloading(false);
        setDownloadStatus("");
      }
    },
    [h3Resolution, setLoading, postMessage, onOpenChange, setPersistedCityData, t],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-border bg-card">
        <DialogHeader>
          <DialogTitle>{t("search.title")}</DialogTitle>
          <DialogDescription>
            {t("search.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("search.placeholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            disabled={downloading}
            autoFocus
          />
        </div>

        {error && (
          <p className="text-xs text-destructive-foreground">{error}</p>
        )}

        {downloading && (
          <div className="flex flex-col gap-2 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DotMatrixLoader variant="dots" size="sm" />
              {t(downloadStatus)}
            </div>
            <div className="flex items-center justify-center py-2">
              <DotMatrixLoader variant="grid" size="lg" />
            </div>
          </div>
        )}

        {!downloading && results.length > 0 && (
          <div className="max-h-64 overflow-y-auto">
            {results.map((r) => (
              <button
                key={r.place_id}
                onClick={() => handleSelect(r)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary"
              >
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate text-foreground">
                  {r.display_name}
                </span>
              </button>
            ))}
          </div>
        )}

        {!downloading && searching && (
          <div className="flex items-center justify-center py-6">
            <DotMatrixLoader variant="grid" size="md" />
          </div>
        )}

        {!downloading &&
          !searching &&
          query.length >= 2 &&
          results.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              {t("search.noCitiesFound")}
            </p>
          )}
      </DialogContent>
    </Dialog>
  );
}
