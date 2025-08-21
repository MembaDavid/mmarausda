import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET all announcements
export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: {
        createdAt: "desc", // newest first
      },
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

// ✅ POST create a new announcement
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, body: announcementBody, createdById } = body;

    // Validation
    if (!title || !announcementBody || !createdById) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: createdById } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create announcement
    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        body: announcementBody,
        createdById,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}
