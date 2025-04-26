"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get('/api/teacher/getTeacherDetails');
        setTeacher(res.data.user);
      } catch (error) {
        console.error("Failed to fetch teacher details:", error);
      }
    };

    if (status === "authenticated") {
      fetchTeacher();
    }
  }, [status]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <>
      {/* This empty div acts as a spacer with the same height as the navbar */}
      <div className="h-[72px]"></div>
      
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 border-b border-[#3a3153]/40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        {/* Navbar background */}
        <div className={`absolute inset-0 transition-all duration-300 ${
          isScrolled 
            ? "bg-[#010101]/95 backdrop-blur-md shadow-lg shadow-[#010101]/20" 
            : "bg-[#010101]"
        }`}></div>
        
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 relative">
          {/* Logo and Brand Name */}
          <Link href="/" className="flex items-center space-x-3 z-20">
            <img 
                src="/logo_transparent.png" 
                alt="Logo" 
                className="w-10 h-10"
              />
            <motion.span 
              className="text-xl font-bold text-[#fefdfd] tracking-tight"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              CampusFlow
            </motion.span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center">
            <div className="bg-[#3a3153]/30 rounded-full backdrop-blur-sm py-1 px-1.5 flex items-center">
              {navLinks.map((link, index) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`relative px-5 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                    pathname === link.href 
                      ? "text-[#fefdfd] bg-[#5f43b2] shadow-md shadow-[#5f43b2]/30" 
                      : "text-[#b1aebb] hover:text-[#fefdfd]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Profile and Logout - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-[#3a3153]/30 rounded-full px-3 py-1.5 flex items-center">
              <motion.div 
                className="w-7 h-7 rounded-full overflow-hidden bg-[#5f43b2]/20 flex items-center justify-center ring-2 ring-[#5f43b2]/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img 
                  src={teacher?.image || "/user-placeholder.png"} 
                  alt="User" 
                  className="object-cover w-full h-full" 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/user-placeholder.png";
                  }}
                />
              </motion.div>
              <span className="text-[#fefdfd] text-xs font-medium ml-2 mr-1">{teacher?.name || 'Teacher'}</span>
              {/* <ChevronDown className="w-3 h-3 text-[#b1aebb]" /> */}
            </div>
            
            <motion.button
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="group flex items-center gap-1.5 bg-[#5f43b2]/10 text-[#fefdfd] font-medium px-4 py-1.5 rounded-full border border-[#5f43b2]/20 hover:bg-[#5f43b2] transition-all duration-300 hover:cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="text-sm">Logout</span>
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center z-20 w-10 h-10 rounded-full hover:bg-[#5f43b2]/20 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-[#fefdfd]" />
            ) : (
              <Menu className="w-5 h-5 text-[#fefdfd]" />
            )}
          </button>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                className="fixed inset-0 z-10 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="absolute inset-0 bg-[#010101]/98 backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileMenuOpen(false)}
                />
                
                <motion.div
                  className="absolute top-[4.5rem] left-0 right-0 bg-[#3a3153]/20 backdrop-blur-lg border-y border-[#5f43b2]/10 p-5"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="flex flex-col space-y-3">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.href} 
                        href={link.href}
                        className={`px-4 py-3 rounded-lg transition-colors ${
                          pathname === link.href 
                            ? "bg-[#5f43b2]/20 text-[#fefdfd] border-l-2 border-[#5f43b2]" 
                            : "text-[#b1aebb] hover:bg-[#3a3153]/30 hover:text-[#fefdfd]"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    
                    <div className="border-t border-[#3a3153]/30 my-2 pt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <motion.div 
                            className="w-8 h-8 rounded-full overflow-hidden bg-[#5f43b2]/20 flex items-center justify-center ring-2 ring-[#5f43b2]/30"
                          >
                            <img 
                              src="/user-placeholder.png" 
                              alt="User" 
                              className="object-cover w-full h-full" 
                            />
                          </motion.div>
                          <span className="ml-3 text-sm text-[#fefdfd]">Student</span>
                        </div>
                        
                        <motion.button
                          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                          className="flex items-center gap-1.5 bg-[#5f43b2]/20 text-[#fefdfd] px-3 py-1.5 rounded-lg text-sm"
                          whileTap={{ scale: 0.97 }}
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Logout</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
