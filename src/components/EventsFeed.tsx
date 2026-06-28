import { useMemo } from "react";
import {
  type EonetEvent,
  type EventCategoryKey,
  CATEGORY_META,
  categorizeEvent,
  latestDate,
  timeAgo,
} from "@/lib/nasa";

export function EventsFeed({
  events,
  activeFilters,
  selectedId,
  onSelect,
}: {
  events: EonetEvent[];
  activeFilters: Set<EventCategoryKey>;
  selectedId: string | null;
  onSelect: (ev: EonetEvent) => void;
}) {
  const list = useMemo(
    () =>
      events
        .filter((e) => activeFilters.has(categorizeEvent(e)))
        .sort((a, b) => (latestDate(b) > latestDate(a) ? 1 : -1))
        .slice(0, 30),
    [events, activeFilters],
  );

  return (
    <div className="glass rounded-xl h-full flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-sm tracking-wide">Live Events</h2>
        <span className="text-[10px] text-muted-foreground">{list.length} showing</span>
      </div>
      <div className="overflow-y-auto flex-1 divide-y divide-border">
        {list.length === 0 && (
          <div className="p-6 text-center text-xs text-muted-foreground">
            No events match the current filters.
          </div>
        )}
        {list.map((ev) => {
          const key = categorizeEvent(ev);
          const meta = CATEGORY_META[key];
          const active = selectedId === ev.id;
          return (
            <button
              key={ev.id}
              onClick={() => onSelect(ev)}
              className={`w-full text-left px-4 py-3 hover:bg-secondary/40 transition flex gap-3 items-start ${
                active ? "bg-secondary/60" : ""
              }`}
            >
              <span
                className="mt-1 w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: meta.color, boxShadow: `0 0 10px ${meta.color}` }}
              />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase tracking-widest" style={{ color: meta.color }}>
                  {meta.label}
                </div>
                <div className="text-sm font-medium truncate">{ev.title}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {timeAgo(latestDate(ev))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
