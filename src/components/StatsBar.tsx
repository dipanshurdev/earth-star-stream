import { useMemo } from "react";
import { type EonetEvent, CATEGORY_META, categorizeEvent, type EventCategoryKey } from "@/lib/nasa";

export function StatsBar({ events }: { events: EonetEvent[] }) {
  const counts = useMemo(() => {
    const c: Record<EventCategoryKey, number> = {
      volcanoes: 0,
      wildfires: 0,
      severeStorms: 0,
      seaLakeIce: 0,
      other: 0,
    };

    
    for (const ev of events) c[categorizeEvent(ev)]++;
    return c;
  }, [events]);

  const total = events.length || 1;
  const keys = Object.keys(CATEGORY_META) as EventCategoryKey[];
  

  return (
    <div className="surface rounded-lg p-5">
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-5 items-end">
        <div className="col-span-2 sm:col-span-1">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Active</div>
          <div className="font-display font-semibold text-4xl text-foreground mono-num leading-none mt-1">
            {events.length}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">events worldwide</div>
        </div>
        {keys.map((k) => {
          const meta = CATEGORY_META[k];
          const Icon = meta.icon;
          const pct = (counts[k] / total) * 100;
          const {color, label, logo, short} = meta 
          return (
            <div key={k}>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground mono-num">
                <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} aria-hidden />
                {meta.short}
              </div>
              <div className="font-display font-semibold text-2xl mono-num mt-1 leading-none">
                {counts[k]}
              </div>
              <div className="mt-2 h-0.5 bg-hairline overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: meta.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
