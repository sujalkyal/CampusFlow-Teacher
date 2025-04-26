import { useState } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from 'framer-motion';

const AddSessionCard = ({ subject_id, onSessionCreated }) => {
  const themeColors = {
    primary: '#5f43b2',
    secondary: '#010101',
    accent: '#3a3153',
    card: 'rgba(42, 42, 64, 0.4)',
    text: '#fefdfD',
    faded: '#b1aebb'
  };

  const [dateTime, setDateTime] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [title, setTitle] = useState("");

  const handleCreateSession = async () => {
    if (!dateTime || !title) {
      toast.warn("Please enter a title and date.");
      return;
    }

    try {
      await axios.post("/api/subject/session/createSession", {
        title,
        subject_id,
        date: dateTime,
      });

      toast.success("Session created successfully!");
      onSessionCreated();
      handleClosePopup();
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Failed to create session.");
    }
  };

  const handleClosePopup = () => {
    setTitle("");
    setDateTime("");
    setShowPopup(false);
  };

  return (
    <>
      <motion.div
        className="w-full h-full"
        whileHover={{ scale: 0.97 }}
        whileTap={{ scale: 0.97 }}
      >
        {!showPopup && (
          <motion.button
            onClick={() => setShowPopup(true)}
            className="w-full h-full p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-colors duration-300 hover:cursor-pointer"
            style={{ 
              borderColor: themeColors.accent,
              backgroundColor: themeColors.card,
              minHeight: '100px'
            }}
            whileHover={{ backgroundColor: themeColors.card }}
          >
            <Plus size={24} color={themeColors.primary} />
            <span className="mt-2 text-sm font-medium" style={{ color: themeColors.faded }}>Add Session</span>
          </motion.button>
        )}
      </motion.div>

      {/* Modal Portal */}
      <AnimatePresence>
        {showPopup && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          >
            {/* Dark overlay for the background */}
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClosePopup}
            />
            
            {/* Modal content with solid background */}
            <motion.div 
              className="rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative z-[60]"
              style={{ 
                backgroundColor: '#1f1e2e',
                boxShadow: '0 0 30px rgba(0,0,0,0.5)',
                border: `2px solid ${themeColors.primary}`
              }}
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 
                  className="text-xl font-semibold mb-6" 
                  style={{ color: themeColors.text }}
                >
                  Create New Session
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2" style={{ color: themeColors.faded }}>
                      Session Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter session title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                      style={{ 
                        backgroundColor: '#252338',
                        color: themeColors.text,
                        border: `1px solid ${themeColors.accent}`
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2" style={{ color: themeColors.faded }}>
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                      className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                      style={{ 
                        backgroundColor: '#252338',
                        color: themeColors.text,
                        border: `1px solid ${themeColors.accent}`
                      }}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-8">
                  <motion.button 
                    onClick={handleClosePopup}
                    className="px-5 py-2 rounded-lg hover:cursor-pointer"
                    style={{ backgroundColor: '#2a2941', color: themeColors.text }}
                    whileHover={{ scale: 1.05, backgroundColor: '#3a3953' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>

                  <motion.button 
                    onClick={handleCreateSession}
                    className="px-5 py-2 rounded-lg hover:cursor-pointer"
                    style={{ backgroundColor: themeColors.primary, color: themeColors.text }}
                    whileHover={{ scale: 1.05, backgroundColor: '#6f53c2' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        theme="dark"
        toastStyle={{ 
          backgroundColor: themeColors.card,
          color: themeColors.text
        }}
        style={{ zIndex: 61 }}
      />
    </>
  );
};

export default AddSessionCard;