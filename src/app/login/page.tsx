"use client";

import { motion } from "framer-motion";
import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-white text-center mb-6 tracking-tight"
        >
          Welcome Back 👋
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-indigo-100 text-center mb-8"
        >
          Sign in to continue to your account
        </motion.p>

        <form className="flex flex-col space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-indigo-100 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-lg px-4 py-3 bg-white/20 text-white placeholder-indigo-200 
                focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400
                transition duration-300"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-indigo-100 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-lg px-4 py-3 bg-white/20 text-white placeholder-indigo-200 
                focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400
                transition duration-300"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col space-y-4">
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0px 0px 15px rgba(236,72,153,0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              formAction={login}
              className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white py-3 rounded-lg font-semibold shadow-lg transition-all"
            >
              Log In
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0px 0px 15px rgba(139,92,246,0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              formAction={signup}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold shadow-lg transition-all"
            >
              Sign Up
            </motion.button>
          </div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-sm text-indigo-200"
        >
          Don’t have an account?{" "}
          <span className="text-pink-300 font-medium cursor-pointer hover:underline">
            Create one
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
