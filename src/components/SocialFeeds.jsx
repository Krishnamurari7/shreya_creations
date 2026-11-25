"use client";

import { cn } from "@/lib/utils";
import { PAGE_CONTAINER, REVEAL } from "@/lib/ui";
import "./social-feeds.css";

function safeUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function socialHandle(url, fallback) {
  try {
    const handle = new URL(url).pathname.split("/").filter(Boolean)[0];
    return handle ? `@${handle.replace(/^@/, "")}` : fallback;
  } catch {
    return fallback;
  }
}

function displayHandle(value, fallback) {
  const handle = String(value || "").trim().replace(/^@+/, "");
  return handle ? `@${handle}` : fallback;
}

function SocialMark({ kind }) {
  if (kind === "instagram") return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="4" y="4" width="24" height="24" rx="7" /><circle cx="16" cy="16" r="5.5" /><circle cx="23.5" cy="8.5" r="1.4" fill="currentColor" stroke="none" /></svg>;
  if (kind === "youtube") return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m10 6 17 10-17 10V6Z" fill="currentColor" /></svg>;
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
    { kind: "instagram", name: "Instagram", href: instagram, subline: displayHandle(socials.instagramDisplayId, socialHandle(instagram, "@shreya.creationss")), detail: hi ? "डिज़ाइन, बारीकियाँ और हर दिन नई प्रेरणा।" : "Designs, details & everyday inspiration.", action: hi ? "Instagram पर फ़ॉलो करें" : "Follow on Instagram" },
    { kind: "youtube", name: "YouTube", href: youtube, subline: displayHandle(socials.youtubeDisplayId, socialHandle(youtube, "@ShreyaCreations111")), detail: hi ? "सीखें, बनाएँ और अपनी कला निखारें।" : "Learn, create & make it your own.", action: hi ? "YouTube पर देखें" : "Watch on YouTube" },
    { kind: "whatsapp", name: "WhatsApp", href: whatsapp, subline: socials.whatsappDisplayId || (hi ? "बातचीत शुरू करें" : "Let’s start a conversation"), detail: hi ? "कोर्स, कस्टम आउटफ़िट और आपके सवाल।" : "Courses, custom outfits & your questions.", action: hi ? "WhatsApp पर चैट करें" : "Chat on WhatsApp" },
    { kind: "facebook", name: "Facebook", href: facebook, subline: socials.facebookDisplayId || (hi ? "हमारी रचनात्मक दुनिया" : "Our creative community"), detail: hi ? "स्टूडियो की कहानियाँ, अपडेट और यादें।" : "Studio stories, updates & shared moments.", action: hi ? "Facebook पर जाएँ" : "Visit Facebook" },
    { kind: "x", name: "X / Twitter", href: x, subline: displayHandle(socials.xDisplayId, socialHandle(x, "Our latest updates")), detail: hi ? "ताज़ा खबरें और रचनात्मक विचार।" : "Fresh news & creative thoughts.", action: hi ? "X पर फ़ॉलो करें" : "Follow on X" },
  ].filter((channel) => channel.href);

  return (
    <section className="home-social-section" aria-labelledby="home-social-title">
      <div className={cn(PAGE_CONTAINER, "home-social-section__inner")}>
        <div className="home-social-section__ribbon" aria-hidden="true" />
        <div className={cn(REVEAL, "home-social-section__intro")}>
          <div className="home-social-section__title-block">
            <span className="home-social-section__eyebrow">{hi ? "हमारी सोशल दुनिया" : "OUR SOCIAL WORLD"}</span>
            <h2 id="home-social-title">{hi ? <>आइए जुड़े <em>रहें।</em></> : <>Let’s stay <em>connected.</em></>}</h2>
          </div>
          <p>{hi ? "प्रेरणा, सीख और रचनात्मक पलों के लिए अपने पसंदीदा तरीके से हमसे जुड़ें।" : "Inspiration, learning and creative moments. Choose your favourite way to connect."}</p>
        </div>
        <div className="home-social-section__grid">
          {channels.map((channel, index) => <a key={channel.kind} className={cn(REVEAL, `home-social-card home-social-card--${channel.kind}`)} href={channel.href} target="_blank" rel="noopener noreferrer" style={{ "--social-delay": `${index * 75}ms` }} aria-label={`${channel.action} on ${channel.name}`}>
            <span className="home-social-card__art" aria-hidden="true"><span className="home-social-card__icon"><SocialMark kind={channel.kind} /></span></span>
            <span className="home-social-card__content">
              <span className="home-social-card__body"><strong>{channel.name}</strong><span>{channel.subline}</span><small>{channel.detail}</small></span>
              <span className="home-social-card__action">{channel.action}</span>
            </span>
          </a>)}
        </div>
        <p className="home-social-section__closing">{hi ? "थोड़ी सी प्रेरणा, जहाँ भी आप हों।" : "A little inspiration, wherever you are."}</p>
      </div>
    </section>
  );
}
