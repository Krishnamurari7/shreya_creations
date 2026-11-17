import { redirect } from "next/navigation";
export default async function HindiStoreSubroute({ params }) { const { rest } = await params; redirect(`/student-store/${rest.map(encodeURIComponent).join("/")}`); }
