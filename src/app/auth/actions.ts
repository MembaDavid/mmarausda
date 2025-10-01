"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma"; // keep as default if your helper exports default

/** Build absolute URL for callbacks in dev/prod */
function abs(path = "/") {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
  return new URL(path, base).toString();
}

/** Allow only same-origin paths for "next" */
function safeNext(raw: unknown, fallback = "/") {
  const val = String(raw ?? fallback);
  return val.startsWith("/") ? val : fallback;
}

/**
 * Ensure a row exists in public.User for the current Supabase user.
 * Upsert is idempotent; try/catch guards rare concurrent unique races.
 */
async function ensureProfileFromSession(
  passedClient?: Awaited<ReturnType<typeof createClient>>
) {
  const supabase = passedClient ?? (await createClient());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  try {
    await prisma.user.upsert({
      where: { authUserId: user.id },
      create: { authUserId: user.id }, // role defaults to GUEST (per your schema)
      update: {},
    });
  } catch {
    // ignore unique race
  }
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"), "/");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // optionally: redirect(`/auth/login?error=${encodeURIComponent(error.message)}`)
    redirect("/error");
  }

  await ensureProfileFromSession(supabase);

  revalidatePath("/", "layout");
  redirect(next); // go where the app wanted
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const name = (formData.get("name") as string | null)?.trim() || null;
  const phone = String(formData.get("phone") ?? "");
  const next = safeNext(formData.get("next"), "/"); // sent from your form as a hidden input

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // After clicking the email link, Supabase will open this URL
      emailRedirectTo: abs(`/auth/callback?next=${encodeURIComponent(next)}`),
      data: {
        full_name: name || undefined,
        phone: phone || undefined,
      },
    },
  });

  if (error) {
    // optionally: redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`)
    redirect("/error");
  }

  // If confirmations are ON, there may be no session yet (this will no-op).
  await ensureProfileFromSession(supabase);

  revalidatePath("/", "layout");
  // Show your confirmation screen
  redirect("/auth/confirm_email");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth/login");
}
