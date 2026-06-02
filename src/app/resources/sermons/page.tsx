import Header from "@/components/header";
import SermonsPage from "@/components/sermons";
import Footer from "@/components/footer";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Sermons() {
  const sermons = await prisma.sermon.findMany({
    where: { published: true },
    orderBy: { deliveredAt: "desc" },
    select: {
      id: true,
      title: true,
      preacher: true,
      deliveredAt: true,
      description: true,
      mediaUrl: true,
      type: true,
    },
  });

  return (
    <div>
      <Header />
      <SermonsPage
        initialSermons={sermons.map((sermon) => ({
          ...sermon,
          deliveredAt: sermon.deliveredAt.toISOString(),
        }))}
      />
      <Footer />
    </div>
  );
}
