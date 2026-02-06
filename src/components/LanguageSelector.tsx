import { useStore } from "@/app/store";
import { useTranslation, LOCALES } from "@/i18n";
import type { Locale } from "@/i18n";
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
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function LanguageSelector() {
  const locale = useStore((s) => s.locale);
  const setLocale = useStore((s) => s.setLocale);
  const { t } = useTranslation();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1.5">
          <Select
            value={locale}
            onValueChange={(v) => setLocale(v as Locale)}
          >
            <SelectTrigger
              className="h-8 w-32 text-xs"
              aria-label={t("toolbar.selectLanguage")}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LOCALES.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  <span className="inline-flex items-center gap-2">
                    <span>{l.flag}</span>
                    {l.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TooltipTrigger>
      <TooltipContent>{t("toolbar.selectLanguage")}</TooltipContent>
    </Tooltip>
  );
}
