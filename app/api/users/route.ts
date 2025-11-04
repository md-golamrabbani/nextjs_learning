// app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "0");
  const pageSize = parseInt(searchParams.get("pageSize") || "50");

  const totalCount = await prisma.user.count();
  const totalPages = Math.ceil(totalCount / pageSize);

  const users = await prisma.user.findMany({
    skip: page * pageSize,
    take: pageSize,
    orderBy: { id: "desc" },
  });

  return NextResponse.json({ data: users, totalPages, totalCount });
}

export async function POST(request: Request) {
  // try {
  //   const body = await request.json();
  //   // Basic server-side validation (you can replace with Zod here too)
  //   if (!body.name || !body.email) {
  //     return NextResponse.json(
  //       { error: "name and email required" },
  //       { status: 400 }
  //     );
  //   }
  //   const user = await prisma.user.create({
  //     data: {
  //       name: body.name,
  //       email: body.email,
  //       phone: body.phone ?? "",
  //       address: body.address ?? "",
  //       country: body.country ?? "",
  //       avatar: body.avatar ?? "",
  //     },
  //   });
  //   return NextResponse.json(user, { status: 201 });
  // } catch (err) {
  //   console.error(err);
  //   return NextResponse.json(
  //     { error: "Failed to create user" },
  //     { status: 500 }
  //   );
  // }
}
