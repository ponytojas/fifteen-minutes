import { useCallback } from "react";
import { useStore } from "@/app/store";
import en from "./en";
import es from "./es";
import de from "./de";
import type { Locale, TranslationDictionary } from "./types";

const dictionaries: Record<Locale, TranslationDictionary> = { en, es, de };

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

export function useTranslation() {
  const locale = useStore((s) => s.locale);

  const t = useCallback(
    (key: string): string => {
      const dict = dictionaries[locale];
      if (key in dict) return dict[key as keyof TranslationDictionary];

      // Fallback to English
      if (locale !== "en" && key in en)
        return en[key as keyof TranslationDictionary];

      // Fallback to raw key (last segment after dot)
      return key.includes(".") ? key.split(".").pop()! : key;
    },
    [locale],
  );

  return { t, locale };
}

export type { Locale, TranslationKey } from "./types";
