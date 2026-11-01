/** Lightweight markdown → block parser for blog posts (headings, lists, bold, links). */

const SITE_HOSTS = new Set(["shreyacreation.com", "www.shreyacreation.com", "localhost"]);

/** Keep a blog URL as a real link, and turn this site's absolute URLs into in-app paths. */
export function safeBlogHref(raw) {
  let href = String(raw || "").trim();
  if (!href || /[\s\\<>"']/.test(href)) return null;
  if (/^(javascript|data|vbscript):/i.test(href)) return null;

  if (href.startsWith("/") && !href.startsWith("//")) return href;
  if (/^mailto:[^\s@]+@[^\s@]+$/i.test(href)) return href;
  if (/^tel:\+?[\d().-]+$/i.test(href)) return href;
  if (/^www\./i.test(href)) href = `https://${href}`;
  if (!/^https?:\/\//i.test(href)) return null;

  try {
    const url = new URL(href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (SITE_HOSTS.has(url.hostname)) {
      return `${url.pathname}${url.search}${url.hash}` || "/";
    }
    return url.href;
  } catch {
    return null;
  }
}

function peelTrailingPunctuation(url) {
  let href = url;
  let trailing = "";
  while (href && /[.,!?;:)]$/.test(href)) {
    if (href.endsWith(")")) {
      const opens = (href.match(/\(/g) || []).length;
      const closes = (href.match(/\)/g) || []).length;
      if (closes <= opens) break;
    }
    trailing = href.slice(-1) + trailing;
    href = href.slice(0, -1);
  }
  return { href, trailing };
}

function parseInline(text = "") {
  const source = String(text);
  const re =
    /\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s<]+|www\.[^\s<]+|(?<=^|\s|\()\/(?!\/)[A-Za-z0-9][^\s<]*)|\*\*([\s\S]+?)\*\*/g;
  const parts = [];
  let last = 0;
  let match;

  while ((match = re.exec(source))) {
    if (match.index > last) {
      parts.push({ type: "text", text: source.slice(last, match.index) });
    }

    if (match[1] != null && match[2] != null) {
      const href = safeBlogHref(match[2]);
      if (href) parts.push({ type: "link", href, text: match[1] });
      else parts.push({ type: "text", text: match[0] });
    } else if (match[3]) {
      const { href, trailing } = peelTrailingPunctuation(match[3]);
      const safe = safeBlogHref(href);
      if (safe) {
        parts.push({ type: "link", href: safe, text: href });
        if (trailing) parts.push({ type: "text", text: trailing });
      } else {
        parts.push({ type: "text", text: match[0] });
      }
    } else if (match[4] != null) {
      parts.push({ type: "strong", children: parseInline(match[4]) });
    }

    last = re.lastIndex;
  }

  if (last < source.length) parts.push({ type: "text", text: source.slice(last) });
  if (!parts.length && source) parts.push({ type: "text", text: source });
  return parts;
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
