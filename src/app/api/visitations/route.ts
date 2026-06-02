import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const visitations = await prisma.visitation.findMany({
      include: {
        user: { select: { id: true, fullName: true, email: true, phone: true } },
        assignedTo: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: { scheduledAt: "asc" },
    });

    return NextResponse.json(visitations);
  } catch (error) {
    console.error("GET /api/visitations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch visitations" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.userId || !body.purpose || !body.scheduledAt) {
      return NextResponse.json(
        { error: "userId, purpose, and scheduledAt are required" },
        { status: 400 }
      );
    }

    const visitation = await prisma.visitation.create({
      data: {
        userId: String(body.userId),
        assignedToId: cleanString(body.assignedToId),
        purpose: String(body.purpose),
        location: cleanString(body.location),
        scheduledAt: new Date(String(body.scheduledAt)),
        completedAt: body.completedAt ? new Date(String(body.completedAt)) : undefined,
        status: body.status || "PENDING",
        notes: cleanString(body.notes),
      },
      include: {
        user: { select: { id: true, fullName: true, email: true, phone: true } },
        assignedTo: { select: { id: true, fullName: true, email: true } },
      },
    });

    return NextResponse.json(visitation, { status: 201 });
  } catch (error) {
    console.error("POST /api/visitations error:", error);
    return NextResponse.json(
      { error: "Failed to create visitation" },
      { status: 500 }
    );
  }
}

function cleanString(value: unknown) {
  const text = String(value ?? "").trim();
  return text.length ? text : undefined;
}
