//route to give attendance of a session

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.session_id) {
      return NextResponse.json({ message: "Missing or invalid fields" }, { status: 400 });
    }

    const { session_id } = body;

    const attendanceData = await prisma.attendance.findMany({
      where: { session_id },
      include: {
        student: {
          select: { id: true, name: true },
        },
      },
    });

    // Process attendance counts
    const processedData = attendanceData.map(record => ({
      id: record.student.id,
      name: record.student.name,
      status: record.status,
    }));

    return NextResponse.json(processedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}