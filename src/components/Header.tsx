import { Search, Globe2, Radio } from "lucide-react";
import { type EventCategoryKey, CATEGORY_META } from "@/lib/nasa";

export function Header({
  query,
  setQuery,
  filters,
  toggleFilter,
  lastUpdate,
}: {
  query: string;
  setQuery: (v: string) => void;
  filters: Set<EventCategoryKey>;
  toggleFilter: (k: EventCategoryKey) => void;
  lastUpdate: Date | null;
}) {
  const keys = Object.keys(CATEGORY_META) as EventCategoryKey[];
  return (
    <header className="relative z-10">
      <div className="glass rounded-xl px-4 py-3 grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl grid place-items-center shrink-0 bg-gradient-to-br from-cyan to-purple">
            <Globe2 className="w-5 h-5 text-background" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-lg leading-none truncate">
              Cosmic Earth <span className="text-cyan text-glow">Monitor</span>
            </h1>
            <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1.5">
              <Radio className="w-2.5 h-2.5 text-cyan animate-pulse" />
              {lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString()}` : "Connecting to NASA…"}
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 col-start-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events…"
              className="w-full pl-9 pr-3 py-2 bg-input/60 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="hidden md:flex flex-wrap gap-1.5 justify-end">
          {keys.map((k) => {
            const m = CATEGORY_META[k];
            const active = filters.has(k);
            return (
              <button
                key={k}
                onClick={() => toggleFilter(k)}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition border"
                style={{
                  background: active ? `${m.color}25` : "transparent",
                  color: active ? m.color : "var(--color-muted-foreground)",
                  borderColor: active ? `${m.color}60` : "var(--color-border)",
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* mobile search row */}
      <div className="mt-2 sm:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events…"
            className="w-full pl-9 pr-3 py-2 bg-input/60 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2 md:hidden">
          {keys.map((k) => {
            const m = CATEGORY_META[k];
            const active = filters.has(k);
            return (
              <button
                key={k}
                onClick={() => toggleFilter(k)}
                className="px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider border"
                style={{
                  background: active ? `${m.color}25` : "transparent",
                  color: active ? m.color : "var(--color-muted-foreground)",
                  borderColor: active ? `${m.color}60` : "var(--color-border)",
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
