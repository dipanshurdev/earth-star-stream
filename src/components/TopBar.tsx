import { Radio, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { type EventCategoryKey, CATEGORY_META } from "@/lib/nasa";

export function TopBar({
  query,
  setQuery,
  filters,
  toggleFilter,
  lastUpdate,
  total,
}: {
  query: string;
  setQuery: (v: string) => void;
  filters: Set<EventCategoryKey>;
  toggleFilter: (k: EventCategoryKey) => void;
  lastUpdate: Date | null;
  total: number;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const keys = Object.keys(CATEGORY_META) as EventCategoryKey[];

  return (
    <header className="border-b border-border bg-surface">
      <div className="flex items-center h-14 px-4 sm:px-6 gap-4">
        {/* Mobile brand */}
        <div className="lg:hidden flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded bg-primary shrink-0" />
          <span className="font-display font-semibold text-sm truncate">Cosmic Monitor</span>
        </div>

        {/* Desktop crumb */}
        <div className="hidden lg:flex items-center gap-3 text-[12px] text-muted-foreground">
          <span className="uppercase tracking-[0.2em] text-[10px]">Dashboard</span>
          <span className="text-hairline">/</span>
          <span className="text-foreground">Live Map</span>
        </div>

        {/* Status */}
        <div className="hidden md:flex items-center gap-2 ml-2 px-2.5 py-1 rounded border border-hairline">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-60" />
            <span className="relative rounded-full w-1.5 h-1.5 bg-primary" />
          </span>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground mono-num">
            Live · {total} events
          </span>
        </div>

        <div className="flex-1" />

        {/* Mobile search toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden p-2 rounded hover:bg-secondary transition"
          aria-label="Toggle filters"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Last update */}
        <div className="hidden sm:flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground mono-num">
          <Radio className="w-5 h-5 text-primary animate-pulse" />
          <span className="text-[15px]">

          {lastUpdate ? lastUpdate.toLocaleTimeString() : "—"}
          </span>
        </div>
      </div>

      {/* Mobile expanded controls */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-hairline px-4 py-3 space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events…"
              className="w-full pl-8 pr-3 py-2 bg-surface-2 border border-hairline rounded text-[12.5px] focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keys.map((k) => {
              const m = CATEGORY_META[k];
              const active = filters.has(k);
              return (
                <button
                  key={k}
                  onClick={() => toggleFilter(k)}
                  className={`px-2.5 py-1 text-[10.5px] uppercase tracking-[0.15em] rounded border transition ${
                    active
                      ? "border-primary text-foreground bg-primary/10"
                      : "border-hairline text-muted-foreground"
                  }`}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                    style={{ background: m.color }}
                  />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
