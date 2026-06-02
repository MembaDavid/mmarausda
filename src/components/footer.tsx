"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import type { IconType } from "react-icons";

const quickLinks = [
  ["Home", "/"],
  ["Events", "/events"],
  ["Sermons", "/resources/sermons"],
  ["Bible Study", "/resources/bible_studies"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

const socialLinks: { Icon: IconType; label: string; href: string }[] = [
  { Icon: FaFacebookF, label: "Facebook", href: "#" },
  { Icon: FaInstagram, label: "Instagram", href: "#" },
  { Icon: FaYoutube, label: "YouTube", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-forest-dark text-brand-cream">
      <div className="church-container grid gap-10 py-12 md:grid-cols-[1.15fr_0.85fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-white">
              <Image src="/sda_logo.svg" alt="SDA logo" width={38} height={38} />
            </span>
            <div>
              <h2 className="font-semibold">MMU SDA Church</h2>
              <p className="text-sm text-brand-cream/70">
                Maasai Mara University, Narok
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-6 text-brand-cream/76">
            Serving God, serving people, and sharing hope through worship,
            discipleship, welfare, and campus fellowship.
          </p>
          <div className="mt-5 flex gap-2">
            {socialLinks.map(({ Icon, label, href }) => (
              <a
                key={label as string}
                href={href}
                aria-label={label as string}
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-white/10 text-brand-cream transition hover:bg-brand-gold hover:text-brand-ink"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-gold">
            Quick Links
          </h3>
          <ul className="mt-4 grid gap-2">
            {quickLinks.map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-brand-cream/76 transition hover:text-brand-gold"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-gold">
            Contact
          </h3>
          <ul className="mt-4 grid gap-3 text-sm text-brand-cream/76">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
              Maasai Mara University, Narok, Kenya
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
              +254 700 000 000
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
              info@mmu-sdachurch.org
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="church-container flex flex-col gap-2 py-4 text-xs text-brand-cream/62 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Copyright {new Date().getFullYear()} Maasai Mara University SDA
            Church.
          </span>
          <span>Built for worship, records, and ministry coordination.</span>
        </div>
      </div>
    </footer>
  );
}
