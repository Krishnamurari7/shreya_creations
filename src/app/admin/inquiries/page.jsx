import { redirect } from "next/navigation";

/** Legacy route — spec uses /admin/enquiries */
export default function InquiriesRedirect() {
  redirect("/admin/enquiries");
}
