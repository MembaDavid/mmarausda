import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const offerings = await prisma.offering.findMany({
      include: {
        fund: { select: { id: true, name: true, code: true, type: true } },
        user: { select: { id: true, fullName: true, email: true, role: true } },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(offerings);
  } catch (error) {
    console.error("GET /api/offerings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch offerings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, category, amount, paymentMethod } = body;

    if (!userId || !category || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: String(userId) } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const offering = await prisma.offering.create({
      data: {
        userId: String(userId),
        fundId: cleanString(body.fundId),
        category,
        amount,
        currency: cleanString(body.currency) || "KES",
        paymentMethod,
        transactionId: cleanString(body.transactionId),
        receiptNumber: cleanString(body.receiptNumber),
        note: cleanString(body.note),
        date: body.date ? new Date(String(body.date)) : undefined,
      },
      include: {
        fund: { select: { id: true, name: true, code: true, type: true } },
        user: { select: { id: true, fullName: true, email: true, role: true } },
      },
    });

    return NextResponse.json(offering, { status: 201 });
  } catch (error) {
    console.error("POST /api/offerings error:", error);
    return NextResponse.json(
      { error: "Failed to create offering" },
      { status: 500 }
    );
  }
}

function cleanString(value: unknown) {
  const text = String(value ?? "").trim();
  return text.length ? text : undefined;
}
