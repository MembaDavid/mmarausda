import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const categories = new Set([
  "GENERAL",
  "PRAYER_REQUEST",
  "VISITATION",
  "VOLUNTEERING",
  "GIVING",
]);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = cleanString(body.name);
    const email = cleanString(body.email);
    const subject = cleanString(body.subject);
    const message = cleanString(body.message);
    const category = String(body.category ?? "GENERAL").toUpperCase();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are required" },
        { status: 400 }
      );
    }

    if (!categories.has(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const preferredDate = body.preferredDate
      ? new Date(String(body.preferredDate))
      : null;

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: cleanString(body.phone),
        category: category as any,
        subject,
        message,
        preferredDate:
          preferredDate && !Number.isNaN(preferredDate.getTime())
            ? preferredDate
            : null,
        location: cleanString(body.location),
        ministryInterest: cleanString(body.ministryInterest),
        consent: Boolean(body.consent),
      },
    });

    return NextResponse.json({ message: contactMessage }, { status: 201 });
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json(
      { error: "Failed to save contact message" },
      { status: 500 }
    );
  }
}

function cleanString(value: unknown) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}
