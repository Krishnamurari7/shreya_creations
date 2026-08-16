import { getSiteSettings, getCourses, getProducts, getLookbookPosts } from "@/lib/data";
import { buildLlmsTxt, LLMS_TXT_HEADERS } from "@/lib/llms";

export const dynamic = "force-dynamic";

export async function GET() {
  const [site, courses, products, posts] = await Promise.all([
    getSiteSettings(),
    getCourses(),
    getProducts(),
    getLookbookPosts(),
  ]);

  const body = buildLlmsTxt(site, { courses, products, posts });

  return new Response(body, { headers: LLMS_TXT_HEADERS });
}
