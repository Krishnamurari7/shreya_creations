import {
  getSiteSettings,
  getCourses,
  getProducts,
  getLookbookPosts,
  getFaqs,
} from "@/lib/data";
import { buildLlmsFullTxt, LLMS_TXT_HEADERS } from "@/lib/llms";

export const revalidate = 3600;

export async function GET() {
  const [site, courses, products, posts, faqs] = await Promise.all([
    getSiteSettings(),
    getCourses(),
    getProducts(),
    getLookbookPosts(),
    getFaqs(),
  ]);

  const body = buildLlmsFullTxt(site, { courses, products, posts, faqs });

  return new Response(body, { headers: LLMS_TXT_HEADERS });
}
