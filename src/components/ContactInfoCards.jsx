"use client";

import { Glass3DCard, Float3D } from "@/components/Glass3DCard";
import { staggerDelay } from "@/lib/motion";

export default function ContactInfoCards({ site, wa }) {
  const cards = [
    {
      key: "whatsapp",
      show: true,
      span: "full",
      content: (
        <>
          <Float3D translateZ="55">
            <div className="h-12 w-12 rounded-2xl bg-orange/10 flex items-center justify-center text-orange group-hover:scale-110 transition-transform shrink-0">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.436.002 9.861-4.417 9.864-9.858.002-2.636-1.02-5.115-2.879-6.978-1.859-1.862-4.331-2.887-6.974-2.889-5.439 0-9.864 4.417-9.868 9.86-.001 1.57.418 3.101 1.21 4.47l-.995 3.633 3.738-.979c1.378.75 2.766 1.139 4.239 1.14zm9.955-6.858c-.27-.135-1.594-.787-1.84-.877-.246-.089-.427-.135-.607.135-.18.27-.697.877-.852 1.057-.155.18-.311.202-.58.067-.27-.135-1.14-.42-2.172-1.34-.803-.717-1.345-1.603-1.502-1.873-.158-.27-.017-.417.118-.552.121-.121.27-.315.405-.472.135-.158.18-.27.27-.45.09-.18.045-.337-.022-.472-.068-.135-.607-1.463-.832-2.003-.22-.527-.44-.455-.607-.464-.158-.008-.338-.01-.518-.01-.18 0-.472.067-.72.337-.247.27-.945.922-.945 2.249 0 1.327.965 2.609 1.099 2.79.135.18 1.9 2.9 4.602 4.07.642.278 1.144.444 1.534.569.645.205 1.233.176 1.698.107.518-.077 1.594-.652 1.819-1.282.225-.63.225-1.17.157-1.282-.068-.113-.247-.18-.518-.315z" />
              </svg>
            </div>
          </Float3D>
          <Float3D translateZ="45" className="flex-1">
            <h3 className="text-gold uppercase tracking-[0.2em] text-xs font-semibold mb-1">WhatsApp</h3>
            <p className="text-sm text-ink font-normal mb-2">Instant boutique support & sizing consultations.</p>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:text-orange transition-colors text-sm font-semibold flex items-center gap-1"
            >
              Chat with us instantly <span>→</span>
            </a>
          </Float3D>
        </>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Glass3DCard
        layered
        className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex items-start gap-4 sm:gap-5 group reveal interactive-card"
        style={staggerDelay(0, 100)}
      >
        {cards[0].content}
      </Glass3DCard>

      <div className="grid sm:grid-cols-2 gap-4">
        {site.phone && (
          <Glass3DCard
            layered
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col group reveal interactive-card"
            style={staggerDelay(1, 100)}
          >
            <Float3D translateZ="50">
              <div className="h-10 w-10 rounded-xl bg-orange/10 flex items-center justify-center text-orange mb-4 group-hover:scale-110 transition-transform">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-gold uppercase tracking-[0.2em] text-xs font-semibold mb-1">Phone</h3>
              <a href={`tel:${site.phone}`} className="text-ink hover:text-orange transition-colors text-sm font-medium mt-auto">
                {site.phone}
              </a>
            </Float3D>
          </Glass3DCard>
        )}

        {site.email && (
          <Glass3DCard
            layered
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col group reveal interactive-card"
            style={staggerDelay(2, 100)}
          >
            <Float3D translateZ="50">
              <div className="h-10 w-10 rounded-xl bg-orange/10 flex items-center justify-center text-orange mb-4 group-hover:scale-110 transition-transform">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-gold uppercase tracking-[0.2em] text-xs font-semibold mb-1">Email</h3>
              <a href={`mailto:${site.email}`} className="text-ink hover:text-orange transition-colors text-sm font-medium mt-auto break-all">
                {site.email}
              </a>
            </Float3D>
          </Glass3DCard>
        )}
      </div>

      {site.address && (
        <Glass3DCard
          layered
          className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex gap-4 sm:gap-5 group reveal interactive-card"
          style={staggerDelay(3, 100)}
        >
          <Float3D translateZ="55">
            <div className="h-12 w-12 rounded-2xl bg-orange/10 flex items-center justify-center text-orange shrink-0 group-hover:scale-110 transition-transform">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </Float3D>
          <Float3D translateZ="45">
            <h3 className="text-gold uppercase tracking-[0.2em] text-xs font-semibold mb-1">Studio Address</h3>
            <p className="text-sm text-ink font-normal leading-relaxed">{site.address}</p>
            <span className="text-[10px] text-purple-dark font-semibold uppercase tracking-wider block mt-2">
              Hours: 11 AM - 8 PM (Closed Tuesdays)
            </span>
          </Float3D>
        </Glass3DCard>
      )}

      {site.socials?.instagram && (
        <Glass3DCard
          layered
          className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex items-start gap-4 sm:gap-5 group reveal interactive-card"
          style={staggerDelay(4, 100)}
        >
          <Float3D translateZ="55">
            <div className="h-12 w-12 rounded-2xl bg-orange/10 flex items-center justify-center text-orange group-hover:scale-110 transition-transform">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
          </Float3D>
          <Float3D translateZ="45" className="flex-1">
            <h3 className="text-gold uppercase tracking-[0.2em] text-xs font-semibold mb-1">Instagram</h3>
            <p className="text-sm text-ink font-normal mb-2">Check our latest custom bridal fittings and lookbook reels.</p>
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:text-orange transition-colors text-sm font-semibold flex items-center gap-1"
            >
              @shreya.creationss <span>→</span>
            </a>
          </Float3D>
        </Glass3DCard>
      )}
    </div>
  );
}
