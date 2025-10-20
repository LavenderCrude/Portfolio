import React from 'react';
import { motion } from 'framer-motion';
import { experiences } from './data/ExperienceData';
import ExperienceCard from './ExperienceCard';

const ExperienceSection = () => {
  return (
    <section className="bg-[#0e0e0e] text-white py-20 px-6 md:px-20">
      {/* Animated Heading */}
      <div className="text-center pb-15">
        <motion.span
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl lg:text-5xl font-bold inline-block"
        >
          My{' '}
        </motion.span>

        <motion.span
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-4xl lg:text-6xl font-bold leading-tight inline-block"
          style={{
            WebkitTextStroke: '2px white',
            color: 'transparent',
            textStroke: '2px white',
          }}
        >
          Experiences
        </motion.span>
      </div>

      {/* Experience Cards */}
      <div className="space-y-8 max-w-4xl mx-auto mt-12">
        {experiences.map((exp, i) => (
          <ExperienceCard key={i} {...exp} />
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
