export const DEFAULT_HOME_POPUP = {
  enabled: false,
  kind: "offer",
  eyebrow: "Special offer",
  eyebrowHi: "विशेष ऑफर",
  title: "",
  titleHi: "",
  description: "",
  descriptionHi: "",
  image: "",
  imageAlt: "",
  imageAltHi: "",
  buttonLabel: "View details",
  buttonLabelHi: "पूरी जानकारी देखें",
  href: "",
  campaignId: "",
};

export function validHomePopupLink(value) {
  const href = typeof value === "string" ? value.trim() : "";
  return (href.startsWith("/") && !href.startsWith("//") && !/[\s\\]/.test(href)) ||
    /^https:\/\/[^\s/]+(?:\/[^\s]*)?$/i.test(href);
}
