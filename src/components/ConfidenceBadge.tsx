import { useTranslation } from "@/i18n";

type Props = {
  confidence: "high" | "medium" | "low";
};

const COLORS = {
  high: "bg-emerald-600/80 text-emerald-100",
  medium: "bg-yellow-600/80 text-yellow-100",
  low: "bg-red-600/80 text-red-100",
} as const;

export function ConfidenceBadge({ confidence }: Props) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${COLORS[confidence]}`}
    >
      {t(`confidence.${confidence}`)}
    </span>
  );
}
