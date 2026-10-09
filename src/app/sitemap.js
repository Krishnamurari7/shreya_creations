import { getCourses, getLookbookPosts, getPortfolio, getProducts } from "@/lib/data";
import { sitemapWithAlternates } from "@/lib/seo";
import { BOUTIQUE_SERVICES } from "@/lib/boutique-services";

/** ISR — avoids force-dynamic 500s on Cloudflare edge fetches. */
export const revalidate = 3600;

const STATIC_PATHS = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/courses", changeFrequency: "weekly", priority: 0.9 },
  { path: "/shop", changeFrequency: "weekly", priority: 0.9 },
  ...BOUTIQUE_SERVICES.map((s) => ({
    path: s.href,
    changeFrequency: "weekly",
    priority: 0.85,
  })),
  { path: "/portfolio", changeFrequency: "weekly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.6 },
  { path: "/nri-clients", changeFrequency: "weekly", priority: 0.85 },
  { path: "/ladies-tailor-patna", changeFrequency: "monthly", priority: 0.75 },
  { path: "/boutique-boring-road", changeFrequency: "monthly", priority: 0.75 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.5 },
  { path: "/policies/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/policies/shipping", changeFrequency: "yearly", priority: 0.3 },
  { path: "/policies/returns", changeFrequency: "yearly", priority: 0.3 },
  { path: "/policies/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/policies/course-cancellation", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap() {
  const now = new Date();

  const staticEntries = STATIC_PATHS.map(({ path, changeFrequency, priority }) =>
    sitemapWithAlternates(path, {
      lastModified: now,
      changeFrequency,
      priority,
    })
  );

  let courseEntries = [];
  let productEntries = [];
  let portfolioEntries = [];
  let blogEntries = [];

  try {
    const [courses, products, portfolio, posts] = await Promise.all([
      getCourses(),
      getProducts(),
      getPortfolio(),
      getLookbookPosts(),
    ]);
    // Include published courses (Enrollable + Coming Soon); drafts are already excluded by getCourses.
    courseEntries = (courses || [])
      .filter((c) => c?.slug && c.published !== false)
      .map((c) =>
        sitemapWithAlternates(`/courses/${c.slug}`, {
          lastModified: c.updated_at ? new Date(c.updated_at) : now,
          changeFrequency: "weekly",
          priority: 0.8,
        })
      );
    productEntries = (products || [])
      .filter((p) => p?.slug && p.published !== false)
      .map((p) =>
        sitemapWithAlternates(`/shop/${p.slug}`, {
          lastModified: p.updated_at ? new Date(p.updated_at) : now,
          changeFrequency: "weekly",
          priority: 0.7,
        })
      );
    portfolioEntries = (portfolio || [])
      .filter((item) => item?.slug)
      .map((item) =>
        sitemapWithAlternates(`/portfolio/${item.slug}`, {
          lastModified: item.updated_at ? new Date(item.updated_at) : now,
          changeFrequency: "monthly",
          priority: 0.6,
        })
      );
    blogEntries = (posts || [])
      .filter((post) => post?.slug && post.published !== false)
      .map((post) =>
        sitemapWithAlternates(`/blog/${post.slug}`, {
          lastModified: post.updated_at
            ? new Date(post.updated_at)
            : post.created_at
              ? new Date(post.created_at)
              : now,
          changeFrequency: "monthly",
          priority: 0.55,
        })
      );
  } catch {
    // Seed-backed data helpers already fall back; keep static URLs if anything fails.
  }

  return [
    ...staticEntries,
    ...courseEntries,
    ...productEntries,
    ...portfolioEntries,
    ...blogEntries,
  ];
}
