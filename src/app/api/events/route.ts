import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { published: true },
      include: {
        _count: { select: { rsvps: true } },
        venue: { select: { id: true, name: true, location: true } },
        ministry: { select: { id: true, name: true, slug: true } },
        createdBy: { select: { id: true, fullName: true } },
      },
      orderBy: { start: "asc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, start } = body;

    if (!title || !start) {
      return NextResponse.json(
        { error: "Title and start date are required" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: cleanString(body.description),
        start: new Date(start),
        end: body.end ? new Date(String(body.end)) : undefined,
        category: body.category || "GENERAL",
        visibility: body.visibility || "PUBLIC",
        location: cleanString(body.location),
        coverUrl: cleanString(body.coverUrl),
        capacity: body.capacity ? Number(body.capacity) : undefined,
        registrationLink: cleanString(body.registrationLink),
        published: typeof body.published === "boolean" ? body.published : true,
        createdById: cleanString(body.createdById),
        ministryId: cleanString(body.ministryId),
        venueId: cleanString(body.venueId),
      },
      include: {
        _count: { select: { rsvps: true } },
        createdBy: { select: { id: true, fullName: true } },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

function cleanString(value: unknown) {
  const text = String(value ?? "").trim();
  return text.length ? text : undefined;
}
