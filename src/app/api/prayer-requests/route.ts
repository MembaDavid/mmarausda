import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all requests
export async function GET() {
  const requests = await prisma.prayerRequest.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(requests);
}

// CREATE request
export async function POST(req: Request) {
  const data = await req.json();
  const request = await prisma.prayerRequest.create({
    data: {
      userId: data.userId,
      request: data.request,
    },
  });
  return NextResponse.json(request);
}
