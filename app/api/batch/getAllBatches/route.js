import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function POST(req) {
    try {
        // get dept_id from json body
        const { dept_id } = await req.json();
        if (!dept_id) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        const batches = await prisma.batch.findMany({
            where: {
                dept_id: dept_id
            },
            select: {
                id:  true,
                name: true
            }
        });

        return NextResponse.json(batches, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}