import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET all sermons
export async function GET() {
  try {
    const sermons = await prisma.sermon.findMany({
      orderBy: {
        deliveredAt: "desc", // newest first
      },
    });

    return NextResponse.json(sermons);
  } catch (error) {
    console.error("Error fetching sermons:", error);
    return NextResponse.json(
      { error: "Failed to fetch sermons" },
      { status: 500 }
    );
  }
}

// ✅ POST create a new sermon
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, preacher, deliveredAt, mediaUrl, type, description } = body;

    // Validation
    if (!title || !preacher || !deliveredAt || !mediaUrl || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create sermon
    const newSermon = await prisma.sermon.create({
      data: {
        title,
        preacher,
        deliveredAt: new Date(deliveredAt),
        mediaUrl,
        type,
        description,
      },
    });

    return NextResponse.json(newSermon, { status: 201 });
  } catch (error) {
    console.error("Error creating sermon:", error);
    return NextResponse.json(
      { error: "Failed to create sermon" },
      { status: 500 }
    );
  }
}
