"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function Signin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });
    
      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#010101]">
      {/* Left side with form */}
      <motion.div 
        className="w-full md:w-1/2 flex flex-col items-center justify-center p-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div 
            className="mb-12"
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
            <h1 className="text-3xl font-semibold text-[#fefdfd] mb-3">Teacher Portal</h1>
            <p className="text-[#b1aebb] mb-8">Sign in to your faculty account to continue</p>

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
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5f43b2] w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email address"
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

              <div className="flex justify-between items-center">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="form-checkbox h-4 w-4 text-[#5f43b2] rounded border-[#5f43b2]/30 focus:ring-0 focus:ring-offset-0 bg-[#3a3153]/30 hover:cursor-pointer"
                  />
                  <span className="text-sm text-[#b1aebb] ml-2">Remember me</span>
                </label>
                <Link href="#" onClick={(e)=>{e.preventDefault()}} className="text-sm text-[#5f43b2] hover:text-[#5f43b2]/80 transition-colors">
                  Forgot password?
                </Link>
              </div>

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
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center text-[#b1aebb] text-sm">
              Don't have an account? <Link href="/auth/signup" className="text-[#5f43b2] hover:text-[#5f43b2]/80 transition-colors">Sign Up</Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side with abstract image */}
      <motion.div 
        className="hidden md:block md:w-1/2 bg-gradient-to-br from-[#3a3153] to-[#010101] relative overflow-hidden"
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Faculty Portal</h2>
            <p className="text-[#b1aebb] text-lg md:text-xl max-w-md mx-auto">
              Access your teaching materials, manage student assignments and grades through our integrated platform.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}