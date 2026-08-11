import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { mergePageDefaults, normalizePillars } from "@/lib/cms";
import { buildSITE, buildTrustFromSite } from "@/lib/site-config";
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
    mapEmbedUrl: data.map_embed_url ?? data.mapEmbedUrl,
    googleReviewsUrl: data.google_reviews_url ?? data.googleReviewsUrl,
    googleRating: data.google_rating ?? data.googleRating,
    googleReviewCount: data.google_review_count ?? data.googleReviewCount,
    foundedHi: data.founded_hi ?? data.foundedHi,
    processSteps: data.process_steps ?? data.processSteps ?? [],
    heroMarquee: data.hero_marquee ?? data.heroMarquee ?? [],
    instagramEmbed: data.instagram_embed ?? data.instagramEmbed,
    defaultLanguage: data.default_language ?? data.defaultLanguage ?? "en",
    services: data.services ?? [],
    pages: mergePageDefaults(data.pages),
    aboutPillars: normalizePillars(data.about_pillars ?? data.aboutPillars),
    foundingYear: data.founding_year ?? data.foundingYear,
    studentsTaught: data.students_taught ?? data.studentsTaught,
    outfitsDelivered: data.outfits_delivered ?? data.outfitsDelivered,
    expressDeliveryHours: data.express_delivery_hours ?? data.expressDeliveryHours,
    phonePrimary: data.phone_primary ?? data.phonePrimary,
    phoneSecondary: data.phone_secondary ?? data.phoneSecondary,
    addressLine: data.address_line ?? data.addressLine,
    pincode: data.pincode,
    studioHours: data.studio_hours ?? data.studioHours,
    closedDays: data.closed_days ?? data.closedDays,
    whatsappNumber: data.whatsapp_number ?? data.whatsappNumber ?? data.whatsapp,
  };
}

function normalizeSyllabus(syllabus) {
  if (Array.isArray(syllabus)) return syllabus;
  if (typeof syllabus === "string") return syllabus.split("\n").filter(Boolean);
  return [];
}

