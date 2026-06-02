"use client";

import Link from "next/link";
import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, CalendarDays, Megaphone, PlayCircle } from "lucide-react";

export type LandingEvent = {
  id: string;
  title: string;
  start: string;
  end?: string | null;
  location?: string | null;
  category?: string | null;
};

export type LandingSermon = {
  id: string;
  title: string;
  preacher?: string | null;
  deliveredAt: string;
  mediaUrl?: string | null;
};

export type LandingAnnouncement = {
  id: string;
  title: string;
  body: string;
};

export default function Hero({
  nextEvent,
  latestSermon,
  announcements = [],
}: {
  nextEvent?: LandingEvent | null;
  latestSermon?: LandingSermon | null;
  announcements?: LandingAnnouncement[];
}) {
  const videoRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: videoRef,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.75]);

  return (
    <main className="church-page">
      <section
        ref={videoRef}
        className="relative min-h-[92svh] overflow-hidden pt-24 text-brand-cream"
      >
        <motion.video
          style={{ scale }}
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/hymn.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <motion.div
          style={{ opacity }}
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,52,41,0.88),rgba(18,48,87,0.62),rgba(24,37,31,0.28))]"
        />

        <div className="church-container relative z-10 flex min-h-[calc(92svh-6rem)] items-center">
          <div className="max-w-3xl py-16">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="church-kicker text-brand-gold"
            >
              Seventh-day Adventist Church
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.58 }}
              className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl"
            >
              Maasai Mara University SDA Church
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.58 }}
              className="mt-5 max-w-2xl text-lg leading-8 text-brand-cream/88"
            >
              A Christ-centered campus fellowship for worship, discipleship,
              service, and shared hope in Narok.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.58 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link href="/events" className="church-button-accent">
                View Events
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/resources/sermons" className="church-button-secondary">
                Sermons
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-brand-line bg-brand-cream">
        <div className="church-container grid gap-4 py-6 md:grid-cols-3">
          <Highlight
            icon={<CalendarDays className="h-5 w-5" />}
            label="Next Gathering"
            title={nextEvent?.title ?? "Sabbath Worship"}
            body={
              nextEvent
                ? formatEvent(nextEvent)
                : "Sabbath School 9:00 AM, Divine Service 11:00 AM"
            }
            href="/events"
          />
          <Highlight
            icon={<PlayCircle className="h-5 w-5" />}
            label="Latest Sermon"
            title={latestSermon?.title ?? "Sermons Archive"}
            body={
              latestSermon
                ? `${latestSermon.preacher ?? "Church speaker"} • ${formatDate(
                    latestSermon.deliveredAt
                  )}`
                : "Messages from recent worship services"
            }
            href={latestSermon?.mediaUrl || "/resources/sermons"}
          />
          <Highlight
            icon={<Megaphone className="h-5 w-5" />}
            label="Notice Board"
            title={announcements[0]?.title ?? "Church Announcements"}
            body={
              announcements[0]?.body ??
              "Updates from ministries, welfare, worship, and campus fellowship."
            }
            href="/resources"
          />
        </div>
      </section>

      <section className="church-section">
        <div className="church-container grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="church-kicker">Our Life Together</p>
            <h2 className="church-heading mt-3">
              Faith that has room for study, service, and belonging.
            </h2>
            <p className="church-copy mt-4">
              MMU SDA Church gathers students, staff, alumni, and guests around
              Scripture, prayer, music, outreach, and pastoral care. The site now
              draws from church records so ministries, events, sermons, and
              member care can grow from one database.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/about" className="church-button">
                About The Church
              </Link>
              <Link href="/contact" className="church-button-secondary">
                Contact Leaders
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Worship", "Sabbath services, music ministry, and vespers."],
              ["Discipleship", "Bible study, small groups, and prayer teams."],
              ["Service", "Welfare, visitations, outreach, and campus care."],
              ["Stewardship", "Giving, ministry planning, and transparent records."],
            ].map(([title, body]) => (
              <article key={title} className="church-card-plain p-5">
                <h3 className="font-semibold text-brand-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-brand-muted">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Highlight({
  icon,
  label,
  title,
  body,
  href,
}: {
  icon: ReactNode;
  label: string;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="grid gap-2 rounded-lg border border-brand-line bg-white/70 p-4 transition hover:border-brand-gold hover:bg-white"
    >
      <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold-dark">
        {icon}
        {label}
      </span>
      <span className="font-semibold text-brand-ink">{title}</span>
      <span className="line-clamp-2 text-sm leading-6 text-brand-muted">
        {body}
      </span>
    </Link>
  );
}

function formatEvent(event: LandingEvent) {
  const date = formatDate(event.start);
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(event.start));
  return [date, time, event.location].filter(Boolean).join(" • ");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}
