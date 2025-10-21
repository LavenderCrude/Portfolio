import React from 'react';
import { motion } from 'framer-motion';

// Note: In a production environment, you would import SectionHeader.
const SectionHeader = ({ title }) => {
  const [firstWord, secondWord] = title.split(' ');

  return (
    <div className="text-center mb-16 pt-16 text-black">
      {/* Animation for the first word */}
      <motion.span
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
        className="text-4xl lg:text-5xl font-bold inline-block"
      >
        {firstWord}{' '}
      </motion.span>

      {/* Animation for the second word with text-stroke effect */}
      <motion.span
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className="text-4xl lg:text-6xl font-extrabold leading-tight inline-block"
        style={{
          WebkitTextStroke: '2px black',
          color: 'transparent',
          textStroke: '2px black',
        }}
      >
        {secondWord}
      </motion.span>
    </div>
  );
};

const AboutMeSection = () => {
  return (
    // Background set to a light color (bg-gray-50) and text to black
    <section id="about" className="bg-white text-black py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Title for the section */}
        <SectionHeader title="About Me" />

        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center justify-between">
          {/* Left Column: Illustration/Image (BORDER REMOVED) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            // Container styling remains minimal
            className="flex-shrink-0 w-full md:w-1/3 lg:w-96"
          >
            <img
              // Using a placeholder that resembles the black & white style
              src="https://res.cloudinary.com/dali1bmhm/image/upload/v1761033641/About_ntmgty.png"
              alt="Professional Developer Illustration"
              // Removed border-4 border-black
              className="w-full h-auto"
            />
          </motion.div>

          {/* Right Column: Text Content */}
          <div className="flex-1">
            <motion.p
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-base text-gray-800 mb-6 leading-relaxed text-justify"
            >
              I’m Akhil Kushwaha, a passionate full-stack developer who enjoys
              turning ideas into sleek, functional, and meaningful digital
              experiences. My focus is on React.js and Node.js, where I get to
              merge design with logic — creating interfaces that not only look
              great but feel intuitive to use.
            </motion.p>

            <motion.p
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-base text-gray-800 mb-6 leading-relaxed text-justify"
            >
              I started my journey in 2024, driven by curiosity and a love for
              solving problems through technology. Since then, I’ve been
              continuously learning and experimenting with tools like Express,
              MongoDB, and Tailwind CSS to build scalable and responsive web
              applications. I’m deeply interested in how design decisions impact
              usability, and I strive to write code that’s clean, maintainable,
              and efficient.
            </motion.p>

            <motion.p
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-base text-gray-800 leading-relaxed text-justify"
            >
              For me, web development isn’t just about building websites — it’s
              about crafting experiences that connect people with technology in
              simple, effective ways. Each project I take on is a chance to
              refine my skills and bring new ideas to life. When I’m not writing
              code, you’ll usually find me on LinkedIn, exploring what other
              developers are building, sharing my own work, and staying up to
              date with the latest trends in tech and design.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMeSection;
