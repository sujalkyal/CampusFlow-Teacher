import React, { useState, useEffect } from 'react';
import { Trash2, Plus, File, X } from 'lucide-react'; // Added File and X icons
import { useEdgeStore } from '../app/lib/edgestore';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion'; // Added framer-motion

const NotesViewPopUp = ({ note, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [noteDetails, setNoteDetails] = useState(null);
  const [deleteFiles, setDeleteFiles] = useState([]);
  const { edgestore } = useEdgeStore();

  useEffect(() => {
    if (note) {
      setNoteDetails(note);
    }
  }, [note]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleDelete = async (fileUrl) => {
    try {
      setNoteDetails((prev) => ({
        ...prev,
        files: prev.files.filter((url) => url !== fileUrl),
      }));
      setDeleteFiles((prev) => [...prev, fileUrl]); // Add to delete notes
      toast.success('File deleted successfully!');
    } catch (error) {
      toast.error('Error deleting file');
      console.error('Error deleting file:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      //console.log('noteDetails: ', noteDetails); // Log the note details before sending

      const response = await axios.post('/api/subject/notes/updateFiles', {
        note_id: noteDetails.id,
        files: noteDetails.files,
      });

      for (const fileUrl of deleteFiles) {
        await edgestore.publicFiles.delete({
          url: fileUrl,
        });
      }

      if (response.status !== 200) throw new Error('Failed to update note files');

      toast.success('Note updated successfully!');
      setIsOpen(false);
      onClose();
      window.location.reload(); // Reload the page to reflect changes
    } catch (error) {
      toast.error('Error updating note');
      console.error('Error updating note:', error);
    }
  };

  const handleFileUpload = async (files) => {
    if (!files) return;
    const newFiles = [];

    try {
      for (const file of files) {
        const res = await edgestore.publicFiles.upload({ file });
        newFiles.push(res.url); // Get the uploaded file URL
      }

      setNoteDetails((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles], // Append new file URLs to existing ones
      }));

      toast.success('Files uploaded successfully!');
      //console.log('files: ', noteDetails.files); // Log the updated note details
    } catch (error) {
      toast.error('Error uploading file');
      console.error('Error uploading file:', error);
    }
  };

  if (!isOpen || !noteDetails) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-[#010101] rounded-lg shadow-2xl p-6 w-full max-w-md relative border border-[#3a3153]/30"
          >
            {/* Close button in top right */}
            <button 
              onClick={handleClose} 
              className="absolute top-4 right-4 text-[#b1aebb] hover:text-[#fefcfd] transition-colors hover:cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-semibold mb-2 text-[#fefcfd]">{noteDetails.title}</h2>
            <p className="text-[#b1aebb] mb-6">{noteDetails.description}</p>
            
            <div className="mb-6">
              <h3 className="text-md font-medium mb-3 text-[#5f43b2]">Files</h3>
              <div className="grid grid-cols-3 gap-3">
                {noteDetails.files && noteDetails.files.length > 0 ? (
                  noteDetails.files.map((fileUrl, index) => {
                    const fileName = decodeURIComponent(fileUrl.split('/').pop().substring(0, 12)); // Extract and truncate file name
                    
                    return (
                      <motion.div 
                        key={index} 
                        whileHover={{ scale: 1.05 }}
                        className="relative bg-[#3a3153]/30 p-2 rounded-lg group overflow-hidden"
                      >
                        {fileUrl.match(/\.(jpeg|jpg|png|gif)$/) ? (
                          <div className="w-16 h-16 mx-auto">
                            <img
                              src={fileUrl}
                              alt={fileName}
                              className="w-full h-full object-cover rounded cursor-pointer"
                              onClick={() => window.open(fileUrl, '_blank')}
                            />
                          </div>
                        ) : fileUrl.endsWith('.pdf') ? (
                          <div className="w-16 h-16 mx-auto bg-[#3a3153]/50 rounded flex items-center justify-center cursor-pointer"
                               onClick={() => window.open(fileUrl, '_blank')}>
                            <File size={24} className="text-[#5f43b2]" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 mx-auto bg-[#3a3153]/50 rounded flex items-center justify-center cursor-pointer"
                               onClick={() => window.open(fileUrl, '_blank')}>
                            <File size={24} className="text-[#5f43b2]" />
                          </div>
                        )}
                        
                        <p className="text-xs text-center mt-1 text-[#b1aebb] truncate">{fileName}</p>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(fileUrl)} 
                          className="absolute top-1 right-1 p-1 rounded-full bg-[#010101]/80 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </motion.div>
                    );
                  })
                ) : (
                  <p className="col-span-3 text-[#b1aebb] text-center">No files available</p>
                )}

                {/* Add File Button */}
                <motion.label 
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(95, 67, 178, 0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 flex flex-col items-center justify-center border border-dashed border-[#5f43b2]/40 rounded cursor-pointer transition-colors mx-auto"
                >
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                  <Plus size={20} className="text-[#5f43b2] mb-1" />
                  <span className="text-xs text-[#b1aebb]">Add file</span>
                </motion.label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose} 
                className="bg-[#3a3153] text-[#b1aebb] px-4 py-2 rounded hover:text-[#fefcfd] transition-colors hover:cursor-pointer"
              >
                Cancel
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit} 
                className="bg-[#5f43b2] text-[#fefcfd] px-4 py-2 rounded hover:cursor-pointer"
              >
                Save Changes
              </motion.button>
            </div>
          </motion.div>

          {/* Customized Toast Container */}
          <ToastContainer 
            position="top-right" 
            autoClose={3000}
            toastClassName={() => 
              "bg-[#3a3153] text-[#fefcfd] relative flex p-3 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer mb-2"
            }
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotesViewPopUp;