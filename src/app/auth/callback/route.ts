import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma"; // keep default import to match your current helper

function safeNext(url: URL) {
  // Prevent open redirects — only allow same-origin paths
  const next = url.searchParams.get("next") || "/";
  return next.startsWith("/") ? next : "/";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const nextPath = safeNext(url);

  const code = url.searchParams.get("code");
  if (!code) {
    url.pathname = "/auth/login";
    url.search = "?error=missing_code";
    return NextResponse.redirect(url);
  }

  const supabase = await createClient();

  // 1) Exchange the code for a session cookie
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
    code
  );
  if (exchangeError) {
    url.pathname = "/auth/login";
    url.search = `?error=${encodeURIComponent(exchangeError.message)}`;
    return NextResponse.redirect(url);
  }

  // 2) With a session now present, fetch the user (has the UUID we need)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    try {
      // 3) Upsert your app-side profile row
      await prisma.user.upsert({
        where: { authUserId: user.id },
        create: { authUserId: user.id },
        update: {},
      });
    } catch {
      // ignore race conditions if multiple tabs hit the callback
    }
  }

  // 4) Go where the app wanted
  url.pathname = nextPath;
  url.search = "";
  return NextResponse.redirect(url);
}
