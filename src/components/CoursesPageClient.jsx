"use client";

import CourseBrowser from "@/components/CourseBrowser";
import InquiryPopup from "@/components/InquiryPopup";

export default function CoursesPageClient({ courses }) {
  return (
    <>
      <CourseBrowser courses={courses} />
      <InquiryPopup source="courses_popup" />
    </>
  );
}
