// returns all sessions for a given subject

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function POST(req) {
    // returns all sessions for a given subject
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { subject_id } = await req.json();
        if (!subject_id) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        // get all sessions for the subject
        const sessions = await prisma.session.findMany({
            where: {
                subject_id: subject_id,
            }
        });

        return NextResponse.json(sessions, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}