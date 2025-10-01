// ./src/app/onboarding/page.tsx
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { updateUserProfile, createMemberProfile } from "./actions";
import Link from "next/link";
import type { ReactNode } from "react";

const COLORS = {
  navy: "#0a1b3d",
  blue: "#1e3a8a",
  blueLight: "#3b82f6",
  gold: "#d4af37",
};

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section
      className="mb-8 rounded-2xl border bg-white/5 p-6 shadow-xl backdrop-blur-lg"
      style={{ borderColor: "rgba(255,255,255,.12)" }}
    >
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      {subtitle ? (
        <p className="mt-1 text-sm text-white/70">{subtitle}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const uid = session?.user?.id;

  if (!uid)
    return (
      <main
        className="min-h-[80vh] flex items-center justify-center px-6"
        style={{
          background:
            "radial-gradient(80rem 80rem at 120% -10%, rgba(212,175,55,.15), transparent), linear-gradient(135deg, #0a1b3d 0%, #1e3a8a 55%, #0a1b3d 100%)",
        }}
      >
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-8 text-center shadow-2xl">
          <h1 className="text-3xl font-bold text-white">Please sign in</h1>
          <p className="mt-2 text-white/80">
            You must be logged in to continue onboarding.
          </p>
          <div className="mt-6">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: COLORS.blue,
                boxShadow: "0 6px 18px rgba(59,130,246,.35)",
              }}
            >
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    );

  const me = await prisma.user.findUnique({
    where: { authUserId: uid },
    include: { memberProfile: true },
  });

  if (!me) {
    return (
      <main
        className="min-h-[80vh] flex items-center justify-center px-6"
        style={{
          background:
            "linear-gradient(135deg, #0a1b3d 0%, #1e3a8a 55%, #0a1b3d 100%)",
        }}
      >
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-8 text-center shadow-2xl">
          <h1 className="text-3xl font-bold text-white">Setting things up…</h1>
          <p className="mt-2 text-white/80">
            Your account is almost ready. Please reload in a moment.
          </p>
        </div>
      </main>
    );
  }

  const needsUserInfo = !me.gender || !me.homeChurch;
  const isGuest = me.role === "GUEST";
  const needsMemberProfile = !isGuest && !me.memberProfile;

  return (
    <main
      className="min-h-screen px-6 py-10"
      style={{
        background:
          "radial-gradient(120rem 120rem at -15% -25%, rgba(212,175,55,.12), transparent 40%), linear-gradient(160deg, #0a1b3d 0%, #122552 35%, #1e3a8a 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Onboarding
          </h1>
          <p className="mt-1 text-white/80">
            Complete the steps below to finish setting up your account.
          </p>
        </header>

        {/* Stepper */}
        <ol className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <li className="relative">
            <div
              className="flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm bg-white/10"
              style={{ borderColor: "rgba(255,255,255,.12)", color: "#fff" }}
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold"
                style={{
                  backgroundColor: needsUserInfo ? COLORS.gold : "#16a34a",
                  color: needsUserInfo ? COLORS.navy : "white",
                }}
              >
                1
              </span>
              <div className="text-sm leading-tight">
                <p className="font-semibold">Account created</p>
                <p className="text-white/70">
                  {needsUserInfo ? "Signed in" : "Completed ✅"}
                </p>
              </div>
            </div>
          </li>

          <li className="relative">
            <div
              className="flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm bg-white/10"
              style={{ borderColor: "rgba(255,255,255,.12)", color: "#fff" }}
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold"
                style={{
                  backgroundColor: needsUserInfo ? COLORS.blueLight : "#16a34a",
                  color: "white",
                }}
              >
                2
              </span>
              <div className="text-sm leading-tight">
                <p className="font-semibold">Complete profile</p>
                <p className="text-white/70">
                  {needsUserInfo ? "In progress" : "Done ✅"}
                </p>
              </div>
            </div>
          </li>

          <li className="relative">
            <div
              className="flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm bg-white/10"
              style={{ borderColor: "rgba(255,255,255,.12)", color: "#fff" }}
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold"
                style={{
                  backgroundColor: needsMemberProfile
                    ? COLORS.blueLight
                    : isGuest
                    ? "#6b7280"
                    : "#16a34a",
                  color: "white",
                }}
              >
                3
              </span>
              <div className="text-sm leading-tight">
                <p className="font-semibold">Member details</p>
                <p className="text-white/70">
                  {needsMemberProfile
                    ? "If applicable"
                    : isGuest
                    ? "Not required"
                    : "Done ✅"}
                </p>
              </div>
            </div>
          </li>
        </ol>

        {/* Step 2: Complete User profile */}
        {needsUserInfo && (
          <Card
            title="Step 2 — Complete your profile"
            subtitle="Tell us a bit more so we can personalize your experience."
          >
            <form
              action={updateUserProfile}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div>
                <label className="block text-sm font-medium text-white/90">
                  Gender
                </label>
                <select
                  name="gender"
                  required
                  className="mt-1 w-full rounded-lg border bg-white/90 px-3 py-2 text-gray-900 outline-none transition focus:ring-2"
                  style={{ borderColor: "rgba(10,27,61,.15)" }}
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              {/* New: Role (self-assignable only) */}
              <div>
                <label className="block text-sm font-medium text-white/90">
                  Role
                </label>
                <select
                  name="role"
                  defaultValue={
                    ["GUEST", "MEMBER", "ASSOCIATE", "STAFF"].includes(me.role)
                      ? me.role
                      : "GUEST"
                  }
                  className="mt-1 w-full rounded-lg border bg-white/90 px-3 py-2 text-gray-900 outline-none transition focus:ring-2"
                  style={{ borderColor: "rgba(10,27,61,.15)" }}
                >
                  <option value="GUEST">Guest</option>
                  <option value="MEMBER">Member</option>
                  <option value="ASSOCIATE">Associate</option>
                  <option value="STAFF">Staff</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  You can choose a non-administrative role.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90">
                  Home Church
                </label>
                <input
                  name="homeChurch"
                  required
                  placeholder="e.g., MMU SDA Church"
                  className="mt-1 w-full rounded-lg border bg-white/90 px-3 py-2 text-gray-900 outline-none transition focus:ring-2"
                  style={{ borderColor: "rgba(10,27,61,.15)" }}
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-between gap-3 pt-2">
                <p className="text-xs text-white/70">
                  You can update this later in your account settings.
                </p>
                <button
                  className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    backgroundColor: COLORS.gold,
                    color: COLORS.navy,
                    boxShadow: "0 8px 24px rgba(212,175,55,.35)",
                  }}
                >
                  Save & Continue
                </button>
              </div>
            </form>
          </Card>
        )}

        {/* Step 3: MemberProfile (only if role != GUEST) */}
        {!needsUserInfo && needsMemberProfile && (
          <Card
            title="Step 3 — Membership details"
            subtitle="Add your membership information (admins can verify later)."
          >
            <form
              action={createMemberProfile}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-white/90">
                  Address
                </label>
                <input
                  name="address"
                  placeholder="Street, City"
                  className="mt-1 w-full rounded-lg border bg-white/90 px-3 py-2 text-gray-900 outline-none transition focus:ring-2"
                  style={{ borderColor: "rgba(10,27,61,.15)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90">
                  Graduation Year
                </label>
                <input
                  name="graduationYear"
                  type="number"
                  min="1900"
                  max="2100"
                  className="mt-1 w-full rounded-lg border bg-white/90 px-3 py-2 text-gray-900 outline-none transition focus:ring-2"
                  style={{ borderColor: "rgba(10,27,61,.15)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90">
                  Baptism Date
                </label>
                <input
                  name="baptismDate"
                  type="date"
                  className="mt-1 w-full rounded-lg border bg-white/90 px-3 py-2 text-gray-900 outline-none transition focus:ring-2"
                  style={{ borderColor: "rgba(10,27,61,.15)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90">
                  Date of Birth
                </label>
                <input
                  name="dateOfBirth"
                  type="date"
                  className="mt-1 w-full rounded-lg border bg-white/90 px-3 py-2 text-gray-900 outline-none transition focus:ring-2"
                  style={{ borderColor: "rgba(10,27,61,.15)" }}
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
                <Link
                  href="/"
                  className="rounded-lg border px-4 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
                  style={{ borderColor: "rgba(255,255,255,.2)" }}
                >
                  Skip for now
                </Link>
                <button
                  className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    backgroundColor: COLORS.blue,
                    boxShadow: "0 8px 24px rgba(30,58,138,.45)",
                  }}
                >
                  Save Member Profile
                </button>
              </div>
            </form>
          </Card>
        )}

        {/* Done */}
        {!needsUserInfo && !needsMemberProfile && (
          <Card title="All set 🎉">
            <p className="text-white/80">
              Your profile is complete{isGuest ? " (guest)" : ""}. You can
              update details later in your account page.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-semibold text-white transition"
                style={{
                  backgroundColor: COLORS.gold,
                  color: COLORS.navy,
                  boxShadow: "0 8px 24px rgba(212,175,55,.35)",
                }}
              >
                Go to Home
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg border px-5 py-2.5 font-semibold text-white/90 transition hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,.2)" }}
              >
                Open Dashboard
              </Link>
            </div>

            {!needsUserInfo && isGuest && !needsMemberProfile && (
              <p className="mt-4 text-sm text-white/70">
                Want to become a member? Ask an admin to update your role, then
                revisit this page to add membership details.
              </p>
            )}
          </Card>
        )}
      </div>
    </main>
  );
}
