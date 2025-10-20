import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

import {
  DiReact,
  DiNodejsSmall,
  DiJavascript,
  DiCss3,
  DiPython,
  DiGit,
  DiBootstrap,
} from 'react-icons/di';
import {
  SiExpress,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiTailwindcss,
} from 'react-icons/si';

const skills = [
  { icon: DiReact, name: 'React', color: 'text-cyan-500' },
  { icon: DiNodejsSmall, name: 'Node.js', color: 'text-green-600' },
  { icon: SiExpress, name: 'Express', color: 'text-gray-700' },
  { icon: SiMongodb, name: 'MongoDB', color: 'text-green-600' },
  { icon: SiMysql, name: 'SQL', color: 'text-blue-700' }, // Replacement - works
  { icon: SiPostgresql, name: 'PostgreSQL', color: 'text-blue-600' },
  { icon: DiJavascript, name: 'JavaScript', color: 'text-yellow-400' },
  { icon: DiCss3, name: 'CSS', color: 'text-blue-400' },
  { icon: DiPython, name: 'Python', color: 'text-yellow-500' },
  // Extras if needed (Tailwind, Git)
  { icon: SiTailwindcss, name: 'Tailwind', color: 'text-cyan-500' },
  { icon: DiGit, name: 'Git', color: 'text-red-600' },
  { icon: DiBootstrap, name: 'BootStrap', color: 'text-blue-600' },
];

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="skills" ref={ref} className="min-h-screen py-20 px-8 bg-white">
      {/* Title */}
      <div className="text-center pb-15">
        <motion.span
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-4xl lg:text-5xl font-bold text-black text-center mb-12"
        >
          My
        </motion.span>
        <motion.span
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
          skills
        </motion.span>
      </div>

      {/* 3x4 Grid - 12 Cards (your 10 + 2 extras) */}
      <div className="grid grid-cols-4 gap-8 max-w-5xl mx-auto">
        {skills.map((skill, idx) => (
          <motion.div
            key={`${skill.name}-${idx}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            whileHover={{
              backgroundColor: 'black',
              color: 'white',
              scale: 1.05,
            }}
            className="group bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-black transition-all duration-300 cursor-pointer"
          >
            <skill.icon
              className={`w-16 h-16 mx-auto mb-4 ${skill.color} group-hover:text-white`}
            />
            <p className="text-lg font-semibold text-black group-hover:text-white transition-colors duration-300">
              {skill.name}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
