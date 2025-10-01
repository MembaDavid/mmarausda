"use client";

export const dynamic = "force-dynamic"; // <— prevent build-time prerender

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

type Status = "idle" | "working" | "success" | "error";

export default function ConfirmEmailPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("Confirming your email…");

  const nextUrl = params.get("next") || "/";

  // Only create supabase client in the browser
  const supabase = useMemo(() => {
    if (typeof window === "undefined") return null;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    // Support either env name (standardize in your project later)
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
  }, []);

  const runConfirmation = useCallback(async () => {
    if (!supabase) {
      // Happens for the very first render during hydration
      return;
    }

    setStatus("working");
    setMessage("Confirming your email…");

    try {
      // Supabase can send either:
      // 1) ?code=... (modern) -> exchangeCodeForSession
      // 2) ?token_hash=...&type=signup|recovery (legacy) -> verifyOtp
      const code = params.get("code");
      const tokenHash = params.get("token_hash");
      const typeParam = (params.get("type") || "signup") as
        | "signup"
        | "email_change"
        | "recovery"
        | "magiclink"
        | "invite";

      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          code
        );
        if (error) throw error;

        // Ensure your app-side user row exists
        await fetch("/api/ensure-profile", { method: "POST" });

        if (data?.session) {
          setStatus("success");
          setMessage("Email confirmed! You can proceed.");
          return;
        }
        throw new Error("No session returned after confirmation.");
      } else if (tokenHash) {
        const { data, error } = await supabase.auth.verifyOtp({
          type: typeParam === "recovery" ? "recovery" : "email",
          token_hash: tokenHash,
        } as any);
        if (error) throw error;

        // Ensure your app-side user row exists
        await fetch("/api/ensure-profile", { method: "POST" });

        if (data?.session || data?.user) {
          setStatus("success");
          setMessage("Email confirmed! You can proceed.");
          return;
        }
        throw new Error("Verification did not return a session/user.");
      } else {
        setStatus("error");
        setMessage(
          "Missing confirmation token. Please open the link from your email again."
        );
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(
        err?.message || "Something went wrong while confirming email."
      );
    }
  }, [params, supabase]);

  useEffect(() => {
    if (status === "idle") {
      // Defer to next tick so useMemo can run in the browser
      setTimeout(() => {
        void runConfirmation();
      }, 0);
    }
  }, [status, runConfirmation]);

  const proceed = () => router.replace(nextUrl);
  const backToLogin = () => router.replace("/auth/login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/15"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-gold-400/60 bg-white/10 shadow-md">
            {status === "success" ? (
              <svg
                className="w-7 h-7 text-gold-400"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20 7L9 18l-5-5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                className="w-7 h-7 text-gold-400"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="2" />
                <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gold-400">
            {status === "success" ? "Email Confirmed" : "Confirming Email"}
          </h1>
          <p className="mt-2 text-blue-100">{message}</p>
        </motion.div>

        {/* Body */}
        <div className="space-y-6">
          {status === "working" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center"
            >
              <span className="relative flex h-10 w-10">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-30" />
                <span className="relative inline-flex rounded-full h-10 w-10 bg-white/20" />
              </span>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-blue-100"
            >
              <p className="mb-6">
                Your email has been verified successfully. Welcome aboard!
              </p>
              <motion.button
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 15px rgba(212,175,55,0.5)",
                }}
                whileTap={{ scale: 0.96 }}
                onClick={proceed}
                className="w-full bg-gradient-to-r from-blue-800 to-blue-600 text-white py-3 rounded-lg font-semibold border border-gold-400"
              >
                Continue
              </motion.button>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-blue-100 mb-6">
                We couldn’t confirm your email automatically.
                <br />
                You can retry or head back to login and request a new link.
              </p>
              <div className="grid grid-cols-1 gap-3">
                <motion.button
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 15px rgba(212,175,55,0.45)",
                  }}
                  whileTap={{ scale: 0.96 }}
                  onClick={runConfirmation}
                  className="w-full bg-gradient-to-r from-blue-800 to-blue-600 text-white py-3 rounded-lg font-semibold border border-gold-400"
                >
                  Retry Confirmation
                </motion.button>
                <button
                  onClick={backToLogin}
                  className="w-full py-3 rounded-lg font-medium text-gold-400 hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-8 text-center text-sm text-blue-200"
        >
          Didn’t get the email? Check your spam folder or request another link
          from the login page.
        </motion.div>
      </motion.div>
    </div>
  );
}
