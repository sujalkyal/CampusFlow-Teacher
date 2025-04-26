// app/api/assignment/files/route.js
import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { assignment_id } = await req.json();

    if (!assignment_id) {
      return NextResponse.json({ message: "Missing assignment_id" }, { status: 400 });
    }

    const assignment = await prisma.assignment.findUnique({
      where: {
        id: assignment_id,
      },
      select: {
        files: true,
      },
    });

    //console.log("Assignment:", assignment);

    if (!assignment) {
      return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
    }

    return NextResponse.json({ files: assignment.files }, { status: 200 });
  } catch (err) {
    console.error("Error fetching files:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
