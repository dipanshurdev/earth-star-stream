/** NASA API helpers — EONET (natural events) and APOD (astronomy picture of the day). */

export type EonetCategory = { id: string; title: string };

export type EonetGeometry = {
  date: string;
  type: string;
  coordinates: number[] | number[][];
};

export type EonetEvent = {
  id: string;
  title: string;
  description: string | null;
  link: string;
  closed: string | null;
  categories: EonetCategory[];
  sources: { id: string; url: string }[];
  geometry: EonetGeometry[];
};

export type ApodImage = {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: "image" | "video";
  copyright?: string;
};

export type EventCategoryKey =
  | "volcanoes"
  | "wildfires"
  | "severeStorms"
  | "seaLakeIce"
  | "other";

export const CATEGORY_META: Record<
  EventCategoryKey,
  { label: string; short: string; color: string; eonetIds: string[] }
> = {
  volcanoes: { label: "Volcanoes", short: "VOLC", color: "#ef4444", eonetIds: ["volcanoes"] },
  wildfires: { label: "Wildfires", short: "FIRE", color: "#f59e0b", eonetIds: ["wildfires"] },
  severeStorms: { label: "Storms", short: "STRM", color: "#eab308", eonetIds: ["severeStorms"] },
  seaLakeIce: { label: "Sea Ice", short: "ICE", color: "#60a5fa", eonetIds: ["seaLakeIce"] },
  other: {
    label: "Other",
    short: "OTHR",
    color: "#a3a3a3",
    eonetIds: ["drought", "dustHaze", "earthquakes", "floods", "landslides", "manmade", "snow", "tempExtremes", "waterColor"],
  },
};

export function categorizeEvent(ev: EonetEvent): EventCategoryKey {
  const id = ev.categories[0]?.id ?? "";
  for (const key of Object.keys(CATEGORY_META) as EventCategoryKey[]) {
    if (CATEGORY_META[key].eonetIds.includes(id)) return key;
  }
  return "other";
}

export function latestCoord(ev: EonetEvent): [number, number] | null {
  const g = ev.geometry[ev.geometry.length - 1];
  if (!g) return null;
  const c = g.coordinates;
  if (typeof c[0] === "number") return [c[0] as number, c[1] as number];
  const first = (c as number[][])[0];
  return Array.isArray(first) ? [first[0], first[1]] : null;
}

export function latestDate(ev: EonetEvent): string {
  return ev.geometry[ev.geometry.length - 1]?.date ?? "";
}

export async function fetchEvents(days = 30, limit = 200): Promise<EonetEvent[]> {
  const res = await fetch(
    `https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=${days}&limit=${limit}`,
  );
  if (!res.ok) throw new Error(`EONET request failed (${res.status})`);
  const data = (await res.json()) as { events: EonetEvent[] };
  return data.events;
}

export async function fetchApod(date?: string): Promise<ApodImage> {
  const url = new URL("https://api.nasa.gov/planetary/apod");
  url.searchParams.set("api_key", "DEMO_KEY");
  if (date) url.searchParams.set("date", date);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`APOD request failed (${res.status})`);
  return (await res.json()) as ApodImage;
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (!then) return "—";
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}
