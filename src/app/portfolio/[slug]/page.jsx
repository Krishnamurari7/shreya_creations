import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import CardImage from "@/components/CardImage";
import PageCTA from "@/components/PageCTA";
import JsonLdScript from "@/components/JsonLdScript";
import { getPortfolioBySlug, getSiteSettings } from "@/lib/data";
import { getRequestLocale } from "@/lib/locale";
import { PAGE_CONTAINER, PAGE_HERO_TITLE, SECTION_LEAD } from "@/lib/ui";
import { cn } from "@/lib/utils";
import {
  buildMetadata,
  breadcrumbJsonLd,
  breadcrumbLabel,
  itemImage,
  itemImageAlt,
  portfolioMetaDescription,
  portfolioMetaTitle,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await getPortfolioBySlug(slug);
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
  const { slug } = await params;
  const locale = await getRequestLocale();
  const [item, site] = await Promise.all([getPortfolioBySlug(slug), getSiteSettings()]);
  if (!item) return notFound();

  const alt = itemImageAlt(item);
  const image = item.og_image || item.image;
  const title =
    locale === "hi" && (item.title_hi || item.titleHi) ? item.title_hi || item.titleHi : item.title;

  return (
    <PageShell>
      <JsonLdScript
        data={breadcrumbJsonLd(
          [
            { name: breadcrumbLabel("home", locale), path: "/" },
            { name: breadcrumbLabel("portfolio", locale), path: "/portfolio" },
            { name: title, path: `/portfolio/${item.slug}` },
          ],
          locale
        )}
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
        title="Want to visit our studio?"
        titleHi="हमारा स्टूडियो देखना चाहते हैं?"
        subtitle="Share a reference photo on WhatsApp — or book a studio visit for a custom consultation."
        subtitleHi="रेफरेंस फोटो WhatsApp पर भेजें — या कस्टम सलाह के लिए स्टूडियो विज़िट बुक करें।"
      />
    </PageShell>
  );
}
