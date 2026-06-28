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
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
}

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target[1], target[0]], 4, { duration: 1.0 });
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
      zoomControl
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OSM &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
      />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
        opacity={0.55}
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
                <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  {CATEGORY_META[key].label}
                </div>
                <div className="font-medium text-foreground">{ev.title}</div>
                <div className="text-[11px] text-muted-foreground mono-num">
                  {timeAgo(latestDate(ev))} ago
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
