"use client";

import CourseBrowser from "@/components/CourseBrowser";
import InquiryPopup from "@/components/InquiryPopup";

export default function CoursesPageClient({ courses, whatsapp }) {
  return (
    <>
      <CourseBrowser courses={courses} id="courses-list" compactTop />
      <InquiryPopup source="courses_popup" whatsapp={whatsapp} />
    </>
  );
}
