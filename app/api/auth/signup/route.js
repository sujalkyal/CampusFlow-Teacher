import prisma from "@repo/db/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, deptId, batchIds, subjectIds } = body;

    if (!name || !email || !password || !deptId || !batchIds?.length || !subjectIds?.length) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Check if teacher already exists
    const existingUser = await prisma.teacher.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create teacher
    const newTeacher = await prisma.teacher.create({
      data: {
        name,
        email,
        password: hashedPassword,
        dept_id: deptId,
        batches: batchIds,  // Storing as an array
        subjects: subjectIds, // Storing as an array
      },
    });

    // update teacher_id in subjects with subjectIds
    // await prisma.subject.updateMany({
    //   where: {
    //     id: {
    //       in: subjectIds,
    //     },
    //   },
    //   data: {
    //     teacher_id: newTeacher.id,
    //   },
    // });

    return NextResponse.json({ message: "Signup successful", user: newTeacher }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
