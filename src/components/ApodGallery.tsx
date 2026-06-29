import { useEffect, useState } from "react";
import { fetchApod, type ApodImage } from "@/lib/nasa";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  return (
    <section className="surface rounded-lg overflow-hidden flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-hairline">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            NASA · APOD
          </div>
          <h2 className="font-display font-semibold text-sm mt-0.5">Today in Space</h2>
        </div>
        <div className="flex">
          <button
            onClick={() => setOffset((o) => o + 1)}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition border border-hairline rounded-l-md cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setOffset((o) => Math.max(0, o - 1))}
            disabled={offset === 0}
            className="cursor-pointer p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition border border-l-0 border-hairline rounded-r-md disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Next"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <div className="relative aspect-[16/10] bg-surface-2 overflow-hidden">
        {loading && <div className="absolute inset-0 animate-pulse bg-surface-2" />}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground p-4 text-center">
            Unable to reach NASA APOD
          </div>
        )}
        {apod && apod.media_type === "image" && (
          <img
            key={apod.url}
            src={apod.url}
            alt={apod.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        )}
        {apod && apod.media_type === "video" && (
          <iframe src={apod.url} title={apod.title} className="w-full h-full" allow="encrypted-media" />
        )}
      </div>

      <div className="p-4">
        {apod && (
          <>
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary mono-num mb-1.5">
              {apod.date}
            </div>
            <h3 className="font-display font-semibold text-[15px] leading-snug">{apod.title}</h3>
            <p className="mt-2 text-[12.5px] text-muted-foreground leading-relaxed line-clamp-4">
              {apod.explanation}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
