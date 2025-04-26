// pages/assignment.js
"use client";
import Head from 'next/head';
import { motion } from 'framer-motion';
import AssignmentDetails from '../../../../../../components/assignment/AssignmentDetails';
import FilesSection from '../../../../../../components/assignment/FilesSection';
import SubmissionStatus from '../../../../../../components/assignment/SubmissionStatus';
import StudentSubmissions from '../../../../../../components/assignment/StudentSubmission';

export default function AssignmentPage() {
  const isModalOpen = false; // Example state for isModalOpen

  return (
    <div className="min-h-screen bg-[#010101] text-[#fefdfd] relative z-0">
      <Head>
        <title>Assignment Management</title>
      </Head>

      <main className="container mx-auto py-10 px-6">
        <motion.h1
          className="text-4xl font-extrabold mb-10 text-[#5f43b2] drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Assignment
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="bg-[#1a1a24] border border-[#3a3153] rounded-2xl shadow-md p-6">
            <AssignmentDetails />
          </div>

          <div className="bg-[#1a1a24] border border-[#3a3153] rounded-2xl shadow-md p-6"><FilesSection /></div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="bg-[#1a1a24] border border-[#3a3153] rounded-2xl shadow-md p-6"><SubmissionStatus /></div>
          <div className="bg-[#1a1a24] border border-[#3a3153] rounded-2xl shadow-md p-6"><StudentSubmissions /></div>
        </motion.div>
      </main>
    </div>
  );
}

// Glassmorphic card component using your palette
const GlassCard = ({ children, isPopupOpen }) => (
  <motion.div
    className="bg-[#3a3153]/40 backdrop-blur-xl border border-[#b1aebb]/30 rounded-xl shadow-lg p-6 transition duration-300 hover:scale-[1.02] relative z-10"
    whileHover={{ scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 180 }}
  >
    {children}
  </motion.div>
);
