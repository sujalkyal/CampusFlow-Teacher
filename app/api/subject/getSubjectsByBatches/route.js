// get subjects for all batchids

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function POST(req) {
    try {
        // get batch_ids from json body
        const { batch_ids } = await req.json();
        if (!batch_ids) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        // get the subjects from the batch ids
        const subjects = await prisma.subject.findMany({
            where: {
                batch_id: {
                    in: batch_ids
                }
            }
        });

        return NextResponse.json(subjects, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}