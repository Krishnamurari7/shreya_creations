import { getSiteUrl } from "@/lib/siteUrl";
import { LOGO_SRC } from "@/lib/brand";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/lib/seo";

/**
 * Organization + LocalBusiness schema for Google rich results.
 * Values come from site settings / site-config.
 */
export default function JsonLd({ site }) {
  const base = getSiteUrl();
  const brand = site?.brandName || site?.brand || "Shreya Creation";
  const phone = site?.phonePrimary || site?.phone1 || "";
  const phoneAlt = site?.phoneSecondary || site?.phone2 || "";
  const email = site?.email || "";
  const address = site?.addressLine || site?.address || "";
  const city = site?.city || "Patna";
  const pincode = site?.pincode || "800001";
  const socials = [
    site?.socials?.instagram,
    site?.socials?.facebook,
    site?.socials?.youtube,
  ].filter(Boolean);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness", "EducationalOrganization"],
        "@id": `${base}/#organization`,
        name: brand,
        alternateName: ["Shreya Creations", "Shreya Creation Boutique Institute"],
        url: base,
        logo: absoluteUrl(LOGO_SRC),
        image: absoluteUrl(DEFAULT_OG_IMAGE),
        description:
          site?.intro ||
          "Fashion boutique institute & custom stitching in Patna — boutique courses, bridal wear, 24-hour stitching on East Boring Canal Road / Boring Road.",
        telephone: [phone, phoneAlt].filter(Boolean),
        email,
        address: {
          "@type": "PostalAddress",
          streetAddress: address,
          addressLocality: city,
          addressRegion: "Bihar",
          postalCode: pincode,
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 25.6175,
          longitude: 85.1124,
        },
        areaServed: {
          "@type": "City",
          name: "Patna",
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "10:00",
          closes: "20:00",
        },
        sameAs: socials,
        priceRange: "₹₹",
        currenciesAccepted: "INR",
        paymentAccepted: "Cash, UPI",
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: brand,
        publisher: { "@id": `${base}/#organization` },
        inLanguage: ["en", "hi"],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  );
}
