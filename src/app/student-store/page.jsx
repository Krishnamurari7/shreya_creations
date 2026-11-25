import Link from "next/link";
import StoreShell from "@/components/student-store/StoreShell";
import StoreCard from "@/components/student-store/StoreCard";
import { storeDb, productCards, kitCards } from "@/lib/student-store/server";
import RecommendedForStudent from "@/components/student-store/RecommendedForStudent";
import "./student-store.css";
export const dynamic = "force-dynamic";
export const metadata = { title: "Student Store", description: "Sewing and boutique essentials from Shreya Creation" };
const categories = [
  { name: "Cutting Tools", slug: "cutting-tools", description: "Scissors, cutters & seam rippers", icon: "cut", number: "01" },
  { name: "Measuring & Drafting", slug: "measuring-drafting-tools", description: "Tape, scales & pattern rulers", icon: "measure", number: "02" },
  { name: "Machine Accessories", slug: "machine-accessories", description: "Needles, bobbins & machine parts", icon: "machine", number: "03" },
  { name: "Stitching Essentials", slug: "stitching-essentials", description: "Thread, needles & chalk", icon: "stitch", number: "04" },
  { name: "Embroidery & Design", slug: "embroidery-design", description: "Embellishments & creative tools", icon: "flower", number: "05" },
  { name: "Student Kits", slug: "#kits", description: "Curated for your real course", icon: "kit", number: "06" },
];

