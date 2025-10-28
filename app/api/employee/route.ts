import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface Employee {
  id: number;
  name: string;
  company: string;
  phone: string;
  pabx: string;
  email: string;
  image: string;
}

interface EmployeesData {
  employees: Employee[];
}

export async function GET() {
  try {
    // Build absolute path to the JSON file
    const filePath = path.join(process.cwd(), "employee.json");

    // Read the file content
    const jsonData = await fs.readFile(filePath, "utf8");

    // Parse JSON data
    const data: EmployeesData = JSON.parse(jsonData);

    // Return as JSON response
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading employee.json:", error);
    return NextResponse.json(
      { error: "Failed to load employee data" },
      { status: 500 }
    );
  }
}
