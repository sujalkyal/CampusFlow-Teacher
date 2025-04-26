import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST(req) {
    try {
        const user = await getServerSession(authOptions);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { subject_id } = await req.json();

        if (!subject_id) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        const subject = await prisma.subject.findUnique({
            where: {
                id: subject_id,
            }
        });

        const batchId = subject.batch_id;
        const batch = await prisma.batch.findUnique({
            where: {
                id: batchId,
            }
        });

        const batchName = batch.name;
        const students = await prisma.student.findMany({
            where: {
                batch_id: batchId,
            }
        });

        const deptId = batch.dept_id

        const dept = await prisma.department.findUnique({
            where: {
                id: deptId,
            }
        });
        const deptName = dept.name;


        return NextResponse.json({batchName, students, subject, deptName}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}