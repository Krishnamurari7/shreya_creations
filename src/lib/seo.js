import { getSiteUrl } from "@/lib/siteUrl";
import { hreflangPaths, localizedPath, stripLocalePrefix } from "@/lib/locale";
import { pickFaq, UI } from "@/lib/i18n";
import { educationalOrganizationId, SCHEMA_STREET_ADDRESS } from "@/lib/json-ld";

export const DEFAULT_OG_IMAGE = "/hero_studio_banner.webp";

export function absoluteUrl(value = "") {
  if (!value) return getSiteUrl();
  if (/^https?:\/\//i.test(value)) return value;
  return `${getSiteUrl()}${value.startsWith("/") ? value : `/${value}`}`;
}

export function seoDescription(value, fallback) {
  const text = String(value || fallback || "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length <= 155 ? text : `${text.slice(0, 152).trimEnd()}…`;
}

export function itemName(item) {
  return item?.title || item?.name || "";
}

export function itemImage(item) {
  return (
    item?.og_image ||
    item?.ogImage ||
    item?.images?.[0] ||
    item?.image ||
    DEFAULT_OG_IMAGE
  );
}

export function itemImageAlt(item, city = "Patna") {
  const custom = item?.image_alt || item?.imageAlt;
  if (custom) return custom;
  const name = itemName(item);
  return name ? `${name} ${city}` : `Shreya Creation ${city}`;
}

export function courseMetaTitle(course, locale = "en") {
  if (locale === "hi") return courseMetaTitleHi(course);
  if (course?.meta_title || course?.metaTitle) return course.meta_title || course.metaTitle;
  const name = itemName(course);
  return name ? `${name} in Patna | Shreya Creation` : "Course in Patna | Shreya Creation";
}

export function courseMetaTitleHi(course) {
  if (course?.meta_title_hi || course?.metaTitleHi) return course.meta_title_hi || course.metaTitleHi;
  const name = course?.title_hi || course?.titleHi;
  if (name) return `${name} — पटना | Shreya Creation`;
  // TODO(owner): needs Hindi meta title for this course
  return "फैशन कोर्स पटना | Shreya Creation";
}

export function courseMetaDescription(course, locale = "en") {
  if (locale === "hi") return courseMetaDescriptionHi(course);
  if (course?.meta_description || course?.metaDescription) {
    return course.meta_description || course.metaDescription;
  }
  return (
    course?.description ||
    course?.about ||
    `Learn ${itemName(course) || "fashion"} at Shreya Creation Patna — practical boutique & fashion training with certificate support.`
  );
}

export function courseMetaDescriptionHi(course) {
  if (course?.meta_description_hi || course?.metaDescriptionHi) {
    return course.meta_description_hi || course.metaDescriptionHi;
  }
  const desc = course?.description_hi || course?.descriptionHi || course?.about_hi || course?.aboutHi;
  if (desc) return desc;
  const name = course?.title_hi || course?.titleHi || itemName(course);
  if (name) {
    return `Shreya Creation पटना में ${name} — प्रैक्टिकल बुटीक ट्रेनिंग, सर्टिफिकेट और प्लेसमेंट सपोर्ट।`;
  }
  // TODO(owner): needs Hindi meta description for this course
  return "पटना में फैशन और बुटीक कोर्स — Shreya Creation, बोरिंग रोड।";
}

export function productMetaTitle(product, locale = "en") {
  if (locale === "hi") return productMetaTitleHi(product);
  if (product?.meta_title || product?.metaTitle) return product.meta_title || product.metaTitle;
  const name = itemName(product);
  return name
    ? `${name} — Custom Stitched in Patna | Shreya Creation`
    : "Custom Stitching in Patna | Shreya Creation";
}

export function productMetaTitleHi(product) {
  if (product?.meta_title_hi || product?.metaTitleHi) return product.meta_title_hi || product.metaTitleHi;
  const name = product?.title_hi || product?.titleHi;
  if (name) return `${name} — पटना में सिलाई | Shreya Creation`;
  // TODO(owner): needs Hindi meta title for this product
  return "कस्टम सिलाई पटना | Shreya Creation";
}

export function productMetaDescription(product, locale = "en") {
  if (locale === "hi") return productMetaDescriptionHi(product);
  if (product?.meta_description || product?.metaDescription) {
    return product.meta_description || product.metaDescription;
  }
  return (
    product?.description_long ||
    product?.description ||
    `Order ${itemName(product) || "designer wear"} from Shreya Creation Patna — custom fit, boutique finishing, WhatsApp ordering.`
  );
}

export function productMetaDescriptionHi(product) {
  if (product?.meta_description_hi || product?.metaDescriptionHi) {
    return product.meta_description_hi || product.metaDescriptionHi;
  }
  const desc = product?.description_hi || product?.descriptionHi || product?.description_long_hi;
  if (desc) return desc;
  const name = product?.title_hi || product?.titleHi || itemName(product);
  if (name) {
    return `Shreya Creation पटना से ${name} ऑर्डर करें — कस्टम फिट, बुटीक फिनिश, WhatsApp ऑर्डर।`;
  }
  // TODO(owner): needs Hindi meta description for this product
  return "पटना में डिज़ाइनर वियर और कस्टम सिलाई — Shreya Creation बुटीक।";
}

export function portfolioMetaTitle(item, locale = "en") {
  if (locale === "hi") return portfolioMetaTitleHi(item);
  if (item?.meta_title || item?.metaTitle) return item.meta_title || item.metaTitle;
  const name = itemName(item);
  return name ? `${name} | Shreya Creation Patna` : "Portfolio | Shreya Creation Patna";
}

export function portfolioMetaTitleHi(item) {
  if (item?.meta_title_hi || item?.metaTitleHi) return item.meta_title_hi || item.metaTitleHi;
  const name = item?.title_hi || item?.titleHi;
  if (name) return `${name} | Shreya Creation पटना`;
  // TODO(owner): needs Hindi meta title for this portfolio item
  return "पोर्टफोलियो | Shreya Creation पटना";
}

export function portfolioMetaDescription(item, locale = "en") {
  if (locale === "hi") return portfolioMetaDescriptionHi(item);
  if (item?.meta_description || item?.metaDescription) {
    return item.meta_description || item.metaDescription;
  }
  return (
    item?.caption ||
    item?.description ||
    `${itemName(item) || "Designer work"} crafted at Shreya Creation Patna — bridal & boutique stitching on Boring Road.`
  );
}

export function portfolioMetaDescriptionHi(item) {
  if (item?.meta_description_hi || item?.metaDescriptionHi) {
    return item.meta_description_hi || item.metaDescriptionHi;
  }
  const caption = item?.caption_hi || item?.captionHi;
  if (caption) return caption;
  const name = item?.title_hi || item?.titleHi || itemName(item);
  if (name) {
    return `${name} — Shreya Creation पटना एटेलियर में ब्राइडल और बुटीक सिलाई, बोरिंग रोड।`;
  }
  // TODO(owner): needs Hindi meta description for this portfolio item
  return "Shreya Creation पटना — ब्राइडल और डिज़ाइनर काम।";
}

export function lookbookMetaTitle(post, locale = "en") {
  if (locale === "hi") return lookbookMetaTitleHi(post);
  if (post?.meta_title || post?.metaTitle) return post.meta_title || post.metaTitle;
  const name = itemName(post);
  return name ? `${name} | Shreya Creation Patna Blog` : "Blog | Shreya Creation Patna";
}

export function lookbookMetaTitleHi(post) {
  if (post?.meta_title_hi || post?.metaTitleHi) return post.meta_title_hi || post.metaTitleHi;
  const name = post?.title_hi || post?.titleHi;
  if (name) return `${name} | Shreya Creation ब्लॉग`;
  // TODO(owner): needs Hindi meta title for this blog post
  return "ब्लॉग | Shreya Creation पटना";
}

export function lookbookMetaDescription(post, locale = "en") {
  if (locale === "hi") return lookbookMetaDescriptionHi(post);
  if (post?.meta_description || post?.metaDescription) {
    return post.meta_description || post.metaDescription;
  }
  return (
    post?.excerpt ||
    post?.body ||
    `${itemName(post) || "Style tip"} from Shreya Creation Patna — bridal, blouse & boutique guides from Boring Road.`
  );
}

export function lookbookMetaDescriptionHi(post) {
  if (post?.meta_description_hi || post?.metaDescriptionHi) {
    return post.meta_description_hi || post.metaDescriptionHi;
  }
  const excerpt = post?.excerpt_hi || post?.excerptHi;
  if (excerpt) return excerpt;
  const name = post?.title_hi || post?.titleHi || itemName(post);
  if (name) {
    return `${name} — Shreya Creation पटना ब्लॉग से ब्राइडल, ब्लाउज और बुटीक गाइड।`;
  }
  // TODO(owner): needs Hindi meta description for this blog post
  return "Shreya Creation पटना — स्टाइल टिप्स और एटेलियर गाइड, बोरिंग रोड।";
}

export function blogListingMetaTitle(page) {
  if (page?.metaTitle || page?.meta_title) return page.metaTitle || page.meta_title;
  return "Blog | Style Tips & Atelier Guides from Shreya Creation Patna";
}

export function blogListingMetaDescription(page) {
  if (page?.metaDescription || page?.meta_description) {
    return page.metaDescription || page.meta_description;
  }
  return (
    page?.headerSubtitle ||
    page?.header_subtitle ||
    "Bridal blouse ideas, 24-hour stitching tips, NRI ordering guides and atelier stories from Shreya Creation on Boring Road, Patna."
  );
}

export function blogPostingJsonLd(post, locale = "en") {
  const name =
    locale === "hi" && (post.title_hi || post.titleHi)
      ? post.title_hi || post.titleHi
      : itemName(post);
  const description = seoDescription(lookbookMetaDescription(post, locale));
  const image = absoluteUrl(itemImage(post));
  const path = localizedPath(`/blog/${post.slug}`, locale);
  const url = absoluteUrl(path);
  const published = post.created_at || post.createdAt;
  const modified = post.updated_at || post.updatedAt || published;
  const lang = locale === "hi" ? "hi-IN" : "en-IN";
  const orgId = `${getSiteUrl()}/#clothing-store`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: name,
    description,
    image,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    datePublished: published || undefined,
    dateModified: modified || undefined,
    author: {
      "@type": "Organization",
      "@id": orgId,
      name: "Shreya Creation",
      url: getSiteUrl(),
    },
    publisher: {
      "@type": "Organization",
      "@id": orgId,
      name: "Shreya Creation",
      url: getSiteUrl(),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/3d.webp"),
      },
    },
    inLanguage: lang,
    keywords: post.focus_keyword || post.focusKeyword || undefined,
  };
}

