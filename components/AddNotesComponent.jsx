import { useState } from "react";
import { Check, X, Upload, File, Trash2 } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEdgeStore } from "../app/lib/edgestore";
import { motion, AnimatePresence } from "framer-motion";

const AddNoteCard = ({ subject_id, onNoteCreated }) => {
  // Theme colors
  const themeColors = {
    primary: "#5f43b2", // Main purple
    secondary: "#010101", // Black
    accent: "#3a3153", // Darker purple
    card: "rgba(42, 42, 64, 0.4)",
    text: "#fefdfD", // White text
    faded: "#b1aebb", // Gray text
  };

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    files: [],
  });
  const [uploading, setUploading] = useState(false);

  // EdgeStore setup
  const { edgestore } = useEdgeStore();
  const publicFiles = edgestore.publicFiles;

  const handleFileChange = async (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles.length) return;

    setUploading(true);
    try {
      const uploadedUrls = [];

      for (const file of selectedFiles) {
        const res = await publicFiles.upload({ file });
        uploadedUrls.push(res.url);
      }

      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...uploadedUrls],
      }));

      toast.success("Files uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleClosePopup = () => {
    setFormData({ title: "", desc: "", files: [] });
    if (onNoteCreated) onNoteCreated();
  };

  const handleSubmit = async () => {
    if (!formData.title && formData.files.length === 0) {
      toast.warn("Please add a title or upload at least one file.");
      return;
    }

    try {
      await axios.post("/api/subject/notes/addNotes", {
        title: formData.title,
        description: formData.desc,
        subject_id,
        files: formData.files,
      });

      toast.success("Note added!");
      if (onNoteCreated) onNoteCreated();

      // Reset
      setFormData({ title: "", desc: "", files: [] });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add note.");
    }
  };

  const removeFile = (urlToRemove) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((url) => url !== urlToRemove),
    }));
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      {/* Modal Popup */}
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
        >
          {/* Opaque Background Overlay */}
          <div
            className="fixed inset-0"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
            onClick={handleClosePopup}
          ></div>

          {/* Modal Content */}
          <motion.div
            className="relative z-10 w-full max-w-lg mx-auto max-h-screen overflow-auto"
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
          >
            <div
              className="rounded-xl overflow-hidden border-l-4"
              style={{
                backgroundColor: "rgba(15, 15, 20, 0.95)",
                borderLeftColor: themeColors.primary,
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 pb-4">
                <h2 className="text-2xl font-bold" style={{ color: "#a594ff" }}>
                  Create New Note
                </h2>
                <button
                  onClick={handleClosePopup}
                  className="p-1 rounded-full hover:cursor-pointer"
                  style={{ backgroundColor: "rgba(58, 49, 83, 0.4)" }}
                >
                  <X size={20} color={themeColors.faded} />
                </button>
              </div>

              <div
                className="w-full h-px"
                style={{ backgroundColor: "rgba(58, 49, 83, 0.5)" }}
              ></div>

              {/* Form Content */}
              <div className="p-6">
                <div className="space-y-5">
                  {/* Title Input */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: themeColors.faded }}
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter a title for your note"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full p-3 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all"
                      style={{
                        backgroundColor: "rgba(58, 49, 83, 0.4)",
                        color: themeColors.text,
                        border: `1px solid ${themeColors.accent}`,
                      }}
                    />
                  </div>

                  {/* Description Textarea */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: themeColors.faded }}
                    >
                      Description
                    </label>
                    <textarea
                      placeholder="Add some details about this note"
                      value={formData.desc}
                      onChange={(e) =>
                        setFormData({ ...formData, desc: e.target.value })
                      }
                      rows="4"
                      className="w-full p-3 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all"
                      style={{
                        backgroundColor: "rgba(58, 49, 83, 0.4)",
                        color: themeColors.text,
                        border: `1px solid ${themeColors.accent}`,
                        resize: "vertical",
                      }}
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: themeColors.faded }}
                    >
                      Attachments
                    </label>
                    <div className="relative overflow-hidden rounded-lg">
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileChange(e)}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                        disabled={uploading}
                      />
                      <div
                        className="w-full p-3 flex items-center justify-center cursor-pointer border border-dashed"
                        style={{
                          borderColor: themeColors.accent,
                          backgroundColor: "rgba(58, 49, 83, 0.3)",
                        }}
                      >
                        <Upload
                          size={18}
                          className="mr-2"
                          color={themeColors.primary}
                        />
                        <span style={{ color: themeColors.faded }}>
                          {uploading
                            ? `Uploading... `
                            : "Click to upload files"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* File Preview Section */}
                  {formData.files.length > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <label
                          className="text-sm font-medium"
                          style={{ color: themeColors.faded }}
                        >
                          File Previews ({formData.files.length})
                        </label>
                      </div>

                      <div
                        className="grid grid-cols-2 gap-3 max-h-52 overflow-y-auto p-2 rounded-lg"
                        style={{ backgroundColor: "rgba(58, 49, 83, 0.2)" }}
                      >
                        {formData.files.map((fileUrl, index) => {
                          const isImage = fileUrl.match(
                            /\.(jpeg|jpg|png|gif|bmp|webp)$/i
                          );

                          return (
                            <div
                              key={index}
                              className="relative rounded-lg overflow-hidden"
                              style={{
                                backgroundColor: "rgba(58, 49, 83, 0.4)",
                              }}
                            >
                              <div className="p-2">
                                {isImage ? (
                                  <div className="relative">
                                    <img
                                      src={fileUrl}
                                      alt={`uploaded-file-${index}`}
                                      className="w-full h-24 object-cover rounded-md mb-1"
                                    />
                                    <div
                                      className="absolute top-0 right-0 m-1 p-1 rounded-full cursor-pointer"
                                      style={{
                                        backgroundColor: "rgba(0,0,0,0.5)",
                                      }}
                                      onClick={() => removeFile(fileUrl)}
                                    >
                                      <Trash2 size={14} color="white" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center p-2">
                                    <File
                                      size={20}
                                      className="mr-2 flex-shrink-0"
                                      color={themeColors.primary}
                                    />
                                    <div className="truncate flex-1 min-w-0">
                                      <div
                                        className="text-xs truncate"
                                        style={{ color: themeColors.text }}
                                      >
                                        {fileUrl.split("/").pop()}
                                      </div>
                                    </div>
                                    <button
                                      className="ml-2 p-1 rounded-full bg-red-500 bg-opacity-20 cursor-pointer"
                                      onClick={() => removeFile(fileUrl)}
                                    >
                                      <Trash2 size={14} color="#ff6b6b" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleClosePopup}
                    className="px-5 py-2 rounded-lg font-medium hover:cursor-pointer"
                    style={{
                      backgroundColor: "rgba(58, 49, 83, 0.4)",
                      color: themeColors.faded,
                      border: `1px solid ${themeColors.accent}`,
                    }}
                    disabled={uploading}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSubmit}
                    className="px-5 py-2 rounded-lg font-medium flex items-center hover:cursor-pointer"
                    style={{
                      backgroundColor: themeColors.primary,
                      color: themeColors.text,
                    }}
                    disabled={uploading}
                  >
                    <Check size={18} className="mr-2" />
                    {uploading ? "Uploading..." : "Save Note"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: themeColors.card,
          color: themeColors.text,
          borderLeft: `4px solid ${themeColors.primary}`,
        }}
      />
    </>
  );
};

export default AddNoteCard;
