'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import AddFiles from './AddFiles';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Image as ImageIcon, FileSpreadsheet, File, Upload, Loader2 } from 'lucide-react';

export default function FilesSection() {
  const params = useParams();
  const assignmentId = params?.id;
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch files when component mounts
  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true);
      try {
        const res = await axios.post('/api/session/assignment/getFiles', { assignment_id: assignmentId });
        setFiles(res.data.files || []);
      } catch (err) {
        console.error('Error fetching files:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (assignmentId) fetchFiles();
  }, [assignmentId]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  // Function to handle successful image load
  const handleImageLoaded = (fileUrl) => {
    setPreviewLoaded(prev => ({...prev, [fileUrl]: true}));
  };

  // Function to determine file type and preview
  const getFilePreview = (file) => {
    const fileName = file ? decodeURIComponent(file.split('/').pop()) : '';
    const isPreviewLoaded = previewLoaded[file];
    
    if (file?.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
      return {
        preview: (
          <div className="w-full aspect-square bg-[#121218] rounded-md overflow-hidden flex items-center justify-center relative z-0">
            {/* Skeleton loader shown until image loads */}
            {!isPreviewLoaded && (
              <div className="absolute inset-0 z-0 bg-[#3a3153]/30 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-[#5f43b2]/50" />
              </div>
            )}
            <div className="absolute inset-0 z-10">
              <img 
                src={file} 
                alt={fileName} 
                className={`w-full h-full object-cover transition-opacity duration-300 ${isPreviewLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => handleImageLoaded(file)}
                style={{ objectFit: 'cover' }}
                crossOrigin="anonymous"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%235f43b2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';
                  e.target.className = "w-12 h-12 object-contain opacity-70 absolute-center";
                  handleImageLoaded(file);
                }}
              />
            </div>
            {/* Overlay gradient to ensure text visibility */}
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/60 to-transparent z-20"></div>
          </div>
        ),
        icon: (
          <ImageIcon className="h-5 w-5" />
        ),
        type: 'Image',
      };
    } else if (file?.endsWith('.pdf')) {
      return {
        preview: (
          <div className="w-full aspect-square bg-[#121218] rounded-md flex items-center justify-center">
            <div className="w-16 h-20 bg-[#1e1c29] border border-[#3a3153]/40 rounded flex items-center justify-center relative shadow-md">
              <div className="absolute top-0 right-0 w-6 h-6 bg-[#5f43b2] rounded-bl flex items-center justify-center">
                <span className="text-[9px] text-white font-bold">PDF</span>
              </div>
              <FileText className="h-6 w-6 text-[#5f43b2]" />
            </div>
          </div>
        ),
        icon: (
          <FileText className="h-5 w-5" />
        ),
        type: 'PDF',
      };
    } else if (file?.match(/\.(doc|docx)$/i)) {
      return {
        preview: (
          <div className="w-full aspect-square bg-[#121218] rounded-md flex items-center justify-center">
            <div className="w-16 h-20 bg-[#1e1c29] border border-[#3a3153]/40 rounded flex items-center justify-center relative shadow-md">
              <div className="absolute top-0 right-0 w-6 h-6 bg-[#5f43b2] rounded-bl flex items-center justify-center">
                <span className="text-[9px] text-white font-bold">DOC</span>
              </div>
              <FileText className="h-6 w-6 text-[#5f43b2]" />
            </div>
          </div>
        ),
        icon: (
          <FileText className="h-5 w-5" />
        ),
        type: 'Document',
      };
    } else if (file?.match(/\.(xls|xlsx|csv)$/i)) {
      return {
        preview: (
          <div className="w-full aspect-square bg-[#121218] rounded-md flex items-center justify-center">
            <div className="w-16 h-20 bg-[#1e1c29] border border-[#3a3153]/40 rounded flex items-center justify-center relative shadow-md">
              <div className="absolute top-0 right-0 w-6 h-6 bg-[#5f43b2] rounded-bl flex items-center justify-center">
                <span className="text-[9px] text-white font-bold">XLS</span>
              </div>
              <FileSpreadsheet className="h-6 w-6 text-[#5f43b2]" />
            </div>
          </div>
        ),
        icon: (
          <FileSpreadsheet className="h-5 w-5" />
        ),
        type: 'Spreadsheet',
      };
    } else {
      // Generic file preview
      const extension = fileName.split('.').pop()?.toUpperCase() || 'FILE';
      return {
        preview: (
          <div className="w-full aspect-square bg-[#121218] rounded-md flex items-center justify-center">
            <div className="w-16 h-20 bg-[#1e1c29] border border-[#3a3153]/40 rounded flex items-center justify-center relative shadow-md">
              <div className="absolute top-0 right-0 w-6 h-6 bg-[#5f43b2] rounded-bl flex items-center justify-center">
                <span className="text-[9px] text-white font-bold">{extension.substring(0, 3)}</span>
              </div>
              <File className="h-6 w-6 text-[#5f43b2]" />
            </div>
          </div>
        ),
        icon: (
          <File className="h-5 w-5" />
        ),
        type: extension.length > 0 ? extension : 'File',
      };
    }
  };

  return (
    <motion.div 
      className="bg-[#1a1a24] text-[#fefcfd] p-6 rounded-xl border border-[#3a3153]/40 shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-[#5f43b2] to-[#3a3153] w-10 h-10 rounded-lg flex items-center justify-center shadow-md mr-3">
            <Upload className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#fefcfd]">Assignment Files</h2>
            <p className="text-xs text-[#b1aebb] mt-0.5">Upload and manage assignment resources</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#5f43b2] hover:bg-[#5f43b2]/90 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 shadow-md shadow-[#5f43b2]/10 hover:cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Upload Files
        </motion.button>
      </motion.div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-[#5f43b2] animate-spin mb-2" />
          <p className="text-[#b1aebb] text-sm">Loading files...</p>
        </div>
      ) : files.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {files.map((file, idx) => {
            const fileInfo = getFilePreview(file);
            
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ 
                  y: -4,
                  transition: { duration: 0.2 }
                }}
                className="group"
              >
                <motion.div 
                  onClick={() => window.open(file, '_blank')}
                  className="cursor-pointer bg-[#121218] hover:bg-[#3a3153]/80 rounded-lg overflow-hidden flex flex-col transition-colors duration-200 h-full border border-[#3a3153]/30 shadow-md"
                  layoutId={`file-${idx}`}
                >
                  {/* File Preview */}
                  <div className="relative">
                    {fileInfo.preview}
                  </div>
                  
                  {/* File Info */}
                  <div className="p-3 flex-grow flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div className="bg-[#5f43b2]/20 p-1 rounded mr-1.5 flex">
                          {fileInfo.icon}
                        </div>
                        <span className="text-xs font-medium text-[#b1aebb]">
                          {fileInfo.type}
                        </span>
                      </div>
                      <motion.div 
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-[#5f43b2]/20 rounded-full hover:bg-[#5f43b2]/30"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(file, '_blank');
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#5f43b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </motion.div>
                    </div>
                    <p className="text-xs text-[#fefcfd] truncate w-full font-medium" title={fileInfo.name}>
                      {fileInfo.name}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center bg-[#121218] border border-[#3a3153]/20 rounded-lg py-12 px-4"
        >
          <div className="bg-[#3a3153]/30 p-4 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#5f43b2]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-[#fefcfd] font-medium mb-1">No files uploaded yet</h3>
          <p className="text-[#b1aebb] text-sm mb-4 text-center">Upload files for students to access</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="bg-[#5f43b2] hover:bg-[#5f43b2]/90 text-white py-2 px-6 rounded-lg text-sm font-medium transition-all duration-200 shadow-md"
          >
            Upload your first file
          </motion.button>
        </motion.div>
      )}

      {/* Upload File Modal */}
      <AnimatePresence>
        {showModal && (
          <AddFiles
            assignmentId={assignmentId}
            files={files}
            setFiles={setFiles}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Custom styles to fix image rendering */}
      <style jsx global>{`
        .absolute-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </motion.div>
  );
}