export function buildMetadata({
  title,
  description,
  path,
  locale = "en",
  image = DEFAULT_OG_IMAGE,
  imageAlt = "Shreya Creation fashion boutique and stitching institute in Patna",
  type = "website",
  noIndex = false,
}) {
  const cleanDescription = seoDescription(description);
  const basePath = stripLocalePrefix(path || "/");
  const canonicalPath = localizedPath(basePath, locale);
  const siteUrl = getSiteUrl();
  const { enPath, hiPath } = hreflangPaths(basePath);
  const enUrl = `${siteUrl}${enPath}`;
  const hiUrl = `${siteUrl}${hiPath}`;
  const isHi = locale === "hi";

  return {
    title: { absolute: title },
    description: cleanDescription,
    alternates: {
      canonical: canonicalPath,
      languages: {
        "en-IN": enUrl,
        "hi-IN": hiUrl,
        "x-default": enUrl,
      },
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
            nocache: true,
          },
        }
      : {}),
    openGraph: {
      title,
      description: cleanDescription,
      url: canonicalPath,
      siteName: "Shreya Creation",
      locale: isHi ? "hi_IN" : "en_IN",
      alternateLocale: isHi ? ["en_IN"] : ["hi_IN"],
      type,
      images: [{ url: image, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cleanDescription,
      images: [image],
    },
  };
}

