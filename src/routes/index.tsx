import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { CosmicMap } from "@/components/CosmicMap";
import { ApodGallery } from "@/components/ApodGallery";
import { EventsFeed } from "@/components/EventsFeed";
import { EventDetailsPanel } from "@/components/EventDetailsPanel";
import { StatsBar } from "@/components/StatsBar";
import {
  fetchEvents,
  type EonetEvent,
  type EventCategoryKey,
  CATEGORY_META,
  latestCoord,
} from "@/lib/nasa";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cosmic Earth Monitor — Real-time Natural Events & Space Imagery" },
      {
        name: "description",
        content:
          "Live dashboard of Earth's natural events (wildfires, volcanoes, storms) plotted on an interactive map alongside NASA's astronomy picture of the day.",
      },
      { property: "og:title", content: "Cosmic Earth Monitor" },
      {
        property: "og:description",
        content: "Track Earth's pulse in real time, set against the cosmos.",
      },
    ],
  }),
  component: Dashboard,
});

const ALL_KEYS = Object.keys(CATEGORY_META) as EventCategoryKey[];

function Dashboard() {
  const [events, setEvents] = useState<EonetEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Set<EventCategoryKey>>(new Set(ALL_KEYS));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchEvents(30, 250);
      setEvents(data);
      setLastUpdate(new Date());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 3 * 60 * 1000);
    return () => clearInterval(t);
  }, [load]);

  const toggleFilter = (k: EventCategoryKey) => {
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const searched = useMemo(() => {
    if (!query.trim()) return events;
    const q = query.toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.categories.some((c) => c.title.toLowerCase().includes(q)),
    );
  }, [events, query]);

  const selected = useMemo(
    () => events.find((e) => e.id === selectedId) ?? null,
    [events, selectedId],
  );

  const handleSelect = (ev: EonetEvent) => {
    setSelectedId(ev.id);
    const c = latestCoord(ev);
    if (c) setFlyTo([c[0], c[1]]);
  };

  return (
    <div className="starfield min-h-screen relative">
      <div className="relative z-10 max-w-[1600px] mx-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        <Header
          query={query}
          setQuery={setQuery}
          filters={filters}
          toggleFilter={toggleFilter}
          lastUpdate={lastUpdate}
        />

        <StatsBar events={searched} />

        {error && (
          <div className="glass rounded-xl px-4 py-3 text-sm text-destructive">
            {error} —{" "}
            <button onClick={load} className="underline">
              retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-3 sm:gap-4">
          <div className="relative h-[58vh] lg:h-[70vh] rounded-xl overflow-hidden glass">
            {loading && (
              <div className="absolute inset-0 grid place-items-center z-[400]">
                <div className="text-xs text-muted-foreground animate-pulse">
                  Scanning Earth…
                </div>
              </div>
            )}
            <CosmicMap
              events={searched}
              activeFilters={filters}
              selectedId={selectedId}
              onSelect={handleSelect}
              flyToCoord={flyTo}
            />
            {selected && (
              <EventDetailsPanel event={selected} onClose={() => setSelectedId(null)} />
            )}
          </div>

          <div className="h-[70vh] hidden lg:block">
            <ApodGallery />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-3 sm:gap-4">
          <div className="h-[50vh] lg:h-[40vh]">
            <EventsFeed
              events={searched}
              activeFilters={filters}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          </div>
          <div className="lg:hidden h-[60vh]">
            <ApodGallery />
          </div>
        </div>

        <footer className="text-center text-[11px] text-muted-foreground py-4">
          Data: NASA{" "}
          <a className="text-cyan hover:underline" href="https://eonet.gsfc.nasa.gov/" target="_blank" rel="noreferrer">
            EONET
          </a>{" "}
          ·{" "}
          <a className="text-cyan hover:underline" href="https://apod.nasa.gov/" target="_blank" rel="noreferrer">
            APOD
          </a>{" "}
          · Map tiles © CARTO & OpenStreetMap
        </footer>
      </div>
    </div>
  );
}
