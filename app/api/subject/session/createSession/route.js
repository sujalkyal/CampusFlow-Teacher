// create new session for a subject

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function POST(req) {
    //create a new session for a subject
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // get subject_id and date from json body
        const { title, subject_id, date } = await req.json();

        if (!subject_id || !date) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        const dateObject = new Date(date);

        // create the session for the subject
        const newSession = await prisma.session.create({
            data: {
                subject_id: subject_id,
                date: dateObject,
                title: title? title : "Untitled",
            }
        });

        return NextResponse.json(newSession, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}