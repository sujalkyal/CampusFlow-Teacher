"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, Mail, MapPin, Send, MessageSquare, 
  Clock, ArrowRight, Check, AlertCircle 
} from 'lucide-react';

// Theme colors matching the dashboard
const THEME = {
  primary: '#5f43b2',    // Studio purple
  secondary: '#3a3153',  // Mystique
  background: '#010101', // Black
  text: '#fefdfd',       // Soft Peach
  muted: '#b1aebb',      // Gray Powder
};

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission with delay
    setTimeout(() => {
      setFormStatus('success');
      setIsSubmitting(false);
      // Reset form after 3 seconds on success
      setTimeout(() => {
        setFormState({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setFormStatus(null);
      }, 3000);
    }, 2000);
  };

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: i => ({
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

  const contactMethods = [
    {
      title: 'Chat with Us',
      description: 'Get quick answers to your questions through our live chat support available during business hours. Our team is ready to assist you with any inquiries about courses, admissions, or technical issues.',
      icon: <MessageSquare className="h-6 w-6 text-[#5f43b2]" />,
      action: 'Start Chat',
      link: '#chat'
    },
    {
      title: 'Email Us',
      description: 'Send us an email with your questions or concerns. We typically respond within 24 hours on business days. For urgent matters, please indicate so in your subject line.',
      icon: <Mail className="h-6 w-6 text-[#5f43b2]" />,
      action: 'Send Email',
      link: 'mailto:sujalkyal@gmail.com'
    },
    {
      title: 'Call Us',
      description: 'Speak directly with our support team by phone between 8:00 AM and 6:00 PM, Monday through Friday. Our representatives can help resolve your issues quickly.',
      icon: <Phone className="h-6 w-6 text-[#5f43b2]" />,
      action: 'Call Now',
      link: 'tel:+917425906088'
    }
  ];

  const contactTabs = [
    { id: 'general', label: 'General Inquiry' },
    { id: 'support', label: 'Technical Support' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'feedback', label: 'Feedback' }
  ];

  const campusLocations = [
    {
      name: 'Main Campus',
      address: '188, Raja S.C. Mallick Road, Jadavpur, Kolkata – 700032, West Bengal, India',
      phone: '+91 33 2414 6666',
      email: 'registrar@admin.jdvu.ac.in',
      hours: 'Mon–Fri: 10:00 AM – 5:00 PM'
    },
    {
      name: 'Salt Lake Campus',
      address: 'Plot No.8, LB Block, Sector-III, Salt Lake City, Kolkata – 700106, West Bengal, India',
      phone: '+91 33 2335 5215',
      email: 'registrar@admin.jdvu.ac.in',
      hours: 'Mon–Fri: 10:00 AM – 5:00 PM'
    }
  ];

  return (
    <motion.div 
      className="min-h-screen text-[#fefdfd] overflow-hidden"
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
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#fefdfd] to-[#b1aebb]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            className="text-[#b1aebb] text-lg md:text-xl max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Have questions or need assistance? We're here to help you with all your educational needs.
          </motion.p>
        </motion.div>

        {/* Contact methods */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {contactMethods.map((method, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              className="bg-[#3a3153]/20 backdrop-blur-sm rounded-xl p-8 border border-[#5f43b2]/10 hover:border-[#5f43b2]/30 transition-all duration-300 flex flex-col h-full"
              whileHover={{ y: -5, backgroundColor: "rgba(58, 49, 83, 0.3)" }}
            >
              <div className="bg-[#010101]/30 p-4 rounded-full w-fit mb-5">
                {method.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4">{method.title}</h3>
              <p className="text-[#b1aebb] mb-8 flex-grow">{method.description}</p>
              <motion.a
                href={method.link}
                className="inline-flex items-center px-6 py-3 bg-[#5f43b2]/20 hover:bg-[#5f43b2] text-[#fefdfd] rounded-full text-sm font-medium transition-colors duration-300 w-fit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{method.action}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.a>
            </motion.div>
          ))}
        </motion.div>

        {/* Main contact section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact form */}
          <motion.div 
            className="lg:col-span-3"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-[#3a3153]/20 backdrop-blur-sm rounded-xl p-8 border border-[#5f43b2]/10">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Send className="mr-3 h-5 w-5 text-[#5f43b2]" />
                Contact Form
              </h2>

              {/* Form tabs */}
              <div className="flex flex-wrap gap-2 mb-8">
                {contactTabs.map(tab => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      activeTab === tab.id 
                        ? 'bg-[#5f43b2] text-white' 
                        : 'bg-[#3a3153]/30 text-[#b1aebb] hover:bg-[#3a3153]/50'
                    } transition-all duration-300`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              {/* Form */}
              <motion.form 
                onSubmit={handleSubmit}
                className="space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm text-[#b1aebb] mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#010101]/40 text-[#fefdfd] border border-[#5f43b2]/10 focus:border-[#5f43b2]/30 focus:outline-none focus:ring-1 focus:ring-[#5f43b2]/30"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm text-[#b1aebb] mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#010101]/40 text-[#fefdfd] border border-[#5f43b2]/10 focus:border-[#5f43b2]/30 focus:outline-none focus:ring-1 focus:ring-[#5f43b2]/30"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm text-[#b1aebb] mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#010101]/40 text-[#fefdfd] border border-[#5f43b2]/10 focus:border-[#5f43b2]/30 focus:outline-none focus:ring-1 focus:ring-[#5f43b2]/30"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm text-[#b1aebb] mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-[#010101]/40 text-[#fefdfd] border border-[#5f43b2]/10 focus:border-[#5f43b2]/30 focus:outline-none focus:ring-1 focus:ring-[#5f43b2]/30"
                    required
                  ></textarea>
                </div>

                {formStatus === 'success' && (
                  <motion.div
                    className="p-4 rounded-lg bg-green-500/20 text-green-300 flex items-center"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <Check className="h-5 w-5 mr-2" />
                    <span>Your message has been sent successfully!</span>
                  </motion.div>
                )}

                {formStatus === 'error' && (
                  <motion.div
                    className="p-4 rounded-lg bg-red-500/20 text-red-300 flex items-center"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>There was an error sending your message. Please try again.</span>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#5f43b2] hover:bg-[#5f43b2]/90 text-[#fefdfd] rounded-lg font-medium flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            </div>
          </motion.div>

          {/* Campus locations */}
          <motion.div 
            className="lg:col-span-2"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <div className="bg-[#3a3153]/20 backdrop-blur-sm rounded-xl p-8 border border-[#5f43b2]/10 h-full">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <MapPin className="mr-3 h-5 w-5 text-[#5f43b2]" />
                Campus Locations
              </h2>

              <div className="space-y-8">
                {campusLocations.map((location, i) => (
                  <motion.div 
                    key={i} 
                    className="border-l-2 border-[#5f43b2]/30 pl-5 space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.2 }}
                  >
                    <h3 className="font-semibold text-lg">{location.name}</h3>
                    <div className="space-y-3 text-[#b1aebb]">
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-[#5f43b2] mt-1 mr-3 flex-shrink-0" />
                        <span>{location.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-[#5f43b2] mr-3 flex-shrink-0" />
                        <span>{location.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-[#5f43b2] mr-3 flex-shrink-0" />
                        <span>{location.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-[#5f43b2] mr-3 flex-shrink-0" />
                        <span>{location.hours}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Map embed placeholder */}
              <motion.div 
                className="mt-8 rounded-lg overflow-hidden h-60 bg-[#010101]/40 border border-[#5f43b2]/10 flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-[#b1aebb] text-center p-4">
                  <MapPin className="h-8 w-8 mx-auto mb-3 text-[#5f43b2]" />
                  <p>Interactive campus map would be embedded here</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div 
          className="mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100px" }}
              transition={{ duration: 1 }}
              className="h-1 bg-gradient-to-r from-[#5f43b2] to-transparent mx-auto mb-6"
            />
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-[#b1aebb] mt-3 max-w-2xl mx-auto">
              Find quick answers to common questions about contacting us.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
            variants={containerVariants}
          >
            {[
              {
                q: "What are your support hours?",
                a: "Our support team is available Monday through Friday from 8:00 AM to 6:00 PM. For urgent matters, we offer limited support during weekends."
              },
              {
                q: "How quickly can I expect a response?",
                a: "We aim to respond to all inquiries within 24 hours during business days. For urgent technical support, our response time is typically under 4 hours."
              },
              {
                q: "Can I schedule a campus tour?",
                a: "Yes, you can schedule a campus tour by calling our admissions office directly. Tours are available on weekdays and select Saturdays."
              },
              {
                q: "Do you offer virtual meetings?",
                a: "Yes, we offer virtual meetings via Zoom or Microsoft Teams. Please indicate your preference for a virtual meeting when contacting us."
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-[#3a3153]/20 backdrop-blur-sm rounded-xl p-6 border border-[#5f43b2]/10"
                whileHover={{ y: -3, backgroundColor: "rgba(58, 49, 83, 0.3)" }}
              >
                <h3 className="text-lg font-semibold mb-3">{faq.q}</h3>
                <p className="text-[#b1aebb] text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Visit us section */}
        <motion.div 
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-[#3a3153]/50 to-[#5f43b2]/50 rounded-2xl p-10 backdrop-blur-sm border border-[#5f43b2]/20">
            <motion.div
              whileHover={{ y: -5 }}
              className="max-w-2xl mx-auto"
            >
              <MapPin className="h-10 w-10 mx-auto mb-4 text-[#5f43b2]" />
              <h2 className="text-3xl font-bold mb-4">Visit Our Campus</h2>
              <p className="text-[#b1aebb] mb-6">
              We invite you to experience Jadavpur University in person. Our main campus is in Jadavpur, 
              while the Salt Lake campus hosts other technology and engineering departments.
              </p>
              
              <motion.a
                href="https://maps.google.com/?q=jadavpur+university"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-[#5f43b2] hover:bg-[#5f43b2]/90 text-[#fefdfd] rounded-full font-medium transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View on Maps
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}