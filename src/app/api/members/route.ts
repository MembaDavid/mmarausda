import { NextResponse } from "next/server";
import type { MembershipStatus, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

const membershipStatuses = new Set([
  "ACTIVE",
  "INACTIVE",
  "TRANSFERRED",
  "DECEASED",
]);

export async function GET() {
  try {
    const members = await prisma.memberProfile.findMany({
      orderBy: { joinedAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            createdAt: true,
          },
        },
        verifiedBy: {
          select: { id: true, fullName: true },
        },
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("GET /api/members error:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const data = memberData(body);
    const member = await prisma.memberProfile.upsert({
      where: { userId: String(body.userId) },
      create: data,
      update: { ...data, userId: undefined },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("POST /api/members error:", error);
    return NextResponse.json(
      { error: "Failed to save member" },
      { status: 500 }
    );
  }
}

function memberData(body: Record<string, unknown>): Prisma.MemberProfileUncheckedCreateInput {
  return {
    userId: String(body.userId),
    membershipStatus: parseMembershipStatus(body.membershipStatus),
    studentNumber: cleanString(body.studentNumber),
    faculty: cleanString(body.faculty),
    course: cleanString(body.course),
    yearOfStudy: numberOrNull(body.yearOfStudy),
    address: cleanString(body.address),
    dateOfBirth: dateOrNull(body.dateOfBirth),
    graduationYear: numberOrNull(body.graduationYear),
    baptismDate: dateOrNull(body.baptismDate),
    emergencyName: cleanString(body.emergencyName),
    emergencyPhone: cleanString(body.emergencyPhone),
  };
}

function parseMembershipStatus(value: unknown): MembershipStatus {
  const status = String(value ?? "ACTIVE").toUpperCase();
  return membershipStatuses.has(status) ? (status as MembershipStatus) : "ACTIVE";
}

function cleanString(value: unknown) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

function numberOrNull(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function dateOrNull(value: unknown) {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}
