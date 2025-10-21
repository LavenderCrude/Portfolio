import React, { useState } from 'react';
import { motion } from 'framer-motion';
// Icons from react-icons (as requested)
import { FaTwitter, FaMediumM, FaInstagram, FaLinkedin } from 'react-icons/fa';

// Social Icon Mapping (Using requested icons or closest match)
const socialIcons = {
  LinkedIn: {
    icon: FaLinkedin,
    href: 'https://www.linkedin.com/in/akhilkushwahaa',
  },
  Twitter: { icon: FaTwitter, href: 'https://www.x.com/akhilkushwahaa' },
  Instagram: {
    icon: FaInstagram,
    href: 'https://www.instagram.com/akhilkushwahaa',
  },
};

const ContactSection = () => {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    message: '',
  });

  // NEW: Loading & Status States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ UPDATED: Real MongoDB Submission (NO required attributes!)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Success: Reset form
        setFormData({ name: '', email: '', website: '', message: '' });
        setSubmitStatus('success');
        console.log('✅ Message saved to MongoDB:', result.data);
      } else {
        setSubmitStatus('error');
        // ALERT REMOVED - sirf red message dikhega
      }
    } catch (error) {
      console.error('❌ Submission error:', error);
      setSubmitStatus('error');
      // ALERT REMOVED - sirf red message dikhega
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation Variants
  const leftColumnVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.1 },
    },
  };

  const rightColumnVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.1 },
    },
  };

  return (
    <section
      className="bg-gray-50 dark:bg-[#f8f8f8] py-20 lg:py-28 font-sans"
      id="contact"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Side: Contact Form (Order 2 on mobile, 1 on desktop) */}
          <motion.div
            className="order-2 lg:order-1"
            variants={leftColumnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input Fields (Animated Staggered) - NO REQUIRED! */}
              {['name', 'email', 'website', 'message'].map((field, index) => {
                const placeholderText =
                  field === 'name'
                    ? 'Your name'
                    : field === 'email'
                    ? 'Email'
                    : field === 'website'
                    ? 'Your website (If exists)'
                    : 'How can I help?';

                return (
                  <motion.div key={field} variants={leftColumnVariants}>
                    {field === 'message' ? (
                      <textarea
                        name={field}
                        rows="6"
                        placeholder={placeholderText}
                        value={formData[field]}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black placeholder-gray-500 resize-none transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    ) : (
                      <input
                        type={
                          field === 'email'
                            ? 'email'
                            : field === 'website'
                            ? 'url'
                            : 'text'
                        }
                        name={field}
                        placeholder={placeholderText}
                        value={formData[field]}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black placeholder-gray-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    )}
                  </motion.div>
                );
              })}

              {/* Submit Button and Socials */}
              <motion.div
                className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-2"
                variants={leftColumnVariants}
              >
                {/* UPDATED Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-6 py-3 rounded-md font-medium transition duration-200 shadow-md ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-black hover:bg-gray-800 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
                >
                  {isSubmitting ? 'Sending...' : 'Get In Touch'}
                </button>

                {/* Social Icons */}
                <div className="flex space-x-3">
                  {Object.entries(socialIcons).map(([key, item]) => {
                    const Icon = item.icon;
                    const isFirst = key === Object.keys(socialIcons)[0];
                    const bgColor = isFirst
                      ? 'bg-black text-white border border-black'
                      : 'bg-white text-black border border-gray-300';
                    const hoverClass = isFirst
                      ? 'hover:bg-gray-800'
                      : 'hover:bg-gray-100';

                    return (
                      <a
                        key={key}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={key}
                        className={`w-10 h-10 flex items-center justify-center rounded-md transition duration-200 ${bgColor} ${hoverClass}`}
                      >
                        <Icon size={20} />
                      </a>
                    );
                  })}
                </div>
              </motion.div>

              {/* NEW: Success/Error Message */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-600 text-center font-medium"
                >
                  ✅ Message sent successfully!
                </motion.div>
              )}
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-center font-medium"
                >
                  ❌ Failed to send message. Please try again.
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Right Side: Contact Info and Heading (Order 1 on mobile, 2 on desktop) */}
          <motion.div
            className="order-1 lg:order-2 space-y-8 lg:space-y-12"
            variants={rightColumnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h2
              className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight"
              variants={rightColumnVariants}
            >
              <span className="bg-gray-300/60 px-1 rounded-sm">Let's talk</span>{' '}
              for
              <br />
              Something special
            </motion.h2>

            <div className="text-lg text-gray-700 max-w-md">
              <motion.p className="mb-6" variants={rightColumnVariants}>
                I seek to push the limits of creativity to create high-engaging,
                user-friendly, and memorable interactive experiences.
              </motion.p>

              <motion.div
                className="space-y-2 pt-4 text-xl font-semibold text-gray-900"
                variants={rightColumnVariants}
              >
                <p className="hover:text-black transition duration-150 cursor-pointer">
                  akhilkushwaha027@gmail.com
                </p>
                <p className="text-2xl font-bold">+91-7067285812</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;