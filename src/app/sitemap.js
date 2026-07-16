import { getSiteUrl } from "@/lib/siteUrl";
import { getCourses, getPortfolio, getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/courses", changeFrequency: "weekly", priority: 0.9 },
  { path: "/shop", changeFrequency: "weekly", priority: 0.9 },
  { path: "/portfolio", changeFrequency: "weekly", priority: 0.7 },
  { path: "/lookbook", changeFrequency: "weekly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.5 },
  { path: "/policies/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/policies/shipping", changeFrequency: "yearly", priority: 0.3 },
  { path: "/policies/returns", changeFrequency: "yearly", priority: 0.3 },
  { path: "/policies/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/policies/course-cancellation", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap() {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries = STATIC_PATHS.map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  let courseEntries = [];
  let productEntries = [];
  let portfolioEntries = [];

  try {
    const [courses, products, portfolio] = await Promise.all([
      getCourses(),
      getProducts(),
      getPortfolio(),
    ]);
    courseEntries = (courses || [])
      .filter((c) => c?.slug && c.published !== false)
      .map((c) => ({
        url: `${base}/courses/${c.slug}`,
        lastModified: c.updated_at ? new Date(c.updated_at) : now,
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    productEntries = (products || [])
      .filter((p) => p?.slug && p.published !== false)
      .map((p) => ({
        url: `${base}/shop/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: "weekly",
        priority: 0.7,
      }));
    portfolioEntries = (portfolio || [])
      .filter((item) => item?.slug)
      .map((item) => ({
        url: `${base}/portfolio/${item.slug}`,
        lastModified: item.updated_at ? new Date(item.updated_at) : now,
        changeFrequency: "monthly",
        priority: 0.6,
      }));
  } catch {
    // Seed-backed data helpers already fall back; keep static URLs if anything fails.
  }

  return [...staticEntries, ...courseEntries, ...productEntries, ...portfolioEntries];
}
