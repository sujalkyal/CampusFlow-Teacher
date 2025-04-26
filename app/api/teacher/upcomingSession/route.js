import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const teacher_id = session.user.id;

        const teacher = await prisma.teacher.findUnique({
            where: { id: teacher_id },
          });
          
          if (!teacher || !teacher.subjects) {
            return NextResponse.json({ message: "No subjects found for the teacher" }, { status: 404 });
          }
          
          const sessions = await prisma.session.findMany({
            where: {
              subject_id: {
                in: teacher.subjects,
              },
            },
          });


          const subjectDetails = await prisma.subject.findMany({
            where: {
              id: {
                in: teacher.subjects,
              },
            },
            select: {
              id: true,
              name: true,
            },
          });

          //filter them by date and time
          const currentDate = new Date();
          const filteredSessions = sessions.filter(session => {
            const sessionDate = new Date(session.date);
            return sessionDate >= currentDate;
          });
          //sort them by date and time
          filteredSessions.sort((a, b) => new Date(a.date) - new Date(b.date));

          //using the subject ids, get the subject names
          const subjectMap = new Map(subjectDetails.map(subject => [subject.id, subject.name]));
          filteredSessions.forEach(session => {
            session.subject_name = subjectMap.get(session.subject_id) || "Unknown Subject";
          });


          return NextResponse.json({filteredSessions, subjectDetails}, { status: 200 });
          
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}