/**
 * One-time codemod: replace globals.css utility class strings with @/lib/ui imports.
 * Run: node scripts/migrate-ui-classes.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "src");

const CLASS_TO_EXPORT = {
  "page-container": "PAGE_CONTAINER",
  "page-section--bordered": "PAGE_SECTION_BORDERED",
  "page-section--tight-top": "PAGE_SECTION_TIGHT_TOP",
  "page-section": "PAGE_SECTION",
  "section-eyebrow": "SECTION_EYEBROW",
  "section-title": "SECTION_TITLE",
  "section-lead": "SECTION_LEAD",
  "page-hero-title--compact": "PAGE_HERO_TITLE_COMPACT",
  "page-hero-title": "PAGE_HERO_TITLE",
  "reveal-left": "REVEAL_LEFT",
  "reveal-right": "REVEAL_RIGHT",
  "reveal-zoom": "REVEAL_ZOOM",
  reveal: "REVEAL",
  glass: "GLASS",
  "field-surface": "FIELD_SURFACE",
  "filter-pills": "FILTER_PILLS",
  "filter-pill": "FILTER_PILL",
  "surface-badge": "SURFACE_BADGE",
  "btn-gold-outline": "BTN_GOLD_OUTLINE",
  "btn-gold": "BTN_GOLD",
  "btn-primary": "BTN_PRIMARY",
  "btn-ghost": "BTN_GHOST",
  "btn-mobile": "BTN_MOBILE",
  "highlight-shimmer": "HIGHLIGHT_SHIMMER",
  "text-gold-gradient": "TEXT_GOLD_GRADIENT",
  "text-accent-gradient": "TEXT_ACCENT_GRADIENT",
  "policy-prose": "POLICY_PROSE",
  "section-muted": "SECTION_MUTED",
  "interactive-card": "INTERACTIVE_CARD",
  "section-ornament": "SECTION_ORNAMENT",
  "section-header-glass": "SECTION_HEADER_GLASS",
  hairline: "HAIRLINE",
  "sparkle-pulse": "SPARKLE_PULSE",
  "float-soft": "FLOAT_SOFT",
  "anim-rise": "ANIM_RISE",
  "marquee-container": "MARQUEE_CONTAINER",
  "marquee-content": "MARQUEE_CONTENT",
  "popup-panel": "POPUP_PANEL",
  "home-band--white": "HOME_BAND_WHITE",
  "home-band--brand": "HOME_BAND_BRAND",
  tilt: "TILT",
};

const SORTED_CLASSES = Object.keys(CLASS_TO_EXPORT).sort((a, b) => b.length - a.length);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith(".jsx")) files.push(full);
  }
  return files;
}

function splitClasses(str) {
  return str.trim().split(/\s+/).filter(Boolean);
}

function processClassString(classStr) {
  const tokens = splitClasses(classStr);
  const usedExports = new Set();
  const remaining = [];

  for (const token of tokens) {
    const exportName = CLASS_TO_EXPORT[token];
    if (exportName) usedExports.add(exportName);
    else remaining.push(token);
  }

  if (usedExports.size === 0) return { changed: false, usedExports, expr: null };

  const exportList = [...usedExports].sort();
  const parts = [...exportList, ...remaining.map((c) => `"${c}"`)];
  const expr = parts.length === 1 && !remaining.length ? exportList[0] : `cn(${parts.join(", ")})`;

  return { changed: true, usedExports, expr };
}

function transformContent(content, filePath) {
  if (filePath.includes("lib/ui.js")) return content;

  const usedExports = new Set();
  let changed = false;

  // className="..."
  content = content.replace(/className="([^"]+)"/g, (match, classStr) => {
    const result = processClassString(classStr);
    if (!result.changed) return match;
    changed = true;
    result.usedExports.forEach((e) => usedExports.add(e));
    return `className={${result.expr}}`;
  });

  // className={'...'}
  content = content.replace(/className=\{'([^']+)'\}/g, (match, classStr) => {
    const result = processClassString(classStr);
    if (!result.changed) return match;
    changed = true;
    result.usedExports.forEach((e) => usedExports.add(e));
    return `className={${result.expr}}`;
  });

  // Template literals in cn() - replace tokens inside backtick strings
  content = content.replace(/`([^`]*\b(?:page-container|glass|reveal|btn-gold|section-title)[^`]*)`/g, (match, inner) => {
    let newInner = inner;
    let innerChanged = false;
    for (const cls of SORTED_CLASSES) {
      const re = new RegExp(`\\b${cls.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
      if (re.test(newInner)) {
        innerChanged = true;
        usedExports.add(CLASS_TO_EXPORT[cls]);
        newInner = newInner.replace(re, `\${${CLASS_TO_EXPORT[cls]}}`);
      }
    }
    if (!innerChanged) return match;
    changed = true;
    return `\`${newInner}\``;
  });

  if (!changed || usedExports.size === 0) return content;

  const exportNames = [...usedExports].sort();
  const importLine = `import { ${exportNames.join(", ")} } from "@/lib/ui";`;

  if (content.includes('from "@/lib/ui"')) {
    content = content.replace(
      /import\s*\{([^}]+)\}\s*from\s*"@\/lib\/ui";/,
      (_, existing) => {
        const merged = [...new Set([...existing.split(",").map((s) => s.trim()).filter(Boolean), ...exportNames])].sort();
        return `import { ${merged.join(", ")} } from "@/lib/ui";`;
      }
    );
  } else {
    const cnNeeded = content.includes("cn(") || exportNames.some((n) => content.includes(`cn(${n}`));
    const hasCnImport = content.includes('from "@/lib/utils"');

    if (cnNeeded && !hasCnImport) {
      const firstImport = content.search(/^import /m);
      const cnImport = 'import { cn } from "@/lib/utils";\n';
      content = content.slice(0, firstImport) + cnImport + content.slice(firstImport);
    }

    const firstImport = content.search(/^import /m);
    content = content.slice(0, firstImport) + importLine + "\n" + content.slice(firstImport);
  }

  return content;
}

let total = 0;
for (const file of walk(root)) {
  const original = fs.readFileSync(file, "utf8");
  const updated = transformContent(original, file);
  if (updated !== original) {
    fs.writeFileSync(file, updated);
    console.log("Updated:", path.relative(root, file));
    total++;
  }
}
console.log(`Done. ${total} files updated.`);
