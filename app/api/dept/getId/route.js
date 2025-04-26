// get id from name

import { NextResponse } from "next/server";
import db from "@repo/db/client";
import { authOptions } from "../../../lib/auth";
import { getServerSession } from "next-auth/next";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "Department name is required" }, { status: 400 });
  }

  try {
    const dept_id = await db.department.findFirst({
      where: {
        name: name,
      },
      select: {
        id: true,
      },
    });

    if (!dept_id) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    return NextResponse.json(dept_id);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}