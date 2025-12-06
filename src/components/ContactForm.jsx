import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import contactBg from "../assets/contact1.webp";

// You can replace this with your own image path
const bgImg = contactBg;

const ContactForm = () => {
  // Refs for elements that need entrance animations
  const titleRef = useRef(null);
  const contactInfoRef = useRef(null);
  const mapRef = useRef(null);
  const socialRef = useRef(null);
  const formRef = useRef(null);

  // Form state and validation
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe all elements
    [titleRef.current, contactInfoRef.current, mapRef.current, socialRef.current, formRef.current].forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Form validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.phone.trim() && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Use relative path in production, localhost in development
      const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
      
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setErrors({});
        console.log('Contact form submitted successfully:', result);
      } else {
        console.error('Form submission error:', result.error || 'Unknown error');
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-primary/90 relative overflow-hidden" id="contact">
      {/* Background image with low opacity */}
      <img
        src={bgImg}
        alt="Contact background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 z-0 pointer-events-none select-none"
        style={{ objectPosition: 'center' }}
      />
      {/* Semi-transparent dark overlay */}
      <div className="absolute inset-0 bg-black/70 z-10 pointer-events-none" />
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 flex flex-col md:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20">
        {/* Left: Contact Info & Map */}
        <div className="flex-1 flex flex-col justify-between md:pr-4 lg:pr-6 xl:pr-8 2xl:pr-12">
          <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <div 
              ref={titleRef}
              className="flex items-center justify-start gap-1 mb-8 sm:mb-10 md:mb-12 lg:mb-16 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
            >
            <FaCircle className="text-accent text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
            <FaCircle className="text-accent2 text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
            <FaCircle className="text-accent3 text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
              <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mx-2 sm:mx-4 text-white tracking-tight">
                Let's get in touch</h2>
            <FaCircle className="text-accent3 text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
            <FaCircle className="text-accent2 text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
            <FaCircle className="text-accent text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
            </div>
            <div 
              ref={contactInfoRef}
              className="opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-200"
            >
              <div className="flex items-start gap-3 mb-4 text-white/90">
                <FaMapMarkerAlt className="mt-1 text-accent text-sm sm:text-base md:text-base lg:text-lg xl:text-xl 2xl:text-2xl" />
                <span className="text-sm sm:text-base md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">Islamabad, Pakistan</span>
              </div>
              {/* <div className="flex items-center gap-3 mb-4 text-white/90">
                <FaPhoneAlt className="text-accent text-sm sm:text-base md:text-base lg:text-lg xl:text-xl 2xl:text-2xl" />
                <span className="text-sm sm:text-base md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">+1 234 567 890</span>
              </div> */}
              <div className="flex items-center gap-3 mb-4 text-white/90">
                <FaEnvelope className="text-accent text-sm sm:text-base md:text-base lg:text-lg xl:text-xl 2xl:text-2xl" />
                <span className="text-sm sm:text-base md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">info@conbyt.com</span>
              </div>
            </div>
          </div>
          <div 
            ref={mapRef}
            className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-400"
          >
            <h3 className="text-white text-base sm:text-lg md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold mb-4 border-b border-white/20 pb-2">Find Us</h3>
            <div className="rounded-lg overflow-hidden border border-white/10">
              <iframe
                title="Google Map - Islamabad, Pakistan"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.5!2d73.0479!3d33.6844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbfd07891722f%3A0x605d5b473df9643b!2sIslamabad%2C%20Pakistan!5e0!3m2!1sen!2s!4v1703123456789!5m2!1sen!2s"
                width="100%"
                height="160"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          <div 
            ref={socialRef}
            className="opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-600"
          >
            <h3 className="text-white text-base sm:text-lg md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold mb-4 border-b border-white/20 pb-2">Follow Us</h3>
            <div className="flex gap-3 sm:gap-4">
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 flex items-center justify-center rounded bg-surface text-white hover:bg-accent transition"><FaFacebookF className="text-sm sm:text-base md:text-base lg:text-lg xl:text-xl 2xl:text-2xl" /></a>
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 flex items-center justify-center rounded bg-surface text-white hover:bg-accent2 transition"><FaTwitter className="text-sm sm:text-base md:text-base lg:text-lg xl:text-xl 2xl:text-2xl" /></a>
              <a href="https://www.linkedin.com/company/conbyt" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 flex items-center justify-center rounded bg-surface text-white hover:bg-accent3 transition"><FaLinkedinIn className="text-sm sm:text-base md:text-base lg:text-lg xl:text-xl 2xl:text-2xl" /></a>
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 flex items-center justify-center rounded bg-surface text-white hover:bg-accent transition"><FaInstagram className="text-sm sm:text-base md:text-base lg:text-lg xl:text-xl 2xl:text-2xl" /></a>
            </div>
          </div>
        </div>
        {/* Right: Contact Form Card */}
        <div className="flex-1 flex items-center justify-center md:pl-4 lg:pl-6 xl:pl-8 2xl:pl-12">
                                <div 
             ref={formRef}
             className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl bg-surface rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-800"
           >
             <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold mb-2 text-center">Send us a message</h2>
             <p className="text-white/70 text-xs sm:text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-center mb-6 sm:mb-8">Ready to transform your business with AI? Let's discuss your project.</p>
             
             {submitStatus === 'success' && (
               <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                 <p className="text-green-300 text-sm font-medium">
                   ✅ Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
                 </p>
               </div>
             )}

             {submitStatus === 'error' && (
               <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                 <p className="text-red-300 text-sm font-medium">
                   ❌ Sorry, there was an error sending your message. Please try again.
                 </p>
               </div>
             )}

             <form 
               onSubmit={handleSubmit}
               className="flex flex-col gap-4 sm:gap-5"
             >
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                 <div className="flex flex-col">
                   <label htmlFor="name" className="text-white font-medium mb-2 text-sm sm:text-base">
                     Name *
                   </label>
                   <input 
                     type="text" 
                     id="name"
                     name="name"
                     value={formData.name}
                     onChange={handleInputChange}
                     placeholder="Your name" 
                     className={`rounded-lg bg-primary/80 border px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base transition-all ${
                       errors.name 
                         ? 'border-red-500 focus:border-red-500' 
                         : 'border-white/20 focus:border-accent'
                     }`}
                   />
                   {errors.name && (
                     <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                   )}
                 </div>
                 <div className="flex flex-col">
                   <label htmlFor="email" className="text-white font-medium mb-2 text-sm sm:text-base">
                     Email *
                   </label>
                   <input 
                     type="email" 
                     id="email"
                     name="email"
                     value={formData.email}
                     onChange={handleInputChange}
                     placeholder="your@email.com" 
                     className={`rounded-lg bg-primary/80 border px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base transition-all ${
                       errors.email 
                         ? 'border-red-500 focus:border-red-500' 
                         : 'border-white/20 focus:border-accent'
                     }`}
                   />
                   {errors.email && (
                     <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                   )}
                 </div>
               </div>
               <div className="flex flex-col">
                 <label htmlFor="phone" className="text-white font-medium mb-2 text-sm sm:text-base">
                   Phone Number
                 </label>
                 <input 
                   type="tel" 
                   id="phone"
                   name="phone"
                   value={formData.phone}
                   onChange={handleInputChange}
                   placeholder="Your Phone Number" 
                   className={`rounded-lg bg-primary/80 border px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base transition-all ${
                     errors.phone 
                       ? 'border-red-500 focus:border-red-500' 
                       : 'border-white/20 focus:border-accent'
                   }`}
                 />
                 {errors.phone && (
                   <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                 )}
               </div>
               <div className="flex flex-col">
                 <label htmlFor="subject" className="text-white font-medium mb-2 text-sm sm:text-base">
                   Subject *
                 </label>
                 <input 
                   type="text" 
                   id="subject"
                   name="subject"
                   value={formData.subject}
                   onChange={handleInputChange}
                   placeholder="How can we help?" 
                   className={`rounded-lg bg-primary/80 border px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base transition-all ${
                     errors.subject 
                       ? 'border-red-500 focus:border-red-500' 
                       : 'border-white/20 focus:border-accent'
                   }`}
                 />
                 {errors.subject && (
                   <p className="text-red-400 text-xs mt-1">{errors.subject}</p>
                 )}
               </div>
               <div className="flex flex-col">
                 <label htmlFor="message" className="text-white font-medium mb-2 text-sm sm:text-base">
                   Message *
                 </label>
                 <textarea 
                   id="message"
                   name="message"
                   value={formData.message}
                   onChange={handleInputChange}
                   placeholder="Tell us about your project..." 
                   rows={4} 
                   className={`rounded-lg bg-primary/80 border px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent resize-none text-sm sm:text-base transition-all ${
                     errors.message 
                       ? 'border-red-500 focus:border-red-500' 
                       : 'border-white/20 focus:border-accent'
                   }`}
                 />
                 {errors.message && (
                   <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                 )}
               </div>
               <button 
                 type="submit" 
                 disabled={isSubmitting}
                 className="mt-4 bg-gradient-to-r from-accent to-accent2 hover:from-accent2 hover:to-accent text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:scale-105 transition-all duration-300 text-sm sm:text-base w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
               >
                 {isSubmitting ? (
                   <span className="flex items-center justify-center">
                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Sending Message...
                   </span>
                 ) : (
                   "Send Message"
                 )}
               </button>
             </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </section>
  );
};

export default ContactForm;
