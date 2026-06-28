import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { type EonetEvent, CATEGORY_META, categorizeEvent, type EventCategoryKey } from "@/lib/nasa";
import { Activity, Flame, Wind, Snowflake, Mountain } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const ICONS: Record<EventCategoryKey, typeof Activity> = {
  volcanoes: Mountain,
  wildfires: Flame,
  severeStorms: Wind,
  seaLakeIce: Snowflake,
  other: Activity,
};

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

  const keys = Object.keys(CATEGORY_META) as EventCategoryKey[];
  const data = {
    labels: keys.map((k) => CATEGORY_META[k].label),
    datasets: [
      {
        data: keys.map((k) => counts[k]),
        backgroundColor: keys.map((k) => CATEGORY_META[k].color),
        borderColor: "rgba(0,0,0,0)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="glass rounded-xl p-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="col-span-2 md:col-span-1">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Active</div>
          <div className="font-display font-bold text-3xl text-glow text-cyan">
            {events.length}
          </div>
          <div className="text-[10px] text-muted-foreground">events worldwide</div>
        </div>
        {keys.map((k) => {
          const Icon = ICONS[k];
          return (
            <div key={k} className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg grid place-items-center shrink-0"
                style={{ background: `${CATEGORY_META[k].color}20`, color: CATEGORY_META[k].color }}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-display font-bold text-lg leading-none">{counts[k]}</div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {CATEGORY_META[k].label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-24 h-24 mx-auto">
        <Doughnut
          data={data}
          options={{
            plugins: { legend: { display: false }, tooltip: { enabled: true } },
            cutout: "65%",
          }}
        />
      </div>
    </div>
  );
}
