"use client";

import * as motion from "motion/react-client";
import { useMemo, useState } from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiClock,
  FiUsers,
  FiHeart,
  FiHome,
  FiCalendar,
} from "react-icons/fi";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [category, setCategory] = useState<
    | "General"
    | "Prayer Request"
    | "Visitation"
    | "Volunteering"
    | "Giving / Donation"
  >("General");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      setStatus("sending");
      // Replace with your API call, e.g., await fetch('/api/contact', { method: 'POST', body: form })
      await new Promise((r) => setTimeout(r, 900));
      console.log("Church contact payload:", payload);
      setStatus("sent");
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  const container = useMemo(
    () => ({
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { delayChildren: 0.15, staggerChildren: 0.08 },
      },
    }),
    []
  );

  const item = useMemo(
    () => ({
      hidden: { opacity: 0, y: 16 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      },
    }),
    []
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-950 via-slate-950 to-blue-950 text-slate-100">
      {/* Ambient gradient blobs (Navy/Blue + Gold) */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.25, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-sky-400 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.15 }}
          className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-400 to-orange-400 blur-3xl"
        />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:py-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid items-stretch gap-10 md:grid-cols-2"
        >
          {/* Left: Intro + Contact Cards */}
          <motion.div variants={item} className="flex flex-col justify-center">
            <motion.h1
              className="text-3xl font-bold tracking-tight md:text-5xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Seventh-day Adventist
              <span className="block bg-gradient-to-r from-blue-300 via-amber-200 to-blue-300 bg-clip-text text-transparent">
                Maasai Mara University Church
              </span>
              <span className="mt-2 block text-base font-medium text-blue-200/90 md:text-lg">
                Contact Us
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-4 max-w-xl text-slate-200/90"
            >
              We’d love to hear from you—whether it’s a general question, a
              prayer request, a visitation need, volunteering, or giving. We
              typically respond within one business day.
            </motion.p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <ContactCard
                icon={<FiMail className="h-5 w-5" />}
                title="Email"
                value="info@mmu-sdachurch.org"
                href="mailto:info@mmu-sdachurch.org"
              />
              <ContactCard
                icon={<FiPhone className="h-5 w-5" />}
                title="Phone / WhatsApp"
                value={"+254 700 000 000"}
                href="tel:+254700000000"
              />
              <ContactCard
                icon={<FiMapPin className="h-5 w-5" />}
                title="Location"
                value="Maasai Mara University, Narok, Kenya"
                href="https://maps.google.com/?q=Maasai%20Mara%20University%2C%20Narok%2C%20Kenya"
              />
              <ContactCard
                icon={<FiClock className="h-5 w-5" />}
                title="Service Hours"
                value="Sabbath: Sat — Sabbath School 9:00am, Divine 11:00am; Vespers: Fri 6:00pm; Midweek: Wed 5:30pm"
              />
            </div>

            {/* Map card */}
            <motion.div
              variants={item}
              className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl"
            >
              <div className="aspect-[16/10] w-full">
                <iframe
                  title="Church Map"
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=Maasai+Mara+University,+Narok,+Kenya&output=embed"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Form */}
          <motion.form
            variants={item}
            onSubmit={onSubmit}
            className="relative rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl md:p-8"
          >
            {/* sheen */}
            <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <fieldset className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                name="name"
                placeholder="Jane Doe"
                autoComplete="name"
              />
              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="jane@email.com"
                autoComplete="email"
              />

              <Field
                label="Phone"
                name="phone"
                type="tel"
                placeholder="(+254) 7xx xxx xxx"
                autoComplete="tel"
                pattern="^(\+254|0)7\d{8}$"
                title="Use +2547XXXXXXXX or 07XXXXXXXX"
              />

              <Select
                label="I am"
                name="memberType"
                options={["Student", "Alumni", "Staff", "Guest"]}
                icon={<FiUsers className="h-4 w-4" />}
              />

              <Select
                label="Message type"
                name="category"
                value={category}
                onChange={(v) => setCategory(v as any)}
                options={[
                  "General",
                  "Prayer Request",
                  "Visitation",
                  "Volunteering",
                  "Giving / Donation",
                ]}
                icon={
                  category === "Prayer Request" ? (
                    <FiHeart className="h-4 w-4" />
                  ) : category === "Visitation" ? (
                    <FiHome className="h-4 w-4" />
                  ) : category === "Volunteering" ? (
                    <FiUsers className="h-4 w-4" />
                  ) : category === "Giving / Donation" ? (
                    <FiCalendar className="h-4 w-4" />
                  ) : (
                    <FiMail className="h-4 w-4" />
                  )
                }
              />

              <Field
                label="Subject"
                name="subject"
                placeholder="How can we help?"
                className="sm:col-span-2"
              />
            </fieldset>

            {/* Conditional fields */}
            {category === "Prayer Request" && (
              <div className="mt-4 grid gap-4">
                <Checkbox
                  name="confidential"
                  label="Share only with the pastoral team (confidential)"
                />
              </div>
            )}

            {category === "Visitation" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Preferred date" name="visit_date" type="date" />
                <Field
                  label="Residence / Location"
                  name="visit_location"
                  placeholder="Hostel / Estate / Landmark"
                />
              </div>
            )}

            {category === "Volunteering" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Select
                  label="Ministry area"
                  name="ministry"
                  options={[
                    "Deacons / Deaconesses",
                    "Music",
                    "Youth",
                    "Children",
                    "Welfare",
                    "Communications / Media",
                    "Ushering",
                  ]}
                />
                <Field
                  label="Availability (days/times)"
                  name="availability"
                  placeholder="e.g., Weekends, Wed 5–7pm"
                />
              </div>
            )}

            {category === "Giving / Donation" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Select
                  label="Fund"
                  name="fund"
                  options={[
                    "Tithe",
                    "Combined Offering",
                    "Church Budget",
                    "Welfare",
                    "Mission",
                  ]}
                />
                <Field
                  label="Amount (optional)"
                  name="amount"
                  type="number"
                  placeholder="KES"
                />
              </div>
            )}

            <div className="mt-4">
              <FieldTextarea
                label="Message"
                name="message"
                placeholder="Write your message or request…"
                rows={6}
              />
            </div>

            <div className="mt-3">
              <Checkbox
                name="consent"
                required
                label="I consent to be contacted by the church about this inquiry."
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={status === "sending"}
              className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500 px-5 py-3 font-medium text-white shadow-lg shadow-blue-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:opacity-60"
            >
              {status === "sending" ? (
                <Spinner />
              ) : (
                <FiSend className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
              )}
              <span>
                {status === "sending"
                  ? "Sending…"
                  : status === "sent"
                  ? "Sent!"
                  : "Send message"}
              </span>
            </motion.button>

            {status === "sent" && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-center text-sm text-emerald-300"
              >
                Thank you! Your message has been received.
              </motion.p>
            )}

            {status === "error" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-center text-sm text-rose-300"
              >
                Oops, something went wrong. Please try again.
              </motion.p>
            )}
          </motion.form>
        </motion.div>

        {/* Footer note */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="mx-auto mt-12 max-w-3xl text-center text-sm text-slate-300"
        >
          We value your privacy. Your details are used only for ministry
          communication and are never shared.
        </motion.div>
      </section>
    </main>
  );
}

