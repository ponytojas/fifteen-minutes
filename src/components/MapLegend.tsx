import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useStore } from "@/app/store";
import { useTranslation } from "@/i18n";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DARK_RAMP: [number, number, number][] = [
  [220, 36, 48],
  [245, 130, 32],
  [255, 210, 63],
  [102, 194, 114],
  [34, 139, 104],
];

const LIGHT_RAMP: [number, number, number][] = [
  [220, 36, 48],
  [230, 120, 30],
  [220, 180, 40],
  [80, 170, 90],
  [20, 120, 85],
];

const CATEGORY_COLORS: Record<string, [number, number, number]> = {
  grocery: [76, 175, 80],
  gym: [255, 152, 0],
  park: [129, 199, 132],
  healthcare: [239, 83, 80],
  cafe: [161, 136, 127],
  library: [126, 87, 194],
};

const CATEGORIES = Object.keys(CATEGORY_COLORS) as Array<keyof typeof CATEGORY_COLORS>;

function rampToGradient(ramp: [number, number, number][]): string {
  const stops = ramp.map(
    ([r, g, b], i) =>
      `rgb(${r},${g},${b}) ${Math.round((i / (ramp.length - 1)) * 100)}%`,
  );
  return `linear-gradient(to right, ${stops.join(", ")})`;
}

export function MapLegend() {
  const scores = useStore((s) => s.scores);
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();

  if (scores.length === 0) return null;

  const isDark = resolvedTheme === "dark";
  const gradient = rampToGradient(isDark ? DARK_RAMP : LIGHT_RAMP);

  return (
    <Card
      className={cn(
        "absolute bottom-8 right-4 z-20 w-52 border-border bg-card/90 shadow-xl backdrop-blur-md",
        collapsed ? "gap-0 py-1" : "gap-0 py-2",
      )}
    >
      <CardHeader
        className={cn(
          "flex flex-row items-center justify-between px-3",
          collapsed ? "py-1" : "py-2",
        )}
      >
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("legend.title")}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={`${collapsed ? "Expand" : "Collapse"} ${t("legend.title")}`}
        >
          {collapsed ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </Button>
      </CardHeader>
      {!collapsed && (
        <CardContent className="space-y-3 px-3 pb-3 pt-0">
          {/* Score gradient */}
          <div>
            <p className="mb-1 text-[10px] font-medium text-muted-foreground">
              {t("legend.score")}
            </p>
            <div
              className="h-2.5 w-full rounded-sm"
              style={{ background: gradient }}
            />
            <div className="mt-0.5 flex justify-between text-[10px] text-muted-foreground">
              <span>{t("legend.low")}</span>
              <span>{t("legend.high")}</span>
            </div>
          </div>

          {/* POI categories */}
          <div>
            <p className="mb-1 text-[10px] font-medium text-muted-foreground">
              {t("legend.pois")}
            </p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              {CATEGORIES.map((cat) => {
                const [r, g, b] = CATEGORY_COLORS[cat];
                return (
                  <div key={cat} className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: `rgb(${r},${g},${b})` }}
                    />
                    <span className="truncate text-[10px] text-muted-foreground">
                      {t(`category.${cat}`)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
