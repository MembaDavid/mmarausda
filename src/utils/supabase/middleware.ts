import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Only gate these */
const PROTECTED_PREFIXES = ["/api", "/admin"] as const;
type ProtectedPrefix = (typeof PROTECTED_PREFIXES)[number];

/** App roles (exactly as you store them) */
const ROLES = [
  "ADMIN",
  "EDITOR",
  "MEMBER",
  "GUEST",
  "ASSOCIATE",
  "TREASURER",
  "CLERK",
] as const;
type Role = (typeof ROLES)[number];

/** Who may access /api and /admin */
const ALLOWED_SECURE_ROLES = new Set<Role>([
  "ADMIN",
  "EDITOR",
  "TREASURER",
  "CLERK",
]);

function getProtectedPrefix(pathname: string): ProtectedPrefix | null {
  for (const p of PROTECTED_PREFIXES) if (pathname.startsWith(p)) return p;
  return null;
}

function getUserRole(user: any): Role | undefined {
  const raw =
    (user?.app_metadata?.role as string | undefined) ??
    (user?.user_metadata?.role as string | undefined);

  if (!raw) return undefined;
  const norm = String(raw).toUpperCase().trim();
  return (ROLES as readonly string[]).includes(norm)
    ? (norm as Role)
    : undefined;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Only gate /api and /admin
  const matchedPrefix = getProtectedPrefix(pathname);
  if (!matchedPrefix) return supabaseResponse;

  // Require login
  if (!user) {
    const isApi = matchedPrefix === "/api";
    if (isApi) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const url = request.nextUrl.clone();
    url.pathname = "auth/login";
    return NextResponse.redirect(url);
  }

  // Require allowed role
  const role = getUserRole(user);
  const allowed = role ? ALLOWED_SECURE_ROLES.has(role) : false;

  if (!allowed) {
    const isApi = matchedPrefix === "/api";
    if (isApi) {
      return new NextResponse(
        JSON.stringify({ error: "Forbidden: insufficient role" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    return new NextResponse("Forbidden", { status: 403 });
  }

  return supabaseResponse;
}

// Optional: run middleware on everything except static/_next
// export const config = { matcher: ["/((?!_next|.*\\..*).*)"] };
