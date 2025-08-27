"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

// unchanged helper
async function ensureProfileFromSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await prisma.user.upsert({
    where: { authUserId: user.id },
    update: {},
    create: { authUserId: user.id },
  });
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/error");

  await ensureProfileFromSession();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = (formData.get("name") as string | null)?.trim() || null;

  // ✅ Put display name into user_metadata at sign-up time
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // If you use email confirmations + PKCE, set your callback:
      // emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/`,
      data: name ? { full_name: name } : undefined,
    },
  });

  if (error) redirect("/error");

  // If confirmations are ON, there might be no session yet — this is safe either way.
  await ensureProfileFromSession();

  revalidatePath("/", "layout");
  redirect("/"); // or '/check-email' if you want a verify screen
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth/login");
}
