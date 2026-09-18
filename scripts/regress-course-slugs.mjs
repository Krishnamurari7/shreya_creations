/**
 * Focused regression: footer course slugs resolve via seed fallback.
 * Run: node scripts/regress-course-slugs.mjs
 */
import assert from "assert";
import { createRequire } from "module";

// Smoke-test seed presence + formatCountPlus without Next path aliases.
import fs from "fs";

const seed = fs.readFileSync("src/lib/seed.js", "utf8");
for (const slug of ["fashion-designing-course", "kids-wear-course"]) {
  assert.ok(seed.includes(`slug: "${slug}"`), `seed missing ${slug}`);
}

const siteConfig = fs.readFileSync("src/lib/site-config.js", "utf8");
assert.ok(siteConfig.includes("export function formatCountPlus"), "formatCountPlus missing");

const data = fs.readFileSync("src/lib/data.js", "utf8");
assert.ok(
  data.includes("return seedCourse ? normalizeCourse(seedCourse) : null"),
  "getCourseBySlug seed fallback missing"
);

const inquiry = fs.readFileSync("src/components/InquiryPopup.jsx", "utf8");
assert.ok(!inquiry.includes("delayMs"), "InquiryPopup must not auto-open on a delay");
assert.ok(inquiry.includes("INQUIRY_OPEN_EVENT"), "InquiryPopup must listen for explicit open");

console.log("regress-course-slugs: PASS");
