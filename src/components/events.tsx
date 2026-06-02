"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  MapPin,
  Search,
  Tag,
  Users,
} from "lucide-react";

export type EventItem = {
  id: string;
  title: string;
  description?: string | null;
  start: string;
  end?: string | null;
  location?: string | null;
  coverUrl?: string | null;
  category?: string | null;
  rsvpCount?: number;
};

const fallbackCover =
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop";

function formatRange(startISO?: string, endISO?: string | null) {
  if (!startISO) return "TBA";
  const start = new Date(startISO);
  const end = endISO ? new Date(endISO) : undefined;
  const date = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(start);
  const startTime = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(start);
  const endTime = end
    ? new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }).format(end)
    : undefined;

  return endTime ? `${date} • ${startTime} - ${endTime}` : `${date} • ${startTime}`;
}

function toICS(event: EventItem) {
  const start =
    new Date(event.start).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const end =
    (event.end
      ? new Date(event.end)
      : new Date(new Date(event.start).getTime() + 60 * 60 * 1000)
    )
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0] + "Z";
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MMU SDA Church//Events//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@mmu-sda`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${(event.title || "Church Event").replace(/\n/g, " ")}`,
    `DESCRIPTION:${(event.description || "").replace(/\n/g, " ")}`,
    event.location ? `LOCATION:${event.location.replace(/\n/g, " ")}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  const blob = new Blob([body], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function EventsPage({
  initialEvents = [],
}: {
  initialEvents?: EventItem[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [monthOffset, setMonthOffset] = useState(0);

  const events = useMemo(
    () =>
      initialEvents
        .slice()
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()),
    [initialEvents]
  );

  const categories = useMemo(() => {
    const found = Array.from(
      new Set(
        events
          .map((event) => event.category)
          .filter((category): category is string => Boolean(category))
      )
    );
    return ["All", ...found];
  }, [events]);

  const monthLabel = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + monthOffset);
    return new Intl.DateTimeFormat(undefined, {
      month: "long",
      year: "numeric",
    }).format(date);
  }, [monthOffset]);

  const filtered = useMemo(() => {
    const now = Date.now();
    const monthStart = new Date();
    monthStart.setMonth(monthStart.getMonth() + monthOffset, 1);
    monthStart.setHours(0, 0, 0, 0);
    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthStart.getMonth() + 1);
    const search = query.trim().toLowerCase();

    return events.filter((event) => {
      const startsAt = new Date(event.start).getTime();
      const isPast = startsAt < now;
      const eventDate = new Date(event.start);
      const matchesTab = tab === "past" ? isPast : !isPast;
      const matchesMonth = eventDate >= monthStart && eventDate < monthEnd;
      const matchesCategory =
        activeCategory === "All" || event.category === activeCategory;
      const matchesSearch =
        !search ||
        event.title.toLowerCase().includes(search) ||
        (event.description ?? "").toLowerCase().includes(search) ||
        (event.location ?? "").toLowerCase().includes(search);

      return matchesTab && matchesMonth && matchesCategory && matchesSearch;
    });
  }, [activeCategory, events, monthOffset, query, tab]);

  return (
    <main className="church-page pt-20">
      <section className="border-b border-brand-line bg-brand-cream">
        <div className="church-container py-14">
          <p className="church-kicker">Church Calendar</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl">
                Events and services
              </h1>
              <p className="church-copy mt-3 max-w-2xl">
                Worship services, Bible studies, ministry programs, outreach,
                and campus fellowship drawn from the church database.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-brand-line bg-white/75 px-2 py-2">
              <button
                className="grid h-9 w-9 place-items-center rounded-md text-brand-muted hover:bg-brand-mist hover:text-brand-ink"
                onClick={() => setMonthOffset((value) => value - 1)}
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-36 text-center text-sm font-semibold text-brand-ink">
                {monthLabel}
              </span>
              <button
                className="grid h-9 w-9 place-items-center rounded-md text-brand-muted hover:bg-brand-mist hover:text-brand-ink"
                onClick={() => setMonthOffset((value) => value + 1)}
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-3 lg:grid-cols-[1fr_auto]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="church-input pl-10"
                placeholder="Search event, place, or description"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              {(["upcoming", "past"] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => setTab(value)}
                  className={
                    tab === value ? "church-button" : "church-button-secondary"
                  }
                >
                  {value === "upcoming" ? "Upcoming" : "Past"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={[
                  "inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition",
                  activeCategory === category
                    ? "border-brand-gold bg-brand-gold text-brand-ink"
                    : "border-brand-line bg-white/70 text-brand-muted hover:bg-brand-mist hover:text-brand-ink",
                ].join(" ")}
              >
                <Tag className="h-4 w-4" />
                {labelCategory(category)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="church-section">
        <div className="church-container">
          {filtered.length === 0 ? (
            <div className="church-card mx-auto max-w-2xl p-8 text-center">
              <CalendarDays className="mx-auto h-10 w-10 text-brand-gold-dark" />
              <h2 className="mt-4 text-2xl font-semibold text-brand-ink">
                No events found
              </h2>
              <p className="church-copy mt-2">
                Try a different month, category, or search term. Admins can add
                events from the dashboard once the database is seeded.
              </p>
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((event) => (
                <li key={event.id}>
                  <EventCard event={event} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="church-card h-full overflow-hidden">
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={event.coverUrl || fallbackCover}
          alt={event.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute left-3 top-3 rounded-lg bg-brand-forest/88 px-2.5 py-1 text-xs font-semibold text-brand-cream">
          {labelCategory(event.category ?? "Event")}
        </div>
      </div>
      <div className="flex h-[calc(100%-11rem)] flex-col p-5">
        <h2 className="text-lg font-semibold leading-snug text-brand-ink">
          {event.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-brand-muted">
          {event.description || "More details will be shared by the ministry team."}
        </p>
        <div className="mt-4 grid gap-2 text-sm text-brand-muted">
          <span className="flex gap-2">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-dark" />
            {formatRange(event.start, event.end)}
          </span>
          {event.location ? (
            <span className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-dark" />
              {event.location}
            </span>
          ) : null}
          <span className="flex gap-2">
            <Users className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-dark" />
            {event.rsvpCount ?? 0} registered
          </span>
        </div>
        <div className="mt-auto pt-5">
          <button onClick={() => toICS(event)} className="church-button-secondary">
            <Download className="h-4 w-4" />
            Calendar
          </button>
        </div>
      </div>
    </article>
  );
}

function labelCategory(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
