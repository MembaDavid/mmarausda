"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as motion from "motion/react-client";
import Image from "next/image";
import { supabaseBrowser } from "@/utils/supabase/client"; // <-- browser client

type NavItem = {
  label: string;
  href: string;
  sub?: { label: string; href: string }[];
};

const ADMIN_ROLES = new Set(["ADMIN", "EDITOR", "TREASURER", "CLERK"]);

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [elevated, setElevated] = useState(false);

  // auth state
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string>("GUEST");

  const pathname = usePathname();

  // --- load auth state from supabase on mount + listen for changes
  useEffect(() => {
    const s = supabaseBrowser();
    s.auth.getUser().then(({ data }) => {
      const u = data.user;
      setAuthed(!!u);
      setEmail(u?.email ?? null);
      const r =
        (u?.user_metadata as any)?.role ??
        (u?.app_metadata as any)?.role ??
        "GUEST";
      setRole(String(r || "GUEST").toUpperCase());
    });
    const {
      data: { subscription },
    } = s.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setAuthed(!!u);
      setEmail(u?.email ?? null);
      const r =
        (u?.user_metadata as any)?.role ??
        (u?.app_metadata as any)?.role ??
        "GUEST";
      setRole(String(r || "GUEST").toUpperCase());
    });
    return () => subscription?.unsubscribe();
  }, []);

  // --- existing hover timer for Resources dropdown
  const closeTimer = useRef<number | null>(null);
  const openMenu = (label: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  };
  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setOpenDropdown(null), 130);
  };

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    {
      label: "Resources",
      href: "#",
      sub: [
        { label: "Sermons", href: "/resources/sermons" },
        { label: "Hymns", href: "/resources/hymns" },
        { label: "Bible Study", href: "/resources/bible_studies" },
      ],
    },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  // small avatar/initials from email
  const initials =
    email?.trim().slice(0, 1).toUpperCase() || role.slice(0, 1) || "U";

  // client-side sign out (clears sb cookies and reloads)
  const signOut = async () => {
    const s = supabaseBrowser();
    await s.auth.signOut();
    // Prefer a soft refresh to re-render header quickly
    window.location.assign("/auth/login");
  };

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50",
        "transition-shadow",
        elevated ? "shadow-[0_8px_30px_rgb(2,2,2,0.35)]" : "shadow-none",
      ].join(" ")}
    >
      {/* gradient accent */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="h-[2px] w-full bg-gradient-to-r from-yellow-300 via-amber-400 to-rose-400"
      />

      <div className="supports-[backdrop-filter]:backdrop-blur-xl bg-black/55">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="h-9 w-9 shrink-0"
            >
              <Image
                src="/sda_logo.svg"
                alt="SDA Logo"
                width={36}
                height={36}
                priority
                className="h-full w-full object-contain"
              />
            </motion.div>

            <div className="leading-tight">
              <span className="block text-[10px] xs:text-[11px] sm:text-xs md:text-[13px] font-medium tracking-wide text-white/90">
                Seventh-day Adventist Maasai Mara University Church
              </span>
              <span className="block text-[9px] sm:text-[10px] text-white/60">
                Narok, Kenya
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="relative hidden items-center gap-6 md:flex">
            {navItems.map((item) => {
              const hasSub = !!item.sub?.length;
              const active = item.href !== "#" && pathname === item.href;

              return (
                <div
                  key={item.label}
                  className={[
                    "relative group pb-3",
                    "before:content-[''] before:absolute before:left-0 before:top-full before:h-3 before:w-full",
                  ].join(" ")}
                  onMouseEnter={() =>
                    hasSub ? openMenu(item.label) : undefined
                  }
                  onMouseLeave={() => (hasSub ? scheduleClose() : undefined)}
                >
                  <Link
                    href={item.href}
                    className={[
                      "relative px-1 text-sm tracking-wide text-white/85 transition-colors",
                      active ? "text-yellow-300" : "hover:text-yellow-300",
                    ].join(" ")}
                    onFocus={() => hasSub && openMenu(item.label)}
                    onBlur={() => hasSub && scheduleClose()}
                  >
                    {item.label}
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-[2px]"
                      initial={false}
                      animate={{ scaleX: active ? 1 : 0 }}
                      style={{
                        transformOrigin: "left",
                        background: "linear-gradient(90deg,#FDE047,#FB923C)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  </Link>

                  {/* Dropdown */}
                  {hasSub && openDropdown === item.label && (
                    <motion.div
                      key="dropdown"
                      initial={{ opacity: 0, y: 6, scale: 0.99 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.99 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 22,
                      }}
                      className="absolute left-0 top-full z-50 w-64 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 p-2 backdrop-blur-xl shadow-2xl"
                      onMouseEnter={() => openMenu(item.label)}
                      onMouseLeave={scheduleClose}
                      role="menu"
                      aria-label={item.label}
                    >
                      {item.sub!.map((sub) => {
                        const subActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className={[
                              "flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors",
                              subActive
                                ? "bg-white/5 text-yellow-300"
                                : "text-white/90 hover:bg-white/5 hover:text-yellow-300",
                            ].join(" ")}
                          >
                            <span>{sub.label}</span>
                            <span aria-hidden>↗</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              );
            })}

            {/* RIGHT SIDE (desktop): auth-aware */}
            {!authed ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="rounded-xl px-3 py-2 text-sm text-white/90 ring-1 ring-white/15 hover:bg-white/5"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-xl px-3 py-2 text-sm text-black bg-yellow-300 hover:bg-yellow-400"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="relative">
                <details className="group">
                  <summary className="list-none flex items-center gap-2 cursor-pointer">
                    <span className="rounded-full w-8 h-8 grid place-items-center bg-white/15 text-white">
                      {initials}
                    </span>
                    <span className="hidden lg:inline text-sm text-white/85">
                      {email}
                    </span>
                    <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/80 uppercase tracking-wide">
                      {role}
                    </span>
                  </summary>
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl">
                    <div className="p-2">
                      <Link
                        href="/onboarding"
                        className="block rounded-xl px-3 py-2 text-sm text-white/90 hover:bg-white/5"
                      >
                        Onboarding
                      </Link>
                      <Link
                        href="/account"
                        className="block rounded-xl px-3 py-2 text-sm text-white/90 hover:bg-white/5"
                      >
                        Account
                      </Link>
                      {ADMIN_ROLES.has(role) && (
                        <Link
                          href="/admin"
                          className="block rounded-xl px-3 py-2 text-sm text-amber-300 hover:bg-white/5"
                        >
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={signOut}
                        className="mt-1 w-full text-left rounded-xl px-3 py-2 text-sm text-white/90 hover:bg-white/5"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </details>
              </div>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-white/90 ring-1 ring-white/15 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle menu"
          >
            <motion.span
              key={mobileOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-lg"
            >
              {mobileOpen ? "✕" : "☰"}
            </motion.span>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <motion.div
        id="mobile-nav"
        initial={false}
        animate={{
          height: mobileOpen ? "auto" : 0,
          opacity: mobileOpen ? 1 : 0,
        }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="overflow-hidden bg-black/90 backdrop-blur-xl md:hidden"
      >
        <div className="space-y-1 px-4 pb-4 pt-2">
          {navItems.map((item) => (
            <div key={item.label} className="w-full">
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block w-full rounded-xl px-3 py-2 text-white/90 ring-1 ring-white/10 bg-white/0 hover:bg-white/5 transition-colors"
              >
                {item.label}
              </Link>

              {item.sub?.length ? (
                <div className="ml-3 mt-2 space-y-1">
                  {item.sub.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-white/75 hover:text-yellow-300 hover:bg-white/5 transition-colors"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}

          {/* Auth area (mobile) */}
          {!authed ? (
            <div className="mt-2 flex gap-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center rounded-xl px-3 py-2 text-white/90 ring-1 ring-white/15"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center rounded-xl px-3 py-2 text-black bg-yellow-300"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href="/onboarding"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2 text-center text-white/90 ring-1 ring-white/10"
              >
                Onboarding
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2 text-center text-white/90 ring-1 ring-white/10"
              >
                Account
              </Link>
              {ADMIN_ROLES.has(role) && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="col-span-2 rounded-xl px-3 py-2 text-center text-amber-300 ring-1 ring-white/10"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  void signOut();
                }}
                className="col-span-2 rounded-xl px-3 py-2 text-center text-white/90 ring-1 ring-white/10"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </header>
  );
}
