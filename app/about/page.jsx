"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, Bookmark, Users, Book, Award, ChevronDown, ChevronUp, Github, Linkedin, ExternalLink } from "lucide-react";
import Link from "next/link";

// Theme colors matching the dashboard
const THEME = {
  primary: '#5f43b2',    // Studio purple
  secondary: '#3a3153',  // Mystique
  background: '#010101', // Black
  text: '#fefdfd',       // Soft Peach
  muted: '#b1aebb',      // Gray Powder
};

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    })
  };
  
  const teamMembers = [
    {
      name: "Student Developer",
      role: "Lead Developer",
      image: "/placeholder-profile.png",
      links: {
        github: "https://github.com/sujalkyal/college_management_app",
        linkedin: "http://linkedin.com/in/sujal-kyal-712b9024b",
      },
      bio: "Student Developer with expertise in Next.js, React and modern web technologies for educational platforms."
    },
    {
      name: "College Management Team",
      role: "Project Managers",
      image: "/placeholder-team.png", 
      bio: "Dedicated team working on streamlining educational processes and improving the student experience."
    }
  ];

  const features = [
    {
      title: "Digital Attendance",
      description: "Effortlessly track attendance with our digital system that provides real-time updates and analytics.",
      icon: <Users className="h-6 w-6 text-[#5f43b2]" />
    },
    {
      title: "Course Management",
      description: "Easily access all course materials, assignments and schedules in one centralized location.",
      icon: <Book className="h-6 w-6 text-[#5f43b2]" />
    },
    {
      title: "Assignment Submission",
      description: "Submit assignments digitally and receive feedback from instructors with our streamlined workflow.",
      icon: <Bookmark className="h-6 w-6 text-[#5f43b2]" />
    },
    {
      title: "Performance Analytics",
      description: "Track academic progress with detailed analytics and personalized insights.",
      icon: <Award className="h-6 w-6 text-[#5f43b2]" />
    }
  ];

  const faqs = [
    {
      question: "What is College Management System?",
      answer: "College Management is a comprehensive platform designed to streamline educational processes for students and faculty. It provides tools for attendance tracking, assignment submission, course management, and performance analytics."
    },
    {
      question: "How do I access my courses?",
      answer: "Log in with your college credentials and navigate to the Dashboard. All your enrolled courses will be displayed there, and you can click on any course to access its materials, assignments, and attendance records."
    },
    {
      question: "Can I submit assignments through the platform?",
      answer: "Yes, you can submit assignments digitally through the platform. Navigate to the specific course, find the assignment section, and follow the submission guidelines. You'll receive notifications when your assignments are graded."
    },
    {
      question: "How is attendance tracked?",
      answer: "Instructors take attendance digitally during each session. You can view your attendance record for each course on your dashboard, including present days, absences, and late arrivals."
    }
  ];

  return (
    <motion.div 
      className="min-h-screen text-[#fefdfd]"
      style={{
        background: THEME.background,
        backgroundImage: "radial-gradient(circle at 50% 0%, #3a3153 0%, #010101 70%)",
        backgroundAttachment: "fixed"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Decorative background elements */}
      <div className="fixed top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-[#5f43b2]/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, 50, 0], 
            opacity: [0.5, 0.8, 0.5] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-96 h-96 bg-[#3a3153]/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, -30, 0], 
            y: [0, -50, 0], 
            opacity: [0.5, 0.7, 0.5] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-24"
        >
          {/* Hero Section */}
          <motion.section
            variants={itemVariants}
            className="flex flex-col items-center text-center pt-16 pb-20"
            id="overview"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
              className="h-30 w-30 rounded-3xl bg-transparent flex items-center justify-center mb-8"
            >
              <motion.div 
                animate={{ 
                  rotateY: [0, 360],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <img 
                src="/logo_transparent.png" 
                alt="Logo" 
                className="w-30 h-30"
              />
              </motion.div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#fefdfd] to-[#b1aebb]">
              Transforming Education Management
            </h1>
            
            <motion.p 
              className="text-[#b1aebb] text-lg md:text-xl max-w-3xl mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              A modern platform designed to streamline the educational experience for students, faculty, and administrators with powerful digital tools and analytics.
            </motion.p>
            
            <motion.div
              className="flex flex-col md:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link href="/dashboard"
                className="bg-[#5f43b2] hover:bg-[#5f43b2]/80 px-6 py-3 rounded-full flex items-center justify-center transition-all duration-300"
              >
                <span>Get Started</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              
              <Link href="#features"
                className="bg-[#3a3153]/50 hover:bg-[#3a3153] px-6 py-3 rounded-full flex items-center justify-center transition-all duration-300 border border-[#5f43b2]/20"
              >
                <span>Learn More</span>
              </Link>
            </motion.div>
          </motion.section>
          
          {/* Features Section */}
          <motion.section 
            variants={itemVariants}
            className="py-16"
            id="features"
          >
            <div className="text-center mb-16">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100px" }}
                transition={{ duration: 1 }}
                className="h-1 bg-gradient-to-r from-[#5f43b2] to-transparent mx-auto mb-6"
              />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Powerful Features</h2>
              <p className="text-[#b1aebb] max-w-2xl mx-auto">
                Our comprehensive suite of tools helps educational institutions streamline operations and enhance the learning experience.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="bg-[#3a3153]/20 backdrop-blur-sm rounded-xl p-6 border border-[#5f43b2]/10 hover:border-[#5f43b2]/30 transition-all duration-300"
                  whileHover={{ y: -5, backgroundColor: "rgba(58, 49, 83, 0.3)" }}
                >
                  <div className="bg-[#010101]/30 p-3 rounded-lg w-fit mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-[#b1aebb]">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
          
          {/* Team Section */}
          <motion.section 
            variants={itemVariants}
            className="py-16"
            id="team"
          >
            <div className="text-center mb-16">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100px" }}
                transition={{ duration: 1 }}
                className="h-1 bg-gradient-to-r from-[#5f43b2] to-transparent mx-auto mb-6"
              />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Meet the Team</h2>
              <p className="text-[#b1aebb] max-w-2xl mx-auto">
                The passionate individuals behind College Management dedicated to improving educational technology.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              {teamMembers.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-[#3a3153]/20 backdrop-blur-sm rounded-xl p-6 border border-[#5f43b2]/10 flex flex-col items-center text-center"
                  whileHover={{ y: -5, backgroundColor: "rgba(58, 49, 83, 0.3)" }}
                >
                  <motion.div 
                    className="w-24 h-24 rounded-full bg-[#5f43b2]/20 mb-5 overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src="/user-placeholder.png"
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-[#5f43b2] text-sm mb-3">{member.role}</p>
                  <p className="text-[#b1aebb] mb-4 text-sm">{member.bio}</p>
                  
                  {member.links && (
                    <div className="flex gap-4 mt-2">
                      {member.links.github && (
                        <a href={member.links.github} target="_blank" rel="noopener noreferrer" 
                          className="text-[#b1aebb] hover:text-[#5f43b2] transition-colors">
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                      {member.links.linkedin && (
                        <a href={member.links.linkedin} target="_blank" rel="noopener noreferrer"
                          className="text-[#b1aebb] hover:text-[#5f43b2] transition-colors">
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
          
          {/* FAQ Section */}
          <motion.section 
            variants={itemVariants}
            className="py-16"
            id="faq"
          >
            <div className="text-center mb-16">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100px" }}
                transition={{ duration: 1 }}
                className="h-1 bg-gradient-to-r from-[#5f43b2] to-transparent mx-auto mb-6"
              />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
              <p className="text-[#b1aebb] max-w-2xl mx-auto">
                Find answers to common questions about our platform and how it can benefit your educational journey.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="mb-4"
                >
                  <motion.button
                    className={`w-full text-left p-5 rounded-lg flex justify-between items-center ${
                      expandedFaq === i 
                        ? "bg-[#5f43b2]/20 border-[#5f43b2]/30" 
                        : "bg-[#3a3153]/20 hover:bg-[#3a3153]/30"
                    } border border-[#5f43b2]/10 transition-all duration-300`}
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    whileHover={{ y: -2 }}
                  >
                    <span className="font-medium">{faq.question}</span>
                    {expandedFaq === i ? (
                      <ChevronUp className="h-5 w-5 text-[#5f43b2]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-[#5f43b2]" />
                    )}
                  </motion.button>
                  
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: expandedFaq === i ? "auto" : 0,
                      opacity: expandedFaq === i ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 text-[#b1aebb] bg-[#010101]/30 rounded-b-lg border-x border-b border-[#5f43b2]/10">
                      {faq.answer}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.section>
          
          {/* CTA Section */}
          <motion.section
            variants={itemVariants}
            className="py-16"
          >
            <motion.div
              className="bg-gradient-to-r from-[#3a3153]/50 to-[#5f43b2]/50 rounded-2xl p-10 text-center backdrop-blur-sm border border-[#5f43b2]/20"
              whileHover={{ y: -5 }}
            >
              <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Educational Experience?</h2>
              <p className="text-[#b1aebb] max-w-2xl mx-auto mb-8">
                Join thousands of students and educators who are already benefiting from our comprehensive college management platform.
              </p>
              
              <motion.div
                className="inline-flex"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/dashboard"
                  className="bg-[#5f43b2] hover:bg-[#5f43b2]/80 px-8 py-4 rounded-full flex items-center justify-center transition-all duration-300 text-lg shadow-lg shadow-[#5f43b2]/20"
                >
                  <span>Access Dashboard</span>
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.section>
        </motion.div>
      </div>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(177, 174, 187, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(95, 67, 178, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(95, 67, 178, 0.8);
        }
      `}</style>
    </motion.div>
  );
}