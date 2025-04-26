import { NextResponse } from "next/server";
import prisma from "../../../../../db/src/index";
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
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const assignmentDetails = await prisma.assignment.findUnique({
      where: {
        id : assignment_id,
      },
    });

    if (!assignmentDetails) {
      return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
    }

    return NextResponse.json(assignmentDetails, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
