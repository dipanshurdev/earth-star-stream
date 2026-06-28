import { useEffect, useState } from "react";
import { fetchApod, type ApodImage } from "@/lib/nasa";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

function dateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function ApodGallery() {
  const [offset, setOffset] = useState(0);
  const [apod, setApod] = useState<ApodImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchApod(dateOffset(offset))
      .then((d) => !cancelled && setApod(d))
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [offset]);

  // Auto-rotate every 30s
  useEffect(() => {
    const t = setInterval(() => setOffset((o) => o + 1), 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="glass rounded-xl overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan" />
          <h2 className="font-semibold text-sm tracking-wide">Cosmic Gallery</h2>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setOffset((o) => o + 1)}
            className="p-1.5 rounded-md hover:bg-secondary transition"
            aria-label="Previous picture"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setOffset((o) => Math.max(0, o - 1))}
            disabled={offset === 0}
            className="p-1.5 rounded-md hover:bg-secondary transition disabled:opacity-30"
            aria-label="Next picture"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative aspect-video bg-muted overflow-hidden">
        {loading && <div className="absolute inset-0 animate-pulse bg-muted" />}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground p-4 text-center">
            Unable to reach NASA APOD — try again shortly.
          </div>
        )}
        {apod && apod.media_type === "image" && (
          <img
            key={apod.url}
            src={apod.url}
            alt={apod.title}
            loading="lazy"
            className="w-full h-full object-cover animate-[fade-in_0.5s_ease-out]"
          />
        )}
        {apod && apod.media_type === "video" && (
          <iframe
            src={apod.url}
            title={apod.title}
            className="w-full h-full"
            allow="encrypted-media"
          />
        )}
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {apod && (
          <>
            <div className="text-[10px] uppercase tracking-widest text-cyan mb-1">{apod.date}</div>
            <h3 className="font-display font-semibold text-base leading-snug mb-2">{apod.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-6">
              {apod.explanation}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
