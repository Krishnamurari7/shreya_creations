import { LOOKBOOK } from "@/lib/seed";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isDbUuid(id) {
  return typeof id === "string" && UUID_RE.test(id);
}

/** Merge seed blog posts with Supabase rows for the admin Blog list. */
export function mergeAdminLookbook(dbRows = []) {
  const dbBySlug = new Map();

  dbRows.forEach((row) => {
    dbBySlug.set(row.slug, {
      ...row,
      title_hi: row.title_hi ?? row.titleHi ?? "",
      excerpt_hi: row.excerpt_hi ?? row.excerptHi ?? "",
      body_hi: row.body_hi ?? row.bodyHi ?? "",
      _dbId: row.id,
      _source: "db",
    });
  });

  const merged = LOOKBOOK.map((seedPost) => {
    const dbPost = dbBySlug.get(seedPost.slug);
    dbBySlug.delete(seedPost.slug);
    if (dbPost) {
      return {
        ...seedPost,
        ...dbPost,
        title_hi: dbPost.title_hi || seedPost.title_hi || "",
        excerpt_hi: dbPost.excerpt_hi || seedPost.excerpt_hi || "",
        body: dbPost.body || seedPost.body || "",
        body_hi: dbPost.body_hi || seedPost.body_hi || "",
        image_alt: dbPost.image_alt || seedPost.image_alt || "",
        focus_keyword: dbPost.focus_keyword || seedPost.focus_keyword || "",
        _dbId: dbPost._dbId,
        _source: "merged",
      };
    }
    return {
      ...seedPost,
      title_hi: seedPost.title_hi ?? "",
      excerpt_hi: seedPost.excerpt_hi ?? "",
      body: seedPost.body ?? "",
      body_hi: seedPost.body_hi ?? "",
      _dbId: null,
      _source: "seed",
    };
  });

  dbBySlug.forEach((dbPost) => merged.push(dbPost));

  return merged.sort((a, b) => {
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
    return bTime - aTime;
  });
}

/** Normalize a lookbook/blog row for the admin edit form. */
export function lookbookToFormState(post) {
  return {
    ...post,
    title_hi: post.title_hi ?? post.titleHi ?? "",
    excerpt: post.excerpt ?? "",
    excerpt_hi: post.excerpt_hi ?? post.excerptHi ?? "",
    body: post.body ?? "",
    body_hi: post.body_hi ?? post.bodyHi ?? "",
    meta_title: post.meta_title ?? post.metaTitle ?? "",
    meta_description: post.meta_description ?? post.metaDescription ?? "",
    og_image: post.og_image ?? post.ogImage ?? "",
    image_alt: post.image_alt ?? post.imageAlt ?? "",
    focus_keyword: post.focus_keyword ?? post.focusKeyword ?? "",
    published: post.published !== false,
    _dbId: isDbUuid(post.id) ? post.id : post._dbId ?? null,
  };
}
