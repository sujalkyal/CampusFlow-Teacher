import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST(req) {
    //get the subjects from all the batches in the department
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

        // get the subjects from the batch
        const subject = await prisma.subject.findUnique({
            where: {
                id: subject_id
            }
        });

        // get all students from the batch id present in subject
        const students = await prisma.student.findMany({
            where: {
                batch_id: subject.batch_id
            }
        });

        // get all sessions from the subject id present in subject
        const sessions = await prisma.session.findMany({
            where: {
                subject_id: subject.id
            }
        });

        // loop through the sessions and get the assignment for each session
        // make an array of assignments for each session

        let assignments = [];

        for (let i = 0; i < sessions.length; i++) {
            const assignment = await prisma.assignment.findUnique({
                where: {
                    session_id: sessions[i].id
                }
            });
            assignments.push(assignment);
        }

        return NextResponse.json(subject,{student_num: students.length},sessions,assignments, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}