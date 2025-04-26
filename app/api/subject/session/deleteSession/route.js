// delete session for a subject after checking if the date of session is future or not

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function DELETE(req) {
    // delete session for a subject after checking if the date of session is future or not
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { subject_id, session_id } = await req.json();
        if (!subject_id || !session_id) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        // check if the session date is in the future
        const sessionDate = await prisma.session.findUnique({
            where: {
                id: session_id,
            },
            select: {
                date: true,
            }
        });

        if (new Date(sessionDate) < new Date()) {
            return NextResponse.json({ message: "Cannot delete past sessions" }, { status: 200 });
        }

        // delete the session for the subject
        const deletedSession = await prisma.session.delete({
            where: {
                id: session_id,
            }
        });

        return NextResponse.json(deletedSession, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}