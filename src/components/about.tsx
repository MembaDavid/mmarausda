"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { BookOpen, HeartHandshake, Music, Users } from "lucide-react";

const values = [
  {
    title: "Biblical Faith",
    body: "Scripture shapes worship, teaching, service, and everyday decisions.",
  },
  {
    title: "Campus Fellowship",
    body: "Students, staff, alumni, and guests find a shared spiritual home.",
  },
  {
    title: "Prayerful Care",
    body: "Prayer requests, visitations, and welfare work are handled with dignity.",
  },
  {
    title: "Mission",
    body: "We serve Narok and the university community with the hope of Christ.",
  },
];

const ministries = [
  ["Worship & Music", "Choir, praise teams, Sabbath programming, and vespers."],
  ["Youth & AMO/ALO", "Campus discipleship, mentorship, and fellowship groups."],
  ["Welfare & Visitations", "Pastoral care, practical support, and member follow-up."],
  ["Media & Communications", "Sermons, announcements, livestream support, and archives."],
  ["Bible Study", "Weekly studies, Sabbath School, and small group resources."],
  ["Treasury", "Offerings, funds, pledges, and stewardship reporting."],
];

const leaders = [
  ["Pastoral Team", "Spiritual nurture, preaching, visitation, and counseling."],
  ["Elders Council", "Worship coordination, doctrine, and member care."],
  ["Ministry Leads", "Operational planning for outreach, music, youth, and welfare."],
];

export default function AboutPage() {
  return (
    <main className="church-page pt-20">
      <section className="border-b border-brand-line bg-brand-cream">
        <div className="church-container grid gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="church-kicker">About MMU SDA</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl">
              A church family for worship, learning, and service.
            </h1>
            <p className="church-copy mt-5 max-w-2xl">
              Maasai Mara University SDA Church exists to proclaim Christ,
              nurture believers, and serve the campus and Narok community with
              humility, excellence, and practical love.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/events" className="church-button">
                Worship With Us
              </Link>
              <Link href="/contact" className="church-button-secondary">
                Reach The Office
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="church-card p-6"
          >
            <div className="flex items-center gap-4 border-b border-brand-line pb-5">
              <div className="grid h-16 w-16 place-items-center rounded-lg bg-white">
                <Image src="/sda_logo.svg" alt="SDA logo" width={52} height={52} />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-ink">
                  Seventh-day Adventist Church
                </p>
                <p className="text-sm text-brand-muted">
                  Maasai Mara University, Narok
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Fact icon={<BookOpen className="h-5 w-5" />} title="Word" />
              <Fact icon={<Music className="h-5 w-5" />} title="Worship" />
              <Fact icon={<HeartHandshake className="h-5 w-5" />} title="Care" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="church-section">
        <div className="church-container grid gap-6 md:grid-cols-2">
          <InfoBlock
            label="Mission"
            title="Proclaim, nurture, and serve."
            body="To share the everlasting gospel of Jesus Christ, disciple believers, and respond to practical needs across the university and surrounding community."
          />
          <InfoBlock
            label="Vision"
            title="A Christ-centered campus church."
            body="A welcoming fellowship where every person belongs, grows, and serves while carrying the hope of Christ into classrooms, homes, and the wider community."
          />
        </div>
      </section>

      <section className="border-y border-brand-line bg-brand-mist">
        <div className="church-container church-section">
          <div className="max-w-2xl">
            <p className="church-kicker">Values</p>
            <h2 className="church-heading mt-3">What shapes our work</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <article key={value.title} className="church-card-plain p-5">
                <h3 className="font-semibold text-brand-ink">{value.title}</h3>
                <p className="mt-2 text-sm leading-6 text-brand-muted">
                  {value.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="church-section">
        <div className="church-container grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="church-kicker">Ministries</p>
            <h2 className="church-heading mt-3">Organized for repeated care</h2>
            <p className="church-copy mt-4">
              The database design supports ministries, leaders, members, events,
              Bible study resources, visitations, and giving records so each
              department can work from the same source of truth.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {ministries.map(([title, body]) => (
              <article key={title} className="church-card-plain p-5">
                <h3 className="font-semibold text-brand-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-brand-muted">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-brand-line bg-brand-cream">
        <div className="church-container church-section">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="church-kicker">Leadership</p>
              <h2 className="church-heading mt-3">A shared ministry table</h2>
              <div className="mt-6 grid gap-4">
                {leaders.map(([title, body]) => (
                  <article key={title} className="flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-forest text-brand-cream">
                      <Users className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-brand-ink">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-brand-muted">
                        {body}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="church-card p-6">
              <p className="church-kicker">Our Story</p>
              <ol className="mt-5 grid gap-5">
                {[
                  ["Foundation", "Students and believers gather for worship and Bible study."],
                  ["Growth", "Ministries form around music, welfare, outreach, and youth work."],
                  ["Today", "Digital records now support pastoral care and transparent planning."],
                ].map(([title, body], index) => (
                  <li key={title} className="flex gap-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-gold text-sm font-semibold text-brand-ink">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-brand-ink">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-brand-muted">
                        {body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Fact({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="rounded-lg border border-brand-line bg-brand-mist p-4 text-center">
      <div className="mx-auto grid h-9 w-9 place-items-center rounded-lg bg-brand-forest text-brand-cream">
        {icon}
      </div>
      <p className="mt-2 text-sm font-semibold text-brand-ink">{title}</p>
    </div>
  );
}

function InfoBlock({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <article className="church-card p-6">
      <p className="church-kicker">{label}</p>
      <h2 className="mt-2 text-2xl font-semibold text-brand-ink">{title}</h2>
      <p className="church-copy mt-3">{body}</p>
    </article>
  );
}
