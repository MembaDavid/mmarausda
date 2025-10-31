"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * AdminPage – a comprehensive single‑file dashboard component
 * -----------------------------------------------------------
 * • Theme: Navy blue, blue, gold accent (#d4af37)
 * • Features:
 *   - Header actions (Add User, Bulk Delete, Export CSV)
 *   - KPI cards
 *   - Search + filters (role, status, sort by, date range)
 *   - Paginated table with selection, inline actions (view/edit/delete)
 *   - Create/Edit side panel (no external libs)
 *   - Confirm dialogs
 *   - Toast notifications
 *   - LocalStorage persistence (mock)
 *   - Fully responsive
 */

type Role = "Admin" | "Editor" | "Member" | "Guest";
type Status = "Active" | "Pending" | "Suspended";

type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: Status;
  joinedAt: string; // ISO date
};

const ACCENT = "#d4af37"; // gold
const NAVY = "#0b1a33"; // deep navy
const BLUE = "#1e3a8a"; // tailwind blue-800

// --------- Utilities
const random = {
  pick: <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)],
  id: () => Math.floor(Math.random() * 1_000_000),
  dateInLastMonths: (months = 6) => {
    const now = new Date();
    const past = new Date();
    past.setMonth(now.getMonth() - months);
    const time =
      past.getTime() + Math.random() * (now.getTime() - past.getTime());
    return new Date(time).toISOString();
  },
};

const NAMES = [
  "Alice Wambui",
  "Bob Kiptoo",
  "Charlie Okello",
  "Diana Achieng",
  "Eve Naliaka",
  "Frank Barasa",
  "Grace Mutheu",
  "Heidi Kendi",
  "Isaac Mwangi",
  "Joyce Chebet",
  "Kevin Otieno",
  "Lilian Cherono",
  "Mary Njeri",
  "Nate Ouma",
  "Peter Ndegwa",
];

const ROLES: Role[] = ["Admin", "Editor", "Member", "Guest"];
const STATUSES: Status[] = ["Active", "Pending", "Suspended"];

function makeUser(): User {
  const name = random.pick(NAMES);
  const email = name.toLowerCase().replace(/[^a-z]/g, ".") + "@example.com";
  return {
    id: random.id(),
    name,
    email,
    role: random.pick(ROLES),
    status: random.pick(STATUSES),
    joinedAt: random.dateInLastMonths(12),
  };
}

