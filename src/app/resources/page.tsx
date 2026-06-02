import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  BookOpen,
  CalendarDays,
  FileText,
  HandHeart,
  Library,
  Video,
} from "lucide-react";

const resources = [
  {
    title: "Sermons",
    body: "Recent messages, media links, and sermon notes.",
    href: "/resources/sermons",
    icon: Video,
  },
  {
    title: "Bible Study",
    body: "Study guides, Sabbath School notes, and discipleship material.",
    href: "/resources/bible_studies",
    icon: BookOpen,
  },
  {
    title: "Events Calendar",
    body: "Worship services, ministry meetings, and outreach dates.",
    href: "/events",
    icon: CalendarDays,
  },
  {
    title: "Prayer and Care",
    body: "Send requests and schedule pastoral follow-up.",
    href: "/contact",
    icon: HandHeart,
  },
  {
    title: "Church Documents",
    body: "Policies, reports, forms, and ministry downloads.",
    href: "/resources",
    icon: FileText,
  },
  {
    title: "Ministry Library",
    body: "Curated resources for leaders, members, and volunteers.",
    href: "/about",
    icon: Library,
  },
];

export default function ResourcesPage() {
  return (
    <>
      <Header />
      <main className="church-page pt-20">
        <section className="border-b border-brand-line bg-brand-cream">
          <div className="church-container py-14">
            <p className="church-kicker">Resources</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl">
              Church resource hub
            </h1>
            <p className="church-copy mt-3 max-w-2xl">
              Sermons, Bible study materials, ministry documents, events, and
              care pathways gathered in one place.
            </p>
          </div>
        </section>

        <section className="church-section">
          <div className="church-container grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map(({ title, body, href, icon: Icon }) => (
              <Link
                key={title}
                href={href}
                className="church-card-plain p-5 transition hover:border-brand-gold hover:bg-white"
              >
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-forest text-brand-cream">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-xl font-semibold text-brand-ink">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-brand-muted">{body}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
