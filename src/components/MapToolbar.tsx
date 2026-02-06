import {
  Settings,
  Search,
  Info,
  Hexagon,
  Sun,
  Moon,
  Monitor,
  Eye,
  EyeOff,
  MapPin,
  MapPinOff,
} from "lucide-react";
import { useStore } from "@/app/store";
import { useTheme } from "@/components/theme-provider";
import { useTranslation } from "@/i18n";
import { LanguageSelector } from "./LanguageSelector";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const H3_RES_INFO: Record<number, string> = {
  7: "~5.2 km edge",
  8: "~460 m edge",
  9: "~174 m edge",
  10: "~66 m edge",
  11: "~25 m edge",
};

export function MapToolbar() {
  const cityMeta = useStore((s) => s.cityMeta);
  const h3Resolution = useStore((s) => s.h3Resolution);
  const isLoading = useStore((s) => s.isLoading);
  const setSettingsOpen = useStore((s) => s.setSettingsOpen);
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const setInfoOpen = useStore((s) => s.setInfoOpen);
  const setH3Resolution = useStore((s) => s.setH3Resolution);
  const hexLayerVisible = useStore((s) => s.hexLayerVisible);
  const toggleHexLayerVisible = useStore((s) => s.toggleHexLayerVisible);
  const poisLayerVisible = useStore((s) => s.poisLayerVisible);
  const togglePoisLayerVisible = useStore((s) => s.togglePoisLayerVisible);

  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <TooltipProvider>
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center gap-2 rounded-xl border border-border bg-card/80 px-3 py-2 shadow-lg backdrop-blur-md">
        {/* City name */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          {cityMeta ? cityMeta.name : t("toolbar.selectCity")}
        </button>

        <div className="flex-1" />

        {/* H3 Resolution */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5">
              <Hexagon className="h-3.5 w-3.5 text-muted-foreground" />
              <Select
                value={String(h3Resolution)}
                onValueChange={(v) => setH3Resolution(Number(v))}
              >
                <SelectTrigger className="h-8 w-24 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[7, 8, 9, 10, 11].map((r) => (
                    <SelectItem key={r} value={String(r)}>
                      {t("toolbar.res")} {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("toolbar.h3HexSize")} {H3_RES_INFO[h3Resolution]}</p>
            {h3Resolution >= 10 && (
              <p className="text-xs text-destructive-foreground">
                {t("toolbar.highResWarning")}
              </p>
            )}
          </TooltipContent>
        </Tooltip>

        {/* Theme selector */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Select
              value={theme}
              onValueChange={(value) =>
                setTheme(value as "light" | "dark" | "system")
              }
            >
              <SelectTrigger
                className="h-8 w-28 text-xs"
                aria-label={t("toolbar.chooseTheme")}
              >
                <span className="inline-flex items-center gap-2">
                  <SelectValue />
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <span className="inline-flex items-center gap-2">
                    <Sun className="h-3.5 w-3.5" />
                    {t("toolbar.light")}
                  </span>
                </SelectItem>
                <SelectItem value="dark">
                  <span className="inline-flex items-center gap-2">
                    <Moon className="h-3.5 w-3.5" />
                    {t("toolbar.dark")}
                  </span>
                </SelectItem>
                <SelectItem value="system">
                  <span className="inline-flex items-center gap-2">
                    <Monitor className="h-3.5 w-3.5" />
                    {t("toolbar.system")}
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </TooltipTrigger>
          <TooltipContent>
            {t("toolbar.chooseTheme")}
          </TooltipContent>
        </Tooltip>

        {/* Language selector */}
        <LanguageSelector />

        {/* Hex visibility */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={hexLayerVisible ? "ghost" : "secondary"}
              size="icon"
              disabled={isLoading}
              onClick={toggleHexLayerVisible}
              aria-label={hexLayerVisible ? t("toolbar.hideHexLayer") : t("toolbar.showHexLayer")}
            >
              {hexLayerVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {hexLayerVisible ? t("toolbar.hideHexes") : t("toolbar.showHexes")}
          </TooltipContent>
        </Tooltip>

        {/* POI visibility */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={poisLayerVisible ? "ghost" : "secondary"}
              size="icon"
              disabled={isLoading}
              onClick={togglePoisLayerVisible}
              aria-label={poisLayerVisible ? t("toolbar.hidePois") : t("toolbar.showPois")}
            >
              {poisLayerVisible ? (
                <MapPinOff className="h-4 w-4" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {poisLayerVisible ? t("toolbar.hidePois") : t("toolbar.showPois")}
          </TooltipContent>
        </Tooltip>

        {/* Search */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label={t("toolbar.searchCity")}
            >
              <Search className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("toolbar.searchCity")}</TooltipContent>
        </Tooltip>

        {/* Info */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setInfoOpen(true)}
              aria-label={t("toolbar.openInfo")}
            >
              <Info className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("toolbar.openInfo")}</TooltipContent>
        </Tooltip>

        {/* Settings */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              aria-label={t("toolbar.openSettings")}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("toolbar.settings")}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
