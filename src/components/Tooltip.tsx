import { useTranslation } from "@/i18n";

type ScoreTooltipProps = {
  x: number;
  y: number;
  kind: "score";
  score: number;
  reasons?: string[];
};

type PoiTooltipProps = {
  x: number;
  y: number;
  kind: "poi";
  title: string;
  subtitle?: string;
};

type TooltipProps = ScoreTooltipProps | PoiTooltipProps;

export function Tooltip(props: TooltipProps) {
  const { t } = useTranslation();

  const { x, y } = props;

  return (
    <div
      className="pointer-events-none absolute z-50 rounded-lg border border-border bg-popover/90 px-3 py-2 text-sm text-popover-foreground shadow-lg backdrop-blur-sm"
      style={{ left: x + 12, top: y + 12 }}
    >
      {props.kind === "score" ? (
        <>
          <div className="font-semibold">
            {t("tooltip.score")} {Math.round(props.score * 100)}
          </div>
          {props.reasons && props.reasons.length > 0 && (
            <div className="mt-1 text-xs text-muted-foreground">
              {props.reasons.slice(0, 2).map((r, i) => (
                <div key={i}>{r}</div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="font-semibold">{props.title}</div>
          {props.subtitle && (
            <div className="text-xs text-muted-foreground">{props.subtitle}</div>
          )}
        </div>
      )}
    </div>
  );
}
