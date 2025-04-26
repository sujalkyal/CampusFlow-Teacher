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

    const body = await req.json();
    const { id, title, description, endDate } = body;

    if (!id) {
      return NextResponse.json({ message: "Assignment ID is required" }, { status: 400 });
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id },
      data: {
        title,
        description,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    return NextResponse.json(updatedAssignment, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
