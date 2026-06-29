/**
 * Remove CSS blocks migrated to src/lib/ui.js + tailwind.config.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "app", "globals.css");
let css = fs.readFileSync(file, "utf8");

const blocks = [
  // @layer components — fully in ui.js
  /@layer components \{[\s\S]*?\n\}/,
  // Duplicate dark glass (in GLASS constant)
  /\/\* ========== Public dark \/ night theme ========== \*\/\s*html\.dark \.glass \{[\s\S]*?\}\s*html\.dark \.glass:hover \{[\s\S]*?\}\s*/,
  // popup-panel + slide-up keyframe (tailwind animate-slide-up)
  /\/\* Modal \/ popup slide-up \*\/\s*\.popup-panel \{[\s\S]*?\}\s*@keyframes slide-up \{[\s\S]*?\}\s*/,
  // anim-rise + rise-in keyframe (tailwind)
  /@keyframes rise-in \{[\s\S]*?\}\s*\.anim-rise \{[\s\S]*?\}\s*/,
  // float-soft (tailwind)
  /@keyframes float-soft \{[\s\S]*?\}\s*\.float-soft \{[\s\S]*?\}\s*/,
  // sparkle-pulse (tailwind)
  /@keyframes sparkle-pulse \{[\s\S]*?\}\s*\.sparkle-pulse \{[\s\S]*?\}\s*/,
  // marquee (tailwind)
  /\.marquee-container \{[\s\S]*?\}\s*\.marquee-content \{[\s\S]*?\}\s*\.marquee-content:hover \{[\s\S]*?\}\s*@keyframes marquee-scroll \{[\s\S]*?\}\s*/,
  // section-header-glass eyebrow (ui.js SECTION_HEADER_GLASS)
  /\/\* Section header — glass eyebrow \*\/\s*\.section-header-glass \.section-eyebrow \{[\s\S]*?\}\s*html\.dark \.section-header-glass \.section-eyebrow \{[\s\S]*?\}\s*/,
  // interactive-card base (ui.js INTERACTIVE_CARD) — keep about-pillar hover via separate rule
  /\.interactive-card \{\s*transition:[\s\S]*?\}\s*\.interactive-card\.in:hover,\s*/,
  // section-ornament (ui.js SECTION_ORNAMENT)
  /\.section-ornament \{[\s\S]*?\}\s*\.section-ornament::before,[\s\S]*?\}\s*/,
];

let removed = 0;
for (const re of blocks) {
  const next = css.replace(re, "");
  if (next !== css) {
    removed++;
    css = next;
  }
}

// Restore about-pillar hover rule if stripped with interactive-card
if (!css.includes(".about-pillar-card.in:hover")) {
  css = css.replace(
    /@keyframes about-shimmer/,
    `.about-pillar-card.in:hover {
  transform: translateY(-4px);
}

@keyframes about-shimmer`
  );
}

// Mobile marquee override was inside marquee block — add minimal if needed
if (!css.includes("marquee-content") && css.includes("@media (max-width: 639px)")) {
  // reduced-motion still references marquee-content class name from ui.js — ok
}

fs.writeFileSync(file, css);
const lines = css.split("\n").length;
console.log(`Removed ${removed} blocks. globals.css now ${lines} lines.`);