function ContactCard({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}) {
  return (
    <motion.a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer" : undefined}
      whileHover={{ y: -2 }}
      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/10"
    >
      <div className="grid h-10 w-10 place-content-center rounded-xl bg-white/10">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">
          {title}
        </p>
        <p className="text-sm font-medium text-slate-100">{value}</p>
      </div>
    </motion.a>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  className = "",
  pattern,
  title,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
  pattern?: string;
  title?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-slate-100">
        {label}
      </span>
      <input
        required
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        pattern={pattern}
        title={title}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder-slate-400 outline-none ring-0 transition focus:border-white/20 focus:bg-white/10 focus:ring-2 focus:ring-blue-400/40"
      />
    </label>
  );
}

function Select({
  label,
  name,
  options,
  value,
  onChange,
  icon,
  className = "",
}: {
  label: string;
  name: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-slate-100">
        {label}
      </span>
      <div className="relative">
        <select
          name={name}
          defaultValue={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-slate-100 outline-none transition focus:border-white/20 focus:bg-white/10 focus:ring-2 focus:ring-blue-400/40"
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-blue-950">
              {opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
          {icon ?? <FiCalendar className="h-4 w-4" />}
        </div>
      </div>
    </label>
  );
}

function Checkbox({
  name,
  label,
  required = false,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 text-sm text-slate-200">
      <input
        type="checkbox"
        name={name}
        required={required}
        className="h-4 w-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-400/40"
      />
      <span>{label}</span>
    </label>
  );
}

function FieldTextarea({
  label,
  name,
  placeholder,
  rows = 5,
}: {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-100">
        {label}
      </span>
      <textarea
        required
        name={name}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-y rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder-slate-300/80 outline-none transition focus:border-white/20 focus:bg-white/10 focus:ring-2 focus:ring-blue-400/40"
      />
    </label>
  );
}

function Spinner() {
  return (
    <motion.span
      className="inline-block h-5 w-5"
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear" as unknown as number[],
      }}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          className="opacity-20"
          fill="none"
        />
        <path
          d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
        />
      </svg>
    </motion.span>
  );
}
