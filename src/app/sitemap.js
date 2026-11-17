import { getCourses, getLookbookPosts, getPortfolio, getProducts } from "@/lib/data";
import { sitemapWithAlternates } from "@/lib/seo";
import { BOUTIQUE_SERVICES } from "@/lib/boutique-services";

/** ISR — avoids force-dynamic 500s on Cloudflare edge fetches. */
export const revalidate = 3600;

const STATIC_PATHS = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/courses", changeFrequency: "weekly", priority: 0.9 },
  // This seed-backed course is public even when it is absent from the CMS list.
  { path: "/courses/kids-wear-course", changeFrequency: "weekly", priority: 0.8 },
  { path: "/register", changeFrequency: "monthly", priority: 0.8 },
  { path: "/shop", changeFrequency: "weekly", priority: 0.9 },
  { path: "/student-store", changeFrequency: "weekly", priority: 0.8 },
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
  { path: "/hire-trained-professionals", changeFrequency: "monthly", priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.5 },
  { path: "/policies/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/policies/shipping", changeFrequency: "yearly", priority: 0.3 },
  { path: "/policies/returns", changeFrequency: "yearly", priority: 0.3 },
  { path: "/policies/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/policies/course-cancellation", changeFrequency: "yearly", priority: 0.3 },
];

function localizedEntries(path, details) {
  const english = sitemapWithAlternates(path, details);
  return [
    english,
    { ...english, url: english.alternates.languages["hi-IN"] },
  ];
}

export default async function sitemap() {
  const now = new Date();

  const staticEntries = STATIC_PATHS.flatMap(({ path, changeFrequency, priority }) =>
    localizedEntries(path, {
      changeFrequency,
      priority,
    })
  );

  // These catalog pages have no Hindi counterpart; do not advertise redirects as alternates.
  const storeCatalogEntries = ["/student-store/products", "/student-store/categories"].map(
    (path) => {
      const { alternates, ...entry } = sitemapWithAlternates(path, {
        changeFrequency: "weekly",
        priority: 0.6,
      });
      return entry;
    }
  );

  let courseEntries = [];
  let productEntries = [];
  let portfolioEntries = [];
  let blogEntries = [];

  try {
    const results = await Promise.allSettled([
      getCourses(),
      getProducts(),
      getPortfolio(),
      getLookbookPosts(),
    ]);
    const [courses, products, portfolio, posts] = results.map((result) =>
      result.status === "fulfilled" ? result.value : []
    );
    // Include published courses (Enrollable + Coming Soon); drafts are already excluded by getCourses.
    courseEntries = (courses || [])
      .filter((c) => c?.slug && c.published !== false)
      .flatMap((c) =>
        localizedEntries(`/courses/${c.slug}`, {
          lastModified: c.updated_at ? new Date(c.updated_at) : now,
          changeFrequency: "weekly",
          priority: 0.8,
        })
      );
    productEntries = (products || [])
      .filter((p) => p?.slug && p.published !== false)
      .flatMap((p) =>
        localizedEntries(`/shop/${p.slug}`, {
          lastModified: p.updated_at ? new Date(p.updated_at) : now,
          changeFrequency: "weekly",
          priority: 0.7,
        })
      );
    portfolioEntries = (portfolio || [])
      .filter((item) => item?.slug)
      .flatMap((item) =>
        localizedEntries(`/portfolio/${item.slug}`, {
          lastModified: item.updated_at ? new Date(item.updated_at) : now,
          changeFrequency: "monthly",
          priority: 0.6,
        })
      );
    blogEntries = (posts || [])
      .filter((post) => post?.slug && post.published !== false)
      .flatMap((post) =>
        localizedEntries(`/blog/${post.slug}`, {
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
    // Keep the static URLs even if an unexpected mapping error occurs.
  }

  const entries = [
    ...staticEntries,
    ...storeCatalogEntries,
    ...courseEntries,
    ...productEntries,
    ...portfolioEntries,
    ...blogEntries,
  ];

  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
