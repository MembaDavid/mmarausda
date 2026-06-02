import Link from "next/link";
import type { ReactNode } from "react";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { createMemberProfile, updateUserProfile } from "./actions";

function OnboardingCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="church-card p-6">
      <h2 className="text-xl font-semibold text-brand-ink">{title}</h2>
      {subtitle ? (
        <p className="mt-1 text-sm leading-6 text-brand-muted">{subtitle}</p>
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

  if (!uid) {
    return (
      <main className="church-page grid min-h-screen place-items-center px-4 py-12">
        <section className="church-card w-full max-w-lg p-8 text-center">
          <p className="church-kicker">Onboarding</p>
          <h1 className="mt-3 text-3xl font-semibold text-brand-ink">
            Please sign in
          </h1>
          <p className="church-copy mt-2">
            You must be logged in to complete your church profile.
          </p>
          <Link href="/auth/login" className="church-button mt-6">
            Go to Login
          </Link>
        </section>
      </main>
    );
  }

  const me = await prisma.user.findUnique({
    where: { authUserId: uid },
    include: { memberProfile: true },
  });

  if (!me) {
    return (
      <main className="church-page grid min-h-screen place-items-center px-4 py-12">
        <section className="church-card w-full max-w-lg p-8 text-center">
          <p className="church-kicker">Account Setup</p>
          <h1 className="mt-3 text-3xl font-semibold text-brand-ink">
            Your account is almost ready
          </h1>
          <p className="church-copy mt-2">
            Sign out and back in, or ask an admin to ensure your profile exists.
          </p>
        </section>
      </main>
    );
  }

  const needsUserInfo = !me.gender || !me.homeChurch;
  const isGuest = me.role === "GUEST";
  const needsMemberProfile = !isGuest && !me.memberProfile;

  return (
    <main className="church-page min-h-screen px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-3xl pt-12">
        <header>
          <p className="church-kicker">Onboarding</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-brand-ink">
            Complete your profile
          </h1>
          <p className="church-copy mt-3">
            These details help the church coordinate member care, ministries,
            and communication.
          </p>
        </header>

        <ol className="my-8 grid gap-3 sm:grid-cols-3">
          <Step number={1} title="Account" state="Complete" done />
          <Step
            number={2}
            title="Profile"
            state={needsUserInfo ? "Needed" : "Complete"}
            done={!needsUserInfo}
          />
          <Step
            number={3}
            title="Membership"
            state={needsMemberProfile ? "Needed" : isGuest ? "Guest" : "Complete"}
            done={!needsMemberProfile}
          />
        </ol>

        <div className="grid gap-6">
          {needsUserInfo ? (
            <OnboardingCard
              title="Profile details"
              subtitle="Choose a non-administrative role and add your home church."
            >
              <form action={updateUserProfile} className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="church-label">Gender</span>
                  <select name="gender" required className="church-input">
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </label>

                <label>
                  <span className="church-label">Role</span>
                  <select name="role" defaultValue={me.role} className="church-input">
                    <option value="GUEST">Guest</option>
                    <option value="MEMBER">Member</option>
                    <option value="ASSOCIATE">Associate</option>
                  </select>
                </label>

                <label className="sm:col-span-2">
                  <span className="church-label">Home Church</span>
                  <input
                    name="homeChurch"
                    required
                    placeholder="MMU SDA Church"
                    className="church-input"
                  />
                </label>

                <div className="sm:col-span-2 flex justify-end">
                  <button className="church-button">Save and Continue</button>
                </div>
              </form>
            </OnboardingCard>
          ) : null}

          {!needsUserInfo && needsMemberProfile ? (
            <OnboardingCard
              title="Membership details"
              subtitle="Add optional details for church records and follow-up."
            >
              <form
                action={createMemberProfile}
                className="grid gap-4 sm:grid-cols-2"
              >
                <label className="sm:col-span-2">
                  <span className="church-label">Address</span>
                  <input
                    name="address"
                    placeholder="Residence, town, or hostel"
                    className="church-input"
                  />
                </label>
                <label>
                  <span className="church-label">Graduation Year</span>
                  <input
                    name="graduationYear"
                    type="number"
                    min="1900"
                    max="2100"
                    className="church-input"
                  />
                </label>
                <label>
                  <span className="church-label">Baptism Date</span>
                  <input name="baptismDate" type="date" className="church-input" />
                </label>
                <label>
                  <span className="church-label">Date of Birth</span>
                  <input name="dateOfBirth" type="date" className="church-input" />
                </label>
                <div className="flex items-center justify-end gap-3 sm:col-span-2">
                  <Link href="/" className="church-button-secondary">
                    Skip
                  </Link>
                  <button className="church-button">Save Membership</button>
                </div>
              </form>
            </OnboardingCard>
          ) : null}

          {!needsUserInfo && !needsMemberProfile ? (
            <OnboardingCard title="Profile complete">
              <p className="church-copy">
                Your profile is ready{isGuest ? " as a guest" : ""}. You can
                continue to church resources, events, and ministry pages.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/" className="church-button">
                  Go Home
                </Link>
                <Link href="/events" className="church-button-secondary">
                  View Events
                </Link>
              </div>
            </OnboardingCard>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function Step({
  number,
  title,
  state,
  done,
}: {
  number: number;
  title: string;
  state: string;
  done?: boolean;
}) {
  return (
    <li className="church-card-plain flex items-center gap-3 p-4">
      <span
        className={[
          "grid h-8 w-8 place-items-center rounded-full text-sm font-semibold",
          done
            ? "bg-brand-forest text-brand-cream"
            : "bg-brand-gold text-brand-ink",
        ].join(" ")}
      >
        {number}
      </span>
      <span>
        <span className="block text-sm font-semibold text-brand-ink">
          {title}
        </span>
        <span className="block text-xs text-brand-muted">{state}</span>
      </span>
    </li>
  );
}
