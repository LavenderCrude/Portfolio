import React, { useState } from 'react';
import { motion } from 'framer-motion';

// --- UTILITY COMPONENTS ---

const LinkIcon = () => (
  <svg
    className="w-6 h-6 text-white"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 10L21 3M21 3H16M21 3V8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SectionHeader = ({ title, firstWordOverride }) => {
  const [firstWord, secondWord] = title.split(' ');
  const displayFirstWord = firstWordOverride || firstWord;

  return (
    <div className="text-center mb-20 pt-16 text-white">
      {/* Animation for the first word */}
      <motion.span
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
        className="text-4xl lg:text-5xl font-bold inline-block"
      >
        {displayFirstWord}{' '}
      </motion.span>

      {/* Animation for the second word with text-stroke effect */}
      <motion.span
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className="text-4xl lg:text-6xl font-extrabold leading-tight inline-block"
        style={{
          WebkitTextStroke: '2px white',
          color: 'transparent',
          textStroke: '2px white',
        }}
      >
        {secondWord}
      </motion.span>
    </div>
  );
};

// Reusable Project Item component with fixed image size and object-fit: cover
const ProjectItem = ({ number, title, description, imageUrl, isReversed }) => {
  const layoutClass = isReversed ? 'md:flex-row-reverse' : 'md:flex-row';
  const viewOptions = { once: true, amount: 0.2 };
  const textInitialX = isReversed ? 100 : -100;

  return (
    <div
      className={`flex flex-col gap-8 md:gap-12 md:flex-row items-start ${layoutClass} py-8`}
    >
      {/* Project Details Section: Slides in from the side */}
      <motion.div
        initial={{ x: textInitialX, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={viewOptions}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex-1 pt-0 md:pt-2 order-2 md:order-none"
      >
        <p className="text-4xl md:text-5xl font-bold mb-4 text-white-400/80">
          {number}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-white">
          {title}
        </h2>
        <p className="text-lg text-gray-400 mb-8">{description}</p>
        <a
          href="#"
          className="inline-block p-2 rounded-full hover:bg-gray-800 transition duration-300"
          aria-label="View Project"
        >
          <LinkIcon />
        </a>
      </motion.div>

      {/* Project Image Section: Fixed size with object-fit: cover */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={viewOptions}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        className="flex-1 w-full md:max-w-xl h-64 md:h-80 shadow-2xl shadow-gray-900 overflow-hidden rounded-xl order-1 md:order-none"
      >
        <img
          src={
            imageUrl ||
            'https://placehold.co/800x600/171717/ffffff?text=Project+Placeholder'
          }
          alt={`Screenshot of ${title} project`}
          className="w-full h-full object-cover"
        />
      </motion.div>
    </div>
  );
};

// --- DATA ---
const allProjectsData = [
  {
    id: 1,
    number: '01',
    title: `LodgeLink - Make U'r Hotels Online`,
    description: `Developed a full-stack web application for listing and booking lodges. Implemented user authentication, cloud-based image uploads via
Cloudinary, and CRUD operations for lodge management.`,
    imageUrl:
      'https://res.cloudinary.com/dali1bmhm/image/upload/v1761033642/LodgeLink_s2iwp8.png',
    isReversed: false,
  },
  {
    id: 2,
    number: '02',
    title: 'Malware Analysis using Machine Learning',
    description: `Develop a malware detection model analysis the input string and predict the presence of malware in string, integrating results into a Jinja2
based web interface.`,
    imageUrl:
      'https://res.cloudinary.com/dali1bmhm/image/upload/v1761033641/Malware_uqn53v.png',
    isReversed: true,
  },
  {
    id: 3,
    number: '03',
    title: 'Health Care Assessment System',
    description: `Developed an AI-Powered medical Chatbot with multi-specialisation support, voice input, symptom
checker (Node.js) and expert consultation using Streamlit & Python.`,
    imageUrl: `https://res.cloudinary.com/dali1bmhm/image/upload/v1761033641/HealthCare_hxoppd.png`,
    isReversed: false,
  },
  {
    id: 4,
    number: '04',
    title: 'AI Chatbot Interface & API',
    description:
      'Development of a low-latency conversational AI interface, integrating multiple language models and providing a smooth, markdown-enabled user chat experience.',
    imageUrl:
      'https://res.cloudinary.com/dali1bmhm/image/upload/v1761033641/AiChatBot_iyrlod.png',
    isReversed: true,
  },

  {
    id: 5,
    number: '05',
    title: 'Fitness Tracker Backend API',
    description:
      'A robust and scalable Node.js/Express API designed to handle millions of user data points, including workout logs, personal bests, and social tracking features.',
    imageUrl: `https://res.cloudinary.com/dali1bmhm/image/upload/v1761033641/Fitness_boa6ha.png`,
    isReversed: false,
  },
];

// --- FEATURED PROJECTS PAGE (Original view, uses first 3 items) ---

const FeaturedProjects = ({ onViewMore }) => {
  const featuredProjects = allProjectsData.slice(0, 3); // Display only the first 3

  return (
    <>
      <SectionHeader title="My Projects" />
      <main className="space-y-16 md:space-y-24">
        {featuredProjects.map((project) => (
          <ProjectItem key={project.id} {...project} />
        ))}
      </main>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-16 md:mt-20"
      >
        <button
          onClick={onViewMore} // Triggers the page switch
          className="px-8 py-3 text-lg font-semibold text-white border-2 border-white rounded-full hover:bg-gray-800 transition-colors shadow-lg"
        >
          View More Projects
        </button>
      </motion.div>
    </>
  );
};

// --- ALL PROJECTS PAGE (The new full list view) ---

const AllProjects = ({ onGoBack }) => {
  return (
    <>
      <SectionHeader title="All Projects" />
      <div className="text-center mb-12">
        <button
          onClick={onGoBack} // Triggers the page switch back
          className="px-6 py-2 text-sm font-medium text-gray-400 border border-gray-700 rounded-full hover:bg-gray-800 transition-colors"
        >
          &larr; Back to Featured
        </button>
      </div>

      <main className="space-y-16 md:space-y-24">
        {allProjectsData.map((project) => (
          // Note: The viewport for these will trigger as the user scrolls the All Projects page
          <ProjectItem key={project.id} {...project} />
        ))}
      </main>
    </>
  );
};

// --- MAIN ROUTING COMPONENT ---

const PortfolioApp = () => {
  // Use state to manage which "page" is currently visible
  const [view, setView] = useState('featured'); // 'featured' or 'all'

  return (
    <section id="projects" className="bg-black text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        {view === 'featured' ? (
          <FeaturedProjects onViewMore={() => setView('all')} />
        ) : (
          <AllProjects onGoBack={() => setView('featured')} />
        )}
      </div>
    </section>
  );
};

export default PortfolioApp;
