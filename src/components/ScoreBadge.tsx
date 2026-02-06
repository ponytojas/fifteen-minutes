type Props = {
  score: number; // 0..1
  size?: "sm" | "lg";
};

export function ScoreBadge({ score, size = "sm" }: Props) {
  const pct = Math.round(score * 100);
  const hue = score * 120; // 0=red, 60=yellow, 120=green

  const sizeClasses =
    size === "lg"
      ? "h-12 w-12 text-lg font-bold"
      : "h-7 w-7 text-xs font-semibold";

  return (
    <div
      className={`flex items-center justify-center rounded-full ${sizeClasses}`}
      style={{
        backgroundColor: `hsl(${hue}, 70%, 35%)`,
        color: "white",
      }}
    >
      {pct}
    </div>
  );
}
