import Image from "next/image";
import { MEDIA } from "@/lib/media";

/** Server-rendered LCP candidate — must stay outside client boundaries. */
export default function HeroBackgroundImage() {
  return (
    <div className="home-hero__ambient" aria-hidden>
      <Image
        src={MEDIA.background}
        alt=""
        fill
        sizes="100vw"
        priority
        fetchPriority="high"
        quality={65}
        className="home-hero__bg-image"
      />
      <span className="home-hero__bg-overlay" />
    </div>
  );
}
