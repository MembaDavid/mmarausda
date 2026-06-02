import Hero from "@/components/hero";
import Footer from "@/components/footer";
import Header from "@/components/header";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getLandingData() {
  const now = new Date();
  const [nextEvent, latestSermon, announcements] = await Promise.all([
    prisma.event.findFirst({
      where: { published: true, start: { gte: now } },
      orderBy: { start: "asc" },
      select: {
        id: true,
        title: true,
        start: true,
        end: true,
        location: true,
        category: true,
      },
    }),
    prisma.sermon.findFirst({
      where: { published: true },
      orderBy: { deliveredAt: "desc" },
      select: {
        id: true,
        title: true,
        preacher: true,
        deliveredAt: true,
        mediaUrl: true,
      },
    }),
    prisma.announcement.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, title: true, body: true },
    }),
  ]);

  return {
    nextEvent: nextEvent
      ? {
          ...nextEvent,
          start: nextEvent.start.toISOString(),
          end: nextEvent.end?.toISOString() ?? null,
        }
      : null,
    latestSermon: latestSermon
      ? {
          ...latestSermon,
          deliveredAt: latestSermon.deliveredAt.toISOString(),
        }
      : null,
    announcements,
  };
}

export default async function Landing() {
  const landing = await getLandingData();

  return (
    <div>
      <Header />
      <Hero {...landing} />
      <Footer />
    </div>
  );
}
