import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const roles = new Set([
  "ADMIN",
  "EDITOR",
  "MEMBER",
  "GUEST",
  "ASSOCIATE",
  "TREASURER",
  "CLERK",
  "STAFF",
]);

const statuses = new Set(["ACTIVE", "PENDING", "SUSPENDED", "ARCHIVED"]);
const genders = new Set(["MALE", "FEMALE"]);

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        memberProfile: {
          select: {
            membershipStatus: true,
            graduationYear: true,
          },
        },
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const id = String(body.id ?? "");

    if (!id) {
      return NextResponse.json({ error: "User id is required" }, { status: 400 });
    }

    const role = body.role ? String(body.role).toUpperCase() : undefined;
    const status = body.status ? String(body.status).toUpperCase() : undefined;
    const gender = body.gender ? String(body.gender).toUpperCase() : null;

    if (role && !roles.has(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (status && !statuses.has(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    if (gender && !genders.has(gender)) {
      return NextResponse.json({ error: "Invalid gender" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        fullName: cleanString(body.fullName),
        email: cleanString(body.email),
        phone: cleanString(body.phone),
        homeChurch: cleanString(body.homeChurch),
        ...(role ? { role: role as any } : {}),
        ...(status ? { status: status as any } : {}),
        gender: gender as any,
      },
      include: {
        memberProfile: {
          select: {
            membershipStatus: true,
            graduationYear: true,
          },
        },
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("PATCH /api/users error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

function cleanString(value: unknown) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}
