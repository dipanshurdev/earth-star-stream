import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import {
  type EonetEvent,
  type EventCategoryKey,
  CATEGORY_META,
  categorizeEvent,
  latestCoord,
  latestDate,
  timeAgo,
} from "@/lib/nasa";

function makeIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div class="event-marker" style="color:${color};background:${color}"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target[1], target[0]], 5, { duration: 1.2 });
  }, [target, map]);
  return null;
}

type Props = {
  events: EonetEvent[];
  activeFilters: Set<EventCategoryKey>;
  selectedId: string | null;
  onSelect: (ev: EonetEvent) => void;
  flyToCoord: [number, number] | null;
};

export function CosmicMap({ events, activeFilters, selectedId, onSelect, flyToCoord }: Props) {
  const visible = useMemo(
    () => events.filter((e) => activeFilters.has(categorizeEvent(e))),
    [events, activeFilters],
  );

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      worldCopyJump
      style={{ height: "100%", width: "100%" }}
      className="rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <FlyTo target={flyToCoord} />
      {visible.map((ev) => {
        const coord = latestCoord(ev);
        if (!coord) return null;
        const key = categorizeEvent(ev);
        const color = CATEGORY_META[key].color;
        const isSelected = selectedId === ev.id;
        return (
          <Marker
            key={ev.id}
            position={[coord[1], coord[0]]}
            icon={makeIcon(color)}
            eventHandlers={{ click: () => onSelect(ev) }}
            zIndexOffset={isSelected ? 1000 : 0}
          >
            <Popup>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider opacity-70">
                  {CATEGORY_META[key].label}
                </div>
                <div className="font-semibold">{ev.title}</div>
                <div className="text-xs opacity-70">{timeAgo(latestDate(ev))}</div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
