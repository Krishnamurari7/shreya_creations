import { customerContext, failure, json } from "@/lib/student-store/http";
import { productCards, kitCards } from "@/lib/student-store/server";
export const dynamic = "force-dynamic";
export async function GET() {
  const ctx = await customerContext(); if (ctx.error) return ctx.error;
  const { data: links, error: linkError } = await ctx.db.from("store_student_links").select("registration_id").eq("user_id", ctx.user.id).limit(10);
  if (linkError) return failure("Recommendations could not be loaded", 500);
  if (!links?.length) return json({ courses: [], verified: false });
  const { data: registrations, error: registrationError } = await ctx.db.from("student_registrations").select("id,course_id,status").in("id", links.map(x => x.registration_id)).eq("status", "admitted");
  if (registrationError) return failure("Recommendations could not be loaded", 500);
  const ids = [...new Set((registrations || []).map(x => x.course_id).filter(Boolean))];
  if (!ids.length) return json({ courses: [], verified: false });
  const { data: courses, error: courseError } = await ctx.db.from("courses").select("id,title").in("id", ids);
  if (courseError) return failure("Recommendations could not be loaded", 500);
  try {
    const result = await Promise.all((courses || []).map(async course => ({
      id: course.id, title: course.title,
      products: await productCards(ctx.db, { course: course.id, limit: 4 }),
      kits: await kitCards(ctx.db, { course: course.id, limit: 4 }),
    })));
    return json({ courses: result, verified: true });
  } catch (error) { console.error("store recommendations", error.message); return failure("Recommendations could not be loaded", 500); }
}
