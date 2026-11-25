import { NextResponse } from "next/server";
import { DEFAULT_YOUTUBE_CHANNEL_ID } from "@/lib/site-config";
import { getSiteSettings } from "@/lib/data";

export const revalidate = 1800;

function decodeXml(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseYoutubeRss(xml) {
  const name = decodeXml(xml.match(/<author>\s*<name>([^<]+)<\/name>/)?.[1] || "");
  const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map((match) => {
      const block = match[1];
      const id = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
      if (!id) return null;
      const title = decodeXml(block.match(/<title>([^<]+)<\/title>/)?.[1] || "");
      return {
        id,
        title,
        href: `https://www.youtube.com/watch?v=${id}`,
        image: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        isVideo: true,
      };
    })
    .filter(Boolean);

  return { name, videos };
}

export async function GET() {
  try {
    const site = await getSiteSettings();
    const configuredId = String(site.socials?.youtubeChannelId || "").trim();
    const defaultChannel = /youtube\.com\/@ShreyaCreations111\/?$/i.test(String(site.socials?.youtube || ""));
    const channelId = /^UC[A-Za-z0-9_-]{22}$/.test(configuredId)
      ? configuredId
      : defaultChannel ? DEFAULT_YOUTUBE_CHANNEL_ID : "";
    if (!channelId) return NextResponse.json({ name: "", videos: [] });
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      {
        headers: { Accept: "application/atom+xml,text/xml" },
        next: { revalidate: 1800 },
      }
    );
    if (!res.ok) {
      return NextResponse.json({ name: "", videos: [] });
    }
    const xml = await res.text();
    const data = parseYoutubeRss(xml);
    return NextResponse.json({
      name: data.name,
      videos: data.videos.slice(0, 9),
    });
  } catch {
    return NextResponse.json({ name: "", videos: [] });
  }
}
