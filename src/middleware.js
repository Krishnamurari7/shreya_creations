import { updateSession } from "@/lib/supabase/middleware";
import { localeFromPathname } from "@/lib/locale";

export async function middleware(request) {
  const response = await updateSession(request);
  const path = request.nextUrl.pathname;

  // Expose locale to root layout for <html lang> (English at root, Hindi under /hi/).
  if (!path.startsWith("/admin") && !path.startsWith("/api")) {
    const locale = localeFromPathname(path);
    response.headers.set("x-locale", locale);
  }

  return response;
}

export const config = {
  matcher: [
    // Run on admin routes (gating) and refresh session elsewhere, skipping static assets.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
