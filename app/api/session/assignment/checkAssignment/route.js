import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { session_id } = body;

  if (!session_id) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const sessionData = await prisma.session.findUnique({
      where: { id: session_id }
    });

    if (sessionData?.assignment_id) {
      return NextResponse.json({
        exists: true,
        assignmentId: sessionData.assignment_id
      });
    } else {
      return NextResponse.json({ exists: false });
    }

  } catch (error) {
    console.error("Error checking assignment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
