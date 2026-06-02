"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import { useFormStatus } from "react-dom";
import { UserPlus } from "lucide-react";
import { signup } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="church-button w-full">
      <UserPlus className="h-4 w-4" />
      {pending ? "Creating account" : "Create account"}
    </button>
  );
}

export default function SignupPage() {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const password = form.querySelector<HTMLInputElement>("#password")?.value;
    const confirm = form.querySelector<HTMLInputElement>("#confirmPassword");

    if (confirm && confirm.value !== password) {
      confirm.setCustomValidity("Passwords do not match");
      confirm.reportValidity();
      event.preventDefault();
      return;
    }

    confirm?.setCustomValidity("");
  };

  return (
    <main className="church-page grid min-h-screen place-items-center px-4 py-12">
      <section className="church-card w-full max-w-lg p-6">
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-white">
            <Image src="/sda_logo.svg" alt="SDA logo" width={42} height={42} />
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-brand-ink">
            Create an account
          </h1>
          <p className="mt-2 text-sm leading-6 text-brand-muted">
            We will email you a confirmation link before onboarding.
          </p>
        </div>

        <form action={signup} onSubmit={onSubmit} className="mt-7 grid gap-4">
          <input type="hidden" name="next" value="/onboarding" />
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="church-label">Full Name</span>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="church-input"
              />
            </label>
            <label>
              <span className="church-label">Phone</span>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+254 700 000 000"
                className="church-input"
              />
            </label>
          </div>
          <label>
            <span className="church-label">Email</span>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="church-input"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="church-label">Password</span>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="church-input"
              />
            </label>
            <label>
              <span className="church-label">Confirm Password</span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="church-input"
                onInput={(event) => event.currentTarget.setCustomValidity("")}
              />
            </label>
          </div>
          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-sm text-brand-muted">
          Already registered?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-brand-forest-dark hover:underline"
          >
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
