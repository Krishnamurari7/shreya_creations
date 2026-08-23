import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { localeFromPathname } from "@/lib/locale";

function needsAuthSession(path) {
  return path.startsWith("/admin") || path.startsWith("/api/admin");
}

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Only refresh Supabase auth cookies on admin routes — public pages stay CDN-cacheable.
  const response = needsAuthSession(path)
    ? await updateSession(request)
    : NextResponse.next({ request });

  if (!path.startsWith("/admin") && !path.startsWith("/api")) {
    response.headers.set("x-locale", localeFromPathname(path));
  }

  return response;
}

export const config = {
  matcher: [
    // Run on admin routes (gating) and refresh session elsewhere, skipping static assets.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
