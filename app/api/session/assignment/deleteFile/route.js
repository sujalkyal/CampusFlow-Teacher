// delete the files given from the assignment

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function DELETE(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try{
        const { assignment_id, files } = await req.json();

        if (!assignment_id || !files) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // check is the assignment exists
        const assignment = await prisma.assignment.findUnique({
            where: {
                id: assignment_id,
            },
        });
        if (!assignment) {
            return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
        }

        // delete the files from the existing assignment
        const validFiles = assignment.files.filter((file) => !files.includes(file));
        const newFiles = await prisma.assignment.update({
            where: {
                id: assignment_id,
            },
            data: {
                files: validFiles,
            },
        });

        return NextResponse.json(newFiles, { status: 201 });
    }catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}