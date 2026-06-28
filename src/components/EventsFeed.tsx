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
        .sort((a, b) => (latestDate(b) > latestDate(a) ? 1 : -1)),
    [events, activeFilters],
  );

  return (
    <section className="surface rounded-lg flex flex-col overflow-hidden h-full">
      <header className="px-4 py-3 border-b border-hairline flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Live Feed
          </div>
          <h2 className="font-display font-semibold text-sm mt-0.5">Active Events</h2>
        </div>
        <span className="text-[11px] text-muted-foreground mono-num">{list.length}</span>
      </header>
      <div className="overflow-y-auto flex-1">
        {list.length === 0 && (
          <div className="p-6 text-center text-xs text-muted-foreground">
            No events match the current filters.
          </div>
        )}
        <ul>
          {list.map((ev) => {
            const key = categorizeEvent(ev);
            const meta = CATEGORY_META[key];
            const active = selectedId === ev.id;
            return (
              <li key={ev.id}>
                <button
                  onClick={() => onSelect(ev)}
                  className={`w-full text-left px-4 py-3 hover:bg-secondary transition flex gap-3 items-start border-l-2 ${
                    active ? "bg-secondary border-primary" : "border-transparent"
                  }`}
                >
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: meta.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground mono-num">
                      <span>{meta.short}</span>
                      <span className="w-px h-2 bg-hairline" />
                      <span>{timeAgo(latestDate(ev))}</span>
                    </div>
                    <div className="text-[13px] font-medium truncate text-foreground mt-0.5">
                      {ev.title}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