function exportCSV(rows: User[]) {
  const headers = ["ID", "Name", "Email", "Role", "Status", "Joined At"];
  const body = rows.map((u) => [
    u.id,
    u.name,
    u.email,
    u.role,
    u.status,
    u.joinedAt,
  ]);
  const csv = [headers, ...body].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// LocalStorage mock persistence keys
const LS_KEY = "admin.users.v1";

// --------- Component
export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "All">("All");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [sortBy, setSortBy] = useState<"name" | "role" | "status" | "joinedAt">(
    "joinedAt"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // create/edit side panel
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  // confirm dialog
  const [confirm, setConfirm] = useState<{ open: boolean; ids: number[] }>({
    open: false,
    ids: [],
  });

  // toast
  const [toast, setToast] = useState<{ id: number; msg: string } | null>(null);

  // initial data
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      setUsers(JSON.parse(raw));
    } else {
      const seed = Array.from({ length: 24 }, () => makeUser());
      setUsers(seed);
      localStorage.setItem(LS_KEY, JSON.stringify(seed));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(users));
  }, [users]);

  // derived data
  const filtered = useMemo(() => {
    let rows = users;
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    if (roleFilter !== "All") rows = rows.filter((u) => u.role === roleFilter);
    if (statusFilter !== "All")
      rows = rows.filter((u) => u.status === statusFilter);
    rows = [...rows].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "joinedAt")
        return (
          (new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()) *
          dir
        );
      return String(a[sortBy]).localeCompare(String(b[sortBy])) * dir;
    });
    return rows;
  }, [users, search, roleFilter, statusFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  // handlers
  const toggleSelectAll = (checked: boolean) => {
    setSelected(checked ? pageRows.map((u) => u.id) : []);
  };
  const toggleRow = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const openCreate = () => {
    setEditing({
      id: 0,
      name: "",
      email: "",
      role: "Member",
      status: "Pending",
      joinedAt: new Date().toISOString(),
    });
    setPanelOpen(true);
  };

  const openEdit = (u: User) => {
    setEditing(u);
    setPanelOpen(true);
  };

  const saveUser = (u: User) => {
    if (!u.name.trim() || !u.email.includes("@")) {
      pushToast("Please provide a valid name & email.");
      return;
    }
    if (u.id === 0) {
      const toSave = {
        ...u,
        id: random.id(),
        joinedAt: new Date().toISOString(),
      };
      setUsers((prev) => [toSave, ...prev]);
      pushToast("User created.");
    } else {
      setUsers((prev) => prev.map((x) => (x.id === u.id ? u : x)));
      pushToast("User updated.");
    }
    setPanelOpen(false);
  };

  const askDelete = (ids: number[]) => setConfirm({ open: true, ids });
  const doDelete = () => {
    setUsers((prev) => prev.filter((u) => !confirm.ids.includes(u.id)));
    setSelected([]);
    setConfirm({ open: false, ids: [] });
    pushToast("User(s) removed.");
  };

  const addRandom = () => {
    setUsers((prev) => [{ ...makeUser() }, ...prev]);
    pushToast("Random user added.");
  };

  const pushToast = (msg: string) => setToast({ id: Date.now(), msg });
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, statusFilter, pageSize]);

  return (
    <main
      className="min-h-screen bg-slate-50 text-slate-100"
      style={{
        background: `linear-gradient(180deg, ${NAVY} 0%, #0f2448 60%, #0f172a 100%)`,
      }}
    >
      {/* Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur bg-black/20 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Admin Panel
              </h1>
              <p className="text-xs text-slate-300/80">
                Church website • Management Console
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-ghost"
              onClick={addRandom}
              title="Quick add random user"
            >
              + Random
            </button>
            <button className="btn btn-accent" onClick={openCreate}>
              Add User
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPI
            title="Total Users"
            value={users.length.toString()}
            hint="All records"
          />
          <KPI
            title="Active"
            value={users.filter((u) => u.status === "Active").length.toString()}
            hint="Status = Active"
          />
          <KPI
            title="Admins"
            value={users.filter((u) => u.role === "Admin").length.toString()}
            hint="Role = Admin"
          />
          <KPI
            title="New (30d)"
            value={users
              .filter(
                (u) => new Date(u.joinedAt) > new Date(Date.now() - 30 * 864e5)
              )
              .length.toString()}
            hint="Joined last 30 days"
          />
        </div>

        {/* Toolbar */}
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <label className="label">Search</label>
                <input
                  className="input"
                  placeholder="Search name or email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Role</label>
                <select
                  className="input"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                >
                  <option>All</option>
                  {ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select
                  className="input"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <option>All</option>
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Sort by</label>
                <div className="flex gap-2">
                  <select
                    className="input"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                  >
                    <option value="joinedAt">Joined</option>
                    <option value="name">Name</option>
                    <option value="role">Role</option>
                    <option value="status">Status</option>
                  </select>
                  <button
                    className="btn btn-ghost"
                    onClick={() =>
                      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                    }
                  >
                    {sortDir === "asc" ? "↑" : "↓"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="btn btn-ghost"
                disabled={selected.length === 0}
                onClick={() => askDelete(selected)}
                title="Delete selected"
              >
                Delete ({selected.length})
              </button>
              <button
                className="btn btn-outline"
                onClick={() => exportCSV(filtered)}
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-black/30 text-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selected.length === pageRows.length &&
                        pageRows.length > 0
                      }
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                    />
                  </th>
                  <TH>Name / Email</TH>
                  <TH>Role</TH>
                  <TH>Status</TH>
                  <TH>Joined</TH>
                  <TH>Actions</TH>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t border-white/10 hover:bg-white/5"
                  >
                    <td className="px-4 py-3 align-top">
                      <input
                        type="checkbox"
                        checked={selected.includes(u.id)}
                        onChange={() => toggleRow(u.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{u.name}</div>
                      <div className="text-slate-300 text-xs">{u.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone="info">{u.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        tone={
                          u.status === "Active"
                            ? "success"
                            : u.status === "Pending"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {u.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-xs">
                      {new Date(u.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          className="btn btn-ghost"
                          title="Edit"
                          onClick={() => openEdit(u)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-ghost"
                          title="Delete"
                          onClick={() => askDelete([u.id])}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {pageRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-slate-300"
                    >
                      No results. Try adjusting your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer: pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-white/10 bg-black/20">
            <div className="text-xs text-slate-300">
              Showing <b>{pageRows.length}</b> of <b>{filtered.length}</b>{" "}
              filtered users (Total: {users.length})
            </div>
            <div className="flex items-center gap-2">
              <select
                className="input !py-1 !text-xs"
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value))}
              >
                {[5, 8, 12, 20, 30].map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}
              </select>
              <nav className="flex items-center gap-1">
                <button
                  className="btn btn-ghost"
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                >
                  «
                </button>
                <button
                  className="btn btn-ghost"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Prev
                </button>
                <span className="px-2 text-xs">
                  Page <b>{page}</b> / {totalPages}
                </span>
                <button
                  className="btn btn-ghost"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
                <button
                  className="btn btn-ghost"
                  disabled={page === totalPages}
                  onClick={() => setPage(totalPages)}
                >
                  »
                </button>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* Side Panel (Create/Edit) */}
      {panelOpen && editing && (
        <SidePanel
          title={editing.id === 0 ? "Add User" : "Edit User"}
          onClose={() => setPanelOpen(false)}
        >
          <UserForm
            value={editing}
            onChange={setEditing}
            onCancel={() => setPanelOpen(false)}
            onSave={() => saveUser(editing)}
          />
        </SidePanel>
      )}

      {/* Confirm dialog */}
      {confirm.open && (
        <ConfirmDialog
          title="Confirm deletion"
          subtitle={`Are you sure you want to delete ${
            confirm.ids.length
          } user${
            confirm.ids.length > 1 ? "s" : ""
          }? This action cannot be undone.`}
          onCancel={() => setConfirm({ open: false, ids: [] })}
          onConfirm={doDelete}
        />
      )}

      {/* Toast */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 flex justify-center">
        {toast && (
          <div
            key={toast.id}
            className="pointer-events-auto rounded-lg border border-white/10 bg-black/70 px-4 py-2 text-sm shadow-xl"
          >
            {toast.msg}
          </div>
        )}
      </div>

      <StyleOverrides />
    </main>
  );
}

// ---------- Small components
function KPI({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-4 shadow-lg">
      <div className="text-xs uppercase tracking-wide text-slate-300">
        {title}
      </div>
      <div className="mt-1 text-3xl font-bold" style={{ color: ACCENT }}>
        {value}
      </div>
      {hint && <div className="mt-2 text-xs text-slate-300/80">{hint}</div>}
    </div>
  );
}

function TH({ children }: { children?: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
      {children}
    </th>
  );
}

function Badge({
  children,
  tone = "info" as "info" | "success" | "warning" | "danger",
}: {
  children?: React.ReactNode;
  tone?: "info" | "success" | "warning" | "danger";
}) {
  const tones: Record<string, string> = {
    info: "bg-blue-600/30 text-blue-200 border-blue-400/30",
    success: "bg-emerald-600/30 text-emerald-200 border-emerald-400/30",
    warning: "bg-amber-600/30 text-amber-100 border-amber-400/30",
    danger: "bg-rose-700/30 text-rose-100 border-rose-400/30",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function SidePanel({
  title,
  onClose,
  children,
}: React.PropsWithChildren<{ title: string; onClose: () => void }>) {
  // trap focus
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        ref={ref}
        className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-slate-900 shadow-2xl border-l border-white/10 animate-slideIn"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h3 className="text-base font-semibold">{title}</h3>
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <div
          className="p-5 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 64px)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function UserForm({
  value,
  onChange,
  onCancel,
  onSave,
}: {
  value: User;
  onChange: (u: User) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const update = <K extends keyof User>(k: K, v: User[K]) =>
    onChange({ ...value, [k]: v });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="space-y-4"
    >
      <div>
        <label className="label">Full name</label>
        <input
          className="input"
          value={value.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Jane Doe"
        />
      </div>
      <div>
        <label className="label">Email</label>
        <input
          className="input"
          type="email"
          value={value.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="jane@example.com"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Role</label>
          <select
            className="input"
            value={value.role}
            onChange={(e) => update("role", e.target.value as Role)}
          >
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select
            className="input"
            value={value.status}
            onChange={(e) => update("status", e.target.value as Status)}
          >
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 pt-2">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-accent">
          Save
        </button>
      </div>
    </form>
  );
}

function ConfirmDialog({
  title,
  subtitle,
  onCancel,
  onConfirm,
}: {
  title: string;
  subtitle?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl border border-white/10 bg-slate-900 p-5 shadow-2xl">
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && (
            <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
          )}
          <div className="mt-5 flex justify-end gap-2">
            <button className="btn btn-ghost" onClick={onCancel}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoMark() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 12a8 8 0 1016 0 8 8 0 10-16 0Z"
          stroke={ACCENT}
          strokeWidth="1.5"
        />
        <path
          d="M12 7v10M7 12h10"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// ---------- Style primitives (Tailwind-powered)
function StyleOverrides() {
  return (
    <style>{`
      .btn { @apply inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold border border-white/10 bg-white/10 hover:bg-white/20 transition disabled:opacity-50 disabled:pointer-events-none; }
      .btn-ghost { @apply border-transparent bg-transparent hover:bg-white/10; }
      .btn-outline { @apply bg-transparent border-white/30 hover:bg-white/10; }
      .btn-accent { background: ${ACCENT}; color: #0b0b0b; }
      .btn-danger { @apply bg-rose-600 text-white hover:bg-rose-500 border-rose-400/40; }
      .label { @apply mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300; }
      .input { @apply w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[${ACCENT}] focus:ring-offset-0; }
      .animate-slideIn { animation: slideIn 240ms ease-out; }
      @keyframes slideIn { from { transform: translateX(16px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    `}</style>
  );
}
