import { useStore } from "@/app/store";
import { useTranslation } from "@/i18n";
import { ScoreBadge } from "./ScoreBadge";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { Histogram } from "./Histogram";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Eye, EyeOff } from "lucide-react";

export function ExplainPanel() {
  const explanation = useStore((s) => s.explanation);
  const selectedHex = useStore((s) => s.selectedHex);
  const setEvidenceTarget = useStore((s) => s.setEvidenceTarget);
  const evidenceTarget = useStore((s) => s.evidenceTarget);
  const { t } = useTranslation();

  if (!selectedHex) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-sm text-muted-foreground/50">
          {t("explain.clickToInspect")}
        </p>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-sm text-muted-foreground">{t("explain.loading")}</p>
      </div>
    );
  }

  const { total, amenities, transit } = explanation;

  const toggleAmenityEvidence = (
    cat: string,
    lat: number,
    lon: number,
  ) => {
    if (
      evidenceTarget?.type === "amenity" &&
      (evidenceTarget as { category: string }).category === cat
    ) {
      setEvidenceTarget(null);
    } else {
      setEvidenceTarget({
        type: "amenity",
        category: cat,
        poi: { lat, lon },
        hex: explanation.centroid,
      });
    }
  };

  const toggleTransitEvidence = () => {
    if (evidenceTarget?.type === "transit") {
      setEvidenceTarget(null);
    } else {
      setEvidenceTarget({
        type: "transit",
        stops: transit.consideredStops.map((s) => ({
          lat: s.lat,
          lon: s.lon,
        })),
        hex: explanation.centroid,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Total Score */}
      <div className="flex items-center gap-3">
        <ScoreBadge score={total.score} size="lg" />
        <div>
          <div className="text-sm font-semibold text-foreground/90">
            {t("explain.score")} {Math.round(total.score * 100)}
          </div>
          <ConfidenceBadge confidence={total.confidence} />
        </div>
      </div>

      {/* Formula */}
      <code className="block rounded bg-secondary px-2 py-1.5 text-[10px] text-muted-foreground break-all">
        {total.formula}
      </code>

      <Separator />

      {/* Tabs: Amenities / Transit */}
      <Tabs defaultValue="amenities">
        <TabsList className="w-full">
          <TabsTrigger value="amenities" className="flex-1 text-xs">
            {t("explain.amenities")}
          </TabsTrigger>
          <TabsTrigger value="transit" className="flex-1 text-xs">
            {t("explain.transit")}
          </TabsTrigger>
        </TabsList>

        {/* Amenities Tab */}
        <TabsContent value="amenities" className="mt-3">
          <div className="flex flex-col gap-1">
            {amenities.map((a) => (
              <div
                key={a.category}
                className={`flex items-center gap-2 rounded px-2 py-1.5 text-xs ${
                  a.enabled
                    ? "bg-secondary"
                    : "bg-muted/20 text-muted-foreground/30"
                }`}
              >
                <span className="w-16 shrink-0 font-medium capitalize">
                  {t(`category.${a.category}`)}
                </span>
                {a.enabled ? (
                  <>
                    <span
                      className="flex-1 truncate text-muted-foreground"
                      title={a.nearest.name}
                    >
                      {a.nearest.name ?? "\u2014"}
                    </span>
                    <span className="font-mono text-muted-foreground/70">
                      {Math.round(a.distanceM)}{t("unit.m")}
                    </span>
                    <span className="font-mono text-muted-foreground/70">
                      {a.timeMin.toFixed(1)}{t("unit.min")}
                    </span>
                    <ScoreBadge score={a.normalized} />
                    <Button
                      variant={
                        evidenceTarget?.type === "amenity" &&
                        (evidenceTarget as { category: string }).category ===
                          a.category
                          ? "default"
                          : "ghost"
                      }
                      size="icon"
                      className="h-5 w-5"
                      onClick={() =>
                        toggleAmenityEvidence(
                          a.category,
                          a.nearest.lat,
                          a.nearest.lon,
                        )
                      }
                      title={t("explain.showEvidence")}
                    >
                      {evidenceTarget?.type === "amenity" &&
                      (evidenceTarget as { category: string }).category ===
                        a.category ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                  </>
                ) : (
                  <span className="flex-1 text-muted-foreground/20">
                    {t("explain.disabled")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Transit Tab */}
        <TabsContent value="transit" className="mt-3">
          <div className="rounded bg-secondary px-3 py-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <span className="text-muted-foreground/70">{t("explain.stopsInRadius")}</span>
              <span className="text-right font-mono text-foreground/80">
                {transit.aggregates.stopsCount}
              </span>
              <span className="text-muted-foreground/70">{t("explain.freqSum")}</span>
              <span className="text-right font-mono text-foreground/80">
                {transit.aggregates.freqSum.toFixed(1)} &rarr;{" "}
                {transit.aggregates.freqSumCapped.toFixed(1)}
              </span>
              <span className="text-muted-foreground/70">{t("explain.freqScore")}</span>
              <span className="text-right font-mono text-foreground/80">
                {transit.aggregates.freqScore.toFixed(2)}
              </span>
              <span className="text-muted-foreground/70">{t("explain.divSum")}</span>
              <span className="text-right font-mono text-foreground/80">
                {transit.aggregates.divSum.toFixed(1)}
              </span>
              <span className="text-muted-foreground/70">{t("explain.divScore")}</span>
              <span className="text-right font-mono text-foreground/80">
                {transit.aggregates.divScore.toFixed(2)}
              </span>
              <span className="text-muted-foreground/70">{t("explain.contribution")}</span>
              <span className="text-right font-mono text-foreground/80">
                {transit.contribution.toFixed(3)}
              </span>
            </div>

            {transit.histogram.length > 0 && (
              <div className="mt-3">
                <span className="text-[10px] text-muted-foreground/50">
                  {t("explain.departuresPerHour")}
                </span>
                <Histogram data={transit.histogram} />
              </div>
            )}

            <Button
              variant={
                evidenceTarget?.type === "transit" ? "default" : "secondary"
              }
              size="sm"
              className="mt-2 w-full text-[10px]"
              onClick={toggleTransitEvidence}
            >
              {evidenceTarget?.type === "transit"
                ? t("explain.hideTransitEvidence")
                : t("explain.showTransitEvidence")}
            </Button>
          </div>

          {/* Stops list (collapsible) */}
          {transit.consideredStops.length > 0 && (
            <Collapsible className="mt-3">
              <CollapsibleTrigger className="flex w-full items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <ChevronDown className="h-3 w-3" />
                {transit.consideredStops.length} {t("explain.stopsConsidered")}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-1 flex flex-col gap-0.5">
                  {transit.consideredStops.map((s) => (
                    <div
                      key={s.id}
                      className="flex justify-between rounded bg-muted/30 px-2 py-1 text-xs"
                    >
                      <span className="text-muted-foreground">{s.id}</span>
                      <span className="font-mono text-muted-foreground/70">
                        {s.freqPerHour.toFixed(1)} {t("unit.depPerHour")} &middot;{" "}
                        {s.timeMin.toFixed(1)}{t("unit.min")}
                      </span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
