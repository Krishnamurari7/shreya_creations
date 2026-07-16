import { getSiteUrl } from "@/lib/siteUrl";

export const DEFAULT_OG_IMAGE = "/hero_studio_banner.png";

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

export function courseMetaTitle(course) {
  if (course?.meta_title || course?.metaTitle) return course.meta_title || course.metaTitle;
  const name = itemName(course);
  return name ? `${name} in Patna | Shreya Creation` : "Course in Patna | Shreya Creation";
}

export function courseMetaDescription(course) {
  if (course?.meta_description || course?.metaDescription) {
    return course.meta_description || course.metaDescription;
  }
  return (
    course?.description ||
    course?.about ||
    `Learn ${itemName(course) || "fashion"} at Shreya Creation Patna — practical boutique & fashion training with certificate support.`
  );
}

export function productMetaTitle(product) {
  if (product?.meta_title || product?.metaTitle) return product.meta_title || product.metaTitle;
  const name = itemName(product);
  return name
    ? `${name} — Custom Stitched in Patna | Shreya Creation`
    : "Custom Stitching in Patna | Shreya Creation";
}

export function productMetaDescription(product) {
  if (product?.meta_description || product?.metaDescription) {
    return product.meta_description || product.metaDescription;
  }
  return (
    product?.description_long ||
    product?.description ||
    `Order ${itemName(product) || "designer wear"} from Shreya Creation Patna — custom fit, boutique finishing, WhatsApp ordering.`
  );
}

export function portfolioMetaTitle(item) {
  if (item?.meta_title || item?.metaTitle) return item.meta_title || item.metaTitle;
  const name = itemName(item);
  return name ? `${name} | Shreya Creation Patna` : "Portfolio | Shreya Creation Patna";
}

export function portfolioMetaDescription(item) {
  if (item?.meta_description || item?.metaDescription) {
    return item.meta_description || item.metaDescription;
  }
  return (
    item?.caption ||
    item?.description ||
    `${itemName(item) || "Designer work"} crafted at Shreya Creation Patna — bridal & boutique stitching on Boring Road.`
  );
}

export function buildMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  imageAlt = "Shreya Creation fashion boutique and stitching institute in Patna",
  type = "website",
  noIndex = false,
}) {
  const cleanDescription = seoDescription(description);
  const canonicalPath = path || "/";
  return {
    title: { absolute: title },
    description: cleanDescription,
    alternates: { canonical: canonicalPath },
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
      locale: "en_IN",
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

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs = []) {
  const entities = faqs
    .map((faq) => {
      const question = faq.q || faq.question;
      const answer = faq.a || faq.answer;
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
    mainEntity: entities,
  };
}

export function courseJsonLd(course, site) {
  const name = itemName(course);
  const description = seoDescription(courseMetaDescription(course));
  const image = absoluteUrl(itemImage(course));
  const providerName = site?.brandName || site?.brand || "Shreya Creation";
  const data = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: providerName,
      sameAs: absoluteUrl("/"),
    },
    image,
    url: absoluteUrl(`/courses/${course.slug}`),
    inLanguage: ["en", "hi"],
  };

  if (course.price != null && course.price !== "") {
    data.hasCourseInstance = {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: {
        "@type": "Place",
        name: providerName,
        address: {
          "@type": "PostalAddress",
          streetAddress: site?.addressLine || site?.address,
          addressLocality: site?.city || "Patna",
          addressRegion: "Bihar",
          postalCode: site?.pincode || "800001",
          addressCountry: "IN",
        },
      },
      offers: {
        "@type": "Offer",
        price: Number(course.price),
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: absoluteUrl(`/courses/${course.slug}`),
      },
    };
  }

  return data;
}

export function productJsonLd(product) {
  const name = itemName(product);
  const images = product.images?.length
    ? product.images.map((src) => absoluteUrl(src))
    : [absoluteUrl(itemImage(product))];

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: seoDescription(productMetaDescription(product)),
    image: images,
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: "Shreya Creation",
    },
    url: absoluteUrl(`/shop/${product.slug}`),
  };

  if (product.price != null && product.price !== "") {
    data.offers = {
      "@type": "Offer",
      price: Number(product.price),
      priceCurrency: "INR",
      availability: product.published === false
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      url: absoluteUrl(`/shop/${product.slug}`),
    };
  }

  return data;
}
