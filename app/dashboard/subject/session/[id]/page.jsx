"use client";
import React from "react";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, BookOpen, ArrowRight, Loader } from "lucide-react";
import { useRouter, useParams } from 'next/navigation';
import { motion } from "framer-motion";

const AttendanceTable = () => {
    const { id: sessionId } = useParams();
    const [subjectId, setSubjectId] = useState(null);
    const [subjectName, setSubjectName] = useState(null);
    const [batchName, setBatchName] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [deptName, setDeptName] = useState(null);
    const [attendanceDetails, setAttendanceDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchSession = async () => {
        try {
            const response = await axios.post('/api/subject/getSubjectFromSession', { session_id: sessionId });
            if (!response.data || !response.data.subject_id) {
                console.error('Invalid session data:', response.data);
                return;
            }
            setSubjectId(response.data.subject_id);
        } catch (error) {
            console.error('Error fetching session:', error);
        }
    };

    useEffect(() => {
        fetchSession();
    }, [sessionId]);

    useEffect(() => {
        const fetchInitialAttendance = async () => {
            try {
                const res = await axios.post('/api/session/attendance/getAttendanceOfSession', {
                    session_id: sessionId
                });
    
                const attendanceMap = {};
                res.data.forEach(entry => {
                    attendanceMap[entry.id] = entry.status.toLowerCase(); // Ensure it's lowercase
                });
    
                setAttendance(attendanceMap);
            } catch (err) {
                console.error("Error fetching attendance details:", err);
            }
        };
    
        fetchInitialAttendance();
    }, [sessionId]);
    

    const fetchBatch = async () => {
        try {
            const response = await axios.post('/api/batch/getBatchFromSubject', { subject_id: subjectId });
            setSubjectName(response.data.subject.name);
            setBatchName(response.data.batchName);
            setStudents(response.data.students || []);
            setDeptName(response.data.deptName);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching batch:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (subjectId) {
            fetchBatch();
        }
    }, [subjectId]);

    const getAttendanceDetails = async () => {
        try {
            const response = await axios.post('/api/session/attendance/getAttendanceFromStudent', {
                subject_id: subjectId,
                students,
            });

            const attendanceMap = {};
            for (const detail of response.data) {
                attendanceMap[detail.id] = {
                    presentDays: detail.presentDays || 0,
                    absentDays: detail.absentDays || 0,
                    lateDays: detail.lateDays || 0,
                };
            }

            setAttendanceDetails(attendanceMap);
        } catch (error) {
            console.error("Error fetching attendance details:", error);
        }
    };

    useEffect(() => {
        if (students.length > 0 && subjectId) {
            getAttendanceDetails();
        }
    }, [subjectId, students]); // Only depend on students.length, not the entire array

    const markAttendance = async (studentId, status) => {
        try {
            setAttendance((prev) => ({
                ...prev,
                [studentId]: prev[studentId] === status ? "none" : status,
            }));

            // Send request to backend
            await axios.post('/api/session/attendance/createAttendance', {
                student_id: studentId,
                session_id: sessionId,
                status: status.toUpperCase(), // Ensure enum values match
            });

            getAttendanceDetails(); // Refresh attendance details after marking

        } catch (error) {
            console.error("Error marking attendance:", error);
        }
    };

    const createAssignment = async () => {
        try {
            const checkResponse = await axios.post('/api/session/assignment/checkAssignment', {
                session_id: sessionId,
            });

            if (checkResponse.data.exists) {
                router.push(`/dashboard/subject/session/assignment/${checkResponse.data.assignmentId}`);
            } else {
                const createResponse = await axios.post('/api/session/assignment/createAssignment', {
                    session_id: sessionId,
                });
                router.push(`/dashboard/subject/session/assignment/${createResponse.data.id}`);
            }
        } catch (error) {
            console.error("Error handling assignment:", error);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    };
    
    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#010101] flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 border-2 border-[#5f43b2] border-t-transparent rounded-full mb-4"
                    />
                    <p className="text-[#b1aebb]">Loading attendance data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#010101] text-[#fefcfd] p-4 md:p-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <div className="bg-gradient-to-r from-[#3a3153] to-[#5f43b2] rounded-2xl p-8 shadow-lg border border-[#5f43b2]/30">
                    <h2 className="text-3xl font-extrabold mb-4 text-[#fefcfd]">{subjectName}</h2>
                    <div className="flex flex-col space-y-3">
                        <div className="flex items-center">
                            <span className="text-[#b1aebb] w-28">Department:</span>
                            <span className="font-medium text-[#fefcfd]">{deptName}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-[#b1aebb] w-28">Batch:</span>
                            <span className="font-medium text-[#fefcfd]">{batchName}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ yoyo: Infinity, duration: 2 }}
                    >
                        <BookOpen className="mr-2 text-[#5f43b2]" size={24} />
                    </motion.div>
                    <h2 className="text-xl font-bold text-[#fefcfd]">Attendance</h2>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#5f43b2] text-[#fefcfd] px-4 py-2 rounded-lg flex items-center space-x-2 shadow-md shadow-[#5f43b2]/20 hover:cursor-pointer"
                    onClick={() => createAssignment()}
                >
                    <span>Assignment</span>
                    <ArrowRight size={16} />
                </motion.button>
            </div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
            >
                {students.length > 0 ? (
                    students.map((student, index) => (
                        <motion.div 
                            key={student.id} 
                            variants={itemVariants}
                            className="bg-[#3a3153]/40 rounded-xl p-4 shadow-lg hover:shadow-xl hover:bg-[#3a3153]/60 transition-all duration-300 border border-[#5f43b2]/20"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <span className="bg-[#5f43b2] text-[#fefcfd] w-8 h-8 rounded-full flex items-center justify-center mr-3 shadow-md shadow-[#5f43b2]/30">
                                            {index + 1}
                                        </span>
                                        <h3 className="text-lg font-semibold text-[#fefcfd]">{student.name}</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-2 text-sm mt-2">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                                            <span className="text-[#b1aebb]">Present: </span>
                                            <span className="ml-1 font-bold text-green-400">{attendanceDetails[student.id]?.presentDays || 0}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                                            <span className="text-[#b1aebb]">Absent: </span>
                                            <span className="ml-1 font-bold text-red-400">{attendanceDetails[student.id]?.absentDays || 0}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                                            <span className="text-[#b1aebb]">Late: </span>
                                            <span className="ml-1 font-bold text-yellow-400">{attendanceDetails[student.id]?.lateDays || 0}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex space-x-2 mt-4 md:mt-0">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`p-2 rounded-full ${attendance[student.id] === "present" ? "bg-green-500 text-[#fefcfd]" : "bg-green-500/20 text-green-400"} shadow-md hover:cursor-pointer`}
                                        onClick={() => markAttendance(student.id, "present")}
                                    >
                                        <CheckCircle size={20} />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`p-2 rounded-full ${attendance[student.id] === "absent" ? "bg-red-500 text-[#fefcfd]" : "bg-red-500/20 text-red-400"} shadow-md hover:cursor-pointer`}
                                        onClick={() => markAttendance(student.id, "absent")}
                                    >
                                        <XCircle size={20} />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`p-2 rounded-full ${attendance[student.id] === "late" ? "bg-yellow-500 text-[#fefcfd]" : "bg-yellow-500/20 text-yellow-400"} shadow-md hover:cursor-pointer`}
                                        onClick={() => markAttendance(student.id, "late")}
                                    >
                                        <Clock size={20} />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center p-10 bg-[#3a3153]/20 rounded-xl border border-[#5f43b2]/20"
                    >
                        <p className="text-[#b1aebb]">No students found</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default AttendanceTable;