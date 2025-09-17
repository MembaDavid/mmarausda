// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import bcrypt from "bcryptjs";

// // ✅ GET all users
// export async function GET() {
//   try {
//     const users = await prisma.user.findMany({
//       select: {
//         id: true,
//         role: true,
//         gender: true,
//         createdAt: true,
//         offerings: true, // 👈 just add relations here
//         events: true,
//         announcements: true,
//         prayerRequests: true,
//         visitations: true,
//         memberProfile: true,
//       },
//     });

//     return NextResponse.json(users, { status: 200 });
//   } catch (error) {
//     console.error("GET /api/users error:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch users" },
//       { status: 500 }
//     );
//   }
// }

// // ✅ CREATE a new user
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { name, email, phone, role, password, gender } = body;

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await prisma.user.create({
//       data: {
//         role: role || "GUEST", // Default to GUEST if not provided
//       },
//       select: {
//         id: true,

//         role: true,
//         gender: true,
//         createdAt: true,
//       },
//     });

//     return NextResponse.json(user, { status: 201 });
//   } catch (error) {
//     console.error("POST /api/users error:", error);
//     return NextResponse.json(
//       { error: "Failed to create user" },
//       { status: 500 }
//     );
//   }
// }
