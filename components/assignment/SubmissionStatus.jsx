'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function SubmissionStatus() {
  const params = useParams();
  const assignmentId = params?.id;

  const [submittedCount, setSubmittedCount] = useState(0);
  const [notSubmittedCount, setNotSubmittedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!assignmentId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const resSubmitted = await axios.post('/api/session/assignment/getSubmissionDetails', {
          assignment_id: assignmentId,
        });

        const resAll = await axios.post('/api/session/assignment/getAllStudents', {
          assignment_id: assignmentId,
        });

        const submitted = resSubmitted.data || [];
        const all = resAll.data || [];

        setSubmittedCount(submitted.length);
        setNotSubmittedCount(all.length - submitted.length);
      } catch (err) {
        console.error('Error fetching submission status:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [assignmentId]);

  const total = submittedCount + notSubmittedCount;
  const submittedPercent = total > 0 ? (submittedCount / total) * 100 : 0;
  const notSubmittedPercent = 100 - submittedPercent;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 }
    }
  };

  const chartVariants = {
    hidden: { strokeDasharray: "0, 100", opacity: 0 },
    visible: (i) => ({
      strokeDasharray: `${i}, 100`,
      opacity: 1,
      transition: { duration: 1.5, ease: "easeOut", delay: 0.3 }
    })
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.03, 1],
      transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-[#010101] rounded-2xl border border-[#3a3153]/30 p-10 text-[#fefcfd] space-y-10"
    >
      <motion.div variants={itemVariants} className="flex items-center mb-6">
        <h2 className="text-3xl font-semibold text-[#fefcfd]">Submission Status</h2>
        <div className="h-1 w-16 bg-[#5f43b2] ml-6 rounded-full"></div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-center my-10 relative">
        {isLoading ? (
          <div className="w-52 h-52 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-t-4 border-[#5f43b2] rounded-full"
            />
          </div>
        ) : (
          <div className="relative w-52 h-52">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke="#3a3153"
                strokeWidth="3"
              />
              <motion.circle
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke="#5f43b2"
                strokeWidth="3"
                custom={submittedPercent}
                variants={chartVariants}
                transform="rotate(-90 18 18)"
              />
              <motion.circle
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke="#b1aebb"
                strokeWidth="3"
                custom={notSubmittedPercent}
                variants={chartVariants}
                strokeDashoffset={`-${submittedPercent}`}
                transform="rotate(-90 18 18)"
              />
            </svg>
            <motion.div
              variants={pulseVariants}
              animate="pulse"
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <span className="text-4xl font-bold text-[#5f43b2]">{submittedCount}</span>
              <span className="text-base text-[#b1aebb]">of {total}</span>
            </motion.div>
          </div>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-center gap-14">
        <motion.div
          whileHover={{ scale: 1.08 }}
          className="bg-[#3a3153]/30 px-6 py-5 rounded-xl space-y-2"
        >
          <div className="flex items-center mb-2">
            <span className="w-4 h-4 bg-[#5f43b2] rounded-full mr-3"></span>
            <span className="text-lg text-[#fefcfd]">Submitted</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-[#5f43b2]">{submittedCount}</span>
            <span className="text-sm text-[#b1aebb] ml-2">({Math.round(submittedPercent)}%)</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.08 }}
          className="bg-[#3a3153]/30 px-6 py-5 rounded-xl space-y-2"
        >
          <div className="flex items-center mb-2">
            <span className="w-4 h-4 bg-[#b1aebb] rounded-full mr-3"></span>
            <span className="text-lg text-[#fefcfd]">Not Submitted</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-[#b1aebb]">{notSubmittedCount}</span>
            <span className="text-sm text-[#b1aebb] ml-2">({Math.round(notSubmittedPercent)}%)</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
