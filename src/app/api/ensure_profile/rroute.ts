// import { NextResponse } from "next/server";
// import { supabaseServer } from "@/utils/supabase/server";
// import prisma from "@/lib/prisma";

// export async function POST() {
//   const supabase = supabaseServer();
//   const {
//     data: { user },
//     error,
//   } = await supabase.auth.getUser();
//   if (error || !user) return NextResponse.json({ ok: false }, { status: 401 });

//   await prisma.user.upsert({
//     where: { authUserId: user.id },
//     create: { authUserId: user.id },
//     update: {},
//   });

//   return NextResponse.json({ ok: true });
// }
