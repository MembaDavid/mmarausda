"use client";

import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaBus,
  FaTruck,
  FaShieldAlt,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaTicketAlt,
} from "react-icons/fa";

// Color tokens (feel free to move these to Tailwind config later)
const COLORS = {
  bg: "#ffffff",
  fg: "#000000",
  gray600: "#666666",
  gray900: "#242424",
  accent: "#f8b116",
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full bg-white text-black">
      {/* Top notice bar */}
      <div className="w-full border-b border-black/10 bg-black text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm">
          <p className="flex items-center gap-2">
            <FaClock className="h-4 w-4" aria-hidden /> 24/7 Support • Reliable
            Travel & Courier
          </p>
          <a
            href="#contact"
            className="underline decoration-[#f8b116] underline-offset-4 hover:text-[#f8b116]"
          >
            Talk to us
          </a>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-black/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-[#242424] text-white">
              <span className="text-sm font-semibold">EC</span>
            </div>
            <span className="text-base font-semibold tracking-tight">
              EnaCoach Travel & Courier
            </span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a
              className="text-sm text-[#242424] hover:text-black"
              href="#features"
            >
              Features
            </a>
            <a
              className="text-sm text-[#242424] hover:text-black"
              href="#services"
            >
              Services
            </a>
            <a
              className="text-sm text-[#242424] hover:text-black"
              href="#reviews"
            >
              Reviews
            </a>
            <a className="text-sm text-[#242424] hover:text-black" href="#faq">
              FAQ
            </a>
          </nav>

          <div className="hidden md:block">
            <a
              href="#book"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#f8b116] px-4 py-2 text-sm font-semibold text-black shadow-sm transition hover:translate-y-[-1px] hover:shadow"
            >
              Book Now <FaArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Elegant travel & courier for everyone
            </h1>
            <p className="mt-4 max-w-xl text-base text-[#666666]">
              Reliable routes, on-time deliveries, and a seamless booking
              experience. Built for millions — designed for all ages — fast,
              clear, and accessible.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#book"
                className="inline-flex items-center gap-2 rounded-full bg-[#f8b116] px-5 py-3 text-sm font-semibold text-black shadow-sm transition hover:translate-y-[-1px] hover:shadow-md"
              >
                Start Booking <FaArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="#services"
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#242424] transition hover:bg-black hover:text-white"
              >
                Explore Services
              </a>
            </div>

            {/* Trust signals */}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="h-5 w-5 text-[#242424]" aria-hidden />
                <span className="text-sm text-[#242424]">
                  Safe & trusted by thousands daily
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaStar className="h-5 w-5 text-[#242424]" aria-hidden />
                <span className="text-sm text-[#242424]">
                  4.8/5 average customer rating
                </span>
              </div>
            </div>
          </motion.div>

          {/* Visual card */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="relative rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="absolute inset-0 -z-10 rounded-2xl bg-[radial-gradient(60%_60%_at_70%_20%,rgba(248,177,22,0.12),transparent)]" />
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-black/10 bg-[#242424] p-4 text-white">
                  <p className="text-sm opacity-75">Next departure</p>
                  <p className="mt-1 text-2xl font-bold">08:30</p>
                  <p className="mt-3 flex items-center gap-2 text-sm opacity-90">
                    <FaMapMarkerAlt className="h-4 w-4" aria-hidden /> Nairobi →
                    Mombasa
                  </p>
                </div>
                <div className="rounded-xl border border-black/10 bg-white p-4">
                  <p className="text-sm text-[#666666]">Live courier slot</p>
                  <p className="mt-1 text-2xl font-bold">Available</p>
                  <p className="mt-3 flex items-center gap-2 text-sm text-[#242424]">
                    <FaTruck className="h-4 w-4" aria-hidden /> Same-day city
                    delivery
                  </p>
                </div>
                <div className="col-span-2 rounded-xl border border-black/10 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#666666]">Quick booking</p>
                      <p className="mt-1 text-lg font-semibold text-[#242424]">
                        Pick a route • Pay • Done
                      </p>
                    </div>
                    <FaTicketAlt
                      className="h-8 w-8 text-[#242424]"
                      aria-hidden
                    />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                    <button className="rounded-lg border border-black/10 bg-white px-3 py-2 hover:bg-black hover:text-white">
                      Nairobi
                    </button>
                    <button className="rounded-lg border border-black/10 bg-white px-3 py-2 hover:bg-black hover:text-white">
                      Kisumu
                    </button>
                    <button className="rounded-lg border border-black/10 bg-white px-3 py-2 hover:bg-black hover:text-white">
                      Mombasa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature highlights */}
      <section id="features" className="border-y border-black/10 bg-[#fafafa]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-12 md:grid-cols-3">
          {[
            {
              icon: <FaShieldAlt className="h-6 w-6" aria-hidden />,
              title: "Safety first",
              copy: "Professional drivers, verified couriers, secure handling.",
            },
            {
              icon: <FaClock className="h-6 w-6" aria-hidden />,
              title: "On-time, every time",
              copy: "Reliable schedules and proactive updates.",
            },
            {
              icon: <FaPhoneAlt className="h-6 w-6" aria-hidden />,
              title: "Human support",
              copy: "24/7 assistance via call, SMS, and WhatsApp.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8b116]/20 text-black">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
              </div>
              <p className="mt-3 text-sm text-[#666666]">{f.copy}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                One platform. Two powerful services.
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-[#666666]">
                Whether you’re traveling or sending a parcel, EnaCoach makes it
                smooth, safe, and simple — for everyone.
              </p>
            </div>
            <a
              href="#book"
              className="hidden rounded-full border border-black/10 bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#242424] md:inline-flex"
            >
              Book a seat
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Travel */}
            <motion.article
              variants={scaleIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white"
            >
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_80%_0%,rgba(248,177,22,0.10),transparent)]" />
              <div className="flex h-full flex-col p-6">
                <div className="flex items-center gap-2 text-sm text-[#242424]">
                  <FaBus className="h-5 w-5" aria-hidden /> Travel
                </div>
                <h3 className="mt-2 text-xl font-bold">
                  Comfortable coaches, modern stations
                </h3>
                <p className="mt-2 text-sm text-[#666666]">
                  Clean buses, USB charging, verified routes, real-time updates,
                  and easy rescheduling.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["USB ports", "Reclining seats", "Live tracking"].map(
                    (t) => (
                      <span
                        key={t}
                        className="rounded-full border border-black/10 px-3 py-1 text-xs text-[#242424]"
                      >
                        {t}
                      </span>
                    )
                  )}
                </div>
                <div className="mt-6">
                  <a
                    href="#book"
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-[#242424]"
                  >
                    Book travel <FaArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                </div>
              </div>
            </motion.article>

            {/* Courier */}
            <motion.article
              variants={scaleIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white"
            >
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_20%_0%,rgba(248,177,22,0.10),transparent)]" />
              <div className="flex h-full flex-col p-6">
                <div className="flex items-center gap-2 text-sm text-[#242424]">
                  <FaTruck className="h-5 w-5" aria-hidden /> Courier
                </div>
                <h3 className="mt-2 text-xl font-bold">
                  Fast, secure parcel delivery
                </h3>
                <p className="mt-2 text-sm text-[#666666]">
                  Door-to-depot & depot-to-depot options, fragile handling,
                  insurance options, and proof of delivery.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Same-day city", "Intercity", "Insurance"].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-black/10 px-3 py-1 text-xs text-[#242424]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-6">
                  <a
                    href="#book"
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-[#242424]"
                  >
                    Send a parcel{" "}
                    <FaArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section id="reviews" className="border-y border-black/10 bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-2xl font-black tracking-tight">
            Trusted by millions
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#666666]">
            Real riders and senders share why EnaCoach is their go-to for travel
            and delivery.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              "“On time and very professional.”",
              "“Booking is simple—even for my parents.”",
              "“Courier was fast, with great updates.”",
            ].map((quote, i) => (
              <motion.figure
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
              >
                <blockquote className="text-sm text-[#242424]">
                  {quote}
                </blockquote>
                <figcaption className="mt-3 text-xs text-[#666666]">
                  — Verified customer
                </figcaption>
              </motion.figure>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["500k+", "Monthly bookings"],
              ["150+", "Routes served"],
              ["2M+", "Parcels delivered"],
              ["24/7", "Customer support"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-black/10 bg-white p-6 text-center"
              >
                <div className="text-2xl font-black tracking-tight">
                  {value}
                </div>
                <div className="mt-1 text-xs text-[#666666]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="book">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-1 items-center gap-8 rounded-2xl border border-black/10 bg-[#242424] p-8 text-white md:grid-cols-3">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold tracking-tight">
                Ready to go?
              </h3>
              <p className="mt-2 text-sm text-white/80">
                Book your seat or schedule a courier pickup in under a minute.
                No account required.
              </p>
            </div>
            <div className="flex gap-3 md:justify-end">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full bg-[#f8b116] px-5 py-3 text-sm font-semibold text-black hover:translate-y-[-1px] hover:shadow"
              >
                Book travel
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/0 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
              >
                Send parcel
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-black/10">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-2xl font-black tracking-tight">
            Frequently asked
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              [
                "Can older users navigate easily?",
                "Yes. Large text, high contrast, and simple flows make it friendly for all ages.",
              ],
              [
                "Do I need an account to book?",
                "No. You can check out as a guest and receive your ticket via SMS/Email.",
              ],
              [
                "Is parcel delivery insured?",
                "Insurance options are available for valuable or fragile items.",
              ],
              [
                "What payments do you accept?",
                "Mobile money, cards, and cash at stations (where available).",
              ],
            ].map(([q, a]) => (
              <details
                key={q}
                className="rounded-xl border border-black/10 bg-white p-5"
              >
                <summary className="cursor-pointer list-none font-semibold text-[#242424]">
                  {q}
                </summary>
                <p className="mt-2 text-sm text-[#666666]">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-[#242424] text-white">
                  <span className="text-sm font-semibold">EC</span>
                </div>
                <span className="text-base font-semibold">EnaCoach</span>
              </div>
              <p className="mt-3 max-w-xs text-sm text-[#666666]">
                Modern travel & courier for everyone. Simple, safe, and on time.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Company</h4>
              <ul className="mt-3 space-y-2 text-sm text-[#242424]">
                <li>
                  <a className="hover:underline" href="#">
                    About
                  </a>
                </li>
                <li>
                  <a className="hover:underline" href="#">
                    Careers
                  </a>
                </li>
                <li>
                  <a className="hover:underline" href="#">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Support</h4>
              <ul className="mt-3 space-y-2 text-sm text-[#242424]">
                <li>
                  <a className="hover:underline" href="#">
                    Help Center
                  </a>
                </li>
                <li>
                  <a className="hover:underline" href="#">
                    Ticket lookup
                  </a>
                </li>
                <li>
                  <a className="hover:underline" href="#">
                    Parcel tracking
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Contact</h4>
              <ul className="mt-3 space-y-2 text-sm text-[#242424]">
                <li className="flex items-center gap-2">
                  <FaPhoneAlt className="h-4 w-4" aria-hidden /> +254 700 000
                  000
                </li>
                <li className="flex items-center gap-2">
                  <FaMapMarkerAlt className="h-4 w-4" aria-hidden /> Nairobi,
                  Kenya
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-6 text-sm text-[#666666] md:flex-row">
            <p>© {new Date().getFullYear()} EnaCoach. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a className="hover:text-black" href="#">
                Privacy
              </a>
              <a className="hover:text-black" href="#">
                Terms
              </a>
              <a className="hover:text-black" href="#">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
