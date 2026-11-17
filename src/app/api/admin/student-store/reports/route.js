import { adminContext, failure, json } from "@/lib/student-store/http";
export const dynamic = "force-dynamic";
export async function GET(request) {
  const ctx = await adminContext(); if (ctx.error) return ctx.error;
  const p = new URL(request.url).searchParams, from = p.get("from"), to = p.get("to");
  if (from && !/^\d{4}-\d{2}-\d{2}$/.test(from) || to && !/^\d{4}-\d{2}-\d{2}$/.test(to)) return failure("Invalid date filter", 400);
  const fromDate = from ? new Date(`${from}T00:00:00+05:30`) : null;
  const toDate = to ? new Date(new Date(`${to}T00:00:00+05:30`).getTime() + 86400000) : null;
  if (fromDate && Number.isNaN(fromDate.getTime()) || toDate && Number.isNaN(toDate.getTime())) return failure("Invalid date filter", 400);
  if (fromDate && toDate && toDate <= fromDate) return failure("End date must follow start date", 400);
  const { data, error } = await ctx.db.rpc("store_report_summary", { p_from: fromDate?.toISOString() || null, p_to: toDate?.toISOString() || null });
  return error ? failure("Report could not be loaded", 500) : json({ summary: data });
}
