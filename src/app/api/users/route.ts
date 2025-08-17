import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all users
export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      memberProfile: true,
      offerings: true,
      prayerRequests: true,
      visitations: true,
    },
  });
  return NextResponse.json(users);
}

// CREATE a user
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        password: data.password, // ⚠️ should be hashed in real app
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
