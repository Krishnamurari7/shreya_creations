import { COURSES } from "@/lib/seed";

function coursePdf(course) {
  return (course?.course_pdf ?? course?.coursePdf ?? "").trim();
}

function normalizeSyllabus(syllabus) {
  if (Array.isArray(syllabus)) return syllabus;
  if (typeof syllabus === "string") return syllabus.split("\n").filter(Boolean);
  return [];
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Homepage entry-point courses — shown before add-on modules. */
export const FLAGSHIP_COURSE_SLUGS = [
  "fashion-designing-course",
  "advanced-boutique-course",
  "blouse-suit-making-course",
  "lehenga-making-course",
];

export function isDbUuid(id) {
  return typeof id === "string" && UUID_RE.test(id);
}

export function isFlagshipCourse(course) {
  return Boolean(course?.slug && FLAGSHIP_COURSE_SLUGS.includes(course.slug));
}

/** True when owner has confirmed the displayed starting fee. */
export function isPriceConfirmed(course) {
  if (course?.price_confirmed === true || course?.priceConfirmed === true) return true;
  if (course?.price_confirmed === false || course?.priceConfirmed === false) return false;
  if (course?.price_tbd === true || course?.priceTbd === true) return false;
  return course?.price != null && Number(course.price) > 0;
}

/**
 * Starting price for course cards — never invents a fee.
 * @returns {{ kind: "price" | "todo"; amount?: number; label: string }}
 */
export function courseStartingPrice(course, lang = "en") {
  const hi = lang === "hi";
  if (isPriceConfirmed(course) && course.price != null) {
    const amount = Number(course.price);
    return {
      kind: "price",
      amount,
      label: `₹${amount.toLocaleString("en-IN")}`,
    };
  }
  return {
    kind: "todo",
    label: hi ? "वर्तमान फीस के लिए संपर्क करें" : "Contact us for current fee details",
  };
}

export function sortFlagshipFirst(courses = []) {
  return [...courses].sort((a, b) => {
    const aFlag = isFlagshipCourse(a);
    const bFlag = isFlagshipCourse(b);
    if (aFlag !== bFlag) return aFlag ? -1 : 1;
    const aIdx = FLAGSHIP_COURSE_SLUGS.indexOf(a.slug);
    const bIdx = FLAGSHIP_COURSE_SLUGS.indexOf(b.slug);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    return (a.title || "").localeCompare(b.title || "");
  });
}

/** Merge seed catalog with Supabase rows for the admin course list. */
export function mergeAdminCourses(dbRows = []) {
  if (dbRows.length) {
    return dbRows
      .map((row) => ({
        ...row,
        title_hi: row.title_hi ?? row.titleHi ?? "",
        syllabus: normalizeSyllabus(row.syllabus),
        is_addon: Boolean(row.is_addon),
        _dbId: row.id,
        _source: "db",
      }))
      .sort((a, b) => {
        const byCategory = (a.category || "").localeCompare(b.category || "");
        if (byCategory !== 0) return byCategory;
        return (a.title || "").localeCompare(b.title || "");
      });
  }

  const dbBySlug = new Map();

  dbRows.forEach((row) => {
    dbBySlug.set(row.slug, {
      ...row,
      title_hi: row.title_hi ?? row.titleHi ?? "",
      syllabus: normalizeSyllabus(row.syllabus),
      is_addon: Boolean(row.is_addon),
      _dbId: row.id,
      _source: "db",
    });
  });

  const merged = COURSES.map((seedCourse) => {
    const dbCourse = dbBySlug.get(seedCourse.slug);
    dbBySlug.delete(seedCourse.slug);
    if (dbCourse) {
      return {
        ...seedCourse,
        ...dbCourse,
        title_hi: dbCourse.title_hi || seedCourse.title_hi || seedCourse.titleHi || "",
        syllabus: dbCourse.syllabus?.length ? dbCourse.syllabus : normalizeSyllabus(seedCourse.syllabus),
        _dbId: dbCourse._dbId,
        _source: "merged",
      };
    }
    return {
      ...seedCourse,
      title_hi: seedCourse.title_hi ?? seedCourse.titleHi ?? "",
      syllabus: normalizeSyllabus(seedCourse.syllabus),
      _dbId: null,
      _source: "seed",
    };
  });

  dbBySlug.forEach((dbCourse) => merged.push(dbCourse));

  return merged.sort((a, b) => {
    const byCategory = (a.category || "").localeCompare(b.category || "");
    if (byCategory !== 0) return byCategory;
    return (a.title || "").localeCompare(b.title || "");
  });
}

/** Normalize a course row for the admin edit form. */
export function courseToFormState(course) {
  return {
    ...course,
    title_hi: course.title_hi ?? course.titleHi ?? "",
    description_hi: course.description_hi ?? "",
    about: course.about ?? "",
    about_hi: course.about_hi ?? "",
    includes: Array.isArray(course.includes) ? course.includes : [],
    includes_hi: Array.isArray(course.includes_hi) ? course.includes_hi : [],
    syllabus: normalizeSyllabus(course.syllabus),
    course_pdf: course.course_pdf ?? course.coursePdf ?? "",
    image: course.image ?? "",
    preview_video: course.preview_video ?? course.previewVideo ?? "",
    is_addon: Boolean(course.is_addon ?? course.isAddon),
    badge: course.badge ?? "",
    published: course.published !== false,
    meta_title: course.meta_title ?? course.metaTitle ?? "",
    meta_description: course.meta_description ?? course.metaDescription ?? "",
    og_image: course.og_image ?? course.ogImage ?? "",
    image_alt: course.image_alt ?? course.imageAlt ?? "",
    focus_keyword: course.focus_keyword ?? course.focusKeyword ?? "",
    _dbId: isDbUuid(course.id) ? course.id : course._dbId ?? null,
  };
}

function courseHasDetails(course) {
  if (!course) return false;

  const about = (course.about ?? course.about_hi ?? course.aboutHi ?? "").trim();
  if (about) return true;

  if (Array.isArray(course.includes) && course.includes.length > 0) return true;
  if (Array.isArray(course.includes_hi) && course.includes_hi.length > 0) return true;

  return false;
}

/** Course is open for enrollment when it has both a PDF brochure and full details. */
export function isCourseAvailable(course) {
  return Boolean(coursePdf(course) && courseHasDetails(course));
}

export function isAddonCourse(course) {
  return Boolean(course?.is_addon ?? course?.isAddon);
}

export function addonCourseLabel(lang = "en") {
  return lang === "hi" ? "ऐड-ऑन कोर्स" : "Add-on Course";
}

export function comingSoonLabel(lang = "en") {
  return lang === "hi" ? "जल्द आ रहा है" : "Coming Soon";
}
