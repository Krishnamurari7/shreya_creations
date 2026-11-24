"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { ADMIN_INPUT, ADMIN_LABEL } from "@/lib/admin/formClasses";
import { PORTFOLIO as SEED_PORTFOLIO } from "@/lib/seed";
import { listStorageGalleryImages } from "@/lib/supabase/storage-gallery";

function galleryAsset(row, source, index) {
  const image = source === "portfolio" ? row.image : row.public_url;
  if (!image) return null;

  const title = source === "portfolio"
    ? row.title || row.caption || `Gallery photo ${index + 1}`
    : row.alt_text_en || `Media photo ${index + 1}`;

  return {
    id: String(row.id ?? image),
    source,
    image,
    title,
    titleHi: source === "media" ? row.alt_text_hi || "" : row.title_hi || "",
    alt: source === "portfolio" ? row.image_alt || title : row.alt_text_en || title,
    altHi: source === "media" ? row.alt_text_hi || "" : row.image_alt_hi || "",
    category: source === "portfolio" ? row.category || "" : "",
  };
}

export default function HomeAwardGalleryPicker({ items = [], onChange }) {
  const configured = isSupabaseConfigured();
  const [source, setSource] = useState("portfolio");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState({ portfolio: [], media: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!configured) return;
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const [portfolio, media, stored] = await Promise.all([
        supabase.from("portfolio").select("*").order("sort_order", { ascending: true }),
        supabase.from("media_library").select("*").order("created_at", { ascending: false }),
        listStorageGalleryImages(supabase)
          .then((data) => ({ data, error: null }))
          .catch((error) => ({ data: [], error })),
      ]);
      const mediaRows = [...(media.data || [])];
      const registered = new Set(mediaRows.map((row) => row.file_path || row.public_url));
      for (const row of stored.data) {
        if (!registered.has(row.file_path) && !registered.has(row.public_url)) mediaRows.push(row);
      }
      setRows({
        portfolio: portfolio.data?.length ? portfolio.data : SEED_PORTFOLIO,
        media: mediaRows,
      });
      const problems = [];
      if (portfolio.error) problems.push(`Portfolio Gallery: ${portfolio.error.message}`);
      if (media.error && stored.data.length) problems.push("Media Library metadata is unavailable; photos are loaded from Supabase Storage.");
      else if (media.error) problems.push(`Media Library: ${media.error.message}`);
      if (stored.error && !mediaRows.length) problems.push(`Media Storage: ${stored.error.message}`);
      setError(problems.join(" · "));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load Gallery photos.");
      setRows({ portfolio: SEED_PORTFOLIO, media: [] });
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    load();
  }, [load]);

  const assets = useMemo(
    () => rows[source].map((row, index) => galleryAsset(row, source, index)).filter(Boolean),
    [rows, source]
  );
  const matches = assets.filter((asset) =>
    `${asset.title} ${asset.category} ${asset.alt}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
  );
  const selectedCount = items.filter((item) => item?.image).length;
  const isSelected = (asset) => items.some((item) =>
    item?.image === asset.image && (
      !item.gallery_source ||
      (item.gallery_source === asset.source && String(item.gallery_id) === asset.id)
    )
  );

  const toggle = (asset) => {
    if (isSelected(asset)) {
      onChange(items.filter((item) => !(
        item?.image === asset.image && (
          !item.gallery_source ||
          (item.gallery_source === asset.source && String(item.gallery_id) === asset.id)
        )
      )));
      return;
    }
    onChange([
      ...items,
      {
        image: asset.image,
        title: asset.title,
        title_hi: asset.titleHi,
        image_alt: asset.alt,
        image_alt_hi: asset.altHi,
        gallery_source: asset.source,
        gallery_id: asset.id,
      },
    ]);
  };

  return (
    <div className="rounded-xl border border-gold/20 p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={ADMIN_LABEL}>Choose photos from Gallery</p>
          <p className="admin-muted text-sm">Click a photo to add or remove it. {selectedCount} photo{selectedCount === 1 ? "" : "s"} selected.</p>
        </div>
        <div className="flex gap-3 text-sm">
          <button type="button" onClick={load} className="text-gold hover:underline" disabled={loading}>
            {loading ? "Loading…" : "Refresh gallery"}
          </button>
          {items.length > 0 && (
            <button type="button" onClick={() => onChange([])} className="text-marigold hover:underline">
              Clear carousel
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Gallery source">
        {[
          { key: "portfolio", label: "Portfolio Gallery" },
          { key: "media", label: "Media Library" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            aria-pressed={source === tab.key}
            onClick={() => { setSource(tab.key); setSearch(""); }}
            className={cn("rounded-full border px-3 py-1.5 text-sm", source === tab.key ? "border-gold bg-gold/15 text-gold" : "border-gold/20 admin-muted")}
          >
            {tab.label} ({rows[tab.key].filter((row) => tab.key === "portfolio" ? row.image : row.public_url).length})
          </button>
        ))}
      </div>

      <input
        type="search"
        className={ADMIN_INPUT}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search gallery photos"
        aria-label="Search gallery photos"
      />

      {error && <p className="text-sm text-marigold" role="alert">{error}</p>}
      {!loading && matches.length === 0 && (
        <p className="admin-muted text-sm">{search ? "No matching photos." : "No photos here yet. Add photos in Portfolio or Media Library, then refresh."}</p>
      )}
      {matches.length > 0 && (
        <div className="grid max-h-[28rem] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-4">
          {matches.map((asset) => {
            const selected = isSelected(asset);
            return (
              <button
                key={`${asset.source}:${asset.id}`}
                type="button"
                aria-pressed={selected}
                aria-label={`${selected ? "Remove" : "Add"} ${asset.title} ${selected ? "from" : "to"} awards carousel`}
                onClick={() => toggle(asset)}
                className={cn("overflow-hidden rounded-xl border text-left transition hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold", selected ? "border-gold bg-gold/10" : "border-gold/20")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset.image} alt="" loading="lazy" className="aspect-square w-full object-cover" />
                <span className="block truncate px-2 pt-2 text-sm font-medium" title={asset.title}>{asset.title}</span>
                <span className={cn("block px-2 pb-2 text-xs", selected ? "text-gold" : "admin-muted")}>{selected ? "✓ Showing on homepage" : "Add to carousel"}</span>
              </button>
            );
          })}
        </div>
      )}
      <p className="admin-muted text-xs">Use the list below to change captions or order, then Save all pages to publish.</p>
    </div>
  );
}
