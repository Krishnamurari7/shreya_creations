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

export function isDbUuid(id) {
  return typeof id === "string" && UUID_RE.test(id);
}

/** Merge seed catalog with Supabase rows for the admin course list. */
export function mergeAdminCourses(dbRows = []) {
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
    is_addon: Boolean(course.is_addon ?? course.isAddon),
    badge: course.badge ?? "",
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
