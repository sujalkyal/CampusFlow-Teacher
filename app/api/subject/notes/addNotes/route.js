
import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function POST(req) {
    //create a new note for a subject
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // get subject_id and note from json body
        const { title, description, subject_id, files } = await req.json();
        if (!subject_id && !files) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        // create the note for the subject
        const newNote = await prisma.note.create({
            data: {
                subject_id: subject_id,
                title: title ? title : null,
                description: description ? description : null,
                files: files ? files : [],
            }
        });

        return NextResponse.json(newNote, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}