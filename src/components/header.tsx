"use client"

import { useState } from "react"
import Link from "next/link"
import * as motion from "motion/react-client"

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const navItems = [
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
  ]

  return (
    <header className="fixed top-0 left-0 w-full bg-black/70 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-yellow-300 font-bold text-xl tracking-wide"
        >
          SDA MMU Church
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-white/90 relative">
          {navItems.map((item) => {
            const hasSub = item.sub && item.sub.length > 0
            const open = openDropdown === item.label

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => hasSub && setOpenDropdown(item.label)}
                onMouseLeave={() => hasSub && setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="hover:text-yellow-300 transition-colors"
                >
                  {item.label}
                </Link>

                {/* Dropdown */}
                {hasSub && open && (
                  <motion.div
                    key="dropdown"
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="absolute left-0 mt-2 w-[320px] rounded-2xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl"
                    role="menu"
                    aria-label={item.label}
                  >
                    <div className="flex flex-col p-4 space-y-3">
                      {item.sub.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="text-white/90 hover:text-yellow-300 transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <motion.div
          key="mobile-nav"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-black/90 px-6 pb-4 space-y-4 text-white/90"
        >
          {navItems.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                className="block hover:text-yellow-300 transition-colors"
              >
                {item.label}
              </Link>
              {item.sub && (
                <div className="ml-4 mt-2 space-y-2">
                  {item.sub.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      className="block text-white/70 hover:text-yellow-300 transition-colors"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </motion.div>
      )}
    </header>
  )
}
