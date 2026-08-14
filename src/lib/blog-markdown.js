/** Lightweight markdown → block parser for blog posts (headings, lists, bold). */

function parseInline(text = "") {
  const parts = String(text).split(/(\*\*.+?\*\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return { type: "strong", text: part.slice(2, -2) };
    }
    return { type: "text", text: part };
  });
}

function isListLine(line = "") {
  return /^\s*[*-]\s+/.test(line);
}

function listItemText(line = "") {
  return line.replace(/^\s*[*-]\s+/, "").trim();
}

function headingLevel(line = "") {
  const match = line.match(/^(#{1,3})\s+(.*)$/);
  if (!match) return null;
  return { level: match[1].length, text: match[2].trim() };
}

export function parseBlogMarkdown(body = "") {
  const lines = String(body).replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;
  let skippedTopH1 = false;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    const heading = headingLevel(trimmed);
    if (heading) {
      if (heading.level === 1 && !skippedTopH1) {
        skippedTopH1 = true;
        i += 1;
        continue;
      }
      blocks.push({
        type: heading.level === 2 ? "h2" : heading.level === 3 ? "h3" : "h4",
        text: heading.text,
        inline: parseInline(heading.text),
      });
      i += 1;
      continue;
    }

    if (isListLine(trimmed)) {
      const items = [];
      while (i < lines.length && isListLine(lines[i].trim())) {
        items.push({
          text: listItemText(lines[i].trim()),
          inline: parseInline(listItemText(lines[i].trim())),
        });
        i += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    const paragraphLines = [trimmed];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !headingLevel(lines[i].trim()) &&
      !isListLine(lines[i].trim())
    ) {
      paragraphLines.push(lines[i].trim());
      i += 1;
    }

    const text = paragraphLines.join(" ");
    blocks.push({ type: "p", text, inline: parseInline(text) });
  }

  return blocks;
}

export function extractBlogFaqs(body = "") {
  const blocks = parseBlogMarkdown(body);
  const faqs = [];
  let inFaq = false;

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    if (block.type === "h2" && /faq|अक्सर पूछे|frequently asked/i.test(block.text)) {
      inFaq = true;
      continue;
    }
    if (!inFaq) continue;
    if (block.type === "h2") break;
    if (block.type === "h3" && /^Q\d+/i.test(block.text)) {
      const question = block.text.replace(/^Q\d+\.\s*/i, "").trim();
      const next = blocks[i + 1];
      const answer = next?.type === "p" ? next.text : "";
      if (question && answer) faqs.push({ question, answer });
    }
  }

  return faqs;
}

export function estimateReadingMinutes(body = "") {
  const words = String(body).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
