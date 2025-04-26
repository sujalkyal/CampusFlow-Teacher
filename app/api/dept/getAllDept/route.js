// returns all the departments

import { NextResponse } from "next/server";
import db from "../../../../db/src/index";

export async function GET() {
  try {
    const allDept = await db.department.findMany({});
    
    if (!allDept) {
      return NextResponse.json({ error: "No departments found" }, { status: 404 });
    }

    return NextResponse.json(allDept, { status: 200 });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}