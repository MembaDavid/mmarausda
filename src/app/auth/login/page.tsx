"use client";

import Image from "next/image";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { LogIn } from "lucide-react";
import { login } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="church-button w-full">
      <LogIn className="h-4 w-4" />
      {pending ? "Signing in" : "Log in"}
    </button>
  );
}

export default function LoginPage() {
  return (
    <main className="church-page grid min-h-screen place-items-center px-4 py-12">
      <section className="church-card w-full max-w-md p-6">
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-white">
            <Image src="/sda_logo.svg" alt="SDA logo" width={42} height={42} />
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-brand-ink">
            Welcome back
          </h1>
          <p className="mt-2 text-sm leading-6 text-brand-muted">
            Sign in to continue to MMU SDA Church.
          </p>
        </div>

        <form action={login} className="mt-7 grid gap-4">
          <input type="hidden" name="next" value="/onboarding" />
          <label>
            <span className="church-label">Email</span>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="church-input"
            />
          </label>
          <label>
            <span className="church-label">Password</span>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Your password"
              className="church-input"
            />
          </label>
          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-sm text-brand-muted">
          Need an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-brand-forest-dark hover:underline"
          >
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}
