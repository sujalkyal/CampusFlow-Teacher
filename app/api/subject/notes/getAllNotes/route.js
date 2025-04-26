// returns all the notes for a subject

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function POST(req) {
    //get the notes for a subject
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

        // get the notes for the subject
        const notes = await prisma.note.findMany({
            where: {
                subject_id: subject_id
            }
        });

        return NextResponse.json(notes, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}