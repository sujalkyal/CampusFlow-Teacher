// delete a note whose id is passed in the body

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";   
import { authOptions } from "../../../../lib/auth";

export async function DELETE(req) {
    //delete a note for a subject
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // get note_id from json body
        const { note_id } = await req.json();
        if (!note_id) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        // delete the note for the subject
        const deletedNote = await prisma.note.delete({
            where: {
                id: note_id
            }
        });

        return NextResponse.json(deletedNote, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}