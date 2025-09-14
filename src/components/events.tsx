"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiMapPin,
  FiClock,
  FiSearch,
  FiFilter,
  FiChevronRight,
  FiChevronLeft,
  FiTag,
  FiUsers,
  FiDownload,
  FiBell,
} from "react-icons/fi";

// --- Types ---
export type EventItem = {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO
  end?: string; // ISO
  location?: string;
  cover?: string; // image url
  category?:
    | "Worship"
    | "Youth"
    | "Choir"
    | "Prayer"
    | "Outreach"
    | "Training"
    | "Fundraising"
    | "Other";
  rsvpCount?: number;
};

// --- Mock Data (replace with real fetch from /api/events) ---
const mockEvents: EventItem[] = [
  {
    id: "1",
    title: "Sabbath Divine Service",
    description:
      "Join us for a spirit-filled worship service with choir ministration and sermon.",
    start: new Date().toISOString(),
    end: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    location: "Main Sanctuary, Campus Chapel",
    cover:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop",
    category: "Worship",
    rsvpCount: 132,
  },
  {
    id: "2",
    title: "Youth AY Program – Talent Evening",
    description:
      "Showcase your gifts: music, poetry, spoken word. Invite a friend!",
    start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(
      Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
    ).toISOString(),
    location: "Student Centre Hall",
    cover:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1400&auto=format&fit=crop",
    category: "Youth",
    rsvpCount: 74,
  },
  {
    id: "3",
    title: "Midweek Prayer – Revival Night",
    description: "An hour of prayer and testimonies. Come expectant.",
    start: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Room B12, Humanities Block",
    cover:
      "https://images.unsplash.com/photo-1519681398087-2e3f71d67e0e?q=80&w=1400&auto=format&fit=crop",
    category: "Prayer",
    rsvpCount: 51,
  },
  {
    id: "4",
    title: "Community Outreach – Narok Town",
    description: "Door-to-door ministry and food drive with the Welfare team.",
    start: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(
      Date.now() + 6 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
    ).toISOString(),
    location: "Welfare Office → Narok Town",
    cover:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1400&auto=format&fit=crop",
    category: "Outreach",
    rsvpCount: 89,
  },
  {
    id: "5",
    title: "Choir Rehearsal – Special Anthem",
    description: "Preparations for next Sabbath's anthem and hymn medley.",
    start: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
    ).toISOString(),
    location: "Music Room 2",
    cover:
      "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1400&auto=format&fit=crop",
    category: "Choir",
    rsvpCount: 37,
  },
];

// --- Helpers ---
function formatRange(startISO?: string, endISO?: string) {
  if (!startISO) return "TBA";
  const start = new Date(startISO);
  const end = endISO ? new Date(endISO) : undefined;
  const fmtDate = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(start);
  const fmtTime = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(start);
  const fmtEnd = end
    ? new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }).format(end)
    : undefined;
  return fmtEnd
    ? `${fmtDate} · ${fmtTime} – ${fmtEnd}`
    : `${fmtDate} · ${fmtTime}`;
}

