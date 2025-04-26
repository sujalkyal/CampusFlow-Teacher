import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.student_id || !body.session_id || !body.status) {
      return NextResponse.json(
        { message: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    const { student_id, session_id, status } = body;

    // Validate enum status
    const validStatus = ["PRESENT", "ABSENT", "LATE"];
    if (!validStatus.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    // Ensure student & session exist
    const studentExists = await prisma.student.findUnique({
      where: { id: student_id },
    });
    const sessionExists = await prisma.session.findUnique({
      where: { id: session_id },
    });

    if (!studentExists || !sessionExists) {
      return NextResponse.json(
        { message: "Invalid student_id or session_id" },
        { status: 404 }
      );
    }

    // Check if attendance already exists
    const existing = await prisma.attendance.findUnique({
      where: {
        student_id_session_id: { student_id, session_id },
      },
    });

    // If status is same, delete the record (toggle off)
    if (existing && existing.status === status) {
      await prisma.attendance.delete({
        where: {
          student_id_session_id: { student_id, session_id },
        },
      });

      return NextResponse.json(
        { message: "Attendance removed" },
        { status: 200 }
      );
    }

    // Upsert attendance: update if exists, otherwise create
    const attendance = await prisma.attendance.upsert({
      where: {
        student_id_session_id: { student_id, session_id }, // Uses unique constraint
      },
      update: { status },
      create: { student_id, session_id, status },
    });

    return NextResponse.json(attendance, { status: 200 });
  } catch (error) {
    console.error("Error creating/updating attendance:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
