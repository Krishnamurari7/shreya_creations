/** Append standard embed params for JS API + autoplay-friendly playback. */
export function withYoutubeEmbedParams(embedUrl, { autoplay = false } = {}) {
  if (!embedUrl) return "";

  const url = new URL(embedUrl);
  url.searchParams.set("enablejsapi", "1");
  url.searchParams.set("playsinline", "1");
  url.searchParams.set("rel", "0");
  url.searchParams.set("modestbranding", "1");
  url.searchParams.set("mute", "1");
  if (autoplay) url.searchParams.set("autoplay", "1");
  if (typeof window !== "undefined") {
    url.searchParams.set("origin", window.location.origin);
  }
  return url.toString();
}

export function youtubeIframeCommand(iframe, func) {
  iframe?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: "" }), "*");
}

/** Normalize a YouTube watch/share URL or embed URL to an iframe-safe embed URL. */
export function toYoutubeEmbedUrl(input) {
  if (!input || typeof input !== "string") return "";

  const trimmed = input.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed);

    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) {
        return `https://www.youtube.com/embed/${url.pathname.split("/embed/")[1].split("/")[0]}`;
      }
      const id = url.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    if (url.hostname === "youtu.be") {
      const id = url.pathname.replace(/^\//, "").split("/")[0];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    return "";
  }

  return "";
}

/** Extract video ID from a normalized YouTube embed URL. */
export function youtubeVideoId(embedUrl) {
  if (!embedUrl) return "";
  try {
    const match = new URL(embedUrl).pathname.match(/\/embed\/([^/?]+)/);
    return match?.[1] ?? "";
  } catch {
    return "";
  }
}
