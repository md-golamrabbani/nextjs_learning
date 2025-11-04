import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "0", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "50", 10);

    // Filters
    const name = searchParams.get("name");
    const language = searchParams.get("language");
    const createdAtFrom = searchParams.get("createdAtFrom");
    const createdAtTo = searchParams.get("createdAtTo");

    // Build "where" condition safely
    const where: any = {};

    if (name && name.trim() !== "") {
      where.AND = [
        {
          OR: [
            { name: { contains: name.trim() } },
            { name: { contains: name.trim().toLowerCase() } },
            { name: { contains: name.trim().toUpperCase() } },
          ],
        },
      ];
    }

    if (language && language.trim() !== "") {
      where.language = language.trim();
    }

    // Handle createdAt range carefully
    let createdAtFilter: { gte?: Date; lte?: Date } = {};
    if (createdAtFrom) {
      const fromDate = new Date(createdAtFrom);
      if (!isNaN(fromDate.getTime())) createdAtFilter.gte = fromDate;
    }
    if (createdAtTo) {
      const toDate = new Date(createdAtTo);
      if (!isNaN(toDate.getTime())) createdAtFilter.lte = toDate;
    }
    if (Object.keys(createdAtFilter).length > 0) {
      where.createdAt = createdAtFilter;
    }

    // Prisma query
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        skip: page * pageSize,
        take: pageSize,
        where,
        orderBy: { id: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return NextResponse.json({
      data: users,
      totalPages,
      totalCount,
      currentPage: page,
      pageSize,
      filtersUsed: where, // helpful for debugging — remove later
    });
  } catch (error: any) {
    console.error("❌ Error fetching users:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch users",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
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
