import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useStore } from "@/app/store";
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";
import { ScoreBadge } from "./ScoreBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TopAreasCard() {
  const topAreas = useStore((s) => s.topAreas);
  const selectedHex = useStore((s) => s.selectedHex);
  const selectHex = useStore((s) => s.selectHex);
  const setExplainOpen = useStore((s) => s.setExplainOpen);
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();

  if (topAreas.length === 0) return null;

  return (
    <Card
      className={cn(
        "absolute bottom-4 left-1/2 z-20 w-[480px] max-w-[calc(100vw-2rem)] -translate-x-1/2 border-border bg-card/90 shadow-xl backdrop-blur-md",
        collapsed ? "gap-0 py-1" : "gap-0 py-2",
      )}
    >
      <CardHeader
        className={cn(
          "flex flex-row items-center justify-between px-4",
          collapsed ? "py-1" : "py-2",
        )}
      >
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("topAreas.title")}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={`${collapsed ? "Expand" : "Collapse"} ${t("topAreas.title")}`}
        >
          {collapsed ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </Button>
      </CardHeader>
      {!collapsed && (
        <CardContent className="max-h-48 overflow-y-auto px-4 pb-3 pt-0">
          <div className="flex flex-col gap-0.5">
            {topAreas.slice(0, 10).map((area, i) => (
              <button
                key={area.h3}
                onClick={() => {
                  selectHex(area.h3);
                  setExplainOpen(true);
                }}
                className={`flex items-center gap-2 rounded px-2 py-1.5 text-left text-xs transition-colors ${
                  selectedHex === area.h3
                    ? "bg-primary/20 text-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <span className="w-4 shrink-0 text-right font-mono text-muted-foreground/50">
                  {i + 1}
                </span>
                <ScoreBadge score={area.score} />
                <span className="flex-1 truncate">
                  {area.reasons.length > 0
                    ? area.reasons.join(" · ")
                    : area.h3.slice(0, 10)}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
