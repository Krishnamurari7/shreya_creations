"use client";

import { motion, useReducedMotion } from "framer-motion";
import ContactForm from "@/components/ContactForm";
import ContactInfoCards from "@/components/ContactInfoCards";
import AmbientGlows from "@/components/AmbientGlows";
import { fadeUp } from "@/lib/motion";

export default function ContactPageSections({ site, wa }) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      {site.mapEmbedUrl && (
        <section className="page-container max-w-6xl pb-6 sm:pb-8 relative z-20 overflow-hidden">
          <AmbientGlows variant="subtle" />
          <motion.div
            className="glass rounded-2xl sm:rounded-3xl overflow-hidden aspect-video max-h-[420px] border border-ink/15 relative reveal shadow-xl hover:shadow-2xl transition-shadow duration-500"
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            custom={0}
            variants={fadeUp}
          >
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
          </motion.div>
        </section>
      )}

      <section className="page-container max-w-6xl pb-6 sm:pb-8 grid lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-20 overflow-hidden">
        <AmbientGlows variant="default" />
        <motion.div
          className="lg:col-span-6 order-2 lg:order-1"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          custom={0.1}
          variants={fadeUp}
        >
          <ContactInfoCards site={site} wa={wa} />
        </motion.div>
        <motion.div
          className="lg:col-span-6 order-1 lg:order-2"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          custom={0.2}
          variants={fadeUp}
        >
          <div className="relative">
            <ContactForm number={site.whatsapp} />
          </div>
        </motion.div>
      </section>
    </>
  );
}
