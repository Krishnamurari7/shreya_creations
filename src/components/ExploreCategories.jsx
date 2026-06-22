"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";

const CATEGORIES = [
  {
    key: "fashion-designing",
    label: "Fashion Designing",
    labelHi: "फैशन डिज़ाइनिंग",
    matchCategories: ["Fashion Design"],
    href: "/courses",
    type: "course",
    bg: "#FDE2E4",
    image: "/categories/fashion-designing.png",
    fallbackCount: 11,
  },
  {
    key: "stitching",
    label: "Stitching",
    labelHi: "सिलाई",
    matchCategories: ["Stitching"],
    href: "/courses",
    type: "course",
    bg: "#F0E4F2",
    image: "/categories/stitching.png",
    fallbackCount: 8,
  },
  
  {
    key: "beauty",
    label: "Beauty",
    labelHi: "ब्यूटी",
    matchCategories: ["Jewellery", "Accessories"],
    href: "/shop",
    type: "product",
    bg: "#FCE4EC",
    image: "/categories/beauty.png",
    fallbackCount: 7,
  },
  {
    key: "bridal",
    label: "Bridal Wear",
    labelHi: "ब्राइडल वियर",
    matchCategories: ["Lehenga", "Gown", "Blouse"],
    href: "/shop",
    type: "product",
    bg: "#FFF3E0",
    image: "/categories/bridal.png",
    fallbackCount: 12,
  },
  {
    key: "ethnic-wear",
    label: "Ethnic Wear",
    labelHi: "एथनिक वियर",
    matchCategories: ["Suit", "Saree"],
    href: "/shop",
    type: "product",
    bg: "#FFE8D6",
    image: "/categories/ethnic-wear.png",
    fallbackCount: 10,
  },
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

function FolderIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 7a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function countItems(cat, courses, products) {
  const pool = cat.type === "product" ? products : courses;
  if (!cat.matchCategories.length) return cat.fallbackCount;
  const count = pool.filter((p) => cat.matchCategories.includes(p.category)).length;
  return count > 0 ? count : cat.fallbackCount;
}

export default function ExploreCategories({ courses = [], products = [] }) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();

  const items = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        ...cat,
        count: countItems(cat, courses, products),
      })),
    [courses, products]
  );

  const eyebrow = lang === "hi" ? "श्रेणियाँ देखें" : "Explore Categories";
  const title = lang === "hi" ? "अपने लिए सही चुनें" : "Find What's Perfect for You";
  const viewAll = lang === "hi" ? "सभी देखें" : "View All";
  const countLabel = (n, type) => {
    if (lang === "hi") {
      return type === "product" ? `${n} प्रोडक्ट` : `${n} कोर्स`;
    }
    return type === "product" ? `${n} Products` : `${n} Courses`;
  };

  return (
    <section className="explore-categories page-section page-section--bordered">
      <div className="page-container max-w-7xl">
        <div className="explore-categories__header reveal">
          <div className="explore-categories__header-copy">
            <span className="explore-categories__badge">
              <FolderIcon />
              {eyebrow}
            </span>
            <h2 className="explore-categories__title">{title}</h2>
          </div>
          <Link href="/courses" className="explore-categories__view-all">
            {viewAll}
            <span aria-hidden>→</span>
          </Link>
        </div>

        <motion.div
          className="explore-categories__grid"
          variants={reduceMotion ? undefined : container}
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {items.map((cat) => (
            <motion.div key={cat.key} variants={reduceMotion ? undefined : item}>
              <Link href={cat.href} className="explore-cat-card group">
                <div
                  className="explore-cat-card__visual"
                  style={{ backgroundColor: cat.bg }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt=""
                    className="explore-cat-card__img"
                    loading="lazy"
                  />
                </div>
                <div className="explore-cat-card__body">
                  <h3 className="explore-cat-card__name">
                    {lang === "hi" ? cat.labelHi : cat.label}
                  </h3>
                  <p className="explore-cat-card__count">
                    {countLabel(cat.count, cat.type)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
