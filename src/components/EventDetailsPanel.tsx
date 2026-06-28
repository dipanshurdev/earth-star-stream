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
    <div className="absolute right-3 top-3 bottom-3 w-[340px] max-w-[90vw] glass rounded-xl p-5 flex flex-col z-[500] animate-[fade-in_0.25s_ease-out]">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-secondary transition"
        aria-label="Close details"
      >
        <X className="w-4 h-4" />
      </button>

      <div
        className="inline-flex items-center gap-2 self-start px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold"
        style={{ background: `${meta.color}25`, color: meta.color }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
        {meta.label}
      </div>

      <h2 className="font-display font-bold text-lg mt-3 leading-tight pr-6">{event.title}</h2>

      <div className="mt-4 space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-cyan" />
          <span>{new Date(date).toUTCString()}</span>
        </div>
        {coord && (
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-cyan" />
            <span>
              {coord[1].toFixed(3)}°, {coord[0].toFixed(3)}°
            </span>
          </div>
        )}
      </div>

      {event.description && (
        <p className="mt-4 text-sm leading-relaxed text-foreground/90 overflow-y-auto">
          {event.description}
        </p>
      )}

      {event.sources.length > 0 && (
        <div className="mt-4">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
            Sources
          </div>
          <div className="flex flex-wrap gap-1.5">
            {event.sources.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="px-2 py-1 rounded-md bg-secondary text-xs hover:bg-accent transition"
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
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Learn more
        </a>
        <button
          onClick={share}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs hover:bg-secondary transition"
        >
          <Share2 className="w-3.5 h-3.5" />
          {copied ? "Copied!" : "Share"}
        </button>
      </div>
    </div>
  );
}
