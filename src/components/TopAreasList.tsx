import { useStore } from "@/app/store";
import { useTranslation } from "@/i18n";
import { ScoreBadge } from "./ScoreBadge";
import { Separator } from "@/components/ui/separator";

type Props = {
  onJumpToHex: (h3: string, lat: number, lon: number) => void;
};

export function TopAreasList({ onJumpToHex }: Props) {
  const topAreas = useStore((s) => s.topAreas);
  const selectedHex = useStore((s) => s.selectedHex);
  const selectHex = useStore((s) => s.selectHex);
  const { t } = useTranslation();

  if (topAreas.length === 0) return null;

  return (
    <div className="flex flex-col gap-0.5">
      <Separator className="mb-2" />
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {t("topAreas.title")}
      </h3>
      {topAreas.slice(0, 20).map((area, i) => (
        <button
          key={area.h3}
          onClick={() => {
            selectHex(area.h3);
            onJumpToHex(area.h3, 0, 0);
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
  );
}
