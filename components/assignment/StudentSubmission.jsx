"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, User } from "lucide-react";

export default function StudentSubmission() {
  const params = useParams();
  const assignmentId = params?.id;
  const [loading, setLoading] = useState(true);

  const [submittedStudents, setSubmittedStudents] = useState([]);
  const [notSubmittedStudents, setNotSubmittedStudents] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudentFiles = async (studentId) => {
    try {
      const res = await axios.post("/api/session/assignment/getStudentFiles", {
        student_id: studentId,
        assignment_id: assignmentId,
      });
      return res.data.files || [];
    } catch (error) {
      console.error("Error fetching student files:", error);
      return [];
    }
  };



  useEffect(() => {
    if (!assignmentId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const resSubmitted = await axios.post(
          "/api/session/assignment/getSubmissionDetails",
          {
            assignment_id: assignmentId,
          }
        );

        const submitted = resSubmitted.data || [];

        const resAll = await axios.post(
          "/api/session/assignment/getAllStudents",
          {
            assignment_id: assignmentId,
          }
        );

        const all = resAll.data || [];

        const submittedIds = new Set(submitted.map((s) => s.id));
        const notSubmitted = all.filter(
          (student) => !submittedIds.has(student.id)
        );

        setSubmittedStudents(submitted);
        setNotSubmittedStudents(notSubmitted);


      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentId]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-[#2a2a3f] rounded-2xl shadow-xl p-6 h-full"
      >
        <h2 className="text-2xl font-semibold text-[#fefdfd] mb-6 flex items-center">
          <span className="mr-2 inline-block w-1 h-6 bg-[#5f43b2] rounded-full"></span>
          Student Submissions
        </h2>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <motion.div
              className="relative w-12 h-12"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            >
              <div className="absolute inset-0 border-4 border-t-transparent border-[#5f43b2] rounded-full"></div>
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-2">
              <motion.div
                className="bg-[#3a3153] p-4 rounded-xl flex items-center"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="bg-green-500/20 p-2 rounded-full mr-3">
                  <CheckCircle className="text-green-400 w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#b1aebb]">Submitted</p>
                  <p className="text-xl font-bold text-[#fefdfd]">
                    {submittedStudents.length}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="bg-[#3a3153] p-4 rounded-xl flex items-center"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="bg-red-500/20 p-2 rounded-full mr-3">
                  <XCircle className="text-red-400 w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#b1aebb]">Not Submitted</p>
                  <p className="text-xl font-bold text-[#fefdfd]">
                    {notSubmittedStudents.length}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Submitted List */}
            <div className="mb-4">
              <div className="flex items-center mb-3">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                <h3 className="font-medium text-[#fefdfd] text-sm uppercase tracking-wider">
                  Submitted
                </h3>
              </div>
              <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                {submittedStudents.length > 0 ? (
                  submittedStudents.map((student) => (
                    <motion.div
                      key={student.id}
                      className="flex items-center bg-[#3a3153]/50 rounded-lg p-2 hover:bg-[#3a3153]"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <div className="w-9 h-9 rounded-full bg-[#5f43b2]/30 overflow-hidden mr-3 flex items-center justify-center">
                        {student.avatar ? (
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-[#fefdfd]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          onClick={async () => {
                            const files = await fetchStudentFiles(student.id);
                            setSelectedStudent({ ...student, files });
                            setShowModal(true);
                          }}
                          className="text-sm font-medium text-[#fefdfd] cursor-pointer hover:underline"
                        >
                          {student.name}
                        </p>

                        <p className="text-xs text-[#b1aebb]">{student.email}</p>
                      </div>
                      <div className="bg-green-500/20 p-1.5 rounded-full">
                        <CheckCircle className="text-green-400 w-3.5 h-3.5" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-[#b1aebb] text-sm italic text-center py-4">
                    No submissions yet
                  </p>
                )}
              </div>
            </div>

            {/* Not Submitted List */}
            <div>
              <div className="flex items-center mb-3">
                <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                <h3 className="font-medium text-[#fefdfd] text-sm uppercase tracking-wider">
                  Not Submitted
                </h3>
              </div>
              <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                {notSubmittedStudents.length > 0 ? (
                  notSubmittedStudents.map((student) => (
                    <motion.div
                      key={student.id}
                      className="flex items-center bg-[#3a3153]/50 rounded-lg p-2 hover:bg-[#3a3153]"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <div className="w-9 h-9 rounded-full bg-[#5f43b2]/30 overflow-hidden mr-3 flex items-center justify-center">
                        {student.avatar ? (
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-[#fefdfd]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#fefdfd]">
                          {student.name}
                        </p>
                        <p className="text-xs text-[#b1aebb]">
                          {student.email || "No email provided"}
                        </p>
                      </div>
                      <div className="bg-red-500/20 p-1.5 rounded-full">
                        <XCircle className="text-red-400 w-3.5 h-3.5" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-[#b1aebb] text-sm italic text-center py-4">
                    No students found
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>

        {/* Modal for student file submissions */}
        {/* Modal for student file submissions */}
{showModal && selectedStudent && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-[#2a2a3f] p-6 rounded-xl w-full max-w-2xl shadow-2xl relative"
    >
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-3 right-3 text-[#b1aebb] hover:text-white"
      >
        <XCircle className="w-5 h-5" />
      </button>
      <h3 className="text-lg font-semibold text-[#fefdfd] mb-4">
        Files Submitted by {selectedStudent.name}
      </h3>

      {selectedStudent.files && selectedStudent.files.length > 0 ? (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {selectedStudent.files.map((file, index) => {
            const extension = file.split('.').pop()?.toLowerCase();

            return (
              <div key={index} className="bg-[#1e1e2e] p-3 rounded-lg shadow-md">
                <p className="text-sm text-[#b9a7ff] mb-2 break-all">
                  <a href={file} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {file.split("/").pop()}
                  </a>
                </p>

                {["jpg", "jpeg", "png", "gif", "webp"].includes(extension) && (
                  <img src={file} alt="preview" className="w-full rounded-lg max-h-64 object-contain" />
                )}

                {["pdf"].includes(extension) && (
                  <iframe
                    src={file}
                    className="w-full h-64 rounded-lg"
                    title={`pdf-${index}`}
                  />
                )}

                {["mp4", "webm"].includes(extension) && (
                  <video controls className="w-full rounded-lg max-h-64">
                    <source src={file} type={`video/${extension}`} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-[#b1aebb] italic">No files submitted.</p>
      )}
    </motion.div>
  </div>
)}


    </>
  );
}  