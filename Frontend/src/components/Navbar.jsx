import React from 'react';
import { motion } from 'framer-motion';
import { FaDownload } from 'react-icons/fa';

const Navbar = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Skills', id: 'skills' },
    { label: 'Project', id: 'projects' },
    { label: 'About Me', id: 'about' },
    { label: 'Contact Me', id: 'contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 w-full bg-white px-8 py-4  flex items-center justify-between font-quicksand text-black z-1"
    >
      {/* Left: Round "P" Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="w-10 h-10 bg-black rounded-full flex items-center justify-center cursor-pointer hover:opacity-80"
        onClick={() => scrollToSection('hero')}
      >
        <span className="text-white text-xl font-bold">a</span>
      </motion.div>

      {/* Center: Nav Links */}
      <ul className="flex list-none gap-8 mx-auto">
        {navLinks.map((link) => (
          <li key={link.label}>
            <motion.button
              whileHover={{ y: -1 }}
              onClick={() => scrollToSection(link.id)}
              className="group bg-transparent border-none text-black text-2xl font-semibold cursor-pointer py-1 px-2 hover:text-gray-700 hover:font-bold transition-all duration-200 relative"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
            </motion.button>
          </li>
        ))}
      </ul>

      {/* Right: Rectangular Resume Button */}
      <motion.a
        whileHover={{ scale: 1.02 }}
        href="https://drive.google.com/file/d/1b1EaQlESnJnWdJtdZqiJM6VaHC8SE2v4/view?usp=drivesdk"
        download
        className="flex items-center gap-2 bg-black text-white px-6 py-3 text-xl font-bold cursor-pointer whitespace-nowrap hover:bg-gray-800 transition-all duration-200 rounded-md shadow-sm"
      >
        Resume
        <FaDownload size={16} />
      </motion.a>
    </motion.nav>
  );
};

export default Navbar;
