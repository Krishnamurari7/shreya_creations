"use client";

import { cn } from "@/lib/utils";

function buildMapsLink(address, embedUrl) {
  if (address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }
  if (embedUrl) {
    return embedUrl.replace("/embed", "").replace("output=embed", "output=classic");
  }
  return "https://www.google.com/maps";
}

function buildEmbedUrl(embedUrl, address) {
  if (embedUrl && (embedUrl.includes("output=embed") || embedUrl.includes("/maps/embed"))) {
    return embedUrl.startsWith("http") ? embedUrl : `https://${embedUrl.replace(/^\/\//, "")}`;
  }
  if (address) {
    return `https://www.google.com/maps?q=${encodeURIComponent(address)}&hl=en&z=16&output=embed`;
  }
  return embedUrl || null;
}

/** Embedded Google Maps for studio location on the contact page. */
export default function MapFacade({
  embedUrl,
  title = "Studio location map",
  address,
  className = "",
}) {
  const src = buildEmbedUrl(embedUrl, address);
  if (!src) return null;

  const mapsLink = buildMapsLink(address, embedUrl);

  return (
    <div className={cn("map-facade map-facade--live", className)}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="map-facade__iframe"
      />
      <a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="map-facade__external"
      >
        Open in Google Maps ↗
      </a>
    </div>
  );
}
