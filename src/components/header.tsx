"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as motion from "motion/react-client";
import {
  ChevronDown,
  ExternalLink,
  LogIn,
  Menu,
  ShieldCheck,
  UserCircle,
  X,
} from "lucide-react";
import { supabaseBrowser } from "@/utils/supabase/client";

type NavItem = {
  label: string;
  href: string;
  sub?: { label: string; href: string }[];
};

const ADMIN_ROLES = new Set(["ADMIN", "EDITOR", "TREASURER", "CLERK"]);

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  {
    label: "Resources",
    href: "/resources",
    sub: [
      { label: "Resource Hub", href: "/resources" },
      { label: "Sermons", href: "/resources/sermons" },
      { label: "Bible Study", href: "/resources/bible_studies" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [elevated, setElevated] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState("GUEST");
  const pathname = usePathname();
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();

    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      setAuthed(Boolean(user));
      setEmail(user?.email ?? null);
      setRole(readRole(user));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setAuthed(Boolean(user));
      setEmail(user?.email ?? null);
      setRole(readRole(user));
    });

    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMenu = (label: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  };

  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setOpenDropdown(null), 120);
  };

  const signOut = async () => {
    await supabaseBrowser().auth.signOut();
    window.location.assign("/auth/login");
  };

  const initials =
    email?.trim().slice(0, 1).toUpperCase() || role.slice(0, 1) || "U";

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 border-b transition",
        elevated
          ? "border-brand-line bg-brand-cream/92 shadow-sm backdrop-blur-xl"
          : "border-transparent bg-brand-cream/80 backdrop-blur-lg",
      ].join(" ")}
    >
      <div className="h-1 w-full bg-[linear-gradient(90deg,var(--brand-forest),var(--brand-gold),var(--brand-navy))]" />
      <div className="church-container flex items-center justify-between py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-brand-line bg-white shadow-sm">
            <Image
              src="/sda_logo.svg"
              alt="SDA logo"
              width={32}
              height={32}
              priority
              className="h-8 w-8 object-contain"
            />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-semibold text-brand-ink sm:text-base">
              Maasai Mara University SDA Church
            </span>
            <span className="block text-xs text-brand-muted">
              Worship. Fellowship. Service.
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navItems.map((item) => (
            <DesktopNavItem
              key={item.label}
              item={item}
              pathname={pathname}
              openDropdown={openDropdown}
              openMenu={openMenu}
              scheduleClose={scheduleClose}
            />
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {!authed ? (
            <>
              <Link href="/auth/login" className="church-button-secondary">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link href="/auth/register" className="church-button-accent">
                Register
              </Link>
            </>
          ) : (
            <details className="relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-brand-line bg-white/80 px-2.5 py-2 text-sm text-brand-ink">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-forest text-xs font-semibold text-brand-cream">
                  {initials}
                </span>
                <span className="hidden max-w-44 truncate lg:block">
                  {email}
                </span>
                <span className="church-badge py-0.5">{role}</span>
                <ChevronDown className="h-4 w-4 text-brand-muted" />
              </summary>
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-brand-line bg-brand-cream p-2 shadow-xl">
                <Link
                  href="/onboarding"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-brand-ink hover:bg-brand-mist"
                >
                  <UserCircle className="h-4 w-4" />
                  Profile
                </Link>
                {ADMIN_ROLES.has(role) ? (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-brand-forest-dark hover:bg-brand-mist"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Admin
                  </Link>
                ) : null}
                <button
                  onClick={signOut}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-brand-muted hover:bg-brand-mist hover:text-brand-ink"
                >
                  Sign out
                </button>
              </div>
            </details>
          )}
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-line bg-white/80 text-brand-ink md:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <motion.div
        id="mobile-nav"
        initial={false}
        animate={{ height: mobileOpen ? "auto" : 0, opacity: mobileOpen ? 1 : 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="overflow-hidden border-t border-brand-line bg-brand-cream md:hidden"
      >
        <div className="church-container space-y-2 py-4">
          {navItems.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={mobileLinkClass(pathname, item.href)}
              >
                {item.label}
              </Link>
              {item.sub?.length ? (
                <div className="mt-1 grid gap-1 pl-3">
                  {item.sub.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setMobileOpen(false)}
                      className={mobileLinkClass(pathname, sub.href, true)}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}

          {!authed ? (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="church-button-secondary"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMobileOpen(false)}
                className="church-button-accent"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="grid gap-2 pt-2">
              <Link
                href="/onboarding"
                onClick={() => setMobileOpen(false)}
                className="church-button-secondary"
              >
                Profile
              </Link>
              {ADMIN_ROLES.has(role) ? (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="church-button"
                >
                  Admin
                </Link>
              ) : null}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  void signOut();
                }}
                className="church-button-secondary"
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

function DesktopNavItem({
  item,
  pathname,
  openDropdown,
  openMenu,
  scheduleClose,
}: {
  item: NavItem;
  pathname: string;
  openDropdown: string | null;
  openMenu: (label: string) => void;
  scheduleClose: () => void;
}) {
  const hasSub = Boolean(item.sub?.length);
  const active = isActive(pathname, item.href);

  return (
    <div
      className="relative"
      onMouseEnter={() => (hasSub ? openMenu(item.label) : undefined)}
      onMouseLeave={() => (hasSub ? scheduleClose() : undefined)}
    >
      <Link
        href={item.href}
        className={[
          "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition",
          active
            ? "bg-brand-mist text-brand-forest-dark"
            : "text-brand-muted hover:bg-brand-mist hover:text-brand-ink",
        ].join(" ")}
        onFocus={() => hasSub && openMenu(item.label)}
        onBlur={() => hasSub && scheduleClose()}
      >
        {item.label}
        {hasSub ? <ChevronDown className="h-3.5 w-3.5" /> : null}
      </Link>

      {hasSub && openDropdown === item.label ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.16 }}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-60 rounded-lg border border-brand-line bg-brand-cream p-2 shadow-xl"
          role="menu"
          aria-label={item.label}
        >
          {item.sub!.map((sub) => (
            <Link
              key={sub.href}
              href={sub.href}
              className={[
                "flex items-center justify-between rounded-md px-3 py-2 text-sm transition",
                isActive(pathname, sub.href)
                  ? "bg-brand-mist text-brand-forest-dark"
                  : "text-brand-muted hover:bg-brand-mist hover:text-brand-ink",
              ].join(" ")}
            >
              <span>{sub.label}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          ))}
        </motion.div>
      ) : null}
    </div>
  );
}

function readRole(user: any) {
  const raw = user?.user_metadata?.role ?? user?.app_metadata?.role ?? "GUEST";
  return String(raw || "GUEST").toUpperCase();
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function mobileLinkClass(pathname: string, href: string, nested = false) {
  return [
    "block rounded-lg px-3 py-2 text-sm font-medium transition",
    nested ? "text-sm" : "",
    isActive(pathname, href)
      ? "bg-brand-mist text-brand-forest-dark"
      : "text-brand-muted hover:bg-brand-mist hover:text-brand-ink",
  ].join(" ");
}
