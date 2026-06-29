import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback, lazy, Suspense } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
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

// Leaflet touches `window` at import-time — load it client-only.
const CosmicMap = lazy(() =>
  import("@/components/CosmicMap").then((m) => ({ default: m.CosmicMap })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cosmic Earth Monitor — Real-time Natural Events & Space Imagery" },
      {
        name: "description",
        content:
          "Minimal real-time dashboard tracking Earth's natural events alongside NASA's astronomy picture of the day.",
      },
      { property: "og:title", content: "Cosmic Earth Monitor" },
      {
        property: "og:description",
        content: "Track Earth's pulse in real time, set against the cosmos.",
      },
    ],
  }),
  ssr: false,
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
    <div className="flex min-h-screen bg-background">
      <Sidebar
        query={query}
        setQuery={setQuery}
        filters={filters}
        toggleFilter={toggleFilter}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          query={query}
          setQuery={setQuery}
          filters={filters}
          toggleFilter={toggleFilter}
          lastUpdate={lastUpdate}
          total={searched.length}
        />

        <main className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6">
          {error && (
            <div className="surface rounded-lg px-4 py-3 text-[12.5px] text-destructive flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={load}
                className="text-[11px] uppercase tracking-[0.18em] hover:text-foreground cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          <StatsBar events={searched} />

          <div id="map" className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-4 sm:gap-6 scroll-mt-20">
            {/* Map */}
            <div className="surface rounded-lg overflow-hidden relative h-[62vh] xl:h-[68vh]">
              {loading && (
                <div className="absolute inset-0 grid place-items-center z-[400] bg-background/40">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
                    Scanning Earth
                  </div>
                </div>
              )}
              <Suspense fallback={<div className="w-full h-full bg-surface-2 animate-pulse" />}>
                <CosmicMap
                  events={searched}
                  activeFilters={filters}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                  flyToCoord={flyTo}
                />
              </Suspense>
              {selected && (
                <EventDetailsPanel event={selected} onClose={() => setSelectedId(null)} />
              )}
            </div>

            {/* Right rail */}
            <div id="gallery" className="space-y-4 sm:space-y-6 scroll-mt-20">
              <ApodGallery />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-4 sm:gap-6">
            <div id="events" className="h-[44vh] scroll-mt-20">
              <EventsFeed
                events={searched}
                activeFilters={filters}
                selectedId={selectedId}
                onSelect={handleSelect}
              />
            </div>
            <div />
          </div>
        </main>

        <footer className="px-4 sm:px-6 py-4 border-t border-border text-[11px] text-muted-foreground flex flex-wrap items-center gap-4 justify-between">
          <div>
            Data ·{" "}
            <a
              className="hover:text-foreground transition"
              href="https://eonet.gsfc.nasa.gov/"
              target="_blank"
              rel="noreferrer"
            >
              NASA EONET
            </a>{" "}
            ·{" "}
            <a
              className="hover:text-foreground transition"
              href="https://apod.nasa.gov/"
              target="_blank"
              rel="noreferrer"
            >
              APOD
            </a>
          </div>
          <div className="uppercase tracking-[0.2em] text-[10px]">
            Cosmic Earth Monitor · v1.0
          </div>
        </footer>
      </div>
    </div>
  );
}
