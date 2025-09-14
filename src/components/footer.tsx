"use client";

import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-[#0a1931] text-white py-12 mt-20" // Navy Blue base
    >
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo + Name */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Image
            src="/sda_logo.svg"
            alt="Church Logo"
            width={60}
            height={60}
            className="mb-4"
          />
          <h2 className="text-lg font-semibold">
            Seventh-Day Adventist Church
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Serving God. Serving People. Sharing Hope.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-xl font-bold mb-4 text-[#d4a017]">Quick Links</h3>{" "}
          {/* Gold accent */}
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-[#d4a017] transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-[#d4a017] transition">
                Events
              </Link>
            </li>
            <li>
              <Link
                href="/resources/sermons"
                className="hover:text-[#d4a017] transition"
              >
                Sermons
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#d4a017] transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#d4a017] transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact + Socials */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-xl font-bold mb-4 text-[#d4a017]">Contact Us</h3>
          <p className="text-sm">123 Church Road, Nairobi, Kenya</p>
          <p className="text-sm">Phone: +254 712 345 678</p>
          <p className="text-sm">Email: info@sdachurch.org</p>

          {/* Social icons */}
          <div className="flex space-x-4 mt-4">
            <a
              href="#"
              className="p-2 bg-[#d4a017] text-[#0a1931] rounded-full hover:bg-[#c49015] transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="p-2 bg-[#d4a017] text-[#0a1931] rounded-full hover:bg-[#c49015] transition"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="p-2 bg-[#d4a017] text-[#0a1931] rounded-full hover:bg-[#c49015] transition"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="p-2 bg-[#d4a017] text-[#0a1931] rounded-full hover:bg-[#c49015] transition"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 border-t border-gray-600 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Seventh-Day Adventist Church. All Rights
        Reserved.
      </div>
    </motion.footer>
  );
}
