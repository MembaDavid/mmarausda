"use client";

import * as motion from "motion/react-client";
import Image from "next/image";
import Link from "next/link";

// Color palette (kept inline for easy edits)
// Navy: #0B1A33  | Deep Blue: #0F2A5F | Off‑White: #F8FAFC | Dark Yellow (Gold): #B38600

const ACCENT = "#B38600"; // dark yellow close to gold

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0B1A33] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <BackgroundOrbs />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-8 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
              <Image
                src="/sda_logo.svg"
                alt="Church logo"
                width={84}
                height={84}
                priority
              />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Seventh-day Adventist Church
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-balance text-white/80">
              Loving God. Serving people. Growing together in Christ.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Pill>Faith • Fellowship • Mission</Pill>
              <Pill>Community • Discipleship</Pill>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="bg-[#0F2A5F]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2">
            <InfoCard
              title="Our Mission"
              subtitle="Why we exist"
              description="To proclaim the everlasting gospel of Jesus Christ, nurture believers, and minister to the needs of our community in love and humility."
            />
            <InfoCard
              title="Our Vision"
              subtitle="Where we are going"
              description="A Christ‑centered church where every person belongs, grows, and serves — shining the light of hope to the world."
            />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center text-2xl font-semibold sm:text-3xl"
          >
            Our Core Values
          </motion.h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg ring-1 ring-inset ring-white/5"
              >
                <div
                  className="mb-3 h-1 w-12 rounded-full"
                  style={{ background: ACCENT }}
                />
                <h3 className="text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-white/80">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brief History (Timeline) */}
      <section className="bg-[#0F2A5F]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center text-2xl font-semibold sm:text-3xl"
          >
            Our Story
          </motion.h2>

          <div className="relative mx-auto max-w-3xl">
            <div className="absolute left-4 top-0 h-full w-0.5 bg-white/15 sm:left-1/2 sm:-translate-x-1/2" />
            <ul className="space-y-10">
              {TIMELINE.map((node, idx) => (
                <li
                  key={idx}
                  className="relative sm:grid sm:grid-cols-2 sm:items-start sm:gap-8"
                >
                  <div
                    className={`sm:text-right ${
                      idx % 2 ? "sm:col-start-2" : ""
                    }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/15"
                    >
                      {node.year}
                    </motion.div>
                    <h3 className="mt-3 text-lg font-semibold">{node.title}</h3>
                    <p className="mt-2 text-sm text-white/80">{node.text}</p>
                  </div>

                  <div className="relative mt-4 sm:mt-0">
                    <span
                      className="absolute left-3 top-2 h-3 w-3 -translate-x-1/2 rounded-full ring-2 ring-[#0B1A33]"
                      style={{ background: ACCENT }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center text-2xl font-semibold sm:text-3xl"
          >
            Our Leadership
          </motion.h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LEADERS.map((p, i) => (
              <motion.article
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10">
                    {/* Replace with real photos if available */}
                    <Image src={p.photo} alt={p.name} width={56} height={56} />
                  </div>
                  <div>
                    <h3 className="font-semibold leading-tight">{p.name}</h3>
                    <p className="text-sm text-white/70">{p.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-white/80">{p.bio}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Ministries */}
      <section className="bg-[#0F2A5F]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center text-2xl font-semibold sm:text-3xl"
          >
            Our Ministries
          </motion.h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MINISTRIES.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-inset ring-white/10"
              >
                <h3 className="font-semibold">{m.title}</h3>
                <p className="mt-2 text-sm text-white/80">{m.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 text-center ring-1 ring-white/10"
          >
            <h3 className="text-2xl font-semibold">Join Us This Sabbath</h3>
            <p className="mx-auto mt-2 max-w-2xl text-white/80">
              You are welcome to worship with us, join a small group, or serve
              with one of our ministries.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <CTA href="/events">See Events</CTA>
              <CTA href="/contact" variant="outline">
                Contact Us
              </CTA>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur-sm"
      style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06) inset" }}
    >
      {children}
    </span>
  );
}

function CTA({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-2 text-sm font-medium transition";
  if (variant === "outline")
    return (
      <Link
        href={href}
        className={`${base} border border-white/20 bg-transparent text-white hover:bg-white/10`}
      >
        {children}
      </Link>
    );
  return (
    <Link
      href={href}
      className={`${base} text-[#0B1A33] hover:brightness-110` + ""}
      style={{ background: ACCENT }}
    >
      {children}
    </Link>
  );
}

function InfoCard({
  title,
  subtitle,
  description,
}: {
  title: string;
  subtitle: string;
  description: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10"
    >
      <p className="text-xs uppercase tracking-wider text-white/60">
        {subtitle}
      </p>
      <h3 className="mt-1 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-white/80">{description}</p>
    </motion.article>
  );
}

function BackgroundOrbs() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute -left-16 -top-16 h-72 w-72 rounded-full blur-3xl opacity-20"
        style={{ background: ACCENT }}
      />
      <div className="absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
    </div>
  );
}

const VALUES = [
  {
    title: "Biblical Truth",
    body: "We anchor our faith and practice in the Scriptures as the living Word of God.",
  },
  {
    title: "Prayer",
    body: "We seek God’s presence and power through personal and corporate prayer.",
  },
  {
    title: "Worship",
    body: "We honor God with reverence, joy, and excellence in all we do.",
  },
  {
    title: "Community",
    body: "We belong together — caring, encouraging, and growing as a family of believers.",
  },
  {
    title: "Service",
    body: "We follow Jesus by serving our neighbors with compassion and humility.",
  },
  {
    title: "Mission",
    body: "We share the hope of the gospel locally and globally until His return.",
  },
];

const TIMELINE = [
  {
    year: "19xx",
    title: "Humble Beginnings",
    text: "A small group of believers began meeting in homes to worship and study together.",
  },
  {
    year: "2005",
    title: "A Place to Call Home",
    text: "By God’s grace the congregation acquired land and built our first sanctuary.",
  },
  {
    year: "2016",
    title: "Growing in Ministry",
    text: "We launched youth, music, family, and community service ministries.",
  },
  {
    year: "Today",
    title: "Serving Our City",
    text: "We continue to disciple, equip, and reach our community with Christ’s love.",
  },
];

const LEADERS = [
  {
    name: "Pr. John Doe",
    role: "Senior Pastor",
    bio: "Passionate about discipleship, family ministry, and preaching the Word.",
    photo:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Jane Smith",
    role: "Head Elder",
    bio: "Leads small groups and spiritual nurture with a heart for prayer.",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Daniel Kim",
    role: "Youth Leader",
    bio: "Equipping the next generation to know Jesus and serve boldly.",
    photo:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop",
  },
];

const MINISTRIES = [
  {
    title: "Children & Adventurers",
    body: "Building a strong faith foundation through Bible stories, crafts, and fun.",
  },
  {
    title: "Pathfinders",
    body: "Training young people for service, leadership, and outdoor skills.",
  },
  {
    title: "Music Ministry",
    body: "Leading worship in hymns and contemporary praise to glorify God.",
  },
  {
    title: "Family Life",
    body: "Supporting healthy homes through seminars, counseling, and fellowship.",
  },
  {
    title: "Community Service",
    body: "Food drives, visitations, and practical acts of kindness in our neighborhood.",
  },
  {
    title: "Media & Tech",
    body: "Spreading the message through livestreams, audio, and digital outreach.",
  },
];
