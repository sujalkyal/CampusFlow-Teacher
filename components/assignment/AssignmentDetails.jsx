"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function AssignmentDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    totalPoints: '',
    instructions: ''
  });
 
  const params = useParams();
  const assignmentId = params?.id;

  // Fetch assignment details
  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const res = await axios.post(`/api/session/assignment/getDetails`, {
          assignment_id: assignmentId
        });
        setFormData({
          title: res.data.title || "",
          dueDate: res.data.endDate?.split("T")[0] || "",
          instructions: res.data.description || "",
          totalPoints: "100", // or res.data.totalPoints || "100"
        });
        
      } catch (err) {
        console.error("Failed to load assignment", err);
      }
    };
  
    fetchAssignmentDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/session/assignment/editDetails', {
        id: assignmentId,
        title: formData.title,
        endDate: formData.dueDate,
        description: formData.instructions,
      });
  
      if (response.status === 200) {
        setIsModalOpen(false);
        // Optionally refresh UI or show success message
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };
  
  return (
    <motion.div 
      className=""
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-4">
        <motion.h2 
          className="text-xl font-semibold text-[#fefcfd]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Assignment Details
        </motion.h2>
        <div className="flex items-center space-x-2">
          <motion.span 
            className="bg-[#5f43b2]/30 text-[#fefcfd] text-xs font-medium px-2.5 py-1 rounded"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            Due: {formData.dueDate}
          </motion.span>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="text-[#5f43b2] hover:bg-[#5f43b2]/20 hover:text-[#fefcfd] p-1 rounded transition-colors hover:cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </motion.button>
        </div>
      </div>
  
      <motion.div 
        className="space-y-3 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-start text-[#fefcfd] bg-[#010101]/30 p-3 rounded">
          <strong className="mr-2 min-w-20">Title:</strong> 
          <span className="text-[#b1aebb]">{formData.title}</span>
        </div>
        <div className="flex items-start text-[#fefcfd] bg-[#010101]/30 p-3 rounded">
          <strong className="mr-2 min-w-20">Due Date:</strong> 
          <span className="text-[#b1aebb]">{formData.dueDate}</span>
        </div>
        <div className="flex items-start text-[#fefcfd] bg-[#010101]/30 p-3 rounded">
          <strong className="mr-2 min-w-20">Total Points:</strong> 
          <span className="text-[#b1aebb]">100</span>
        </div>
      </motion.div>
  
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-[#fefcfd] font-medium mb-2 flex items-center">
          <span className="inline-block w-1 h-4 bg-[#5f43b2] mr-2"></span>
          Instructions:
        </h3>
        <div className="bg-[#010101]/40 p-4 rounded border border-[#3a3153]/50">
          <p className="text-[#b1aebb] whitespace-pre-line">{formData.instructions}</p>
        </div>
      </motion.div>
  
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-[#1a1a24] rounded-lg shadow-xl p-6 w-full max-w-md border border-[#3a3153]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-[#fefcfd] ">Edit Assignment Details</h3>
                <motion.button 
                  onClick={() => {
                      setIsModalOpen(false)
                      setFormData({
                        title: "",
                        dueDate: "",
                        instructions: "",
                        totalPoints: ""
                      })
                    }
                  } 
                  className="text-[#b1aebb] hover:text-[#fefcfd] p-1 rounded hover:cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
  
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-[#fefcfd] mb-1">Assignment Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#010101] border border-[#3a3153] rounded focus:outline-none focus:ring-1 focus:ring-[#5f43b2] text-[#fefcfd]"
                    required
                  />
                </div>
  
                <div className="mb-4">
                  <label htmlFor="dueDate" className="block text-sm font-medium text-[#fefcfd] mb-1">Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#010101] border border-[#3a3153] rounded focus:outline-none focus:ring-1 focus:ring-[#5f43b2] text-[#fefcfd] calendar-dark"
                    required
                  />
                </div>
  
                <div className="mb-4">
                  <label htmlFor="totalPoints" className="block text-sm font-medium text-[#fefcfd] mb-1">Total Points</label>
                  <input
                    type="number"
                    id="totalPoints"
                    name="totalPoints"
                    value="100"
                    disabled
                    className="w-full px-3 py-2 bg-[#010101]/50 border border-[#3a3153] rounded text-[#b1aebb]"
                  />
                </div>
  
                <div className="mb-4">
                  <label htmlFor="instructions" className="block text-sm font-medium text-[#fefcfd] mb-1">Instructions</label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 py-2 bg-[#010101] border border-[#3a3153] rounded focus:outline-none focus:ring-1 focus:ring-[#5f43b2] text-[#fefcfd]"
                    required
                  ></textarea>
                </div>
  
                <div className="flex justify-end space-x-3 mt-6">
                  <motion.button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false)
                      setFormData({
                        title: "",
                        dueDate: "",
                        instructions: "",
                        totalPoints: ""
                      })
                    }
                  } 
                    className="px-4 py-2 bg-[#010101] border border-[#3a3153] rounded text-sm font-medium text-[#b1aebb] hover:text-[#fefcfd] shadow-sm hover:cursor-pointer"
                    whileHover={{ backgroundColor: "#010101", scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-4 py-2 bg-[#5f43b2] border border-transparent rounded text-sm font-medium text-white hover:bg-[#5f43b2]/90 shadow-sm hover:cursor-pointer"
                    whileHover={{ backgroundColor: "#6f53c2", scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Save Changes
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add global styles for dark mode calendar */}
      <style jsx global>{`
        /* Ensure the calendar dropdown is properly styled */
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
      `}</style>
    </motion.div>
  );
}