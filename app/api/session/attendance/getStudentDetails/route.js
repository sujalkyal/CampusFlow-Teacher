import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.batch_id) {
      return NextResponse.json({ message: "Missing or invalid batch_id" }, { status: 400 });
    }

    const { batch_id } = body;

    // Validate if batch exists
    const batch = await prisma.batch.findUnique({
      where: { id: batch_id },
      include: {
        students: {
          include: {
            attendance: true,
          },
        },
      },
    });

    if (!batch) {
      return NextResponse.json({ message: "Batch not found" }, { status: 404 });
    }

    return NextResponse.json(batch.students, { status: 200 });
  } catch (error) {
    console.error("Error fetching student details:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
