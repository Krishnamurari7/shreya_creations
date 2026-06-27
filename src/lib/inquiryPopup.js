export const INQUIRY_OPEN_EVENT = "sc:open-inquiry";

export function openInquiryPopup({ source = "hero_video", message = "" } = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(INQUIRY_OPEN_EVENT, {
      detail: { source, message },
    })
  );
}