function slugifyTitle(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function withSeoFields(row) {
  if (!row) return null;
  return {
    ...row,
    meta_title: row.meta_title ?? row.metaTitle ?? null,
    meta_description: row.meta_description ?? row.metaDescription ?? null,
    og_image: row.og_image ?? row.ogImage ?? null,
    image_alt: row.image_alt ?? row.imageAlt ?? null,
    focus_keyword: row.focus_keyword ?? row.focusKeyword ?? null,
  };
}

function normalizeCourse(row) {
  if (!row) return null;
  return withSeoFields({
    ...row,
    titleHi: row.title_hi ?? row.titleHi,
    compare_price: row.compare_price ?? row.comparePrice,
    preview_video: row.preview_video ?? row.previewVideo,
    course_pdf: row.course_pdf ?? row.coursePdf ?? row.pdf_url ?? row.pdfUrl,
    syllabus: normalizeSyllabus(row.syllabus),
    price: row.price != null ? Number(row.price) : row.price,
    price_tbd: row.price_tbd ?? row.priceTbd ?? false,
    price_confirmed: row.price_confirmed ?? row.priceConfirmed,
    published: row.published ?? true,
  });
}

function normalizeProduct(row) {
  if (!row) return null;
  return withSeoFields({
    ...row,
    ready_made: row.ready_made ?? row.readyMade ?? false,
  });
}

function normalizePortfolioItem(row) {
  if (!row) return null;
  const title = row.title || row.caption || "Portfolio piece";
  return withSeoFields({
    ...row,
    title,
    slug: row.slug || slugifyTitle(title) || `portfolio-${row.id}`,
    featured: row.featured === true,
  });
}

function mergeCourseRecord(seedCourse, dbCourse) {
  if (!dbCourse) return seedCourse;
  const merged = { ...seedCourse, ...dbCourse };
  if (dbCourse.price == null && seedCourse.price != null) merged.price = seedCourse.price;
  if (!dbCourse.course_pdf && seedCourse.course_pdf) merged.course_pdf = seedCourse.course_pdf;
  if (!dbCourse.about && seedCourse.about) merged.about = seedCourse.about;
  if (!dbCourse.about_hi && seedCourse.about_hi) merged.about_hi = seedCourse.about_hi;
  if (!dbCourse.description_hi && seedCourse.description_hi) merged.description_hi = seedCourse.description_hi;
  if ((!Array.isArray(dbCourse.includes) || !dbCourse.includes.length) && seedCourse.includes?.length) {
    merged.includes = seedCourse.includes;
  }
  if ((!Array.isArray(dbCourse.includes_hi) || !dbCourse.includes_hi.length) && seedCourse.includes_hi?.length) {
    merged.includes_hi = seedCourse.includes_hi;
  }
  if ((!Array.isArray(dbCourse.syllabus) || !dbCourse.syllabus.length) && seedCourse.syllabus?.length) {
    merged.syllabus = seedCourse.syllabus;
  }
  return merged;
}

function publishedSeedCourses(includeUnpublished) {
  return includeUnpublished
    ? seed.COURSES
    : seed.COURSES.filter((c) => c.published !== false);
}

function mergeCoursesWithSeed(dbRows, { includeUnpublished = false } = {}) {
  const seedList = publishedSeedCourses(includeUnpublished);
  if (!dbRows?.length) return seedList;

  const dbBySlug = new Map(dbRows.map((row) => [row.slug, normalizeCourse(row)]));
  const merged = dbRows.map((row) => {
    const seedCourse = seedList.find((c) => c.slug === row.slug);
    const dbCourse = dbBySlug.get(row.slug);
    return seedCourse ? mergeCourseRecord(seedCourse, dbCourse) : dbCourse;
  });

  seedList.forEach((seedCourse) => {
    if (!dbBySlug.has(seedCourse.slug)) merged.push(seedCourse);
  });

  return merged;
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

/**
 * Canonical site object — always includes coursesCount from published courses.
 */
export async function getSiteSettings() {
  const courses = await getCourses({ includeUnpublished: false });
  const coursesCount = courses.filter((c) => !c.is_addon).length || courses.length;
  const nextBatch = await getNextBatch();

  if (!isSupabaseConfigured()) {
    const site = buildSITE(
      { ...seed.SITE, pages: mergePageDefaults(), aboutPillars: normalizePillars() },
      { coursesCount }
    );
    return {
      ...site,
      pages: mergePageDefaults(),
      aboutPillars: normalizePillars(),
    };
  }
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("settings").select("*").eq("id", 1).single();
    const normalized = normalizeSettings(data);
    if (!normalized) {
      return buildSITE({ ...seed.SITE, pages: mergePageDefaults() }, { coursesCount });
    }
    const merged = {
      ...seed.SITE,
      ...normalized,
      nextBatchDate: nextBatch?.start_date ?? normalized.next_batch_date ?? normalized.nextBatchDate,
      nextBatchSeats: nextBatch?.seats_left ?? normalized.next_batch_seats ?? normalized.nextBatchSeats,
      socials: {
        ...seed.SITE.socials,
        ...(normalized.socials || {}),
        facebook:
          normalized.socials?.facebook?.trim() || seed.SITE.socials.facebook,
      },
    };
    return buildSITE(merged, { coursesCount });
  } catch {
    return buildSITE({ ...seed.SITE, pages: mergePageDefaults() }, { coursesCount });
  }
}

export async function getProducts({ includeUnpublished = false } = {}) {
  if (!isSupabaseConfigured()) return seed.PRODUCTS.map(normalizeProduct);
  try {
    const supabase = await createClient();
    let q = supabase.from("products").select("*").order("created_at", { ascending: false });
    if (!includeUnpublished) q = q.eq("published", true);
    const { data } = await q;
    const rows = data?.length ? data : seed.PRODUCTS;
    return rows.map(normalizeProduct);
  } catch {
    return seed.PRODUCTS.map(normalizeProduct);
  }
}

export async function getProductBySlug(slug) {
  if (!isSupabaseConfigured()) {
    return normalizeProduct(seed.PRODUCTS.find((p) => p.slug === slug) || null);
  }
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("products").select("*").eq("slug", slug).single();
    return normalizeProduct(data || seed.PRODUCTS.find((p) => p.slug === slug) || null);
  } catch {
    return normalizeProduct(seed.PRODUCTS.find((p) => p.slug === slug) || null);
  }
}

export async function getCourses({ includeUnpublished = false } = {}) {
  const seedList = publishedSeedCourses(includeUnpublished);
  if (!isSupabaseConfigured()) return seedList;
  try {
    const supabase = await createClient();
    let q = supabase.from("courses").select("*").order("created_at", { ascending: false });
    if (!includeUnpublished) q = q.eq("published", true);
    const { data, error } = await q;
    if (error) return seedList;
    return mergeCoursesWithSeed(data, { includeUnpublished });
  } catch {
    return seedList;
  }
}

export async function getCourseBySlug(slug) {
  const seedCourse = seed.COURSES.find((c) => c.slug === slug) || null;
  if (!isSupabaseConfigured()) return seedCourse;

  // Seed catalog is canonical — return immediately; overlay DB fields when available.
  if (!seedCourse) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.from("courses").select("*").eq("slug", slug).maybeSingle();
      return data ? normalizeCourse(data) : null;
    } catch {
      return null;
    }
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase.from("courses").select("*").eq("slug", slug).maybeSingle();
    const dbCourse = data ? normalizeCourse(data) : null;
    return dbCourse ? mergeCourseRecord(seedCourse, dbCourse) : seedCourse;
  } catch {
    return seedCourse;
  }
}

