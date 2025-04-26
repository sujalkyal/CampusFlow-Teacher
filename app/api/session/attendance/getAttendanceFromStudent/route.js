import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.subject_id || !Array.isArray(body.students)) {
      return NextResponse.json({ message: "Missing or invalid fields" }, { status: 400 });
    }

    const { subject_id, students } = body;
    const studentIds = students.map(student => student.id);

    const studentData = await prisma.student.findMany({
      where: { id: { in: studentIds } },
      include: {
        attendance: {
          where: { session: { subject_id } },
          select: { status: true }
        }
      },
    });

    // Process attendance counts
    const processedData = studentData.map(student => {
      const attendanceCounts = { PRESENT: 0, ABSENT: 0, LATE: 0 };

      student.attendance.forEach(record => {
        if (attendanceCounts.hasOwnProperty(record.status)) {
          attendanceCounts[record.status]++;
        }
      });

      return {
        id: student.id,
        name: student.name,
        presentDays: attendanceCounts.PRESENT,
        absentDays: attendanceCounts.ABSENT,
        lateDays: attendanceCounts.LATE
      };
    });

    return NextResponse.json(processedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching students & attendance:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
