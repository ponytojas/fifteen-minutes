import { useStore } from "@/app/store";
import { useTranslation } from "@/i18n";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DayType, Config } from "@/types";

function SliderField({
  label,
  value,
  min,
  max,
  step,
  disabled = false,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <div className={cn("flex flex-col gap-2", disabled && "opacity-50")}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono tabular-nums text-foreground/80">
          {value.toFixed(step < 1 ? 1 : 0)}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onValueChange={([v]) => onChange(v)}
      />
    </div>
  );
}

type Props = {
  onConfigChange: (config: Config) => void;
};

export function ControlsPanel({ onConfigChange }: Props) {
  const config = useStore((s) => s.config);
  const cityMeta = useStore((s) => s.cityMeta);
  const isLoading = useStore((s) => s.isLoading);
  const hexLayerVisible = useStore((s) => s.hexLayerVisible);
  const toggleHexLayerVisible = useStore((s) => s.toggleHexLayerVisible);
  const hexLayerOpacity = useStore((s) => s.hexLayerOpacity);
  const setHexLayerOpacity = useStore((s) => s.setHexLayerOpacity);
  const poisLayerVisible = useStore((s) => s.poisLayerVisible);
  const togglePoisLayerVisible = useStore((s) => s.togglePoisLayerVisible);
  const { t } = useTranslation();

  const update = (partial: Partial<Config>) => {
    onConfigChange({ ...config, ...partial });
  };

  const categories = cityMeta ? Object.keys(config.categoryWeights) : [];
  const formatCategory = (cat: string) =>
    t(`category.${cat}`);

  return (
    <div className="flex flex-col gap-5 py-2">
      {/* Time */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("controls.time")}
        </h2>
        <div className="mb-3 flex gap-2">
          {(["weekday", "weekend"] as DayType[]).map((dt) => (
            <Button
              key={dt}
              variant={config.dayType === dt ? "default" : "secondary"}
              size="sm"
              className="flex-1 text-xs capitalize"
              onClick={() => update({ dayType: dt })}
            >
              {t(`controls.${dt}`)}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-[10px] text-muted-foreground/70">{t("controls.from")}</span>
            <Select
              value={String(config.timeWindow.startHour)}
              onValueChange={(v) =>
                update({
                  timeWindow: {
                    ...config.timeWindow,
                    startHour: Number(v),
                  },
                })
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => (
                  <SelectItem key={i} value={String(i)}>
                    {i}:00
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-[10px] text-muted-foreground/70">{t("controls.to")}</span>
            <Select
              value={String(config.timeWindow.endHour)}
              onValueChange={(v) =>
                update({
                  timeWindow: {
                    ...config.timeWindow,
                    endHour: Number(v),
                  },
                })
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => (
                  <SelectItem key={i} value={String(i)}>
                    {i}:00
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Amenity Selection */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("controls.amenitySelection")}
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => {
            const enabled = config.amenityEnabled[cat] ?? true;

            return (
              <Button
                key={cat}
                variant={enabled ? "secondary" : "outline"}
                size="sm"
                className="justify-start capitalize"
                onClick={() =>
                  update({
                    amenityEnabled: {
                      ...config.amenityEnabled,
                      [cat]: !enabled,
                    },
                  })
                }
              >
                {enabled ? t("controls.used") : t("controls.ignored")} {formatCategory(cat)}
              </Button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Amenity Weights */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("controls.amenityWeights")}
        </h2>
        <div className="flex flex-col gap-3">
          {categories.map((cat) => {
            const enabled = config.amenityEnabled[cat] ?? true;

            return (
              <SliderField
                key={cat}
                label={formatCategory(cat)}
                value={config.categoryWeights[cat] ?? 0}
                min={0}
                max={1}
                step={0.1}
                disabled={!enabled}
                onChange={(v) =>
                  update({
                    categoryWeights: { ...config.categoryWeights, [cat]: v },
                  })
                }
              />
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Transit Weights */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("controls.transitWeights")}
        </h2>
        <div className="flex flex-col gap-3">
          <SliderField
            label={t("controls.frequency")}
            value={config.wFreq}
            min={0}
            max={1}
            step={0.1}
            onChange={(v) => update({ wFreq: v })}
          />
          <SliderField
            label={t("controls.diversity")}
            value={config.wDiv}
            min={0}
            max={1}
            step={0.1}
            onChange={(v) => update({ wDiv: v })}
          />
        </div>
      </div>

      <Separator />

      {/* Balance */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("controls.balance")}
        </h2>
        <div className="flex flex-col gap-3">
          <SliderField
            label={t("controls.amenities")}
            value={config.wAmenities}
            min={0}
            max={1}
            step={0.1}
            onChange={(v) => update({ wAmenities: v })}
          />
          <SliderField
            label={t("controls.transit")}
            value={config.wTransit}
            min={0}
            max={1}
            step={0.1}
            onChange={(v) => update({ wTransit: v })}
          />
        </div>
      </div>

      <Separator />

      {/* Hex Layer */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("controls.hexLayer")}
        </h2>
        <div className="flex flex-col gap-3">
          <Button
            variant={hexLayerVisible ? "secondary" : "outline"}
            size="sm"
            className="w-full"
            disabled={isLoading}
            onClick={toggleHexLayerVisible}
          >
            {hexLayerVisible ? t("controls.hideHexes") : t("controls.showHexes")}
          </Button>
          <Button
            variant={poisLayerVisible ? "secondary" : "outline"}
            size="sm"
            className="w-full"
            disabled={isLoading}
            onClick={togglePoisLayerVisible}
          >
            {poisLayerVisible ? t("controls.hidePois") : t("controls.showPois")}
          </Button>
          <SliderField
            label={t("controls.hexOpacity")}
            value={hexLayerOpacity}
            min={0}
            max={1}
            step={0.05}
            onChange={setHexLayerOpacity}
          />
        </div>
      </div>

      <Separator />

      {/* Constraints */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("controls.constraints")}
        </h2>
        <div className="flex flex-col gap-3">
          <SliderField
            label={t("controls.walkBudget")}
            value={config.amenityBudgetMin}
            min={5}
            max={30}
            step={1}
            onChange={(v) => update({ amenityBudgetMin: v })}
          />
          <SliderField
            label={t("controls.maxWalkToStop")}
            value={config.maxWalkToStopMin}
            min={3}
            max={20}
            step={1}
            onChange={(v) => update({ maxWalkToStopMin: v })}
          />
        </div>
      </div>
    </div>
  );
}
