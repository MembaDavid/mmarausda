import { NextResponse } from "next/server";
import prisma  from "@/lib/prisma";

// GET all members
export async function GET() {
  const members = await prisma.member.findMany({
    include: { user: true },
  });
  return NextResponse.json(members);
}

// CREATE a member
export async function POST(req: Request) {
  const data = await req.json();
  const member = await prisma.member.create({
    data: {
      userId: data.userId,
      baptismDate: data.baptismDate ? new Date(data.baptismDate) : null,
      address: data.address,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      gender: data.gender,
    },
  });
  return NextResponse.json(member);
}
