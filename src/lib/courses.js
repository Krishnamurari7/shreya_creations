function coursePdf(course) {
  return (course?.course_pdf ?? course?.coursePdf ?? "").trim();
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

export function comingSoonLabel(lang = "en") {
  return lang === "hi" ? "जल्द आ रहा है" : "Coming Soon";
}
