import HireStaffClient from "@/components/HireStaffClient";
import { getSiteSettings } from "@/lib/data";
import { waLink } from "@/lib/whatsapp";

export const metadata = {
  title: "फ़ैशन व्यवसाय के लिए प्रशिक्षित कर्मचारी खोजें | श्रेया क्रिएशन",
  description: "अपने बुटीक, फ़ैशन स्टूडियो, कपड़ों के ब्रांड या परिधान निर्माण इकाई के लिए कर्मचारियों की ज़रूरत साझा करें। श्रेया क्रिएशन संभावित उम्मीदवारों और साक्षात्कार के समन्वय में मदद करता है।",
  alternates: { canonical: "/hi/hire-trained-professionals", languages: { "en-IN": "/hire-trained-professionals", "hi-IN": "/hi/hire-trained-professionals" } },
};

export default async function HireTrainedProfessionalsHindiPage() {
  const site = await getSiteSettings();
  const digits = String(site?.whatsapp || "").replace(/\D/g, "");
  const contactHref = digits.length >= 10 ? waLink(site.whatsapp, "नमस्ते श्रेया क्रिएशन, मुझे फ़ैशन स्टाफ़ की भर्ती के बारे में बात करनी है।") : null;
  return <HireStaffClient contactHref={contactHref} locale="hi" />;
}
