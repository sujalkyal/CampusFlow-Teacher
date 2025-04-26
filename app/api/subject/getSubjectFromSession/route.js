import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST(req) {
    // return the subject from the session id
    try {
        const user = await getServerSession(authOptions);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { session_id } = await req.json();
        if (!session_id) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        // get the subject from the session id
        const session = await prisma.session.findUnique({
            where: { id: session_id }
        });
        
        
    if (!session) {
        return NextResponse.json({ message: "Session not found" }, { status: 404 });
    }

        return NextResponse.json(session, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}