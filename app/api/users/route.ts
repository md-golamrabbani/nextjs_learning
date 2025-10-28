import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/prisma/generated/client";

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { id: "desc" },
  });
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      country: data.country,
      avatar: data.avatar || "",
    },
  });
  return NextResponse.json(newUser);
}
