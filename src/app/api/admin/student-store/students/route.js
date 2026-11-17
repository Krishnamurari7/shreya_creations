import { z } from "zod";
import { adminContext, bodyOf, failure, json } from "@/lib/student-store/http";
export const dynamic = "force-dynamic";
const schema = z.object({ user_id: z.uuid(), registration_id: z.uuid(), batch_id: z.uuid().nullable().optional() });
export async function POST(request) {
  const ctx = await adminContext(true); if (ctx.error) return ctx.error;
  let input; try { input = schema.parse(await bodyOf(request)); } catch { return failure("Invalid student link", 400); }
  const [{ data: registration }, { data: auth }] = await Promise.all([
    ctx.db.from("student_registrations").select("id,email,status,course_id").eq("id", input.registration_id).single(),
    ctx.db.auth.admin.getUserById(input.user_id),
  ]);
  if (!registration || registration.status !== "admitted" || !registration.course_id || !auth?.user) return failure("An admitted registration and Auth account are required", 400);
  if (!registration.email || registration.email.toLowerCase() !== auth.user.email?.toLowerCase()) return failure("Registration email must match the Auth account; review the admission record first", 400);
  if (input.batch_id) {
    const { data: batch } = await ctx.db.from("batches").select("id,course_id").eq("id", input.batch_id).single();
    if (!batch || batch.course_id !== registration.course_id) return failure("Batch must belong to the admitted course", 400);
  }
  const { data, error } = await ctx.db.from("store_student_links").insert({ ...input, verified_by: ctx.session.userId }).select().single();
  return error ? failure(error.message, 409) : json({ row: data }, 201);
}
