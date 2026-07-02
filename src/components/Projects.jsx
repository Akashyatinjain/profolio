// src/components/Projects.jsx
import React, { useState } from 'react';
import { ExternalLink, HardDrive, CircleDollarSign, ShieldAlert, FileText, Layout, Play } from 'lucide-react';
import { Github } from './Icons';
import './Projects.css';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = [
    { label: 'All', id: 'all' },
    { label: 'Full-Stack', id: 'fullstack' },
    { label: 'Frontend', id: 'frontend' },
    { label: 'Games/Others', id: 'others' },
  ];

  const projectsData = [
    {
      title: 'DataStock',
      category: 'fullstack',
      date: 'March 2026',
      description: 'A cloud storage platform with secure Google OAuth/Email OTP authentication, file and folder management, starring, sharing, and storage analytics.',
      tech: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Cloudinary', 'JWT'],
      liveUrl: 'https://data-stock.vercel.app/',
      githubUrl: 'https://github.com/Akashyatinjain',
      icon: <HardDrive size={22} />,
    },
    {
      title: 'Finance Tracker',
      category: 'fullstack',
      date: 'Oct 2025',
      description: 'Full-stack personal finance tracker featuring budget automation, transaction reports, trend insights, email/SMS notifications, and security modules.',
      tech: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma'],
      liveUrl: 'https://budget-tracker-no3.vercel.app/',
      githubUrl: 'https://github.com/Akashyatinjain',
      icon: <CircleDollarSign size={22} />,
    },
    {
      title: 'SWASTHYA',
      category: 'frontend',
      date: 'Sept 2025',
      description: 'Ayurveda-based health platform calculating protein and wellness values through an interactive UI. Created in a 2-member team.',
      tech: ['JavaScript', 'React', 'Context API', 'CSS Grid'],
      liveUrl: 'https://sih-rho-liard.vercel.app/',
      githubUrl: 'https://github.com/Akashyatinjain',
      icon: <ShieldAlert size={22} />,
    },
    {
      title: 'Keeper Note',
      category: 'frontend',
      date: 'Aug 2025',
      description: 'Sticky note-taking application supporting full CRUD operations, dynamic state management, custom tags, search filters, and persistent local storage.',
      tech: ['JavaScript', 'React', 'HTML5', 'CSS Modules'],
      liveUrl: 'https://keeper-not-app.vercel.app/',
      githubUrl: 'https://github.com/Akashyatinjain',
      icon: <FileText size={22} />,
    },
    {
      title: 'UI Redesign - C++ Website',
      category: 'frontend',
      date: 'July 2025',
      description: 'Modern, highly responsive UI/UX redesign of a documentation site, improving accessibility, navigation tree-view, and mobile styling.',
      tech: ['HTML', 'CSS', 'Flexbox', 'Transitions'],
      liveUrl: 'https://akashyatinjain.github.io/Redesign-off-Cplus-plus-/video.html',
      githubUrl: 'https://github.com/Akashyatinjain',
      icon: <Layout size={22} />,
    },
    {
      title: 'Developer Portfolio',
      category: 'frontend',
      date: 'July 2026',
      description: 'A premium, highly interactive personal portfolio website showcasing software engineering capabilities, built using React, Vite, and custom CSS with smooth transitions and floating elements.',
      tech: ['React', 'Vite', 'Lucide React', 'CSS3', 'JavaScript'],
      liveUrl: 'https://akashyatinjain.github.io/',
      githubUrl: 'https://github.com/Akashyatinjain/profolio',
      icon: <Layout size={22} />,
    },
    {
      title: 'Simon Game',
      category: 'others',
      description: 'An interactive memory sequence game implementing sound cues, DOM event-listeners, record score-tracking, and dynamic CSS level animations.',
      tech: ['HTML', 'CSS', 'JavaScript', 'Audio API'],
      liveUrl: 'https://akashyatinjain.github.io/Simon-Game/',
      githubUrl: 'https://github.com/Akashyatinjain',
      icon: <Play size={22} />,
    },
  ];

  const filteredProjects = activeFilter === 'all'
    ? projectsData
    : projectsData.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="projects-section">
      <div className="glow-orb glow-orb-blue" style={{ bottom: '40%', right: '-150px' }}></div>
      <div className="container">
        <h2 className="section-title">My Projects</h2>
        <p className="section-subtitle">
          A showcase of full-stack systems, dynamic frontend layouts, and interactive games built with modern tech principles.
        </p>

        {/* Filter Bar */}
        <div className="filter-bar">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-btn ${activeFilter === cat.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project, idx) => (
            <div key={idx} className="glass-card project-card">
              <div className="project-card-header">
                <div className="project-icon-wrapper">
                  {project.icon}
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <span className="project-date" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{project.date}</span>
                  <span className="project-status">Live</span>
                </div>
              </div>

              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>

              <div className="project-tags">
                {project.tech.map((tag, tIdx) => (
                  <span key={tIdx} className="project-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="project-actions">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                  <span>Live Demo</span>
                  <ExternalLink size={14} />
                </a>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                  <span>Source Code</span>
                  <Github size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
