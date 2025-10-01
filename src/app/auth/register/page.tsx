"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { signup } from "../actions";
import { useFormStatus } from "react-dom";

/** Theme tokens (navy, blue, gold) */
const BG_GRADIENT =
  "bg-gradient-to-br from-[#0b1f3a] via-[#0f2e5a] to-[#1e3a8a]"; // navy → deep blue → blue-800
const CARD_BG =
  "bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/15";
const TEXT_MAIN = "text-white";
const TEXT_SOFT = "text-blue-100";
const INPUT_BG = "bg-white/15";
const INPUT_PLACEHOLDER = "placeholder-blue-200";
const FOCUS_RING = "focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37]"; // gold
const LINK_ACCENT = "text-[#f0c33c]"; // gold
const BTN_GRADIENT = "bg-gradient-to-r from-[#f0c33c] to-[#d4af37]"; // gold tones
const BTN_SHADOW_HOVER = "0px 0px 18px rgba(212,175,55,0.55)"; // gold glow

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <motion.button
      type="submit"
      whileHover={{
        scale: pending ? 1 : 1.03,
        boxShadow: pending ? "none" : BTN_SHADOW_HOVER,
      }}
      whileTap={{ scale: pending ? 1 : 0.95 }}
      disabled={pending}
      className={`w-full ${BTN_GRADIENT} ${TEXT_MAIN} py-3 rounded-lg font-semibold shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {pending ? "Creating account…" : "Sign Up"}
    </motion.button>
  );
}

export default function SignupPage() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const pwd = form.querySelector<HTMLInputElement>("#password")!.value;
    const confirm = form.querySelector<HTMLInputElement>("#confirmPassword")!;
    if (confirm.value !== pwd) {
      confirm.setCustomValidity("Passwords do not match");
      confirm.reportValidity();
      e.preventDefault();
    } else {
      confirm.setCustomValidity("");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${BG_GRADIENT} p-6`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        className={`w-full max-w-md ${CARD_BG} p-8`}
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-3xl font-bold ${LINK_ACCENT} text-center mb-6 tracking-tight`}
        >
          Create an Account ✨
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`${TEXT_SOFT} text-center mb-8`}
        >
          Sign up to get started. We’ll email you a confirmation link.
        </motion.p>

        {/* Signup Form */}
        <form
          action={signup}
          onSubmit={onSubmit}
          className="flex flex-col space-y-6"
          noValidate
        >
          {/* Hidden redirect */}
          <input type="hidden" name="next" value="/onboarding" />

          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className={`block text-sm font-medium ${TEXT_SOFT} mb-1`}
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="John Doe"
              className={`w-full rounded-lg px-4 py-3 ${INPUT_BG} ${TEXT_MAIN} ${INPUT_PLACEHOLDER} focus:outline-none ${FOCUS_RING} transition duration-300`}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium ${TEXT_SOFT} mb-1`}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={`w-full rounded-lg px-4 py-3 ${INPUT_BG} ${TEXT_MAIN} ${INPUT_PLACEHOLDER} focus:outline-none ${FOCUS_RING} transition duration-300`}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone"
              className={`block text-sm font-medium ${TEXT_SOFT} mb-1`}
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="+254 712 345 678"
              pattern="^\\+?[0-9\\s\\-]{7,15}$"
              className={`w-full rounded-lg px-4 py-3 ${INPUT_BG} ${TEXT_MAIN} ${INPUT_PLACEHOLDER} focus:outline-none ${FOCUS_RING} transition duration-300`}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className={`block text-sm font-medium ${TEXT_SOFT} mb-1`}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="••••••••"
              className={`w-full rounded-lg px-4 py-3 ${INPUT_BG} ${TEXT_MAIN} ${INPUT_PLACEHOLDER} focus:outline-none ${FOCUS_RING} transition duration-300`}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className={`block text-sm font-medium ${TEXT_SOFT} mb-1`}
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="••••••••"
              className={`w-full rounded-lg px-4 py-3 ${INPUT_BG} ${TEXT_MAIN} ${INPUT_PLACEHOLDER} focus:outline-none ${FOCUS_RING} transition duration-300`}
              onInput={(e) =>
                (e.currentTarget as HTMLInputElement).setCustomValidity("")
              }
            />
          </div>

          {/* Submit */}
          <SubmitButton />
        </form>

        {/* Footer Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-sm text-blue-200"
        >
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className={`${LINK_ACCENT} font-medium hover:underline`}
          >
            Log in
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
