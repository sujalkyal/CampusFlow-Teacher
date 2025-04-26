import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useEdgeStore } from "../app/lib/edgestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2 } from "lucide-react";

const EditTeacherPopup = ({ isOpen, onClose, teacher }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    dept_name: "",
    dept_id: "",
    batches: [],
    subjects: [],
    image: "",
  });
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { edgestore } = useEdgeStore();

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }

    try {
      const res = await edgestore.publicFiles.upload({
        file,
      });

      setFormData((prev) => ({ ...prev, image: res.url }));
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed.");
    }
  };

  const handleImageRemove = async () => {
    try {
      console.log("Removing image:", formData.image); // Debugging line
      //await edgestore.publicFiles.delete({ url: formData.image });
      setFormData((prev) => ({ ...prev, image: "" }));
    } catch (error) {
      console.error("Image removal failed:", error);
      toast.error("Failed to remove image.");
    }
  };

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name,
        email: teacher.email,
        oldPassword: "",
        newPassword: "",
        dept_name: teacher.dept_name,
        dept_id: teacher.dept_id,
        batches: teacher.batches || [],
        subjects: teacher.subjects,
        image: teacher.image || "",
      });

      fetchBatches(teacher.dept_id); // fetch batches first
      fetchSubjects(teacher.batches); // fetch subjects for these batches
    }
  }, [teacher]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("/api/dept/getAllDept");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const fetchBatches = async (deptId) => {
    try {
      const response = await axios.post("/api/batch/getAllBatches", {
        dept_id: deptId,
      });
      setBatches(response.data);
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast.error("Failed to load batches", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const fetchSubjects = async (batchIds) => {
    try {
      const response = await axios.post("/api/subject/getSubjectsByBatches", {
        batch_ids: batchIds,
      });
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to load subjects", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchDepartments();
    if (teacher) {
      fetchBatches(teacher.dept_id);
    }
  }, [teacher]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDepartmentChange = (e) => {
    const selectedDeptId = e.target.value;
    setFormData({
      ...formData,
      dept_id: selectedDeptId,
      batches: [],
      subjects: [],
    });
    fetchBatches(selectedDeptId);
  };

  const handleBatchChange = (e) => {
    const clickedValue = e.target.value;
    const newSelection = formData.batches.includes(clickedValue)
      ? formData.batches.filter((id) => id !== clickedValue)
      : [...formData.batches, clickedValue];

    setFormData({
      ...formData,
      batches: newSelection,
      subjects: [],
    });

    fetchSubjects(newSelection);
  };

  const handleSubjectChange = (e) => {
    const clickedValue = e.target.value;
    const newSelection = formData.subjects.includes(clickedValue)
      ? formData.subjects.filter((id) => id !== clickedValue)
      : [...formData.subjects, clickedValue];

    setFormData({
      ...formData,
      subjects: newSelection,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Form Data:", formData); // Debugging line

    try {
      await axios.post("/api/teacher/editDetails", formData, {
        withCredentials: true,
      });

      toast.success("Details updated successfully!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "bg-gradient-to-r from-[#5f43b2] to-[#3a3153] text-white",
        progressClassName: "bg-white/30",
        onClose: () => {
          onClose();
          window.location.reload();
        },
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      console.error("Update failed:", errorMessage);

      toast.error(`Update failed: ${errorMessage}`, {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "bg-gradient-to-r from-red-600 to-red-800 text-white",
        progressClassName: "bg-white/30",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50">
      <ToastContainer
        theme="dark"
        limit={3}
        className="custom-scrollbar"
        toastClassName="rounded-lg shadow-xl backdrop-blur-md"
      />

      <motion.div
        className="bg-gradient-to-br from-[#2f2f45] to-[#1e1e2f] text-[#fefdfd] p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-[#b1aebb]">
          Edit Teacher Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-[#b1aebb]">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f43b2]/50 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-[#b1aebb]">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f43b2]/50 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-[#b1aebb]">Current Password</label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Current Password"
              required
              className="w-full p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f43b2]/50 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-[#b1aebb]">
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              className="w-full p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f43b2]/50 transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#b1aebb] font-medium">
              Profile Image
            </label>
            {formData.image!=="" ? (
              <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-md border border-[#5f43b2]">
                <img
                  src={formData.image}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute top-1 right-1 text-red-500 hover:text-red-700 p-1.5 rounded-md transition-colors hover:cursor-pointer"
                  title="Remove Image"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ) : (
              <label className="block w-full cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="w-full p-3 text-center text-sm bg-[#1e1e2f] border-2 border-dashed border-[#5f43b2] rounded-lg hover:border-[#7c5dfa] hover:bg-[#26263d] transition-all">
                  Click to upload image
                </div>
              </label>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-[#b1aebb]">Department</label>
            <select
              name="dept_id"
              value={formData.dept_id}
              onChange={handleDepartmentChange}
              className="w-full p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f43b2]/50 custom-scrollbar transition"
            >
              <option value="" disabled>
                Select Department
              </option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-[#b1aebb]">Batches</label>
            <div className="grid grid-cols-2 gap-2 p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg max-h-32 overflow-y-auto custom-scrollbar">
              {batches.map((batch) => (
                <label
                  key={batch.id}
                  className="flex items-center gap-2 text-sm text-white"
                >
                  <input
                    type="checkbox"
                    value={batch.id}
                    checked={formData.batches.includes(batch.id)}
                    onChange={handleBatchChange}
                  />
                  {batch.name}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-[#b1aebb]">Subjects</label>
            <div className="grid grid-cols-2 gap-2 p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg max-h-32 overflow-y-auto custom-scrollbar">
              {subjects.map((subject) => (
                <label
                  key={subject.id}
                  className="flex items-center gap-2 text-sm text-white"
                >
                  <input
                    type="checkbox"
                    value={subject.id}
                    checked={formData.subjects.includes(subject.id)}
                    onChange={handleSubjectChange}
                  />
                  {subject.name}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
            >
              Cancel
            </motion.button>

            <motion.button
              type="submit"
              className={`px-4 py-2 bg-[#5f43b2] text-white rounded-lg flex items-center justify-center min-w-[80px] ${isSubmitting ? "opacity-70" : "hover:bg-[#3a3153]"} hover:cursor-pointer`}
              whileHover={!isSubmitting ? { scale: 1.05 } : {}}
              whileTap={!isSubmitting ? { scale: 0.95 } : {}}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                "Save Changes"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditTeacherPopup;
