import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import ContactForm from "@/components/ContactForm";
import ContactInfoCards from "@/components/ContactInfoCards";
import PageCTA from "@/components/PageCTA";
import { getSiteSettings } from "@/lib/data";
import { waLink, greetingMessage } from "@/lib/whatsapp";
import { pageCtaProps } from "@/lib/cms";

export const metadata = { title: "Contact — Shreya creation" };

const DEFAULT_SUBTITLE =
  "We're just a message away — order a custom garment, enroll in a class, or ask anything.";

export default async function ContactPage() {
  const site = await getSiteSettings();
  const contact = site.pages?.contact || {};
  const wa = waLink(site.whatsapp, greetingMessage());

  return (
    <PageShell>
      <LocalizedPageHeader
        eyebrow={contact.headerEyebrow || "Say hello"}
        eyebrowHi={contact.headerEyebrowHi}
        title={contact.headerTitle || "Contact Us"}
        titleHi={contact.headerTitleHi}
        subtitle={contact.headerSubtitle || DEFAULT_SUBTITLE}
        subtitleHi={contact.headerSubtitleHi}
      />

      {site.mapEmbedUrl && (
        <section className="page-container max-w-6xl pb-6 sm:pb-8 relative z-20 reveal">
          <div className="glass rounded-2xl sm:rounded-3xl overflow-hidden aspect-video max-h-[420px] border border-ink/15 relative">
            <iframe
              src={site.mapEmbedUrl}
              title="Map"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {site.address && (
              <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-xs glass rounded-xl px-4 py-3 border border-purple/20 backdrop-blur-md pointer-events-none">
                <span className="text-[10px] uppercase tracking-widest text-purple-dark font-semibold">Studio</span>
                <p className="text-xs text-ink mt-1 font-normal leading-relaxed">{site.address}</p>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="page-container max-w-6xl pb-6 sm:pb-8 grid lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-20">
        <div className="lg:col-span-6 reveal order-2 lg:order-1">
          <ContactInfoCards site={site} wa={wa} />
        </div>
        <div className="lg:col-span-6 reveal order-1 lg:order-2">
          <div className="relative">
            <ContactForm number={site.whatsapp} />
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-orange/5 blur-3xl -z-10" />
            <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-purple/5 blur-2xl -z-10" />
          </div>
        </div>
      </section>

      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(contact)} />
    </PageShell>
  );
}