export async function getPortfolio() {
  if (!isSupabaseConfigured()) return seed.PORTFOLIO.map(normalizePortfolioItem);
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("portfolio").select("*").order("sort_order", { ascending: true });
    const rows = data?.length ? data : seed.PORTFOLIO;
    return rows.map(normalizePortfolioItem);
  } catch {
    return seed.PORTFOLIO.map(normalizePortfolioItem);
  }
}

export async function getPortfolioBySlug(slug) {
  const fromSeed = () =>
    normalizePortfolioItem(
      seed.PORTFOLIO.find((item) => (item.slug || slugifyTitle(item.title)) === slug) || null
    );

  if (!isSupabaseConfigured()) return fromSeed();
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("portfolio").select("*").eq("slug", slug).maybeSingle();
    if (data) return normalizePortfolioItem(data);
    return fromSeed();
  } catch {
    return fromSeed();
  }
}

export async function getTestimonials() {
  if (!isSupabaseConfigured()) return seed.TESTIMONIALS;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    return data?.length ? data : seed.TESTIMONIALS;
  } catch {
    return seed.TESTIMONIALS;
  }
}

export async function getTrustStats() {
  // Prefer DB trust wall; else derive from SITE defaults (same numbers as site-config).
  const fallback = buildTrustFromSite(seed.SITE);

  if (!isSupabaseConfigured()) return fallback;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("trust_stats")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (!data?.length) return fallback;
    return data.map((r) => ({
      label: r.label,
      labelHi: r.label_hi,
      value: r.value,
      valueHi: r.value_hi,
    }));
  } catch {
    return fallback;
  }
}

export async function getFaqs() {
  if (!isSupabaseConfigured()) return seed.FAQS;
  try {
    const supabase = await createClient();
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
    const supabase = await createClient();
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
  if (!isSupabaseConfigured()) return seed.LOOKBOOK;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("lookbook_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (data?.length) return data;
    return seed.LOOKBOOK;
  } catch {
    return seed.LOOKBOOK;
  }
}

export async function getLookbookPostBySlug(slug) {
  const fromSeed = () => seed.LOOKBOOK.find((post) => post.slug === slug) || null;

  if (!isSupabaseConfigured()) return fromSeed();
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("lookbook_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (data) return data;
    return fromSeed();
  } catch {
    return fromSeed();
  }
}

export async function getNextBatch() {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("batches")
      .select("start_date, seats_left, seats_total, course_id")
      .eq("is_active", true)
      .gte("start_date", new Date().toISOString().slice(0, 10))
      .order("start_date", { ascending: true })
      .limit(1)
      .maybeSingle();
    return data;
  } catch {
    return null;
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
      lookbook: seed.LOOKBOOK.length,
      inquiries: 0,
      unreadEnquiries: 0,
    };
  }
  try {
    const supabase = await createClient();
    const [products, courses, portfolio, testimonials, trust, faqs, lookbook, inquiries, unread] =
      await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("courses").select("id", { count: "exact", head: true }),
      supabase.from("portfolio").select("id", { count: "exact", head: true }),
      supabase.from("testimonials").select("id", { count: "exact", head: true }),
      supabase.from("trust_stats").select("id", { count: "exact", head: true }),
      supabase.from("faqs").select("id", { count: "exact", head: true }),
      supabase.from("lookbook_posts").select("id", { count: "exact", head: true }),
      supabase.from("contact_inquiries").select("id", { count: "exact", head: true }),
      supabase.from("contact_inquiries").select("id", { count: "exact", head: true }).eq("is_read", false),
    ]);
    return {
      products: products.count ?? 0,
      courses: courses.count ?? 0,
      portfolio: portfolio.count ?? 0,
      testimonials: testimonials.count ?? 0,
      trust: trust.count ?? 0,
      faqs: faqs.count ?? 0,
      lookbook: lookbook.count ?? 0,
      inquiries: inquiries.count ?? 0,
      unreadEnquiries: unread.count ?? 0,
    };
  } catch {
    return {
      products: seed.PRODUCTS.length,
      courses: seed.COURSES.length,
      portfolio: seed.PORTFOLIO.length,
      testimonials: seed.TESTIMONIALS.length,
      trust: seed.TRUST.length,
      faqs: seed.FAQS.length,
      lookbook: 0,
      inquiries: 0,
      unreadEnquiries: 0,
    };
  }
}

export { seed };
