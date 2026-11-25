"use client";

import { cn } from "@/lib/utils";
import { PAGE_CONTAINER, REVEAL } from "@/lib/ui";
import InstagramFeed from "@/components/InstagramFeed";
import YouTubeFeed from "@/components/YouTubeFeed";
import "./social-feeds.css";

function safeUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function instagramHandle(url, fallback) {
  try {
    const handle = new URL(url).pathname.split("/").filter(Boolean)[0];
    return handle && !["p", "reel", "stories"].includes(handle) ? handle : fallback;
  } catch {
    return fallback;
  }
}

function SocialMark({ kind }) {
  if (kind === "instagram") return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="4" y="4" width="24" height="24" rx="7" /><circle cx="16" cy="16" r="5.5" /><circle cx="23.5" cy="8.5" r="1.4" fill="currentColor" stroke="none" /></svg>;
  if (kind === "youtube") return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="2.5" y="6" width="27" height="20" rx="6" fill="currentColor" /><path d="m13 11 9 5-9 5V11Z" fill="#fff" /></svg>;
  if (kind === "facebook") return <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M18.9 29V17.1h4l.6-4.7h-4.6v-3c0-1.4.4-2.3 2.4-2.3h2.5V2.9c-.4-.1-2-.2-3.8-.2-3.8 0-6.4 2.3-6.4 6.5v3.2H9.3v4.7h4.3V29h5.3Z" /></svg>;
  if (kind === "x") return <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M5 4h6.4l5.8 8.1L24 4h3l-8.5 10 9.2 14h-6.3l-6.5-9.3L7 28H4l9.5-11.4L5 4Zm4 2 13.7 20h1.8L10.8 6H9Z" /></svg>;
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M27 15.4a11 11 0 0 1-15.9 9.9L5 27l1.8-5.8A11 11 0 1 1 27 15.4Z" /><path d="M11.5 10.5c-.8.7-.8 2.1 0 3.7 1.6 3.2 4 5.4 7.2 6.6 1.7.6 2.9.4 3.5-.5l-3.3-2-1.4 1c-2-.9-3.6-2.4-4.5-4.4l1-1.4-2.5-3Z" /></svg>;
}

export default function SocialFeeds({ site, lang = "en" }) {
  const hi = lang === "hi";
  const socials = site?.socials || {};
  const instagram = safeUrl(socials.instagram);
  const youtube = safeUrl(socials.youtube);
  const facebook = safeUrl(socials.facebook);
  const x = safeUrl(socials.x);
  const whatsappNumber = String(site?.whatsapp || "").replace(/\D/g, "");
  const whatsapp = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "";
  const channels = [
    { kind: "instagram", name: "Instagram", href: instagram, detail: hi ? "रील्स और नए डिज़ाइन" : "Reels & new looks", action: hi ? "फ़ॉलो करें" : "Follow along" },
    { kind: "youtube", name: "YouTube", href: youtube, detail: hi ? "वीडियो और क्लासेस" : "Videos & classes", action: hi ? "वीडियो देखें" : "Watch videos" },
    { kind: "facebook", name: "Facebook", href: facebook, detail: hi ? "स्टूडियो अपडेट्स" : "Studio updates", action: hi ? "हमसे जुड़ें" : "Connect with us" },
    { kind: "x", name: "X / Twitter", href: x, detail: hi ? "ताज़ा खबरें" : "Latest updates", action: hi ? "फ़ॉलो करें" : "Follow us" },
    { kind: "whatsapp", name: "WhatsApp", href: whatsapp, detail: hi ? "सीधे बात करें" : "Talk to our team", action: hi ? "चैट शुरू करें" : "Start a chat" },
  ].filter((channel) => channel.href);

  return (
    <section className="home-social-section" aria-labelledby="home-social-title">
      <div className={cn(PAGE_CONTAINER, "home-social-section__inner")}>
        <div className={cn(REVEAL, "home-social-section__intro")}>
          <span className="home-social-section__eyebrow"><span className="home-social-section__pulse" />{hi ? "हमसे जुड़े रहें" : "BE PART OF OUR STORY"}</span>
          <h2 id="home-social-title">{hi ? "कहानी यहाँ भी चलती है।" : "The story continues online."}</h2>
          <p>{hi ? "नए डिज़ाइन, स्टूडियो की झलक और सीखने के वीडियो — अपने पसंदीदा प्लेटफ़ॉर्म पर हमसे जुड़ें।" : "Fresh designs, studio moments and creative lessons. Join Shreya Creation wherever you like to scroll."}</p>
          <div className="home-social-section__tags" aria-hidden="true"><span>{hi ? "नए डिज़ाइन" : "NEW LOOKS"}</span><i>✦</i><span>{hi ? "स्टूडियो की कहानियाँ" : "STUDIO STORIES"}</span><i>✦</i><span>{hi ? "सीखें और बनाएँ" : "LEARN & CREATE"}</span></div>
        </div>
        <div className="home-social-section__grid">
          {channels.map((channel, index) => <a key={channel.kind} className={cn(REVEAL, `home-social-card home-social-card--${channel.kind}`)} href={channel.href} target="_blank" rel="noopener noreferrer" style={{ "--social-delay": `${index * 75}ms` }} aria-label={`${channel.action} on ${channel.name}`}>
            <span className="home-social-card__top"><span className="home-social-card__icon"><SocialMark kind={channel.kind} /></span><span className="home-social-card__arrow" aria-hidden="true">↗</span></span>
            <span className="home-social-card__body"><strong>{channel.name}</strong><small>{channel.detail}</small></span>
            <span className="home-social-card__action">{channel.action} <span aria-hidden="true">→</span></span>
          </a>)}
        </div>
        {(instagram || youtube) && <div className="home-social-section__feeds">
          <div className="home-social-section__feeds-heading"><span>{hi ? "हमारे चैनलों से" : "FROM OUR CHANNELS"}</span><span aria-hidden="true">✦</span></div>
          <div className="social-feeds__row">
            {instagram && <InstagramFeed compact handle={instagramHandle(instagram, site?.instagramHandle || "shreya.creationss")} profileUrl={instagram} lang={lang} />}
            {youtube && <YouTubeFeed compact channelUrl={youtube} lang={lang} />}
          </div>
        </div>}
      </div>
    </section>
  );
}
