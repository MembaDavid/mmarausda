"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  Users,
  UserPlus,
  UserCheck,
  Download,
  UploadCloud,
  Filter,
  Printer,
  ClipboardList,
  Building,
  Search,
  RefreshCcw,
} from "lucide-react";

/**
 * Church Analytics & Attendance — Single-file React component
 * - Tailwind CSS for styling (navy blue, blue, gold theme)
 * - Recharts for analytics visualizations
 * - Fully client-side with mock data + CSV import
 * - Includes: Filters, KPIs, Charts, Calendar-like heatmap, Attendance table (search/sort/paginate),
 *   quick actions (export/print), and simple record editor (add/update attendance)
 */

// THEME
const COLORS = {
  primary: "#0b1e3a", // navy blue
  secondary: "#1e3a8a", // blue-600
  accent: "#d4af37", // gold
  muted: "#6b7280",
  card: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.12)",
};

// ------- MOCK DATA HELPERS -------
const campuses = ["Central", "East", "West", "North", "Online"] as const;
const ministries = [
  "Main Service",
  "Youth",
  "Children",
  "Choir Rehearsal",
  "Bible Study",
  "Prayer Meeting",
] as const;

function seedRandom(seed = 42) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rand = seedRandom(101);

function genSeries(days = 90) {
  const out: Array<{
    date: string;
    total: number;
    visitors: number;
    members: number;
    campus: (typeof campuses)[number];
    ministry: (typeof ministries)[number];
  }> = [];
  const start = new Date();
  start.setDate(start.getDate() - days + 1);
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const isSunday = d.getDay() === 0;
    const isMidweek = d.getDay() === 3;
    const ministry = isSunday
      ? "Main Service"
      : isMidweek
      ? "Bible Study"
      : (["Prayer Meeting", "Choir Rehearsal"][Math.floor(rand() * 2)] as any);
    const campus = campuses[Math.floor(rand() * campuses.length)];
    const base = isSunday ? 250 : isMidweek ? 120 : 60;
    const fluctuation = Math.round((rand() - 0.5) * (isSunday ? 80 : 30));
    const total = Math.max(10, base + fluctuation);
    const visitors = Math.round(
      total * (isSunday ? 0.12 + rand() * 0.06 : 0.05 + rand() * 0.04)
    );
    const members = total - visitors;
    out.push({
      date: d.toISOString().slice(0, 10),
      total,
      visitors,
      members,
      campus,
      ministry,
    });
  }
  return out;
}

// Calendar heatmap generator (last 6 months)
function genHeatmapData(months = 6) {
  const today = new Date();
  const out: { date: string; count: number }[] = [];
  for (let i = months * 30; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const isSunday = d.getDay() === 0;
    const count = isSunday
      ? Math.floor(150 + rand() * 200)
      : Math.floor(rand() * 80);
    out.push({ date: d.toISOString().slice(0, 10), count });
  }
  return out;
}

// ------- CSV UTIL -------
function parseCSV(text: string) {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((h) => h.trim());
  return lines.map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    const row: Record<string, any> = {};
    headers.forEach((h, i) => (row[h] = cells[i]));
    return row;
  });
}

