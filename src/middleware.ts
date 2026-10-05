import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static, _next/image (Next.js internals)
     * - static assets (manifest, icons, etc.)
     */
    "/((?!_next/static|_next/image|manifest.webmanifest|icons|favicon.ico).*)",
  ],
};
