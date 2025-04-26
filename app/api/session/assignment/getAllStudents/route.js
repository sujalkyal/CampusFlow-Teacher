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

    //from assignment_id get session_id
    const session_id = await prisma.assignment.findUnique({
        where: {
            id: assignment_id,
        },
        select: {
            session_id: true,
        },
    });

    //from seession_id get subject_id
    const subject_id = await prisma.session.findUnique({
        where: {
            id: session_id.session_id,
        },
        select: {
            subject_id: true,
        },
    });

    //from subject_id get batch_id
    const batch_id = await prisma.subject.findUnique({
        where: {
            id: subject_id.subject_id,
        },
        select: {
            batch_id: true,
        },
    });

    //from batch_id get all students
    const students = await prisma.student.findMany({
        where: {
            batch_id: batch_id.batch_id,
        },
    });

    return NextResponse.json(students, { status: 200 });
}