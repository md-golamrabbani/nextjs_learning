import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch the public JSON file using an absolute URL
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/employee.json`
    );

    if (!res.ok) {
      throw new Error("Failed to load employee.json");
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading employee.json:", error);
    return NextResponse.json(
      { error: "Failed to load employee data" },
      { status: 500 }
    );
  }
}
