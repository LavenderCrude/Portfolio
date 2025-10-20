import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import MouseGlow from './components/MouseGlow';
import ExperienceSection from './components/ExperienceSection';
import ProjectsPage from './components/ProjectsPage';
import AboutMeSection from './components/AboutMeSection';
import LeetCodeDashboard from './components/LeetCodeDashboard';
import ContactSection from './components/ContactSection';
function App() {
  return (
    <div className="App min-h-screen">
      <MouseGlow />
      <Navbar />
      <Hero />
      <Skills />
      <ProjectsPage />
      <ExperienceSection />
      <AboutMeSection />
      <LeetCodeDashboard />
      <ContactSection />
    </div>
  );
}

export default App;
