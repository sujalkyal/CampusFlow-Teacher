// route to return submission details for the assignment for surrent session

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { assignment_id } = await req.json();

    if (!assignment_id) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const studentSubmissions = await prisma.submission.findMany({
        where: {
            assignment_id: assignment_id,
        },
        select: {
            student_id: true
        }
    });

    //console.log(" Student Submissions :  ", studentSubmissions);

    const students = await prisma.student.findMany({
        where: {
            id: {
                in: studentSubmissions.map(submission => submission.student_id),
            },
        },
    });

    //console.log(" Students :  ", students);
    return NextResponse.json(students, { status: 200 });
}