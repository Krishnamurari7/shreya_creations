/** Prepare a row for Supabase insert/update from admin form state. */
export function buildPayload(editing, fields, { isUpdate = false } = {}) {
  const payload = {};
  fields.forEach((f) => {
    payload[f.name] = editing[f.name];
  });

  fields.forEach((f) => {
    const key = f.name;
    let val = payload[key];

    if (f.type === "list" && typeof val === "string") {
      val = val.split("\n").map((x) => x.trim()).filter(Boolean);
      payload[key] = val;
    }

    if (f.type === "number") {
      if (val === "" || val === null || val === undefined) {
        payload[key] = null;
      } else {
        const n = Number(val);
        payload[key] = Number.isFinite(n) ? n : null;
      }
    }

    if (f.type === "images" || f.type === "list") {
      if (!Array.isArray(payload[key])) payload[key] = [];
    }

    if (f.type === "image" || f.type === "pdf") {
      if (payload[key] === "" || payload[key] == null) payload[key] = null;
    }

    if (f.type === "checkbox") {
      payload[key] = Boolean(val);
    }

    if (typeof payload[key] === "string" && f.type !== "textarea" && f.type !== "list") {
      const trimmed = payload[key].trim();
      payload[key] = trimmed === "" ? null : trimmed;
    }

    if (f.type === "textarea" && typeof payload[key] === "string") {
      payload[key] = payload[key].trim() || null;
    }
  });

  // New items: sensible defaults
  if (!isUpdate) {
    if ("published" in payload && payload.published === false && fields.some((f) => f.name === "published")) {
      // keep explicit false
    } else if (fields.some((f) => f.name === "published")) {
      payload.published = true;
    }
    if (fields.some((f) => f.name === "coming_soon") && !("coming_soon" in editing)) {
      payload.coming_soon = true;
    }
    if (fields.some((f) => f.name === "images") && !payload.images) {
      payload.images = [];
    }
  }

  return payload;
}

export function validatePayload(payload, fields) {
  if (!payload.title?.trim?.()) {
    const hasTitle = fields.some((f) => f.name === "title");
    if (hasTitle) return "Title is required.";
  }
  if (fields.some((f) => f.name === "slug") && payload.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.slug)) {
    return "Slug can only use lowercase letters, numbers, and hyphens.";
  }
  return null;
}

export function slugify(s) {
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