function toICS(e: EventItem) {
  // Minimal .ics content
  const dtStart =
    new Date(e.start).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const dtEnd = e.end
    ? new Date(e.end).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    : new Date(new Date(e.start).getTime() + 60 * 60 * 1000)
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z";
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Glorious Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.id}@glorious-events`,
    `DTSTAMP:${dtStart}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${(e.title || "Event").replace(/\n/g, " ")}`,
    `DESCRIPTION:${(e.description || "").replace(/\n/g, " ")}`,
    e.location ? `LOCATION:${e.location.replace(/\n/g, " ")}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  const blob = new Blob([body], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${
    e.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "event"
  }.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

const categories: Array<EventItem["category"] | "All"> = [
  "All",
  "Worship",
  "Youth",
  "Choir",
  "Prayer",
  "Outreach",
  "Training",
  "Fundraising",
  "Other",
];

const heroGradient =
  "bg-[radial-gradient(1200px_800px_at_50%_-10%,rgba(59,130,246,0.25),transparent_70%),radial-gradient(800px_400px_at_80%_10%,rgba(236,72,153,0.25),transparent_70%),radial-gradient(600px_400px_at_20%_0%,rgba(16,185,129,0.25),transparent_70%)]";

const spring = { type: "spring", stiffness: 120, damping: 14 } as const;

export default function EventsPage({
  initialEvents,
}: {
  initialEvents?: EventItem[];
}) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] =
    useState<(typeof categories)[number]>("All");
  const [monthOffset, setMonthOffset] = useState(0);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  // Replace with real data (SSR fetch) if provided
  const events = (initialEvents?.length ? initialEvents : mockEvents)
    .slice()
    .sort((a, b) => +new Date(a.start) - +new Date(b.start));

  const now = new Date();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const isPast = new Date(e.start) < now;
      if (tab === "upcoming" && isPast) return false;
      if (tab === "past" && !isPast) return false;
      const catOk = activeCat === "All" || e.category === activeCat;
      const qOk =
        !q ||
        e.title.toLowerCase().includes(q) ||
        (e.description || "").toLowerCase().includes(q) ||
        (e.location || "").toLowerCase().includes(q);
      // Month filter
      const m = new Date();
      m.setMonth(m.getMonth() + monthOffset, 1);
      m.setHours(0, 0, 0, 0);
      const mEnd = new Date(m);
      mEnd.setMonth(m.getMonth() + 1);
      const d = new Date(e.start);
      const inMonth = d >= m && d < mEnd;
      return catOk && qOk && inMonth;
    });
  }, [events, query, activeCat, tab, monthOffset, now]);

  const monthLabel = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthOffset);
    return new Intl.DateTimeFormat(undefined, {
      month: "long",
      year: "numeric",
    }).format(d);
  }, [monthOffset]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className={`relative overflow-hidden ${heroGradient}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-7xl px-4 pt-20 pb-12 sm:pt-28 sm:pb-16"
        >
          <motion.h1
            layout
            transition={spring}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-fuchsia-400 to-emerald-300 drop-shadow"
          >
            Glorious Events
          </motion.h1>
          <p className="mt-4 max-w-2xl text-slate-300 leading-relaxed">
            Discover worship services, youth programs, outreach, and more.
            Search, filter, and add to your calendar in one click.
          </p>

          {/* Controls */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {/* Search */}
            <label className="relative flex items-center gap-2 rounded-2xl bg-white/5 ring-1 ring-white/10 px-4 py-3">
              <FiSearch className="shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events, places, people…"
                className="w-full bg-transparent outline-none placeholder:text-slate-400"
              />
            </label>

            {/* Categories */}
            <div className="flex flex-nowrap gap-2 overflow-auto sm:overflow-visible">
              {categories.map((c) => (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  key={c}
                  onClick={() => setActiveCat(c)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm whitespace-nowrap border ${
                    activeCat === c
                      ? "bg-emerald-500/15 border-emerald-400/40"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  } transition`}
                  aria-pressed={activeCat === c}
                >
                  <FiTag /> {c}
                </motion.button>
              ))}
            </div>

            {/* Tabs & Month Switcher */}
            <div className="flex items-stretch gap-2 justify-end">
              <div className="inline-flex rounded-xl overflow-hidden border border-white/10">
                <button
                  className={`px-4 py-2 text-sm ${
                    tab === "upcoming" ? "bg-white/10" : "bg-transparent"
                  }`}
                  onClick={() => setTab("upcoming")}
                >
                  Upcoming
                </button>
                <button
                  className={`px-4 py-2 text-sm ${
                    tab === "past" ? "bg-white/10" : "bg-transparent"
                  }`}
                  onClick={() => setTab("past")}
                >
                  Past
                </button>
              </div>
              <div className="ml-auto flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2">
                <button
                  className="p-2 hover:bg-white/10 rounded-lg"
                  onClick={() => setMonthOffset((m) => m - 1)}
                  aria-label="Previous month"
                >
                  <FiChevronLeft />
                </button>
                <div className="px-2 text-sm flex items-center gap-2">
                  <FiCalendar /> {monthLabel}
                </div>
                <button
                  className="p-2 hover:bg-white/10 rounded-lg"
                  onClick={() => setMonthOffset((m) => m + 1)}
                  aria-label="Next month"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Decorative orbs */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
          animate={{ x: [0, -10, 10, 0], y: [0, 10, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 left-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl"
          animate={{ x: [0, 12, -12, 0], y: [0, -8, 8, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <AnimatePresence initial={false}>
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-12 text-center"
            >
              <FiBell className="text-3xl mb-3" />
              <h3 className="text-xl font-semibold">
                No events match your filters
              </h3>
              <p className="mt-2 max-w-md text-slate-400">
                Try removing some filters, or jump to another month.
              </p>
            </motion.div>
          ) : (
            <motion.ul
              key="list"
              layout
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((e, i) => (
                <motion.li
                  layout
                  key={e.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  <EventCard e={e} />
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {/* Footer note */}
        <div className="mt-10 flex items-center justify-center text-slate-400 text-sm">
          Want your ministry's event listed? Email the Church Office.
        </div>
      </section>
    </div>
  );
}

function EventCard({ e }: { e: EventItem }) {
  return (
    <motion.article
      whileHover={{ translateY: -4 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={
            e.cover ||
            "https://images.unsplash.com/photo-1520975922373-3b4dfe979e76?w=1200"
          }
          alt={e.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-slate-950/60 px-3 py-1 text-xs font-medium ring-1 ring-white/10">
          <FiTag /> {e.category || "Event"}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold leading-snug line-clamp-2">
          {e.title}
        </h3>
        <p className="mt-2 text-sm text-slate-300 line-clamp-2">
          {e.description}
        </p>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <FiCalendar className="shrink-0" /> {formatRange(e.start, e.end)}
          </div>
          {e.location && (
            <div className="flex items-center gap-2 text-slate-300">
              <FiMapPin className="shrink-0" /> {e.location}
            </div>
          )}
          <div className="flex items-center gap-2 text-slate-300">
            <FiUsers className="shrink-0" /> {e.rsvpCount || 0} going
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={() => toICS(e)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            <FiDownload /> Add to calendar
          </button>
          <a
            href={`#/events/${e.id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-emerald-500/15 px-3 py-2 text-sm text-emerald-300 hover:bg-emerald-500/20"
          >
            <FiClock /> Details
          </a>
        </div>
      </div>
    </motion.article>
  );
}

/*
--- Server-side data (optional) ---
// If you prefer SSR in Next.js App Router, create app/events/page.tsx as a Server Component:

// app/events/page.tsx
// import EventsClient from "./EventsClient";
//
// export default async function Page() {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/events`, { cache: "no-store" });
//   const events: EventItem[] = await res.json();
//   return <EventsClient initialEvents={events} />;
// }
//
// Then put the above component into app/events/EventsClient.tsx with "use client" and export default.

--- API shape (example) ---
// GET /api/events -> EventItem[]
// GET /api/events/[id] -> EventItem
// POST /api/events -> create (admin only)
// PATCH /api/events/[id] -> update (admin only)

--- Prisma (example fields) ---
// model Event {
//   id          String   @id @default(cuid())
//   title       String
//   description String?
//   start       DateTime
//   end         DateTime?
//   location    String?
//   cover       String?
//   category    String?
//   rsvpCount   Int      @default(0)
//   createdAt   DateTime @default(now())
//   updatedAt   DateTime @updatedAt
// }
*/
