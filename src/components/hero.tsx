"use client"

import * as motion from "motion/react-client"
import { useScroll, useTransform, motion as m } from "framer-motion"
import { useRef } from "react"
import { Fredoka, Poppins, Pacifico } from "next/font/google"

const headingFont = Fredoka({ subsets: ["latin"], weight: ["400", "700"] })
const bodyFont = Poppins({ subsets: ["latin"], weight: ["400", "600"] })
const eventFont = Pacifico({ subsets: ["latin"], weight: ["400"] })

export default function Hero() {
  const hymnRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: hymnRef,
    offset: ["start start", "end start"],
  })

  // Scroll animations
  const scaleVideo = useTransform(scrollYProgress, [0, 1], [1, 1.2]) // zoom in
  const fadeOut = useTransform(scrollYProgress, [0, 1], [1, 0]) // fade hymn out
  const moveUp = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]) // shift text

  return (
    <main className="min-h-screen flex flex-col bg-blue-900 text-white relative overflow-hidden">
      {/* Loved Hymn Section with Scroll */}
      <section ref={hymnRef} className="relative h-[70vh] w-full overflow-hidden">
        <m.video
          style={{ scale: scaleVideo }}
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/videos/hymn.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <m.div
          style={{ opacity: fadeOut, y: moveUp }}
          className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center px-4"
        >
          <m.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className={`${headingFont.className} text-3xl md:text-5xl font-bold text-yellow-300`}
          >
            Beloved Hymn
          </m.h2>
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className={`${bodyFont.className} mt-4 text-lg md:text-2xl text-white max-w-2xl`}
          >
            "Blessed Assurance, Jesus is Mine! Oh, what a foretaste of glory divine..."
          </m.p>
          <m.a
            href="#"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-2xl px-8 py-4 shadow-lg transition"
          >
            🎵 Play Full Hymn
          </m.a>
        </m.div>
      </section>

      {/* Hero Section (appears after scroll) */}
      <section className="flex flex-col items-center justify-center text-center px-6 md:px-12 py-20 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className={`${headingFont.className} text-3xl md:text-5xl font-extrabold leading-snug`}
        >
          Seventh Day Adventist
          <br />
          Maasai Mara University Church
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          viewport={{ once: true }}
          className={`${bodyFont.className} mt-6 text-lg md:text-2xl font-medium text-white/90`}
        >
          ✨ A vibrant community of worship, fellowship, and service ✨
        </motion.p>
      </section>

      {/* Upcoming Event */}
      <section className="px-6 md:px-12 max-w-3xl mx-auto pb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-center"
        >
          <h2
            className={`${eventFont.className} text-3xl md:text-4xl font-bold text-yellow-300`}
          >
            🌟 Upcoming Event 🌟
          </h2>
          <p className={`${bodyFont.className} mt-4 text-lg md:text-xl text-white`}>
            **Campus Revival Week**
            <br />
            August 25th – 31st, 2025
          </p>
          <p className={`${bodyFont.className} mt-2 text-white/80`}>
            Speaker: Pastor John Doe <br />
            Venue: Main Auditorium
          </p>
        </motion.div>
      </section>
    </main>
  )
}
