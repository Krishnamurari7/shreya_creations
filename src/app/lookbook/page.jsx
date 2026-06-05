import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import LookbookGrid from "@/components/LookbookGrid";
import PageCTA from "@/components/PageCTA";
import { getLookbookPosts, getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";

export const metadata = { title: "Lookbook — Shreya Creations" };

export default async function LookbookPage() {
  const [posts, site] = await Promise.all([getLookbookPosts(), getSiteSettings()]);
  const lookbook = site.pages?.lookbook || {};

  return (
    <PageShell>
      <LocalizedPageHeader
        eyebrow={lookbook.headerEyebrow || "Blog & lookbook"}
        eyebrowHi={lookbook.headerEyebrowHi}
        title={lookbook.headerTitle || "Style"}
        titleHi={lookbook.headerTitleHi}
        highlight={lookbook.headerHighlight || "inspiration"}
        highlightHi={lookbook.headerHighlightHi}
        subtitle={lookbook.headerSubtitle || "Curated looks from the atelier — trends, styling tips and behind-the-scenes from our studio."}
        subtitleHi={lookbook.headerSubtitleHi}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-5 pb-6 sm:pb-8 relative z-20">
        <LookbookGrid posts={posts} />
      </div>
      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(lookbook)} />
    </PageShell>
  );
}
