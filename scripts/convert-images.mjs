/**
 * Converts photographic PNGs/JPEGs to WebP (quality 88, near-lossless look).
 * next/image serves AVIF + WebP at request time (see next.config.mjs formats).
 * Run: node scripts/convert-images.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";

const ROOT = path.resolve("public");

const CONVERT = [
  "hero_studio_banner.png",
  "background.png",
  "slider1.png",
  "slider2.png",
  "slider3.png",
  "boutique.png",
  "3d.png",
  "logo-nav.png",
  "categories/bridal.png",
  "categories/ethnic-wear.png",
  "categories/stitching.png",
  "categories/fashion-designing.png",
  "categories/beauty.png",
  "institute.png",
  "job.png",
  "slider4.png",
  "atelier_details.png",
  "founders/sanjay-kumar-mishra.jpg",
  "founders/sangi-shreya.jpg",
];

/** Legacy misspelling and standard names → boutique.webp */
function outName(rel) {
  if (rel === "boutique.png") return "boutique.webp";
  const parsed = path.parse(rel);
  return `${parsed.dir ? `${parsed.dir}/` : ""}${parsed.name}.webp`;
}

const report = [];

for (const rel of CONVERT) {
  const input = path.join(ROOT, rel);
  if (!fs.existsSync(input)) {
    console.warn(`skip missing: ${rel}`);
    continue;
  }
  const outputRel = outName(rel);
  const output = path.join(ROOT, outputRel);
  const before = fs.statSync(input).size;

  await sharp(input)
    .webp({ quality: 88, effort: 6 })
    .toFile(output);

  const after = fs.statSync(output).size;
  report.push({ file: rel, output: outputRel, before, after });
  console.log(
    `${rel} → ${outputRel}: ${before} → ${after} bytes (${Math.round((1 - after / before) * 100)}% smaller)`
  );
}

console.log("\n--- SUMMARY ---");
for (const row of report) {
  console.log(JSON.stringify(row));
}
