"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import NotesViewPopUp from '../../../../components/NotesViewPopUp';
import AddSessionCard from '../../../../components/AddSessionComponent';
import AddNoteCard from '../../../../components/AddNotesComponent';

const Subject = () => {
  // Theme colors from provided image
  const themeColors = {
    primary: '#5f43b2', // Studio purple
    secondary: '#010101', // Black
    accent: '#3a3153', // Mystique
    card: 'rgba(42, 42, 64, 0.4)',
    text: '#fefdfD', // Soft Peach
    faded: '#b1aebb' // Gray Powder
  };

  const { id: subject_id } = useParams();
  const [subjectName, setSubjectName] = useState(null);
  const [batchName, setBatchName] = useState(null);
  const [deptName, setDeptName] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [notes, setNotes] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [refresh2, setRefresh2] = useState(false);
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [totalClasses, setTotalClasses] = useState(0);

  const handleSessionCreated = () => setRefresh((prev) => !prev);
  const handleNoteCreation = () => {
    setRefresh2((prev) => !prev);
    setShowAddNoteForm(false);
  };

  const fetchBatch = async () => {
    try {
      const response = await axios.post('/api/batch/getBatchFromSubject', { subject_id: subject_id });
      setSubjectName(response.data.subject.name);
      setBatchName(response.data.batchName);
      setDeptName(response.data.deptName);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching batch:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subject_id) {
      fetchBatch();
    }
  }, [subject_id]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  useEffect(() => {
    if (!subject_id) return;

    const fetchAll = async () => {
      try {
        const [studentsRes, sessionsRes, notesRes] = await Promise.all([
          axios.post('/api/subject/getStudents', { subject_id }),
          axios.post('/api/subject/session/getAllSessions', { subject_id }),
          axios.post('/api/subject/notes/getAllNotes', { subject_id }),
        ]);

        // Students
        setStudents(studentsRes.data.students);
        setTotalClasses(studentsRes.data.sessionCount);

        // Sessions
        const sortedSessions = sessionsRes.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setSessions(sortedSessions);

        // Notes
        setNotes(notesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [subject_id, refresh, refresh2]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white" style={{ backgroundColor: themeColors.secondary }}>
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-purple-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <p className="text-lg font-medium" style={{ color: themeColors.faded }}>Loading your subject...</p>
        </div>
      </div>
    );
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut" 
      }
    }
  };

  return (
    <motion.div
      className="flex flex-col min-h-screen px-4 md:px-8 py-8 text-white"
      style={{ backgroundColor: themeColors.secondary, color: themeColors.text }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.header
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 px-2 py-4 border-b border-indigo-100 dark:border-indigo-900"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-400 bg-clip-text text-transparent py-1">
            {subjectName}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
            {batchName} • <span className="font-medium">{deptName}</span>
          </p>
        </div>
        
        <motion.button
          className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 ease-in-out"
          onClick={() => router.push('/dashboard')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          <span>Dashboard</span>
        </motion.button>
      </motion.header>


      <motion.main
        className="flex-1 flex flex-col gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Classes Section */}
        <motion.section
          className="w-full rounded-2xl shadow-xl p-6"
          style={{
            backgroundColor: themeColors.card,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderLeft: `4px solid ${themeColors.primary}`
          }}
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">Classes</h2>
          </div>

          {sessions.length === 0 ? (
            <div className="h-24 flex items-center justify-center">
              <div className="w-64">
                <AddSessionCard subject_id={subject_id} onSessionCreated={handleSessionCreated} />
              </div>
            </div>
          ) : (
            <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4 custom-scrollbar">
              {sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  className="flex-shrink-0 w-64 rounded-xl border cursor-pointer overflow-hidden flex flex-col"
                  style={{ backgroundColor: 'rgba(58, 49, 83, 0.5)', borderColor: 'rgba(95, 67, 178, 0.3)' }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                    borderColor: themeColors.primary
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/dashboard/subject/session/${session.id}`)}
                >
                  <div className="p-4 flex-1">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1" style={{ color: themeColors.text }}>
                      {session.title || 'Untitled Session'}
                    </h3>
                    <p className="text-sm" style={{ color: themeColors.faded }}>
                      {new Date(session.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="h-1.5" style={{ backgroundColor: themeColors.primary, opacity: 0.7 }}></div>
                </motion.div>
              ))}
              {/* Add Session Card */}
              <div className="flex-shrink-0 w-64">
                <AddSessionCard subject_id={subject_id} onSessionCreated={handleSessionCreated} />
              </div>
            </div>
          )}
        </motion.section>

        {/* Divider */}
        <motion.div
          className="h-1 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full"
          style={{ backgroundColor: themeColors.primary, opacity: 0.5 }}
          variants={itemVariants}
        ></motion.div>

        {/* Students Section */}
        <motion.section
          className="w-full rounded-2xl shadow-xl p-6"
          style={{
            backgroundColor: themeColors.card,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderLeft: `4px solid ${themeColors.primary}`
          }}
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">Student List</h2>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar rounded-xl">
            {students.map((student, index) => (
              <motion.div
                key={student.id}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ backgroundColor: 'rgba(58, 49, 83, 0.3)' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ backgroundColor: 'rgba(58, 49, 83, 0.5)' }}
              >
                <div className="flex items-center">
                  <img
                    src={student.image || '/user-placeholder.png'}
                    alt={student.name}
                    className="h-10 w-10 rounded-full object-cover mr-3 border-2"
                    style={{ borderColor: themeColors.primary }}
                  />
                  <div>
                    <h3 className="font-medium" style={{ color: themeColors.text }}>{student.name}</h3>
                    <p className="text-sm" style={{ color: themeColors.faded }}>{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <motion.div
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: themeColors.primary }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="font-semibold text-sm" style={{ color: themeColors.text }}>
                      {student.attendance.length}/{totalClasses}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.div
          className="h-1 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full"
          style={{ backgroundColor: themeColors.primary, opacity: 0.5 }}
          variants={itemVariants}
        ></motion.div>

        {/* Notes Section */}
        <motion.section
          className="w-full rounded-2xl shadow-xl p-6"
          style={{
            backgroundColor: themeColors.card,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderLeft: `4px solid ${themeColors.primary}`
          }}
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">Notes</h2>
              <p className="text-sm mt-1" style={{ color: themeColors.faded }}>
                {notes.length} {notes.length === 1 ? 'note' : 'notes'} available
              </p>
            </div>
            
            {/* Add Note Button */}
            <motion.button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:cursor-pointer"
              onClick={() => setShowAddNoteForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={18} />
              <span>Add Note</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note, index) => (
              <motion.div
                key={note.id}
                className="p-5 rounded-2xl border shadow-sm cursor-pointer transition-all"
                style={{
                  backgroundColor: themeColors.accent,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  borderColor: themeColors.primary,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedNote(note)}
              >
                <h3 className="text-lg font-semibold mb-1" style={{ color: themeColors.text }}>
                  {note.title || 'Untitled Note'}
                </h3>
                <p className="text-sm line-clamp-3" style={{ color: themeColors.faded }}>
                  {note.description || 'No description available'}
                </p>
                <span className="inline-block text-xs mt-4 px-2 py-0.5 rounded bg-purple-500 text-white">
                  View Note
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.main>

      {/* Note View Modal */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 flex justify-center items-center"
          >
            <motion.div
              className="w-full max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-y-auto"
              style={{
                maxWidth: '800px',
              }}
              initial={{ y: '-100vh' }}
              animate={{ y: 0 }}
              exit={{ y: '100vh' }}
              transition={{ type: 'spring', stiffness: 100, damping: 25 }}
            >
              <NotesViewPopUp note={selectedNote} onClose={() => setSelectedNote(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Note Modal */}
      <AnimatePresence>
        {showAddNoteForm && (
          <AddNoteCard 
            subject_id={subject_id} 
            onNoteCreated={handleNoteCreation} 
            isModal={true} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Subject;