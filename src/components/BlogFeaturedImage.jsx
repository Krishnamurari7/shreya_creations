"use client";

import { motion, useReducedMotion } from "framer-motion";
import OptimizedImage from "@/components/OptimizedImage";
import { cn } from "@/lib/utils";
import { scaleIn } from "@/lib/motion";

export default function BlogFeaturedImage({ src, alt, variant = "full" }) {
  const reduceMotion = useReducedMotion();
  const isSidebar = variant === "sidebar";

  return (
    <motion.div
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      custom={0.15}
      variants={scaleIn}
      className={cn("blog-featured-frame relative", isSidebar && "blog-featured-frame--sidebar")}
    >
      <div
        className={cn(
          "absolute -inset-1 rounded-[1.35rem] sm:rounded-[2.15rem] bg-gradient-to-br from-orange/30 via-golden/20 to-orange/10 opacity-70 blur-sm",
          isSidebar && "rounded-2xl sm:rounded-[1.65rem]"
        )}
        aria-hidden
      />
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white/40 bg-muted/30 shadow-[0_24px_64px_-12px_rgba(26,16,40,0.18)] ring-1 ring-ink/10 dark:border-white/10 dark:ring-white/10 dark:bg-white/[0.03]",
          isSidebar && "rounded-xl sm:rounded-2xl shadow-[0_12px_40px_-10px_rgba(26,16,40,0.14)]"
        )}
      >
        <OptimizedImage
          src={src}
          alt={alt}
          width={1200}
          height={800}
          priority
          loading="eager"
          sizes={
            isSidebar
              ? "(max-width: 1024px) 95vw, 360px"
              : "(max-width: 640px) 95vw, (max-width: 1024px) 85vw, 896px"
          }
          className="blog-featured-frame__img block w-full h-auto"
          imgClassName="block w-full h-auto"
        />
      </div>
    </motion.div>
  );
}
