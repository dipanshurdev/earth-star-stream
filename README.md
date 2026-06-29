# Cosmic Earth Monitor

A real-time interactive dashboard that tracks Earth's natural events on a live map and pairs them with NASA's astronomy imagery. Built with a minimal, production-grade aesthetic — matte black, electric blue, and bone white.

> Track Earth's pulse in real time, set against the cosmos.

---

## Features

- **Live Interactive Map** — Wildfires, volcanoes, storms, sea & lake ice, and other natural events from NASA EONET, plotted on a dark Leaflet basemap with category-coloured markers.
- **APOD Gallery** — NASA's Astronomy Picture of the Day, plus a rolling window of recent entries.
- **Events Feed** — Searchable, filterable stream of the latest events with click-to-focus on the map.
- **Statistics Bar** — Live counts and category distribution across the active dataset.
- **Event Details Panel** — Source links, categories, coordinates, and timeline for any selected event.
- **Smart Filtering** — Per-category layer toggles and full-text search across titles and categories.
- **Auto-refresh** — Pulls fresh EONET data every 3 minutes.

## Tech Stack

- **Framework**: React 19 + TanStack Start (Vite 7)
- **Styling**: Tailwind CSS v4 with semantic design tokens
- **Map**: Leaflet + React-Leaflet (dark CARTO basemap)
- **HTTP**: Axios
- **UI Primitives**: shadcn/ui (Radix)
- **Fonts**: Urbanist (display) + Epilogue (body)

## Data Sources

| Source | Purpose | Auth |
| --- | --- | --- |
| [NASA EONET v3](https://eonet.gsfc.nasa.gov/) | Natural events (wildfires, storms, volcanoes, ice…) | None |
| [NASA APOD](https://apod.nasa.gov/) | Astronomy Picture of the Day | `DEMO_KEY` (rate-limited) |

To raise the APOD rate limit, request a free key at [api.nasa.gov](https://api.nasa.gov/) and wire it into `src/lib/nasa.ts`.

## Getting Started

```bash
# install
bun install

# dev server (http://localhost:8080)
bun run dev

# production build
bun run build
```

## Project Structure

```
src/
├── routes/
│   ├── __root.tsx        # App shell, fonts, head tags
│   └── index.tsx         # Dashboard composition
├── components/
│   ├── Sidebar.tsx       # Brand, search, nav, event-layer filters
│   ├── TopBar.tsx        # Status, refresh time, totals
│   ├── CosmicMap.tsx     # Leaflet map (client-only via lazy)
│   ├── EventsFeed.tsx    # Scrollable live feed
│   ├── EventDetailsPanel.tsx
│   ├── ApodGallery.tsx
│   └── StatsBar.tsx
├── lib/
│   └── nasa.ts           # EONET + APOD clients, category metadata
└── styles.css            # Tailwind v4 tokens + Leaflet overrides
```

## Design System

| Token | Value | Usage |
| --- | --- | --- |
| Background | `#0a0a0a` | App surface |
| Primary | `#2563eb` | Accents, active state |
| Foreground | `#f5f5f5` | Body text |
| Surface / Hairline | tonal slate | Cards, borders |

All colours are exposed as CSS variables in `src/styles.css` — components consume semantic classes (`bg-surface`, `text-muted-foreground`) rather than hardcoded values.

## Notes

- The map uses `lazy()` because Leaflet touches `window` at import time; the route opts out of SSR (`ssr: false`).
- Events auto-refresh every 3 minutes; manual refresh happens on any error retry.
- Category filters are client-side; the EONET fetch pulls the last 30 days, up to 250 events.

## License

MIT — data © NASA / public domain.
