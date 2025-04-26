"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import EditTeacherPopup from '../../components/Popup';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

const SubjectDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [dept, setDept] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();
  const { status } = useSession(); // Assuming you have a session management system
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeacherDetails = async () => {
    try {
      const teacherRes = await axios.get('/api/teacher/getTeacherDetails', {
        withCredentials: true
      });

      setTeacher(teacherRes.data.user);
      setSubjects(teacherRes.data.subjects);
      setDept(teacherRes.data.dept_name);

    } catch (error) {
      console.error('Error fetching data:', error.response?.data?.message || error.message);
    }
  };

  const fetchUpcomingSessions = async () => {
    try {
      const sessionRes = await axios.get('/api/teacher/upcomingSession', {
        withCredentials: true
      });
      setUpcomingSessions(sessionRes.data.filteredSessions);
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error.response?.data?.message || error.message);
    }
  }

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true); // Show loading while checking session
    } else if (status === "authenticated") {
      // Fetch all data when authenticated
      const fetchData = async () => {
        await Promise.all([fetchTeacherDetails(), fetchUpcomingSessions()]);
        setIsLoading(false); // Only set loading to false when both data fetching completes
      };
      fetchData();
    } else if (status === "unauthenticated") {
      router.push('/auth/signin'); // Redirect to sign-in page if unauthenticated
    }
  }, [status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#010101]">
        <div className="text-lg font-semibold text-[#fefdfd]">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Prevent rendering if unauthenticated
  }

  const handleEditClick = () => {
    setIsPopupOpen(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.8
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

  return (
    <motion.div 
      className="min-h-screen text-[#fefdfd] overflow-y-auto custom-scrollbar"
      style={{ 
        background: "#010101",
        backgroundImage: "radial-gradient(circle at 50% 0%, #3a3153 0%, #010101 70%)",
        backgroundAttachment: "fixed"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-[#5f43b2]/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, 50, 0], 
            opacity: [0.5, 0.8, 0.5] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-96 h-96 bg-[#3a3153]/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, -30, 0], 
            y: [0, -50, 0], 
            opacity: [0.5, 0.7, 0.5] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="w-full px-4 py-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header with profile */}
          {teacher && (
            <motion.div 
              variants={itemVariants}
              className="relative overflow-hidden bg-[#010101]/70 backdrop-blur-xl rounded-lg shadow-xl mx-4"
            >
              <div className="top-0 right-0 w-full h-12 bg-gradient-to-r from-[#5f43b2]/20 to-[#3a3153]/20" />
              
              <div className="flex flex-col md:flex-row p-6">
                <motion.div 
                  className="flex-shrink-0 flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-0 md:mr-8"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative mb-4">
                    <motion.div 
                      className="absolute -inset-1 bg-gradient-to-r from-[#5f43b2] to-[#3a3153] rounded-full blur"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <img 
                      src={teacher.image || "/user-placeholder.png"} 
                      alt="Teacher" 
                      className="relative w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-[#fefdfd]">{teacher.name}</h2>
                  <p className="text-[#b1aebb] mt-1">{dept}</p>
                  <p className="text-[#b1aebb]/80 text-sm">{teacher.email}</p>
                  
                  <motion.button 
                    onClick={handleEditClick} 
                    className="mt-4 px-6 py-2 bg-[#5f43b2] text-[#fefdfd] rounded-md shadow-lg relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#5f43b2] to-[#3a3153] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:cursor-pointer" />
                    <span className="relative hover:cursor-pointer">Edit Profile</span>
                  </motion.button>
                </motion.div>
                
                <div className="flex-grow border-l border-[#3a3153]/30 pl-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-[#fefdfd] font-semibold mb-3 border-l-4 border-[#5f43b2] pl-2">
                        Personal Information
                      </h3>
                      <div className="space-y-2">
                        <div className="bg-[#010101]/50 p-2 rounded-md">
                          <span className="text-[#b1aebb] text-sm">Department:</span>
                          <p className="text-[#fefdfd]">{dept || 'N/A'}</p>
                        </div>
                        <div className="bg-[#010101]/50 p-2 rounded-md">
                          <span className="text-[#b1aebb] text-sm">Email:</span>
                          <p className="text-[#fefdfd]">{teacher.email || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-[#fefdfd] font-semibold mb-3 border-l-4 border-[#5f43b2] pl-2">
                        Teaching Details
                      </h3>
                      <div className="space-y-2">
                        <div className="bg-[#010101]/50 p-2 rounded-md">
                          <span className="text-[#b1aebb] text-sm">Subjects Count:</span>
                          <p className="text-[#fefdfd]">{subjects.length}</p>
                        </div>
                        <div className="bg-[#010101]/50 p-2 rounded-md">
                          <span className="text-[#b1aebb] text-sm">Upcoming Sessions:</span>
                          <p className="text-[#fefdfd]">{upcomingSessions.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Upcoming Sessions Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-[#010101]/70 backdrop-blur-xl rounded-lg p-6 mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#fefdfd] flex items-center">
                <span className="block w-1 h-6 bg-[#5f43b2] mr-2"></span>
                Upcoming Sessions
              </h2>
              <motion.div 
                className="h-1 flex-grow ml-4 bg-gradient-to-r from-[#5f43b2]/50 to-transparent rounded-full"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </div>
            
            {upcomingSessions.length > 0 ? (
              <div className="overflow-x-auto pb-4 custom-scrollbar">
                <div className="flex gap-4 min-w-max">
                  {upcomingSessions.map((session, index) => (
                    <motion.div
                      key={index}
                      className="w-64 bg-[#fefdfd]/5 backdrop-blur-md rounded-lg overflow-hidden flex flex-col"
                      variants={itemVariants}
                      whileHover={{ 
                        boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.3)"
                      }}
                    >
                      <div className="bg-gradient-to-r from-[#5f43b2] to-[#3a3153] py-3 px-4">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-[#fefdfd]/80">
                            {new Date(session.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </p>
                          <h3 className="text-xl font-bold">
                            {new Date(session.date).getDate()}
                          </h3>
                          <p className="text-sm text-[#fefdfd]/80">
                            {new Date(session.date).toLocaleDateString('en-US', { month: 'short' })}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-[#fefdfd] mb-2">{session.subject_name}</h3>
                          <p className="text-[#b1aebb] text-sm"> Title: {session.title ? session.title : "Untitled"}</p>
                        </div>
                        <motion.button 
                          className="mt-4 w-full py-2 bg-[#010101]/80 text-[#fefdfd] rounded-md text-sm hover:cursor-pointer"
                          whileHover={{ backgroundColor: "rgba(95, 67, 178, 0.3)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => router.push(`/dashboard/subject/session/${session.id}`)}
                        >
                          View Details
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div 
                className="bg-[#010101]/60 backdrop-blur-md rounded-lg p-6 text-center"
                variants={itemVariants}
              >
                <p className="text-[#b1aebb]">No upcoming sessions scheduled.</p>
              </motion.div>
            )}
          </motion.div>
          
          {/* Subject Cards with Glassmorphism */}
          <motion.div 
            variants={itemVariants}
            className="bg-[#010101]/70 backdrop-blur-xl rounded-lg p-6 mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#fefdfd] flex items-center">
                <span className="block w-1 h-6 bg-[#5f43b2] mr-2"></span>
                My Subjects
              </h2>
              <motion.div 
                className="h-1 flex-grow ml-4 bg-gradient-to-r from-[#5f43b2]/50 to-transparent rounded-full"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 1 }}
              />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
              {subjects.map((subject, index) => (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden hover:cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => router.push(`/dashboard/subject/${subject.id}`)}
                >
                  {/* Glassmorphism Effect */}
                  <div className="absolute inset-0 bg-[#fefdfd]/5 backdrop-blur-lg rounded-lg shadow-lg group-hover:bg-[#fefdfd]/10 transition-all duration-300"></div>
                  
                  <div className="relative p-4 h-40 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 mb-4 flex items-center justify-center bg-[#3a3153] rounded-full shadow-lg group-hover:bg-[#5f43b2] transition-colors duration-300">
                      <h3 className="font-bold text-2xl text-[#fefdfd]">
                        {subject.name.charAt(0)}
                      </h3>
                    </div>
                    
                    <h2 className="text-md font-semibold text-[#fefdfd] text-center mb-1">
                      {subject.name}
                    </h2>
                    
                    <p className="text-xs text-[#b1aebb] text-center">
                      {subject.batch_name}
                    </p>
                    
                    <motion.div 
                      className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#5f43b2] to-[#3a3153] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EditTeacherPopup
              teacher={teacher}
              isOpen={true}
              onClose={() => setIsPopupOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SubjectDashboard;