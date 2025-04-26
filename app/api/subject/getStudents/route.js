// route to get students of a subject

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // get subject_id from json body
        const { subject_id } = await req.json();

        if (!subject_id) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        // get batch id from subject_id
        const subject = await prisma.subject.findUnique({
            where: {
                id: subject_id
            },
            include: {
                sessions: true,
            }
        });

        let sessionCount = 0;
        let sessions = [];
        // count sessions whose date is less than or equal to today
        if (subject && subject.sessions) {
            sessions = subject.sessions.filter(session => new Date(session.date) <= new Date());
        }

        sessionCount = sessions.length;

        // get the students for the subject
        const students = await prisma.student.findMany({
            where: {
                batch_id: subject.batch_id
            },
            include: {
                attendance: true,
            }
        });

        // filter the attendance where status is 'PRESENT' or 'LATE'
        students.forEach(student => {
            student.attendance = student.attendance.filter(att => {
                return att.status === 'PRESENT' || att.status === 'LATE'
            })
        });

        // for each student , then for each sttendance record , check if the session_id is in the sessions array
        // if it is not , then remove the attendance record
        students.forEach(student => {
            student.attendance = student.attendance.filter(att => {
                return sessions.some(session => session.id === att.session_id)
            })
        });

        return NextResponse.json({students,sessionCount}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}