// ------- MAIN COMPONENT -------
export default function AnalyticsAttendanceDashboard() {
  const [tab, setTab] = useState<"analytics" | "attendance">("analytics");
  const [q, setQ] = useState("");
  const [campus, setCampus] = useState<string>("All");
  const [ministry, setMinistry] = useState<string>("All");
  const [range, setRange] = useState<{ from?: string; to?: string }>({});
  const [records, setRecords] = useState(genSeries(120));
  const [heatmap] = useState(genHeatmapData(6));

  // Derived views
  const filtered = useMemo(() => {
    return records.filter((r) => {
      const inCampus = campus === "All" || r.campus === campus;
      const inMinistry = ministry === "All" || r.ministry === ministry;
      const inFrom = !range.from || r.date >= range.from;
      const inTo = !range.to || r.date <= range.to;
      const text = `${r.date} ${r.campus} ${r.ministry}`.toLowerCase();
      const inQ = !q || text.includes(q.toLowerCase());
      return inCampus && inMinistry && inFrom && inTo && inQ;
    });
  }, [records, campus, ministry, range, q]);

  const kpis = useMemo(() => {
    if (filtered.length === 0)
      return { total: 0, avg: 0, visitors: 0, retention: 0 };
    const total = filtered.reduce((s, r) => s + r.total, 0);
    const visitors = filtered.reduce((s, r) => s + r.visitors, 0);
    const members = filtered.reduce((s, r) => s + r.members, 0);
    const avg = Math.round(total / filtered.length);
    const retention = total > 0 ? Math.round((members / total) * 100) : 0;
    return { total, avg, visitors, retention };
  }, [filtered]);

  const seriesByDate = useMemo(() => {
    return filtered
      .slice()
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .map((r) => ({
        date: r.date.slice(5),
        total: r.total,
        members: r.members,
        visitors: r.visitors,
      }));
  }, [filtered]);

  const byMinistry = useMemo(() => {
    const map = new Map<string, { ministry: string; total: number }>();
    filtered.forEach((r) => {
      const m = map.get(r.ministry) || { ministry: r.ministry, total: 0 };
      m.total += r.total;
      map.set(r.ministry, m);
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [filtered]);

  const byCampus = useMemo(() => {
    const map = new Map<string, { campus: string; total: number }>();
    filtered.forEach((r) => {
      const m = map.get(r.campus) || { campus: r.campus, total: 0 };
      m.total += r.total;
      map.set(r.campus, m);
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [filtered]);

  // Attendance table state
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const tableRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // Actions
  function exportCSV() {
    const headers = [
      "date",
      "campus",
      "ministry",
      "total",
      "members",
      "visitors",
    ];
    const rows = filtered.map((r) =>
      headers.map((h) => (r as any)[h]).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-export-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function printView() {
    window.print();
  }

  function onImportCSV(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const rows = parseCSV(text);
        // Expecting headers: date,campus,ministry,total,visitors,members
        const next = rows
          .map((r) => ({
            date: r.date,
            campus: r.campus,
            ministry: r.ministry,
            total: Number(r.total ?? 0),
            visitors: Number(r.visitors ?? 0),
            members: Number(r.members ?? 0),
          }))
          .filter(
            (r) => r.date && r.campus && r.ministry && !Number.isNaN(r.total)
          );
        setRecords((prev) => [...prev, ...next]);
        alert(`Imported ${next.length} rows`);
      } catch (e) {
        alert(
          "Failed to import CSV. Ensure the headers: date,campus,ministry,total,visitors,members"
        );
      }
    };
    reader.readAsText(file);
  }

  function addRecord() {
    const date = prompt(
      "Date (YYYY-MM-DD)",
      new Date().toISOString().slice(0, 10)
    );
    if (!date) return;
    const campusVal = prompt("Campus", campuses[0]);
    const ministryVal = prompt("Ministry", ministries[0]);
    const total = Number(prompt("Total Attendees", "150") || 0);
    const visitors = Number(prompt("Visitors", "20") || 0);
    const members = Math.max(0, total - visitors);
    setRecords((prev) => [
      ...prev,
      {
        date,
        campus: campusVal || campuses[0],
        ministry: ministryVal || ministries[0],
        total,
        visitors,
        members,
      } as any,
    ]);
  }

  function refreshData() {
    setRecords(genSeries(120));
  }

  return (
    <main className="min-h-screen bg-[#0b1e3a] text-white">
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur bg-[rgba(11,30,58,0.7)] border-b"
        style={{ borderColor: COLORS.border }}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-white/10 grid place-content-center">
              <ClipboardList className="size-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Analytics & Attendance
              </h1>
              <p className="text-xs text-white/70">
                Insightful metrics • Reliable records • Actionable decisions
              </p>
            </div>
          </div>
          <nav className="ml-auto flex items-center gap-2">
            <button
              className={`px-3 py-1.5 rounded-xl border ${
                tab === "analytics" ? "bg-white/10" : "bg-transparent"
              }`}
              style={{ borderColor: COLORS.border }}
              onClick={() => setTab("analytics")}
            >
              Analytics
            </button>
            <button
              className={`px-3 py-1.5 rounded-xl border ${
                tab === "attendance" ? "bg-white/10" : "bg-transparent"
              }`}
              style={{ borderColor: COLORS.border }}
              onClick={() => setTab("attendance")}
            >
              Attendance
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <FilterBar
          q={q}
          onQ={setQ}
          campus={campus}
          onCampus={setCampus}
          ministry={ministry}
          onMinistry={setMinistry}
          range={range}
          onRange={setRange}
          onExport={exportCSV}
          onPrint={printView}
          onAdd={addRecord}
          onRefresh={refreshData}
          onImportCSV={onImportCSV}
        />

        {tab === "analytics" ? (
          <AnalyticsView
            kpis={kpis}
            seriesByDate={seriesByDate}
            byMinistry={byMinistry}
            byCampus={byCampus}
            heatmap={heatmap}
          />
        ) : (
          <AttendanceView
            rows={tableRows}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        )}
      </section>

      <footer
        className="border-t mt-8 py-6 text-center text-sm text-white/70"
        style={{ borderColor: COLORS.border }}
      >
        Built for your church • Theme: navy & gold • Client-side demo (wire to
        your Prisma later)
      </footer>
    </main>
  );
}

// ------- FILTER BAR -------
function FilterBar({
  q,
  onQ,
  campus,
  onCampus,
  ministry,
  onMinistry,
  range,
  onRange,
  onExport,
  onPrint,
  onAdd,
  onRefresh,
  onImportCSV,
}: {
  q: string;
  onQ: (v: string) => void;
  campus: string;
  onCampus: (v: string) => void;
  ministry: string;
  onMinistry: (v: string) => void;
  range: { from?: string; to?: string };
  onRange: (v: { from?: string; to?: string }) => void;
  onExport: () => void;
  onPrint: () => void;
  onAdd: () => void;
  onRefresh: () => void;
  onImportCSV: (file: File) => void;
}) {
  return (
    <div
      className="mb-6 grid gap-3 rounded-2xl border p-3 lg:p-4"
      style={{ background: COLORS.card, borderColor: COLORS.border }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          className="flex items-center gap-2 rounded-xl border px-3"
          style={{ borderColor: COLORS.border }}
        >
          <Search className="size-4 text-white/70" />
          <input
            value={q}
            onChange={(e) => onQ(e.target.value)}
            placeholder="Search date, campus, ministry…"
            className="w-full bg-transparent py-2 outline-none placeholder:text-white/50"
          />
        </div>

        <div
          className="flex items-center gap-2 rounded-xl border px-3"
          style={{ borderColor: COLORS.border }}
        >
          <Building className="size-4 text-white/70" />
          <select
            value={campus}
            onChange={(e) => onCampus(e.target.value)}
            className="w-full bg-transparent py-2 outline-none"
          >
            <option value="All">All Campuses</option>
            {campuses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div
          className="flex items-center gap-2 rounded-xl border px-3"
          style={{ borderColor: COLORS.border }}
        >
          <ClipboardList className="size-4 text-white/70" />
          <select
            value={ministry}
            onChange={(e) => onMinistry(e.target.value)}
            className="w-full bg-transparent py-2 outline-none"
          >
            <option value="All">All Ministries</option>
            {ministries.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div
          className="flex items-center gap-2 rounded-xl border px-3"
          style={{ borderColor: COLORS.border }}
        >
          <Calendar className="size-4 text-white/70" />
          <input
            type="date"
            value={range.from || ""}
            onChange={(e) => onRange({ ...range, from: e.target.value })}
            className="bg-transparent py-2 outline-none"
          />
          <span className="text-white/60">to</span>
          <input
            type="date"
            value={range.to || ""}
            onChange={(e) => onRange({ ...range, to: e.target.value })}
            className="bg-transparent py-2 outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onExport}
          className="px-3 py-2 rounded-xl border hover:bg-white/10"
          style={{ borderColor: COLORS.border }}
        >
          <div className="flex items-center gap-2">
            <Download className="size-4" /> Export CSV
          </div>
        </button>
        <label
          className="px-3 py-2 rounded-xl border hover:bg-white/10 cursor-pointer"
          style={{ borderColor: COLORS.border }}
        >
          <div className="flex items-center gap-2">
            <UploadCloud className="size-4" /> Import CSV
          </div>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && onImportCSV(e.target.files[0])
            }
          />
        </label>
        <button
          onClick={onPrint}
          className="px-3 py-2 rounded-xl border hover:bg-white/10"
          style={{ borderColor: COLORS.border }}
        >
          <div className="flex items-center gap-2">
            <Printer className="size-4" /> Print
          </div>
        </button>
        <button
          onClick={onAdd}
          className="px-3 py-2 rounded-xl border hover:bg-white/10"
          style={{ borderColor: COLORS.border }}
        >
          Add Record
        </button>
        <button
          onClick={onRefresh}
          className="px-3 py-2 rounded-xl border hover:bg-white/10"
          style={{ borderColor: COLORS.border }}
        >
          <div className="flex items-center gap-2">
            <RefreshCcw className="size-4" /> Refresh Demo Data
          </div>
        </button>
        <div className="ml-auto text-white/70 text-sm flex items-center gap-2">
          <Filter className="size-4" /> Advanced filters coming soon…
        </div>
      </div>
    </div>
  );
}

// ------- ANALYTICS VIEW -------
function AnalyticsView({
  kpis,
  seriesByDate,
  byMinistry,
  byCampus,
  heatmap,
}: {
  kpis: { total: number; avg: number; visitors: number; retention: number };
  seriesByDate: Array<{
    date: string;
    total: number;
    members: number;
    visitors: number;
  }>;
  byMinistry: Array<{ ministry: string; total: number }>;
  byCampus: Array<{ campus: string; total: number }>;
  heatmap: Array<{ date: string; count: number }>;
}) {
  return (
    <div className="grid gap-6">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI
          icon={<Users className="size-5" />}
          label="Total Attendance"
          value={kpis.total.toLocaleString()}
          hint="Selected range"
        />
        <KPI
          icon={<TrendingUp className="size-5" />}
          label="Avg / Service"
          value={kpis.avg.toLocaleString()}
          hint="Mean headcount"
        />
        <KPI
          icon={<UserPlus className="size-5" />}
          label="Visitors"
          value={kpis.visitors.toLocaleString()}
          hint="First-time + returning"
        />
        <KPI
          icon={<UserCheck className="size-5" />}
          label="Retention"
          value={`${kpis.retention}%`}
          hint="Members ÷ Total"
        />
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Attendance Trend (by Date)" subtitle="Members vs Visitors">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={seriesByDate}
                margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={COLORS.accent}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.accent}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis dataKey="date" stroke="#fff" fontSize={12} />
                <YAxis stroke="#fff" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#0b1e3a",
                    border: `1px solid ${COLORS.border}`,
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke={COLORS.accent}
                  fillOpacity={1}
                  fill="url(#g1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="By Ministry" subtitle="Total attendance per ministry">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byMinistry}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis dataKey="ministry" stroke="#fff" fontSize={12} />
                <YAxis stroke="#fff" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#0b1e3a",
                    border: `1px solid ${COLORS.border}`,
                    color: "#fff",
                  }}
                />
                <Bar dataKey="total" fill={COLORS.secondary} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="By Campus" subtitle="Contribution by campus">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byCampus}
                  dataKey="total"
                  nameKey="campus"
                  outerRadius={90}
                >
                  {byCampus.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i % 2 ? COLORS.secondary : COLORS.accent}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#0b1e3a",
                    border: `1px solid ${COLORS.border}`,
                    color: "#fff",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* HEATMAP */}
      <Card
        title="Attendance Heatmap"
        subtitle="Last 6 months — darker = higher attendance"
      >
        <Heatmap data={heatmap} />
      </Card>
    </div>
  );
}

function KPI({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border p-4"
      style={{ background: COLORS.card, borderColor: COLORS.border }}
    >
      <div className="flex items-center gap-3">
        <div
          className="size-10 rounded-xl grid place-content-center"
          style={{ background: "rgba(212,175,55,0.15)", color: COLORS.accent }}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-white/70">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {hint && <p className="text-xs text-white/60">{hint}</p>}
        </div>
      </div>
    </motion.div>
  );
}

function Card({
  title,
  subtitle,
  children,
}: React.PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{ background: COLORS.card, borderColor: COLORS.border }}
    >
      <div className="mb-3">
        <h3 className="font-semibold">{title}</h3>
        {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// Lightweight heatmap (CSS grid)
function Heatmap({ data }: { data: Array<{ date: string; count: number }> }) {
  // Convert to weeks columns (like GitHub)
  const weeks: Array<Array<{ date: string; count: number }>> = [];
  data.forEach((d) => {
    const day = new Date(d.date).getDay();
    if (weeks.length === 0 || weeks[weeks.length - 1].length === 7)
      weeks.push([]);
    // pad empty days to align weeks starting Sunday
    if (weeks[weeks.length - 1].length === 0 && day !== 0) {
      for (let i = 0; i < day; i++)
        weeks[weeks.length - 1].push({ date: "", count: 0 });
    }
    weeks[weeks.length - 1].push(d);
  });

  function cellStyle(c: number) {
    const max = 300;
    const t = Math.min(1, c / max);
    const alpha = 0.15 + t * 0.75;
    const bg = `rgba(212,175,55,${alpha})`; // gold intensity
    return {
      background: c === 0 ? "rgba(255,255,255,0.06)" : bg,
      borderRadius: 6,
    } as React.CSSProperties;
  }

  return (
    <div className="overflow-x-auto">
      <div
        className="inline-grid grid-flow-col auto-cols-max gap-1 p-2 rounded-xl border"
        style={{ borderColor: COLORS.border }}
      >
        {weeks.map((w, wi) => (
          <div key={wi} className="grid grid-rows-7 gap-1">
            {w.map((d, di) => (
              <div
                key={di}
                title={`${d.date || ""} • ${d.count || 0}`}
                className="size-4 md:size-5"
                style={cellStyle(d.count)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ------- ATTENDANCE VIEW -------
function AttendanceView({
  rows,
  page,
  totalPages,
  setPage,
}: {
  rows: Array<{
    date: string;
    campus: string;
    ministry: string;
    total: number;
    members: number;
    visitors: number;
  }>;
  page: number;
  totalPages: number;
  setPage: (n: number) => void;
}) {
  return (
    <div className="grid gap-4">
      <Card title="Attendance Records" subtitle="Search, sort, paginate">
        <div
          className="overflow-x-auto rounded-xl border"
          style={{ borderColor: COLORS.border }}
        >
          <table className="min-w-full text-sm">
            <thead className="bg-white/5">
              <tr className="text-left">
                {[
                  "Date",
                  "Campus",
                  "Ministry",
                  "Total",
                  "Members",
                  "Visitors",
                  "% Visitors",
                ].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const pctV = r.total
                  ? Math.round((r.visitors / r.total) * 100)
                  : 0;
                return (
                  <tr
                    key={i}
                    className="border-t"
                    style={{ borderColor: COLORS.border }}
                  >
                    <td className="px-3 py-2 whitespace-nowrap">{r.date}</td>
                    <td className="px-3 py-2">{r.campus}</td>
                    <td className="px-3 py-2">{r.ministry}</td>
                    <td className="px-3 py-2">{r.total}</td>
                    <td className="px-3 py-2">{r.members}</td>
                    <td className="px-3 py-2">{r.visitors}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-white/10">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${pctV}%`,
                              background: COLORS.accent,
                            }}
                          />
                        </div>
                        <span>{pctV}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-white/70">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-xl border disabled:opacity-50"
              style={{ borderColor: COLORS.border }}
            >
              Prev
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-xl border disabled:opacity-50"
              style={{ borderColor: COLORS.border }}
            >
              Next
            </button>
          </div>
        </div>
      </Card>

      {/* Quick Notes */}
      <div
        className="rounded-2xl border p-4 text-sm"
        style={{ background: COLORS.card, borderColor: COLORS.border }}
      >
        <p className="text-white/80 font-medium mb-1">Tips</p>
        <ul className="list-disc pl-5 space-y-1 text-white/70">
          <li>
            Use the global filters above to slice data by campus, ministry, or
            date range.
          </li>
          <li>
            Export CSV and import updated records to merge with the current
            view.
          </li>
          <li>
            Click <em>Add Record</em> for a quick manual entry (demo). Replace
            with a proper modal linked to your database.
          </li>
        </ul>
      </div>
    </div>
  );
}
