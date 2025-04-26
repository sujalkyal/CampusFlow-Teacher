"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  BookOpen, User, Mail, Lock, ArrowRight, 
  Briefcase, Calendar, BookText, Eye, EyeOff 
} from "lucide-react";

export default function Signup() {
  const router = useRouter();
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("/api/dept/getAllDept");
        setDepartments(res.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load departments. Please try again.");
      }
    };
    fetchDepartments();
  }, []);

  const handleDeptChange = async (deptId) => {
    setSelectedDept(deptId);
    setSelectedBatches([]);
    setSelectedSubjects([]);
    
    if (!deptId) return;
    
    setIsLoading(true);
    try {
      const res = await axios.post("/api/batch/getAllBatches", { dept_id: deptId });
      setBatches(res.data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to load batches. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchChange = async (e) => {
    const selectedBatchIds = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedBatches(selectedBatchIds);
    setSelectedSubjects([]); // Reset subjects when batches change

    if (selectedBatchIds.length > 0) {
      setIsLoading(true);
      try {
        const res = await axios.post("/api/subject/getSubjectsByBatches", { batch_ids: selectedBatchIds });
        setSubjects(res.data);
        setError("");
      } catch (error) {
        console.error(error);
        setError("Failed to load subjects. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setSubjects([]);
    }
  };

  const handleSubjectChange = (e) => {
    const selectedSubjectIds = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedSubjects(selectedSubjectIds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await axios.post("/api/auth/signup", {
        ...form,
        deptId: selectedDept,
        batchIds: selectedBatches,
        subjectIds: selectedSubjects,
      });
      router.push("/auth/signin");
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#010101]">
      {/* Left side with form */}
      <motion.div 
        className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div 
            className="mb-10"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center group gap-3">
            <img 
                src="/logo_transparent.png" 
                alt="Logo" 
                className="w-20 h-20"
              />
              <span className="text-3xl font-bold text-[#fefdfd]">CampusFlow</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-3xl font-semibold text-[#fefdfd] mb-3">Faculty Registration</h1>
            <p className="text-[#b1aebb] mb-6">Create your teacher account</p>

            {error && (
              <motion.div 
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5f43b2] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  className="w-full p-4 pl-12 bg-[#3a3153]/20 border border-[#5f43b2]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f43b2]/50 focus:border-transparent text-[#fefdfd] placeholder-[#b1aebb]/50"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  value={form.name}
                />
              </div>
              
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5f43b2] w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full p-4 pl-12 bg-[#3a3153]/20 border border-[#5f43b2]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f43b2]/50 focus:border-transparent text-[#fefdfd] placeholder-[#b1aebb]/50"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  value={form.email}
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5f43b2] w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="w-full p-4 pl-12 bg-[#3a3153]/20 border border-[#5f43b2]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f43b2]/50 focus:border-transparent text-[#fefdfd] placeholder-[#b1aebb]/50"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  value={form.password}
                />
                <button 
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#b1aebb]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5 hover:cursor-pointer" /> : <Eye className="w-5 h-5 hover:cursor-pointer" />}
                </button>
              </div>

              {/* Department Selection */}
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5f43b2] w-5 h-5" />
                <select 
                  className="w-full p-4 pl-12 bg-[#3a3153]/20 border border-[#5f43b2]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f43b2]/50 focus:border-transparent text-[#fefdfd] appearance-none"
                  onChange={(e) => handleDeptChange(e.target.value)} 
                  required
                  value={selectedDept}
                >
                  <option value="" className="bg-[#010101]">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id} className="bg-[#010101]">
                      {dept.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#b1aebb]">
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>
              </div>

              {/* Multi-Select for Batches */}
              {batches.length > 0 && (
                <div className="relative">
                  <Calendar className="absolute left-4 top-6 text-[#5f43b2] w-5 h-5" />
                  <label className="block mb-2 text-sm text-[#b1aebb] pl-12">Select Batches (Hold Ctrl/Cmd for multiple)</label>
                  <select
                    multiple
                    className="w-full p-4 pl-12 bg-[#3a3153]/20 border border-[#5f43b2]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f43b2]/50 focus:border-transparent text-[#fefdfd] h-32"
                    onChange={handleBatchChange}
                    required
                  >
                    {batches.map((batch) => (
                      <option key={batch.id} value={batch.id} className="p-2 hover:bg-[#5f43b2]/20">
                        {batch.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Multi-Select for Subjects */}
              {subjects.length > 0 && (
                <div className="relative">
                  <BookText className="absolute left-4 top-6 text-[#5f43b2] w-5 h-5" />
                  <label className="block mb-2 text-sm text-[#b1aebb] pl-12">Select Subjects (Hold Ctrl/Cmd for multiple)</label>
                  <select
                    multiple
                    className="w-full p-4 pl-12 bg-[#3a3153]/20 border border-[#5f43b2]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f43b2]/50 focus:border-transparent text-[#fefdfd] h-32"
                    onChange={handleSubjectChange}
                    required
                  >
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id} className="p-2 hover:bg-[#5f43b2]/20">
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <motion.button
                type="submit"
                className="w-full bg-[#5f43b2] text-white p-4 rounded-xl hover:bg-[#5f43b2]/90 flex items-center justify-center font-medium transition-all duration-300 mt-6 hover:cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center text-[#b1aebb] text-sm">
              Already have an account? <Link href="/auth/signin" className="text-[#5f43b2] hover:text-[#5f43b2]/80 transition-colors">Sign in</Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side with abstract image */}
      <motion.div 
        className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-[#3a3153] to-[#010101] relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Abstract shapes */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#5f43b2]/20 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.div 
            className="absolute bottom-1/3 right-1/3 w-60 h-60 rounded-full bg-[#5f43b2]/30 blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          />
          <motion.div 
            className="absolute top-2/3 left-1/3 w-40 h-40 rounded-full bg-[#3a3153]/40 blur-3xl"
            animate={{ 
              scale: [0.8, 1.1, 0.8],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ duration: 7, repeat: Infinity, repeatType: "reverse", delay: 2 }}
          />
        </div>

        {/* Geometric elements */}
        <svg className="absolute inset-0 w-full h-full z-10" xmlns="http://www.w3.org/2000/svg">
          <rect x="65%" y="20%" width="80" height="80" rx="12" fill="#5f43b2" fillOpacity="0.2" />
          <rect x="30%" y="60%" width="120" height="120" rx="12" fill="#5f43b2" fillOpacity="0.2" />
          <rect x="75%" y="70%" width="60" height="60" rx="12" fill="#5f43b2" fillOpacity="0.2" />
          <circle cx="20%" cy="30%" r="40" fill="#5f43b2" fillOpacity="0.2" />
          <circle cx="80%" cy="40%" r="20" fill="#5f43b2" fillOpacity="0.2" />
          
          <motion.path 
            d="M100,100 Q200,50 300,200 T500,300" 
            stroke="#5f43b2" 
            strokeWidth="2"
            strokeOpacity="0.3"
            fill="transparent"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
          />
          <motion.path 
            d="M200,300 Q300,200 400,300 T600,400" 
            stroke="#5f43b2" 
            strokeWidth="2"
            strokeOpacity="0.3"
            fill="transparent"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 1 }}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.div 
            className="text-center px-10" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join as a Teacher</h2>
            <p className="text-[#b1aebb] text-lg md:text-xl max-w-md mx-auto">
              Create your account to access teaching materials, manage courses, and connect with your students.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}