// // src/app/api/members/route.ts
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// // GET all members with their User info
// export async function GET() {
//   try {
//     const members = await prisma.member.findMany({
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             phone: true,
//             role: true,
//             createdAt: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json(members);
//   } catch (error) {
//     console.error("GET /api/members error:", error);
//     return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
//   }
// }

// // POST create a new member (assumes User already exists)
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const {
//       userId,
//       baptismDate,
//       membershipStatus,
//       address,
//       dateOfBirth,
//       graduationYear,
//     } = body;

//     if (!userId) {
//       return NextResponse.json(
//         { error: "userId is required" },
//         { status: 400 }
//       );
//     }

//     const newMember = await prisma.member.create({
//       data: {
//         userId,
//         baptismDate: baptismDate ? new Date(baptismDate) : undefined,
//         membershipStatus: membershipStatus || "ACTIVE",
//         address,
//         dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
//         graduationYear: graduationYear ? new Date(graduationYear) : undefined,

//       },
//       include: {
//         user: true, // return linked User info too
//       },
//     });

//     return NextResponse.json(newMember, { status: 201 });
//   } catch (error) {
//     console.error("POST /api/members error:", error);
//     return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
//   }
// }
