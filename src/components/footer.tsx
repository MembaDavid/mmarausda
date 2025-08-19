"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Column 1: About */}
        <div>
          <h3 className="text-2xl font-bold text-yellow-300 mb-4">About</h3>
          <p className="text-white/80 text-sm leading-relaxed">
            Seventh Day Adventist Maasai Mara University Church is a vibrant student
            fellowship community, rooted in worship, service, and mission. Together
            we grow in faith and impact lives for Christ.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-2xl font-bold text-yellow-300 mb-4">Quick Links</h3>
          <ul className="space-y-2 text-white/80">
            <li><Link href="/" className="hover:text-yellow-300 transition-colors">Home</Link></li>
            <li><Link href="/events" className="hover:text-yellow-300 transition-colors">Events</Link></li>
            <li><Link href="/about" className="hover:text-yellow-300 transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-yellow-300 transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div>
          <h3 className="text-2xl font-bold text-yellow-300 mb-4">Resources</h3>
          <ul className="space-y-2 text-white/80">
            <li>
              <a href="/bulletin.pdf" target="_blank" className="hover:text-yellow-300 transition-colors">
                Weekly Bulletin
              </a>
            </li>
            <li>
              <a href="/hymnal.pdf" target="_blank" className="hover:text-yellow-300 transition-colors">
                SDA Hymnal (PDF)
              </a>
            </li>
            <li>
              <a href="/church-program.pdf" target="_blank" className="hover:text-yellow-300 transition-colors">
                Church Program
              </a>
            </li>
            <li>
              <a href="/constitution.pdf" target="_blank" className="hover:text-yellow-300 transition-colors">
                Church Constitution
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div>
          <h3 className="text-2xl font-bold text-yellow-300 mb-4">Contact</h3>
          <ul className="space-y-2 text-white/80">
            <li>Email: <a href="mailto:info@mmuchurch.org" className="hover:text-yellow-300">info@mmuchurch.org</a></li>
            <li>Phone: <a href="tel:+254700000000" className="hover:text-yellow-300">+254 700 000 000</a></li>
            <li>Location: Maasai Mara University, Kenya</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 mt-12 pt-6 text-center text-sm text-white/60">
        © {new Date().getFullYear()} SDA Maasai Mara University Church. All rights reserved.
      </div>
    </footer>
  )
}
