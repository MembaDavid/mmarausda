import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all visitations
export async function GET() {
  const visits = await prisma.visitation.findMany({
    include: { user: true },
    orderBy: { scheduledAt: "asc" },
  });
  return NextResponse.json(visits);
}

// CREATE a visitation
export async function POST(req: Request) {
  const data = await req.json();
  const visit = await prisma.visitation.create({
    data: {
      userId: data.userId,
      purpose: data.purpose,
      scheduledAt: new Date(data.scheduledAt),
    },
  });
  return NextResponse.json(visit);
}
