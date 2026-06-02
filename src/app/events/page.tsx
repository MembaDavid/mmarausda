import EventsPage from "@/components/events";
import Header from "@/components/header";
import Footer from "@/components/footer";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EventsPageWrapper() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { start: "asc" },
    include: { _count: { select: { rsvps: true } } },
  });

  return (
    <main>
      <Header />
      <EventsPage
        initialEvents={events.map((event) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          start: event.start.toISOString(),
          end: event.end?.toISOString() ?? null,
          location: event.location,
          coverUrl: event.coverUrl,
          category: event.category,
          rsvpCount: event._count.rsvps,
        }))}
      />
      <Footer />
    </main>
  );
}
