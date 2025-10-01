import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server"; // <-- your async helper

export async function GET() {
  const supabase = await supabaseServer();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  const user = session?.user ?? null;
  return NextResponse.json({
    uid: user?.id ?? null,
    email: user?.email ?? null,
    authed: !!user,
  });
}
