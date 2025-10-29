// app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "desc" },
      take: 500, // protect against returning an insane number by default
    });
    return NextResponse.json({ users });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Basic server-side validation (you can replace with Zod here too)
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "name and email required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone ?? "",
        address: body.address ?? "",
        country: body.country ?? "",
        avatar: body.avatar ?? "",
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
