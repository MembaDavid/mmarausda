import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET all events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        start: "asc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// ✅ POST create a new event
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      start,
      end,
      category,
      registrationLink,
      createdById,
    } = body;

    if (!title || !start || !end || !category || !createdById) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        start: new Date(start),
        end: new Date(end),
        category,
        registrationLink,
        createdById,
      },
      include: {
        createdBy: {
          select: { id: true },
        },
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
