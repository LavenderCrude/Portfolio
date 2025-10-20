import React from 'react';
import { motion } from 'framer-motion';
// Icons from react-icons
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Hero = () => {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col lg:flex-row items-start lg:items-center justify-center px-8 mt-10 pt-10 pb-10 bg-white gap-4 font-quicksand"
    >
      <div>
        {/* Left Column: Text - Left-Aligned, Animate from Left */}
        <motion.div
          initial={{ x: -100, opacity: 0 }} // Start from left
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex-1 max-w-md lg:max-w-lg"
        >
          {/* Headings - Staggered Animation */}
          <motion.h2
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="text-4xl lg:text-5xl text-black my-4" // my-4 for equal top/bottom margin
          >
            Hello I'm
          </motion.h2>
          <motion.h1
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-4xl lg:text-6xl font-bold my-4 leading-tight" // my-4 for equal top/bottom margin
            style={{
              WebkitTextStroke: '2px black', // Outline thickness
              color: 'transparent', // Make fill transparent for outline effect
              textStroke: '2px black', // Fallback for non-Webkit
            }}
          >
            Akhil Kushwaha.
          </motion.h1>
          <motion.div className="my-4">
            {' '}
            {/* my-4 for equal top/bottom on the div */}
            <motion.span
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="text-4xl lg:text-5xl font-bold text-black" // No mb, as div handles margin
            >
              Full Stack &nbsp;
            </motion.span>
            <motion.span
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="text-4xl lg:text-5xl font-bold leading-tight"
              style={{
                WebkitTextStroke: '2px black', // Outline thickness
                color: 'transparent', // Make fill transparent for outline effect
                textStroke: '2px black', // Fallback for non-Webkit
              }}
            >
              Developer
            </motion.span>
          </motion.div>

          <motion.span
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="text-4xl lg:text-5xl text-black my-4" // my-4 for equal top/bottom margin
          >
            based in &nbsp;
          </motion.span>
          <motion.span
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="text-4xl lg:text-5xl font-bold text-black my-4" // my-4 for equal top/bottom margin
          >
            India.
          </motion.span>
          <motion.p
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="text-base lg:text-lg text-gray-600 my-6 leading-relaxed" // my-6 for equal top/bottom margin
          >
            Hi, I’m Akhil Kushwaha — a passionate developer who loves turning
            ideas into interactive, efficient, and visually appealing web
            experiences. I specialize in building full-stack applications using
            modern technologies like React, Node.js, and Express. Every project
            I build is an opportunity to learn, improve, and create something
            people genuinely enjoy using.
          </motion.p>

          {/* Social Icons - Bottom, Full-Width */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
            className="flex gap-4 mt-6" // mt-6 for top spacing
          >
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/akhilkushwahaa"
              className="w-12 h-12 bg-black rounded-md flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
            >
              <FaInstagram size={20} />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.x.com/akhilkushwahaa"
              className="w-12 h-12 bg-black rounded-md flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
            >
              <FaTwitter size={20} />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.linkedin.com/in/akhilkushwahaa"
              className="w-12 h-12 bg-black rounded-md flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
            >
              <FaLinkedin size={20} />
            </a>
          </motion.div>
        </motion.div>
      </div>
      <div>
        {/* Right Column: Illustration - Fade/Scale In */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
          className="flex-1 flex justify-end"
        >
          <img
            src="src/assets/manWithLaptop.png"
            alt="Akhil Kushwaha Illustration"
            className="w-full max-w-md h-auto"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
