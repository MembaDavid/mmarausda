"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/header";
import {
  Download,
  Pencil,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

type Role =
  | "ADMIN"
  | "EDITOR"
  | "MEMBER"
  | "GUEST"
  | "ASSOCIATE"
  | "TREASURER"
  | "CLERK"
  | "STAFF";

type UserStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "ARCHIVED";

type AdminUser = {
  id: string;
  authUserId: string;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  role: Role;
  status: UserStatus;
  gender?: string | null;
  homeChurch?: string | null;
  createdAt: string;
  memberProfile?: {
    membershipStatus: string;
    graduationYear?: number | null;
  } | null;
};

const roles: Role[] = [
  "ADMIN",
  "EDITOR",
  "TREASURER",
  "CLERK",
  "STAFF",
  "MEMBER",
  "ASSOCIATE",
  "GUEST",
];

const statuses: UserStatus[] = ["ACTIVE", "PENDING", "SUSPENDED", "ARCHIVED"];

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "All">("All");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "All">("All");
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadUsers() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/users", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load users");
      const data = await response.json();
      setUsers(data.users ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesQuery =
        !query ||
        (user.fullName ?? "").toLowerCase().includes(query) ||
        (user.email ?? "").toLowerCase().includes(query) ||
        user.authUserId.toLowerCase().includes(query);
      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [roleFilter, search, statusFilter, users]);

  const stats = useMemo(
    () => [
      ["Users", users.length.toString()],
      ["Members", users.filter((user) => user.role === "MEMBER").length.toString()],
      [
        "Leaders",
        users
          .filter((user) =>
            ["ADMIN", "EDITOR", "TREASURER", "CLERK", "STAFF"].includes(
              user.role
            )
          )
          .length.toString(),
      ],
      [
        "Pending",
        users.filter((user) => user.status === "PENDING").length.toString(),
      ],
    ],
    [users]
  );

  async function saveUser() {
    if (!editing) return;

    try {
      setSaving(true);
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing.id,
          fullName: editing.fullName,
          email: editing.email,
          phone: editing.phone,
          role: editing.role,
          status: editing.status,
          homeChurch: editing.homeChurch,
          gender: editing.gender,
        }),
      });

      if (!response.ok) throw new Error("Failed to save user");
      const data = await response.json();
      setUsers((current) =>
        current.map((user) => (user.id === data.user.id ? data.user : user))
      );
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save user");
    } finally {
      setSaving(false);
    }
  }

  function exportCSV() {
    const rows = [
      ["Name", "Email", "Phone", "Role", "Status", "Home Church", "Created At"],
      ...filtered.map((user) => [
        user.fullName ?? "",
        user.email ?? "",
        user.phone ?? "",
        user.role,
        user.status,
        user.homeChurch ?? "",
        user.createdAt,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `mmu-sda-users-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <Header />
      <main className="church-page min-h-screen pt-20">
        <section className="border-b border-brand-line bg-brand-cream">
          <div className="church-container py-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="church-kicker">Admin</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-brand-ink">
                  Church management
                </h1>
                <p className="church-copy mt-3 max-w-2xl">
                  User profiles, roles, membership state, and church records are
                  loaded from the local PostgreSQL database through Prisma.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => void loadUsers()} className="church-button-secondary">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
                <button onClick={exportCSV} className="church-button">
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map(([label, value]) => (
                <article key={label} className="church-card-plain p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-muted">
                    {label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-brand-forest-dark">
                    {value}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="church-section">
          <div className="church-container">
            <div className="church-card p-4">
              <div className="grid gap-3 lg:grid-cols-[1fr_12rem_12rem]">
                <label className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="church-input pl-10"
                    placeholder="Search name, email, or auth id"
                  />
                </label>
                <select
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value as any)}
                  className="church-input"
                  aria-label="Filter role"
                >
                  <option>All</option>
                  {roles.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as any)}
                  className="church-input"
                  aria-label="Filter status"
                >
                  <option>All</option>
                  {statuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {error ? (
              <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="church-card mt-5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="church-table">
                  <thead className="bg-brand-mist">
                    <tr>
                      <th>Name / Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Membership</th>
                      <th>Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center text-brand-muted">
                          Loading users
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-brand-muted">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filtered.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <p className="font-semibold text-brand-ink">
                              {user.fullName || "Unnamed profile"}
                            </p>
                            <p className="text-xs text-brand-muted">
                              {user.email || user.authUserId}
                            </p>
                          </td>
                          <td>
                            <span className="church-badge">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <StatusBadge status={user.status} />
                          </td>
                          <td className="text-brand-muted">
                            {user.memberProfile?.membershipStatus ?? "None"}
                          </td>
                          <td className="text-brand-muted">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <button
                              onClick={() => setEditing(user)}
                              className="church-button-secondary"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {editing ? (
          <div className="fixed inset-0 z-[60]">
            <button
              aria-label="Close editor"
              className="absolute inset-0 bg-brand-ink/55"
              onClick={() => setEditing(null)}
            />
            <aside className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-brand-cream p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="church-kicker">Edit User</p>
                  <h2 className="mt-2 text-2xl font-semibold text-brand-ink">
                    {editing.fullName || "Unnamed profile"}
                  </h2>
                </div>
                <button
                  onClick={() => setEditing(null)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-brand-line bg-white text-brand-muted hover:text-brand-ink"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 grid gap-4">
                <EditField
                  label="Full Name"
                  value={editing.fullName ?? ""}
                  onChange={(value) => setEditing({ ...editing, fullName: value })}
                />
                <EditField
                  label="Email"
                  type="email"
                  value={editing.email ?? ""}
                  onChange={(value) => setEditing({ ...editing, email: value })}
                />
                <EditField
                  label="Phone"
                  value={editing.phone ?? ""}
                  onChange={(value) => setEditing({ ...editing, phone: value })}
                />
                <EditField
                  label="Home Church"
                  value={editing.homeChurch ?? ""}
                  onChange={(value) =>
                    setEditing({ ...editing, homeChurch: value })
                  }
                />
                <label>
                  <span className="church-label">Role</span>
                  <select
                    value={editing.role}
                    onChange={(event) =>
                      setEditing({ ...editing, role: event.target.value as Role })
                    }
                    className="church-input"
                  >
                    {roles.map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="church-label">Status</span>
                  <select
                    value={editing.status}
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        status: event.target.value as UserStatus,
                      })
                    }
                    className="church-input"
                  >
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="church-label">Gender</span>
                  <select
                    value={editing.gender ?? ""}
                    onChange={(event) =>
                      setEditing({ ...editing, gender: event.target.value || null })
                    }
                    className="church-input"
                  >
                    <option value="">Not set</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </label>
              </div>

              <div className="mt-7 flex justify-end gap-3">
                <button
                  onClick={() => setEditing(null)}
                  className="church-button-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => void saveUser()}
                  disabled={saving}
                  className="church-button"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving" : "Save"}
                </button>
              </div>
            </aside>
          </div>
        ) : null}
      </main>
    </>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  const tone =
    status === "ACTIVE"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "PENDING"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : status === "SUSPENDED"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}
    >
      {status}
    </span>
  );
}

function EditField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label>
      <span className="church-label">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        className="church-input"
      />
    </label>
  );
}
