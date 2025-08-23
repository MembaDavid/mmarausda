"use client";

import { motion } from "framer-motion";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-800 via-black to-red-900 overflow-hidden relative text-white">
      {/* Animated Background Parallax */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,0,0,0.6) 0%, transparent 70%), radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 80%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Glitchy 500 Text */}
      <motion.h1
        className="text-8xl font-extrabold z-10 relative"
        animate={{
          textShadow: [
            "2px 0 red, -2px 0 cyan",
            "-2px 0 red, 2px 0 cyan",
            "2px 0 red, -2px 0 cyan",
          ],
        }}
        transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
      >
        500
      </motion.h1>

      {/* Error Message */}
      <motion.p
        className="text-xl mt-6 z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Sorry, something went wrong.
      </motion.p>

      {/* Bouncing Retry Button */}
      <motion.a
        href="/"
        className="mt-8 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl shadow-lg relative overflow-hidden z-10"
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px rgba(255,0,0,0.8)" }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Go Home
      </motion.a>

      {/* Floating SVG Shapes */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-20 left-10 w-16 h-16 text-red-400 opacity-30"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        animate={{ y: [0, -20, 0], rotate: [0, 360] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <circle cx="12" cy="12" r="10" />
      </motion.svg>

      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-20 right-12 w-20 h-20 text-red-500 opacity-40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        animate={{ y: [0, 25, 0], rotate: [0, -360] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        <rect x="4" y="4" width="16" height="16" rx="4" />
      </motion.svg>
    </div>
  );
}
