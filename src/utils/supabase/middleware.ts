// utils/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Roles allowed to access /admin */
const ALLOWED_ADMIN_ROLES: ReadonlySet<string> = new Set([
  "ADMIN",
  "EDITOR",
  "TREASURER",
  "CLERK",
]);

/** API endpoints that should not require auth (e.g., first-run profile creation) */
const API_AUTH_WHITELIST: ReadonlySet<string> = new Set<string>([
  "/api/ensure-profile",
]);

function getUserRole(user: any): string | undefined {
  const raw =
    (user?.app_metadata?.role as string | undefined) ??
    (user?.user_metadata?.role as string | undefined);
  if (!raw) return undefined;
  return String(raw).toUpperCase().trim();
}

export async function updateSession(request: NextRequest) {
  // Base response for this invocation (may be replaced by cookie adapter)
  let response = NextResponse.next({ request });

  // Build a server client that reads cookies from the incoming request
  // and writes any updated auth cookies to the outgoing response.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, // anon/publishable key
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          // keep request cookies in sync for this invocation
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // re-create the response so Next propagates changes
          response = NextResponse.next({ request });
          // send Set-Cookie headers back to the browser
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { pathname } = request.nextUrl;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ===== Gate /api/* =====
  if (pathname.startsWith("/api")) {
    // Allow whitelisted endpoints without auth (e.g., ensure-profile right after sign-in)
    if (API_AUTH_WHITELIST.has(pathname)) return response;

    // All other /api routes require a session
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Per-route role checks can still happen inside each API route if needed
    return response;
  }

  // ===== Gate /admin/* (require session + allowed role) =====
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login"; // NOTE: leading slash
      return NextResponse.redirect(url);
    }
    const role = getUserRole(user);
    if (!role || !ALLOWED_ADMIN_ROLES.has(role)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    return response;
  }

  // Everything else passes through
  return response;
}
