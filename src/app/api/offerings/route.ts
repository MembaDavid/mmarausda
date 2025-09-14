// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// // ✅ GET all offerings
// export async function GET() {
//   try {
//     const offerings = await prisma.offering.findMany({
//       include: {
//         user: {
//           select: { id: true, name: true, email: true, phone: true },
//         },
//       },
//       orderBy: {
//         date: "desc", // newest first
//       },
//     });

//     return NextResponse.json(offerings);
//   } catch (error) {
//     console.error("Error fetching offerings:", error);
//     return NextResponse.json({ error: "Failed to fetch offerings" }, { status: 500 });
//   }
// }

// // ✅ POST create a new offering
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { userId, category, amount, paymentMethod, transactionId, date } = body;

//     // Validation
//     if (!userId || !category || !amount || !paymentMethod) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     // Check if user exists
//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // Create offering
//     const newOffering = await prisma.offering.create({
//       data: {
//         userId,
//         category,
//         amount,
//         paymentMethod,
//         transactionId,
//         date: date ? new Date(date) : undefined,
//       },
//       include: {
//         user: { select: { id: true, name: true, email: true, phone: true } },
//       },
//     });

//     return NextResponse.json(newOffering, { status: 201 });
//   } catch (error) {
//     console.error("Error creating offering:", error);
//     return NextResponse.json({ error: "Failed to create offering" }, { status: 500 });
//   }
// }
