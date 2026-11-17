import HireStaffClient from "@/components/HireStaffClient";
import { getSiteSettings } from "@/lib/data";
import { waLink } from "@/lib/whatsapp";

export const metadata = {
  title: "Hire Trained Professionals for Your Fashion Business",
  description: "Submit a staffing requirement for your boutique, fashion studio, clothing brand or garment unit. Shreya Creation helps coordinate candidate matching and interviews.",
  alternates: { canonical: "/hire-trained-professionals", languages: { "en-IN": "/hire-trained-professionals", "hi-IN": "/hi/hire-trained-professionals" } },
};

export default async function HireTrainedProfessionalsPage() {
  const site = await getSiteSettings();
  const digits = String(site?.whatsapp || "").replace(/\D/g, "");
  const contactHref = digits.length >= 10 ? waLink(site.whatsapp, "Hello Shreya Creation, I would like to discuss a fashion staffing requirement.") : null;
  return <HireStaffClient contactHref={contactHref} locale="en" />;
}
