import { getSiteUrl } from "@/lib/siteUrl";
import { LOGO_SRC } from "@/lib/brand";
import { SITE } from "@/lib/seed";

/**
 * LocalBusiness + EducationalOrganization schema for Google rich results.
 */
export default function JsonLd({ site }) {
  const base = getSiteUrl();
  const brand = site?.brand || SITE.brand;
  const phone = site?.phone || SITE.phone;
  const email = site?.email || SITE.email;
  const address = site?.address || SITE.address;
  const socials = [
    site?.socials?.instagram || SITE.socials.instagram,
    site?.socials?.facebook || SITE.socials.facebook,
    site?.socials?.youtube || SITE.socials.youtube,
  ].filter(Boolean);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "EducationalOrganization"],
        "@id": `${base}/#organization`,
        name: brand,
        alternateName: ["Shreya Creations", "Shreya Creation Boutique Institute"],
        url: base,
        logo: `${base}${LOGO_SRC}`,
        image: `${base}${LOGO_SRC}`,
        description:
          site?.intro ||
          SITE.intro ||
          "Fashion boutique institute & custom stitching in Patna — courses, bridal wear, 24-hour stitching.",
        telephone: phone,
        email,
        address: {
          "@type": "PostalAddress",
          streetAddress: address,
          addressLocality: "Patna",
          addressRegion: "Bihar",
          postalCode: "800001",
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
