import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(process.cwd(), "src");
const output = join(root, "lib", "admin", "static-media-paths.json");
const paths = new Map();
const imageRef = /(?:https?:\/\/[\w.-]+\/storage\/v1\/object\/public\/media\/|\$\{SB_MEDIA\}\/|\$\{SB\}\/|\$\{SB_DEFAULTS\}\/)([\w./-]+\.(?:avif|gif|jpe?g|png|webp))/gi;

function visit(folder) {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const absolute = join(folder, entry.name);
    if (entry.isDirectory()) {
      visit(absolute);
      continue;
    }
    if (!/\.[cm]?[jt]sx?$/.test(entry.name)) continue;

    const source = readFileSync(absolute, "utf8");
    for (const match of source.matchAll(imageRef)) {
      const prefix = match[0].startsWith("${SB_DEFAULTS}/") ? "site-defaults/" : "";
      const path = prefix + match[1];
      if (!paths.has(path)) paths.set(path, new Set());
      paths.get(path).add(relative(root, absolute).replaceAll("\\", "/"));
    }
  }
}

visit(root);
const manifest = Object.fromEntries(
  [...paths].sort(([a], [b]) => a.localeCompare(b)).map(([path, sources]) => [path, [...sources].sort()])
);
writeFileSync(output, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Protected ${paths.size} media paths found in ${relative(process.cwd(), root)}.`);
