import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import CardImage from "@/components/CardImage";
import PageCTA from "@/components/PageCTA";
import JsonLdScript from "@/components/JsonLdScript";
import { getPortfolioBySlug, getSiteSettings } from "@/lib/data";
import { PAGE_CONTAINER, PAGE_HERO_TITLE, SECTION_LEAD } from "@/lib/ui";
import { cn } from "@/lib/utils";
import {
  buildMetadata,
  breadcrumbJsonLd,
  itemImage,
  itemImageAlt,
  portfolioMetaDescription,
  portfolioMetaTitle,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const item = await getPortfolioBySlug(params.slug);
  if (!item) {
    return buildMetadata({
      title: "Portfolio | Shreya Creation Patna",
      description: "Bridal and designer work from Shreya Creation Patna.",
      path: "/portfolio",
    });
  }
  const path = `/portfolio/${item.slug}`;
  return buildMetadata({
    title: portfolioMetaTitle(item),
    description: portfolioMetaDescription(item),
    path,
    image: itemImage(item),
    imageAlt: itemImageAlt(item),
  });
}

export default async function PortfolioDetailPage({ params }) {
  const [item, site] = await Promise.all([getPortfolioBySlug(params.slug), getSiteSettings()]);
  if (!item) return notFound();

  const alt = itemImageAlt(item);
  const image = item.og_image || item.image;

  return (
    <PageShell>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Portfolio", path: "/portfolio" },
          { name: item.title, path: `/portfolio/${item.slug}` },
        ])}
      />
      <div className={cn(PAGE_CONTAINER, "max-w-4xl", "pt-[calc(var(--header-offset)+1rem)]", "pb-12", "relative", "z-20")}>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-orange hover:text-orange-dark text-sm font-semibold tracking-wider uppercase mb-6"
        >
          ← Back to Portfolio
        </Link>
        {item.category && (
          <span className="inline-flex bg-orange/10 border border-orange/20 text-orange px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-widest uppercase mb-4">
            {item.category}
          </span>
        )}
        <h1 className={cn(PAGE_HERO_TITLE, "text-balance", "mb-4")}>{item.title}</h1>
        <p className={cn(SECTION_LEAD, "mb-8", "max-w-2xl")}>
          {item.caption ||
            item.meta_description ||
            `${item.title} — custom bridal & designer work from Shreya Creation, Patna (East Boring Canal Road). Many styles can be recreated to your measurements, often within 24 hours.`}
        </p>
        {image && (
          <div className="rounded-3xl overflow-hidden border border-ink/15 shadow-xl mb-8">
            <CardImage src={image} alt={alt} ratio="3/4" position="top" loading="eager" />
          </div>
        )}
        <p className="text-ink/90 leading-relaxed text-pretty mb-8">
          Inspired by this look? Order similar bridal lehenga stitching, designer blouse work, or
          reception gown styling on WhatsApp — crafted at our Patna atelier with custom fit.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/shop" className="text-orange font-medium underline-offset-2 hover:underline">
            24-hour custom stitching
          </Link>
          <span aria-hidden>·</span>
          <Link href="/contact" className="text-orange font-medium underline-offset-2 hover:underline">
            visit our boutique in Patna
          </Link>
        </div>
      </div>
      <PageCTA
        whatsapp={site.whatsapp}
        title="Want this look made for you?"
        titleHi="यह लुक आपके लिए चाहिए?"
        subtitle="Share a reference photo on WhatsApp — we'll guide fabric, sizing and delivery."
        subtitleHi="रेफरेंस फोटो WhatsApp पर भेजें — कपड़ा, माप और डिलीवरी बताएंगे।"
      />
    </PageShell>
  );
}
