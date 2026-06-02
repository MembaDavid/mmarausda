"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  CalendarDays,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  Send,
  Users,
} from "lucide-react";

const categories = [
  ["GENERAL", "General"],
  ["PRAYER_REQUEST", "Prayer Request"],
  ["VISITATION", "Visitation"],
  ["VOLUNTEERING", "Volunteering"],
  ["GIVING", "Giving / Donation"],
];

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [category, setCategory] = useState("GENERAL");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      setStatus("sending");
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Contact request failed");

      form.reset();
      setCategory("GENERAL");
      setStatus("sent");
      window.setTimeout(() => setStatus("idle"), 3200);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 3200);
    }
  }

  return (
    <main className="church-page pt-20">
      <section className="border-b border-brand-line bg-brand-cream">
        <div className="church-container grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="church-kicker">Contact</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl">
              Reach the church office
            </h1>
            <p className="church-copy mt-4 max-w-xl">
              Send questions, prayer requests, visitation details, volunteering
              interest, or giving inquiries. Messages are saved in the church
              database for follow-up.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <ContactCard
                icon={<Mail className="h-5 w-5" />}
                title="Email"
                value="info@mmu-sdachurch.org"
                href="mailto:info@mmu-sdachurch.org"
              />
              <ContactCard
                icon={<Phone className="h-5 w-5" />}
                title="Phone"
                value="+254 700 000 000"
                href="tel:+254700000000"
              />
              <ContactCard
                icon={<MapPin className="h-5 w-5" />}
                title="Location"
                value="Maasai Mara University, Narok"
                href="https://maps.google.com/?q=Maasai%20Mara%20University%2C%20Narok%2C%20Kenya"
              />
              <ContactCard
                icon={<CalendarDays className="h-5 w-5" />}
                title="Services"
                value="Sabbath School 9:00 AM, Divine 11:00 AM"
              />
            </div>

            <div className="church-card mt-6 overflow-hidden">
              <iframe
                title="Maasai Mara University location"
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Maasai+Mara+University,+Narok,+Kenya&output=embed"
              />
            </div>
          </div>

          <form onSubmit={onSubmit} className="church-card p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="name" autoComplete="name" />
              <Field
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
              />
              <Field
                label="Phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required={false}
              />
              <label>
                <span className="church-label">Message Type</span>
                <select
                  name="category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="church-input"
                >
                  {categories.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <Field
                label="Subject"
                name="subject"
                className="sm:col-span-2"
              />
            </div>

            {category === "VISITATION" ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Preferred date" name="preferredDate" type="date" />
                <Field label="Residence / Location" name="location" />
              </div>
            ) : null}

            {category === "VOLUNTEERING" ? (
              <div className="mt-4">
                <label>
                  <span className="church-label">Ministry Area</span>
                  <select name="ministryInterest" className="church-input">
                    {[
                      "Music",
                      "Youth",
                      "Welfare",
                      "Media",
                      "Ushering",
                      "Bible Study",
                    ].map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}

            <label className="mt-4 block">
              <span className="church-label">Message</span>
              <textarea
                required
                name="message"
                rows={7}
                placeholder="Write your message or request"
                className="church-input resize-y"
              />
            </label>

            <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-brand-muted">
              <input
                required
                type="checkbox"
                name="consent"
                className="mt-1 h-4 w-4 rounded border-brand-line text-brand-forest"
              />
              I consent to be contacted by MMU SDA Church about this inquiry.
            </label>

            <button
              type="submit"
              disabled={status === "sending"}
              className="church-button mt-6 w-full"
            >
              <Send className="h-4 w-4" />
              {status === "sending"
                ? "Sending"
                : status === "sent"
                ? "Message Sent"
                : "Send Message"}
            </button>

            {status === "sent" ? (
              <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                Thank you. Your message has been saved for follow-up.
              </p>
            ) : null}
            {status === "error" ? (
              <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                Something went wrong. Please try again.
              </p>
            ) : null}
          </form>
        </div>
      </section>

      <section className="church-section">
        <div className="church-container grid gap-4 md:grid-cols-3">
          <CarePoint
            icon={<HeartHandshake className="h-5 w-5" />}
            title="Prayer Requests"
            body="Confidential requests can be routed to pastoral and prayer teams."
          />
          <CarePoint
            icon={<Users className="h-5 w-5" />}
            title="Visitations"
            body="Member and student visits can be scheduled and followed up."
          />
          <CarePoint
            icon={<CalendarDays className="h-5 w-5" />}
            title="Ministry Service"
            body="Volunteer interests can be matched to ministry teams."
          />
        </div>
      </section>
    </main>
  );
}

function ContactCard({
  icon,
  title,
  value,
  href,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-forest text-brand-cream">
        {icon}
      </span>
      <span>
        <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
          {title}
        </span>
        <span className="mt-1 block text-sm font-medium text-brand-ink">
          {value}
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        className="church-card-plain flex gap-3 p-4 transition hover:border-brand-gold"
      >
        {content}
      </a>
    );
  }

  return <div className="church-card-plain flex gap-3 p-4">{content}</div>;
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  className = "",
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  className?: string;
  required?: boolean;
}) {
  return (
    <label className={className}>
      <span className="church-label">{label}</span>
      <input
        required={required}
        name={name}
        type={type}
        autoComplete={autoComplete}
        className="church-input"
      />
    </label>
  );
}

function CarePoint({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <article className="church-card-plain p-5">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-gold text-brand-ink">
        {icon}
      </span>
      <h2 className="mt-4 font-semibold text-brand-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-brand-muted">{body}</p>
    </article>
  );
}
