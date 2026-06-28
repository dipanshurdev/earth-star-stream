import { X, ExternalLink, Share2, MapPin, Calendar } from "lucide-react";
import {
  type EonetEvent,
  CATEGORY_META,
  categorizeEvent,
  latestCoord,
  latestDate,
} from "@/lib/nasa";
import { useState } from "react";

export function EventDetailsPanel({
  event,
  onClose,
}: {
  event: EonetEvent;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const key = categorizeEvent(event);
  const meta = CATEGORY_META[key];
  const coord = latestCoord(event);
  const date = latestDate(event);

  const share = async () => {
    const text = `${event.title}\n${meta.label} · ${new Date(date).toUTCString()}\n${event.link}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="absolute right-4 top-4 bottom-4 w-[320px] max-w-[calc(100%-2rem)] surface rounded-lg p-5 flex flex-col z-[500] shadow-2xl">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-foreground transition"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
        {meta.label}
      </div>

      <h2 className="font-display font-semibold text-lg mt-2 leading-tight pr-6">
        {event.title}
      </h2>

      <div className="mt-4 space-y-2 text-[12px] text-muted-foreground mono-num">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date(date).toUTCString()}</span>
        </div>
        {coord && (
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>
              {coord[1].toFixed(3)}°, {coord[0].toFixed(3)}°
            </span>
          </div>
        )}
      </div>

      {event.description && (
        <p className="mt-4 text-[13px] leading-relaxed text-foreground/80 overflow-y-auto">
          {event.description}
        </p>
      )}

      {event.sources.length > 0 && (
        <div className="mt-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Sources
          </div>
          <div className="flex flex-wrap gap-1.5">
            {event.sources.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="px-2 py-1 text-[11px] border border-hairline rounded hover:border-primary hover:text-primary transition"
              >
                {s.id}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto pt-4 flex gap-2">
        <a
          href={event.link}
          target="_blank"
          rel="noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-primary text-primary-foreground text-[12px] font-medium hover:opacity-90 transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Learn more
        </a>
        <button
          onClick={share}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded border border-hairline text-[12px] hover:border-primary hover:text-primary transition"
        >
          <Share2 className="w-3.5 h-3.5" />
          {copied ? "Copied" : "Share"}
        </button>
      </div>
    </div>
  );
}
