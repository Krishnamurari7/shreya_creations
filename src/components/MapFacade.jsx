"use client";

import { useState } from "react";
import OptimizedImage from "@/components/OptimizedImage";
import { cn } from "@/lib/utils";

/** Facade map — static preview, iframe loads only on click (PHASE 7.9). */
export default function MapFacade({
  embedUrl,
  title = "Studio location map",
  address,
  className = "",
}) {
  const [active, setActive] = useState(false);

  if (!embedUrl) return null;

  const mapsLink = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : embedUrl.replace("/embed", "").replace("output=embed", "output=classic");

  if (active) {
    return (
      <div className={cn("map-facade map-facade--live", className)}>
        <iframe
          src={embedUrl}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="map-facade__iframe"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={cn("map-facade map-facade--preview", className)}
      onClick={() => setActive(true)}
      aria-label={`${title} — click to load interactive map`}
    >
      <OptimizedImage
        src="/boutique.webp"
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 480px"
        className="map-facade__preview-img object-cover"
        loading="lazy"
      />
      <span className="map-facade__overlay" aria-hidden />
      <span className="map-facade__cta">
        <span className="map-facade__pin" aria-hidden>📍</span>
        <span className="map-facade__cta-text">Tap to load map</span>
      </span>
      <a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="map-facade__external"
        onClick={(e) => e.stopPropagation()}
      >
        Open in Google Maps ↗
      </a>
    </button>
  );
}
