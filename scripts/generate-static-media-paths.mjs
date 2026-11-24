import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(process.cwd(), "src");
const output = join(root, "lib", "admin", "static-media-paths.json");
const paths = new Set();
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
      paths.add(prefix + match[1]);
    }
  }
}

visit(root);
writeFileSync(output, `${JSON.stringify([...paths].sort(), null, 2)}\n`);
console.log(`Protected ${paths.size} media paths found in ${relative(process.cwd(), root)}.`);
