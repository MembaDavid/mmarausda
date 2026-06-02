import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const requests = await prisma.prayerRequest.findMany({
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        assignedTo: { select: { id: true, fullName: true } },
        updates: { orderBy: { createdAt: "desc" }, take: 3 },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("GET /api/prayer-requests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch prayer requests" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.userId || !body.request) {
      return NextResponse.json(
        { error: "userId and request are required" },
        { status: 400 }
      );
    }

    const request = await prisma.prayerRequest.create({
      data: {
        userId: String(body.userId),
        assignedToId: cleanString(body.assignedToId),
        category: body.category || "GENERAL",
        request: String(body.request),
        isConfidential: Boolean(body.isConfidential),
        status: body.status || "PENDING",
      },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        assignedTo: { select: { id: true, fullName: true } },
      },
    });

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    console.error("POST /api/prayer-requests error:", error);
    return NextResponse.json(
      { error: "Failed to create prayer request" },
      { status: 500 }
    );
  }
}

function cleanString(value: unknown) {
  const text = String(value ?? "").trim();
  return text.length ? text : undefined;
}
