import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server"; // <-- your async helper
import prisma from "@/lib/prisma";

export async function GET() {
  const supabase = await supabaseServer();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  const user = session?.user ?? null;
  const profile = user
    ? await prisma.user.findUnique({
        where: { authUserId: user.id },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          status: true,
        },
      })
    : null;
  return NextResponse.json({
    uid: user?.id ?? null,
    email: user?.email ?? null,
    authed: !!user,
    profile,
  });
}
