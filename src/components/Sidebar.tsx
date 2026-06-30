import { Globe, Activity, Image as ImageIcon, Search } from "lucide-react";
import { type EventCategoryKey, CATEGORY_META } from "@/lib/nasa";

const NAV = [
  { id: "map", label: "Live Map", icon: Globe },
  { id: "events", label: "Events Feed", icon: Activity },
  { id: "gallery", label: "APOD Gallery", icon: ImageIcon },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Sidebar({
  query,
  setQuery,
  filters,
  toggleFilter,
}: {
  query: string;
  setQuery: (v: string) => void;
  filters: Set<EventCategoryKey>;
  toggleFilter: (k: EventCategoryKey) => void;
}) {
  const keys = Object.keys(CATEGORY_META) as EventCategoryKey[];

  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 border-r border-border bg-surface">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-hairline">
        <div className="flex items-center gap-2.5">
          <div className="w-10 rounded grid place-items-center">
            {/* <Globe className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={2.5} /> */}
            <img className="w-full rounded-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo19f1Gjo2QimKoHJKD9bGYuH3QeMEzmZz5lJNY6x4dLasW0iS0bvihYY&s=10" alt="logo" />
          </div>
          <div>
            <div className="font-display font-semibold text-[15px] leading-none">Cosmic</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
              Earth Monitor
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events…"
            className="w-full pl-8 pr-3 py-2 bg-surface-2 border border-hairline rounded text-[12.5px] placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="px-2 py-4">
        <div className="px-3 mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Workspace
        </div>
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => scrollToId(item.id)}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-[13px] text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition cursor-pointer"
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={2} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Filters */}
      <div className="px-4 py-3 border-t border-hairline mt-[90%]">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
          Event Layers
        </div>
        <div className="space-y-1.5">
          {keys.map((k) => {
            const m = CATEGORY_META[k];
            const active = filters.has(k);
            return (
              <button
                key={k}
                onClick={() => toggleFilter(k)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-secondary transition group"
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="w-2 h-2 rounded-full transition"
                    style={{
                      background: active ? m.color : "transparent",
                      boxShadow: `inset 0 0 0 1px ${m.color}`,
                    }}
                  />
                  <span
                    className={`text-[12.5px] ${
                      active ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {m.label}
                  </span>
                </span>
                <span className="text-[10px] text-muted-foreground mono-num uppercase tracking-wider">
                  {active ? "ON" : "OFF"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
