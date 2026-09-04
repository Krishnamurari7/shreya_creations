"use client";

import { PAGE_CONTAINER } from "@/lib/ui";
import { cn } from "@/lib/utils";
import StudentRegistrationForm from "@/components/StudentRegistrationForm";

export default function RegisterPageClient({ site, courses, defaultCourseSlug = "" }) {
  return (
    <section
      className={cn(
        PAGE_CONTAINER,
        "register-page",
        "register-page--form-only",
        "max-w-6xl",
        "pb-10",
        "sm:pb-14",
        "lg:pb-16",
        "relative",
        "z-20"
      )}
    >
      <StudentRegistrationForm
        number={site.whatsapp}
        courses={courses}
        defaultCourseSlug={defaultCourseSlug}
        site={site}
      />
    </section>
  );
}
