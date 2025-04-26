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

    const { session_id } = await req.json();

    if (!session_id ) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newAssignment = await prisma.assignment.create({
      data: {
        session_id,
        title: null,
        description: null,
        endDate:  null,
      },
    });

    const updatedSession = await prisma.session.update({
      where: { id: session_id },
      data: { assignment_id: newAssignment.id },
    });


    return NextResponse.json(newAssignment, { status: 201 });

  } catch (error) {
    console.error("Error creating assignment:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
