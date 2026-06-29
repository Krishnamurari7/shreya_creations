import fs from "fs";
import path from "path";

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith(".jsx")) files.push(full);
  }
  return files;
}

let fixed = 0;
for (const file of walk("src")) {
  let content = fs.readFileSync(file, "utf8");
  if (!/\bcn\(/.test(content) || content.includes('from "@/lib/utils"')) continue;

  const firstImport = content.search(/^import /m);
  if (firstImport === -1) continue;

  content =
    content.slice(0, firstImport) +
    'import { cn } from "@/lib/utils";\n' +
    content.slice(firstImport);
  fs.writeFileSync(file, content);
  console.log("Fixed:", file);
  fixed++;
}
console.log(`Fixed ${fixed} files.`);
