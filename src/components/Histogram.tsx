type Props = {
  data: Array<{ hour: number; departures: number }>;
};

export function Histogram({ data }: Props) {
  if (data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.departures), 1);

  return (
    <div className="flex items-end gap-px" style={{ height: 48 }}>
      {data.map((d) => (
        <div
          key={d.hour}
          className="flex flex-1 flex-col items-center"
          style={{ height: "100%" }}
        >
          <div className="flex flex-1 items-end w-full">
            <div
              className="w-full rounded-t-sm bg-primary/70"
              style={{ height: `${(d.departures / max) * 100}%` }}
              title={`${d.hour}:00 — ${d.departures} dep`}
            />
          </div>
          <span className="mt-0.5 text-[8px] text-muted-foreground/60">
            {d.hour}
          </span>
        </div>
      ))}
    </div>
  );
}