/** Sitemap helper — adds hreflang alternates to an entry. */
export function sitemapWithAlternates(path, entry) {
  const siteUrl = getSiteUrl();
  const { enPath, hiPath } = hreflangPaths(path);
  return {
    ...entry,
    url: `${siteUrl}${enPath}`,
    alternates: {
      languages: {
        "en-IN": `${siteUrl}${enPath}`,
        "hi-IN": `${siteUrl}${hiPath}`,
        "x-default": `${siteUrl}${enPath}`,
      },
    },
  };
}

export function breadcrumbLabel(key, locale = "en") {
  return UI[locale]?.[key] || UI.en[key] || key;
}

export function breadcrumbJsonLd(items, locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizedPath(item.path, locale)),
    })),
  };
}

export function faqJsonLd(faqs = [], locale = "en") {
  const entities = faqs
    .map((faq) => {
      const { q: question, a: answer } = pickFaq(faq, locale);
      if (!question || !answer) return null;
      return {
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      };
    })
    .filter(Boolean);

  if (!entities.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale === "hi" ? "hi-IN" : "en-IN",
    mainEntity: entities,
  };
}

export function courseJsonLd(course, site, locale = "en") {
  const name =
    locale === "hi" && (course.title_hi || course.titleHi)
      ? course.title_hi || course.titleHi
      : itemName(course);
  const description = seoDescription(courseMetaDescription(course, locale));
  const image = absoluteUrl(itemImage(course));
  const path = localizedPath(`/courses/${course.slug}`, locale);
  const url = absoluteUrl(path);
  const providerName = site?.brandName || site?.brand || "Shreya Creation";
  const lang = locale === "hi" ? "hi-IN" : "en-IN";

  const data = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    provider: {
      "@id": educationalOrganizationId(),
    },
    image,
    url,
    inLanguage: lang,
  };

  const instance = {
    "@type": "CourseInstance",
    courseMode: "Onsite",
    location: {
      "@type": "Place",
      name: providerName,
      address: {
        "@type": "PostalAddress",
        streetAddress: SCHEMA_STREET_ADDRESS,
        addressLocality: site?.city || "Patna",
        addressRegion: "Bihar",
        postalCode: site?.pincode || "800001",
        addressCountry: "IN",
      },
    },
  };

  if (course.duration) {
    instance.duration = course.duration;
  }

  data.hasCourseInstance = instance;

  if (course.price != null && course.price !== "") {
    data.offers = {
      "@type": "Offer",
      price: Number(course.price),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url,
    };
  }

  return data;
}

export function productJsonLd(product, locale = "en") {
  const name =
    locale === "hi" && (product.title_hi || product.titleHi)
      ? product.title_hi || product.titleHi
      : itemName(product);
  const images = product.images?.length
    ? product.images.map((src) => absoluteUrl(src))
    : [absoluteUrl(itemImage(product))];
  const path = localizedPath(`/shop/${product.slug}`, locale);
  const url = absoluteUrl(path);
  const lang = locale === "hi" ? "hi-IN" : "en-IN";

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: seoDescription(productMetaDescription(product, locale)),
    image: images,
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: "Shreya Creation",
    },
    url,
    inLanguage: lang,
  };

  if (product.price != null && product.price !== "") {
    data.offers = {
      "@type": "Offer",
      price: Number(product.price),
      priceCurrency: "INR",
      availability: product.published === false
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      url,
    };
  }

  return data;
}
