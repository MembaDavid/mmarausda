"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, Search, UserRound, Video } from "lucide-react";

export type SermonItem = {
  id: string;
  title: string;
  preacher?: string | null;
  deliveredAt: string;
  description?: string | null;
  mediaUrl?: string | null;
  type?: string | null;
};

export default function SermonsPage({
  initialSermons = [],
}: {
  initialSermons?: SermonItem[];
}) {
  const [query, setQuery] = useState("");
  const [preacher, setPreacher] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const sermons = useMemo(
    () =>
      initialSermons
        .slice()
        .sort(
          (a, b) =>
            new Date(b.deliveredAt).getTime() - new Date(a.deliveredAt).getTime()
        ),
    [initialSermons]
  );

  const preachers = useMemo(() => {
    const names = sermons
      .map((sermon) => sermon.preacher)
      .filter((name): name is string => Boolean(name));
    return ["All", ...Array.from(new Set(names))];
  }, [sermons]);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return sermons.filter((sermon) => {
      const deliveredAt = new Date(sermon.deliveredAt).getTime();
      const matchesSearch =
        !search ||
        sermon.title.toLowerCase().includes(search) ||
        (sermon.description ?? "").toLowerCase().includes(search) ||
        (sermon.preacher ?? "").toLowerCase().includes(search);
      const matchesPreacher = preacher === "All" || sermon.preacher === preacher;
      const matchesFrom = !fromDate || deliveredAt >= new Date(fromDate).getTime();
      const matchesTo = !toDate || deliveredAt <= new Date(toDate).getTime();

      return matchesSearch && matchesPreacher && matchesFrom && matchesTo;
    });
  }, [fromDate, preacher, query, sermons, toDate]);

  return (
    <main className="church-page pt-20">
      <section className="border-b border-brand-line bg-brand-cream">
        <div className="church-container py-14">
          <p className="church-kicker">Sermons</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl">
            Messages from worship
          </h1>
          <p className="church-copy mt-3 max-w-2xl">
            Search preaching, media, and devotional messages recorded by the
            church media team.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-[1.2fr_0.8fr_0.55fr_0.55fr]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title, preacher, or description"
                className="church-input pl-10"
              />
            </label>
            <select
              value={preacher}
              onChange={(event) => setPreacher(event.target.value)}
              className="church-input"
              aria-label="Filter by preacher"
            >
              {preachers.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
            <input
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              type="date"
              className="church-input"
              aria-label="From date"
            />
            <input
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              type="date"
              className="church-input"
              aria-label="To date"
            />
          </div>
        </div>
      </section>

      <section className="church-section">
        <div className="church-container">
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-sm text-brand-muted">
              Showing <span className="font-semibold text-brand-ink">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "sermon" : "sermons"}
            </p>
            <button
              className="church-button-secondary"
              onClick={() => {
                setQuery("");
                setPreacher("All");
                setFromDate("");
                setToDate("");
              }}
            >
              Reset
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="church-card mx-auto max-w-2xl p-8 text-center">
              <Video className="mx-auto h-10 w-10 text-brand-gold-dark" />
              <h2 className="mt-4 text-2xl font-semibold text-brand-ink">
                No sermons found
              </h2>
              <p className="church-copy mt-2">
                Add sermons through the API or admin workflow and they will
                appear here automatically.
              </p>
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((sermon) => (
                <li key={sermon.id}>
                  <article className="church-card flex h-full flex-col p-5">
                    <span className="church-badge w-fit">
                      {labelType(sermon.type ?? "SERMON")}
                    </span>
                    <h2 className="mt-4 text-xl font-semibold leading-snug text-brand-ink">
                      {sermon.title}
                    </h2>
                    <div className="mt-3 grid gap-2 text-sm text-brand-muted">
                      <span className="flex gap-2">
                        <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-dark" />
                        {sermon.preacher || "Church speaker"}
                      </span>
                      <span className="flex gap-2">
                        <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-dark" />
                        {formatDate(sermon.deliveredAt)}
                      </span>
                    </div>
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-brand-muted">
                      {sermon.description || "Sermon notes will be added soon."}
                    </p>
                    <div className="mt-auto pt-5">
                      {sermon.mediaUrl ? (
                        <Link
                          href={sermon.mediaUrl}
                          target="_blank"
                          className="church-button"
                        >
                          <Video className="h-4 w-4" />
                          Open Media
                        </Link>
                      ) : (
                        <span className="text-sm text-brand-muted">
                          Media pending
                        </span>
                      )}
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function labelType(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
