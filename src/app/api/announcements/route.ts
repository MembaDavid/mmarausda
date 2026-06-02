import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      where: { published: true },
      include: {
        createdBy: { select: { id: true, fullName: true } },
      },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("GET /api/announcements error:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title = cleanString(body.title);
    const announcementBody = cleanString(body.body);

    if (!title || !announcementBody) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 }
      );
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        body: announcementBody,
        summary: cleanString(body.summary),
        audience: body.audience || "PUBLIC",
        status: body.status || "PUBLISHED",
        pinned: Boolean(body.pinned),
        published: typeof body.published === "boolean" ? body.published : true,
        expiresAt: body.expiresAt ? new Date(String(body.expiresAt)) : undefined,
        createdById: cleanString(body.createdById),
      },
      include: {
        createdBy: { select: { id: true, fullName: true } },
      },
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error("POST /api/announcements error:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}

function cleanString(value: unknown) {
  const text = String(value ?? "").trim();
  return text.length ? text : undefined;
}
