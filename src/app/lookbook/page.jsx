import { PAGE_CONTAINER } from "@/lib/ui";
import { cn } from "@/lib/utils";
import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import LookbookGrid from "@/components/LookbookGrid";
import FeatureStrip from "@/components/FeatureStrip";
import PageCTA from "@/components/PageCTA";
import PageSeoIntro from "@/components/PageSeoIntro";
import JsonLdScript from "@/components/JsonLdScript";
import { getLookbookPosts, getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { buildMetadata, breadcrumbJsonLd, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog & Lookbook | Style Tips from Shreya Creation Patna",
  description:
    "Bridal blouse ideas, 24-hour stitching tips, NRI ordering guides and atelier looks from Shreya Creation on Boring Road, Patna.",
  path: "/lookbook",
  image: DEFAULT_OG_IMAGE,
  imageAlt: "Blog and lookbook style inspiration from Shreya Creation Patna",
});

export default async function LookbookPage() {
  const [posts, site] = await Promise.all([getLookbookPosts(), getSiteSettings()]);
  const lookbook = site.pages?.lookbook || {};

  return (
    <PageShell>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Lookbook", path: "/lookbook" },
        ])}
      />
      <LocalizedPageHeader
        eyebrow={lookbook.headerEyebrow || "Lookbook"}
        eyebrowHi={lookbook.headerEyebrowHi || "लुकबुक"}
        title={lookbook.headerTitle || "Style Inspiration from Our Patna Atelier"}
        titleHi={lookbook.headerTitleHi || "पटना एटेलियर से स्टाइल प्रेरणा"}
        highlight={lookbook.headerHighlight || ""}
        highlightHi={lookbook.headerHighlightHi || ""}
        subtitle={
          lookbook.headerSubtitle ||
          "Curated looks, stitching tips and behind-the-scenes from our Boring Road studio."
        }
        subtitleHi={lookbook.headerSubtitleHi}
      />

      <PageSeoIntro
        links={[
          { href: "/portfolio", label: "bridal & designer portfolio" },
          { href: "/nri-clients", label: "NRI ordering support" },
          { href: "/shop", label: "custom stitching in Patna" },
        ]}
      >
        Read atelier tips from Shreya Creation Patna — bridal blouse necklines, express stitching,
        embroidery choices, and how NRI clients order custom wear on WhatsApp from Boring Road.
      </PageSeoIntro>

      <FeatureStrip items={lookbook.features || []} />

      <div className={cn(PAGE_CONTAINER, "mx-auto", "max-w-6xl", "pb-6", "sm:pb-8", "relative", "z-20")}>
        <LookbookGrid posts={posts} />
      </div>
      <PageCTA
        whatsapp={site.whatsapp}
        {...pageCtaProps(lookbook)}
        eyebrow="Recreate a look"
        eyebrowHi="लुक दोबारा बनाएँ"
        perks={["Your size", "Your fabric", "WhatsApp order", "Studio finish"]}
        perksHi={["आपके माप", "आपका कपड़ा", "WhatsApp ऑर्डर", "स्टूडियो फिनिश"]}
      />
    </PageShell>
  );
}
