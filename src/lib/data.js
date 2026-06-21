import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { mergePageDefaults, normalizePillars } from "@/lib/cms";
import * as seed from "@/lib/seed";

function normalizeSettings(data) {
  if (!data) return null;
  return {
    ...data,
    taglineHi: data.tagline_hi ?? data.taglineHi,
    boutiqueHi: data.boutique_hi ?? data.boutiqueHi,
    introHi: data.intro_hi ?? data.introHi,
    aboutBody: data.about_body ?? data.aboutBody,
    aboutBodyHi: data.about_body_hi ?? data.aboutBodyHi,
    aboutPillars: data.about_pillars ?? data.aboutPillars ?? [],
    mapEmbedUrl: data.map_embed_url ?? data.mapEmbedUrl,
    foundedHi: data.founded_hi ?? data.foundedHi,
    processSteps: data.process_steps ?? data.processSteps ?? [],
    heroMarquee: data.hero_marquee ?? data.heroMarquee ?? [],
    instagramEmbed: data.instagram_embed ?? data.instagramEmbed,
    defaultLanguage: data.default_language ?? data.defaultLanguage ?? "en",
    services: data.services ?? [],
    pages: mergePageDefaults(data.pages),
    aboutPillars: normalizePillars(data.about_pillars ?? data.aboutPillars),
  };
}

async function query(supabase, table, options = {}) {
  let q = supabase.from(table).select("*");
  if (options.eq) Object.entries(options.eq).forEach(([k, v]) => { q = q.eq(k, v); });
  if (options.filterPublished) q = q.eq("published", true);
  if (options.order) q = q.order(options.order.col, { ascending: options.order.asc ?? true });
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function getSiteSettings() {
  if (!isSupabaseConfigured()) {
    return {
      ...seed.SITE,
      pages: mergePageDefaults(),
      aboutPillars: normalizePillars(),
    };
  }
  try {
    const supabase = createClient();
    const { data } = await supabase.from("settings").select("*").eq("id", 1).single();
    const normalized = normalizeSettings(data);
    if (!normalized) return seed.SITE;
    return { ...seed.SITE, ...normalized };
  } catch {
    return seed.SITE;
  }
}

export async function getProducts({ includeUnpublished = false } = {}) {
  if (!isSupabaseConfigured()) return seed.PRODUCTS;
  try {
    const supabase = createClient();
    let q = supabase.from("products").select("*").order("created_at", { ascending: false });
    if (!includeUnpublished) q = q.eq("published", true);
    const { data } = await q;
    return data?.length ? data : seed.PRODUCTS;
  } catch {
    return seed.PRODUCTS;
  }
}

export async function getProductBySlug(slug) {
  if (!isSupabaseConfigured()) return seed.PRODUCTS.find((p) => p.slug === slug) || null;
  try {
    const supabase = createClient();
    const { data } = await supabase.from("products").select("*").eq("slug", slug).single();
    return data || seed.PRODUCTS.find((p) => p.slug === slug) || null;
  } catch {
    return seed.PRODUCTS.find((p) => p.slug === slug) || null;
  }
}

export async function getCourses({ includeUnpublished = false } = {}) {
  if (!isSupabaseConfigured()) return seed.COURSES;
  try {
    const supabase = createClient();
    let q = supabase.from("courses").select("*").order("created_at", { ascending: false });
    if (!includeUnpublished) q = q.eq("published", true);
    const { data } = await q;
    return data?.length ? data : seed.COURSES;
  } catch {
    return seed.COURSES;
  }
}

export async function getCourseBySlug(slug) {
  if (!isSupabaseConfigured()) return seed.COURSES.find((c) => c.slug === slug) || null;
  try {
    const supabase = createClient();
    const { data } = await supabase.from("courses").select("*").eq("slug", slug).single();
    return data || seed.COURSES.find((c) => c.slug === slug) || null;
  } catch {
    return seed.COURSES.find((c) => c.slug === slug) || null;
  }
}

export async function getPortfolio() {
  if (!isSupabaseConfigured()) return seed.PORTFOLIO;
  try {
    const supabase = createClient();
    const { data } = await supabase.from("portfolio").select("*").order("sort_order", { ascending: true });
    return data?.length ? data : seed.PORTFOLIO;
  } catch {
    return seed.PORTFOLIO;
  }
}

export async function getTestimonials() {
  if (!isSupabaseConfigured()) return seed.TESTIMONIALS;
  try {
    const supabase = createClient();
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    return data?.length ? data : seed.TESTIMONIALS;
  } catch {
    return seed.TESTIMONIALS;
  }
}

export async function getTrustStats() {
  if (!isSupabaseConfigured()) return seed.TRUST;
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("trust_stats")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (!data?.length) return seed.TRUST;
    return data.map((r) => ({
      label: r.label,
      labelHi: r.label_hi,
      value: r.value,
      valueHi: r.value_hi,
    }));
  } catch {
    return seed.TRUST;
  }
}

export async function getFaqs() {
  if (!isSupabaseConfigured()) return seed.FAQS;
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("faqs")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (!data?.length) return seed.FAQS;
    return data.map((r) => ({
      q: r.question,
      qHi: r.question_hi,
      a: r.answer,
      aHi: r.answer_hi,
    }));
  } catch {
    return seed.FAQS;
  }
}

export async function getPolicyPage(slug) {
  if (!isSupabaseConfigured()) return seed.POLICIES[slug] || null;
  try {
    const supabase = createClient();
    const { data } = await supabase.from("policy_pages").select("*").eq("slug", slug).single();
    if (!data) return seed.POLICIES[slug] || null;
    return {
      slug: data.slug,
      title: data.title,
      titleHi: data.title_hi,
      body: data.body,
      bodyHi: data.body_hi,
    };
  } catch {
    return seed.POLICIES[slug] || null;
  }
}

export async function getLookbookPosts() {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("lookbook_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export async function getAdminCounts() {
  if (!isSupabaseConfigured()) {
    return {
      products: seed.PRODUCTS.length,
      courses: seed.COURSES.length,
      portfolio: seed.PORTFOLIO.length,
      testimonials: seed.TESTIMONIALS.length,
      trust: seed.TRUST.length,
      faqs: seed.FAQS.length,
      inquiries: 0,
    };
  }
  try {
    const supabase = createClient();
    const [products, courses, portfolio, testimonials, trust, faqs, inquiries] = await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("courses").select("id", { count: "exact", head: true }),
      supabase.from("portfolio").select("id", { count: "exact", head: true }),
      supabase.from("testimonials").select("id", { count: "exact", head: true }),
      supabase.from("trust_stats").select("id", { count: "exact", head: true }),
      supabase.from("faqs").select("id", { count: "exact", head: true }),
      supabase.from("contact_inquiries").select("id", { count: "exact", head: true }),
    ]);
    return {
      products: products.count ?? 0,
      courses: courses.count ?? 0,
      portfolio: portfolio.count ?? 0,
      testimonials: testimonials.count ?? 0,
      trust: trust.count ?? 0,
      faqs: faqs.count ?? 0,
      inquiries: inquiries.count ?? 0,
    };
  } catch {
    return {
      products: seed.PRODUCTS.length,
      courses: seed.COURSES.length,
      portfolio: seed.PORTFOLIO.length,
      testimonials: seed.TESTIMONIALS.length,
      trust: seed.TRUST.length,
      faqs: seed.FAQS.length,
      inquiries: 0,
    };
  }
}

export { seed };
