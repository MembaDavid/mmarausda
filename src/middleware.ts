// middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export function middleware(request: NextRequest) {
  // No need to `await` — Next can handle a returned Promise<Response>
  return updateSession(request);
}

// Only run on /admin and /api (skip static/_next/etc.)
export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
