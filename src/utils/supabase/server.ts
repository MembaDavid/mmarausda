// utils/supabase/server.ts
import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-only Supabase client (SSR/Route Handlers/Server Actions).
 * - Works with Next cookies (get/set/remove).
 * - Async because some setups type `cookies()` as Promise.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, // anon/publishable key
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Called from a Server Component (no mutation allowed) — safe to ignore
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, "", { ...options, maxAge: 0 });
          } catch {}
        },
      },
    }
  );
}

/** Optional alias if some files import a different name */
export const supabaseServer = createClient;
