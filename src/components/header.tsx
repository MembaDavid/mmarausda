"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as motion from "motion/react-client";
import Image from "next/image";

type NavItem = {
  label: string;
  href: string;
  sub?: { label: string; href: string }[];
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [elevated, setElevated] = useState(false);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    {
      label: "Resources",
      href: "#",
      sub: [
        { label: "Sermons", href: "/resources/sermons" },
        { label: "Hymns", href: "/resources/hymns" },
        { label: "Bible Study", href: "/resources/bible-study" },
      ],
    },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            {/* Logo from public folder */}
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
                  className="relative"
                  onMouseEnter={() => hasSub && setOpenDropdown(item.label)}
                  onMouseLeave={() => hasSub && setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={[
                      "relative px-1 text-sm tracking-wide text-white/85 transition-colors",
                      active ? "text-yellow-300" : "hover:text-yellow-300",
                    ].join(" ")}
                  >
                    {item.label}
                    {/* underline animation */}
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
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 22,
                      }}
                      className="absolute left-0 mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 p-2 backdrop-blur-xl shadow-2xl"
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
        </div>
      </motion.div>
    </header>
  );
}
