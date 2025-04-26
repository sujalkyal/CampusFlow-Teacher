"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, BookOpen, ArrowRight, MapPin, Phone, Github, Twitter, Linkedin } from 'lucide-react';

// Theme colors matching the dashboard
const THEME = {
  primary: '#5f43b2',    // Studio purple
  secondary: '#3a3153',  // Mystique
  background: '#010101', // Black
  text: '#fefdfd',       // Soft Peach
  muted: '#b1aebb',      // Gray Powder
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerAnimation = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.8
      }
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <footer className="w-full bg-black border-t border-[#5f43b2]/5">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#5f43b2]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5f43b2]/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Main Content */}
      <motion.div 
        className="container mx-auto px-6 pt-16 pb-12"
        variants={footerAnimation}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* College Management Info */}
          <motion.div variants={itemAnimation} className="flex flex-col">
            <Link href="/dashboard" className="flex items-center mb-6 group">
              <img 
                src="/logo_transparent.png" 
                alt="Logo" 
                className="w-20 h-20"
              />
              <span className="text-xl font-bold text-[#fefdfd]">CampusFlow</span>
            </Link>
            
            <p className="mb-6 text-sm text-[#b1aebb] leading-relaxed">
              A modern platform designed to streamline educational processes for students, faculty, and administrators with powerful tools.
            </p>
            
            <div className="flex space-x-4">
              {/* Social Icons */}
              <motion.a
                href="https://github.com/sujalkyal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-[#3a3153]/30 hover:bg-[#5f43b2]/10 transition-colors"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-4 h-4 text-[#fefdfd]" />
              </motion.a>
              
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-[#3a3153]/30 hover:bg-[#5f43b2]/10 transition-colors"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter className="w-4 h-4 text-[#fefdfd]" />
              </motion.a>
              
              <motion.a
                href="http://linkedin.com/in/sujal-kyal-712b9024b"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-[#3a3153]/30 hover:bg-[#5f43b2]/10 transition-colors"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="w-4 h-4 text-[#fefdfd]" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemAnimation}>
            <h3 className="text-lg font-semibold mb-6 text-[#fefdfd] relative pl-3">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-[#5f43b2]/80"></span>
              Quick Links
            </h3>
            
            <div className="flex flex-col space-y-4">
              {[
                { text: 'Dashboard', href: '/dashboard' },
                { text: 'About Us', href: '/about' },
                { text: 'Courses', href: '#' },
                { text: 'Assignments', href: '#' },
                { text: 'Contact', href: '/contact' }
              ].map((link, i) => (
                <Link 
                  key={i} 
                  href={link.href}
                  className="text-sm text-[#b1aebb] hover:text-[#5f43b2] transition-colors flex items-center group"
                >
                  <span className="w-0 h-[1px] bg-[#5f43b2]/80 group-hover:w-3 transition-all mr-0 group-hover:mr-2"></span>
                  {link.text}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemAnimation}>
            <h3 className="text-lg font-semibold mb-6 text-[#fefdfd] relative pl-3">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-[#5f43b2]/80"></span>
              Resources
            </h3>
            
            <div className="flex flex-col space-y-4">
              {[
                { text: 'Help Center', href: '#' },
                { text: 'FAQ', href: '#' },
                { text: 'Privacy Policy', href: '#' },
                { text: 'Terms of Service', href: '#' },
                { text: 'Support', href: '/contact' }
              ].map((link, i) => (
                <Link 
                  key={i} 
                  href={link.href}
                  className="text-sm text-[#b1aebb] hover:text-[#5f43b2] transition-colors flex items-center group"
                >
                  <span className="w-0 h-[1px] bg-[#5f43b2]/80 group-hover:w-3 transition-all mr-0 group-hover:mr-2"></span>
                  {link.text}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemAnimation}>
            <h3 className="text-lg font-semibold mb-6 text-[#fefdfd] relative pl-3">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-[#5f43b2]/80"></span>
              Stay Updated
            </h3>
            
            <p className="mb-4 text-sm text-[#b1aebb]">
              Get the latest updates about courses and academic events.
            </p>
            
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-3 pl-10 rounded-lg text-sm w-full bg-[#3a3153]/20 text-[#fefdfd] border border-[#5f43b2]/10 focus:border-[#5f43b2]/30 focus:outline-none focus:ring-1 focus:ring-[#5f43b2]/30"
                />
                <Mail className="w-4 h-4 text-[#5f43b2] absolute left-3 top-3.5" />
              </div>
              
              <motion.button
                type="submit"
                className="w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-[#5f43b2] hover:bg-[#5f43b2]/90 text-[#fefdfd] flex items-center justify-center hover:cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Subscribe</span>
                <ArrowRight className="ml-2 w-3.5 h-3.5" />
              </motion.button>
            </form>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#5f43b2] mt-0.5" />
                <span className="text-xs text-[#b1aebb]">
                  123 Education Street, Academic District, 10001
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#5f43b2]" />
                <span className="text-xs text-[#b1aebb]">
                  +1 (555) 123-4567
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="border-t border-[#5f43b2]/5">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-[#b1aebb]">
            &copy; {currentYear} College Management. All rights reserved.
          </p>
          
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link href="/privacy" className="text-xs text-[#b1aebb] hover:text-[#5f43b2] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-[#b1aebb] hover:text-[#5f43b2] transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="text-xs text-[#b1aebb] hover:text-[#5f43b2] transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
