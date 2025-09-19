"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Sermon = {
  id: string;
  title: string;
  preacher: string;
  date: string; // ISO date string
  description: string;
  videoUrl?: string;
};

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [query, setQuery] = useState("");
  const [preacher, setPreacher] = useState("All");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  useEffect(() => {
    // TODO: replace with fetch("/api/sermons").then(res => res.json())
    setSermons([
      {
        id: "1",
        title: "Walking by Faith",
        preacher: "Pastor John Doe",
        date: "2025-09-01",
        description: "A message on trusting God through uncertainty.",
        videoUrl: "https://www.youtube.com/watch?v=abcd1234",
      },
      {
        id: "2",
        title: "The Power of Prayer",
        preacher: "Elder Jane Smith",
        date: "2025-08-25",
        description: "Discover how prayer strengthens our walk with God.",
        videoUrl: "https://www.youtube.com/watch?v=wxyz5678",
      },
      {
        id: "3",
        title: "Sabbath Rest and Renewal",
        preacher: "Pastor John Doe",
        date: "2025-06-15",
        description: "Finding renewal in God's appointed rest.",
      },
      {
        id: "4",
        title: "Stewards of Grace",
        preacher: "Elder Mary Wanjiru",
        date: "2025-05-05",
        description: "Living generously as recipients of grace.",
      },
    ]);
  }, []);

  const preachers = useMemo(() => {
    const set = new Set(sermons.map((s) => s.preacher));
    return ["All", ...Array.from(set)];
  }, [sermons]);

  const filtered = useMemo(() => {
    return sermons.filter((s) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.preacher.toLowerCase().includes(q);

      const matchesPreacher = preacher === "All" || s.preacher === preacher;

      const d = new Date(s.date).getTime();
      const afterFrom = !fromDate || d >= new Date(fromDate).getTime();
      const beforeTo = !toDate || d <= new Date(toDate).getTime();

      return matchesQuery && matchesPreacher && afterFrom && beforeTo;
    });
  }, [sermons, query, preacher, fromDate, toDate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 py-12 px-6 lg:px-16">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="text-4xl font-extrabold text-center text-gold-400 mb-8"
      >
        Sermons
      </motion.h1>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45 }}
        className="mb-10 rounded-2xl border border-gold-400/60 bg-blue-950/70 p-5 shadow-lg"
      >
        <div className="grid gap-4 md:grid-cols-4">
          {/* Search */}
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gold-300">Search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Title, description, preacher…"
              className="rounded-lg bg-blue-900/60 text-blue-50 placeholder-blue-200/70 border border-blue-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </label>

          {/* Preacher */}
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gold-300">Preacher</span>
            <select
              value={preacher}
              onChange={(e) => setPreacher(e.target.value)}
              className="rounded-lg bg-blue-900/60 text-blue-50 border border-blue-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              {preachers.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>

          {/* From date */}
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gold-300">From</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-lg bg-blue-900/60 text-blue-50 border border-blue-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </label>

          {/* To date */}
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gold-300">To</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-lg bg-blue-900/60 text-blue-50 border border-blue-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </label>
        </div>

        {/* Count / Reset */}
        <div className="mt-4 flex items-center justify-between text-blue-100">
          <span className="text-sm">
            Showing{" "}
            <span className="text-gold-300 font-semibold">
              {filtered.length}
            </span>{" "}
            {filtered.length === 1 ? "sermon" : "sermons"}
          </span>
          <button
            onClick={() => {
              setQuery("");
              setPreacher("All");
              setFromDate("");
              setToDate("");
            }}
            className="text-sm font-medium text-blue-950 bg-gold-400 hover:bg-gold-500 px-3 py-1.5 rounded-lg transition"
          >
            Reset Filters
          </button>
        </div>
      </motion.div>

      {/* Sermons Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((sermon, idx) => (
          <motion.article
            key={sermon.id}
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="bg-blue-950/80 rounded-2xl shadow-xl overflow-hidden border border-gold-400 flex flex-col"
          >
            <div className="p-6 flex-1">
              <h2 className="text-2xl font-semibold text-gold-300 mb-2">
                {sermon.title}
              </h2>
              <p className="text-blue-200 text-sm mb-2">
                {sermon.preacher} • {new Date(sermon.date).toLocaleDateString()}
              </p>
              <p className="text-blue-100 text-sm leading-relaxed">
                {sermon.description}
              </p>
            </div>

            <div className="p-6 border-t border-gold-400/70">
              {sermon.videoUrl ? (
                <Link
                  href={sermon.videoUrl}
                  target="_blank"
                  className="inline-block text-sm font-medium text-blue-950 bg-gold-400 hover:bg-gold-500 px-4 py-2 rounded-lg transition"
                >
                  Watch Sermon
                </Link>
              ) : (
                <span className="text-xs text-blue-200/80">
                  Video not available
                </span>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
