import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const profile = await prisma.user.upsert({
    where: { authUserId: user.id },
    create: {
      authUserId: user.id,
      email: user.email ?? null,
      fullName: cleanString(user.user_metadata?.full_name),
      phone: cleanString(user.user_metadata?.phone),
    },
    update: {
      email: user.email ?? null,
      fullName: cleanString(user.user_metadata?.full_name),
      phone: cleanString(user.user_metadata?.phone),
      lastSeenAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true, profile });
}

function cleanString(value: unknown) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}
