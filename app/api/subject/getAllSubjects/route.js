import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.batch_id) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }
    
    const { batch_id } = body;

    // Get the subjects from the batch
    const subjects = await prisma.subject.findMany({
      where: { batch_id }
    });

    if (subjects.length === 0) {
      return NextResponse.json({ message: "No subjects found" }, { status: 404 });
    }

    return NextResponse.json(subjects, { status: 200 });
  } catch (error) {
    console.error("Prisma Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
