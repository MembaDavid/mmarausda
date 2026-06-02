import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const sermons = await prisma.sermon.findMany({
      where: { published: true },
      include: {
        series: { select: { id: true, title: true, slug: true } },
        preacherRef: { select: { id: true, fullName: true } },
      },
      orderBy: { deliveredAt: "desc" },
    });

    return NextResponse.json(sermons);
  } catch (error) {
    console.error("GET /api/sermons error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sermons" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title || !body.deliveredAt) {
      return NextResponse.json(
        { error: "Title and delivery date are required" },
        { status: 400 }
      );
    }

    const sermon = await prisma.sermon.create({
      data: {
        title: String(body.title),
        preacher: cleanString(body.preacher),
        preacherId: cleanString(body.preacherId),
        seriesId: cleanString(body.seriesId),
        deliveredAt: new Date(String(body.deliveredAt)),
        scripture: cleanString(body.scripture),
        mediaUrl: cleanString(body.mediaUrl),
        notesUrl: cleanString(body.notesUrl),
        thumbnailUrl: cleanString(body.thumbnailUrl),
        type: body.type || "VIDEO",
        description: cleanString(body.description),
        published: typeof body.published === "boolean" ? body.published : true,
      },
    });

    return NextResponse.json(sermon, { status: 201 });
  } catch (error) {
    console.error("POST /api/sermons error:", error);
    return NextResponse.json(
      { error: "Failed to create sermon" },
      { status: 500 }
    );
  }
}

function cleanString(value: unknown) {
  const text = String(value ?? "").trim();
  return text.length ? text : undefined;
}
