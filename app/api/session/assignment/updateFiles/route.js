// route to add files to an assignment
import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try{
        const { assignment_id, files } = await req.json();
        //console.log("Assignment ID:", assignment_id);
        //console.log("Files:", files);

        if (!assignment_id || !files) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // add the files to the existing assignment
        const newFiles = await prisma.assignment.update({
            where: {
                id: assignment_id,
            },
            data: {
                files: files
            },
        });

        return NextResponse.json(newFiles, { status: 201 });
    }catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}