function ArrowIcon({ diagonal = false }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? "M5 19 19 5M8 5h11v11" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function CategoryIcon({ type }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" };
  return <svg viewBox="0 0 64 64" aria-hidden="true" {...common}>
    {type === "cut" && <><circle cx="16" cy="46" r="7" /><circle cx="31" cy="48" r="7" /><path d="M21 41 49 11M36 43 15 13M37 26l13-13M26 28 15 13" /></>}
    {type === "measure" && <><path d="M9 22h46v24H9zM17 22v11m8-11v7m8-7v11m8-11v7m8-7v11" /><path d="M17 38h29" /></>}
    {type === "machine" && <><path d="M10 48h45v7H10zM16 48V25h23l8 9v14M21 25v-8h14v8M47 34h8v14M27 36v12M23 36h8M14 17h6" /><circle cx="40" cy="41" r="4" /></>}
    {type === "stitch" && <><path d="M43 8 22 48M40 14l7 4M22 48l-4 9M17 55c-13-10-4-25 9-21 8 3 7 12 2 14" /><circle cx="22" cy="48" r="2" /></>}
    {type === "flower" && <><circle cx="32" cy="32" r="6" /><path d="M32 26c-5-12 5-19 9-11 2 5-2 10-5 13m2 4c12-5 19 5 11 9-5 2-10-2-13-5m-4 2c5 12-5 19-9 11-2-5 2-10 5-13m-2-4c-12 5-19-5-11-9 5-2 10 2 13 5" /><path d="M8 9l3 3m42 41 3 3" /></>}
    {type === "kit" && <><path d="M10 23 32 12l22 11v28L32 62 10 51V23Zm0 0 22 11 22-11M32 34v28M21 18l22 11" /><path d="M17 30v9" /></>}
  </svg>;
}

function SectionHeading({ id, eyebrow, title, description, href, linkText }) {
  return <div className="ss-section-heading">
    <div><p className="ss-eyebrow"><span />{eyebrow}</p><h2 id={id}>{title}</h2>{description && <p className="ss-section-description">{description}</p>}</div>
    {href && <Link href={href} className="ss-text-link">{linkText}<ArrowIcon diagonal /></Link>}
  </div>;
}
export default async function StudentStoreHome() {
  const db = storeDb();
  let products = [], kits = [], error = false;
  if (db) { try { [products, kits] = await Promise.all([productCards(db, { limit: 4 }), kitCards(db, { limit: 4 })]); } catch { error = true; } }
  return <StoreShell siteTheme>
    <div className="student-store-home">
      <section className="ss-hero" aria-labelledby="store-heading">
        <div className="ss-hero-copy">
          <p className="ss-eyebrow ss-hero-eyebrow"><span />THE MAKER'S CORNER <span className="ss-eyebrow-star">✦</span> SHREYA CREATION</p>
          <h1 id="store-heading">Welcome to <em>Shreya Student Store.</em></h1>
          <p className="ss-hero-lead">Everything you need to learn, stitch & create.</p>
          <p className="ss-hero-description">Discover sewing and boutique essentials chosen for curious beginners and confident makers. Explore individual tools or find a kit tailored to your course.</p>
          <div className="ss-hero-actions">
            <Link href="#products" className="ss-button ss-button-primary">Shop products <ArrowIcon /></Link>
            <Link href="#kits" className="ss-button ss-button-outline">Explore student kits <ArrowIcon diagonal /></Link>
          </div>
          <div className="ss-hero-note"><span className="ss-note-mark">✦</span><span>Made for every step of your creative journey</span></div>
        </div>
        <div className="ss-hero-art">
          <div className="ss-art-glow" />
          <div className="ss-art-frame">
            <img src="/student-store-tools.webp" alt="Illustration of scissors, thread, measuring tape and sewing tools" />
            <div className="ss-art-shade" />
            <div className="ss-art-caption"><span>LEARN · STITCH · CREATE</span><strong>Tools for ideas<br />worth making.</strong></div>
          </div>
          <span className="ss-art-orbit ss-art-orbit-one" aria-hidden="true">✳</span>
          <span className="ss-art-orbit ss-art-orbit-two" aria-hidden="true">✦</span>
          <div className="ss-art-stamp"><span>CRAFT YOUR</span><strong>OWN STORY</strong><span>✦ SINCE 2012 ✦</span></div>
        </div>
      </section>

      <div className="ss-marquee" aria-hidden="true"><div>CREATE WITH CONFIDENCE <span>✦</span> LEARN WITH PURPOSE <span>✦</span> MAKE IT YOURS <span>✦</span> CREATE WITH CONFIDENCE <span>✦</span> LEARN WITH PURPOSE <span>✦</span> MAKE IT YOURS <span>✦</span></div></div>

      <section className="ss-section ss-categories" aria-labelledby="categories-heading">
        <SectionHeading id="categories-heading" eyebrow="Explore the essentials" title="Find your next creative tool." href="/student-store/categories" linkText="All categories" />
        <div className="ss-category-grid">
          {categories.map((category) => <Link key={category.name} href={category.slug === "#kits" ? "#kits" : `/student-store/products?category=${category.slug}`} className="ss-category-card">
            <span className="ss-category-top"><span>{category.number} / 06</span><span className="ss-category-arrow"><ArrowIcon diagonal /></span></span>
            <span className="ss-category-icon"><CategoryIcon type={category.icon} /></span>
            <span className="ss-category-copy"><strong>{category.name}</strong><small>{category.description}</small></span>
          </Link>)}
        </div>
      </section>

      <div className="ss-promise-strip">
        <div><span>✦</span><strong>Learn with the right tools</strong><small>Thoughtful essentials for every maker</small></div>
        <div><span>✦</span><strong>Explore course-wise kits</strong><small>See what's included before you buy</small></div>
        <div><span>✦</span><strong>Shop with clarity</strong><small>Live prices and availability</small></div>
      </div>
      <div className="ss-recommendations"><RecommendedForStudent /></div>

      <section id="kits" className="ss-section ss-kits">
        <SectionHeading eyebrow="Course-wise kits" title="Everything for your next big idea." description="Find the right kit for your course. See every component and quantity before you add it to your cart." />
        {kits.length ? <div className="ss-product-grid">{kits.map(k => <StoreCard key={k.id} item={k} kind="kit" />)}</div> : <div className="ss-empty-state"><div className="ss-empty-icon"><CategoryIcon type="kit" /></div><div><h3>Something good is taking shape.</h3><p>Course kits will appear here when the institute publishes their contents, prices and stock.</p></div></div>}
      </section>

      <section id="products" className="ss-section ss-products">
        <SectionHeading eyebrow="Sewing & boutique essentials" title="Make more with every stitch." href="/student-store/products" linkText="View catalog" />
        {products.length ? <div className="ss-product-grid">{products.map(p => <StoreCard key={p.id} item={p} />)}</div> : <div className="ss-empty-state"><div className="ss-empty-icon"><CategoryIcon type="stitch" /></div><div><h3>Your next essential is on its way.</h3><p>Products will appear here as soon as the institute adds and publishes inventory.</p></div></div>}
        {error && <p role="alert" className="ss-error">The catalog could not be loaded right now. Please try again shortly.</p>}
      </section>

      <div className="ss-endnote"><span>✦</span><p>From your first stitch to your finest work.</p><span>✦</span></div>
    </div>
  </StoreShell>;
}
