import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET all prayer requests
export async function GET() {
  try {
    const requests = await prisma.prayerRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // newest first
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching prayer requests:", error);
    return NextResponse.json({ error: "Failed to fetch prayer requests" }, { status: 500 });
  }
}

// ✅ POST create a new prayer request
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, request, status } = body;

    // Validation
    if (!userId || !request) {
      return NextResponse.json(
        { error: "Missing required fields: userId or request" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create prayer request
    const newRequest = await prisma.prayerRequest.create({
      data: {
        userId,
        request,
        status: status || "PENDING",
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating prayer request:", error);
    return NextResponse.json({ error: "Failed to create prayer request" }, { status: 500 });
  }
}
