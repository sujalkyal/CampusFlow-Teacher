import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import bcrypt from "bcrypt";

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const teacherId = session.user.id;
        const { name, email, newPassword, oldPassword, dept_name, batches, subjects, image } = await request.json();

        const teacher = await prisma.teacher.findFirst({ where: { id: teacherId } });
        if (!teacher) {
            return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
        }

        if (oldPassword) {
            const isMatch = await bcrypt.compare(oldPassword, teacher.password);
            if (!isMatch) {
                return NextResponse.json({ message: "Old password is incorrect" }, { status: 400 });
            }
        }

        let hashedPassword = teacher.password;
        if (newPassword) {
            hashedPassword = await bcrypt.hash(newPassword, 10);
        }

        const department = await prisma.department.findFirst({
            where: { name: dept_name },
            select: { id: true, batches: { select: { id: true } } }
        });

        if (!department) {
            return NextResponse.json({ message: "Department not found" }, { status: 404 });
        }

        //check if batched are not null
        if (!batches || batches.length === 0) {
            return NextResponse.json({ message: "No batches provided" }, { status: 400 });
        }
        const validBatchIds = department.batches.map(batch => batch.id);
        const filteredBatches = batches.filter(batchId => validBatchIds.includes(batchId));

        if (filteredBatches.length === 0) {
            return NextResponse.json({ message: "No valid batches found" }, { status: 400 });
        }

        // Check if subjects are not null
        if (!subjects || subjects.length === 0) {
            return NextResponse.json({ message: "No subjects provided" }, { status: 400 });
        }

        const validSubjects = await prisma.subject.findMany({
            where: { batch_id: { in: filteredBatches } },
            select: { id: true }
        });

        const validSubjectIds = validSubjects.map(subject => subject.id);
        const filteredSubjects = subjects.filter(subjectId => validSubjectIds.includes(subjectId));

        // Append new batches and subjects
        const updatedTeacher = await prisma.teacher.update({
            where: { id: teacherId },
            data: {
                name,
                email,
                image: image=="" ? null : image,
                password: hashedPassword,
                dept_id: department.id,
                batches: { set: filteredBatches },
                subjects: { set: filteredSubjects }
            }
        });

        return NextResponse.json(updatedTeacher, { status: 200 });
    } catch (error) {
        console.error("Error updating teacher:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
