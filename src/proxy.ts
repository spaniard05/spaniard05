import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static, _next/image (Next.js internals)
     * - static/generated assets (manifest, icons, favicon)
     */
    "/((?!_next/static|_next/image|manifest.webmanifest|icons/|icon|apple-icon|favicon.ico).*)",
  ],
};
