import React, { useState } from 'react';
import { Trash2, Plus, X, FileText, ExternalLink, Upload, Loader } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEdgeStore } from '../../../teacher/app/lib/edgestore';
import { motion, AnimatePresence } from 'framer-motion';

const FilesUploadModal = ({ assignmentId, files, setFiles, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [deleteFiles, setDeleteFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { edgestore } = useEdgeStore();

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleDelete = (file) => {
    setFiles((prev) => prev.filter((f) => f !== file));
    setDeleteFiles((prev) => [...prev, file]);
    toast.success('File removed!');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Even if files array is empty, we should still update the assignment
      await axios.post('/api/session/assignment/updateFiles', {
        assignment_id: assignmentId,
        files: files || [], // Always send an array, even if empty
      });

      // Delete files that were removed
      for (const file of deleteFiles) {
        await edgestore.publicFiles.delete({ url: file }).catch(err => {
          console.warn('Failed to delete file from storage, but continuing:', err);
          // Continue execution even if file deletion fails
        });
      }

      toast.success('Files updated successfully!');
      handleClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update files: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    
    setIsUploading(true);
    try {
      const uploadedFiles = [];

      for (const file of fileList) {
        const res = await edgestore.publicFiles.upload({ file });
        uploadedFiles.push(res.url);
      }

      setFiles((prev) => [...prev, ...uploadedFiles]);
      toast.success('Files uploaded successfully!');
    } catch (error) {
      toast.error('Error uploading file');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop with blur */}
        <motion.div 
          className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div 
          className="bg-[#1a1a24] border border-[#3a3153] rounded-xl shadow-xl w-full max-w-md m-4 relative z-10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-[#3a3153]/50">
            <h2 className="text-xl font-semibold text-[#fefcfd] flex items-center">
              <Upload size={18} className="mr-2 text-[#5f43b2]" />
              Upload Files
            </h2>
            <motion.button 
              onClick={handleClose}
              className="text-[#b1aebb] hover:text-[#fefcfd] p-1 rounded-full hover:bg-[#3a3153]/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="mb-5">
              <div className="flex items-center mb-3">
                <span className="block w-1 h-5 bg-[#5f43b2] mr-2"></span>
                <h3 className="text-[#fefcfd] font-medium">Attached Files</h3>
              </div>

              {/* Grid of files */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                {files && files.length > 0 ? (
                  files.map((file, index) => {
                    const fileName = decodeURIComponent(file.split('/').pop()).substring(0, 10) + "...";
                    const isImage = /\.(jpeg|jpg|png|gif)$/.test(file);
                    const isPdf = file.endsWith('.pdf');
                    
                    return (
                      <motion.div 
                        key={index} 
                        className="group relative bg-[#010101]/50 rounded-lg overflow-hidden border border-[#3a3153]/40"
                        whileHover={{ scale: 1.02 }}
                        layout
                      >
                        <div className="p-3 h-24 flex flex-col items-center justify-center">
                          {isImage ? (
                            <div className="w-12 h-12 mb-2 rounded-md overflow-hidden">
                              <img
                                src={file}
                                alt={fileName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : isPdf ? (
                            <div className="w-12 h-12 mb-2 flex items-center justify-center bg-[#5f43b2]/20 rounded-md">
                              <FileText size={24} className="text-[#5f43b2]" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 mb-2 flex items-center justify-center bg-[#5f43b2]/20 rounded-md">
                              <FileText size={24} className="text-[#5f43b2]" />
                            </div>
                          )}
                          
                          <p className="text-xs text-[#b1aebb] text-center">{fileName}</p>
                          
                          <div className="absolute inset-0 bg-[#010101]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex space-x-2">
                              <motion.button
                                onClick={() => window.open(file, '_blank')}
                                className="p-2 bg-[#5f43b2]/80 rounded-full"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <ExternalLink size={16} className="text-white" />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDelete(file)}
                                className="p-2 bg-red-500/80 rounded-full"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 size={16} className="text-white" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <p className="col-span-3 text-[#b1aebb] text-sm py-4 text-center bg-[#010101]/30 rounded-lg">
                    No files attached yet.
                  </p>
                )}
                
                {/* Add File Button */}
                <motion.label 
                  className="cursor-pointer group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="border-2 border-dashed border-[#3a3153] h-24 rounded-lg flex flex-col items-center justify-center hover:bg-[#3a3153]/10 transition-colors">
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      onChange={(e) => handleFileUpload(e.target.files)}
                      disabled={isUploading}
                    />
                    {isUploading ? (
                      <>
                        <Loader size={24} className="text-[#5f43b2] mb-1 animate-spin" />
                        <span className="text-xs text-[#b1aebb]">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={24} className="text-[#5f43b2] mb-1" />
                        <span className="text-xs text-[#b1aebb] group-hover:text-[#fefcfd]">Add file</span>
                      </>
                    )}
                  </div>
                </motion.label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <motion.button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-[#010101] border border-[#3a3153] rounded text-sm font-medium text-[#b1aebb] hover:text-[#fefcfd] shadow-sm"
                whileHover={{ backgroundColor: "#010101", scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting || isUploading}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSubmit}
                className="px-4 py-2 bg-[#5f43b2] border border-transparent rounded text-sm font-medium text-white hover:bg-[#5f43b2]/90 shadow-sm flex items-center"
                whileHover={{ backgroundColor: "#6f53c2", scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={16} className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Toast Container with custom styling */}
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          theme="dark"
          toastClassName="!bg-[#1a1a24] !text-[#fefcfd] border border-[#3a3153]"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default FilesUploadModal;
