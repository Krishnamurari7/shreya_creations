/** Every public page or page group that renders PageCTA. */
export const CTA_PAGE_OPTIONS = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/shop", label: "Shop" },
  { path: "/courses", label: "Courses" },
  { path: "/portfolio", label: "Portfolio" },
  { path: "/blog", label: "Blog" },
  { path: "/nri-clients", label: "NRI Clients" },
  { path: "/faq", label: "FAQ" },
  { path: "/ladies-tailor-patna", label: "Ladies Tailor" },
  { path: "/boutique-boring-road", label: "Boutique Boring Road" },
  { path: "/shop/*", label: "All product pages" },
  { path: "/courses/*", label: "All course pages" },
  { path: "/portfolio/*", label: "All portfolio detail pages" },
  { path: "/blog/*", label: "All blog posts" },
];

export const CTA_PAGE_KEYS = {
  "/": "home",
  "/about": "about",
  "/contact": "contact",
  "/shop": "shop",
  "/courses": "courses",
  "/portfolio": "portfolio",
  "/blog": "lookbook",
  "/nri-clients": "nri",
  "/faq": "faq",
  "/ladies-tailor-patna": "ladiesTailor",
  "/boutique-boring-road": "boutiqueBoringRoad",
  "/blog/*": "lookbook",
};
