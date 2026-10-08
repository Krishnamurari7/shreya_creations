export { default } from "../../nri-clients/page";
import { getSiteSettings } from "@/lib/data";
import { buildNriPageMetadata } from "@/lib/nri-seo";

export async function generateMetadata() {
  const site = await getSiteSettings();
  return buildNriPageMetadata(site.pages?.nri || {}, "hi");
}
