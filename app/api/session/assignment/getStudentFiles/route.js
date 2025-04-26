import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { student_id, assignment_id } = await req.json();

  if (!student_id || !assignment_id) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  const submission = await prisma.submission.findFirst({
    where: {
      student_id,
      assignment_id,
    },
    select: {
      files: true,
    },
  });

  return NextResponse.json({ files: submission?.files || [] }, { status: 200 });
}
