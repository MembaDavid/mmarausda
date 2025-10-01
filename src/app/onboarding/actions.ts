"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

const SELF_ASSIGNABLE_ROLES = ["GUEST", "MEMBER", "ASSOCIATE"] as const;
type SelfAssignableRole = (typeof SELF_ASSIGNABLE_ROLES)[number];

async function getAuthUserId() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

/** Step 2: complete User profile (+ optional self-role) */
export async function updateUserProfile(formData: FormData) {
  const uid = await getAuthUserId();
  if (!uid) redirect("/auth/login");

  const genderRaw = String(formData.get("gender") ?? "");
  const homeChurch = String(formData.get("homeChurch") ?? "").trim() || null;
  const roleRaw = String(formData.get("role") ?? "")
    .toUpperCase()
    .trim();

  const gender = ["MALE", "FEMALE"].includes(genderRaw.toUpperCase())
    ? (genderRaw.toUpperCase() as "MALE" | "FEMALE")
    : null;

  const role: SelfAssignableRole | null = (
    SELF_ASSIGNABLE_ROLES as readonly string[]
  ).includes(roleRaw)
    ? (roleRaw as SelfAssignableRole)
    : null;

  // Update Prisma (role only if user picked a valid non-admin role)
  await prisma.user.update({
    where: { authUserId: uid },
    data: {
      gender: gender as any,
      homeChurch,
      ...(role ? { role } : {}),
    },
  });

  // Mirror role to Supabase user_metadata so middleware/UI can read it
  if (role) {
    const supabase = await createClient();
    await supabase.auth.updateUser({ data: { role } });
  }

  revalidatePath("/onboarding");
  redirect("/onboarding");
}

/** Step 3: MemberProfile (only if role != GUEST) */
export async function createMemberProfile(formData: FormData) {
  const uid = await getAuthUserId();
  if (!uid) redirect("/auth/login");

  const me = await prisma.user.findUnique({
    where: { authUserId: uid },
    select: { id: true, role: true },
  });
  if (!me) redirect("/auth/login");

  if (me.role === "GUEST") {
    // Guests cannot create MemberProfile
    redirect("/onboarding");
  }

  const address = String(formData.get("address") ?? "").trim() || null;
  const graduationYearRaw = String(formData.get("graduationYear") ?? "").trim();
  const baptismDateRaw = String(formData.get("baptismDate") ?? "").trim();
  const dateOfBirthRaw = String(formData.get("dateOfBirth") ?? "").trim();

  const graduationYear = graduationYearRaw ? Number(graduationYearRaw) : null;
  const baptismDate = baptismDateRaw ? new Date(baptismDateRaw) : null;
  const dateOfBirth = dateOfBirthRaw ? new Date(dateOfBirthRaw) : null;

  await prisma.memberProfile.upsert({
    where: { userId: me.id },
    create: {
      userId: me.id,
      address,
      graduationYear: Number.isFinite(graduationYear!)
        ? (graduationYear as number)
        : null,
      baptismDate:
        baptismDate && !isNaN(baptismDate.getTime()) ? baptismDate : null,
      dateOfBirth:
        dateOfBirth && !isNaN(dateOfBirth.getTime()) ? dateOfBirth : null,
    },
    update: {
      address,
      graduationYear: Number.isFinite(graduationYear!)
        ? (graduationYear as number)
        : null,
      baptismDate:
        baptismDate && !isNaN(baptismDate.getTime()) ? baptismDate : null,
      dateOfBirth:
        dateOfBirth && !isNaN(dateOfBirth.getTime()) ? dateOfBirth : null,
    },
  });

  revalidatePath("/onboarding");
  redirect("/onboarding");
}
