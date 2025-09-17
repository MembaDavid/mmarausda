import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET all visitations
export async function GET() {
  try {
    const visitations = await prisma.visitation.findMany({
      include: {
        user: {
          select: {
            id: true,
            authUserId: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc", // earliest first
      },
    });

    return NextResponse.json(visitations);
  } catch (error) {
    console.error("Error fetching visitations:", error);
    return NextResponse.json(
      { error: "Failed to fetch visitations" },
      { status: 500 }
    );
  }
}

// ✅ POST create a new visitation
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, purpose, scheduledAt, status } = body;

    // Validation
    if (!userId || !purpose || !scheduledAt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Make sure the user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create visitation
    const newVisitation = await prisma.visitation.create({
      data: {
        userId,
        purpose,
        scheduledAt: new Date(scheduledAt),
        status: status || "PENDING",
      },
      include: {
        user: {
          select: { id: true, authUserId: true },
        },
      },
    });

    return NextResponse.json(newVisitation, { status: 201 });
  } catch (error) {
    console.error("Error creating visitation:", error);
    return NextResponse.json(
      { error: "Failed to create visitation" },
      { status: 500 }
    );
  }
}
